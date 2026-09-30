# TYPESCRIPT-COMPARISON

| | Direct `tsc --noEmit --incremental false` | Next `runTypeCheck` worker |
| --- | --- | --- |
| Config | project tsconfig + CLI `--incremental false` | tsconfig **incremental true** + `createIncrementalProgram` when `cacheDir` set (`.next` cache `.tsbuildinfo`) |
| Generated types | uses existing `.next/types` if present | writes `next-env.d.ts` / app types then typechecks including `.next/types` |
| Environment | same Node 24.10; NODE_OPTIONS 8GB | same NODE_OPTIONS on parent; worker is jest-worker child (inherits env) |
| Memory | max RSS ~6.97 GB | worker RSS ~2.9 GB growing at T+6s (heap cap 8 GB) |
| Duration | 48.24s PASS | TypeScript phase ~3 min within total ~201s PASS |
| Result | exit 0, no diagnostics | no TypeScript errors; continued to page collection |

Material differences: **incremental program + Next-generated types + worker wrapper**. Not a different product type error. Direct tsc is faster; Next is slower but completes.

`package.json` `typecheck` already uses `--incremental false`. `next build` did not, by design of Next 16.0.10.
