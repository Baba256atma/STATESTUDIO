# NCA:4 — Executive Advisory Reasoning & Recommendation Dialogue

Identity: `NCA:4/ExecutiveAdvisoryReasoningRecommendationDialogueIntelligence` `1.0.0`  
Namespace: `nexora.nca.executive-advisory-reasoning-recommendation-dialogue`  
Live LLM: **false**

NCA:4 is the conversation architecture around existing recommendation intelligence. It does **not** own scoring, Decision, or Execution.

```
NCA:1 need
  → NCA:2 context
  → NCA:3 sufficiency
  → Goal / evidence / EI / NEX-EXP options
  → NCA:4 advisory position
  → recommendation, reasons, trade-offs, confidence, sensitivity
  → dialogue / revision
```

## Advice ≠ Decision ≠ Execution

An advisory position can say “I recommend temporary capacity.” That does not approve a Decision or start Execution.

## Position

`ExecutiveAdvisoryPosition` holds option, strength (`LEAN_TOWARD` | `RECOMMEND` | `STRONGLY_RECOMMEND` | `NO_RECOMMENDATION`), reasons, trade-offs, alternatives (including do-nothing), confidence, sensitivity, and revision status.

## Continuity

The compact snapshot lives on NCA:2 `lastAdvisoryPosition` / `lastRecommendation`. Follow-ups resolve the same position until goal, evidence, or option set changes.

## Boundary

No second recommendation/scenario/decision/trade-off engine, no parallel Advisor, no LLM, no RAG, no NCA:5.
