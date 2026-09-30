# NPA-T SIM-TEST:6-FIX17 — Impatient T30/T31 root cause

## Baseline (before FIX17, signature `fnv1a32:40cfa4b3`, S1 = 2: T30, T31)

The baseline is the post-FIX16 tree.

Context before the window:

- T21 "Inventory." and T22 "That one." hold Inventory on every layer.
- T23 "Return to capacity." moves every layer back to Capacity.
- Decision `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` and Execution `execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` exist from T10. Both counts are 1.

| Turn | Utterance | Intent | Canonical | Conversation (harness) | Advisor | Stage | Clarify | Decisions | Executions | Response (head) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T24 | Outcome. | ASK_OUTCOME | obj-capacity | obj-capacity | — | obj-capacity | no | 1 | 1 | I don't see any Outcomes in the current context… |
| T25 | Proven? | ASK_CAUSE | obj-capacity | obj-capacity | — | obj-capacity | no | 1 | 1 | I can help investigate that… |
| T26 | Schedule issue. | CHANGE_CONTEXT | obj-capacity | obj-capacity | — | obj-capacity | no | 1 | 1 | I couldn't find a clear match for "Schedule"… |
| T27 | Capacity. | RETURN_TO_SUBJECT | obj-capacity | obj-capacity | obj-capacity | obj-capacity | no | 1 | 1 | Capacity is already the current subject… |
| T28 | Learn what? | ASK_LEARNING | obj-capacity | obj-capacity | — | obj-capacity | no | 1 | 1 | I can help investigate that… |
| T29 | Now? | ORIENT | obj-capacity | obj-capacity | — | obj-capacity | no | 1 | 1 | I can help investigate that… |
| **T30** | **The previous one.** | FOLLOW_UP | **obj-capacity** | obj-capacity | **obj-inventory** | **obj-capacity** | no | 1 | 1 | Focused on Inventory. |
| **T31** | **Anything else?** | INVESTIGATE | **obj-capacity** | obj-capacity | **obj-inventory** | **obj-capacity** | no | 1 | 1 | I can help investigate that… |
| T32 | Just fix it. | UNSUPPORTED_ACTION | obj-capacity | obj-capacity | obj-capacity | obj-capacity | no | 1 | 1 | There is no supported impact basis… |

Per-layer detail from the RMS adapter, same sequence:

| Layer | T30 "The previous one." | T31 "Anything else?" |
| --- | --- | --- |
| CC:1 intent | `focus`, ordinal hint `previous` | `unknown` |
| CC:2 primary subject | `obj-inventory` (`previousSubjectIds[0]`) | `obj-capacity` |
| FINAL:6.1 | operation `NONE`, no explicit object | operation `NONE`, no explicit object |
| FINAL:6.2 | `obj-inventory`, `CONTEXT_PREVIOUS_SUBJECT`, move `backtrack`, requested operation `FOCUS` | `obj-inventory`, `CONTEXT_ACTIVE_SUBJECT`, move `what-else` |
| FINAL:6.3 | proceed | proceed |
| Runtime focus command | `focus-subject` mapped, runtime `applied`, **not committed** | none (`unsupported-intent`) |
| Canonical executive subject | `obj-capacity` | `obj-capacity` |
| Manager-object active / continuity | `obj-inventory` / `obj-inventory` | `obj-capacity` / `obj-capacity` |
| NCA:2 active subject | `obj-inventory` | `obj-inventory` (inherited) |
| NXA Advisor referent / need | `obj-inventory` / UNDERSTAND (`EXPLICIT_OR_NCA2_ACTIVE_SUBJECT`) | `obj-inventory` / UNDERSTAND |
| Stage focus | `obj-capacity` | `obj-capacity` |
| Reply | "Focused on Inventory." | generic |

## T30 defined

- Subject:
  - "The previous one." is a deictic back-navigation. The expected subject is Inventory, the subject held before the current Capacity.
  - Authorities: CC:1/CC:2 ordinal "previous"; FINAL:6.2 continuity corpus E2 ("Show Delivery." → "Show Risk." → "the previous one" → Delivery, asserted by the 6.2 continuity test); R2 back navigation.
- Operation: FOCUS. FINAL:6.2 sets `requestedOperation = FOCUS` on backtrack; FINAL:6.1 has no operation (`NONE`).
- Bundle: the NXA Advisor bundle correctly consumed the FINAL:6.2 and NCA:2 subject (Inventory). The bundle is not stale.
- Stale discourse: the canonical executive subject and Stage kept Capacity, from T23/T27.
- Observed split:
  - canonical and Stage: Capacity;
  - manager object, continuity, NCA:2, Advisor and reply: Inventory.

ADVISOR_DIVERGENCE was the symptom. The Advisor was right, but the canonical subject never moved.

## T31 defined separately

- "Anything else?" is a what-else continuation on the active subject. It has no operation of its own.
- The Advisor takes NCA:2's active subject, which T30 set to Inventory. Canonical and Stage stay Capacity, so the Observer again reports divergence.

