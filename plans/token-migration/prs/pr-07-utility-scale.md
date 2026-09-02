# PR 7: Utility scale tokens

**Phase:** 1 — Complete the primitive tier
**Related ADRs:** ADR-0009, ADR-0010
**Prerequisite PRs:** P1-PR 0 (tier-first restructure)

---

## Concern

Create `tokens/system/` source files for the **utility-scale property tokens**
inventoried in `uswds-properties-tokens.csv`. These tokens are part of the primitive tier
but live in a separate CSV because they originate from `$system-properties` — a nested
map, not the simple-map files processed by the regex extractor.

> **Amendment (2026-09-01):** `internals/scripts/extract-properties.js`, cited above as this CSV's
> extractor, was never actually committed to this repo — checked across all branches and reflog;
> see plan-01's amendment. Its replacement, `internals/scripts/extract-uswds-tokens.js`, is
> AST-based and comprehensive rather than properties-specific; running it and filtering its output
> to `source_file` ending in `_properties.scss` or `layout-grid-widths.scss` reproduces this batch
> (335 raw rows before applying ADR-0009 Decision 1's in/out-of-scope category filter; ~157 after —
> the classifier's `category`/`property` columns don't cleanly reproduce that boundary yet, so
> filtering by raw `token_name` against the category list in ADR-0009 Decision 1 is more reliable
> for now).

Scope per plan-01 §Phase 1 and ADR-0009:

- **z-index**: `auto`, `bottom` (-100), `0`, `100–500`, `top` (99999)
- **opacity**: `0–100` (maps to `0.0–1.0`)
- **shadow**: box-shadow `none` + `1–5` (multi-part values with `rgba()`)
- **flex**: flex `1–12`, `fill`, `auto`; flex-direction (`row`, `column`); flex-wrap (`wrap`, `nowrap`); order `first` (-1), `last` (999), `0–11`, `initial`
- **gap**: column-gaps `0`, `1–6`, `2px`, `05`; named aliases `sm` (→ 2px), `md` (→ 2), `lg` (→ 3)

Note: **letter-spacing** and per-typeface **line-height** from `$system-properties` are
covered by PR 5 (typography sources), not this PR.

---

## Files touched

| Action | Path                                                                  |
| ------ | --------------------------------------------------------------------- |
| New    | `tokens/system/z-index/z-index.json`                                  |
| New    | `tokens/system/opacity/opacity.json`                                  |
| New    | `tokens/system/shadow/shadow.json`                                    |
| New    | `tokens/system/flex/flex.json`                                        |
| New    | `tokens/system/gap/gap.json`                                          |
| Modify | `tokens/index.js` — register new groups                               |
| Modify | `config/style-dictionary.config.js` — add output files for new groups |
| New    | `build/css/system/{z-index,opacity,shadow,flex,gap}.css` etc.         |

---

## Implementation steps

1. **`tokens/system/z-index/z-index.json`**

    ```json
    {
        "z-index": {
            "$type": "number",
            "bottom": {
                "$value": -100,
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-z-index-bottom" }
                    }
                }
            },
            "0": {
                "$value": 0,
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-z-index-0" }
                    }
                }
            },
            "100": {
                "$value": 100,
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-z-index-100" }
                    }
                }
            },
            "200": {
                "$value": 200,
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-z-index-200" }
                    }
                }
            },
            "300": {
                "$value": 300,
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-z-index-300" }
                    }
                }
            },
            "400": {
                "$value": 400,
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-z-index-400" }
                    }
                }
            },
            "500": {
                "$value": 500,
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-z-index-500" }
                    }
                }
            },
            "top": {
                "$value": 99999,
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-z-index-top" }
                    }
                }
            },
            "auto": {
                "$value": "auto",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-z-index-auto" }
                    }
                }
            }
        }
    }
    ```

    Note: `bottom` (-100) and `top` (99999) resolve to literal numeric values per
    ADR-0009 — not a separate naming convention.

2. **`tokens/system/opacity/opacity.json`** — 11 entries (0, 10, 20 … 100), values
   mapped `n/100`:

    ```json
    {
      "opacity": {
        "$type": "number",
        "0":   { "$value": 0,   "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-opacity-0" } } } },
        "10":  { "$value": 0.1, "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-opacity-10" } } } },
        ...
        "100": { "$value": 1,   "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-opacity-100" } } } }
      }
    }
    ```

