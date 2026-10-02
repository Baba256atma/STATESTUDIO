# NPA-T LLM-MVP:FINAL — End-to-End MVP Certification

Status: **CERTIFIED**

Inspection found an A-class product-seam gap: `/executive` produced D and M=D but never called Phase 4→3. The smallest repair reuses existing owners: after CC, Shell `completeNexoraLlmManagerPresentation` POSTs to `/nexora/llm/runtime`, then Phase-5 governance overlays M. No second Advisor, runtime, router, or client OpenAI path.

---

## 1. Program Status

| Phase | Status |
| --- | --- |
| LLM-MVP:AUDIT | COMPLETE |
| LLM-MVP:1 | CERTIFIED |
| LLM-MVP:2 | CERTIFIED |
| LLM-MVP:3-R1 | CERTIFIED |
| LLM-MVP:3 | CERTIFIED |
| LLM-MVP:4 | CERTIFIED |
| LLM-MVP:5 | CERTIFIED |
| LLM-MVP:FINAL | **CERTIFIED** |

---

## 2. Production Architecture

```
Manager (/executive Shell)
  → executeNexoraConversationalExperience (sync)
      CC / NCA / NMI / Advisor / Data Reality
      → D = presentedResponse
      → Phase-2 llmManagementContext
      → invoke participant (null in Shell → not-configured)
      → govern (M = D)
      → canonical state committed
  → completeNexoraLlmManagerPresentation (async)
      → POST /nexora/llm/runtime
      → Phase-4 authorize/reserve
      → Phase-3 provider-neutral runtime
      → OpenAI adapter
      → L + usage settlement
      → Phase-5 governNexoraLlmOutput
      → overlay response / nexoraMessage.text = M
  → Manager
```

Deviation from the ideal “participant inside CC” diagram: CC remains synchronous. Live fetch is owned by Shell after D exists. Paid calls still cannot occur without the server guard.

---

## 3. Authority Model

- **D authority:** certified CC `presentedResponse` / `llmGovernedOutput.deterministicResponse`
- **L authority:** none. Optional language only.
- **M role:** governed presentation on `result.response` = `nexoraMessage.text`

Canonical owners preserved: Referent (NCA), NMI, Data Reality, Scenario, Decision, Execution, Outcome/Learning, Advisor (NXA).

---

## 4. Real Product Seam

**real manager-facing wiring: YES**

`/executive` `NexoraExecutiveShell` awaits `completeNexoraLlmManagerPresentation` after CC. Browser → Nexora server only. Not OpenAI.

A-class blocker (pre-repair): Shell did not pass a participant and did not call the server. Repaired in FINAL; not a new phase.

---

## 5. Provider Runtime

- provider: openai (first certified adapter)
- adapter: `OpenAITextAdapter`
- model (live): gpt-4o-mini-2024-07-18
- CC/governance remain provider-neutral

---

## 6. Context

Phase-2 bounds unchanged: management 6, data 4, evidence 4, frames 3, scenario 1, decision 1, utterance 240, value 160, id 128.

raw full CSV sent: **NO**  
credential-shaped values sent: **NO**  
CSV semantic Q&A remains an intentional Shell early-return outside the LLM participant.

---

## 7. Cost Guard

- server enforcement: YES (`execute_nexora_llm_guarded_runtime`)
- scope: `ws_default`
- period: daily UTC `YYYY-MM-DD`
- live proof limit: 1
- disabled: LLM_DISABLED, provider calls 0, M = D
- exhausted: ALLOWANCE_EXHAUSTED, provider calls 0, M = D
- missing config: fail closed (default disabled)

---

## 8. Live E2E Proof

- manager journey: Capacity constraint explanation fixture via product HTTP seam
- D produced: YES
- policy: ALLOWED
- provider calls: **1**
- provider/model: openai / gpt-4o-mini-2024-07-18
- L: non-empty
- governance: **rejected** (`AUTHORITY_VIOLATION`, conservative “The active constraint…” parse)
- M: D (fallback)
- D recoverable: YES
- canonical mutation from L: NO

