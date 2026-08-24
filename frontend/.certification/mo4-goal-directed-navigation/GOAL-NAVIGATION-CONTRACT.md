# MO:4 — Goal-Directed Executive Navigation

Identity: `MO:4/GoalDirectedExecutiveNavigation`  
Version: `1.0.0`  
Namespace: `nexora.manager-object.goal-directed-navigation`  
Depends on: `MO:1` context + `MO:2` explanation + `MO:3` valid paths  
Presentation: `UX:3`  
Session goal continuity: existing MO session (not a parallel memory)

## Law

```
Goal context → Current position → MO:3 valid paths → MO:4 goal ranking → Manager chooses → MO:1 / Stage
```

Nexora guides. The manager remains the decision authority.

MO:3 answers: where can I explore next from this object?  
MO:4 answers: which valid exploration path best advances the active goal?

## Goal authority

| Source | Meaning | Confirmed? |
| --- | --- | --- |
| explicit | Stated by the manager | yes |
| resolved | Existing CC:7 / registered / associated goal | only if the manager stated it |
| inferred | Suggested by evidence, not confirmed | never |
| unknown | Nexora does not know the desired outcome | no |

INFERRED is never silently promoted to a confirmed manager goal.  
GOAL UNDERSTOOD is not GOAL PERSISTED.

## Safety

Navigate to Decision ≠ Commit Decision  
Navigate to Execution ≠ Start Execution  
Path relevance ≠ causal certainty  
Missing success signal / outcome / numeric gap = UNKNOWN  
No Stage `x / y / z` writes  
No LLM required
