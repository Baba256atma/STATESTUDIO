# MRA:1 — Architecture Inspection

Date: 2026-09-09

Stop condition: inspect and audit manager-facing `/executive` behavior. Do not start MRA:2. Do not add a second authority, store, presenter, or writer.

This inspection records **who already owns each manager-relevant behavior**. MRA:1 does not replace those owners.

## 1. Conversation execution

| Behavior | Authority | Role |
| --- | --- | --- |
| Live Advisor turn execution | CC:5 `executeNexoraConversationalExperience` | Single production conversation entry. Shell identity `data-nexora-conversation-authority`. |
| Utterance normalization | CC:1 `normalizeNexoraConversationalUtterance` | Verb recovery such as `explian` → `explain` on the CC path. DATA-ADV matching also consumes this recovery after POST-ECA:3. |
| Intent / command / runtime bridge | CC:1–4 | Maps conversation to Runtime only when `shouldCommitRuntime` is true. |
| Linguistic meaning | FINAL:6.1 `canonicalManagerMeaning` | Communicative intent, operation, question type. ECA:2 does not re-parse. |
| Contextual meaning | FINAL:6.2 `contextualManagerMeaning` | Turn-in-context. |
| Experience UX / session continuity | CC:5 / CONV:2 thread | Session-scoped. Not durable memory. |

## 2. Executive Conversation Architecture (ECA)

Certified ECA:1–12. ECA:13 was not started. ECA modules are **read-only overlays**. They do not write Goal, KPI, Problem, Risk, Scenario, Decision, Execution, Outcome, or Learning except via explicit certified handoffs.

| Phase | Module | Owns | Must not |
| --- | --- | --- | --- |
| ECA:1 | `composeEcaWorkingConversationContext` | NOW: subject, collection, Stage snapshot, data field, proposal identity | Write business objects |
| ECA:2 | `planEcaExecutiveConversationAction` | One bounded next action | Execute writers; replace NCA |
| ECA:3 | `judgeEcaExecutiveInitiative` | Whether to intervene | Second planner |
| ECA:4 | `judgeEcaExecutiveInformationNeed` | Missing-info judgment, smallest question | Second NCA:3 |
| ECA:5 | `judgeEcaExecutiveAnswerIntake` | Bind manager answers/corrections | Writer / second NLU |
| ECA:6 | `judgeEcaExecutiveDialogueStrategy` | Objective lifecycle overlay | Second CONV:2 store |
| ECA:7 | `judgeEcaExecutiveRecommendation` | Recommendation framing / decision-readiness | Decision writer / second NCA:4 |
| ECA:8 | `judgeEcaExecutiveCommitment` | Preference vs commitment vs challenge | Decision writer / DTH:8 |
| ECA:9 | `judgeEcaExecutiveExecutionReadiness` | Post-Decision execution readiness | Execution writer |
| ECA:10 | `judgeEcaLiveExecution` | Live progress / deviation talk | Monitor / Execution writer |
| ECA:11 | `judgeEcaExecutiveOutcome` | Outcome talk; attribution `NOT_ESTABLISHED` | Outcome writer |
| ECA:12 | `judgeEcaExecutiveLearningClosure` | Learning/closure framing | APP-4 / CORE-OUT:2 engine |

Orchestrator order remains acyclic: ECA:1 → 12. ECA:12 does not feed same-turn ECA:6.

## 3. NCA / NCA-POST / NXA

| Behavior | Authority |
| --- | --- |
| Advisor conversation architecture | NCA:1 |
| Dialogue / pending questions | NCA:2 |
| Question intelligence | NCA:3 |
| Advisory / recommendation reasoning | NCA:4 |
| Initiative | NCA:5 |
| Communication composition | NCA:6 |
| End-to-end NCA turn | NCA:7 |
| Semantic scope, multi-entity, canonical collections | NCA-POST:3 `composeNexoraSemanticTurn` / `resolveCanonicalCollectionMembership` |
| Collection comparison | NCA-POST:4 |
| Manager assertions / collection query precedence | NCA-POST:2 |
| Advisor policy projection | NXA:1 |
| Guidance behavior (ANSWER/ASK/RECOMMEND/…) | NXA:2 |
| Executive situation | NXA:3 |
| Proactive advisory | NXA:4 |
| Executive judgment | NXA:5 |
| Stage ↔ Advisor read model | NXA:5-FIX4 `projectAuthoritativeStageContext` |

NCA-POST:3 `COLLECTION_QUERY` is the collection-membership authority. Stage presentation must not become collection truth.

## 4. Manager–Object

| Behavior | Authority |
| --- | --- |
| Active object / session | MO:1 `managerObjectActive` |
| Catalog projection for conversation | `projectManagerObjectConversationalSubjects` from NEX-MVP catalog |
| CSV semantic clarification pending | `beginNcaCsvSemanticClarification` / `applyCsvSemanticClarification` |
| Advisor Data Library answers | DATA-ADV:1 `answerAdvisorDataInquiry` |

Conversation consumes catalog objects. It does not own Stage topology.

Default `/executive` catalog problems: **Capacity Gap**, **Margin Pressure**. Scenarios: **Capacity Expansion Plan**, **Demand Surge**, **Pricing Response**. Decisions: **Expand Capacity**, **Approve Repricing**. Executions: **Capacity Expansion**, **Pricing Rollout**. Risks catalog member is labeled **Risk**. There is **no Goals collection member** in the default catalog.

## 5. Stage, Director, Theatre

