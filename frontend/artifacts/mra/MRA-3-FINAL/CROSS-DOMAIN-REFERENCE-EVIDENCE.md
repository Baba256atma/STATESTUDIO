# Cross-domain reference evidence

Mandatory sequence after prior MRA:3-FIX2-FIX1.

## Isolated CC:5 (`J4-cross-domain`)

| Step | Expected | Actual |
| --- | --- | --- |
| Scenarios → CSV inventory → `explain it` | CSV | CSV / DATA-ADV |
| CSV → named Capacity Gap → `explain it` | Problem | Capacity Gap |
| Problem → Demand Surge → `tell me more about it` | Scenario | Demand Surge |
| Scenario → `look at Capacity` → `what's going on with that?` | KPI | Clarify problem vs KPI (safe, not a Scenario steal) |
| Unrelated HELP → `explain it` | Clarify if weak | Clarify problem vs KPI |

## Live `/executive` (`live-audit.json` crossDomain)

| Step | Expected | Actual |
| --- | --- | --- |
| Scenarios → CSV → `explain it` | CSV | CSV / DATA-ADV:1 |
| CSV → named Capacity Gap → `explain it` | Problem | **Scenario: Capacity Expansion Plan** |
| Demand Surge → tell me more | Scenario | Demand Surge (related text) |
| Capacity → what's going on with that | KPI or clarify | Clarify problem vs KPI |
| HELP → explain it | Clarify | Clarify |

## Certification impact

Isolated CC:5 is not sufficient. A real manager uses `/executive`. Live Problem follow-up after CSV is an **S1** (MRA-3-FINAL-001). Likely owner: live DATA-ADV early-return vs surviving Scenario collection context. Not patched in this run.
