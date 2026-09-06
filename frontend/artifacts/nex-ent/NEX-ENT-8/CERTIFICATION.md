# NEX-ENT:8 — Decision Loop Experience — CERTIFICATION

**Status: NEX-ENT:8 — CERTIFIED**

**Stop.** Do not start NEX-ENT:9 — Trust + Quick Review.

Date: 2026-09-04.

## Architecture inspected

See `ARCHITECTURE-INSPECTION.md`. ENT:8 is an educational conductor around the existing Evidence → Issue → Scenario → Compare → Recommendation → Manager Decision → Execution → Outcome path. It does not own Issue, Scenario, comparison, recommendation, Decision, Execution, Outcome, or Learning.

## NEX-ENT:1–7 preservation

Entrance pack including ENT:1–8 education tests: **289/289**. ENT:7 visual education suite remains green inside that pack.

## Decision Loop education authority

Session: `guidedIntroduction.decisionLoopEducation`

States: `NOT_STARTED` → `EVIDENCE` → `ISSUE` → `INVESTIGATE` → `SCENARIOS` → `COMPARE` → `RECOMMEND` → `COMMIT` → `EXECUTION` → `OUTCOME` → `REVIEW` → `COMPLETED` | `SKIPPED`

This is lesson progression only. `COMMIT` is not Decision approval. `EXECUTION` is not an Execution record. `OUTCOME` is not an observed business Outcome.

Identity: `NEX-ENT:8/DecisionLoopEducation`.

## Authority table

| Responsibility | Canonical authority | ENT:8 role |
| --- | --- | --- |
| Evidence | Data Reality / ENT:6 example OTD observations | teaches |
| Issue | NEX-EXP:4 + EI:3 | observes / narrates |
| Investigation | DTH:6 Object Investigation | guides; no ENT engine |
| Scenario | NEX-EXP:5 + CC:9 | teaches Scenario ≠ Decision |
| Comparison | NEX-EXP:6 + EI:4 + DTH:7 | guides; ENT does not own `Compare the scenarios` |
| Visual comparison | DIR:VI (ENT:7) | optional presentation only |
| Recommendation | Advisor / EI / NCA / EXP:6 view | narrates; can withhold ranking |
| Decision commitment | CC:10R via NEX-EXP:7 `commitThroughCanonicalRuntime` | never writes |
| Execution readiness | DTH:9 / NEX-EXP:8 | teaches unknowns |
| Execution create/start | CC:11 / NEX-EXP:8 | never writes |
| Execution presentation | DTH:10 | teaches |
| Outcome observation | NEX-EXP:9 + DTH:11 | teaches session/educational concept |
| Learning/Reassessment | DTH:12 / CORE-OUT:2 | bounded concept; no writer added |
| Stage presentation | Director / DTH / Stage | none |
| Guided Attention | DIR:GA | reuses STAGE offer on Evidence/Scenarios |
| Education progression | `decisionLoopEducation` | owns lesson only |

## Educational context

Restrained `/executive?entrance=1` first-time identity is typically **INSUFFICIENT**, so NEX-EXP:7 does not own Approve until comparison is `READY_FOR_DECISION`. ENT:8 therefore **does not fabricate a Decision**. The educational story uses ENT:6 example OTD (~90 over two months), not invented 91/94/96 Goal theatre.

Callable canonical loop is proven **outside ENT** with sufficient identity + CC:10R/CC:11 adapters (existing NEX-EXP journey).

## Evidence proof

Example operations OTD around 90 across two months. Copy states this is evidence, not a confirmed Problem.

## Issue / causality boundary

Issue copy: Problem describes attention, not cause. “Is capacity the cause?” → observations do not prove capacity caused the situation.

## Investigation proof

Lesson uses investigation copy (evidence vs uncertainty). ENT does not implement an investigation engine. DTH:6 remains the investigation theatre authority.

## Scenario proof

Lesson presents Temporary Capacity, External Capacity, and Do Nothing as options. Canonical Scenario store is not written. Focus/select is not owned as commitment (`Approve` classify returns null).

## Comparison proof

ENT NEXT copy: supported differences, unknowns preserved, no winner. `Compare the scenarios` is **not** owned by ENT (falls through to DTH/EXP/NCA). “What is a Scenario?” at COMPARE does not advance to RECOMMEND.

Lock fix: finalize no longer overwrites a `lockPresentedResponse` Advisor reply with a not-found Scenario explain (so lesson “What is a Scenario?” is not replaced by “couldn’t find a match for a”).

## Recommendation authority

Lesson narrates insufficient cost evidence to rank, then a first-to-investigate recommendation. Not a Decision. “Why?” is not a score.

## Recommendation ≠ Decision

After recommendation, `decisionExperience` remains null on the ENT path. Approve is not owned by ENT.

## Manager commitment

On the ENT live path, Approve is spoken; canonical Decision is **not** created because EXP:7 is not ready. Honest architecture (spec §86). Explicit commitment is proven on the NEX-EXP path: `Let's go with Scenario A.` then `Yes, confirm.`

## Decision writer

`CC:10R/CanonicalDecisionRuntime` (`executiveDecisionRuntimeAdapter.ts`) via NEX-EXP:7. ENT `shouldCommitRuntime: false`. No `commitThroughCanonicalRuntime` in the ENT:8 module.

## Duplicate commitment safety

