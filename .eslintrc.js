module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-empty-object-type': 'off',
    'react/no-unescaped-entities': 'off',
    'prefer-const': 'warn',
  },
  ignorePatterns: [
    'out/**/*',
    '.next/**/*',
    'node_modules/**/*',
    'build/**/*',
    'dist/**/*',
    'tmp/**/*',
    'src-tauri/target/**/*',
    'modal/**/*',
  ],
};
