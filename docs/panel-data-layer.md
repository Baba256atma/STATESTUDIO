# Nexora Canonical Panel Data Layer

## Purpose

The Panel Data Layer is the single translation boundary between:

- Nexora AI Core outputs
- Nexora UI panels

Its job is to take canonical engine outputs and produce one stable object:

`CanonicalPanelData`

Panels must consume only this object.

This layer removes:

- panel inconsistency
- fallback ambiguity
- duplicated panel-specific business logic
- raw engine parsing inside the UI

## Architecture Rules

This layer must:

- not break Nexora architecture
- not let panels fetch raw engine data directly
- not let each panel derive its own interpretation
- not duplicate business logic inside UI panels
- keep panels render-only where possible

## Root Contract

```ts
type CanonicalPanelData = {
  advice: AdvicePanelData | null;
  timeline: TimelinePanelData | null;
  war_room: WarRoomPanelData | null;
  metadata: {
    source_trace: string[];
    confidence: number;
    timestamp: string;
  };
};
```

## Panel Contracts

### AdvicePanelData

```ts
type AdvicePanelData = {
  summary: string;
  recommendation: {
    label: string;
    rationale: string;
    confidence: number;
  } | null;

  alternative_options: Array<{
    label: string;
    benefit: string;
    downside: string;
    score: number;
  }>;

  key_risks: string[];
  affected_objects: string[];
  suggested_next_steps: string[];
};
```

Rules:

- prefer Decision Engine output
- if unavailable, use scenario simulation plus propagation derived advisory summary
- if still unavailable, use fragility scanner summary
- never fabricate recommendations

### TimelinePanelData

```ts
type TimelinePanelData = {
  events: Array<{
    id: string;
    type: "scan" | "signal" | "simulation" | "decision" | "external_source";
    title: string;
    summary: string;
    related_objects: string[];
    timestamp: string;
    confidence: number;
  }>;
  summary: string;
};
```

Rules:

- merge ingestion, scanner, simulation, and decision events
- normalize into one chronological stream
- remove duplicates and low-value noise

### WarRoomPanelData

```ts
type WarRoomPanelData = {
  executive_summary: string;

  active_issue: {
    label: string;
    severity: "low" | "medium" | "high" | "critical";
    summary: string;
  } | null;

  strategic_options: Array<{
    label: string;
    projected_effect: string;
    tradeoff: string;
    confidence: number;
  }>;

  critical_paths: Array<{
    label: string;
    objects: string[];
    impact_strength: number;
  }>;

  decision_focus_objects: string[];
  escalation_note: string | null;
};
```

Rules:

- prefer decision plus simulation outputs
- fallback to propagation plus fragility when decision/simulation are absent
- keep executive-level summaries only
- no raw technical dump formatting in the panel

## Module Structure

```text
frontend/app/lib/panels/canonical/panelDataBuilder.ts
  Single entry point.
  Consumes canonical AI Core outputs and returns CanonicalPanelData.

frontend/app/lib/panels/canonical/adviceAdapter.ts
  Builds AdvicePanelData with strict source priority rules.

frontend/app/lib/panels/canonical/timelineAdapter.ts
  Merges and normalizes timeline-worthy events into TimelinePanelData.

frontend/app/lib/panels/canonical/warRoomAdapter.ts
  Builds WarRoomPanelData using decision/simulation first, propagation/fragility second.

frontend/app/lib/panels/canonical/contracts.ts
  Zod or TS contracts for CanonicalPanelData and panel slices.

frontend/app/lib/panels/canonical/sourceTrace.ts
  Small helpers for trace metadata and source priority recording.

frontend/app/lib/panels/canonical/fallbackPolicy.ts
  Shared fallback rules and missing-data guards.
```

Responsibilities:

- `panelDataBuilder.ts`: root composition
- `adviceAdapter.ts`: advice slice
- `timelineAdapter.ts`: timeline slice
- `warRoomAdapter.ts`: war-room slice

## Builder Input

The panel layer may consume canonical outputs from:

- Fragility Scanner
- Propagation Engine
- Scenario Simulation Engine
- Decision Engine
- Timeline / Memory Engine

Suggested builder input:

```ts
type PanelDataBuilderInput = {
  fragility?: unknown | null;
  propagation?: unknown | null;
  simulation?: unknown | null;
  decision?: unknown | null;
  timeline_memory?: unknown | null;
  ingestion?: unknown | null;
  timestamp: string;
};
```

## Data Flow Diagram

```text
AI Core Outputs
  -> panelDataBuilder
      -> adviceAdapter
      -> timelineAdapter
      -> warRoomAdapter
      -> sourceTrace / fallbackPolicy
  -> CanonicalPanelData
  -> RightPanelHost / HomeScreen panel host
  -> Advice panel
  -> Timeline panel
  -> War Room panel
```

## Transformation Layer

### panelDataBuilder.ts

Responsibilities:

