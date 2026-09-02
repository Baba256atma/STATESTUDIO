# DATA-UX:3 Semantic Authority Map (pre-implementation)

## First divergent layer

Expected: a parsed CSV field can carry an explainable semantic proposal, a manager confirmation, and source-scoped provenance; material ambiguity can become one existing Advisor/NCA pending question.

Actual before DATA-UX:3: `csvRealDataVerticalSlice.ts` records only structural-to-Data-Reality target mappings. Unknown and suggested fields are resolved with a mapping form. No field/source referent reaches NCA:2, so `yes` or a natural correction cannot resolve it conversationally.

The parser, committed import store, Data Reality handoff, DATA_OBJECT projection, Stage, and Advisor rendering all behave as certified. The first divergence is therefore the RDI:2 field-mapping contract, followed by compatibility with the existing NCA:2 pending-question state.

## Authority chain

| Responsibility | Authority | Input | Output | Durability / scope | Provenance / confirmation |
|---|---|---|---|---|---|
| Parse field structure | RDI:2 `csvRealDataVerticalSlice.ts` | Local CSV text | columns, typed cell values, rows, parse issues | local preparation; workspace/source on commit | deterministic parser; no LLM; no manager confirmation |
| Propose field meaning | RDI:2 mapping compatibility layer | header, inferred type, bounded samples, sibling headers, file name, existing mapping targets, compatible prior mapping | categorical semantic proposal on the existing field mapping | same mapping record; workspace + source + field | proposed by deterministic bounded interpretation; never manager truth |
| Determine material ambiguity | RDI:2 semantic review over the existing mapping review | proposal, target usefulness, unit/type/context conflicts | `UNDERSTOOD`, `LIKELY`, `AMBIGUOUS`, `UNKNOWN`, or `CONFLICTING`; next material field | same source review | explainable conditions; no fake percentage |
| Ask clarification | existing Advisor surface + NCA:2 dialogue state | one material unresolved mapping referent | one concise pending question | session conversation state | NCA:2 remains sole pending-question authority |
| Record confirmation/correction | RDI:2 mapping update path | pending source/field referent + natural manager answer | updated existing mapping record | committed CSV store after import; workspace/source/field scoped | `manager`, `authoritative-mapping`, or `nexora-proposal`; manager outranks proposal |
| Expose confirmed meaning | committed `CsvPreparedImport.mapping` | authoritative mapping record | semantic summary and field diagnostics | in-memory workspace store: panel/Stage/source-selection survival; no page-refresh/session promise | proposal and confirmation source remain distinct |
| Consume business values | existing RDI mapper → P0 Data Reality | only confirmed canonical target mappings | observations/runtime/advisor projections | existing workspace/source commit boundary | existing field/fact provenance |
| Consume conversation context | existing Advisor/NCA | read-only semantic summary or pending referent | clarification/summary copy | conversation session only | cannot write Evidence, Goal, Decision, Stage, or causality |

## Non-interchangeable states

- **STRUCTURAL FACT**: parsed header, inferred datatype, representative bounded samples. Parser-owned.
- **SEMANTIC PROPOSAL**: a plausible business label or canonical association. Not truth.
- **SEMANTIC CONFIRMATION**: a scoped manager confirmation/correction or an existing authoritative canonical mapping.
- **BUSINESS OBSERVATION**: a value/change produced through the existing RDI → Data Reality mapper.
- **EVIDENCE**: owned by existing Evidence contracts; semantic understanding does not create it.
- **CAUSAL CLAIM**: never created by CSV meaning or co-movement.

## AI/model boundary

The inspected NCA:3 boundary declares `usesLiveLlm: false`; no approved live-model semantic path exists in this client workflow. DATA-UX:3 therefore uses bounded, deterministic, inspectable interpretation over safe schema context. Model availability never blocks structural ingestion. Any future LLM can only populate the proposal contract and cannot establish confirmation, Evidence, causality, or durable business truth.

## Authority decision

No separate semantic store or engine will be introduced. Semantic metadata extends each existing `CsvColumnMapping`; committed mapping review remains its truth. NCA:2 remains the sole dialogue/pending-question state. The shell supplies only an invocation bridge from a pending NCA referent back to the open RDI mapping; it owns no semantic data.
