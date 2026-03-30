# Nexora Signal -> Object Mapping + Risk Propagation Engine

## Purpose

This engine lives inside the Nexora AI Core pipeline.

It transforms normalized system signals into:

- affected system objects
- controlled propagation paths
- aggregated object risk scores
- structured outputs for simulation, fragility scoring, timeline, and reaction layers

It does not:

- replace `scene_json`
- mutate scene directly
- update panels directly
- generate final recommendations

## Inputs

Signal input:

```ts
type NormalizedSignalInput = {
  signals: Array<{
    type: string;
    intensity: "low" | "medium" | "high" | "critical";
    direction: "increase" | "decrease" | "disruption";
    confidence: number;
  }>;
  entities?: unknown[];
  events?: unknown[];
  timestamp: string;
};
```

System model context:

```ts
type SystemModelContext = {
  objects: Array<{
    id: string;
    name: string;
    domain: string;
    attributes?: Record<string, unknown>;
    sensitivity?: Record<string, number>;
    connections?: string[];
  }>;
};
```

## Module Structure

```text
backend/app/services/propagation/signal_mapper.py
  Maps each normalized signal to a small set of relevant system objects.
  Uses keyword matching, domain mapping, and object sensitivity profiles.

backend/app/services/propagation/impact_state.py
  Builds ObjectImpactState entries from mapped signal impacts.

backend/app/services/propagation/propagation_engine.py
  Traverses object connections with bounded depth and decay.
  Produces edge-level and path-level propagation output.

backend/app/services/propagation/aggregation.py
  Combines direct and propagated impacts into final risk scores and risk levels.

backend/app/services/propagation/contracts.py
  Strict Pydantic contracts for MappedImpact, ObjectImpactState, PropagationEdge, PropagationPath, PropagationResult.

backend/app/services/propagation/pipeline_handoff.py
  Sole handoff from propagation output into existing Nexora downstream engines and reaction contracts.

backend/app/services/propagation/timeline_adapter.py
  Converts PropagationResult into timeline-safe event payloads.
```

Minimal responsibilities by file:

- `signal_mapper.py`: signal -> objects
- `propagation_engine.py`: object -> neighbor traversal with decay
- `aggregation.py`: combine impacts into normalized risk output

## Data Flow

```text
IngestedSystemSignal / WebSystemSignal
  -> signal_mapper
      -> MappedImpact[]
  -> impact_state
      -> ObjectImpactState[]
  -> propagation_engine
      -> PropagationEdge[]
      -> PropagationPath[]
  -> aggregation
      -> PropagationResult
  -> pipeline_handoff
      -> Fragility Scanner
      -> Scenario Engine
      -> Scene Reaction Layer (via unified reaction contract)
      -> Timeline system
```

## Step 1: Signal -> Object Mapping

For each signal:

1. build candidate objects from:
   - keyword match against object name / attributes
   - domain match between signal taxonomy and object domain
   - sensitivity match from `object.sensitivity[signal.type]`
2. score each candidate deterministically
3. keep only the strongest mappings

Scoring policy:

```text
mapping_score =
  keyword_score * 0.40 +
  domain_score * 0.25 +
  sensitivity_score * 0.35
```

Suggested thresholds:

- primary object threshold: `>= 0.70`
- affected object threshold: `>= 0.45`
- context object threshold: `>= 0.25`
- ignore below `0.25`

Role assignment rules:

- max `1-2` primary objects per signal
- max `3-5` total mapped objects per signal
- prefer fewer, stronger matches over broad activation

Contract:

```ts
type MappedImpact = {
  object_id: string;
  role: "primary" | "affected" | "context";
  impact_strength: number;
  reason: string;
  confidence: number;
};
```

Mapping notes:

- `impact_strength` is the pre-propagation direct effect
- `confidence` reflects mapping quality, not business severity
- `reason` must explain which evidence matched

## Step 2: Initial Impact State

Build one object-centered state per mapped object.

Contract:

```ts
type ObjectImpactState = {
  object_id: string;
  base_impact: number;
  accumulated_impact: number;
  sources: string[];
};
```

Initialization rules:

- `base_impact` derives from signal intensity x signal confidence x mapping strength
- `accumulated_impact` starts equal to `base_impact`
- `sources` stores unique signal types

Simple deterministic intensity weights:

```text
low      -> 0.25
medium   -> 0.50
high     -> 0.75
critical -> 1.00
```

Base impact formula:

```text
base_impact = intensity_weight * signal_confidence * impact_strength
```

## Step 3: Risk Propagation

Propagation traverses the system object graph from directly impacted objects.

Rules:

- max depth = `2`
- decay factor must be `< 1`
- ignore weak impacts below threshold
- deterministic traversal order

Recommended constants:

```text
max_depth = 2
decay_factor = 0.65
min_propagation_threshold = 0.10
default_edge_weight = 0.60
```

Propagation formula:

```text
propagated_impact = parent_impact * edge_weight * decay_factor
```

Edge weight resolution:

1. use explicit connection weight if available in object attributes / connection metadata
2. otherwise use `default_edge_weight`

Contract:

```ts
type PropagationEdge = {
  from_object: string;
  to_object: string;
  propagated_strength: number;
  reason: string;
};
```

