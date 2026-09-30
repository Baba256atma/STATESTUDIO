# Finding reclassification

| Finding | Classification |
| --- | --- |
| Manufacturing T88 WRONG/STALE referent | REPAIRED — CC1_INTENT_DEFECT + 6.3 pending capture of explicit named switch |
| Manufacturing T88 Stage Inventory | PASS preserved (FIX7); not used to repair referent |
| Manufacturing T89 ADVISOR_DIVERGENCE (`The first one.` → Capacity Gap while subject Inventory) | INDEPENDENT_ROOT / NEW after T88 commit — Advisor/ordinal, not FIX8-owned switch |
| Manufacturing T92 WRONG_REFERENT | INDEPENDENT_ROOT / STILL_REPRODUCIBLE (`What does the production data show?` → Capacity) |
| Manufacturing T102 ADVISOR_DIVERGENCE | INDEPENDENT_ROOT / STILL_REPRODUCIBLE (not stale T88 referent) |
| Project T18 ADVISOR | INDEPENDENT_ROOT |
| Project T30 WRONG_REFERENT | DOWNSTREAM_RESOLVED (schedule-issue phrasing, not same explicit-switch root) |
| Project T31 ADVISOR | INDEPENDENT_ROOT |
| Project T35 REPEATED_CLARIFICATION | INDEPENDENT_ROOT / STILL_REPRODUCIBLE |
| Logistics T21 WRONG_REFERENT | INDEPENDENT_ROOT |
| Service T17 ADVISOR | INDEPENDENT_ROOT |
| Service T18 REPEATED_CLARIFICATION | INDEPENDENT_ROOT |
| FAST | remains green |
| Impatient | separate S1=5; incomplete commands not magically resolved |
