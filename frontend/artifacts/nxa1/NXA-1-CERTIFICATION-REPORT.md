# NXA:1 — Executive Advisor Identity & Conversation Contract

## Verdict

**NXA:1 = CERTIFIED**

NXA:2 was not started.

## 1. Architecture inspected

The authoritative manager-message path remains:

`/executive Advisor → CC:1 intent → FINAL:6.1/6.2 meaning and continuity → CC:2/CC:7 context → MO:1–6 object intelligence → NCA:1–7 dialogue/advisory/communication → NCA-POST semantic and collection handling → DIR:1 presentation → canonical Stage runtime`

Also inspected and regression exercised: NCA:1–7, NCA-POST:1–4, MO/MO-INT, NEX-EXP end-to-end, conversational-control safety, Manager–Object Explain Engine, Advisor composer, Stage presentation, and DIR:1.

## 2. Existing authorities reused

- NCA:1 and FINAL:6.1 supply manager need and requested operation.
- NCA:2 supplies active subject, dialogue thread, comparison, and collection continuity.
- MO:2 supplies generic executive-object explanation content.
- NCA:3–6 retain question, advice, initiative, evidence, uncertainty, and depth behavior.
- CC decision and execution confirmation remain unchanged.
- NCA-POST:3/4 retain canonical collection and comparison membership.
- DIR:1 remains the sole presentation planner and Stage adapter.

NXA:1 is a policy projection and diagnostic contract. It creates no second intent classifier, composer, referent store, Stage writer, decision authority, or execution authority.

## 3. Files created

- `app/lib/manager-object/nexoraNxa1ExecutiveAdvisorContract.ts`
- `app/lib/manager-object/nexoraNxa1ExecutiveAdvisorContract.test.ts`
- `scripts/nxa-1-executive-advisor-contract-certify.mjs`
- `.certification/nxa-1-executive-advisor-contract/runtime-conversation-transcript.json`
- `.certification/nxa-1-executive-advisor-contract/01-knowledge.png`
- `.certification/nxa-1-executive-advisor-contract/02-navigation.png`
- `.certification/nxa-1-executive-advisor-contract/03-continuity.png`
- `.certification/nxa-1-executive-advisor-contract/04-investigate-advise.png`
- `.certification/nxa-1-executive-advisor-contract/05-collection.png`
- `artifacts/nxa1/NXA-1-CERTIFICATION-REPORT.md`

## 4. Files modified

- `app/lib/conversational-control/conversationalExperience.ts`
- `app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- `app/executive/nex-mvp/NexoraExecutiveShell.tsx`
- `app/lib/manager-object/managerObjectExplainEngine.ts`
- `app/lib/manager-object/nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts`

The worktree already contained uncommitted DIR:1 and NCA-POST:4 work plus related CC/Stage edits. Those changes were preserved and treated as existing authorities.

## 5. Advisor behavioral contract

The Advisor identity is explicitly `Executive Decision Advisor`. Each completed turn exposes an NXA need, stable referent provenance, evidence requirement, navigation permission, and manager-authority invariant. NXA never commits a decision, starts execution, or writes executive truth.

## 6. Conversational-need precedence

NXA normalizes the existing NCA/MO interpretation into: KNOW, UNDERSTAND, NAVIGATE, INVESTIGATE, CONSEQUENCE, ADVISE, COMPARE, PRIORITIZE, DECIDE, EXECUTE, OBSERVE, LEARN, LEARN_NEXORA, and CLARIFY.

Only NAVIGATE may produce a DIR:1 focus request or commit a focus mutation. A recognized object cannot turn KNOW, UNDERSTAND, or INVESTIGATE into navigation. KNOW selects the existing MO explanation summary instead of allowing later advisory copy to hijack the answer.

## 7. Referent continuity

Explicit or deictic object references resolve through existing FINAL:6.2/NCA:2 state. Collection pronouns such as “which one” preserve the active NCA:2 canonical collection even when a stale single subject exists. Comparative “what about” turns preserve the active object rather than stealing focus.

## 8. Knowledge, context, and evidence separation

- Knowledge uses the generic MO definition/executive-meaning projection.
- Contextual explanation may add registered relationships and current measurements.
- Investigation, consequence, advice, and decision needs are marked evidence-required.
- Relationships are described as connections or associations, not confirmed causes.
- Negated statements such as “not a confirmed cause” remain valid uncertainty language.

## 9. Manager-language protection

The live gate rejects architecture terms and unsupported causal certainty. Manager copy uses ordinary language; WATCH and internal engine identifiers are not exposed. Nexora education explains available help and preserves the manager's final decision authority.

## 10. Generic-object proof

The contract branches on existing semantic operations, NCA needs, registered object metadata, and NCA dialogue state—not object identity. Unit proof covers Delivery, Capacity, Risk, and Goal through the same path. Existing MO generic-object tests also pass.

## 11. Runtime conversation transcript

The authoritative transcript is `.certification/nxa-1-executive-advisor-contract/runtime-conversation-transcript.json` and contains five independent browser sessions covering all required patterns. Notable results:

- “What is Capacity Gap?” → KNOW, no focus mutation, contextual definition.
- “Show Capacity Gap.” → NAVIGATE, canonical focus applied.
- “Show Delivery.” → “Explain it.” → Delivery preserved.
- Delivery investigation → evidence-aware answer; no confirmed causality.
- “What should I do about it?” → actionable, conditional recommendation.
- Causal challenge → Delivery remains focused; no navigation.
- “How can you help me with this?” → product education, no architecture leakage.
- Problems collection → “Which one…” reasons over Capacity Gap and Margin Pressure.

Browser page errors: **0**. Live proofs: **11/11 passed**.

## 12. Regression results

- NCA:1–7 plus NXA:1: **166/166 passed**.
- Focused CC/NCA/NXA gate after final need-precedence fix: **39/39 passed**.
- MO-INT + NEX-E2E + NXA rerun: **24/24 passed**.
- Broader CC, MO, NCA-POST, DIR:1, and NEX-E2E sweep initially exposed three pre-existing integration regressions. All three were corrected and their failing suites rerun green:
  - generic relationship copy restored natural “connected” language;
  - “what about” comparison no longer steals focus;
  - generic “What changed?” no longer collides with collection-membership change handling.

## 13. Build/test results

- Production Next.js compile: passed.
- Production TypeScript validation and static generation: passed with an 8192 MB Node heap (the default 4096 MB heap exhausted on this repository).
- Live Playwright `/executive` NXA:1 certification: passed.
- Only informational warning: installed `baseline-browser-mapping` data is older than two months.

## 14. Remaining defects

None known within NXA:1 scope. The `baseline-browser-mapping` age warning is non-blocking and unrelated to Advisor behavior.

## 15. Final verdict

**NXA:1 = CERTIFIED**
