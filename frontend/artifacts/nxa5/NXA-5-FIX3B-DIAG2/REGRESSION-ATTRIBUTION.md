# NXA:5-FIX3B-DIAG2 — Regression attribution

FIX3B uncommitted work was inspected read-only (NCA:2 PRIORITY `extractAnswer`; orchestrator resume when `managerOverrideSemanticUtterance === utterance`; tests B1–B10). **Not modified or reverted.**

| Question | Finding |
| --- | --- |
| Did FIX3B add/broaden a pending-question condition? | Narrowed PRIORITY. Did not add 6.3 FREE_TEXT |
| Interruption precedence? | B9 NCA:2 vs `show decisions` only |
| Arbitrary text satisfy PRIORITY? | No. Satisfy FREE_TEXT? Yes (turn B) |
| Preserve stale comparison? | Comparison inactive on A–C. Stale **6.3** pending yes |
| Change assertion classification? | Not for this utterance |
| Change comparison but not pending? | No |
| Same sequence on pre-FIX3B? | Yes for A/B/C (source still contains those paths) |
| How established? | Diff + executor; no checkout |
| Suite missing interruption case? | Yes: 6.3 pending vs show-execution; `executive` noun; `I am asking of` |
| Why tests passed / live failed? | Covered FIX3B criterion, not this 6.3+NCA:2 split |

Attribution per defect: **PRE_EXISTING** / uncovered gap, **not** FIX3B_REGRESSION. Possible **interaction**: FIX3B certification was blocked by discovering older 6.3/NCA:2 holes during live use.

Not ENVIRONMENT_ONLY. Not insufficient for A/B/C semantics.
