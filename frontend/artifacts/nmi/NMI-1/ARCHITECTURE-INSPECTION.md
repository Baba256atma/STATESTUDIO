# NPA-T NMI:1 — Architecture Inspection

Inspection date: 2026-09-16.

Stop condition: Management Intelligence Foundation contracts only. Do not start NMI:2 or RMS:2. Do not change Queue/UI.

## Existing authorities inspected

| Concern | Canonical owner | NMI:1 |
| --- | --- | --- |
| Business / Project context | BCA:1 `BusinessProjectContextKind` BUSINESS / PROJECT / HYBRID / UNKNOWN | Reuses kinds. No classifier. |
| BCA concepts / relationships / process | BCA:2–4 | References only |
| Manager / role | BCA manager context + MO:1 | Reference |
| Manager–Object | MO:1 | No Object store |
| Goals | existing Goal / MO:1 `goal` | ID refs |
| KPI / metrics | existing KPI observation owners | ID refs |
| Processes / operations | BCA:4 process placement | ID refs; not CC:11 |
| Data Reality / CSV / Data Objects | P0:1 Data Reality + DATA-UX:3 | Consume after Gate |
| Gate API | RDI:1 Real Data Integration | Reused; no NmiGate |
| Problems / Risks | MO:1 + NPS understanding | ID refs |
| Variables | VAI:1–8 | ID refs |
| Scenarios | CC:9 | ID refs; not Decisions |
| Decisions | CC:10 | NMI cannot approve |
| Executions | CC:11 | NMI cannot start |
| Outcomes / Learning | CORE-OUT / ECA:12 / DTH:12 | Distinct from estimates |
| Stage | Director / Stage interaction | Unmutated |
| Theatre / Director | DTH / DIR:1 | Presentation only |
| Advisor / ECA / NCA | CC:5 overlay path | NMI does not speak |
| NPS | NPS consumes journey; `createsScenarioAuthority: false` | Unchanged |
| RMS:1 | Sealed Ground Truth + Observer | Different plane from NMI |
| Queue | STAGE-PROD:1 Executive Queue | Unchanged |

## Disposition

NMI:1 is a read-oriented composition contract over those authorities. It is not a second Nexora.
