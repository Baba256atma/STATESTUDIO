# 103-turn failure trace

Source: `live-manager-session.json`, final production replay on 2026-09-12.

| Turn | Operation | Continuity owner | Stage | Manager–Object | NXA referent | Composition | Result |
|---:|---|---|---|---|---|---|---|
| 11 | show Scenarios | Capacity Expansion Plan | collection | Margin Pressure | Capacity Expansion Plan | Margin Pressure | context only |
| 16 | compare risk | Risk | collection | Demand Surge | Risk | Demand Surge | comparison |
| 17 | focus Demand Surge | Demand Surge | Demand Surge | Demand Surge | Demand Surge | Demand Surge | pass |
| 25 | investigate it | Demand Surge | Demand Surge | Demand Surge | Demand Surge | Demand Surge | pass |
| 26 | look deeper | Demand Surge | Demand Surge | Demand Surge | Demand Surge | Demand Surge | pass |
| 27 | what else | Demand Surge | Demand Surge | Demand Surge | Demand Surge | Demand Surge | pass |
| 40 | return Capacity Gap | Capacity Gap | Capacity Gap | Capacity Gap | Capacity Gap | stale Scenario supporting | pass |
| 41 | explain it | Capacity Gap | Capacity Gap | Capacity Gap | Capacity Gap | Capacity Gap | pass |
| 42 | investigate it | Capacity Gap | Capacity Gap | Capacity Gap | Capacity Gap | Capacity Gap | pass |
| 44 | look at Capacity Gap | Capacity Gap | Capacity Gap | Capacity Gap | Capacity Gap | stale Scenario supporting | pass |
| 47 | investigate after click-away | Capacity Gap | Capacity Gap | Capacity Gap | Capacity Gap | Capacity Gap | pass |
| 49 | focus KPI Capacity | Capacity | Capacity | Capacity | Capacity | stale Scenario supporting | pass |
| 55 | focus Risk | Risk | Risk | Risk | Risk | stale Scenario supporting | pass |
| 56 | explain Risk | Risk | Risk | Risk | Risk | stale Scenario supporting | pass |
| 57 | seriousness | Risk | Risk | Risk | Risk | Risk | pass |
| 58 | evidence | Risk | Risk | Risk | Risk | Risk | pass |
| 59 | unknowns | Risk | Risk | Risk | Risk | Risk | pass |
| 60 | investigate it | **Margin Pressure** | Risk | **Margin Pressure** | Risk | Risk | **fail** |
| 63 | return Demand Surge | Demand Surge | Demand Surge | Demand Surge | Demand Surge | n/a | pass |
| 72 | approve Demand Surge | Demand Surge | Demand Surge | canonical Decision | Demand Surge | Scenario | canonical write pass |
| 73 | approval follow-up | Scenario | Demand Surge | Scenario | Scenario | Scenario | projection issue remains |
| 89 | investigate after correction | Demand Surge | Demand Surge | Demand Surge | Demand Surge | Demand Surge | pass |

First remaining divergence: turn 60, where the Manager–Object input selects stale `ncaConversationState.activeSubject=ctx-problem-margin` ahead of canonical `conversationContinuity.activeSubjectId=obj-risk`. Stage, NXA referent, and composition selection still identify Risk.
