import { type Limit } from "vite-plugin-bundlesize";

export type Entry = { name: string; path: string; sizeLimit: string };

/**
 * Converts an `Entry` object into a `Limit` object, mapping and transforming
 * the properties to adhere to the `Limit` type structure.
 *
 * @param {Entry} entry - The input object containing information about the entry.
 * @returns {Limit} - A transformed object with details about the limit, including
 *                    the updated name, size limit, and compression mode.
 */
export const mapEntryToLimit = (entry: Entry): Limit => {
  return {
    name: `${entry.name}.js`,
    limit: entry.sizeLimit,
    mode: "brotli",
  };
};

/**
 * Maps an array of Entry objects to a key-value pair object, where each entry's name
 * is used as the key and its path is used as the value.
 *
 * @param {Entry[]} entries - The array of Entry objects to be mapped into key-value pairs.
 * @return {Record<string, string>} An object representing the key-value pairs derived from the entries,
 * where the key is the entry's name and the value is the entry's path.
 */
export function mapEntriesToKeyValue(entries: Entry[]): Record<string, string> {
  return Object.fromEntries(entries.map((entry) => [entry.name, entry.path]));
}
