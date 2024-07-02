const { typescriptEslintParser } = require('@typescript-eslint/parser');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-refresh', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { 'vars': 'all', 'args': 'after-used', 'ignoreRestSiblings': false }],
    'react/jsx-uses-vars': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'react/no-unknown-property': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/display-name': 'off',
    'no-async-promise-executor': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'react-refresh/only-export-components': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
