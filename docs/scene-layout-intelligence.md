# Nexora Scene Layout Intelligence

## Purpose

Scene Layout Intelligence turns the scene from a loose collection of objects into structured system space.

It ensures:

- objects are positioned meaningfully
- layout reflects system roles
- camera framing is stable and readable
- the scene stays calm, executive-friendly, and interpretable

It must remain:

- stable
- role-aware
- gently adaptive

It must not:

- randomly reposition objects on every update
- break object identity or spatial memory
- cause camera jitter
- tightly couple layout logic with scene reactions

## Goal

Users should be able to see:

- what is central
- what is impacted
- what is context

without relearning the scene every time the system updates.

## Inputs

Scene Layout Intelligence consumes:

- `SystemModel`
- `UnifiedSceneReaction`
- optional domain layout presets

Suggested input:

```ts
type SceneLayoutInput = {
  system_model: {
    objects: Array<{
      id: string;
      name: string;
      domain?: string;
      connections?: string[];
      attributes?: Record<string, unknown>;
    }>;
    relationships?: Array<{
      from: string;
      to: string;
      type?: string;
      weight?: number;
    }>;
  };
  reaction: {
    primary_object_ids: string[];
    affected_object_ids: string[];
    highlighted_object_ids: string[];
    focus_object_id: string | null;
    propagation_paths?: Array<{ path: string[]; strength: number }>;
  } | null;
  domain_preset?: string | null;
  timestamp: string;
};
```

## Output Contract

```ts
type CameraFraming = {
  target_group: string[];
  mode: "fit" | "focus" | "stable";
  padding: number;
  bias: {
    x: number;
    y: number;
  };
};

type SceneLayoutState = {
  object_positions: Array<{
    object_id: string;
    position: [number, number, number];
    role: "primary" | "affected" | "context";
  }>;

  layout_mode: string;
  camera_framing: CameraFraming;
  confidence: number;
  timestamp: string;
};
```

Rules:

- positions must be deterministic
- object ids remain stable
- layout state does not replace scene identity, it supplies layout intent only
- camera framing is advisory and stable

## Module Structure

```text
frontend/app/lib/layout/layout_engine.ts
  Main layout orchestrator.
  Produces SceneLayoutState from model, reaction, presets, and layout memory.

frontend/app/lib/layout/role_classifier.ts
  Assigns primary / affected / context roles using reaction data, propagation prominence, and centrality.

frontend/app/lib/layout/camera_framing.ts
  Computes stable framing intent, layout-aware bias, and safe-region camera hints.

frontend/app/lib/layout/layout_memory.ts
  Persists object positions across updates and minimizes displacement.

frontend/app/lib/layout/contracts.ts
  TS contracts for SceneLayoutState, CameraFraming, and helper types.

frontend/app/lib/layout/domain_presets.ts
  Optional layout presets for domain-based grouping.
```

Minimal responsibilities:

- `layout_engine.ts`: scene layout orchestration
- `role_classifier.ts`: assign object roles
- `camera_framing.ts`: compute stable frame intent
- `layout_memory.ts`: preserve spatial memory

## Data Flow Diagram

```text
SystemModel + UnifiedSceneReaction + domain preset
  -> role_classifier
  -> layout_engine
      -> spatial zones
      -> deterministic positioning
      -> layout_memory reconciliation
      -> camera_framing
  -> SceneLayoutState
  -> SceneRenderer / Three.js layer
```

## Step 1: Role Classification

Each object is assigned one role:

- `primary`
- `affected`
- `context`

Inputs used:

- `UnifiedSceneReaction.primary_object_ids`
- `UnifiedSceneReaction.affected_object_ids`
- propagation prominence
- object centrality

Recommended classification rules:

1. if object id is in `primary_object_ids` -> `primary`
2. else if object id is in `affected_object_ids` -> `affected`
3. else if object is on a dominant propagation path or strongly connected to a primary object -> `affected`
4. otherwise -> `context`

Centrality support:

- use a simple degree-based centrality score from `connections` / relationships
- centrality is a tie-breaker, not the main role source

## Step 2: Spatial Zones

