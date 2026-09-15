# Subject fidelity contract

Read-only invariant (`subjectCompositionFidelity.ts`). Not an Object store.

When a turn has a successfully resolved conversational subject (FINAL:6.2 continuity, else CC:7 current subject):

- `resolvedSubject` must stay compatible with any subject-specific candidate used for final composition
- unless the manager explicitly asked a related-object question (`show-related` / related-kind inquiry)

Compatibility is not always identity:

- “What Scenario is related to Capacity Gap?” may answer with a Scenario
- `Capacity Gap` → `explain it` must not silently answer as the related Scenario

Operations covered conceptually: explain, investigate, status, why, what is happening, how sure, related knowledge questions — implemented via intent kind + deictic-explain vs Scenario-assessment follow-up (how sure, what could be affected, which KPI, what risks, why), not Capacity Gap phrase matching.

Trace fields (inspectable, not manager-facing): `compositionResolvedSubject*`, `compositionCandidateSubject*`, `compositionSelectedSubject*`, `compositionFidelityCompatible`, `compositionStaleScenarioBlocked`.
