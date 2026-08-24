# MVP-OUT:1-FIX2 — Root cause

## Observed failure

Turn 1: `what is DEMAND SURGE SCENARIO ?` produced attention/recommendation copy (“Investigate Demand Surge…”) instead of a named Scenario explanation.

Turn 2: `what if delivery be late ?` produced the generic fallback (“I’m not sure how that relates to the current executive context”).

Demand Surge identity (`ctx-scenario-demand`) never became CC:7 current Scenario, so the follow-up had nothing to modify.

## Classification (combined)

| Class | Role |
| --- | --- |
| **C / A** | `"what is <name> scenario"` had no matcher. Intent stayed **unknown** (or non-scenario explain). CC:7 `currentScenario` was not set to Demand Surge. |
| **B** | Because turn 1 never wrote Scenario identity, turn 2 could not persist it. |
| **F** | FIX1 What-If required increase/decrease verbs. `delivery be late` did not match, so intent stayed **unknown**. |
| **D / G** | Even a matched What-If treated Delivery as a new intervention subject and dropped the parent Scenario unless the orchestrator upgraded to `add-assumption` against `ctx-scenario-*`. |

Not a Shell-level memory bug. Shell `allowActiveStageContext` remains false. Continuity is CC:7 (`currentScenario` / `currentSubject` kind `scenario`).

## Exact loss point

1. CC:1 `resolveMatch` — no `matchNamedSubjectInquiry`; `"demand surge scenario"` did not exact-match the registry key `"demand surge"`.
2. CC:1 `matchDirectionalWhatIf` — no late/delayed condition pattern.
3. Unknown intent → CC:5 generic fallback **before** CC:9.

Secondary live gap (turn 4 `how sure are you?`): EXI `answerNexoraExiUtterance` short-circuited the orchestrator while a current Scenario existed, returning CORE-INT evidence copy instead of CC:9 confidence. FIX2 now skips that intercept when `parentScenarioRef` is set.

## Correction (routing only)

- Named inquiry + trailing `scenario` → `explain-scenario` / `describe` (CC:9).
- Registry `kindStrippedHintKeys` so `"demand surge scenario"` resolves `ctx-scenario-demand`.
- Generalized delay/late What-If → same FIX1 `explore-scenario` intent, `actionKind: delay`.
- Orchestrator: if current catalog Scenario (`ctx-scenario-*`) differs from the condition subject, hand off `add-assumption` with parent Scenario id.
- CC:9 `describe` uses existing presentation fields only; unsupported delay uses honest unsupported-model copy.
- Keep named `ctx-scenario-*` as CC:7 current Scenario when a derived evaluation has `parentScenarioId` set to that catalog id.

No new Scenario engine, no Delivery-only product rule, no invented delay magnitude, no EXI:6, no Outcome/Learning/APP-4/LLM/Stage topology change.
