# NPA-T RMS:1 — Simulation identity and state

| Field | Purpose |
| --- | --- |
| `simulationId` | Stable simulation identity |
| `simulationType` | Reusable type key (not a hard-coded demo company) |
| `hostKind` / `hostId` | Business or Project identity without Unified Company |
| `clock.tick` / `clock.simulatedAt` | Simulation clock |
| `lifecycle` | idle / prepared / running / paused / completed |
| `actors[]` | Actor ids and kinds |
| `sessionId` / `runId` | Run/session identity |
| `interactionMode` | WATCH default; TAKE_CONTROL and EXPERIMENT reserved |

Lifecycle is not auto-advanced in RMS:1. Domain world evolution is not implemented.
