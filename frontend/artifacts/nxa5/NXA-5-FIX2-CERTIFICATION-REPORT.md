# NXA:5-FIX2 — Refresh Collection Presentation Parity & Advisor→Stage Handoff

## Certification result

**NXA:5-FIX2 = CERTIFIED**

**NXA:5 = CERTIFIED** remains valid. NXA:6 was not started.

The observed live failure — Advisor and Queue both knowing a multi-member collection while Stage remaining on a restored/current focused object after `show problems` — is closed by making Advisor collection presentation use the same canonical Stage presenter as Queue, and by giving a newer explicit collection command precedence over restored or current-subject focus.

---

## 1. Exact defect reproduction

On clean `/executive`:

1. Focus Margin Pressure (`mode = object-focus`, `focused = ctx-problem-margin`).
2. Reload. Hard reload does **not** persist Stage focus (`refreshRestoresFocus: false`; Stage returns to Overview). The screenshot defect is therefore equivalent to **current/restored focus + `show problems`**, which the live script re-establishes by focusing Margin Pressure after reload when focus is empty.
3. Manager: `show problems`.

**Before the fix (proven by CC:4 mapping):** Advisor replied `Current Problems: Capacity Gap, Margin Pressure.`, Queue showed `Problems · 2`, Stage remained on Margin Pressure only (`select-interaction-subject` on the inherited primary).

**After the fix (live artifact):** Advisor reply `Current Problems: Capacity Gap, Margin Pressure.`; Queue `Problems · 2`; Stage `collection / problem / 2` rendered members `ctx-problem-capacity`, `ctx-problem-margin`; header `Problems · 2`; focused `none`.

Artifact: `.certification/nxa-5-fix2-refresh-collection-parity/runtime-refresh-parity.json` and `advisor-show-problems.png`.

## 2. Control-path reproduction

Same initial focus. Queue click `Problems`. Stage: both Problems, `focused = none`, header `Problems · 2`. Screenshot: `queue-problems.png`. Semantic Stage snapshot matches Advisor.

## 3. Root cause

First divergence is **CC:4 `mapRevealCollection`** in `conversationalRuntimeActionAdapter.ts`.

Queue click → `openNexoraMVPExecutiveQueueCollection` → `presentNexoraMVPExecutiveQueueCollection` (clears focus, writes `collectionContext` with all member IDs).

Advisor `reveal-*` **with a primary target** (inherited from conversational/restored subject, e.g. Margin Pressure) mapped to **`select-interaction-subject`**. POST:3 still returned the full canonical collection, so Advisor copy and Queue counts were correct while Stage stayed in single-object focus.

That is a **presentation handoff / precedence** failure, not a membership bug and not a visual/geometry bug. The missing member was **absent from Stage collection state** (mode remained `object-focus`, `collectionContext` empty), not rendered-but-invisible.

## 4. Relationship to NXA:5-FIX1

**Older latent defect exposed by FIX1**, with evidence:

- The reveal-with-anchor branch predates FIX2 and is not FIX1 collection-judgment code.
- FIX1 made collection follow-up and Advisor collection answers authoritative, so the manager could see “2 Problems” while Stage still executed the older focus-with-anchor path.
- FIX1 read-only Stage awareness did not write Stage; it did not create this split.
- Collection membership (POST:3 / Queue counts) was already correct.

FIX1 was not reverted.

## 5. Architecture inspected

CC:3 command mapping, CC:4 runtime adapter, MVP conversational runtime bridge, DIR:1 `directNexoraPresentation` / `applyDirectorPlanToStage`, `presentNexoraMVPExecutiveQueueCollection` vs `openNexoraMVPExecutiveQueueCollection` (toggle), NCA-POST:3 canonical collection, NXA:1 need, NXA:4 proactive, NXA:5/FIX1 comparison, Stage trail, refresh/session restoration.

## 6. Files created

- `app/lib/director/nexoraSemanticPresentationDirector.ts` (DIR:1 presenter reused by FIX2)
- `app/lib/director/nexoraSemanticPresentationDirector.test.ts`
- `app/lib/manager-object/nexoraNxa5Fix2CollectionPresentationParity.test.ts`
- `scripts/nxa-5-fix2-refresh-collection-parity-certify.mjs`
- `artifacts/nxa5/NXA-5-FIX2-CERTIFICATION-REPORT.md`
- `.certification/nxa-5-fix2-refresh-collection-parity/*`

