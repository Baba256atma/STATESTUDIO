# Local AI Layer

## Purpose

The Local AI Layer provides a controlled backend interface for local model inference inside Nexora. Its job is to turn API requests into structured semantic outputs that can be used by the rest of the platform without allowing the model to directly control scene behavior or frontend actions.

The layer is intentionally narrow. It focuses on:

- local model access
- structured semantic analysis
- typed validation
- controlled error handling
- observability for debugging and operations

## Why Ollama Is Behind FastAPI

Ollama is not exposed directly to clients because Nexora needs a stable application boundary between model inference and product behavior.

FastAPI sits in front of Ollama so Nexora can:

- enforce request validation
- normalize provider responses
- keep model output structured and typed
- apply safety, rate limiting, and request auditing
- swap or extend providers later without changing the frontend contract

This keeps the model as an internal provider, not a public system boundary.

## Request Flow

```text
Client
  ↓
/ai/local/analyze
  ↓
Router
  ↓
LocalAIOrchestrator
  ↓
Prompt Builder + Model Router
  ↓
Ollama Client
  ↓
Validator + Response Mapper
  ↓
Typed AIResponse
```

High-level flow:

1. The API receives a typed request.
2. The orchestrator resolves the task type and model.
3. A JSON-only prompt is built for the model.
4. The Ollama client sends the request and measures latency.
5. The response is validated into structured semantic data.
6. Nexora returns a normalized `AIResponse`.

Important rule:

- The model returns semantic data only.
- The deterministic Nexora engine remains responsible for scene and object actions.

## Main Files and Responsibilities

- `app/routers/ai_local.py`
  API surface for health, model listing, and analysis endpoints.

- `app/services/ai/orchestrator.py`
  Main coordination layer for task routing, prompt generation, provider calls, validation, and response mapping.

- `app/services/ai/ollama_client.py`
  Async provider client for Ollama with timeout handling, structured logging, and normalized responses.

- `app/services/ai/prompt_builder.py`
  Builds task-specific prompts that explicitly require JSON-only output.

- `app/services/ai/model_router.py`
  Resolves which model should be used for a task.

- `app/services/ai/validators.py`
  Validates model output into typed semantic structures.

- `app/services/ai/response_mapper.py`
  Normalizes validated output into the final API response shape.

- `app/services/ai/exceptions.py`
  Shared internal exceptions for controlled Local AI service failures.

- `app/schemas/ai.py`
  Typed request and response schemas for the Local AI Layer.

## Example Request

```json
{
  "text": "A supplier delay is increasing delivery pressure and customer risk.",
  "context": {
    "domain": "business",
    "task": "scenario_analysis"
  },
  "metadata": {
    "task": "analyze_scenario"
  }
}
```

## Example Response

```json
{
  "ok": true,
  "provider": "ollama",
  "model": "llama3.2:3b",
  "output": "{\"summary\":\"Delivery pressure is rising.\",\"risk_signals\":[{\"key\":\"delivery_risk\",\"label\":\"Delivery Risk\",\"score\":0.78,\"confidence\":0.82,\"weight\":0.9}],\"object_candidates\":[{\"object_id\":\"supplier\",\"label\":\"Supplier\",\"object_type\":\"business_entity\",\"score\":0.84,\"confidence\":0.8,\"weight\":0.9}],\"metadata\":{\"decision_note\":\"Upstream delay is affecting downstream reliability.\"}}",
  "summary": "Delivery pressure is rising.",
  "risk_signals": [
    {
      "key": "delivery_risk",
      "label": "Delivery Risk",
      "score": 0.78,
      "confidence": 0.82,
      "weight": 0.9,
      "metadata": {}
    }
  ],
  "object_candidates": [
    {
      "object_id": "supplier",
      "label": "Supplier",
      "object_type": "business_entity",
      "score": 0.84,
      "confidence": 0.8,
      "weight": 0.9,
      "metadata": {}
    }
  ],
  "trace_id": "trace-123",
  "raw_model": "llama3.2:3b",
  "latency_ms": 142.5,
  "metadata": {
    "task": "analyze_scenario",
    "route_reason": "reasoning_task_default",
    "provider_error": null,
    "validation_error": null,
    "provider_latency_ms": 139.4,
    "raw_output_present": true,
    "has_structured_data": true,
    "decision_note": "Upstream delay is affecting downstream reliability."
  }
}
```

## Failure Modes

Common failure modes include:

- provider unavailable
- provider timeout
- provider HTTP error
- invalid provider JSON
- empty model output
- valid HTTP response but invalid structured payload

The Local AI Layer handles these by:

- returning controlled error states instead of raw upstream exceptions
- preserving trace IDs where possible
- recording latency and provider error metadata
- keeping the API response shape stable

## Future Extension Points

- Cloud provider
  Add a provider client for OpenAI, Anthropic, or another hosted model while keeping the same orchestrator and schema boundary.

- RAG
  Insert retrieval or context assembly before prompt building, without changing the public API contract.

- Caching
  Cache normalized analysis responses or model lists behind the orchestrator or provider layer.

- Metrics
  Add request counters, provider latency histograms, validation failure rates, and success/error ratios to the observability path.
