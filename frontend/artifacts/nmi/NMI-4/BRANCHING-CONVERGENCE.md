# NPA-T NMI:4 — Branching / convergence

Multiple Scenarios addressing the same Issue are a branch (`prefersScenario: false`). NMI does not pick a winner.

Convergence is recorded only when canonical:

- Comparison ref (DS:7:8 / APP-6:7) covering those Scenario IDs → converge at COMPARISON
- `selected_as` Decision → Scenario → converge at DECISION

Two or more Scenarios without a comparison authority remain branched. Comparison does not create a Decision.
