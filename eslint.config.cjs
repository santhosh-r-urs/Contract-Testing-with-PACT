// import globals from "globals";
// import pluginJs from "@eslint/js";


// /** @type {import('eslint').Linter.Config[]} */
// export default [
//   {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
// ];

// eslint.config.mjs


const eslint = require('@eslint/js');
const prettier = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  eslint.configs.recommended,
  prettier, // ✅ Ensures Prettier rules are applied
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        afterEach: "readonly",
        describe: "readonly",
        test: "readonly",
        expect: "readonly"
      }
    },
    plugins: {
      prettier: prettierPlugin // ✅ Fix: Plugins must be an object, not an array
    },
    rules: {
      "prettier/prettier": "error", // ✅ ESLint correctly recognizes Prettier now
      "no-console": "warn",
      "no-unused-vars": "warn",
      "eqeqeq": "error"
    }
  }
];
