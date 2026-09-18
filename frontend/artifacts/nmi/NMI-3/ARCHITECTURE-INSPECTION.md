# NPA-T NMI:3 — Architecture Inspection

Inspection date: 2026-09-17.

Stop condition: Management Relationship Intelligence over certified NMI:1–2. Do not start NMI:4. Do not change Queue, Stage, Theatre, or Advisor UI.

## Existing relationship authorities

| Concern | Canonical owner | NMI:3 |
| --- | --- | --- |
| NMI management relation kinds | NMI:1 vocabulary | Consume; do not extend kinds |
| UnifiedManagementModel | NMI:1 | Source of declared relationships |
| Management Map / undirected branch | NMI:2 | Consume; interpretation is direction-aware |
| BCA concept relationships | BCA:3 `BusinessProjectRelationshipIntelligence` | Not duplicated |
| MO object graph | MO:1 | ID references only |
| Evidence | CC:8 | Provenance/evidence refs only |
| Variable / causal ladder | VAI:1–8 / CORE-INT:3 | Overlay only; VAI remains causal authority |
| NPS | NPS understanding | Unchanged |
| Scenario / Decision / Execution | CC:9 / CC:10 / CC:11 | Interpret existing edges |
| Outcome / Learning | CORE-OUT / ECA / DTH | Interpret `observed_by` / `reassesses` |
| Gate / Data Reality | RDI:1 / P0:1 | Reused; no NmiGate |
| RMS Ground Truth | RMS:1 | Sealed; not readable as NMI knowledge |
| Queue / Stage / Advisor | STAGE-PROD:1 / Director / CC:5 | Unchanged |

## Disposition

No conflict. NMI:3 is a read interpretation layer. It does not become a relationship store, causal engine, or Decision Roadmap.
