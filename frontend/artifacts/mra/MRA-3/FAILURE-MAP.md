# MRA:3 — Failure Map

Date: 2026-09-09

Validation only. No production patches. Replay: `scripts/mra-3-runtime-simulation.ts` and `scripts/mra-3-live-simulation.mjs`.

## Counts

| Class | Count | IDs |
| --- | --- | --- |
| S0 | 0 | — |
| S1 new | 6 | MRA-3-001, 003, 004, 005, 006, 007 |
| S1 regression vs MRA:2 C1 claim | 2 | MRA-3-002, MRA-3-008 |
| S2 | 4 | MRA-3-009, 010, 011, 012 |
| S3 | 1 | MRA-3-013 |
| Existing deferred S1 (reproduced, not re-opened as new) | 3 | MRA-1-002, MRA-1-008, MRA-1-012 remainder |

No S0. Canonical Decision/Execution were not fabricated without CC:10/CC:11 in threaded journeys.

---

## MRA-3-001

| Field | Value |
| --- | --- |
| Severity | S1 |
| Simulation / persona | J2, LONG, live A — Operations |
| Exact turn | `look at capcity` |
| Prior | `What are the main problems?` (did not list members; rec overlay) |
| Expected | Capacity Gap (typo of the Problem) or a clarification between Problem and KPI |
| Actual | `Focused on Capacity.` (KPI object) |
| Owner | CC:1/MO focus + name match |
| Hypothesis | Prefix match `capcity`→Capacity beats Capacity Gap |
| New vs regression | Previously unknown as a journey failure; related to imperfect wording, not an MRA:1 ID |

---

## MRA-3-002

| Field | Value |
| --- | --- |
| Severity | S1 |
| Simulation | J2 T8, live A last turn |
| Exact turn | `explain it` |
| Prior | `go back to the first problem` → “The first Problem is Capacity Gap…” |
| Expected | Explain Capacity Gap |
| Actual | Explains Margin Pressure |
| Owner | C1 knowledge/`it` vs collection last-member / uniqueVisible |
| Hypothesis | First-problem SHOW does not commit Stage focus; `it` resolves to another Problem |
| New vs regression | **Regression of MRA:2 C1** (“explain it after first problem / Capacity Gap stays”) |

---

## MRA-3-003

| Field | Value |
| --- | --- |
| Severity | S1 |
| Simulation | J4 T6 Persona B |
| Exact turn | `explain the second one` |
| Prior | Scenarios listed Capacity Expansion Plan, Demand Surge, Pricing Response; compare insufficient |
| Expected | Demand Surge |
| Actual | “Capacity Expansion Plan is currently visible on Stage.” |
| Owner | C1 ordinal |
| Hypothesis | Ordinal binds to Stage unique visible / first member, not collection index |
| New vs regression | **Regression of MRA:2 C1** (`explain the second one`) |

---

## MRA-3-004

| Field | Value |
| --- | --- |
| Severity | S1 |
| Simulation | J10 T8–T11 Persona A |
| Exact turn | `yes` after `show me problems` |
| Prior | `Add this as a Risk.` proposed ADD “Risk”; `forget that for now` did not cancel |
| Expected | Ambiguous yes after topic change does not write |
| Actual | “Risk has been added as a Risk.” |
| Owner | ECA mutation confirmation vs conversation topic |
| Hypothesis | Pending ADD survives SHOW; `yes` is CONFIRM_ACTION |
| New vs regression | New journey failure (MRA:2 C8 covered delete typing, not confirmation after topic change) |

---

## MRA-3-005

| Field | Value |
| --- | --- |
| Severity | S1 |
| Simulation | J8, LONG |
| Exact turn | `Should we change the plan?` / `should we change the plan` |
| Prior | Active Execution |
| Expected | Manager-facing Execution/Decision boundary, no authority codes |
| Actual | Ends with “ECA:10 will not change the Decision.” |
| Owner | C4 Advisor composition / ECA:10 copy |
| Hypothesis | Live-execution overlay concatenates internal identity |
| New vs regression | New wording leak; related to MRA:2 C4 leak class |

---

## MRA-3-006

| Field | Value |
| --- | --- |
| Severity | S1 |
| Simulation | J10 `forget that for now` |
| Expected | Cancel pending add, or ask in manager language |
| Actual | `Do you mean Risk or cc9:scenario:do-nothing:do-nothing:v1?` |
| Owner | C4 / scenario session ids in clarification |
| New vs regression | New leak |

---

## MRA-3-007

| Field | Value |
| --- | --- |
| Severity | S1 |
| Simulation | J3 `what about totalCapacity`; LONG `what about weather in Paris` |
| Expected | Data-field follow-up or honest unknown; no internal attention enum |
| Actual | `INSUFFICIENT_REALITY` as spoken subject |
| Owner | NXA:5 attention composition (MRA-1-009 class) |
| New vs regression | Same class as MRA-1-009; MRA:2 claimed C4 closed for `what should I do?` requirement codes, **not** this enum. Treated as **existing debt surfaced in natural journeys**, not a silent S1 downgrade. |

---

## MRA-3-008

| Field | Value |
| --- | --- |
| Severity | S1 |
| Simulation | NAV-stress |
| Exact turn | `explain it` after synthetic Stage click Margin Pressure |
| Expected | Explain focused Stage subject |
| Actual | Capacity Gap explanation while `focusedLabel` is Margin Pressure |
| Owner | NXA:5-FIX4 Stage vs Advisor subject |
| New vs regression | Stage/Advisor split after spatial navigation (not covered as passing in MRA:2 live click) |

---

## MRA-3-009 (S2)

J1 entrance and “Goal Here”; `what's going on` with no active object. Usable after `show me problems`. Owner: BCA/NCA EXPLAIN.

## MRA-3-010 (S2)

J2/live `What are the main problems?` returns recommendation overlay instead of the Problem collection. Owner: C5 leftover rec vs SHOW/EXPLAIN.

## MRA-3-011 (S2)

J3/LONG `what fields are confirmed?` / LONG `can this support the capacity issue` leave DATA-ADV (MRA-1-011 remainder). Required explain-CSV **did** stay on Data. Live cause follow-up `does that prove it caused the problem?` dropped `dataRoute` to none.

## MRA-3-012 (S2)

LONG `Approve Demand Surge` spoken contradiction vs Capacity Expansion Plan overlay. Canonical count still 1. Owner: C5/C7 presentation.

## MRA-3-013 (S3)

Live chat harness concatenates the word `Nexora` onto replies (`NexoraCurrent Problems`). Isolated runtime does not. Measurement artifact.

## Gate test (classified, not an Advisor S1)

`nexoraExecutiveUx2StageInteraction.test.ts` “UX:2 is wired through the existing Stage host” failed: host source no longer matches `/resetNexoraMVPObjectInteractionOverview/`. Pre-existing host-scan vs current `NexoraExecutiveShell.tsx`. Not patched in MRA:3.
