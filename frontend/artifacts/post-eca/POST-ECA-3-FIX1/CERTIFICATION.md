# NPA-T POST-ECA:3-FIX1 — Explicit Data Library Inventory Routing & Business-Context Hijack Prevention

**Status: CERTIFIED**

Certification date: 2026-09-09  
Live runtime: `http://127.0.0.1:64405/executive?reset=1` (isolated `next start`). Port 64405 was verified free before use.

POST-ECA:4 was **not** started. ECA:13 was **not** started. FIX2 was **not** started. DATA-ADV:1 / POST-ECA:3 were **not** redesigned. No second Data Advisor, Data Library, CSV store, router, or conversation store.

## Verdict

**NPA-T POST-ECA:3-FIX1 — Explicit Data Library Inventory Routing & Business-Context Hijack Prevention: CERTIFIED**

**ECA:1–12 remains CERTIFIED.**  
**ECA:4-POST1 remains CERTIFIED.**  
**POST-ECA:2 remains CERTIFIED.**  
**POST-ECA:3 remains CERTIFIED.**

## Exact failure reproduced

Manager:

`Nexora, check your Data Library. How many CSV files are currently in this project? List all CSV file names and their current status.`

Previous wrong answer (business hijack): Capacity Expansion Plan + Recommendation: Review Capacity Gap.

First divergent layer: **DATA-ADV:1 `classifyAdvisorDataConversation` returned `null`**. POST-ECA:3 matchers covered short CSV/Data forms only. The multi-clause inventory (Data Library + how many + CSV + project scope + list + names + status) never reached `answerAdvisorDataInquiry`. Orchestrator finalize therefore kept NXA/scenario/attention composition.

## Fix

- Semantic Data Library / CSV target (strip `.csv` filenames so named-file questions stay specific-source).
- Inventory acts: count, list, names, status, check — one combined DATA-ADV census when those clauses co-occur.
- Exclusions: Problems/Scenarios/Risks collections; provenance (`what CSV is X using`); investigate-this-file asks.
- Census text from `projectAdvisorDataContext` lifecycle (`committed` → in use, `pending` → pending review). Workspace-scoped language: “the current Data Library”.
- ECA:2 COUNT/SHOW when CSV/Data Library is the target of how many / list / status.
- Existing orchestrator finalize still consumes DATA-ADV:1; it now receives a non-null inventory answer, so Scenario/recommendation copy cannot replace it.

No equality match on the blocking sentence. No hard-coded `2`, `capacity.csv`, or `data-ux3-ambiguous.csv`.

## Live library (not prompt-invented)

Isolated runtime after IndexedDB clear + CSV intake:

- `capacity.csv` — committed / in use
- `data-ux3-ambiguous.csv` — pending review

Exact blocking reply:

`There are 2 CSV files in the current Data Library: capacity.csv — in use; data-ux3-ambiguous.csv — pending review.`

Route after finalization: `DATA-ADV:1/AdvisorDataInquiry`. Intent: `inventory`.

## Quality gates

| Gate | Result |
| --- | --- |
| Conversation suite `eca*.test.ts` | **499/499 PASS** (previous 473 + 26 FIX1 tests; existing regressions 0) |
| DATA-ADV:1 tests | PASS |
| POST-ECA:2 tests | PASS |
| POST-ECA:3 tests | PASS |
| NXA L1–L3 | PASS |
| NXA L4 | **7/7 PASS** |
| TypeScript | PASS |
| ESLint (FIX1 sources + L4 PREP surface) | PASS |
| Production build | PASS |
| `git diff --check` on FIX1 sources | PASS |
| Live Runtime 1–7 | **7/7 PASS** (port 64405) |
| Blocking product failures | **0** |

Pre-existing `csvImportStoreVersion` ESLint warning in `NexoraExecutiveShell.tsx` is unchanged and non-blocking.

## Certification matrix

| Item | Result |
| --- | --- |
| Exact real failure reproduced | PASS |
| Root cause proven | PASS |
| Explicit Data Library routing | PASS |
| CSV target recognition | PASS |
| Count intent | PASS |
| List intent | PASS |
| Status intent | PASS |
| Multi-clause preservation | PASS |
| "project" scope non-hijack | PASS |
| "status" correct binding | PASS |
| "how many" correct target | PASS |
| "list all" correct target | PASS |
| Scenario hijack = 0 | PASS |
| Problem hijack = 0 | PASS |
| Risk hijack = 0 | PASS |
| Stage hijack = 0 | PASS |
| Outcome clarification = 0 | PASS |
| Generic match fallback = 0 | PASS |
| Unsolicited recommendation = 0 | PASS |
| DATA-ADV:1 reused | PASS |
| Second Data Advisor = 0 | PASS |
| Data Library authority preserved | PASS |
| Actual count correct | PASS |
| Actual names correct | PASS |
| Actual statuses correct | PASS |
| Pending/active distinction | PASS |
| Historical distinction | PASS |
| ECA:6 side-question continuity | PASS |
| Read-only writes = 0 | PASS |
| Focused A–T | PASS |
| Sequences 1–5 | PASS |
| Live Runtime 1–7 | PASS |
| Previous 473 conversation tests | PASS |
| New FIX1 conversation tests | PASS |
| NXA funnel | PASS |
| ECA:1–12 regressions = 0 | PASS |
| ECA:4-POST1 regressions = 0 | PASS |
| POST-ECA:2 regressions = 0 | PASS |
| POST-ECA:3 regressions = 0 | PASS |
| DATA-UX regressions = 0 | PASS |
| DATA-ADV regressions = 0 | PASS |
| TypeScript | PASS |
| ESLint | PASS |
| Production build | PASS |
| git diff --check | PASS |
| Blocking failures = 0 | PASS |
