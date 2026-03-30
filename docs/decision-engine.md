# Nexora Decision Engine

## Purpose

The Decision Engine consumes:

- current system state
- fragility outputs
- propagation outputs
- scenario simulation results

and produces:

- structured decision options
- comparable rankings
- transparent explanations

It operates inside the Nexora AI Core and outputs canonical decision data only.

It does not:

- mutate scene directly
- update panels directly
- emit vague free-form advice
- autonomously execute actions

## Goal

Enable Nexora to answer:

- what should we do now
- which option is safer
- which option reduces fragility most
- what tradeoff are we making
- why is this recommendation better

## Input

```ts
type DecisionEngineInput = {
  current_state: {
    overall_risk_score: number;
    dominant_risks: string[];
    critical_objects: string[];
    stability_index: number;
  };

  fragility_result: Record<string, unknown>;
  propagation_result: Record<string, unknown>;
  scenario_results: Array<{
    scenario_id: string;
    label: string;
    final_state: Record<string, unknown>;
    timeline: unknown[];
    confidence: number;
  }>;

  optional_constraints?: {
    budget_limit?: number;
    time_limit?: number;
    preferred_domain?: string;
    risk_tolerance?: "low" | "medium" | "high";
  };
};
```

## Module Structure

```text
backend/app/services/decision/option_generator.py
  Converts scenario results into structured decision options.

backend/app/services/decision/option_scorer.py
  Scores options using configurable weighted criteria.

backend/app/services/decision/option_comparator.py
  Produces side-by-side comparison and top-option summaries.

backend/app/services/decision/explanation_builder.py
  Builds transparent rationale, supporting signals, reduced risks, and tradeoff summaries.

backend/app/services/decision/contracts.py
  Strict Pydantic models for DecisionOption, DecisionScore, DecisionComparison, DecisionExplanation, DecisionEngineResult.

backend/app/services/decision/pipeline_handoff.py
  Sole integration boundary into canonical advice, war-room, timeline/replay, and unified reaction contracts.
```

Minimal responsibilities:

- `option_generator.py`: scenario -> option
- `option_scorer.py`: option -> weighted score
- `option_comparator.py`: ranked options -> comparison contract
- `explanation_builder.py`: ranked options -> explainability contract

## Data Flow Diagram

```text
DecisionEngineInput
  -> option_generator
      -> DecisionOption[]
  -> option_scorer
      -> DecisionScore[]
  -> option_comparator
      -> DecisionComparison
  -> explanation_builder
      -> DecisionExplanation[]
  -> result_assembler
      -> DecisionEngineResult
  -> pipeline_handoff
      -> Advice panel canonical data
      -> War Room canonical data
      -> Timeline / Replay
      -> Scene Reaction Layer
```

## Step 1: Candidate Decision Options

Generate options directly from scenario results.

Each option should be derived from one scenario outcome and normalized into a common contract.

Contract:

```ts
type DecisionOption = {
  option_id: string;
  label: string;
  action_type: string;
  intended_effect: string;
  affected_objects: string[];

  expected_benefits: string[];
  expected_downsides: string[];
  tradeoffs: string[];

  execution_difficulty: "low" | "medium" | "high";
  expected_time_to_effect: "short" | "medium" | "long";

  projected_risk_reduction: number;
  projected_stability_gain: number;

  confidence: number;
};
```

Generation rules:

- max `3` options total for MVP
- one option per materially distinct scenario
- discard scenarios below confidence threshold unless explicitly labeled low-confidence
- ensure each option includes both benefit and downside

Recommended derivation logic:

- `label`: from scenario label or normalized action name
- `action_type`: inferred from scenario metadata or injected changes
- `affected_objects`: top changed objects from scenario final state
- `projected_risk_reduction`:
  - `current_state.overall_risk_score - scenario.final_state.overall_risk_score`
- `projected_stability_gain`:
  - `scenario.final_state.stability_index - current_state.stability_index`

Execution difficulty heuristic:

- `low`: one-object or reversible action, low downside
- `medium`: moderate downstream effect or multi-object operational dependency
- `high`: broad structural change, long execution path, or strong tradeoffs

Time-to-effect heuristic:

- `short`: effect appears in early timeline steps
- `medium`: effect appears mid-horizon
- `long`: effect appears late or requires compounding

