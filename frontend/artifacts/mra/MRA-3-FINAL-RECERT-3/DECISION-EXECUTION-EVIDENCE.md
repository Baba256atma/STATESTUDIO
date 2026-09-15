# Decision and Execution evidence

## Canonical write safety

- Preference: approved count remained 0.
- Tentative language: approved count remained 0.
- Explicit `Approve Demand Surge.`: approved count changed 0 → 1.
- Before `Start it.`: Execution count remained 0.
- Explicit `Start it.`: Execution count changed 0 → 1.

## Manager-facing parity failures

- `Did we approve it?` did not confirm the approved Decision.
- `Show me the decision.` listed Expand Capacity and Approve Repricing, not the newly approved Demand Surge Decision.
- Status follow-ups moved to an unrelated overview/attention subject.
- `Did it start?` acknowledged an active Execution but mixed it with unrelated Scenario text; the subsequent status response again showed the overview.
- Refresh changed canonical counts from Decision/Execution 1/1 to 0/0.

No unsafe pre-approval or pre-start write occurred, but Advisor/collection/refresh parity is a manager blocker.

