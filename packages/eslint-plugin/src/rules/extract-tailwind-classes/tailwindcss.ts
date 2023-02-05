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
import {
  DEFAULT_TAILWIND_CONFIG_FILE_NAME,
  EXTRACT_IDENTIFIER_REGEX,
} from './constants';

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

export function getIdentifierFromClassName(className: string): {
  className: string;
  identifier: string | null;
} {
  const response: { className: string; identifier: string | null } = {
    className,
    identifier: null,
  };

  // Extract identifier value from className and remove it
  if (EXTRACT_IDENTIFIER_REGEX.test(className)) {
    const identifiers = EXTRACT_IDENTIFIER_REGEX.exec(className);
    if (identifiers != null && identifiers.length > 0) {
      function extractStringBetweenBrackets(value: string): string {
        const startIndex = value.indexOf('[') + 1;
        const endIndex = value.indexOf(']');
        return value.substring(startIndex, endIndex);
      }
      response.identifier = extractStringBetweenBrackets(identifiers[0]);
      response.className = className.replace(EXTRACT_IDENTIFIER_REGEX, '');
    }
  }

  return response;
}

export function splitClassName(className: string): {
  classes: string[];
  whitespaces: string[];
} | null {
  // Check wether there are any classes to split
  if (typeof className !== 'string' || className === '') {
    return null;
  }

  // Ignore class attributes containing `{{`, to match Prettier behavior:
  // https://github.com/prettier/prettier/blob/main/src/language-html/embed.js#L83-L88
  if (className.includes('{{')) {
    return null;
  }

  // Split className at each not outer whitespace.
  // Note whitespaces are intensionally not removed during the split.
  const parts = className.trim().split(/(\s+)/);

  return {
    classes: parts.filter((_, i) => i % 2 === 0),
    whitespaces: parts.filter((_, i) => i % 2 !== 0),
  };
}

export function buildInlineClassName(
  classes: string[],
  whitespaces: string[] = []
) {
  let result = '';
  for (let i = 0; i < classes.length; i++) {
    result += `${classes[i]}${whitespaces[i] ?? ''}`;
  }
  return result;
}

export function sortTailwindClassList(
  classList: string[],
  tailwindContext: TTailwindContext
) {
  if (tailwindContext.getClassOrder == null) {
    console.warn(
      "No sorting applied! You've an old TailwindCSS version which is not supported by this eslint-plugin."
    );
    return classList;
  }
  const classNamesWithOrder = tailwindContext.getClassOrder(classList);

  function bigSign(bigIntValue: any) {
    // @ts-ignore
    return (bigIntValue > 0n) - (bigIntValue < 0n);
  }

  return classNamesWithOrder
    .sort(([, a], [, z]) => {
      if (a === z) return 0;
      // if (a === null) return options.unknownClassPosition === 'start' ? -1 : 1
      // if (z === null) return options.unknownClassPosition === 'start' ? 1 : -1
      if (a === null) return -1;
      if (z === null) return 1;
      return bigSign(a - z);
    })
    .map(([className, _]) => className);
}
