# NPA-T SIM-TEST:6-FIX14-R3 — CERTIFIED

R3 is **CERTIFIED**. All three false-positive Runtime commits shared one semantic-to-presentation defect: a resolved Scenario explanation was promoted to explicit Stage focus before the existing Director made its mutation decision.

## Repair

- Production file changed:
  - `app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- Focused regression added:
  - `app/lib/sim-test/nexoraSimulationScenarioRuntimeFix14R3.test.ts`
- Production change: `explain-scenario` remains a resolved read operation and no longer enters the generic explicit-advisor-subject focus handoff.
- Why it generalizes: the correction uses the existing canonical intent kind and applies to all supported named Scenario descriptions; it does not inspect utterance text, Scenario ID, profile, test, or turn number.
- Read/write authority preserved: **YES**. The Director still exclusively decides presentation mutation from semantic presentation requests.
- New authority/store introduced: **NO**.

## Runtime proof

- `What is Demand Surge Scenario?`: PASS.
- Explanation mutation guard: PASS.
- `explain DEMAND SURGE`: PASS.
- Legitimate Scenario presentation mutation (`Show scenarios`): PASS.
- Runtime state unchanged for explanation: PASS.

## Regression and funnel

- R2 navigation: PASS.
- FIX10–FIX14: PASS.
- CC:10 authority: PASS.
- Ground Truth leakage: NO.
- NXA Level 1: PASS — 19 pass / 0 fail.
- NXA Level 2: FAIL — 451 pass / 2 fail.
- New Level 2 failures: 0.
- Required tasks running, unresolved, unobserved, or cancelled: 0.

The two remaining `why?` failures are independent and received no additional R3 code.

## FIX14 status

**SIM-TEST:6-FIX14 — STILL NOT CERTIFIED.**

The absolute-green Level 2 contract remains blocked by the two known Scenario follow-up semantic/response-fidelity failures. Levels 3 and 4 were not run. R4 and Impatient T8 were not started.
