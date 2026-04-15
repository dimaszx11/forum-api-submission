import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    // Aturan khusus agar ESLint tidak memeriksa file konfigurasi ini dengan parser yang salah
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module', // Ubah ke module agar import/export di mjs aman
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'off', // Matikan pengecekan variabel tidak terpakai
      'no-undef': 'error',
      'no-useless-catch': 'off',
    
    },
  },
  {
    ignores: ['migrations/*', 'node_modules/*'],
  },
];