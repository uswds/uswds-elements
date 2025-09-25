/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "declaration-block-no-redundant-longhand-properties": null,
    "media-feature-range-notation": "prefix",
    "no-descending-specificity": null,
    "no-duplicate-selectors": null,
    "number-max-precision": 5,
    "selector-class-pattern":
      "^([a-z]+\\:)?[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$",
  },
  overrides: [
    {
      files: ["src/components/**/*.css.ts"],
      customSyntax: "postcss-lit",
    },
  ],
};
