# MVP-OUT:1 Runtime Integration Contract

Identity: `MVP-OUT:1/OutcomeLearningRuntimeIntegration` **1.0.0**

Module: `frontend/app/lib/nex-mvp/nexoraOutcomeLearningRuntimeIntegration.ts`

## Responsibility

Orchestrate one journey:

Decision / Execution refs (NEX-MVP:8 or explicit)
→ expected Outcome (canonical contract)
→ Data Reality observations (only when supplied)
→ CORE-OUT:1A capture + window + linkage
→ CORE-OUT:1 evaluation
→ CORE-OUT:2 Learning
→ APP-4 only if `authorizeApp4Promotion === true`
→ EXI:5 read model
→ Advisor / Conversation

## Non-goals

- No new Decision / Execution / Reality / Outcome / Learning / causal authority
- No CC:11 wiring
- No LLM
- No Stage redesign
- No invented timestamps, provenance, Actuals, or Learning
- No automatic APP-4 promotion on live `/executive`

## Empty states are success

A valid live result is:

- Expected Outcome may exist as a scenario/decision prediction
- Execution may exist as NEX-MVP:8 presentation
- No validated post-decision Actual
- Outcome pending
- Learning candidates = 0
- APP-4 promotion = none
