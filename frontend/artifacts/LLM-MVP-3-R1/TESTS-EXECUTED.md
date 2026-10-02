# LLM-MVP:3-R1 tests executed

## LIVE PROVIDER PROOF

```
cd backend && PYTHONPATH=. python3 -m pytest tests/test_nexora_llm_live.py tests/test_nexora_llm_runtime.py -q
```

**13 passed / 0 failed / 0 skipped** (1 live + 12 runtime-contract).

Live test: **executed, not skipped**.

Sanitized evidence: `live-evidence.json` (no API key, no prompt, no contribution text).

## Mock / runtime-contract + CC integration (TypeScript)

```
./node_modules/.bin/tsx --test \
  app/lib/conversational-control/nexoraLlmRuntime.test.ts \
  app/lib/conversational-control/nexoraLlmRuntimeCc.test.ts \
  app/lib/conversational-control/nexoraLlmConversationParticipant.test.ts \
  app/lib/conversational-control/nexoraLlmManagementContext.test.ts
```

**40 pass / 0 fail** (includes new K2: L matching D text).
