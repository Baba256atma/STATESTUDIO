# MRA:1 — Failure Map

Date: 2026-09-09

Source: `runtime-turns.json` (150 turns, 33 journeys through CC:5 `executeNexoraConversationalExperience` + default NEX-MVP catalog). No product patches.

Reproducible: **Yes** for every row unless noted. Replay the named journey in `scripts/mra-1-runtime-audit.ts`.

---

## MRA-1-001

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-001 |
| Manager utterance | `Approve Demand Surge` then `are we ready to execute?` / `start it` |
| Prior context | Isolated journey, or after problem→scenario→recommend (`I-decision-path`, `J-execution-after-approve-phrase`) |
| Expected | After a real Decision, execution talk should see that Decision. If not actually committed, Advisor must not say it is Approved. |
| Actual | First turn: `decisionStatus: applied`, reply “Demand Surge is now the Approved decision.” Next turns: ECA:9 `NOT_APPLICABLE`, reply “There is no committed Decision yet” / “We need an approved decision before execution can start.” |
| Category | MRA-DECISION / MRA-EXECUTION |
| Severity | S1 |
| Reproducible | Yes |
| Owning subsystem | CC:10 session vs ECA:9/CC:11 consumption; Advisor overlay composition |
| Root-cause hypothesis | CC:10 applies an explicit Approve into the Decision session, but later ECA:9/execution copy still reads “no committed Decision” (Theatre/runtime Decision, not CC:10 session). Split Decision truth in one conversation. |
| Evidence | `runtime-turns.json` `I-decision-path` Approve turn `decisionStatus=applied`; `J-execution-after-approve-phrase` subsequent turns. |
| MRA:2 fix cluster | C7 Decision/Execution session continuity |

---

## MRA-1-002

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-002 |
| Manager utterance | `Approve Demand Surge` (single turn) |
| Prior context | After compare, or cold start |
| Expected | Named approval still surfaces one material challenge when evidence is incomplete; confirmation pattern remains visible. |
| Actual | Immediate `applied`. ECA:8 `EXPLICIT_COMMITMENT`, `eca8Handoff=false`, `eca8Writes=false`. No pre-decision challenge in the spoken reply. Compare turn had already said “not enough comparable evidence.” |
| Category | MRA-CONFIRMATION / MRA-DECISION |
| Severity | S1 |
| Reproducible | Yes |
| Owning subsystem | CC:10 approve strength vs ECA:8 challenge |
| Root-cause hypothesis | Explicit Approve is treated as sufficient CC:10 strength, so ECA:8 does not block or challenge even when ECA:7/POST:4 evidence is insufficient. |
| Evidence | `I-decision-path` compare reply vs Approve reply. |
| MRA:2 fix cluster | C7 Decision/Execution session continuity |

---

## MRA-1-003

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-003 |
| Manager utterance | `show me Completely Invented Problem` |
| Prior context | Cold start |
| Expected | That named problem does not exist; existing Problems remain listable. |
| Actual | “I don't see any Problems in the current context.” Canonical Problems still exist (Capacity Gap, Margin Pressure). |
| Category | MRA-COLLECTION / MRA-REFERENCE |
| Severity | S1 |
| Reproducible | Yes |
| Owning subsystem | NCA-POST:3 collection resolution when the name is unknown |
| Root-cause hypothesis | Unknown member is treated as empty collection rather than failed member lookup against canonical Problems. |
| Evidence | `L-adversarial` first turn vs later `show me all problems` listing two Problems. |
| MRA:2 fix cluster | C3 Collection catalog and membership |

---

## MRA-1-004

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-004 |
| Manager utterance | `delete Margin Pressure` |
| Prior context | After casual mutate attempts |
| Expected | Propose **remove** of Margin Pressure, or refuse if no delete writer, never propose add of a truncated name. |
| Actual | `mutationStatus=PROPOSED`, reply “I can add “Margin”. Add it?” |
| Category | MRA-INTENT / MRA-CONFIRMATION |
| Severity | S1 |
| Reproducible | Yes |
| Owning subsystem | ECA:1 mutation proposal / NLU operation |
| Root-cause hypothesis | Delete/remove is classified as PROPOSE_CHANGE ADD; name truncated to “Margin”. |
| Evidence | `H-casual-mutate` last turn. |
| MRA:2 fix cluster | C8 Mutation operation typing |

