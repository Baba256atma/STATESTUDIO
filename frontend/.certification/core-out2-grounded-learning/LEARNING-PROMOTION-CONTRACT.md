# CORE-OUT:2 — Learning Promotion Contract

Identity: `CORE-OUT:2/GroundedLearningIntelligence` **1.0.0**  
Durable memory authority: `APP-4/ExecutiveMemoryStorageEngine`

## Separation

Candidate creation ≠ promotion eligibility ≠ persistence.

```
CORE-OUT:2 Learning Candidate
      ↓
LearningPromotionAssessment
      ↓
existing APP-4 persist seam
      ↓
Durable historical memory
```

CORE-OUT:2 may determine eligibility. APP-4 remains persistence and storage-validation authority.

CORE-OUT:2 `writesMemory = false`. There is no CORE-OUT memory store, Learning localStorage, or parallel repository.

## Assessment

`LearningPromotionAssessment`

| Field | Meaning |
|---|---|
| `eligible` | True only when status is `supported` and no blocking reason remains |
| `reasons[]` | Explicit, auditable blockers |
| `evidenceStrength` | Copied from the candidate |
| `provenanceComplete` | Provenance refs present |
| `uncertaintyAcceptable` | Uncertainty empty, or eligibility already false |
| `conflictState` | Candidate status |
| `causalSupportRequired` | True for `causal-learning` |
| `causalSupportPresent` | Supported, non-hypothesis, non-conflicting CORE-INT:3 finding with evidence + provenance |
| `repeatability` | Candidate repeatability |
| `promotionClass` | `case-specific` \| `generalized` \| `not-eligible` |
| `memoryAuthority` | always `"APP-4"` |

## Must not promote

- unsupported / inconclusive / contradicted Learning
- conflicting Learning
- missing provenance
- missing Outcome assessment for Outcome Learning
- timing-incomplete Outcome Learning
- prediction-only evidence as causal truth
- Outcome-only evidence as general policy
- presentation-only statements
- recommendation text
- Advisor prose / conversation transcript
- current KPI without the Outcome chain
- execution completion alone
- unsupported causal hypotheses
- stale evidence as generalized Learning
- single-case Learning requested as generalized (`single-case-cannot-generalize`)
- generalized Outcome Learning without `repeated-consistent` **and** causal support

## Case-specific vs generalized

Case-specific may be eligible from one sufficiently grounded Outcome case.

Generalized requires:

- `repeated-consistent` repeatability
- causal support for Outcome Learning
- no conflict
- complete provenance

CORE-OUT:2 will not silently upgrade a single case to a generalized rule.

## APP-4 persist

`promoteGroundedLearningToApp4` calls `persistDurableExecutiveMemory` with:

- `kind: "learning"`
- candidate `learningId` as durable id
- workspace isolation
- subject references to Decision / Execution / Scenario / Issue / observation / Outcome assessment
- provenance from the candidate
- narrative that causal attribution remains unestablished by CORE-OUT:2

Ineligible candidates are rejected before persist.

Duplicate `learningId` → `duplicate-durable-record`. Same evaluation does not create a second APP-4 record.

## APP-4 retrieval

`retrieveHistoricalGroundedLearning` projects APP-4 `category: "learning"` records as:

- historical context
- not current Reality
- not current Outcome
- not current causal truth
- not current recommendation

Source, time, scope, confidence, provenance, and historical status remain visible.

Revision uses APP-4 lifecycle plus CORE-OUT:2 `version` / `previousLearningId`. T1 is not erased when T2 contradicts it.

## Frozen live result

`/executive` currently has no promotion-eligible Learning. That is an honest result, not a missing writer.
