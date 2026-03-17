# AI Provider Abstraction

## Purpose

Nexora needs provider abstraction so orchestration logic is not tied to a single execution backend such as Ollama. The goal is to keep the current local-first behavior intact while allowing future local and cloud providers to be added behind the same interface.

## Provider Selection vs Model Selection

These concerns remain separate:

- provider selection decides where a request executes
- model selection decides which model is preferred for the task

The orchestrator resolves a provider first, then asks the model selection engine which model to use for that provider's available models.

## Current Providers

Supported provider implementations:

- `ollama`
- `openai` placeholder
- `anthropic` placeholder

The cloud providers are intentionally lightweight stubs. They exist to stabilize interfaces and routing, not to provide production cloud execution yet.

## Local-First Strategy

Current routing is deterministic and local-first:

1. Use the local provider by default.
2. Allow an explicit provider override when requested.
3. Fall back to the configured fallback provider only when needed.

This preserves current Local AI behavior and keeps cloud execution opt-in.

## Provider Interface

Providers implement a shared contract:

- `health_check()`
- `list_models()`
- `chat_json(...)`

All provider calls use normalized request and response types so orchestration code does not depend on provider-specific payload shapes.

## Fallback Concepts

Provider fallback is separate from model fallback.

- provider fallback handles unavailable or disabled execution backends
- model fallback handles unavailable preferred models within the chosen provider

Keeping these separate makes routing easier to reason about and debug.

## Diagnostic Endpoints

Current diagnostics include:

- `GET /ai/local/providers`
- `GET /ai/local/providers/health`
- `POST /ai/local/select-model`
- `GET /ai/local/selection-stats`

These endpoints expose provider availability, registered providers, selected model details, fallback usage, and benchmark influence.

## Future Extension Points

Planned extensions include:

- real cloud provider integrations
- hybrid local/cloud execution policies
- policy-based provider failover
- cost-aware provider routing

The current abstraction is intentionally small so these extensions can be added without rewriting orchestration logic.
