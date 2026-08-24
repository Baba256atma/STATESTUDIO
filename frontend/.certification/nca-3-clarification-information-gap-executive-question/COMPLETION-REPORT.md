# NCA:3 Completion Report

## Verdict

**NCA:3 = CERTIFIED**

Identity: `NCA:3/ClarificationInformationGapExecutiveQuestionIntelligence` `1.0.0`  
Namespace: `nexora.nca.clarification-information-gap-executive-question`  
Live LLM: **false**

NCA:4 was not started.

---

1. **Files inspected:** NCA:1 architecture/types/tests; NCA:2 state/types/tests; CC:5 orchestrator/`conversationalExperience`; FINAL:6.1–6.6; MO:1–6; EI/EXI readers; NEX-EXP:1–7; Data Reality presentation fixtures (`primaryKpi`); Goal/Decision/Execution readers; Stage/Chat/Advisor shell; NCA:1 and NCA:2 certification packages.
2. **Files created:** `nexoraNca3QuestionIntelligenceTypes.ts`, `nexoraNca3QuestionIntelligence.ts`, `nexoraNca3QuestionIntelligence.test.ts`, `scripts/nca-3-clarification-information-gap-executive-question-certify.mjs`, `.certification/nca-3-clarification-information-gap-executive-question/*`.
3. **Files modified:** `conversationalExperienceOrchestrator.ts` (NCA:3 after NCA:2 overlay; one-question seed; follow-up only when the presented reply still asks); `conversationalExperience.ts` (`nca3Strategy` + trace); `manager-object/index.ts`; `NexoraExecutiveShell.tsx` (`data-nca3-*`).
4. **Existing authorities reused:** NCA:1 need/reference/knowledge/advisor behavior; NCA:2 pending questions, threads, `ANSWER_NEXORA`, correction; RDI/presentation KPI+target; Goal context; CC conversation continuity; MO explain/navigation; EI/EXP; Decision/Execution confirmation unchanged. No second evidence, uncertainty, goal, decision, or survey system.
5. **Information-gap contract:** `ExecutiveInformationGap` in `nexoraNca3QuestionIntelligenceTypes.ts` — category, purpose, expected information, relevance, impact flags, source availability, status.
6. **Gap categories:** `INFORMATION_GAP_CATEGORIES` (MISSING_FACT, TIMEFRAME, TARGET, BASELINE, CONSTRAINT, CAUSAL_EVIDENCE, COST, RESOURCE, CAPACITY, PRIORITY, MANAGER_PREFERENCE, RISK_TOLERANCE, OPTION_DETAIL, ASSUMPTION, EXTERNAL_EVIDENCE, CONFIRMATION, AMBIGUOUS_REFERENCE, AMBIGUOUS_OBJECTIVE). Instantiated only for the active need.
7. **Need-dependent requirement model:** `deriveGaps` from NCA:1 need family + utterance class (status, lasting decision, causal why, preference tradeoff, performance judgement, external lookup) + `Nca3KnownFacts` from KPI/target/goal/prior answers. No universal required-fact checklist.
8. **Materiality model:** open + not already in Nexora + not external-only + could change conclusion/recommendation/confidence + `questionValue >= 0.24`.
9. **Question-value model:** decision relevance × need relevance × known-factor × answerability − interaction cost (0.16). Ranked descending; one winner.
10. **Question strategy:** `ExecutiveQuestionStrategy` — `shouldAsk`, mode ASK / ANSWER / PARTIAL_ANSWER, gap, purpose, question, expectedInformation, reason, fallbackIfUnknown, `recomputeAfterAnswer: true`.
11. **One-high-value-question enforcement:** ASK mode returns only the selected question; PARTIAL_ANSWER appends at most one `?`; lasting-capacity labor/budget gaps are lower value and not asked on the same turn.
12. **Question sequencing:** no pre-scripted tree. After an answer, gaps are derived again from updated facts/conversation.
13. **Dynamic recomputation:** orchestrator evaluates NCA:3 every turn from current NCA:1 + NCA:2 state; seasonal/temporary demand marks persistence RESOLVED and switches to ANSWER.
14. **Sufficiency states:** INSUFFICIENT, PARTIALLY_SUFFICIENT, SUFFICIENT_WITH_UNCERTAINTY, SUFFICIENT overlaying NCA:1 `knowledgeState.sufficient`.
15. **Stop-asking rule:** when no material gap remains, `shouldAsk` is false; questions are not stripped from 6.5/NCA:2 investigation unless unknown/decline/temporary handling applies; follow-up pending is registered only if the presented text still contains `?`.
16. **Ask vs Answer vs Partial-Answer:** status+KPI → ANSWER; lasting capacity without persistence → ASK; causal why with evidence → PARTIAL_ANSWER (keep existing explain, append one evidence question). TEACH/NAVIGATE/INVESTIGATE/CLARIFY/ACKNOWLEDGE/DEFER behaviors are preserved when NCA:3 is not in ASK mode.
17. **Existing-data reuse proof:** units A/F and live “What does Delivery show?” — `hasCurrentKpi` from presentation fixtures; no request for current Delivery value.
18. **Manager-known vs system-known:** KPI/target/goal read from Nexora; demand persistence and preference asked only when the manager is the likely source.
19. **External-gap behavior:** supplier lookup (not “Supplier delays…” reports) marked `externalSourceRequired`; manager-facing refusal to invent availability (unit O).
20. **Goal-aware question proof:** persistence question is framed as needed before a lasting capacity recommendation; preference skipped when `goalProtectsDelivery` (unit I).
21. **Manager preference proof:** units H/I — explicit cost-vs-speed language only; not every COMPARE need.
22. **Risk/constraint question proof:** lasting-decision labor/budget gaps exist but lose ranking to persistence; unit Q asks the critical constraint first.
23. **Assumption-checking proof:** unconfirmed demand-assumption language can raise a volume-confirmation gap without treating it as a fact.
24. **Causality-safe question proof:** unit J + FINAL:5 — “Has backlog increased over the same period?”; does not say Delivery is caused by Capacity. Bare “Why?” / “Why this?” / “what evidence supports Capacity?” do not hijack into NCA:3.
25. **“I don’t know” behavior:** unit K — unavailable/fallback; compare temporary vs do-nothing; no loop.
26. **Refusal behavior:** unit L — DECLINED; skip; proceed with uncertainty.
27. **Partial-answer behavior:** unit M — Q4/maybe longer keeps minimum timeframe plus remaining uncertainty.
28. **Correction integration:** unit N — NCA:2 CORRECT; conversational interpretation updates; no business-data write.
29. **NCA:1 integration:** `overlayNcaTurnWithQuestionStrategy` enriches knowledge/question; does not replace need/reference interpretation.
30. **NCA:2 integration:** pending registered from presented question; `ANSWER_NEXORA` skips NCA:3 overlay except temporary-demand recommendation rewrite; continuity follow-up preserved when the reply still asks.
31. **Object-generic proof:** unit T; subject name interpolated; no hardcoded “What does Delivery show?” / “Should we permanently increase capacity?” handlers.
32. **Tests added:** `nexoraNca3QuestionIntelligence.test.ts` (identity + A–T).
33. **Regression suites:** NCA:1, NCA:2, FINAL:1–5, 6.1–6.6, MO:2/4/5/6, CC:5, NEX-EXP:1–7, EI/EXI:1–4 — PASS (440 tests in the combined battery).
34. **Build result:** PASS (`NODE_OPTIONS=--max-old-space-size=16384 npm run build`).
35. **Runtime result:** PASS live `/executive`; 0 page errors (`live-browser.json`).
36. **Live ask scenario:** permanently increase capacity → one persistence question → pending on NCA:2 → seasonal answer → temporary-capacity recommendation, no next `?`.
37. **Live no-ask scenario:** What does Delivery show? → ANSWER, `ask=false`, SUFFICIENT.
38. **Certification evidence:** `NCA-CONTRACT.md`, `CERTIFICATION-MATRIX.md`, `REGRESSION-RESULTS.md`, `RUNTIME-CERTIFICATION.md`, `live-browser.json`, screenshots `01–03`, `zero-failure-gate.json`, `report.json`.
39. **Remaining debt:** Causal PARTIAL_ANSWER still uses a generic backlog timing question rather than object-specific evidence contracts. Presentation KPI lookup is fixture-based (`primaryKpi`), not a new RDI store. External research is explicitly out of scope. No production LLM.
40. **Final verdict:** **NCA:3 = CERTIFIED**
