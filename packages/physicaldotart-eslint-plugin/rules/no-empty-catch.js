/**
 * @fileoverview Rule to avoid empty catch blocks.
 * @author BennoDev
 * Based on: https://eslint.org/docs/latest/extend/custom-rules
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule} */
module.exports = {
  meta: {
    messages: {
      emptyCatch: 'Empty catch block is not allowed.',
    },
  },
  create(context) {
    return {
      // Start at the "CatchClause" AST Node Type,
      // as we know that the changes are near a try-catch-block
      CatchClause(node) {
        // Start at CatchClause and go down to BlockStatement's body
        if (node.body.body.length === 0) {
          context.report({
            node: node.body,
            messageId: 'emptyCatch', // https://eslint.org/docs/latest/extend/custom-rules#messageids
          });
        }
      },
    };
  },
};
