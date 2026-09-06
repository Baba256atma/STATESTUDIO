# BCA:3 test evidence

Command: `npx tsx --test app/lib/business-context-awareness/*.test.ts`

Result: **35 passed**, 0 failed, 0 skipped (8 BCA:1, 9 BCA:2, 18 BCA:3 including A–O).

| Case | Result |
| --- | --- |
| A Measurement | OTD → MEASURE_OF Delivery Performance, DIRECTED, GENERAL, non-causal |
| B Business relevance | Backlog RELEVANT_TO Delivery |
| C Potential association | Backlog POTENTIALLY_RELATED_TO Capacity |
| D Finance | Cost RELEVANT_TO Gross Margin / FINANCE |
| E Project structure | Milestone PART_OF Project Schedule |
| F Project measurement | Schedule Variance MEASURE_OF Schedule Performance |
| G Hybrid | Capacity–Resource Availability unmerged aspects |
| H Unknown pair | Gross Margin × Milestone UNKNOWN |
| I Causality rejection | Capacity/Backlog/Delivery causalInference NONE |
| J Dependency safety | Procurement RELEVANT_TO Budget, no DEPENDS_ON |
| K Organization | Manager-confirmed Backlog RELEVANT_TO Unfulfilled Orders |
| L Source isolation | No Capacity→Schedule/Resource across unrelated sources |
| M Directionality | MEASURE_OF not reversed |
| N Conflict | General kept, suppressedForCurrentContext |
| O Determinism | Deep-equal frozen rebuild |

## Regression and static gates

- Funnel Levels 1–3 passed.
- Funnel Level 4 passed: 7/7 required, 0 failed/skipped/running/uninspected.
- Targeted ESLint on `app/lib/business-context-awareness` passed with 0 errors.
- TypeScript, production build, and executive smoke passed inside Level 4.
