# NPA-T SIM-TEST:6-FIX18 — Repair

Clusters were repaired in order (A, then B, then C), each followed by its focused guards and the external suite. No test expectation among the 14 was changed. There are no Observer, Decision or Execution changes. CC:10 remains the only Decision writer. No production hunk contains object, profile, turn or journey names.

## Production changes (4 files)

### Cluster A — `conversationalExperienceOrchestrator.ts`

`describeResolvedScenario` also accepts `isTargetedDeicticInvestigationUtterance` (the existing CC normalization predicate), but only while the resolved composition subject is a Scenario:

```ts
const describeResolvedScenario =
  resolvedCompositionSubject.kind === "scenario" &&
  (isDeicticSubjectExplain(intent.kind, intent.normalizedUtterance) ||
    isTargetedDeicticInvestigationUtterance(intent.normalizedUtterance));
```

"Why?" is not a targeted investigation, so it stays `impact-why` (R4). A later named object (Capacity Gap) is not captured, because the resolved composition subject is then that object.

### Cluster B — `nexoraRegisteredReferenceRecovery.ts`

Fuzzy part matches are now split into two kinds:

- **Covered:** the compact key, or a key whose words are all present.
- **Partial:** a single word of a compound key that isn't fully present.

A partial match is added only when its distance equals the best covered match. So it can widen a tie into ambiguity, but can never select a subject on its own. FIX10 T92 is preserved: "production" is still UNRESOLVED.

| Input | Result |
| --- | --- |
| capcity | AMBIGUOUS across Capacity and the compound "capacity …" keys; FINAL:6.2 resolves it from the active listing |
| demnd | AMBIGUOUS between Demand and Demand Surge |
| pressure | registry UNRESOLVED; FINAL:6.1 head-noun fallback resolves Margin Pressure (R9) |
| capacity | EXACT |

### Cluster C — `conversationContinuityResolver.ts` (FINAL:6.2)

"The other" binds only a uniquely determined contrast of the same object type as the active subject. Candidates are tried in this order, and anything else stays UNRESOLVED:

1. the single presented contrast (several presented contrasts stay unresolved);
2. the previous subject, if it's the same type;
3. the single same-type sibling.

### Cluster C — `nexoraNca2ConversationState.ts` (NCA:2)

The ordinal-with-no-list CLARIFY branch no longer overrides a contrast FINAL:6.2 resolved:

```ts
!(input.contextual.continuityMove === "other-referent" &&
  input.contextual.provenance !== "UNRESOLVED")
```

Real ordinals ("the second one", "explain the second problem") with no list still clarify, preserving the FIX9 guards. Ordered collections keep ordinal selection.

## Tests

`app/lib/sim-test/nexoraSimulationReferentRegressionFix18.test.ts` has 18 tests: A1–A6, B1–B8 and C1–C5, with each cluster covered separately.

It was adopted from the concurrent attempt and reconciled here. Its A6 read-only guard checked `nextDecisionSession.decisions`, which does not exist on the type, so it always compared 0 with 0. It now asserts:

- `decisionCommitmentResult` is null;
- the Decision runtime count is unchanged;
- the decision-provenance count is unchanged.

## Differential proof (one cluster reverted per `/tmp` copy)

| Reverted | FIX18 file fails | External fails |
| --- | --- | --- |
| none (current) | 0/18 | 3 (N, F, H) |
| A | A1, A6 | 12 = 3 + 9 Cluster A MRA tests |
| B | B1, B3, B6, B7 | 7 = 3 + "look at capcity", "look at demnd", isolated NLU, "MRA:3-FIX1 C1 first problem" |
| C (both parts) | C1, C2, C5 | 4 = 3 + "C1 contrastive other" |
| C NCA:2 part only | C1, C5 | 4 = 3 + "C1 contrastive other" |
| C FINAL:6.2 part only | C2, C5 | 3 (the external test is fixed by the NCA:2 part alone) |

## Sequential external trajectory

| Stage | Failures |
| --- | --- |
| Entry | 17 |
| After A | 8 |
| After B | 4 (expected 5; the extra pass is the masked Cluster B regression, see `ROOT-CAUSE.md`) |
| After restoring the three certified R7/FIX15 hunks | 4 (unchanged) |
| After C | 3 = the unchanged `HEAD` set |
