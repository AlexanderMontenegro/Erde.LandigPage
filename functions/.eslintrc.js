// .eslintrc.js
module.exports = {
  env: {
    node: true,          // Reconoce require, module, process, etc.
    es2021: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'node',
  ],
  rules: {
    'no-undef': 'error',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Ignora variables no usadas que empiecen con _
    // Puedes agregar más reglas si querés ser estricto, pero esto es suficiente para empezar
  },
};