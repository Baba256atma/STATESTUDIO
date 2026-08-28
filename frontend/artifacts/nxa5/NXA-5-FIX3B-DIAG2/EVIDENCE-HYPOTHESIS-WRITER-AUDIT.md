# NXA:5-FIX3B-DIAG2 — Evidence / hypothesis writer audit

Turn B writer path:

1. 6.3 `finish(status: clarification-required, preservePresentedResponse: true)` — **no** `lockPresentedResponse`
2. `composeNca2ContinuityResponse` with `locked: false`, move ANSWER_NEXORA, answer.kind FREE_TEXT  
   Hard-coded: `That helps. It strengthens the capacity-pressure hypothesis.`  
   File: `nexoraNca2ConversationState.ts` `composeNca2ContinuityResponse`
3. `composeTrustedExecutiveCommunication` — claims sampled in the audit are **pre-existing Margin Pressure** explain/trust claims, **not** a new capacity-pressure evidence record keyed to the utterance
4. Orchestrator observation writer: skipped (NLU not OBSERVE/SUPPLY_INFORMATION; assertion regex does not match)
5. POST:2 collection query: null — no Executions write
6. Investigation thread: null — no investigation conclusion writer

**No evidence identifier created.**  
**No hypothesis confidence bump in store.**  
**False claim is presentation/reasoning copy plus NCA:2 lastAnswer.**

D9 contrast: intent `evidence`, percent payload, different composer branch (`That ${display} increase…`). That is the legitimate assertion path; leave it in place.