## Step 2: Score Options

Score each option using configurable weighted criteria.

Contract:

```ts
type DecisionScore = {
  option_id: string;
  fragility_score: number;
  stability_score: number;
  feasibility_score: number;
  speed_score: number;
  confidence_score: number;
  total_score: number;
};
```

Recommended scoring dimensions:

- fragility reduction
- stability improvement
- downside severity
- implementation difficulty
- time to effect
- confidence

Recommended weights:

```text
fragility_weight   = 0.30
stability_weight   = 0.25
feasibility_weight = 0.15
speed_weight       = 0.10
confidence_weight  = 0.20
```

Feasibility scoring heuristic:

```text
execution_difficulty:
  low    -> 0.85
  medium -> 0.60
  high   -> 0.35
```

Speed scoring heuristic:

```text
expected_time_to_effect:
  short  -> 0.85
  medium -> 0.60
  long   -> 0.35
```

Recommended formulas:

```text
fragility_score = clamp01(projected_risk_reduction)
stability_score = clamp01(projected_stability_gain + 0.5)
feasibility_score = mapped_difficulty_score - downside_penalty
speed_score = mapped_time_score
confidence_score = option.confidence

total_score =
  fragility_score * fragility_weight +
  stability_score * stability_weight +
  feasibility_score * feasibility_weight +
  speed_score * speed_weight +
  confidence_score * confidence_weight
```

Constraint handling:

- if `risk_tolerance = low`, increase fragility weight and downside penalty
- if `time_limit` is tight, boost speed weight
- if `budget_limit` is tight, penalize high-difficulty options

## Step 3: Compare Options

Produce a structured top-option comparison.

Contract:

```ts
type DecisionComparison = {
  compared_option_ids: string[];
  best_overall_option: string;
  safest_option: string;
  fastest_option: string;
  highest_upside_option: string;

  comparison_summary: string;

  key_differences: Array<{
    dimension: string;
    option_a: string;
    option_b: string;
    difference: string;
  }>;
};
```

Comparison rules:

- `best_overall_option`: highest total score
- `safest_option`: highest fragility score with acceptable downside
- `fastest_option`: highest speed score
- `highest_upside_option`: highest projected stability gain

Key differences should highlight:

- risk reduction gap
- speed gap
- difficulty gap
- major tradeoff difference

## Step 4: Explainability

Every option needs a transparent explanation.

Contract:

```ts
type DecisionExplanation = {
  option_id: string;
  rationale: string;
  supporting_signals: string[];
  impacted_objects: string[];
  reduced_risks: string[];
  tradeoff_summary: string;
  explanation_confidence: number;
};
```

Each explanation must answer:

- why this option exists
- what system signals support it
- what objects it affects
- what risks it reduces
- what tradeoff it introduces

Rules:

- no recommendation without explanation
- no best option without tradeoff disclosure
- if confidence below threshold, mark clearly in rationale and explanation confidence

Recommended low-confidence threshold:

```text
min_recommendation_confidence = 0.55
```

If below threshold:

- keep option in ranked list only if materially useful
- mark as `lower confidence due to limited scenario certainty`

## Final Output Contract

```ts
type DecisionEngineResult = {
  recommended_option_id: string;
  ranked_options: DecisionOption[];
  option_scores: DecisionScore[];
  comparison: DecisionComparison;
  explanations: DecisionExplanation[];

  executive_summary: string;
  confidence: number;
  timestamp: string;
};
```

Output rules:

- `recommended_option_id` must exist in `ranked_options`
- `ranked_options` sorted by `total_score`
- `option_scores` aligned by `option_id`
- `confidence` is aggregate confidence across top options and explanation quality
- `executive_summary` must mention recommendation and main tradeoff

Recommended executive summary shape:

```text
"Option X is ranked highest because it reduces fragility more than alternatives while keeping execution difficulty manageable, but it trades near-term cost or speed for resilience."
```

## Example

Input:

