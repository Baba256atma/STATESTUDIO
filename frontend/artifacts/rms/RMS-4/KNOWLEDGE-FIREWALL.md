# NPA-T RMS:4 — Manager Knowledge firewall

Manager Knowledge plane is `MANAGER_PERCEPTION`.

Allowed sources: Nexora responses, supplied background, prior conversation, manager-visible Stage labels from CC:5 results.

Forbidden: sealed Ground Truth, Observer ledger, hidden Operator state, hidden semantic mappings, expected answers.

`inspectRmsGroundTruth` and `inspectRmsOperatorLedger` reject MANAGER_AGENT.
