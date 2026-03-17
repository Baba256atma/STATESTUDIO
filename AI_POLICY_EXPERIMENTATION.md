# AI Policy Experimentation

## Purpose

Policy experimentation lets Nexora compare control and variant AI policies without changing stable baseline behavior for all traffic.

This exists to:

- evaluate policy changes with deterministic traffic assignment
- compare measurable outcomes across variants
- stop unsafe experiments safely
- produce auditable recommendations for promotion

## Control And Variants

- control is the current stable policy version
- variants are named candidate policy versions, typically sourced from promoted non-production environments
- control remains the protected baseline when an experiment is paused, stopped, or in draft state

## Deterministic Assignment

- assignment uses a deterministic hash bucket from `trace_id`, `request_id`, or scoped request identity
- traffic split is explicit and must sum to `100`
- assignment scope can be:
  - `global`
  - `tenant`
  - `workspace`
- assignment remains separate from provider and model execution

## Experiment Lifecycle

- `draft`
- `active`
- `paused`
- `completed`
- `stopped`

Lifecycle actions are explicit and auditable.

## Winner Decision Logic

The MVP compares control and variants using:

- response validity rate
- fallback rate
- routing error rate
- audit completeness rate
- average latency

A winning variant is selected only when:

- enough control and variant traffic exists
- safety thresholds remain intact
- the variant improves or at least preserves key quality metrics

Unsafe variants cause a stop recommendation instead of promotion.

## Diagnostics Endpoints

- `POST /ai/local/control-plane/policy/experiments/create`
- `POST /ai/local/control-plane/policy/experiments/start`
- `POST /ai/local/control-plane/policy/experiments/pause`
- `POST /ai/local/control-plane/policy/experiments/stop`
- `POST /ai/local/control-plane/policy/experiments/complete`
- `GET /ai/local/control-plane/policy/experiments`
- `GET /ai/local/control-plane/policy/experiments/{experiment_id}`
- `GET /ai/local/control-plane/policy/experiments/{experiment_id}/results`

## Future Extension Points

- multi-variant experiments
- stronger statistical testing
- experiment guardrails
- automated promotion of winners
