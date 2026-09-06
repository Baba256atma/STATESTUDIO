# NEX-ENT:6 certification report

## Architecture inspected

NEX-ENT:1–5 guided session; DIR:GA; CC:5; NCA / NCA-POST; DATA-UX:1–6; DATA-ADV:1–2 `projectAdvisorDataContext` / `answerAdvisorDataInquiry`; `interpretCsvSemantics` / `applyCsvSemanticClarification`; RDI CSV vertical slice; Data Rail / Data control; DATA_OBJECT Stage projection; source removal advisor; IndexedDB durability (not written by ENT).

## NEX-ENT:1–5 preservation

ENT:1 10/10, ENT:2 7/7, ENT:3 14/14, ENT:4 20/20, ENT:5 16/16. `nexora-entrance` 218/218. conversational-control 336/336. DIR:GA 9/9. UI guidance 8/8. Decision Theatre 172/172.

## Data authority table

| Responsibility | Canonical authority | ENT:6 role |
| --- | --- | --- |
| File selection | Data UX / Data control | Guides; DIR:GA to `DATA_ENTRY`; no auto-open |
| CSV parsing | `parseCsvDeterministically` | None (example uses it read-only) |
| Preview | Data UX | Narrates pending vs used |
| Pending state | `csvRealDataImportStore` | Observes; does not save |
| Use/accept | existing commit writer | Observes |
| Field candidates | DATA-ADV / `interpretCsvSemantics` | Explains using certified fixtures |
| Semantic confirmation | `applyCsvSemanticClarification` | Invokes only through normal Data conversation; ENT source does not call it |
| Data Reality | RDI / Data Reality | None |
| DATA_OBJECT | Data architecture / Director | Teaches / explains |
| Stage projection | Director / Stage | Observes |
| Guided Attention | DIR:GA | Requests via `pendingOfferTarget` |

## Data education authority

`guidedIntroduction.dataEducation` (`NOT_STARTED` → `SOURCE` → `PREVIEW` → `MEANING` → `CLARIFICATION` → `EVIDENCE` → `DATA_OBJECT` → `REVIEW` → `COMPLETED` | `SKIPPED`, plus `examplePath`). Lesson only. Does not own source, semantics, library, or DATA_OBJECT identity.

## Guided Attention reuse

DIR:GA remains the only Guided Attention authority. ENT:6 sets `pendingOfferTarget: DATA_ENTRY`. Locate phrases are not owned by ENT:6.

## Data entry behavior

Live: attention to Data with rail closed; explicit click opened Data UX.

## Source lifecycle

Narrated: upload ≠ accepted evidence. Example path never `saveCsvImportCandidate`. Own-CSV path tells the manager to use Data without opening the chooser.

## Example-data isolation

Example interprets certified `data-ux3-update.csv` and DATA-UX:3 unknown `export.csv` (`value`) in memory. Copy states example ≠ business library. Store remains empty.

## Real-data path

“Use my CSV” uses existing Data UX. Confirmation writer remains `applyCsvSemanticClarification`.

## Semantic understanding

OTD/CAP_AV follow actual `interpretCsvSemantics` states (LIKELY/AMBIGUOUS/candidate language). UNKNOWN demonstrated on certified `value` (BKL is LIKELY “Bkl” in the production fixture, so ENT does not pretend it is UNKNOWN).

## Unknown-field proof

“What does value mean?” → not enough information; no invented meaning.

## Clarification authority

`applyCsvSemanticClarification` only. ENT:6 module does not call it.

## “I don’t know” proof

Unresolved; example not accepted evidence.

## Correction proof

ENT explains source-local correction via existing Data conversation; does not write.

## Why proof

Asks because the field is visible without enough meaning.

## Evidence / Decision boundaries

Association ≠ cause. Data does not write Decision.

## DATA_OBJECT

Taught as source/evidence context, not Goal/Problem/Scenario/Decision. No ENT injection onto Stage.

## Source isolation

Canonical mapper: confirmation on `capacity.csv` does not transfer to `financial_capacity.csv`.

## Persistence

Education refresh resets ENT:6. Data Library persistence is DATA-UX; example path writes nothing.

## State safety

Educational/example path: zero Goal/KPI/Problem/Risk/Scenario/Decision/Execution/Outcome/Learning writes; zero accepted Data Reality; identity insufficient.

## Refresh / re-entry

Full refresh returns ENT:1; `dataEducation` NOT_STARTED; object count 1. Default `/executive` unaffected.

## Files created

- `app/lib/nexora-entrance/nexoraDataEducationExperience.ts`
- `app/lib/nexora-entrance/nexoraDataEducationExperience.test.ts`
- `scripts/nex-ent6-data-evidence-certify.mjs`
- `artifacts/nex-ent/NEX-ENT-6/*`
- `.certification/nex-ent6-data-evidence/`

## Files modified

- `nexoraGuidedEntranceTypes.ts`
- `nexoraGuidedEntranceExperience.ts`
- `nexoraEntranceExperience.ts`
- `NexoraExecutiveShell.tsx` (`data-nex-ent6-*`)
- `scripts/nxa-test-funnel-run.ts` (`maxBuffer` 64MB so L4 can capture topology-heavy omnibus stdout)

## Tests

| Gate | Result |
| --- | --- |
| NEX-ENT:6 | 19/19 |
| NEX-ENT:1–5 | 67/67 |
| nexora-entrance | 218/218 |
| conversational-control | 336/336 |
| NCA/NXA + data inquiry | 348/348 |
| DIR:GA / UI guidance | 9/9 + 8/8 |
| Decision Theatre | 172/172 |
| Funnel L1–L3 | pass |
| Funnel L4 | omnibus 1465/1465; typecheck/build pass; live-smoke pass after post-build server restart |
| TypeScript | pass |
| Production build | pass |
| Live ENT:6 | all required gates true, 0 errors |

## Live proof

`/executive?entrance=1&reset=1` through ENT:1–5 into SOURCE. DIR:GA highlighted Data without opening. Click opened Data Rail. Example marked. Unknown `value`, provisional OTD, I don’t know, why, cause, Decision, unrelated Problem, skip, refresh. Existing `/executive` stayed non-entrance.

## Regressions

Pre-existing `csvImportStoreVersion` exhaustive-deps warning. Funnel spawnSync needed a larger `maxBuffer` (exit 143 previously). Port 3000 `next dev` remains hung; live used 3001. In-funnel live-smoke failed once on a stale `next start` during rebuild; re-run after restart passed.

## Certification

**NEX-ENT:6 — CERTIFIED**

Stop. Do not start NEX-ENT:7 Visual Intelligence, chart education, NexoChart, Decision Loop training, Trust/Quick Review, Personal Demo, DB/SQL, RAG, document ingestion, API connectors, or Variables.
