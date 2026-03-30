# Nexora Unified Scene Reaction Contract

## Purpose

The Unified Scene Reaction Contract is the single source of truth for scene behavior in Nexora.

It ensures that all triggers:

- chat input
- fragility scanner
- scenario simulation
- decision engine
- panel interactions

produce consistent and controlled scene behavior through one shared contract.

It is responsible for:

- object highlighting
- object dimming
- focus behavior
- subtle animation signals
- controlled camera assist

It is not responsible for:

- replacing `scene_json`
- panel behavior
- direct engine parsing inside the renderer
- uncontrolled camera movement

## Core Rule

All scene updates must flow through:

```text
Engine Output / Panel Intent
  -> reaction_builder
  -> UnifiedSceneReaction
  -> scene_reaction_store
  -> SceneRenderer
```

No other feature should implement its own scene logic.

## Core Contract

```ts
type UnifiedSceneReaction = {
  highlighted_object_ids: string[];
  primary_object_ids: string[];
  affected_object_ids: string[];

  dim_unrelated_objects: boolean;

  focus_object_id: string | null;
  focus_mode: "none" | "soft" | "strong";

  animation_signals: Array<{
    object_id: string;
    type: "pulse" | "shake" | "glow";
    intensity: number;
  }>;

  propagation_paths: Array<{
    path: string[];
    strength: number;
  }>;

  camera_hint: {
    target_object_id: string | null;
    framing: "none" | "soft_focus" | "fit_group";
  };

  reason: string;
  confidence: number;
  timestamp: string;
};
```

Contract rules:

- object ids must remain stable
- `confidence` is clamped to `[0,1]`
- `animation_signals.intensity` is clamped to `[0,1]`
- `camera_hint` is advisory, never imperative
- this contract carries scene reaction intent only, not raw scene mutations

## Module Structure

```text
frontend/app/lib/reactions/reaction_builder.ts
  Normalizes multiple engine outputs and UI intents into one UnifiedSceneReaction.

frontend/app/lib/reactions/reaction_priority.ts
  Applies source priority rules and resolves conflicts deterministically.

frontend/app/lib/reactions/scene_reaction_store.ts
  Stores the active reaction state for the renderer and scene host.

frontend/app/lib/reactions/contracts.ts
  Canonical TS/Zod contract for UnifiedSceneReaction and source input types.

frontend/app/lib/reactions/cameraPolicy.ts
  Small helper for soft camera hints and user-control safety rules.

frontend/app/lib/reactions/animationPolicy.ts
  Maps risk and propagation strength to pulse/glow/shake signals.
```

Minimal responsibilities:

- `reaction_builder.ts`: normalize input into reaction
- `reaction_priority.ts`: resolve winner when multiple reactions exist
- `scene_reaction_store.ts`: make the renderer consume one stable reaction source

## Data Flow Diagram

```text
Propagation Engine
Scenario Simulation
Decision Engine
Fragility Scanner
Panel interaction intent
Chat intent output
  -> reaction_builder
  -> reaction_priority
  -> UnifiedSceneReaction
  -> scene_reaction_store
  -> SceneRenderer / Three.js layer
```

## Step 1: Normalization

`reaction_builder.ts` accepts normalized outputs from:

- propagation engine
- scenario simulation
- decision engine
- panel interactions
- chat intent outputs

Suggested builder input:

```ts
type SceneReactionBuilderInput = {
  decision?: unknown | null;
  simulation?: unknown | null;
  propagation?: unknown | null;
  scanner?: unknown | null;
  panel_intent?: unknown | null;
  chat_intent?: unknown | null;
  timestamp: string;
};
```

Responsibilities:

- normalize different engine outputs into the same shape
- resolve object ids
- identify primary and affected objects
- derive focus, dim, animation, and propagation data
- produce one clean `UnifiedSceneReaction`

Rules:

- deterministic transformation only
- no direct scene replacement
- no camera execution logic here

## Step 2: Priority Rules

Source priority:

1. Decision Engine
2. Scenario Simulation
3. Propagation / Scanner
4. Chat-only intent

Conflict rules:

- higher priority overrides lower priority
- do not blindly merge conflicting focus targets
- preserve clarity over completeness

Recommended resolution behavior:

