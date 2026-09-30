# Harness and measurement contract

## Responsibility

The harness validates a declarative journey, resolves a certified RMS Scenario, creates the normal sealed RMS session, schedules bounded RMS event/Operator/Manager activity, captures existing product state, invokes the RMS Observer, projects Observer findings into a test-facing owner/severity vocabulary, and returns run/aggregate reports.

It never answers Manager questions. Every Manager utterance enters real CC:5. It never directly writes Ground Truth or Data Reality, changes MLEVEL/Stage, selects a Scenario for the Manager, approves Decision, starts Execution, scores intelligence, or repairs a finding.

## Journey

`NexoraSimulationTestJourney` contains stable journey/scenario versions, Manager profile, WATCH start, mode, tick/turn budgets, certified disturbance policy, required checkpoints, target surfaces, stop conditions, and declarative publication/turn/capture steps. Forbidden correct-answer keys are rejected recursively. Journeys specify questions and product surfaces, not correct answers.

## Checkpoints

Checkpoints are frozen read-only records. They distinguish Operator observation record IDs from accepted Data Reality publication attempt IDs and capture:

- tick and Manager turn;
- Manager utterance and unmodified Nexora response;
- canonical/conversation subject references and clarification state;
- canonical MLEVEL L1/L2/L3 path IDs;
- Stage active/selected identity, workspace, Director scene intent, and visible identities;
- existing Problem/Scenario availability;
- CC:10 Decision status, CC:11 execution count, and Outcome/Learning projections.

The MLEVEL path is recomposed from the production NMI map and selected canonical ID. No second hierarchy or level model exists. Stage values come from production CC:5 runtime output; no screenshot styling is treated as correctness evidence.

## Observer and findings

RMS:5 remains measurement authority. SIM-TEST only maps its findings into owners `RMS` through `UNKNOWN` and severities S0–S3. A finding records run/journey/scenario identity, tick/turn, bounded Data refs, active subject, MLEVEL/Stage IDs, observed behavior, invariant classification, likely owner, and trace references. `repaired` is always false.

Harness success and observed product success are separate. A valid run can be `harnessStatus: PASS` with `productStatus: FAIL`.

## Modes

- `FAST`: active; Operator → certified RDI/Data Reality.
- `INGESTION`: declared but rejected in SIM-TEST:1. Reserved for SIM-TEST:2; no CSV generator, parser, or Gate was added.

## Determinism and stops

The signature includes Scenario/version, Journey/version, Manager profile, logical ticks/turns, canonical checkpoint projections, and classifications while excluding run-specific IDs. Equivalent deterministic runs produce the same signature.

The loop stops on turn budget, tick budget, S0, runtime error, or explicit journey completion. There are no timers or unbounded Agent loops. S0 detection is evaluated after each scheduled step.

## Report models

Run reports include stable SIM-TEST and referenced RMS identity, simulated start/end, Observer report ref, status separation, stop reason, tick/turn counts, checkpoints, findings/counts, deterministic signature, and explicit no-repair/no-ingestion flags. Aggregate reports summarize journeys, domains, ticks, turns, severities, owners, reproducibility, harness failures, and product findings without a numeric intelligence score.
