# Root cause

## Earliest owner

**CC:5 `executeNexoraConversationalExperience` / `finalize` scenario-session lifetime**, with a contributing **CC:10 hint ordinal** defect once a collection is present.

NMI, MLEVEL, Stage, Operator, Outcome, Learning, and CC:11 were not the blocking owners.

## Proven chain for “Let's go with option B.”

1. Manager utterance through real CC:5 (`speakRmsManagerThroughCc5` / RMS adapter). No harness Decision write.
2. Intent: `commit-decision` with primary hint `option b` (CC:1). Discussion “What about option A?” remains non-commit (`situation` / follow-up).
3. “Show me the alternatives.” is an investigation-options utterance → CC:9 seeds `Investigate {label}` and `No Action on {label}` into `candidateScenarioIds`.
4. **First divergence (pre-repair):** T12 “What about option A?” produced `scenarioResult == null`. VAI:8 overlay was given `scenarioSession: null`. `nextScenarioSession` was `vai8Overlay.result.scenarioSession ?? scenarioResult?.nextSession ?? null` and **never fell back to the inbound CC:9 session**. Active option collection became `[]`.
5. T13 CC:10 **was invoked** with empty `candidateScenarioIds` → `clarification-required` “Which option do you want to commit to?”. Not a CC:10 authority failure; it never received a legitimate collection.
6. T14 “Yes, make that the decision.” had no pending CC:10 candidate → FINAL clarification reconstructed Capacity Gap vs Capacity (subject nouns), not Option B.

## Repair (smallest seam)

1. **Retain active option collection** across non-scenario turns: if the next session has zero `candidateScenarioIds`, keep the previous session that still has them. Pass that session into VAI:8 overlay. No second option store.
2. **Ordinal hints** `option b` / `second option` resolve against `candidateScenarioIds` display order (A=0, B=1). Named miss no longer falls through to `activeScenarioId` (protects option Z / out-of-range C).
3. Unique intervention “plan” token match for “Approve the delivery recovery plan.” against the single intervention candidate (shared with Project; not Project-specific).
4. Investigation-options normalization includes `show me the alternatives`.

## Clarification root cause

Clarification was genuine **only after the collection was discarded**. It was not required when one active collection mapped B uniquely. Capacity Gap vs Capacity was confirmation processing without a pending scenario candidate.

## Candidate identity root cause

Visible order after seed/compare: `[Investigate Capacity, No Action on Capacity]`. Option B is therefore **No Action on Capacity** (second slot), not a global “Scenario B” registry. Repair preserves that mapping; it does not invent Investigate as B.

## What was not the owner

- CC:11 correctly refused Execution without Decision (original PASS) and starts Execution once CC:10 writes Approved (post-repair smoke).
- Advisor recommending a scenario did not auto-commit.
- SIM-TEST harness still only observes `listDecisions()`.
