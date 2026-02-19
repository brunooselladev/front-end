module.exports = {
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true,
    },
  },
  'env': {
    'browser': true,
    'jest': true,
    'es2021': true,
    'node': true,
  },
  'ignorePatterns': [
    '.eslintrc.js',
    'dist/',
    'node_modules/',
  ],
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  'overrides': [
    {
      'files': ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
      'extends': ['plugin:testing-library/react'],
      'rules': {
        'jest-dom/prefer-checked': 'error',
        'jest-dom/prefer-enabled-disabled': 'error',
        'jest-dom/prefer-required': 'error',
        'jest-dom/prefer-to-have-attribute': 'error',
        'testing-library/await-async-queries': 'error',
        'testing-library/no-await-sync-queries': 'error',
        'testing-library/no-debugging-utils': 'warn',
        'testing-library/no-dom-import': 'off',
      },
    },
  ],
  'settings': {
    'react': {
      'version': 'detect',
    },
  },
  'plugins': [
    'react',
    'jest-dom',
    'testing-library',
  ],
  'rules': {
    // React rules
    'react/no-children-prop': 'error',
    'react/no-typos': 'error',
    'react/self-closing-comp': 'error',
    'react/jsx-no-useless-fragment': 'error',

    // Format
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': [
      'warn',
      {
        'varsIgnorePattern': '^React$',
        'argsIgnorePattern': '^_',
        'ignoreRestSiblings': true
      }
    ],
    'no-irregular-whitespace': 'off',
    'no-case-declarations': 0,
    'react/prop-types': 0,
    'react/no-unescaped-entities': 0,
    'no-trailing-spaces': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
  },
};