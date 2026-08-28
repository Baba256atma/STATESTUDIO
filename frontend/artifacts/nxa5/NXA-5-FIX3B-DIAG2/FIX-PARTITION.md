# NXA:5-FIX3B-DIAG2 — Fix partition recommendation

**Number of Fix prompts: 3**  
Do not implement in DIAG2. Do not write full Fix prompts beyond this skeleton.

Shared owner ⇒ grouped. Different first layer / store ⇒ split.

## NXA:5-FIX3B-FIX1 — Meta-Correction & False Assertion Prevention

- **Root cause:** NCA:2 treats incompatible FREE_TEXT as ANSWER_NEXORA; clarify finish does not lock NCA:2; capacity-pressure copy is hard-coded for that move
- **Owner:** NCA:2 (`isContextualShortAnswer`, `inferExpectedInformation` vs 6.3 expected `choice`, `composeNca2ContinuityResponse`) + orchestrator `lockPresentedResponse` on 6.3 clarify
- **Permitted layers:** those two. Consume existing collection/reference authorities; do not own Stage
- **Forbidden:** hard-code Executions phrases; remove assertion handling; hide the sentence only; second evidence authority
- **Focused regressions:** turn B; D6; lock so 6.3 re-ask is not overwritten; D9 still percent evidence
- **Neighbors:** FINAL:6.3 pending (read); NCA:6 already locks on `clarify` (too late vs NCA:2)
- **Funnel:** L1–L3 after focused tests; live turn B
- **Live:** `show problems` → `show all executive` → `I am asking of Executions` must not claim hypothesis strengthening
- **Stop:** those conversations + D9 control; no FIX3B cert in FIX1 alone if C/A remain

## NXA:5-FIX3B-FIX2 — Explicit Collection Command Pending-State Escape

- **Root cause:** 6.3 pending consumes `show-execution`; `isNewCompleteRequest` requires objectReference+FOCUS/EXPLAIN/COMPARE/INVESTIGATE; fail copy vs DIR commit OR
- **Owner:** FINAL:6.3 resolver + orchestrator shouldCommit on fail/clarify
- **Permitted:** 6.3 complete-request policy; cancel/escape pending on explicit collection intents already in CC:1; align Advisor with DIR without DIR compensating
- **Forbidden:** destroy all pending on any utterance; DIR-only workaround; second pending store
- **Focused:** full sequence turn C; 6.3 pending + `show me execution` / `show executions`
- **Neighbors:** POST:3 collection (already works); FIX3B B9 (keep)
- **Funnel:** L1–L3; live turn C Advisor **and** Stage Executions **same** members
- **Stop:** Advisor lists Current Executions; no fail sentence; Stage already does this

## NXA:5-FIX3B-FIX3 — Relevant Clarification & show-execution ≠ COMMITMENT

- **Root cause:** `executive` not in collection nouns; 6.3 candidates from Problems; `clarificationConsequence` maps `show-execution` to COMMITMENT (`Which decision do you want to approve?`); KIND_LABEL object→KPI for mixed kinds
- **Owner:** CC:1/POST:2 noun lists + FINAL:6.3 gate/composer
- **Permitted:** generic collection vocabulary; candidate set from current utterance + workspace collections/overview
- **Forbidden:** map every `executive` to Executions; new collection resolver; Problem/KPI without evidence
- **Focused:** D4 vs D5; D1–D3 Advisor collection copy; optional mixed-kind KIND_LABEL
- **Neighbors:** POST:3 SHOW_COLLECTION (keep)
- **Funnel:** L1–L3; live D4/D5/D1
- **Stop:** after Problems, `show all executive` must not ask only Problem names unless those are proven referents; `show executions` Advisor matches Stage

FIX3B certification **after** these repairs (or a later resume task), not now.
