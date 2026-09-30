# BUILD-BASELINE

| Item | Value |
| --- | --- |
| OS | macOS 26.6.2 |
| Architecture | arm64 |
| Node | v24.10.0 |
| npm | 11.6.0 |
| Next.js | 16.0.10 |
| React | 19.2.1 |
| TypeScript | 5.9.3 |
| Canonical build | `npm run build` → `next build` |
| NODE_OPTIONS (shell default) | unset |
| tsc command | `npx tsc --noEmit --pretty false --incremental false` |
| next.config | `turbopack.root` only; typescript.ignoreBuildErrors **not** set |
| tsconfig | `incremental: true`, Next plugin, includes `.next/types/**/*.ts` |
| Existing listener | `next start` PID 90677 on 127.0.0.1:3002 (left running) |

Baseline tsc: PASS, 48.24s real, max RSS 6967525376 bytes (~6.97 GB), exit 0.

Baseline next (prior FIX3): compile PASS ~11–17s; “Running TypeScript” killed at >125s **without** process-tree proof. This diagnosis: worker was **CPU_ACTIVE**, not idle.
