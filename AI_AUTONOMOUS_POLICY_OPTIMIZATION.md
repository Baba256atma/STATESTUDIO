# AI Autonomous Policy Optimization

## Purpose

Autonomous policy optimization lets Nexora recommend safe policy improvements from observed runtime behavior without bypassing governance.

This exists to:

- turn recurring operational signals into reviewable policy proposals
- promote validated winners from canaries and experiments
- tighten risky routing behavior when the system degrades
- keep activation behind validation, approval, and audit controls

## Optimization Signals

The MVP collects compact signals from:

- telemetry
- audit-backed canary health state
- completed experiment decisions
- benchmark configuration state

Example signals include:

- high fallback rate
- high routing failure rate
- canary promotion readiness
- experiment winner readiness
- missing benchmark tuning weights

## Proposal Generation Model

- proposals are deterministic and rule-based
- proposals are small typed policy patches
- proposals do not directly mutate active policy
- proposals are stored for review and optional application

## Risk Levels

- `low`
- `medium`
- `high`
- `forbidden`

Forbidden proposals are blocked from approval and application.

## Approval And Auto-Apply Rules

- all proposals receive an explicit risk assessment
- proposals still flow through policy diff, validation, approval, and activation
- auto-apply is disabled by default
- auto-apply is only allowed when:
  - policy `evaluation.optimization_auto_apply_enabled` is `true`
  - proposal risk is `low`
  - validation succeeds
  - existing approval rules do not require a manual approver

## Proposal Lifecycle

- `proposed`
- `approved`
- `rejected`
- `applied`
- `expired`

## Diagnostics Endpoints

- `POST /ai/local/control-plane/policy/optimize/run`
- `GET /ai/local/control-plane/policy/optimize/proposals`
- `GET /ai/local/control-plane/policy/optimize/proposals/{proposal_id}`
- `POST /ai/local/control-plane/policy/optimize/proposals/{proposal_id}/approve`
- `POST /ai/local/control-plane/policy/optimize/proposals/{proposal_id}/reject`
- `POST /ai/local/control-plane/policy/optimize/proposals/{proposal_id}/apply`

## Future Extension Points

- stronger scoring models
- environment-specific optimization
- scheduled optimization runs
- human-in-the-loop review dashboards