---

## MRA-1-005

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-005 |
| Manager utterance | `show me what is on Stage` |
| Prior context | After `Focus on Risk.` Stage META correctly listed Risk + visible actors (`what is on stage?`) |
| Expected | Same Stage membership as `what is on stage?` |
| Actual | “Do you mean the Margin Pressure problem or the Risk?” `ncaPost3Owner=BUSINESS`, not `WORKSPACE_STATE`. |
| Category | MRA-STAGE / MRA-INTENT |
| Severity | S1 |
| Reproducible | Yes |
| Owning subsystem | NCA-POST:3 scope / SHOW vs Stage-meta |
| Root-cause hypothesis | SHOW + “Stage” is not classified as workspace-state; stale/business objects win over NXA:5-FIX4 visibility. |
| Evidence | `C-stage-advisor` last two turns. Same split in `A-natural-conversation` after execution correction. |
| MRA:2 fix cluster | C2 Phrase-class routing (Stage-meta vs SHOW) |

---

## MRA-1-006

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-006 |
| Manager utterance | `how many problem we have` |
| Prior context | After `show problms` listed two Problems |
| Expected | Count = 2 (Capacity Gap, Margin Pressure) |
| Actual | Generic “not sure how that relates to the current executive context.” `owner=BUSINESS`, not `COLLECTION_QUERY`. |
| Category | MRA-COLLECTION |
| Severity | S1 |
| Reproducible | Yes |
| Owning subsystem | NCA-POST:3 collection query matcher / grammar recovery |
| Root-cause hypothesis | Count+typo/grammar does not hit `COLLECTION_QUERY`; CC not-found wins. Contrast: `show problms` still hits collection. |
| Evidence | `A-imperfect-english`. |
| MRA:2 fix cluster | C3 Collection catalog and membership |

---

## MRA-1-007

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-007 |
| Manager utterance | `and the other one?` |
| Prior context | `Capacity Gap` then `why` |
| Expected | The other Problem (Margin Pressure) in the two-problem set. |
| Actual | NCA:1 Outcome clarification: “which business outcome you're referring to.” |
| Category | MRA-REFERENCE |
| Severity | S1 |
| Reproducible | Yes |
| Owning subsystem | ECA:1 / NCA reference precedence vs NCA:1 Outcome need |
| Root-cause hypothesis | Contrastive “the other one” does not bind to the sibling of the active Problem; UNKNOWN + BUSINESS scope triggers Outcome questionnaire. |
| Evidence | `A-short-followups`. |
| MRA:2 fix cluster | C1 Reference resolution |

---

## MRA-1-008

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-008 |
| Manager utterance | `investigate it` |
| Prior context | `now tell me about Demand Surge` (focus still Capacity Gap) |
| Expected | Investigate Demand Surge (strongest current-turn subject). |
| Actual | “Which item do you mean?” Focus remains Capacity Gap. |
| Category | MRA-CONTEXT / MRA-REFERENCE |
| Severity | S1 |
| Reproducible | Yes |
| Owning subsystem | ECA:1 active subject vs current-turn explicit name |
| Root-cause hypothesis | Stage/MO focus is not updated on EXPLAIN of Demand Surge (`shouldCommitRuntime=false`), then “it” cannot resolve against the just-discussed scenario. |
| Evidence | `B-context-continuity`. |
| MRA:2 fix cluster | C1 Reference resolution |

---

## MRA-1-009

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-009 |
| Manager utterance | `what about the first problem?` |
| Prior context | Problems listed, then Demand Surge |
| Expected | Capacity Gap (first listed Problem). |
| Actual | “a decision from you is the highest-priority attention candidate because MANAGER AUTHORITY REQUIREMENT, DECISION REQUIREMENT.” |
| Category | MRA-TRUST / MRA-REFERENCE |
| Severity | S1 |
| Reproducible | Yes |
| Owning subsystem | NXA:5 / NCA:4 attention composition leaking architecture codes |
| Root-cause hypothesis | Ordinal collection reference is not resolved; attention engine emits internal requirement codes as Advisor copy. |
| Evidence | `B-context-continuity` last turn; similar copy in `L-adversarial` `what about weather in Paris`. |
| MRA:2 fix cluster | C4 Advisor composition / professionalism |

