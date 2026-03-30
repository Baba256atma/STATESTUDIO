# Nexora Web Intelligence Engine

## Purpose

The Web Intelligence Engine is a URL-specific ingestion service.

It does one job:

`webpage content -> structured system signals`

It does not:

- mutate scene state directly
- mutate panels directly
- generate final recommendations
- bypass the existing Nexora engine chain

All downstream reasoning remains inside:

- Fragility Scanner
- System Modeling Engine
- Scenario Simulation Engine
- Decision Engine

## Input

```ts
type WebIntelligenceRequest = {
  url: string;
  optional_context?: string;
  user_id: string;
};
```

## Module Structure

```text
backend/app/models/web_intelligence.py
  Pydantic request/response contracts for WebIntelligenceRequest and WebSystemSignal.

backend/app/routers/web_intelligence_router.py
  POST /ingestion/url
  URL entry point for Add URL and chat-routed URL ingestion.

backend/app/services/ingestion/connectors/url_connector.py
  Safe fetch adapter.
  Validates URL, enforces timeout/content-size/type limits, retrieves raw HTML.

backend/app/services/ingestion/parsers/url_content_extractor.py
  Removes scripts, ads, nav, footers, comments, and non-content blocks.
  Extracts:
  - title
  - source
  - published date
  - canonical URL
  - main article body

backend/app/services/ingestion/parsers/content_normalizer.py
  Cleans text, collapses whitespace, removes noise, segments content into logical blocks.

backend/app/services/ingestion/interpretation/web_signal_interpreter.py
  Extracts:
  - entities
  - events
  - signals
  - sentiment
  - intensity
  Deterministic first, AI-assisted only through existing Nexora AI core policy.

backend/app/services/ingestion/mapping/web_signal_mapper.py
  Converts interpreted web findings into Nexora-compatible signal types.

backend/app/services/ingestion/mapping/object_matcher.py
  Resolves signals and entities against existing Nexora object ids.

backend/app/services/ingestion/mapping/suggestion_builder.py
  Produces suggested new objects when mapping confidence is too low.
  Suggest only, never auto-create.

backend/app/services/ingestion/pipeline/web_handoff.py
  Sole integration boundary into Nexora AI Core Pipeline.
  Forwards WebSystemSignal to existing engines.

backend/app/services/ingestion/timeline_event_builder.py
  Builds one timeline event per processed URL with source_ref and summary.

backend/app/services/ingestion/trace_store.py
  Stores fetch, parse, interpretation, mapping, and handoff trace metadata.
```

## Pipeline Flow

```text
Add URL / chat URL
  -> web_intelligence_router
  -> url_connector
  -> url_content_extractor
  -> content_normalizer
  -> web_signal_interpreter
  -> web_signal_mapper
  -> object_matcher
  -> suggestion_builder
  -> WebSystemSignal
  -> web_handoff
      -> Fragility Scanner
      -> System Modeling Engine
      -> Scenario Simulation Engine
      -> Decision Engine
      -> Timeline / Memory
  -> existing Nexora response packaging
  -> Chat explanation / Timeline event / Scene reaction
```

## Processing Stages

### 1. Fetch Layer

Responsibilities:

- validate input URL
- fetch webpage safely
- restrict to single page only
- enforce timeout and response size caps
- reject unsupported content types

Output:

```text
FetchedWebPage
  url
  canonical_url
  raw_html
  content_type
  fetched_at
```

### 2. Content Normalization

Responsibilities:

- strip scripts, styles, ads, navigation, footer, sidebars
- extract main article body
- clean text
- normalize whitespace
- segment into paragraphs / blocks
- capture metadata: title, source, published date

Output:

```text
NormalizedWebContent
  source_ref
  title
  source_name
  published_at
  text
  blocks[]
  metadata
```

### 3. Semantic Understanding

Extract:

- entities
  - companies
  - countries
  - sectors
  - products
- events
  - interest rate increase
  - supply disruption
  - policy change
  - demand slowdown
- signals
  - economic
  - political
  - operational
  - financial
- sentiment
  - positive
  - negative
  - neutral
- intensity
  - low
  - medium
  - high
  - critical

Rules:

- deterministic rule extraction first
- context-aware interpretation using `optional_context` when present
- explainable evidence per extracted event/signal
- no recommendations, no scenario decisions

### 4. System Signal Conversion

Normalize extracted meaning into Nexora signal taxonomy.

Examples:

- `interest rate increase -> financial_pressure`
- `shipping delay -> supply_chain_disruption`
- `regulation change -> regulatory_risk`
- `demand slowdown -> demand_decline`

Additional clean mappings:

- `tariff increase -> regulatory_risk`
- `labor strike -> operational_disruption`
- `commodity price surge -> cost_pressure`
- `credit tightening -> liquidity_pressure`

## Output Contract

