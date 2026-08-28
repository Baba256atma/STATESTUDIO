# NXA:5-FIX3B-DIAG2 — Exact full-conversation reproduction

Identity: `NXA:5-FIX3B-DIAG2/FullConversation`

Machine traces: `full-conversation-traces.json`  
Live: `live-stage.json`

## Sequence (executor; live Advisor text matches except `Nexora` prefix on the bubble)

### hi
- CC:1 `greet` → ACKNOWLEDGE → DIR NO_CHANGE → overview
- Advisor: `Hi. I’m ready.`

### show problems
- CC:1 `show-problems` → POST:3 PROBLEM ALL → DIR SHOW_COLLECTION
- Advisor: `Current Problems: Capacity Gap, Margin Pressure.`
- Stage: collection / problem / 2 members / Queue `Problems · 2`
- Pending: none

### show all executive  (Turn A)
- Normalized: `show all executive`
- CC:1 `focus`, hint `all executive`
- NLU: FOCUS, REQUEST_FOCUS, missing-referent, candidates []
- Collection query: null
- 6.3: clarify, `MISSING_SUBJECT`, candidates Margin Pressure + Capacity Gap (kind problem), loopCount 0
- NCA:2 pending mirrors question, expected **FREE_TEXT**
- DIR NO_CHANGE; Stage stays Problems
- Advisor: `Do you mean Margin Pressure or Capacity Gap?`
- First divergence: CC:1 did not select `show-execution`; 6.3 filled Problems members

### I am asking of Executions  (Turn B)
- Normalized: `i am asking of executions`
- CC:1 `unknown`; NLU NONE/UNKNOWN; collection query null
- wouldNca2ConsumeAsShortAnswer: **true**
- 6.3: still clarify, loopCount 1, same Problem candidates
- NCA:2: ANSWER_NEXORA; pending cleared; lastAnswer FREE_TEXT; answeredMissing `advisory-context`
- Observations: [] (unchanged)
- Trusted claims: unchanged
- DIR NO_CHANGE; shouldCommit false; Stage stays Problems
- Advisor (exact): `That helps. It strengthens the capacity-pressure hypothesis. It strengthens the case for investigating capacity, without treating capacity as a confirmed cause.`
- First divergence: NCA:2 FREE_TEXT consumption + unlocked composer (6.3 did not match Executions; `isCorrection` never reached)

### show me execution  (Turn C)
- Normalized: `show me execution`
- CC:1 `show-execution`; POST:2 EXECUTION ALL
- 6.3: **fail**, question `I'm not sure which issue you mean. Name the one you want to investigate.`
- pendingClarification after: null
- lastCollection EXECUTION Capacity Expansion, Pricing Rollout (`NCA-POST:3_CANONICAL_COLLECTION`)
- DIR SHOW_COLLECTION `explicit-canonical-collection-request`; shouldCommit **true**
- Live Stage: collection / execution / visible 2 / Queue `Executions · 2`
- Advisor: fail sentence (does not list Executions)
- First divergence: 6.3 pending `ask()` loopCount≥2; Advisor/Stage split at `shouldCommitRuntime || directorPlan.mutationRequired`
