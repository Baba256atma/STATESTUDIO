# NPA-T ECA:2 — Architecture Inspection

Date: 2026-09-07

## Stop condition

ECA:2 may be certified only when one deterministic planner consumes the certified ECA:1 working context, produces one bounded conversational next action, preserves every writer boundary, passes focused cases A–T and the four required multi-turn sequences, passes all seven live `/executive` proofs, and passes the canonical regression, Level 4 funnel, TypeScript, ESLint, build, and `git diff --check` gates with no unresolved product failure.

## Existing authorities inspected

| Concept | Existing authority | Reuse decision |
| --- | --- | --- |
| Linguistic meaning | `canonicalManagerMeaning.ts` (NEX-MVP-FINAL:6.1 NLU) | Consume its communicative intent, operation, question type, modality, confidence, ambiguity, and explicit references. ECA:2 does not parse a second canonical meaning. |
| Working conversational situation | `ecaWorkingConversationContext.ts` (ECA:1) | Required primary input. Reuse its active subject/object/collection, reference provenance, ambiguity, data context, comparison context, interaction mode, NOW→NEXT projection, and mutation proposal. |
| Conversation strategy | `nexoraConversationPolicy.ts`, `nexoraConversationalMove.ts`, and the NEX-CONV kernel | Preserve as the turn/thread move authority. ECA:2 is a narrower executive-purpose and safety projection and does not replace coverage/progression or render wording. |
| Proposal and confirmation | ECA:1 `EcaMutationProposal`, manager-object session proposal, and `ecaRiskMutationHandoff.ts` | Reuse the existing proposal identity and confirmation binding. ECA:2 may plan `PREPARE_PROPOSAL`, cancellation, or handoff; it creates no proposal store and calls no writer. |
| Risk mutation | `canonicalRiskWriter.ts` via `handoffEcaRiskMutation` | Canonical writer remains the only Risk mutation authority. |
| Stage and presentation | NXA:5-FIX4 Stage read model and `nexoraSemanticPresentationDirector.ts` | Read context only. ECA:2 neither selects Stage nor moves camera, writes topology, or renders response copy. |
| Comparison and Theatre | NCA active comparison state and Decision Theatre projection | Reuse referenced comparison candidates/criterion and route comparison/review toward existing intelligence. No second comparison state. |
| Decision | CC:10 Decision Commitment plus canonical Decision Runtime adapter | ECA:2 can identify review/commit intent and name the handoff target, but cannot commit, approve, or store a Decision. |
| Execution | CC:11 Execution Follow-up plus canonical Execution Runtime adapter | ECA:2 checks whether a committed Decision reference is available and either plans a handoff or exposes the prerequisite. It cannot create/start/transition Execution. |
| Outcome and Learning | Existing lifecycle read/intelligence authorities | ECA:2 plans review/reassessment only and preserves observed-result, baseline, target, uncertainty, and causality boundaries. It creates neither Outcome nor Learning. |
| Data semantics | DATA-ADV/Data Reality context supplied through ECA:1 `activeDataSource` | Reuse semantic status and evidence references. `LIKELY`/proposed semantics remain uncertain; ECA:2 cannot confirm a field meaning. |
| Business/project/role | ECA:1 BCA-derived business and manager contexts | Secondary planning context only; never an authorization or source of invented facts. |

## First divergent layer and missing capability

Expected: after ECA:1 establishes the current conversational situation, the system should state what executive objective the manager is pursuing and select one safe, useful, bounded conversational next action with explicit context requirements, uncertainty, provenance, and (when applicable) an existing authority target.

Actual: NLU exposes linguistic meaning, ECA:1 exposes working context, and NEX-CONV exposes generic conversational moves, but no canonical projection combines them into an executive-intent/action-plan diagnostic. Proposal, Decision, Execution, Stage, and Data authorities already exist and must not be duplicated.

Classification: genuinely missing planning layer, not an ECA:1 defect and not an authority/writer defect.

## Chosen ECA:2 boundary

Add a pure, deterministic, read-only `ExecutiveIntentConversationActionPlan` projection adjacent to ECA:1 under `nexora-conversation`. It accepts the current utterance only as the explicit current-turn signal, the certified ECA:1 context, any still-active proposal, and explicit lifecycle references supplied by the orchestrator. It returns:

- one executive intent;
- authoritative subject/reference IDs already present in input;
- required-context availability classifications;
- exactly one primary conversational action and at most two meaningful alternatives;
- clarification/confirmation requirements;
- an existing authority target where relevant;
- uncertainty and provenance explaining the selection.

The plan is diagnostic/advisory. It has no store, no timers, no LLM dependency, no DOM dependency, no response writer, and no mutation methods.

## Why this is not another NCA

NCA remains the canonical natural-language and dialogue-state authority. ECA:2 consumes NCA meaning already embedded in ECA:1; it does not introduce a competing parser, semantic reference resolver, conversation memory, dialogue move, or thread progression model. Its output answers the downstream question “what safe conversational objective comes next?” rather than re-answering “what did the utterance mean?”

## Why this is not a workflow engine

The output is a single-turn plan with one primary conversational action. There is no process database, generic transition graph, job queue, scheduler, or executable command vocabulary. Multi-turn continuity remains in the existing NCA/ECA:1 session authorities.

## Why this is not a business writer

ECA:2 contains no writer reference callable by the planner. `HANDOFF_TO_CANONICAL_AUTHORITY` is a declarative route, not execution. Risk, Decision, Execution, Outcome, Learning, Stage, and Data semantics retain their existing canonical writers and guards.

## Relationships

- **ECA:1:** owns NOW and context/reference resolution; ECA:2 references that object and formalizes the safest useful NEXT.
- **Director/Stage:** provide read/presentation context and consume downstream behavior; ECA:2 neither mutates Stage nor dictates manager-facing prose.
- **Data:** ECA:2 reads status/evidence and converts insufficient or proposed semantics into explicit uncertainty or a missing-information action.
- **Decision/Execution:** ECA:2 recognizes executive intent and prerequisite state, then names CC:10 or CC:11 as the handoff target. Only those authorities may perform lifecycle transitions.

## Implementation scope

Planned production changes are limited to one new planner module, its read-only result field on the existing conversational experience result, and composition in the existing orchestrator immediately after ECA:1 context creation. Focused tests will exercise A–T and multi-turn continuity without using a second runtime or store.
