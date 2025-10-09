import { describe, it, expect } from "vitest";
import { mapEntryToLimit, type Entry } from "./build-helpers";

describe("mapEntryToLimit", () => {
  it("should correctly transform an entry to a Limit object", () => {
    const entry: Entry = {
      name: "components/index",
      path: "src/components/index",
      sizeLimit: "0.2 kB",
    };

    const expected = {
      name: "components/index.js",
      limit: "0.2 kB",
      mode: "brotli",
    };

    expect(mapEntryToLimit(entry)).toEqual(expected);
  });
});
