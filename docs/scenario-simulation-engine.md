# Nexora Scenario Simulation Engine

## Purpose

The Scenario Simulation Engine enables:

- what-if analysis
- future state simulation
- impact comparison across decisions

It builds on top of:

- Signal -> Object Mapping
- Risk Propagation Engine

It produces structured simulation outputs only.

It does not:

- mutate scene directly
- update panels directly
- generate final business decisions
- bypass the existing Nexora AI Core pipeline

## Inputs

```ts
type ScenarioInput = {
  scenario_id: string;
  description: string;
  base_state: SystemModelSnapshot;
  injected_changes: Array<{
    type: "signal" | "object_override" | "decision_action";
    payload: Record<string, unknown>;
  }>;
  time_horizon: number;
  simulation_mode: "deterministic" | "monte_carlo";
};
```

Where `SystemModelSnapshot` is the simulation-ready snapshot of the current modeled system:

```ts
type SystemModelSnapshot = {
  system_model: {
    objects: Array<{
      id: string;
      name: string;
      domain: string;
      attributes?: Record<string, unknown>;
      sensitivity?: Record<string, number>;
      connections?: string[];
    }>;
  };
  object_states: Array<{
    object_id: string;
    risk?: number;
    pressure?: number;
    stability?: number;
    dependencies?: string[];
  }>;
  propagation_result?: unknown;
  metadata?: Record<string, unknown>;
};
```

## Supported Scenario Types

1. External Shock
   - market change
   - regulation change
   - supply disruption

2. Internal Decision
   - reduce cost
   - increase inventory
   - change pricing
   - switch supplier

3. Mixed Scenario
   - external plus internal changes in one scenario

## Module Structure

```text
backend/app/services/scenario/scenario_runner.py
  Main scenario orchestrator.
  Clones base state, applies injected changes, runs step loop, and returns ScenarioResult.

backend/app/services/scenario/state_transition.py
  Deterministic state update rules for risk, pressure, stability, and dependency effects per time step.

backend/app/services/scenario/simulation_store.py
  Persists scenario runs and step snapshots for replay, timeline, and comparison.

backend/app/services/scenario/feedback_rules.py
  Threshold-triggered secondary effects and dampening/amplification rules.

backend/app/services/scenario/comparison.py
  Builds ScenarioComparison from multiple ScenarioResult objects.

backend/app/services/scenario/contracts.py
  Strict Pydantic models for ScenarioInput, ScenarioStepSnapshot, ScenarioResult, ScenarioComparison.

backend/app/services/scenario/pipeline_handoff.py
  Sole handoff into Decision Engine, Timeline, Scene Reaction, and canonical panel data adapters.
```

Minimal responsibilities:

- `scenario_runner.py`: orchestration
- `state_transition.py`: time-step state updates
- `simulation_store.py`: simulation persistence and replay access

## Data Flow Diagram

```text
ScenarioInput
  -> scenario_runner
      -> clone base_state
      -> apply injected_changes
      -> for each time step:
          -> apply signals
          -> signal -> object mapping
          -> run propagation
          -> state_transition
          -> feedback_rules
          -> store snapshot
      -> aggregate final result
      -> optional monte_carlo aggregation
  -> pipeline_handoff
      -> Decision Engine
      -> Timeline / Replay
      -> Scene Reaction Layer
      -> canonical panel data
```

## Step 1: Initialization

Responsibilities:

- clone `base_state` into `simulation_state`
- validate `time_horizon`
- normalize injected changes
- apply injected changes before the first time step

Rules:

- no mutation of the original base state
- cap `time_horizon` for MVP
- deterministic ordering of injected changes

Recommended MVP limits:

```text
max_time_horizon = 10
default_time_horizon = 4
```

Injected change application:

- `signal`: add a normalized signal into the simulation queue
- `object_override`: set explicit object state values for the scenario run only
- `decision_action`: translate intended decision into normalized signals or object deltas

## Step 2: Time-Step Simulation Loop

For each `t` in `1 -> time_horizon`:

### A. Apply Signals

- inject active signals for the current time step
- run Signal -> Object Mapping
- build direct object impacts

### B. Run Propagation

- reuse the existing propagation engine
- generate propagated impacts and paths
- update object impact states for this step

### C. State Transition

Update object attributes:

- risk
- pressure
- stability
- dependencies

Recommended deterministic transition policy:

```text
next_risk = clamp01(current_risk + direct_impact * 0.45 + propagated_impact * 0.35 - resilience_offset)
next_pressure = clamp01(current_pressure + direct_impact * 0.40 + propagated_impact * 0.30)
next_stability = clamp01(current_stability - direct_impact * 0.30 - propagated_impact * 0.25 + recovery_offset)
```