Useful M ≠ D is proven by deterministic Journey A (`nexoraLlmFinal.test.ts`), not by weakening live governance.

---

## 9. Live Usage

inputTokens **457** · outputTokens **77** · totalTokens **534**  
latencyMs **3601.812** · request id present: **true** · cost **null**

---

## 10. Deterministic Fallback

| Journey | provider calls | M = D | manager continues |
| --- | --- | --- | --- |
| B LLM_DISABLED | 0 (policy skip HTTP) | YES | YES |
| C ALLOWANCE_EXHAUSTED | 0 | YES | YES |
| HTTP/provider failure | no rewrite | YES | YES |
| D invalid L | 1 HTTP, 0 rewrite | YES | YES |

---

## 11. Governance

Accepted: supported explanation/summary/rephrase/hypothetical suggestion.  
Rejected: unsupported number, evidence, false decision/execution/outcome, referent conflict, epistemic upgrade, secrets/injection.  
Redundant echo: M = D.

Live useful L was conservatively rejected; composition remains certified by Phase-5 E/CC and FINAL Journey A.

---

## 12. Mutation Proof

Before/after Focus-on-Capacity + injected/server L: referent Capacity; NMI/Data Reality read-only projection; Scenario/Decision/Execution/Outcome/Learning write flags unchanged by L/governance/completion overlay.

---

## 13. Conversation Continuity

Journey E: after LLM-assisted M, “Why is it still a problem?” keeps NCA referent / focused subject Capacity. No provider thread/memory.

---

## 14. CSV Boundary

Shell CSV semantic inquiry can still early-return before CC. Phase-2 LLM context uses bounded Data Reality refs, not raw CSV files.

---

## 15. Usage Integrity

Re-certified via `tests/test_nexora_llm_usage.py`: idempotency, last-allowance concurrency (1 authorized / 1 skipped / 1 dispatch), JSON persistence, daily period reset, null tokens remain null.

---

## 16. Security

- API key configured: **true** (server)
- API key exposed: **false**
- frontend secret exposure: **false**
- usage-record secret exposure: **false**
- manager-visible hidden instructions: **false**
- raw provider object visible: **false**

---

## 17. Provider Call Bounds

| Turn | provider calls |
| --- | --- |
| allowed | 1 |
| skipped | 0 |
| rejected-L | 1 (no rewrite) |
| provider-failure | 0 extra / no retry loop |

---

## 18. Historical / Non-MVP LLM Paths

`/chat` replay, Type-C insight, `app/lib/llm` dry-run, Ollama schema defaults remain **outside** the `/executive` LLM-MVP path. Shell does not call them. No bypass of `/nexora/llm/runtime` from the certified manager Chat path. Not redesigned.

---

## 19. Test Evidence

See `TESTS-EXECUTED.md`.

---

## 20. Failure Classification

1. **A — LLM-MVP integration blocker:** Shell never reached Phase 4→3. **Repaired** with `completeNexoraLlmManagerPresentation`. Does not invalidate Phases 1–5.
2. Live L **AUTHORITY_VIOLATION**: conservative governance, **not** a certification fail (spec §9). Classified as expected conservative reject, not a defect.

No remaining A-class blocker.

---

## 21. Remaining LLM Debt

LLM-ROUTER · BYOLLM · JEV · additional adapters · commercial plan packaging · production observability · optional async CC (not required; Shell completion is the certified async seam)

---

## 22. Deferred Programs

Not started: LLM-MVP:6 · LLM-ROUTER · BYOLLM · JEV · commercial billing · Gate expansion · public deployment

---

## 23. MVP Readiness Statement

**Nexora LLM subsystem is MVP-ready.**

This does not claim public deployment, commercial billing, or that every hallucination is impossible.

---

## 24. Certification

**NPA-T LLM-MVP:FINAL — CERTIFIED**
