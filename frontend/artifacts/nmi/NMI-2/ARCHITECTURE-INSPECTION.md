# NPA-T NMI:2 — Architecture Inspection

Inspection date: 2026-09-17.

Stop condition: Business/Project Management Map read projection over certified NMI:1. Do not start NMI:3. Do not redesign Queue. Do not implement the Decision Roadmap. Do not create a Stage or Theatre scene system.

## Disposition

No architectural conflict was found. NMI:1 remains the UnifiedManagementModel authority. NMI:2 is a second read-only projection (`ManagementMap`) composed from that model. NMI:1 flags stay reserved (`managementMapImplemented: false`) because the map is not owned by NMI:1.

## Canonical authorities reused

| Concern | Canonical owner | NMI:2 |
| --- | --- | --- |
| Business / Project context | BCA:1 `BUSINESS` \| `PROJECT` \| `HYBRID` \| `UNKNOWN` | Consume; no classifier |
| Manager / role | BCA manager context + MO:1 | CONTEXT node reference |
| Goals | existing Goal / MO:1 | GOALS section reference |
| Processes / operations | BCA:4 | OPERATIONS section reference; not CC:11 |
| KPI / metrics | existing KPI observation owners | KPI_DATA reference |
| Data Reality / Evidence | P0:1 / CC:8 after RDI:1 Gate | KPI_DATA reference; unresolved preserved |
| Problems | MO:1 / NPS understanding | PROBLEMS section |
| Risks | MO:1 risk | RISKS section, separate from Problems |
| VAI variables | VAI:1–8 | VARIABLES analytical references |
| Scenarios | CC:9 | SCENARIOS references |
| Decisions | CC:10 | DECISIONS references; NMI cannot approve |
| Executions | CC:11 | EXECUTIONS references; NMI cannot start |
| Outcomes / Learning | CORE-OUT / ECA:12 / DTH:12 | Distinct sections; missing stays missing |
| Stage | Director / Stage interaction | Unmutated |
| Queue | STAGE-PROD:1 | Unchanged |
| Advisor | CC:5 / NXA / NCA / ECA | Unchanged; no parallel Advisor |
| Gate API | RDI:1 | Reused; no NmiGate |
| RMS Ground Truth | RMS:1 | Not NMI truth |
| Relationship vocabulary | NMI:1 | Reused exactly |

## Not introduced

Parallel Object store, parallel Data Reality, second Gate, Stage/Theatre scenes, Queue redesign, Attention, Decision Roadmap engine, Advisor conversation changes, causal truth, fabricated edges.
