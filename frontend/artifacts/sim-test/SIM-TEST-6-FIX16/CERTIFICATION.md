# NPA-T SIM-TEST:6-FIX16 — Certification

**Status: CERTIFIED**

## Identity proof (after FIX16)

| Turn | Utterance | Canonical | Conversation | Advisor | Stage | Decisions | Executions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T12 | Delivery. | obj-delivery | obj-delivery | obj-delivery | obj-delivery | 1 | 1 |
| T13 | This. | obj-delivery | obj-delivery | obj-delivery | obj-delivery | 1 | 1 |
| T14 | Back to capacity. | obj-capacity | obj-capacity | obj-capacity | obj-capacity | 1 | 1 |
| T15 | Supplier issue. | obj-capacity | obj-capacity | — | obj-capacity | 1 | 1 |
| T16 | Capacity again. | obj-capacity | obj-capacity | obj-capacity | obj-capacity | 1 | 1 |

At T14, FINAL:6.2 reports `previous-referent` / `CONTEXT_PREVIOUS_SUBJECT`, CC:1 reports `focus`, and the status is `applied`.

## Decision and Execution integrity

The Decision count is 1 before and after the return, and the Execution count is 1 before and after. The Decision identity is unchanged from T9 through T16, and the T8 identity is unchanged. There is no Decision on a navigation turn, no duplicate Execution and no rewritten candidate.

## Tests

FIX16 (`nexoraSimulationReferentFix16.test.ts`, 10/10 green). On the pre-FIX16 tree, 9 fail; the regression guard passes on both trees.

| Test | Covers |
| --- | --- |
| A | Impatient T12–T16 cluster: layers aligned, no STALE_REFERENT, Decision and Execution integrity. |
| B/F | Terse / "Go back to" / "Return to" named return: FINAL:6.2 verdict and four-layer alignment. |
| C | "Explain this." and "Why?" after the return stay on the returned subject. |
| D/E/L | Capacity → Delivery → Inventory → back to Capacity → back to Delivery → back to Capacity; the thread is preserved. |
| History qualifier | "Back / Go back to the known delivery issue.", plus project-long T32. |
| Regression guard | Bare "Go back." stays R2; "Back to the problems." is not a subject return. |
| G | An ambiguous terse named return stays unresolved (`multiple-objects`) for Smart Clarification. |
| H | Unknown or unvisited targets do not become canonical; the unknown one clarifies and is not invented. |
| I/J | A named return after a Decision and an Execution selects the object and does not mutate either. |
| K | A named return supersedes a soft commitment without completing it ("Yes." then creates nothing) and supersedes a pending 6.3 clarification. |

## Regression guards

| Suite | Result |
| --- | --- |
| Manager-object continuity / 6.1–6.4 / R5 / R6 / R7 / NCA / NXA1 / NXA5-Fix4 | 228/228 |
| Conversational-control (CC:1, CC:10 commitment, Execution follow-up, …) | 362/362 |
| SIM-TEST folder (FIX10–FIX16, R2–R9, harness, Observer) | 187/187 (177 + 10) |
| Typecheck | 0 errors |
| Ground Truth leakage in production edits | none |

## SIM-TEST S1 differential (26 journeys, scratch pre-FIX16 vs after)

- Impatient before: T16 STALE_REFERENT, T30 ADVISOR_DIVERGENCE, T31 ADVISOR_DIVERGENCE (`fnv1a32:3270d743`).
- Impatient after: T30, T31 (`fnv1a32:40cfa4b3`).
- Every other journey: no S1 before or after. There are 0 new S1.

## NXA funnel

| Level | Result |
| --- | --- |
| L1 | 19/19 |
| L2 | 453/453 |
| L3 | 48/48 |
| L4 | 7/7 required tasks: omnibus 1681/1681, dir-inventory 58/58, typecheck, eslint, diff-check, build, live-smoke (`ok`, zero page errors) |

## Out of scope

T30 and T31 (ADVISOR_DIVERGENCE) are unchanged and remain outside FIX16.

## Recorded debt (not repaired)

**New observations:**

- "X again" (for example "Capacity again.") is not a named return. After Delivery, it keeps Delivery. It is not exercised by any journey after FIX16.
- For an unvisited but valid terse target ("Back to inventory."), conversation continuity and the Advisor adopt the target while the canonical subject and Stage stay. This is pre-FIX16 behavior, unchanged.

**Carried debt, unchanged:**

- ECA:8 invented Scenario B.
- T9 wording.
- T10 Execution contradiction (scenario-intervention canonical subject).
- CC:9 re-seeding.
- Advisor option prose vs candidate mismatch.
- S1-06 status.
- S1-06 T1 no-match.
- "Give me the details.".
- Delivery walkthrough drift.
- ECA confidence wording.
- ".." formatting.
- Pre-R9 build-memory flag.
- The 12 pre-existing MRA/ECA failures outside the funnel.
