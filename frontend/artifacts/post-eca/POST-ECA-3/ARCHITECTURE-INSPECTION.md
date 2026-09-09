# NPA-T POST-ECA:3 — Architecture Inspection

Date: 2026-09-08

## Stop condition

POST-ECA conversation integration only. Do not start ECA:13 or POST-ECA:4. Do not redesign DATA-UX, DATA-ADV, Data Reality, ECA, or NCA unless a defect in those authorities is proven. No second Data Library, CSV store, Data Reality, DATA_OBJECT registry, semantic engine, provenance engine, or Data Advisor.

## 1. Exact reproduction

After POST-ECA:2, Stage membership answers are substantially correct. The following Data turns fail on the live Advisor path (`NexoraExecutiveShell` → `answerAdvisorDataInquiry` then, on `null`, `executeNexoraConversationalExperience`).

Reproduction is two-layer:

1. `answerAdvisorDataInquiry` returns `null` for the reported utterances (DATA-ADV:1 matcher coverage).
2. The conversational orchestrator then owns the turn. It never calls DATA-ADV:1.

## 2. "explain all CSV files you have"

**Actual route**

- DATA-ADV:1 `listAsk` requires `what (data|files|sources)? (do we have|have we got)`, `which files`, or `what sources`. It does not match `explain all csv files you have`.
- No `.csv` filename token, so the specific-file path does not run.
- Orchestrator: intent `explain`, context `not-found`, BUSINESS owner → `I couldn't find a clear match for "all csv files you have" in the current executive context.` (`conversationalExperienceOrchestrator.ts`).

**Expected route**

Manager inventory/summary → DATA-ADV:1 → `projectAdvisorDataContext` (CSV committed + pending) → bounded per-source summary → Advisor. No generic entity match.

## 3. "explain Data" / "explian Data"

**Actual route**

- DATA-ADV:1 `prepared()` lowercases only. `explian` is not recovered (CC:1 adjacent-transposition recovery of `explain` is not applied here).
- No field named Data. Returns `null`.
- Same orchestrator not-found explain fallback for “Data”.

**Expected route**

Recover `explian` via existing CC:1 action-verb recovery. Treat as Data-area concept (and current library inventory when sources exist), not as a missing executive object. Bounded clarification only if genuine dual reading remains.

## 4. "explain Data source"

**Actual route**

Same as §3: no DATA-ADV concept matcher; orchestrator entity-match failure for “data source”.

**Expected route**

DATA-ADV:1 concept explanation of a Data Source (CSV intake, field meanings tracked before evidence). Not a DATA_OBJECT, Stage object, or RDI record dump.

## 5. "do you have any file like CSV?"

**Actual route**

- DATA-ADV:1 does not treat this as CSV availability (`do we have` + `data` is reserved for supplier/missing-data).
- NCA:1 `UNKNOWN` + BUSINESS semantic scope + “not sure how that relates” source → `I can help investigate that, but I need to know which business outcome you're referring to.`

**Expected route**

CSV-type availability from the Data Library projection. Outcome clarification = 0. Empty library: no invented files.

## 6. Canonical Data Library authority

DATA-UX / RDI CSV import store: `csvRealDataImportStore.ts` (`listCsvRealDataImports`, `listCsvImportCandidates`, `listCsvRemovedSourceReferences`). Persistence: DATA-UX:6 IndexedDB. Conversation must read this store through DATA-ADV:1 `projectAdvisorDataContext`, not a parallel inventory.

## 7. Canonical CSV source authority

RDI:2 vertical slice + import store. Source identity: `csvCanonicalSourceContextId` / `csvImportCandidateId`. Lifecycle: pending candidate (`preview`), committed import, removed historical reference (`CsvRemovedSourceReference.historical`).

## 8. Canonical Data Object authority

DATA_OBJECT / Decision Theatre data-object inquiry (`answerNexoraDecisionTheatreDataObjectInquiry`) for a selected Data Object on Stage. Distinct from CSV source files. POST-ECA:3 must not merge them.

## 9. Canonical Data Reality authority

Committed CSV imports only (`acceptedEvidence: true` in Advisor projection). Pending candidates are not Data Reality. `ADVISOR_DATA_CONTEXT_BOUNDARY.ownsDataReality = false`.

## 10. Canonical semantic-confirmation authority

DATA-ADV:2 `semanticCandidateIntelligence` + `applyCsvSemanticClarification` / `applyAdvisorDataSemanticClarification`. ECA:5 already hands CAP_AV confirmation to `"DATA-ADV/Data Reality"`. POST-ECA:3 is read-only for LIKELY/AMBIGUOUS/UNKNOWN.

