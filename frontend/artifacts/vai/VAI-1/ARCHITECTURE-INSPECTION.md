# NPA-T VAI:1 — Architecture Inspection

Inspection date: 2026-09-16.

Stop condition: Variable Intelligence Foundation only. Do not start VAI:2.

## Existing authorities (consume)

| Concern | Owner | VAI:1 role |
| --- | --- | --- |
| Executive Objects | MO:1 / NEX-MVP catalog | Related Object IDs only. No new Objects. |
| KPI / Risk / Problem | existing KPI, Risk, MO Problem | Observations may supply value/unit when already known |
| Data Reality / CSV | RDI / DATA-UX:3 | Field identity, values, units |
| Semantics | DATA-ADV / manager confirmation | Meaning only when confirmed; CAP_AV stays unresolved otherwise |
| Evidence | CC:8 / NPS:3 consumption | Provenance `sourceRef` |
| Business Context | BCA | Not rewritten |
| Advisor / NCA / NXA / ECA | existing conversation | No Advisor memory, no manager-facing Variable speech |
| Scenario / Decision / Execution | CC:9 / CC:10 / CC:11 | Assumptions/observations as sources only |
| Theatre / Director / Stage | existing projection | No Variable cards, nodes, or scenes |

## Disposition

VAI:1 is a small read-only resolver. It does not replace NXA analysis, NPS causality, Theatre visualization, or scenario calculation.

Demand and Capacity Gap may share an analysis context. That is association, not `Demand → causes → Capacity Gap`.
