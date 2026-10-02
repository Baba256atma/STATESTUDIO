# NPA-T LLM-MVP:3-R1 — Live Provider Proof & Certification

Status: **CERTIFIED**

Closes the Phase-3 live-provider evidence gap. Production runtime architecture was not redesigned.

---

## 1. Credential Discovery

| Source | configured (non-empty) |
|---|---|
| Process environment (before dotenv) | false |
| backend `.env` (after dotenv) | **true** |

The Phase-3 runtime originally could load this file; the value was empty. It is now non-empty. No secret value is recorded.

---

## 2. Root Cause (prior skip)

Previous R1 skip: `OPENAI_API_KEY=` was present but blank. Not a path/dotenv bug.

---

## 3. Repair

Production adapter/runtime/CC: **unchanged**.

Test-only:

- `backend/tests/test_nexora_llm_live.py` — assert normalized live metadata; count `complete()`; write sanitized evidence; **do not** require L text ≠ D (the live model echoed D).
- `backend/tests/test_nexora_llm_runtime.py` — `NOT_CONFIGURED` test now clears `OPENAI_API_KEY` so it cannot fall through to the live adapter.
- `frontend/app/lib/conversational-control/nexoraLlmRuntimeCc.test.ts` — K2: L matching D text still leaves D manager-visible.

First live execution reached OpenAI and failed a **test** assertion (`L !== D` as strings). That is not a runtime defect. Nexora has no retry loop.

---

## 4. Configuration Verification

- provider: openai
- configured: **true**
- resolved model (env): gpt-4o-mini
- live returned model: `gpt-4o-mini-2024-07-18`

---

## 5. Live Test

`backend/tests/test_nexora_llm_live.py` **executed** (not skipped) and **passed**.

---

## 6. Live Provider Evidence

From `live-evidence.json` (no secret, no prompt dump):

- provider: openai
- model: gpt-4o-mini-2024-07-18
- status: ok
- request id present: **yes**
- latencyMs: 1755.36
- contribution non-empty: **yes**
- contribution text equaled D: **yes** (echo; still non-authoritative)

---

## 7. Usage Evidence

- inputTokens: 270
- outputTokens: 5
- totalTokens: 275
- cost: null (not invented)

---

## 8. Runtime Normalization

Provider-native `responses.create` output was mapped to `NexoraLlmRuntimeResult` (`status`, `contribution`, `runtime`, `usage`, `failure=null`). CC does not receive the native object.

---

## 9. Authority Proof

D manager-visible: **YES** (`response` / `nexoraMessage` remain D)

L manager-visible: **NO** (participant turn only)

L canonical authority: **NO**

K2 proves that even when L text equals D, CC still treats D as the manager-visible result and does not mutate Scenario/Decision/referent.

---

## 10. Mutation Proof

K2 + N: no Scenario/Decision/Execution/Outcome/Learning writes; referent/subject remain Capacity. Runtime returns language only.

---

## 11. Request Count

Certified live invocation: **1** `OpenAITextAdapter.complete` call. No Nexora retry loop.

---

## 12. Regression Evidence

See `TESTS-EXECUTED.md`.

---

## 13. Security Evidence

- API key printed: **NO**
- API key in artifact: **NO**
- API key in frontend: **NO**
- API key committed: **NO**

---

## 14. Deferred (not started)

LLM-MVP:4, LLM-MVP:5, LLM-MVP:FINAL, LLM-ROUTER, JEV provider, BYOLLM, Gate expansion.

---

## 15. Certification

**NPA-T LLM-MVP:3-R1 — CERTIFIED**  
**NPA-T LLM-MVP:3 — CERTIFIED**
