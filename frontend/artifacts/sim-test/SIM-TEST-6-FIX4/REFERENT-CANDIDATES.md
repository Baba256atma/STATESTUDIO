# T71 referent candidates

Utterance: `The delivery issue.`  
Prior state (T70): canonical subject `obj-capacity`; T69 Supplier clarification closed by Capacity continuation; pending clarification = not controlling.

| Candidate | Canonical ID | Type | Source | Current/Historical | Eligible? | Reason | Selected? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Delivery Object | `obj-delivery` | OBJECT | explicit current utterance name `delivery` + catalog match | historical (visited T64) and named now | yes after CC:1 focus | legitimate named target | **yes (after repair)** |
| Capacity Object | `obj-capacity` | OBJECT | current canonical subject | current | yes as default when intent is unknown | sticky current subject | **yes (before repair)** / no after |
| Capacity Gap | `ctx-problem-capacity` | PROBLEM | current Problem / lifecycle | current problem | must not win an Object-named issue | FIX2 locative rule does not apply to a named Delivery NP | no |
| Supplier | (none) | — | T69 named return residue | clarification resolved/superseded | no | PRODUCT_FICTION / unknown; must not fabricate | no |
| Decision | `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` | DECISION | committed Decision | available lifecycle | no for this NP | not typed as decision | no |
| Execution | `execution-cc10:decision:...` | EXECUTION | active Execution | available lifecycle | no for this NP | not typed as execution | no |
| Stage Inventory (later turns) | `obj-inventory` | OBJECT | Stage visibility | n/a at T71 | no | Stage must not write referent | no |

Pre-repair class: **wrong candidate construction** (Delivery never entered the CC:1 target-hint set), not a ranking-weight defect.

Post-repair: Delivery enters as `focus` primary hint; 6.1/6.2/CC:5 resolve `obj-delivery`.
