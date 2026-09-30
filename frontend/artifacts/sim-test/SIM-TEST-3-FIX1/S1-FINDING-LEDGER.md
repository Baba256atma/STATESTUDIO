# Original SIM-TEST:3 S1 ledger

Original S1 = 10. All on `real-manager-manufacturing-primary`, signature `fnv1a32:b817801d`.

| findingId | turn | symptom | earliest owner | root cause | repair | disposition |
| --- | --- | --- | --- | --- | --- | --- |
| S1-01 | 10 | Stage/L1 stay Capacity after “What about delivery?” | STAGE | Topic switch did not FOCUS Stage | DIR/orchestrator topic-switch FOCUS | REPAIRED_AND_PASS |
| S1-02 | 11 | Stage/L1 still Capacity on deictic follow-up | STAGE | Same stale Stage | Downstream of S1-01 | DOWNSTREAM_OF_REPAIRED_ROOT_CAUSE |
| S1-03 | 12 | Stage/L1 still Capacity | STAGE | Same stale Stage | Downstream of S1-01 | DOWNSTREAM_OF_REPAIRED_ROOT_CAUSE |
| S1-04 | 13 | Stage/L1 stay Capacity after “What about the customer impact?” | STAGE | Second topic switch also skipped DIR FOCUS | Same Stage repair | REPAIRED_AND_PASS |
| S1-05 | 14 | Stage/L1 still Capacity | STAGE | Same stale Stage | Downstream of S1-04 | DOWNSTREAM_OF_REPAIRED_ROOT_CAUSE |
| S1-06 | 15 | Stage/L1 still Capacity on Compare them | STAGE | Stage never left Capacity | Downstream of Stage repair | DOWNSTREAM_OF_REPAIRED_ROOT_CAUSE |
| S1-07 | 15 | Conversation context Capacity vs executive Customer | REFERENT | Compare preserved split after Stage lag | Stage now matches executive; no separate referent store | DOWNSTREAM_OF_REPAIRED_ROOT_CAUSE |
| S1-08 | 16 | “Go back to the capacity problem” not resolved | REFERENT | Collection SHOW rewrite + no named historical return | POST:2 + FINAL:6.2 named return | REPAIRED_AND_PASS |
| S1-09 | 17 | “Has anything changed?” still Customer | REFERENT | Return never restored Capacity | Downstream of S1-08 | DOWNSTREAM_OF_REPAIRED_ROOT_CAUSE |
| S1-10 | 18 | “this” attached to Customer | REFERENT | Deictic after failed return | Downstream of S1-08 | DOWNSTREAM_OF_REPAIRED_ROOT_CAUSE |

MLEVEL L1 lag on turns 10–15 is **DOWNSTREAM_OF_STAGE**. MLEVEL code was not changed.

Observer classifications were not weakened.
