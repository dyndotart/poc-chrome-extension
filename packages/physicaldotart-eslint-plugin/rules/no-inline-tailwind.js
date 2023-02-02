/**
 * @fileoverview Rule to extract TailwindCss class names
 * @author BennoDev
 * Structure based on: https://eslint.org/docs/latest/extend/custom-rules
 */

'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// https://babeljs.io/docs/en/babel-parser
const babelParser = require('@babel/parser').default;
// https://babeljs.io/docs/en/babel-generator
const generate = require('@babel/generator').default;
// https://www.npmjs.com/package/lodash.get
const get = require('lodash.get');

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

// Identifier for class extraction
const EXTRACT_IDENTIFIER = 'extract-';

//--------------------------------------------------------------------------
// Helpers
//--------------------------------------------------------------------------

// extract class names from node if it has "extract-" identifier
const extractTailwindClasses = (node, extractedClasses = []) => {
  if (!node) return extractedClasses;

  // Get className value from the node's opening element
  const className = get(node, 'openingElement.attributes[0].value.value');

  // Check if className has "extract-" identifier
  if (className && className.includes(EXTRACT_IDENTIFIER)) {
    // Split className to get the class string and identifier
    const [, classesString] = className.split(EXTRACT_IDENTIFIER);
    extractedClasses.push({
      node,
      classes: classesString.slice(2, -2).split(' '),
      identifier: classesString
        .slice(2, -2)
        .split(' ')
        .map((part) => part.replace('-', ''))
        .join(''),
    });
  }

  // Traverse children of node to extract classes from them as well
  node.children.forEach((childNode) => {
    extractTailwindClasses(childNode, extractedClasses);
  });

  return extractedClasses;
};

// Generate constant declarations for extracted class names
const generateConstDeclarations = (extractedClasses = []) => {
  return extractedClasses
    .map(({ classes, identifier }) => {
      return `const ${identifier} = "${classes.join(' ')}";`;
    })
    .join('\n');
};

// Update node with extracted class names
const updateNode = (node, extractedClasses = []) => {
  extractedClasses.forEach(({ node: classNode, identifier }) => {
    classNode.openingElement.attributes = [
      {
        type: 'JSXAttribute',
        name: {
          type: 'JSXIdentifier',
          name: 'className',
        },
        value: {
          type: 'JSXExpressionContainer',
          expression: babelParser.t.identifier(identifier),
        },
      },
    ];
  });

  return node;
};

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule} */
module.exports = {
  // https://eslint.org/docs/latest/extend/custom-rules#rule-basics
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Stylistic Issues',
      description:
        'Extracts all TailwindCss class names located in an HTML Tag, outsources the class names to a constant, and updates the HTML tag with the constant',
      recommended: false,
      url: '',
    },
    fixable: 'code',
    schema: [], // No options
  },
  create: (context) => {
    return {
      // Start at the "Program" AST Node Type (-> at the top of the file)
      // as we can't limit the search & format area
      Program: (node) => {
        // Get Source Code
        const sourceCode = context.getSourceCode();

        // Parse JSX Code to AST ()
        const ast = babelParser.parse(sourceCode.getText(), {
          plugins: ['jsx'],
          sourceType: 'module',
        });

        const extractedClasses = extractTailwindClasses(ast);
        const classDeclarations = generateConstDeclarations(extractedClasses);

        // Add constant declarations to the end of the file
        ast.program.body.push(
          ...babelParser.parse(classDeclarations).program.body
        );
        updateNode(ast, extractedClasses);

        // https://eslint.org/docs/latest/extend/custom-rules#contextreport
        context.report({
          // Node related to the problem
          node,
          // The problem message
          message: 'Outsource TailwindCss classes at {{ identifier }}',
          data: {
            identifier: node.name,
          },
          // Location of the Problem
          loc: {
            start: { line: 1, column: 0 },
            end: {
              line: sourceCode.lines.length,
              column: sourceCode.lines[sourceCode.lines.length - 1].length,
            },
          },
          // Applies a fix to resolve the problem
          // https://eslint.org/docs/latest/extend/custom-rules#applying-fixes
          fix: function (fixer) {
            return fixer.replaceText(
              node,
              // Generate JSX from AST (using Babel)
              generate(ast, {
                plugins: ['jsx'],
              })
            );
          },
        });
      },
    };
  },
};
