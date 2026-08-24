# NEX-MVP-FINAL:6.1 — Natural Language Understanding

Identity: `NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding` `1.0.0`  
Namespace: `nexora.mvp.final61.natural-language-understanding`

## 1. Files inspected

- `frontend/app/lib/conversational-control/conversationalIntent.ts`
- `frontend/app/lib/conversational-control/conversationalIntentResolver.ts`
- `frontend/app/lib/conversational-control/conversationalIntentNormalization.ts`
- `frontend/app/lib/conversational-control/conversationalSubjectRegistry.ts`
- `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- `frontend/app/lib/conversational-control/conversationalCommand.ts`
- `frontend/app/lib/manager-object/managerObjectIntent.ts`
- `frontend/app/lib/manager-object/managerObjectInteraction.ts`
- `frontend/app/lib/manager-object/managerObjectExperienceComposer.ts`
- `frontend/app/lib/manager-object/managerObjectCatalog.ts`
- `frontend/app/lib/manager-object/managerObjectExplainEngine.ts`
- `frontend/app/executive/nex-mvp/NexoraExecutiveShell.tsx`
- Prior FINAL:1–5 certification scripts and tests

## 2. Files created

- `frontend/app/lib/manager-object/canonicalManagerMeaning.ts`
- `frontend/app/lib/manager-object/canonicalManagerMeaningInterpreter.ts`
- `frontend/app/lib/manager-object/nexoraMvpFinal61NaturalLanguageUnderstanding.ts`
- `frontend/app/lib/manager-object/nexoraMvpFinal61NluCorpus.ts`
- `frontend/app/lib/manager-object/nexoraMvpFinal61NaturalLanguageUnderstanding.test.ts`
- `frontend/scripts/nex-mvp-final61-natural-language-understanding-certify.mjs`
- `frontend/.certification/nex-mvp-final-6-1-natural-language-understanding/*`

## 3. Files modified

- `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- `frontend/app/lib/conversational-control/conversationalExperience.ts`
- `frontend/app/lib/manager-object/index.ts`
- `frontend/app/executive/nex-mvp/NexoraExecutiveShell.tsx`
- `frontend/app/executive/nex-mvp/NexoraConversationalExperience.tsx`

## 4. Identity

`NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding` `1.0.0`  
`nexora.mvp.final61.natural-language-understanding`

## 5. Previous NLU architecture

CC:1 `resolveNexoraConversationalIntent` is a deterministic ordered regex matcher (~2.5k lines). MO:1 `mapIntent` adds further utterance regexes. Object identity is CC:2 registry matching. Certified phrases work; unseen paraphrases fall through to `unknown`.

## 6. Root cause of phrase-specific behavior

Intent was defined as matching anticipated sentence forms, not as composing speech-act + operation frame + registered object. Each new manager wording required another pattern.

## 7. Canonical manager-meaning contract

`CanonicalManagerMeaning` carries raw utterance plus optional communicative intent, operation, subject/object reference, question type, depth, modality, polarity, confidence, ambiguity, and semantic evidence. Unknown/unpopulated fields are valid.

## 8. Intent representation

Communicative intents such as `REQUEST_FOCUS`, `ASK_EXPLANATION`, `ASK_WHY`, `OBSERVE`, `CHALLENGE`, `ASK_CAPABILITY`, `SUGGEST`, `UNKNOWN` are separate from object identity.

## 9. Object-resolution strategy

Mentions are resolved against the existing CC:2 / MO catalog projection (names, aliases, controlled morphology, conservative edit-distance-1). No second registry. Future objects participate by registration.

## 10. Question classification

Question type is derived from operation frames (CAUSE, IMPACT, CONSEQUENCE, EVIDENCE, COMPARISON, etc.) when modality is interrogative/hypothetical.

## 11. Confidence model

`HIGH | MEDIUM | LOW | UNKNOWN` from cue weight, object uniqueness, and unresolved referents.

## 12. Ambiguity representation

`ambiguity.unresolved` plus `candidates[]`. Example: “Show the risk problem” keeps Risk and Problem candidates instead of first-regex-wins.

## 13. Unknown/unresolved

Vague actions (“Do something”, “Make the business awesome”) stay `UNKNOWN` / underspecified. “Bring that thing up” is unresolved, not invented.

## 14. Raw-utterance preservation

`rawUtterance` is always retained beside `preparedUtterance` and canonical fields.

## 15. Semantic reasoning / LLM boundary

No live LLM in this runtime. Interpretation is a constrained feature-frame interpreter behind a schema. It cannot mutate Goal, Decision, Execution, Outcome, Evidence, or Data Reality. Free-form model output is not on the path.

## 16. Deterministic authority boundary

NLU proposes meaning. Overlay onto CC:1 occurs only when CC:1 is `unknown`. CC:2–11, MO:2–6, EI, and runtimes remain the authorities for what Nexora knows and does.

## 17. Reuse of MO/EI/CC/EXP

Same `executeNexoraConversationalExperience` pipeline. Overlay maps operations onto existing kinds (`focus`, `explain`, `evidence`, `explore-scenario`, `compare-scenarios`, `prioritize`, `help`).

## 18. No second conversation engine

Orchestrator is still CC:5. Overlay is a meaning adapter, not a parallel chat runtime.

## 19. No second object registry

`buildNexoraConversationalSubjectMatchIndex` / `projectManagerObjectConversationalSubjects` only.

## 20. No sentence-specific regex expansion as the solution

CC:1 phrase tables were not grown with “bring delivery / let me see delivery” routes. Unseen paraphrases are scored from operation cues + registered objects. Certification phrases such as “Take me to the delivery picture” are absent from production interpreter source.

## 21. Corpus utterances

118

## 22. Unseen paraphrases

25 dedicated unseen cases (`u1`–`u25`) plus paraphrase groups (10 operations). Production source must not contain the held-out sentences.

## 23. Mutation tests

Pass: politeness, filler (`pls`), capitalization, punctuation, plural `deliveries`.

## 24. Negative tests

Pass: no fabricated object/decision/execution for underspecified commands.

## 25. Observation tests

Pass: “Capacity seems tight.” is `OBSERVE`, not `FOCUS`.

## 26. Challenge tests

Pass: challenge communicative act is represented. FINAL:6.4 trusted-communication behavior not implemented.

## 27. Meta/help

Pass: “Can you help me investigate a KPI?” is capability/help, not a KPI business object.

## 28. Future synthetic objects

Pass: Profit, Cash Flow, Loan Exposure, Quality resolve when registered.

## 29. Decision/execution safety

Pass: “Maybe we should expand capacity.” does not overlay `commit-decision` or start execution.

## 30. Conversation regression

FINAL:2, 3, 3R, 4, 5 and CC:1 tests pass. Certified phrases such as `show delivery`, `explain it`, `why?` remain on existing routes because overlay is unknown-only.

## 31. Production build

`npm run build` — pass

## 32. Runtime certification

Live `/executive` demonstration — pass (`live-browser.json`). Unseen wording “Can we look at Delivery?” focused `obj-delivery` through the existing conversation authority.

## 33. Environment limitation

No LLM API in certification runtime. Feature-frame NLU is the exercised semantic path. This is classified, not faked as a neural model.

## 34. Remaining debt

- Cue collisions remain possible (`we have` vs evidence questions).
- Cross-turn reference (FINAL:6.2), clarification UX (6.3), full trusted communication (6.4), guidance/self-knowledge (6.5), and Type-C certification (6.6) are out of scope.
- Explain overlay may update MO active object without always moving Stage camera focus (existing command mapping).

## 35. Zero-failure status

`NEX-MVP-FINAL:6.1-ZERO-FAILURE-CERTIFIED`  
Unit, corpus, paraphrase, mutation, negative, regression, lint (changed files), typecheck, production build, live browser: pass. No unexplained failures.

## 36. Verdict

**FINAL:6.1 — NATURAL LANGUAGE UNDERSTANDING**  
**CERTIFIED**
