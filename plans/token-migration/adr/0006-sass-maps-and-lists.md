# ADR-0006: Handling Sass maps and lists from the inventory

**Status:** Proposed
**Date:** 2026-07-02
**Related:** ADR-0005, ADR-0007

## Context

The inventory contains many tokens whose Sass value is a map or list. Treating them uniformly
would be a mistake: they play four different roles in USWDS core, and only some are design tokens.
The decision here is the **classification** and what each class becomes in the Style Dictionary
world.

## Decision drivers

- DTCG JSON has groups and typed values, not arbitrary maps — every structure needs a deliberate representation
- Anything that can be _derived_ from tokens must be generated, never authored twice
- Build configuration must not masquerade as design tokens in the published package

## Decision (classification)

### 1. Token-definition maps → DTCG token groups

Maps whose entries _are_ the tokens. Their nesting becomes DTCG group hierarchy; the original map
shape is re-emitted by the ADR-0005 formats.

| Sass map                                                                                                                                                  | File (uswds-core)                      | DTCG home                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `$system-color-{family}` × 27                                                                                                                             | `tokens/color/_*.scss`                 | `tokens/colors/{family}.json` (current real path; post-P1-PR0 restructure: `tokens/system/color/{family}.json`) — group `color.{family}.{grade}`, `color.{family}.vivid.{grade}`                             |
| `$system-spacing`                                                                                                                                         | `tokens/units/spacing.scss`            | `tokens/system/spacing/spacing.json` (post-P1-PR0; current: `tokens/spacing/spacing.json`) incl. named (`card`, `mobile-lg`, …) and negative (`neg-*`) entries                                               |
| `$system-type-scale`                                                                                                                                      | `tokens/font/type-scale.scss`          | `tokens/system/typography/type-scale.json` (post-P1-PR0; current: `tokens/typography/type-scale.json`)                                                                                                       |
| `$system-line-height`                                                                                                                                     | `tokens/font/line-height.scss`         | `tokens/system/typography/line-height.json` (post-P1-PR0; current: `tokens/typography/line-height.json`)                                                                                                     |
| `$system-typeface-tokens`                                                                                                                                 | `tokens/font/typefaces.scss`           | split: display-name/cap-height/stack are tokens (`tokens/system/typography/typefaces.json`; post-P1-PR0); the per-weight `src` filename maps are **font build config**, not tokens — they stay in uswds-core |
| `$system-properties` (subset: `box-shadow`, `opacity`, `z-index`, `order`, `flex`, `flex-direction`, `flex-wrap`, `gap`, `letter-spacing`, `line-height`) | `_properties.scss`                     | `tokens/system/{z-index,opacity,shadow,flex,gap}/*.json`, extends `tokens/system/typography/*` (letter-spacing, line-height) — see ADR-0009 for the scope boundary within this map                           |
| `$system-layout-grid-widths`                                                                                                                              | `tokens/units/layout-grid-widths.scss` | `tokens/system/grid/layout-grid-widths.json` (post-P1-PR0; current: `tokens/grid/layout-grid-widths.json`)                                                                                                   |

### 2. Lookup/alias/assignment maps → generated, never authored

`$system-color-shortcodes`, `$all-color-shortcodes`, `$tokens-color-theme`,
`$assignments-theme-color`, `$project-spacing-standard`, `$spacing-to-token`, `$spacing-to-value`,
`$number-to-value`, `$system-breakpoints` (a slice of the spacing map). These are indexes over the
token definitions. The ADR-0005 formats regenerate them; they never appear in the JSON source.

_Alternative noted:_ representing lookup maps as DTCG `$extensions` metadata on groups was
considered and rejected — it duplicates derivable structure and invites drift.

### 3. Utility-generator configuration → stays in uswds-core Sass, out of scope

The `_settings-utilities.scss` entries (`$background-color-settings`, `$border-palettes`,
`$global-color-palettes`, `$output-these-utilities`, `$theme-utility-breakpoints`, …) configure
_which utility classes get generated_. They are build configuration, not design decisions about
visual values. They are excluded from the token package entirely.

**Do not confuse these with `_properties.scss`.** `_settings-utilities.scss` holds only empty stub
maps and toggle flags (`$z-index-settings: ()`, `$z-index-palettes: ("palette-z-index-default")`,
`$z-index-manual-values: ()`) — the _names_ look like they'd hold the z-index/opacity/shadow/order
scale values, but they resolve through `get-standard-values()` into `$system-properties` in
`_properties.scss`, a different file entirely. plan-01.md originally scoped a "Batch 3: Utility
Config Tokens (future)" against `_settings-utilities.scss`; that was the wrong target — it
extracts config, not values, and running it would have produced nothing. The corrected Batch 3
(row added to the table above) targets `_properties.scss` instead.

> **Amendment (2026-09-01):** this section originally cited 174 `_settings-utilities.scss` entries,
> from Batch 1/2's regex extractor. The comprehensive AST-based extractor
> (`internals/scripts/extract-uswds-tokens.js`, see plan-01's amendment) counts 232 top-level
> declarations in that file — the regex extractor undercounted, most likely on the repetitive
> `$foo-settings` / `$foo-settings-complete` / `$foo-palettes` / `$foo-manual-values` pattern that
> repeats per utility (172 occurrences noted in the AST-based extractor's own source survey). The
> exclusion decision (out of scope entirely) is unaffected — only the count was wrong.

### 4. Lists as values → typed DTCG values

- **Font stacks** (`$font-stack-system`, `$font-stack-georgia`, … in `tokens/font/stacks.scss`, plus the `stack` slot of typeface tokens): DTCG `fontFamily` type, whose value is an array of family names. Style Dictionary's CSS/SCSS formats render comma-separated lists natively.
- **Custom-stack settings** (`$theme-font-sans-custom-stack` etc.): remain theme _settings_ emitted by ADR-0005 with `false`/list values; not canonical tokens.
- **List-shaped color args** (`get-system-color(("blue", 70))`): an internal Sass calling convention, not a token — nothing to migrate.

## Consequences

- The published token package contains only classes 1 and 4; classes 2 are build outputs of it; class 3 never leaves uswds-core
- The inventory CSVs get a `disposition` pass recording each map/list row's class (1–4), which doubles as the migration checklist
- The typeface `src` split (class 1 vs font build config) is the one judgment call reviewers should scrutinize — the boundary chosen: _anything a design tool or CSS consumer needs_ is a token; _anything only @font-face generation needs_ is config
