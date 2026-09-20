# NPA-T STAGE-PROD:1 — Authority map

| Concept | Authority | STAGE-PROD:1 role |
| --- | --- | --- |
| Live Stage host | NEX-MVP:3 `Nexora3DExecutiveStage` | Consume / render |
| Stage mount | `NexoraStageMount` | Pass-through host boundary |
| Object identity | NEX-MVP:4 catalog / MO:1 | Preserve id |
| Queue | STAGE-PROD:1 `ExecutiveStageQueueFoundation` | Unchanged |
| Productivity contract | STAGE-PROD:0 | Unchanged |
| Director | DIR:1 | Pass scene intent through |
| Theatre | DTH:1–12 | Pass scene intent/script through |
| Experimental Theatre | DTH-EXP:1–10 | Receive identity only; not a second renderer |
| NMI | NMI:1–8 | Copy canonical ids by section |
| Advisor/referent | CC:5 / ECA / NCA | Preserve referent id |
| VAI | VAI:1–8 | Consume via NMI VARIABLES |
| NPS / RMS | NPS / RMS:1 | Unchanged; not Stage truth |
| Decision / Execution / Outcome / Learning | CC:10 / CC:11 / CORE-OUT / DTH:11–12 | Identity receive only |

No second store for any row.
