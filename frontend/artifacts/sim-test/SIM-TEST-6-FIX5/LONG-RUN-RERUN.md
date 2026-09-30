# Long-run rerun

## Manufacturing `sim-test-6-manufacturing-long`

- Pre-FIX5: `fnv1a32:e22a59ad` S1=11
- Post-FIX5: `fnv1a32:13088832` S1=9  
  (signature includes Observer findings; production conversation unchanged)
- Decision count changes: T13 `0→1` `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` only
- Execution count changes: T17 `0→1` `execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` only

| Turn | Checkpoint | Post-FIX5 |
| --- | --- | --- |
| T71 | Delivery named issue | PASS `obj-delivery` |
| T77–T78 | PREMATURE_DECISION | **gone**; 1→1 Decision, 1→1 Execution |
| T83 | REPEATED_CLARIFICATION | still S1 |
| T85–T89 | STAGE_DIVERGENCE | still S1 |
| T88 | WRONG/STALE referent | still S1 |
| T92 | WRONG_REFERENT | still S1 |
| T102 | ADVISOR_DIVERGENCE | still S1 |

T77 still clarifies `Which one do you want me to show?` — independent of Decision scoring.

## Project

- Pre: `fnv1a32:371385e5` S1=6 including T40–T41 PREMATURE_DECISION
- Post: `fnv1a32:d720ded0` S1=4
- T40–T41: SAME_ROOT_REPAIRED (post-Decision alternatives/compare)
- Remaining: T18/T31 Advisor, T30 referent, T35 clarification

## Logistics / Service / FAST / Fresh

- Logistics: `fnv1a32:66479d26` T21 remains; T24 closed
- Service: `fnv1a32:d6ba4cff` T17/T18 remain
- FAST: `fnv1a32:8a0767d0` S1=0
- Fresh: `fnv1a32:81d72b8a` Decision=0 Execution=0
