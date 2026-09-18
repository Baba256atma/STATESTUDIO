# NPA-T RMS:3 — Business and Project fixtures

Same Operator architecture for both RMS:2 worlds.

## BUSINESS — Northstar Manufacturing

Initial: demand 100, capacity 110. Events: demand → 125, capacity → 85.

Operator AVAILABLE records include:

- orders_received = 125
- CAP_AV = 85 (unconfirmed meaning)
- produced_quantity = 85
- inventory_quantity AVAILABLE after delay
- machine_status = running

## PROJECT — Warehouse Expansion

Event: actual progress 0.63 → 0.65.

Operator records include planned_progress 0.71, actual_progress 0.65, resource_usage 12.
