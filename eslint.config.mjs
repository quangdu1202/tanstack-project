// eslint.config.js
import pluginRouter from '@tanstack/eslint-plugin-router';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...pluginRouter.configs['flat/recommended'],
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ['src/routeTree.gen.ts'],
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'warn', // Shows Prettier issues as warnings
    },
  },
  prettierConfig,
);
