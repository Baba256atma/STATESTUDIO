# DTH:4 Architecture inspection

## Smallest extension point

Reuse the existing Theatre projection (`projectNexoraDecisionTheatreFoundation`) as the only atmosphere authority path.

Do **not** map workspace `environmentIntent` (investigate/simulate/commit) to War Room Atmosphere. That mapping is collection/workspace presentation (NEX-MVP:5) and would violate whole-scene non-escalation (showing Problems/Scenarios/Decisions must not activate atmosphere).

Do **not** create a second theme engine or atmosphere store. Semantic resolver outputs mode/intensity/transition tokens. Renderer (`NexoraStageMount` data attributes + `Nexora3DExecutiveStage` overlay) maps tokens to CSS. Overlay sits above the canvas (`z-index: 1`) and below HUD (`z-index: 2`), `pointer-events: none`.

DTH:3 NexoGraph `visualGrammar.atmosphere` remains `"none"` so Object grammar never owns Stage environment.

## Reused authorities

DTH:1 Theatre, DTH:2 families, DTH:3 grammar/claims, existing Stage canvas/HUD, cockpit theme background, focus/selection/attention, relationship grammar, Advisor-readable context, DIR:1.

## Live policy

Shell does not pass `atmosphereAuthority`. Live `/executive` stays `atmosphere=none`. Positive modes are certified with deterministic fixtures.
