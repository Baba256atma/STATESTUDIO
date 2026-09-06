# DATA-ADV:2 architecture inspection

## Stop condition

One read-only, source-scoped semantic candidate resolver is consumed by the existing Advisor/NCA path; the existing CSV mapping remains the only semantic authority and `applyCsvSemanticClarification` remains the only conversational writer. Required semantic states, grounded explanation, correction, deferral, source isolation, restore, and no-mutation safety are tested. Focused through full funnel, TypeScript, ESLint, build, `git diff --check`, and live `/executive` proof have zero known relevant failures.

## Existing mechanism and CAP_AV diagnosis

`csvSemanticUnderstanding.candidateFor` tokenizes arbitrary headers, expands `SAFE_ABBREVIATIONS`, derives acronyms from `CSV_MAPPING_TARGETS`, and scores overlap plus filename/object support. OTD matches the acronym of the authoritative `On-Time Deliveries` target. DATA-ADV:1 then calls a proposal “likely” only when `proposedMeaning` exactly equals a `CSV_MAPPING_TARGETS` label. CAP_AV is interpreted as an abbreviated, material `AMBIGUOUS` field; DATA-ADV:1 collapsed that state to `unresolved`, discarded the candidate in its projection, and emitted only “business meaning has not been confirmed.” The divergence is deterministic and generic, not fixture- or manager-confirmation-derived.

The focused DATA-ADV:2 test also reproduced a distinct first-layer identity defect: compact substring matching allowed CAP_AV queries to match an AV field. The generic matcher now requires a whole normalized query term. It does not use field-specific repair or risky typo recovery.

## Architectural questions A–Q

A. Existing “Likely” comes from DATA-UX:3 proposals that exactly match an RDI mapping target, projected by DATA-ADV:1.  
B. It is generic acronym/token/target matching, though bounded to CSV target vocabulary.  
C. Existing vocabulary includes RDI mapping target labels/aliases, object keys, KPI metric keys, manager-confirmed source meanings, field tokens, source descriptions, and workspace/domain terminology.  
D. Yes. RDI targets are authoritative canonical concepts; the candidate resolver also uses a small reusable concept vocabulary without mapping raw field names to answers.  
E. Domain may rank candidates, never confirm them.  
F. Source label/type may rank candidates, never establish truth.  
G. Neighboring confirmed meanings may rank candidates and must be reported only when used.  
H. Existing object labels can constrain candidate vocabulary through canonical RDI targets; candidate resolution does not create or relate Objects.  
I. KPI metric concepts can constrain vocabulary through canonical RDI targets; no KPI result is inferred.  
J. Refuse when tokens are opaque, contain mixed identifiers/digits, include unsupported lexemes, or no canonical concept covers the resolved term structure.  
K. Candidate state and evidence live in the ephemeral resolver result projected into Advisor Data Context. They do not live in Data Reality or another store.  
L. Existing authoritative mapping and explicit manager clarification are the only writers of confirmed meaning.  
M. Candidates are `candidates[]` plus state/evidence; confirmed meaning remains the mapping's `confirmedMeaning` and `confirmationSource`.  
N. The resolver accepts a generic term/source/domain/neighbor contract. CSV is only the current adapter.  
O. Deterministic reasoning is sufficient for canonical authority, compositional terms, ambiguity, and safe unknowns in this phase.  
P. No model assistance is added. A future model may propose candidates only behind this contract, constrained by bounded context and always requiring confirmation.  
Q. Hallucination is prevented by closed vocabulary coverage, explicit evidence, no partial unknown-token guessing, ambiguity preservation, valid UNKNOWN output, and a resolver with no write capability.

## Authority reuse and responsibility split

`projectAdvisorDataContext` remains a read-only projection. `answerAdvisorDataInquiry` composes manager language and creates an existing `CsvSemanticClarification`. NCA retains dialogue/pending ownership through `beginNcaCsvSemanticClarification`. `applyAdvisorDataSemanticClarification` delegates to `applyCsvSemanticClarification`, and the existing RDI candidate store persists the source-local result. No second store, presenter, NCA engine, or semantic writer exists.

## Evidence ladder

1. Existing authoritative mapping.
2. Manager-confirmed meaning for the same source/field identity.
3. Existing canonical RDI proposal or canonical business concept with complete term-structure coverage.
4. Confirmed neighboring meanings.
5. Explicit domain context.
6. Source-label context.

Levels 3–6 are candidate evidence only. Unsupported lexical similarity, filename-only claims, and cross-source confirmation never establish meaning.

## State and learning boundary

- `AUTHORITATIVE`: existing authoritative mapping; no confirmation required.
- `MANAGER_CONFIRMED`: same-source manager confirmation; no repeat confirmation required.
- `LIKELY`: one best supported bounded candidate; confirmation required.
- `AMBIGUOUS`: tied best candidates; manager must choose or correct.
- `UNKNOWN`: no safe candidate; uncertainty is preserved.

Manager confirmation is source-local. Another source with the same column does not inherit confirmation. This implementation does not add cross-source hint persistence; that is safer than silently creating global truth. Restore rehydrates the existing source mapping, so confirmed meaning wins before candidate reasoning.

## Deterministic/model decision and scale

The phase is deterministic-only. The resolver receives one term, one source label, optional domain, and confirmed neighboring meanings—not CSV rows or the full Data Library. Candidate generation is bounded by a small canonical concept set and a compositional lexeme vocabulary. This keeps the result explainable, reproducible, and capable of returning UNKNOWN.

## Safety boundary

Candidate resolution is a pure function. It cannot mutate Stage, Object, Data Reality, Evidence, ESI, Decision, Execution, Outcome, or Learning and cannot change source lifecycle. It never writes `confirmedMeaning`. Only the existing explicit semantic clarification path can do that.