- accept canonical engine outputs
- call each adapter once
- assemble `CanonicalPanelData`
- compute top-level metadata
- ensure deterministic result shape

Rules:

- no panel-specific business logic outside adapters
- no direct panel fallback logic in components
- all nullability resolved here

### adviceAdapter.ts

Source priority:

1. Decision Engine
2. Scenario Simulation + Propagation
3. Fragility Scanner
4. `null`

Mapping policy:

- if Decision Engine exists:
  - `summary` from executive summary
  - `recommendation` from recommended option + explanation
  - `alternative_options` from next ranked options
  - `key_risks` from current state / dominant risks
  - `affected_objects` from recommended option
  - `suggested_next_steps` from option rationale/tradeoffs, not invented
- if fallback to simulation + propagation:
  - build advisory summary only
  - `recommendation = null`
  - list top impacted objects and risk-reduction opportunities
- if fallback to scanner:
  - build risk summary only
  - `recommendation = null`

### timelineAdapter.ts

Source priority:

1. Timeline / Memory events
2. Simulation events
3. Scanner / ingestion events
4. synthesized minimal summary

Responsibilities:

- normalize all events to the timeline contract
- dedupe by stable event id or `(type, title, timestamp)`
- merge into one chronological stream
- cap noise by limiting near-identical low-value entries

Deduplication rules:

- keep strongest-confidence version of duplicate event
- prefer timeline/memory-native entries over synthesized ones
- merge related_objects when duplicates collapse

### warRoomAdapter.ts

Source priority:

1. Decision Engine + Simulation
2. Propagation + Fragility
3. `null`

Responsibilities:

- produce executive summary
- identify active issue
- expose strategic options
- expose critical paths
- expose focus objects and escalation note

Mapping policy:

- if decision + simulation exist:
  - strategic options come from ranked decision options
  - critical paths come from simulation critical paths
  - active issue comes from dominant risks / critical objects
- if fallback to propagation + fragility:
  - strategic options may be empty
  - active issue derived from highest-risk propagated issue
  - critical paths derived from propagation result

## Source Priority Rules

### Advice

1. Decision Engine
2. Scenario Simulation + Propagation
3. Fragility Scanner
4. `null`

### Timeline

1. Timeline / Memory events
2. Simulation events
3. Scanner / ingestion events
4. synthesized minimal summary

### War Room

1. Decision Engine + Simulation
2. Propagation + Fragility
3. `null`

## Safe Fallback Strategy

Fallback rules:

- fallback only when a higher-priority canonical source is absent
- never overwrite strong structured data with weaker summaries
- never merge incompatible state slices
- always record `source_trace`

Safe fallback examples:

- if decision result exists but explanations are missing:
  - advice adapter returns recommendation only if rationale can be resolved
  - otherwise fallback to simulation advisory summary and trace the degraded state
- if simulation exists without decision:
  - war room can show active issue and critical paths
  - strategic options stay empty if no decision options exist
- if no timeline events exist:
  - timeline adapter may synthesize one minimal summary event from strongest available canonical state

Never do:

- combine stale decision recommendation with unrelated simulation output
- replace populated decision-based advice with scanner summary
- let a panel create its own emergency fallback text

## Metadata And Traceability

Top-level metadata:

```ts
type CanonicalPanelMetadata = {
  source_trace: string[];
  confidence: number;
  timestamp: string;
};
```

Recommended `source_trace` values:

- `advice:decision_engine`
- `advice:simulation_propagation_fallback`
- `timeline:memory_engine`
- `timeline:simulation_events`
- `war_room:decision_simulation`
- `war_room:propagation_fragility_fallback`

Confidence policy:

- aggregate from active slice confidences
- if a slice is fallback-derived, reduce confidence modestly
- if all slices are null, confidence should be `0`

## Example

Engine outputs:

```json
{
  "decision": {
    "recommended_option_id": "option_switch_supplier",
    "ranked_options": [
      {
        "option_id": "option_switch_supplier",
        "label": "Switch supplier",
        "affected_objects": ["obj_supplier", "obj_inventory"],
        "projected_risk_reduction": 0.28,
        "confidence": 0.73
      },
      {
        "option_id": "option_increase_inventory",
        "label": "Increase inventory buffer",
        "affected_objects": ["obj_inventory", "obj_delivery"],
        "projected_risk_reduction": 0.22,
        "confidence": 0.84
      }
    ],
    "option_scores": [
      { "option_id": "option_switch_supplier", "total_score": 0.49 },
      { "option_id": "option_increase_inventory", "total_score": 0.54 }
    ],
    "explanations": [
      {
        "option_id": "option_switch_supplier",
        "rationale": "Supplier concentration is the main fragility source.",
        "reduced_risks": ["supplier_concentration"],
        "tradeoff_summary": "Higher transition complexity for stronger resilience."
      }
    ],
    "executive_summary": "Increasing inventory is the strongest balanced near-term option.",
    "confidence": 0.78,
    "timestamp": "2026-03-29T19:10:00Z"
  },
  "simulation": {
    "critical_paths": [
      {
        "path": ["obj_supplier", "obj_inventory", "obj_delivery"],
        "impact_strength": 0.18
      }
    ],
    "timeline": [
      {
        "t": 2,
        "key_events": ["Inventory threshold crossed; delivery delay emerges."]
      }
    ]
  },
  "propagation": {
    "summary": "Supply disruption primarily impacts supplier and inventory.",
    "object_impacts": [
      {
        "object_id": "obj_supplier",
        "risk_level": "critical"
      }
    ]
  },
  "fragility": {
    "summary": "Supplier concentration remains the dominant fragility source.",
    "drivers": ["supplier_concentration"]
  },
  "timeline_memory": {
    "events": [
      {
        "id": "evt_decision_1",
        "type": "decision",
        "title": "Decision evaluated",
        "summary": "Inventory increase ranked highest for balanced near-term resilience.",
        "related_objects": ["obj_inventory"],
        "timestamp": "2026-03-29T19:10:00Z",
        "confidence": 0.78
      }
    ]
  }
}
```

