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
import {
  buildInlineClassName,
  getIdentifierFromClassName,
  getTailwindConfigPath,
  getTailwindContext,
  sortTailwindClassList,
  splitClassName,
} from './tailwindcss';
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
      invalidInline:
        'Invalid inline TailwindCSS class names with extracted key.',
      invalidOrder: 'Invalid TailwindCSS class names order!',
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

        // Split className and extract outsource identifier
        const { className, identifier } = getIdentifierFromClassName(
          jsxLiteral.value
        );
        const splitted = splitClassName(className);
        if (splitted == null || splitted.classes.length <= 0) {
          return;
        }

        // Just sort if no identifier present
        if (identifier == null && tailwindContext != null) {
          const sortedClasses = sortTailwindClassList(
            splitted.classes,
            tailwindContext
          );

          if (sortedClasses.join('') !== splitted.classes.join('')) {
            context.report({
              node,
              messageId: 'invalidOrder',
              fix: (fixer) => {
                return fixer.replaceTextRange(
                  jsxLiteral.range,
                  buildInlineClassName(splitted.classes, splitted.whitespaces)
                );
              },
            });
          }
        }

        // Sort and extract if identifier present
        if (identifier != null) {
          // Store classes to extract them in another event listener
          if (tailwindContext != null) {
            extractedTailwindClasses[identifier] = sortTailwindClassList(
              splitted.classes,
              tailwindContext
            );
          } else {
            extractedTailwindClasses[identifier] = splitted.classes;
          }

          // Report the required extraction
          context.report({
            node,
            messageId: 'invalidInline',
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
            messageId: 'invalidInline',
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
