# NPA-T RIGHT-PANEL-POLISH:1 — Executive Advisor Information Hierarchy

## Verdict

**NPA-T RIGHT-PANEL-POLISH:1 — CERTIFIED**

Presentation-only. Existing DTH/UX:3 facts unchanged.

## 1. Audit

Presentation owner: `NexoraAdvisorView` (UX:3). Narrative composer: `composeNexoraProfessionalAdvisorPresentation`. DTH overlay: `projectNexoraDecisionTheatreAdvisorGuidance` / `applyNexoraDecisionTheatreAdvisorGuidance` in `NexoraAdvisorInsightRegion`.

No parallel Advisor presenter was added. Hierarchy fields are derived from existing DTH `supportedDimensions`, `decisionTitle`, `readiness` enum, and advisorReadable sentences.

## 2. Root UX problem

Governed copy was concatenated into paragraphs (`owner is not established. timing is not established…`), so Situation, readiness, and next action were not scannable in 2–3 seconds.

## 3. Production changes

- `frontend/app/lib/decision-theatre/nexoraDecisionTheatreAdvisorGuidanceProjection.ts`
- `frontend/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts`
- `frontend/app/executive/nex-mvp/intelligence/NexoraAdvisorView.tsx`
- `frontend/app/executive/nex-mvp/NexoraAdvisorInsightRegion.tsx` (pass existing `theatreGuidance` into the view)
- `frontend/app/lib/nex-mvp/nexoraRightPanelPolish1.test.tsx`
- `frontend/artifacts/right-panel-polish/RIGHT-PANEL-POLISH-1/`

## 4. Architecture check

No new Advisor, tab, store, readiness model, or workflow authority. DTH composers unchanged.

## 5. Information hierarchy

**Before:** Subject → Investigation Priority prose → Needs Attention → Situation paragraph → Why paragraph of dimension sentences → Recommendation.

**After (DTH guidance):** Subject → Situation (compact) → Readiness rows → Next Best Action → supporting Why / Overview priority.

**After (no DTH guidance):** existing Subject → Overview priority → Attention → Situation order, without fabricated readiness.

## 6. Situation

DTH:9 displays `Committed Decision · Execution not started` from the existing readiness enum + not-started fact. Headline repeats the decision title only when it differs from Current Subject.

## 7. Attention / Readiness

`supportedDimensions` render as Owner / Timing / Resources / Dependencies / Constraints / Risk rows. `unknown` → **Not established** (muted). `blocked` → Blocked (existing warning token). Caption: “That is not the same as a blocker.”

## 8. Next Best Action

Existing `recommendation` field, heading **Next Best Action** when DTH guidance is present; otherwise existing “Nexora Recommendation”. Empty recommendation is not invented.

## 9. Supporting detail

Dimension prose is stripped from Why when rows exist. Remaining Why sits below a subtle separator. Investigation Priority / Needs Attention remain, after workflow when DTH overlay is active.

## 10. Semantic fidelity

Unknown is not Blocked. No Ready/Complete inferred. Projection `writesBusinessState: false`.

## 11. DTH lifecycle

STAGE-GUIDANCE:1 A–G still pass. Polish C–E: live/outcome/learning do not mount readiness rows.

## 12. RIGHT-OBJECT

Selected Object tab / Object Card owner unchanged.

## 13. Stage

VIEW/ACTIONS/Theatre/comparison unmounts unchanged.

## 14. Conversation

`nexora-advisor-ask` remains. Live Ask Nexora present.

## 15. Browser UX proof

Live `/executive?reset=1` after Approve Demand Surge:

- Situation: `Committed Decision · Execution not started`
- Six unknown rows: Not established
- Next Best Action from existing DTH recommendation
- Screenshot: `artifacts/right-panel-polish/RIGHT-PANEL-POLISH-1/after-execution-readiness.png`
- Before: STAGE-GUIDANCE:1 prose Situation/Why (`live-advisor.png`)

## 16. Test results

- RIGHT-PANEL-POLISH:1 A–F + ownership: 7/7
- STAGE-GUIDANCE:1: 8/8
- UX:3: pass
- Combined polish+STAGE-GUIDANCE+UX:3: 28/28
- DTH:10–12 + EXI:4: 78/78
- Live proof: ok

## 17. Remaining debt

Next Best Action still concatenates two existing DTH sentences (`whatHappensNext` + `startBoundary`). Conversation history below Ask Nexora remains long (exempt). After commit, Current Subject can still show Executive Overview when Stage focus is none.

## 18. Certification

NPA-T RIGHT-PANEL-POLISH:1 — CERTIFIED
