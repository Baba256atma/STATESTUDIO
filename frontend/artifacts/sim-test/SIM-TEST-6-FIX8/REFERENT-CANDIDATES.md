# T88 referent candidates

Continuity already ranked an explicit Inventory target over sticky Capacity when meaning carried Inventory (`EXPLICIT_CURRENT_TURN` vs `CONTEXT_ACTIVE_SUBJECT`). The long-session failure was that FOCUS meaning/intent did not reach that selector.

## BEFORE FIX (conversation commit)

| Candidate | Kind | Provenance | Eligible? | Rank/result | Selected? | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| obj-inventory | Object | not on conversational command path | no (no FOCUS commit) | n/a | no | CC:1 workspace; 6.3 resume unknown |
| obj-capacity | Object | CONTEXT_ACTIVE_SUBJECT | yes (sticky) | default | yes | no competing committed switch |

Selected: `obj-capacity`  
Reason: canonical subject never transitioned.

## AFTER FIX

| Candidate | Kind | Provenance | Eligible? | Rank/result | Selected? | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| obj-inventory | Object | EXPLICIT_CURRENT_TURN / named switch | yes | wins explicit switch | yes | CC:1 focus + 6.3 new request + 6.2 preserve |
| obj-capacity | Object | CONTEXT_ACTIVE_SUBJECT / previousSubjects | yes (history) | outranked | no | sticky context must not beat explicit named switch |

Selected: `obj-inventory`  
Reason: explicit named switch to a unique known canonical Object.
