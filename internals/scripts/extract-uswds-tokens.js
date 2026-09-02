#!/usr/bin/env node
// AST-based inventory of every SCSS variable/token in an uswds checkout.
//
// Unlike a regex scrape, structural boundaries (where a declaration starts/ends, whether
// a `$var` sits in module scope or inside a mixin/function/loop) are found by tracking
// brace depth and paren/bracket depth over the token stream, and map-shaped values are
// parsed into a real tree so nested maps (e.g. a color family's `vivid` sub-map) flatten
// into distinctly-named rows instead of colliding under one name.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const HEADER = [
  "token_name",
  "default_value",
  "source_file",
  "tier",
  "source_tier",
  "formula",
  "namespace",
  "category",
  "concept",
  "property",
  "component",
  "element",
  "variant",
  "state",
  "scale",
  "mode",
  "collisions",
  "line",
  "disposition",
  "unmatched_segments",
];

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

export function walkScssFiles(root) {
  const results = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && entry.name.endsWith(".scss"))
        results.push(full);
    }
  }
  return results.sort();
}

export function buildComponentVocab(packagesRoot) {
  const vocab = new Set();
  let entries;
  try {
    entries = fs.readdirSync(packagesRoot, { withFileTypes: true });
  } catch {
    return vocab;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    let name = entry.name;
    if (name.startsWith("_usa-")) name = name.slice(5);
    else if (name.startsWith("usa-")) name = name.slice(4);
    else continue;
    vocab.add(name);
  }
  return vocab;
}

// Where in the file tree a declaration lives — a structural signal, distinct
// from `tier` below (Curtis' system/theme/state vocabulary), which is a
// semantic classification of what the token *means*.
export function classifyFile(absPath, sourceRoot) {
  const rel = path.relative(sourceRoot, absPath).split(path.sep).join("/");
  const parts = rel.split("/");
  const packageName = parts[1] || "";
  const inCore = packageName === "uswds-core";
  let sourceTier;
  if (rel.includes("/settings/")) sourceTier = "settings";
  else if (rel.includes("/variables/")) sourceTier = "variables";
  else if (
    rel.includes("/tokens/") ||
    path.basename(rel) === "_properties.scss"
  )
    sourceTier = "system";
  else if (inCore) sourceTier = "other";
  else sourceTier = "component";
  return { rel, packageName, sourceTier, basename: path.basename(rel) };
}

// ---------------------------------------------------------------------------
// Comment masking — replaced with same-length whitespace so every later scan
// (structural and map-parsing) can ignore comments without separately
// special-casing them, and stray punctuation/quotes inside a comment (e.g.
// an apostrophe in English prose) can never desync depth/string tracking.
// ---------------------------------------------------------------------------

export function maskComments(source) {
  const out = [];
  let i = 0;
  const n = source.length;
  while (i < n) {
    const c = source[i];
    if (c === "'" || c === '"') {
      const quote = c;
      out.push(c);
      i++;
      while (i < n) {
        const ch = source[i];
        if (ch === "\\" && i + 1 < n) {
          out.push(ch, source[i + 1]);
          i += 2;
          continue;
        }
        out.push(ch);
        i++;
        if (ch === quote) break;
      }
      continue;
    }
    if (c === "/" && source[i + 1] === "/") {
      while (i < n && source[i] !== "\n") {
        out.push(" ");
        i++;
      }
      continue;
    }
    if (c === "/" && source[i + 1] === "*") {
      out.push(" ", " ");
      i += 2;
      while (i < n && !(source[i] === "*" && source[i + 1] === "/")) {
        out.push(source[i] === "\n" ? "\n" : " ");
        i++;
      }
      if (i < n) {
        out.push(" ", " ");
        i += 2;
      }
      continue;
    }
    out.push(c);
    i++;
  }
  return out.join("");
}

