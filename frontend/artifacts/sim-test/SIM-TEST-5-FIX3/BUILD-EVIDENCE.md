# Production build evidence

Independent TypeScript: `NODE_OPTIONS='--max-old-space-size=8192' npx tsc --noEmit --pretty false --incremental false` — **PASS** (~47s).

`npx next build` (Next 16.0.10 Turbopack, same 8GB heap):

- Phase: compile **PASS** (11.6s “Compiled successfully”).
- Next phase: “Running TypeScript …” via `next/dist/build/type-check.js` worker (`verifyTypeScriptSetup` in a Jest worker).
- Duration waited: >125s with no “Finished TypeScript” / page collection.
- Process: PID 26214 killed after stall (same hang as FIX2: 226564/226565/226566).
- Classification: **ENVIRONMENTAL_BLOCKER** (tooling worker hang after successful compile; not a product type error — standalone tsc passed).

Do not report Build PASS. Do not recertify SIM-TEST:5 while this remains unresolved.
