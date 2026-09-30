# NPA-T SIM-TEST:6-FIX17 — Certification

**Status: CERTIFIED**

SIM-TEST:6 is READY FOR FINAL RECERTIFICATION. FIX17 is not the SIM-TEST:6 recertification; the next phase is "NPA-T SIM-TEST:6 — FINAL RECERTIFICATION".

## Alignment proof (after FIX17, signature `fnv1a32:a5d79e5e`)

| Turn | Utterance | Canonical | Conversation | NCA:2 | Advisor | Stage | Decisions | Executions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T29 | Now? | obj-capacity | obj-capacity | — | — | obj-capacity | 1 | 1 |
| T30 | The previous one. | obj-inventory | obj-inventory | obj-inventory | obj-inventory | obj-inventory | 1 | 1 |
| T31 | Anything else? | obj-inventory | obj-inventory | obj-inventory | obj-inventory | obj-inventory | 1 | 1 |
| T32 | Just fix it. | obj-inventory | obj-inventory | obj-inventory | obj-inventory | obj-inventory | 1 | 1 |

At T30:

- CC:1 is `focus`; CC:2 is Inventory.
- FINAL:6.2 is Inventory, `CONTEXT_PREVIOUS_SUBJECT`, backtrack, FOCUS.
- The `focus-subject` command is applied and committed. The reply is "Focused on Inventory.".

T31 became correct without its own repair, which confirms it is downstream of T30.

## Integrity

- Decision `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`: count 1, same identity from T10 to the end.
- Execution `execution-cc10:decision:…`: count 1, same identity.
- There is no Decision on a navigation turn, no duplicate, no historical Decision/Scenario used as the referent, and no rewritten identity.

## Tests

FIX17 is `nexoraSimulationAdvisorFix17.test.ts`, 11/11 green.

- **On pre-FIX17 production** (with the corrected Observer): the 5 product repair tests fail (A/B/L, C/F, E/H, E, G). The regression guards D, I/J/L and K pass on both trees.
- **With the original Observer:** the legitimate back-navigation Observer test fails, which proves the correction is needed.

| Test | Covers |
| --- | --- |
| A/B/L | Impatient T30/T31: every layer is Inventory, S1 `[]`, one Decision and one Execution with the same identity. |
| C/F | Two transitions (Capacity → Delivery → back; Delivery → Inventory → back): backtrack, contextual FOCUS, committed, aligned. |
| G | The pre-return subject does not survive ("Anything else?", "Explain this."); an explicit subject still moves. |
| E/H | After "Why?" (INVESTIGATE), back navigation does not carry INVESTIGATE; explicit "Show X." still commits. |
| E | A `focus-subject` command whose target differs from the FINAL:6.2 referent is not committed. |
| D | Options remain related context. "Go with B." after options commits on the Stage subject. |
| I/J/L | Back navigation after a Decision or Execution never yields a `cc10:`/`cc9:` referent, never mutates either, and clarifies. |
| K | A cold back navigation clarifies and guesses nothing. |
| Observer ×3 | Legitimate return to the prior referent gives `[]`. Return to a non-prior subject, or an unannounced "This." move, gives WRONG_REFERENT. An Advisor left behind after back navigation still gives ADVISOR_DIVERGENCE. |

## Regression guards

| Suite | Result |
| --- | --- |
| Manager-object continuity / 6.1–6.4 / FIX16 named return / R5 / R6 Smart Clarification / R7 Trusted Communication / NCA / NXA1 Advisor / NXA5-Fix4 | 228/228 |
| Conversational-control (CC:1, CC:10 commitment, Execution follow-up, …) | 362/362 |
| SIM-TEST folder (FIX10–FIX17, R2–R9 incl. R9 FAST `fnv1a32:3aa7cfc6`, harness, Observer) | 198/198 (187 + 11) |
| NMI / RMS / director semantic presentation | green. The 9 DIRECTOR-1 inventory tests use `import.meta.dirname` and fail only under the `tsx` loader; under `node --test` they pass (77/78 director tests pass there; the one failure is the semantic presentation director file, which needs the `tsx` loader and passes 6/6 under it). None of them touch the gate. |
| Typecheck | 0 errors |
| eslint (changed files) / whitespace | clean |
| Ground Truth leakage in the production edit | none |

## SIM-TEST S1 (26 journeys, pre-FIX17 vs after)

- Impatient before: `30:ADVISOR_DIVERGENCE`, `31:ADVISOR_DIVERGENCE` (`fnv1a32:40cfa4b3`).
- Impatient after: none (`fnv1a32:a5d79e5e`).
- Every other journey: identical S1 lists (none) before and after. There are 0 new S1.
- Signature change: `40cfa4b3` → `a5d79e5e`, caused only by T30–T32 now committing Inventory and the two findings being gone.

## NXA funnel

| Level | Result |
| --- | --- |
| L1 | 19/19 |
| L2 | 453/453 |
| L3 | 48/48 |
| L4 | 7/7 required tasks: omnibus 1681/1681, dir-inventory 58/58, typecheck, eslint, diff-check, build, live-smoke (`ok`, zero page errors). Barrier allowed, 0 running, 0 uninspected. |

The dev server on port 3000 (PID 4365) was already running before this task. It was not started or stopped by FIX17.

## Recorded debt (not repaired)

**New:**

- Repeated back navigation ("The previous one." twice) can disagree between CC:2 and FINAL:6.2.
  - CC:2's `previousSubjectIds[0]` toggles back to the older subject, while the FINAL:6.2 thread pops further.
  - The commit gate refuses the mismatch. Canonical, continuity, NCA:2, Advisor and Stage stay together, but the manager-object active subject and the reply follow CC:2.
  - This split existed before FIX17 in a different form. It is not exercised by any journey.
- The T31 reply is generic ("I can help investigate that…"). That wording is unchanged and is not a divergence.

**Carried, unchanged:**

- FIX16: "X again" is not a named return; an unvisited terse "Back to inventory." splits.
- ECA:8 invented Scenario B.
- T9 wording.
- T10 Execution contradiction.
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
