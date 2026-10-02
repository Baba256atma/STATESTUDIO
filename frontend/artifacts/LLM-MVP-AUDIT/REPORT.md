# NPA-T LLM-MVP:AUDIT

Status: COMPLETE (audit only; not CERTIFIED; production delta 0)

Evidence date: 2026-10-01

Constraint: no production implementation, no new LLM pipeline, Advisor, conversation system, context store, or Decision/Scenario/Execution owner.

---

## 1. Executive Finding

Nexora already has a live, certified **deterministic** manager conversation path. A real manager can talk in natural language over CSV/Data Reality through **CC:5** (`executeNexoraConversationalExperience`) in `NexoraExecutiveShell`. Advisor, referent, NMI, Scenario, Decision, Execution, Outcome, and Learning remain under those existing authorities. That path **does not call an LLM**. NCA:1–7 declare `usesLiveLlm: false` and throw if live LLM is claimed.

What exists as “LLM” is three disconnected stacks:

1. **Frontend LLM platform** (`frontend/app/lib/llm`, LLM-1…12) — certified **contracts and dry-run/mock**. Tags `[NO_HTTP][NO_SDK][NO_PROVIDER_CALLS]`. No production import into CC, Advisor, or Executive Shell.
2. **HomeScreen / backend `/chat`** — live OpenAI **scene-action planner** (`backend/app/services/chat_ai.py`) after rules fail. Sends utterance + allowed scene object ids + mode. Mutates **scene**, not canonical Nexora management state.
3. **Type-C overlay** — live OpenAI/Ollama insight (`/typec/ai/insight`) with deterministic fallback; explicitly **must not** mutate routing, execution, scene, or memory. Wired from **HomeScreen** Type-C orchestration, **not** from `NexoraExecutiveShell`.

Additionally: backend **Local AI** (`/ai/local/*`, Ollama live; OpenAI/Anthropic **stubs**) is a parallel control-plane. Frontend generated OpenAPI types exist; Executive Shell does not call it.

**Maturity:** management NL MVP is largely **already solved without LLM**. LLM-enabled MVP is **not** live on the certified manager path. The smallest remaining work is a **participant seam** into CC/Advisor, using existing authorities and a server-side provider, **not** a second Nexora.

---

## 2. Existing LLM Components