3. **`tokens/system/shadow/shadow.json`** — 6 entries. Box-shadow values from the CSV
   contain `rgba()` — author as string `$type: "shadow"` (DTCG shadow composite type)
   or `$type: "string"` with the full CSS value literal. Prefer `string` to avoid
   Style Dictionary shadow composite transform complexity for a first pass:

    ```json
    {
        "shadow": {
            "$type": "string",
            "none": {
                "$value": "none",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-box-shadow-none" }
                    }
                }
            },
            "1": {
                "$value": "0 1px 0.25rem 0 rgba(0, 0, 0, 0.1)",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-box-shadow-1" }
                    }
                }
            },
            "2": {
                "$value": "0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.1)",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-box-shadow-2" }
                    }
                }
            },
            "3": {
                "$value": "0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1)",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-box-shadow-3" }
                    }
                }
            },
            "4": {
                "$value": "0 0.75rem 1.5rem 0 rgba(0, 0, 0, 0.1)",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-box-shadow-4" }
                    }
                }
            },
            "5": {
                "$value": "0 1rem 2rem 0 rgba(0, 0, 0, 0.1)",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-box-shadow-5" }
                    }
                }
            }
        }
    }
    ```

4. **`tokens/system/flex/flex.json`** — four sub-groups: `flex`, `flex-direction`,
   `flex-wrap`, `order`:

    ```json
    {
      "flex": {
        "$type": "string",
        "1":    { "$value": "1 1 0%",    "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-flex-1" } } } },
        ...
        "12":   { "$value": "12 1 0%",   "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-flex-12" } } } },
        "fill": { "$value": "1 1 0%",    "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-flex-fill" } } } },
        "auto": { "$value": "0 1 auto",  "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-flex-auto" } } } }
      },
      "flex-direction": {
        "row":    { "$value": "row",    "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-flex-direction-row" } } } },
        "column": { "$value": "column", "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-flex-direction-column" } } } }
      },
      "flex-wrap": {
        "wrap":    { "$value": "wrap",   "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-flex-wrap-wrap" } } } },
        "no-wrap": { "$value": "nowrap", "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-flex-wrap-no-wrap" } } } }
      },
      "order": {
        "first":   { "$value": -1,       "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-order-first" } } } },
        "0":       { "$value": 0,        "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-order-0" } } } },
        ...
        "11":      { "$value": 11,       "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-order-11" } } } },
        "last":    { "$value": 999,      "$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-order-last" } } } },
        "initial": { "$value": "initial","$extensions": { "uswds": { "tier": "system", "legacyName": { "publicVar": "$system-order-initial" } } } }
      }
    }
    ```

    `order.first` (-1) and `order.last` (999) resolve to literal values per ADR-0009.

5. **`tokens/system/gap/gap.json`** — numeric gaps aliased into spacing where they
   correspond (`sm` → `{spacing.2px}`, `md` → `{spacing.2}`, `lg` → `{spacing.3}`):

    ```json
    {
        "gap": {
            "$type": "dimension",
            "0": {
                "$value": { "value": 0, "unit": "" },
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-gap-0" }
                    }
                }
            },
            "2px": {
                "$value": { "value": 2, "unit": "px" },
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-gap-2px" }
                    }
                }
            },
            "05": {
                "$value": "{spacing.05}",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-gap-05" }
                    }
                }
            },
            "1": {
                "$value": "{spacing.1}",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-gap-1" }
                    }
                }
            },
            "2": {
                "$value": "{spacing.2}",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-gap-2" }
                    }
                }
            },
            "3": {
                "$value": "{spacing.3}",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-gap-3" }
                    }
                }
            },
            "4": {
                "$value": "{spacing.4}",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-gap-4" }
                    }
                }
            },
            "5": {
                "$value": "{spacing.5}",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-gap-5" }
                    }
                }
            },
            "6": {
                "$value": "{spacing.6}",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-gap-6" }
                    }
                }
            },
            "sm": {
                "$value": "{gap.2px}",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-gap-sm" }
                    }
                }
            },
            "md": {
                "$value": "{gap.2}",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-gap-md" }
                    }
                }
            },
            "lg": {
                "$value": "{gap.3}",
                "$extensions": {
                    "uswds": {
                        "tier": "system",
                        "legacyName": { "publicVar": "$system-gap-lg" }
                    }
                }
            }
        }
    }
    ```

    Gap numeric values alias spacing where possible so a spacing change propagates.

6. **Run build**
    ```bash
    npm run build:tokens
    ```

---

## Done when

- [ ] `npm run build:tokens` exits 0
- [ ] `npm test` exits 0
- [ ] z-index: 9 entries (including `bottom: -100` and `top: 99999`) in built output
- [ ] opacity: 11 entries (`0` through `100`, values `0.0`–`1.0`) in built output
- [ ] shadow: 6 entries (`none` + `1–5`) in built output; `rgba()` values intact
- [ ] flex: **14** flex values (`1–12`, `fill`, `auto`) + 2 flex-direction + 2 flex-wrap + **15** order entries (`first`, `0–11`, `last`, `initial`) in built output
- [ ] gap: **12** entries (`0`, `2px`, `05`, `1–6`, `sm`, `md`, `lg`) in built output; aliased values resolve correctly
- [ ] `order.first` resolves to `-1` and `order.last` to `999` in built output (literal negatives, not a naming convention)
- [ ] `build/` output committed alongside source changes