function buildLineIndex(text) {
  const offsets = [0];
  for (let k = 0; k < text.length; k++) {
    if (text[k] === "\n") offsets.push(k + 1);
  }
  return (offset) => {
    let lo = 0;
    let hi = offsets.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (offsets[mid] <= offset) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
}

// ---------------------------------------------------------------------------
// Structural scan: `{ }` is the only real scope delimiter in Sass (maps/lists
// use `( )`, which is grouping, not scope), so brace-depth alone separates
// module-level declarations from ones local to a mixin/function/loop/rule —
// no need to understand Sass control flow beyond @if/@else, which stay
// "capturable" since conditional settings overrides are a real top-level
// pattern in this codebase.
// ---------------------------------------------------------------------------

const AT_IF_KEYWORDS = new Set(["if", "else"]);

export function scanFile(masked) {
  const lineAt = buildLineIndex(masked);
  const rows = [];
  const n = masked.length;
  let i = 0;
  const frameStack = [];
  let pendingAt = null;
  // Tracked at the outer scan level too (not just inside a captured value)
  // so a `$name: default` inside a @function/@mixin parameter list or an
  // `@include foo($key: value)` call — both legal outside any `{ }` — is
  // never mistaken for a module-level declaration.
  let parenDepth = 0;
  let bracketDepth = 0;

  const isCapture = () =>
    frameStack.every((f) => f === "if") &&
    parenDepth === 0 &&
    bracketDepth === 0;

  function readIdent() {
    const start = i;
    while (i < n && /[A-Za-z0-9_-]/.test(masked[i])) i++;
    return masked.slice(start, i);
  }

  function skipString() {
    const quote = masked[i];
    i++;
    while (i < n) {
      if (masked[i] === "\\") {
        i += 2;
        continue;
      }
      if (masked[i] === quote) {
        i++;
        break;
      }
      i++;
    }
  }

  while (i < n) {
    const c = masked[i];

    if (/\s/.test(c)) {
      i++;
      continue;
    }

    if (c === "'" || c === '"') {
      skipString();
      continue;
    }

    if (c === "@") {
      i++;
      pendingAt = readIdent().toLowerCase();
      continue;
    }

    if (c === "{") {
      frameStack.push(
        pendingAt && AT_IF_KEYWORDS.has(pendingAt) ? "if" : "local",
      );
      pendingAt = null;
      i++;
      continue;
    }

    if (c === "}") {
      frameStack.pop();
      pendingAt = null;
      i++;
      continue;
    }

    if (c === ";") {
      pendingAt = null;
      i++;
      continue;
    }

    if (c === "(") {
      parenDepth++;
      i++;
      continue;
    }

    if (c === ")") {
      parenDepth = Math.max(0, parenDepth - 1);
      i++;
      continue;
    }

    if (c === "[") {
      bracketDepth++;
      i++;
      continue;
    }

    if (c === "]") {
      bracketDepth = Math.max(0, bracketDepth - 1);
      i++;
      continue;
    }

    if (c === "$" && isCapture()) {
      const declStart = i;
      i++;
      const name = "$" + readIdent();
      while (i < n && /\s/.test(masked[i])) i++;
      if (masked[i] === ":") {
        i++;
        while (i < n && /\s/.test(masked[i])) i++;
        const valueStart = i;
        let parenDepth = 0;
        let bracketDepth = 0;
        while (i < n) {
          const ch = masked[i];
          if (ch === "'" || ch === '"') {
            skipString();
            continue;
          }
          if (ch === "(") {
            parenDepth++;
            i++;
            continue;
          }
          if (ch === ")") {
            parenDepth--;
            i++;
            continue;
          }
          if (ch === "[") {
            bracketDepth++;
            i++;
            continue;
          }
          if (ch === "]") {
            bracketDepth--;
            i++;
            continue;
          }
          if (ch === ";" && parenDepth <= 0 && bracketDepth <= 0) break;
          if (ch === "{" || ch === "}") break;
          i++;
        }
        let valueText = masked.slice(valueStart, i).trim();
        let hasDefault = false;
        let hasGlobal = false;
        const flagRe = /!\s*(default|global)\s*$/i;
        let m;
        while ((m = flagRe.exec(valueText))) {
          if (m[1].toLowerCase() === "default") hasDefault = true;
          else hasGlobal = true;
          valueText = valueText.slice(0, m.index).trim();
        }
        rows.push({
          name,
          valueText,
          line: lineAt(declStart),
          hasDefault,
          hasGlobal,
          conditional: frameStack.length > 0,
        });
        if (masked[i] === ";") i++;
        continue;
      }
      continue;
    }

    if (/[A-Za-z_]/.test(c)) {
      readIdent();
      continue;
    }

    i++;
  }

  return rows;
}

// ---------------------------------------------------------------------------
// Map-literal parsing, for flattening nested Sass maps into synthetic rows.
// ---------------------------------------------------------------------------

function splitTopLevel(text, sepChars) {
  const parts = [];
  let depth = 0;
  let current = "";
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (c === "'" || c === '"') {
      const quote = c;
      current += c;
      i++;
      while (i < n) {
        if (text[i] === "\\" && i + 1 < n) {
          current += text[i] + text[i + 1];
          i += 2;
          continue;
        }
        current += text[i];
        if (text[i] === quote) {
          i++;
          break;
        }
        i++;
      }
      continue;
    }
    if (c === "(" || c === "[") {
      depth++;
      current += c;
      i++;
      continue;
    }
    if (c === ")" || c === "]") {
      depth--;
      current += c;
      i++;
      continue;
    }
    if (depth === 0 && sepChars.includes(c)) {
      parts.push(current);
      current = "";
      i++;
      continue;
    }
    current += c;
    i++;
  }
  parts.push(current);
  return parts.map((p) => p.trim()).filter((p) => p.length > 0);
}