---

## MRA-1-010

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-010 |
| Manager utterance | `Can this data support the Capacity Gap?` |
| Prior context | CSV inventory explained (pending or committed) |
| Expected | Data-library/provenance answer: fields, confirmation status, whether Capacity is related — not a generic Problem investigation. |
| Actual | “Investigate Capacity Gap as a possible contributor — evidence is not strong enough… Uncertainty: is missing or uncertain. My recommendation remains temporary capacity.” DATA-ADV does not own the turn. |
| Category | MRA-DATA / MRA-EVIDENCE |
| Severity | S1 |
| Reproducible | Yes |
| Owning subsystem | DATA-ADV:1 classifier vs NCA BUSINESS explain |
| Root-cause hypothesis | Object+data support questions miss DATA-ADV lock; NCA investigation + leftover recommendation overlay win. |
| Evidence | `M-data-ambiguous` and `M-data-ready`. |
| MRA:2 fix cluster | C6 Data vs business routing |

---

## MRA-1-011

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-011 |
| Manager utterance | `What fields are confirmed?` / `What do you understand from it?` / `What don’t you understand?` |
| Prior context | After explaining the pending CSV |
| Expected | Confirmed vs unresolved fields on the current source. |
| Actual | Outcome clarification or “Which item do you mean?” |
| Category | MRA-DATA / MRA-QUESTION |
| Severity | S1 |
| Reproducible | Yes |
| Owning subsystem | DATA-ADV:1 follow-up / pronoun + field-coverage classifiers |
| Root-cause hypothesis | Follow-ups after a locked Data answer fall through to CC/NCA; dialogue does not keep the source as “it.” |
| Evidence | `M-data-ambiguous`. |
| MRA:2 fix cluster | C6 Data vs business routing |

---

## MRA-1-012

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-012 |
| Manager utterance | `show me goals` / `show me KPIs` / `show me evidence` / `show me outcomes` / `show me data objects` |
| Prior context | After Problems/Scenarios/Decisions/Executions (which work) |
| Expected | Honest empty collection **or** catalog members; Evidence should not recast Executions as “kpi items.” |
| Actual | Goals: “I don't see any Goals.” KPIs: “problem or the decision?” Evidence: “Both Capacity Expansion and Pricing Rollout are current kpi items.” Outcomes: “Name the one you want to investigate.” Data objects: “problem or the decision?” |
| Category | MRA-COLLECTION |
| Severity | S1 |
| Reproducible | Yes |
| Owning subsystem | NCA-POST:3 kind coverage vs catalog; Evidence query collision with Execution/KPI |
| Root-cause hypothesis | Only a subset of collection kinds are wired to canonical membership. Evidence/KPI/Outcome/Data Object hit BUSINESS ambiguity or mis-kinded members. Goals empty is catalog-true but Advisor still talks about a delivery goal in recommendations. |
| Evidence | `D-collections`. |
| MRA:2 fix cluster | C3 Collection catalog and membership |

---

## MRA-1-013

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-013 |
| Manager utterance | `what should I do?` / `Can you recommend one?` |
| Prior context | Problems or scenarios on Stage; compare said insufficient evidence |
| Expected | Recommendation aligned to catalog options, or “not enough evidence”; not an unnamed “temporary capacity” that the manager cannot open. |
| Actual | Repeated “I lean toward temporary capacity…” while ECA:7 may be `PREFER_OPTION/READY` even when compare said no rank. After failed Scenario A/B compare, recommendation drifts to Risk/Margin Pressure. |
| Category | MRA-RECOMMENDATION |
| Severity | S1 |
| Reproducible | Yes |
| Owning subsystem | NCA:4 / NXA:5 / ECA:7 composition vs catalog scenarios |
| Root-cause hypothesis | Advisory position uses a non-catalog option label; ECA:7 readiness can be READY while spoken compare is NOT ready; leftover recommendation attaches to later turns (`My recommendation remains temporary capacity`). |
| Evidence | `A-natural-conversation`, `E-isolated-show`, `G-recommendation`, `G-after-compare`. |
| MRA:2 fix cluster | C5 Recommendation identity and readiness |

