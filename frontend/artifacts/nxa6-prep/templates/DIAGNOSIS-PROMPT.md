# Diagnosis prompt template

One defect: [id]
Exact reproduction: [setup + utterance sequence]
Expected: [semantic + Stage]
Observed: [semantic + Stage]
Certified baseline: [e.g. NXA:5-FIX2]
Investigation boundary: diagnose only; do not change production behavior
Required artifacts: diagnosis record, path trace, focused reproduction command
Stop Condition: a diagnosis verdict is recorded (REPRODUCED / NOT_REPRODUCED / ENVIRONMENT_BLOCKED / INTERMITTENT / EXPECTED_BEHAVIOR / INSUFFICIENT_EVIDENCE) with first divergent layer when reproduced. Do not start a Fix.
