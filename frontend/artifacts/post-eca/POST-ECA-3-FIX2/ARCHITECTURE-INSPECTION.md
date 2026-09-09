# POST-ECA:3-FIX2 architecture inspection

## Existing authorities reused

| Capability | Exists? | Authority | Integration gap before FIX2 |
| --- | --- | --- | --- |
| CSV inventory | Yes | DATA-ADV:1 `answerAdvisorDataInquiry` | None after FIX1 |
| CSV source selection | Partial | DATA-ADV specific-source + dialogue | `I mean file.csv` fell through to NCA “Which one?” |
| CSV field enumeration | Partial | `AdvisorDataSource.fields` | No field-coverage intent; inventory classifier won |
| Field semantic status | Yes | `resolveSemanticCandidates` + field.confidence | Not projected as coverage answer |
| Field candidate meanings | Yes | DATA-ADV:2 / semantic candidate resolver | CAP_AV path already correct |
| Actual values | Yes | CSV parse records on pending/committed sources | Not projected to Advisor |
| Deterministic statistics | Yes | Parse cells are scalars; min/max/average derived in Advisor Data Context | Not asked |
| KPI possibility | No dedicated answer | Mapping targets + field confidence | Inventory hijack |
| Evidence relevance | Partial | `relatedObjectLabels` + provenance | Pending clarification hijack |
| Object/source relationship | Yes | ESI / Advisor Data Context | Filename must not invent it |
| Bounded conclusion | No | Compose from coverage + lifecycle | Inventory hijack |
| Pending clarification | Yes | NCA:2 csv-semantic-clarification + `applyCsvSemanticClarification` | Treated as a lock |
| Clarification escape | No | NCA-POST:2 speech act already marked questions unrelated — after “does this” / “not sure” | Order bug |
| Follow-up source binding | Partial | `AdvisorDataDialogue` | `this CSV` not bound |
| Advisor composition | Yes | Orchestrator finalize DATA-ADV overwrite | Null DATA-ADV → inventory/NCA |

## Exact root causes

**Failure A — field coverage → “Which one?” / inventory**  
FIX1 `isDataLibraryInventoryRequest` treated `csv` + `which`/`what` as library inventory, including “which columns of file.csv”. DATA-ADV returned a census or null; NCA asked “Which one?”.

**Failure B — BKL → CAP_AV “I don't know” acknowledgement**  
`classifyCsvSemanticClarificationUtterance` matched `not sure` anywhere, so “If you are not sure, tell me…” was classified as `unknown` for pending CAP_AV. Shell applied `applyCsvSemanticClarification` and returned `Understood. CAP_AV remains unresolved…`.

**Failure C — KPI → inventory**  
Same FIX1 inventory classifier: `this CSV` + `what` → census.

**Failure D — evidence → BKL clarification**  
`/^(?:is|does)\s+(?:it|this|that)\b/` ran *before* QUESTION. “Does this CSV provide evidence…” was `correct` for the pending field. `applyCsvSemanticClarification` had no definition → `I still need a meaning for BKL`.

**Failure E — conclude → inventory**  
Same inventory classifier.

## Files modified

- `nexoraNcaCsvSemanticClarification.ts` — new question vs pending answer (existing NCA-POST:2 speech act)
- `nexoraAdvisorDataContext.ts` — field observations from existing parse records
- `nexoraAdvisorDataInquiry.ts` — content intents and bounded answers; DATA-ADV:1 only
- `ecaExecutiveIntentActionPlan.ts` / `ecaExecutiveDialogueStrategy.ts` — existing ECA:2/6
- `NexoraExecutiveShell.tsx` — do not consume pending clarification when DATA-ADV owns a new question

## Not created

Second CSV store, Data Library, Data Reality, Data Advisor, evidence store, KPI store, clarification store, router, or conversation memory. Semantic writes remain `applyCsvSemanticClarification`.
