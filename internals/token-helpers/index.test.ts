import { describe, it, expect } from "vitest";
import type { TransformedToken, PlatformConfig } from "style-dictionary/types";
import { generateTokenName, getTokenValueWithUnit } from "./index";

describe("generateTokenName", () => {
  const token: TransformedToken = {
    $value: { value: "75", unit: "rem" },
    filePath: "tokens/dimension/breakpoints.json",
    isSource: true,
    $type: "dimension",
    key: "{breakpoint.desktop-lg}",
    original: {
      $value: { value: "75", unit: "rem" },
      $type: "dimension",
      key: "{breakpoint.desktop-lg}",
    },
    name: "desktop-lg",
    attributes: {},
    path: ["breakpoint", "desktop-lg"],
  };

  const options: PlatformConfig = {
    prefix: "usa",
    transforms: [],
    buildPath: "",
    files: [],
    log: {},
    actions: [],
  };

  it("should generate token name for breakpoint prefix", () => {
    const result = generateTokenName(token, options);
    expect(result).toBe("usa-breakpoint-desktop-lg");
  });

  it("should generate token name for spacing prefix", () => {
    const spacingToken: TransformedToken = {
      ...token,
      path: ["site-margins", "width"],
    };
    const result = generateTokenName(spacingToken, options);
    expect(result).toBe("usa-site-margins-width");
  });

  it("should generate token name for color directory with single path key", () => {
    const colorTokenSingle: TransformedToken = {
      ...token,
      filePath: "tokens/color/primary.json",
      path: ["black"],
    };
    const result = generateTokenName(colorTokenSingle, options);
    expect(result).toBe("usa-color-black");
  });

  it("should generate token name for color directory with multiple path keys", () => {
    const colorTokenMulti: TransformedToken = {
      ...token,
      filePath: "tokens/color/primary.json",
      path: ["primary", "light"],
    };
    const result = generateTokenName(colorTokenMulti, options);
    expect(result).toBe("usa-color-primary-light");
  });

  it("should generate token name fallback for other cases", () => {
    const otherToken: TransformedToken = {
      ...token,
      path: ["font", "base-size"],
    };
    const result = generateTokenName(otherToken, options);
    expect(result).toBe("usa-font-base-size");
  });
});

describe("getTokenValueWithUnit", () => {
  const defaultToken: TransformedToken = {
    $value: { value: "75", unit: "rem" },
    $type: "dimension",
    isSource: true,
    key: "desktop-lg",
    name: "desktop-lg",
    attributes: {},
    path: ["breakpoint", "desktop-lg"],
    original: {
      $value: { value: "75", unit: "rem" },
      $type: "dimension",
      key: "desktop-lg",
    },
  };

  it("should return value + unit for dimension tokens with object value", () => {
    const result = getTokenValueWithUnit(defaultToken);
    expect(result).toBe("75rem");
  });

  it("should return value string when unit is missing in dimension object", () => {
    const token = {
      ...defaultToken,
      $value: { value: "30" },
    };
    const result = getTokenValueWithUnit(token);
    expect(result).toBe("30");
  });

  it("should return raw value if token type is not dimension", () => {
    const token = {
      $value: "#fff2f5",
      $type: "color",
    };
    const result = getTokenValueWithUnit(token);
    expect(result).toBe("#fff2f5");
  });
});
