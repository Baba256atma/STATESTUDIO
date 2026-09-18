# NPA-T RMS:2 — Events and state transition

`Current Ground Truth + Operator-applied events + time step → Next Ground Truth`.

Event types: DEMAND_CHANGE, CAPACITY_CHANGE, RESOURCE_CHANGE, ASSET_STATE_CHANGE, INVENTORY_CHANGE, COST_CHANGE, SCHEDULE_CHANGE, WORK_PROGRESS.

Operator Agent may apply events. Observer / Manager / Nexora cannot. Events do not publish Observable Data (RMS:3).
