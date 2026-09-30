# ROOT-CAUSE

**Primary classification: NEXT_BUILD_CONFIGURATION_DEFECT**

(with contributing **RESOURCE** evidence and a **diagnostic-timeout error**)

1. This repo’s Next typecheck needs on the order of **7 GB RSS** (measured on direct `tsc`). Default Node heap is far below that. Canonical `"build": "next build"` did not set `NODE_OPTIONS`.
2. Next’s worker uses **incremental** `createIncrementalProgram` (tsconfig `incremental: true`). That is slower than `tsc --incremental false` (~48s vs ~3 min TypeScript phase).
3. Prior FIX3 kills at ~125s sampled **no process tree**. At T+18s this diagnosis found jest-worker **STAT=R, 176% CPU**. That is not a deadlock.

Earliest owner: **frontend `package.json` `build` script** (propagate `--max-old-space-size=8192` so `npm run build` matches the measured heap). Not CC:5/Advisor/NMI/product types.

Not PRODUCT_CODE_DEFECT (no type error, tsc PASS).  
Not ignoreBuildErrors.  
Not a Next worker zombie (worker was running and then completed).

Repair: `"build": "NODE_OPTIONS='--max-old-space-size=8192' next build"` — smallest heap matching ~7 GB measured RSS with headroom.