- if Decision Engine has a strong focus object, it wins
- if Simulation has dominant propagation paths but no conflict with decision focus, preserve top path metadata
- if Propagation/Scanner exists without decision or simulation, use its primary source as focus
- if only chat intent exists, allow soft focus only

Examples:

- decision recommends `obj_supplier`, propagation highlights `obj_inventory`
  - focus on `obj_supplier`
  - keep `obj_inventory` as affected object
- simulation focuses a failure chain, panel click requests another object
  - panel click may temporarily request soft focus only if it does not displace stronger active decision/simulation context

## Step 3: Highlight Policy

Rules:

- max `1-2` primary objects
- affected objects must be limited and relevant
- avoid highlight-everything behavior
- no full-scene activation

Recommended limits:

```text
primary_object_ids: up to 2
affected_object_ids: up to 4
highlighted_object_ids = primary + strongest affected, max 5 total
```

Selection policy:

- primary objects: highest-confidence decision or propagation anchors
- affected objects: top downstream or secondary impacted objects only
- remove duplicates and low-confidence noise

## Step 4: Dim Policy

`dim_unrelated_objects = true` only when strong focus context exists.

Use dimming when:

- there is a stable primary object
- there is a bounded set of affected objects
- the source priority is decision, simulation, or strong propagation

Do not dim when:

- reaction is chat-only and ambiguous
- no stable focus object exists
- the system is in neutral acknowledgement mode

Visual rule:

- dim softly, never hide
- unrelated objects remain visible and interactable

Recommended visual target:

```text
unrelated_opacity_floor ~ 0.45 to 0.60
```

## Step 5: Focus And Camera Policy

### Focus

Rules:

- `focus_object_id` must be stable
- `focus_mode`:
  - `none`: informational reaction only
  - `soft`: light emphasis without aggressive dimming
  - `strong`: high-confidence focus with controlled dimming

Suggested mapping:

- Decision Engine -> `strong`
- Scenario Simulation -> `strong` if one dominant object, otherwise `soft`
- Propagation / Scanner -> `soft` or `strong` depending on confidence
- Chat-only intent -> `soft`

### Camera

`camera_hint` is optional and soft.

Rules:

- no camera jumps
- no repeated zoom-out
- only request camera help if target is out of view
- never override active manual camera control

Renderer policy:

- `soft_focus`: gently bias framing toward `target_object_id`
- `fit_group`: gently expand framing to include dominant path/group
- `none`: do nothing

Camera hints should be ignored when:

- user is orbiting
- camera is locked by user
- target is already within safe view region

## Step 6: Animation Policy

Use only subtle animation signals:

- `pulse` for importance
- `glow` for attention
- `shake` for instability

Animation mapping:

- high-confidence recommended object -> `glow`
- risk amplification / instability -> `shake`
- important but non-critical affected object -> `pulse`

Intensity mapping:

```text
low risk / weak path       -> 0.25
medium risk / moderate     -> 0.50
high risk / strong path    -> 0.75
critical / dominant risk   -> 0.95
```

Rules:

- max one animation type per object at a time
- avoid stacking multiple aggressive effects
- prefer `glow` or `pulse`; reserve `shake` for instability only

## Step 7: Propagation Visualization

`propagation_paths` carries dominant visual paths only.

Rules:

- render soft animated links only
- avoid clutter
- show strongest paths only

Recommended limits:

```text
max propagation paths = 2
max path length = 3 objects in MVP
ignore weak paths below strength threshold
```

Selection policy:

- prefer decision/simulation critical paths
- otherwise use strongest propagation-engine paths
- do not combine incompatible path sets from multiple sources

## Step 8: State Safety

This layer must never:

- replace the full scene
- mutate object identities
- trigger camera directly
- hide objects entirely
- pass raw engine payloads to the renderer

It may only influence:

- highlight state
- dim state
- focus state
- animation state
- propagation overlay hints
- soft camera hints

## Output

The only output of this layer is:

`UnifiedSceneReaction`

This is the only scene-reaction contract the renderer should consume.

## Example

Input: `PropagationResult`

