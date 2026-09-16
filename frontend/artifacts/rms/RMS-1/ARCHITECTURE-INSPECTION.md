# NPA-T RMS:1 — Architecture Inspection

Inspection date: 2026-09-16.

Stop condition: RMS:1 contracts and authority boundaries only. Do not start RMS:2. Do not start VAI.

## Existing simulation vs RMS

`frontend/app/lib/simulation` is **D7 Reality Simulation Core**: operational-graph ticks, events, snapshots, and later human-actor / foresight engines. It is not Real Management Simulation. RMS:1 does not reuse D7 as Ground Truth, Nexora Knowledge, Stage, or Advisor.

## Existing Nexora authorities (reuse)

| Concern | Owner | RMS:1 role |
| --- | --- | --- |
| Conversational runtime | CC:5 `executeNexoraConversationalExperience` | Sole Nexora participant entry. No simulation-privileged Nexora. |
| Intent / command / runtime bridge | CC:1–4 | Unchanged |
| Manager–Object | MO:1 | Unchanged. Agent vs real manager is an RMS actor tag, not a new MO activation source. |
| Data | Data Reality | Future Operator observable-data handoff owner. RMS:1 does not generate CSV or datasets. |
| Evidence | CC:8 | Unchanged |
| Scenario | CC:9 | Unchanged. Distinct from RMS simulation identity. |
| Decision | CC:10 | Unchanged |
| Execution | CC:11 | Unchanged |
| Outcome / Learning | CORE-OUT / ECA:12 | Unchanged |
| Advisor | UX:3 presentation | Consume only |
| Stage / Director | NEX-MVP Stage / Director | Consume only |
| Problem solving | NPS | Consume only |
| Executive conversation | ECA | Consume only |

## RMS:1 owns

Simulation identity, actor contracts, sealed Simulation World / Ground Truth, Observer classification contract, reserved interaction modes (`WATCH`, `TAKE_CONTROL`, `EXPERIMENT`).

RMS:1 does not own Stage, Advisor, Object store, Decision, Execution, Data Reality, or a second conversation orchestrator.

## Mandatory separations

Reality ≠ Data ≠ Nexora Knowledge.

Pipeline: Simulation World → Operator Agent → Observable Data → Nexora ↔ Manager Agent. Observer watches the chain and is not an authority inside it.

## Not introduced

VAI, Unified Company, NMI, ERP/CRM simulation, CSV generation, industry models, problem injection, autonomous manager loops, Take-Control UI, simulation scoring, RMS:2.