```json
{
  "current_state": {
    "overall_risk_score": 0.66,
    "dominant_risks": ["supply_disruption", "delivery_delay"],
    "critical_objects": ["obj_supplier", "obj_inventory"],
    "stability_index": 0.49
  },
  "fragility_result": {},
  "propagation_result": {},
  "scenario_results": [
    {
      "scenario_id": "increase_inventory",
      "label": "Increase inventory buffer",
      "final_state": {
        "overall_risk_score": 0.44,
        "stability_index": 0.64,
        "object_impacts": [
          { "object_id": "obj_inventory", "risk_score": 0.41 },
          { "object_id": "obj_delivery", "risk_score": 0.33 }
        ],
        "dominant_risks": ["cost_pressure"]
      },
      "timeline": [],
      "confidence": 0.84
    },
    {
      "scenario_id": "switch_supplier",
      "label": "Switch supplier",
      "final_state": {
        "overall_risk_score": 0.38,
        "stability_index": 0.68,
        "object_impacts": [
          { "object_id": "obj_supplier", "risk_score": 0.29 },
          { "object_id": "obj_inventory", "risk_score": 0.35 }
        ],
        "dominant_risks": ["transition_risk"]
      },
      "timeline": [],
      "confidence": 0.73
    },
    {
      "scenario_id": "reduce_cost",
      "label": "Reduce operating cost",
      "final_state": {
        "overall_risk_score": 0.71,
        "stability_index": 0.42,
        "object_impacts": [
          { "object_id": "obj_inventory", "risk_score": 0.72 }
        ],
        "dominant_risks": ["stockout_risk", "delivery_delay"]
      },
      "timeline": [],
      "confidence": 0.77
    }
  ],
  "optional_constraints": {
    "risk_tolerance": "low"
  }
}
```

Output:

