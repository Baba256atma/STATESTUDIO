# NPA-T STAGE-GUIDANCE:1 — Relocate DTH Workflow Guidance to Existing Advisor

## Verdict

**NPA-T STAGE-GUIDANCE:1 — CERTIFIED**

Presentation relocation only. DTH composers remain semantic owners. No new Advisor, tab, store, workflow engine, or Stage layout system.

## 1. Audit (HEAD)

| Phase | Stage component (before) | Composer | advisorReadable | Existing Advisor consumer | Stage mount (after) |
|---|---|---|---|---|---|
| DTH:8 | `NexoraDecisionTheatreCommitmentSurface` | `nexoraDecisionTheatreDecisionCommitmentComposer` | `theatre.advisorReadable.commitment` | Conversation Q&A + **new overlay onto UX:3 Situation/Why/Recommendation** | unmounted |
| DTH:9 | `NexoraDecisionTheatreExecutionReadinessSurface` | `nexoraDecisionTheatreExecutionReadinessComposer` | `theatre.advisorReadable.executionReadiness` | same | unmounted |
| DTH:10 | `NexoraDecisionTheatreLiveExecutionSurface` | `nexoraDecisionTheatreLiveExecutionComposer` | `theatre.advisorReadable.liveExecution` | same | unmounted |
| DTH:11 | `NexoraDecisionTheatreOutcomeObservationSurface` | `nexoraDecisionTheatreOutcomeObservationComposer` | `theatre.advisorReadable.outcomeObservation` | same | unmounted |
| DTH:12 | `NexoraDecisionTheatreLearningReassessmentSurface` | `nexoraDecisionTheatreLearningReassessmentComposer` | `theatre.advisorReadable.learningReassessment` | same | unmounted |
| DTH:7 | `NexoraDecisionTheatreComparisonSurface` | comparison composer | `theatre.advisorReadable.comparison` | Theatre / conversation | **still mounted** |

Mutex for Advisor overlay (existing DTH lifecycle, last applicable wins): learning (sufficient) → outcome → live → readiness → commitment.

Projection identity: `DTH:1/AdvisorGuidanceProjection`. `writesBusinessState: false`.

## 2. Root problem

DTH:8–12 were a mutually exclusive hardcoded top-right Stage family (~272px), outside STAGE-PROD overlay and SCENE-ORG 0–3. They were textual executive guidance, not spatial Theatre.

RIGHT-OBJECT:1 moved the Object Card into the existing Selected Object tab and set overlay investigation false. That vacated the same corner, so Execution Readiness became newly visible and covered Objects/relationships.

## 3. Production changes (this phase)

- `frontend/app/lib/decision-theatre/nexoraDecisionTheatreAdvisorGuidanceProjection.ts` — map existing advisorReadable onto existing Advisor narrative fields
- `frontend/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts` — export projection
- `frontend/app/executive/nex-mvp/NexoraStageMount.tsx` — unmount DTH:8–12 surfaces; keep DTH:7 Comparison
- `frontend/app/executive/nex-mvp/NexoraAdvisorInsightRegion.tsx` — apply projection onto existing Situation/Why/Recommendation
- `frontend/app/lib/decision-theatre/nexoraDecisionTheatreStageGuidance1.test.tsx`
- `frontend/artifacts/stage-guidance/STAGE-GUIDANCE-1/*`

Composers, CC:10R, CC:11, Outcome, Learning, ACTIONS, RIGHT-OBJECT Object Card, ComparisonSurface: not rewritten.

## 4. Duplicate-authority check

No new Advisor, Right Panel, tab, workflow card, DTH family, engine, conversation path, store, readiness model, or Stage layout system.

Surface files for DTH:8–12 remain in the repo unused by Stage mount.

## 5. Stage result

Persistent Stage cards removed: DTH:8 Commitment, DTH:9 Execution Readiness, DTH:10 Live Execution, DTH:11 Outcome Observation, DTH:12 Learning Reassessment.

DTH:7 Comparison remains.

## 6. Advisor result

