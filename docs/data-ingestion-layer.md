# Nexora Data Ingestion Layer

## Goal

Create a single ingestion boundary that accepts `pdf`, `csv`, `api`, and `url` inputs and emits one deterministic contract:

`IngestedSystemSignal`

This layer does not mutate `scene_json`, panels, or recommendations directly. It only prepares normalized system signals for existing Nexora engines.

## Architecture Fit

This design preserves Nexora's current shared-core principle:

- frontend remains the entry surface
- backend remains the orchestration layer
- ingestion becomes an upstream adapter into the existing engine stack
- fragility, modeling, simulation, decision, memory, and timeline remain downstream consumers

Canonical flow:

```text
Add Source
  -> Ingestion Connectors
  -> Parsers
  -> Interpretation Layer
  -> Mapping Layer
  -> IngestedSystemSignal
  -> AI Core Pipeline
  -> Fragility Scanner
  -> System Modeling Engine
  -> Scenario Simulation Engine
  -> Decision Engine
  -> Timeline / Memory
  -> Chat / Scene Reaction / Existing Panels
```

## Module Structure

### Backend

```text
backend/app/models/ingestion.py
  Strict Pydantic contracts for ingestion requests, trace entries, and IngestedSystemSignal.

backend/app/routers/ingestion_router.py
  FastAPI endpoints for Add Source actions:
  - POST /ingestion/pdf
  - POST /ingestion/csv
  - POST /ingestion/api
  - POST /ingestion/url
  Returns accepted signal package and trace metadata only.

backend/app/services/ingestion/orchestrator.py
  Main coordinator.
  Resolves connector -> parser -> interpretation -> mapping -> pipeline handoff.
  No engine-specific business logic beyond orchestration.

backend/app/services/ingestion/contracts.py
  Internal typed protocols for Connector, Parser, Interpreter, Mapper.

backend/app/services/ingestion/connectors/pdf_connector.py
  Accepts uploaded PDF file reference and stores source metadata.

backend/app/services/ingestion/connectors/csv_connector.py
  Accepts uploaded CSV/tabular file reference and stores source metadata.

backend/app/services/ingestion/connectors/api_connector.py
  Accepts posted JSON payload or configured API snapshot response.

backend/app/services/ingestion/connectors/url_connector.py
  Fetches a webpage in safe mode with domain allow/deny rules, timeout, and content-size limits.

backend/app/services/ingestion/parsers/pdf_parser.py
  Extracts normalized text blocks, page spans, headings, and tables if available.

backend/app/services/ingestion/parsers/csv_parser.py
  Converts tabular input into deterministic rows, typed columns, summary stats, and metric candidates.

backend/app/services/ingestion/parsers/api_parser.py
  Normalizes arbitrary JSON into flattened records, nested objects, arrays, timestamps, and numeric metric candidates.

backend/app/services/ingestion/parsers/url_parser.py
  Extracts main article content, title, published date, and source metadata only.
  Excludes nav, ads, comments, and unrelated page chrome.

backend/app/services/ingestion/interpretation/interpreter.py
  Shared interpretation service that extracts:
  - entities
  - risks
  - events
  - metrics
  - trends
  - relationships
  This is the only AI-aligned inference layer inside ingestion.

backend/app/services/ingestion/interpretation/rulepacks.py
  Deterministic extraction rules for economic, political, market, operational, and regulatory patterns.
  Used before or alongside existing AI core routing.

backend/app/services/ingestion/mapping/object_matcher.py
  Matches extracted entities and signals to existing Nexora object ids using dictionary aliases and workspace context.

backend/app/services/ingestion/mapping/signal_mapper.py
  Converts interpreted evidence into standardized Nexora signal categories such as:
  - supply_risk
  - demand_shock
  - regulatory_pressure
  - financial_stress

backend/app/services/ingestion/mapping/suggestion_builder.py
  Produces non-mutating suggested objects for unresolved entities.
  No auto-create in MVP.

backend/app/services/ingestion/mapping/confidence.py
  Deterministic confidence scoring from parse quality, source quality, evidence density, and object match quality.

backend/app/services/ingestion/pipeline/handoff.py
  Sole handoff into the AI Core Pipeline.
  Adapts IngestedSystemSignal into existing downstream engine inputs.

backend/app/services/ingestion/trace_store.py
  Persists ingestion audit trail and debug trace for reproducibility.

backend/app/services/ingestion/source_store.py
  Stores normalized source metadata and source_ref lookups.
```

### Frontend

```text
frontend/app/lib/ingestion/ingestionTypes.ts
  TS contracts mirroring backend ingestion schemas.

frontend/app/lib/ingestion/ingestionClient.ts
  Client for Add Source actions.

frontend/app/components/AddSourceEntryPoint.tsx
  Existing-surface entry point with four actions:
  - Upload PDF
  - Upload CSV
  - Add URL
  - Connect API

frontend/app/lib/chat/sourceIngestionMessageMapper.ts
  Converts accepted ingestion results into chat/timeline-safe presentation data.
```

