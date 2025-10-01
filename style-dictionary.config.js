import StyleDictionary from "style-dictionary";

StyleDictionary.registerTransform({
  name: "name/uswds-theme",
  type: "name",
  transform: function (token, options) {
    if (token.path[0] === "spacing") {
      return `${options.prefix}-spacing-${token.path[1]}`;
    }

    if (token.path[0] === "breakpoint") {
      return `${options.prefix}-breakpoint-${token.path[1]}`;
    }

    const isFromColorDirectory =
      token.filePath && token.filePath.includes("tokens/color/");

    if (isFromColorDirectory) {
      if (
        token.path.length === 1 &&
        ["transparent", "black", "white"].includes(token.path[0])
      ) {
        return `${options.prefix}-color-${token.path[0]}`;
      } else {
        return `${options.prefix}-color-${token.path.join("-")}`;
      }
    }

    return `${options.prefix}-${token.path.join("-")}`;
  },
});

StyleDictionary.registerTransform({
  name: "value/uswds-units",
  type: "value",
  transform: function (token) {
    if (token.$type === "dimension" && typeof token.$value === "object") {
      return token.$value.value + (token.$value.unit || "");
    }
    return token.$value;
  },
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
