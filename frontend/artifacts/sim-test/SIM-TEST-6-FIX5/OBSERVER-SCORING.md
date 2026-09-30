# Observer scoring

**Does Observer score Decision presence or Decision creation?**  
Before FIX5: presence. Any EXPLORE_OPTIONS/COMPARE observation with `decisionId` set was PREMATURE_DECISION.

**What triggered PREMATURE_DECISION at T77–T78?**  
`observation.decisionId` still held the T13 Decision while manager explored/compared.

**Was a Decision actually written at T77/T78?**  
No. Count 1→1. Same ID. `newDecisionIds` empty. `decisionStatus` null.

**Was an existing Decision merely visible?**  
Yes.

**Was comparison incorrectly interpreted as commitment?**  
Observer treated comparison-with-visible-Decision as premature commitment. Production comparison text did not commit.

**Was the expectation itself wrong?**  
The SIM-TEST:5 unit that COMPARE+decisionId **without a prior COMMIT event** is still valid. FIX5 keeps that. The long-session expectation that post-Decision comparison requires Decision absence was wrong.

After FIX5:

- write during explore/compare → PREMATURE_DECISION
- Decision present on explore/compare with no prior COMMIT event → PREMATURE_DECISION
- already-committed Decision visible during later explore/compare, count unchanged → no finding
