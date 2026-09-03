import type { TransformedToken, PlatformConfig } from "style-dictionary/types";

/**
 * Tier path segments.
 * generateTokenName strips these from `token.path` before joining so that the
 * tier is organizational (directory / `$extensions.uswds.tier`) but does NOT
 * appear in the emitted CSS custom property or Sass variable name.
 *
 * Example: ["system","color","blue","5"] → "usa-color-blue-5"  (tier stripped)
 *          ["color","blue","5"]          → "usa-color-blue-5"  (no-op — unchanged)
 */
const TIERS = new Set(["system", "theme", "state"]);

export const generateTokenName = (
  token: TransformedToken,
  options: PlatformConfig,
) => {
  const segments = token.path.filter((s) => !TIERS.has(s));
  return `${options.prefix}-${segments.join("-")}`;
};

export const getTokenValueWithUnit = (token: TransformedToken) => {
  if (token.$type === "dimension" && typeof token.$value === "object") {
    return token.$value.value + (token.$value.unit || "");
  }
  return token.$value;
};
