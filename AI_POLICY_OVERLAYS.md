# AI Policy Overlays

## Purpose

Tenant and workspace policy overlays let Nexora customize AI policy without duplicating the full control plane snapshot.

## Precedence

Effective policy is resolved in this order:

1. global policy
2. tenant overlay
3. workspace overlay

Workspace overlays are applied last, but only within safe guard rules.

## Effective Policy Resolution

- global policy is the base snapshot
- tenant overlay is applied next when present
- workspace overlay is applied last when present
- the resolver returns the effective policy, overlay versions, merge trace, conflicts, and source provenance

## Safe Restriction Rules

- broader-scope disabled capabilities cannot be silently re-enabled by narrower scopes
- overlays may become stricter than broader scopes
- overlays may narrow allowed task lists
- overlays may add stricter blocked sensitivity levels
- overlays may not remove broader restricted sensitivity protections by default

## Provenance and Traceability

Each resolution includes:

- base policy version
- tenant overlay version when present
- workspace overlay version when present
- effective policy version
- source paths
- merge trace entries
- blocked conflict records

## Diagnostics Endpoints

- `GET /ai/local/control-plane/effective-policy`
- `GET /ai/local/control-plane/effective-policy/{tenant_id}`
- `GET /ai/local/control-plane/effective-policy/{tenant_id}/{workspace_id}`
- `GET /ai/local/control-plane/overlay-trace/{tenant_id}/{workspace_id}`
- `POST /ai/local/control-plane/reload-overlays`

## Reload Behavior

- overlay reload is manual in the MVP
- missing overlay files are treated as no overlay
- malformed overlay files do not replace the last known-good overlay state

## Future Extension Points

- tenant admin controls
- workspace admin controls
- policy approval workflows
- database-backed overlay storage
- policy diff views