Canonical output:

```json
{
  "advice": {
    "summary": "Increasing inventory is the strongest balanced near-term option.",
    "recommendation": {
      "label": "Switch supplier",
      "rationale": "Supplier concentration is the main fragility source.",
      "confidence": 0.73
    },
    "alternative_options": [
      {
        "label": "Increase inventory buffer",
        "benefit": "Fast operational protection against supply disruption.",
        "downside": "Raises cost pressure and working-capital usage.",
        "score": 0.54
      }
    ],
    "key_risks": ["supplier_concentration"],
    "affected_objects": ["obj_supplier", "obj_inventory"],
    "suggested_next_steps": [
      "Review supplier transition feasibility.",
      "Validate inventory exposure during changeover."
    ]
  },
  "timeline": {
    "events": [
      {
        "id": "evt_decision_1",
        "type": "decision",
        "title": "Decision evaluated",
        "summary": "Inventory increase ranked highest for balanced near-term resilience.",
        "related_objects": ["obj_inventory"],
        "timestamp": "2026-03-29T19:10:00Z",
        "confidence": 0.78
      },
      {
        "id": "evt_sim_2",
        "type": "simulation",
        "title": "Simulation threshold crossed",
        "summary": "Inventory threshold crossed; delivery delay emerges.",
        "related_objects": ["obj_inventory", "obj_delivery"],
        "timestamp": "2026-03-29T19:10:00Z",
        "confidence": 0.72
      }
    ],
    "summary": "Decision, simulation, and source events are merged into one chronological stream."
  },
  "war_room": {
    "executive_summary": "Supplier concentration remains the active issue, with inventory emerging as the main downstream bottleneck.",
    "active_issue": {
      "label": "Supplier concentration",
      "severity": "critical",
      "summary": "Supply disruption continues to amplify fragility through inventory and delivery."
    },
    "strategic_options": [
      {
        "label": "Switch supplier",
        "projected_effect": "Reduce structural supply fragility.",
        "tradeoff": "Higher transition complexity.",
        "confidence": 0.73
      },
      {
        "label": "Increase inventory buffer",
        "projected_effect": "Improve short-term operational resilience.",
        "tradeoff": "Higher working-capital pressure.",
        "confidence": 0.84
      }
    ],
    "critical_paths": [
      {
        "label": "Supplier -> Inventory -> Delivery",
        "objects": ["obj_supplier", "obj_inventory", "obj_delivery"],
        "impact_strength": 0.18
      }
    ],
    "decision_focus_objects": ["obj_supplier", "obj_inventory"],
    "escalation_note": "Escalate if supplier transition is blocked and inventory pressure continues rising."
  },
  "metadata": {
    "source_trace": [
      "advice:decision_engine",
      "timeline:memory_engine",
      "timeline:simulation_events",
      "war_room:decision_simulation"
    ],
    "confidence": 0.79,
    "timestamp": "2026-03-29T19:10:00Z"
  }
}
```

## Integration Point With HomeScreen / Panel Host

Recommended integration point:

```text
HomeScreen
  -> buildCanonicalPanelData(payload)
  -> RightPanelHost / HUD panel host
  -> panel components receive only:
     - canonicalPanelData.advice
     - canonicalPanelData.timeline
     - canonicalPanelData.war_room
```

Recommended placement:

- build canonical panel data in a single selector/helper near the panel host boundary
- replace current scattered `pickFirst(...)` logic in `buildPanelResolvedData`
- keep `HUDPanels` and `RightPanelHost` render-focused

## UI Rules

Panels must:

- read canonical slices only
- contain no business logic
- contain no engine-specific parsing logic
- remain render-only where possible

## MVP Constraints

Keep:

- deterministic source selection
- explicit trace metadata
- one canonical root object
- no panel-specific AI calls

Do not add:

- duplicated transformations across components
- direct engine parsing in panel components
- ad hoc fallback summaries inside the UI
