# PR 2: Color family completion

**Phase:** 1 — Complete the primitive tier
**Related ADRs:** ADR-0002 (Amended), ADR-0008
**Prerequisite PRs:** P1-PR 0 (tier-first restructure), P1-PR 1 (vivid naming + alias)

> **Prerequisite — CSV de-duplication (tracked issue required before this PR merges):**
> `uswds-system-tokens.csv` contains **202 duplicate flat token names** caused by two
> palette snapshots being merged into one file. For example, `$system-color-blue-90`
> appears twice — once with value `#11181d` and once with value `false`. The
> `reconcile-colors.js` script specified below cannot disambiguate two rows sharing a
> flat name with opposite values; it would either false-fail or silently pick one.
>
> Before this PR merges, a tracked issue must be filed and resolved that either:
> (a) de-duplicates the CSV by keying on `(name, source-file, scale)` — keeping the
> real value row and discarding the sentinel row where they conflict — or
> (b) updates `reconcile-colors.js` to key on `(name, source-file, scale)` rather than
> flat name, so the script tolerates the duplicate-name CSV without incorrect results.
>
> The "Done when" gate includes a check that the reconciliation script exits 0 with a
> de-duplicated input or a keyed implementation.
>
> **Amendment (2026-09-01) — this prerequisite is resolved if `reconcile-colors.js` reads from
> `uswds-tokens-inventory-full.csv` instead.** The new AST-based extractor
> (`internals/scripts/extract-uswds-tokens.js`, see plan-01's amendment) always encodes a map
> entry's full key path into the flattened token name (e.g. the nested `vivid` sub-map's grade 10
> becomes `$system-color-blue-cool-vivid-10`, distinct from the standard grade's
> `$system-color-blue-cool-10`) — the root cause of the 202-duplicate bug (dropping that `vivid`
> path segment) cannot recur by construction. Verified: only 1 duplicate `(token_name, source_file)`
> pair remains among that CSV's `tier=system` rows (`$color-mint-5v` in
> `shortcodes-color-system.scss`) — and it is a genuine literal duplicate in the USWDS source itself
> (two identical back-to-back declarations at lines 235–236), not the vivid-submap collision the
> 202-count came from. If `reconcile-colors.js` is written against the new
> CSV, option (a)/(b) above and the 202-row issue are moot; if it still reads the original
> `uswds-system-tokens.csv`, the prerequisite as written still applies unchanged.

---

## Concern

Bring the color family sources to **full coverage** of the USWDS system tier as
inventoried in `uswds-system-tokens.csv`. The current `tokens/system/color/` files
(post-PR-0 move) already cover all 25 named families plus `black-transparent` and
`white-transparent` — but vivid alias metadata (`$extensions.uswds.legacyName`) added
in PR 1 touches only families with vivid grades. This PR:

1. Adds `$extensions.uswds` metadata (`tier`, `legacyName`) to **every** token across
   all families — not just vivid ones — completing the `$extensions.uswds` annotation
   pass started in PR 1.
2. Confirms **gray grades 1–4** are present (they already are: `gray.json`, `gray-cool.json`,
   `gray-warm.json` include grades 1–4; this PR verifies and commits the reconciliation evidence).
3. Confirms **`-90v` vivid slots are absent** per ADR-0008 (nonexistent in USWDS core; the
   `-90v` shortcodes in `uswds-system-tokens.csv` resolve to `false` sentinels — they are
   omitted entirely, matching ADR-0008 Role 1: they are not tokens, so a map lookup on them
   should simply miss, the same way uswds-core's own `$system-color-shortcodes` map lacks
   these keys).
4. Gives `internals/scripts/reconcile-colors.js` an explicit skip-list of the 25 entries in
   `uswds-system-tokens.csv` that are shortcodes resolving to `false` (the `-90v` family), so
   the reconciliation script knows these CSV rows are expected to have **no** corresponding
   built token, instead of expecting JSON to carry a disabled placeholder for them.

No new token values are added. No names change.

---

## Files touched

| Action  | Path                                                                                                                                                                               |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modify  | `tokens/system/color/*.json` — add `$extensions.uswds` block (`tier: "system"`, `legacyName: {...}`) to every existing token entry (nonexistent `-90v` grades get no entry at all) |
| New     | `internals/scripts/reconcile-colors.js` — CSV reconciliation script (name→value equality check)                                                                                    |
| Modify  | `package.json` — add `"reconcile:colors"` script                                                                                                                                   |
| Rebuild | `build/css/system/color.css`, `build/scss/system/_color.scss`                                                                                                                      |

