import type { TransformedToken, PlatformConfig } from "style-dictionary/types";

export const generateTokenName = (
  token: TransformedToken,
  options: PlatformConfig,
) => {
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
};

export const getTokenValueWithUnit = (token: TransformedToken) => {
  if (token.$type === "dimension" && typeof token.$value === "object") {
    return token.$value.value + (token.$value.unit || "");
  }
  return token.$value;
};
