# BCA:2 test evidence

## Focused proofs

Command: `npx tsx --test app/lib/business-context-awareness/resolveBusinessProjectContext.test.ts app/lib/business-context-awareness/resolveBusinessProjectConcept.test.ts`

Result: 17 passed, 0 failed, 0 skipped (9 BCA:2 and 8 BCA:1 protections).

Coverage:

- Backlog → BUSINESS/OPERATIONS plus Delivery/Capacity/Throughput associations, no causality/current reality/Object.
- Gross Margin → BUSINESS/FINANCE, no health/problem/risk assumption.
- Schedule Variance → PROJECT/SCHEDULE, no lateness state.
- Milestone → PROJECT with MILESTONE/SCHEDULE/DELIVERABLE relevance, no status.
- Cost in HYBRID → Business Finance/Operations and Project Cost/Procurement.
- Capacity in HYBRID → distinct CURRENT_OPERATIONS and PLANNED_PROJECT relevance.
- Alpha Balance Coefficient → UNKNOWN by exact-match safety.
- unconfirmed CAP_AV alternatives → AMBIGUOUS with candidates preserved and no promotion.
- general knowledge → `currentReality: NOT_ESTABLISHED`.
- all contextual associations → `causal: false`; diagnostics → `causalInference: NONE`.
- source isolation, deterministic rebuild, immutable outputs.
- manager-confirmed organization-specific meaning retains manager provenance without a writer.
- frozen registry and explicit no-mutation boundary.

## Regression and static gates

- TypeScript passed with `NODE_OPTIONS=--max-old-space-size=8192 npm run typecheck`.
- Targeted ESLint passed with no findings.
- Funnel Level 1 passed: 1/1 required, 0 failed/skipped/running/uninspected.
- Funnel Level 2 passed: 1/1 required, 0 failed/skipped/running/uninspected.
- Funnel Level 3 passed: 1/1 required, 0 failed/skipped/running/uninspected. The level was rerun solely because the first completed result was missed during a polling invocation error; the observed rerun passed.
- Funnel Level 4 passed in 248111 ms: 7/7 required, 0 failed/skipped/running/uninspected. Production build and executive live smoke are included.
- `git diff --check` passed.

No required or nonessential task remained running after the final gate.
