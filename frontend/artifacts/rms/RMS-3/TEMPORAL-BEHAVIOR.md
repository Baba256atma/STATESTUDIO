# NPA-T RMS:3 — Temporal behavior

Operator uses the RMS:2 simulation clock.

Inventory observations use `delayTicks = 1`: at tick 0, `inventory_quantity` is DELAYED; after events advance the clock, it becomes AVAILABLE.

Demand and capacity events at successive ticks produce orders, then CAP_AV / produced_quantity from the updated world. Consequences are not required to appear in a single tick.

Same initial world + same events + same observe sequence → identical Observable field/value/status/tick tuples.
