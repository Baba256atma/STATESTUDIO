# NPA-T RMS:4 — Observer visibility

`inspectRmsManagerConversation` is Observer-only.

Observer sees objective, profile, Manager Knowledge, intent, utterance, Nexora response, classifications, turn count, and Ground Truth for comparison.

Observer cannot run Manager turns. Observer does not feed Ground Truth into Manager or Nexora (`fedGroundTruthToManager: false`).
