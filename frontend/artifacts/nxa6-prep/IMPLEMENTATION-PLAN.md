# NXA:6-PREP — Implementation plan

Inspection complete. No repository `AGENTS.md` existed. Conversation already has CC:5 `trace`, DIR:1 `directorPlan`, Playwright `nex-mvp-final3-executive-chat-harness.mjs`, and `nexora-zero-failure-gate.mjs`. Chat QA harness and scene diagnostics are other products and will not be forked.

## Reuse

- Execute `executeNexoraConversationalExperience` (no second runtime).
- Project a narrow path view from existing result fields + `nextRuntimeState` + `directorPlan`.
- Opt-in console via existing `diagnosticSwitch` with default-off scope `nxaConversation`.
- Live proof reuses the FINAL:3 Playwright helpers.
- Funnel wraps existing `tsx --test`, `tsc`, `next build`, ESLint, and `git diff --check`.

## Expected new surface

`frontend/app/lib/nexora-certification/` (certification infrastructure, not a truth authority), funnel/harness/live scripts, `AGENTS.md`, `.cursor/rules`, and `frontend/artifacts/nxa6-prep/`.

Production conversation/Stage/collection/decision/execution behavior is not to change.

NXA:6 is not in scope.
