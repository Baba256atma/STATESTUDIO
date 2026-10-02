# LLM-MVP:AUDIT evidence index

Traced, not inferred from filenames alone.

## Certified manager path
- `frontend/app/executive/nex-mvp/NexoraExecutiveShell.tsx` — `executeNexoraConversationalExperience` (~1904); CSV semantic early-return; `nmiAdvisorBundle`; Data Reality catalog
- `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts` — CC:5 entry; `advisorGrounding`; `nmiAdvisorBundle`; no LLM import
- `frontend/app/lib/manager-object/nexoraNca1ConversationTypes.ts` — `usesLiveLlm: false`
- NCA modules throw if `usesLiveLlm` is true (`nexoraNca1ConversationArchitecture.ts`, nca2–5)

## Frontend LLM platform (no provider)
- `frontend/app/lib/llm/llmRuntimeContracts.ts` — `[NO_HTTP][NO_SDK][NO_PROVIDER_CALLS]`
- `frontend/app/lib/llm/llmRuntimeMock.ts` — dry-run synthetic output
- `frontend/app/lib/llm/llmPlatformContracts.ts` — MUST_OWN communication; MUST_NOT_OWN `provider_api_calls`
- `frontend/app/lib/llm/llmContextSources.ts` — abstract references; no data access
- Grep: no `from '@/app/lib/llm'` in CC / Shell

## HomeScreen / scene LLM
- `frontend/app/lib/api/chatApi.ts` → `POST /chat`
- `backend/app/services/chat_runtime.py` — rules then `llm_chat_actions`
- `backend/app/services/chat_ai.py` — OpenAI JSON scene actions
- `frontend/app/lib/execution/actionExecutionLayer.ts` — `executeNexoraAction`

## Type-C overlay
- `frontend/app/lib/typec/typeCAIAdapter.ts`
- `backend/app/services/typec_ai_service.py`
- `frontend/app/screens/hooks/typec/useTypeCOrchestration.ts` (HomeScreen, not Executive Shell)

## Local AI (parallel)
- `backend/app/routers/ai_local.py` — `/ai/local/*`
- `backend/app/services/ai/providers/ollama_provider.py` — live
- `openai_provider.py` / `anthropic_provider.py` — stub `provider_not_configured`
