# LLM-MVP:5 tests executed

## Governance (deterministic, no provider)

```
npx tsx --test app/lib/conversational-control/nexoraLlmGovernedOutput.test.ts
```

**24 passed / 0 failed**

A–S, K2, length bound, ungrounded overlay fallback.

## Accepted / authority / cost (CC)

```
npx tsx --test app/lib/conversational-control/nexoraLlmGovernedOutputCc.test.ts
```

**7 passed / 0 failed**

E (M includes supported L), T–Y mutation, Z recoverable D, AA one call accepted, AB one call rejected, A/C/D fallbacks, AC policy skip 0 calls.

## Live provider + local governance

```
cd backend && PYTHONPATH=. python3 -m pytest tests/test_nexora_llm_governed_live.py -q
npx tsx --test app/lib/conversational-control/nexoraLlmGovernedOutputLive.test.ts
```

**1 python passed · 1 TypeScript passed · 0 skipped**

Evidence: `live-provider.json`, `live-governance.json` (no API key).

## Phase 1–4 regression (focused)

```
npx tsx --test \
  app/lib/conversational-control/nexoraLlmConversationParticipant.test.ts \
  app/lib/conversational-control/nexoraLlmManagementContext.test.ts \
  app/lib/conversational-control/nexoraLlmRuntime.test.ts \
  app/lib/conversational-control/nexoraLlmRuntimeCc.test.ts \
  app/lib/conversational-control/nexoraLlmUsageGuard.test.ts \
  app/lib/conversational-control/nexoraLlmGovernedOutput.test.ts \
  app/lib/conversational-control/nexoraLlmGovernedOutputCc.test.ts
```

**75 passed / 0 failed**

```
cd backend && PYTHONPATH=. python3 -m pytest \
  tests/test_nexora_llm_usage.py \
  tests/test_nexora_llm_runtime.py \
  tests/test_nexora_llm_governed_live.py -q
```

**28 passed / 0 failed / 0 skipped**
