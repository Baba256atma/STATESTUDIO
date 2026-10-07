# NPA-T RIGHT-PANEL-POLISH:1-FIX1 — Executive Advisor Micro-Polish

## Verdict

**NPA-T RIGHT-PANEL-POLISH:1-FIX1 — CERTIFIED**

Presentation-only. RIGHT-PANEL-POLISH:1 hierarchy preserved. No new Advisor, tab, card, store, LLM call, or semantic owner.

## 1. Audit

Next Best Action was concatenated in **DTH:1/AdvisorGuidanceProjection**, not in the DTH:9 composer.

The projection used `uniqueSentences(copy.whatHappensNext, copy.startBoundary)`. Those are distinct fields:

- `whatHappensNext` — primary next step
- `startBoundary` — execution-start / viewing-does-not-start safety

The composer already kept them separate. The presentation seam incorrectly joined them into one recommendation string.

FIX1 presents only `whatHappensNext` as Next Best Action. `startBoundary` remains on `theatre.executionReadiness.advisorReadable.startBoundary`.

## 2. Production Changes

- `frontend/app/lib/decision-theatre/nexoraDecisionTheatreAdvisorGuidanceProjection.ts`
- `frontend/app/executive/nex-mvp/intelligence/NexoraAdvisorView.tsx`
- `frontend/app/executive/nex-mvp/NexoraAdvisorInsightRegion.tsx`
- `frontend/app/executive/nex-mvp/NexoraConversationalExperience.tsx`
- `frontend/app/lib/nex-mvp/nexoraRightPanelPolish1Fix1.test.tsx`
- `frontend/app/lib/nex-mvp/nexoraRightPanelPolish1.test.tsx`
- `frontend/app/lib/decision-theatre/nexoraDecisionTheatreStageGuidance1.test.tsx`
- `frontend/artifacts/right-panel-polish/RIGHT-PANEL-POLISH-1-FIX1/`

DTH composers, conversation authority, Stage, Objects, VIEW, ACTIONS, DTH:7, CEI, Report, Scene Evidence, Selected Object, Object Card, Details, and Right Panel tabs were not redesigned.

## 3. Next Best Action

**Before (live, RIGHT-PANEL-POLISH:1):**

Review what is known and unknown, then start execution only through an explicit start. Starting work requires an explicit start. Viewing this scene does not start execution.

**After (live, FIX1):**

Review what is known and unknown, then start execution only through an explicit start.

Source: existing `advisorReadable.whatHappensNext`. Not hardcoded. Not LLM-shortened.

## 4. Governance Preservation

- `advisorReadable.startBoundary` still holds “Starting work requires an explicit start. Viewing this scene does not start execution.”
- `advisorReadable.mustNotInfer` still holds committed ≠ started, unknown ≠ blocker, click does not start work.
- Conversation still answers DTH:9 from `whatHappensNext` / `hasStarted` / `readiness` (orchestrator unchanged).
- Primary NBA still includes the governed “explicit start” clause from `whatHappensNext`.

## 5. Density

When DTH workflow overlay is active:

- Investigation Priority and Needs Attention remain, marked `data-advisor-weight="secondary"`: no accent bar, smaller type, delayed after NBA.
- Duplicate readiness-dimension evidence paragraph is omitted when readiness rows already present those facts.
- Recent Change inside the Advisor view is omitted under overlay (it repeated attention).
- UX:1 `deferActions` is applied under overlay so “Investigate Risk” does not compete with Next Best Action.
- Conversation log: `data-advisor-history="true"`, muted 0.66rem type, 7rem max height.
- Ask Nexora unchanged and still rendered at the bottom.

No accordion, tabs, cards, or drawers.

## 6. Readiness Regression

Unchanged:

- Owner / Timing / Resources / Dependencies / Constraints / Risk
- Unknown → “Not established”
- Note: “Some readiness details are not established. That is not the same as a blocker.”

Live rows all `data-readiness-status="unknown"` with “Not established”.

## 7. Advisor State Regression

| State | Result |
| --- | --- |
| Executive Overview (no DTH overlay) | Existing priority / attention / situation; no fabricated readiness |
| Normal Object context | No DTH:9 readiness / NBA fabrication |
| DTH:8 Decision Review | Overlay remains; STAGE-GUIDANCE:1 A passed |
| DTH:9 Execution Readiness | Compact situation + rows + one NBA |
| DTH:10 Active Execution | Not formatted as readiness; STAGE-GUIDANCE:1 C passed |
| DTH:11 Outcome | STAGE-GUIDANCE:1 E passed |
| DTH:12 Learning | STAGE-GUIDANCE:1 F passed |
| UX:3 | Professional Advisor suite passed |

## 8. RIGHT-OBJECT Regression

`sceneOrgRightObject1.test.tsx` A–J passed. Object Card remains in Selected Object. Advisor tabs unchanged.

## 9. Stage Regression

DTH:8–12 Stage guidance cards remain unmounted. DTH:7 Comparison remains on Stage. VIEW / FOCUS remain Stage chrome. Live: `nexora-theatre-execution-readiness` absent.

## 10. Browser Proof

Live `http://localhost:3000/executive?reset=1` → compare → Approve Demand Surge → Assist.

**Before:** `artifacts/right-panel-polish/RIGHT-PANEL-POLISH-1-FIX1/before-execution-readiness.png` (RIGHT-PANEL-POLISH:1 live). NBA concatenated two safety sentences; Investigation Priority used an accent bar.

**After:** `artifacts/right-panel-polish/RIGHT-PANEL-POLISH-1-FIX1/after-execution-readiness.png`

First viewport: Current Subject → Executive Overview → Situation (Demand Surge · Committed Decision · Execution not started) → Readiness rows → one Next Best Action → secondary Investigation Priority (Capacity Gap) → Needs Attention (Risk) → history / Ask Nexora below.

`live-browser.json`: g1, g4, g5, g7, g11 true.

## 11. Test Results

Focused `tsx --test` (124 tests, 0 fail):

- `nexoraRightPanelPolish1Fix1.test.tsx`
- `nexoraRightPanelPolish1.test.tsx`
- `nexoraDecisionTheatreStageGuidance1.test.tsx`
- `nexoraExecutiveUx3ProfessionalAdvisor.test.ts`
- `sceneOrgRightObject1.test.tsx`
- DTH:8 `nexoraDecisionTheatreDecisionCommitment.test.ts`
- DTH:9 `nexoraDecisionTheatreExecutionReadiness.test.ts`
- DTH:10 `nexoraDecisionTheatreLiveExecution.test.ts`
- DTH:11 `nexoraDecisionTheatreOutcomeObservation.test.ts`
- DTH:12 `nexoraDecisionTheatreLearningReassessment.test.ts`

Live Playwright: `live-right-panel-polish1-fix1.mjs` ok.

Level 4 funnel was not run (not requested after this micro-polish).

## 12. Remaining Debt

Non-blocking:

- Live path still reaches Demand Surge rather than Expand Capacity after “Approve Expand Capacity” (same conversation/decision-write path as RIGHT-PANEL-POLISH:1). Execution Readiness semantics and first-viewport hierarchy are the same.
- `whatHappensNext` remains two clauses. Shortening further would invent copy or add an LLM step.
- Prepare disclosure and conversation context cue still sit below Needs Attention; they were not given a new disclosure system.
- `startBoundary` is not repeated in the Advisor first viewport; it remains on DTH `advisorReadable`.

## 13. Certification

NPA-T RIGHT-PANEL-POLISH:1-FIX1 — CERTIFIED
