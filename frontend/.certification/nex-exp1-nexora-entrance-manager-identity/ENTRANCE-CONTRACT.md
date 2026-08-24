# NEX-EXP:1 — Nexora Entrance & Manager Identity

Identity: `NEX-EXP:1/NexoraEntranceManagerIdentityExperience` `1.0.0`

Nexora begins as the Stage center until identity is sufficient. Then the manager/company context object becomes the executive center via existing Stage select/focus authority. Goal discovery is handed off, not implemented.

## Precedence

EXPLICIT CURRENT MANAGER STATEMENT > CONFIRMED EXISTING IDENTITY > AUTHORITATIVE WORKSPACE CONTEXT > INFERRED CONTEXT > UNKNOWN

## Persistence boundary

Session-scoped React state plus optional `sessionStorage` key `nexora.entrance.identity.session.v1`. Not a durable memory platform. `?entrance=1&reset=1` starts a new context.

## Workspace gate

- Default `/executive` = existing workspace / demo fixtures
- `/executive?entrance=1` = first-time entrance
