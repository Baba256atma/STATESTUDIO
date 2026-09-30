# Long-run rerun

## Manufacturing `sim-test-6-manufacturing-long`

- Pre-FIX4: `fnv1a32:f699cf3e` unique S1 12
- Post-FIX4: `fnv1a32:e22a59ad` unique S1 findings 11
- Decision: exactly one `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`
- Execution: exactly one `execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`

| Turn | Checkpoint | Post-FIX4 |
| --- | --- | --- |
| T69 | unknown Supplier | clar=true, subject `obj-capacity`, FIX3 preserved |
| T71 | WRONG_REFERENT | **REPAIRED** `obj-delivery`, Focused on Delivery |
| T77–T78 | PREMATURE_DECISION | still S1; Delivery still current |
| T83 | REPEATED_CLARIFICATION | still S1 |
| T85–T89 | STAGE_DIVERGENCE | still S1; T85 canonical Capacity vs Stage Inventory |
| T88 | WRONG/STALE referent `Switch to inventory.` | still S1; canonical stays Capacity |
| T92 | WRONG_REFERENT `What does the production data show?` | still S1; focuses Capacity |
| T102 | ADVISOR_DIVERGENCE | still S1 |

T70 in this journey is `Tell me more about the capacity issue.` (not a bare NP); Capacity continuation remains.

## Project

- Pre-FIX4: `fnv1a32:501be64a` S1=6
- Post-FIX4: `fnv1a32:371385e5` S1=6
- T30 `Talk about the schedule issue.` still WRONG_REFERENT (not a bare NP; `talk about` prefix). Independent.

## Logistics

- Signature unchanged `fnv1a32:66479d26`
- T21 WRONG_REFERENT remains (`What does the production data show?`)
- T24 still closed

## Service

- Unchanged `fnv1a32:d6ba4cff`
- T17 Advisor / T18 clarification remain

## FAST

- Unchanged `fnv1a32:8a0767d0`, S1=0, S0=0

## Fresh

- `fnv1a32:81d72b8a`; S1=0; no inherited Decision/Execution/referent

## Impatient (separate from certification count)

- `fnv1a32:87f35baf` S1=5; not used to relax referent semantics
