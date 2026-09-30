# Conversation / CC:5 repair evidence

Trace for `Go back to the supplier problem.`:

manager utterance → POST:2 (named go-back is not collection SHOW) → FINAL:6.1 (kind token `problem` is not fuzzy-matched onto another Problem) → FINAL:6.2 previous-referent (no supplier identity) → FINAL:6.3 clarification required → CC:5 does not rewrite `Focus on Margin Pressure` and does not topic-switch from NLU/primary fallthrough.

Known vs unknown:

- Known: `Go back to the capacity problem.` restores Capacity Gap / Capacity from session history.
- Unknown: supplier/resources/schedule do not invent Objects and do not pick nearest Problem.

Similarity must not override identity: edit-distance / registered-reference recovery skips kind tokens (`problem`, `issue`, …).

Failed named return preserves last legitimate subject (`obj-delivery` at manufacturing turn 30).
