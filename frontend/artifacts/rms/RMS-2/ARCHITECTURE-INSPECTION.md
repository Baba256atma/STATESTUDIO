# NPA-T RMS:2 — Architecture Inspection

Inspection date: 2026-09-16.

Stop condition: Business/Project Ground Truth only. Do not start RMS:3.

## Inspected

- RMS:1 sealed session, Observer, Reality ≠ Data ≠ Nexora Knowledge
- D7 `app/lib/simulation` remains a separate operational-graph substrate, not RMS world
- NMI:1 UnifiedManagementModel owns canonical management structure; RMS references `nmiContextKind` / `nmiStructureAuthority: NMI:1`
- VAI:1–8 owns variable roles; RMS world values set `vaiRoleEngine: false`
- Data Reality / RDI:1 Gate, MO:1, CC:10/11, Outcome/Learning remain external

## Consumed vs external

RMS:2 consumes RMS:1 session/firewall and BCA/NMI context kinds as labels.

RMS:2 does not write NMI, VAI, Data Reality, Stage, Advisor, Objects, Decision, Execution, Outcome, Learning, or conversation.
