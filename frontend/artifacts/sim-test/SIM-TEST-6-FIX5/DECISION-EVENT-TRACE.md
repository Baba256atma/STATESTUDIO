# Decision event trace

T13 `Let's go with option B.`  
Manager → COMMIT_DECISION → CC:10 applied → Decision count 0→1 → ID do-nothing. CORRECT. Event: Decision written.

T17 `Start it.`  
CC:11 starts Execution 0→1. CORRECT.

T77 `Show me the alternatives again.`  
Manager → EXPLORE_OPTIONS → scenario revisit / collection prompt (`Which one do you want me to show?`) → CC:10 **not written** → Decision 1→1 same ID. CORRECT production.  
Observer pre-repair: PREMATURE_DECISION. **DIVERGES_HERE** (scoring presence vs event).  
CC:11: no new Execution. CORRECT.

T78 `Compare those options without changing the decision.`  
Manager → COMPARE → comparison response listing candidates, “not a Decision commitment” semantics → CC:10 **not written** → 1→1. CORRECT production.  
Observer pre-repair: same PREMATURE rule. SAME_ROOT as T77.  
Post-repair: no finding. CORRECT.

T79 `Walk me through option A again.`  
FOLLOW_UP / explanation. No Decision event. CORRECT.
