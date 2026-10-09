# NPA-T STAGE-COMPOSITION:5 — DTH:7 Comparison Placement Integration

Identity: `NPA-T STAGE-COMPOSITION:5/Dth7ComparisonPlacementIntegration`

DTH:7 remains semantic owner of Decision Comparison. STAGE-PROD overlay placement now owns where it lives on Stage.

## Repair

- `resolveStageProdOverlayPlacement` / `projectStageProdOverlayRects` accept `comparison`
- Comparison reuses the existing top-right context slot (same geometry as former investigation)
- ACTIONS uses existing beside-context placement
- ComparisonSurface consumes overlay placement
- Comparison mounts inside `Nexora3DExecutiveStage` overlay stack (not a covering StageMount sibling)

## Rules

- DTH:7 + Report: SUPPORTED COEXISTENCE (bottom-left vs top-right)
- DTH:7 + Chart: SUPPORTED COEXISTENCE (bottom-right vs top-right; comparison height yields to bottom band)
- DTH:7 + ACTIONS: SUPPORTED TRANSIENT COEXISTENCE (ACTIONS beside context slot)
- Collection comparison with no focused subject does not activate Report/ACTIONS (SC:2)

## Gates

Typecheck 0, L4 eslint PASS, build PASS, diff-check PASS, live smoke PASS, live `/executive` comparison proof PASS.

CLOSED: DTH:7 placement independence.

NPA-T STAGE-COMPOSITION:5 — CERTIFIED + SEALED
