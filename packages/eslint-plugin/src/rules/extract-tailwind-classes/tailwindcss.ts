import path from 'path';
import { TOptions } from './types';
import objectHash from 'object-hash';
import {
  createContext as createTailwindContext,
  TTailwindContext,
} from 'tailwindcss/lib/lib/setupContextUtils';
import resolveTailwindConfig from 'tailwindcss/resolveConfig';
import escalade from 'escalade/sync';
import requireFresh from 'import-fresh';
import { DEFAULT_TAILWIND_CONFIG_FILE_NAME } from './constants';

// Based on: https://github.dev/tailwindlabs/prettier-plugin-tailwindcss

const tailwindContextCache = new Map<string, { context: any; hash: string }>();

export function getTailwindConfigPath(
  options: TOptions,
  eslintCWD?: string
): string | null {
  const tailwindConfigPathFromOptions =
    options.length > 0 ? options[0].tailwindConfig : null;
  let tailwindConfigPath: string | null = null;
  const baseDir = eslintCWD != null ? eslintCWD : process.cwd();

  // Resolve TailwindCSS config path based on options
  if (tailwindConfigPathFromOptions != null) {
    tailwindConfigPath = path.resolve(baseDir, tailwindConfigPathFromOptions);
  }
  // Try to find TailwindCSS config path starting from the baseDir
  // and scaling to the parent directory if not found there
  else {
    try {
      tailwindConfigPath =
        escalade(baseDir, (_dir, names) => {
          if (names.includes('tailwind.config.js')) {
            // Will be resolved into absolute
            return DEFAULT_TAILWIND_CONFIG_FILE_NAME;
          }
        }) ?? null;
    } catch {
      // throw silent
    }
  }

  return tailwindConfigPath;
}

export function getTailwindContext(
  tailwindConfigPath: string
): TTailwindContext | null {
  let tailwindContext: TTailwindContext | null = null;

  // Get fresh TailwindCSS config so that its not falsified due to caching
  // https://nodejs.org/api/modules.html#modules_caching
  const tailwindConfig: any = requireFresh(tailwindConfigPath);

  // Suppress "empty content" warning
  if (tailwindConfig == null) {
    tailwindConfig['content'] = ['no-op'];
  }

  const existingTailwindContext = tailwindContextCache.get(tailwindConfigPath);
  const tailwindConfigHash = objectHash(tailwindConfig);

  // Check wether the context of the exact TailwindCSS config was already loaded
  if (
    existingTailwindContext != null &&
    existingTailwindContext.hash === tailwindConfigHash
  ) {
    tailwindContext = existingTailwindContext.context;
  }
  // Otherwise, load new TailwindCSS context from the resolved TailwindCSS config
  // and cache it
  else {
    tailwindContext = createTailwindContext(
      resolveTailwindConfig(tailwindConfig)
    );
    tailwindContextCache.set(tailwindConfigPath, {
      context: tailwindContext,
      hash: tailwindConfigHash,
    });
  }

  return tailwindContext;
}

function sortClasses(
  classNames: string,
  tailwindContext: TTailwindContext,
  options: { ignoreFirst?: boolean; ignoreLast?: boolean } = {}
) {
  options = {
    ignoreFirst: false,
    ignoreLast: false,
    ...options,
  };

  // Check wether there are any classes to sort
  if (typeof classNames !== 'string' || classNames === '') {
    return classNames;
  }

  // Ignore class attributes containing `{{`, to match Prettier behaviour:
  // https://github.com/prettier/prettier/blob/main/src/language-html/embed.js#L83-L88
  if (classNames.includes('{{')) {
    return classNames;
  }

  let result = '';
  let parts = classNames.split(/(\s+)/);
  let classes = parts.filter((_, i) => i % 2 === 0);
  let whitespace = parts.filter((_, i) => i % 2 !== 0);

  if (classes[classes.length - 1] === '') {
    classes.pop();
  }

  let prefix = '';
  if (options.ignoreFirst) {
    prefix = `${classes.shift() ?? ''}${whitespace.shift() ?? ''}`;
  }

  let suffix = '';
  if (options.ignoreLast) {
    suffix = `${whitespace.pop() ?? ''}${classes.pop() ?? ''}`;
  }

  classes = sortClassList(classes, tailwindContext);

  for (let i = 0; i < classes.length; i++) {
    result += `${classes[i]}${whitespace[i] ?? ''}`;
  }

  return prefix + result + suffix;
}

function sortClassList(classList: string[], tailwindContext: TTailwindContext) {
  let classNamesWithOrder = tailwindContext.getClassList(classList);
  return classNamesWithOrder
    .sort(([, a], [, z]) => {
      if (a === z) return 0;
      // if (a === null) return options.unknownClassPosition === 'start' ? -1 : 1
      // if (z === null) return options.unknownClassPosition === 'start' ? 1 : -1
      if (a === null) return -1;
      if (z === null) return 1;
      return a - z;
    })
    .map(([className]) => className);
}
