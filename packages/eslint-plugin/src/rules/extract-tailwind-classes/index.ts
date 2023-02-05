/**
 * @fileoverview Rule to extract TailwindCss class names
 * @author BennoDev
 *
 * Structure based on: https://eslint.org/docs/latest/extend/custom-rules
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { createEslintRule } from '../../utils/create-eslint-rule';
import { EXTRACT_IDENTIFIER_REGEX, RULE_NAME } from './constants';
import { getTailwindConfigPath, getTailwindContext } from './tailwindcss';
import { extractStringBetweenBrackets } from './helper';
import { TOptions, TMessageIds } from './types';
import { TTailwindContext } from 'tailwindcss/lib/lib/setupContextUtils';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export default createEslintRule<TOptions, TMessageIds>({
  name: RULE_NAME,
  // https://eslint.org/docs/latest/extend/custom-rules#rule-basics
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Extract Tailwind classes from className HTML attribute.',
      recommended: 'warn',
    },
    schema: [
      {
        type: 'object',
        properties: {
          tailwindConfig: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ], // No options
    messages: {
      extracted: 'Inline Tailwind is not allowed.',
    },
    fixable: 'code',
  },
  defaultOptions: [{}],
  create: (context) => {
    const extractedTailwindClasses: Record<string, string[]> = {};

    // Get Tailwind Context
    const tailwindConfigPath = getTailwindConfigPath(context.options);
    let tailwindContext: TTailwindContext | null = null;
    if (tailwindConfigPath != null) {
      tailwindContext = getTailwindContext(tailwindConfigPath);
    } else {
      console.warn("Failed to resolve path to 'tailwind.config.js'!");
    }
    if (tailwindContext == null) {
      console.warn(
        `Failed to load 'tailwind.config.js' from '${tailwindConfigPath}'!`
      );
    }

    console.log(tailwindContext);

    return {
      // Start at the "JSXAttribute" AST Node Type,
      // as we know that the "className" is a JSX attribute
      JSXAttribute: (node) => {
        console.log("Start TailwindCSS 'className' extraction");

        // Check wether its a relevant JSXAttribute
        if (
          node.name.type !== 'JSXIdentifier' ||
          node.value == null ||
          node.value.type !== 'Literal'
        ) {
          return;
        }

        const jsxIdentifier = node.name;
        const jsxLiteral = node.value;

        // Check whether attribute is actually a "className"
        if (jsxIdentifier.name !== 'className') {
          return;
        }

        // Check whether its a relevant literal
        if (jsxLiteral.value == null || typeof jsxLiteral.value !== 'string') {
          return;
        }

        // Check wether TailwindCSS should actually be extracted
        if (!EXTRACT_IDENTIFIER_REGEX.test(jsxLiteral.value)) {
          return;
        }

        // Extract identifier & replace them with '' in the literal value
        const identifiers = EXTRACT_IDENTIFIER_REGEX.exec(jsxLiteral.value);
        if (identifiers == null || identifiers.length <= 0) {
          return;
        }

        // Extract relevant values like Tailwind classes and the identifier value
        const identifier = extractStringBetweenBrackets(identifiers[0]);
        const value = jsxLiteral.value
          .replace(EXTRACT_IDENTIFIER_REGEX, '')
          .replace(/\s+/g, ' ') // Remove extra white space, tabs and line breaks
          .trim();
        const tailwindClasses = value.split(' ');

        if (tailwindClasses.length > 0) {
          // Store classes to extract them in another event listener
          extractedTailwindClasses[identifier] = tailwindClasses;

          // Report the required extraction
          context.report({
            node,
            messageId: 'extracted',
            fix: (fixer) => {
              return fixer.replaceText(node, `className={${identifier}}`);
            },
          });
        }
      },
      // Adding the TailwindCSS classes to the end of the file in each JSXAttribute Listener fix() method,
      // didn't work properly if there where multiple fixes to do,
      // so I collect the to do fixes and then add them at the end of the file in a batch on 'Program:exit'.
      // https://github.com/eslint/eslint/discussions/16855
      'Program:exit': (node) => {
        if (Object.keys(extractedTailwindClasses).length > 0) {
          context.report({
            node,
            messageId: 'extracted',
            fix: (fixer) => {
              const ast = context.getSourceCode().ast;

              // Add TailwindCss classes to end of the file (in a batch)
              const lastNode = ast.body[ast.body.length - 1];
              const toInsertCode = Object.keys(extractedTailwindClasses).reduce(
                (previousValue, currentValue) => {
                  // Adds a new code block with a constant declaration for the extracted Tailwind class
                  previousValue =
                    previousValue +
                    `\n\n${Array(lastNode.loc.start.column + 1).join(
                      ' '
                    )}const ${currentValue} = "${extractedTailwindClasses[
                      currentValue
                    ].join(' ')}";`;

                  // Remove the extracted Tailwind class entry from the stored list
                  delete extractedTailwindClasses[currentValue];

                  return previousValue;
                },
                ''
              );

              return fixer.insertTextAfter(lastNode, toInsertCode);
            },
          });
        }
      },
    };
  },
});

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

export * from './constants';
export * from './types';
