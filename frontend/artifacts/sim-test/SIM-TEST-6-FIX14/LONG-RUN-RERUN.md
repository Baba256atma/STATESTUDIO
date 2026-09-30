# SIM-TEST:6-FIX14 Long-run Rerun

## Impatient

- Pre-repair signature: `fnv1a32:87f35baf`
- Pre-repair S1: 5 — T3 SUBJECT_LOSS, T8 MISSING_DECISION, T16 STALE_REFERENT, T30/T31 ADVISOR_DIVERGENCE
- Post-repair signature: `fnv1a32:7b53995b`
- Post-repair S1: 4 — T8 MISSING_DECISION, T16 STALE_REFERENT, T30/T31 ADVISOR_DIVERGENCE
- T3: PASS — canonical/conversation/Stage/Advisor all `obj-capacity`; no clarification
- T8: INDEPENDENT — no Decision created; CC:10 boundary preserved
- T16: INDEPENDENT — canonical Delivery, Advisor Capacity
- T30: INDEPENDENT — canonical Capacity, Advisor Inventory
- T31: DOWNSTREAM OF T30 — canonical Capacity, Advisor Inventory
- Ground Truth access: false

## Updated measured inventory

| Profile | S1 |
|---|---:|
| Manufacturing | 0 |
| Project | 0 |
| Logistics | 0 |
| Service | 0 |
| FAST | 0 |
| Impatient | 4 |

SIM-TEST:6 remains NOT CERTIFIED. Full recertification was not run because independent Impatient S1s remain.
