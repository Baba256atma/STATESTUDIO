# NPA-T SIM-TEST:6-FIX15 — Impatient T8 MISSING_DECISION root cause

## Baseline (before FIX15, signature `fnv1a32:7b53995b`, S1=4)

| Turn | Utterance | CC:1 | Status | CC:9 candidates | CC:10 | Decisions | Response (head) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T5 | Why? | explain | applied | none | — | 0 | Capacity has not been resolved yet… |
| T6 | Options. | unknown | unsupported | none | — | 0 | I can help investigate that, but I need to know which business outcome… |
| T7 | Compare. | compare-scenarios | applied | [] | — | 0 | I need at least two evaluated scenarios to compare. |
| T8 | Go with B. | unknown | unsupported | [] | — | 0 | …You're choosing Scenario B. Confirm it as the Decision? (ECA:8 overlay; no Scenario B exists) |
| T9 | Yes. Decide. | unknown | unsupported | [] | — | 0 | That helps. It strengthens the capacity-pressure hypothesis… (ECA answer intake) |
| T10 | Start it. | explain | applied | [] | — | 0 | Not yet… no committed Decision. |

Canonical, conversation, Advisor and Stage are `obj-capacity` from T3 through T9. No clarification was requested. `pendingConfirmation` stays null throughout.

## Existing Decision path (owners reused, none added)

1. Option request → CC:1 `compare-scenarios` (`operation: compare`) through the shared predicate `isInvestigationOptionsUtterance` (`conversationalIntentNormalization.ts`, consumed at `conversationalIntentResolver.ts`).
2. Candidate identity → the orchestrator seeds the investigation pair for the conversation subject (`seedInvestigationScenarioPair`, gated by the same predicate). CC:9 (`executiveScenarioResolver.ts`) owns `candidateScenarioIds` and `lastComparison`, and the collection is retained by `retainActiveScenarioOptionCollection`.
3. Display reference → candidate → CC:10 `resolveScenarioFromHint` / `resolveOrdinalLetter` (`executiveDecisionCommitmentResolver.ts`) maps `A/B/C`, `option B` and `the second option` onto the active CC:9 candidate collection. This contract is certified by `executiveDecisionCommitment.test.ts` ("option B ordinal commitment uses the active candidate collection") and SIM-TEST:5-FIX1 ("visible option B is the second seeded candidate").
4. Commitment → CC:1 `commit-decision`. An explicit commitment is applied by CC:10 directly; a soft one (`maybe go with …`) creates `pendingConfirmation`, which `confirm-decision-commitment` or a CC:5 structured "Yes." completes.
5. Decision → CC:10 only. A repeat commitment or confirmation returns `already-committed`.

Standard parity sequence: "Show me the alternatives." → "Compare them." → "Let's go with option B." commits `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` at the commit turn. "Yes, make that the decision." then returns `already-committed`.

## Earliest divergence and relationship

- **T6 (root 1, earliest).** Bare `options` is outside the option-request family: "Show options." and "What are my options?" match, but "Options." does not. As a result, CC:1 returns `unknown` and CC:9 never seeds a candidate collection. No A/B option discourse was established before T8 (§3).
- **T7 (downstream of T6).** "Compare." correctly compares only existing candidates. It does not seed, which is the same as for a standalone "Compare.".
- **T8 (root 2, independent).** A controlled rerun with only the T6 repair applied showed that T6/T7 establish and compare the Capacity collection. T8 "Go with B." is still CC:1 `unknown`: the explicit-commitment rule accepts `choose/approve/use/let's go with …` but not bare imperative `go with …`. T8 is therefore both downstream of T6 and independently broken.
- **T9 (downstream of T8).** After T8 commits explicitly, CC:10 has nothing left to confirm; the existing contract for a repeat is `already-committed`. T9 never needed to create the Decision.

## Related defects exposed while verifying guards (same owners)

- A cold option request with no subject seeded a subject-less "Investigate this subject" / "No Action on this subject" pair. The comparison failed ("I need at least two evaluated scenarios"), yet "option B" then committed "No Action on this subject". The option set was never presented, so B must not be meaningful (§3, §4, §8). This is pre-existing for the long form, and the T6 repair would have extended it to "Options.".
- A retained collection answered B after the conversation had moved to another canonical object (Options on Capacity, then Delivery, then "Go with B." committed "No Action on Capacity"). This violates §10/§11: B must not select a candidate from another Problem.

## Observer

The T8 `JOURNEY/MISSING_DECISION` classification (owner CC5_CONVERSATION) was correct. The Observer was not changed.
