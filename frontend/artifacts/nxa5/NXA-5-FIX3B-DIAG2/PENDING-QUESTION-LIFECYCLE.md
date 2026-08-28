# NXA:5-FIX3B-DIAG2 — Pending-question lifecycle

Two stores exist (do not merge in a Fix):

1. **FINAL:6.3 `pendingClarification`** on the manager-object session  
2. **NCA:2 `pendingQuestion`** on conversation state  

FIX3B’s comparison-criterion pending is NCA:2 expected **PRIORITY**. Turns A–C used **6.3 choice** mirrored into NCA:2 as **FREE_TEXT**.

```
show problems
  6.3 pending: none
  NCA:2 pending: none

show all executive
  6.3: ACTIVE choice, loopCount 0, candidates Capacity Gap + Margin Pressure
  NCA:2: ACTIVE FREE_TEXT, purpose advisory-context, same question text
  comparison: inactive

I am asking of Executions
  6.3: still ACTIVE, loopCount 1, same candidates (unmatched; not resume)
  NCA:2: CONSUMED — pending null, lastAnswer FREE_TEXT, answeredMissing advisory-context
  6.3 and NCA:2 now diverge (6.3 still asking; NCA:2 believes answered)

show me execution
  6.3: fail (loopCount would be 2), pending cleared after fail
  NCA:2: lastAnswer still the FREE_TEXT from turn B; pending still null
  NCA:2 did not consume `show…` (isContextualShortAnswer excludes show)
```

D7/D8 FIX3B criterion uses NCA:2 PRIORITY after `which one is important?`. `urgency` is accepted. `show executions` is not accepted as PRIORITY (prefix `show`). Remaining Advisor miss on D7 is **6.3 COMMITMENT**, not NCA:2 PRIORITY consume.
