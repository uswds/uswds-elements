import { type Limit } from "vite-plugin-bundlesize";

export type Entry = { name: string; path: string; sizeLimit: string };

export const mapEntryToLimit = (entry: Entry): Limit => {
  return {
    name: `${entry.name}.js`,
    limit: entry.sizeLimit,
    mode: "brotli",
  };
};
