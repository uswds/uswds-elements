import { describe, expect, it } from "vitest";
import {
  processFile,
  tryParseMap,
  maskComments,
  scanFile,
  classifyCurtisTier,
  classifyName,
} from "./extract-uswds-tokens.js";

const fileMeta = {
  rel: "packages/uswds-core/src/styles/tokens/color/_blue-cool.scss",
  sourceTier: "system",
  basename: "_blue-cool.scss",
};
const componentVocab = new Set(["accordion", "alert"]);

function rowByName(rows, name) {
  return rows.find((r) => r.token_name === name);
}

describe("maskComments", () => {
  it("blanks line and block comments without shifting offsets", () => {
    const src =
      "$a: 1; // trailing comment with an apostrophe: can't\n$b: 2; /* block */\n";
    const masked = maskComments(src);
    expect(masked.length).toBe(src.length);
    expect(masked).not.toContain("apostrophe");
    expect(masked).toContain("$a: 1;");
    expect(masked).toContain("$b: 2;");
  });
});

describe("scanFile: scope boundaries", () => {
  it("captures top-level declarations but not ones inside a mixin/function", () => {
    const src = `
      $system-spacing: 1;
      @mixin foo() {
        $local: 2;
      }
      @function bar() {
        $inner: 3;
        @return $inner;
      }
    `;
    const decls = scanFile(maskComments(src));
    expect(decls.map((d) => d.name)).toEqual(["$system-spacing"]);
  });

  it("captures declarations inside a top-level @if/@else as conditional", () => {
    const src = `
      @if $theme-respect-user-font-size {
        $root-font-size: 100%;
      } @else {
        $root-font-size: 10px;
      }
    `;
    const decls = scanFile(maskComments(src));
    expect(decls).toHaveLength(2);
    expect(decls[0].conditional).toBe(true);
    expect(decls[1].conditional).toBe(true);
  });

  it("does not stop at a semicolon nested inside the CSS Values-5 if()/sass() construct", () => {
    const src = `$root-font-size: if(sass($theme-respect-user-font-size): 100%; else: $theme-root-font-size);`;
    const decls = scanFile(maskComments(src));
    expect(decls).toHaveLength(1);
    expect(decls[0].valueText).toContain("else: $theme-root-font-size");
  });

  it("does not treat a @function parameter default or @include named argument as a declaration", () => {
    const src = `
      @function summation($iteratee, $input, $initial: 0, $limit: 100) {
        @return $initial;
      }
      @include foo($width: 10px, $height: 20px);
      $real-token: 5;
    `;
    const decls = scanFile(maskComments(src));
    expect(decls.map((d) => d.name)).toEqual(["$real-token"]);
  });

  it("strips trailing !default and !global flags", () => {
    const src = `$theme-color-base-family: "gray-cool" !default;`;
    const decls = scanFile(maskComments(src));
    expect(decls[0].valueText).toBe('"gray-cool"');
    expect(decls[0].hasDefault).toBe(true);
  });
});

describe("tryParseMap", () => {
  it("parses a nested map with an interpolated string key without corruption", () => {
    const src = `(
      1: spacing-multiple(1),
      "#{$neg-prefix}-1px": -1px,
      "vivid": (
        10: get-system-color("blue", 10, "vivid")
      )
    )`;
    const map = tryParseMap(src);
    expect(map).not.toBeNull();
    expect(map.entries).toHaveLength(3);
    expect(map.entries[1].rawKey).toBe('"#{$neg-prefix}-1px"');
  });

  it("treats a colon-less parenthesized list as opaque, not a map", () => {
    expect(tryParseMap("(row, column)")).toBeNull();
  });

  it("treats a function call as opaque, not a map", () => {
    expect(tryParseMap('get-system-color("blue", 60, "vivid")')).toBeNull();
  });
});