---

## Implementation steps

1. **Add `$extensions.uswds` to every token**

    For each family file, add metadata under `$extensions.uswds`. Example for a
    standard (non-vivid) grade in `tokens/system/color/blue.json`:

    ```json
    "10": {
      "$value": "#d9e8f6",
      "$extensions": {
        "uswds": {
          "tier": "system",
          "legacyName": {
            "shortcode": "blue-10",
            "privateVar": "$color-blue-10",
            "publicVar": "$blue-10"
          }
        }
      }
    }
    ```

    For `black-transparent` and `white-transparent` (present in tokens, absent from
    `uswds-system-tokens.csv`'s `$system-color-*` rows), note in `$description` that
    these are USWDS global palette entries without a `$system-color-*` shortcode.

2. **Omit standard `-90` grade slots and absent vivid-90 slots; give the reconciliation script an explicit skip-list**

    The 22 `false`-valued rows in `uswds-system-tokens.csv` are the **standard `-90` grade
    slots** (`$system-color-*-90`, scale=90) — not `-90v` vivid. The vivid submap within each
    family simply has no `90` key at all (vivid-90 is not a slot; it does not appear in the CSV).
    Both classes are Role 1 (ADR-0008): nonexistent in USWDS core.

    For each family that has a standard `-90` row resolving to `false` in the CSV (22 families:
    blue, blue-cool, blue-warm, cyan, gold, green, green-cool, green-warm, indigo, indigo-cool,
    indigo-warm, magenta, mint, mint-cool, orange, orange-warm, red, red-cool, red-warm, violet,
    violet-warm, yellow), add **no JSON entry** for grade `90` — per ADR-0008 Role 1, the
    standard color map simply lacks this grade, and map lookup returns `false`/`null`, which
    `color()` rejects. The vivid group for each family also has no `"90"` key, matching
    uswds-core's own map.

    `internals/scripts/reconcile-colors.js` (step 3) carries a skip-list of exactly **22 entries**
    (the standard `-90` sentinel rows) — not 25. It reads the CSV's own `false` value per row
    (keyed on name + source-file + scale after CSV de-dup, per the prerequisite above), so it
    knows which CSV rows are expected to have **no** corresponding built token.

3. **Write `internals/scripts/reconcile-colors.js`**

    This script:
    - Parses `plans/token-migration/uswds-system-tokens.csv`, keying on `(name, source-file, scale)` to handle the 202 duplicate flat names (see CSV de-dup prerequisite above)
    - Walks `tokens/system/color/**/*.json` (post-build Style Dictionary flat output)
    - For every CSV row whose value is **not** `false`: asserts a matching token
      exists in the built output and the value matches.
    - For every CSV row whose value **is** `false` (the 22 standard `-90` grade slots,
      ADR-0008 Role 1): asserts **no** corresponding token exists in the built output —
      a present token here is itself a reconciliation failure, since these grades were
      never meant to be tokens.
    - Exits non-zero and prints a diff table on mismatch.

    Add to `package.json`:

    ```json
    "reconcile:colors": "node internals/scripts/reconcile-colors.js"
    ```

4. **Run build and reconciliation**
    ```bash
    npm run build:tokens
    node internals/scripts/reconcile-colors.js
    ```

---

## Done when

- [ ] `npm run build:tokens` exits 0
- [ ] `npm test` exits 0
- [ ] `node internals/scripts/reconcile-colors.js` exits 0 (all non-disabled CSV rows matched, all disabled rows accounted for)
- [ ] CSV de-dup prerequisite resolved (tracked issue closed or `reconcile-colors.js` uses keyed lookup on name+source-file+scale)
- [ ] Every token in `tokens/system/color/*.json` has `$extensions.uswds.tier` set to `"system"`
- [ ] Every non-vivid token has `legacyName` populated (spot-check: `blue.10`, `gray.5`, `gray-cool.1`)
- [ ] No grade-`90` keys appear in the standard color group or vivid group of any family in `tokens/system/color/*.json` or `build/css/system/color.css` — omitted entirely, not filtered
- [ ] Reconciliation skip-list count = **22** (the standard `-90` sentinel rows); not 25
- [ ] `build/` output committed alongside source changes
