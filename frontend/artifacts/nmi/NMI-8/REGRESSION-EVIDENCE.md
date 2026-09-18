# NPA-T NMI:8 — Regression Evidence

Focused batches. No unbounded MRA/RMS stress.

| Gate | Result |
| --- | --- |
| NMI:8 `nmiLive.test.ts` | 6 pass / 0 fail |
| NMI:1–8 `app/lib/nmi/*.test.ts` | 63 pass / 0 fail |
| Queue + Stage + Shell + NCA:1 + CC:5 + ECA:8 + NPS + VAI:4 + Decision + Execution + Data Reality foundation | 241 pass / 0 fail |
| ESLint NMI:8 + host files | 0 errors (pre-existing Shell/Stage warnings only) |
| `NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` | pass |
| `NODE_OPTIONS='--max-old-space-size=16384' npm run build` | pass |

Queue, Stage, NCA referent, CC:5, ECA, NPS, VAI, Decision/Execution writers, and Data Reality foundation were not replaced.
