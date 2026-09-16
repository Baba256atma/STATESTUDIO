# NPA-T VAI:6 — Director Impact Scene

**Status: CERTIFIED**

Date: 2026-09-16.

Stop. Do not start VAI:7.

## Status

**NPA-T VAI:6 — CERTIFIED**

## Architecture inspected

DIR:1, DTH:1–5 Scene Intent/Script (`INVESTIGATE_CONDITION`), HUD zone IDs, VAI:1–5, CC:5 optional bundle boundary.

## VAI:1–5 contracts reused

Variables, roles, causal ladder, VAI:5 symbols/connectors, VAI:4 composition for explanation and inspection.

## DTH/DIR authorities reused

Existing Director remains sole presentation Director. Impact purpose maps to DTH `INVESTIGATE_CONDITION`. HUD reserved bands used for placement clamps. No parallel Stage.

## Files created

- `frontend/app/lib/vai/vaiImpactIdentity.ts`
- `frontend/app/lib/vai/vaiImpactContract.ts`
- `frontend/app/lib/vai/vaiImpactComposer.ts`
- `frontend/app/lib/vai/vaiImpactDiagnostics.ts`
- `frontend/app/lib/vai/vaiImpactScene.test.ts`
- `frontend/artifacts/vai/VAI-6/*`

## Files modified

- `vaiAdvisorIntent.ts` — “explain this impact map”
- CC:5 experience types + orchestrator optional `vaiImpactScene`

## Impact Scene intent/contract

`IMPACT_ANALYSIS` presentation intent; theatre kind `INVESTIGATE_CONDITION`. Arrange only; do not calculate impact.

## Scene input contract

Requires a legitimate `VaiAdvisorBundle`. Consumes VAI:5 projection. No semantic re-inference.

## Focal Object behavior

One focal executive Object, `size-dominant` / center. Missing focal → no invented scene.

## Six-role spatial grammar

Left lever, right outcome, path band, offset moderator, reference control, upper confounder, ambiguous boundary.

## Director-vs-analysis boundary proof

Test C: LEVER vs CONTROL placement follows supplied VAI:2 roles.

## Connector-routing safety

Waypoints only; `geometryUpgradedSemantics: false`.

## Causal-visual safety

ASSOCIATED remains neutral; hypothesis uncertain; manager-view attributed; causal-confirmed only from VAI:3 gate.

## Evidence presentation

Relationship evidence refs as supporting context, not Stage Objects.

## Ambiguity / conflict / confounder

Ambiguous zone, mixed evidence preserved, confounders prioritized into discoverable visibility.

## Density / safe zones / stability / refresh

SIMPLE/STANDARD/DETAILED limits; HUD bands; stable `sceneId`; refresh follows new bundle without mutating Variables.

## Inspection / Advisor / missing VAI

VAI:5 inspect; VAI:4 explain; null bundle → no scene.

## No causal graph / prediction / scenario

Boundary flags false; prediction utterances do not compute deltas; lever inspect does not create Scenario.

## Mutation / Theatre integrity

Catalog and Variable JSON unchanged; DTH executive Objects remain; live turn without bundle has no Impact Scene.

## Focused test results

A–W + boundary: **24 pass / 0 fail**.

## Regression results

VAI:1–5 + DTH:1 + DTH:5 Scene Intent: **102 pass / 0 fail**.

## ESLint

Touched files: 0 errors.

## TypeScript

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

## Production build

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass.

## Remaining bounded debt

See `KNOWN-DEBT.md`. No authority, causal-visual, layout-safety, or mutation failure classified as debt.

## Final status

**NPA-T VAI:6 — CERTIFIED**
