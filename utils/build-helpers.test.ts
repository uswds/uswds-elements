import { describe, it, expect } from "vitest";
import {
  mapEntryToLimit,
  type Entry,
  mapEntryToTuple,
  mapEntriesToKeyValue,
} from "./build-helpers";

describe("mapEntryToLimit", () => {
  it("should correctly transform an entry to a Limit object", () => {
    const entry: Entry = {
      name: "components/index",
      path: "src/components/index",
      sizeLimit: "0.2 kB",
    };

    const expected = {
      name: "components/index.js",
      limit: entry.sizeLimit,
      mode: "brotli",
    };

    expect(mapEntryToLimit(entry)).toEqual(expected);
  });
});

describe("mapEntriesToKeyValue", () => {
  it("should correctly transform an entry to a Limit object", () => {
    const entries: Array<Entry> = [
      {
        name: "components/index",
        path: "src/components/index",
        sizeLimit: "0.2 kB",
      },
      {
        name: "components/usa-banner",
        path: "src/components/usa-banner/index.ts",
        sizeLimit: "10 kB",
      },
      {
        name: "components/usa-link",
        path: "src/components/usa-link/index.js",
        sizeLimit: "0.8 kB",
      },
    ];

    const expected = {
      "components/index": "src/components/index",
      "components/usa-banner": "src/components/usa-banner/index.ts",
      "components/usa-link": "src/components/usa-link/index.js",
    };

    expect(mapEntriesToKeyValue(entries)).toEqual(expected);
  });
});
