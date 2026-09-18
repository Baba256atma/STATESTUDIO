# NPA-T NMI:8 — Canonical Source Map

| NMI node / field | Live source | Writer |
| --- | --- | --- |
| PROBLEM / SCENARIO / DECISION / EXECUTION | catalog `contextSubjects` | NEX-MVP catalog fixtures / existing catalog |
| GOAL | MO:1 `MANAGER_OBJECT_REGISTERED_GOAL` when associated Problem is present | MO:1 |
| PROCESS / KPI / DATA_EVIDENCE / RISK / VARIABLE / OUTCOME / LEARNING | omitted unless supplied | existing authorities only |
| relationships | MO:1 Goal `supports` associated Problem only | MO:1 declared association |
| contextKind | UNKNOWN unless host supplies BCA kind | BCA:1 |
| Attention IDs | Queue `objectIds` | STAGE-PROD:1 |
| Stage selection | `selectNexoraMVPInteractionSubject` | existing Stage |
| Advisor memory | CC:5 / NCA / ECA | existing conversation |
