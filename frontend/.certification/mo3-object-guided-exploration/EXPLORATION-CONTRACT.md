# MO:3 — Object-Guided Executive Exploration

Identity: `MO:3/ObjectGuidedExecutiveExploration`  
Depends on: `MO:1` context + `MO:2` explanation  
Presentation: `UX:3`  
Stage: Object Interaction Authority only

## Law

```
Active Object → MO:1 Context → MO:2 Explanation → MO:3 Paths → Manager chooses → MO:1/Stage navigates
```

Nexora guides. The manager chooses. MO:3 does not own truth, commit decisions, or start execution.

## Path kinds

RELATED_OBJECT · INVESTIGATE · QUESTION · EVIDENCE · RISK · OPPORTUNITY · SCENARIO · COMPARE · RECOMMENDATION · DECISION · EXECUTION · OUTCOME · GOAL

Paths are discovered from existing context and capabilities only.

## Ranking

Deterministic integer priority from: associated problem, goal-token overlap, relationship, scenario/decision/execution availability, missing evidence, severity. Copy never exposes scores.

Manager-facing set: 1 recommended + up to 2 alternatives. Full `availablePaths` remains for inspection.

## Safety

Explore Decision ≠ Commit Decision  
View Execution ≠ Start Execution  
Relationship ≠ confirmed cause  
Missing outcome = UNKNOWN
