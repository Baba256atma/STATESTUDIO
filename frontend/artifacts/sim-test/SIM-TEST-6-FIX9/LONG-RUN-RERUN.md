# Long-run rerun

## Manufacturing

| | Pre-FIX9 | Post-FIX9 |
| --- | --- | --- |
| Signature | `fnv1a32:39cd74e3` | `fnv1a32:bc1af3ff` |
| S1 | 3 | 1 |
| Findings | T89 ADVISOR, T92 WRONG, T102 ADVISOR | T92 WRONG_REFERENT |

- T88: Inventory canonical + Stage PASS  
- T89: Inventory canonical + Stage persist; Advisor Inventory; ordered-list clarification  
- T85–T87 Stage Capacity PASS  
- Decision 1 / `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`  
- Execution 1 / `execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`

## Material collection/ordinal events

- T88 SWITCH: lastCollection ordinal eligibility superseded (`establishedAtTurn` omitted; items retained)  
- T89 ORDINAL_RESOLVE: no eligible collection → CLARIFY  
- T102 return utterance not captured as collection ordinal

## Other journeys

- Project: `fnv1a32:8e136351` S1=2 (T18 ADVISOR, T35 REPEATED_CLARIFICATION); T31 cleared  
- Logistics: `fnv1a32:66479d26` T21 unchanged  
- Service: `fnv1a32:d6ba4cff` T17/T18 unchanged  
- FAST: `fnv1a32:8a0767d0` S1=0  
- Impatient: `fnv1a32:87f35baf` S1=5 unchanged  
- Fresh: `fnv1a32:81d72b8a` S1=0  
