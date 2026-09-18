# NPA-T RMS:3 — Operational source model

Families: ERP, CRM, PRODUCTION, INVENTORY, MAINTENANCE, HR, FINANCE, PMO, PROJECT_CONTROL.

These are source/domain identities on Observable Records. They are not Nexora management Objects and not a second Object store.

ERP-style fields used now: timestamp (simulatedAt/tick), orders_received, produced_quantity, inventory_quantity, CAP_AV, related entity ids.

CRM-style fields used now: timestamp, requested_quantity.

PMO/project-control: planned_progress, actual_progress, resource_usage, schedule_observation.

Full ERP.csv / CRM.csv libraries are out of scope.