```json
{
  "recommended_option_id": "option_switch_supplier",
  "ranked_options": [
    {
      "option_id": "option_switch_supplier",
      "label": "Switch supplier",
      "action_type": "supplier_change",
      "intended_effect": "Reduce concentration risk and stabilize supply continuity.",
      "affected_objects": ["obj_supplier", "obj_inventory"],
      "expected_benefits": [
        "Largest projected reduction in supply fragility.",
        "Improves downstream inventory resilience."
      ],
      "expected_downsides": [
        "Introduces transition risk during supplier changeover."
      ],
      "tradeoffs": [
        "Higher implementation complexity in exchange for stronger resilience gains."
      ],
      "execution_difficulty": "high",
      "expected_time_to_effect": "medium",
      "projected_risk_reduction": 0.28,
      "projected_stability_gain": 0.19,
      "confidence": 0.73
    },
    {
      "option_id": "option_increase_inventory",
      "label": "Increase inventory buffer",
      "action_type": "inventory_increase",
      "intended_effect": "Absorb supply volatility and reduce short-term operational disruption.",
      "affected_objects": ["obj_inventory", "obj_delivery"],
      "expected_benefits": [
        "Fast operational protection against supply disruption.",
        "Improves delivery continuity."
      ],
      "expected_downsides": [
        "Raises cost pressure and working-capital usage."
      ],
      "tradeoffs": [
        "Faster protection, but weaker long-term structural fragility reduction."
      ],
      "execution_difficulty": "medium",
      "expected_time_to_effect": "short",
      "projected_risk_reduction": 0.22,
      "projected_stability_gain": 0.15,
      "confidence": 0.84
    },
    {
      "option_id": "option_reduce_cost",
      "label": "Reduce operating cost",
      "action_type": "cost_reduction",
      "intended_effect": "Lower short-term cost exposure.",
      "affected_objects": ["obj_inventory"],
      "expected_benefits": [
        "Reduces immediate operating expense."
      ],
      "expected_downsides": [
        "Increases fragility under supply disruption.",
        "Raises downstream delivery risk."
      ],
      "tradeoffs": [
        "Short-term savings at the cost of higher operational fragility."
      ],
      "execution_difficulty": "low",
      "expected_time_to_effect": "short",
      "projected_risk_reduction": 0.0,
      "projected_stability_gain": -0.07,
      "confidence": 0.77
    }
  ],
  "option_scores": [
    {
      "option_id": "option_switch_supplier",
      "fragility_score": 0.28,
      "stability_score": 0.69,
      "feasibility_score": 0.25,
      "speed_score": 0.6,
      "confidence_score": 0.73,
      "total_score": 0.49
    },
    {
      "option_id": "option_increase_inventory",
      "fragility_score": 0.22,
      "stability_score": 0.65,
      "feasibility_score": 0.55,
      "speed_score": 0.85,
      "confidence_score": 0.84,
      "total_score": 0.54
    },
    {
      "option_id": "option_reduce_cost",
      "fragility_score": 0.0,
      "stability_score": 0.43,
      "feasibility_score": 0.8,
      "speed_score": 0.85,
      "confidence_score": 0.77,
      "total_score": 0.42
    }
  ],
  "comparison": {
    "compared_option_ids": [
      "option_switch_supplier",
      "option_increase_inventory",
      "option_reduce_cost"
    ],
    "best_overall_option": "option_increase_inventory",
    "safest_option": "option_switch_supplier",
    "fastest_option": "option_increase_inventory",
    "highest_upside_option": "option_switch_supplier",
    "comparison_summary": "Increasing inventory is the most balanced near-term option, while switching supplier creates the strongest long-term fragility reduction at higher execution complexity.",
    "key_differences": [
      {
        "dimension": "risk_reduction",
        "option_a": "option_switch_supplier",
        "option_b": "option_increase_inventory",
        "difference": "Switch supplier reduces structural fragility more, but takes longer to realize."
      },
      {
        "dimension": "execution_speed",
        "option_a": "option_increase_inventory",
        "option_b": "option_switch_supplier",
        "difference": "Inventory increase acts faster with lower operational complexity."
      }
    ]
  },
  "explanations": [
    {
      "option_id": "option_switch_supplier",
      "rationale": "This option exists because supplier concentration is the main fragility source in the current system and the scenario shows the strongest reduction in downstream disruption.",
      "supporting_signals": ["supply_disruption", "delivery_delay"],
      "impacted_objects": ["obj_supplier", "obj_inventory"],
      "reduced_risks": ["supplier_concentration", "inventory_instability"],
      "tradeoff_summary": "It improves resilience most, but introduces execution and transition complexity.",
      "explanation_confidence": 0.78
    },
    {
      "option_id": "option_increase_inventory",
      "rationale": "This option exists because inventory buffers absorb first-order supply shocks and improve short-term delivery continuity.",
      "supporting_signals": ["supply_disruption"],
      "impacted_objects": ["obj_inventory", "obj_delivery"],
      "reduced_risks": ["stockout_risk", "delivery_delay"],
      "tradeoff_summary": "It is faster and easier, but increases cost pressure and does less to reduce structural fragility.",
      "explanation_confidence": 0.84
    },
    {
      "option_id": "option_reduce_cost",
      "rationale": "This option exists because cost pressure is present, but the scenario shows it worsens fragility under disruption conditions.",
      "supporting_signals": ["cost_pressure", "supply_disruption"],
      "impacted_objects": ["obj_inventory"],
      "reduced_risks": [],
      "tradeoff_summary": "It lowers cost temporarily, but increases operational vulnerability.",
      "explanation_confidence": 0.72
    }
  ],
  "executive_summary": "Increasing inventory is the strongest balanced option for a low-risk posture because it improves resilience quickly with manageable execution difficulty, while switching supplier has better long-term upside but a harder transition tradeoff.",
  "confidence": 0.78,
  "timestamp": "2026-03-29T19:10:00Z"
}
```

## Integration Point With Nexora Pipeline

Single backend boundary:

`backend/app/services/decision/pipeline_handoff.py`

Responsibilities:

- forward `DecisionEngineResult` into canonical downstream contracts
- preserve explainability and tradeoff disclosure
- avoid direct UI mutation

Downstream consumers:

### Advice Panel Canonical Data

- convert recommended option, alternatives, and rationale into canonical advice payloads

### War Room Canonical Data

- expose ranked options and comparisons as structured strategic inputs

### Timeline / Replay System

- persist decision result, scores, and explanations for replay and auditability

### Scene Reaction Layer

- forward only structured highlighted objects / risk targets through the unified reaction contract
- no direct scene mutation from the decision engine

## Safety / UX Rules

- never present recommendation without explanation
- never present best option without tradeoff disclosure
- never recommend low-confidence actions without explicit low-confidence labeling
- keep outputs deterministic and structured
- max 3 options for MVP

## MVP Constraints

Keep:

- deterministic scoring
- top 3 options max
- explicit explanation per option
- configurable scoring weights

Do not add:

- autonomous execution
- external action APIs
- black-box ranking
- vague free-form recommendations
