# Plan: Style Dictionary as the USWDS Token Source of Truth

> **Amendment (2026-07-21, ADR-0010):** The token layout is now **tier-first**
> (`tokens/<tier>/<category>/…` with tiers `system`/`theme`/`state`), not the category-first
> `tokens/{colors,spacing,breakpoints}/*.json` this plan originally described. Exports are
> **per-tier-per-category** (`@uswds/tokens/system/color`, `theme/color`, `state/color`, …);
> theme/state emit **references** (`var()`/`$var`) chained `system ← theme ← state`; every token
> carries `$extensions.uswds` meta (`tier`, `legacyName` keyed object, plus `formula`/`disabled`);
> the tier does **not** appear in token names. The semantic tier (ADR-0003) lands in `theme/`/`state/`
> rather than a `semantic/` directory: branding-role tokens (base, primary, secondary, accent,
> emergency) live in `tokens/theme/color/*.json` and feedback-role tokens (error, warning, success,
> info, disabled) live in `tokens/state/color/*.json`, one file per role. Where this plan says
> `tokens/colors/*.json`, `tokens/utility/*`, `tokens/typography/*`, `tokens/grid/*`, read the
> equivalent `tokens/system/<category>/…` (note: color family files currently live at
> `tokens/colors/*.json` until P1-PR0 restructure).
> ADR-0010 is authoritative on structure, exports, and metadata.

## Context

The token inventory of USWDS core is complete and classified per Nathan Curtis' naming taxonomy:

- [`uswds-settings-tokens.csv`](uswds-settings-tokens.csv) — ~508 settings (`$theme-*`) tokens; 174 of them are utility-generator configuration, not design tokens (see ADR-0006)
- [`uswds-system-tokens.csv`](uswds-system-tokens.csv) — ~1,100 system tokens (color families, spacing, type scale)
- [`uswds-properties-tokens.csv`](uswds-properties-tokens.csv) — Batch 3, ~144 utility-scale tokens: z-index, opacity, box-shadow, order, flex/flex-direction/flex-wrap, gap, letter-spacing, per-typeface line-height, and the 12-column grid fraction scale. Extracted from `uswds-core/src/styles/_properties.scss` (the `$system-properties` map) and `tokens/units/layout-grid-widths.scss` — neither is under `settings/` or `tokens/`'s simple-map files, so the regex-based extractor used for the other two CSVs can't safely resolve them (nested function-call values like `rgba(0, 0, 0, 0.1)` and `#{$neg-prefix}` key interpolation break it). This batch was extracted with `internals/scripts/extract-properties.js`, which compiles the real USWDS source with dart-sass and reads resolved values directly from the compiler instead of parsing SCSS text. The same fix cleaned up `uswds-system-tokens.csv`'s previously-corrupted negative-spacing rows (`neg-*`, was one garbled ~900-character row, now 16 clean entries).

