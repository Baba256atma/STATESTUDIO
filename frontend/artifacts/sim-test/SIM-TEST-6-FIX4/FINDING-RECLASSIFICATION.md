# Finding reclassification

| Finding | Classification |
| --- | --- |
| Manufacturing T71 WRONG_REFERENT | REPAIRED_AND_PASS |
| Manufacturing T88 WRONG/STALE (`Switch to inventory.`) | INDEPENDENT_ROOT / STILL_REPRODUCIBLE |
| Manufacturing T92 WRONG_REFERENT (`What does the production data show?`) | INDEPENDENT_ROOT / STILL_REPRODUCIBLE |
| Logistics T21 WRONG_REFERENT (same production-data utterance class as T92) | INDEPENDENT_ROOT / STILL_REPRODUCIBLE |
| Project T30 WRONG_REFERENT (`Talk about the schedule issue.`) | INDEPENDENT_ROOT / STILL_REPRODUCIBLE |
| Manufacturing T77–T78 PREMATURE_DECISION | INDEPENDENT_ROOT / STILL_REPRODUCIBLE (remeasured; not downstream of T71) |
| Manufacturing T83 REPEATED_CLARIFICATION | INDEPENDENT_ROOT / STILL_REPRODUCIBLE |
| Manufacturing T85–T89 STAGE_DIVERGENCE | INDEPENDENT_ROOT / STILL_REPRODUCIBLE (canonical subject can be correct while Stage diverges) |
| Manufacturing T102 ADVISOR_DIVERGENCE | INDEPENDENT_ROOT / STILL_REPRODUCIBLE |
| Project remaining (T18 Advisor, T31 Advisor, T35 clarification, T40–T41 premature Decision) | INDEPENDENT_ROOT / STILL_REPRODUCIBLE |
| Service T17/T18 | INDEPENDENT_ROOT / STILL_REPRODUCIBLE |
| FAST | remains green S1=0 |
| T50 / T64 / T69 | SAME_ROOT not applicable; regressions PASS |

T88 and T92 were not converted into a broad referent rewrite. `Switch to` is excluded from the bare-issue matcher so FIX3 go-back is preserved. Production-data questions are collection/evidence, not `the {name} issue`.
