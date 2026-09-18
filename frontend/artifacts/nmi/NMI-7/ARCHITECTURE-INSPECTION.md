# NPA-T NMI:7 — Architecture Inspection

Inspection date: 2026-09-18.

Stop condition: NMI read intelligence enriches existing CC:5 Advisor composition. Do not start NMI:8 or DTH-EXP. Do not create a second Advisor.

## Integration point

CC:5 `executeNexoraConversationalExperience` → `finalize` already overlays VAI:4 onto `presentedResponse`.

NMI:7 adds `applyNmiAdvisorToPresentedResponse` on that same path after VAI.

Referent remains NCA (`ncaTurn.reference` / NCA:2 `activeSubject`). NMI consumes the resolved subject and maps it onto NMI:1–6.

## Inspected

NMI:1–6, CC:5, NCA:1–2, ECA:8, NPS path, VAI advisor/causal, STAGE-PROD Queue/Attention, Director/Stage, RDI:1 Gate, RMS isolation, Decision/Execution writers (CC:10/11).
