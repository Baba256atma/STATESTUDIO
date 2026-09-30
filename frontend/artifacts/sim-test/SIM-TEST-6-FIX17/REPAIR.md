# NPA-T SIM-TEST:6-FIX17 — Repair

## Files

| File | Change |
| --- | --- |
| `app/lib/conversational-control/conversationalExperienceOrchestrator.ts` | The runtime commit gate `focusMutationMatchesManagerNeed` also accepts FINAL:6.2's FOCUS verdict for a `focus-subject` command. The contextual (6.2) requested operation must be FOCUS, and the 6.2 referent must be the same subject the command focuses (`context.primarySubject`). The comparison-criterion guard is unchanged. |
| `app/lib/sim-test/nexoraSimulationJourneyObservation.ts` | Narrow Observer correction (user-approved, class F). A back-navigation deictic that returns to the subject held before the current one is not WRONG_REFERENT. |
| `app/lib/sim-test/nexoraSimulationAdvisorFix17.test.ts` | New: 11 tests, 8 product and 3 Observer. |
| `app/lib/sim-test/nexoraSimulationImpatientFix14.test.ts` | The measured Impatient S1 ledger is now `[]`, so any new S1 fails. |

## Production change

```ts
const focusMutationMatchesManagerNeed =
  commandResult.command.kind !== "focus-subject" ||
  ((naturalLanguageUnderstanding.requestedOperation === "FOCUS" ||
    (contextualManagerMeaning.requestedOperation === "FOCUS" &&
      contextualManagerMeaning.objectReference?.subjectId != null &&
      contextualManagerMeaning.objectReference.subjectId ===
        context.primarySubject?.subjectId)) &&
    !(pendingCriterion &&
      isExecutiveComparisonCriterionAnswer(utterance)));
```

## Authority repaired

- FINAL:6.2 (`conversationContinuityResolver.ts`) already owns operation and referent for contextual moves, including backtrack → FOCUS. The commit gate now consumes that verdict instead of consulting FINAL:6.1 alone.
- The runtime focus command, the canonical executive subject, the Stage, NCA:2 and the NXA Advisor then follow through their existing paths.
- Nothing else was added:
  - no new store or presenter;
  - no Advisor override;
  - no change to the NMI Advisor bundle;
  - no second T31 repair.
- The subject-equality clause keeps the gate from committing a command whose target disagrees with the FINAL:6.2 referent. In that case nothing mutates, which is the pre-FIX17 behavior (test E).

## Observer change

- A `BACK_NAVIGATION` pattern is added: `go back | back | (the) previous (one) | the one before`, exact utterance with optional punctuation.
- The Observer now tracks the last two distinct non-empty referents, `heldReferent` and `priorReferent`.
- The deictic WRONG_REFERENT rule is skipped only when the utterance is back navigation and the referent overlaps `priorReferent`.
- These are unchanged:
  - ADVISOR_DIVERGENCE;
  - STALE_REFERENT;
  - every other deictic rule;
  - back navigation to any other subject, which is still WRONG_REFERENT.

## Necessity (scratch differential, all 26 journeys)

| Variant | Impatient S1 | Signature |
| --- | --- | --- |
| Pre-FIX17 | 30 ADVISOR_DIVERGENCE, 31 ADVISOR_DIVERGENCE | `40cfa4b3` |
| Observer correction only | 30 ADVISOR_DIVERGENCE, 31 ADVISOR_DIVERGENCE | `40cfa4b3` (identical, nothing suppressed) |
| Commit gate only | 30 WRONG_REFERENT (the Observer contradicting canonical back-navigation authority) | `f58f844e` |
| Both (FIX17) | none | `a5d79e5e` |

The other 25 journeys have identical S1 lists (none) in every variant.

## Behavior change

- A bare deictic back navigation ("The previous one.", "the one before") that CC:1 routes to `focus` now moves the canonical subject and Stage to FINAL:6.2's previous subject. Every layer agrees, as it already did for "Go back." (`navigate-back`) and for named returns (FIX16).
- A follow-up option selection after returning to a subject with pending options ("Go with B.") commits that subject's candidate. This is the same as the certified FIX16 named-return behavior.
- The following are unchanged:
  - Explicit FINAL:6.1 FOCUS commits as before.
  - A `focus-subject` command whose target differs from the FINAL:6.2 referent does not commit.
  - A back navigation with no usable previous subject, or directly after a Decision or Execution, still clarifies and mutates nothing.

## Generalization

- Proven with two independent transitions: Capacity → Delivery → back = Capacity, and Delivery → Inventory → back = Delivery. Also proven after an INVESTIGATE operation and after options.
- The gate checks the generic FINAL:6.2 verdict. It does not depend on the profile, turn numbers, utterance text, object/Scenario/Decision IDs or the Observer finding type.

- New authority: NO.
- Second T31 repair: NO.
- Profile-specific: NO.
- Observer changed: YES (narrow, user-approved, both directions tested).