function splitFirstTopLevelColon(text) {
  let depth = 0;
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (c === "'" || c === '"') {
      const quote = c;
      i++;
      while (i < n) {
        if (text[i] === "\\") {
          i += 2;
          continue;
        }
        if (text[i] === quote) {
          i++;
          break;
        }
        i++;
      }
      continue;
    }
    if (c === "(" || c === "[") {
      depth++;
      i++;
      continue;
    }
    if (c === ")" || c === "]") {
      depth--;
      i++;
      continue;
    }
    if (c === ":" && depth === 0) {
      return [text.slice(0, i).trim(), text.slice(i + 1).trim()];
    }
    i++;
  }
  return null;
}

export function tryParseMap(text) {
  const t = text.trim();
  if (!(t.startsWith("(") && t.endsWith(")"))) return null;
  let depth = 0;
  for (let i = 0; i < t.length; i++) {
    if (t[i] === "(") depth++;
    else if (t[i] === ")") {
      depth--;
      if (depth === 0 && i !== t.length - 1) return null;
    }
  }
  const inner = t.slice(1, -1).trim();
  if (inner.length === 0) return { kind: "map", entries: [] };
  const entryTexts = splitTopLevel(inner, ",");
  const entries = [];
  for (const entryText of entryTexts) {
    const kv = splitFirstTopLevelColon(entryText);
    if (!kv) return null;
    entries.push({ rawKey: kv[0], rawValue: kv[1] });
  }
  return { kind: "map", entries };
}

function sanitizeKeySegment(rawKey) {
  let k = rawKey.trim();
  if (
    (k.startsWith('"') && k.endsWith('"')) ||
    (k.startsWith("'") && k.endsWith("'"))
  ) {
    k = k.slice(1, -1);
  }
  return k;
}

