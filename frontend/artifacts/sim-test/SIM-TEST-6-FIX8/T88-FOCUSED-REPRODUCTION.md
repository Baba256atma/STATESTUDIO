# T88 focused reproduction

## Manufacturing baseline signature

Pre-FIX8: `fnv1a32:a589a7b3`

Post-FIX8: `fnv1a32:39cd74e3`

## Focused signatures (91-turn T84–T91 window; same Manager utterances as T85-focused)

T88 focused baseline (post-FIX7 / pre-FIX8): `fnv1a32:ec704e0a`

T88 focused repaired: `fnv1a32:e1f7764b` (S0=0, S1=1 at T89 `ADVISOR_DIVERGENCE`, harness PASS)

## Minimum history

T84 `What about inventory?` → Inventory  
T85 `What were we saying about capacity?` → Capacity (FIX7 historical return)  
T86–T87 Capacity knowledge / `Look at that.` TYPE_AMBIGUITY pending  
T88 `Switch to inventory.`  
T89 `The first one.`

## Pre-T88 state (post-FIX7)

canonical subject = `obj-capacity`  
canonical referent = `obj-capacity`  
Stage = `obj-capacity`

## T88

| Field | Value |
| --- | --- |
| Manager utterance | Switch to inventory. |
| Raw / resolved intent (pre-repair) | `switch-workspace` (soft alias), command null |
| Raw / resolved intent (post-repair) | `focus`, target hint inventory |
| Canonical meaning | FOCUS Inventory (`switch to` cue) |
| Subject before | `obj-capacity` |
| Referent before | `obj-capacity` |
| Explicit switch detected | yes (`switch to`) |
| Named target | inventory → `obj-inventory` |
| Candidate set | Inventory EXPLICIT_CURRENT_TURN; Capacity CONTEXT_ACTIVE_SUBJECT |
| Selected referent before repair | `obj-capacity` (no FOCUS command commit) |
| Reason before | CC:1 workspace intent + 6.3 pending capture → unknown |
| Presentation target | `obj-inventory` (FIX7 NXA:5-FIX4) |
| Stage target | `obj-inventory` PASS |
| First divergence | CC:1 `matchSwitchWorkspace` vs `matchFocusOrOpen` |
| Earliest owner | CC:1 |
| Repair | exact registered-experience match only; FOCUS includes `switch to`; 6.3 supersedes pending for named switch; 6.2/6.1 preserve FOCUS |
| Subject after | `obj-inventory` |
| Referent after | `obj-inventory` |
| Stage after | `obj-inventory` |
| Immediate deictic follow-up | Isolated `Explain this.` → `obj-inventory`. Journey T89 is ordinal `The first one.` (Advisor, not T88 referent) |
| Result | T88 referent PASS; T88 Stage PASS |

## Classification

`CC1_INTENT_DEFECT` (earliest) compounded by `EXPLICIT_SWITCH_PRECEDENCE_DEFECT` / FINAL:6.3 pending capture in the long session. Not Stage-owned. Not a ranking defect: Inventory was not committed because the conversational command never became FOCUS.
