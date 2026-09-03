import StyleDictionary from "style-dictionary";
import tokenGroups from "../tokens/index.js";
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

/**
 * Builds a Style Dictionary platform config for the given output format.
 * Output files are keyed per-tier-per-category:
 *
 *   css  → build/css/<tier>/<category>.css
 *   scss → build/scss/<tier>/_<category>.scss
 */
function makePlatform(format) {
  return {
    transforms: ["name/uswds-theme", "value/uswds-units"],
    prefix: "usa",
    buildPath: `build/${format}/`,
    files: tokenGroups.map(({ tier, category }) => ({
      destination:
        format === "scss"
          ? `${tier}/_${category}.scss`
          : `${tier}/${category}.css`,
      format: `${format}/variables`,
      filter: (token) =>
        token.filePath?.includes(`tokens/${tier}/${category}/`),
    })),
  };
}

export default {
  source: ["tokens/**/*.json"],
  platforms: {
    scss: makePlatform("scss"),
    css: makePlatform("css"),
  },
};
