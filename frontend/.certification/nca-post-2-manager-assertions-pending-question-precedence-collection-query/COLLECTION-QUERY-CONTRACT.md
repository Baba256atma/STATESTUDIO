# Collection query contract

`ExecutiveCollectionQuery` is recognized before single-object lookup.

Kinds: PROBLEM, RISK, OPPORTUNITY, SCENARIO, DECISION, EXECUTION, GOAL, KPI, OBJECT, OTHER.  
Scopes: ALL, ACTIVE, OPEN, CURRENT, RELATED, TOP, FILTERED.

Category noun + quantity/scope — not one handler per phrase. `show Capacity Gap` remains a single object. `show all problems` is not an object named All Problems.

Authorities: existing Problem / Risk / Opportunity intelligence, NEX-EXP, Stage registry, Manager Object catalog, Decision/Execution/Goal runtimes. No second collection store.

Empty collection is a valid result (`I don't see any active Risks in the current context`), not an unresolved reference.

Ambiguous `issues` asks whether the manager wants Problems, Risks, or both.

NCA:2 remembers lastCollection / items / kind for deictics (`the first one`, `the other one`, `those`) against the active collection only.
