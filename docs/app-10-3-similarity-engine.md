# APP-10:3 — Similarity Engine

## Purpose

APP-10:3 implements a **deterministic Similarity Engine** that compares new or existing scenarios against completed historical scenarios and extracted executive patterns.

It answers: **"Have we seen something like this before?"**

No ML, embeddings, vector search, clustering, recommendations, or forecasting.

## Architectural position

```
APP-10/1 Foundation
       │
       ▼
APP-10/2 Pattern Extraction Engine
       │
       ▼
APP-10/3 Similarity Engine  ← this phase
       │
       ▼
APP-10/4 Outcome Learning Engine (future)
```

## Similarity dimensions

| Dimension | Weight |
|-----------|--------|
| Strategy chain | 30% |
| KPI direction | 20% |
| Risk profile | 20% |
| Business goal | 15% |
| Timeline phase | 10% |
| Workspace domain | 5% |

Additional explainability dimensions (object types, decision type, outcome type, pattern category) are reported with zero weight.

## Scoring method

`deterministic_weighted_rules` — exact and partial strategy-chain matching plus exact metadata matches. Fully reproducible. No probabilistic logic.

## Explanation model

Every result includes:

- Why it matched
- Which dimensions matched / did not match
- Contributing historical scenarios
- Contributing extracted patterns
- Final deterministic score

## Public API

- `compareScenarioSimilarity()`
- `compareScenarioToPatterns()`
- `validateSimilarityResult()`
- `registerSimilarityResult()`
- `getSimilarityResults()`
- `initializeSimilarityEngine()`
- `runSimilarityEngineCertification()`
- `SimilarityEngine` namespace

## Constraints

- Does **not** modify APP-10:1, APP-10:2, or prior APP platforms
- Consumer-only — certified contracts only
- All outputs immutable with complete evidence and explanation

## Next phase

When APP-10:3 passes certification, proceed to **APP-10:4 — Outcome Learning Engine**.
