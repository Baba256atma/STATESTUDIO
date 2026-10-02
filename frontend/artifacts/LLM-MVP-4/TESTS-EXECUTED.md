# LLM-MVP:4 tests executed

## Policy + meter + persistence + concurrency + HTTP guard

```
cd backend && PYTHONPATH=. python3 -m pytest \
  tests/test_nexora_llm_usage.py \
  tests/test_nexora_llm_runtime.py \
  tests/test_nexora_llm_usage_live.py -q
```

**28 passed / 0 failed / 0 skipped**

Includes A–M usage tests, HTTP policy enforcement, Phase-3 runtime contract, and live allowed+exhausted.

## CC integration (TypeScript)

```
./node_modules/.bin/tsx --test \
  app/lib/conversational-control/nexoraLlmUsageGuard.test.ts \
  app/lib/conversational-control/nexoraLlmRuntime.test.ts \
  app/lib/conversational-control/nexoraLlmRuntimeCc.test.ts \
  app/lib/conversational-control/nexoraLlmConversationParticipant.test.ts \
  app/lib/conversational-control/nexoraLlmManagementContext.test.ts
```

**45 pass / 0 fail** (Phase 1–3 plus N–S).

## LIVE allowed proof

Executed (not skipped). Evidence: `live-evidence.json` (no API key, no prompt).

provider openai · model gpt-4o-mini-2024-07-18 · 270/5/275 tokens · 1 provider call

## Exhausted / disabled proof

Live second turn: ALLOWANCE_EXHAUSTED, provider calls 0.  
CC P/O: disabled/exhausted skip, D returned.