Notes:

- `resilience_offset` comes from object attributes such as buffers, redundancy, or low sensitivity
- `recovery_offset` is a small deterministic drift toward equilibrium when impacts are weak

### D. Apply Feedback Effects

If object thresholds are crossed:

- trigger secondary signals
- amplify or dampen propagation

MVP feedback examples:

- if inventory risk > `0.75`, emit secondary signal `delivery_delay`
- if supplier pressure > `0.70`, amplify downstream logistics propagation by `+0.10`
- if buffer inventory > threshold, dampen supply disruption impact by `-0.15`

Rules:

- feedback rules are deterministic
- threshold list is explicit and small
- secondary signals must pass back through the same mapping + propagation pipeline

### E. Store Snapshot

At each time step store:

- object states
- active impacts
- key events
- propagation summary

## Step 3: Multi-Path Optional Monte Carlo

If `simulation_mode = "monte_carlo"`:

- run `N` bounded simulations
- vary:
  - signal intensity
  - propagation strength
  - uncertainty parameters

Recommended MVP defaults:

```text
N = 50
signal_variation = +/- 0.10
propagation_variation = +/- 0.08
```

Rules:

- deterministic mode first
- monte carlo is optional
- uncertainty parameters remain bounded and explainable
- aggregate only summary distribution, not raw UI mutations

Output:

- average final risk
- min/max band
- p10/p50/p90 or equivalent compact band

## Step 4: Aggregation

Generate:

```ts
type ScenarioResult = {
  scenario_id: string;
  timeline: Array<{
    t: number;
    object_states: Array<{
      object_id: string;
      risk: number;
      pressure: number;
      stability: number;
    }>;
    key_events: string[];
  }>;
  final_state: {
    object_impacts: Array<{
      object_id: string;
      risk_score: number;
      risk_level: string;
      drivers: string[];
      reason: string;
    }>;
    overall_risk_score: number;
    dominant_risks: string[];
    stability_index: number;
  };
  key_transitions: string[];
  critical_paths: Array<{
    path: string[];
    impact_strength: number;
  }>;
  uncertainty_band?: {
    min_risk: number;
    max_risk: number;
    p50_risk: number;
  };
  confidence: number;
};
```

Aggregation rules:

- `overall_risk_score` is the weighted average of final object risks
- `dominant_risks` are the top `1-3` signal drivers in the final state
- `stability_index` is inverse-weighted against aggregate risk and instability
- `critical_paths` are strongest propagated paths observed during the run

Suggested score formulas:

```text
overall_risk_score = average(final_object_risk_scores)
stability_index = clamp01(1.0 - overall_risk_score * 0.7 - event_pressure_penalty)
```

## Step 5: Comparison Support

Support side-by-side scenario comparison:

```ts
type ScenarioComparison = {
  scenarios: ScenarioResult[];
  delta_analysis: {
    risk_difference: number;
    object_differences: Array<{
      object_id: string;
      risk_delta: number;
    }>;
    best_case: string;
    worst_case: string;
  };
};
```

Comparison rules:

- compare final overall risk scores
- compare object-level risk deltas
- best case = lowest overall risk
- worst case = highest overall risk

## Example

Input:

```json
{
  "scenario_id": "scenario_supplier_fail",
  "description": "What if supplier fails?",
  "base_state": {
    "system_model": {
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
            "supply_disruption": 0.8,
            "delivery_delay": 0.7
          },
          "connections": ["obj_delivery"]
        },
        {
          "id": "obj_delivery",
          "name": "Delivery Reliability",
          "domain": "logistics",
          "sensitivity": {
            "delivery_delay": 0.9
          },
          "connections": []
        }
      ]
    },
    "object_states": [
      {
        "object_id": "obj_supplier",
        "risk": 0.2,
        "pressure": 0.2,
        "stability": 0.8
      },
      {
        "object_id": "obj_inventory",
        "risk": 0.25,
        "pressure": 0.2,
        "stability": 0.75
      },
      {
        "object_id": "obj_delivery",
        "risk": 0.2,
        "pressure": 0.15,
        "stability": 0.8
      }
    ]
  },
  "injected_changes": [
    {
      "type": "signal",
      "payload": {
        "type": "supply_disruption",
        "intensity": "critical",
        "direction": "disruption",
        "confidence": 0.95
      }
    }
  ],
  "time_horizon": 4,
  "simulation_mode": "deterministic"
}
```

Output:

