# AI Policy Promotion Pipeline

## Purpose

This pipeline moves AI policy snapshots through controlled environments before production activation.

It exists to make policy rollout:

- validated
- evaluated
- approved
- auditable
- reversible

## Environment Hierarchy

- `local`
- `dev`
- `staging`
- `production`

Promotion is forward-only:

- `local -> dev`
- `dev -> staging`
- `staging -> production`

Skipping environments is blocked.

## Promotion Gates

- validation gate
- evaluation harness gate
- regression suite gate
- policy approval gate
- observability sanity gate

Each gate returns:

- gate name
- pass or fail state
- reason
- compact metrics summary

Promotion stops on the first failing gate set.

## Approval Rules

- `local -> dev`: approval metadata is optional
- `dev -> staging`: explicit approval metadata is required
- `staging -> production`: explicit approval metadata is required

Approval decisions are recorded in promotion history and audit events.

## Rollback Behavior

- each environment keeps a last-known-good snapshot
- rollback restores the previous snapshot for that environment
- rollback does not delete promotion history
- production rollback updates the runtime base policy snapshot

## Diagnostics Endpoints

- `POST /ai/local/control-plane/policy/promote`
- `GET /ai/local/control-plane/policy/environments`
- `GET /ai/local/control-plane/policy/environment/{env}`
- `GET /ai/local/control-plane/policy/promotion-history`
- `POST /ai/local/control-plane/policy/environment/{env}/rollback`

## CI Integration

The MVP includes a manual GitHub Actions workflow for policy promotion.

Expected flow:

1. validate policy
2. run syntax checks
3. promote `local -> dev`, `dev -> staging`, or `staging -> production`
4. require explicit approver metadata for staging and production

## Future Extensions

- policy canary releases
- progressive promotion
- multi-region policy rollout
- signed promotions
- database-backed promotion history