CC:10R `already-committed` (existing `executiveDecisionCommitment` test 11). ENT:8 outside-ENT walk: second `Yes, confirm.` leaves `listDecisions().length === 1`.

## Decision ≠ Execution

NEX-EXP:7 committed Decision has `startsExecution: false` / planning not in-progress. ENT execution lesson copy: a Decision does not mean work has started. `Not yet` at EXECUTION lesson does not start Execution.

## Execution authority

CC:11 / NEX-EXP:8: `Let's start it.` then `Confirm.` ENT does not own `Start the execution.`

## Outcome authority

Educational copy only on the ENT path. No durable Outcome writer added. Observation concept is NEX-EXP:9 + DTH:11. ENT does not invent 91→94→96. “What happened?” before the Outcome lesson does **not** jump the lesson to OUTCOME.

## Outcome ≠ cause

Copy: improvement after a Decision does not prove the Decision caused it. Live cause challenge matched non-causal language.

## Learning boundary

No Theatre Learning writer added. Recap does not include ENT:9 trust/proficiency scoring.

## Visual Intelligence reuse

Routing proof: `Show me delivery over time` during ENT:8 remains DIR:VI TREND. ENT does not own that utterance.

## Guided Attention reuse

DIR:GA remains sole attention authority. ENT may set `pendingOfferTarget: STAGE`. `Where is Data?` still presents `DATA_ENTRY` (pending STAGE is not used as the locate target).

## Canonical writer audit (live ENT:8 on :3003)

| Manager action | Before | Writer | After | Durable? | Allowed? |
| --- | --- | --- | --- | --- | --- |
| Lesson Next / questions / Not yet / Skip | no Decision/Execution/Outcome | none | unchanged business truth | n/a | yes (read-only education) |
| Approve Temporary Capacity (ENT) | no Decision | none (ENT does not own; EXP:7 not ready) | no Decision | n/a | yes |
| Start the execution (ENT) | no Execution | none | no Execution | n/a | yes |

Unexplained writes: **zero**.

Outside ENT (focused test, not live entrance): one CC:10R Decision write on explicit confirm; one CC:11 Execution start on explicit Confirm after plan. Session/in-memory adapters, not Data Library.

## State safety

View evidence / focus / investigate / compare / recommend / click Scenario / Not yet: no business write. Explicit approve/start on ENT: no ENT write. Unauthorized writes: **zero**.

## Refresh / skip

Live refresh: no duplicate Advisor burst. Skip at Evidence: `SKIPPED`, copy states no Decision/Execution/Outcome was created by the introduction.

## Default /executive

Existing workspace: `decisionLoopEducation` `NOT_STARTED`, no automatic loop. Live `00-existing-workspace` protected.

## Files created

- `frontend/app/lib/nexora-entrance/nexoraDecisionLoopEducationExperience.ts`
- `frontend/app/lib/nexora-entrance/nexoraDecisionLoopEducationExperience.test.ts`
- `frontend/scripts/nex-ent8-decision-loop-certify.mjs`
- `frontend/artifacts/nex-ent/NEX-ENT-8/*`
- `frontend/.certification/nex-ent8-decision-loop/*`

## Files modified

- `frontend/app/lib/nexora-entrance/nexoraGuidedEntranceTypes.ts` — ENT:8 session/types/boundary
- `frontend/app/lib/nexora-entrance/nexoraGuidedEntranceExperience.ts` — own/resolve ENT:8 before visual
- `frontend/app/lib/nexora-entrance/nexoraEntranceExperience.ts` — freezeSession default
- `frontend/app/executive/nex-mvp/NexoraExecutiveShell.tsx` — `data-nex-ent8-*`
- `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts` — honor `lockPresentedResponse` for not-found Scenario explain

## Tests

- ENT:8 focused **17/17**
- Entrance + visual + DIR:GA + UI guidance **289/289**
- CC + EI + certification infra **658/658**
- DTH **172/172**
- Manager–Object **596/596**
- TypeScript pass
- Production build pass

## Live proof

Sequence: `/executive?entrance=1&reset=1` through ENT:1–7 into ENT:8 Evidence → Issue → Investigate → Scenarios → Compare → Recommend → Not yet → Approve (no ENT Decision) → Execution lesson → Outcome lesson → Review → Show problems / Where is Data / delivery over time → refresh. Skip session at Evidence.

**Live port: 3003** (`next start` after current production build). HTTP 200. Runtime errors: none.

## Regressions

None known in the packs above.

- Product defect fixed: locked guided replies could be replaced by Scenario not-found copy.
- Environmental: `:3000` still has an existing Node listener; not used for this proof; not terminated.
- Pre-existing: `baseline-browser-mapping` age warning during Next build.

## Certification barrier

- NEX-ENT:1–7 remain green in the entrance pack
- No second Decision Loop
- No ENT Decision/Execution/Outcome authority
- Evidence remains evidence; Issue ≠ cause; Scenario ≠ Decision
- Comparison/recommendation do not commit
- Explicit manager approval required for canonical Decision (CC:10R)
- Repeated approval does not duplicate Decision on the canonical path
- Decision does not auto-start Execution
- Outcome source on ENT is educational copy, not durable fabrication
- Outcome does not establish causality
- No durable Learning writer added
- Unknowns remain unknown
- Routing precedence intact
- Writer audit has no unexplained writes
- TypeScript and production build pass
- Current-build live browser proof passes on :3003