```json
{
  "scenario_id": "scenario_supplier_fail",
  "timeline": [
    {
      "t": 1,
      "object_states": [
        {
          "object_id": "obj_supplier",
          "risk": 0.72,
          "pressure": 0.68,
          "stability": 0.54
        },
        {
          "object_id": "obj_inventory",
          "risk": 0.46,
          "pressure": 0.38,
          "stability": 0.63
        },
        {
          "object_id": "obj_delivery",
          "risk": 0.24,
          "pressure": 0.2,
          "stability": 0.76
        }
      ],
      "key_events": ["Supplier disruption propagates to inventory."]
    },
    {
      "t": 2,
      "object_states": [
        {
          "object_id": "obj_supplier",
          "risk": 0.79,
          "pressure": 0.74,
          "stability": 0.48
        },
        {
          "object_id": "obj_inventory",
          "risk": 0.58,
          "pressure": 0.49,
          "stability": 0.57
        },
        {
          "object_id": "obj_delivery",
          "risk": 0.33,
          "pressure": 0.28,
          "stability": 0.71
        }
      ],
      "key_events": ["Inventory threshold crossed; delivery delay emerges."]
    },
    {
      "t": 3,
      "object_states": [
        {
          "object_id": "obj_supplier",
          "risk": 0.81,
          "pressure": 0.76,
          "stability": 0.45
        },
        {
          "object_id": "obj_inventory",
          "risk": 0.64,
          "pressure": 0.56,
          "stability": 0.52
        },
        {
          "object_id": "obj_delivery",
          "risk": 0.42,
          "pressure": 0.35,
          "stability": 0.66
        }
      ],
      "key_events": ["Delivery reliability deteriorates under sustained delay pressure."]
    },
    {
      "t": 4,
      "object_states": [
        {
          "object_id": "obj_supplier",
          "risk": 0.82,
          "pressure": 0.77,
          "stability": 0.44
        },
        {
          "object_id": "obj_inventory",
          "risk": 0.67,
          "pressure": 0.59,
          "stability": 0.49
        },
        {
          "object_id": "obj_delivery",
          "risk": 0.48,
          "pressure": 0.39,
          "stability": 0.61
        }
      ],
      "key_events": ["Supply disruption remains the dominant system driver."]
    }
  ],
  "final_state": {
    "object_impacts": [
      {
        "object_id": "obj_supplier",
        "risk_score": 0.82,
        "risk_level": "critical",
        "drivers": ["supply_disruption"],
        "reason": "Direct failure source remains unresolved."
      },
      {
        "object_id": "obj_inventory",
        "risk_score": 0.67,
        "risk_level": "high",
        "drivers": ["supply_disruption", "delivery_delay"],
        "reason": "Inventory absorbs repeated first-order disruption and secondary delay pressure."
      },
      {
        "object_id": "obj_delivery",
        "risk_score": 0.48,
        "risk_level": "medium",
        "drivers": ["delivery_delay"],
        "reason": "Delivery is degraded through second-order downstream effects."
      }
    ],
    "overall_risk_score": 0.66,
    "dominant_risks": ["supply_disruption", "delivery_delay"],
    "stability_index": 0.49
  },
  "key_transitions": [
    "Supplier becomes critical at t=2.",
    "Inventory becomes the main downstream bottleneck at t=3."
  ],
  "critical_paths": [
    {
      "path": ["obj_supplier", "obj_inventory"],
      "impact_strength": 0.34
    },
    {
      "path": ["obj_supplier", "obj_inventory", "obj_delivery"],
      "impact_strength": 0.18
    }
  ],
  "confidence": 0.86
}
```

## Integration Point With Nexora Pipeline

Single backend boundary:

`backend/app/services/scenario/pipeline_handoff.py`

Responsibilities:

- forward `ScenarioResult` to downstream consumers
- preserve simulation as structured data only
- avoid direct UI mutation logic

Downstream consumers:

### Decision Engine

- uses scenario outcomes as one input to ranking and recommendation layers
- scenario engine itself does not recommend actions

### Timeline / Replay

- persist scenario run and snapshots through `simulation_store.py`
- expose scenario evolution for replay and comparison

### Scene Reaction Layer

- convert simulation outputs into the existing unified reaction / propagation overlay contracts
- reaction remains separate from simulation

### Panels

- panel data comes through canonical panel data mappers
- scenario engine never writes panel state directly

## Scene Safety Rules

This engine must never:

- replace the entire scene
- trigger camera directly
- override object rendering logic

It only provides structured simulation outputs.

## MVP Constraints

Keep:

- deterministic mode first
- max horizon around `10`
- shallow propagation reuse
- explicit threshold rules
- small number of injected changes

Do not add:

- deep ML
- open-ended agentic simulation
- direct rendering logic
- decision generation inside simulation
