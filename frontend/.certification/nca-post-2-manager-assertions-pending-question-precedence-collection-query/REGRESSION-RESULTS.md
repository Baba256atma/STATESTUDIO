# Regression results

- NCA-POST:2 tests: 13/13 pass
- NCA:1–7 + NCA-POST:1 + CC intent: 207 pass, 0 fail (plus 24 CC intent tests in a separate run)
- No NCA:8 created
- NCA-POST:1 recovery, failed-turn continuity, and initiative discipline retained
- Single-object `show Delivery` / `show Capacity Gap` still LOCATE
- Cost-priority what-if remains NCA:4 PRIORITY_SHIFT (CONSEQUENCE overlay skipped when `matters more`)
- Lint: 0 errors (existing warnings only)
- Typecheck: pass with `NODE_OPTIONS=--max-old-space-size=16384` (default heap OOMs)
- Build: `next build` pass
