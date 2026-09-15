# MRA:3 independent recertification plan

Validation only. No production patch. Previous FIX certifications are historical context, not a pass.

## Question

Can a real manager use the current Nexora MVP reliably across Stage, Data, investigation, Scenario, Decision, and Execution?

## Evidence sources

1. Isolated CC:5 manager simulation (`scripts/mra-3-final-recert-runtime-simulation.ts`) — journeys + 55-turn long session + composition traces.
2. Live `/executive` (`scripts/mra-3-final-recert-live-simulation.mjs`) — same semantic paths, Stage click, CSV import, 50+ turn session, 0 page-error requirement.
3. Current regression funnel NXA L1–L4 (includes TypeScript and production build) plus focused 6.2/6.3, mutation, DATA/FIX2-FIX1, Outcome, Decision Theatre baselines.

## Mandatory live regressions

- Scenario → CSV → Capacity Gap → Stage click away → look at Capacity Gap → explain it → Capacity Gap (not Capacity Expansion Plan)
- Demand Surge → explain it → Demand Surge
- look at capcity → Capacity Gap
- Scenario → CSV → explain it → CSV
- CSV → Capacity Gap → explain it → Problem
- Ambiguous `explain it` after HELP → clarify
- Mutation: add risk → topic change → yes → no stale write
- Decision approval is not silent; Execution starts only after approved Decision

## Severity

S0/S1 block certification. S2/S3 go to Conversation Intelligence backlog.
