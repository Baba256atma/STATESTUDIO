# Scenario / commitment boundary (existing product)

These are observed certified semantics, not a new revision architecture.

| Move | Commits Decision? |
| --- | --- |
| Scenario discussion / show alternatives | No |
| Comparison | No |
| Option mention (`What was option B?`, `Walk me through option A`) | No |
| Preference (`Maybe B`, `Let's look at B`) | No (unless existing commitment matcher fires) |
| Explicit selection (`Let's go with option B.`) | Yes — reaches CC:10 (SIM-TEST:5-FIX1) |
| Confirmation (`Yes, make that the decision.`) | already-committed if Decision exists |
| Negative confirmation (`Don't commit yet`) | No |
| Decision query / explanation | No |
| Post-Decision scenario revisit / comparison | No; collection may persist |

Scenario candidate ≠ Decision until CC:10 applies.  
Decision ≠ Execution (CC:11).  
FIX5 does not add Decision-revision lock or scenario deletion.
