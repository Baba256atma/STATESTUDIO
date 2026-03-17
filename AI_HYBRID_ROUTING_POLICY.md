# AI Hybrid Routing Policy

## Purpose

Hybrid routing lets Nexora decide whether a request should run on a local provider or a cloud provider without embedding that logic directly in the orchestrator or routers.

The policy is deterministic and conservative. Local execution remains the default baseline.

## Routing Policy vs Provider Selection vs Model Selection

These concerns stay separate:

- routing policy decides whether the request should run locally or in the cloud
- provider selection resolves the concrete provider implementation for that routing decision
- model selection chooses the preferred model within the selected provider context

This separation keeps decisions explainable and prevents provider routing from being mixed into model scoring logic.

## Local-First Strategy

Default behavior is local-first:

1. Prefer a healthy local provider.
2. Keep privacy-sensitive requests local.
3. Allow cloud only when policy and configuration explicitly permit it.
4. Use cloud fallback only when enabled and local execution is not available.

Existing `/ai/local/*` endpoints remain conservative by default through a local-only routing guard.

## Privacy-Aware Routing

Privacy-sensitive tasks can force strict local execution when `AI_PRIVACY_STRICT_LOCAL=true`.

If no healthy local provider is available in strict privacy mode, routing fails safely instead of silently moving data to cloud.

## Fallback Behavior

Supported routing modes:

- local-only
- local-first
- local-first with cloud fallback
- cloud disabled

Fallback remains deterministic:

- if local is healthy, keep execution local
- if local is unavailable and cloud fallback is allowed, use cloud
- if neither policy nor provider state allows cloud, return a safe no-provider decision

## Diagnostic Endpoints

Developer-facing diagnostics:

- `GET /ai/local/routing/policy`
- `POST /ai/local/routing/decide`
- `GET /ai/local/providers`
- `GET /ai/local/providers/health`

Routing diagnostics expose compact fields such as:

- `selected_provider`
- `routing_reason`
- `fallback_allowed`
- `privacy_mode`

## Future Extension Points

Planned extensions include:

- benchmark-informed routing
- cost-aware routing
- adaptive failover
- tenant-specific policy

The current policy is intentionally small so these can be layered on without replacing the core orchestration flow.
