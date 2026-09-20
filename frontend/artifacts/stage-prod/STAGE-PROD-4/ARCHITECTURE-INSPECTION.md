# NPA-T STAGE-PROD:4 — Architecture inspection

## Existing infrastructure discovered

- `DIR:VI/NexoraVisualIntelligence` already owns Trend/Compare selection, evidence sufficiency, semantic confidence, and the `NexoraVisualView` presentation contract.
- `NexoraEvidenceVisualView` already renders the DIR view as compact 2D SVG Trend/Comparison visuals.
- DTH:2 iconic Objects preserve value, unit, provenance, epistemic state, owner identity, and prohibited interpretations.
- DTH:6 Object Investigation already exposes current state, evidence, provenance, and the canonical investigated Object.
- DTH:7 Decision Comparison already owns exact candidate membership and the requested comparison criterion.
- `NexoraExecutiveShell` already holds the existing DIR visual-view runtime produced by conversational control.

## First divergent layer

The existing DIR visual was mounted as an `ExecutiveStageFrame` overlay outside the authoritative Stage host. No contract associated it with the STAGE-PROD:3 scene, scene script, or canonical Object IDs. DTH comparison and investigation evidence likewise had no read-only path into a contextual chart/card inside `Nexora3DExecutiveStage`.

## Production visual path

Existing canonical scene/evidence → existing DIR:VI or DTH presentation contract → `NPA-T STAGE-PROD:4/ContextualVisualSpecification` → `NexoraStageMount` → `Nexora3DExecutiveStage` → `NexoraStageContextualVisual` → existing `NexoraEvidenceVisualView` or compact status card.

The shell's existing requested visual now enters the Stage host instead of being independently rendered by the surrounding frame.

## Selection and safety

- Explicit DIR views retain their exact series, points, units, confidence, and source labels.
- Scenario Comparison renders only when the DTH criterion is supported (`cost` or `time`), every exact candidate has a non-missing/non-unknown attached iconic value, values parse without substitution, and units match.
- Status Card uses the existing DTH investigation state/evidence only.
- Orientation or unsupported comparison produces no visual.
- At most one contextual supporting visual is rendered, keeping Objects as scene anchors.

No chart store, KPI store, analytics model, Director, Theatre, Stage authority, or referent resolver was introduced.
