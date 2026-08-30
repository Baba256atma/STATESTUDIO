# DTH:3 Zero-failure prerequisite — Scene naming

Closed **before** DTH:3 Theatre implementation.

## Reproduction

Command: `npm run test:scene`

Observed failures in `app/lib/scene/objectNaming.test.ts`:

1. `resolveObjectNameDensityTier(8)` expected `"sparse"`, received `"comfortable"`.
2. `shouldRenderExecutiveObjectName({ objectCount: 100, selected: false, index: 3 })` expected `false`, received `true`.

## Inspected authorities

- Canonical **object-name density** (`app/lib/scene/objectNameDensityProfile.ts`): `comfortable` (count ≤ 8), `balanced` (≤ 18), `compact` (> 18).
- Separate **scene composition** density (`SceneDensityTier`): `sparse` | `moderate` | `dense` | `critical`.

These are different contracts. Name-density tests were using composition-tier vocabulary.

Production compact profile already set `showSelectedOnly: true`, but `shouldRenderExecutiveObjectName` ignored that flag and still sampled unselected names at high object counts. That was an incomplete name-density contract, not a reason to restore `sparse`/`critical` on names.

## Classification

- Tests were **stale on tier names**.
- Production name-density values `comfortable` / `balanced` / `compact` are the canonical contract.
- Compact `showSelectedOnly` was **not fully enforced** in the renderer helper (owning-layer gap).

## Root-cause fix (authoritative layer)

1. Document that `ObjectNameDensityTier` is not `SceneDensityTier`.
2. Honor `showSelectedOnly` after selected/focused names (unselected names hidden in compact scenes).
3. Honor `showAllNames` within max/index bounds.
4. Update tests to the canonical tiers and compact selected-only behavior. Do **not** reintroduce `sparse`/`critical` as name-density tiers.

## Closure

`npm run test:scene` after the naming fix: **PASS** (zero failures). DTH:3 implementation started only after this gate.
