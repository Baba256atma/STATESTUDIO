# NEX-CONV:2-FIX1 — Certification

Status: **NEX-CONV:2-FIX1 — CERTIFIED**

Date: 2026-09-06.

Live proof: `frontend/.certification/nex-conv2-fix1-entrance-intent-routing/live-browser.json`  
Port: **3014** (temporary production `next start`; stopped after proof). Historical `:3000` was left running.

NCA:4 test M (“Let’s permanently expand capacity because delivery is down.” → “Capacity and Delivery” clarification) remains **classified** (NCA-POST multi-entity). This fix did not own or change that routing.

## Root cause

`Why is this important?` was not treated as NCA `GOAL_RELEVANCE`. Cue ranking sent `"why"` to `CAUSE`. Guided Entrance did not own the turn. CC explain + MO:2 significance focus fell through to `composeSituation` because educational NEXORA has no associated Goal/Problem. The manager saw `NEXORA is stable.` CONV:1/2 and suggested actions were bypassed.

## Source of stable

`frontend/app/lib/manager-object/managerObjectExplainEngine.ts` — `composeSituation` from catalog `status: "stable"` on `obj-nexora-entrance` in `entranceEducationCatalog` (`nexoraGuidedEntranceExperience.ts`). Legitimate for `ASK_STATUS`. Misrouted for relevance.

## Meaning

NCA: importance/matter/relevant/worth (not causal / on-stage / investigate / recommend / first) → operation `ATTENTION`, `questionType: GOAL_RELEVANCE`.

## Subject

Educational actor `obj-nexora-entrance` (NEXORA). Existing deictic/educational identity. Not a business-object write.

## Purpose

`GOAL_RELEVANCE` → CONV `WHY_RELEVANT`. `ASK_WHY` without that type → `WHY_PRESENT`. `questionType: CAUSE` → `CAUSE`. `ASK_STATUS` remains status.

## Routing

Old: phrase/status template via CC explain.  
New: NCA → subject → CONV:1 `WHY_RELEVANT` → CONV:2 `LEARN_CAPABILITY` → product relevance copy → existing suggested-action composer.

## CONV:1

Live: EXPLAIN_WHY → DEEPEN → OFFER_NEXT → CLARIFY (SATURATED). Goal sequence ANSWER → DEEPEN → CONNECT remains certified.

## CONV:2

Live: `LEARN_CAPABILITY`, covered `WHY_RELEVANT`, resolved moves track CONV:1. Goal thread final `SUMMARIZE`. WHY_PRESENT remains distinct (`Why is it on Stage?`).

## Content authority

`composeRelevanceCopy` (certified product capabilities). Object education: educational role, not business priority. MO:2/EI for supported business significance. No new knowledge DB.

## Suggested actions

Absent because explain/status never set continuity `subject: CAPABILITY`. Repair: relevance records that subject and uses `suggestedActionsForContinuity`. Live: Show me / Skip; later What should we start with?

## Show handoff

Chip `Show me` → existing Continue → Stage education copy (“This is your Stage…”). Experience `GUIDED_ENTRANCE`. No DOM control. Post-show Explain that / Why? / What next? stay on Focus/Stage continuity.

## WHY matrix

| Family | Result |
| --- | --- |
| Relevance | `WHY_RELEVANT` / product relevance copy |
| Status | `NEXORA is stable.` still available |
| Presentation | `WHY_PRESENT` |
| Causal | `CAUSE`; live existing-workspace not product-relevance copy |
| Priority / investigate-first | not `WHY_RELEVANT`; Advisor/EI |
| Recommendation | not `WHY_RELEVANT` |

## Cross-subject generalization

No `if NEXORA && whyImportant` router. NCA `GOAL_RELEVANCE` + CONV purpose. Domain copy adapters only in existing object-education composer.

## Safety

Decision/Execution writes 0 on Entrance proof (`goalState=none`, `decisionState=none`). Evidence ≠ cause preserved on existing Problem/causal. Relevance ≠ business priority. CC:10/10R and CC:11 unchanged. FIX3 background click remained `GUIDED_ENTRANCE`. UNKNOWN not invented.

## Files created

- `frontend/app/lib/nexora-conversation/nexoraConversationEntranceRelevance.test.ts`
- `frontend/scripts/nex-conv2-fix1-entrance-intent-routing-certify.mjs`
- `frontend/artifacts/nex-conv/NEX-CONV-2-FIX1/ARCHITECTURE-INSPECTION.md`
- `frontend/artifacts/nex-conv/NEX-CONV-2-FIX1/CERTIFICATION.md`
- `frontend/.certification/nex-conv2-fix1-entrance-intent-routing/*`

## Files modified (this fix)

- `frontend/app/lib/manager-object/nexoraNca1ConversationArchitecture.ts`
- `frontend/app/lib/manager-object/nexoraNca1ConversationArchitecture.test.ts`
- `frontend/app/lib/manager-object/canonicalManagerMeaningInterpreter.ts`
- `frontend/app/lib/manager-object/index.ts`
- `frontend/app/lib/manager-object/managerObjectExplainEngine.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationPolicy.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationalMove.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationThread.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationKernel.test.ts`
- `frontend/app/lib/nexora-entrance/nexoraGuidedEntranceExperience.ts`
- `frontend/app/lib/nexora-entrance/nexoraEntranceConversationContinuity.ts`
- `frontend/app/lib/nexora-entrance/nexoraObjectEducationExperience.ts`

## Tests

| Suite | Count |
| --- | --- |
| NEX-CONV:2-FIX1 focused | 11 pass |
| NEX-CONV + NEX-ENT `*.test.ts` | 369 pass |
| NCA:1–3, NCA-POST:1–3, NXA:1–2, interpreter, explain | 138 pass |
| DIR:GA/VI + semantic director, EI, Decision, Execution follow-up, DATA-ADV, CONV:2 unit | 395 pass |
| DTH + BCA + DATA-UX + FIX3 (batch) | 360 pass |
| MO interaction/composer + MVP object interaction | 44 pass |
| NCA:4 | 23 pass, **1 classified fail (test M)** |

CONV:1 Goal progression and CONV:2 thread progression included in the CONV/ENT 369.

## TypeScript

`tsc --noEmit` — pass.

## ESLint

Changed FIX1 files — 0 errors (1 pre-existing unused `_runtimeState` warning in skip helper).

## Production build

`NODE_OPTIONS=--max-old-space-size=8192 npm run build` — pass.

## Live port

**3014** (stopped after proof).

## Runtime errors

**0** (live).

## Unauthorized business writes

**0** (live `goalState` / `decisionState` none).

## Duplicate authority audit

No CONV:3, no EntranceConversationV2, no second suggested-action engine, no second NLU, no second object registry, no extra LLM hop, no transcript DB.

STOP. Do not start NEX-CONV:3, NEX-ENT:11, memory, RAG, or E2E.