## Core Contract

```ts
type IngestedSystemSignal = {
  source_type: "pdf" | "csv" | "api" | "url";
  source_ref: string;
  extracted_entities: Array<{
    id?: string;
    name: string;
    kind: string;
    evidence?: string[];
  }>;
  extracted_events: Array<{
    name: string;
    category: string;
    timestamp?: string | null;
    severity?: "low" | "medium" | "high" | "critical";
    evidence?: string[];
  }>;
  extracted_metrics: Array<{
    name: string;
    value: number | string;
    unit?: string | null;
    direction?: "up" | "down" | "flat" | "unknown";
    period?: string | null;
  }>;
  detected_risks: Array<{
    type: string;
    severity: "low" | "medium" | "high" | "critical";
    affected_entities?: string[];
    evidence?: string[];
  }>;
  signals: Array<{
    type: string;
    label: string;
    direction?: "up" | "down" | "flat" | "unknown";
    magnitude?: number | null;
    related_metric?: string | null;
    evidence?: string[];
  }>;
  related_objects: Array<{
    object_id: string;
    match_type: "exact" | "alias" | "contextual";
    confidence: number;
  }>;
  suggested_objects: Array<{
    name: string;
    kind: string;
    reason: string;
  }>;
  confidence: number;
  timestamp: string;
};
```

Schema rules:

- `extra="forbid"` on all ingestion models
- stable source refs: `pdf:<hash>`, `csv:<hash>`, `api:<source_id>:<snapshot_ts>`, `url:<normalized_url>:<fetch_ts>`
- `confidence` clamped to `[0,1]`
- every extracted item carries evidence where available
- no downstream mutation fields in this contract

## Internal Sublayers

### 1. Connectors

Responsibilities:

- authenticate and validate source access
- capture raw payload or file reference
- enforce source-type-specific safety limits
- attach source metadata

Rules:

- connectors do not interpret business meaning
- URL connector runs safe-mode fetch only
- API connector ingests snapshots, not live streaming

### 2. Parsers

Responsibilities:

- convert raw source into normalized parse artifacts
- preserve deterministic extraction outputs
- record parse warnings and trace metadata

Output shape:

```text
ParsedSourceArtifact
  source_type
  source_ref
  raw_text
  structured_rows
  structured_json
  metadata
  warnings
```

### 3. Interpretation Layer

Responsibilities:

- extract entities, risks, events, metrics, trends, relationships
- classify webpage signals into Nexora-relevant categories
- produce machine-readable evidence bundles

Rules:

- no scene generation
- no object creation
- no recommendation generation
- use deterministic rulepacks first
- if AI enrichment is used, route through existing AI core policy and logging

### 4. Mapping Layer

Responsibilities:

- resolve extracted entities to existing object ids
- normalize signal types to Nexora vocabulary
- build `related_objects`
- build `suggested_objects`
- assign final confidence

Rules:

- suggest only when no strong object match exists
- never create or mutate workspace objects in MVP

## Data Flow Diagram

```text
User clicks "Add Source"
  -> frontend AddSourceEntryPoint
  -> frontend ingestionClient
  -> backend ingestion_router
  -> ingestion orchestrator
  -> source-specific connector
  -> source-specific parser
  -> interpretation layer
  -> mapping layer
  -> IngestedSystemSignal
  -> pipeline handoff
      -> Fragility Scanner input adapter
      -> System Modeling input adapter
      -> Scenario Simulation scenario/shock adapter
      -> Decision Engine context adapter
      -> Memory / Timeline event adapter
  -> existing backend response packaging
  -> chat + timeline + scene reaction + existing panels
```

## Integration Point With Nexora Engines

The ingestion layer should integrate at one new backend boundary only:

`backend/app/services/ingestion/pipeline/handoff.py`

Responsibilities:

- accept `IngestedSystemSignal`
- adapt it into the existing engine contracts
- invoke downstream services in order
- publish outputs through existing response packaging and event/timeline systems

Downstream mappings:

### Fragility Scanner

- convert `signals`, `detected_risks`, and `extracted_metrics` into a scan text or structured scanner summary
- reuse scanner-style source metadata already present in `FragilityScanRequest`

### System Modeling Engine

- convert extracted entities and relationships into `SystemObject`, `SystemRelationship`, and `SystemSignal` candidates
- call existing `UniversalSystemModelBuilder` only as the intelligence path, not a parallel modeler

### Scenario Simulation Engine

- map ingestion signals into scenario shocks
- examples:
  - `supply_risk` -> reliability down, delay up
  - `demand_shock` -> demand up/down
  - `regulatory_pressure` -> compliance cost up, operational pressure up
  - `financial_stress` -> liquidity down, cost of capital up