**Counterfactual:** repair only T30 and leave T31 untouched. T31 then becomes correct: canonical, conversation, NCA:2, Advisor and Stage are all Inventory. **T31 is downstream of T30.** No second repair was made.

## Identity timeline and first disagreement

- T21–T22: every layer is Inventory.
- T23–T29: every layer is Capacity. The Advisor is empty on turns where it has no referent.
- **T30 is the first disagreement.** CC:2, FINAL:6.2, the manager object, continuity, NCA:2 and the Advisor move to Inventory. The canonical executive subject and Stage stay Capacity.
- T31: NCA:2 and the Advisor carry Inventory. Canonical and Stage stay Capacity.
- T32: the unsupported action resets the Advisor to the canonical subject, Capacity.

## First divergent seam

Trace: CC:1 `focus`, then CC:2 Inventory, then FINAL:6.1 `NONE`, then FINAL:6.2 Inventory/FOCUS, then FINAL:6.3 proceed. The runtime focus command is mapped and applied.

The divergence is at the orchestrator runtime commit gate (`conversationalExperienceOrchestrator.ts`, `focusMutationMatchesManagerNeed`). For a `focus-subject` command, the gate required **FINAL:6.1** `requestedOperation === "FOCUS"`.

A deictic back-navigation has no explicit object, so FINAL:6.1 reports `NONE`. Operation and referent for these moves are owned by FINAL:6.2, which the gate ignored. The result:

- `shouldCommitRuntime` is false.
- `nextRuntimeState` and the executive context update are skipped, so the canonical subject and Stage keep Capacity.
- Everything downstream of FINAL:6.2 (manager object, NCA:2, Advisor, reply) has already adopted Inventory.

Scratch instrumentation of the gate on the same tree (removed afterwards) compared two utterances after "Capacity." → "Delivery.". Both have FINAL:6.1 `NONE` and a FINAL:6.2 backtrack to Capacity.

- "The previous one." is CC:1 `focus`, so it produces a `focus-subject` command. The gate gives `commit:false`, and canonical and Stage stay Delivery.
- "Go back." is CC:1 `navigate-back`, so it produces a `navigate-back` command. The gate does not apply to that command, so it gives `commit:true`, and canonical and Stage move to Capacity.
- The only difference is the command kind. The FINAL:6.1-only check wrongly vetoes the `focus-subject` route of the same back-navigation.

## Classification

**Canonical transition failure upstream of the Advisor.**

- **A (upstream referent):** only partly. The referent was resolved correctly (CC:2 and FINAL:6.2 agree on Inventory), but the canonical transition did not consume the owning layer's verdict.
- **B (Advisor handoff):** no. The NXA contract consumed the correct NCA:2 subject.
- **C (operation carry-over):** no. The Advisor need was UNDERSTAND, not a carried operation.
- **D (stale bundle):** no.
- **E (composition):** no. Stage faithfully projected the uncommitted canonical subject.
- **F (Observer defect):** yes, for one rule, independently proven wrong (see below).

## Observer rule independently proven wrong (F, narrow)

After the commit-gate repair, all layers agree on Inventory at T30. The Observer then reported `30:WRONG_REFERENT`. Its deictic rule flags any deictic turn whose referent moves away from the previous turn's referent unless the utterance names the new subject.

For back-navigation deictics ("go back", "back", "(the) previous (one)", "the one before"), moving to the immediately previous held subject is the defined meaning. This is established by CC:1/CC:2 ordinal "previous", FINAL:6.2 backtrack, corpus E2 and R2, so the rule contradicted canonical authority.

The user approved a narrow correction. A back-navigation deictic that returns to the subject held before the current one is not WRONG_REFERENT. Every other deictic move, and back-navigation to any other subject, still is.

ADVISOR_DIVERGENCE logic is unchanged. With the corrected Observer and the pre-FIX17 production code, the baseline still reproduces exactly: `40cfa4b3`, with both T30 and T31 ADVISOR_DIVERGENCE.

## Why other journeys did not expose it

- Other journeys return by name ("Go back to…", "Return to…", "What about…"), or with "Go back.", which takes the `navigate-back` command route.
- The long journeys use "The previous one — …" with trailing content, which CC:1 classifies `unknown`, so the gate is never reached.
- Only the Impatient profile uses the bare "The previous one.".

## Decision, Execution and Scenario audit

- Decision `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`: count 1, same identity, from T10 through T32, before and after.
- Execution `execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`: count 1, same identity, before and after.
- `previousSubjects` contains the Scenario and Decision entries. Neither became the back-navigation referent, because the CC:2 and FINAL:6.2 previous subject is Inventory.
- Test I/J/L proves that back navigation directly after a Decision or Execution never hands a `cc10:` or `cc9:` identity to the canonical subject or the Advisor. It clarifies instead.
