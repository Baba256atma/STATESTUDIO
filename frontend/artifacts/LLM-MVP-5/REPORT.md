# NPA-T LLM-MVP:5 — Governed LLM Output

Status: **CERTIFIED**

D remains Nexora authority. L is a non-authoritative language contribution. M is the governed manager-facing presentation. Governance is local and deterministic. LLM-MVP:FINAL was not started.

---

## 1. Existing Seams Reused

- **CC response owner:** `executeNexoraConversationalExperience` (CC:5). `presentedResponse` is D; after governance, `response` / `nexoraMessage.text` are M.
- **Advisor / presentation owner:** NXA Executive Decision Advisor + NCA conversation presentation. Governance does not create a second Advisor. When M ≠ D, only the frozen message `text` is replaced.
- **Phase-2 context:** `projectNexoraLlmManagementContext` / `NexoraLlmManagementContext`.
- **Phase-3 runtime:** `executeNexoraLlmRuntime` / `execute_nexora_llm_runtime`, OpenAI text adapter.
- **Phase-4 guard:** `execute_nexora_llm_guarded_runtime` (server) and `createNexoraLlmUsageGuardedParticipant` (CC skip, not the paid boundary).
- **Canonical owners unchanged:** NCA referent, NMI, Data Reality, Scenario, Decision, Execution, Outcome/Learning.

Shell already displays `result.nexoraMessage`. Phase 1’s deferred live HTTP participant inside sync CC is unchanged: no second shell, no client OpenAI call.

---

## 2. Files Changed

**Governance:** `nexoraLlmGovernedOutput.ts`

**Composition / presentation:** `conversationalExperienceOrchestrator.ts` (M on `response` / `nexoraMessage`), `conversationalExperience.ts` (`llmGovernedOutput`), `NexoraExecutiveShell.tsx` (comment only)

**Provider prompt:** `nexoraLlmRuntimeContract.ts`, `backend/app/services/nexora_llm/contracts.py`

**CC integration:** orchestrator finalize after `invokeNexoraLlmConversationParticipant`; `index.ts` exports

**Tests:** `nexoraLlmGovernedOutput.test.ts`, `nexoraLlmGovernedOutputCc.test.ts`, `nexoraLlmGovernedOutputLive.test.ts`, `backend/tests/test_nexora_llm_governed_live.py`

---

## 3. Final D / L / M Contract

| Symbol | Implementation |
| --- | --- |
| **D** | `llmParticipantTurn.deterministicResponse` and `llmGovernedOutput.deterministicResponse` (certified CC `presentedResponse`) |
| **L** | `llmParticipantTurn.contribution` (normalized provider text, or null) |
| **M** | `llmGovernedOutput.managerText` = `result.response` = `nexoraMessage.text` |

`M = Govern(D, L, Phase-2 context)`. Never `M = raw L` as authority. If L is absent, skipped, failed, empty, redundant, or rejected: `M = D`.

---

## 4. Governance Flow

```
Manager utterance
  → CC:5 deterministic resolution → D
  → Phase-4 usage guard
  → Phase-3 provider (0 or 1 call) → L
  → governNexoraLlmOutput (local, no provider)
  → M on response / nexoraMessage
  → manager (Shell consumes nexoraMessage)
```

---

## 5. Accepted Contribution Rules

L may become M when it is non-empty, not redundant with D, does not violate action/decision/execution/outcome/evidence/number/referent/epistemic/secret/injection rules, is within 480 characters (or a bounded prefix), mentions the resolved subject (or overlaps D when no subject), or is clearly hypothetical advice (`you could` / `you may want` / `as another option`) without claiming canonical creation.

---

## 6. Rejection / Fallback Reasons

`NO_LLM_CONTRIBUTION` · `POLICY_SKIPPED` · `PROVIDER_FAILURE` · `EMPTY_OUTPUT` · `REDUNDANT` · `UNSUPPORTED_CLAIM` · `AUTHORITY_VIOLATION` · `ACTION_CLAIM` · `STATE_MUTATION_CLAIM` · `INVALID_OUTPUT` · `GOVERNANCE_ERROR`

