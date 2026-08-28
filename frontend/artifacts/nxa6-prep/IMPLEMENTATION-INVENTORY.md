# Implementation inventory

Created:

- `frontend/app/lib/nexora-certification/*` diagnosis, ledger, path trace, harness, fixtures, funnel catalog, tests
- `frontend/scripts/nxa-test-funnel.mjs` + `nxa-test-funnel-run.ts`
- `frontend/scripts/nxa-conversation-harness.mjs` + `nxa-conversation-harness-run.ts`
- `frontend/scripts/nxa-6-prep-live-smoke.mjs`
- `AGENTS.md`
- `.cursor/rules/nexora-debugging-certification.mdc`
- `frontend/artifacts/nxa6-prep/**`

Modified:

- `frontend/app/lib/runtime/diagnosticSwitch.ts` (default-off `nxaConversation` scope)
- `frontend/app/lib/runtime/diagnosticSwitch.test.ts`
- `frontend/package.json` (`nxa:funnel`, `nxa:harness`)

No NCA/NXA/Stage production behavior files were changed for PREP besides the existing diagnostic switch default-off list.
