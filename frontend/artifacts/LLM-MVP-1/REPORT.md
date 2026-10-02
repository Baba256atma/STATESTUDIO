# NPA-T LLM-MVP:1 report

## 1. Existing Seam Located

Certified manager conversation resolves in `executeNexoraConversationalExperience` → every path returns through `finish` → `finalize`.

`finalize` already:

1. runs CC:1–4 plus CC:8/9/10 where applicable,
2. updates executive context,
3. composes Advisor / NCA / NMI / VAI / NPS presentation,
4. produces deterministic `presentedResponse` / `nexoraMessage`.

The participant is invoked **after** that composition, immediately before the frozen CC result is returned.

It is not invoked before referent, clarification, or command/runtime application.

`NexoraExecutiveShell` still calls CC:5 only. CSV semantic early-return in the Shell remains outside this seam (recorded for LLM-MVP:2).

## 2. Files Changed

Production:

- `frontend/app/lib/conversational-control/nexoraLlmConversationParticipant.ts` (new)
- `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- `frontend/app/lib/conversational-control/conversationalExperience.ts`
- `frontend/app/lib/conversational-control/index.ts`

Tests:

- `frontend/app/lib/conversational-control/nexoraLlmConversationParticipant.test.ts` (new)

Artifacts:

- `frontend/artifacts/LLM-MVP-1/`

## 3. Participant Contract

Owner: CC-facing module `nexoraLlmConversationParticipant.ts` (not `app/lib/llm`).

Existing LLM-1…12 envelopes require provider/model keys and are dry-run / `[NO_HTTP]`. Wiring them as a live gateway would violate freeze and treat mock runtime as a provider. This contract is the smallest adapter; later runtime may implement `contribute` without CC knowing the vendor.

```ts
type NexoraLlmParticipantRequest = {
  turnId: string;
  deterministicResponse: string;
  experienceStatus: NexoraConversationalExperienceStatus;
  contextRefs: Readonly<Record<string, string>> | null; // reserved for :2
};

type NexoraLlmParticipantResult = {
  contribution: string | null;
};

type NexoraLlmConversationParticipant = {
  contribute(request: NexoraLlmParticipantRequest): NexoraLlmParticipantResult;
};
```

Host injects `NexoraConversationalExperienceInput.llmParticipant`. Absent/null = not configured.

## 4. Runtime Flow

```
Manager
  → NexoraExecutiveShell
  → CC:5 executeNexoraConversationalExperience
  → existing CC/NCA/referent/Advisor resolution
  → deterministic presentedResponse (D)
  → optional llmParticipant.contribute (injected, provider-neutral)
  → llmParticipantTurn on result (contribution vs D kept distinct)
  → response / nexoraMessage remain D
  → Manager
```

Phase 1 does not replace manager-visible copy with L. `response` stays D so canonical facts are not overwritten. Contribution is on `llmParticipantTurn`.

## 5. Authority Preservation

| Authority | Preserved? |
|---|---|
| CC | Yes. `usesLlmOrExternalProvider` remains false. |
| NCA | Yes. `usesLiveLlm` remains false. Participant is not NCA. |
| Referent | Yes. Tests prove subject id unchanged. |
| NMI | Yes. Not used or replaced. |
| Advisor/NXA | Yes. NXA role unchanged; participant `isAdvisor: false`. |
| Scenario | Yes. Contribution cannot create a scenario. |
| Decision | Yes. |
| Execution | Yes. |
| Outcome/Learning | Yes. ECA write flags remain false. |

## 6. Fallback Evidence

| Case | CC behavior |
|---|---|
| no participant | `status: not-configured`, `response` = D |
| success | `status: succeeded`, `contribution` set, `response` = D |
| throw | `status: failed`, `contribution` null, `response` = D |
| empty/null/async | `status: rejected`, `response` = D |

## 7. Mutation Safety

**NO.** The participant return type is language only. CC does not apply contribution to Scenario, Decision, Execution, Outcome, Learning, or referent.

## 8. Provider Independence

CC contains no OpenAI, Anthropic, Ollama, or JEV types or HTTP.

Later adapter can serve:

- cloud provider
- local provider
- JEV
- customer-owned API

behind `contribute`, without changing CC authority.

## 9. Test Evidence

Seam: `nexoraLlmConversationParticipant.test.ts` — **9 pass / 0 fail** (identity + A–H).

Related focused regression in the same run:

- `conversationalExperience.test.ts` (CC:5 baseline)
- `nexoraNxa1ExecutiveAdvisorContract.test.ts`
- `nexoraNca1ConversationArchitecture.test.ts`
- `mvpOut1Fix1WhatIfConversation.test.ts` (canonical what-if / scenario routing)

Combined: **68 pass / 0 fail**.

No live-provider tests. No network. No API keys.

## 10. Deferred Work

- **LLM-MVP:2:** NMI / Data Reality / CSV / conversation slice in `contextRefs`; Shell CSV early-return still skips CC/participant.
- **LLM-MVP:3:** server-side provider execution implementing `contribute`.
- **LLM-MVP:4:** whether/how contribution may enter governed presentation vs remaining a side field; action proposals.
- **LLM-MVP:FINAL:** live journey certification on CSV → CC with overlay.
- **LLM-ROUTER:** model/cost/privacy routing behind the runtime, never CC.

## 11. Certification

NPA-T LLM-MVP:1 — CERTIFIED