| Behavior | Authority |
| --- | --- |
| Runtime / focus / workspace | NEX-MVP object interaction (`nexoraMVPObjectInteraction`) |
| Presentation decision | DIR:1 `nexoraSemanticPresentationDirector` |
| Theatre scenes (collection, comparison, Decision, Execution, Outcome, Learning) | DTH:1–12 |
| Comparison Theatre | DTH:7 |
| Decision Theatre commit UI | DTH:8 + CC:10 |
| Execution Theatre | DTH:9–10 + CC:11 |
| Outcome Theatre | DTH:11 + CORE-OUT:1/1A |
| Learning/Reassessment Theatre | DTH:12 + CORE-OUT:2 (`writesMemory: false`) |

Stage presentation is a projection. NXA:5-FIX4 is the Advisor read model of that projection.

## 6. Business Context Awareness / Data

| Behavior | Authority |
| --- | --- |
| BUSINESS / PROJECT / HYBRID | BCA:1 |
| Concept / relationship / process / role / clarification / presentation handoff | BCA:2–7 |
| BCA:8 | Certification only; owns none of the above |
| CSV import store | DATA-UX / RDI `csvRealDataImportStore` |
| Parse / prepare / commit | DATA-UX vertical slice |
| Semantic interpretation | DATA-ADV:2 `interpretCsvSemantics` |
| Manager semantic write | `applyCsvSemanticClarification` / `applyAdvisorDataSemanticClarification` |
| Advisor Data Context | `projectAdvisorDataContext` |
| Data Reality | Committed imports only (`acceptedEvidence`) |
| DATA_OBJECT Stage inquiry | Decision Theatre data-object path (distinct from CSV files) |
| Provenance / affected objects | ESI `projectExecutiveSourceIntelligence` |

Shell and orchestrator both call `answerAdvisorDataInquiry`. DATA-ADV must win inventory/field questions before NCA Outcome clarification and CC not-found copy.

## 7. Goal / KPI / Problem / Risk / Scenario / Decision / Execution / Outcome / Learning

| Object | Canonical owner | Conversation role |
| --- | --- | --- |
| Goal | Existing Goal / catalog Goal members (default catalog has none) | Collection via NCA-POST:3 if members exist |
| KPI | Catalog / Data Reality calculations | DATA-ADV for CSV math; NCA for business KPI talk |
| Problem | Catalog + Stage collection | NCA-POST:3 membership |
| Risk | `canonicalRiskWriter` (`DS-6:1`) via `handoffEcaRiskMutation` | ECA proposes; writer requires confirmation |
| Scenario | Catalog + CC:9 scenario session | Compare via NCA-POST:4 / DTH |
| Decision | CC:10 + canonical Decision Runtime adapter | ECA:8 judges only |
| Execution | CC:11 | ECA:9–10 judge only |
| Outcome | CORE-OUT:1 / 1A (session capture on `/executive`) | ECA:11 consumes |
| Learning | CORE-OUT:2 interpretation; APP-4 only on explicit promotion | ECA:12 / DTH:12 do not persist |

## 8. Confirmation and mutation

Required pattern: **intent → proposal → explicit confirmation → canonical writer**.

| Mutation | Writer | Conversation |
| --- | --- | --- |
| Risk create | `writeCanonicalRisk` | ECA proposal + `handoffEcaRiskMutation` |
| Decision commit | CC:10 Decision Runtime | “Approve …” can apply in CC:10 without ECA writing |
| Execution start/complete | CC:11 | Complete remains confirmation-required |
| Goal / Problem / Scenario delete | No ECA writer certified for delete | Proposals must not silently write |
| CSV meaning | DATA-ADV clarification | Pending sources only |

ECA:8 `createsSecondDecisionWriter: false`. ECA:8 `preferenceEqualsCommitment: false`.

## 9. Advisor vs Stage presentation

Advisor copy is composed in the CC:5 finalize path from NCA 1–6, Stage META (NXA:5-FIX4), DATA-ADV lock, and ECA overlays. Stage membership answers must use NXA:5-FIX4 `visibleMembers`, not Queue contents and not Problems collection as a substitute for Overview.

Phrase class matters: `what is on stage?` is NCA-POST:3 `WORKSPACE_STATE`. `show me what is on Stage` is currently eligible for BUSINESS `SHOW` / clarification, not the Stage-meta owner.

## 10. Dialogue / session continuity

| State | Owner | Durability |
| --- | --- | --- |
| Conversation context snapshot | CC:5 | Session |
| Manager–Object session | MO:1 | Session |
| Advisor Data dialogue | DATA-ADV:1 on MO session | Session |
| ECA proposal | ECA:1 identity on working context | Session |
| CC:9 scenarios | Scenario session | Session |
| CC:10 decisions | Decision session | Session |
| CSV IndexedDB | DATA-UX:6 | Durable for imports |
| Learning / Outcome on `/executive` | CORE-OUT:1A / ECA overlay | Session; hard reload loses Theatre Outcome |

## 11. Uncertainty / evidence / causality

| Boundary | Owner |
| --- | --- |
| Recorded dependency ≠ cause | NCA explain / EI |
| Recommendation ≠ Decision | ECA:7 / ECA:8 / CC:10 |
| Preference ≠ commitment | ECA:8 |
| Math KPI ≠ business certainty | DATA-ADV:1 |
| Outcome sequence ≠ causality | ECA:11 `attribution: NOT_ESTABLISHED` |
| Learning without Outcome | ECA:12 `NONE` / `INCONCLUSIVE` |

## 12. Explicitly not created in MRA:1

No second conversation store, Stage store, Data Library, Decision writer, Execution writer, phrase table, or Manager-Ready product patch. Diagnostic instruments only:

- `frontend/scripts/mra-1-runtime-audit.ts`
- `frontend/scripts/mra-1-live-audit.mjs`

They record existing `executeNexoraConversationalExperience` and `/executive` chat. They do not change production routing.
