/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-order"],
  rules: {
    "declaration-block-no-redundant-longhand-properties": null,
    "no-descending-specificity": null,
    "no-duplicate-selectors": null,
    "number-max-precision": 5,
    "order/order": ["custom-properties", "declarations"],
    "order/properties-alphabetical-order": true,
    /**
     * This selector pattern permits BEM-style patterns with an optional device
     * prefix (e.g. `tablet\\:`, `mobile-lg\\:`) and up to 2 optional modifier
     * suffixes (e.g. `--hover`) for backwards compatibility with the USWDS core
     * styles. It also allows kebab-case selectors that are safer to use within
     * the Shadow DOM where style encapsulated is provided by the Shadow DOM's
     * scoping mechanism and style collisions are less likely.
     */
    "selector-class-pattern": [
      "^([a-z\-]+\\:)?[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$",
      {
        message:
          "Class selectors can be named in BEM format or kebab-case. See: https://en.bem.info/methodology/naming-convention/#two-dashes-style",
      },
    ],
    "value-keyword-case": null,
  },
};
