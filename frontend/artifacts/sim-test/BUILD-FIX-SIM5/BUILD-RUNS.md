# BUILD-RUNS

| Run ID | Source | Cache | Command | Env | Compile | TypeScript | Pages | Exit | Duration | Class |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B0 (FIX3 historical) | FIX3 tree | existing `.next`, start on :3002 | `NODE_OPTIONS=8GB npx next build` | 8GB | PASS ~17s | unknown (killed) | not reached | killed | >125s | premature kill; no process sample |
| B1 | same working tree | existing `.next` (lock removed only) | `NODE_OPTIONS=8GB npx next build` | 8GB | PASS 10.9s | worker CPU_ACTIVE then PASS | 14/14 static + routes | **0** | 200623 ms | success |
| B2 | `package.json` build script + heap | warm `.next` | `npm run build` | script 8GB | PASS 12.2s | PASS | 14/14 | **0** | 202729 ms | warm canonical PASS |

No clean wipe of `.next` (live `next start` on :3002 still owned that dir). B1/B2 prove the worker completes on current cache. CLEAN_BUILD not required after B1 success.

Routes generated include `/executive` and `/executive/watch`.
