# LEARN-CYCLE:1 findings

## Product

- S1 = 0.
- Repair: CC:9 Scenario session now carries read-only `learningInformedReassessment` (subjectId + CORE-OUT:2 ids + source `eca-12-reassessment`) when ECA:12 consumed supported Learning for a resolved `obj-*` subject.
- Decision continuity is transitive via D2.scenarioId from that session. No Learning IDs on Decision records.
- Subject switch (`obj-delivery`) clears Capacity provenance. Return to Capacity does not auto-restore.

## Safety

- Family J still asks “Which item do you mean?”
- Family K still stops after reassessment (no forced Options/Decision).
- R1 does not create a Decision or Execution.
- No-learning Delivery reassessment does not stamp cycle provenance.
- GT leaks = 0. Unsupported causation = 0.

## Architecture

No LearningDecisionLink, cycle store, or second Learning authority.
