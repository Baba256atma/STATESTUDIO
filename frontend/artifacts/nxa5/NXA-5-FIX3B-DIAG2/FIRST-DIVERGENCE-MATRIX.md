# NXA:5-FIX3B-DIAG2 — First-divergence matrix

Authority path used (no new map):  
Input → normalize → CC:1 → canonical refs → subject/collection → 6.3 pending → NCA:2 assertion/correction → POST/NCA → writers → CC:5/Advisor → DIR → Stage

| Defect | First point of departure | Owner |
| --- | --- | --- |
| A `show all executive` | CC:1 `focus` not `show-execution`; 6.3 MISSING_SUBJECT fills Problems members | CC:1 + FINAL:6.3 |
| B correction | NCA:2 FREE_TEXT short-answer + unlocked `composeNca2ContinuityResponse` (6.3 pending prevented `isCorrection`) | NCA:2 + orchestrator lock |
| False hypothesis copy | same as B, composer branch | NCA:2 |
| Evidence store | **no departure** (stores held) | — |
| C `show me execution` Advisor | 6.3 `isNewCompleteRequest` false → fail loop | FINAL:6.3 |
| C Stage vs Advisor | `finish` `shouldCommit \|\| mutationRequired` | orchestrator |
| D1–D3 Advisor | `clarificationConsequence` treats `show-execution` as COMMITMENT | FINAL:6.3 gate |
| D4 | unresolved `All Executive` (expected-ish for unknown noun; not Executions) | CC:1/POST:2 |
| D6 | same first layer as B | NCA:2 |
| D7 Advisor | COMMITMENT + leftover Problem candidates | FINAL:6.3 |
| D8 | none (FIX3B works) | — |
| D9 | none for genuine evidence | — |
| D10 | none (FIX3A) | — |
