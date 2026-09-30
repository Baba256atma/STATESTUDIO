# Long-run rerun

Unchanged journeys: `sim-test-6-manufacturing-long` and parity dumps via `nexoraSimulationFix8Dump.ts`.

## Manufacturing

| | Pre-FIX8 | Post-FIX8 |
| --- | --- | --- |
| Signature | `fnv1a32:a589a7b3` | `fnv1a32:39cd74e3` |
| S1 | 3 | 3 |
| Findings | T88 WRONG/STALE, T92 WRONG, T102 ADVISOR | T89 ADVISOR, T92 WRONG, T102 ADVISOR |

- T88: canonical + Stage `obj-inventory`; response `Focused on Inventory.`; no T88 findings
- T85–T87 Stage Capacity; T88–T89 Stage Inventory (FIX7 preserved)
- T83 clarificationRequired false (FIX6)
- Decision count 1 / ID `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`
- Execution count 1 / ID `execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`

## Material referent transitions (Manufacturing ≥ T80)

| Turn | Utterance | Subject before | Explicit target | After | Result |
| --- | --- | --- | --- | --- | --- |
| 84 | What about inventory? | obj-delivery | inventory | obj-inventory | PASS |
| 85 | What were we saying about capacity? | obj-inventory | capacity | obj-capacity | PASS (FIX7) |
| 88 | Switch to inventory. | obj-capacity | inventory | obj-inventory | PASS (FIX8) |
| 92 | What does the production data show? | obj-delivery | (production data) | obj-capacity | STILL WRONG_REFERENT |

## Other journeys

- Project: `fnv1a32:1edaa6c6` S1=3 (T18 ADVISOR, T31 ADVISOR, T35 REPEATED_CLARIFICATION). Pre `5205cc26` S1=4 including T30 WRONG_REFERENT (`Talk about the schedule issue.`) — not the T88 switch root; T30 DOWNSTREAM_RESOLVED of conversation-path changes, not bundled as FIX8-owned.
- Logistics: `fnv1a32:66479d26` T21 unchanged
- Service: `fnv1a32:d6ba4cff` T17/T18 unchanged
- FAST: `fnv1a32:8a0767d0` S1=0
- Impatient: `fnv1a32:87f35baf` S1=5 unchanged
- Fresh session: `fnv1a32:81d72b8a` S1=0, no inherited Decision/Execution/clarification
