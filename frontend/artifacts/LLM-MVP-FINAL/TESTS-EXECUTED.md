# LLM-MVP:FINAL tests executed

## Live HTTP (mandatory real provider)

```
cd backend && PYTHONPATH=. python3 -m pytest tests/test_nexora_llm_final_live.py -q
```

**1 passed / 0 failed / 0 skipped**

Evidence: `live-http.json` (no API key). Then TS governance of that L: `live-governance.json`.

## FINAL journeys + product seam (TypeScript)

```
npx tsx --test app/lib/conversational-control/nexoraLlmFinal.test.ts
```

**12 passed / 0 failed**

A useful M, B disabled, C exhausted, D invalid L, unsupported number, provider HTTP failure, no double-fetch, E continuity, F canonical action, bounds, Shell source, live govern.

## Shell composition

```
npx tsx --test app/executive/nex-mvp/NexoraExecutiveShell.test.tsx
```

**22 passed / 0 failed** (includes 22: server completion, not OpenAI)

## Phase 1–5 + FINAL focused regression

```
npx tsx --test \
  app/lib/conversational-control/nexoraLlmConversationParticipant.test.ts \
  app/lib/conversational-control/nexoraLlmManagementContext.test.ts \
  app/lib/conversational-control/nexoraLlmRuntime.test.ts \
  app/lib/conversational-control/nexoraLlmRuntimeCc.test.ts \
  app/lib/conversational-control/nexoraLlmUsageGuard.test.ts \
  app/lib/conversational-control/nexoraLlmGovernedOutput.test.ts \
  app/lib/conversational-control/nexoraLlmGovernedOutputCc.test.ts \
  app/lib/conversational-control/nexoraLlmFinal.test.ts \
  app/executive/nex-mvp/NexoraExecutiveShell.test.tsx
```

**109 passed / 0 failed**

```
cd backend && PYTHONPATH=. python3 -m pytest \
  tests/test_nexora_llm_usage.py \
  tests/test_nexora_llm_runtime.py \
  tests/test_nexora_llm_governed_live.py \
  tests/test_nexora_llm_final_live.py -q
```

**29 passed / 0 failed / 0 skipped**
