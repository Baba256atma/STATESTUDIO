# SIM-TEST:5-FIX2 — truth boundary

Mandatory:

- Ground Truth → Advisor direct = NO
- Ground Truth → Evidence direct = NO
- Ground Truth → Outcome direct = NO

Observer may compare raw CSV, Data Reality, Ground Truth, and Advisor response. Advisor does not inherit Observer visibility.

| Check | Result |
| --- | --- |
| Knowledge-leak S0 (manager firewall / hidden cause) | 0 on manufacturing, project, logistics, service, FAST |
| Advisor cites leftover Production.csv on logistics/service | FAIL before store reset; PASS after |
| Advisor cites Manufacturing Production.csv when ingested | PASS |
| Future CSV version visible early | T4 still v1; v2 at tick 7; v3 at tick 21 |
| Early Outcome claimed success | manufacturing ASK_OUTCOME remains non-success; Learning not created for evidence testing |
| Unexecuted scenario as observed Outcome | not claimed |
| Learning | remains NOT_APPLICABLE until Outcome/Learning authority allows |

No Action Decision is not treated as proven cause of later metric movement. Hidden RMS disturbances are not Advisor evidence.
