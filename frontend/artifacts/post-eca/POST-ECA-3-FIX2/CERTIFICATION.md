# NPA-T POST-ECA:3-FIX2 — CSV Content Reasoning, Semantic-Clarification Escape & Evidence Integration

**Status: CERTIFIED**

Certification date: 2026-09-09  
Live runtime: `http://127.0.0.1:65340/executive?reset=1` (isolated `next start`). Port 65340 was verified free before use.

POST-ECA:4, ECA:13, DATA-ADV:3, and FIX3 were **not** started. No second Data Library, Data Advisor, Data Reality, CSV store, evidence store, KPI store, or conversation store.

## Verdict

**NPA-T POST-ECA:3-FIX2 — CSV Content Reasoning, Semantic-Clarification Escape & Evidence Integration: CERTIFIED**

**ECA:1–12 remains CERTIFIED.**  
**ECA:4-POST1 remains CERTIFIED.**  
**POST-ECA:2 remains CERTIFIED.**  
**POST-ECA:3 remains CERTIFIED.**  
**POST-ECA:3-FIX1 remains CERTIFIED.**

## Root causes

| Failure | Proven cause |
| --- | --- |
| Field coverage / “Which one?” | FIX1 inventory treated `csv` + `which`/`what` as library census; source bind for `I mean file.csv` was missing |
| CAP_AV → BKL hijack | NCA csv-semantic classifier matched `not sure` inside “If you are not sure…” as `unknown` for pending CAP_AV |
| KPI → inventory | Same FIX1 inventory classifier on `this CSV` + `what` |
| Evidence → BKL lock | `Does this CSV…` matched `does this` as an answer to the pending field before QUESTION |
| Conclude → inventory | Same inventory classifier |

## Live actual-data proof

Pending source `data-ux3-ambiguous.csv` (1 data file, actual parse fields/values):

- Source bind: I’ll use the named CSV; pending ≠ accepted evidence
- Coverage: DT/ORD_QTY unconfirmed; CAP_AV ambiguous candidates; BKL unknown
- CAP_AV: ambiguous, asks for meaning (preserved)
- BKL: unknown; does not replay CAP_AV “I don't know”
- KPI: no business-valid KPI from confirmed meanings; unknown fields excluded; mathematical ≠ business KPI
- Evidence: potentially relevant via unconfirmed CAP_AV meanings; pending source is not evidence; association ≠ causality
- Conclusion: inspect + uncertainty; cannot invent KPI, evidence, or causality

## Quality gates

| Gate | Result |
| --- | --- |
| Conversation suite `eca*.test.ts` | **526/526 PASS** (previous 499 + 27 FIX2; regressions 0) |
| NXA L1–L3 | PASS |
| NXA L4 | **7/7 PASS** |
| TypeScript | PASS |
| ESLint | PASS (pre-existing `csvImportStoreVersion` warning only) |
| Production build | PASS |
| `git diff --check` | PASS |
| Live Runtime 1–8 | **8/8 PASS** |
| Blocking failures | **0** |

## Certification matrix

| Item | Result |
| --- | --- |
| Exact real conversation reproduced | PASS |
| Field-coverage failure proven | PASS |
| CAP_AV→BKL hijack proven | PASS |
| KPI→inventory hijack proven | PASS |
| Evidence→clarification hijack proven | PASS |
| Conclusion→inventory hijack proven | PASS |
| Explicit source binding | PASS |
| Source continuity | PASS |
| Field enumeration | PASS |
| Semantic coverage | PASS |
| Actual value/metadata reading | PASS |
| Explicit new target beats stale clarification | PASS |
| Pending clarification remains safely unresolved | PASS |
| "I don't know" supported | PASS |
| No clarification loop | PASS |
| Canonical semantic writer reused | PASS |
| New semantic writer = 0 | PASS |
| KPI capability reasoning | PASS |
| Mathematical vs business KPI separated | PASS |
| Unknown fields excluded from business interpretation | PASS |
| No invented KPI | PASS |
| CSV→Object relevance judgment | PASS |
| Pending source boundary | PASS |
| Semantic uncertainty preserved | PASS |
| Association ≠ causality | PASS |
| No invented evidence relationship | PASS |
| "What can be concluded" supported | PASS |
| "What cannot be concluded" supported | PASS |
| Uncertainty explicit | PASS |
| CSV content → inventory hijack = 0 | PASS |
| new question → stale clarification hijack = 0 | PASS |
| unnecessary "Which one?" = 0 | PASS |
| Stage/business context hijack = 0 | PASS |
| ECA:1 context preserved | PASS |
| ECA:2 planning preserved | PASS |
| ECA:4 questioning preserved | PASS |
| ECA:5 answer/new-question distinction | PASS |
| ECA:6 objective continuity | PASS |
| Second Data Library = 0 | PASS |
| Second Data Advisor = 0 | PASS |
| Second Data Reality = 0 | PASS |
| Second evidence store = 0 | PASS |
| Second conversation store = 0 | PASS |
| Stage writes = 0 | PASS |
| Business writes = 0 | PASS |
| Decision writes = 0 | PASS |
| Execution writes = 0 | PASS |
| Outcome writes = 0 | PASS |
| Learning writes = 0 | PASS |
| Focused A–T | PASS |
| Sequences 1–8 | PASS |
| Live Runtime 1–8 | PASS |
| Real Data proof | PASS |
| No-hallucination proof | PASS |
| Previous 499 conversation tests | PASS |
| New FIX2 conversation tests | PASS |
| NXA funnel | PASS |
| ECA:1–12 regressions = 0 | PASS |
| ECA:4-POST1 regressions = 0 | PASS |
| POST-ECA:2 regressions = 0 | PASS |
| POST-ECA:3 regressions = 0 | PASS |
| POST-ECA:3-FIX1 regressions = 0 | PASS |
| DATA-UX regressions = 0 | PASS |
| DATA-ADV regressions = 0 | PASS |
| TypeScript | PASS |
| ESLint | PASS |
| Production build | PASS |
| git diff --check | PASS |
| Blocking failures = 0 | PASS |
