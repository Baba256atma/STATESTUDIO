# DTH:6 Certification Report

Nexora Decision Theatre Object Investigation Experience on certified DTH:1–5 `/executive`.

## Verdict

**DTH:6 = CERTIFIED**

No DTH:6-owned failure remains. DTH:7 was not started.

## Architecture

See `ARCHITECTURE-INSPECTION.md`.

Investigation is a read-only Theatre presentation of the currently selected or focused Stage object. It does not own Stage, Scene Intent, Scene Script, evidence, relationships, Decision/Execution, or Advisor.

## Reused authorities

DTH:1–5 Theatre projection, NEX-MVP:4 click/focus/selection, MO:2 Explain Engine, existing CC/NCA dialogue path, HUD panel width tokens, DTH:2 Iconic honesty, NCA-POST:4 comparison members when Scene Intent is `COMPARE_CANDIDATES`.

## Created files

- `app/lib/decision-theatre/nexoraDecisionTheatreObjectInvestigation.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreObjectInvestigationRegistry.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreObjectInvestigationComposer.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreObjectInvestigation.test.ts`
- `app/executive/nex-mvp/stage/NexoraDecisionTheatreInvestigationSurface.tsx`
- `artifacts/dth/DTH-6/*`

## Modified files

Theatre contract (supported `object-investigation`; reserved list still length 7), Stage compatibility (two-pass investigation attach), Advisor-readable context, diagnostics, invariants, Director boundary, public index, DTH:1/DTH:4/DTH:5 tests, conversational orchestrator (investigation level + comparison continuity copy), Executive shell (overlay dismiss without Stage mutation), Stage mount (developer attributes + overlay host).

## Investigation contract

Identity `DTH:6/ObjectInvestigation`, version `1.0.0`. Stable IDs `dth6-investigation:<scriptId>:<objectId>:<level>:<family>`. Read-oriented. `inventedEvidence`, `inventedCausality`, `manufacturedComparison`, `mutatedStage` are always false.

Progressive levels: glance → understand → investigate. Actions: `EXPLAIN_OBJECT`, `SHOW_EVIDENCE`, `SHOW_RELATIONSHIPS`, `SHOW_HISTORY`, `SHOW_DECISION_RELEVANCE`, `COMPARE_RELATED`, `RETURN_TO_SCENE`. History is unavailable without temporal authority. Close dismisses overlay only.

## Object-type investigation behavior

Presentation priorities from the registry (Problem, Scenario, Decision, Execution, KPI, and others). Copy uses manager language. Missing cost/time/history stay null/`unavailable`/`unknown`, never `0`.

## Advisor integration

Focused/selected Stage object is the investigation anchor. “Explain this.” uses the later selected object. “What evidence supports it?” uses the existing investigation/explain path. “Compare it with the other one.” does not manufacture a singleton comparison; when Scene Intent is `COMPARE_CANDIDATES`, comparison members remain on the investigation contract.

Suggested questions are generated only from available context on the investigation surface (not DTH:11).

## Scene preservation proof

Projecting investigation does not mutate Stage JSON. Live: close overlay keeps the same Scene Script ID and focal object; overlay DOM is removed.

## Comparison preservation proof

With resolved `COMPARE_CANDIDATES` members A/B, investigating A sets `comparisonPreserved`. A singleton COMPARE request does not create comparison. Live: after selecting Scenario A, compare-utterance keeps focus on A; Scenario collection of three members was shown immediately before.

## Evidence-safety proof

Missing evidence does not enable `SHOW_EVIDENCE` and Advisor copy states insufficient evidence. Association language is not upgraded to cause. Live cost ask did not fabricate zero.

## Negative tests

A–J in `nexoraDecisionTheatreObjectInvestigation.test.ts` (12 tests including contract/diagnostics).

## Regression gates

| Gate | Result |
|---|---|
| DTH:1–6 combined | EXIT 0 — 65/65 |
| DTH:6 focused | EXIT 0 — 12/12 |
| `npm run test:scene` | EXIT 0 — Vitest 180/180, node 296/296 |
| Stage + Director + shell | EXIT 0 — 54/54 |
| Manager–Object | EXIT 0 — 563/563 |
| Conversation | EXIT 0 — 336/336 |
| NEX-EXP + Decision/Execution (extended set) | EXIT 0 — 378/378 |
| Assistant overflow | EXIT 0 |
| `npm test` | EXIT 0 — 81/81 |
| TypeScript | EXIT 0 |
| Production Build | EXIT 0 |
| ESLint (DTH:6 surfaces) | 0 errors |
| `git diff --check` | EXIT 0 |
| Live browser | `live-browser.json` ok |

## Live /executive proof

Fresh production: `npx next start -p 3018` → `http://localhost:3018/executive`.

1. Theatre Scene `ORIENT_TO_STAGE`
2. Show problems → select Margin Pressure
3. Investigation overlay opens (`problem`); Scene Script unchanged on close
4. “Explain this.” remains on Margin Pressure
5. “What evidence supports it?” answered without architecture terms
6. Close hides overlay; focus/script remain
7. Show scenarios (three members)
8. Select Pricing Response
9. “Compare it with the other one.” keeps Pricing Response focused
10. Select Capacity Expansion execution; type `execution`
11. Cost ask did not report zero

Screenshot: `live-stage.png`. Ports 3015/3017 were left running (not started by this phase).

## Deferred

DTH:7 visual behavior, Cards/Charts investigation, NexoLens, NexoSelect, NexoCompare, NexoTime, theatre-aware Advisor suggestion engine.

## Known failures

None owned by DTH:6.

Chat DOM scrape prefixes “Nexora” onto Advisor text (`nexora-conversational-message-nexora`); that is pre-existing markup, not architecture leak.

## Final certification verdict

**DTH:6 = CERTIFIED**

Do not begin DTH:7.
