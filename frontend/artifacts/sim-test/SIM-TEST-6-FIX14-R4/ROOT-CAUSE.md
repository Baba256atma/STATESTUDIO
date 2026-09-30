# SIM-TEST:6-FIX14-R4 Root Cause

## Stop condition

R4 is certifiable only if both exact Scenario `why?` failures are reproduced and repaired at an existing owner, subject continuity is separated from operation continuity, modeled evidence remains explicitly non-causal, the R3 read-only boundary remains intact, and NXA Level 2 reaches absolute green without a new authority or Scenario-specific rule. A green Level 2 requires Levels 3 and 4 to run before FIX14 status is decided.

## Pre-repair trace

| Case | Previous turn / active subject | `why?` interpretation | Expected operation | Actual operation | Expected response | Actual response | First wrong seam |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Demand Surge | `explain DEMAND SURGE` / `ctx-scenario-demand` | retain Scenario subject and request reason/relationship explanation | `impact-why` | `describe` | grounded reason semantics without causal invention | repeated Scenario description semantics | Scenario follow-up operation selection in `conversationalExperienceOrchestrator.ts` |
| Delayed Delivery | `Show Delivery` → `What if Delivery is too late?` / active generated Delivery Scenario | retain active Scenario and explain its supported relationship | `impact-why` | `describe` | state the modeled relationship and deny proven causality | descriptive association without the required modeled-relationship fidelity | same operation-selection seam; the existing `impact-why` composer was never reached |

The two exact failures reproduced before production repair: 0 pass / 2 fail.

## Layer audit

- CC:1 already classified bare `why?` as an explain request.
- Scenario subject continuity already retained the active Scenario correctly.
- The semantic handoff incorrectly used the broad `isDeicticSubjectFollowUpUtterance` subject-continuity predicate to choose `describe`.
- This conflated two independent concerns: retaining the current subject and selecting the operation expressed by the new utterance.
- The existing CC:9 `impact-why` path already owned response composition and causal qualification.
- For evaluated Scenarios, evidence originates in `evaluation.groundedImpact.affectedTargets[].impactBasis`; it is modeled Scenario evidence, not an observed or proven cause.
- For unevaluated Scenarios, the existing projection path describes an association and explicitly denies a proven causal finding.

## Classification and repair

- A/B classification: **SAME-ROOT**, with the Delayed Delivery response-fidelity failure downstream of the stale semantic operation.
- Owning seam: existing Scenario follow-up operation selection in `conversationalExperienceOrchestrator.ts`.
- Repair: `describe` is now selected only for the existing deictic Scenario description predicate. A stronger `why?` utterance retains the Scenario subject while selecting the existing `impact-why` operation.
- Response composer changed: **NO**. The repair makes the existing CC:9 grounded response reachable.
- Evidence or causal model changed: **NO**.
- New authority/store introduced: **NO**.
- Scenario-specific hard coding: **NO**.

## Level 4 classification

Level 4 exposed five failing tests in three independent, earlier or non-Scenario seams:

1. NLU ambiguity: `Show the risk problem.` resolves to Margin Pressure instead of remaining unresolved.
2. Smart clarification: `Explain that.` after two active subjects proceeds instead of clarifying; this diverges in clarification gating before Scenario operation selection.
3. Trusted communication: generic object `Why?` responses exceed six sentences. A direct Delivery probe produced intent `explain`, no Scenario payload, and no `impact-why` operation.

None traverses the repaired Scenario operation branch. These failures block FIX14 milestone certification but do not invalidate the R4 Level 2 repair.