---

## MRA-1-014

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-014 |
| Manager utterance | `Compare Scenario A and Scenario B.` |
| Prior context | Cold or after recommend |
| Expected | Map A/B onto the current scenario collection, or ask which two of Capacity Expansion Plan / Demand Surge / Pricing Response. |
| Actual | “I couldn't find a clear match for “Scenario A”.” |
| Category | MRA-REFERENCE |
| Severity | S2 |
| Reproducible | Yes |
| Owning subsystem | Entity match vs collection ordinals |
| Root-cause hypothesis | Letter aliases are not bound to current collection members. |
| Evidence | `G-after-compare`, `I-preference-not-decision`. |
| MRA:2 fix cluster | C1 Reference resolution |

---

## MRA-1-015

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-015 |
| Manager utterance | `no, I mean the execution` |
| Prior context | Problems collection + “which one is important?” + “what should I do?” |
| Expected | Switch to Executions collection (Capacity Expansion, Pricing Rollout). |
| Actual | Mixed: “Yes — the 2 Problems currently on Stage…” plus “Execution is not live yet.” Director `SHOW_COLLECTION` still Problems. Stage visible still Problems + Risk Watch. |
| Category | MRA-CONTEXT / MRA-COLLECTION |
| Severity | S2 |
| Reproducible | Yes |
| Owning subsystem | Correction intake vs collection retarget |
| Root-cause hypothesis | Correction is acknowledged in copy but collection/Stage membership is not retargeted to Executions. |
| Evidence | `A-natural-conversation`. |
| MRA:2 fix cluster | C1 Reference resolution |

---

## MRA-1-016

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-016 |
| Manager utterance | `explian it` |
| Prior context | Capacity Gap just explained |
| Expected | Explain Capacity Gap (CC:1 recovers explain). |
| Actual | Intent UNKNOWN; “Monitor Capacity Gap before changing the operating plan.” |
| Category | MRA-INTENT |
| Severity | S2 |
| Reproducible | Yes |
| Owning subsystem | ECA:2 / NCA vs leftover NCA:4 recommendation |
| Root-cause hypothesis | Typo recovery does not keep EXPLAIN; recommendation overlay becomes the answer. |
| Evidence | `A-imperfect-english`. Contrast: `explian Data` on DATA-ADV path works. |
| MRA:2 fix cluster | C2 Phrase-class routing |

---

## MRA-1-017

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-017 |
| Manager utterance | `now risks` |
| Prior context | Focused Capacity Gap |
| Expected | Show Risks collection (catalog has Risk). |
| Actual | Generic executive-context help. |
| Category | MRA-COLLECTION |
| Severity | S2 |
| Reproducible | Yes |
| Owning subsystem | NCA-POST:3 collection cue without SHOW verb |
| Root-cause hypothesis | Bare collection noun does not classify as COLLECTION_QUERY. |
| Evidence | `A-short-followups`. Contrast: `show me risks` works. |
| MRA:2 fix cluster | C3 Collection catalog and membership |

---

## MRA-1-018

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-018 |
| Manager utterance | `explain it` after `go back to problems` |
| Prior context | Capacity Gap explained, then scenarios, then Problems collection again |
| Expected | Ask which Problem, or continue with last Problem (Capacity Gap), not silently pick Margin Pressure. |
| Actual | Full Margin Pressure explanation. |
| Category | MRA-REFERENCE |
| Severity | S2 |
| Reproducible | Yes |
| Owning subsystem | ECA:1 recent vs collection member order |
| Root-cause hypothesis | After SHOW Problems, “it” binds to a collection member (Margin Pressure) rather than last discussed Problem. |
| Evidence | `B-stale-hijack`. |
| MRA:2 fix cluster | C1 Reference resolution |

---

