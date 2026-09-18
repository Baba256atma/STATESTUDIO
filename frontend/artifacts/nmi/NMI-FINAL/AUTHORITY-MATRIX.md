# NPA-T NMI:FINAL — Authority Matrix

NMI introduces no duplicate writer.

| Concept | Owner | NMI role |
| --- | --- | --- |
| Business/Project | BCA:1 | Reads contextKind; live default UNKNOWN |
| Goal | existing Goal / MO:1 | Read node when associated Problem is present |
| Operation/Process | BCA:4 | No PROCESS inference from generic Stage objects |
| KPI | existing KPI observation owners | Empty when catalog has none |
| Data Reality | P0:1 / NexoraDataRealityFoundation | Read only |
| Evidence | CC:8 | Read / provenance; no upgrade |
| Problem/Risk | MO:1 / NPS:1 understanding | Read map nodes |
| Variables/Causality | VAI:1–8 | Association ≠ causation |
| Scenario | CC:9 | Roadmap branch, not Decision |
| Comparison | existing comparison / NCA collection | Cannot steal referent |
| Decision | CC:10 | Roadmap status only |
| Execution | CC:11 | Roadmap status only |
| Outcome | CORE-OUT | Not manufactured from Execution |
| Learning | CORE-OUT:2 / ECA:12 / DTH:12 | Not manufactured from Outcome |
| Queue | STAGE-PROD:1 | Attention source IDs |
| Stage/Director | Director / Stage interaction | Presentation after NMI:6 handoff |
| Advisor | CC:5 / NXA / NCA / ECA | Overlay/read context |
| Gate | RDI:1 | Upstream of NMI |
| RMS | RMS:1 Ground Truth | Sealed; not imported |
| NMI | NMI:1–8 contracts + live composer | Read intelligence |

`NMI_AUTHORITY_BOUNDARY` and `NMI_LIVE_HOST_CONTRACT` flags remain `parallel* : false` and `writes* : false`.
