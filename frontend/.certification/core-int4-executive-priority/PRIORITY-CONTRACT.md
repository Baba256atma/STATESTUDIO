# CORE-INT:4 — Executive Priority Contract

Identity: `CORE-INT:4/ExecutivePriorityIntelligence`  
Epistemic authority: `CORE-INT:2`  
Cause/constraint authority: `CORE-INT:3`  
Factor/comparison reuse: EI:4 `createPriorityFactor` + `resolveExplainablePriority` + `compareExplainablePriorities`  
Trade-off reuse: **none**. `createScenarioPriorityTradeoffTrace` remains unwired.

Frozen MVP: `MVP:1/NexoraManagerMVPReleaseBaseline` **1.2.0**

## Law

**Attention** = notice.  
**Priority** = address this before the competing alternatives because the evidence supports that comparison.

If the evidence cannot distinguish candidates, Core returns:

```
topPriority = null
```

That is a successful intelligence result.

## Eligibility

Problems, Risk, Opportunity, Decisions.

Not ranked: decorative business objects, Scenarios (trade-off), Execution (CC:11 unwired).

## Scope

`workspace` | `problems` | `decisions` | `risks`

No global enterprise ranking.

## Live criteria

| Criterion | Live? |
|---|---|
| Constraint pressure (multi-downstream) | Yes |
| Downstream impact | Yes |
| Evidence confidence | Yes — bounds ranking certainty |
| Recorded risk exposure | Recorded input, **neutral** (does not auto-rank) |
| Attention / severity / urgency / time / strategy / opportunity | Missing or notice-only |

## Numeric score

`numericalScore = null`. No invented 1–100 score.

## Authorities that are not Priority

NBA, Recommendation, Queue id/attention sort, Stage attention, binding constraint, root/primary cause.