describe("processFile: end-to-end flattening", () => {
  it("flattens a two-level map (standard + vivid) into distinctly-named rows, never colliding", () => {
    const src = `
      $system-color-blue-cool: (
        10: #dae9ee,
        90: false,
        "vivid": (
          10: #c3ebfa,
          90: false
        )
      );
    `;
    const { rows } = processFile(src, fileMeta, componentVocab);

    const standard10 = rowByName(rows, "$system-color-blue-cool-10");
    const vivid10 = rowByName(rows, "$system-color-blue-cool-vivid-10");
    expect(standard10.default_value).toBe("#dae9ee");
    expect(vivid10.default_value).toBe("#c3ebfa");
    expect(standard10.token_name).not.toBe(vivid10.token_name);

    const names = rows.map((r) => r.token_name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("emits a map-container row alongside its flattened leaves", () => {
    const src = `$system-color-blue-cool: (10: #dae9ee, 20: #aacdec);`;
    const { rows } = processFile(src, fileMeta, componentVocab);
    const container = rowByName(rows, "$system-color-blue-cool");
    expect(container.disposition).toContain("map-container");
    expect(rowByName(rows, "$system-color-blue-cool-10")).toBeDefined();
    expect(rowByName(rows, "$system-color-blue-cool-20")).toBeDefined();
  });

  it("collapses a multi-line value onto one line so every CSV row is one line", () => {
    const src = `$accordion-border: units($theme-accordion-border-width) solid\n  color($theme-accordion-border-color);`;
    const { rows } = processFile(src, fileMeta, componentVocab);
    expect(rows[0].default_value).not.toContain("\n");
    expect(rows[0].default_value).toBe(
      "units($theme-accordion-border-width) solid color($theme-accordion-border-color)",
    );
  });

  it("resolves nested rgba() and map-collect() values verbatim without corruption", () => {
    const src = `
      $system-box-shadow-1: 0 1px 0.25rem 0 rgba(0, 0, 0, 0.1);
      $theme-utility-breakpoints-complete: map-collect((sm: 1, md: 2), $theme-utility-breakpoints);
    `;
    const { rows } = processFile(src, fileMeta, componentVocab);
    expect(rowByName(rows, "$system-box-shadow-1").default_value).toBe(
      "0 1px 0.25rem 0 rgba(0, 0, 0, 0.1)",
    );
    expect(
      rowByName(rows, "$theme-utility-breakpoints-complete").default_value,
    ).toBe("map-collect((sm: 1, md: 2), $theme-utility-breakpoints)");
  });
});

describe("classifyCurtisTier: Nathan Curtis' system/theme/state vocabulary (ADR-0010), plus outlier buckets from ADR-0004/0006", () => {
  it("puts raw primitives in system", () => {
    expect(
      classifyCurtisTier({
        sourceTier: "system",
        basename: "_blue-cool.scss",
        component: "",
        concept: "blue-cool",
      }),
    ).toBe("system");
  });

  it("puts branding-role color settings in theme", () => {
    expect(
      classifyCurtisTier({
        sourceTier: "settings",
        basename: "_settings-color.scss",
        component: "",
        concept: "primary",
      }),
    ).toBe("theme");
  });

  it("puts feedback-role color settings in state", () => {
    expect(
      classifyCurtisTier({
        sourceTier: "settings",
        basename: "_settings-color.scss",
        component: "",
        concept: "error",
      }),
    ).toBe("state");
  });

  it("puts non-color design settings (typography, spacing, general) in theme — no state equivalent exists", () => {
    expect(
      classifyCurtisTier({
        sourceTier: "settings",
        basename: "_settings-typography.scss",
        component: "",
        concept: "",
      }),
    ).toBe("theme");
  });

  it("puts $theme-{component}-* settings in component (ADR-0004), even for a color property", () => {
    expect(
      classifyCurtisTier({
        sourceTier: "settings",
        basename: "_settings-components.scss",
        component: "accordion",
        concept: "",
      }),
    ).toBe("component");
  });

  it("puts utility-generator config in config — ADR-0006 §3 says it is not a design token at all", () => {
    expect(
      classifyCurtisTier({
        sourceTier: "settings",
        basename: "_settings-utilities.scss",
        component: "",
        concept: "",
      }),
    ).toBe("config");
  });

  it("puts generated lookup/alias maps in internal, even though the file lives under tokens/", () => {
    expect(
      classifyCurtisTier({
        sourceTier: "system",
        basename: "shortcodes-color-theme.scss",
        component: "",
        concept: "",
      }),
    ).toBe("internal");
  });

  it("puts the variables/ glue layer and uswds-core helper files in internal", () => {
    expect(
      classifyCurtisTier({
        sourceTier: "variables",
        basename: "type-scale.scss",
        component: "",
        concept: "",
      }),
    ).toBe("internal");
    expect(
      classifyCurtisTier({
        sourceTier: "other",
        basename: "_defaults.scss",
        component: "",
        concept: "",
      }),
    ).toBe("internal");
  });

  it("puts usa-*/ component-package-local variables in local — distinct from ADR-0004's component tier despite the shared name", () => {
    expect(
      classifyCurtisTier({
        sourceTier: "component",
        basename: "_usa-accordion.scss",
        component: "accordion",
        concept: "",
      }),
    ).toBe("local");
  });

  it("end-to-end: a color-family map from tokens/ lands in system", () => {
    const src = `$system-color-blue-cool: (10: #dae9ee);`;
    const { rows } = processFile(src, fileMeta, componentVocab);
    expect(rowByName(rows, "$system-color-blue-cool-10").tier).toBe("system");
  });

  it("end-to-end: a component-package-local variable lands in local, not the ADR-0004 component tier", () => {
    const src = `$icon-width: 3;`;
    const localFileMeta = {
      rel: "packages/usa-input-prefix-suffix/src/styles/_usa-input-prefix-suffix.scss",
      sourceTier: "component",
      basename: "_usa-input-prefix-suffix.scss",
    };
    const { rows } = processFile(src, localFileMeta, componentVocab);
    expect(rowByName(rows, "$icon-width").tier).toBe("local");
  });
});

describe("classifyName: category vocabulary, informed by the original CSVs' established groupings", () => {
  const vocab = new Set();

  it("classifies a two-word category phrase as category, not the equal-or-shorter property match (box-shadow, flex-direction, flex-wrap)", () => {
    expect(
      classifyName("system-properties-box-shadow-standard-1", vocab).populated
        .category,
    ).toBe("box-shadow");
    expect(
      classifyName("system-properties-flex-direction-row", vocab).populated
        .category,
    ).toBe("flex-direction");
    expect(
      classifyName("system-properties-flex-wrap-wrap", vocab).populated
        .category,
    ).toBe("flex-wrap");
  });

  it("classifies settings-only categories the legacy CSV had but this classifier originally lacked", () => {
    expect(classifyName("theme-focus-width", vocab).populated.category).toBe(
      "focus",
    );
    expect(classifyName("theme-column-gap-sm", vocab).populated.category).toBe(
      "column-gap",
    );
    expect(
      classifyName("theme-site-margins-max-width", vocab).populated.category,
    ).toBe("site-margins");
    expect(
      classifyName("theme-lead-font-family", vocab).populated.category,
    ).toBe("lead");
  });

  it("classifies typeface metadata rows under a typeface category instead of leaving them blank", () => {
    expect(
      classifyName("system-typeface-tokens-georgia-cap-height", vocab).populated
        .category,
    ).toBe("typeface");
  });

  it("leaves flat color shortcodes (namespace=color) without a category, matching the original CSVs' own convention — concept still carries the family", () => {
    const cls = classifyName("color-blue-warm-60v", vocab);
    expect(cls.namespace).toBe("color");
    expect(cls.populated.category).toBeUndefined();
    expect(cls.populated.concept).toBe("blue-warm");
  });
});
