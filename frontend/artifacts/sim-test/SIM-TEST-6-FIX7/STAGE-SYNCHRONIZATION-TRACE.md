# Stage synchronization trace (T85 first divergence)

Manager T85 `What were we saying about capacity?`

| Transition | Status |
| --- | --- |
| Manager → CC:5 | CORRECT (RETURN_TO_SUBJECT / historical Capacity) |
| CC:5 → canonical subject `obj-capacity` | CORRECT |
| Canonical referent Capacity | CORRECT |
| Director intent FOCUS (pre-repair) | **DIVERGES_HERE** — no `explicitSingularFocus`; `presentationRequest` NONE |
| Director composition | DOWNSTREAM of missing FOCUS |
| Stage bridge `applyDirectorPlanToStage` | DOWNSTREAM — received no FOCUS (not a stale-bridge of a correct instruction) |
| Stage selected/focused | DOWNSTREAM stickiness (`obj-inventory`) |
| MLEVEL L1 | DOWNSTREAM (`obj-inventory` followed Stage) |
| Render | DOWNSTREAM of Stage state |

Post-repair T85: Director FOCUS `obj-capacity` → bridge applies → Stage `obj-capacity` → MLEVEL L1 `obj-capacity`. All CORRECT.

T86 knowledge / T87 `Look at that.`: presentation preserve or look-at current Capacity. CORRECT (Should Stage change? T86 NO; T87 stay on visible Capacity).

T88 `Switch to inventory.`: presentation YES. Stage `obj-inventory` CORRECT. Canonical stayed `obj-capacity` — **not Stage**; referent owner.

T89 `The first one.`: presentation NO. Stage persist Inventory CORRECT. Observer persist-without-instruction is NOT_APPLICABLE as Stage defect.
