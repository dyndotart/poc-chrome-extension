const OFF = 0;
const WARNING = 1;
const ERROR = 2;

/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', '@physicaldotart'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:tailwindcss/recommended',
  ],
  ignorePatterns: ['.eslintrc.js', 'packages'], // https://stackoverflow.com/questions/63002127/parsing-error-parseroptions-project-has-been-set-for-typescript-eslint-parser
  rules: {
    'no-console': WARNING,
    'no-var': ERROR,
    'prefer-const': WARNING,
    '@typescript-eslint/no-empty-function': WARNING,
    '@physicaldotart/no-empty-catch': WARNING,
    '@physicaldotart/extract-tailwind-classes': WARNING,
  },
};
