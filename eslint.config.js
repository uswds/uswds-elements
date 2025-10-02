// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import css from "@eslint/css";
import eslintConfigPrettierRecommended from "eslint-config-prettier";
import vitest from "@vitest/eslint-plugin";

export default [
  { ignores: ["storybook-static/**"] },
  {
    ...js.configs.recommended,
    ...eslintConfigPrettierRecommended,
    files: ["src/**/*.js"],
    rules: {},
  },
  {
    files: ["src/**/*.spec.js"],
    plugins: { vitest },
    rules: { ...vitest.configs.recommended.rules },
  },
  {
    files: ["core/**/*.css", "src/**/*.css"],
    plugins: { css },
    language: "css/css",
    rules: {
      ...css.configs.recommended.rules,
      "css/use-baseline": ["warn", { available: "widely" }],
    },
  },
  ...storybook.configs["flat/recommended"],
];
