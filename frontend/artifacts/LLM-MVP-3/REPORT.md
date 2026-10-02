# NPA-T LLM-MVP:3 — Provider-Neutral Server Runtime

Status: **NOT CERTIFIED**

Live-provider proof is blocked: `OPENAI_API_KEY` is not configured in this environment (backend `.env` exists; key absent). Deterministic implementation tests passed. Do not start LLM-MVP:4.

---

## 1. Existing Provider Infrastructure Reused

Inspection (AUDIT evidence; no second repository-wide audit):

| Question | Answer |
|---|---|
| Appropriate server boundary | New FastAPI route `POST /nexora/llm/runtime` plus `app.services.nexora_llm`. Same backend process as `/chat` and `/typec/ai`, **not** those product contracts. |
| Reusable client | Existing OpenAI Python `responses.create` pattern (`chat_ai.py` / `typec_ai_service.py`) and env `OPENAI_API_KEY` / `OPENAI_MODEL` / `OPENAI_DEFAULT_MODEL`. Default timeout **8s** (same as chat/Type-C). |
| Scene-specific — do not reuse as manager contract | HomeScreen `POST /chat`, `chat_ai.py` JSON `{reply, actions[]}`, `ai_commander.py`, Type-C insight schema. |
| Stub-only | Local AI `openai_provider.py` / `anthropic_provider.py` (`metadata.stub`). |
| Credentials | Server env only. Not on CC request/result. Not in browser Shell. |
| Smallest architecture | Isolated Nexora runtime + **one** OpenAI text adapter. Did not extend `/chat`, Type-C, Local AI orchestrator, or `frontend/app/lib/llm` dry-run platform. |

Deliberately unused as Nexora manager LLM: HomeScreen scene-action planner, Type-C overlay, frontend LLM-1…12 `[NO_HTTP]` platform, Local AI router.

---

## 2. Files Changed

Production (CC-facing, provider-neutral):

- `frontend/app/lib/conversational-control/nexoraLlmRuntimeContract.ts`
- `frontend/app/lib/conversational-control/nexoraLlmRuntime.ts`
- `frontend/app/lib/conversational-control/nexoraLlmRuntimeParticipant.ts`
- `frontend/app/lib/conversational-control/index.ts`

Server/provider:

- `backend/app/services/nexora_llm/contracts.py`
- `backend/app/services/nexora_llm/runtime.py`
- `backend/app/services/nexora_llm/openai_text_adapter.py`
- `backend/app/services/nexora_llm/__init__.py`
- `backend/app/routes/nexora_llm.py`
- `backend/main.py` (router include only)

Tests:

- `frontend/app/lib/conversational-control/nexoraLlmRuntime.test.ts`
- `frontend/app/lib/conversational-control/nexoraLlmRuntimeCc.test.ts`
- `backend/tests/test_nexora_llm_runtime.py`
- `backend/tests/test_nexora_llm_live.py`

Configuration:

- None added. Reuses `OPENAI_API_KEY`, `OPENAI_MODEL` / `OPENAI_DEFAULT_MODEL`. No BYOLLM UI.

Artifacts:

- `frontend/artifacts/LLM-MVP-3/`

---

## 3. Runtime Contract

```ts
type NexoraLlmRuntimeRequest = {
  turnId: string
  deterministicResponse: string
  experienceStatus: string
  managementContext: NexoraLlmManagementContext
}

type NexoraLlmRuntimeResult = {
  contribution: string | null
  status: "ok" | "failed"
  failure: { category: FailureCategory; message: string } | null
  runtime: { provider: string; model: string | null; requestId: string | null; latencyMs: number | null }
  usage: { inputTokens: number | null; outputTokens: number | null; totalTokens: number | null }
  cost: { amount: number; currency: string } | null
}

type FailureCategory =
  | "NOT_CONFIGURED" | "TIMEOUT" | "NETWORK_ERROR" | "AUTH_ERROR"
  | "RATE_LIMIT" | "PROVIDER_ERROR" | "INVALID_RESPONSE" | "EMPTY_RESPONSE"
```

CC still consumes `NexoraLlmParticipantRequest` / `{ contribution }`. Provider-native objects stop at the adapter.

---

## 4. Selected First Provider

- **Provider:** OpenAI (`LLM-MVP:3/OpenAITextAdapter`) — first certified **adapter**, not Nexora LLM architecture.
- **Model:** `OPENAI_MODEL` or `OPENAI_DEFAULT_MODEL`, else `gpt-4o-mini`.
- **Why:** Already the live client in this backend; Local AI OpenAI/Anthropic are stubs; Ollama is a different control plane; scene `/chat` schema is forbidden as the manager contract.
- **Client reused:** OpenAI Python SDK `responses.create` (same family as `chat_ai.py`). No new frontend SDK.

Credentials are not printed here.

---

## 5. Runtime Architecture

