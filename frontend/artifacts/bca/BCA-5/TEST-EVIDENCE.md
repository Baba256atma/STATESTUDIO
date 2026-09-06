# BCA:5 test evidence

Command: `node --import tsx --test app/lib/business-context-awareness/*.test.ts`

## Combined BCA suite

**74/74** (BCA:1–4 prior + BCA:5 A–S and identity/substring proofs). Zero skipped.

## Case map

| Case | Result |
| --- | --- |
| A Operations | Backlog, Capacity, OTD relevant; Gross Margin not dominating; no authority |
| B CFO | Cost, Margin relevant; Backlog not emphasized; no Decision authority |
| C CEO | EXECUTIVE; GOAL/TRADE_OFF areas; no recommendation |
| D Project Manager | Schedule Variance, Milestone, Cost; no status/authority fabrication |
| E Same evidence | Ops vs CFO concept sets differ; evidence objects unchanged |
| F Unknown | role UNKNOWN; no fabricated title; Goal still usable |
| G Delivery Manager | AMBIGUOUS; family UNKNOWN |
| H Manager-confirmed operations | OPERATIONS + MANAGER_CONFIRMED; no writer |
| I Interest ≠ role | gross margin question does not become CFO |
| J Multiple roles | General Manager + Project Sponsor both preserved |
| K Hybrid | BUSINESS + PROJECT decision areas |
| L/M Role ≠ permission/authority | both known-flags false |
| N/O Relevance ≠ importance/recommendation | empty priorities; flags false |
| P Stable CEO vs schedule conversation | EXECUTIVE + PROJECT/SCHEDULE |
| Q Session vs durable | Ops role unchanged by finance interest |
| R Source isolation | source-a vs source-b do not leak |
| S Refresh determinism | JSON-identical rebuild; frozen; no mutation |

## Funnel / TypeScript / lint / build / smoke / diff

- Funnel Levels 1–3 passed (`failed: 0`).
- Funnel Level 4 passed: 7/7 required, 0 failed/skipped/running/uninspected.
- Targeted ESLint: `app/lib/business-context-awareness/**/*.ts` exit 0.
- TypeScript, production build, and executive smoke passed inside Level 4.
- `git diff --check` on BCA:5 paths: clean.