### Decision Engine

- consume the already-built system model plus simulation outputs
- no direct recommendation generation inside ingestion

### Timeline / Memory

- append ingestion trace and resulting normalized signal as timeline-worthy events
- use existing event/replay/memory services
- store source provenance and confidence for later replay/debug

## Webpage Intelligence Mode

For `url` inputs:

1. fetch page in safe mode
2. extract main article content only
3. detect:
   - economic signals
   - political signals
   - market signals
   - regulatory signals
4. normalize to Nexora signal taxonomy:
   - `supply_risk`
   - `demand_shock`
   - `regulatory_pressure`
   - `financial_stress`
5. map affected entities to existing system objects
6. forward only normalized signal package to AI Core Pipeline

## Determinism And Traceability

Each ingestion run should persist:

- `ingestion_id`
- `source_ref`
- connector metadata
- parser metadata
- interpretation evidence
- mapping decisions
- confidence breakdown
- downstream handoff status
- timestamps and warnings

Minimal trace model:

```text
IngestionTrace
  ingestion_id
  source_ref
  stage
  status
  details
  timestamp
```

This should live beside existing event and replay persistence, not as a separate intelligence system.

## UX Placement

No new panel.

Single entry point:

- `Add Source`
  - Upload PDF
  - Upload CSV
  - Add URL
  - Connect API

Presentation rules:

- ingestion acknowledgement appears in chat
- accepted signal appears in timeline/memory as a source event
- scene reaction comes only after downstream engine processing
- existing panels render downstream engine output only

## Example: URL News Ingestion

Input:

```text
URL: https://news.example.com/markets/shipping-rates-surge-after-port-strike
```

Parsed article summary:

- headline mentions port strike and shipping delays
- article states freight rates rose 18%
- delivery lead times increased
- affected region includes major import routes

Output:

```json
{
  "source_type": "url",
  "source_ref": "url:https://news.example.com/markets/shipping-rates-surge-after-port-strike:2026-03-29T15:22:11Z",
  "extracted_entities": [
    {
      "name": "Port operators",
      "kind": "infrastructure_actor",
      "evidence": ["Port strike disrupted cargo handling capacity."]
    },
    {
      "name": "Import supply chain",
      "kind": "supply_chain",
      "evidence": ["Major import routes are experiencing delays."]
    }
  ],
  "extracted_events": [
    {
      "name": "Port strike disruption",
      "category": "operational_disruption",
      "timestamp": "2026-03-29T00:00:00Z",
      "severity": "high",
      "evidence": ["The strike halted normal cargo movement across key terminals."]
    }
  ],
  "extracted_metrics": [
    {
      "name": "freight_rate_change",
      "value": 18,
      "unit": "percent",
      "direction": "up",
      "period": "week_over_week"
    },
    {
      "name": "lead_time",
      "value": "rising",
      "unit": null,
      "direction": "up",
      "period": null
    }
  ],
  "detected_risks": [
    {
      "type": "supply_risk",
      "severity": "high",
      "affected_entities": ["Import supply chain"],
      "evidence": ["Shipping delays and freight cost increases raise fulfillment risk."]
    }
  ],
  "signals": [
    {
      "type": "supply_risk",
      "label": "Import flow disruption",
      "direction": "up",
      "magnitude": 0.82,
      "related_metric": "freight_rate_change",
      "evidence": ["Freight rates surged and delays expanded after the strike."]
    },
    {
      "type": "financial_stress",
      "label": "Logistics cost pressure",
      "direction": "up",
      "magnitude": 0.68,
      "related_metric": "freight_rate_change",
      "evidence": ["Higher freight rates increase operating cost pressure."]
    }
  ],
  "related_objects": [
    {
      "object_id": "obj_logistics",
      "match_type": "alias",
      "confidence": 0.91
    },
    {
      "object_id": "obj_inventory",
      "match_type": "contextual",
      "confidence": 0.74
    }
  ],
  "suggested_objects": [
    {
      "name": "Port operators",
      "kind": "infrastructure_actor",
      "reason": "Entity is material to the signal but has no strong existing object match."
    }
  ],
  "confidence": 0.84,
  "timestamp": "2026-03-29T15:22:11Z"
}
```

## MVP Constraints

- batch ingestion only
- no real-time streaming
- no auto object creation
- deterministic parser and mapping behavior
- explicit trace logging for every stage
- no direct mutation of scene or panels

## Implementation Boundary Summary

What ingestion may do:

- accept source input
- normalize and interpret content
- map content into `IngestedSystemSignal`
- hand off to existing Nexora engines
- persist trace and provenance

What ingestion must not do:

- update `scene_json` directly
- update panels directly
- create recommendations directly
- create objects automatically
- bypass existing fragility/modeling/simulation/decision/memory systems