```
Manager
  → NexoraExecutiveShell
  → CC:5 executeNexoraConversationalExperience
  → deterministic Nexora resolution
  → deterministic response D
  → LLM-MVP:2 bounded management context
  → NexoraLlmParticipant.contribute (optional)
  → executeNexoraLlmRuntime (provider-neutral)
  → OpenAI text adapter (server)
  → OpenAI
  → normalized L
  → llmParticipantTurn.contribution
  → response / nexoraMessage remain D
```

Shell is **not** wired to the runtime (Phase 1/2 preserved). Optional host injects `createNexoraLlmRuntimeParticipant(adapter)`. Absent participant → certified deterministic path.

---

## 6. Provider Request

Runtime builds a provider-neutral payload:

- system instruction: non-authoritative participant rules (use supplied context only; no invented facts; no scenario/decision/execution claims; language only; no scene actions)
- user payload: JSON `{ turnId, experienceStatus, deterministicResponse, managementContext }`

The OpenAI adapter maps that to `responses.create` `input` system/user messages. Phase-2 context is not rewritten as OpenAI types.

Live prompts are not dumped.

---

## 7. Credential Boundary

- Live calls use server `OPENAI_API_KEY` inside `OpenAITextAdapter._client()`.
- HTTP body extra fields (`apiKey`, `OPENAI_API_KEY`) are ignored and not returned.
- CC participant/request/result contracts have no secret fields.
- `NexoraExecutiveShell` does not import the runtime.
- `frontend/app/lib/llm` is unused (freeze `[NO_HTTP]` preserved).
- Tests assert serialized request/result and CC sources do not contain `OPENAI_API_KEY` / `sk-`.

---

## 8. Failure / Timeout Behavior

| Condition | Normalized result | CC behavior |
|---|---|---|
| Not configured (no participant) | n/a | `not-configured`, fallbackUsed, **response = D** |
| Not configured (runtime, no adapter/key) | `NOT_CONFIGURED` | participant throw → `failed`, **D** |
| Timeout | `TIMEOUT` | `failed`, **D** |
| Network | `NETWORK_ERROR` | `failed`, **D** |
| Auth | `AUTH_ERROR` | `failed`, **D** |
| Rate limit | `RATE_LIMIT` | `failed`, **D** |
| Provider error | `PROVIDER_ERROR` | `failed`, **D** |
| Invalid response | `INVALID_RESPONSE` | `failed`, **D** |
| Empty response | `EMPTY_RESPONSE` | `failed`, **D** |

Timeout: 8 seconds. No retry loop. One adapter call per runtime invocation. Existing OpenAI SDK may apply its own transport behavior; this runtime does not retry.

---

## 9. Usage & Runtime Metadata

Captured when the adapter/provider supplies them:

- provider, model, requestId, latencyMs
- inputTokens, outputTokens, totalTokens
- cost only if the provider supplies `{ amount, currency }` (OpenAI adapter currently returns `cost: null`)

Any missing numeric field is **null**, not estimated.

---

## 10. Authority Preservation

No ownership change to CC, NCA (`usesLiveLlm: false`), Referent, NMI, Data Reality, Advisor, Scenario, Decision, Execution, Outcome/Learning. CC `usesLlmOrExternalProvider` remains false. Provider output is language data only.

---

## 11. Manager-Visible Behavior

Deterministic response D: **YES** (manager-visible `response` / `nexoraMessage`)

Real LLM contribution L: **NO** (only `llmParticipantTurn.contribution`)

---

## 12. Live Provider Proof

- Controlled fixture: Capacity focus context (`turnId: llm-mvp3-live-capacity`), no customer dataset, no Scenario/Decision/Execution writes.
- Real provider reached: **NO** — `OPENAI_API_KEY` not configured after loading `backend/.env`.
- pytest: `tests/test_nexora_llm_live.py` **skipped** (`OPENAI_API_KEY is not configured`).
- No credential disclosure in evidence.

---

## 13. Test Evidence

See `TESTS-EXECUTED.md`.

---

## 14. Provider Independence

CC depends only on `contribute(request)`. Future adapters (OpenAI already, later Anthropic, Ollama, JEV, customer-owned API) implement `complete({ system_instruction, user_payload, timeout })` behind `execute_nexora_llm_runtime`. **Only the OpenAI text adapter exists now. No Router, no JEV provider, no BYOLLM.

---

## 15. Deferred Work (not started)

- LLM-MVP:4 — LLM Usage Policy & Cost Guard
- LLM-MVP:5 — Governed LLM Output
- LLM-MVP:FINAL
- LLM-ROUTER
- JEV provider
- BYOLLM
- Gate expansion

---

## 16. Certification

**NPA-T LLM-MVP:3 — NOT CERTIFIED**

Blocker: live-provider proof cannot run without a server-side OpenAI credential. Implementation and deterministic tests are complete; Phase 4 must not start.
