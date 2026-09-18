# NPA-T RMS:3 — Observer visibility

`inspectRmsOperatorLedger` is Observer-only and read-only (`writeAttempted: false`).

Observer may inspect Ground Truth, Operator actions, generated observations, and publication attempts (accepted/rejected via `handoff.ready`).

Observer cannot run observation or publication. Manager Agent and Nexora cannot inspect the Operator ledger or the permitted operational view.