## MRA-1-019

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-019 |
| Manager utterance | `Add this as a Risk.` |
| Prior context | Capacity Gap focused |
| Expected | Propose adding Capacity Gap as Risk, or ask what “this” is. |
| Actual | “I can add “this” as a RISK. Add it?” |
| Category | MRA-REFERENCE / MRA-CONFIRMATION |
| Severity | S2 |
| Reproducible | Yes |
| Owning subsystem | ECA proposal naming |
| Root-cause hypothesis | Pronoun is copied into the proposal name instead of resolved to active subject. |
| Evidence | `E-knowledge-nav-action`. |
| MRA:2 fix cluster | C8 Mutation operation typing |

---

## MRA-1-020

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-020 |
| Manager utterance | `no, I mean add Demand Shock as a Risk` |
| Prior context | Proposal: Add Supplier Delay as a Risk |
| Expected | Replace proposal with Demand Shock Risk. |
| Actual | “Do you mean Risk or Demand?” |
| Category | MRA-CONFIRMATION |
| Severity | S2 |
| Reproducible | Yes |
| Owning subsystem | ECA:5 correction vs proposal retarget |
| Root-cause hypothesis | Correction is treated as reference ambiguity (Risk vs Demand) instead of replacing the proposed name. |
| Evidence | `H-mutation-correction`. |
| MRA:2 fix cluster | C8 Mutation operation typing |

---

## MRA-1-021

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-021 |
| Manager utterance | Knowledge `What is Capacity Gap?` vs `Show Capacity Gap.` |
| Prior context | Isolated |
| Expected | Knowledge does not navigate (observed). Show may focus. Show should not inject an unrelated standing recommendation. |
| Actual | Knowledge: EXPLAIN, `shouldCommitRuntime=false`. Show: FOCUS_OBJECT + “My recommendation remains temporary capacity.” |
| Category | MRA-PRESENTATION / MRA-INTENT |
| Severity | S2 |
| Reproducible | Yes |
| Owning subsystem | NCA:4 leftover recommendation on SHOW |
| Root-cause hypothesis | Knowledge vs navigation distinction exists at ECA:2, but SHOW compose still attaches advisory overlay. |
| Evidence | `E-isolated-knowledge`, `E-isolated-show`. |
| MRA:2 fix cluster | C5 Recommendation identity and readiness |

---

## MRA-1-022

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-022 |
| Manager utterance | `now tell me about Demand Surge` |
| Prior context | Capacity Gap focused |
| Expected | Coherent scenario explanation. |
| Actual | “Investigate Demand Surge… Why: Demand Surge shows attention, but a is not established. Uncertainty: is missing or uncertain.” |
| Category | MRA-PRESENTATION / MRA-TRUST |
| Severity | S2 |
| Reproducible | Yes |
| Owning subsystem | NCA:6 / NXA:5 template slots |
| Root-cause hypothesis | Unfilled template tokens (`a`, empty uncertainty) are spoken to the manager. |
| Evidence | `B-context-continuity`; same pattern on hire question `F-missing-info`. |
| MRA:2 fix cluster | C4 Advisor composition / professionalism |

---

## MRA-1-023

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-023 |
| Manager utterance | `which problems are critical?` |
| Prior context | Problems listed |
| Expected | Use catalog attention (Margin Pressure is `critical`, Capacity Gap `important`) or say attention is presentation not business truth. |
| Actual | Generic “neither clearly dominates” comparison, no critical flag. |
| Category | MRA-COLLECTION |
| Severity | S2 |
| Reproducible | Yes |
| Owning subsystem | Collection filter vs POST:4 comparison |
| Root-cause hypothesis | “Critical” is treated as comparison, not attention metadata. |
| Evidence | `D-collections`. |
| MRA:2 fix cluster | C3 Collection catalog and membership |

---

