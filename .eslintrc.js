module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [],
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
    'no-param-reassign': 0,
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
  },
};