| Component | Owner/File | Status | Runtime? | Notes |
|---|---|---|---|---|
| LLM-1 platform contracts | `frontend/app/lib/llm/llmPlatformContracts.ts` | LIVE PRODUCTION (contracts only) | No provider | Declares platform must own communication **and** must-not-own `provider_api_calls` |
| LLM-2 provider keys/capabilities | `llmProviderContracts.ts`, `llmProviderCapabilities.ts` | IMPLEMENTED BUT NOT LIVE-WIRED | No | gpt/ollama/claude/gemini keys; capability tables |
| LLM-3 runtime envelopes | `llmRuntimeContracts.ts`, `llmRuntimeMock.ts` | MOCK / FAKE / STUB | Dry-run only | Synthetic text “Provider calls were not executed” |
| LLM-4 prompt templates | `llmPromptTemplates.ts` | PLACEHOLDER / INCOMPLETE | No | Structure-only; “no business intelligence” |
| LLM-5 context builder | `llmContextContracts.ts`, `llmContextSources.ts` | PLACEHOLDER / INCOMPLETE | No | Abstract reference keys; `memory_reference` placeholder; no Data Reality access |
| LLM-6…12 token/cost/cache/security/resilience/freeze | `frontend/app/lib/llm/*` | TEST-ONLY / CONTRACT | No | Freeze tests forbid `fetch(` in platform |
| CC:5 orchestrator | `conversationalExperienceOrchestrator.ts` | LIVE PRODUCTION | Deterministic | Manager NL; consumes `advisorGrounding`, `nmiAdvisorBundle`; no LLM import |
| NCA 1–7 | `frontend/app/lib/manager-object/nexoraNca*.ts` | LIVE PRODUCTION | Deterministic | `usesLiveLlm: false`; throw if true |
| NXA Advisor | `nexoraNxa1ExecutiveAdvisorContract.ts` | LIVE PRODUCTION | Deterministic | Policy over existing authorities |
| Executive Shell CC submit | `frontend/app/executive/nex-mvp/NexoraExecutiveShell.tsx` | LIVE PRODUCTION | Deterministic | Calls CC:5; CSV semantic early-return then CC |
| HomeScreen chat | `useChatPipelineController.ts` → `chatToBackendLifecycle` → `POST /chat` | LIVE PRODUCTION | Mixed rule + LLM | Parallel conversation vs CC:5 |
| Backend chat runtime | `backend/app/services/chat_runtime.py` | LIVE PRODUCTION | Conditional LLM | Rules first; else `llm_chat_actions`; exception → empty reply fallback |
| OpenAI scene planner | `backend/app/services/chat_ai.py` | LIVE PRODUCTION | If `OPENAI_API_KEY` | JSON `{reply, actions[]}` scene ops; timeout 8s |
| Duplicate OpenAI planner | `backend/app/services/ai_commander.py` `llm_generate_actions` | UNCERTAIN / LEGACY | `/chat/ai` | Same JSON-action idea; `handle_chat` |
| Type-C AI HTTP | `typeCAIAdapter.ts`, `typec_ai_service.py` | LIVE PRODUCTION (HomeScreen Type-C) | Conditional | Fallback if fail; no canonical mutation |
| Type-C deterministic insight | `aiTypeCExecutiveInsight.ts` `buildTypeCAIExecutiveInsight` | LIVE PRODUCTION | Deterministic | Parallel insight builder vs HTTP |
| Local AI orchestrator | `backend/app/services/ai/orchestrator.py`, `routers/ai_local.py` | LIVE PRODUCTION (API) | Ollama if enabled | Not wired to CC/Executive Shell; frontend only generated types |
| Ollama provider | `backend/app/services/ai/providers/ollama_provider.py` | LIVE PRODUCTION (local AI) | Yes | Real HTTP |
| OpenAI/Anthropic providers (local AI layer) | `openai_provider.py`, `anthropic_provider.py` | PLACEHOLDER / INCOMPLETE | No | `metadata.stub`; `chat_json` returns `provider_not_configured` |
| Config keys | `backend/app/core/config.py` `LocalAISettings` | LIVE PRODUCTION | Config | `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `OLLAMA_*`, `TYPEC_AI_*` (names only) |
| Deterministic chat prompt/router | `frontend/app/lib/chat/nexoraChatPromptSystem.ts` | LIVE PRODUCTION | Not LLM | Classifier/engines; not a model prompt owner |
| Debug assistant prompts | `frontend/app/lib/debug/debugAssistantPrompts.ts` | LEGACY / UNUSED for MVP | No | Developer debug, not manager LLM |

---

## 3. Actual Runtime Architecture

### Path A — Certified manager (LIVE, no LLM)

```
Manager utterance (NexoraExecutiveShell)
  ↓ LIVE
optional CSV field Q&A early-return (PARTIAL / bypasses CC)
  ↓ LIVE
executeNexoraConversationalExperience  [CC:5]
  ↓ LIVE
referent / NCA / NXA Advisor / NMI bundle / Data Reality catalog
  ↓ LIVE
Scenario / Decision / Execution / Outcome / Learning authorities
  ↓ LIVE
Stage + Advisor reply on Shell
```

LLM seam on this path: **MISSING**.

### Path B — HomeScreen scene chat (LIVE, LLM conditional)

```
Manager text (HomeScreen sendText)
  ↓ LIVE
useChatPipelineController / chatToBackendLifecycle
  ↓ LIVE
POST /chat  → chat_runtime
  ↓ LIVE
rules (intensity, objects, …)
  ↓ PARTIAL