Existing Right Panel **Advisor** tab overlays UX:3 Situation / Why it matters / Recommendation / evidence from `projectNexoraDecisionTheatreAdvisorGuidance`. Manager-facing copy. Diagnostic `data-theatre-advisor-guidance` is not shown as copy.

## 7. Execution Readiness proof

Live `/executive?reset=1`:

- Decision state `COMMITTED` (`cc10:decision:ctx-scenario-demand` / Demand Surge)
- DTH:9 readiness `COMMITTED_AWAITING_EXECUTION`
- `executionId` none
- Stage `nexora-theatre-execution-readiness` **absent**
- Advisor `data-theatre-advisor-guidance="execution-readiness"`
- Situation: “Demand Surge is the committed Decision. The Theatre is now showing what is needed before execution begins. No. The decision is approved, but execution has not started.”
- Conversation: “Has execution started?” → “No. The decision is approved, but execution has not started.”

Expand Capacity (`ctx-decision-capacity`) review journey: no DTH:8–12 overlay; Stage object bounds `{left:74.9, top:323.7, width:70.6, height:41.3}` do not intersect the former 272px top-right card region.

## 8. Workflow lifecycle proof

- A DTH:8 — Stage commitment card absent; Advisor receives commitment advisorReadable when composer is active
- B DTH:9 — Stage ER card absent; owner/timing/resources/dependencies remain composer unknowns
- C Start — still conversation / CC:11 (`Start it.`), not Advisor presentation
- D DTH:10 — Stage live card absent; Advisor live copy
- E DTH:11 — Stage outcome card absent; Advisor observation/learning mutex
- F DTH:12 — Stage learning card absent when supported
- G DTH:7 — Comparison still Stage

## 9. DTH:7 comparison regression

Live: `show scenarios` → `Compare them.` → `comparisonDom: true`. Unit G preserved.

## 10. VIEW/ACTIONS regression

Live Expand Capacity: `viewDom` true, Actions radio present. Focused tests: `NexoraPresentationStateSelector` + RIGHT-OBJECT D/E. ACTIONS not moved.

## 11. RIGHT-OBJECT regression

Live Expand Capacity tab: Object Card host `right-panel`, Stage investigation card false. Tabs remain Advisor | Details | Expand Capacity.

## 12. Report / Evidence / Chart regression

Untouched owners. STAGE-LAYOUT:1 + RIGHT-OBJECT F/G + DTH-EXP:7A still pass. Scene Evidence remained on Expand Capacity Stage (`Scene evidence` heading).

## 13. Object visibility

Former DTH:8–12 overlay ∩ Stage object visibility = 0 because those overlays are not mounted (`formerGuidanceOverlayMounted: false`). Expand Capacity Stage control remains in the left/center object field, not under the old top-right card.

## 14. Truth / governance

Decision → CC:10 / existing Decision authority. Execution → CC:11. Outcome / Learning unchanged. DTH = composition. Advisor = presentation overlay. Projection `writesBusinessState: false`.

## 15. Regression results

| Suite | Result |
|---|---|
| `nexoraDecisionTheatreStageGuidance1.test.tsx` | 8/8 |
| DTH:7–12 composers + STAGE-GUIDANCE + RIGHT-OBJECT:1 + VIEW/ACTIONS + STAGE-LAYOUT:1 | 141/141 |
| UX:3 Advisor + STAGE advisor/stage sync + DTH-EXP:7A | 68/68 |
| Live `/executive` | ok |

## 16. Remaining debt

- Embedded-browser “Yes” commit on Expand Capacity is a Decision write and was not completed in the Cursor tab; DTH:9 live used the certified Demand Surge approve path. Expand Capacity review still proved Stage-card absence and Selected Object Card.
- DTH:8–12 Stage surface components remain on disk unused.
- `data-nex-exp7-committed` stayed `"false"` while Theatre `decisionState` was `COMMITTED` — pre-existing diagnostic seam, not used as authority.

## 17. Certification

NPA-T STAGE-GUIDANCE:1 — CERTIFIED