## 7. Files modified (FIX2 production + proof)

- `app/lib/conversational-control/conversationalRuntimeActionAdapter.ts`
- `app/lib/nex-mvp/nexoraMVPConversationalRuntimeBridge.ts`
- `app/lib/conversational-control/conversationalExperienceOrchestrator.ts` (explicit `show|open|list|see` collection presentation; DIR consumes **pre-turn** Stage; informational `what|which` + `reveal-*` keeps pre-turn Stage)
- `app/lib/conversational-control/conversationalRuntimeBridge.test.ts`
- Incidental typecheck-only fixtures: `nexoraNxa4ProactiveAdvisory.test.ts`, `nexoraNxa5ExecutiveJudgment.test.ts` (no production behavior change)

Mapper still nulls inherited primary only for unfiltered `show-problems` so deictic `Show decisions for this` can keep a primary; **Stage no longer focuses that primary for `reveal-*`**.

---

## 8–10. Paths and first divergence

**Advisor:** utterance → NCA/NXA meaning → `COLLECTION_QUERY` + members → CC `reveal-*` → CC:4 `open-queue-collection` with `primaryTargetId: null` → bridge `presentNexoraMVPExecutiveQueueCollection` → DIR `SHOW_COLLECTION` from **pre-turn** Stage (focus is never `alreadySatisfied`) → Stage collection + rendered members.

**Queue:** row click → `openNexoraMVPExecutiveQueueCollection` → same `presentNexoraMVPExecutiveQueueCollection`.

**First divergence (before fix):** CC:4 `mapRevealCollection` when `primaryTargetId` was set. After fix both paths emit the same presenter and the same member IDs.

## 11. Refresh restoration

Hard reload restores Overview, not Stage focus. Conversational/executive subject can still be current after re-focus or bfcache. Restoration must not outrank a later explicit collection command. Live: after re-focus + `show problems`, collection wins; journey `SCENARIO` / `AWAITING_DECISION` remains on the Advisor path.

## 12. Hydration / timing

No production `setTimeout`/`sleep` workaround. Live rapid sequence ends on Problems. Collection did not flash then revert to Margin Pressure. `open-queue-collection` does **not** use Queue toggle-close, so a conversation `show problems` while already on Problems will not accidentally close.

## 13. Last-writer

Writers: `selectNexoraMVPInteractionSubject` (focus), `presentNexoraMVPExecutiveQueueCollection` (collection), DIR `applyDirectorPlanToStage`, trail back/forward.

For explicit collection turns, DIR applies `SHOW_COLLECTION` against **pre-turn** Stage so a CC focus write cannot veto the collection. Last valid writer is the collection presenter.

## 14. Source-of-truth map

| Concern | Authority |
|---|---|
| Problem (and other) membership | existing Queue/catalog collection entries |
| Conversational intent | NCA/NXA |
| Active collection (conversation) | NCA lastCollection / POST:3 |
| Presentation decision | DIR:1 |
| Stage state | MVP object interaction |
| Stage description | FIX1 read-only snapshot |
| Executive context | NXA:3 |
| Judgment | NXA:5 |
| Decision / Execution | CC |

No second collection store and no Advisor-specific renderer.

## 15. Semantic precedence

A valid current-turn collection presentation command (`show|open|list|see` + `COLLECTION_QUERY`) supersedes stale/restored single-object presentation. Navigation history is preserved on the trail; Stage **mode** follows the newest explicit request.

## 16–17. Focus vs collection; current subject

Focus and collection are different Stage modes. `presentNexoraMVPExecutiveQueueCollection` clears `focusedSubject` and writes all member IDs. DIR `alreadySatisfied` requires `stageMode === COLLECTION` and matching category/IDs — restored focus cannot count as the collection. Current subject is not used to filter an explicit unfiltered collection.

## 18. Stage-awareness read-only

FIX1 snapshot remains a read model. Collection presentation uses **pre-turn** Stage as DIR input, not a stale post-command snapshot that would reassert focus. Comparison/judgment uses pre-turn Stage and does not call collection mutation.

## 19–20. DIR:1 reuse and canonical handoff

DIR `SHOW_COLLECTION` only when `owner === COLLECTION_QUERY` and `presentationRequest === COLLECTION`. Application is `presentNexoraMVPExecutiveQueueCollection` with DIR member IDs. Conversation `open-queue-collection` uses the same presenter (not Queue toggle). No Advisor/Queue/refresh-specific renderer.

