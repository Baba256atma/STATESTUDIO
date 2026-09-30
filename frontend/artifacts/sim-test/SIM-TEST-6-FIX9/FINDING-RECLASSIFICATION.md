# Finding reclassification

| Finding | Classification |
| --- | --- |
| Manufacturing T89 ADVISOR_DIVERGENCE | REPAIRED — ORDINAL_COLLECTION_LIFETIME_DEFECT (stale lastCollection[0] Capacity Gap) |
| Manufacturing T92 WRONG_REFERENT | INDEPENDENT_ROOT / STILL_REPRODUCIBLE (`What does the production data show?` → Capacity; not ordinal) |
| Manufacturing T102 ADVISOR_DIVERGENCE | SAME_ROOT_REPAIRED / DOWNSTREAM_RESOLVED — `the first decision` no longer binds stale lastCollection; return utterances excluded from ordinal |
| Project T18 ADVISOR | INDEPENDENT_ROOT |
| Project T31 ADVISOR | DOWNSTREAM_RESOLVED of ordinal/collection lifetime (not bundled as FIX9-owned Manufacturing T89) |
| Project T35 REPEATED_CLARIFICATION | INDEPENDENT_ROOT / STILL_REPRODUCIBLE |
| Logistics T21 WRONG_REFERENT | INDEPENDENT_ROOT |
| Service T17 ADVISOR | INDEPENDENT_ROOT |
| Service T18 REPEATED_CLARIFICATION | INDEPENDENT_ROOT |
| FAST | remains green |
| Impatient | separate S1=5 |