export function flattenMapEntries(
  baseNameNoDollar,
  mapNode,
  basePathSegments,
  out,
) {
  for (const { rawKey, rawValue } of mapNode.entries) {
    const childPath = [...basePathSegments, sanitizeKeySegment(rawKey)];
    const nested = tryParseMap(rawValue);
    if (nested && nested.entries.length > 0) {
      flattenMapEntries(baseNameNoDollar, nested, childPath, out);
    } else {
      out.push({
        tokenName: "$" + baseNameNoDollar + "-" + childPath.join("-"),
        defaultValue: rawValue,
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Classification — documented, mechanical vocabulary matching. Deliberately
// not a reproduction of the lost legacy extractor (which was an undocumented,
// lossy per-segment dictionary match): unmatched segments are recorded, not
// silently dropped, so this classifier's gaps are visible.
// ---------------------------------------------------------------------------

const KNOWN_NAMESPACES = new Set(["theme", "system", "color"]);

const CSS_PROPERTY_WORDS = new Set([
  "color",
  "background-color",
  "background",
  "border-color",
  "border-radius",
  "border-style",
  "border-width",
  "border",
  "font-family",
  "font-size",
  "font-style",
  "font-weight",
  "line-height",
  "letter-spacing",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "width",
  "height",
  "max-width",
  "max-height",
  "min-width",
  "min-height",
  "top",
  "right",
  "bottom",
  "left",
  "z-index",
  "opacity",
  "box-shadow",
  "order",
  "flex",
  "flex-direction",
  "flex-wrap",
  "gap",
  "justify-content",
  "align-items",
  "align-self",
  "text-color",
  "text-align",
  "text-transform",
  "vertical-align",
  "white-space",
  "cursor",
  "display",
  "overflow",
  "float",
  "outline",
  "outline-color",
  "stroke-width",
  "family",
  "typeset",
  "icon-size",
  "bar-width",
  "path",
  "use",
  "style",
  "separator",
  "offset",
  "container",
  "breakpoint",
  "size",
]);
const VARIANT_WORDS = new Set([
  "sm",
  "md",
  "lg",
  "xs",
  "xl",
  "2xs",
  "3xs",
  "2xl",
  "3xl",
  "small",
  "medium",
  "large",
]);
const STATE_WORDS = new Set([
  "hover",
  "active",
  "visited",
  "disabled",
  "focus",
  "reverse",
]);
const MODE_WORDS = new Set([
  "lightest",
  "lighter",
  "light",
  "dark",
  "darker",
  "darkest",
  "vivid",
]);
const CATEGORY_WORDS = new Set([
  "color",
  "font",
  "spacing",
  "type-scale",
  "line-height",
  "letter-spacing",
  "z-index",
  "opacity",
  "shadow",
  "order",
  "flex",
  "gap",
  "layout",
  "grid",
  "border-radius",
  "breakpoint",
  "measure",
  "column",
  "utilities",
  "general",
  "typography",
]);
const CONCEPT_WORDS = new Set([
  "blue",
  "blue-cool",
  "blue-warm",
  "red",
  "red-cool",
  "red-warm",
  "cyan",
  "gold",
  "gray",
  "gray-cool",
  "gray-warm",
  "green",
  "green-cool",
  "green-warm",
  "indigo",
  "indigo-cool",
  "indigo-warm",
  "magenta",
  "mint",
  "mint-cool",
  "orange",
  "orange-warm",
  "violet",
  "violet-warm",
  "yellow",
  "black-transparent",
  "white-transparent",
  "base",
  "primary",
  "secondary",
  "accent-warm",
  "accent-cool",
  "accent",
  "error",
  "warning",
  "success",
  "info",
  "disabled",
  "emergency",
]);
const ELEMENT_WORDS = new Set([
  "button",
  "icon",
  "header",
  "flag",
  "counter",
  "link",
  "label",
  "content",
  "field",
  "group",
  "list",
  "item",
  "panel",
]);

const VOCAB_BY_COLUMN = {
  category: CATEGORY_WORDS,
  concept: CONCEPT_WORDS,
  property: CSS_PROPERTY_WORDS,
  element: ELEMENT_WORDS,
  variant: VARIANT_WORDS,
  state: STATE_WORDS,
  mode: MODE_WORDS,
};
const CLASSIFY_COLUMN_ORDER = [
  "component",
  "category",
  "concept",
  "property",
  "element",
  "variant",
  "state",
  "mode",
];
const FORMULA_COLUMN_ORDER = [
  "component",
  "category",
  "concept",
  "property",
  "element",
  "state",
  "variant",
  "scale",
  "mode",
];

export function classifyName(nameNoDollar, componentVocab) {
  const allSegments = nameNoDollar.split("-").filter(Boolean);
  if (allSegments.length === 0) {
    return { namespace: "", populated: {}, unmatched: [], formula: "" };
  }
  let namespace = "";
  let segments = allSegments.slice(1);
  if (KNOWN_NAMESPACES.has(allSegments[0])) {
    namespace = allSegments[0];
  } else {
    segments = allSegments;
  }

  const populated = {};
  const unmatched = [];
  let i = 0;
  while (i < segments.length) {
    if (
      !populated.scale &&
      /^\d/.test(segments[i]) &&
      /^\d+[a-z]*$/i.test(segments[i])
    ) {
      populated.scale = segments[i];
      i++;
      continue;
    }
    let matched = false;
    for (
      let len = Math.min(3, segments.length - i);
      len >= 1 && !matched;
      len--
    ) {
      const phrase = segments.slice(i, i + len).join("-");
      for (const col of CLASSIFY_COLUMN_ORDER) {
        if (populated[col]) continue;
        const vocab =
          col === "component" ? componentVocab : VOCAB_BY_COLUMN[col];
        if (vocab && vocab.has(phrase)) {
          populated[col] = phrase;
          i += len;
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      unmatched.push(segments[i]);
      i++;
    }
  }

  const formulaParts = [];
  if (namespace) formulaParts.push("namespace");
  for (const col of FORMULA_COLUMN_ORDER) {
    if (populated[col]) formulaParts.push(col);
  }

  return { namespace, populated, unmatched, formula: formulaParts.join(".") };
}

const COLLISION_COLUMNS = [
  "category",
  "concept",
  "property",
  "component",
  "element",
  "variant",
  "state",
  "mode",
];

export function computeCollisions(rows) {
  const wordRoles = new Map();
  for (const row of rows) {
    for (const col of COLLISION_COLUMNS) {
      const word = row[col];
      if (!word) continue;
      if (!wordRoles.has(word)) wordRoles.set(word, new Set());
      wordRoles.get(word).add(col);
    }
  }
  for (const row of rows) {
    const parts = [];
    for (const col of COLLISION_COLUMNS) {
      const word = row[col];
      if (!word) continue;
      const roles = wordRoles.get(word);
      if (roles.size > 1) {
        const others = [...roles].filter((r) => r !== col);
        parts.push(`${word}:${col}/${others.join(",")}`);
      }
    }
    row.collisions = parts.join("; ");
  }
}

// ---------------------------------------------------------------------------
// Disposition tagging — scope/relevance signal per ADR-0006/0009, additive to
// the legacy 16-column schema so nothing is silently excluded from a
// "comprehensive" inventory.
// ---------------------------------------------------------------------------

const GENERATED_LOOKUP_FILES = new Set([
  "system-colors.scss",
  "shortcodes-color-project.scss",
  "shortcodes-color-theme.scss",
  "shortcodes-color-state.scss",
  "shortcodes-color-all.scss",
  "assignments-theme-color.scss",
  "high-contrast-mode-colors.scss",
  "_global.scss",
]);

export function tagDisposition({
  sourceTier,
  basename,
  isMapContainer,
  isConditional,
}) {
  const tags = [];
  if (sourceTier === "settings" && basename === "_settings-utilities.scss")
    tags.push("utility-generator-config");
  else if (sourceTier === "system" && GENERATED_LOOKUP_FILES.has(basename))
    tags.push("generated-lookup-map");
  else if (sourceTier === "variables") tags.push("derived-glue");
  else if (sourceTier === "component") tags.push("component-local");
  else if (sourceTier === "other") tags.push("internal-helper");
  else tags.push("design-token");
  if (isMapContainer) tags.push("map-container");
  if (isConditional) tags.push("conditional");
  return tags.join("|");
}

// ---------------------------------------------------------------------------
// Tier — Nathan Curtis' taxonomy as adopted by USWDS's own token architecture
// (ADR-0010 Decision 3): every token is system, theme, or state. `system` is
// the raw primitive scale; `theme` is a branding role (base, primary,
// secondary, accent-warm/cool, emergency) or another global design decision
// (type scale, spacing, focus styles — no "state" equivalent exists for
// these); `state` is a feedback role (error, warning, success, info,
// disabled). Two more buckets cover what doesn't fit that 3-tier model,
// matching decisions the migration ADRs already made rather than inventing
// new ones: `component` for the `$theme-{component}-*` rows ADR-0004 gives
// their own tier, and `config`/`internal` for what ADR-0006 explicitly
// excludes from the token package (utility-generator config; generated
// lookup/alias maps and other non-token Sass plumbing). `local` covers
// genuinely local variables inside the 74 usa-* component packages — layout
// math confirmed by source inspection to not be tokens at all, and distinct
// from ADR-0004's settings-driven "component" tier despite the name overlap.
// ---------------------------------------------------------------------------

const FEEDBACK_ROLE_WORDS = new Set([
  "error",
  "warning",
  "success",
  "info",
  "disabled",
]);

export function classifyCurtisTier({
  sourceTier,
  basename,
  component,
  concept,
}) {
  if (GENERATED_LOOKUP_FILES.has(basename)) return "internal";
  if (sourceTier === "system") return "system";
  if (sourceTier === "variables") return "internal";
  if (sourceTier === "other") return "internal";
  if (sourceTier === "component") return "local";
  // sourceTier === "settings" from here down
  if (basename === "_settings-utilities.scss") return "config";
  if (component) return "component";
  if (basename === "_settings-color.scss" && FEEDBACK_ROLE_WORDS.has(concept))
    return "state";
  return "theme";
}

// ---------------------------------------------------------------------------
// Row assembly
// ---------------------------------------------------------------------------

// Collapsed to single-line so every CSV row occupies exactly one line (multi-line
// Sass values otherwise embed a literal newline, valid per RFC 4180 but hostile to
// line-based tools like grep/wc/awk); content is preserved, only whitespace runs shrink.
function normalizeWs(text) {
  return text.replace(/\s+/g, " ").trim();
}

export function buildRow(
  tokenName,
  defaultValue,
  commonMeta,
  fileMeta,
  isMapContainer,
  componentVocab,
) {
  const cls = classifyName(tokenName.slice(1), componentVocab);
  const component = cls.populated.component || "";
  const concept = cls.populated.concept || "";
  return {
    token_name: normalizeWs(tokenName),
    default_value: normalizeWs(defaultValue),
    source_file: commonMeta.sourceFile,
    tier: classifyCurtisTier({
      sourceTier: commonMeta.sourceTier,
      basename: fileMeta.basename,
      component,
      concept,
    }),
    source_tier: commonMeta.sourceTier,
    formula: cls.formula,
    namespace: cls.namespace,
    category: cls.populated.category || "",
    concept,
    property: cls.populated.property || "",
    component,
    element: cls.populated.element || "",
    variant: cls.populated.variant || "",
    state: cls.populated.state || "",
    scale: cls.populated.scale || "",
    mode: cls.populated.mode || "",
    collisions: "",
    line: commonMeta.line,
    disposition: tagDisposition({
      sourceTier: commonMeta.sourceTier,
      basename: fileMeta.basename,
      isMapContainer,
      isConditional: commonMeta.conditional,
    }),
    unmatched_segments: cls.unmatched.join(" "),
  };
}

export function processFile(sourceText, fileMeta, componentVocab) {
  const masked = maskComments(sourceText);
  const decls = scanFile(masked);
  const rows = [];
  for (const decl of decls) {
    const baseNameNoDollar = decl.name.slice(1);
    const mapNode = tryParseMap(decl.valueText);
    const isMap = Boolean(mapNode && mapNode.entries.length > 0);
    const commonMeta = {
      sourceFile: fileMeta.rel,
      sourceTier: fileMeta.sourceTier,
      line: decl.line,
      conditional: decl.conditional,
    };
    if (isMap) {
      rows.push(
        buildRow(
          decl.name,
          decl.valueText,
          commonMeta,
          fileMeta,
          true,
          componentVocab,
        ),
      );
      const leafRows = [];
      flattenMapEntries(baseNameNoDollar, mapNode, [], leafRows);
      for (const leaf of leafRows) {
        rows.push(
          buildRow(
            leaf.tokenName,
            leaf.defaultValue,
            commonMeta,
            fileMeta,
            false,
            componentVocab,
          ),
        );
      }
    } else {
      rows.push(
        buildRow(
          decl.name,
          decl.valueText,
          commonMeta,
          fileMeta,
          false,
          componentVocab,
        ),
      );
    }
  }
  return { rows, declCount: decls.length };
}

// ---------------------------------------------------------------------------
// CSV output
// ---------------------------------------------------------------------------

function csvField(value) {
  const s = value === undefined || value === null ? "" : String(value);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

export function toCsvLine(fields) {
  return fields.map(csvField).join(",");
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { source: path.join(os.homedir(), "devspace", "uswds") };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--source") args.source = argv[++i];
  }
  return args;
}

function main() {
  const { source } = parseArgs(process.argv.slice(2));
  const packagesRoot = path.join(source, "packages");
  if (!fs.existsSync(packagesRoot)) {
    console.error(`Cannot find packages/ under ${source}`);
    process.exit(1);
  }

  const files = walkScssFiles(packagesRoot);
  const componentVocab = buildComponentVocab(packagesRoot);

  const allRows = [];
  let parseFailures = 0;
  let totalDeclsFound = 0;

  for (const absPath of files) {
    const fileMeta = classifyFile(absPath, source);
    let sourceText;
    try {
      sourceText = fs.readFileSync(absPath, "utf8");
    } catch (err) {
      console.error(`Failed to read ${fileMeta.rel}: ${err.message}`);
      parseFailures++;
      continue;
    }
    try {
      const { rows, declCount } = processFile(
        sourceText,
        fileMeta,
        componentVocab,
      );
      totalDeclsFound += declCount;
      allRows.push(...rows);
    } catch (err) {
      console.error(`Failed to parse ${fileMeta.rel}: ${err.message}`);
      parseFailures++;
    }
  }

  computeCollisions(allRows);

  const outDir = path.join(process.cwd(), "plans", "token-migration");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "uswds-tokens-inventory-full.csv");
  const lines = [toCsvLine(HEADER)];
  for (const row of allRows) {
    lines.push(toCsvLine(HEADER.map((col) => row[col])));
  }
  fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf8");

  const byTier = {};
  const byDisposition = {};
  for (const row of allRows) {
    byTier[row.tier] = (byTier[row.tier] || 0) + 1;
    byDisposition[row.disposition] = (byDisposition[row.disposition] || 0) + 1;
  }

  console.log(`Scanned ${files.length} .scss files under ${packagesRoot}`);
  console.log(`Module-level declarations captured: ${totalDeclsFound}`);
  console.log(`Output rows (incl. flattened map leaves): ${allRows.length}`);
  console.log(`Parse failures: ${parseFailures}`);
  console.log("By tier:", byTier);
  console.log("By disposition:", byDisposition);
  console.log(`Wrote ${outPath}`);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === new URL(import.meta.url).pathname;
if (isMain) {
  main();
}
