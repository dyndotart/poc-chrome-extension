'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require('requireindex');
const obj = requireIndex(__dirname + '/src/rules');
const rules = {};
Object.keys(obj).forEach(
  (ruleName) => (rules[ruleName] = obj[ruleName].default)
);

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

module.exports = { rules };
