import { describe, it, expect } from "vitest";
import type { TransformedToken, PlatformConfig } from "style-dictionary/types";
import { generateTokenName, getTokenValueWithUnit } from "./index";

const baseToken: TransformedToken = {
  $value: { value: "75", unit: "rem" },
  filePath: "tokens/breakpoints/breakpoints.json",
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

function createToken(
  overrides: Partial<TransformedToken> = {},
): TransformedToken {
  return { ...baseToken, ...overrides };
}

describe("generateTokenName", () => {
  it.each<{
    name: string;
    overrides: Partial<TransformedToken>;
    expected: string;
  }>([
    {
      name: "breakpoint prefix",
      overrides: {},
      expected: "usa-breakpoint-desktop-lg",
    },
    {
      name: "spacing prefix",
      overrides: { path: ["site-margins", "width"] },
      expected: "usa-site-margins-width",
    },
    {
      name: "color with single nested key",
      overrides: {
        filePath: "tokens/colors/global.json",
        path: ["color", "black"],
      },
      expected: "usa-color-black",
    },
    {
      name: "color with multiple nested keys",
      overrides: {
        filePath: "tokens/colors/blue.json",
        path: ["color", "blue", "5"],
      },
      expected: "usa-color-blue-5",
    },
    {
      name: "color with vivid variant",
      overrides: {
        filePath: "tokens/colors/blue.json",
        path: ["color", "blue", "vivid", "50"],
      },
      expected: "usa-color-blue-vivid-50",
    },
    {
      name: "fallback for other cases",
      overrides: { path: ["font", "base-size"] },
      expected: "usa-font-base-size",
    },
    {
      name: "the 'system' tier segment stripped from path",
      overrides: {
        filePath: "tokens/system/color/blue.json",
        path: ["system", "color", "blue", "5"],
      },
      expected: "usa-color-blue-5",
    },
    {
      name: "the 'system' tier segment stripped for breakpoints",
      overrides: {
        filePath: "tokens/system/breakpoints/breakpoints.json",
        path: ["system", "breakpoint", "desktop-lg"],
      },
      expected: "usa-breakpoint-desktop-lg",
    },
    {
      name: "the 'theme' tier segment stripped from path",
      overrides: {
        filePath: "tokens/theme/color/primary.json",
        path: ["theme", "color", "primary"],
      },
      expected: "usa-color-primary",
    },
    {
      name: "the 'state' tier segment stripped from path",
      overrides: {
        filePath: "tokens/state/color/error.json",
        path: ["state", "color", "error"],
      },
      expected: "usa-color-error",
    },
  ])("should generate token name for $name", ({ overrides, expected }) => {
    const result = generateTokenName(createToken(overrides), options);
    expect(result).toBe(expected);
  });
});

describe("getTokenValueWithUnit", () => {
  it.each<{
    name: string;
    overrides: Partial<TransformedToken>;
    expected: string;
  }>([
    {
      name: "value + unit for dimension tokens with object value",
      overrides: {},
      expected: "75rem",
    },
    {
      name: "value string when unit is missing in dimension object",
      overrides: { $value: { value: "30" } },
      expected: "30",
    },
    {
      name: "raw value if token type is not dimension",
      overrides: { $value: "#fff2f5", $type: "color" },
      expected: "#fff2f5",
    },
  ])("should return $name", ({ overrides, expected }) => {
    const result = getTokenValueWithUnit(createToken(overrides));
    expect(result).toBe(expected);
  });
});