Rejected and fallback both yield `M = D`, `llmContributionUsed = false`.

---

## 7. Facts / Numbers

`Capacity utilization is now 94%.` → `UNSUPPORTED_CLAIM`, `M = D`.

---

## 8. Evidence

`According to the latest production report...` → `UNSUPPORTED_CLAIM`, `M = D`.

---

## 9. Decision Authority

`I approved Scenario A...` → `ACTION_CLAIM`.  
`Nexora has decided Scenario A is the correct choice...` → `STATE_MUTATION_CLAIM`.

---

## 10. Execution Authority

`I assigned it to Operations...` → `ACTION_CLAIM`.

---

## 11. Outcome / Learning Authority

`...was a success and the lesson learned...` → `STATE_MUTATION_CLAIM`.

---

## 12. Referent

`Delivery is the current problem...` while subject is Capacity → `AUTHORITY_VIOLATION`.

---

## 13. Epistemic State

Subject epistemic `inferred` + `Capacity definitely increased.` → `AUTHORITY_VIOLATION`.

---

## 14. Suggestion Boundary

`You could examine temporary overtime as another option.` → `accepted`. No Scenario mutation.

---

## 15. Redundancy

Exact / whitespace-normalized `L == D` → `REDUNDANT`, `M = D`, no duplicate text.

---

## 16. Fallback

| Case | M |
| --- | --- |
| no L / not-configured | D |
| policy skip | D |
| provider failure | D |
| empty / invalid L | D |
| governance rejection | D |

---

## 17. Provider Calls

Maximum **1** per manager-turn LLM participant path. Governance never calls a provider. Policy skip: **0**.

---

## 18. Cost Guard

Phase-4 server guard remains the paid-call authority. Manager-facing path does not call OpenAI from the UI. Rejected L does not refund usage.

---

## 19. Usage (live)

inputTokens **459** · outputTokens **70** · totalTokens **529** · cost **null** (not estimated).

---

## 20. Live Provider Proof

- provider: openai
- model: gpt-4o-mini-2024-07-18
- policy: ALLOWED
- provider calls: **1**
- L: non-empty explanation of Capacity / Overtime
- governance: **accepted**
- M: LLM-assisted (not equal to D)
- D recoverable: **yes**
- usage: 459 / 70 / 529 · cost null

No secrets in artifacts.

---

## 21. Manager-Visible Proof

Deterministic E/CC: L overtime/subcontracting explanation becomes `response` / `nexoraMessage.text` while D stays `Focused on Capacity.`

Live: M includes overtime vs subcontracting language that D did not contain; D remains `Capacity remains the active constraint. Scenario A and Scenario B are available for comparison.`

---

## 22. Mutation Proof

Accepted and rejected L paths: focused subject / NCA referent unchanged; `scenarioResult` / `decisionCommitmentResult` null on Focus-on-Capacity; no Execution list; Outcome/Learning write flags false. Governance does not call createScenario / commitDecision / startExecution / updateNmi.

---

## 23. Security

API key manager-visible: **NO**  
Hidden system/provider instructions manager-visible: **NO**  
Raw provider object manager-visible: **NO**  
Server configuration manager-visible: **NO**  
`OPENAI_API_KEY` / instruction-injection patterns in L → `INVALID_OUTPUT`, `M = D`

---

## 24. Test Evidence

See `TESTS-EXECUTED.md`.

---

## 25. Deferred (not started)

LLM-MVP:FINAL · LLM-ROUTER · BYOLLM · JEV · commercial billing · Gate expansion · autonomous LLM actions · Shell async HTTP participant (still blocked by sync CC)

---

## 26. Certification

**NPA-T LLM-MVP:5 — CERTIFIED**
