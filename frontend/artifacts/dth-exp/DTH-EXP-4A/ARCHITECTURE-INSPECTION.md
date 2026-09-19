# DTH-EXP:4A — Architecture inspection

## Smallest extension point

DIR:1 `directNexoraPresentation` remains the only Director. It already consumes resolved semantic structures and never receives manager text.

DTH-EXP:4A adds `selectNexoraDirectorNexoFamily` as a **read-oriented overlay** on that plan plus already-interpreted management need / DTH:5 scene intent / collection kind. It returns one primary Nexo family (or unresolved). It does not replace DIR:1, DTH:5, CC conversation routing, or referent resolution.

Pipeline:

Manager Intent + Executive Context → DIR:1 plan + interpreted need → Nexo family selection → DTH-EXP:3B recipe family (selection only; 4B binds scene).

Stop. Do not start DTH-EXP:4B. Do not render, populate actors, or wire `/executive`.

## Owners preserved

| Concept | Owner |
| --- | --- |
| Director | DIR:1 `nexoraSemanticPresentationDirectorIdentity` |
| Stage | NEX-MVP:3/4 |
| Canonical Objects | MO / NEX-MVP:4 catalog |
| Referent / subject | existing CC/NCA/MO |
| Scene intent kinds | DTH:5 (context, not a second NLU) |
| Recipe engine | DTH-EXP:3A |
| Nine Nexo families | DTH-EXP:3B |
| Theatre Scene | DTH-EXP:1 |
| Actor visual roles | DTH-EXP:2 |
| VAI roles / causal safety | VAI:1–8 |
| Evidence | CC:8 |
| Decision | CC:10 |
| Execution | CC:11 |
| Outcome/Learning | CORE-OUT / DTH:11–12 |
| NMI | management context only |
| Conversation / clarification | Advisor / CC:5 |

## Product rule

4A answers only: what kind of management scene does this question require? It does not choose Objects, relationships, Evidence, or analytical bindings.