Define three zones:

- `CENTER` -> primary objects
- `INNER_RING` -> affected objects
- `OUTER_RING` -> context objects

Optional grouping:

- domain-based subgrouping within a ring
- examples:
  - supply
  - finance
  - customer

Recommended radial ranges:

```text
CENTER radius      = 0.0 to 1.6
INNER_RING radius  = 2.4 to 4.8
OUTER_RING radius  = 5.6 to 8.5
```

Zone rules:

- primary objects stay visually central
- affected objects orbit around the primary centroid
- context objects remain peripheral and stable

## Step 3: Positioning Logic

Positioning must be deterministic.

Recommended strategy:

- sort objects by stable key:
  - role
  - domain
  - object id
- assign angular slots deterministically
- use ring radius based on role
- use small domain offsets for subgroup readability

Simple deterministic radial formula:

```text
angle = stable_index * angle_step + domain_offset
radius = role_radius
x = cos(angle) * radius
z = sin(angle) * radius
y = role_y_lift + domain_y_offset
```

Suggested role defaults:

```text
primary:
  radius ~ 0.8
  y_lift ~ 0.15

affected:
  radius ~ 3.4
  y_lift ~ 0.08

context:
  radius ~ 6.8
  y_lift ~ 0.0
```

Rules:

- avoid overlap with minimum angular spacing
- avoid chaotic repositioning
- do not rotate the whole scene arbitrarily between updates

### Minimal Displacement Rule

Only reposition significantly when:

- role changes
- object enters or leaves
- major structural shift occurs

Otherwise:

- preserve prior slot and radius when possible

## Step 4: Layout Memory

`layout_memory.ts` stores persistent positions per object id.

Responsibilities:

- persist object positions across updates
- reconcile target positions with prior layout
- minimize displacement

Memory rules:

- if object keeps same role and cluster:
  - preserve position unless overlap correction is required
- if object role changes:
  - move toward the new zone smoothly
- if a new object enters:
  - place it in the nearest open slot in its role zone
- if object disappears:
  - keep remaining layout stable, do not reflow everything

Suggested memory shape:

```ts
type LayoutMemoryEntry = {
  object_id: string;
  last_position: [number, number, number];
  last_role: "primary" | "affected" | "context";
  last_seen_at: string;
};
```

## Step 5: Auto Framing

Camera framing uses:

```ts
type CameraFraming = {
  target_group: string[];
  mode: "fit" | "focus" | "stable";
  padding: number;
  bias: {
    x: number;
    y: number;
  };
};
```

Rules:

- default = `stable`
- if new focus emerges -> `focus`
- if multiple important objects must fit -> `fit`
- if right panel is open -> shift framing left using horizontal bias

Recommended framing policy:

- `stable`
  - use when current frame already contains the important group
- `focus`
  - use for one strong primary object
- `fit`
  - use for `2-4` related objects or dominant propagation path group

Suggested defaults:

```text
stable padding = 0.16
focus padding  = 0.20
fit padding    = 0.26
```

Bias policy:

- right-side panel open -> `bias.x = -0.08 to -0.14`
- left-side panel open -> `bias.x = +0.06 to +0.12`
- mild vertical bias only, usually near `0`

## Step 6: Viewport Awareness

Layout must stay aware of occupied UI space.

Requirements:

- detect inspector / right panel presence
- maintain a safe visible region
- avoid placing primary objects behind panel-covered area

Policy:

- shift target framing group away from occluded side
- allow center of gravity to bias left when right panel is open
- do not re-layout the full scene just because a panel opens

Viewport awareness belongs in:

- `camera_framing.ts`
- not in the object layout engine itself

## Step 7: Transition System

Position changes should animate smoothly.

Rules:

- no snapping
- use easing or interpolation
- duration scales with movement magnitude

Recommended policy:

```text
small move  -> 220ms to 320ms
medium move -> 320ms to 520ms
large move  -> 520ms to 800ms
```

Or in frame-loop terms:

- smooth interpolation coefficient adjusted by distance

Important:

- transitions are renderer behavior
- target positions come from `SceneLayoutState`

## Step 8: Group Structure Optional

