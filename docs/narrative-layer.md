# Nexora Narrative Layer

## Purpose

The Narrative Layer translates structured Nexora engine outputs into:

- executive-level narratives
- human-understandable strategic explanations
- concise decision-oriented storytelling

It is a presentation layer over canonical engine outputs.

It does not:

- invent new data
- contradict propagation or simulation results
- output raw technical structures
- generate long essays

Narrative must remain:

- concise
- structured
- strategic
- explainable

## Goal

Enable Nexora to explain:

- what is happening
- why it is happening
- what will likely happen next
- what decision matters most

## Input

```ts
type NarrativeInput = {
  fragility_result: Record<string, unknown> | null;
  propagation_result: Record<string, unknown> | null;
  scenario_results: unknown[];
  decision_result: Record<string, unknown> | null;
  panel_data: Record<string, unknown> | null;
  context: {
    domain?: string;
    user_intent?: string;
  };
};
```

## Output Contract

```ts
type SituationSummary = {
  headline: string;
  short_summary: string;
};

type CausalExplanation = {
  root_cause: string;
  key_drivers: string[];
  propagation_story: string;
};

type ForwardOutlook = {
  trajectory: string;
  critical_risks: string[];
  time_horizon_note: string;
};

type DecisionNarrative = {
  recommended_action: string;
  reasoning: string;
  tradeoff: string;
  confidence: number;
};

type ExecutiveNarrative = {
  headline: string;
  key_message: string;
  what_is_happening: string;
  why_it_matters: string;
  what_to_do_next: string;
};

type NarrativeOutput = {
  situation: SituationSummary;
  causality: CausalExplanation;
  outlook: ForwardOutlook;
  decision: DecisionNarrative;
  executive_summary: ExecutiveNarrative;
  confidence: number;
  timestamp: string;
};
```

## Module Structure

```text
backend/app/services/narrative/narrative_builder.py
  Main orchestrator.
  Builds NarrativeOutput from canonical engine results.

backend/app/services/narrative/causal_explainer.py
  Generates root-cause, key-driver, and propagation explanation text.

backend/app/services/narrative/decision_explainer.py
  Generates recommendation reasoning, tradeoff narrative, and decision-focused text.

backend/app/services/narrative/contracts.py
  Strict Pydantic contracts for all narrative sections.

backend/app/services/narrative/style_policy.py
  Small deterministic formatting rules for brevity, tone, and repetition control.
```

Minimal responsibilities:

- `narrative_builder.py`: assemble all sections
- `causal_explainer.py`: explain why pressure is building and how it spreads
- `decision_explainer.py`: explain best option, rationale, and tradeoff

## Narrative Design Rules

### Global Rules

- use only canonical engine outputs
- never infer beyond available evidence
- keep each section short
- avoid repeating the same sentence across sections
- prefer business language over technical terms

Preferred words:

- pressure
- risk
- impact
- tradeoff
- leverage
- resilience

Avoid:

- “the system shows”
- “based on data”
- “propagation engine”
- robotic phrasing

## Step 1: Situation Summary

Purpose:

- describe current state
- identify key issue
- describe overall risk level

Contract:

```ts
type SituationSummary = {
  headline: string;
  short_summary: string;
};
```

Source priority:

1. decision result current-state summary
2. fragility result
3. panel advice/war-room summary

Generation rules:

- `headline` should capture the main issue in one sentence fragment
- `short_summary` should cover state + risk level in one or two sentences
- keep it sharp and directional

Example shape:

- headline: `Supplier pressure is now the central risk`
- short_summary: `Risk is concentrated around the supply base, with downstream strain building in inventory and delivery.`

## Step 2: Causal Explanation

Purpose:

- explain what caused the issue
- identify involved objects
- explain how it spreads

Contract:

```ts
type CausalExplanation = {
  root_cause: string;
  key_drivers: string[];
  propagation_story: string;
};
```

Source priority:

1. propagation result
2. fragility result
3. simulation critical paths

Generation rules:

- `root_cause` should name the main originating pressure
- `key_drivers` should be short labels only
- `propagation_story` should explain the dominant path in business language

Example phrasing:

- `This is driven by supplier concentration and rising delivery delay.`
- `Pressure starts at the supplier base, moves into inventory, and then weakens delivery reliability.`

## Step 3: Forward Look

Purpose:

- explain what is likely to happen next
- highlight critical transitions

Contract:

```ts
type ForwardOutlook = {
  trajectory: string;
  critical_risks: string[];
  time_horizon_note: string;
};
```

Source priority:

1. scenario results
2. decision comparison outputs
3. propagation summary if no simulation exists

Generation rules:

- `trajectory` should describe the near-future direction
- `critical_risks` should list only the top 1-3 risks
- `time_horizon_note` should anchor the forecast window

Example phrasing:

- `If unaddressed, pressure is likely to move from inventory strain into broader service disruption over the next few steps.`

## Step 4: Decision Focus

Purpose:

- summarize the best available option
- explain why it is preferred
- expose the tradeoff

Contract:

```ts
type DecisionNarrative = {
  recommended_action: string;
  reasoning: string;
  tradeoff: string;
  confidence: number;
};
```

Source priority:

1. decision result
2. advice panel canonical data
3. `null`-safe empty recommendation text if no decision exists

Rules:

- never present an action without rationale
- never present a preferred option without tradeoff
- if confidence is low, say so directly and briefly

Example phrasing:

- `Increase inventory buffer`
- `It is preferred because it reduces near-term disruption faster than the alternatives.`
- `The tradeoff is higher working-capital pressure and weaker long-term structural improvement.`

