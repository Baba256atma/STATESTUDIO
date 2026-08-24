# NEX-EXP:4 Completion Report

Identity: `NEX-EXP:4/ProblemRiskOpportunityDiscovery` `1.0.0`

## 1–5. Architecture / files / identity

Inspected NEX-EXP:1–3, EI:3, CC:8, DS-6, RDI/Data Reality, MO:1–MO:6, MO-INT:1, Stage catalog, Advisor. Reused those authorities; no parallel Problem/Risk/Opportunity/causal/recommendation/scenario engines.

Created: `nexoraIssueDiscoveryTypes.ts`, `nexoraIssueDiscoveryResolution.ts`, `nexoraIssueDiscoveryExperience.ts`, `nexoraIssueDiscoveryExperience.test.ts`, `scripts/nex-exp4-issue-discovery-certify.mjs`, certification folder.

Modified: entrance types/experience, EXP:3 ownership, `managerObjectContext.ts`, `managerObjectCatalog.ts`, `NexoraExecutiveShell.tsx`.

## 6–12. Discovery model and EXP:3 handoff

States: `NOT_STARTED` … `READY_FOR_SCENARIO_DISCOVERY`. Consumes `NexoraIssueDiscoveryHandoff` (goal, reality, gap, signals, constraints). Does not rediscover Reality. Candidate contract includes kind, evidence, epistemic status, materiality, current/future, validated=false for manager-stated, causalStatus, no invented probability/value.

## 13–21. Semantic protections

Problem requires current adverse interference; Risk is forward-looking; Opportunity needs a favorable condition; Constraint is a real limit. Problem ≠ Constraint. Problem ≠ root cause. Gap ≠ Problem. Current failure is not classified as Risk. Opportunity ≠ recommendation. Manager-stated signals stay unvalidated. Causal hypotheses remain HYPOTHESIZED. Causality: NONE / HYPOTHESIZED / SUPPORTED / CONFIRMED / UNKNOWN, with CONFIRMED never assigned because EI:3 does not infer causality. Graph related-to uses `unknown-cause`; correlation is not causation.

## 22–30. Evidence, materiality, reuse

Sufficiency WEAK / PARTIAL / SUFFICIENT. Materiality blocks trivial noise. Discovery is Goal-scoped conversation, not a company-wide scan. EXP:2/3 signals are seeded without restating. Canonical `ctx-problem-capacity` reused when the live catalog contains it. Duplicate merge by kind + subject overlap without over-merging distinct kinds.

## 31–41. Stage, questions, priority

Stage objects require material + non-weak support; budget ≤4; Goal stays center (`shouldCommitRuntime: false`). Progressive one-at-a-time clarifications for Problem vs Risk, current vs future, opportunity vs unvalidated option, tight vs cap. Discovery summary names supported issues and unknowns. Discovery priority ≠ MO:6 attention and ≠ recommendation.

## 42–57. MO / Advisor / Stage

MO:1 Show/click, MO:2 Explain, MO:3 paths, MO:4 Goal overlay, MO:5 journey IDENTIFIED ≠ resolved, MO:6 consumes attention, MO-INT:1 one conversation. UX:3 Advisor only. Overlay uses existing catalog/Stage; z=0; Goal (0,0). Relationships `rel-goal-issue-*` are related, not caused. Provenance retained; stale reduces certainty; conflicts exposed; unknown is valid.

## 58–70. Absence, multiples, lifecycle, handoff

No mandatory Problem/Risk/Opportunity. Multiple kinds stay distinct. Risk→Problem keeps history. Opportunity window only from evidence. Constraint removal lowers an obsolete cap. Sufficiency: enough to say what to investigate next, or explicitly no supported issue. `NexoraScenarioDiscoveryHandoff` prepared. NEX-EXP:5 not started.

## 71–85. Gates and verdict

Tests 293 pass (entrance + MO + EI:3 + UX pack). Typecheck/lint errors 0 / build 0 / smoke ok / live Stage+conversation certified / EI:3 path proven via claims + unknown-cause relationships. Human experience A–G YES. Debt: no durable issue store; confirmed-cause authority still unwired; first-time Stage does not import demo catalog problems unless matched. Known failures: none.

**NEX-EXP:4 = CERTIFIED**
