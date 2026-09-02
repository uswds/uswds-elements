# PR 5: Typography sources

**Phase:** 1 — Complete the primitive tier
**Related ADRs:** ADR-0006, ADR-0007, ADR-0010
**Prerequisite PRs:** PR 0 (tier-first restructure)

---

## Concern

Create `tokens/system/` typography source files covering all USWDS system-tier
typographic tokens inventoried in `uswds-system-tokens.csv`:

- **Type scale** — 20 steps (1–20), pixel values, each annotated with `legacyName`
- **Line heights** — 6 steps (1–6), dimensionless ratios
- **Per-typeface line-height combinations** — `sans-1..6`, `serif-1..6`, `mono-1..6`,
  `cond-1..6`, `heading-1..6`, `ui-1..6`, `body-1..6`, `code-1..6`, `alt-1..6` — **9 typeface
  groups, 54 entries** (ADR-0006: these are tokens; cap-height normalization math stays in USWDS
  core Sass). Amendment (2026-09-01): this PR originally scoped only 6 groups (36 entries,
  omitting `body`/`code`/`alt`) per `uswds-properties-tokens.csv`, which itself carried only 12 of
  the real 54 — both were incomplete relative to `_properties.scss`'s actual
  `$system-properties.line-height.standard` map, confirmed by the new AST-based extractor
  (`internals/scripts/extract-uswds-tokens.js`; see plan-01's amendment). The same map also has a
  separate, simpler `extended` sub-map (6 dimensionless entries, `1: 1` … `6: 1.75` — not
  per-typeface) that this PR should add as `tokens/system/line-height/extended.json`, sourced the
  same way as the base 6-step scale in step 2 below.
- **Letter-spacing** — `auto` (initial), positives `ls-1..3`, negatives `ls-neg-1..3`
  (from `uswds-properties-tokens.csv`)
- **Font stacks** — DTCG `fontFamily` arrays for each named stack
- **Typeface metadata** — display name, cap-height, `system-font` flag per typeface
  (`display name` / `cap-height` / `stack` are tokens; `@font-face src` filename maps
  are **font build config**, not tokens — they stay in uswds-core per ADR-0006)

No web component CSS changes. No existing names are affected.

---

## Files touched

| Action | Path                                                                                   |
| ------ | -------------------------------------------------------------------------------------- |
| New    | `tokens/system/font-size/type-scale.json` — 20-step type scale                         |
| New    | `tokens/system/line-height/line-height.json` — 6 base line heights                     |
| New    | `tokens/system/line-height/per-typeface.json` — 54 per-typeface combos (9 groups × 6)  |
| New    | `tokens/system/line-height/extended.json` — 6-entry simplified scale, not per-typeface |
| New    | `tokens/system/letter-spacing/letter-spacing.json` — 7 entries (auto + 3 pos + 3 neg)  |
| New    | `tokens/system/font-family/stacks.json` — named font stacks as `fontFamily` arrays     |
| New    | `tokens/system/font-family/typefaces.json` — typeface metadata tokens                  |
| Modify | `tokens/index.js` — register the new category groups                                   |
| Modify | `config/style-dictionary.config.js` — add platforms/files for new categories           |
| New    | `build/css/system/font-size.css`, `build/css/system/line-height.css`, etc.             |

---

## Implementation steps

1. **`tokens/system/font-size/type-scale.json`** — 20-step scale from CSV:

    ```json
    {
      "font-size": {
        "$type": "dimension",
        "1":  { "$value": { "value": 12, "unit": "px" }, "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-type-scale-1" } } } },
        "2":  { "$value": { "value": 13, "unit": "px" }, "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-type-scale-2" } } } },
        ...
        "20": { "$value": { "value": 140, "unit": "px" }, "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-type-scale-20" } } } }
      }
    }
    ```

2. **`tokens/system/line-height/line-height.json`** — 6 base ratios:

    ```json
    {
        "line-height": {
            "$type": "number",
            "1": {
                "$value": 1,
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-line-height-1" }
                    }
                }
            },
            "2": {
                "$value": 1.2,
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-line-height-2" }
                    }
                }
            },
            "3": {
                "$value": 1.35,
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-line-height-3" }
                    }
                }
            },
            "4": {
                "$value": 1.5,
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-line-height-4" }
                    }
                }
            },
            "5": {
                "$value": 1.62,
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-line-height-5" }
                    }
                }
            },
            "6": {
                "$value": 1.75,
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-line-height-6" }
                    }
                }
            }
        }
    }
    ```

3. **`tokens/system/line-height/per-typeface.json`** — 54 combos (9 typefaces × 6
   steps). Each is a DTCG alias referencing the base line-height step, carrying a
   `$description` noting the typeface context:

    ```json
    {
      "line-height": {
        "sans": {
          "1": { "$value": "{line-height.1}", "$extensions": { "uswds": { "tier": "system" } } },
          ...
        },
        "serif": { ... },
        "mono": { ... },
        "cond": { ... },
        "heading": { ... },
        "ui": { ... },
        "body": { ... },
        "code": { ... },
        "alt": { ... }
      }
    }
    ```

    Values are not identical across typefaces (each is a distinct, hand-tuned ratio from
    `_properties.scss`'s `lh("<typeface>", n)` lookups) — verify each group's 6 values against the
    real source rather than assuming they alias the base 6-step scale uniformly.

3a. **`tokens/system/line-height/extended.json`** — the separate, non-per-typeface 6-entry scale
from the same `$system-properties.line-height` map (`extended: (1: 1, 2: 1.1, 3: 1.35, 4: 1.5,
   5: 1.62, 6: 1.75)`), close to but not identical to the base 6-step scale in step 2 — carry it as
its own literal-valued group, not an alias of `line-height.json`.

4. **`tokens/system/letter-spacing/letter-spacing.json`** — 7 entries from
   `uswds-properties-tokens.csv`:

    ```json
    {
        "letter-spacing": {
            "$type": "dimension",
            "auto": {
                "$type": "string",
                "$value": "initial",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": {
                            "publicVar": "$system-letter-spacing-ls-auto"
                        }
                    }
                }
            },
            "ls-1": {
                "$value": { "value": 0.025, "unit": "em" },
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": {
                            "publicVar": "$system-letter-spacing-ls-1"
                        }
                    }
                }
            },
            "ls-2": {
                "$value": { "value": 0.1, "unit": "em" },
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": {
                            "publicVar": "$system-letter-spacing-ls-2"
                        }
                    }
                }
            },
            "ls-3": {
                "$value": { "value": 0.15, "unit": "em" },
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": {
                            "publicVar": "$system-letter-spacing-ls-3"
                        }
                    }
                }
            },
            "ls-neg-1": {
                "$value": { "value": -0.01, "unit": "em" },
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": {
                            "publicVar": "$system-letter-spacing-ls-neg-1"
                        }
                    }
                }
            },
            "ls-neg-2": {
                "$value": { "value": -0.02, "unit": "em" },
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": {
                            "publicVar": "$system-letter-spacing-ls-neg-2"
                        }
                    }
                }
            },
            "ls-neg-3": {
                "$value": { "value": -0.03, "unit": "em" },
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": {
                            "publicVar": "$system-letter-spacing-ls-neg-3"
                        }
                    }
                }
            }
        }
    }
    ```

    Two DTCG-compliance notes on this group:
    - `"em"` is not one of DTCG's baseline dimension units (`px`/`rem`), but letter-spacing
      in USWDS Sass is genuinely em-relative — converting to `rem` would lose the
      font-relative behavior. Treat `em` as a documented USWDS extension of the dimension
      unit list; the existing `getTokenValueWithUnit` transform in
      `config/style-dictionary.config.js` already concatenates `value` + `unit` generically
      for any dimension token, so no new build logic is needed.
    - `auto` sets its own `"$type": "string"`, overriding the group's inherited
      `"$type": "dimension"` (per DTCG's type-inheritance rules, a token's own `$type` takes
      precedence over an ancestor group's). This lets `auto` hold the literal string
      `"initial"` without needing to satisfy the dimension type's `{value, unit}` object
      shape.

5. **`tokens/system/font-family/stacks.json`** — DTCG `fontFamily` type (array of
   family names), one entry per named USWDS stack (system, georgia, helvetica,
   merriweather, open-sans, palatino, public-sans, roboto, source-sans-pro, tahoma,
   verdana). Values sourced from `tokens/font/stacks.scss` in uswds-core.

6. **`tokens/system/font-family/typefaces.json`** — per typeface: `display-name`
   (string), `cap-height` (integer, `px` basis), `system-font` (boolean), `stack`
   (alias to `stacks.json`). `@font-face src` filename maps are explicitly **excluded**
   — font build config, not design tokens (ADR-0006).

7. **Update `tokens/index.js` and `config/style-dictionary.config.js`** — register
   `system/font-size`, `system/line-height`, `system/letter-spacing`,
   `system/font-family` as new source groups / output files.

8. **Run build**
    ```bash
    npm run build:tokens
    ```

---

## Done when

- [ ] `npm run build:tokens` exits 0
- [ ] `npm test` exits 0
- [ ] Type scale: 20 entries in `build/css/system/font-size.css` (`--usa-font-size-1` through `--usa-font-size-20`)
- [ ] Line heights: 6 base + 54 per-typeface entries (9 groups × 6, incl. `body`/`code`/`alt`) + 6
      `extended` entries in `build/css/system/line-height.css`
- [ ] Letter spacing: 7 entries (`auto`, `ls-1..3`, `ls-neg-1..3`) in `build/css/system/letter-spacing.css`; negative values are literal negatives (e.g. `-0.01em`), not a separate naming convention
- [ ] Font stacks present in `build/css/system/font-family.css` as comma-separated family lists
- [ ] No `@font-face` src maps or `$theme-font-*-custom-stack` entries appear in output (font build config excluded)
- [ ] Every token has `$extensions.uswds.tier: "system"` and `legacyName` populated
- [ ] `build/` output committed alongside source changes
