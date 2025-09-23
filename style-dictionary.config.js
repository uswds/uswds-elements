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

const filters = {
  breakpoints: (token) => token.path[0] === "breakpoint",
  colors: (token) =>
    token.filePath && token.filePath.includes("tokens/color/"),
  spacing: (token) => token.path[0] === "spacing",
};

export default {
  source: ["tokens/**/*.json"],
  platforms: {
    scss: {
      transforms: ["name/uswds-theme", "value/uswds-units"],
      prefix: "usa",
      buildPath: "build/scss/",
      files: [
        {
          destination: "_breakpoints.scss",
          format: "scss/variables",
          filter: filters.breakpoints,
        },
        {
          destination: "_colors.scss",
          format: "scss/variables",
          filter: filters.colors,
        },
        {
          destination: "_spacing.scss",
          format: "scss/variables",
          filter: filters.spacing,
        }
      ],
    },
    css: {
      transforms: ["name/uswds-theme", "value/uswds-units"],
      prefix: "usa",
      buildPath: "build/css/",
      files: [
        {
          destination: "breakpoints.css",
          format: "css/variables",
          filter: filters.breakpoints,
        },
        {
          destination: "colors.css",
          format: "css/variables",
          filter: filters.colors,
        },
        {
          destination: "spacing.css",
          format: "css/variables",
          filter: filters.spacing,
        }
      ],
    },
  },
};
