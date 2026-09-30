# Clarification trace

## Pre-repair (SIM-TEST:5 evidence)

T13 “Let's go with option B.” → CC:10 `clarification-required` because `candidateScenarioIds.length === 0`.  
T14 “Yes, make that the decision.” → FINAL:6.3 / meaning path asked Capacity Gap vs Capacity. Intent COMMIT was lost; subject nouns replaced the option referent.

That clarification was **not** genuine multi-target option ambiguity. The option identity had already been spoken (`option B`) and the collection had existed at T10–T11.

## Post-repair

T13 does not ask “Which option?”.  
T14 is `already-committed` (same Decision id). Capacity Gap vs Capacity does **not** recur on that confirmation.

## Genuine clarification still required (not disabled)

- “Use that option.” with multiple candidates and no active scenario → `clarification-required`, Decision count 0.
- “Use option Z.” / “Choose option C.” when C is out of range → no fuzzy map, Decision count 0.
- Unknown named Resource / Schedule / Supplier returns remain clarification (SIM-TEST:4-FIX1 tests green).
- Manufacturing T28 “I'm not sure which issue you mean” remains (independent later navigation).
