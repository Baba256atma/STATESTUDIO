# NPA-A VAI:7 — Architecture Inspection

Inspection date: 2026-09-16.

Stop condition: Interactive Analysis & What-If Scenarios only. Do not start VAI:8.

## Smallest integration

VAI:7 is a session-scoped `WHAT_IF_EXPERIMENT` overlay over a legitimate VAI:1–4 bundle. Assumptions never write Data Reality, CSV, Objects, Evidence, Scenario, Decision, Execution, or Outcome. CC:5 optionally overlays Advisor copy and attaches the experiment; Director/VAI:6 remain presentation-only.

## Reused authorities

VAI:1 Variables, VAI:2 roles, VAI:3 causal ladder (consumed, not extended), VAI:4/CC:5 Advisor, VAI:5 symbols, VAI:6 Impact Scene, CC:9 Scenario confirmation for promotion proposals only, Stage `focusedSubject`, MO:1 catalog.

## Calculation/simulation inspected, not adopted as VAI truth

- CC:9 `executiveScenarioDefinition` / conversational WHAT_IF grammar — executive Scenario drafts, not VAI overlay.
- `frontend/app/lib/simulation` / RMS D7 operational graph — RMS/D7, `RMS_AUTHORITY_BOUNDARY.vai === false`.
- VAI:6 `isPredictionUtterance` remains a VAI:6 non-calculator; VAI:7 owns classified experiment results separately.

## Not introduced

Parallel Scenario/Decision/Execution/Data Reality/Variable/causal/Stage/Director/Advisor/Outcome stores; Monte Carlo; optimization; model training; causal graph; VAI:8.
