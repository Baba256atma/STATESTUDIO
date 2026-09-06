# BCA:4 test evidence

Command: `npx tsx --test app/lib/business-context-awareness/*.test.ts`

Result: **56 passed** (BCA:1–4 combined).

Cases A–S covered: Backlog areas, OTD indicator, supplier lead time, Quality via Defect Rate, Milestone phases, Schedule Variance, Project Cost, Hybrid Capacity, general vs org, unknown Delivery Performance, no instance, no mining, no DEPENDS_ON, non-causal, PROJECT_WORK_EXECUTION ≠ CC:11, source isolation, reference vs observed sequence, conflict preservation, determinism, Deliverable ≠ DELIVERY.

## Regression and static gates

- Funnel Levels 1–3 passed.
- Funnel Level 4 passed: 7/7 required, 0 failed/skipped/running/uninspected.
- Targeted ESLint passed.
- TypeScript, production build, and executive smoke passed inside Level 4.
