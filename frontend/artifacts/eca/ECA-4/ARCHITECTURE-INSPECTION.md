# NPA-T ECA:4 — Architecture Inspection

Date: 2026-09-07

## Stop condition

ECA:4 may be certified only when one read-only information-need judgment consumes certified ECA:1 context, the certified ECA:2 action plan, and optional ECA:3 initiative; distinguishes ambiguity from information gaps; checks existing authoritative information before asking; plans at most one minimum necessary question or proceeds with uncertainty; never writes business/Stage/Data truth; passes focused A–T and multi-turn sequences; passes seven live `/executive` proofs; and preserves ECA:1–3 plus NXA Level 4, TypeScript, ESLint, build, and `git diff --check`.

## Existing questioning / missing-information authorities

| Concept | Existing authority | Reuse decision |
| --- | --- | --- |
| Working situation | ECA:1 | Required input. |
| Conversational next move | ECA:2 `ASK_CLARIFICATION` / `ASK_FOR_MISSING_INFORMATION` / `SHOW_UNCERTAINTY` | ECA:4 enriches these; does not replace the planner. |
| Suggested turns | ECA:2 `suggestedManagerTurns` | Reuse. No second chip system. |
| Initiative | ECA:3 | May flag `MISSING_CRITICAL_INFORMATION`. ECA:4 decides *what* to acquire. No recursion. |
| Conversational question ranking | NCA:3 `evaluateNca3QuestionStrategy` | Owns whether a conversation-level gap is worth asking. ECA:4 does not recreate NCA:3. |
| NCA-POST comparison clarification | NCA:3 `buildNca3ComparisonCriterionClarification` | Leave as comparison-criterion authority. |
| Pending question / I don’t know / defer | NCA:2 pending question + CSV semantic utterance kinds | Session reuse. No new durable memory. |
| Reference ambiguity | ECA:1 unresolved + ECA:2 `ASK_CLARIFICATION` + FINAL:6.3 | Not an information gap. |
| Semantic confirmation | DATA-ADV / `nexoraNcaCsvSemanticClarification` | Canonical for CAP_AV LIKELY vs missing value. |
| Data truth | Data Reality | Inspect only. |
| Proposal/confirmation | ECA:1-FIX2 + Risk handoff | Answers that would mutate remain on that path. |
| REX `provide-missing-information` | Runtime executive action orchestration | Different runtime domain. Do not reuse as Advisor questioning. |
| APP-3 missing_information diagnostic | Frozen Executive Intent confidence | Inspected; not a conversational planner. |

## NCA:3 vs ECA:4

NCA:3: *Can this conversation ask a ranked information-gap question given NCA need and known facts?*

ECA:4: *Given the certified ECA:2 executive objective and ECA:1 NOW, what information is missing, is it necessary for that objective, which source should supply it, and what is the smallest useful question — or should we proceed with uncertainty / not ask?*

## What ECA:4 uniquely adds

Necessity (OPTIONAL → BLOCKING) bound to the current ECA:2 intent; availability including KNOWN_UNCONFIRMED vs MISSING; source candidate (MANAGER / EXISTING_DATA / …) without contacting anyone; one question plan with why-explanation; skip / I don’t know / proceed-with-uncertainty as first-class acquisition actions; diagnostics for developers.

## Dependency direction

ECA:1 → ECA:2 → ECA:3 → ECA:4. ECA:4 does not call ECA:2 or ECA:3. It references the ECA:2 plan (`intent`, `nextAction`, `suggestedManagerTurns`).

## Why this is not a second clarification engine

Reference ambiguity remains ECA:1/NCA/FINAL:6.3. Semantic confirmation remains DATA-ADV. NCA:3 remains conversation-level question strategy. ECA:4 only judges information *need* against the executive objective.

## Writer / communication / retrieval boundaries

No Risk, Decision, Execution, Outcome, Learning, Stage, or Data writer. No RAG, SQL, web research, employee messaging, Mini Nexora, email, Slack, or notifications. Source identification may name EMPLOYEE_OR_OWNER without sending a message.
