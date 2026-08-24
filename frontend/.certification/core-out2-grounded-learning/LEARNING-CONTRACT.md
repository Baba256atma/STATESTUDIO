# CORE-OUT:2 — Grounded Learning Intelligence Contract

Identity: `CORE-OUT:2/GroundedLearningIntelligence` **1.0.0**  
Namespace: `nexora.core.grounded-learning-intelligence`  
Frozen MVP: `MVP:1/NexoraManagerMVPReleaseBaseline` **1.2.0**

## Authority

CORE-OUT:2 owns:

- Learning interpretation
- Learning eligibility
- Learning candidate creation
- Learning promotion **decision contract**

CORE-OUT:2 does **not** own:

- Data Reality
- Observation capture (CORE-OUT:1A)
- Outcome evaluation (CORE-OUT:1)
- Causal / constraint interpretation (CORE-INT:3)
- Epistemic kinds (CORE-INT:2)
- Decision truth
- Execution truth
- Priority / trade-off
- Recommendation
- Presentation
- Durable-memory storage (APP-4)

## Four epistemic claims

These are never collapsed:

1. “I observed Y.” — Data Reality / CORE-OUT:1A
2. “Y satisfied expected Outcome X.” — CORE-OUT:1
3. “Evidence suggests we learned Z.” — CORE-OUT:2
4. “X caused Y.” — CORE-INT:3 only

**Outcome ≠ Learning.**

## Canonical input path

```
CORE-OUT:1A → CORE-OUT:1 → CORE-OUT:2
```

Forbidden:

```
current KPI → CORE-OUT:2
```

CORE-OUT:2 consumes only canonical CORE-OUT:1 assessments. It does not re-evaluate expected vs actual, choose among conflicting observations, or bypass CORE-OUT:1A.

## Candidate

`GroundedLearningCandidate`

| Field | Rule |
|---|---|
| `learningId` | `learn:{workspace}:{subject}:{type}:{scope}:{fingerprint}` — evidence-context identity, not statement text |
| `version` / `previousLearningId` | Revision chain; historical candidates are not overwritten |
| `learningType` | `outcome-learning` \| `assumption-learning` \| `constraint-learning` \| `causal-learning` \| `process-learning` \| `prediction-learning` |
| `status` | `candidate` \| `supported` \| `inconclusive` \| `contradicted` \| `conflicting` |
| `scope` | `case-specific` \| `generalized` |
| `repeatability` | `single-case` \| `repeated-consistent` \| `repeated-mixed` \| `insufficient-history` |
| `confidence` | Weakest important evidence; never raised by success, execution completion, or reference count |
| `evidenceStrength` | `unknown` / `weak` / `moderate` / `strong` from status, freshness, partiality, provenance, repeatability |
| `freshness` | Stale evidence remains stale |
| `promotionEligibility` | `promotion-eligible` \| `not-promotion-eligible` |
| `establishesCausation` | always `false` — CORE-OUT:2 never establishes causality |
| `recommendsAction` | always `false` |
| `isCurrentTruth` | always `false` |

Observation validity is not Learning validity. Status is never `validated` because an observation was valid.

## Identity

Repeated evaluation of the same canonical evidence returns the same `learningId`. New meaningful evidence creates a new version with `previousLearningId`. Statement text, array index, and current KPI value are not identities.

Workspace is part of identity. Workspace A never becomes Workspace B Learning.

## Provenance

Promotable Learning must reference:

- Outcome assessment
- Outcome observations
- expected Outcome
- relevant subject

Causal Learning additionally requires CORE-INT:3 `CoreInt3CausalFinding` with evidence and provenance.

No provenance → not promotable.

## Outcome → Learning

A ready CORE-OUT:1 assessment may produce **case-specific** `outcome-learning`:

> In this Decision context, the validated Outcome {comparison} relative to the recorded expectation; causal attribution remains unestablished.

Unknown / insufficient / timing-incomplete / conflicting CORE-OUT:1 results do not invent a positive or negative lesson. They may produce an explicitly bounded inconclusive candidate. That candidate is not policy.

A single success:

- may support case-specific Learning
- does **not** support generalized policy, causal law, or “repeat this Decision”

A single miss does **not** mean “bad Decision.”

## Type rules

| Type | Allowed when | Forbidden when |
|---|---|---|
| `outcome-learning` | Canonical CORE-OUT:1 ready assessment | Current KPI, expected-only, observation-without-evaluation |
| `causal-learning` | Explicit supported CORE-INT:3 finding + Outcome context | Temporal sequence, Outcome success alone, unsupported hypothesis |
| `constraint-learning` | CORE-INT:3 constraint finding with evidence | Invented constraints |
| `assumption-learning` | Deterministic assumption ↔ expected observation ↔ actual evidence | Semantic similarity |
| `prediction-learning` | Prediction match/miss vs Actual under an evaluation rule | Treating accuracy as causal correctness |
| `process-learning` | Explicit process rule **and** execution complete **and** ready Outcome | Execution completion alone |

## Confidence, conflict, freshness

- Confidence is bounded by the weakest important evidence.
- Conflicting Outcome, causal, or Learning evidence is preserved. Status remains `conflicting`. Conflicting Learning is not promotion-eligible.
- Stale Outcome evidence remains stale in provenance. Historical Learning may cite it; freshness stays visible.
- Partial evidence bounds confidence and evidence strength.

## Safety

- No LLM
- No EXI:5
- No Stage mutation
- No Decision / Execution / Outcome / observation mutation
- No shadow durable store
- No recommendation authority
- No automatic policy generation

Live `/executive` with insufficient longitudinal Outcome evidence correctly has **0** promotable Learning records.