```json
{
  "primary_objects": ["obj_supplier"],
  "affected_objects": ["obj_inventory", "obj_delivery"],
  "object_impacts": [
    {
      "object_id": "obj_supplier",
      "risk_score": 0.82,
      "risk_level": "critical",
      "drivers": ["supply_disruption"]
    },
    {
      "object_id": "obj_inventory",
      "risk_score": 0.67,
      "risk_level": "high",
      "drivers": ["supply_disruption", "delivery_delay"]
    },
    {
      "object_id": "obj_delivery",
      "risk_score": 0.48,
      "risk_level": "medium",
      "drivers": ["delivery_delay"]
    }
  ],
  "propagation_paths": [
    {
      "path": ["obj_supplier", "obj_inventory"],
      "strength": 0.34
    },
    {
      "path": ["obj_supplier", "obj_inventory", "obj_delivery"],
      "strength": 0.18
    }
  ],
  "summary": "Supply disruption primarily impacts the supplier network and propagates downstream.",
  "confidence": 0.84,
  "timestamp": "2026-03-29T20:00:00Z"
}
```

Output:

```json
{
  "highlighted_object_ids": ["obj_supplier", "obj_inventory", "obj_delivery"],
  "primary_object_ids": ["obj_supplier"],
  "affected_object_ids": ["obj_inventory", "obj_delivery"],
  "dim_unrelated_objects": true,
  "focus_object_id": "obj_supplier",
  "focus_mode": "strong",
  "animation_signals": [
    {
      "object_id": "obj_supplier",
      "type": "shake",
      "intensity": 0.95
    },
    {
      "object_id": "obj_inventory",
      "type": "glow",
      "intensity": 0.75
    },
    {
      "object_id": "obj_delivery",
      "type": "pulse",
      "intensity": 0.5
    }
  ],
  "propagation_paths": [
    {
      "path": ["obj_supplier", "obj_inventory"],
      "strength": 0.34
    },
    {
      "path": ["obj_supplier", "obj_inventory", "obj_delivery"],
      "strength": 0.18
    }
  ],
  "camera_hint": {
    "target_object_id": "obj_supplier",
    "framing": "soft_focus"
  },
  "reason": "Propagation engine identified supplier failure as the dominant disruption source with downstream inventory and delivery impact.",
  "confidence": 0.84,
  "timestamp": "2026-03-29T20:00:00Z"
}
```

## Integration With SceneRenderer / Three.js Layer

Recommended flow:

```text
Engine outputs
  -> reaction_builder
  -> reaction_priority
  -> scene_reaction_store
  -> applyNexoraUiState
  -> SceneCanvas
  -> SceneRenderer
```

Renderer integration rules:

- `SceneRenderer` consumes only `UnifiedSceneReaction`
- it does not parse decision/scenario/scanner payloads directly
- object visuals derive from:
  - highlighted ids
  - dim flag
  - focus id/mode
  - animation signals
  - propagation paths
  - camera hints

Suggested responsibilities:

### `applyNexoraUiState`

- apply/store the latest `UnifiedSceneReaction`
- never bypass the contract with raw scene logic

### `SceneCanvas`

- read the active reaction from `scene_reaction_store`
- pass normalized reaction props to `SceneRenderer`
- respect existing user camera lock/orbit state before honoring `camera_hint`

### `SceneRenderer`

- render highlight/dim/animation states only
- keep propagation paths as visual overlays
- never reinterpret business logic

## Relation To Existing Code

This contract should replace the current mix of:

- ad hoc highlight arrays
- raw `objectSelection` scene cues
- scanner-specific scene payload semantics
- source-specific reaction heuristics

Existing files that become upstream helpers instead of final authorities:

- [reactionPolicy.ts](/Users/bahadoors/Documents/StateStudio/frontend/app/lib/reactions/reactionPolicy.ts)
- [uiStateApplicationLayer.ts](/Users/bahadoors/Documents/StateStudio/frontend/app/lib/uiState/uiStateApplicationLayer.ts)
- [SceneCanvas.tsx](/Users/bahadoors/Documents/StateStudio/frontend/app/components/SceneCanvas.tsx)
- [applyFragilityScenePayload.ts](/Users/bahadoors/Documents/StateStudio/frontend/app/lib/scene/applyFragilityScenePayload.ts)

## MVP Constraints

Keep:

- deterministic reaction building
- soft, stable visual language
- simple animation taxonomy
- bounded propagation overlays
- controlled camera assist only

Do not add:

- heavy physics
- UI-side simulation
- uncontrolled cinematic camera behavior
- source-specific renderer logic
