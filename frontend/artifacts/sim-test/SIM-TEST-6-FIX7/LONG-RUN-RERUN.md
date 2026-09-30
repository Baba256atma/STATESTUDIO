# Long-run rerun

## Manufacturing

- Pre-FIX7: `fnv1a32:9ceb71ec` S1=8
- Post-FIX7: `fnv1a32:a589a7b3` S1=4
- Decision: 1 `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`
- Execution: 1 `execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`
- T50/T64/T69/T71/T77–T78/T83: still PASS
- T85: Stage `obj-capacity` — REPAIRED
- T86–T87: Stage Capacity — same-root / downstream resolved
- T88: Stage `obj-inventory` (presentation) PASS; WRONG_REFERENT + STALE_REFERENT STILL_REPRODUCIBLE
- T89: Stage persist Inventory; Observer persist finding removed — OBSERVER_CLASSIFICATION_ERROR repaired
- T92: WRONG_REFERENT STILL_REPRODUCIBLE
- T102: ADVISOR_DIVERGENCE STILL_REPRODUCIBLE

## Project

- Signature `fnv1a32:5205cc26` (pre-FIX7 `fnv1a32:d720ded0`; same four S1, not a Project Stage same-root close)
- T18 / T30 / T31 / T35 remain INDEPENDENT

## Logistics / Service / FAST / Fresh / Impatient

- Logistics: `fnv1a32:66479d26` T21 remains
- Service: `fnv1a32:d6ba4cff` T17 / T18 remain
- FAST: `fnv1a32:8a0767d0` S1=0
- Impatient: `fnv1a32:87f35baf` S1=5 separate
- Fresh: `fnv1a32:81d72b8a` no pending; Decision=0; Execution=0
