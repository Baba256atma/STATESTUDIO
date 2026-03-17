# AI Privacy Classification

## Purpose

Privacy classification exists so Nexora can evaluate request sensitivity before any provider routing decision is made.

The goal is to keep provider routing privacy-aware, deterministic, and explainable without embedding data-classification rules inside routing or provider implementations.

## Responsibility Split

These stages remain separate:

- privacy classification determines sensitivity and privacy handling
- routing policy decides whether execution should stay local or may use cloud
- provider selection resolves the concrete provider implementation
- model selection chooses the preferred model within the selected provider context

This ordering keeps privacy decisions explicit and auditable.

## Sensitivity Levels

Current sensitivity levels:

- `public`
- `internal`
- `confidential`
- `restricted`

Higher sensitivity leads to more conservative routing.

## Privacy Modes

Current privacy modes:

- `default`
- `local_preferred`
- `local_only`
- `cloud_allowed`

`local_only` overrides any cloud-allowed setting.

## Cloud-Allowed vs Local-Required

- `cloud_allowed=true` means cloud routing is permitted if routing policy and provider state also allow it
- `local_required=true` means execution must remain local

Sensitivity and explicit metadata can force `local_required`.

## Safe Defaults

Current defaults are conservative:

- missing metadata does not imply cloud permission
- uploaded content is treated conservatively
- confidential and restricted data do not route to cloud by default
- existing `/ai/local/*` endpoints remain local-first

## Diagnostic Endpoints

Developer-facing diagnostics:

- `GET /ai/local/privacy/policy`
- `POST /ai/local/privacy/classify`
- `GET /ai/local/routing/policy`
- `POST /ai/local/routing/decide`

These endpoints expose:

- `sensitivity_level`
- `privacy_mode`
- `cloud_allowed`
- `local_required`
- `classification_reason`
- `policy_tags`

## Future Extension Points

Planned extensions include:

- tenant-specific privacy policy
- stronger deterministic redaction
- compliance policy packs
- audit trail integration

The current layer is intentionally small and rule-based so these features can be added without replacing the orchestration flow.
