# NPA-T SIM-TEST:6-FIX18 — Root Cause

Baseline for "pre-program" is git `HEAD` `dd3320ed`, extracted with `git archive` into `/tmp`. Every cluster was reproduced first and traced to the first divergent layer. Each attribution was then confirmed by reverting only that cluster's FIX18 hunks in a `/tmp` scratch copy (see `REPAIR.md`, differential proof).

## Entry state

`tsx --test app/lib/nexora-conversation/*.test.ts` gave 1061 tests with 17 failures.

FINAL classified these as 13 program-caused failures plus 4 shared with `HEAD`. FIX18 found that one of the four "shared" tests is really a masked Cluster B regression, so the true split is:

| Set | Count |
| --- | --- |
| Program-caused (A 9, B 4, C 1) | 14 |
| Unchanged `HEAD` failures (N, F, H) | 3 |

"MRA:3-FIX1 C1 first problem then it stays on that Problem" failed at `HEAD` and at FIX18 entry, but for different reasons:

- **At `HEAD`:** it failed at a later step. The input did not match `/Margin Pressure/`; the reply was about Capacity Gap.
- **At entry:** it failed at the "look at capcity" step with the reply "Focused on Capacity." That is the Cluster B symptom.

Reverting only Cluster B makes it fail again with exactly the entry message.

## Cluster A — Scenario deictic routing (FIX14-R4), 9 failures

- **Chain:** `Demand Surge → investigate it`, and also "look deeper into it" and "what else do we know about it?".
- **Expected:** describe the resolved Scenario, Demand Surge, with continuity `ctx-scenario-demand`.
- **Actual:** `explain-scenario` with `operation: impact-why`, replying "There isn't a current Scenario impact assessment to explain…".
- **First divergent layer:** the orchestrator's Scenario explain routing, specifically `describeResolvedScenario` in `conversationalExperienceOrchestrator.ts`.
  - R4 narrowed `describe` to `isDeicticSubjectExplain`, the explain forms only.
  - Targeted deictic investigations therefore fell through to `impact-why`.
  - The intent layer (CC:1) and continuity layer (FINAL:6.2) already resolved Demand Surge correctly.

## Cluster B — compound/fuzzy referent (FIX10, R9), 4 failures

- **Chains:**
  - `What are the main problems? → look at capcity`
  - `show me scenarios → look at demnd`
  - isolated NLU for "look at capcity"
- **Expected:** the listed entity (Capacity Gap, Demand Surge). The isolated interpretation keeps at least two candidates.
- **Actual:** the Capacity KPI (the reply "Focused on Capacity."), and the ambiguity candidates are lost.
- **First divergent layer:** the registry fuzzy resolver, `resolveRegisteredReference` in `nexoraRegisteredReferenceRecovery.ts`.
  - FIX10's `compoundKeyCoveredByInput` rule stopped a single word of a compound key from selecting that key, which is correct (T92: "production" must not select "production capacity").
  - But it did so by dropping those part matches entirely.
  - "capcity" then matched only the single-word key "capacity" and resolved HIGH_CONFIDENCE_FUZZY.
  - The tie with "Capacity Gap", "Capacity Expansion" and the other compound keys disappeared, so FINAL:6.2 had no ambiguity left to resolve from the active listing.

## Cluster C — contrastive "other" (NCA:2), 1 failure

- **Chain:** `Capacity Gap → why → and the other one?`
- **Expected:** Margin Pressure, the unique sibling Problem.
- **Actual:** "I don't have a current ordered list to apply that to. Which items should count as first, second, and third?"
- FINAL:6.2 was identical at `HEAD` and at entry: `continuityMove: other-referent`, and the continuity subject becomes Margin Pressure.
- **First divergent layer:** NCA:2 `interpretNcaDialogueTurn`, which returned `CONTINUE_TOPIC` at `HEAD` and `ASK_MANAGER` at entry.
- **First wrong predicate:** the program-added ordinal branch in `nexoraNca2ConversationState.ts`:

  `collectionOrdinalIndex(utterance) != null && !isReturnUtterance(prepared)` → CLARIFY

  `collectionOrdinalIndex` maps "the other one" to index 1, so a contrast that FINAL:6.2 had already resolved was overridden as an ordinal with no list.

That branch also hid two older FINAL:6.2 guesses in the other-referent resolver, which is unchanged since `HEAD`. Its fallback was `otherPresented ?? previousSubjectId ?? first sibling`:

- **C2 (several siblings):** "Demand Surge → and the other one?" picks one Scenario out of several.
- **C5 (object type):** "Demand Surge → Capacity Gap → and the other one?" binds the Scenario Demand Surge, because `previousSubjectId` has no type check.

Removing only the NCA:2 override would expose both guesses. So the contrast rule belongs in its owner, FINAL:6.2.

## Blocker found and resolved during FIX18 (not a FIX18 change)

A concurrent FIX18 attempt modified this working tree between 16:57 and 17:11. Its 17:08 scratch snapshot is in `/tmp/f18-diff/none`. The 17:09–17:11 rewrite removed three certified hunks:

| Hunk | Certified by | Effect when missing |
| --- | --- | --- |
| `npsComparisonRecommendationRuntime.ts` gates bare "why?" on `recommendationInDiscourse` | FIX14-R7 | R7 tests A, H and J fail |
| `nexoraMvpFinal64TrustedCommunication.ts` `capDepth(dropRepeatedSentences(answer), …)` | FIX14-R7 | verbosity regression |
| `conversationalIntentResolver.ts` bare "go with X" commit regex | FIX15 | the CC:10 commit path |

With the user's approval, the three hunks were restored byte-for-byte from the 17:08 snapshot, and the guards were rerun: 92/92, then 83/83 after the crash.

The other attempt's Cluster B and C edits are not in the workspace. Its Cluster A edit is identical to this one. Its test file was adopted and reconciled as the FIX18 guard file.

A second mtime-only rewrite at 17:35 changed no `app/` content. This was verified against the 17:08 snapshot; the only differences are the FIX18 hunks.

## Pre-existing debt observed (same at `HEAD`; not repaired)

- **Ordered-list "other":** after "show me all problems → Margin Pressure → and the other one?", FINAL:6.2 resolves Capacity Gap. But NCA:2's ordered-collection branch reads "the other one" as index 1 and replies "Understood — Margin Pressure."
- **Scenario explain capture:** after "Demand Surge → Capacity Gap → and the other one?", continuity now binds Margin Pressure (at `HEAD` it bound Demand Surge). But the orchestrator's Scenario explain capture still replies with Scenario impact text, as it did at `HEAD`.
- **F:** the reply differs from `HEAD` ("Which one do you want me to show?" instead of "Are you asking about the scenario or the problem?"). It fails the same assertion and did not change at any FIX18 stage.
