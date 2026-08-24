# MO:2 — Generic Explain Engine

Identity: `MO:2/GenericExplainEngine`  
Handoff: `MO:1/ExplainEngineHandoff`  
Presentation: `UX:3` Professional Advisor  
Stage: Object Interaction Authority only — Explain Engine does not write coordinates.

## Law

```
Object + Manager Intent + Object Context + Evidence + Relationships + Executive Intelligence
        ↓
Generic Explain Engine (reader/composer)
        ↓
Executive Explanation + Significance + Evidence + Uncertainty + Relationships + Suggested Questions / Actions
```

Precedence: **Canonical Runtime Truth > MO Context > Explanation > Presentation**

One engine explains any registered executive object. There are no per-object explanation branches.

## Input

MO:1 handoff request:

- object identity and kind
- manager intent (EXPLAIN, STATUS, WHY, RELATIONSHIPS, IMPACT, RISK, OPTIONS, SCENARIO, RECOMMEND, DECIDE, NEXT_ACTION, EXECUTION, OUTCOME)
- explanation focus and depth
- context fields collected from catalog, presentation fixtures, relationship projection, and linked subjects

## Output

`ExecutiveObjectExplanation`:

subject, intent, summary, currentSituation, significance, evidence, relationships, drivers, implications, uncertainty, recommendedNextQuestions, availableActions, epistemicStatus, managerFacingText

Missing information stays explicit. Fields are not manufactured to complete the schema.

## Depth

| Depth | Exposes |
|---|---|
| QUICK | What it is → current situation → why it matters |
| STANDARD | + evidence, relationships, uncertainty, next step |
| DEEP | + drivers, implications, scenario/decision/execution/outcome when already available |

Depth does not create additional truth.

## Epistemic statuses

| Status | Meaning |
|---|---|
| KNOWN | Directly supported by authoritative evidence |
| INFERRED | Derived from recorded relationships/intelligence |
| UNKNOWN | Insufficient evidence — valid result |
| PREDICTED | Forward-looking scenario/prediction path, not a fact |

INFERRED is never promoted to KNOWN. PREDICTED is never presented as fact.

## Causality

A recorded relationship is not a confirmed cause. Confirmed causal language is not emitted from relationship projection alone.

## LLM boundary

Deterministic composer only. A future LLM may improve wording. It must not invent KPI values, states, relationships, causes, risks, scenarios, decisions, or outcomes.

## What MO:2 did not do

- No Stage, Advisor, EI, CC, Data Reality, Decision Runtime, or Execution Runtime redesign
- No MO:3
- No APP-4 write
- No parallel conversation memory
