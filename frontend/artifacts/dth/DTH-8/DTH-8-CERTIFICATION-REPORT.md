# DTH:8 Certification Report

Nexora Decision Theatre Decision Commitment Experience on certified DTH:1–7 `/executive`.

## Verdict

**DTH:8 = CERTIFIED**

No DTH:8-owned failure remains. DTH:9 was not started.

## Architecture

See `ARCHITECTURE-INSPECTION.md`.

Decision review is a read-only Theatre projection. Canonical Decisions remain CC:10 / CC:10R. DTH:8 does not invent candidates, recommendations, evidence, or Execution.

## Reused authorities

DTH:1–7 Theatre projection, DTH:7 comparison membership, DTH:6 investigation, NEX-MVP:4 click/focus, CC:10 / CC:10R Decision commitment, CC:11 Execution (left unavailable), HUD panel width tokens, existing Advisor/NCA path.

## Created files

- `app/lib/decision-theatre/nexoraDecisionTheatreDecisionCommitment.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreDecisionCommitmentRegistry.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreDecisionCommitmentComposer.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreDecisionCommitment.test.ts`
- `app/executive/nex-mvp/stage/NexoraDecisionTheatreCommitmentSurface.tsx`
- `artifacts/dth/DTH-8/*`

## Modified files

Theatre contract (supported `decision-commitment`; reserved list still length 7), Stage compatibility, Advisor-readable context, diagnostics, invariants, Director boundary, public index, DTH:7 comparison (`PROCEED_TO_DECISION` opens review, still `writes.decisionState === false`), conversational orchestrator (catalog scenario candidates for CC:10 when no CC:9 session; review overlays), CC:10 resolver, Executive shell (review state, commit utterance, Decision revision tick), Stage mount (commitment overlay + developer attributes).

## Commitment contract

Identity `DTH:8/DecisionCommitment`, version `1.0.0`. Stable IDs `dth8-commitment:<scriptId>:<candidateId>:<state>`. States: `REVIEWING | READY_TO_COMMIT | COMMITTED | BLOCKED`. Read-oriented. `PROCEED_TO_EXECUTION` is always unavailable.

## Candidate source

Review candidates are DTH:7 comparison members. `/executive` catalog scenarios (for example Demand Surge) commit through CC:10 as conversation-source candidates with `scenarioId` equal to the catalog subject id. No second Decision store.

## Decision review behavior

Review choice opens REVIEWING with no authoritative Decision id. Cancel returns to the same DTH:7 comparison (live: 3 members). Changing candidate before commit updates the proposed id (live: Pricing Response → Demand Surge).

## Explicit commitment behavior

Approve routes `Approve ${label}` into CC:10. Live: `Approve Demand Surge` produced exactly one CC:10R Decision `cc10:decision:ctx-scenario-demand`. Repeated presentation does not mint a second Decision.

`data-nex-exp7-committed` stayed `false` because that flag is NEX-EXP:7 entrance-workspace, not CC:10R on existing `/executive`. Theatre `data-theatre-decision-authoritative-id` is the live Decision identity.

## Recommendation separation

Recommendation copy remains distinct from manager approval until CC:10 applies. Displaying a recommendation does not create a Decision.

## Evidence / assumption / uncertainty safety

Live evidence: “Nexora does not yet have enough evidence to determine this. Choosing it would not make the evidence certain.” Uncertainty named unavailable Cost/Time. Commitment did not rewrite unknowns as zero or as guaranteed success.

## DTH:6 integration

Clicking Pricing Response opened investigation; no Decision. Close restored comparison. Changing candidate focuses the option via NEX-MVP:4 (investigation may appear; review contract remains REVIEWING until commit).

## DTH:7 integration

Comparison of 3 catalog scenarios after “Compare them.” Cancel restored comparison DOM and member count 3.

## Decision object creation

CC:10R `listDecisions()` after live commit: one Approved record for Demand Surge.

## Decision provenance

Theatre presents Goal/Problem from DTH:7 when present, selected candidate, originating comparison id, and CC:10R Decision id after commit.

## Decision → Execution separation

Live `executionStarted` remained `false`. Advisor: “The next step is execution planning when you explicitly start it. Work has not started automatically.” `PROCEED_TO_EXECUTION` unavailable.

## Advisor integration

Live: “Have I already made the decision?” → still reviewing, not a Decision. After commit: Demand Surge is the Approved decision. “What happens next?” did not imply work started. Chat DOM still prefixes “Nexora” onto replies (pre-existing). Live “What are the trade-offs?” used the existing scenario/NCA explanation path rather than the DTH:8 trade-off sentence; it did not invent scores.

## Negative tests

A–R covered in `nexoraDecisionTheatreDecisionCommitment.test.ts` (14 tests) plus CC:10 catalog commit.

## Regression gates

| Gate | Result |
|---|---|
| DTH:1–8 combined | EXIT 0 — 94/94 |
| DTH:8 focused | EXIT 0 — 14/14 |
| Scene | EXIT 0 — 296/296 |
| Stage / Director / shell | EXIT 0 |
| Manager–Object | EXIT 0 |
| Conversation | EXIT 0 — 336 |
| NEX-EXP / Decision / intelligence | EXIT 0 — 240 |
| Assistant overflow | EXIT 0 — 22 |
| npm test executive | EXIT 0 — 81/81 |
| TypeScript | EXIT 0 |
| ESLint (DTH:8 surfaces) | EXIT 0 |
| Production build | EXIT 0 |
| git diff --check | EXIT 0 |
| Live `/executive` | ok true — http://localhost:3021/executive |

## Live /executive proof

Port 3021 production runtime. Comparison count 3. Click Pricing Response: no Decision. Review: REVIEWING. Cancel: comparison restored. Switch to Demand Surge. Have I decided: no. Approve Demand Surge: `cc10:decision:ctx-scenario-demand`, COMMITTED, Execution not started.

Screenshots: `live-comparison.png`, `live-review.png`, `live-committed.png`, `live-stage.png`. JSON: `live-browser.json`.

## Known failures

None owned by DTH:8.

## Final verdict

DTH:8 = CERTIFIED