## 21–25. Collection parity

Live rendered members (Advisor = Queue):

- Problems: Capacity Gap, Margin Pressure (2)
- Scenarios: Capacity Expansion Plan, Demand Surge, Pricing Response (3)
- Decisions: Expand Capacity, Approve Repricing (2)
- Executions: Capacity Expansion + Pricing Rollout executions (2)

Risks: Advisor can present a one-member Risk collection; Queue has no parallel Risks row in this MVP — tests do not invent Queue members. Goals remain unsupported as a Queue collection (existing CC:4 boundary).

## 26–28. Transitions, rapid, post-refresh

Live: `show problems` → collection; `show Margin Pressure` → focus; `show problems` → collection again. Rapid `problems → decisions → scenarios → problems` ends on Problems. Post-refresh + re-focus + `show problems` presents both Problems.

## 29–32. Stage state, render, readback, chrome

Stage attributes, planar bodies, visible controls, and `data-stage-collection-snapshots` all list both Problems. Readback: `The Stage is showing the Problems: Capacity Gap and Margin Pressure.` with no Stage mutation. Header `Problems · 2`. Breadcrumb keeps journey trail (`Overview/…/Problems`) without implying exclusive Margin Pressure focus (`focused = none`).

## 33–40. Cross-surface, FIX1, knowledge, override, journey, Back/Forward

Advisor membership, Queue count, Stage snapshot, rendered IDs, and readback agree. After collection, `which one is more important?` / `why?` stay on Problems, no Scenario fallback, no Stage move. `What is Capacity Gap?` while focused on Margin Pressure does not focus Capacity Gap or open a collection. Manager override: singular `show Margin Pressure` focuses; following `show problems` presents the collection. Journey phase/state remain populated on the Advisor defect path. Back from Capacity Gap returns to Problems collection; Forward restores Capacity Gap focus.

## 41–42. No hard-coded production patch; no duplicate authority

Production adapter/director/bridge have no Capacity Gap / Margin Pressure branches, no `if refreshed`, no Problems-only Stage force, no second registry. Fixture IDs appear only in tests and certification scripts.

---

## 43–49. Regression and omnibus

- FIX2 unit + DIR semantic + restored-anchor runtime bridge: green (included in 1,285).
- NXA:1–5 / FIX1 / NCA:1–7 / POST:1–4 / MO / MO-INT / entrance / EI: included in executive-domain omnibus **1,285/1,285**, 0 failed, 0 skipped.
- DIR inventory (`node --experimental-strip-types`): **58/58**.
- Combined broader baseline: **1,343/1,343** (previous FIX1 reported **1,332/1,332**; +11 tests from FIX2/DIR semantic coverage).
- CC Decision/Execution confirmation authorities unchanged; NXA does not commit or start.
- Live `/executive`: **16/16 proofs** in `runtime-refresh-parity.json`, `errors: []`.

## 50–53. Live, TypeScript, build, lint, whitespace

- Live: `NXA:5-FIX2 refresh collection parity: ok`, zero page errors.
- TypeScript: `tsc --noEmit` **TSC:0**.
- Production build: compiled; TypeScript; static generation **13/13**; `BUILD:0`.
- ESLint on FIX2-touched production/test files: 0 errors / 0 warnings.
- `git diff --check` on tracked FIX2 files: clean.

## 54. Diff audit

Inspected for prompt-string patches, Problems-only Stage branches, hard-coded object names in production, refresh-clearing hacks, arbitrary timers, duplicate Stage/collection stores, Advisor/Queue-specific renderers, disabled restoration, destroyed journey, `.skip`, deleted regressions, debug bypasses.

Findings: none of the forbidden patterns in production. Remaining notes:

- Mapper still special-cases unfiltered `show-problems` primary-null (deictic other collections keep a primary; CC:4 no longer focuses it).
- NXA:4/5 **test** fixtures were aligned to current Attention/signal types so typecheck could pass; production NXA:4/5 logic was not changed for FIX2.

## 55. Remaining defects

None known for NXA:5-FIX2. Hard reload still does not persist Stage focus (pre-existing persistence contract). Conversational collection is session-scoped unless existing persistence restores it; **`refresh` then `show problems` always establishes a fresh Problems presentation.**

## 56. Final verdict

NXA:5-FIX2 = CERTIFIED
