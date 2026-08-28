# NXA:2 — Executive Conversation Guidance & Productive Dialogue

## Verdict

**NXA:2 = CERTIFIED**

NXA:3 was not started.

## 1. Architecture inspected

The certified runtime remains one path:

`/executive → CC interpretation/context → FINAL:6.1/6.2 meaning and continuity → MO object intelligence → NCA dialogue/question/advice/initiative/communication → NXA:1 identity and need contract → NXA:2 guidance value gate → NCA-POST semantics/collections/comparison → DIR:1 → Stage`

Inspected NXA:1, NCA:1–7, NCA-POST:1–4, MO:1–6, MO-INT:1, NEX-EXP/NEX-E2E, CC decision and execution safety, DIR:1, the Advisor composer, and the live `/executive` surface.

## 2. Authorities reused

- Conversational need and referent: NXA:1 over FINAL:6.1/6.2 and NCA:1.
- Dialogue state, pending questions, collections, comparison, prior recommendation: NCA:2.
- Gap evaluation and one-question policy: NCA:3.
- Recommendation and challenge position: NCA:4.
- Initiative and interruption discipline: NCA:5.
- Communication depth and trust: NCA:6.
- Active object and contextual next path: MO:1–6.
- Goal/journey progress: existing MO and NEX-EXP sessions.
- Commitment and execution confirmation: existing CC authorities.
- Presentation and Stage mutation: DIR:1.

NXA:2 does not create a second dialogue, question, recommendation, confirmation, or business-truth authority.

## 3. Files created

- `app/lib/manager-object/nexoraNxa2ConversationGuidanceContract.ts`
- `app/lib/manager-object/nexoraNxa2ConversationGuidanceContract.test.ts`
- `scripts/nxa-2-executive-conversation-guidance-certify.mjs`
- `.certification/nxa-2-executive-conversation-guidance/runtime-conversation-transcript.json`
- `.certification/nxa-2-executive-conversation-guidance/01-answer-ask.png` through `11-generic.png`
- `artifacts/nxa2/NXA-2-CERTIFICATION-REPORT.md`

## 4. Files modified

- `app/lib/conversational-control/conversationalExperience.ts`
- `app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- `app/executive/nex-mvp/NexoraExecutiveShell.tsx`

Previously modified NXA:1/NCA-POST/DIR:1 work was preserved.

## 5. Conversation Guidance contract

Every completed turn exposes one high-level behavior, its existing authority source, whether intervention has decision value, the question-gap category when applicable, repetition state, manager-override state, and the manager-authority invariant.

## 6. Behavior selection

Precedence is safety- and value-based:

1. **CONFIRM** only when existing CC returns `confirmation-required`.
2. **WAIT** on a manager closure/acknowledgement signal.
3. **CHALLENGE** on NCA:4 challenge or unsupported causal/action certainty.
4. **ASK** when a meaningful NCA:3 gap exists or a semantically vague Goal/result blocks useful reasoning.
5. **RECOMMEND** when the manager asks for advice and NCA:4 has sufficient contextual support.
6. **GUIDE** when the manager signals uncertainty or asks where to start.
7. **ANSWER** otherwise.

## 7. Conversation Value Gate

ANSWER and WAIT introduce no additional intervention. ASK, RECOMMEND, CHALLENGE, GUIDE, and CONFIRM require an explicit material reason. The smallest useful intervention is selected; no generic follow-up is appended to direct answers or acknowledgements.

## 8. High-value-question mechanism

NCA:3 remains authoritative for evidence, constraint, comparison, decision, execution, and learning gaps. NXA:2 maps those existing gaps to executive categories. A bounded semantic Goal-gap rule handles “I want to improve performance” when no result is named and asks exactly one question:

> Which result matters most right now — delivery, margin, quality, or another outcome?

A bare “I don’t know” remains with NCA:3’s certified fallback and is not replaced by generic guidance.

## 9. Known-information protection

NCA:3 checks current Goal, active object, prior answers, and known KPI evidence before asking. Runtime certification establishes Delivery at its existing 96% target and verifies that advice uses the known context without asking for the target again.

## 10. Recommendation reasoning

Recommendations remain NCA:4 outputs grounded in active Goal, constraint, evidence, trade-off, reversibility, confidence, and conditions. NXA:2 selects RECOMMEND but does not generate a parallel advisory position.

## 11. Challenge behavior

Unsupported certainty selects CHALLENGE. Presentation uses the registered semantic references and explicitly distinguishes connection from confirmed cause, then advises against committing resources until the relationship is verified. The manager—not Nexora—retains commitment authority.

## 12. Manager override

Explicit navigation is treated as a manager override. “No. Show Margin Pressure.” focuses Margin Pressure immediately without forcing completion of the earlier Capacity recommendation.

## 13. Repetition protection

NXA:2 compares the current and prior NCA:2 recommendation snapshots on follow-ups. “Why?” remains an explanatory continuation and produces deeper evidence/reasoning rather than repeating the original recommendation response.

## 14. Stop / WAIT behavior

“Okay, I understand now.” selects WAIT and returns only “Understood.” No question, recommendation, or workflow pressure is appended.

## 15. Contextual Nexora education

Explicit product-use questions are taught through the active referent: “How do I use this object?” on Risk explains the useful questions the manager can ask about Risk. Journey orientation such as “Where are we?” remains owned by MO/NEX-EXP and is not hijacked by product education.

## 16. Generic-object proof

The same guidance contract is certified across KPI/object, Problem, Risk, Scenario, and Goal categories. Behavior depends on semantic need, dialogue state, evidence, gap, and registered referent—not named-object scripts.

## 17. Runtime transcripts

The full A–L browser transcript is in `.certification/nxa-2-executive-conversation-guidance/runtime-conversation-transcript.json`.

- Page errors: **0**
- Required A–L proofs: **12/12 passed**
- Additional one-question and manager-language proofs: **2/2 passed**
- Live verdict: **PASS**

## 18. Regression results

- NXA:1–2 focused contract suite: **22/22 passed**.
- NXA:2 full unit certification: **13/13 passed**.
- NCA:1–7 + NXA:1–2 sweep: **177/179 initially passed**; the two presentation regressions were corrected.
- NCA:3 + NCA:4 + NXA:2 corrective rerun: **58/58 passed**.
- Broad CC, MO, NCA-POST, DIR:1, NEX-E2E sweep: **101/103 initially passed**; contextual education was narrowed to explicit use questions.
- MO-INT + NXA:2 corrective rerun: **22/22 passed**.
- NXA:1 regression remains green.
- Live NXA:2 `/executive` certification passes after all corrections.

No known failing relevant test remains.

## 19. Build/test results

- Next.js optimized production compile: passed.
- TypeScript validation: passed.
- Static page generation including `/executive`: passed.
- Build uses `NODE_OPTIONS=--max-old-space-size=8192` because the repository exceeds the default Node heap during TypeScript validation.
- Informational warning only: installed `baseline-browser-mapping` data is older than two months.

## 20. Remaining defects

None known within NXA:2 scope.

## 21. Final verdict

**NXA:2 = CERTIFIED**
