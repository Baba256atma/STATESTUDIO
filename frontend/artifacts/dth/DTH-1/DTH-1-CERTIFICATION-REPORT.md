# DTH:1 Certification Report

Nexora Decision Theatre Foundation on the existing `/executive` experience.

## Verdict

**DTH:1 = CERTIFIED**

Decision Theatre is a renderer-neutral projection over the existing Action → Runtime → Director → Stage path. One Stage, one Director, one Runtime. No DTH:2 work was started.

## 1. Architecture inspection

See `ARCHITECTURE-INSPECTION.md`.

Canonical flow:

Manager interaction or conversation → canonical intent/context → existing Runtime → DIR:1 → Decision Theatre projection → existing Stage renderer → Advisor explanation.

## 2. Reused authorities

Stage (NEX-MVP:3/4), DIR:1, CC:1–5/10/11, Advisor composer, MO, NEX-EXP, Queue collections, STAGE-2D camera, HUD contracts, REX-2 identity only. No second store.

## 3. Created and modified files

Created:

- `app/lib/decision-theatre/nexoraDecisionTheatreContract.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreStageCompatibility.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreInvariants.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreDirectorBoundary.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreAdvisorContext.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreDiagnostics.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreFoundation.test.ts`
- `artifacts/dth/DTH-1/*`

Modified (compatibility only):

- `app/lib/conversational-control/conversationalExperience.ts` — optional `decisionTheatre` field
- `app/lib/conversational-control/conversationalExperienceOrchestrator.ts` — project after DIR:1 apply
- `app/lib/runtime/diagnosticSwitch.ts` (+ test) — default-off `dthDecisionTheatre`

No Stage renderer, HUD, artwork, or Advisor-reply redesign.

## 4. Foundation contract

Identity `DTH:1/DecisionTheatreFoundation` version `1.0.0`. Immutable, serializable, deterministic. Distinguishes runtime truth, semantic meaning, Director presentation, renderer state, Advisor explanation, and manager interaction. Future capabilities are reserved, not faked.

## 5. Authority ownership

| Concept | Owner | Theatre |
|---|---|---|
| Business / object truth | Runtime | Read |
| Decision / Execution mutation | CC:10 / CC:11 | `writes = false` |
| Outcome / Learning | NEX-EXP | `writes = false` |
| Evidence | Existing evidence authorities | Presentation does not create evidence |
| Presentation plan | DIR:1 | Read after apply |
| Stage navigation | NEX-MVP:4 | Read |
| Advisor replies | Existing Advisor | Read-only summary only |
| Theatre projection | DTH:1 adapter | Derived, removable |

## 6. Compatibility mapping

`projectNexoraDecisionTheatreFoundation` calls `deriveNexoraMVPStageInteractionPresentation` with `consultExecutiveChangeSessionStore: false`. Canonical object IDs, focus vs selection, visibility, presentation level, attention, and semantic relations are copied. Empty/unsupported requests keep the current Stage. Adapter is not a parallel authority.

## 7. Capability support

Supported: existing Stage projection, object actors, focus/selection split, relationships, visibility, presentation level, attention, one-hop disclosure, collections, navigation identity, Advisor-readable summary, diagnostics.

Reserved / unsupported (no UI): iconic vs executive object language, NexoGraph, War Room, Scene Intent, Scene Script, Visual Behavior Engine, cards/charts, NexoLens, NexoSelect, NexoCompare, NexoTime/replay, Theatre-aware Advisor suggestions.

## 8. Invariants

Encoded in `NEXORA_DECISION_THEATRE_INVARIANTS` and `NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY`. Director may not create facts, confirm causes, approve Decisions, start Executions, or invent visual meaning. Scene Intent / Scene Script are not implemented.

## 9. Diagnostics

`inspectNexoraDecisionTheatreProjection` / `emitNexoraDecisionTheatreDiagnostics`. Console scope `dthDecisionTheatre` is default-off. Live run: no DTH-attributed console errors; no architecture codes in Advisor replies.

## 10. Automated tests (DTH:1 owning layer)

| Gate | Result |
|---|---|
| DTH:1 focused tests | PASS (15/15) |
| DIR:1 semantic Director | PASS |
| NEX-MVP:3 Stage + NEX-MVP:4 interaction | PASS |
| CC conversational-control + NEX-EXP + Stage interaction | PASS (506/506 with DIR/DTH) |
| Manager–Object | PASS (563/563) |
| TypeScript `npm run typecheck` | PASS (exit 0) |
| Production `npm run build` | PASS (exit 0) |
| ESLint on DTH:1 surface | PASS |
| `git diff --check` on DTH:1 files | PASS |

## 11. Runtime proof

Clean production server `next start --port 3011` (not the existing locked `.next/dev` instance).

- Stage loaded overview; objects rendered
- Object click `obj-revenue` focused and centered composition
- Back returned to overview; Escape remained overview
- Show problems / scenarios / decisions / executions presented collections without Decision/Execution writes
- Explain it and comparison question did not clear Stage
- Unsupported “show the NexoGraph” preserved collection Stage
- Refresh `show problems` restored the Problems collection (2 members)
- `pageErrors` empty; no DTH console errors; no hydration/export errors
- Screenshot: `live-stage.png`; structured: `live-browser.json`

## 12. Known failures

None in the DTH:1, Director, Stage, conversational-control, Manager–Object, or NEX-EXP gates above.

A HUD vitest compact-width `visibleOverlap` flag remains a HUD-BUILD layout-audit signal (panel-specific collisions false). It is not a Theatre projection or Stage-renderer failure.

## 13. Remaining future DTH capabilities

All reserved capabilities in section 7. DTH:2 was not started.

## 14. Stop condition

DTH:1 foundation, adapter, invariants, Director boundary, Advisor-readable context, diagnostics, tests, TypeScript, production build, lint, diff-check, and live `/executive` proof are complete.

**DTH:1 = CERTIFIED**
