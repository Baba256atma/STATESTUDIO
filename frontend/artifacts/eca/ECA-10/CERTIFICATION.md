# NPA-T ECA:10 — Live Execution Dialogue & Deviation Intelligence

**Status: CERTIFIED**

Certification date: 2026-09-08
Runtime: `http://localhost:3025/executive` (isolated `?reset=1` journeys). Production `next start` on 3025 after `NODE_OPTIONS=--max-old-space-size=8192 npm run build`. Ports 3018–3024 from earlier ECA phases were not reused. The 3025 server started for this phase was stopped after Level 4.

Prerequisite ECA:1–9 remain certified. None were reopened or redesigned. ECA:11 was not started. ECA:10-FIX1 was not created.

## Verdict

**NPA-T ECA:10 — Live Execution Dialogue & Deviation Intelligence: CERTIFIED**

## Architecture questions

| Q | Required | Result |
| --- | --- | --- |
| Q1 Second Execution writer? | NO | PASS — no `ecaUpdateExecution`, `ecaSetProgress`, or ECA Execution store |
| Q2 Replace DTH:10? | NO | PASS — `replacesDth10: false`; Theatre `data-theatre-live-execution-state` remains |
| Q3 Background monitoring? | NO | PASS — `createsMonitoringDaemon: false`; no timers/polling |
| Q4 Live mode requires canonical live Execution? | YES | PASS — planned/ready/decision-only → `NOT_LIVE` |
| Q5 Progress without fake track status? | YES | PASS — missing baseline → `trackStatus: UNKNOWN` |
| Q6 Blocker and Risk distinct? | YES | PASS — `riskIsBlocker: false` |
| Q7 Deviation only from valid references? | YES | PASS — no baseline → no on-track/off-track |
| Q8 One primary attention item? | YES | PASS |
| Q9 ECA:3 remains initiative authority? | YES | PASS — `createsSecondInitiativeEngine: false`; ECA:10 is late-stage read-only |
| Q10 Execution complete ≠ Outcome? | YES | PASS — `writesOutcome: false`; completion language does not invent Outcome |
| Q11 Reassessment suggestion without Decision mutation? | YES | PASS — `commitsDecision: false` |
| Q12 Direct business writes? | NO | PASS — all ECA:10 writer flags false |

## Required certification matrix

| Gate | Result |
| --- | --- |
| Architecture reuse | PASS |
| CC:11 preservation | PASS |
| DTH:10 preservation | PASS |
| DTH:11 boundary | PASS |
| DTH:12 boundary | PASS |
| No second Execution writer | PASS |
| No monitoring daemon | PASS |
| Canonical live gate | PASS |
| Execution binding | PASS |
| Multiple Execution safety | PASS — binds Decision-linked CC:11 Execution only |
| Active-state recognition | PASS |
| Completion-state recognition | PASS — unit/sequence; live complete remains CC:11 confirmation-required |
| Progress interpretation | PASS |
| Reported/estimated progress safety | PASS |
| Baseline recognition | PASS — fixture `expectedProgress` only |
| No-baseline safety | PASS |
| Previous-observation handling | PASS |
| Deviation judgment | PASS |
| Favorable deviation | PASS |
| Unfavorable deviation | PASS |
| Mixed deviation | PASS |
| Unknown deviation | PASS |
| Materiality | PASS |
| Urgency/materiality separation | PASS — no health score |
| Track-status safety | PASS |
| On-track grounding | PASS |
| Off-track grounding | PASS |
| Blocker handling | PASS |
| Risk handling | PASS |
| Risk/blocker separation | PASS |
| New blocker intake boundary | PASS — write intent hands off; ECA:10 does not append |
| New Risk intake boundary | PASS |
| Data provenance | PASS |
| CAP_AV semantic safety | PASS |
| Evidence recency | PASS |
| Evidence conflict | PASS — consumes ECA:5; does not duplicate |
| What-changed | PASS |
| How-is-it-going | PASS |
| Are-we-on-track | PASS |
| What-needs-attention | PASS |
| What-is-blocking-us | PASS |
| Primary attention item | PASS |
| Acknowledgement suppression | PASS |
| No attention spam | PASS |
| ECA:3 initiative preservation | PASS |
| Read/write intent separation | PASS |
| Canonical execution mutation handoff | PASS |
| No mutation on read questions | PASS |
| Decision/recommendation separation | PASS |
| Execution/Outcome separation | PASS |
| Execution/Learning separation | PASS |
| Reassessment suggestion boundary | PASS |
| Refresh behavior | PASS — session overlay only |
| Stale-deviation prevention | PASS |
| Execution target-drift prevention | PASS |
| False-live barrier | PASS |
| False-deviation barrier | PASS |
| Trust-inflation barrier | PASS |
| Causality barrier | PASS |
| ECA:1 regression | PASS |
| ECA:2 regression | PASS |
| ECA:3 regression | PASS |
| ECA:4 regression | PASS |
| ECA:5 regression | PASS |
| ECA:6 regression | PASS |
| ECA:7 regression | PASS |
| ECA:8 regression | PASS |
| ECA:9 regression | PASS |
| NCA regression | PASS |
| NXA regression | PASS |
| DTH regression | PASS |
| CC:11 regression | PASS |
| Risk regression | PASS |
| Data regression | PASS |
| Outcome regression | PASS |
| Live Runtime | PASS |
| NXA funnel | PASS |
| TypeScript | PASS |
| ESLint | PASS — 0 errors; pre-existing `csvImportStoreVersion` warning untouched |
| Production build | PASS |
| git diff --check | PASS |

