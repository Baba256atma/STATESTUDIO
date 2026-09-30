# NPA-T SIM-TEST:6-FIX15 — Repair and proof

## Production changes (existing owners only; new authority: NO; profile-specific: NO)

1. **`conversationalIntentNormalization.ts` — `isInvestigationOptionsUtterance` (T6 root).** The `show (me)` prefix is now optional, so bare `options` / `alternatives` / `the options` join the existing option-request family. CC:1 classifies them as `compare-scenarios` (`requiresContext: true`), and the same predicate gates CC:9 seeding.
2. **`conversationalIntentResolver.ts` — explicit-commitment rule (T8 root).** The verb before `go with` is now optional, in both the matching regex and the target-extraction regex. `go with your recommendation` is still caught by the earlier recommendation rule, and the soft `maybe go with …` rule is still checked first.
3. **`conversationalExperienceOrchestrator.ts` — CC:9 option seeding.** The investigation pair is seeded only when a primary subject exists. A cold option request no longer creates a committable subject-less "No Action on this subject".
4. **`executiveDecisionCommitmentResolver.ts` — CC:10 letter/ordinal mapping.** A letter or ordinal resolves against the retained collection only while the conversation's current object subject is one the collection intervenes on. Otherwise the resolver returns null, and CC:10's existing clarification ("Which option do you want to commit to?") applies.

## Controlled differential (scratch copy; each edit reverted alone)

| Reverted edit | FIX15 tests failing |
| --- | --- |
| T6 predicate | A, B/K, C/F, D, E, H, L, CC:1 (8) |
| T8 grammar | A, C/F, D, G, H, I, L, CC:1 (8) |
| Subject-less seeding guard | G (1) |
| CC:10 anchor guard | I (1) |

## Decision proof (Impatient, final signature `fnv1a32:3270d743`)

| Point | Decisions | Decision |
| --- | --- | --- |
| Before T6 (T5 Why?) | 0 | — |
| After T6 Options. | 0 | — (collection established, no selection, no pending) |
| After T8 Go with B. | 1 | `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` (CC:10 `applied`) |
| After T9 Yes. Decide. | 1 | same (no duplicate) |

The B identity at T8 resolves as follows:
- Display reference: `B`.
- Canonical candidate: `cc10:candidate:scenario:cc9:scenario:do-nothing:do-nothing:v1`.
- Scenario: `cc9:scenario:do-nothing:do-nothing:v1` ("No Action on Capacity").
- Source of mapping: position 2 of the CC:9 active candidate collection `[cc9:scenario:intervention:obj-capacity:v1, cc9:scenario:do-nothing:do-nothing:v1]`, seeded for `obj-capacity` at T6. This is the same mapping the standard "Let's go with option B." uses.
- Lifetime: the CC:9 session collection, retained by `retainActiveScenarioOptionCollection`, and valid for ordinal references while the conversation stays on a subject the collection intervenes on.

Identity alignment at T8: conversation and canonical = the CC:10 Decision ID; Advisor and Stage = `obj-capacity`, the Decision's subject.

## Tests — `app/lib/sim-test/nexoraSimulationDecisionFix15.test.ts` (11/11)

Positive:
- CC:1 families.
- A: exact T6–T9 sequence, counts 0/0/1/1, no MISSING_DECISION.
- B: Options. establishes the Capacity collection.
- C/F: B resolves to the canonical candidate at the presented position; the Decision ID, title and runtime agree.
- D: Go with option B., Choose B. and Let's go with option B. resolve to the same candidate.
- E: soft commitment followed by Yes. / Yes, make that the decision. completes the pending candidate.

Negative:
- G: cold B, B with a subject but no options, cold Options. then B, cold long-form then B. All clarify with no Decision.
- H: unmapped C clarifies, and Yes. adds no Decision.
- I: stale B after moving to Delivery (terse, long form, and after re-requesting options) clarifies.
- J: cold Yes. Decide. creates no Decision.
- K: Options./Compare. create no commitment, no pending and no Decision.
- L: repeat commitment and confirmation are `already-committed`, with 1 Decision.

Updated measured ledger: `nexoraSimulationImpatientFix14.test.ts` now expects the remaining S1 set without `8:JOURNEY/MISSING_DECISION`.
