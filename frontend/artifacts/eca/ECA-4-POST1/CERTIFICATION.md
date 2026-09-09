# NPA-T ECA:4-POST1 — Information-Need Judgment → Advisor Answer Integration Fix

**Status: CERTIFIED**

Certification date: 2026-09-08  
Runtime: `http://127.0.0.1:3031/executive` (isolated `?reset=1` journeys). Production `next start` after Level 4 build. Port 3031 was verified free before use.

ECA:4 architecture was **not** reopened or redesigned. No second information-need engine, question planner, or evidence-requirement store. ECA:13 was **not** started. ECA:4-POST1-FIX1 was **not** created.

## Verdict

**NPA-T ECA:4-POST1 — Information-Need Judgment → Advisor Answer Integration Fix: CERTIFIED**

**NEXORA EXECUTIVE CONVERSATION ARCHITECTURE — ECA:1–12 remains CERTIFIED.**

## Root cause

NCA-POST:3 treated quoted “Nexora” as `NEXORA_PRODUCT` / `PRODUCT_KNOWLEDGE`. The identity sentence replaced the business answer. ECA:4 overlay did not consume a manager request for the active information need.

## Fix (downstream integration)

- Speech act `isEcaInformationRequirementRequest` in certified ECA:4 (excludes ordinary “we need to…”, ECA:9 before-starting, ECA:12 reassess, and “What is Nexora?”).
- NCA-POST:3 classifies that speech act as `BUSINESS`.
- Orchestrator suppresses product-knowledge replacement; captures associated counterpart only on explain/why turns; overlays ECA:4’s manager-facing explanation when `advisorConsumedInformationNeed`.
- Relationship evidence is generated from ECA:4 judgment + captured counterpart, not a new engine.

## Certification matrix

| Item | Result |
| --- | --- |
| Exact reproduction fixed | PASS |
| Root cause identified | PASS |
| ECA:4 reused | PASS |
| No second information engine | PASS |
| Information-need request recognition | PASS |
| Active referent preservation | PASS |
| Pronoun continuity | PASS |
| Existing-data-first | PASS |
| Missing-information specificity | PASS |
| Availability preservation | PASS |
| Necessity preservation | PASS |
| Best-source preservation | PASS |
| Smallest useful request | PASS |
| Partial answer continuity | PASS |
| "I don't know" handling | PASS |
| Ambiguous referent clarification | PASS (unit M; live unfocused does not invent a gap) |
| No duplicate questions | PASS |
| Causality safety | PASS |
| CAP_AV safety | PASS |
| Generic identity fallback suppression | PASS |
| Product-description fallback suppression | PASS |
| Generic-help fallback suppression | PASS |
| ECA:9 precedence preservation | PASS |
| ECA:12 precedence preservation | PASS |
| Ordinary "need" semantics preserved | PASS |
| Direct business writes = 0 | PASS |
| Stage business writes = 0 | PASS |
| Focused A–T | PASS |
| Sequences 1–8 | PASS |
| Live Runtime 1–7 | PASS (7/7) |
| ECA:1–12 regressions | PASS |
| NCA regressions | PASS (POST:3 included in L4 omnibus) |
| NXA regressions | PASS |
| Stage/Director regressions | PASS (L4 omnibus) |
| Data regressions | PASS (L4 omnibus) |
| ECA conversation suite | PASS **433/433** (was 411/411; POST1 added without weakening) |
| NXA funnel | PASS L1–L3; L4 **7/7 PASS** |
| TypeScript | PASS |
| ESLint | PASS (existing `csvImportStoreVersion` warning unchanged) |
| Production build | PASS |
| git diff --check | PASS on POST1 files; L4 `l4-diff-check` PASS |
| Blocking failures = 0 | PASS |

## Certification barriers

| Barrier | Result |
| --- | --- |
| Exact reported failure fixed | YES |
| Focused A–T | ALL PASS |
| Sequences 1–8 | ALL PASS |
| Live Runtime 1–7 | 7/7 PASS |
| Generic identity fallback on valid ECA:4 request | 0 |
| Product fallback on valid ECA:4 request | 0 |
| Lost valid referents | 0 |
| Duplicate information questions | 0 |
| Invented mandatory information | 0 |
| Invented sources | 0 |
| Unsupported causal claims | 0 |
| CAP_AV trust promotion | 0 |
| ECA:4 duplicate authority | 0 |
| New information-need store | 0 |
| Direct business writes | 0 |
| Stage business writes | 0 |
| ECA:1–12 / ECA:5 / ECA:6 / ECA:9 / ECA:12 regressions | 0 |
| NXA required funnel | PASS |
| TypeScript / ESLint / Production build / git diff --check | PASS |
| Blocking product failures | 0 |

## Live Runtime 1 (actual)

After Stage focus on Risk and `Explain this.`, the manager asked the reported determination question. Actual Advisor text (chat surface prefixes speaker name):

> I need evidence that connects this Risk with Margin Pressure — especially when Risk appeared or changed and what happened to margin at the same time. I also need enough context to rule out other likely explanations. That would help determine whether the relationship is supported and whether a causal explanation is justified. I should use any relevant data already available before asking you for more.

`data-eca-4-consumed=true`, writes=false, identity/product sentence absent.

Recorded in `frontend/artifacts/eca/ECA-4-POST1/live-proofs.json`.

## Program status

- ECA:1–12 remains CERTIFIED  
- ECA:4-POST1 CERTIFIED  
- ECA:13 NOT STARTED  
