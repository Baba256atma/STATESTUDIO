# CORE-INT:2 — Shared Epistemic & Uncertainty Foundation

Identity: `CORE-INT:2/SharedEpistemicUncertaintyFoundation`  
Claim authority: `EI:3/createExecutiveClaim`  
Confidence authority: `EI:3/SemanticConfidence`  
Frozen MVP: `MVP:1/NexoraManagerMVPReleaseBaseline` **1.2.0**

## Law

Core owns: what kind of claim this is, what supports it, and how certain we are.  
EXI owns: how that truth is explained to the manager.

EXI, Advisor, and Conversation are **readers**. They do not classify independently when a Core claim exists.

## Canonical kinds

| Kind | Meaning | Writer rule |
|---|---|---|
| FACT | Observed/validated truth | Requires evidence + provenance. Missing support becomes UNKNOWN. |
| ASSUMPTION | Used in reasoning, not observed fact | Only from recorded contributor relations or explicit modeled hypothesis. Never from prose. |
| PREDICTION | Possible/expected future | Scenario kind / projected effect. Cannot become FACT downstream. |
| UNKNOWN | Insufficient or unlabeled | Valid intelligence result, not an error. |

## Live path

```
Evidence / Data Reality / recorded model
        ↓
EI:3-compatible Core epistemic contract
        ↓
Live /executive projection
        ↓
EXI (reader)
        ↓
Advisor / Conversation
```

All edges: **CONNECTED**

## What CORE-INT:2 did not do

- No second epistemic engine
- No LLM
- No causal ranking
- No binding-constraint intelligence
- No Priority Intelligence
- EI:4 remains unwired
- EXI:4 not started
- No Stage redesign
- No APP-4 write
