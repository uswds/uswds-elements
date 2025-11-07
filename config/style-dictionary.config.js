import StyleDictionary from "style-dictionary";
import {
  generateTokenName,
  getTokenValueWithUnit,
} from "../internals/token-helpers/index.ts";

StyleDictionary.registerTransform({
  name: "name/uswds-theme",
  type: "name",
  transform: generateTokenName,
});

StyleDictionary.registerTransform({
  name: "value/uswds-units",
  type: "value",
  transform: getTokenValueWithUnit,
});

const outputs = [
  {
    name: "breakpoints",
    filter: (token) => token.path[0] === "breakpoint",
  },
  {
    name: "colors",
    filter: (token) =>
      token.filePath && token.filePath.includes("tokens/color/"),
  },
  {
    name: "spacing",
    filter: (token) =>
      token.path[0] === "spacing" ||
      token.path[0] === "site-margins" ||
      token.path[0] === "size",
  },
];

export default {
  source: ["tokens/**/*.json"],
  platforms: {
    scss: {
      transforms: ["name/uswds-theme", "value/uswds-units"],
      prefix: "usa",
      buildPath: "build/scss/",
      files: outputs.map(({ name, filter }) => ({
        destination: `_${name}.scss`,
        format: "scss/variables",
        filter,
      })),
    },
    css: {
      transforms: ["name/uswds-theme", "value/uswds-units"],
      prefix: "usa",
      buildPath: "build/css/",
      files: outputs.map(({ name, filter }) => ({
        destination: `${name}.css`,
        format: "css/variables",
        filter,
      })),
    },
  },
};
