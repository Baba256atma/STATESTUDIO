# BCA:1 test evidence

## Focused proof

Command: `npx tsx --test app/lib/business-context-awareness/resolveBusinessProjectContext.test.ts`

Result: 8 passed, 0 failed, 0 skipped.

Covered:

- Known manufacturing Business context with confirmed On-Time Delivery.
- Known Warehouse Expansion Project context with schedule/cost relevance and no invented risk.
- Hybrid manufacturing business plus production-line project.
- Unknown for unconfirmed BKL/CAP_AV; no fabricated relationships.
- DATA-ADV manager-confirmed Backlog Level → Operations/Delivery/Workload relevance, all `causal: false`.
- Finance Manager attachment with null permission and decision authority.
- Same-named concepts isolated by source-context provenance.
- Equivalent rebuild from durable input and input immutability.
- Explicit no-write/no-causality boundary.

## Static and regression gates

- TypeScript: passed with `NODE_OPTIONS=--max-old-space-size=8192 npm run typecheck`.
- Targeted ESLint: passed with no findings.
- Funnel Level 1: passed; 1/1 required, 0 failed/skipped/running/uninspected.
- Funnel Level 2: passed; 1/1 required, 0 failed/skipped/running/uninspected.
- Funnel Level 3: passed; 1/1 required, 0 failed/skipped/running/uninspected.
- Funnel Level 4: passed in 486288 ms; 7/7 required, 0 failed/skipped/running/uninspected. Production build and live executive smoke are included by the existing milestone gate.
- `git diff --check`: passed.

No required or nonessential background task remained running after the final gate.
