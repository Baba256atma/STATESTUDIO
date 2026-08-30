# DTH:5 Certification Report

Nexora Decision Theatre Scene Intent and Scene Script on certified DTH:1–4 `/executive`.

## Verdict

**DTH:5 = CERTIFIED**

No DTH:5-owned failure remains. DTH:6 was not started.

## Architecture

See `ARCHITECTURE-INSPECTION.md`.

Scene Intent is the visual-purpose projection of already-resolved meaning. Scene Script is the renderer-neutral instruction for how existing participants form that scene. Neither is a second NLU, Director, Stage, or executive-truth store.

## Reused authorities

DTH:1–4, CC:1, FINAL:6.1–6.3, NCA-POST:3–4, NXA-5 FIX4/FIX5, MO:5 journey, DIR:1, NEX-MVP Stage, Advisor-readable Theatre context.

## Created files

- `app/lib/decision-theatre/nexoraDecisionTheatreSceneIntent.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreSceneIntentRegistry.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreSceneSemanticInput.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreSceneIntentResolver.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreSceneActorRoles.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreSceneScript.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreSceneScriptComposer.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreSceneIntent.test.ts`
- `artifacts/dth/DTH-5/*`

## Modified files

Theatre contract (scene-intent and scene-script supported), Stage compatibility, Advisor context, diagnostics, invariants, Director boundary, public index, DTH:1/DTH:3/DTH:4 tests, conversational orchestrator (passes already-resolved semantic input), Executive shell, Stage mount (developer data attributes only).

## Scene Intent contract

Version `1.0.0`, identity `DTH:5/SceneIntent`. Deterministic `sceneIntentId`. Consumes `NexoraDecisionTheatreSceneSemanticInput` only. `parsedRawManagerText: false`. Mutation permission is one of `NO_CHANGE`, `PRESERVE_AND_EXPLAIN`, `RECOMPOSE_EXISTING`, `CLARIFY_WITHOUT_CHANGE`. Safe fallback `PRESERVE_SCENE`.

## Scene Intent registry

`PRESERVE_SCENE`, `ORIENT_TO_STAGE`, `REVIEW_FOCAL_OBJECT`, `REVIEW_COLLECTION`, `INVESTIGATE_CONDITION`, `COMPARE_CANDIDATES`, `REVIEW_CONSEQUENCE`, `REVIEW_COMMITMENT`, `REVIEW_EXECUTION`, `REVIEW_OUTCOME`, `CLARIFY_SCENE`.

## Precedence

Pending clarification (unless explicit correction) → explicit named entity/action → collection request → resolved comparison → focal object → active collection → journey → safe preservation / orientation.

Unknown entities do not become anchors. Observations do not become consequence or Scenario intent. Unsupported reserved Theatre requests preserve Stage.

## Scene Script contract

Version `1.0.0`, identity `DTH:5/SceneScript`. Stable `scriptId` from canonical fields (no timestamp/random). Actor roles are presentation-only. Iconics require an included owner. Relationships remain non-causal unless DTH:1 says otherwise (always `unsupported` in current Stage projection). Atmosphere is referenced from DTH:4, never selected. Transition policy is renderer-neutral.

## Advisor

`advisorReadable.scene` explains question, anchor, actors, roles, relationships, iconic presence, unavailable later capabilities, and must-not-infer rules without architecture terms.

## Live application

Fresh production: `npx next start -p 3017` → `http://localhost:3017/executive`.

- Overview Scene Intent `ORIENT_TO_STAGE`; Script IDs `dth5-script:…`
- Click-to-center `obj-revenue` → `REVIEW_FOCAL_OBJECT`; Back/Forward restore matching scripts; Escape/Overview return to orientation
- Collections: problems/scenarios/decisions/executions → `REVIEW_COLLECTION`, membership preserved, no Cards/NexoSelect/NexoCompare/NexoTime
- Ambiguous “important” asks one clarification; Stage collection preserved
- Atmosphere remains `none` (DTH:4 still owns atmosphere)
- Iconic count `0` on live (honest empty)
- No page/console/hydration errors; no architecture leak in Advisor replies

Shell reconstructs Scene Intent from Stage when conversation semantic input is not on the render path. Conversation-path intent (including Compare / Investigate from resolved meaning) is certified by orchestrator-fed fixtures and `executeNexoraConversationalExperience`. After an execution collection, live “what may be preventing the Goal?” did not complete as a Goal investigation and Stage stayed preserved.

## Automated tests

| Gate | Result |
|---|---|
| DTH:5 focused | EXIT 0 — 8/8 |
| DTH:1–5 combined | EXIT 0 — 53/53 |
| `npm run test:scene` | EXIT 0 — Vitest 180/180, node 296/296 |
| Stage + Director | EXIT 0 — 50/50 |
| Manager–Object (includes NCA/POST/NXA) | EXIT 0 — 563/563 |
| Conversation | EXIT 0 — 336/336 |
| NEX-EXP + Decision/Execution | EXIT 0 — 180/180 |
| Assistant overflow | EXIT 0 |
| `npm test` | EXIT 0 — 81/81 |
| TypeScript | EXIT 0 |
| Production Build | EXIT 0 |
| ESLint | 0 errors, 483 pre-existing warnings |
| `git diff --check` | EXIT 0 |
| Live browser | `live-browser.json` ok |

## Deferred

DTH:6 Cards/Charts, NexoLens, NexoSelect, NexoCompare, NexoTime, Visual Behavior Engine, theatre-aware Advisor suggestions.

## Known failures

None owned by DTH:5.

## Final certification verdict

**DTH:5 = CERTIFIED**

Do not begin DTH:6.
