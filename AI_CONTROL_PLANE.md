# AI Control Plane

## Purpose

The AI control plane centralizes AI policy defaults and policy versioning for Nexora.

It provides a single typed source of truth for routing, privacy, provider enablement, model defaults, benchmark tuning, audit controls, telemetry controls, and evaluation mode defaults.

## Responsibilities

- control plane: loads and exposes the effective policy snapshot
- policy engine: answers deterministic policy questions from that snapshot
- routing policy: enforces provider-routing decisions using control-plane values
- provider selection: resolves concrete providers after policy allows them
- model selection: chooses models using control-plane defaults and benchmark settings

## Policy Snapshot Loading

- built-in defaults are derived from current backend settings
- an optional file-backed snapshot may override those defaults
- the MVP loader supports local JSON files and optional YAML files when YAML support is installed
- malformed files do not become active policy

## Policy Versioning

Every effective snapshot includes:

- `policy_version`
- `loaded_at`
- `updated_at`
- `source`

Audit and telemetry metadata can attach `policy_version` so decisions remain traceable to the active policy snapshot.

## Defaults vs File-Backed Policy

- default policy keeps current Nexora behavior and preserves local-first safe defaults
- file-backed policy allows controlled overrides without changing application code
- the loader merges file-backed overrides onto the default snapshot, then validates the result into typed schemas

## Diagnostics Endpoints

- `GET /ai/local/control-plane/state`
- `GET /ai/local/control-plane/policies`
- `GET /ai/local/control-plane/version`
- `POST /ai/local/control-plane/reload`

These endpoints are internal and developer-facing. They expose effective values only and do not expose provider secrets.

## Reload Behavior

- reload is manual for the MVP
- reload reads the policy file again and validates it
- if validation fails, Nexora keeps the last known-good snapshot
- reload responses report whether the refresh succeeded

## Future Extension Points

- tenant and workspace policy overlays
- policy bundles and environment-specific policy packs
- database-backed control plane storage
- admin UI for policy inspection and reload
- policy approval workflows
