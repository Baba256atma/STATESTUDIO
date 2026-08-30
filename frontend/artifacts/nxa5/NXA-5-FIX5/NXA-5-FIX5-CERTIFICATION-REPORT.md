# NXA:5-FIX5 Certification Report

Manager Observation Precedence, Stale-Context Isolation & Causal Jump Prevention

## 1. Root cause

`delivery is too late` was classified as CONSEQUENCE because the cue `too late` belonged to the consequence family, and copular evaluative language (`late`) was missing from the manager-observation speech-act class. CC:1 was `unknown`, NLU overlay then mapped CONSEQUENCE → `explore-scenario` / do-nothing. The scenario engine used the **focused Stage subject (Capacity)** as the do-nothing primary, producing “If Capacity remains without intervention… Delivery…”.

The Delivery observation was already written to `managerObservations`. The Advisor route ignored that ownership.

## 2. First semantic divergence

Canonical meaning: `requestedOperation = CONSEQUENCE`, `ASK_CONSEQUENCE`, authority `CC:9/explore-scenario`, while the explicit object was already Delivery.

Speech act was `UNKNOWN` because QUALITATIVE did not include evaluative states such as late/delayed/insufficient.

## 3. Files inspected

- `canonicalManagerMeaningInterpreter.ts` (CONSEQUENCE cues)
- `nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts`
- `nexoraMvpFinal61NaturalLanguageUnderstanding.ts` (intent overlay)
- `conversationalExperienceOrchestrator.ts` (scenario engine, Stage, observation writer)
- `executiveScenarioResolver.ts` (do-nothing copy)
- `nexoraNxa5Fix4StageContextIntelligence.ts`

## 4. Files changed

- `nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts`
- `canonicalManagerMeaningInterpreter.ts`
- `nexoraMvpFinal61NaturalLanguageUnderstanding.ts`
- `nexoraNxa5Fix5ObservationPrecedence.ts` (new)
- `nexoraNxa5Fix5ObservationPrecedence.test.ts` (new)
- `nexoraNxa5Fix4StageContextIntelligence.ts` (observation → STAGE_COMPATIBLE)
- `conversationalExperienceOrchestrator.ts`

## 5. Manager-observation semantic rule

A complete named-subject evaluative assertion (copular qualitative/numeric, or evaluative-change verb) is a manager observation unless it is a question, command, correction, pending deictic `it/this/that` answer, consequence intent, or causal assertion.

## 6. Explicit-subject precedence rule

The current-turn named object owns the assertion. Stale Capacity focus, last explain, last consequence subject, and Stage collection do not replace that subject.

## 7. Stale-context isolation rule

Stage/conversation context is REQUIRED for deictic consequence (`ignore it`), HELPFUL when the named subject matches Stage, and IRRELEVANT TO OWNERSHIP when a complete new observation names a different object.

## 8. Observation / cause / hypothesis / consequence

- Observation: `Delivery is too late`
- Causal hypothesis: `Capacity is causing Delivery delays`
- Consequence: requires consequence intent (`what happens if we ignore it?`, do-nothing, what-if)

These are not interchangeable.

## 9. Consequence-intent rule

Do-nothing / `explore-scenario` overlay requires consequence intent language. Weak evaluative cues (`too late`) are OBSERVE, not CONSEQUENCE.

## 10. Observation provenance rule

Existing `managerObservations` store; provenance `manager-reported`. Not Data Reality, not confirmed cause, not a Nexora prediction.

## 11. FIX4 Stage interaction

Stage grounding still applies to `which one` / `them`. Named observations are STAGE_COMPATIBLE: Stage informs, it does not capture the subject.

## 12. Stage mutation / consent

Observations do not Focus the named object. `show Delivery` still mutates via DIR. Talk ≠ show.

## 13. Automated test results

FIX5 suite pass (A–F, FIX4 protection, generalization, recall). NCA:3/4, NXA:1, FIX4, DIAG2R retested pass.

## 14. TypeScript results

`npm run typecheck` — pass (exit 0).

## 15. Production build results

`npm run build` — pass (exit 0). `/executive` present.

## 16. Live /executive certification results

Rebuilt runtime `next start -p 3001` (stopped after proof). Existing `:3000` listener left running. 0 page errors.

| Turn | Semantic owner | Stage after | Mutation |
|---|---|---|---|
| show Capacity | presentation | Capacity focused | yes |
| what happens if we ignore it? | consequence on Capacity | Capacity | no |
| delivery is too late | Delivery observation, manager-reported | Capacity unchanged | no |
| what did I just tell you? | recalled Delivery observation | Capacity | no |
| what is on Stage? | Stage-meta: Capacity | Capacity | no |
| why might Delivery be late? | Delivery why/investigate | Capacity | no |
| show Delivery | explicit presentation | Delivery focused | yes |
| inventory is too high | Inventory observation | Delivery unchanged | no |
| what did I just report? | recalled Inventory observation | Delivery | no |

Critical proof: after `delivery is too late`, Advisor treats a Delivery observation while Stage remains Capacity.

## 17. Regression results

Funnel L1–L3 pass. Typecheck pass. Production build pass. FIX4 talk-vs-show, pending `risk`, DIAG2R, NCA:3/4, NXA:1 retested.

## 18. Remaining debt

`why might Delivery be late?` still uses existing investigation copy about related Capacity; that is a why-question, not the observation-routing defect. Funnel L4 not run.

## 19. Final status

NXA:5-FIX5 = CERTIFIED