llm_chat_actions (OpenAI) if not rule
  ↓ LIVE
actions JSON
  ↓ LIVE
executeNexoraAction  [scene / panels]
```

Does **not** enter CC:5, NMI, Data Reality catalog, or Decision Theatre.

### Path C — Type-C insight overlay (LIVE on HomeScreen Type-C, not nex-mvp shell)

```
Type-C orchestration
  ↓ LIVE
requestTypeCAIInsight → POST /typec/ai/insight
  ↓ CONDITIONAL
OpenAI or Ollama JSON insight
  ↓ LIVE
fallback deterministic insight if error
```

Must not mutate routing/execution/scene/memory (code + fallback copy).

### Path D — Frontend LLM platform (TEST / dry-run)

```
build envelope → executeDryRunRuntimeRequest → synthetic string
```

**Not imported** by CC or Executive Shell.

Seam marks: Path A LIVE (deterministic). Path A→LLM **MISSING**. Path B LIVE (wrong product surface for Nexora manager MVP). Path C PARTIAL (wrong shell). Path D TEST-ONLY.

---

## 4. LLM Request Context

### Certified CC:5 path

Nothing is sent to a model. Classification for that path: all items **NOT SENT** because there is no LLM request.

CC **does** assemble for **deterministic** Advisor: manager message, conversation context, active stage subject ids, catalog, scenario/decision sessions, execution runtime, advisor grounding, NMI advisor bundle, previous utterance, entrance/guided attention. That is Nexora context, **not** an LLM payload.

### Path B `llm_chat_actions` (`chat_ai.build_user_prompt`)

| Item | Class | Builder |
|---|---|---|
| complete manager message | SENT | `text` |
| allowed scene object ids | SENT | `allowed_objects` |
| mode | SENT | `mode` default `business` |
| conversation history | NOT SENT | |
| current subject / referent / NMI | NOT SENT | |
| Business/Project, Goals, KPI/Data Reality, CSV evidence | NOT SENT | |
| Problems/Risks, Variables, Scenarios, Decisions, Executions, Outcomes | NOT SENT | |
| Stage, canonical IDs, Advisor context, provenance | NOT SENT | |
| system instructions | SENT | scene-action `SYSTEM_PROMPT` |
| tool definitions | CONDITIONAL | action type list in system prompt, not provider tools |

Context is **narrow and scene-shaped**, not excessive Nexora state.

### Path C Type-C (`sanitize_typec_ai_request`)

SENT (clamped): recommendation scenario/reasoning/tradeoff/risk/nextAction/confidence; adaptive guidance; memory repeated risks/patterns. NOT SENT: CSV rows, full NMI, CC history, Goals as Nexora objects. Prompt capped `MAX_PROMPT_CHARS = 4000`.

### Path D LLM-5

Would send **abstract reference keys** only if wired; currently unused. `memory_reference` is an explicit placeholder.

---

## 5. Advisor / LLM Responsibility Boundary

**Before any LLM call (Path A, always):** CC + NCA resolve speech act, referent, collection, clarification, NMI bundle, Data Reality catalog, Scenario/Decision sessions. Advisor (NXA) composes language from those authorities. LLM is not invoked.

**During LLM (Path B):** model is an **action planner + short reply** for scene verbs (`setColor`, `applyObject`, …). Not a Nexora Advisor.

**During LLM (Path C):** model is a **language/reasoning overlay** on already-computed Type-C recommendation. Instructed not to execute decisions or invent system state.

**After LLM:** Path B validates JSON then **executes scene actions**. Path C validates JSON or **falls back**; does not commit canonical management state. Path A has no post-LLM step.

**Current LLM roles:** combination of **language generator** (Type-C, chat reply) + **action proposer/executor for scene** (chat_ai). It is **not** the Executive Decision Advisor. NCA forbids that.

**Bypass flag (do not repair):** Path B LLM can drive `executeNexoraAction` scene mutation **around** CC/Scenario/Decision. Path A has no LLM bypass. CSV semantic early-return in Shell bypasses CC for some data-field questions (deterministic, not LLM).

---

## 6. Structured Output & Action Boundary

| Manager class | LLM involved? | Interpretation owner | Mutation owner | Confirm? | LLM commit canonical? | Provenance |
|---|---|---|---|---|---|---|
| Explain this problem | Path A: no. Path B: maybe scene reply | NCA/NXA/CC | none for truth | n/a | no on A | CC/Advisor |
| Why is this happening? | A: no (EI/NCA) | EI / NCA | no | n/a | no | existing |
| What can I change? | A: no | NCA explore | no | n/a | no | existing |
| Create a scenario | A: no | CC / scenario resolver | Scenario authority | via existing CC | **no LLM** | CC session |
| Compare scenarios | A: no | NPS / NCA | no | n/a | no | existing |
| What do you recommend? | A: no; C: overlay | Advisor / Type-C deterministic then optional AI | no from AI | n/a | no | Type-C caution |
| Go with A / Record decision | A: no | CC commitment resolver | Decision authority | existing CC | **no LLM** | CC |
| Execute it | A: no | CC execution follow-up | Execution authority | existing | **no LLM** | CC |
| What happened after | A: no | Outcome/Learning | those owners | n/a | no | CORE-OUT / ECA |

Chat LLM output: **structured JSON** (Pydantic), **not** Nexora typed intents. Scene actions can apply **without** a Nexora Decision commit.

Type-C: structured JSON, schema-validated, overlay only.

Frontend LLM platform: empty structured-output **placeholder** in dry-run envelope.

---

## 7. CSV / Data Reality → LLM Journey

Existing path:

CSV parse/import (`csvRealDataImportStore`, `csvRealDataVerticalSlice`, semantic understanding) → Data Reality catalog on Shell → optional CSV Q&A early-return → **CC:5** with `dataRealityExperience.catalog` + `nmiAdvisorBundle`.

A manager **can** (deterministic): provide CSV, ingest, ask NL questions, investigate, scenario/decision/execute/learn via existing owners.

LLM on that journey: **MISSING**. Data Reality does not flow into `chat_ai` or Type-C (Type-C gets recommendation/guidance/memory, not CSV). Frontend LLM-5 does not read Data Reality (`no_direct_app_or_knl_access`).

Gate: **not** required by current LLM runtimes for this CSV path.

---

## 8. Provider & Runtime Readiness

| Topic | Finding |
|---|---|
| Providers | OpenAI Responses API (`chat_ai`, Type-C default); Ollama HTTP (`typec` if `TYPEC_AI_PROVIDER=ollama`; local AI layer); Anthropic **stub** in local AI |
| Models | `OPENAI_MODEL` / `OPENAI_DEFAULT_MODEL` default `gpt-4o-mini`; `OLLAMA_DEFAULT_MODEL` default `llama3.2:3b`; `TYPEC_AI_MODEL` |
| Config | env via `LocalAISettings` + os.getenv in chat_ai/typec; **server-side keys** |
| Browser/server | Keys not in frontend LLM platform (platform forbids fetch). HomeScreen posts `/chat` to backend. Type-C posts `/typec/ai/insight`. |
| API-key exposure | Server env names only; do not put keys in `app/lib/llm`. Risk if `/chat` is exposed without auth (out of this audit’s live probe) |
| Streaming | Type-C Ollama `stream: False`. chat_ai non-stream Responses API |
| Timeout | chat_ai 8s; Type-C Ollama `TYPEC_AI_TIMEOUT_SECONDS` default 8; LocalAI `ollama_timeout_seconds` default 10 |
| Retry | not in `llm_chat_actions`; Type-C catch-all → fallback |
| Cancellation | HomeScreen `AbortSignal` on `postChat`; not proven through OpenAI SDK |
| Rate limits | no dedicated handler in chat_ai |
| Malformed | JSON decode / ValidationError raise; chat_runtime catches → fallback empty; Type-C fallback insight |
| Outage | Type-C fallback copy; chat_runtime source `fallback`; local AI health on startup |
| Token/context limits | Type-C 4000 chars; LLM-6 meter is contract/test only |
| Fallback | Type-C: deterministic remains source of truth. Chat: rule path preferred. CC: always deterministic |
| Test provider | frontend dry-run/mock; backend tests inject fakes |

---

## 9. Conversation & Referent Continuity

**Owner of continuity for the manager product:** CC:5 + NCA + canonical referent + NMI + Shell `conversationContext` / `previousUtterance` / manager object session. Follow-ups (“Why?”, “What about Capacity?”, “Go with A”) are **proven in deterministic tests and live Shell**, not via LLM history.

LLM Path B does **not** send conversation history; continuity would be accidental (focused object / allowed_objects only).

LLM Path C is turn-isolated overlay on Type-C state.

Frontend LLM-5 `memory_reference` is a **placeholder** — must **not** become a second referent.

Duplication risk: Shell CSV semantic field ref (`csvSemanticConversationFieldRef`) is a **narrow parallel** conversation memory for CSV columns vs CC referent.

---

## 10. Existing Test Evidence

| Class | Evidence | Proves live provider? |
|---|---|---|
| UNIT PROOF | `frontend/app/lib/llm/*.test.ts` (platform, prompt structure, freeze no fetch); NCA `usesLiveLlm: false`; NXA/CC tests | No |
| INTEGRATION PROOF | CC:5 tests (`executeNexoraConversationalExperience`); Executive Shell tests assert CC import; Type-C adapter tests; `backend/tests/test_typec_ai.py` | HTTP insight **can** be mocked; not executive LLM |
| SIMULATION PROOF | RMS / SIM-TEST speak through CC:5; `usesLiveLlm` false | No LLM |
| LIVE PROVIDER PROOF | **None** on CC/Executive path. Backend OpenAI requires env; not used as funnel proof for Nexora manager | No for MVP path |
| BROWSER RUNTIME PROOF | Shell submits CC:5 (deterministic). HomeScreen `/chat` is a different UI | LLM not on nex-mvp |

Do not treat LLM freeze tests as provider operation.

---

## 11. Authority / Duplication Findings

Intentional adapters vs competing owners:

| Concept | Implementations | Verdict |
|---|---|---|
| Manager conversation | CC:5 (canonical); HomeScreen `/chat`; CSV early-return | **Competing surfaces**; CC is certified manager owner |
| Advisor | NXA/NCA; Type-C insight; chat reply | NXA/NCA canonical; others overlays/replies |
| LLM client | `app/lib/llm` (no HTTP); `chat_ai`; `ai_commander`; `typec_ai_service`; `LocalAIOrchestrator` | **Four live/partial clients**; platform is unused gateway |
| Provider abstraction | LLM-2 contracts vs backend `AIProvider` | Parallel; OpenAI implemented twice (chat_ai live vs local-ai stub) |
| Prompt authority | LLM-4 structure; chat_ai SYSTEM; typec SYSTEM; ai_commander; nexoraChatPromptSystem | **Multiple**; none is CC Advisor prompt |
| Context builder | LLM-5 abstract; CC input object; Type-C sanitize; chat_ai JSON | CC owns manager context |
| Referent | CC/NCA | CSV field ref is extra |
| Action router | CC commands vs chat actions vs executeNexoraAction | Scene vs management split |
| Scenario/Decision/Execution | existing CC/nex-mvp/ECA | **Do not duplicate** |

---

## 12. MVP Journey Readiness

| Journey Step | Status | Existing Owner | Gap |
|---|---|---|---|
| Manager loads/uses CSV | READY | csv import / Data Reality | none for LLM |
| Data Reality established | READY | P0:1 Data Reality | none |
| Manager talks naturally | READY | CC:5 + Shell | LLM not used; NL already works |
| Current subject/context | READY | referent / NCA / NMI | LLM must consume, not own |
| LLM interpret/reason/explain | MISSING | — (Advisor is deterministic) | no CC↔LLM seam |
| Investigate problems/variables | READY | NCA / EI | LLM optional overlay |
| Create/explore scenarios | READY | Scenario authority via CC | LLM must not create in parallel |
| Compare options | READY | NPS / NCA | LLM optional language |
| Reach a decision | READY | Manager + CC | LLM must not decide |
| Record decision | NOT LLM RESPONSIBILITY | Decision authority | already solved |
| Execution / Outcome / Learning | NOT LLM RESPONSIBILITY | those owners | already solved |

---

## 13. MVP Gap Ledger

| Gap | Priority | Evidence | Existing Owner | Smallest Seam |
|---|---|---|---|---|
| No LLM on certified manager path | P0 | Shell → CC:5; no `app/lib/llm` import; NCA `usesLiveLlm: false` | CC:5 / NXA | Optional post-resolve language participant; fallback = current Advisor text |
| Intended gateway cannot call providers | P0 | LLM-3 `[NO_HTTP]`; freeze forbids fetch; dry-run mock | `app/lib/llm` | Server-side execution; platform remains envelope/policy |
| Live providers ignore Nexora management context | P0 | `build_user_prompt` only text/objects/mode; Type-C not on Shell | chat_ai / typec / NMI | Adapter: NMI+referent+Data Reality snapshot → existing LLM-5 keys or Type-C-like sanitize |
| CC mutations already correct without LLM | ALREADY SOLVED | CC scenario/decision/execution | those authorities | do not add LLM mutator |
| Deterministic NL over CSV | ALREADY SOLVED | Shell + CC + csv store | Data Reality / CC | do not rebuild CSV |
| Type-C non-mutation overlay pattern | ALREADY SOLVED (wrong shell) | typec_ai + adapter fallback | Type-C | reuse pattern on CC, do not fork Advisor |
| CSV Q&A bypasses CC | P1 | Shell `answerCsvSemanticInquiry` early return | Data Reality + CC | later: same participant after CC, or fold Q&A into CC only |
| Dual Type-C insight builders | P1 | `buildTypeCAIExecutiveInsight` vs HTTP adapter | Type-C | pick overlay vs deterministic; no new owner |
| Four provider stacks | P1 | chat_ai vs local AI stub OpenAI vs Type-C vs unused LLM-2 | none unified | reuse one **server** caller for CC overlay |
| Scene LLM can mutate via actions | P1 | chat_runtime + executeNexoraAction | scene execution | keep off nex-mvp; do not use as manager LLM |
| No live-provider proof on CC | P1 | tests assert no openai import | test funnel | later: optional live test behind env, not mock-as-live |
| Known/assumed/calculated not in LLM prompts | P2 | Type-C/chat prompts omit Nexora epistemic types | Data Reality / EI | prompt constraint only after seam exists |
| LLM-6…12 execution (tokens, cache, stream) | P2 | contracts/tests only | `app/lib/llm` | after MVP overlay works |
| Local AI control plane for manager | P2 | `/ai/local/*` unused by Shell | LocalAIOrchestrator | post-MVP |
| Gate external ecosystems | P2 | not on LLM runtime | Gate | do not start for LLM-MVP |
| HomeScreen as manager LLM | P2 / reject | parallel conversation | CC:5 | do not promote Path B to Nexora Advisor |

---

## 14. Proposed LLM-MVP Phases

Do not start these in AUDIT.

### NPA-T LLM-MVP:1 — Participant seam on CC:5

- **Purpose:** Allow optional LLM **language** after CC/NCA/Advisor have already resolved meaning; on failure, keep current deterministic reply.
- **Gap closed:** P0 no LLM on certified manager path.
- **Reuse:** `executeNexoraConversationalExperience`, NXA, NCA (`usesLiveLlm` remains false for **authority**; LLM is not a second Advisor).
- **Certification:** focused tests: CC still owns referent/mutation; overlay skippable; no new conversation engine.

### NPA-T LLM-MVP:2 — Context package from existing owners

- **Purpose:** Build the model request from NMI advisor bundle, referent, Data Reality/CSV snapshot, and CC conversation slice — **references/summaries**, not a new store.
- **Gap closed:** P0 live providers ignore management context.
- **Reuse:** LLM-5 **keys** as transport; NMI; Data Reality; CC context snapshot. Type-C `sanitize_*` as size/clamp precedent.
- **Certification:** SENT/NOT SENT contract test vs Path A inputs; no KNL/app fetch inside LLM platform.

### NPA-T LLM-MVP:3 — One server-side provider for that seam

- **Purpose:** Execute the CC overlay on the server (env keys). Do not call providers from `app/lib/llm`. Do not use `llm_chat_actions` scene verbs as the manager API.
- **Gap closed:** P0 gateway cannot call providers; P1 stack sprawl (choose one caller).
- **Reuse:** backend timeout/fallback style from Type-C; config names already in `LocalAISettings` / env.
- **Certification:** malformed/outage → deterministic Advisor; no key in client bundles.

### NPA-T LLM-MVP:4 — Output = explanation/proposal only

- **Purpose:** Schema for overlay text (and optional **proposal** ids that existing CC already understands). Mutation only through Scenario/Decision/Execution owners; confirmation stays CC.
- **Gap closed:** P1 action-boundary clarity; prevents Path-B-style JSON actions on canonical state.
- **Reuse:** CC command results; Type-C “do not execute / do not invent state”.
- **Certification:** “Create a scenario / Go with A / Execute” still mutate only via existing resolvers; LLM cannot commit.

### NPA-T LLM-MVP:FINAL — CSV/Data Reality journey + continuity

- **Purpose:** Prove overlay on the **existing** CSV → Data Reality → CC journey; follow-ups use CC referent, not LLM memory.
- **Gap closed:** P1 continuity + live-path proof; P2 epistemic labels if cheap.
- **Reuse:** Shell CSV import; CC continuity tests; RMS/SIM-TEST conversation entry remains CC:5.
- **Certification:** unit + owning-layer + one integration; live provider optional and not required to call the overlay CERTIFIED if dry-run+fallback proven — **do not** treat mocks as live proof.

No extra phases for Scenario/Decision/CSV/Gate/Advisor rebuilds.

---

## 15. Deferred / Post-MVP

- Streaming, token metering, cache, billing, tool-calling **execution** in LLM-6…12
- Local AI control-plane / policy canary as the manager provider
- Implementing OpenAI/Anthropic inside `AIProvider` stubs (unless LLM-MVP:3 explicitly reuses that layer)
- Unifying HomeScreen `/chat` with CC
- Gate ecosystem connectors
- Making NCA `usesLiveLlm: true` (would violate certified NCA boundary; overlay must sit **beside**, not inside, NCA authority)
- Prompt encyclopedia / new memory authority

---

## 16. Final Audit Status

**NPA-T LLM-MVP:AUDIT — COMPLETE**

- Recommended implementation phases: **5** (LLM-MVP:1, :2, :3, :4, :FINAL)
- P0 blockers: **3**
- P1 gaps: **5** (CSV bypass, dual Type-C insight, four stacks, scene mutation path, no live-provider proof on CC)
- P2 / deferred: **6+** (epistemic prompts, LLM-6…12 execution, local AI for manager, Gate, HomeScreen-as-Advisor, streaming)
- Production code changed during AUDIT: **0**

Audit artifacts only: `frontend/artifacts/LLM-MVP-AUDIT/`. Pre-existing staged SIM-TEST files were not modified for this audit.

LLM-MVP:1 was **not** started.
