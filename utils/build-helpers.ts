import { type Limit } from "vite-plugin-bundlesize";

export type Entry = { name: string; path: string; sizeLimit: string };

export const mapEntryToLimit = (entry: Entry): Limit => {
  return {
    name: `${entry.name}.js`,
    limit: entry.sizeLimit,
    mode: "brotli",
  };
};

export function mapEntriesToKeyValue(entries: Entry[]): Record<string, string> {
  return entries.reduce(
    (result, entry) => {
      const [key, value]: EntryTuple = [entry.name, entry.path];
      result[key] = value;
      return result;
    },
    {} as Record<string, string>,
  );
}
