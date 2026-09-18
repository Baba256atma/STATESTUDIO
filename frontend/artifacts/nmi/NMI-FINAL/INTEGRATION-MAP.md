# NPA-T NMI:FINAL — NMI:1–8 Integration Map

`NMI_LIVE_PIPELINE` is the certified chain:

1. `CANONICAL_AUTHORITIES`
2. `NMI_1_UNIFIED_MANAGEMENT_MODEL`
3. `NMI_2_MANAGEMENT_MAP`
4. `NMI_3_RELATIONSHIP_INTELLIGENCE`
5. `NMI_4_DECISION_ROADMAP`
6. `NMI_5_NAVIGATION_ATTENTION`
7. `NMI_6_STAGE_PROJECTION`
8. `NMI_7_ADVISOR_CONTEXT`
9. `EXISTING_UI_STAGE_ADVISOR`

| Phase | Responsibility | Does not own |
| --- | --- | --- |
| NMI:1 | UnifiedManagementModel, `NmiCanonicalRef`, relationship vocabulary | Object/Goal/DR stores |
| NMI:2 | Management Map sections and nodes from the model | Queue, Stage |
| NMI:3 | Interpretations, gaps, reverse navigation | VAI causality |
| NMI:4 | Descriptive Decision Roadmap statuses | Decision/Execution/Outcome writers |
| NMI:5 | Map navigation + Attention projection of Queue IDs | Queue authority |
| NMI:6 | What management context is relevant for Stage | Director/Stage presentation |
| NMI:7 | Overlay answers inside CC:5 / NCA / ECA | Advisor, referent resolver |
| NMI:8 | Live host wiring in `NexoraExecutiveShell` | Any canonical writer |

No parallel management system exists beside this chain. Overlay Map nodes and `nmiAdvisorBundle` are the same live composition, not a test-only bundle.
