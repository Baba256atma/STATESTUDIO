# NPA-T RMS:1 — Foundation contract

Identity: `NPA-T RMS:1/RealManagementSimulationFoundation`

Reusable host: any future Business/Project model identified by opaque `hostKind` + `hostId`. Unified Company is deferred.

## Flow

Simulation World → Operator Agent → Observable Data → Nexora ↔ Manager Agent

Observer is outside the chain.

## Identity (minimum)

`simulationId`, `simulationType`, host identity, simulation clock (`tick`, `simulatedAt`), lifecycle, actor identities, `sessionId` / `runId`.

## Interaction modes (reserved)

- `WATCH` — default; customer later watches Manager Agent + Nexora
- `TAKE_CONTROL` — customer later replaces Manager Agent (`REAL_MANAGER` channel)
- `EXPERIMENT` — later restart/fork; not implemented

## Knowledge planes

`GROUND_TRUTH` | `OBSERVABLE_DATA` | `NEXORA_KNOWLEDGE`

Nexora knowledge view always has `groundTruthExposed: false` and no world facts.