## MRA-1-024

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-024 |
| Manager utterance | `show me all problems` (Advisor vs Stage) |
| Prior context | Overview then collection SHOW |
| Expected | Advisor membership and Stage visible members agree, or Advisor distinguishes collection vs leftover Overview actors. |
| Actual | Advisor: two Problems. Stage visible: Risk Watch + Capacity Gap + Margin Pressure. |
| Category | MRA-STAGE |
| Severity | S2 |
| Reproducible | Yes |
| Owning subsystem | DIR collection presentation vs NCA-POST:3 membership vs NXA:5-FIX4 visible set |
| Root-cause hypothesis | Collection SHOW does not clear Overview queue actors from Stage visibility; Advisor reports canonical collection only. |
| Evidence | `A-natural-conversation` first turn `stageVisible`. |
| MRA:2 fix cluster | C9 Stage/Advisor projection |

---

## MRA-1-025

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-025 |
| Manager utterance | `I don't know the owner` after `What is blocking delivery?` |
| Prior context | Blocking delivery was not-found as an object |
| Expected | Accept I don't know about owner, or say there was no owner question. |
| Actual | “Then I would avoid treating the increase as permanent…” (stale hire/demand thread). |
| Category | MRA-CONTEXT / MRA-QUESTION |
| Severity | S2 |
| Reproducible | Yes |
| Owning subsystem | ECA:5 / ECA:4 session last-question |
| Root-cause hypothesis | “I don't know” binds to an older information need, not the current failed lookup. |
| Evidence | `F-optional-unknown`. |
| MRA:2 fix cluster | C1 Reference resolution |

---

## MRA-1-026

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-026 |
| Manager utterance | `Are we ready to decide?` (cold recommend path) |
| Prior context | `What should I do?` already answered with temporary capacity |
| Expected | Decision-readiness about the current recommendation, not Outcome clarification. |
| Actual | “which business outcome…” plus ECA overlay “Not yet… not enough compared evidence.” |
| Category | MRA-QUESTION / MRA-RECOMMENDATION |
| Severity | S2 |
| Reproducible | Yes |
| Owning subsystem | NCA:1 Outcome clarification vs ECA:7 |
| Root-cause hypothesis | UNKNOWN readiness question is captured by Outcome need before ECA:7 speak. |
| Evidence | `G-recommendation` last turn. |
| MRA:2 fix cluster | C2 Phrase-class routing |

---

## MRA-1-027

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-027 |
| Manager utterance | `make Capacity Gap a goal` |
| Prior context | Overview |
| Expected | Propose Goal mutation only if a Goal writer exists; otherwise refuse. Do not invent a Goal store. |
| Actual | “I can add “Capacity Gap” as a GOAL. Add it?” (`mutationTarget=GOAL`) with no certified Goal writer in ECA handoff (Risk writer only). |
| Category | MRA-CONFIRMATION / MRA-ARCHITECTURE |
| Severity | S2 |
| Reproducible | Yes |
| Owning subsystem | ECA proposal vs missing Goal writer |
| Root-cause hypothesis | Generic ADD proposal is offered for GOAL without a canonical Goal handoff equivalent to Risk. |
| Evidence | `H-casual-mutate`. |
| MRA:2 fix cluster | C8 Mutation operation typing |

---

## MRA-1-028

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-028 |
| Manager utterance | `how many problems?` |
| Prior context | `show me problems` |
| Expected | “2” plus names optional. |
| Actual | Repeats the list, no count. Intent COUNT was not used (`EXPLAIN`). |
| Category | MRA-COLLECTION |
| Severity | S3 |
| Reproducible | Yes |
| Owning subsystem | Collection query COUNT vs SHOW |
| Root-cause hypothesis | Count phrasing still SHOW-lists membership. |
| Evidence | `D-collections`. |
| MRA:2 fix cluster | C3 Collection catalog and membership |

---

## MRA-1-029

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-029 |
| Manager utterance | `show me risks` |
| Prior context | Other collections |
| Expected | Named business risks, or one Risk object with a manager-facing name. |
| Actual | “Current Risks: Risk.” |
| Category | MRA-PRESENTATION |
| Severity | S3 |
| Reproducible | Yes |
| Owning subsystem | Catalog labels |
| Root-cause hypothesis | Fixture label is the type name. |
| Evidence | `D-collections`. |
| MRA:2 fix cluster | C4 Advisor composition / professionalism |

---

