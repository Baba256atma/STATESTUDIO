# NEX-CONV:1 — Architecture inspection

Inspection date: 2026-09-05.

## Current conversation architecture

Manager turns already flow through CC:5 `executeNexoraConversationalExperience`:

NCA meaning (`interpretCanonicalManagerMeaning` / contextual meaning) →
subject/reference (NCA/NXA/MO continuity) →
clarification (NCA:2/6.3) →
Advisor/EI/MO composition →
Director/Stage presentation.

NEX-ENT educational turns intercept **after** meaning exists, via `shouldNexoraGuidedEntranceOwnUtterance`, and lock presented copy. They do not own business truth.

## NCA authority

Canonical manager meaning remains NCA / FINAL:6.1:

- communicative intent, requested operation, question type, object reference
- dialogue state and clarification
- advisory reasoning (NCA:4) and composition policy (NCA:6/7)

NEX-CONV does not parse utterances for intent. Object education may **consume** NCA meaning to decide that a turn is an IDENTIFY/WHY_PRESENT question.

## Advisor authority

Advisor / MO / EI still determine what can truthfully be said or recommended. The Kernel selects a Conversational Move (strategy), not business content.

## FIX1/FIX2 continuity

`guidedIntroduction.conversationContinuity` already stored bounded lesson facts:

- subject, lastAction, lastResult
- per-purpose depths: capability, appears, focus explain/why, dashboard, stage
- lastEducationalResponse (explicit repeat)

FIX2 added coverage `NONE → INTRODUCTORY → DEEPENED → PRACTICAL → SATURATED` without repeat counts.

That mechanism was **local to entrance named fields**. Object education `THIS`/`WHY` still returned a single template (`explainKind` / `WHY_STAGE`).

## Object education response architecture (pre-CONV)

`replyFor("THIS")` → `explainKind(kind)`  
`replyFor("WHY")` → `WHY_STAGE`

No coverage, no saturation. Repeating “What is this?” or “Why is it on Stage?” reselected the same sentence.

## Repetition root cause

Not NCA, not Advisor, not Stage, not a missing transcript store.

**Phrase → educational template** for object identity/why, with no semantic coverage keyed by `(subjectId, purpose)`.

FIX1/FIX2 already solved the same class of defect for Capability / Appears / Focus. Object education did not consume that progression authority.

## Chosen Kernel authority

New canonical owner: **NEX-CONV:1 Conversation Kernel**

- `resolveConversationalMove` is deterministic and local (no extra LLM round-trip)
- coverage is scoped by `subjectId + purpose`
- ENT Stage/Focus/Capability **consume** the Kernel for depth advancement (FIX1/FIX2 named fields remain projections)
- Object education IDENTIFY/WHY_PRESENT consume the same policy
- Composer remains outside the Kernel

## Move model

`ANSWER | DEEPEN | CONNECT | OFFER_NEXT | CLARIFY | REPEAT | EXPLAIN_WHY | SHOW | COMPARE | INVESTIGATE | CONTINUE | SUMMARIZE`

No `CONFIRM` (Decision collision). SHOW is a conversational request, not a Stage write.

## Progression model

Reuse FIX2 coverage: `NONE | INTRODUCTORY | DEEPENED | PRACTICAL | SATURATED`.

Advance is coverage-based, not `repeatCount`.

## Context horizons

- Turn: meaning, subject, previous move/result (Kernel input)
- Working: `conversationContinuity.working.threads` (bounded 16), pending offer/clarification, lastDecision
- Durable manager context: unchanged existing authorities (not created here)

## Action-result feedback

Threads record `lastCapabilityRequest` / `lastCapabilityResult`. Failed SHOW is not treated as demonstrated. FIX1 Focus explain-after-show still keys off successful `DEMONSTRATE` + `PRESENTED`.

## LLM boundary

Move selection does not use an LLM. If an LLM later composes wording, it must not change subject, evidence, Decision/Execution, Stage, or Data semantics.

## Safety boundaries

Kernel writes zero business truth. Saturation does not auto-advance lessons (`NEXT` remains an explicit manager request). Continue/Show are not Decision/Execution.

## Duplicate-authority audit

| Candidate | Finding |
| --- | --- |
| Conversational Move | None prior; Kernel now owns |
| Progression policy | FIX1/FIX2 depth; **generalized** into Kernel |
| Response strategy | Educational composers remain composers |
| Dialogue move | NCA dialogue move unchanged |
| Conversation depth | FIX2 coverage reused |
| Repetition handling | FIX2 for Stage; Object education now consumes Kernel |
| Saturation | FIX2 `SATURATED`; now generic |
| Conversation continuity | FIX1 object **adapted as projection** over Kernel working context |
| Second NLU / Advisor / Stage / Director / Decision / Data / transcript DB | None introduced |

## FIX1/FIX2 migration

**A. Generalized + B. Adapted named fields**

`advanceExplanationDepth` now aliases Kernel `advanceConversationCoverage`. Appears / Capability / Focus Why call `resolveConversationalMove`. Named depth fields remain so certified FIX2 tests keep reading `appearsDepth` etc. Working threads are the generic ledger (object education + lastDecision diagnostics).
