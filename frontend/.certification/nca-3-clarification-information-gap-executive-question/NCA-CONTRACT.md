# NCA:3 — Clarification, Information-Gap & Executive Question Intelligence

Identity: `NCA:3/ClarificationInformationGapExecutiveQuestionIntelligence` `1.0.0`  
Namespace: `nexora.nca.clarification-information-gap-executive-question`  
Live LLM: **false**

NCA:3 ranks **whether missing information is worth asking**. It does **not** own evidence, uncertainty, Goal, Decision, Execution, or a survey engine.

```
NCA:1 Manager Need + knowledge sufficiency
      ↓
NCA:2 topic / pending question / thread
      ↓
Required information for this need × subject × goal × stage
      ↓
Available information (RDI / Goal / conversation / manager answers)
      ↓
Information gaps
      ↓
Materiality + question value
      ↓
ASK | ANSWER | PARTIAL_ANSWER
      ↓
At most one primary question
      ↓
Manager answer via NCA:2 ANSWER_NEXORA
      ↓
Recompute remaining gaps
      ↓
Stop when advice is useful under remaining uncertainty
```

## Gap vs worth asking

Missing information is not automatically a question. A gap is asked only when it is `OPEN`, not already in Nexora, not an external-only lookup, `questionValue >= 0.24`, and could change conclusion, recommendation, or confidence.

## Question value

`questionValue ≈ (relevanceToDecision/100) × (relevanceToNeed/100) × knownFactor × answerability − 0.16`

Highest-value open gap wins. Lower-value gaps (labor, budget cap) stay unasked on the same turn.

## Sufficiency

Reuses NCA:1 `knowledgeState` and overlays `INSUFFICIENT | PARTIALLY_SUFFICIENT | SUFFICIENT_WITH_UNCERTAINTY | SUFFICIENT`.

## Pending questions

Questions register through NCA:2 `pendingQuestion`. NCA:3 does not keep a parallel queue.

## Boundary

No second evidence store, uncertainty system, goal/decision model, business-question engine, survey framework, web/RAG, SQL, LLM, or NCA:4.
