# NPA-T NMI:2 — Relationship projection

NMI:2 reuses the certified NMI:1 vocabulary only:

supports, measures, affects, depends_on, belongs_to, threatens, addresses, evidenced_by, evaluated_by, selected_as, executed_by, observed_by, reassesses.

Every projected relationship remains `causal: false`. Epistemic status is copied, never upgraded.

The map is non-linear:

- one Goal may have many KPIs
- one KPI may connect to multiple Problems
- multiple Risks may surround one Goal
- one Problem may connect to several processes
- one Scenario may address multiple Problems
- multiple Scenarios may coexist
- Decision may exist without Execution
- Execution may exist without Outcome
- Outcome may exist without Learning
- disconnected valid nodes remain in their sections
- missing / unresolved edges stay missing

Example English phrases such as `measured_by` or `executes` are not new relation kinds. They project only when an NMI:1 relation already exists in canonical state.
