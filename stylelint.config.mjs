/** @type {import("stylelint").Config} */
export default {
  "extends": ["stylelint-config-standard"],
  "rules": {
    "shorthand-property-no-redundant-values": true,
    "declaration-block-no-shorthand-property-overrides": true,
    "media-feature-range-notation": "prefix",
    "number-max-precision": 5
  },
  "overrides": [
    {
      "files": ["**/*.css.ts", "**/*.js", "**/*.ts"],
      "customSyntax": "postcss-lit"
    }
  ]
};
