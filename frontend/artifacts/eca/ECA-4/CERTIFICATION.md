# NPA-T ECA:4 — Executive Questioning & Information Acquisition

**Status: CERTIFIED**

Certification date: 2026-09-07
Runtime: `http://localhost:3019/executive` (isolated `?reset=1` journeys). Production `next start` on 3019 after `NODE_OPTIONS=--max-old-space-size=8192 npm run build`. Port 3018 from ECA:3 was not reused.

Prerequisite ECA:1, ECA:2, and ECA:3 remain certified. None were reopened or redesigned. ECA:5 was not started. ECA:4-FIX1 was not created.

## Verdict

**NPA-T ECA:4 — Executive Questioning & Information Acquisition: CERTIFIED**

## Architecture questions

| Q | Required | Result |
| --- | --- | --- |
| Q1 Another clarification engine? | NO | PASS — ambiguity stays ECA:1/NCA; semantic confirmation stays DATA-ADV; NCA:3 remains conversation-level question strategy |
| Q2 Every ECA:4 question has an identifiable information need? | YES | PASS — `shouldAsk` requires `primaryNeed` |
| Q3 Can ECA:4 decide not to ask? | YES | PASS — `NO_ACQUISITION_NEEDED`, `PROCEED_WITH_UNCERTAINTY`, `DEFER` |
| Q4 Check existing authoritative information first? | YES | PASS — Goal target and confirmed Data Reality short-circuit asking |
| Q5 Can I don’t know remain unknown? | YES | PASS — no fabrication, no immediate repeat |
| Q6 Can the manager skip? | YES | PASS — `DEFER` |
| Q7 Proceed with uncertainty when non-blocking? | YES | PASS |
| Q8 Does ECA:4 write business truth? | NO | PASS — frozen writer boundaries all false |
| Q9 Employee communication infrastructure? | NO | PASS — source identification only, `contacted: false` |
| Q10 Identify another likely source without contacting it? | YES | PASS — `IDENTIFY_OTHER_SOURCE` / `EMPLOYEE_OR_OWNER` |
| Q11 Semantic uncertainty vs missing Data distinguished? | YES | PASS — CAP_AV `KNOWN_UNCONFIRMED` ≠ `MISSING` |
| Q12 Can Nexora explain why it asked? | YES | PASS — why follow-up uses the pending explanation |

## Required certification matrix

| Gate | Result |
| --- | --- |
| Architecture reuse | PASS |
| Clarification boundary | PASS |
| Information-need detection | PASS |
| Known vs unknown distinction | PASS |
| Semantic uncertainty distinction | PASS |
| Information necessity | PASS |
| Question-value judgment | PASS |
| Existing-information-first | PASS |
| Source selection | PASS |
| Manager-source judgment | PASS |
| Minimum necessary question | PASS |
| One-question discipline | PASS |
| Question priority | PASS |
| I-don't-know handling | PASS |
| Skip/defer handling | PASS |
| Proceed-with-uncertainty | PASS |
| Question explanation | PASS |
| Question repetition suppression | PASS |
| Suggested-turn reuse | PASS |
| Comparison acquisition | PASS |
| Decision readiness | PASS |
| Execution readiness | PASS |
| Outcome acquisition | PASS |
| Causality safety | PASS |
| Data Reality boundary | PASS |
| Mutation/writer boundary | PASS |
| Stage separation | PASS |
| Employee-communication boundary | PASS |
| ECA:1 regression | PASS |
| ECA:2 regression | PASS |
| ECA:3 regression | PASS |
| Unnecessary-question regression | PASS |
| Live runtime | PASS |
| NXA funnel | PASS |
| TypeScript | PASS |
| ESLint | PASS |
| Production build | PASS |
| git diff --check | PASS |

## Dependency direction

ECA:1 (NOW) → ECA:2 (NEXT) → ECA:3 (whether to speak) → ECA:4 (what information is missing and whether to acquire it). ECA:4 does not call the ECA:2 planner or the ECA:3 judge. It references the certified ECA:2 plan (`intent`, `nextAction`, `suggestedManagerTurns`). NCA:3 remains the conversation-level question strategy; when NCA:3 already asks, ECA:4 does not overlay a second question.

Canonical module: `judgeEcaExecutiveInformationNeed` (`NPA-T ECA:4/ExecutiveQuestioningInformationAcquisition`).

## Focused and multi-turn

A–T and sequences 1–6 pass in `ecaExecutiveInformationNeed.test.ts`. Orchestrator runtime proofs pass in `ecaExecutiveInformationNeed.runtime.test.ts`. Unnecessary questions introduced on `Explain Capacity Gap.` = 0. Duplicate questions after `I don't know.` = 0.

## Live `/executive` sequences

Evidence: `frontend/artifacts/eca/ECA-4/live-proofs.json`.

| Proof | Result |
| --- | --- |
| 1 Known information | PASS — delivery target not re-asked |
| 2 Comparison missing information | PASS — Scenario B cost gap, one focused question |
| 3 I don’t know | PASS — no fabrication, no immediate repetition |
| 4 Why | PASS — explanation of comparison cost value |
| 5 Skip / proceed | PASS — `DEFER` then compare without trapping |
| 6 CAP_AV | PASS — `KNOWN_UNCONFIRMED`, not missing, no Data write |
| 7 Decision/Execution boundary | PASS — prerequisite asked, Execution not started |

Live Runtime 1–7: **7/7 PASS**. Page errors: 0.

## Funnel and quality

| Gate | Result |
| --- | --- |
| NXA L1 | PASS |
| NXA L2 | PASS |
| NXA L3 | PASS |
| NXA L4 required tasks | **7/7 PASS** (omnibus, DIR inventory, typecheck, eslint PREP, git diff --check PREP, production build, live smoke) |
| TypeScript | PASS |
| ESLint (ECA:4 surface) | PASS (0 errors; pre-existing `csvImportStoreVersion` hook warning in `NexoraExecutiveShell.tsx` unchanged) |
| Production build | PASS |
| git diff --check | PASS |
| Blocking product failures | 0 |

Workspace `*.test.ts` files that import Vitest were not executed with `node --test`; that is the existing canonical-runner boundary, not an ECA:4 failure.

## Stop

ECA:5 was not started. ECA:4-FIX1 was not created. ECA:1–3 were not redesigned. No second clarification engine, Data Reality, RAG/DB connector, web research, or employee messaging was added.