Optional clustering can improve readability.

Allowed strategies:

- group by domain
- group by relation neighborhood

Rules:

- keep clustering subtle
- do not fragment the scene into too many islands
- preserve primary/affected/context role clarity first

Example:

- supply-related context nodes occupy one outer-ring arc
- finance-related nodes occupy another outer-ring arc

## Layout Modes

Suggested `layout_mode` values:

- `radial_role_v1`
- `radial_role_domain_cluster_v1`
- `focused_chain_v1`

MVP default:

- `radial_role_v1`

## Example

Input:

```json
{
  "system_model": {
    "objects": [
      { "id": "obj_supplier", "name": "Supplier", "domain": "supply", "connections": ["obj_inventory", "obj_cash"] },
      { "id": "obj_inventory", "name": "Inventory", "domain": "operations", "connections": ["obj_supplier"] },
      { "id": "obj_cash", "name": "Cash", "domain": "finance", "connections": ["obj_supplier"] },
      { "id": "obj_customer", "name": "Customer", "domain": "customer", "connections": [] }
    ]
  },
  "reaction": {
    "primary_object_ids": ["obj_supplier"],
    "affected_object_ids": ["obj_inventory", "obj_cash"],
    "highlighted_object_ids": ["obj_supplier", "obj_inventory", "obj_cash"],
    "focus_object_id": "obj_supplier"
  },
  "domain_preset": null,
  "timestamp": "2026-03-29T20:40:00Z"
}
```

Output:

```json
{
  "object_positions": [
    {
      "object_id": "obj_supplier",
      "position": [0.0, 0.18, 0.0],
      "role": "primary"
    },
    {
      "object_id": "obj_inventory",
      "position": [3.1, 0.08, 0.8],
      "role": "affected"
    },
    {
      "object_id": "obj_cash",
      "position": [-2.8, 0.08, 1.1],
      "role": "affected"
    },
    {
      "object_id": "obj_customer",
      "position": [6.3, 0.0, -1.9],
      "role": "context"
    }
  ],
  "layout_mode": "radial_role_v1",
  "camera_framing": {
    "target_group": ["obj_supplier", "obj_inventory", "obj_cash"],
    "mode": "fit",
    "padding": 0.24,
    "bias": {
      "x": -0.1,
      "y": 0.0
    }
  },
  "confidence": 0.88,
  "timestamp": "2026-03-29T20:40:00Z"
}
```

## Integration With SceneRenderer

Flow:

```text
SystemModel + UnifiedSceneReaction
  -> layout_engine
  -> SceneLayoutState
  -> SceneCanvas
  -> SceneRenderer
```

Integration rules:

- `SceneRenderer` uses positions from `SceneLayoutState`
- it must not calculate high-level layout independently
- renderer may smooth movement toward target positions, but not invent its own spatial arrangement

Recommended responsibilities:

### `layout_engine.ts`

- compute target positions
- compute role zones
- apply layout memory reconciliation
- compute camera framing intent

### `SceneCanvas`

- hold current `SceneLayoutState`
- pass layout state and framing to renderer
- combine framing with existing layout-aware safe-region logic

### `SceneRenderer`

- render objects at target layout positions
- interpolate smoothly to new targets
- avoid fallback index-based layouts except as a last-resort bootstrap path

## Relation To Existing Code

This design should formalize and centralize logic that is currently spread across:

- [layoutAwareFraming.ts](/Users/bahadoors/Documents/StateStudio/frontend/app/lib/scene/layoutAwareFraming.ts)
- [SceneCanvas.tsx](/Users/bahadoors/Documents/StateStudio/frontend/app/components/SceneCanvas.tsx)
- [SceneRenderer.tsx](/Users/bahadoors/Documents/StateStudio/frontend/app/components/SceneRenderer.tsx)

Current renderer-side positioning heuristics should become implementation details for interpolation only, not the source of layout truth.

## MVP Constraints

Keep:

- max `20-30` objects
- simple radial layout
- deterministic slots
- layout memory
- soft framing

Do not add:

- physics engine
- random placement
- constant scene reflow
- cinematic camera behavior
