# NPA-T NPS:2 — Problem Understanding & Investigation

**Status: CERTIFIED**

Certification date: 2026-09-15.

NPS:3 was not started.

## Verdict

**NPA-T NPS:2 — Problem Understanding & Investigation: CERTIFIED**

For a specific canonical Problem, Nexora can determine what is known, what remains unknown, and the smallest useful next investigation need; route that need to ECA:4 or FINAL:5; keep Problem ownership across follow-ups; and advance the NPS:1 path toward Evidence Review without inventing facts, causes, or a parallel authority.

## Architecture inspected

See `ARCHITECTURE-INSPECTION.md`. Problem truth, active Problem ownership, ECA questioning, FINAL:5 investigation, Data Reality/Evidence, and manager confirmation owners were inspected before code was added.

## Authorities reused

NPS:1 path, MO Problem identity, ECA:3–6 conversation intelligence, FINAL:5 investigation, CORE-INT:3 recorded causal constraints, Data Reality / catalog observations. No second Problem, question, or investigation engine.

## Files created / modified

Created:

- `frontend/app/lib/nexora-problem-solving/npsProblemUnderstanding.ts`
- `frontend/app/lib/nexora-problem-solving/npsProblemUnderstanding.test.ts`
- `frontend/app/lib/nexora-problem-solving/npsProblemUnderstandingRuntime.ts`
- `frontend/app/lib/nexora-problem-solving/npsProblemUnderstanding.runtime.test.ts`
- `frontend/artifacts/nps/NPS-2/*`

Modified:

- `conversationalExperience.ts` / `conversationalExperienceOrchestrator.ts` — attach read-only NPS:1/2 projections and a bounded manager overlay
- `managerObjectActive.ts` — session `npsProblemId` continuity hint (not a Problem store)

## Problem Understanding contract

`composeNpsProblemUnderstanding` derives `problemId`, `problemTitle`, known facts/symptoms/constraints, unknowns, assumptions, unresolved questions, available/missing evidence, `understandingStatus`, `nextInvestigationNeed`, and supporting references from observed facts.

Statuses: `INSUFFICIENT` | `PARTIAL` | `INVESTIGABLE` | `SUFFICIENT_FOR_NEXT_STEP` | `BLOCKED`.

## Investigation-need resolver

The composer picks one action:

- `ASK_MANAGER` — business meaning is not in trusted evidence; ECA:4 owns asking
- `INVESTIGATE_EXISTING_EVIDENCE` — trusted evidence exists; FINAL:5 owns investigation
- `CLARIFY_PROBLEM` — NPS:1 ownership is UNCERTAIN/CONFLICTED
- `WAIT_FOR_EVIDENCE` — required evidence is unavailable; no fake progress
- `READY_FOR_NEXT_STEP` — understanding is enough to enter evidence review

## NPS:1 integration

Missing understanding stays `UNDERSTANDING`. Active investigation becomes `INVESTIGATING`. Completed investigation with usable evidence may become `EVIDENCE_REVIEW`. Path advancement still produces zero canonical mutations.

## Causal-safety proof

Focused test I: symptom + correlation is investigation direction only. `confirmedCause` is always null. Observation, symptom, correlation, and manager statement are not promoted to cause.

## Live proof

Production conversational path (`executeNexoraConversationalExperience`, the `/executive` pipeline):

1. `Investigate Capacity Gap.` → determined Problem, known vs unknown, ask vs existing-evidence action, next investigation step
2. `Why do we need that?` then `Investigate it.` → same Problem (`ctx-problem-capacity`)

## Test results

| Gate | Result |
| --- | --- |
| NPS:2 focused A–J | 11/11 PASS |
| NPS:1 regression | 18/18 PASS |
| ECA:4 questioning | 49/49 PASS |
| ECA:5 intake | 53/53 PASS |
| ECA:2-FIX1 referent | 8/8 PASS |
| FINAL:5 / investigation continuity / MRA investigation fidelity | 32/32 PASS |
| ECA:4 runtime | 8/8 PASS |
| NPS:2 live runtime | 2/2 PASS |
| ESLint on changed files | PASS |
| Full typecheck / production build / NXA Level 4 | Not run (not required beyond changed-surface lint) |

## Remaining gaps for NPS:3

- Evidence sufficiency scoring beyond PARTIAL/SUFFICIENT flags
- Cause vs contributor vs constraint ranking using CORE-INT:3 without NPS inventing causality
- Variable/hypothesis comparison as evidence review, not option generation
- Theatre presentation of evidence/cause scenes

Do not start NPS:3 from this certification.