```ts
type WebSystemSignal = {
  source_type: "url";
  source_ref: string;
  title: string;
  summary: string;

  entities: Array<{
    name: string;
    kind: "company" | "country" | "sector" | "product" | "institution" | "other";
    evidence?: string[];
  }>;

  events: Array<{
    name: string;
    category: string;
    evidence?: string[];
  }>;

  signals: Array<{
    type: string;
    intensity: "low" | "medium" | "high" | "critical";
    direction: "increase" | "decrease" | "disruption";
    confidence: number;
  }>;

  related_domains: string[];
  affected_object_candidates: Array<{
    object_id: string;
    match_type: "exact" | "alias" | "contextual";
    confidence: number;
  }>;
  suggested_new_objects: Array<{
    name: string;
    kind: string;
    reason: string;
  }>;
  sentiment: "positive" | "negative" | "neutral";

  confidence: number;
  timestamp: string;
};
```

Contract rules:

- `source_type` is always `"url"`
- `confidence` fields are clamped to `[0,1]`
- all models use `extra="forbid"`
- every signal should be traceable to source text
- `source_ref` should use canonical URL plus fetch timestamp

Example source ref:

```text
url:https://example.com/news/port-strike:2026-03-29T16:10:00Z
```

## Object Mapping

Mapping policy:

1. try exact object id/name match
2. try alias match from object dictionary / workspace object labels
3. try contextual match using domain and signal co-occurrence
4. if still unresolved, emit `suggested_new_objects`

Rules:

- never auto-create objects in MVP
- never write object state from this engine
- unresolved material entities must remain suggestions only

## Timeline Integration

Every processed webpage emits one timeline event:

```text
TimelineEvent
  type: "web_signal_ingested"
  source_ref
  title
  summary
  signal_count
  timestamp
```

This is timeline/memory metadata only.
Scene changes happen later through downstream engines.

## Integration Point With Nexora Engines

Single handoff boundary:

`backend/app/services/ingestion/pipeline/web_handoff.py`

Responsibilities:

- accept validated `WebSystemSignal`
- adapt it into existing engine inputs
- invoke existing Nexora AI Core Pipeline
- publish timeline event and trace metadata

Downstream flow:

```text
Web Intelligence Engine
  -> WebSystemSignal
  -> Fragility Scanner
  -> System Modeling Engine
  -> Scenario Simulation Engine
  -> Decision Engine
  -> Response packaging
  -> Chat / Timeline / Scene reaction
```

This keeps the web engine as an upstream signal transformer, not an independent intelligence stack.

## Minimal Production Design

Keep:

- one URL at a time
- one page fetch only
- deterministic extraction and mapping
- explainable signal conversion
- explicit trace logging

Do not add:

- real-time streaming
- multi-page crawling
- persistent web knowledge graph
- recommendation generation
- direct UI mutation paths

## Example

Input:

```json
{
  "url": "https://news.example.com/economy/shipping-delays-worsen-after-port-strike",
  "optional_context": "supply chain",
  "user_id": "user_123"
}
```

Output:

```json
{
  "source_type": "url",
  "source_ref": "url:https://news.example.com/economy/shipping-delays-worsen-after-port-strike:2026-03-29T16:10:00Z",
  "title": "Shipping Delays Worsen After Port Strike",
  "summary": "A port strike is disrupting cargo movement, increasing shipping delays and freight cost pressure across import-dependent supply chains.",
  "entities": [
    {
      "name": "Port operators",
      "kind": "institution",
      "evidence": ["Port workers and terminal operators remain in active disruption."]
    },
    {
      "name": "Import supply chain",
      "kind": "sector",
      "evidence": ["Import-dependent businesses are facing longer lead times."]
    }
  ],
  "events": [
    {
      "name": "Port strike disruption",
      "category": "operational_disruption",
      "evidence": ["Terminal operations slowed after labor action expanded."]
    },
    {
      "name": "Freight cost increase",
      "category": "cost_pressure",
      "evidence": ["Freight rates rose as available shipping capacity tightened."]
    }
  ],
  "signals": [
    {
      "type": "supply_chain_disruption",
      "intensity": "high",
      "direction": "disruption",
      "confidence": 0.89
    },
    {
      "type": "cost_pressure",
      "intensity": "medium",
      "direction": "increase",
      "confidence": 0.78
    }
  ],
  "related_domains": ["supply_chain", "operations", "logistics"],
  "affected_object_candidates": [
    {
      "object_id": "obj_logistics",
      "match_type": "alias",
      "confidence": 0.9
    },
    {
      "object_id": "obj_inventory",
      "match_type": "contextual",
      "confidence": 0.72
    }
  ],
  "suggested_new_objects": [
    {
      "name": "Port operators",
      "kind": "institution",
      "reason": "Important source entity with no strong existing Nexora object match."
    }
  ],
  "sentiment": "negative",
  "confidence": 0.85,
  "timestamp": "2026-03-29T16:10:00Z"
}
```

## UX Placement

Trigger paths:

- `Add URL`
- chat input containing a URL

Presentation:

- chat explains what was ingested
- timeline gets one source event
- scene reacts only after existing engines process the signal
- no dedicated panel
