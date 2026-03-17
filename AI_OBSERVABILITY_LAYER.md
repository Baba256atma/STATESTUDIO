# AI Observability Layer

## Purpose

The AI observability layer gives Nexora structured visibility into the full AI request lifecycle in production.

It records telemetry for privacy classification, routing, provider and model selection, execution latency, fallback behavior, response validity, and trace completeness.

## Telemetry Stages

The current pipeline emits telemetry for:

1. `request_received`
2. `privacy_classified`
3. `routing_decided`
4. `provider_selected`
5. `model_selected`
6. `provider_execution_started`
7. `provider_execution_completed`
8. `provider_execution_failed`
9. `fallback_applied`
10. `response_returned`

## Metrics Collected

The MVP metrics snapshot includes:

- average latency per stage
- provider usage distribution
- model usage distribution
- fallback rate
- routing policy override rate
- response validity rate
- privacy cloud-block rate

## Telemetry vs Audit Logging

- telemetry is optimized for operational visibility and lightweight metrics
- audit logging is optimized for policy decision explainability and traceable decision records
- both use structured events and privacy-aware minimization, but they serve different diagnostic needs

## Diagnostic Endpoints

- `GET /ai/local/telemetry/metrics`
- `GET /ai/local/telemetry/traces`
- `GET /ai/local/telemetry/stages`
- `GET /ai/local/telemetry/events`

These endpoints are intended for internal or developer-facing diagnostics.

## Privacy-Safe Logging Rules

- prompt bodies are not logged
- message arrays are not logged
- secret-like fields are redacted
- confidential and restricted metadata is minimized
- provider metadata is excluded unless explicitly enabled

## Future Extension Points

- OpenTelemetry trace and span export
- Grafana or dashboard integration
- production metrics pipelines
- anomaly detection on latency, fallback, and invalid response rates
