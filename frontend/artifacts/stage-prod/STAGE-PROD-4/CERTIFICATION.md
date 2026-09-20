# NPA-T STAGE-PROD:4 — CERTIFIED

The live production Stage now renders contextual Trend, Comparison, and Status Card visuals from existing DIR/DTH evidence contracts while preserving scene, Object, source, and evidence identities.

## Proven evidence paths

- Trend: the existing DIR:VI ordered OTD fixture observations (`89.8`, `90.1`) remain explicitly marked as example/likely evidence and render through the production Stage host.
- Comparison: existing DTH cost fixture values and expectation semantics render only for the exact canonical Scenario pair and explicit COST criterion.
- Status Card: Capacity Gap's DTH investigation state and evidence summary render with `ctx-problem-capacity` association.
- Unsupported/missing comparison evidence renders no chart and no substitute zero.

## Verification

- Focused STAGE-PROD:4 A–J: 10 pass / 0 fail.
- Touched-seam regression (STAGE-PROD:1–4, DIR:VI, DTH investigation/comparison/visual grammar, NEX-MVP:3/4, shell, and `/executive`): 178 pass / 0 fail.
- Required Level 1 funnel: pass; 0 failed, 0 skipped, no running or uninspected required tasks.
- ESLint on the visual adapter/test, renderer, reused DIR renderer, mount, and Stage host: pass with zero warnings.
- `tsc --noEmit --pretty false --incremental false`: pass with an 8 GB Node heap.
- `git diff --check`: pass.

## Authority result

Rendering is read-only. Visual specs are presentation artifacts, not Objects or Data Objects. No values, periods, units, scores, causes, winners, evidence states, or canonical identities are fabricated or rewritten.

STAGE-PROD:5 has not started.