## Step 5: Executive Summary

Purpose:

- combine the prior sections into one concise narrative

Contract:

```ts
type ExecutiveNarrative = {
  headline: string;
  key_message: string;
  what_is_happening: string;
  why_it_matters: string;
  what_to_do_next: string;
};
```

Constraints:

- max `5-6` sentences total across fields
- high clarity
- low jargon

Recommended field behavior:

- `headline`: the main strategic issue
- `key_message`: one-sentence top takeaway
- `what_is_happening`: current situation + near spread
- `why_it_matters`: business consequence
- `what_to_do_next`: best option + tradeoff

## Deterministic Narrative Policy

To keep output stable and non-hallucinatory:

- all text is template-backed
- each sentence uses only extracted fields from engine outputs
- no speculative explanation unless the simulation/outlook explicitly supports it
- if a section lacks evidence, return a shorter neutral sentence instead of filling gaps

Suggested implementation pattern:

```text
1. normalize canonical inputs
2. extract top facts per section
3. fill a small set of templates
4. deduplicate overlapping phrases
5. clamp total verbosity
```

## Example

Input:

```json
{
  "fragility_result": {
    "summary": "Supplier concentration remains the dominant fragility source.",
    "drivers": ["supplier_concentration"],
    "level": "high"
  },
  "propagation_result": {
    "summary": "Supply disruption primarily impacts supplier and inventory.",
    "primary_objects": ["obj_supplier"],
    "affected_objects": ["obj_inventory", "obj_delivery"],
    "propagation_paths": [
      {
        "path": ["obj_supplier", "obj_inventory", "obj_delivery"],
        "strength": 0.18
      }
    ]
  },
  "scenario_results": [
    {
      "scenario_id": "increase_inventory",
      "label": "Increase inventory buffer",
      "final_state": {
        "overall_risk_score": 0.44,
        "dominant_risks": ["cost_pressure"],
        "stability_index": 0.64
      },
      "timeline": [
        {
          "t": 2,
          "key_events": ["Inventory strain eases and delivery pressure stabilizes."]
        }
      ],
      "confidence": 0.84
    }
  ],
  "decision_result": {
    "recommended_option_id": "option_increase_inventory",
    "ranked_options": [
      {
        "option_id": "option_increase_inventory",
        "label": "Increase inventory buffer",
        "projected_risk_reduction": 0.22,
        "projected_stability_gain": 0.15,
        "confidence": 0.84
      }
    ],
    "explanations": [
      {
        "option_id": "option_increase_inventory",
        "rationale": "Inventory buffers absorb first-order supply shocks and improve short-term delivery continuity.",
        "tradeoff_summary": "It is faster and easier, but increases cost pressure."
      }
    ],
    "executive_summary": "Increasing inventory is the strongest balanced near-term option.",
    "confidence": 0.78,
    "timestamp": "2026-03-29T21:10:00Z"
  },
  "panel_data": {},
  "context": {
    "domain": "supply_chain",
    "user_intent": "what should we do now"
  }
}
```

Output:

```json
{
  "situation": {
    "headline": "Supplier pressure is the central issue",
    "short_summary": "Risk is concentrated around the supply base, with meaningful downstream strain building in inventory and delivery."
  },
  "causality": {
    "root_cause": "The current pressure is building around supplier concentration.",
    "key_drivers": ["supplier_concentration", "delivery_delay"],
    "propagation_story": "The impact starts at the supplier base, moves into inventory, and then weakens delivery reliability."
  },
  "outlook": {
    "trajectory": "If unaddressed, the next phase is likely to be broader delivery instability rather than a contained supplier issue.",
    "critical_risks": ["delivery_delay", "inventory_strain"],
    "time_horizon_note": "This outlook reflects the near-term simulation horizon."
  },
  "decision": {
    "recommended_action": "Increase inventory buffer",
    "reasoning": "It is preferred because it absorbs the immediate shock faster than the available alternatives and improves near-term stability.",
    "tradeoff": "The tradeoff is higher cost pressure and a weaker long-term structural fix than supplier diversification.",
    "confidence": 0.78
  },
  "executive_summary": {
    "headline": "Contain the supply shock before it broadens",
    "key_message": "Pressure is still concentrated enough to manage, but the window to prevent downstream delivery instability is narrowing.",
    "what_is_happening": "Supplier concentration is driving the current disruption, and the strain is moving into inventory and delivery.",
    "why_it_matters": "If this continues, operational risk shifts from a contained upstream issue into customer-facing performance pressure.",
    "what_to_do_next": "Increase inventory buffer now to reduce immediate disruption, while recognizing the tradeoff of higher cost pressure."
  },
  "confidence": 0.79,
  "timestamp": "2026-03-29T21:10:00Z"
}
```

## Integration

Flow:

```text
Fragility + Propagation + Simulation + Decision + Panel Data
  -> narrative_builder
  -> NarrativeOutput
  -> Chat response layer
  -> Advice panel text layer
  -> War Room executive summary
```

### Chat

- use `executive_summary` for the opening answer
- use `decision` and `outlook` when the user asks what to do or what happens next

### Advice Panel

- use `decision.reasoning`
- use `executive_summary.what_to_do_next`
- keep recommendation text aligned with canonical panel data

### War Room

- use `executive_summary.headline`
- use `causality.propagation_story`
- use `outlook.trajectory`

## MVP Constraints

Keep:

- deterministic section structure
- short template-backed outputs
- no invented facts
- low repetition

Do not add:

- long-form essays
- freeform storytelling disconnected from engine outputs
- raw JSON exposure
- hidden reasoning layers
