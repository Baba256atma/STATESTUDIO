# NPA-T STAGE-PROD:6A — CERTIFIED

The production Stage now has a bounded REST/EMPHASIZED semantic motion adapter over existing focus/selection and the existing STAGE-MOTION:1 authority.

## Result

- Capacity Gap retains canonical ID `ctx-problem-capacity`.
- Focus/selection maps to EMPHASIZED; removing both maps to REST.
- Existing Canvas scale interpolation remains owned by STAGE-MOTION:1.
- Object companion emphasis is limited to a one-pixel lift and 1.5% scale over 180 ms.
- Reduced motion disables transform/transition and retains a stable outline.
- Cards and Charts receive no motion hook and remain stationary.
- Motion performs zero canonical writes and introduces no loop, timer, or animation state machine.

## Verification

- Focused STAGE-PROD:6A A–G: 7 pass / 0 fail.
- Bounded STAGE-PROD:2/3/5/6A regression: 38 pass / 0 fail.
- ESLint on directly touched source/test files: pass with zero warnings.
- `tsc --noEmit --pretty false --incremental false` with an 8 GB Node heap: pass.
- Required Level 1 funnel: pass; 0 failed, 0 skipped, 0 running/uninspected required tasks.
- `git diff --check`: pass.

No browser, long-session, FPS, or performance certification was run. STAGE-PROD:6B has not started.
