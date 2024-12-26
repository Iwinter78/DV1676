import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["public/js/**"],
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.jest },
    },
  },
  pluginJs.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
