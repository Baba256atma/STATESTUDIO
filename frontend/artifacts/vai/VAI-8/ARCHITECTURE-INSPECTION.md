# NPA-A VAI:8 — Architecture Inspection

Inspection date: 2026-09-16.

Stop condition: Experiment-to-Decision Integration only. Do not start VAI:9.

## Canonical path

VAI:7 experiment → `EXPERIMENT_SCENARIO_PROPOSAL` (not a Scenario Object) → explicit manager intent → confirmation → CC:9 `resolveNexoraExecutiveScenarioConversation` (`define-intervention`) as the sole Scenario writer.

## Reused authorities

VAI:1–7, CC:9 Scenario conversation, NPS:4 option/scenario boundary (`createsScenarioAuthority: false`), ECA:7 recommendation, ECA:8 pre-decision challenge (consumes `analyticalUncertainty`), CC:10/CC:11, DIR:1/DTH, CC:5 overlay, Stage referent.

## Not introduced

Second Scenario/NPS/recommendation/Decision/Execution/Outcome/Learning writer. No VAI:9. No coefficient training.
