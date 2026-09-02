import { readdirSync } from "node:fs";
import { join } from "node:path";

const dirs = (p) =>
  readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

/**
 * Returns a flat array of { tier, category } group objects for each
 * tier/category combination found under tokens/system, tokens/theme,
 * and tokens/state. Used by the Style Dictionary config to generate
 * per-tier-per-category output files and filters.
 */
const tokenGroups = dirs(import.meta.dirname)
  .filter((tier) => tier !== "index.js")
  .flatMap((tier) => {
    const tierPath = join(import.meta.dirname, tier);
    return dirs(tierPath).map((category) => ({ tier, category }));
  });

export default tokenGroups;
