# NPA-T SIM-TEST:6-FIX14-R4 — CERTIFIED

R4 is **CERTIFIED** at its stated contract. Both remaining Level 2 Scenario `why?` debts shared one stale-operation rule and are repaired through the existing semantic and response authorities. NXA Level 2 is absolutely green at 453 pass / 0 fail.

## Implementation

- Production file changed: `app/lib/conversational-control/conversationalExperienceOrchestrator.ts`.
- Focused regression added: `app/lib/sim-test/nexoraSimulationScenarioWhyFix14R4.test.ts`.
- Subject continuity and operation continuity are now independent: the active Scenario persists, while an explicit reason question selects `impact-why` rather than inheriting `describe`.
- Existing CC:9 grounded evidence composition supplies the modeled relationship and causal qualification.
- New authority/store introduced: **NO**.
- Scenario-specific hard coding: **NO**.
- Ground Truth leakage: **NO**.

## Certification proof

- Demand Surge explain → `why?`: PASS.
- Subject continuity: PASS.
- Operation transition: PASS.
- Delayed Delivery modeled-relationship fidelity: PASS.
- Causal safety: PASS.
- Subjectless `why?` guard: PASS.
- R3 read-only/Runtime guard: PASS.
- R2 and FIX10–FIX14 bounded regression: PASS.

## Funnel and FIX14 status

- Level 1: PASS — 19/19.
- Level 2: PASS — 453/453.
- Level 3: PASS — 48/48.
- Level 4: FAIL — 1656/1661.
- Required tasks running, unresolved, unobserved, cancelled, or waiting for approval: 0.

**SIM-TEST:6-FIX14 — STILL NOT CERTIFIED.**

Level 4 is blocked by independent NLU ambiguity, smart-clarification, and generic trusted-communication verbosity failures. The smallest next certification-recovery blocker is the single NLU ambiguity case for `Show the risk problem.` R4 did not modify that seam.

**SIM-TEST:6 — NOT CERTIFIED.**

The remaining Impatient S1 inventory remains:

- T8 `MISSING_DECISION` — next earliest independent SIM-TEST:6 blocker.
- T16 `STALE_REFERENT`.
- T30 `ADVISOR_DIVERGENCE`.
- T31 downstream of T30.

T8 was not started.
