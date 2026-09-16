# NPA-T RMS:1 — Simulation World / Ground Truth

Ground Truth is the actual state of the simulated Business/Project.

Example future facts (illustrative, not a running model): machine capacity 80, demand 105, machine failure exists, delivery performance declining.

## Access

| Participant | Access in RMS:1 |
| --- | --- |
| Operator Agent | Later may generate observable data *from* world; does not dump world into Nexora |
| Observer | May inspect sealed world |
| Nexora | Forbidden. Discover later only through legitimate evidence/data/context |
| Manager Agent | No automatic world access |

Public session JSON does not include world facts. World is bound off-object (WeakMap) to the frozen session.

Reality ≠ Data ≠ Nexora Knowledge.
