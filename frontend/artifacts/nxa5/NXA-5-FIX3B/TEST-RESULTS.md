# Test and gate results

## Focused (Level 1 equivalent)

`tsx --test` FIX3B + POST:4 + NXA:5 + NCA:3: **58 passed, 0 failed, 0 skipped**.

FIX3B suite: B1–B10, continuation, B7.

## Test Funnel

- Level 1: PASS, 0 failed, 0 skipped
- Level 2: PASS, 0 failed, 0 skipped
- Level 3: PASS, 0 failed, 0 skipped
- Level 4 / final NXA:5-FIX3 milestone: **NOT RUN**

## Broad regression

Manager Object, conversational control, executive intelligence, Nexora entrance, DIR semantic presentation, certification inventory: **1318 passed, 0 failed, 0 skipped**.

## Static and production

- TypeScript: PASS (type-only DIAG2 artifact annotations required for compile)
- Targeted FIX3B ESLint: 0 errors, 0 warnings
- Related-tree ESLint sample: 0 errors, 5 pre-existing unused-var warnings (not in FIX3B-owned files)
- Production build: PASS, 13/13 static pages
- `git diff --check`: PASS
