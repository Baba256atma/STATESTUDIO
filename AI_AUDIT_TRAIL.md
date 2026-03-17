# AI Audit Trail

## Purpose

The audit trail exists so Nexora can explain important AI policy decisions after a request completes.

It records why a request was classified, how it was routed, which provider and model were selected, and whether fallback or benchmark-aware selection affected execution.

## Recorded Decisions

Current audit coverage includes:

- request receipt
- privacy classification
- routing decision
- provider selection
- model selection
- provider execution start
- provider execution completion or failure
- fallback application
- response return

## Stage Sequence

The normal decision flow is:

1. `request_received`
2. `privacy_classified`
3. `routing_decided`
4. `provider_selected`
5. `model_selected`
6. `provider_execution_started`
7. `provider_execution_completed` or `provider_execution_failed`
8. `fallback_applied` when relevant
9. `response_returned`

## What Is Logged

The audit trail stores compact structured fields such as:

- `trace_id`
- `stage`
- `task_type`
- `privacy_mode`
- `sensitivity_level`
- `selected_provider`
- `selected_model`
- `fallback_used`
- `benchmark_used`
- `decision_reason`
- `policy_tags`
- `success`
- `error_code`

## What Is Not Logged

The MVP intentionally avoids logging:

- raw prompt text
- full message histories
- raw model output
- secrets and credentials

Sensitive metadata is minimized or redacted before storage.

## Redaction Behavior

Audit logging is privacy-aware by default:

- prompt bodies are omitted
- secret-like fields are replaced with placeholders
- confidential and restricted metadata values are minimized
- provider metadata is excluded unless explicitly enabled

## Storage Model

The MVP supports:

- in-memory recent event storage
- optional JSONL file output

There is no database persistence in this version.

## Diagnostic Endpoints

Developer-facing audit endpoints:

- `GET /ai/local/audit/events`
- `GET /ai/local/audit/recent`
- `GET /ai/local/audit/policy-decisions`
- `GET /ai/local/audit/policy`

## Future Extension Points

Planned extensions include:

- database persistence
- external observability integration
- compliance reporting
- tenant-specific audit policies
