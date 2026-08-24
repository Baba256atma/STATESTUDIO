# MVP-OUT:1-FIX4 — Root cause

## Failure

Conversational routing for `what if delivery be too late` was already correct (FIX3).
CC:9 then returned unsupported-model because:

1. CC:9 modeled subjects are only `obj-capacity` and `obj-demand`.
2. Delivery delay never reached a grounded impact layer.
3. Existing KPI Impact Simulation (DS:7:5) and Risk Impact Simulation (DS:7:6) require scene KPI numeric blueprints. They are not wired to CC:9 qualitative interventions and must not invent magnitude.

## Classification

**E + F, with A for unused engines:** engine exists for numeric KPI/Risk blueprint simulation, but CC:9 does not call it. Qualitative delay needed a generic canonical-subject-KPI binding, not a Delivery switch.

## What is justified

Delivery presentation fixture owns `kpi-delivery` / On-time.
A delay intervention therefore supports **directional pressure on that KPI only**.
No canonical Delivery→Customer or Delivery→Revenue impact relation exists for this path.
Revenue's `influences` Delivery edge is not inverted.
Stage topology is ignored.

Inventory increase has no delay KPI binding and no canonical impact profile → honest unsupported remains correct.

## Correction

`assessGroundedScenarioImpact` (generic): delay + canonical primary KPI → directional decrease, no magnitude.
CC:9 evaluation consumes that assessment before declaring unsupported.
Follow-ups reuse CC:7/CC:9 session (affected / KPI / risks / confidence / why).

Bare `why?` is CC:1 `explain` with `requiresTarget`. Live command mapping failed before the impact-why remap. FIX4 remaps that intent to `explain-scenario` / `impact-why` when an active Scenario evaluation exists, before `mapNexoraConversationalCommand`.