## MRA-1-030

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-030 |
| Manager utterance | `why?` after explain Capacity Gap |
| Prior context | Problems collection |
| Expected | One causal/uncertainty answer. |
| Actual | Duplicated “Capacity is connected…” sentences plus backlog question plus trade-off fragment. |
| Category | MRA-PRESENTATION |
| Severity | S3 |
| Reproducible | Yes |
| Owning subsystem | NCA:6 stacking with ECA overlays |
| Root-cause hypothesis | Multiple composers append overlapping paragraphs. |
| Evidence | `A-natural-conversation`. |
| MRA:2 fix cluster | C4 Advisor composition / professionalism |

---

## Observed non-failures (do not treat as Manager-Ready)

These paths behaved as a manager would hope, and must not be broken by MRA:2:

- `show me all problems` / `show problms` lists both Problems (NCA-POST:3).
- Focused Problem + `show me all problems` does not filter to one (`D-collection-vs-focus`).
- `What is Capacity Gap?` does not focus Stage.
- `what is on stage?` / `what objects are on stage?` use Overview actors, not Problems (POST-ECA:2 preserved).
- Risk mutation: propose → `Add it.` writes via canonical Risk writer; `No.` cancels; stale `Yes.` on empty context does not invent a Decision.
- `start it` without Decision refuses execution.
- Causal overclaim is treated as hypothesis, not cause.
- Outcome 91%→94% is manager-reported, not verified; “did the decision cause that?” refuses causality.
- Pending CSV inventory, BKL unknown, KPI math-vs-meaning, empty library, `explian Data` (DATA-ADV).
- Repeated `show me problems` stays stable.

## MRA-1-031

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-031 |
| Manager utterance | `I prefer Demand Surge.` → `Approve Demand Surge` → `start it` |
| Prior context | Live `/executive?reset=1` after `show scenarios` / `Compare them.` |
| Expected | If Execution started, Stage Decision/Execution membership and Advisor progress should agree. |
| Actual | Advisor: “Demand Surge is now the Approved decision” then “Execution has started.” Shell `data-stage-thread-decision-count=0` and `execution-count=0`. Follow-up “how is execution going?” prepends Outcome clarification. |
| Category | MRA-STAGE / MRA-EXECUTION |
| Severity | S1 |
| Reproducible | Yes (live) |
| Owning subsystem | CC:10/11 session vs DTH Stage thread projection |
| Root-cause hypothesis | Conversational Decision/Execution session is not the Stage thread counter / Theatre membership the manager can see. |
| Evidence | `live-audit.json` journey `decision`. |
| MRA:2 fix cluster | C7 Decision/Execution session continuity; C9 Stage/Advisor projection |

---

## MRA-1-032

| Field | Value |
| --- | --- |
| Failure ID | MRA-1-032 |
| Manager utterance | `What is Capacity Gap?` |
| Prior context | Live `/executive?reset=1` Overview (no prior Problem collection). Same utterance in isolated CC:5 runtime returns the definition. |
| Expected | Knowledge definition; no navigation; no standing recommendation. |
| Actual | Live: “Investigate Capacity Gap… but a is not established… My recommendation remains temporary capacity.” Focus stays none (no nav). Runtime isolated: definition without investigation template. |
| Category | MRA-PRESENTATION / MRA-INTENT |
| Severity | S1 |
| Reproducible | Yes (live vs `E-isolated-knowledge`) |
| Owning subsystem | Shell `/executive` overlays (NXA:4/NCA:4) vs CC:5 default compose |
| Root-cause hypothesis | Live Advisor attaches proactive/advisory overlay to a knowledge question that the orchestrator-alone path answers as EXPLAIN. |
| Evidence | `live-audit.json` `knowledgeVsShow`; `runtime-turns.json` `E-isolated-knowledge`. |
| MRA:2 fix cluster | C5 Recommendation identity and readiness; C4 Advisor composition |

---

## Severity counts

| Severity | Count (mapped failures) |
| --- | --- |
| S0 | 0 |
| S1 | 15 (001–013, 031–032) |
| S2 | 14 (014–027) |
| S3 | 3 (028–030) |