> **Amendment (2026-09-01):** the three batch counts above, and `internals/scripts/extract-properties.js`
> itself, turned out not to exist in this repo's history — no such script was ever committed (checked
> across all branches/reflog in both this repo and the upstream `uswds` checkout). The counts were
> apparently produced by hand or by a script that was run locally and never captured, and the three
> CSVs carry real bugs from that: `uswds-system-tokens.csv` undercounts because of the documented
> 202-duplicate-name bug (see PR 2) and separately mis-parses `shortcodes-color-basic.scss` into 14
> corrupted rows; `uswds-properties-tokens.csv` captures only 12 of the real 60 per-typeface
> line-height entries. A new **AST-based** extractor, `internals/scripts/extract-uswds-tokens.js`
> (comprehensive — scans `~/devspace/uswds/packages/**/*.scss`, not just uswds-core's curated subset),
> replaces the lost script and fixes these bugs structurally. Its output,
> [`uswds-tokens-inventory-full.csv`](uswds-tokens-inventory-full.csv), is additive — it does not
> replace the three batch CSVs above, which stay as historical Phase-1-planning input — but it is the
> more trustworthy source for real counts. Measured from it: **574** settings-tier rows (232 of them
> utility-generator config, not 174), **2,124** system-tier rows excluding generated-lookup maps (not
> ~1,100), **156** `_settings-components.scss` rows (not 152), and **60** per-typeface line-height
> entries — 9 typeface groups (`sans/serif/mono/cond/heading/ui/body/code/alt`) × 6 steps = 54, plus a
> separate 6-entry `extended` scale — not the 12 the old CSV carried, and not even the 36 (6 groups)
> pr-05 originally planned for. See `uswds-tokens-inventory-full.csv`'s `tier` column (Curtis'
> system/theme/state vocabulary, ADR-0010, plus `component`/`config`/`internal`/`local` for what
> doesn't fit) for the authoritative per-tier breakdown going forward.

This plan makes the Style Dictionary in `tokens/` the comprehensive source of truth for USWDS:

1. **CSS custom properties** for web components (`--usa-color-red-60v`, `--usa-button-*`)
2. **Generated SCSS** that USWDS core consumes in place of its hand-authored token files, with a translation layer so legacy names (`$red-60v`, `$theme-color-primary`) keep working while token semantics evolve
3. **npm-distributed tokens**, colors first
4. A **mode-aware semantic tier** so future dark-mode support doesn't fight the existing `-light*`/`-dark*` ramp names

Decisions with alternatives are recorded in [`adr/`](adr/README.md). Baseline recommendations
these ADRs build on are recorded in [design-system-token-research.md](adr/design-system-token-research.md),
which is itself pending team review — nothing here should be read as already accepted. The
audit/enforcement workstream is
[plan-02](plan-02-port-audit-enforce.md) and is folded into Phase 6. The tier-first structure,
per-tier-per-category exports, and `$extensions.uswds` metadata convention are recorded in
[ADR-0010](adr/0010-tier-first-structure-and-meta.md).

### Current state (summary)

**USWDS core** (`uswds/uswds`, `packages/uswds-core/src/styles/`) resolves tokens through a
3-layer chain: nested system maps (`$system-colors`, `$system-spacing`, `$system-type-scale`) →
flat `$theme-*` settings whose values are _string references_ (`"blue-60v"`, `"md"`, `6`) →
lookup functions (`color()`, `units()`, `radius()`, `family()`) over merged maps
(`$all-color-shortcodes`, `$project-spacing-standard`). ~600 flat shortcode scalars
(`$color-blue-60v` / `$red-60v`) bridge the nested maps to the string-keyed API. Spacing values
are computed from an 8px grid (`spacing-multiple()`); `false` is a sentinel in three roles
(ADR-0008).

**This repo** has Style Dictionary v5.1.1 with DTCG-format sources
(`tokens/{colors,spacing,breakpoints}/*.json`), custom transforms in
`internals/token-helpers/index.ts`, config in `config/style-dictionary.config.js`, and outputs
`build/css/*.css` + `build/scss/_*.scss` published via `@uswds/elements`' `./styles/*` export.
Current vivid naming is `--usa-color-red-vivid-60`; per ADR-0002 (amended 2026-07-21)
`vivid-{grade}` is the **canonical** form and `{grade}v` (e.g. `--usa-color-red-60v`) is
emitted as a legacy alias via a `var()` reference (both names supported, no rename).

---

## Phases

Each phase is a set of independently reviewable PRs. A phase's ADRs must be
Accepted before its PRs merge.

### Phase 0 — Decide

Team review of ADRs 0001–0009, all currently Proposed.

**Exit criteria:** all nine ADRs Accepted (or amended and Accepted).

### Phase 1 — Complete the primitive tier (ADR-0002, 0006, 0007)

Bring `tokens/` to full coverage of the system tier, sourced from `uswds-system-tokens.csv`:

- **Colors:** all 27 families, including gray grades 1–4; nonexistent `-90v` vivid slots omitted (ADR-0008); canonical `vivid-{grade}` names emitted with `{grade}v` legacy aliases kept alongside (ADR-0002 amended) via `internals/token-helpers/index.ts` + alias-emitting format
- **Spacing:** full computed scale — multiples (`05`…`15`), named (`card`, `card-lg`, `mobile`, `mobile-lg`, `tablet`, `desktop`, `widescreen`, …), negatives (`neg-*`), pixel literals (`1px`, `2px`) — each with `$extensions.uswds.formula` provenance (ADR-0007)
- **Typography:** `tokens/typography/` — type scale (1–20), line heights (1–6) plus the richer per-typeface combinations across all 9 real typeface groups (`sans-1..6`, `serif-1..6`, `mono-1..6`, `cond-1..6`, `heading-1..6`, `ui-1..6`, `body-1..6`, `code-1..6`, `alt-1..6` — 54 entries, not the 6-group/36-entry set originally listed here; see pr-05's amendment), plus the separate non-per-typeface `extended` 6-entry scale from the same map, letter-spacing including negatives (`ls-neg-1/2/3`), font stacks as `fontFamily` arrays, typeface metadata (display name, cap-height, stack) per ADR-0006; @font-face `src` maps stay out
- **Utility scale** (new, sourced from `uswds-properties-tokens.csv`, ADR-0009): sibling categories under `tokens/system/` (ADR-0010) — `z-index.json` (`auto, bottom:-100, 0, 100–500, top:99999`), `opacity.json` (`0–100` → `0`–`1`), `shadow.json` (box-shadow `none, 1–5`), `flex.json` (flex `1–12/fill/auto`, flex-direction, flex-wrap, order `first:-1, last:999, 0–11`), `gap.json` (column-gaps merged with `theme-column-gap-{sm,md,lg}`)
- **Grid** (new): `tokens/grid/layout-grid-widths.json` — 12-column fraction scale (`1/12 … 12/12`, from `tokens/units/layout-grid-widths.scss`)
- **Breakpoints:** re-expressed as aliases of named spacing tokens (matching `$system-breakpoints` being a slice of spacing)

**Negative values:** spacing negatives (`neg-*`), `z-index.bottom` (`-100`), `order.first` (`-1`), and `letter-spacing.ls-neg-{1,2,3}` all resolve to literal negative values, not a separate naming convention — see ADR-0009.

**PRs:** Phase 1 is decomposed into individual per-PR plan files in
[`prs/`](prs/). The 9 PRs are:

- [P1-PR 0](prs/pr-00-tier-first-restructure.md) — tier-first directory restructure (prerequisite for all others)
- [P1-PR 1](prs/pr-01-vivid-canonical-alias.md) — vivid `vivid-{grade}` canonical naming + `{grade}v` legacy alias emission
- [P1-PR 2](prs/pr-02-color-family-completion.md) — color family completion + `$extensions.uswds` metadata pass
- [P1-PR 3](prs/pr-03-dtcg-color-format.md) — DTCG 2025.10 color-format compliance (`$value` string → `{ colorSpace, components, hex }` object; transparent families emit exact `rgba()` via `alpha` member)
- [P1-PR 4](prs/pr-04-spacing-scale-formulas.md) — full spacing scale + formula provenance
- [P1-PR 5](prs/pr-05-typography-sources.md) — typography sources (type scale, line heights, letter-spacing, font stacks)
- [P1-PR 6](prs/pr-06-breakpoint-aliasing.md) — breakpoints re-expressed as aliases of named spacing
- [P1-PR 7](prs/pr-07-utility-scale.md) — utility scale tokens (z-index, opacity, shadow, flex, gap)
- [P1-PR 8](prs/pr-08-grid-widths.md) — 12-column grid width fraction scale

Each PR file contains scope, files touched, implementation steps, and a "Done when" checkbox gate.
Each runs `build:tokens` and commits output.

<!-- TODO: Phases 2–6 still need per-PR decomposition. Decompose each phase's PRs once
     its prerequisite ADRs are Accepted (per the merge gate on line 58–59). Track one
     decomposition task per phase; start with Phase 2 when ADR-0003 and ADR-0008 are
     confirmed Accepted. -->

**Verification:** script compares built flat output against `uswds-system-tokens.csv` values
(name→value equality; count reconciliation for the ~60 intentionally omitted/disabled rows).

### Phase 2 — Semantic tier (ADR-0003, 0008)

- Port the 86 `_settings-color.scss` tokens **preserving names** (`base`, `primary-lighter`, `error-dark`, …) as light-mode-fixed aliases of primitives, split by role into `tokens/theme/color/*.json` (branding roles: base, primary, secondary, accent-warm, accent-cool, emergency) and `tokens/state/color/*.json` (feedback roles: error, warning, success, info, disabled), one file per role per ADR-0010 Decision 1; disabled slots (`primary-lightest`, etc.) carry `$extensions.uswds.disabled` (ADR-0008)
- Add the **adaptive prominence tier** per role (`surface`, `surface-subtle`, `surface-strong`, `border`, `text`, `text-strong`, `on-{role}`) with light/dark primitive pairs and a `light-dark()` CSS transform; `color-scheme: light dark` in the emitted `:root` (ADR-0003). Dark values require design input — start with `base`/`primary`/`error` as the reference set, extend role-by-role
- Port non-color settings that are true design decisions (`$theme-type-scale-*`, `$theme-line-height-*`, `$theme-site-*` widths/margins, focus tokens) as alias tokens in their categories

**Verification:** built CSS for legacy semantic names byte-matches pre-phase output (no
regressions); adaptive tokens render `light-dark(var(--usa-color-…), var(--usa-color-…))`;
Storybook visual check of usa-alert/usa-link in forced dark scheme.

### Phase 3 — Component tier (ADR-0004)

- Generate the `$theme-{component}-*` → `--usa-{component}-*` migration table from the component rows in `uswds-settings-tokens.csv` (component/element/variant/state columns are populated; the CSV counted 152, `uswds-tokens-inventory-full.csv`'s more complete AST-based extraction counts 156 — see the amendment above); record non-1:1 cases (`navigation`/`megamenu` → `usa-header` internals) explicitly
- Create `tokens/components/{component}.json` for existing components first (alert, banner\*, link — extends [plan-02](plan-02-port-audit-enforce.md) PR 8), then per new component as built; values alias the adaptive tier where the mode-sensitivity driver applies, otherwise the theme/state tier token matching the CSV default's existing role reference (ADR-0004 Alias target)
- Update component CSS to consume component tokens without fallbacks (plan-02's pattern; usa-banner stays self-contained)

**Verification:** plan-02's `audit-token-names.js` cross-references `custom-elements.json`,
component CSS, and Style Dictionary output with zero violations.

### Phase 4 — SCSS translation layer for USWDS core (ADR-0005, 0006, 0007, 0008)

Custom Style Dictionary formats emit `dist/scss/uswds-core/` drop-in replacements:

1. Nested family maps + `$system-colors` merge
2. Flat shortcodes (`$color-blue-60v`, `$blue-60v`) + `$system-color-shortcodes` map
3. `$system-spacing`, `$system-type-scale`, `$system-line-height` maps (resolved values)
4. `_settings-*.scss` with `$theme-*: "<shortcode>" !default;` — values printed as _string references_ (preserving USWDS's theme-override contract), `false` for disabled slots
5. `_compat.scss` — legacy → canonical `$usa-*` aliases

**Round-trip verification (the gate for this phase):** compile USWDS core with generated files
substituted, diff the resulting CSS against a baseline build — differences must be
whitespace-only. Add this as a CI integration test (dart-sass compile of
`~/devspace/uswds` / a pinned uswds checkout).

**PRs:** one per format group above, each carrying its round-trip diff evidence; final PR proposes
the file-swap in the uswds repo.

### Phase 5 — Packaging (ADR-0001)

- Restructure into a standalone `@uswds/tokens` workspace: DTCG source + `dist/{css,scss,json}` with per-category exports (`./css/colors.css`, `./scss/colors`, `./json/colors.json`, `./scss/uswds-core/*`)
- Publish colors first (the npm color-tokens deliverable); other categories ship as Phases 1–4 land
- `@uswds/elements` consumes `@uswds/tokens`; its `./styles/*` export re-exports during a deprecation window
- Versioning policy: value change = minor, rename/removal = major, absorbed by the compat layer where possible

**Verification:** `npm pack` dry-run inspection; a scratch project installs the tarball and uses
`css/colors.css` + `json/colors.json` standalone.

### Phase 6 — Enforcement (plan-02, extended)

Everything from plan-02 (stylelint `custom-property-pattern`, `audit-token-names.js`,
`validate-tokens.js`), plus:

- Formula recompute check for `$extensions.uswds.formula` spacing values (ADR-0007)
- Rule: component CSS consumes adaptive-tier or theme/state-tier tokens, not legacy ramp names (allowlist for intentional exceptions)
- CSV↔dictionary reconciliation script from Phase 1 kept in CI so inventory and source can't drift silently

---

## Critical files

- `config/style-dictionary.config.js` — platforms, new formats/filters
- `internals/token-helpers/index.ts` — `generateTokenName` (`vivid`→`v`, `default` stripping), disabled-token filter, `light-dark()` transform
- `tokens/colors/*.json` (current; becomes `tokens/system/color/*.json` after P1-PR0), `tokens/theme/color/*.json` (new), `tokens/state/color/*.json` (new), `tokens/system/spacing/spacing.json` (current: `tokens/spacing/spacing.json`), `tokens/system/typography/*` (new; current: `tokens/typography/*`), `tokens/system/{z-index,opacity,shadow,flex,gap}/*.json` (new), `tokens/system/grid/layout-grid-widths.json` (new; current: `tokens/grid/layout-grid-widths.json`), `tokens/components/*.json` (new)
- `internals/formats/` (new) — uswds-core SCSS map/settings/shortcode formats
- `internals/scripts/expand-color-format.js` (new, P1-PR3) — deterministic hex→sRGB components transformer; run once and commit
- `plans/token-migration/uswds-{settings,system,properties}-tokens.csv` — migration source data (historical Batch 1–3 snapshots; see amendment above)
- `plans/token-migration/uswds-tokens-inventory-full.csv` — comprehensive AST-based re-extraction covering all of `packages/**/*.scss`, with corrected counts and a `tier` column carrying Curtis' system/theme/state vocabulary (plus `component`/`config`/`internal`/`local` for what doesn't fit); the more trustworthy source going forward
- `internals/scripts/extract-uswds-tokens.js` — the AST-based extractor that produces the file above (replaces the never-committed `internals/scripts/extract-properties.js`)
- USWDS core targets (Phase 4 swap): `packages/uswds-core/src/styles/tokens/color/*`, `tokens/units/spacing.scss`, `tokens/font/*`, `settings/_settings-color.scss` et al.

> **Note on `spacing.205`:** this token (`1.25rem`, grid-base × 2.5) is owned by P1-PR 4
> (the full spacing scale). plan-02 P2-PR 2 references it as a dependency — it must not
> independently add `spacing.205` at the old `tokens/spacing/spacing.json` path.

## Overall verification

1. `npm run build:tokens` green at every PR; built artifacts committed
2. CSV reconciliation: every non-excluded inventory row maps to a dictionary token or a recorded disposition (disabled / out-of-scope / superseded)
3. Round-trip: USWDS core compiled with generated SCSS diffs clean against baseline CSS
4. Storybook/e2e visual checks for components in light and forced-dark schemes
5. Packed `@uswds/tokens` consumable standalone (CSS-only and JSON consumers)
