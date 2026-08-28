# NXA:4 Certification Report

## Verdict

**NXA:4 = CERTIFIED**

No known NXA:4 defect remains. The prior certified omnibus baseline was 933/933; the final baseline is 943/943 after adding ten NXA:4 tests.

## Architecture inspected and authorities reused

- NXA:1 remains Advisor identity/need policy; NXA:2 remains productive communication behavior; NXA:3 remains the single Executive Situation read model.
- MO:1–5 remain object interaction, explanation, exploration, Goal navigation, and journey authorities. MO:6 remains the sole attention/intervention-significance authority.
- NCA:1–4 remain interpretation, dialogue state, question, and recommendation authorities. NCA:5 remains proactive candidate collection, initiative selection, and existing conversation-scoped repetition memory. NCA:6/7 remain presentation adaptation and end-to-end collision resolution.
- NCA-POST:1–4 remain recovery, assertion/pending-question, semantic-scope/collection, and comparison authorities.
- CC remains the sole Decision/Execution mutation path. NEX-EXP outcome state, RDI/data reality, EI, MO-INT, CORE-OUT, Stage, Advisor composition, DIR:1, and the `/executive` runtime remain unchanged authorities.

### MO:6 boundary

MO:6 answers *what deserves attention/intervention* and supplies attention state, intervention need, Goal relevance, urgency, evidence, recommended path, and do-not-disturb. NXA:4 does not redetect or rescore those facts. It combines that authoritative significance with NXA:3 situation, NCA:5 candidate/initiative memory, current focus, manager override, novelty, evidence calibration, and actionability to answer only *whether Nexora should enter the conversation now*. No queue, monitor, poller, scheduler, or second situation model was added.

## Contract and mechanism

The immutable evaluation returns `SPEAK`, `DEFER`, `SUPPRESS`, or `ESCALATE`, plus semantic intensity (`NOTICE`, `ADVISE`, `WARN`, `ESCALATE`), materiality, Goal relevance, evidence strength, novelty, urgency, manager-focus handling, prior-intervention state, actionability, an internal audit trail, and optional manager-facing copy.

- Noise and process-only signals suppress.
- Relevant but mistimed, weakly evidenced, overridden, focus-conflicting, or presently unactionable issues defer/suppress.
- Material, novel, relevant signals speak when MO:6 or NCA:5 supports intervention.
- Critical new evidence, Decision-premise invalidation, and Execution drift can escalate.
- Manager override is respected unless critical material escalation changes the executive consequence.
- Existing NCA:5 snapshots provide repetition protection; unchanged candidates are silent and changed values re-evaluate.
- Evidence from manager conversation is capped below validated-source strength. Outcome messages explicitly avoid causal claims.
- Positive Outcomes and material Opportunities use the same generic signal-family policy.
- `composeNxa4MonitoringBoundaryResponse(false)` accurately says reassessment occurs only when new data/observations enter the system.
- Evaluations expose `commitsDecision=false`, `changesExecution=false`, `writesOutcome=false`, and `writesStage=false`.

## Files created

- `app/lib/manager-object/nexoraNxa4ProactiveAdvisory.ts`
- `app/lib/manager-object/nexoraNxa4ProactiveAdvisory.test.ts`
- `scripts/nxa-4-proactive-advisory-certify.mjs`
- `.certification/nxa-4-proactive-advisory/runtime-proactive-advisory.json`
- `.certification/nxa-4-proactive-advisory/live-executive.png`
- `artifacts/nxa4/NXA-4-CERTIFICATION-REPORT.md`

## Files modified

- `app/lib/conversational-control/conversationalExperience.ts` — result/trace contract.
- `app/lib/conversational-control/conversationalExperienceOrchestrator.ts` — composition after NXA:3 and manager-facing event binding.
- `app/lib/manager-object/nexoraNca5InitiativeIntelligence.ts` — preserves the transient considered candidate for explainability; does not surface or persist it.
- `app/executive/nex-mvp/NexoraExecutiveShell.tsx` — read-only certification diagnostics.

## Scenario proof

- Material KPI deterioration: `SPEAK`, Goal significance included, no invented cause.
- Noise: `SUPPRESS`; no proactive message.
- Repetition: unchanged candidate suppressed; critical deterioration re-enters as `ESCALATE`.
- Manager override/focus: ordinary issue deferred; critical Goal/Decision threat may re-surface.
- Proactive challenge: assumption invalidation and revised advice semantics are supported without silently reversing a Decision.
- Decision/Execution: premise invalidation and blocker/drift escalate while all CC mutation flags remain false.
- Outcome: achievement and partial improvement speak with causal uncertainty preserved.
- Opportunity: material positive opportunity can speak; generic suggestion generation is not introduced.
- Weak evidence: deferred and never rendered as an overconfident warning.
- Generic proof: KPI/Problem, Risk, Decision, Execution, and Outcome families traverse one contract; production contains no Delivery/Capacity object branches.
- Deferred limitation: no shadow durable queue was added. Re-evaluation is available through existing conversation snapshots and new runtime events; durable cross-session deferred scheduling remains intentionally outside NXA:4.

## Validation results

- NXA:1–4 focused: **42/42 passed**, 0 failed, 0 skipped.
- NCA:5 + NXA:4 integration: **38/38 passed**.
- Affected NCA:6/7 and NCA-POST:1–3 regressions: **93/93 passed**.
- Authoritative broader omnibus: **943/943 passed**, 0 failed, 0 skipped (previous baseline 933; +10 NXA:4 tests).
- Clean live `/executive`: **passed**; material intervention, noise silence, repeat silence, honest monitoring response, unchanged Stage focus, and **0 page errors**.
- Production: compilation passed; TypeScript passed; static generation **13/13** passed. The default 4 GB build worker first exhausted its heap; the identical gate passed with `NODE_OPTIONS=--max-old-space-size=8192`.
- `git diff --check`: **passed**.

## Diff audit

No duplicate attention logic, duplicate situation state, alert queue, background poller/scheduler, production object hard-coding, hard-coded dialogue phrase routing, deleted test, `.skip`, weakened assertion, fake monitoring claim, Decision/Execution mutation, Stage mutation, internal terminology leakage in manager copy, temporary bypass, or debug code was found. Delivery-specific text exists only in certification fixtures. The transient NCA:5 candidate handoff is diagnostic input, not new memory.

## Remaining defects

None known. The `baseline-browser-mapping` age warning is an existing dependency-data warning and does not affect compilation, TypeScript, static generation, runtime, or NXA:4 behavior.
