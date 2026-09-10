# MRA:3 — Certification

Date: 2026-09-09

**Status: NOT CERTIFIED**

MRA:3 validates Nexora through realistic manager behavior. **It does not itself certify Nexora as Manager-Ready.** Final Manager-Ready certification was not started.

## Why the MRA:3 gate fails

Required simulations, the 52-turn isolated long session, and NXA L1–L4 were completed. The certification checklist still fails:

- Data conversation is **not** uniformly correct (required explain-CSV and live DATA-ADV inventory pass; field/cause follow-ups leave the Data path — MRA-3-011).
- Stage/Advisor consistency is **not** stable after spatial click (MRA-3-008).
- References are **not** stable (`explain it`, `explain the second one` — MRA-3-002/003, C1 regressions vs MRA:2).
- Decision/Execution **canonical** parity holds on threaded Approve/start; Stage thread counts stay 0 (known split). Spoken Approve overlay can contradict (MRA-3-012).
- Mutation safety **does not** survive topic-change + ambiguous `yes` (MRA-3-004).
- S0 = 0.
- **Unexplained / unfixed S1 regressions exist** (C1).
- Deferred S1s 002 / 008 / 012 remainder were evaluated (not hidden); 008 is **A**, 002 and 012 remainder are **C** before Manager-Ready.
- Manager-facing language leaked `ECA:10`, `INSUFFICIENT_REALITY`, and `cc9:scenario:…` (MRA-3-005/006/007).

## Readiness recommendation

**NOT READY — RETURN TO SYSTEMIC REPAIR**

Do not start Manager-Ready certification.

## Certification statement

MRA:3 validates Nexora through realistic manager behavior. It does not itself certify Nexora as Manager-Ready.
