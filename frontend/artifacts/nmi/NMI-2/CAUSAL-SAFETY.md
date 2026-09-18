# NPA-T NMI:2 — Causal safety

NMI:2 preserves VAI / NMI:1 causal boundaries.

`affects` with `ASSOCIATION` remains association. Capacity ↔ Late Delivery is not rewritten as Capacity causes Late Delivery.

NMI:2 does not convert:

- association → cause
- likely driver → confirmed driver
- manager hypothesis → fact
- calculated value → observed fact
- simulation → reality

`createsCausalCertainty` remains false on the map and on branch extraction.
