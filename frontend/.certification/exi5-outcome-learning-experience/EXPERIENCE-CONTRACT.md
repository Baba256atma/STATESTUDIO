# EXI:5 — Experience Contract

Identity: `EXI:5/OutcomeLearningExperience` **1.0.0**

Projection type: `ExecutiveOutcomeLearningExperience`

This is a read model. It is **not** an Outcome store, Learning store, or memory store.

## Fields (manager-facing)

| Field | Source | Manager meaning |
|---|---|---|
| `expectedOutcome` | CORE-OUT:1 expected statement | What did we expect? |
| `actualOutcome` | CORE-OUT:1 actual / honest empty | What was observed? |
| `outcomeAssessment` | `presentOutcomeAssessment` | Did Actual meet Expected? |
| `observationStatus` | CORE-OUT:1 + execution grammar | pending / reality-only / execution-complete / observed / stale / conflicting / partial |
| `learningCandidates[]` | CORE-OUT:2 candidates | What can we legitimately learn? |
| `promotedLearning[]` | CORE-OUT:2 promotion-eligible | Eligible Learning only |
| `historicalLearning[]` | APP-4 retrieval | Past context, not current truth |
| `uncertainty` / `confidenceStatement` | CORE-OUT:2 evidenceStrength + CORE-OUT:1 freshness/partial | How strong is the evidence? |
| `causalStatus` / `causalStatement` | CORE-OUT:2 causal-learning + CORE-INT:3 `presentProvenAnswer` | Do we know why? |
| `pendingReasons[]` | missing Actual, missing evidence, unestablished causality | Why the empty/pending state exists |

## Hard rules

- EXI:5 never calculates Outcome independently.
- EXI:5 never creates Learning.
- Causal language is allowed only when CORE-OUT:2 has a supported, promotion-eligible `causal-learning` candidate (which itself requires CORE-INT:3).
- Historical APP-4 Learning cannot override live Core / Reality.
- Advisor and Conversation text are presentation, not evidence.
