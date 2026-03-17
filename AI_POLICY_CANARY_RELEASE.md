# AI Policy Canary Release

## Purpose

Canary releases let Nexora expose a new AI policy to a small subset of traffic before full activation.

This exists to:

- keep stable policy as the default baseline
- detect risky routing or response regressions early
- support pause, rollback, and promotion decisions
- make gradual policy rollout auditable

## Stable vs Canary

- stable policy is the current production baseline
- canary policy is a candidate policy, usually sourced from staging
- stable handles all requests unless the canary assignment rules explicitly route a request to canary

## Deterministic Assignment

- canary assignment uses a deterministic hash bucket
- the bucket is derived from `trace_id`, `request_id`, or scoped request identity
- assignment can be:
  - global
  - tenant-scoped
  - workspace-scoped
- stable remains the fallback when canary is disabled, paused, rolled back, or not eligible

## Canary Health Checks

The MVP evaluates:

- routing failure rate
- fallback rate
- structured response validity rate
- audit completeness rate
- average latency delta

Health decisions are deterministic:

- continue when healthy
- pause when latency degrades materially
- roll back when safety or quality thresholds are exceeded
- promote when the canary remains healthy with enough samples

## Pause, Rollback, and Promotion

- pause keeps state but stops canary traffic
- rollback disables canary and returns traffic to stable-only behavior
- promote copies the canary snapshot into production stable policy

## Diagnostics Endpoints

- `POST /ai/local/control-plane/policy/canary/start`
- `POST /ai/local/control-plane/policy/canary/pause`
- `POST /ai/local/control-plane/policy/canary/resume`
- `POST /ai/local/control-plane/policy/canary/rollback`
- `POST /ai/local/control-plane/policy/canary/promote`
- `GET /ai/local/control-plane/policy/canary/state`
- `GET /ai/local/control-plane/policy/canary/health`

## Future Extensions

- progressive traffic ramps
- tenant-targeted canaries
- multi-policy canaries
- automated promotion gates
