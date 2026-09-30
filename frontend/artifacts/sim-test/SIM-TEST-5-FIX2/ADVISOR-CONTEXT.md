# SIM-TEST:5-FIX2 — Advisor context

SIM-TEST:4-FIX1 rule preserved: current legitimate canonical context is not overridden by stale Advisor context.

T38 is a different defect: PRODUCT_FICTION introducing a new noun (inventory/warehouse) must not become the Advisor/conversation subject.

| Surface | Manufacturing T38 after repair |
| --- | --- |
| Manager utterance | Teleport all inventory to the finished-goods warehouse. |
| Canonical executive subject | `obj-capacity` |
| Conversation subject | `obj-capacity` |
| Advisor response subject | Capacity-family (workspace refusal; no Inventory teleport) |
| Decision | `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` (exists, not forced as T38 subject) |
| Execution | in-progress; not forced as T38 subject |
| Data Reality | manufacturing CSV v3 |
| Outcome | not claimed complete |
| NMI / Stage | not modified; not used as repair |

Decision/Execution existence does not globally replace the current subject. Explicit lifecycle queries still use existing conversation semantics (T15 locked to Decision because the utterance is a Decision confirm, not because Execution exists).

Stale problem/scenario bundles are not cleared every turn. PRODUCT_FICTION skips NCA:2 activate/shift so pre-turn Capacity remains.

T28 answers from Delivery while the intended probe is a counterfactual on option A — independent named-issue, not the T38 family.
