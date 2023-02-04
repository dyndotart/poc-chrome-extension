/**
 * @fileoverview Rule to extract TailwindCss class names
 * @author BennoDev
 *
 * Structure based on: https://eslint.org/docs/latest/extend/custom-rules
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { createEslintRule } from '../utils/create-eslint-rule';
import { ESLintUtils } from '@typescript-eslint/utils';

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

export const RULE_NAME = 'extract-tailwind-classes';
export const EXTRACT_IDENTIFIER_REGEX = /extract-\[.+\]/;

//--------------------------------------------------------------------------
// Helpers
//--------------------------------------------------------------------------

function extractStringBetweenBrackets(value: string): string {
  const startIndex = value.indexOf('[') + 1;
  const endIndex = value.indexOf(']');
  return value.substring(startIndex, endIndex);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export default createEslintRule<TOptions, TMessageIds>({
  name: RULE_NAME,
  // https://eslint.org/docs/latest/extend/custom-rules#rule-basics
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Extract TAilwind classes from className HTML attribute.',
      recommended: 'warn',
    },
    schema: [], // No options
    messages: {
      extracted: 'Inline Tailwind is not allowed.',
    },
    fixable: 'code',
  },
  defaultOptions: [],
  create: (context) => {
    const extractedTailwindClasses: Record<string, string[]> = {};

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
    };
  },
});

//------------------------------------------------------------------------------
// Types
//------------------------------------------------------------------------------

type TMessageIds = 'extracted';
type TOptions = [];
