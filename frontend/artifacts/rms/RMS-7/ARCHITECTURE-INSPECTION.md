# NPA-T RMS:7 — Architecture Inspection

Inspection date: 2026-09-17.

Stop: Scenario Library only. Do not start RMS:8.

## Inspected authorities

- RMS:1 foundation / actor contracts (`rmsFoundation.ts`, `rmsSession.ts`)
- RMS:2 Ground Truth / world engine / Northstar and Warehouse fixtures
- RMS:3 Operator / observation policy / RDI publication
- RMS:4 Manager Agent / CC:5
- RMS:5 Observer measurement
- RMS:6 event compile/runtime/fixtures
- NMI:1 Unified Company contracts
- BCA Business/Project context kinds
- VAI causal-safety boundary
- NPS / Data Reality / RDI:1 handoff
- D7 `app/lib/simulation` — operational-graph substrate, not RMS Ground Truth

## Reuse

Existing Northstar and Warehouse worlds become World Templates. Combined/project/supplier disturbance fixtures become Scenario event schedules. `RMS_DEFAULT_OBSERVATION_POLICY` remains the Operator policy; Scenarios only select enabled source families.

No parallel world/operator/manager/observer/event engines.