## 11. Provenance authority

`projectExecutiveSourceIntelligence` / object `relatedObjectLabels` on committed sources. “What data is this using?” / “where did this number come from?” must use this path, not full library inventory.

## 12. Data dependency authority

Existing source → affected objects via ESI `affectedObjects`. Do not infer from filename similarity.

## 13. ECA:1 Data inputs

`EcaWorkingConversationContext.activeDataSource` already exists. POST-ECA:3 may populate it from DATA-ADV dialogue (current source/field) without making Data Library an executive business object. Ordinal “the second one” after a CSV list must bind via DATA-ADV dialogue listed sources, not Stage visibility.

## 14. ECA:2 intent/action planning

Reuse SHOW / SUMMARIZE / EXPLAIN / LOCATE / INSPECT_EVIDENCE. Inventory → SHOW/SUMMARIZE. Concept → EXPLAIN. Object provenance → INSPECT_EVIDENCE. Do not add a Data-specific intent enum.

## 15. ECA:4 information-acquisition relationship

ECA:4 remains “what information is missing for the objective.” POST-ECA:3 answers whether library/provenance already has that data (`do we already have that data?`). Existing-data-first (ECA:4-POST1) must strengthen, not weaken.

## 16. ECA:5 trusted intake relationship

Semantic confirmation stays `applyCsvSemanticClarification`. Explaining CAP_AV as likely must not set MANAGER_CONFIRMED.

## 17. DATA-ADV Advisor awareness path

DATA-ADV:1 is already certified. The shell already short-circuits on a non-null `answerAdvisorDataInquiry`. The live failure is **not** a missing Data Library; it is matcher coverage plus orchestrator tests/paths that never call DATA-ADV.

## 18. NCA/NXA routing

NCA-POST:3 `productCue` includes `nexora`. “What Data does Nexora have?” can become `NEXORA_PRODUCT` / product-identity copy. NCA:1 Outcome clarification wins on UNKNOWN inventory speech. Both must yield when DATA-ADV owns the turn.

## 19. Final Advisor composer

Shell: DATA-ADV first, then CC orchestrator. Orchestrator `finalize`: NCA 1–6 → Stage META → ECA overlays. DATA-ADV must lock presented response before not-found explain, Outcome clarification, product knowledge, and Stage membership.

## 20. Exact fallback branches currently winning

| Utterance | Winner |
| --- | --- |
| explain all CSV files you have | orchestrator not-found explain (`couldn't find a clear match`) |
| explian Data / explain Data | same |
| explain Data source | same |
| do you have any file like CSV | NCA:1 Outcome clarification |

Stage focus is not composing these answers; it only remains as stale context that must not lock the topic.

## 21. Existing reusable projections

- `projectAdvisorDataContext` (`nexoraAdvisorDataContext.ts`)
- `answerAdvisorDataInquiry` / `listLibrary` / `describeSourceContents` / `objectDataAnswer` / `investigateAnswer`
- `listCsvRemovedSourceReferences` (historical; not yet in Advisor projection)
- CC:1 `normalizeNexoraConversationalUtterance` (`explian` → `explain`)
- Shell `advisorDataDialogueRef` (DATA-ADV:1 dialogue, not a second memory store)

## 22. Smallest safe integration

1. Extend DATA-ADV:1 classifiers (inventory, CSV availability, Data/Data Source concept, explain-all, ordinal listed sources, historical lookup, object-provenance vs inventory).
2. Apply existing CC:1 verb recovery in DATA-ADV:1 matching.
3. Project historical/removed references as non-active in the same Advisor context.
4. Call the same `answerAdvisorDataInquiry` from the orchestrator; lock the presented response; skip Outcome clarification and not-found explain; skip Stage ordinal hijack.
5. ECA:6: treat Data inventory/concept as SIDE_QUESTION; preserve investigation objective.
6. Diagnostics on the executive shell only.
7. Thread existing `AdvisorDataDialogue` on `ManagerObjectSession` so orchestrator multi-turn pronouns work (same dialogue the shell already keeps).

## 23. Authorities explicitly NOT changed

DATA-UX intake/Use/Cancel/removal writers. DATA-ADV:2 semantic engine. Data Reality commit. DATA_OBJECT registry. Provenance/ESI writers. Stage/Director writers. ECA:1 identity. ECA:13. No second CSV store or Advisor Data Library.
