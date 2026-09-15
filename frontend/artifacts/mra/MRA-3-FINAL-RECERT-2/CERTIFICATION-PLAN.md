# MRA:3 independent recertification plan (RECERT-2)

Validation only. No production patch. MRA:3-RECERT-FIX1 is historical context, not a pass.

## Question

Is the current integrated Nexora MVP reliable, understandable, safe, and trustworthy enough for a real manager to use?

## Evidence sources

1. Isolated CC:5 (`scripts/mra-3-final-recert-2-runtime-simulation.ts`)
2. Live `/executive` (`scripts/mra-3-final-recert-2-live-simulation.mjs`) — authoritative manager experience
3. Current NXA L1–L4 plus focused 6.2/6.3, RECERT-FIX1 deictic suite, FINAL-FIX1-FIX1 fidelity, mutation, DATA/FIX2-FIX1

## Mandatory live regressions

- Scenario → CSV → Capacity Gap → Stage click away → look at Capacity Gap → explain it → Capacity Gap
- same path → tell me more about it → Capacity Gap
- Demand Surge → explain it → Demand Surge
- Demand Surge → tell me more about it → Demand Surge
- Demand Surge → how sure / impact → Demand Surge Scenario intelligence
- Tell me more about Capacity Expansion Plan → Capacity Expansion Plan
- look at capcity → Capacity Gap
- Scenario → CSV → explain it → CSV
- CSV → Capacity Gap → explain it → Problem
- Ambiguous `it` after HELP → clarify
- Mutation: add risk → topic change → yes → no stale write
- Decision approval is not silent; Execution starts only after approved Decision

## Severity

S0/S1 block certification. S2/S3 go to Conversation Intelligence backlog.
