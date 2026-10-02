# NPA-T LLM-MVP:4 — Usage Policy & Cost Guard

Status: **CERTIFIED**

Paid LLM calls are authorized server-side before the Phase-3 runtime. Missing policy fails closed. Deterministic D remains available when LLM is skipped. LLM-MVP:5 was not started.

---

## 1. Existing Infrastructure Reused

- **Scope:** `ws_default` from `product_store_v0.ensure_default_workspace_v0` (existing default workspace). No new user/subscription owner.
- **Persistence pattern:** JSON + temp-replace, same family as product/replay stores; file lock (`fcntl`) + thread lock for reservation.
- **Configuration:** server env, same convention as `OPENAI_API_KEY`.
- **Runtime:** certified `execute_nexora_llm_runtime` / `OpenAITextAdapter`. Guard wraps it; does not parse OpenAI objects.

---

## 2. Files Changed

Policy: `usage_policy.py`, `nexoraLlmUsagePolicy.ts`

Persistence/meter: `usage_store.py`

Runtime integration: `usage_guard.py`, `routes/nexora_llm.py`, `nexoraLlmUsageGuard.ts`, `nexoraLlmConversationParticipant.ts` (`skipped-by-policy`), `index.ts`, `nexora_llm/__init__.py`

Tests: `test_nexora_llm_usage.py`, `test_nexora_llm_usage_live.py`, `nexoraLlmUsageGuard.test.ts`, HTTP secret test update

Configuration: `backend/.env.example` (placeholders only)

---

## 3. Usage Policy Contract

```
{ allowed: true, reason: "ALLOWED", reservationId }
{ allowed: false, reason: LLM_DISABLED | ALLOWANCE_EXHAUSTED | BUDGET_EXHAUSTED
  | POLICY_DECLINED | USAGE_UNAVAILABLE | CONFIGURATION_ERROR }
```

HTTP skipped result: `status: "skipped"`, `failure: null` (not a provider error).

---

## 4. Usage Scope

**workspace MVP scope `ws_default`** (existing product default). Not per-user (no production account owner). Client-supplied scope/quota is ignored. Later plans can supply a different `NEXORA_LLM_USAGE_SCOPE`.

---

## 5. Usage Period

- type: **daily** (also accepts `monthly`)
- period key: UTC `YYYY-MM-DD`
- reset: new key → fresh `authorizedAttempts`

---

## 6. Configured MVP Limit

Technical default (missing env): **LLM disabled** (`NEXORA_LLM_ENABLED` unset → skip). Not a commercial plan.

Explicit server config:

- `NEXORA_LLM_ENABLED`
- `NEXORA_LLM_USAGE_LIMIT` (authorized provider attempts per period)
- `NEXORA_LLM_USAGE_PERIOD`
- `NEXORA_LLM_USAGE_SCOPE`

Live/controlled tests used limit **1**. Example file documents `false` / `0`.

---

## 7. Authorization Flow

CC resolves D → optional guarded participant (CC skip is not the paid boundary) → **server** `POST /nexora/llm/runtime` → eligibility → atomic reserve → Phase-3 runtime → settle usage → L non-authoritative, D manager-visible.

---

## 8. Exhaustion

`ALLOWANCE_EXHAUSTED` → provider calls 0 → `status: skipped` → CC `skipped-by-policy` → **response = D**. No crash, no overage, no purchase.

---

## 9. Persistence

- owner: `NexoraLlmUsageStore` (`backend/data/nexora_llm/usage.json`)
- durability: JSON file survives process restart
- concurrency: exclusive file lock + thread lock on reserve
- idempotency: same `turnId` after reserve/settle → `POLICY_DECLINED`, no second provider call

Canonical counter: **reserved/authorized provider attempts**. Pre-dispatch failure **releases**. Dispatched failure **settles and counts**.

---

## 10. Metering

Recorded when dispatched: attempts, runtime status, provider, model, latency, input/output/total tokens, cost if supplied.

---

## 11. Unknown Usage

Null tokens stored as **null**, not 0. Attempt still counts if dispatched.

---

## 12. Cost

Live cost = **null**. Not estimated.

---

## 13. Live Allowed Proof

policy ALLOWED · provider calls **1** · openai / gpt-4o-mini-2024-07-18 · usage 270/5/275 · latency ~3078 ms · D remains authority

---

## 14. Exhausted / Disabled Proof

Live exhausted: ALLOWANCE_EXHAUSTED · provider calls **0**  
Deterministic disabled: LLM_DISABLED · calls 0 · D returned

---

## 15. Concurrency Proof

limit=1, two threads: **1** ok, **1** skipped, **1** provider call.

---

## 16. Security

server-side enforcement: **YES**  
client can raise allowance: **NO**  
API key frontend: **NO**  
secret in usage record: **NO**

---

## 17. Authority Preservation

CC, NCA, Referent, NMI, Data Reality, Advisor, Scenario, Decision, Execution, Outcome/Learning unchanged. Usage store is operational accounting only.

---

## 18. Manager-Visible Behavior

D manager-visible: **YES**  
L manager-visible: **NO**  
LLM limit reached → Nexora operational: **YES**

---

## 19. Test Evidence

See `TESTS-EXECUTED.md`.

---

## 20. Deferred (not started)

LLM-MVP:5, FINAL, LLM-ROUTER, commercial billing, BYOLLM, JEV provider, Gate expansion.

---

## 21. Certification

**NPA-T LLM-MVP:4 — CERTIFIED**