Path tracking:

- track simple paths only
- store path strength as the terminal propagated strength
- do not recurse beyond depth 2
- do not revisit the same object within the same path

## Step 4: Aggregation

For each object:

- combine direct and propagated impacts
- normalize to `final_risk_score` in `[0,1]`
- derive `risk_level`

Recommended aggregation:

```text
final_risk_score = clamp01(base_impact + propagated_contribution_sum)
```

Where:

- direct base impact is preserved
- propagated contributions are added but capped
- repeated low-quality paths do not overwhelm the score

Risk classification:

```text
0.00 - 0.24 -> low
0.25 - 0.49 -> medium
0.50 - 0.74 -> high
0.75 - 1.00 -> critical
```

Object output:

```ts
type ObjectImpactResult = {
  object_id: string;
  risk_score: number;
  risk_level: "low" | "medium" | "high" | "critical";
  drivers: string[];
  reason: string;
};
```

## Output Contract

```ts
type PropagationResult = {
  primary_objects: string[];
  affected_objects: string[];
  context_objects: string[];

  object_impacts: Array<{
    object_id: string;
    risk_score: number;
    risk_level: string;
    drivers: string[];
    reason: string;
  }>;

  propagation_paths: Array<{
    path: string[];
    strength: number;
  }>;

  summary: string;
  confidence: number;
  timestamp: string;
};
```

Contract rules:

- all outputs are deterministic
- object ids must exist in current `SystemModel`
- `confidence` reflects mapping and propagation quality
- propagation paths are additive metadata, not UI commands

## Example

Input signal:

```json
{
  "signals": [
    {
      "type": "supply_disruption",
      "intensity": "high",
      "direction": "disruption",
      "confidence": 0.9
    }
  ],
  "entities": [],
  "events": [],
  "timestamp": "2026-03-29T18:00:00Z"
}
```

Assumed model context:

```json
{
  "objects": [
    {
      "id": "obj_supplier",
      "name": "Supplier Network",
      "domain": "supply_chain",
      "sensitivity": {
        "supply_disruption": 1.0
      },
      "connections": ["obj_inventory"]
    },
    {
      "id": "obj_inventory",
      "name": "Inventory Buffer",
      "domain": "operations",
      "sensitivity": {
        "supply_disruption": 0.8
      },
      "connections": ["obj_delivery"]
    },
    {
      "id": "obj_delivery",
      "name": "Delivery Reliability",
      "domain": "logistics",
      "sensitivity": {
        "supply_disruption": 0.6
      },
      "connections": []
    }
  ]
}
```

Output:

```json
{
  "primary_objects": ["obj_supplier"],
  "affected_objects": ["obj_inventory", "obj_delivery"],
  "context_objects": [],
  "object_impacts": [
    {
      "object_id": "obj_supplier",
      "risk_score": 0.68,
      "risk_level": "high",
      "drivers": ["supply_disruption"],
      "reason": "Direct mapping from signal type to high-sensitivity supply-chain object."
    },
    {
      "object_id": "obj_inventory",
      "risk_score": 0.44,
      "risk_level": "medium",
      "drivers": ["supply_disruption"],
      "reason": "Inventory buffer is downstream of supplier disruption through a first-hop dependency."
    },
    {
      "object_id": "obj_delivery",
      "risk_score": 0.17,
      "risk_level": "low",
      "drivers": ["supply_disruption"],
      "reason": "Delivery reliability receives second-hop propagated impact after decay."
    }
  ],
  "propagation_paths": [
    {
      "path": ["obj_supplier", "obj_inventory"],
      "strength": 0.29
    },
    {
      "path": ["obj_supplier", "obj_inventory", "obj_delivery"],
      "strength": 0.11
    }
  ],
  "summary": "Supply disruption primarily impacts the supplier network, then propagates into inventory and delivery reliability with controlled decay.",
  "confidence": 0.84,
  "timestamp": "2026-03-29T18:00:00Z"
}
```

## Integration Point With Nexora Pipeline

Single backend integration boundary:

`backend/app/services/propagation/pipeline_handoff.py`

Responsibilities:

- accept `PropagationResult`
- adapt output for downstream engines
- never perform direct visual mutations

Downstream consumers:

### Fragility Scanner

- use `object_impacts` and `drivers` as structured fragility inputs
- amplify or validate fragility concentration around propagated objects

### Scenario Engine

- use `primary_objects`, `affected_objects`, and path strengths to seed scenario shocks and impact spread

### Scene Reaction Layer

- convert `primary_objects`, `affected_objects`, and path edges into the existing unified reaction / propagation overlay contract
- this remains a reaction payload, not scene mutation logic

### Timeline System

- append propagation event with:
  - source timestamp
  - primary objects
  - summary
  - confidence

## Scene Safety

This engine must never:

- overwrite `scene_json`
- trigger camera behavior directly
- dim all objects blindly
- emit raw UI commands

It only returns structured propagation output that other layers may interpret.

## MVP Constraints

Keep:

- deterministic mapping
- shallow graph traversal
- explainable formulas
- bounded path count
- no ML dependency

Do not add:

- deep graph search
- learned embeddings
- recommendation logic
- direct panel or scene updates
