# NPA-T NMI:5 — Queue → Attention compatibility

Every STAGE-PROD:1 Queue object ID becomes an Attention item with reason `EXISTING_QUEUE_ITEM`.

Queue category rows (Problems, Scenarios, Decisions, Executions, Recent Changes) remain in the overlay.

Attention count = unique canonical IDs projected from those Queue entries.

NMI does not silently reinterpret Queue state. Extra reasons only annotate existing Queue items.