## Dependency direction

Certified orchestrator order is unchanged:

ECA:1 → ECA:2 → ECA:3 → ECA:4 → ECA:5 → ECA:6 → ECA:7 → ECA:8 → ECA:9 → **ECA:10**

ECA:10 is late-stage read-only. It does not call ECA:3. Initiative may consume live facts on a later turn. No ECA:3 → ECA:10 → ECA:3 cycle.

CC:11 remains the only Execution writer. DTH:10 remains Live Execution Theatre. DTH:11 remains Outcome Observation. DTH:12 remains Learning/Reassessment.

CC:11 `action: "start"` may create if none exists; that is canonical follow-up behavior, not an ECA:10 create/start collapse.

Canonical module: `judgeEcaLiveExecution` (`NPA-T ECA:10/LiveExecutionDialogueDeviationIntelligence`).

## Focused and multi-turn

A–T and sequences 1–8 pass in `ecaLiveExecution.test.ts`. Orchestrator runtime proofs pass in `ecaLiveExecution.runtime.test.ts`.

| Metric | Count |
| --- | --- |
| False live activations | 0 |
| False deviations | 0 |
| Fake on-track/off-track judgments | 0 |
| Reported→confirmed progress | 0 |
| Risk→blocker promotions | 0 |
| Blocker→cause inflation | 0 |
| Execution→Outcome inflation | 0 |
| CAP_AV semantic promotions | 0 |
| Duplicate unchanged attention | 0 |
| Low-value attention spam | 0 |
| Stale deviation judgments | 0 |
| Execution target drift | 0 |
| Direct ECA:10 business writes | 0 |
| Second Execution writer | 0 |
| Second live Theatre | 0 |
| Second initiative engine | 0 |
| Background monitoring | 0 |

## Live `/executive` sequences

Evidence: `frontend/artifacts/eca/ECA-10/live-proofs.json`.

Canonical commit/start used the existing DTH:10 theatre path (`show scenarios` → `Compare them.` → Approve Demand Surge → Start it.). Conversation-only “I choose outsourcing” does not by itself create an Approved Decision in this isolated reset shell; ECA:10 does not invent a Decision writer to compensate.

| Proof | Result |
| --- | --- |
| 1 Live gate | PASS — before start `NOT_LIVE`; after CC:11 start `ACTIVE`; writes=false |
| 2 Live summary | PASS — `ACTIVE`; writes=false; mutation-proposal lock can suppress overlay on “Update me.” |
| 3 Baseline safety | PASS — `track=UNKNOWN`; no fake off-track |
| 4 What changed | PASS — no prior observation; deviation `UNKNOWN`; no fake track |
| 5 Attention | PASS — blocker/Risk not conflated; initiative engine flag false |
| 6 CAP_AV | PASS — no capacity/off-track inflation |
| 7 Completion boundary | PASS — CC:11 complete remains confirmation-required (orchestrator does not pass `confirmed` on generic Yes); ECA:10 does not complete Execution; Outcome not invented |

Canonical progress/plan baseline is still absent on live Demand Surge Executions. Unit tests D/E/F inject `expectedProgress` / prior session observation. Live Runtime 4 therefore proves **no fake deviation**, not a fabricated schedule variance.

## Funnel

| Level | Result |
| --- | --- |
| NXA L1 | PASS |
| NXA L2 | PASS |
| NXA L3 | PASS |
| NXA L4 | 7/7 PASS |

## Stop

ECA:11 was not started. ECA:10-FIX1 was not created. Certified ECA:1–9 were not reopened.
