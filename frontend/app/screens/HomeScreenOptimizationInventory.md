# HomeScreen Optimization Inventory

## Purpose

This document maps **orchestration ownership** inside `HomeScreen.tsx` to the **O1 extraction boundary comments** introduced in O1:1. It is a **planning and regression reference only**: nothing here is imported at runtime, and edits to this file must not change product behavior.

Use it so future O1 prompts can say, for example: *“Work only inside the O1 Extraction Boundary: Type-C orchestration”* and still know which state, refs, callbacks, effects, and `app/lib` modules are in scope—without loading the entire 19k-line component into context.

---

## Golden Rules

- **One extraction zone per prompt** — never mix Type-C moves with panel moves in the same change set unless explicitly coordinated.
- **Zero behavior change** unless the prompt explicitly requests a behavior change; default is mechanical move + identical call order.
- **Preserve contracts** — scene apply (`sceneApplyContract` / `homeScreenSceneApply`), panel routing (`rightPanelRouter`, `panelController`, `RightPanelHost`), and chat lifecycle (`chatRequestLifecycle`, `homeScreenChatApplyPrep`) remain authoritative; HomeScreen stays the wiring shell until a hook is proven.
- **No render-time debug emissions** — dev logs stay behind `NODE_ENV` / dedupe guards; no `console` in render paths.
- **No direct `sceneJson` mutation** — all scene updates go through `setSceneJson` / `applySceneChangeSafe` and contract evaluators.
- **Dev logs must be deduped** — respect existing signature refs and O1:1 baseline ref guards when adding diagnostics.
- **HomeScreen remains the shell** until each proposed controller hook (`useTypeCOrchestration`, etc.) is stable behind a clear input/output contract.

---

## O2 — Scene Apply Controller Extraction

### Purpose

- **Isolate scene writes** behind one controller hook so `setSceneJson` traffic is auditable and testable.
- **Prevent duplicate scene mutations** by centralizing dedupe, upstream semantic signatures, and `traceSceneWrite` gating.
- **Reduce `HomeScreen.tsx` complexity** and **Cursor/AI context usage** by shrinking the surface area agents must load for scene-only work.
- **Protect anti-loop / anti-drift guards** (workspace empty clear block, panel-only no-op skip, reset-candidate tracing, hydration bypass rules).

Detailed callback/ref lists for this zone remain under **Current Extraction Boundaries → §2 Scene Apply Controller** below.

**O2:2** created Scene Apply Controller type contracts in `app/screens/hooks/scene/useSceneApplyController.types.ts` (`SCENE_APPLY_CONTROLLER_EXTRACTION_PLAN`, `ApplySceneChangeSafe`, related readonly contracts). **No scene logic moved yet.** HomeScreen still owns `sceneJson` and `applySceneChangeSafe` (implementation unchanged; typed against `ApplySceneChangeSafe` for compile-time contract alignment). Dev-only once-per-mount log: `[Nexora][SceneApply][TypesReady]`.

**O2:3** created `app/screens/hooks/scene/useSceneApplyController.ts` hook skeleton (stable contract + `[Nexora][SceneApply][HookSkeletonReady]`).

**O2:4** moved **`applySceneChangeSafe`** implementation into `useSceneApplyController` (HomeScreen still owns `sceneJson` / `setSceneJson` and passes `setSceneJson`, shared reset-trace ref, semantic/render refs, and shadowed `console.debug` for identical upstream-dedupe logging). Downstream still uses the **`applySceneChangeSafe`** name from `sceneApplyController.callbacks`.

**O2:5** moved **scene-apply safety refs** into `useSceneApplyController`: hook-owned **`lastSceneApplySigRef`** (full JSON dedupe inside `applySceneChangeSafe`), hook-owned **`lastSceneWriteSourceRef` / `lastSceneWriteAtRef`** (updated only when a write actually commits). **`lastSceneResetTraceSigRef`** stays in **HomeScreen** and is passed in (**shared**) so reset-trace dedupe matches parity / empty-state paths. **`lastSceneSemanticSignatureRef` / `lastSceneRenderSignatureRef`** remain **HomeScreen** `useRef`s passed via `refs` (**shared**) because unified reaction / visual parity logic outside `applySceneChangeSafe` reads and updates them. HomeScreen still owns **`sceneJson`** state, **`lastUpstreamSceneApplySigBySourceRef`**, **`sceneIntentQueueRef`**, parity trace refs, and all chat / Type-C / ingestion / right-panel orchestration. Dev-only once-per-load log: `[Nexora][SceneApply][SafetyRefsOwned]` (`extractionPhase: "O2:5"`).

**O2:6** centralized **scene update bridge wiring** in `useSceneApplyController`. **Bridge refs connected:** `applyTypeCSceneUpdateRef` → Type-C orchestration (`useTypeCOrchestration` still receives the same ref; hook assigns `applySceneChangeSafe` in a `useEffect` with safe cleanup). **No separate bridge refs** exist today for ingestion, chat, panel, demo, or manual zones — they call `applySceneChangeSafe` / `applySceneChangeUpstreamDedup` from HomeScreen closures unchanged. Dev-only once-per-bridge-name log: `[Nexora][SceneApply][BridgeConnected]` (`extractionPhase: "O2:6"`). HomeScreen still owns **`sceneJson`** state and all Type-C, ingestion, chat, and panel **business** logic; `useSceneApplyController` is the scene-write **gateway** for the shared apply function and Type-C ref wiring.

**O2:7** centralized **scene-write dev diagnostics** in `useSceneApplyController` via **`emitSceneApplyDiagnostic`** (`SceneApplyDiagnosticEventName` / `SceneApplyDiagnosticEvent` contracts). In-hook logs include: workspace empty clear (**`[Nexora][WorkspaceSceneClearBlocked]`** via `destructive_reset_blocked`), panel-only no-op (**`[Nexora][SceneApplyBlocked][PanelOnlyChange]`**), semantic/visual match skip (**`[Nexora][UpstreamDedup][Skipped]`** through `sceneApplyConsoleDebug`), duplicate JSON dedupe (**`[Nexora][SceneApply][duplicate_scene_write_skipped]`** with per-streak dedupe), **`[SceneApply]`** commit bucket, **`[Nexora][SceneHydration][Allowed]`**, **`[Nexora][SceneParity][SceneResetCandidate]`** (unchanged label), **`traceSceneWrite`** + **`__NEXORA_DEBUG__.chatPipeline.sceneWrite`**, and **`[Nexora][SceneApply][BridgeConnected]`**. HomeScreen still emits **O2:1 / O2:2** baseline logs, **panel**-typed **`[Nexora][UpstreamDedup][Skipped]`**, **`[Nexora][SceneParity][VISIBLE]` / `[HomeScreen]`**, **`[Nexora][HomeScreen][UnsafeSceneBlocked]`**, **`[Nexora][HomeScreen][SceneStateTransition]`**, chat pipeline **`[Nexora][ChatPipeline][SceneIdempotentSkip]`**, and other **non-scene-apply-controller** diagnostics. Scene diagnostics are **dev-only**, wrapped in **try/catch**, do **not** update React state, and **`emitSceneApplyDiagnostic`** is exposed on **`sceneApplyController.callbacks`** for upstream / unified-reaction skips that still live in HomeScreen.

**O2:8** cleaned **HomeScreen** after scene-apply extraction: dropped **unused** `SceneWriteSource` import; dropped **`SCENE_APPLY_CONTROLLER_EXTRACTION_PLAN`** import (O2:2 **TypesReady** log now reads **`sceneApplyController.extractionPlan`**); removed the no-op **`useEffect`** that only referenced `extractionPlan.zone`. **No scene-only refs removed** — `lastSceneResetTraceSigRef`, `lastSceneSemanticApplyRef`, `lastSceneVisualApplySignatureRef`, `lastUpstreamSceneApplySigBySourceRef`, parity/canvas/chat effect refs remain **shared** with parity, upstream dedupe, unified reaction, Type-C, chat, and ingestion paths. **`buildSceneSemanticSignature`**, **`traceSceneWrite`**, **`applySceneFromChat`**, and **`homeScreenSceneApply`** imports stay (still used). HomeScreen still owns **`sceneJson`** / **`setSceneJson`**; **`useSceneApplyController`** owns **`applySceneChangeSafe`** orchestration.

**O2:9** completed a **final regression pass** on the Scene Apply Controller boundary (read-only verification + docs): single **`applySceneChangeSafe`** implementation in **`useSceneApplyController`**; HomeScreen only destructures from **`sceneApplyController.callbacks`**; Type-C **`applyTypeCSceneUpdateRef`** wired in a hook **`useEffect`** (no render-time bridge assignment); scene-apply dev logs run inside **`setSceneJson`** updater, **`useEffect`**, or **`emitSceneApplyDiagnostic`** (dev-only / deduped); workspace empty clear, JSON dedupe, **`bypassDedupe`**, **`traceSceneWrite`**, and write source/time refs unchanged in intent. **O2 is complete.** Next planned extraction phase: **O3 — Right Panel Controller**.

**O2:10** tightened **AI/Cursor context guidance**: file header + public contract on **`useSceneApplyController`**, a single **O2 Extraction Boundary** line at the HomeScreen hook call site (redundant inline O2 prose removed), and **AI Usage Notes After O2** in this inventory. **O3:1** (see **## O3 — Right Panel Controller Extraction**) replaced the brief right-panel stub with the full inventory + extraction order and added a **dev-only** **`[Nexora][RightPanel][O3Baseline]`** mount log plus O3 boundary lines in `HomeScreen.tsx`; **no panel orchestration moved** yet.

### Scene ownership inventory (baseline)

| Item | Owner today | Future owner | Risk | Move in O2? | Notes |
|------|-------------|--------------|------|----------------|-------|
| `sceneJson` / `setSceneJson` | HomeScreen | HomeScreen keeps React state; hook receives setter or wrapped apply | **High** | **Partial** | Canonical scene root; hook owns *orchestration* around writes, not necessarily the `useState` declaration (O2:4+). |
| `applySceneChangeSafe` | HomeScreen `useCallback` | `useSceneApplyController` | **High** | **Yes** | Single writer choke-point; `traceSceneWrite`, dedupe, reset guards. |
| `applySceneChangeUpstreamDedup` | HomeScreen | Hook | **High** | **Yes** | Per-source semantic dedupe before `applySceneChangeSafe`. |
| `buildSceneSemanticSigForUpstreamDedupe` | HomeScreen | Hook | **Medium** | **Yes** | Feeds upstream dedupe map. |
| `lastSceneApplySigRef`, `lastSceneWriteSourceRef`, `lastSceneWriteAtRef` | `useSceneApplyController` | Hook | **High** | **Yes (O2:5)** | JSON dedupe + last-committed write provenance inside `applySceneChangeSafe`. |
| `lastUpstreamSceneApplySigBySourceRef` | HomeScreen | Hook (later) | **High** | **Partial** | Per-source upstream semantic dedupe before `applySceneChangeSafe` (not O2:5). |
| `lastSceneResetTraceSigRef` | HomeScreen (shared into hook) | HomeScreen + hook | **High** | **Partial (O2:5)** | Deduped reset-candidate warnings; **same ref** passed into hook for parity / empty-state paths. |
| `sceneIntentQueueRef`, `sceneIntentEpoch` | HomeScreen | Hook (or shared intent module) | **High** | **Yes** | Intent queue driving unified reactions / ordering. |
| `lastSceneSemanticApplyRef`, `lastSceneVisualApplySignatureRef`, parity trace refs | HomeScreen | Hook | **High** | **Yes** | Unified reaction / visual parity paths. |
| `applyTypeCSceneUpdateRef` → `applySceneChangeSafe` | HomeScreen owns ref; **`useSceneApplyController`** wires `current` | Hook effect (O2:6) | **Medium** | **Yes (O2:6)** | Type-C reads `applyTypeCSceneUpdateRef.current` in callbacks; assignment moved out of HomeScreen render. |
| Chat → scene (`applySceneFromChat`, `applySceneChange*` in `sendText` / intents) | HomeScreen | HomeScreen calls hook API | **High** | **Partial** | Chat stays owner of pipeline; uses `applySceneChangeSafe` from `sceneApplyController.callbacks` (no dedicated bridge ref yet). |
| Ingestion → scene | HomeScreen / ingestion effects | Call hook apply | **High** | **Partial** | Uses `applySceneChangeSafe` directly from shell scope (no dedicated bridge ref yet). |
| Panel / UI → scene (domain catalog, execution apply, manual) | HomeScreen call sites | Call hook apply | **High** | **Partial** | Many writers; narrow public `apply` surface. |
| `homeScreenSceneApply.ts` evaluators | Module (imported) | Stays in module; **hook imports** | **Medium** | **N/A** | Pure/policy helpers (`evaluateWorkspaceHydrateScene`, …). |
| `sceneApplyContract` / `sceneSemanticSignature` / `unifiedReaction` | `app/lib/scene/*` | Unchanged lib | **Low** | **No** | Contracts stay authoritative. |
| `sceneWriteTrace` (`traceSceneWrite`) | `app/lib/debug` | Hook continues to call | **Low** | **No** | Diagnostics only. |
| `selectedObjectIdState`, `focusedId`, `objectSelection` | HomeScreen (selection / analyze UX) | Remain **shell** unless selection controller extracts separately | **Medium** | **No** | Scene-*writing* related only via selection metadata / traces; not moving with O2 core unless a prompt explicitly merges zones. |
| `useSelectedId()` (SceneContext) | Context | Stays | **Low** | **No** | Consumed for UX; not the canonical `sceneJson` writer. |
| Replay / snapshot / history / backup restore scene paths | HomeScreen + `homeScreenSceneApply` | Invoke through hook apply | **High** | **Partial** | Same dedupe + contract stack must run after move. |

### Target hook: `useSceneApplyController`

Planned responsibilities (no UI, no panel state, no chat transcript state, no Type-C business rules):

- **Owns the `sceneJson` setter boundary** — all mutations funnel through one stable `applySceneChangeSafe` (or renamed equivalent) exported from the hook.
- **Exposes `applySceneChangeSafe`** (and likely `applySceneChangeUpstreamDedup`) for chat, Type-C ref bridge, ingestion, panels, and workspace flows.
- **Manages dedupe + write provenance refs** — O2:5 moved JSON dedupe + last-write refs into the hook; upstream per-source map + semantic/visual **shared** refs remain in HomeScreen until later O2 steps.
- **Guards destructive resets** — workspace empty clear block, reset-candidate logging, hydration bypass policy unchanged.
- **Exposes scene write diagnostics** — O2:7: `emitSceneApplyDiagnostic` + `SceneApplyDiagnosticEvent*`; `traceSceneWrite` and dev `__NEXORA_DEBUG__` merge stay in the hook beside `applySceneChangeSafe`.
- **Accepts external intents** via narrow parameters / callbacks from chat, Type-C (`applyTypeCSceneUpdateRef` wiring), ingestion, and panel triggers — callers stay in HomeScreen until later prompts.
- **Does not render UI**; **does not own** right panel, chat, Type-C orchestration, or ingestion business logic.

### O2 bug tracking checklist

After each O2 extraction PR, verify:

- [ ] No **scene reset** immediately after app load / workspace hydrate.
- [ ] No **destructive clear** of a hydrated scene from an empty workspace payload.
- [ ] No **duplicate `applySceneChangeSafe`** application for the same canonical payload (dedupe + upstream semantic dedupe still effective).
- [ ] No **repeated** scene write / reset **logs** in dev (signature ref dedupe preserved).
- [ ] No **panel flash** caused solely by a redundant scene write (panel-only no-op path still blocks).
- [ ] **Selected object** / highlight behavior stable across scene updates.
- [ ] **Type-C core object** still present when `type_c` mode applies bootstrap paths.
- [ ] **Ingestion** path still updates scene when enabled.
- [ ] **Chat** path still updates scene (`chat`, `unified_reaction`, intent sources).
- [ ] **Type-C** connection / scenario apply via `applyTypeCSceneUpdateRef` still works.
- [ ] **Replay / snapshot / restore** scene writes still work if present in the build under test.

### O2 AI usage optimization

See **[AI Usage Notes After O2](#ai-usage-notes-after-o2)** below for the canonical Cursor/AI loading pattern post-O2.

### O2 extraction order (recommended)

1. **O2:1** — Scene apply inventory + baseline (this document + dev `[Nexora][SceneApply][O2Baseline]` log).
2. **O2:2** — Create scene apply controller **types** (`useSceneApplyController.types.ts`; **complete** — contracts + `[Nexora][SceneApply][TypesReady]` log).
3. **O2:3** — Create `useSceneApplyController` **hook skeleton** (`useSceneApplyController.ts`; **complete** — stable contract + `[Nexora][SceneApply][HookSkeletonReady]`).
4. **O2:4** — Move **`applySceneChangeSafe`** into the hook (**complete** — HomeScreen destructures `applySceneChangeSafe` from `sceneApplyController.callbacks`; state/refs ownership unchanged).
5. **O2:5** — Move **scene apply dedupe + write provenance refs** into the hook (**complete** — hook owns `lastSceneApplySigRef`, `lastSceneWriteSourceRef`, `lastSceneWriteAtRef`; HomeScreen passes shared reset + semantic/render refs).
6. **O2:6** — Wire **Type-C scene bridge** (+ future bridge refs) via `bridgeRefs` on `useSceneApplyController` (**complete** — `applyTypeCSceneUpdateRef` assigned in hook `useEffect`; ingestion/chat/panel still use destructured `applySceneChangeSafe` without dedicated refs).
7. **O2:7** — **Scene write trace + dev diagnostics** in `useSceneApplyController` (**complete** — `emitSceneApplyDiagnostic`, `SceneApplyDiagnosticEventName` / `SceneApplyDiagnosticEvent`; HomeScreen upstream + unified semantic skips call the callback; O2 baseline logs remain in HomeScreen).
8. **O2:8** — **HomeScreen scene import / wiring cleanup** (**complete** — unused `SceneWriteSource` + redundant `SCENE_APPLY_CONTROLLER_EXTRACTION_PLAN` import removed; TypesReady log uses `sceneApplyController.extractionPlan`; no-op zone `useEffect` removed; O2:8 anchor comment at hook call site).
9. **O2:9** — Final scene controller **regression check** (**complete** — ownership + single `applySceneChangeSafe` + bridge/effect/diagnostic placement verified; O2 anchor comment finalized in `HomeScreen.tsx`; **O2 complete**; next: **O3 Right Panel**).
10. **O2:10** — **AI-usage / context reduction** (**complete** — hook file header + public contract; HomeScreen O2 boundary comment trimmed; inventory **AI Usage Notes After O2**; **O3:1** inventory + baseline lives under **## O3** below).

---

## AI Usage Notes After O2

Future prompts should inspect:

- `frontend/app/screens/hooks/scene/useSceneApplyController.ts`
- `frontend/app/screens/hooks/scene/useSceneApplyController.types.ts`
- The **`useSceneApplyController({…})` call site** in `HomeScreen.tsx` (grep **`O2 Extraction Boundary: Scene apply`**)

**Do not** load all of `HomeScreen.tsx` unless:

- bridge wiring breaks,
- `sceneJson` / `setSceneJson` ownership or pass-through changes, or
- a downstream consumer (chat, Type-C, ingestion, panel) needs cross-zone verification.

Supporting modules when changing contracts or canon rules: `homeScreenSceneApply.ts`, `sceneApplyContract.ts`, and focused `app/lib/scene/*` / `sceneWriteTrace` helpers — still avoid loading unrelated zones in the same prompt.

Right-panel–only work: see **[O3 — Right Panel Controller Extraction](#o3--right-panel-controller-extraction)** (especially [O3 AI usage optimization](#o3-ai-usage-optimization)) instead of loading Type-C, scene-apply, or chat pipeline internals unless a regression crosses boundaries.

Chat-pipeline–only work: see **[O4 — Chat Pipeline Controller Extraction](#o4--chat-pipeline-controller-extraction)** (especially [O4 AI usage optimization](#o4-ai-usage-optimization)) instead of loading full Type-C, scene-apply, or right-panel controller internals unless a bridge breaks.

---

## O3 — Right Panel Controller Extraction

### Purpose

- **Isolate panel orchestration** (open/close, authority, routing, dedupe, tracing) behind a dedicated controller hook so `HomeScreen.tsx` stays a thin wiring shell.
- **Prevent panel flash / spam** by keeping anti-flash guards, stable tab fallbacks, and request dedupe in one auditable place.
- **Centralize panel routing** — normalized views, legacy tab mapping, and `rightPanelRouter` / `panelController` contract usage should converge on one API surface.
- **Reduce HomeScreen complexity** and **Cursor/AI context usage** — agents working on panels should not need the full 19k-line file or unrelated zones.
- **Stabilize panel open/close lifecycle** — explicit source/reason metadata, authority windows, and commit paths stay consistent across chat, Type-C, scene, and manual triggers.

**O3 should not** re-own scene writes. Panels **consume** `sceneJson` (and selection) as read models; scene mutations must continue through **`applySceneChangeSafe`** (from `useSceneApplyController`) or future shell wrappers, not new panel-local writers. **O3 should not** modify `useSceneApplyController` internals unless a panel action explicitly requires a scene-write contract change; prefer calling the existing apply API from panel code paths after extraction.

### O3:1 — Right Panel inventory + baseline (**complete**)

- This **## O3** section (ownership map, target hook, checklist, AI note, extraction order).
- Dev-only, **once-per-mount** log: **`[Nexora][RightPanel][O3Baseline]`** in `HomeScreen.tsx` (StrictMode-safe ref guard; empty-deps `useEffect`; no state updates). Payload: `hasRightPanelState`, `activePanelId` (`rightPanelState.view ?? null`), `hasSelectedObject`, `typeCMode`, `productMode`.
- **`// O3 Extraction Boundary: Right Panel Controller`** (+ anti-flash note) adjacent to the existing right-panel O1 boundary in `HomeScreen.tsx`.
- **No panel logic moved**; routing and authority behavior unchanged.

**O3:2** created Right Panel Controller **type contracts** in `app/screens/hooks/right-panel/useRightPanelController.types.ts` (`RightPanelSource`, `RightPanelReason`, `OpenRightPanelOptions`, `RightPanelControllerState`, `RightPanelControllerRefs`, `RightPanelControllerCallbacks`, diagnostic types, `UseRightPanelControllerContract`, `RIGHT_PANEL_CONTROLLER_EXTRACTION_PLAN`). **No panel logic moved yet.** HomeScreen still owns Right Panel orchestration. Dev-only once-per-mount log: **`[Nexora][RightPanel][TypesReady]`** (`extractionOrder`, `protectedAreas`).

**O3:3** created **`useRightPanelController`** hook skeleton in `app/screens/hooks/right-panel/useRightPanelController.ts` (`UseRightPanelControllerInput` / `UseRightPanelControllerResult`, placeholder controller refs contract). Dev-only once-per-mount log inside hook: **`[Nexora][RightPanel][HookSkeletonReady]`**.

**O3:4** moved **`closeRightPanel`** (emit debug, `requestPanelAuthorityClose` via bridge, `clearClickIntentLock`, `logPanelClose`, trace calls, `lastRightPanelChangeSourceRef`) and **`openRightPanel`** (delegates through `panelAuthorityOpenBridgeRef` to `requestPanelAuthorityOpen`). HomeScreen still owns **`rightPanelState`** and defines **`requestPanelAuthorityOpen`** / **`requestPanelAuthorityClose`**.

**O3:5** moved **panel routing normalization** into `rightPanelAuthorityRoute.ts` (`normalizeRawAuthorityPanelView`, shared with `HomeScreen.requestPanelAuthorityOpen`) and **`useRightPanelController`**: authority-intent dedupe for `openRightPanel` (same `openIntentSig` shape as `requestPanelAuthorityOpen` + dev **`[Nexora][RightPanel][DedupeGuard]`**), plus **`lastPanelRequestSigRef`** ownership for `applyPanelControllerRequest`’s request-level dedupe (HomeScreen reads `rightPanelController.refs.lastPanelRequestSigRef`). **Bridge refs** (`panelAuthorityOpenBridgeRef` / `panelAuthorityCloseBridgeRef`) wire authority after callbacks exist. **Shared / intentionally left in HomeScreen:** `lastPanelAuthorityReasonRef`, `lastUpstreamPanelCommitSigRef`, `lastPanelAuthorityTraceSigRef` / `lastPanelCallerMigratedSigRef` / `lastPanelAuthorityAuditSigRef` / `lastPanelAuthorityResolvedSigRef`, `rightPanelRouteLockRef`, `panelAuthorityRapidIntentRef`, `clickIntentLockRef`, `lastExplicitPanelIntentRef`, `applyPanelControllerRequest` body (router decisions, analyze locks, upstream commit sig). **`RightPanelHost`** unchanged.

**O3:6** centralized **external right-panel bridge ref** wiring in `useRightPanelController.ts`: `UseRightPanelControllerInput.bridgeRefs` documents slots; **`useRightPanelControllerBridgeWiring`** (same module — must run **after** `openSimPanel` is defined for hook order) assigns **`typeCOpenSimPanelRef` → `openSimPanel`** in a `useEffect` with safe cleanup (no render-time ref writes on HomeScreen). Dev-only, once-per-mount-per-bridge **`[Nexora][RightPanel][BridgeConnected]`** (`extractionPhase: "O3:6"`). **Bridge refs connected:** `typeCOpenSimPanelRef` (HomeScreen’s `openTypeCSimPanelRef`). There are **no** separate `chatOpenPanelRef` / `sceneOpenPanelRef` today — chat and scene entry stay on existing authority / `applyPanelControllerRequest` paths. HomeScreen still owns **`rightPanelState`**; Type-C / chat / scene **business** logic remains external to the panel controller.

**O3:7** centralized **Right Panel dev diagnostics** in `useRightPanelController.ts`: exported **`emitRightPanelDiagnosticDev`** (dev-only, try/catch, optional per-`eventName` dedupe via `dedupeKey`) plus hook return **`diagnostics.emitRightPanelDiagnostic`** (merges `activePanelId`). Legacy console labels preserved where grep matters: **`[Nexora][RightPanel][DedupeGuard]`**, **`[Nexora][PanelRouteDecision]`**, **`[Nexora][ExecutiveObjectOverrideBlocked]`**, **`[Nexora][DashboardOverrideBlocked]`**, **`[Nexora][RightPanel][BridgeConnected]`**; other events use **`[Nexora][RightPanel][Diagnostic]`**. **Moved / routed from HomeScreen:** `requestPanelAuthorityOpen` route trace (merged `panel_open_committed`), authority trace / caller-migrated / audit (`panel_open_requested` + existing sig refs), executive object override in authority + `applyPanelControllerRequest` (`panel_flash_blocked`), upstream dedupe skips (`panel_open_requested` + detail), dashboard override **blocked** path (`dashboard_spam_blocked`), panel priority blocked (`panel_open_requested` + detail). **Removed:** dev-only `RIGHT PANEL STATE` effect, redundant `openRightPanel` touch `useEffect`, **`[Nexora][PanelCommit]`** debug on every authority commit. **Intentionally left in HomeScreen / helpers:** O3 baseline / TypesReady logs, `emitDebugEvent` `panel_requested` / `panel_resolved`, `logPanelOpen` / `logPanelClose` / `logPanelDecision` / `traceDirectPanelOpen`, **`[Nexora][DashboardOverrideCandidate]`** (stack trace), analyze / entry-flow / click-state / Type-C / scene logs, `RightPanelHost` unchanged.

**O3:8** cleaned **`HomeScreen.tsx`** right-panel wiring: removed unused **`RightPanelControllerRefs`** import and the empty **`rightPanelControllerRefs`** `useMemo` + **`refs:`** pass (hook owns dedupe refs internally). Consolidated **`RIGHT_PANEL_CONTROLLER_EXTRACTION_PLAN`** + type-only imports from **`useRightPanelController.types.ts`** into a single import. **Still imported / shared:** `normalizeRawAuthorityPanelView` (authority open), `RequestPanelAuthorityOpenFn`, `RightPanelBridgeRefs`, `emitRightPanelDiagnosticDev`, `panelAuthorityOpenBridgeRef` / `close` bridges, **`openTypeCSimPanelRef`** (`TypeCOpenSimPanelForTypeCRef`) for Type-C War Room. **Refs intentionally kept in HomeScreen:** authority audit sig refs, `activePanelAuthorityWindowRef`, `rightPanelRouteLockRef`, `clickIntentLockRef`, `lastExplicitPanelIntentRef`, `lastUpstreamPanelCommitSigRef`, restore/preview, scene/chat/Type-C harness — not superseded by the controller hook.

**O3:9** completed **final Right Panel Controller regression verification** (read-only / doc): ownership boundary confirmed — **`useRightPanelController`** owns **`openRightPanel` / `closeRightPanel`** (sole `useCallback` implementations), **`normalizeRawAuthorityPanelView`** usage inside `openRightPanel`, dedupe / anti-flash refs, **`useRightPanelControllerBridgeWiring`**, and **`emitRightPanelDiagnosticDev`**; **`HomeScreen`** owns **`rightPanelState`**, **`requestPanelAuthorityOpen` / `requestPanelAuthorityClose`**, **`applyPanelControllerRequest`**, authority bridges, and shared audit/window refs; **`RightPanelHost`** remains presentational (props + panel data only). **Note:** `closeRightPanel` in **`rightPanelRouter.ts`** is a **pure state helper** (different symbol from the shell callback). **O4:1** added chat pipeline inventory + **`[Nexora][ChatPipeline][O4Baseline]`** + O4 boundary comment; **O4:2** added **`useChatPipelineController.types.ts`** + **`[Nexora][ChatPipeline][TypesReady]`**; **O4:3** added **`useChatPipelineController.ts`** + **`[Nexora][ChatPipeline][HookSkeletonReady]`**; **O4:4** moved **`appendMessage` / `replaceMessages` / `clearChatError`** (+ dev **`[Nexora][ChatPipeline][MessageHelper]`**) into the hook while HomeScreen retains **`messages` / `sendText`** ownership; **`sendText` / backend / intent / bridge dispatch** remain in HomeScreen.

### Right Panel ownership inventory (baseline)

Representative names — grep `HomeScreen.tsx` for **O3 Extraction Boundary** and symbols below. There is **no** separate `activeRightPanel` symbol today; “active panel” is **`rightPanelState.view` + `rightPanelState.isOpen`**. Legacy audit types may reference **`openRightPanel`**; canonical open paths are **`requestPanelAuthorityOpen`**, **`applyPanelControllerRequest`**, and **`openSimPanel`** (Type-C War Room / sim), with **`closeRightPanel`** / **`requestPanelAuthorityClose`** for closes.

| Item | Current owner | Future owner | Risk | Move in O3? | Notes |
|------|---------------|--------------|------|-------------|-------|
| `rightPanelState` / `_setRightPanelState` / `setRightPanelState` | HomeScreen | `useRightPanelController` (or hook-owned state + shell pass-through) | **High** | **Yes (later steps)** | `setRightPanelState` wraps `_setRightPanelState` with same-view close guard + write tracing; extraction must preserve ordering. |
| `rightPanelWriteMetaRef` / `stageRightPanelWriteMeta` | HomeScreen | Hook | **Medium** | **Yes** | Stages writer/source/reason for `setRightPanelState` transitions. |
| Active panel (`rightPanelState.view`, `isOpen`, `contextId`) | HomeScreen | Hook exposes read-only snapshot | **High** | **Yes** | Drives `RightPanelHost` props and authority logic. |
| `requestPanelAuthorityOpen` / `requestPanelAuthorityClose` | HomeScreen `useCallback` | Hook | **High** | **Yes** | Authority rank, source priority, analyze/workspace locks, merge with `applyPanelControllerRequest`. |
| `closeRightPanel` | HomeScreen | Thin shell → hook `close` API | **High** | **Yes** | Sets explicit-close refs, calls authority close + traces. |
| `applyPanelControllerRequest` | HomeScreen | Hook | **High** | **Yes** | Bridge to `panelController` + `commitRightPanelStateFromAuthority`. |
| `commitRightPanelStateFromAuthority` | HomeScreen | Hook | **High** | **Yes** | Single commit path into `setRightPanelState` with staged meta. |
| Normalized routing (`rightPanelRouter`, `normalizePanelControllerRequest`, legacy tab mapping, `mappedRightPanelTab` / `rightPanelTab`) | HomeScreen + `app/lib/ui/right-panel/*` | Hook owns orchestration; **lib stays** | **High** | **Yes** | `lastStableRightPanelTabRef` stabilizes tab across transient nulls (anti-flash). |
| Dedupe refs (`lastPanelRequestSigRef`, `lastPanelFamilyAuditKeyRef`, authority trace / audit / resolved / migrated sig refs) | HomeScreen | Hook | **Medium** | **Yes** | Prevents repeated opens and log spam; must move with authority open. |
| Source tracking (`lastRightPanelChangeSourceRef`, write meta `source`, `PanelOverrideAudit` consumer labels) | HomeScreen | Hook | **Medium** | **Yes** | Used in traces and override audits. |
| Reason tracking (`normalizedRequest.reason`, `lastPanelAuthorityReasonRef`) | HomeScreen | Hook | **Medium** | **Yes** | Close/reopen and audit trails. |
| Intent refs (`lastExplicitPanelIntentRef`, `clickIntentLockRef`, `ExplicitPanelIntentState`) | HomeScreen | Hook (or shared intent module) | **High** | **Partial** | Tightly coupled to click vs chat vs command; may move incrementally with O3:6. |
| Restore / history (`previousRightPanelViewRef`, backup restore ordering comments) | HomeScreen | Hook + restore coordinator | **Medium** | **Partial** | Restore flows touch scene + HUD; do not break ordering (scene → loops → panel). |
| Focus / selection guards (`getAnalyzeLockedObjectId`, `isAnalyzeLockActive`, analyze lock blocks inside authority open) | HomeScreen | Hook receives selection getters | **High** | **Partial** | Selection state stays in shell; hook needs stable read-only accessors. |
| Suppression guards (`panelUserExplicitCloseRef`, `panelAuthorityLockAtRef`, authority window ref, workspace blocks) | HomeScreen | Hook | **High** | **Yes** | Prevents unwanted re-opens after user close or during locks. |
| Authority window (`activePanelAuthorityWindowRef`, `PANEL_SOURCE_PRIORITY_VALUE`) | HomeScreen | Hook | **High** | **Yes** | Source priority + rank for competing open requests. |
| Anti-flash / stable UI (`lastStableRightPanelTabRef`, `setRightPanelState` “same panel” early return, `prev.view && !next.view` guard) | HomeScreen | Hook | **High** | **Yes** | Regression-sensitive; covered in O3 checklist. |
| Route / context lock (`rightPanelRouteLockRef`, executive object lock reads) | HomeScreen | Hook | **High** | **Yes** | Keeps object-scoped routes stable; pairs with `commitRightPanelStateFromAuthority`. |
| Panel data contract (`getValidatedPanelSharedDataOnce`, `validatedPanelCacheRef`, `homeScreenPanelHelpers`, `panelDataContract` types) | HomeScreen + helpers module | Helpers stay in module; hook **calls** helpers | **Medium** | **Partial** | Validation cache is orchestration-adjacent; avoid circular imports when moving. |
| QA / debug (`traceRightPanelStateMutation`, `traceRightPanelPathAudit`, `lastRightPanelHostInputTraceRef`, `panelMetricsRef`, `lastPanelGateDebugSigRef`, dev-only `[Nexora][PanelMetrics]` / gate logs) | HomeScreen | Hook or `app/lib/debug` (policy) | **Low** | **Partial (O3:8+)** | O3:7 centralized `[Nexora][RightPanel][Diagnostic]` + legacy-tagged panel events in `useRightPanelController`; Host traces unchanged. |
| `RightPanelHost` JSX + prop wiring | HomeScreen | **Stays in HomeScreen** (or a thin layout component) | **Medium** | **No** | Hook does **not** render UI; Host remains a presentational integration point. |

### Target hook: `useRightPanelController`

Planned responsibilities:

- **Owns right panel orchestration** — authority open/close, `applyPanelControllerRequest`, and commit pipeline into `RightPanelState`.
- **Owns panel routing normalization** — request normalization, legacy tab mapping coordination, stable tab ref behavior (anti-flash).
- **Owns panel open/close dedupe** — request signatures, family/authority audit dedupe, compatible with existing `panelController` contracts.
- **Owns anti-flash guards** — stable tab fallback, same-state short-circuit in state updates where applicable.
- **Owns panel source/reason tracking** — write meta staging, change-source ref, authority reason ref (as today).
- **Exposes a stable open/close API** — for chat, Type-C bridges (`openSimPanel` pattern), scene-driven opens, and manual nav — without renaming public callback names at the shell until an explicit prompt allows it.
- **Exposes active panel state** (or receives setter from shell — TBD in O3:2 types; **O3:3** exposes read-only snapshot from shell inputs) for `RightPanelHost`.
- **Does not render UI**; **does not own** `sceneJson`; **does not own** Type-C business logic; **does not own** chat transcript state — only **calls into** those zones via narrow props/refs when a panel action requires them.

### O3 bug tracking checklist

After each O3 extraction step, verify:

- [ ] No **dashboard / console spam** from panel or authority traces (dedupe refs still effective).
- [ ] No **repeated panel open loops** (signature dedupe + authority window behavior).
- [ ] No **panel flash** on tab switches or transient null routes (`lastStableRightPanelTabRef` + state guards).
- [ ] No **panel disappear** immediately after scene updates (scene→panel ordering and restore paths).
- [ ] No **duplicate** authority / controller open calls for the same logical user action.
- [ ] **Explicit selected object** preserved when opening object-scoped panels (`contextId` / selection alignment).
- [ ] **Type-C War Room** still opens correctly (`openSimPanel` → **`typeCOpenSimPanelRef`** via `useRightPanelControllerBridgeWiring` after O3:6).
- [ ] **Chat-triggered** panel open still works (intent + `applyPanelControllerRequest` / authority paths).
- [ ] **Panel normalization** still matches `rightPanelRouter` / `panelController` contracts.
- [ ] **Panel dedupe** still drops redundant requests (`lastPanelRequestSigRef` and related).
- [ ] **`RightPanelHost`** still renders and receives the same effective props.

**O3:9 (static verification):** Grep confirms a single **`openRightPanel` / `closeRightPanel`** `useCallback` implementation in **`useRightPanelController.ts`**; **`HomeScreen`** only destructures **`closeRightPanel`** from **`rightPanelController.callbacks`** ( **`openRightPanel`** unused at shell — panel opens use **`requestPanelAuthorityOpen`** / **`applyPanelControllerRequest`** ). **`normalizeRawAuthorityPanelView`** appears in HomeScreen only inside **`requestPanelAuthorityOpen`** (shared helper with the hook, not a second normalizer). **`useRightPanelControllerBridgeWiring`** assigns bridge refs in **`useEffect`** only. **`rightPanelRouter.closeRightPanel(prev)`** remains a **distinct** pure state helper (not the shell callback).

### O3 AI usage optimization

Future prompts should reference:

- **`useRightPanelController`** + **`emitRightPanelDiagnosticDev`** (`useRightPanelController.ts` since O3:7) + **`useRightPanelController.types.ts`**,
- **`rightPanelRouter`** / **`panelController`** / **`rightPanelState`** contracts,
- **`RightPanelHost`** integration (props slice only),

and **avoid loading** unless directly required:

- **Type-C internals** (`useTypeCOrchestration` implementation, scenario builders),
- **Scene controller internals** (`useSceneApplyController` beyond the public `applySceneChangeSafe` surface),
- **Chat pipeline internals** (`sendText`, intent queue, ingestion) — see **[O4 — Chat Pipeline Controller Extraction](#o4--chat-pipeline-controller-extraction)** for the planned `useChatPipelineController` boundary; until O4 lands, grep **`O4 Extraction Boundary: Chat Pipeline Controller`** in `HomeScreen.tsx` when touching chat sends,

so panel work stays bounded and context-small.

### O3 extraction order (recommended)

1. **O3:1** — Right Panel inventory + baseline (**complete** — this doc + `[Nexora][RightPanel][O3Baseline]` + boundary comment).
2. **O3:2** — Create **Right Panel Controller types** (`useRightPanelController.types.ts`; **complete** — contracts + `RIGHT_PANEL_CONTROLLER_EXTRACTION_PLAN` + `[Nexora][RightPanel][TypesReady]` log).
3. **O3:3** — Create **`useRightPanelController` hook skeleton** (`useRightPanelController.ts`; **complete** — stable contract + placeholder refs + `[Nexora][RightPanel][HookSkeletonReady]`; HomeScreen call site after `closeRightPanel`).
4. **O3:4** — Move **`openRightPanel` / `closeRightPanel`** into **`useRightPanelController`** (**complete** — real callbacks; HomeScreen passes authority open/close + snapshot getters; `RightPanelHost` unchanged).
5. **O3:5** — Move **routing normalization + dedupe guards** (`lastPanelRequestSigRef`, `lastOpenIntentRef`, `normalizeRawAuthorityPanelView`, hook `openRightPanel` dedupe + **`[Nexora][RightPanel][DedupeGuard]`**; **complete** — bridges + early `useRightPanelController` placement).
6. **O3:6** — Wire **Type-C / chat / scene panel bridges** (**complete** — `RightPanelBridgeRefs` + `useRightPanelControllerBridgeWiring`; **`typeCOpenSimPanelRef`** only; HomeScreen passes `bridgeRefs` into `useRightPanelController` and invokes the bridge hook after `openSimPanel`; no chat/scene-only bridge refs in this codebase yet).
7. **O3:7** — **Panel diagnostics + anti-flash cleanup** (**complete** — `emitRightPanelDiagnosticDev` + `diagnostics.emitRightPanelDiagnostic`; HomeScreen routes authority / upstream / flash / dashboard-block logs; `RightPanelHost` unchanged).
8. **O3:8** — **HomeScreen** right-panel import / wiring cleanup (**complete** — dropped empty `refs` placeholder + unused `RightPanelControllerRefs` import; single types import; O3:8 boundary comment at hook call).
9. **O3:9** — Final **right panel regression check** (**complete** — ownership + duplicate-implementation verification; inventory closure; O3 completion note; `HomeScreen` hook comment).

### O3 non-goals (unless a later prompt explicitly expands scope)

- Do **not** move panel logic during **O3:1** (inventory only).
- Do **not** move scene, Type-C, chat, or ingestion **business** logic into the panel hook.
- Do **not** change **`RightPanelHost`** behavior, broad **UI**, or **routing semantics** in O3:1–O3:3 skeleton phases.
- Do **not** **rename** panel callbacks at the shell until a dedicated cleanup prompt.
- Do **not** add **dependencies** or **circular imports** — hook depends on `app/lib/ui/right-panel/*` and thin shell inputs only.

---

## O4 — Chat Pipeline Controller Extraction

### Purpose

- **Isolate `sendText` lifecycle** — user message append, assistant placeholder/streaming, persistence (`saveProject` / `pushHistory`), abort/timeout, and lifecycle status transitions behind one controller hook.
- **Reduce `HomeScreen.tsx` complexity** — shrink the 19k-line shell so chat-only prompts do not require loading unrelated zones.
- **Centralize chat → intent → action routing** — deterministic classifier (`classifyIntentDeterministic` / `routeIntentDeterministic` from `app/lib/chat/*`), `actionRouter`, core response parsing (`homeScreenResponseReaders`, `formatCoreResponse` / pipeline helpers), and panel/scene side-effects coordinated through narrow bridge APIs.
- **Protect stale / duplicate chat runs** — preserve `chatRequestSeqRef`, `activeChatRequestRef`, `latestChatPipelineRunIdRef`, `lastChatDedupRef`, loop guards (`chatLoopGuardActiveRef`, `loopGuardInFlightByTextRef`, `isSendingRef`), and `lastAppliedChatPipelineSignatureRef` semantics during incremental moves.
- **Preserve panel / scene trigger behavior** — chat continues to call `requestPanelAuthorityOpen` / `applyPanelControllerRequest` and `applySceneChangeSafe` / `applySceneChangeUpstreamDedup` (and `applySceneFromChat` where used) without re-owning those controllers’ internals.
- **Reduce Cursor / AI context usage** — future prompts load `useChatPipelineController` + the HomeScreen chat call site + `actionRouter` / chat libs instead of full Type-C, scene, or right-panel implementations.

### O4:1 — Chat Pipeline inventory + baseline (**complete**)

- This **## O4** section (ownership map, target hook, checklist, AI note, extraction order, non-goals).
- Dev-only, **once-per-mount** log: **`[Nexora][ChatPipeline][O4Baseline]`** in `HomeScreen.tsx` (StrictMode-safe ref guard; empty-deps `useEffect`; no state updates; not in render). Payload: `messageCount`, `hasInput`, `isLoading` (`loading || chatRequestStatus === "submitting"`), `hasError` (`chatRequestStatus === "error"`), `activePanelId` (`rightPanelState.view ?? null`), `hasSceneJson` (non-empty `sceneJson.scene.objects`), `typeCMode`, `productMode` (`getNexoraProductMode()`).
- **`// O4 Extraction Boundary: Chat Pipeline Controller`** (+ dedupe / stale-run / bridge-only note) immediately above **`sendText`** in `HomeScreen.tsx` (supersedes the prior O1 chat anchor at that line).
- **No chat orchestration moved**; runtime behavior unchanged.

### O4:2 — Chat Pipeline Controller types (**complete**)

- **`app/screens/hooks/chat/useChatPipelineController.types.ts`** — `ChatMessageRole`, `ChatPipelineMessage` (**`Readonly<Msg>`** from `homeScreenUtils`), `ChatSendInput`, `ChatPipelineControllerState`, `ChatPipelineControllerRefs` (with **TODO** mapping to HomeScreen ref names), `ChatPipelineBridgeCallbacks`, `ChatPipelineControllerCallbacks`, diagnostic unions, `UseChatPipelineControllerContract`, **`CHAT_PIPELINE_CONTROLLER_EXTRACTION_PLAN`**.
- Dev-only, **once-per-mount** log: **`[Nexora][ChatPipeline][TypesReady]`** in `HomeScreen.tsx` (`extractionOrder`, `protectedAreas` from the plan). **No chat logic moved** in O4:2; HomeScreen still owns chat orchestration.

### O4:3 — `useChatPipelineController` hook skeleton (**complete**)

- **`app/screens/hooks/chat/useChatPipelineController.ts`** — initial shell: refs/bridges/state snapshot, dev **`[Nexora][ChatPipeline][HookSkeletonReady]`**. Message append/replace/clear-error **moved in O4:4**; **`sendText`** lifecycle **moved in O4:5** (see below).
- **`HomeScreen.tsx`** — wires the hook with bridges + **`sendTextDeps`**; destructures **`sendText`**, **`appendMessage`**, **`replaceMessages`**, **`clearChatError`** from **`chatPipelineController.callbacks`**.
- **HomeScreen remains source of truth** for chat **state** (`messages`, input, loading, error) and for the **`sendText`** dependency snapshot.

### O4:4 — Message helpers + loading/error shell (**complete**)

- **`useChatPipelineController`** — owns **`appendMessage`** (`setMessages` + **`appendMessages`** from `homeScreenUtils`, same functional form as prior HomeScreen inline), **`replaceMessages`** (`setMessages` with spread copy of `Msg[]`, same as prior inline), **`clearChatError`** (sets **`chatRequestStatus`** → **`"idle"`**, **`loading`** → **`false`**, **`chatDelayedBusy`** → **`false`**, then **`releaseChatSendingLock`** from shell → **`isSendingRef.current = false`** — mirrors **`finalizeChatRequest`** idle/loading/sending flags without panel-audit/seq guards). Dev **`emitChatPipelineDiagnostic`** **`message_appended`** (**O4:8**; replaces **`[Nexora][ChatPipeline][MessageHelper]`**).
- **`HomeScreen.tsx`** — passes **`setMessages`**, **`setChatRequestStatus`**, **`setLoading`**, **`setChatDelayedBusy`**, **`releaseChatSendingLock`**; removes **`appendChatPipelineMessage`** / **`replaceChatPipelineMessages`**.
- **Not moved in O4:4:** **`finalizeChatRequest`**, **`messagesRef`** sync effect, ingestion assistant line effect, **`writeChatPipelineDebug`**.

### O4:5 — `sendText` core request lifecycle (**complete**)

**Prompt O4:5 completion note:** O4:5 moved **`sendText`** core request lifecycle into **`useChatPipelineController`**. **HomeScreen** still owns chat state (**`messages`**, **`input`**, **`loading`**, **`chatRequestStatus`**, related refs). Intent routing and response parsing live inside **`createChatPipelineSendText`**; chat-triggered **bridge dispatch** is wired via **`ChatPipelineBridgeCallbacks`** (**O4:7**), not duplicated in **HomeScreen**.

- **`app/screens/hooks/chat/useChatPipelineController.ts`** — **`createChatPipelineSendText(deps, bridges)`** and the full async **`sendText`** body that previously lived in **`HomeScreen`** (user/assistant appends, loading/`chatRequestStatus`, **`chatToBackendLifecycle`**, abort/timeout, stale **`isLatestChatRequest`**, duplicate prompt / loop guards, error fallback). Shared helpers are **imported** in this module; HomeScreen-only values arrive on **`ChatPipelineSendTextDeps`** (`useChatPipelineController.types.ts`), built each render via **`useMemo`**. Scene / panel / Type-C **side-effects dispatch through `bridges`** (O4:7). Dev pipeline diagnostics are **`emitChatPipelineDiagnostic`** (**O4:8**); canonical **`callbacks.sendText`** wrapper still trims / dedupes entry.
- **`useChatPipelineController`** — memoizes **`createChatPipelineSendText(sendTextDepsForImpl, bridges)`** (deps include **`emitChatPipelineDiagnostic`**) and **`callbacks.sendText`** awaits it (no **`sendTextImplRef`**). O4:4 message helpers unchanged.
- **`HomeScreen.tsx`** — still owns **`messages` / `input` / `loading` / `error`** and all refs the lifecycle reads; supplies **`sendTextDeps`** (no bridge callbacks in deps) and **`chatPipelineBridges`**. Intent routing remains inside the lifecycle (**O4:6** may further narrow).

### O4:7 — Scene / Right Panel / Type-C chat bridges (**complete**)

- **`useChatPipelineController.ts`** — **`dispatchChatSceneBridge`**, **`dispatchChatPanelBridge`**, **`dispatchChatTypeCBridge`** (file-local helpers) plus dev-only deduped **`[Nexora][ChatPipeline][BridgeDispatch]`** (`runId`, `bridgeTarget`, `action`, `success`, `skippedReason`, `intent`, `targetPanel`). **`sendText`** calls these instead of inlining **`requestPanelAuthorityOpen`** / scene apply fns from deps.
- **`HomeScreen.tsx`** — **`chatPipelineBridges`** `useMemo` supplies **`applySceneChangeSafe`**, **`applySceneChangeUpstreamDedup`**, **`applyUnifiedSceneReactionUpstreamDedup`**, **`openRightPanel`**, **`requestPanelAuthorityOpen`**, **`closeRightPanel`**, **`applyTypeCChatIntent`**, **`runTypeCAction`** (null). HomeScreen is **bridge provider only**; it does not dispatch bridges from duplicate chat helpers.
- **Scene bridge callbacks used (chat pipeline):** **`applySceneChangeUpstreamDedup`**, **`applyUnifiedSceneReactionUpstreamDedup`** (plus reserved **`applySceneChangeSafe`** for non-`sendText` bridge consumers).
- **Right panel bridge callbacks used (chat pipeline):** **`requestPanelAuthorityOpen`** (authority path used by chat; **`openRightPanel`** / **`closeRightPanel`** passed for compatibility / future routes — chat pipeline does not call **`closeRightPanel`** today).
- **Type-C bridge callbacks used (chat pipeline):** **`applyTypeCChatIntent`** (reserved **`runTypeCAction`** null until wired).

### O4:8 — Chat pipeline diagnostics + stale-run guards (**complete**)

- **`useChatPipelineController.ts`** — **`emitChatPipelineDiagnostic(eventName, payload)`** (dev-only, try/catch, 220ms dedupe on a stable key; logs **`[Nexora][ChatPipeline][Diagnostic]`**). **`emitSendTextDiag`** / **`emitMessageHelper`** delegate into it; **`createChatPipelineSendText`** receives the emitter via merged **`sendTextDepsForImpl`**. In-lifecycle **`console.log` / `console.debug` / `console.warn`** for pipeline tracing were replaced with typed events (**`send_requested`**, **`send_skipped`**, **`duplicate_prompt_skipped`**, **`stale_response_ignored`**, **`routing_resolved`**, **`request_started`**, **`request_completed`**, **`request_failed`**, etc.). **`[Nexora][ChatPipeline][BridgeDispatch]`** (O4:7) unchanged.
- **Stale / seq guards (unchanged behavior):** **`latestChatPipelineRunIdRef`** (wired as **`activeRunIdRef`**), **`isLatestChatRequest(requestSeq)`** after execution, **`lastChatDedupRef`** rapid duplicate window, loop-guard in-flight map, **`lastAppliedChatPipelineSignatureRef`** (as **`lastAssistantMessageSignatureRef`**) for stability evaluation — still owned in HomeScreen refs and passed on **`sendTextDeps`** / **`refs`**; no new blocking paths.
- **Duplicate assistant rows:** no dedicated transcript-level dedupe beyond existing **`isLatestChatRequest`** / run id / effect idempotency; **`duplicate_assistant_message_skipped`** event type exists for future wiring (panel/scene idempotent skips emit **`send_skipped`**).
- **`HomeScreen.tsx`** — **`chatPipelineDiagnosticRef`** + **`useEffect`** wires **`emitChatPipelineDiagnostic`** into **`finalizeChatRequest`** (replaces **`[Nexora][HomeScreen][LoadingState]`** finalize console). Removed dev **`[Nexora][ChatLifecycle]`** effect on **`chatRequestStatus`** (superseded by finalize + pipeline diagnostics). **Kept** O4 baseline / types logs, **`[Nexora][ChatSubmit][PreserveVisibleState]`** UI visible-state logs, and non-pipeline **`globalThis`/`NEXORA_*`** traces inside the lifecycle.

### O4:9 — HomeScreen chat import cleanup (**complete**)

- **Removed imports (confirmed unused in HomeScreen after pipeline extraction):** **`DEFAULT_CHAT_REQUEST_TIMEOUT_MS`** (lifecycle imports it in **`useChatPipelineController`**), **`SendTextOptions`**, **`FAST_CHAT_THRESHOLD_MS`**, **`parseSizeCommand`**, **`parseSelectedSizeCommand`**.
- **Removed refs:** none — **`latestChatPipelineRunIdRef`**, **`lastAppliedChatPipelineSignatureRef`**, **`lastChatDedupRef`**, **`chatRequestSeqRef`**, **`chatPipelineDiagnosticRef`**, etc. remain **shared** with **`sendTextDeps`**, **`finalizeChatRequest`**, scene/panel/Type-C, and debug harness.
- **Hook call site:** **`useChatPipelineController`** receives **`messages`**, **`inputValue`**, loading/error shell, **`refs`**, **`bridges`**, **`sendTextDeps`**, React setters, **`releaseChatSendingLock`** only; large orchestration stays in **`sendTextDeps`** `useMemo` (unchanged contract).
- **Comment:** final **`// O4 complete`** block immediately above **`useChatPipelineController({`** in **`HomeScreen.tsx`** (O4:10).

### O4:10 — Final Chat Pipeline regression check (**complete**)

O4:10 completed final Chat Pipeline Controller regression check. Chat orchestration is now owned by **`useChatPipelineController`**. **HomeScreen** remains chat state owner where applicable (**`messages`**, **`input`**, **`loading`**, **`chatRequestStatus`**, deps + bridges). Chat UI remains renderer/consumer. Next phase should be **O5 — Final HomeScreen Slim-Down**.

- **Ownership verified:** **`useChatPipelineController`** owns **`sendText`**, message helpers (**`appendMessage`**, **`replaceMessages`**, **`clearChatError`**), loading/error shell wiring, intent routing + response parsing inside **`createChatPipelineSendText`**, bridge dispatch helpers, **`emitChatPipelineDiagnostic`** + stale/seq guards. **HomeScreen** owns **`messages`**, **`input`**, **`loading`**, **`chatRequestStatus`**, **`chatDelayedBusy`**, refs passed via **`sendTextDeps`** / **`chatPipelineRefs`**, **`finalizeChatRequest`**, **`writeChatPipelineDebug`**. Chat UI (**`LeftCommandAssistant`**, etc.) only calls **`sendText`** from **`chatPipelineController.callbacks`**.
- **`sendText`:** single **`useCallback`** implementation in **`useChatPipelineController.ts`**; HomeScreen has **no** `const sendText` / `sendText = useCallback` — only destructuring from **`callbacks`**.
- **No duplicate routing/parsing in HomeScreen:** **`resolveNexoraIntentRoute`**, **`runNexoraChatPromptPipeline`**, **`executeNexoraAction`**, **`buildFailureResponse`**, **`routeChatInput`** appear in **`chatPipelineSendTextDeps`** only (plus **`executeNexoraAction`** typing at **`applyExecutionResultToUi`** path ~7474).
- **Diagnostics:** pipeline **`console.info`** only inside dev-gated **`emitChatPipelineDiagnostic`**, bridge diag, and mount **`useEffect`** (**`HookSkeletonReady`**); not during render of children.
- **Bridges:** no **`useSceneApplyController` / `useRightPanelController` / `useTypeCOrchestration`** imports in the chat controller module (types-only **`PanelAuthorityOpenRequest`**).
- **Next phase:** **O5 — Final HomeScreen Slim-Down** — see **[## O5 — Final HomeScreen Slim-Down](#o5-slim-down)** (**O5:1** baseline + inventory).

### Chat Pipeline ownership inventory (baseline)

Representative symbols — grep **`chatPipelineSendTextDeps`** / **`createChatPipelineSendText`** and the names below. Chat loading spans **`loading`** (primary busy), **`chatRequestStatus`** (`idle` | `submitting` | `success` | `error` | `aborted` | `stale_ignored` from `chatRequestLifecycle`), and **`chatDelayedBusy`** (delayed UI to avoid fast-path flashes). Ingestion failure can append a fallback assistant line via **`interactionUiState.ingestion`** — adjacent to chat UX but owned separately today.

| Item | Current owner | Future owner | Risk | Move in O4? | Notes |
|------|---------------|--------------|------|-------------|-------|
| `messages` / `setMessages` | HomeScreen `useState` | `useChatPipelineController` (or hook-owned state + shell snapshot) | **High** | **Yes** | Canonical transcript; many call sites (project restore, commands, ingestion). |
| `messagesRef` | HomeScreen | Hook | **High** | **Yes** | Stale-safe reads inside async `sendText` / effects. |
| `input` / `setInput` | HomeScreen | Shell or input controller (TBD); pipeline may **read** trimmed input only | **Medium** | **Partial** | O4 focuses on send pipeline; input field can stay in shell initially. |
| `loading` / `setLoading` | HomeScreen | Hook | **High** | **Yes** | Primary chat busy flag; pairs with delayed busy. |
| `chatRequestStatus` / `setChatRequestStatus`, `chatDelayedBusy` / `setChatDelayedBusy` | HomeScreen | Hook | **High** | **Yes** | `app/lib/chat/chatRequestLifecycle` integration. |
| `sendText` | HomeScreen `useCallback` | `useChatPipelineController` | **High** | **Yes** | Large closure; coordinates scene, panel, Type-C, fetch, dedupe. |
| `appendMessages`, `makeMsg`, message normalization | HomeScreen + `app/lib/chat/*` helpers | Hook calls same libs | **Medium** | **Yes** | Preserve append semantics and role ordering. |
| `chatRequestSeqRef`, seq staleness (`isLatestChatRequestSeq` pattern) | HomeScreen | Hook | **High** | **Yes** | Prevents out-of-order completion updates. |
| `activeChatRequestRef` (AbortController, timeout, `timedOut`) | HomeScreen | Hook | **High** | **Yes** | In-flight cancel + timeout clearing. |
| `activeChatDebugCorrelationRef` | HomeScreen | Hook or shared debug | **Low** | **Yes** | Correlates panel/scene with active turn. |
| `latestChatPipelineRunIdRef`, `lastAppliedChatPipelineSignatureRef` | HomeScreen | Hook | **High** | **Yes** | Pipeline stability / idempotency. |
| `lastChatDedupRef` (text + timestamp) | HomeScreen | Hook | **High** | **Yes** | Duplicate prompt protection. |
| `chatLoopGuardActiveRef`, `chatLoopGuardDepthRef`, `loopGuardInFlightByTextRef`, `isSendingRef` | HomeScreen | Hook | **High** | **Yes** | Prevents re-entrant / duplicate sends. |
| `writeChatPipelineDebug`, `__NEXORA_DEBUG__.chatPipeline` | HomeScreen callback | Hook or thin debug module | **Low** | **Partial** | Dev-only merge; keep behavior identical. |
| `normalizeChatInputForDedup`, `buildChatEffectSignature` | HomeScreen functions | Hook | **Medium** | **Yes** | Panel/scene effect dedupe inputs. |
| `lastAppliedPanelEffectRef`, `lastAppliedSceneEffectRef` | HomeScreen | Hook (or shared effect ledger) | **High** | **Yes** | Chat-triggered panel/scene effect dedupe. |
| Deterministic intent (`classifyIntentDeterministic`, `routeIntentDeterministic`, engines in `nexoraChatPromptSystem` / `chatRequestLifecycle`) | `app/lib/chat/*`; **called from** HomeScreen `sendText` | Hook imports libs; **lib stays** | **High** | **Yes** | No behavior change; same call order. |
| `actionRouter` / routed actions | `app/lib/actions/actionRouter.ts`; invoked from chat paths | Hook calls router | **High** | **Yes** | Preserve routing table and side-effects. |
| Core response parsing (`homeScreenResponseReaders`, format/slice helpers) | HomeScreen imports | Hook imports | **Medium** | **Yes** | Keep readers pure; no duplicate parsing paths. |
| Local / assistant fallback messages (`buildFailureResponse`, `getChatLifecycleErrorMessage`, timeout copy, “System temporarily unavailable”) | HomeScreen + `chatRequestLifecycle` | Hook | **Medium** | **Yes** | User-visible parity critical. |
| Chat-triggered panel opens (`requestPanelAuthorityOpen`, `applyPanelControllerRequest`, intent-derived targets) | HomeScreen | Hook calls **`rightPanelController.callbacks.openRightPanel`** / authority APIs passed from shell | **High** | **Yes (bridge)** | Shell keeps `rightPanelState`; controller exposes `openRightPanel` / authority bridges (O3). |
| Chat-triggered scene writes (`applySceneChangeUpstreamDedup`, `applySceneChangeSafe`, `applySceneFromChat`, unified reaction) | HomeScreen | Hook calls **`sceneApplyController.callbacks.applySceneChangeSafe`** (+ upstream dedupe) | **High** | **Yes (bridge)** | Hook does **not** own `sceneJson`. |
| Chat-triggered Type-C (`applyTypeCChatIntent`, Type-C adapters / `useTypeCOrchestration` callbacks) | HomeScreen + `useTypeCOrchestration` | Hook invokes Type-C callbacks/refs from shell | **High** | **Yes (bridge)** | No Type-C business logic inside chat hook. |
| Project / history persistence inside send (`saveProject`, `pushHistory`, snapshots with `messages`) | HomeScreen | Shell or shared persistence helper called from hook | **High** | **Partial** | May stay in shell until persistence controller exists. |
| `interactionUiState` ingestion error → assistant fallback line | HomeScreen `useEffect` | Stays shell or merges with hook later | **Medium** | **No (O4:1)** | Not part of `sendText`; document cross-talk only. |

### Target hook: `useChatPipelineController`

Expected responsibilities:

- **Owns `sendText` lifecycle** — trim/validate input, mark flows, invoke fetch/pipeline, finalize messages, persistence hooks as today.
- **Owns chat request / run guards** — dedupe signatures, loop guard, abort/timeout, stale-seq checks, `activeChatRequestRef` lifecycle.
- **Owns chat loading / error lifecycle** — `loading`, `chatRequestStatus`, delayed busy coordination with existing lifecycle helpers.
- **Owns message append / update helpers** — user + assistant rows, normalization, dedupe against duplicate assistant emissions.
- **Owns deterministic intent routing calls** — classifier + router from `app/lib/chat/*` without forking behavior.
- **Coordinates with scene controller** through **`applySceneChangeSafe`** / **`applySceneChangeUpstreamDedup`** (callbacks from `useSceneApplyController`); does **not** own `sceneJson`.
- **Coordinates with right panel controller** through **`openRightPanel`** / authority / `applyPanelControllerRequest` as supplied by shell; does **not** own `RightPanelHost` or `rightPanelState`.
- **Coordinates with Type-C controller** through Type-C chat hooks / refs (`applyTypeCChatIntent`, orchestration callbacks) passed from shell; does **not** own Type-C business internals.
- **Does not render UI**; **does not** introduce circular imports; **does not** change backend contracts or action routing tables without an explicit prompt.

### O4 bug tracking checklist

After each O4 extraction step, verify:

- [ ] **Chat sends once** per user action (no double-submit from `isSendingRef` / button state regression).
- [ ] **No duplicate assistant messages** for the same logical turn (dedupe + append semantics).
- [ ] **Stale responses are ignored** (`chatRequestSeqRef` / `activeChatRequestRef` / `stale_ignored` lifecycle).
- [ ] **Loading state clears correctly** (`loading`, `chatRequestStatus`, `chatDelayedBusy` timing).
- [ ] **Error state displays safely** (user-safe copy, no throw from error paths, `chatRequestStatus === "error"`).
- [ ] **Panel trigger still works** (chat intents → authority / controller request → correct view).
- [ ] **Scene trigger still works** (chat → scene apply / upstream dedupe / unified reaction if applicable).
- [ ] **Type-C chat action still works** (`applyTypeCChatIntent` and downstream Type-C paths).
- [ ] **Fallback response still works** (network/timeout/backend error assistant lines).
- [ ] **No panel flash from chat** (effect signature dedupe + authority ordering preserved).
- [ ] **No scene reset from chat** (no accidental full clears; idempotent skips still fire).

### O4 AI usage optimization

Future prompts should inspect:

- **`useChatPipelineController`** (once created) and its **types** module,
- **HomeScreen** chat **`chatPipelineSendTextDeps`** / **`useChatPipelineController`** call site,
- **`actionRouter.ts`** and **`app/lib/chat/*`** (`chatRequestLifecycle`, `nexoraChatPromptSystem`, parsers),

and **avoid loading** unless a bridge actually breaks:

- **Full Type-C internals** (`useTypeCOrchestration` body, scenario builders),
- **Full scene controller internals** (`useSceneApplyController` beyond `applySceneChangeSafe` / public callbacks),
- **Full right panel internals** (`useRightPanelController` beyond `openRightPanel` / `closeRightPanel` / diagnostics surface),

keeping chat work bounded and context-small.

### O4 extraction order (recommended)

1. **O4:1** — Chat Pipeline inventory + baseline (**complete** — this doc + `[Nexora][ChatPipeline][O4Baseline]` + boundary comment).
2. **O4:2** — Create **Chat Pipeline Controller types** (**complete** — `useChatPipelineController.types.ts` + `[Nexora][ChatPipeline][TypesReady]` log; contracts + `CHAT_PIPELINE_CONTROLLER_EXTRACTION_PLAN`).
3. **O4:3** — Create **`useChatPipelineController` hook skeleton** (**complete** — `useChatPipelineController.ts` + HomeScreen wiring; **`[Nexora][ChatPipeline][HookSkeletonReady]`**; canonical **`callbacks.sendText`** from hook).
4. **O4:4** — Move **message state helpers + loading/error lifecycle** (**complete** — hook owns **`appendMessage`**, **`replaceMessages`**, **`clearChatError`**; dev **`emitChatPipelineDiagnostic`** **`message_appended`**; HomeScreen passes React setters + **`releaseChatSendingLock`**; **`messagesRef` / `finalizeChatRequest` / `sendText`** unchanged).
5. **O4:5** — Move **`sendText` core request lifecycle** (**complete** — body co-located in **`useChatPipelineController.ts`** + **`sendTextDeps`** `useMemo` in HomeScreen; canonical **`callbacks.sendText`**). Bridge callbacks supplied separately via **`chatPipelineBridges`** (**O4:7**).
6. **O4:6** — **Intent routing + core response parsing** (**complete** — inside **`createChatPipelineSendText`** in **`useChatPipelineController.ts`**; HomeScreen supplies deps only).
7. **O4:7** — Wire **scene / right panel / Type-C chat bridges** (**complete** — `ChatPipelineBridgeCallbacks` + dispatch helpers + **`[Nexora][ChatPipeline][BridgeDispatch]`**; HomeScreen passes **`applySceneChangeUpstreamDedup`**, **`applyUnifiedSceneReactionUpstreamDedup`**, **`requestPanelAuthorityOpen`**, **`applyTypeCChatIntent`**, etc.).
8. **O4:8** — **Chat pipeline diagnostics + stale-run guards** (**complete** — **`emitChatPipelineDiagnostic`** + merged lifecycle deps; HomeScreen **`finalizeChatRequest`** uses ref to emitter; duplicate **`[Nexora][ChatLifecycle]`** removed).
9. **O4:9** — **HomeScreen chat import cleanup** (**complete** — removed unused chat-only imports; O4:9 comment at hook; **`releaseChatSendingLock`** + hook props unchanged).
10. **O4:10** — **Final chat pipeline regression check** (**complete** — read-only verification + inventory closure; **`npx tsc --noEmit`**: no errors reported for **`useChatPipelineController*`**, **`HomeScreen.tsx`**, **`homeScreenResponseReaders`**, **`actionRouter`** in filtered output; full-project **`tsc`** may still fail on unrelated modules; **`eslint`** on chat hook/types/helpers: 0 errors; manual checklist: send, loading, stale seq, bridges, Type-C, no duplicate **`sendText`**).

### O4 non-goals (unless a later prompt explicitly expands scope)

- Do **not** move **`sendText`** or **`messages`** state in **O4:1–O4:4** (inventory through **message/loading helper callbacks** — React state for transcript + `sendText` stays in HomeScreen).
- Do **not** move **scene**, **right panel**, or **Type-C business** logic into the chat hook beyond **bridge calls**.
- Do **not** change **chat UI**, **backend contracts**, or **action routing behavior** during baseline / skeleton phases.
- Do **not** **rename** public chat callbacks at the shell until a dedicated cleanup prompt.
- Do **not** add **dependencies** or **circular imports**.

---

## O5 — Final HomeScreen Slim-Down

<a id="o5-slim-down"></a>

### Purpose

- **Reduce `HomeScreen.tsx` complexity** — fewer inline orchestration blocks, clearer scan for humans and agents.
- **Reduce Cursor / AI context cost** — prefer opening controller hooks + narrow shell call sites over the full 17k+ line file.
- **Verify controller ownership** — O1–O4 hooks remain the single orchestration homes for Type-C, scene apply, right panel, and chat pipeline.
- **Remove dead code** — unused imports, refs, effects, and obsolete phase comments (mechanical only; no behavior drift).
- **Make HomeScreen a stable orchestration shell** — top-level state, wiring, layout, and callbacks into UI; no duplicated diagnostics or duplicate pipeline implementations.

### O5:1 — Final HomeScreen Slim-Down Inventory + Baseline (**complete**)

- This **## O5** section: final **ownership map**, **remaining heavy zones** table, **risk checklist**, **extraction/cleanup order**, **non-goals**.
- Dev-only, **once-per-mount** log: **`[Nexora][HomeScreenSlimDown][O5Baseline]`** in **`HomeScreen.tsx`** (after **`useChatPipelineController`** so all four controllers exist in closure; **StrictMode-safe** ref guard; **empty-deps** `useEffect`; **no** state updates; **not** in render). Payload: **`hasTypeCController`**, **`hasSceneController`**, **`hasRightPanelController`**, **`hasChatPipelineController`**, **`sceneObjectCount`**, **`messageCount`**, **`activePanelId`** (`rightPanelState.view ?? null`), **`typeCMode`**, **`productMode`** (`getNexoraProductMode()`).
- **`// O5 Shell Composition: Controllers`** banner + hook-order note immediately **before** **`useSceneApplyController`** (O5:3); **`Final shell contract`** lines under that banner (O5:6).
- **No major logic moved**; runtime behavior unchanged.

### O5:2 — Remove dead imports / dead refs / dead comments (**complete**)

O5:2 removed dead imports, dead refs, obsolete temporary comments, and clearly unused local helpers from **`HomeScreen.tsx`**.

- **Imports removed** (confirmed unused in file / ESLint): **`SceneObject`**; **`clearSnapshots`**; **`RestorePreviewModal`**; **`buildSimulationResult`**, **`createSimulationInputFromPrompt`**; **`buildReplaySequence`**, **`compareScenarioSnapshots`**, **`createScenarioSnapshot`**; **`buildExecutiveInsightFromSimulation`**; **`CanonicalRecommendation`** (type); **`buildStrategyAwareExecutiveNotes`**, **`buildStrategyKpiContext`**; **`buildDecisionCockpitState`**; **`ActiveModeContext`** (type); **`buildReasoningOutput`**, **`createReasoningInput`**; **`orchestrateMultiAgentDecision`**; **`governanceTrustAuditContract`** symbols (**`appendAuditEvents`**, **`appendTrustProvenance`**, **`buildProjectGovernanceContext`**, **`createAuditEvent`**, **`createTrustProvenance`** — **`appendDecisionActionTrace`** kept on its own import); **`EnvironmentConfig`** (type); **`buildPlatformAssemblyState`**; unused **`../lib/contracts`** types (**`RiskAlert`**, **`StrategicState`**, **`EmotionalFx`**, **`ScenePatch`**, **`SceneObjectPatch`**); **`sceneJsonFromUnknown`**; **`normalizeUnifiedSceneReaction`**; **`DemoVisualMode`**; **`normalizeOpenPanelCta`**, **`normalizeFocusObject`**; **`SceneContext`** hooks **`useOverrides`**, **`useSetOverride`**, **`useClearAllOverrides`**, **`usePruneOverridesTo`**, **`useSelectedId`** (only consumed by removed **`FullRegistrar`**; **`useSetViewMode`** import retained).
- **Refs removed:** **`previousRightPanelViewRef`** (declared, never read); **`lastAuditRefTraceSignatureRef`** (declared, never read).
- **State tuple:** **`restorePreview`** → unused first slot discarded as **`[, setRestorePreview]`** (setter still used; no behavior change).
- **Comments removed:** obsolete **`// Removed unused R3F/Three imports`** / **`// Removed unused SceneRenderer import`**; redundant **O1:3 / O1:10** lines above Type-C state; redundant **O1:4–O1:10 / “HomeScreen remains state owner…”** block above **`useTypeCOrchestration`** (O5 boundary + single **O1 Extraction Boundary** line retained); **`/** O1:3 — keeps TypeCOrchestrationState… */`** and **`_O13HomeScreenTypeCOrchestrationStateBound`** type alias.
- **Helpers / types removed:** **`FullRegistrar`**, **`FullRegistrarProps`**; **`logCtaTraceResolution`**, **`logCtaTraceConsumer`**; **`InspectorSectionChangedDetail`** (unused type).
- **Shared refs intentionally kept:** chat pipeline seq/run/dedupe/loop refs (**`latestChatPipelineRunIdRef`**, **`chatRequestSeqRef`**, **`isSendingRef`**, **`chatPipelineDiagnosticRef`**, …), scene upstream / parity / reset trace refs passed into **`useSceneApplyController`**, panel authority bridge refs (**`panelAuthorityOpenBridgeRef`**, …), Type-C signature / pipeline refs, O1–O5 **baseline log ref guards** (**`homeScreenO11BaselineLoggedRef`** through **`homeScreenO51SlimDownBaselineLoggedRef`**).

### O5:3 — Reorder controller hook call site blocks (**complete**)

O5:3 grouped controller hook call sites into a clearer shell composition section. Controller order and bridge dependencies documented below. **No runtime behavior changed.**

- **Banner:** **`// O5 Shell Composition: Controllers`** (with short hook-order / TDZ note) wraps the **scene apply** + **Type-C** controller block.
- **Actual hook order (first controller region):** **`useSceneApplyController`** → **`useTypeCOrchestration`**. **Scene before Type-C** is safe: scene needs **`applyTypeCSceneUpdateRef`** only (no return value from Type-C); Type-C does not read **`applySceneChangeSafe`** from the scene hook.
- **Not moved adjacent to scene/Type-C** (would violate hook order / temporal dead zone): **`useRightPanelController`** and **`useChatPipelineController`** remain **after** **`rightPanelState`**, panel trace **`useCallback`**s, and **`chatPipelineSendTextDeps`** / **`chatPipelineBridges`** `useMemo`s. Subheaders **`// --- Right panel controller ---`** and **`// --- Chat pipeline controller ---`** mark those call sites.
- **Bridges unchanged:** **`sceneApplyBridgeRefs`** still passes **`applyTypeCSceneUpdateRef`**; chat **`bridges`** / Type-C / panel wiring unchanged; **`useRightPanelControllerBridgeWiring`** placement unchanged.

### O5:4 — Reduce remaining inline effects (**complete**)

O5:4 reviewed remaining **`HomeScreen.tsx`** **`useEffect`** blocks. Removed only **no-op / obsolete** effects; **merged** one safe dev-only duplicate set; added **`// O5 keep:`** notes where useful. **No runtime behavior changed.**

| Category | O5:4 disposition |
|----------|------------------|
| **Mount-once extraction baselines** (`[Nexora][HomeScreenOptimize][Baseline]`, **`[Nexora][SceneApply][O2Baseline]`**, **`[Nexora][RightPanel][O3Baseline]`**, **`[Nexora][ChatPipeline][O4Baseline]`**, **`[Nexora][HomeScreenSlimDown][O5Baseline]`**, TypesReady, Type-C **`ExtractionPlanReady`**) | **keep** — distinct payloads / bug-tracking; **`// O5 keep:`** note above the cluster. |
| **`void …extractionPlan.zone` + void callback identities** (dev-only “touch” hooks, empty deps) | **remove** — no state or bridge side-effects; superseded by real baselines + controller wiring. |
| **Type-C `__NEXORA_DEBUG__` mirrors** (readiness / draft / executive summary) | **merge** — **one** effect with deps **`[typeCDecisionReadiness, typeCDecisionDraft, typeCCommandExecutiveSummary]`**; same keys written as before. |
| **`chatPipelineDiagnosticRef` ↔ `emitChatPipelineDiagnostic`** | **keep** — shell bridge for **`finalizeChatRequest`**. |
| **Type-C core object bootstrap** (`ensureTypeCCoreObject` via **`applySceneChangeSafe`**) | **keep** — shell-level scene sync; **`// O5 keep:`** note. |
| **`[Nexora][Mode]`** dev log | **keep**; **`// O5 keep:`** note (not an extraction baseline). |
| **Panel / scene parity / ingestion / replay / demo / analyze / persistence effects** (large dependency lists) | **keep** / **move later** — not coalesced in O5:4 (regression risk). |

**Removed:** (1) **`useEffect`** that only **`void typeCOrchestration.extractionPlan.zone`** in dev; (2) **`useEffect`** that only **`void chatPipelineController.extractionPlan.zone`** + **`void appendMessage` / `replaceMessages` / `clearChatError` / `sendText`** (O4:3 one-shot smoke).

**Merged:** three separate **`__NEXORA_DEBUG__`** Type-C assignment effects → **one**.

**Marked future cleanup:** remaining high-dependency effects (panel audit, scene visible-state, ingestion, history, demo, etc.) — candidate for **O5:5** doc + later extraction, not merged here.

### Final ownership map (post O1–O4)

| Controller / shell | Owns |
|--------------------|------|
| **`useTypeCOrchestration`** | Type-C **callback orchestration** (handlers, pipeline events, scenario / AI / multi-agent / sandbox / execution flows); **does not** own React state declarations — shell passes state + setters + refs. |
| **`useSceneApplyController`** | Scene **write orchestration** (`applySceneChangeSafe`, JSON dedupe, write provenance refs, Type-C **`applyTypeCSceneUpdateRef`** bridge assignment, **`emitSceneApplyDiagnostic`**); shell owns **`sceneJson`** / **`setSceneJson`** and shared upstream / parity refs. |
| **`useRightPanelController`** | Right panel **open/close/authority** orchestration and panel diagnostics surface; shell owns **`rightPanelState`** and passes snapshots / bridges. |
| **`useChatPipelineController`** | **`sendText`**, message helpers, loading/error shell wiring from props, intent routing + response parsing, chat bridge dispatch, **`emitChatPipelineDiagnostic`**, stale-run guards (via deps/refs from shell). |
| **`HomeScreen`** | **Shell composition**: layout, component wiring, **top-level state** still intentionally here (`sceneJson`, Type-C state, panel state, chat transcript, ingestion-adjacent UX, selection, prefs, …), **`useMemo`** dependency packs for controllers, **`finalizeChatRequest`** and cross-cutting refs; **renders** UI and passes **callbacks** from controller return values into children. |

### Remaining heavy zones in `HomeScreen.tsx` (O5:1 inventory)

Representative rows — triage each prompt against **keep** (required for shell), **move later** (future child module/hook), **remove now** (dead), **unclear** (needs grep/usage pass).

| Zone | Examples / notes | O5 disposition |
|------|------------------|----------------|
| **Imports** | Large surface: contracts, chat libs, scene libs, panel registry, Type-C types, QA hooks | **keep** today; **move later** only when a zone extracts; **remove now** only confirmed-unused (O5:2). |
| **State blocks** | `sceneJson`, Type-C `useState` cluster, `rightPanelState`, `messages` / chat flags, ingestion, selection | **keep** (shell-owned until a prompt moves state into a hook). |
| **Refs** | Chat seq/run/dedupe, panel authority bridges, scene upstream maps, baseline log refs | **keep**; **remove now** if ref is write-only dead; **unclear** → usage grep in O5:2. |
| **Effects** | Baseline logs, `__NEXORA_DEBUG__` mirrors, ingestion, parity, chat finalize wiring | **keep** where contract-critical; **move later** if a dedicated effect module helps; **remove now** if no-op / duplicate of controller diagnostics. |
| **Memoized values** | `chatPipelineSendTextDeps`, `chatPipelineBridges`, panel props blobs, `visible*` snapshots | **keep**; **move later** by splitting builders into `homeScreen*Deps.ts` (optional). |
| **Callbacks** | `useCallback` clusters for shell-only UX vs deps fed into controllers | **keep**; dedupe only when identical to controller export. |
| **Render sections** | Main JSX tree, panel host, scene shell, command assistant | **keep** (O5 does not move UI). |
| **Dev logs** | O1–O4 baselines, `emitSceneApplyDiagnostic` / `emitChatPipelineDiagnostic` upstream callers | **keep** dev-only + deduped; **remove now** duplicate labels only. |
| **Temporary O1–O4 comments** | Boundary / “complete” lines at hook sites | **O5:6** trimmed redundant duplicate panel boundary lines; keep unique **O1/O2/O3/O4** anchors. |

### O5 risk checklist

After each O5 cleanup PR, verify:

- [ ] **No Type-C regression** — core object, scenarios, sandbox / execution paths unchanged.
- [ ] **No scene reset** — hydrate, dedupe, workspace empty rules unchanged.
- [ ] **No panel flash** — authority ordering + write meta unchanged.
- [ ] **No chat duplicate messages** — single **`sendText`**, append semantics unchanged.
- [ ] **No stale chat overwrite** — seq / run id / finalize behavior unchanged.
- [ ] **No dashboard spam** — dev logs remain deduped / dev-only.
- [ ] **No missing bridge refs** — Type-C scene ref, panel authority refs, chat bridges still wired.
- [ ] **No render-time diagnostics** — new logs only in `useEffect` or dev-gated callbacks.
- [ ] **No dead imports** — TypeScript / eslint clean for touched lines.
- [ ] **No circular imports** — shell → hooks → libs only; hooks do not import `HomeScreen`.

### O5 extraction / cleanup order (recommended)

1. **O5:1** — Final HomeScreen Slim-Down **Inventory + Baseline** (**complete** — this section + **`[Nexora][HomeScreenSlimDown][O5Baseline]`** + O5 boundary comment).
2. **O5:2** — **Remove dead imports / dead refs / dead comments** (**complete** — see **O5:2** bullets above; **`npx tsc --noEmit`**: no errors on **`HomeScreen.tsx`** in filtered output).
3. **O5:3** — **Reorder controller hook call site blocks** (**complete** — O5 controller banner; scene apply **before** Type-C; right panel + chat marked + kept after deps; **`tsc`** clean for **`HomeScreen.tsx`** in filtered output).
4. **O5:4** — **Reduce remaining inline effects** (**complete** — removed no-op **`void extractionPlan`** / chat smoke **`useEffect`**s; merged Type-C **`__NEXORA_DEBUG__`** mirrors; **`// O5 keep:`** on baselines + mode log + Type-C core bootstrap; **`tsc`** clean for **`HomeScreen.tsx`** in filtered output).
5. **O5:5** — **AI usage documentation + final regression** (**complete** — superseded by **## Final AI Usage Guidance** below + existing O5 risk checklist).
6. **O5:6** — **Optional final shell cleanup** (**complete** — **O5:6** section below + **`Final shell contract`** in **`HomeScreen.tsx`**; duplicate right-panel boundary comments trimmed; **`tsc`** clean for **`HomeScreen.tsx`** in filtered output).

### O5:6 — Optional final HomeScreen shell cleanup (**complete**)

O5:6 completed final **HomeScreen** shell cleanup. **HomeScreen** is the **shell / wiring / layout** layer; **controllers** own orchestration. Future feature work should **avoid** growing orchestration back into **HomeScreen** — extend **`useTypeCOrchestration`**, **`useSceneApplyController`**, **`useRightPanelController`**, or **`useChatPipelineController`** (or add a new bounded hook) instead.

- **Shell review:** one-line **shell surface** map at component top; **`Final shell contract`** under **O5 Shell Composition: Controllers**; concise **O3 / O4 complete** lines at panel + chat hooks; merged duplicate **O1 + O3** right-panel preamble into a single **O3 shell** line.
- **Cross-imports:** **`useTypeCOrchestration`**, **`useSceneApplyController`**, **`useRightPanelController`**, **`useChatPipelineController`** do **not** import **`HomeScreen`** (string / doc references only).

### O5 non-goals (unless a later prompt explicitly expands scope)

- Do **not** **move major logic** out of `HomeScreen.tsx` in **O5:1–O5:6** (slim-down + polish only unless a later prompt expands scope).
- Do **not** change **UI**, **routing**, **scene**, **panel**, **chat**, or **Type-C** **behavior**.
- Do **not** add **dependencies** or **circular imports**.
- Do **not** change **backend contracts** or **message schema**.

---

## Final AI Usage Guidance

For future work:

- **Type-C bugs** — inspect **`useTypeCOrchestration.ts`** (and **`useTypeCOrchestration.types.ts`**) first; **HomeScreen** only for Type-C **state** wiring and props into Type-C UI.
- **Scene write bugs** — inspect **`useSceneApplyController.ts`** first; **HomeScreen** for **`sceneJson`** / upstream dedupe refs and bridge **`useMemo`** only.
- **Panel flash / routing bugs** — inspect **`useRightPanelController.ts`** first; **HomeScreen** for **`rightPanelState`**, authority bridge refs, and **`RightPanelHost`** props.
- **Chat / `sendText` bugs** — inspect **`useChatPipelineController.ts`** first; **HomeScreen** for **`chatPipelineSendTextDeps`**, **`chatPipelineBridges`**, and chat **state** only.
- **HomeScreen** — treat as **wiring + layout + cross-zone composition**; avoid loading the full file unless the bug is explicitly shell-wide (multiple controllers) or render-only.

---

## QA:1 — Full HomeScreen Controller Regression Audit

**Date / scope:** Post **O1–O5** extraction + shell slim-down. **Method:** static verification (grep / read-path / `tsc` on controller + **`HomeScreen`** surfaces) + inventory cross-check. **Not executed:** full app manual QA in this pass — use the checklist below in a browser build.

**QA:1 non-goals:** no new features, no controller redesign, no **HomeScreen** rewrite, no state ownership moves, no UI/routing/backend contract changes, no new dependencies, no intentional circular imports.

### 1. Controller ownership boundaries

| Check | Result |
|--------|--------|
| **HomeScreen** as shell (state, **`useMemo`** deps, controller calls, JSX) | **Pass** — **`Final shell contract`** + **O5** banner document intent; orchestration delegated to four hooks. |
| **Controllers** own orchestration | **Pass** — Type-C callbacks in **`useTypeCOrchestration`**; **`applySceneChangeSafe`** in **`useSceneApplyController`**; **`openRightPanel` / `closeRightPanel`** in **`useRightPanelController`**; **`sendText`** + **`createChatPipelineSendText`** in **`useChatPipelineController`**. |
| **No `import HomeScreen` from controllers** | **Pass** — grep **`app/screens/hooks`** for **`HomeScreen`** module imports: **none**. |
| **Circular controller imports** | **Pass** (static) — controllers depend on **`app/lib/*`**, types, and peers via **callbacks passed from shell**, not on each other’s hook modules. **Watch:** future refactors must not import **`HomeScreen`** or cross-import hooks. |

**Violations:** none found in static audit.

### 2. Scene Apply Controller integrity

| Check | Result |
|--------|--------|
| Single **`applySceneChangeSafe`** implementation | **Pass** — one **`useCallback`** in **`useSceneApplyController.ts`** (~L182); **HomeScreen** destructures from **`sceneApplyController.callbacks`** only. |
| Dedupe / destructive-reset / diagnostics | **Pass** (by contract) — hook owns **`emitSceneApplyDiagnostic`**, JSON dedupe, workspace/panel skip paths per **O2** inventory; **HomeScreen** still passes shared upstream/reset refs as designed. |
| **Type-C** scene bridge | **Pass** — **`sceneApplyBridgeRefs.applyTypeCSceneUpdateRef`**; hook assigns bridge in **`useEffect`** (not render). |
| **Render-time `setSceneJson`** | **Pass** (intended) — mutations go through **`applySceneChangeSafe`** from callbacks/effects, not from arbitrary render paths audited here. |

### 3. Right Panel Controller integrity

| Check | Result |
|--------|--------|
| **`openRightPanel` / `closeRightPanel`** canonical impl | **Pass** — defined in **`useRightPanelController.ts`**; **HomeScreen** uses **`rightPanelController.callbacks`** (no local duplicate **`const openRightPanel`**). |
| Dedupe / anti-flash | **Pass** (by contract) — hook owns request sig refs + authority bridge interaction per **O3** docs. |
| **`RightPanelHost`** | **Pass** (architecture) — remains consumer of shell-provided props; routing libs under **`frontend/lib/ui/right-panel/*`** unchanged by this audit. |

### 4. Chat Pipeline Controller integrity

| Check | Result |
|--------|--------|
| Single **`sendText`** | **Pass** — **`useCallback`** in **`useChatPipelineController.ts`**; **HomeScreen** has **no** parallel **`sendText`** definition. |
| **`dispatchChat*Bridge`** | **Pass** — **`dispatchChatSceneBridge`**, **`dispatchChatPanelBridge`**, **`dispatchChatTypeCBridge`** used from **`createChatPipelineSendText`**. |
| Stale-run / dup prompt / diagnostics | **Pass** (by contract) — refs + **`emitChatPipelineDiagnostic`** on **`sendTextDeps`**; dev **`console.info`** for BridgeDispatch/Diagnostic/HookSkeletonReady only (not render-loop audited). |

### 5. Type-C orchestration integrity

| Check | Result |
|--------|--------|
| Callbacks from **`useTypeCOrchestration`** | **Pass** — **HomeScreen** destructures large **`callbacks`** object; state remains on shell. |
| Bridges **`applyTypeCSceneUpdateRef`**, **`openTypeCSimPanelRef`** | **Pass** — passed into Type-C hook + panel **`rightPanelBridgeRefs`**. |
| **Manual:** War Room / compare / execution / alerts | **Pending** — requires runtime QA (see checklist). |

### 6. Bridge architecture

| Bridge | Result (static) |
|---------|------------------|
| **chat → scene** | **Pass** — bridges object includes **`applySceneChangeUpstreamDedup`**, **`applyUnifiedSceneReactionUpstreamDedup`**, **`applySceneChangeSafe`** wrapper in **`chatPipelineBridges`**. |
| **chat → panel** | **Pass** — **`requestPanelAuthorityOpen`**, **`openRightPanel`**, **`closeRightPanel`**. |
| **chat → Type-C** | **Pass** — **`applyTypeCChatIntent`**. |
| **Type-C → scene** | **Pass** — ref **`applyTypeCSceneUpdateRef`** wired by scene hook **`useEffect`**. |
| **Type-C → panel** | **Pass** — **`openTypeCSimPanelRef`** in **`rightPanelBridgeRefs`**. |
| **scene → panel** (if any) | **N/A** in dedicated chat bridge object — panel opens from chat/Type-C/authority paths in shell; no violation flagged. |

### 7. Anti-loop protections

- **Dedupe / signature refs** remain on **HomeScreen** for chat + scene upstream + panel (per **O4:8** / **O2** / **O3** inventory); controllers consume them via **`sendTextDeps`** / hook inputs. **Watch:** any new effect must not re-open panels or re-apply scene without checking existing sig refs.
- **O5:4** removed no-op **`void extractionPlan`** effects only — no anti-loop regression expected.

### 8. Diagnostics architecture

- **Baselines** (**O1–O5**, TypesReady): mount-once, ref-guarded, dev-only — **Pass** (per **O5:4** + **O5 keep** comments).
- **Chat / scene / panel** typed diagnostics live in controllers or **`emit*Diagnostic`** callbacks — **Pass** (architecture). **Watch:** **`eslint`** reports **`react-hooks/exhaustive-deps`** warnings in **`useChatPipelineController.ts`** (missing **`input`** in some dependency arrays) — **0 errors**, behavior unchanged by audit; optional cleanup later.

### 9. HomeScreen size & maintainability (estimate)

| Metric | Note |
|--------|------|
| **Line count** | **`HomeScreen.tsx`** ~**17.5k** lines — still large, but orchestration **density** reduced vs pre-O1 monolith; primary win is **bounded files** for Type-C / scene / panel / chat. |
| **AI context** | Agents should default to **four controller files** + **shell call sites** (**`## Final AI Usage Guidance`**) instead of full **HomeScreen** for most bugs. |
| **Future** | Further shrink = **O6+** or new extractions (ingestion, persistence) — out of scope for **QA:1**. |

### 10. Automated checks (this run)

| Command | Result |
|---------|--------|
| **`npx tsc --noEmit`** (filtered for **`HomeScreen`**, **`useTypeCOrchestration`**, **`useSceneApplyController`**, **`useRightPanelController`**, **`useChatPipelineController`**) | **No diagnostics** on those paths in filtered output. **Note:** full-repo **`tsc`** may still report unrelated errors elsewhere. |
| **`npm run lint`** on four controller hooks | **0 errors**; **30 warnings** in **`useChatPipelineController`** (`exhaustive-deps` / **`input`**) — document under **WATCH**. |
| **`npm test`** | **Not defined** in **`frontend/package.json`** (only **`test:b3-pipeline-status`** and app-specific scripts). |

### Final regression report (QA:1)

#### PASS

- Controller **ownership** and **single canonical implementations** for **`applySceneChangeSafe`**, **`openRightPanel` / `closeRightPanel`**, **`sendText`**.
- **No `HomeScreen` imports** from controller hook modules (static).
- **Chat bridge dispatch** centralized in **`useChatPipelineController`** with explicit **`dispatchChat*Bridge`** helpers.
- **Scene ↔ Type-C** ref bridge wiring pattern preserved.
- **O5** shell comments + **Final AI Usage Guidance** support regression triage.

#### WATCH

- **`HomeScreen.tsx`** still **very large** — wiring regressions remain possible when touching unrelated zones.
- **`eslint` `react-hooks/exhaustive-deps`** warnings in **`useChatPipelineController`** — review if changing **`sendText`** closure behavior.
- **Full-repo TypeScript** health not guaranteed by filtered **`tsc`**.

#### FUTURE CLEANUP

- Optional: resolve **`exhaustive-deps`** warnings in chat hook where intentional.
- Optional: split **`chatPipelineSendTextDeps`** / **`homeScreen*`** builders into modules (non-behavior).
- Optional: targeted **`npm run test:b3-pipeline-status`** or E2E when available.

### Manual regression checklist (browser)

**Scene:** scene loads · no reset · no duplicate writes · selection stable  

**Right panel:** open/close · no flash · no dashboard spam · no duplicate opens  

**Chat:** send/respond · no duplicate messages · no stale overwrite · loading clears  

**Type-C:** War Room · compare · simulation · execution state  

**Bridges:** chat→scene · chat→panel · chat→Type-C · Type-C→panel  

**General:** no repeated logs · no render-time warnings · no hook-order warnings · no circular import crash  

---

## QA:2 — Loop / Flash / Stress Stability

**Scope:** Stress-oriented QA + static loop/flash risk review after **O1–O5**. **Non-goals:** no architecture redesign, no new features, no ownership moves, no UI/routing/backend changes, no new dependencies (**QA:2 non-goals** mirror **QA:1**).

**Optional dev marker (removed in QA:4):** Previously **`[Nexora][QA][StressAuditReady]`** in **`HomeScreen.tsx`** — dropped as redundant with post-stabilization observability.

### Stress-test checklist (manual — browser)

| Category | Exercises |
|----------|-----------|
| **Panel stress** | Rapid same-panel open; rapid view switches; rapid dashboard open/close; panel open during scene update / chat response / Type-C action. |
| **Scene stress** | Rapid object clicks; chat-driven scene updates; Type-C-driven updates; burst **`applySceneChangeSafe`** paths (ingestion/demo off unless you use them). |
| **Chat stress** | Burst sends; identical prompts; send during loading; chat while panel animates; chat while scene mutates. |
| **Bridge stress** | chat→scene→panel; Type-C→panel→scene; selection→chat; scene click→panel→chat. |
| **Type-C stress** | War Room, compare, simulation, execution, alerts/memory toggles under rapid UI use. |
| **Diagnostics stress** | DevTools console: no identical log storms; no render-phase **`console.*`** from chat/scene/panel paths during a stress burst. |

### Repeated effect / bridge triggers (static audit)

| Location | Pattern | Risk note |
|----------|---------|-----------|
| **`useSceneApplyController`** | **`useEffect`** assigns **`typeCBridgeRef.current = applySceneChangeSafe`**; deps include bridge ref + stable **`apply`**. No mount skeleton logs after **QA:4**. | **Low** — standard bridge contract; cleanup clears if same fn. |
| **`useRightPanelControllerBridgeWiring`** | Effect assigns **`typeCOpenSimPanelRef.current`**; deps **`[openSimPanel, bridgeRefs?.typeCOpenSimPanelRef]`**. | **Watch** — if **`openSimPanel`** identity churns every render without **`useCallback`** upstream, bridge could thrash + diagnostic spam; verify **`openSimPanel`** stable in **HomeScreen**. |
| **`useChatPipelineController`** | No mount **`useEffect`** in hook after **QA:4**; diagnostics deduped in **`emitChatPipelineDiagnostic`**. | **Low** for mount churn. |
| **`useChatPipelineController`** | Multiple **`useCallback`** blocks with **`eslint-disable`** / missing **`input`** in deps (**QA:1 WATCH**). | **Watch** — stale closure risk only if **`input`** semantics change without updating deps; do not “fix” blindly without tests. |
| **`HomeScreen.tsx`** | ~**100** `useEffect` hooks; many dependency arrays include objects from **`useMemo`** or inline shapes. | **Watch** — classic source of **effect churn** if memos are not referentially stable; stress manual passes should watch **panel flash** and **repeated scene writes**. |

**Violations found in static pass:** none (no obvious render-time **`ref.current =`** in audited controller snippets beyond documented bridges).

### Diagnostics spam (review)

| Class | Verdict |
|-------|---------|
| **O1–O5 mount baselines**, TypesReady, HookSkeletonReady | **Removed in QA:4** — see **## QA:4**. |
| **`[Nexora][ChatPipeline][BridgeDispatch]`** / **`[Nexora][ChatPipeline][Diagnostic]`** | **QA:4:** success **`BridgeDispatch`** + most **`Diagnostic`** events → **`debug`**; critical subset stays **`info`** (see **QA:4** table). Loop storms → **HIGH RISK** symptom. |
| **`[NEXORA_RIGHT_PANEL_WRITE]`** etc. | **Acceptable** when state actually changes; **noisy** if fired in a tight loop during stress — investigate **`setRightPanelState`** / authority path. |
| **`[Nexora][QA][StressAuditReady]`** | **Removed (QA:4)** — was presence-only. |

**Further log changes:** see **## QA:4** inventory (this stress section predates **QA:4** cleanup).

### Ref stability (audit)

- **Bridge refs** (`applyTypeCSceneUpdateRef`, `panelAuthorityOpenBridgeRef`, `typeCOpenSimPanelRef`, …): **stable `useRef` objects** from shell; **`.current` mutations in `useEffect`** in controllers — OK.
- **Signature / dedupe / active-run refs** (chat + scene upstream maps): **owned in shell**, passed into controllers — **must not** be recreated each render (they are **`useRef`**) — **Pass**.
- **Watch:** any future refactor that replaces a ref with **`useMemo(() => ({ current: ... }))`** per render would be **HIGH RISK**.

### PASS / WATCH / HIGH RISK (stress lens)

#### PASS

- Canonical **single implementations** for scene apply, panel open/close, **`sendText`**; **bridges** explicit in chat + scene + panel wiring.
- Controller **bridge `useEffect`** patterns match **O2/O3** contracts (assign + cleanup).
- **QA:2** stress marker removed in **QA:4**; controller wiring verified by runtime diagnostics instead.

#### WATCH

- **`HomeScreen`** effect surface area + **`chatPipelineSendTextDeps`** size — primary place for **unstable deps** if memos regress.
- **`useRightPanelControllerBridgeWiring`** sensitivity to **`openSimPanel`** reference identity.
- **`eslint` exhaustive-deps` warnings** in **`useChatPipelineController`**.

#### HIGH RISK (symptoms to hunt in manual stress)

- **Panel flash** / **disappear** with no user intent change.
- **Destructive scene clear** after benign actions.
- **Duplicate assistant** rows or **stale** assistant overwriting newer turn.
- **Bridge dispatch** or **routing** logs repeating **>5/s** during one user gesture.

### Automated checks (this change)

| Command | Result |
|---------|--------|
| **`npx tsc --noEmit`** | **Repo-wide:** may fail on unrelated modules (current tree has many pre-existing errors). **QA:2 scope:** `rg` filter on **`HomeScreen.tsx`** + **`useSceneApplyController`** + **`useRightPanelController`** + **`useChatPipelineController`** + **`useTypeCOrchestration`** shows **no** `tsc` lines — those paths typecheck in isolation. |
| **`npm run lint -- app/screens/HomeScreen.tsx`** | **Pre-existing** errors/warnings on **`HomeScreen`** (e.g. **`no-explicit-any`**, exhaustive-deps); **QA:2** did not introduce new lint issues on the stress marker (IDE clean on **`HomeScreen.tsx`**). |
| **`npm test`** | As in **QA:1** — no default **`npm test`**; use package scripts when needed. |

### Manual stress checklist (abbrev)

**Panel:** rapid open/close · no flash/disappear · no dashboard spam  

**Scene:** rapid clicks · no destructive reset · no duplicate writes  

**Chat:** rapid send · no dup assistant · no stale overwrite · loading stable  

**Type-C:** War Room / simulation / compare stable under rapid use  

**Bridges:** no recursive loops · no dispatch storms · no ownership fights  

**General:** no render/hook warnings · no console spam · no freeze  

---

## QA:3 — Type-C End-to-End Smoke Test

**Scope:** End-to-end validation of **Type-C** after **O1–O5** and **QA:1–QA:2**. **Non-goals:** no Type-C redesign, no new features, no ownership moves, no UI/routing/backend changes, no new dependencies, no circular imports.

**Optional dev marker (removed in QA:4):** Previously **`[Nexora][QA][TypeCSmokeTestReady]`** — dropped as redundant.

### Smoke categories (manual — browser)

| Category | What to verify |
|----------|----------------|
| **Scenario lifecycle** | **`createTypeCScenarioDraft`** · drafts list · **`cancelTypeCScenarioDrafts`** / cancel paths · **`activeTypeCScenario`** stable · **`applyTypeCScenarioStatusIntent`** (`select` / `ignore` / `ready_for_decision`). Stress: multiple drafts, rapid switch, cancel, reopen. |
| **Simulation lifecycle** | **`activeSimulation`** stable · **`exitTypeCScenarioSimulation`** · panels stay aligned · **no** destructive scene reset · **no** duplicate overlays. Check simulation → **panel** (`openTypeCSimPanelRef` / **`useRightPanelControllerBridgeWiring`**) → **scene** (`applyTypeCSceneUpdateRef` / **`useSceneApplyController`**) → decision recommendation read model. |
| **Compare lifecycle** | **`compareTypeCScenarioDrafts`** · compare panel · data stable · **`closeTypeCScenarioCompare`** · **no** stale comparison after close. Stress: repeat compare, swap targets, close/reopen. |
| **Execution lifecycle** | **`handleStartTypeCExecution`** · pause / resume / stop · **`executionState`** / **`executionScenario`** synchronized. Stress: start/stop bursts, rapid pause/resume, execution during panel/scene churn. |
| **Panel bridge integrity** | Type-C → **`openTypeCSimPanelRef`** → **`openSimPanel`**; **no** duplicate opens · **no** dashboard overwrite · **no** War Room flash. |
| **Scene bridge integrity** | Type-C → **`applyTypeCSceneUpdateRef`** → **`applySceneChangeSafe`**; **no** signature storms · **no** stale scene after Type-C exit. |
| **Chat bridge integrity** | Indirect only: chat must not fight Type-C panel/scene ownership; combined flows (chat during Type-C sim) per **QA:2** bridge stress. |

### War Room (focused)

- **`openTypeCScenarioDraftWarRoom`** / **`openBestTypeCScenarioInWarRoom`** open the expected **right panel** view; **selected scenario** and panel context stay coherent.
- Stress: open/close loop, rapid scenario switch, open during scene update or chat send — expect **no** flash, **no** duplicate panel open.

### Decision + executive workflow

- **`refreshTypeCDecisionReadiness`** returns stable snapshots when inputs unchanged.
- **`createTypeCDecisionDraft`**, **`createTypeCExecutiveSummary`**, **`enhanceTypeCExecutiveSummary`** / AI paths: **no** stale readiness after scenario changes; recommendation read model stable across compare/sim transitions.

### Alerts / memory

- Alerts render; **`handleAcknowledgeTypeCAlert`**, **`handleClearTypeCAlerts`**; memory stable; **`handleClearTypeCMemory`**. Watch for duplicate memory entries or alert storms from orchestration loops (symptom → **HIGH RISK**).

### Bridge integrity (static)

| Bridge | Owner assignment | Risk |
|--------|------------------|------|
| **Type-C → scene** | **`useSceneApplyController`** `useEffect` → **`typeCBridgeRef.current`** | **Low** when deps stable. |
| **Type-C → panel** | **`useRightPanelControllerBridgeWiring`** → **`typeCOpenSimPanelRef.current = openSimPanel`** | **Watch** — **`openSimPanel`** identity stability (**QA:2**). |
| **Chat ↔ Type-C** | Via **`HomeScreen`** wiring only; no direct Type-C import in chat hook. | **Watch** on combined UX, not circular imports. |

**Render-time bridge assignment:** none intended — bridge **`.current`** writes live in **`useEffect`** in controllers (**QA:2** audit).

### Type-C diagnostics

| Useful (dev) | Noisy / future cleanup |
|--------------|------------------------|
| **`[Nexora][TypeC][HookSkeletonReady]`** | **Removed (QA:4)** — use lifecycle **`info`** + **`debug`** skip logs below. |
| Extraction plan / TypesReady style logs | Duplicate simulation or compare logs same signature |
| Pipeline / dedupe diagnostics when debugging | Render-phase **`console.*`** in hot paths |

**Further log changes:** see **## QA:4** inventory.

### PASS / WATCH / HIGH RISK (Type-C smoke lens)

#### PASS

- **`useTypeCOrchestration`** exposes the full **`TypeCOrchestrationCallbacks`** map (**`useTypeCOrchestration.types.ts`**); **HomeScreen** composes state + refs; **scene** and **panel** bridges match **O2/O3** contracts.
- **QA:3** mount marker removed in **QA:4**; Type-C contract remains in **`useTypeCOrchestration.types.ts`** + manual smoke.

#### WATCH

- **`HomeScreen`** size + effect fan-out around Type-C + panel + scene intersections.
- **`openSimPanel`** / **`openTypeCSimPanelRef`** timing vs first War Room open (bridge assigns in **`useEffect`**, not render).

#### HIGH RISK (symptoms — manual confirmation)

- War Room **fails to open** or opens wrong view; **compare** stuck or stale after close; **simulation** clears scene or stacks overlays; **execution** desync from UI; **bridge** or **routing** log storms.

### Automated checks

Same as **QA:2**: full **`npx tsc --noEmit`** may fail elsewhere; filter **`HomeScreen.tsx`** + **`useTypeCOrchestration.ts`** + **`useTypeCOrchestration.types.ts`** + scene/panel/chat controllers for **zero** matching diagnostics. **`npm run lint -- app/screens/HomeScreen.tsx`** — pre-existing noise; **QA:3** marker should not add IDE issues.

### Manual Type-C smoke checklist (abbrev)

**Scenarios:** create · switch · cancel  

**War Room:** opens · stable under rapid use · no flash  

**Compare:** open · stable · close/reopen  

**Simulation:** stable · no duplicate overlays · no scene reset  

**Decision:** readiness · executive summary · recommendation stable  

**Execution:** start/pause/resume/stop · state synchronized  

**Alerts/memory:** ack/clear stable · memory stable  

**General:** no log spam · no bridge loops · no render warnings · no controller fights  

---

## QA:4 — Observability + Debug Cleanup

**Scope:** Reduce **O1–O5 / QA** startup and hot-path **console noise** without removing **guards**, **dedupe**, or **severity** diagnostics. **Non-goals:** no architecture or controller behavior changes, no UI/routing/backend changes, no new dependencies.

### Inventory (tags)

| Tag / area | Decision | Notes |
|------------|------------|-------|
| **`[Nexora][HomeScreenOptimize][Track]`** (module load) | **REMOVE** | One-shot migration banner. |
| **`[Nexora][HomeScreenOptimize][Baseline]`**, **`[Nexora][SceneApply][O2Baseline]`**, **`[Nexora][RightPanel][O3Baseline]`**, **`[Nexora][ChatPipeline][O4Baseline]`**, **`[Nexora][HomeScreenSlimDown][O5Baseline]`**, TypesReady cluster, **`[Nexora][TypeC][ExtractionPlanReady]`** | **REMOVE** | Redundant after extraction stabilization; superseded by runtime diagnostics. |
| **`[Nexora][QA][StressAuditReady]`**, **`[Nexora][QA][TypeCSmokeTestReady]`** | **REMOVE** | QA:2/QA:3 presence-only markers; duplicated shell signal. |
| **`[Nexora][SceneApply][HookSkeletonReady]`**, **`[Nexora][SceneApply][SafetyRefsOwned]`** | **REMOVE** | Migration skeleton / meta ownership logs. |
| **`[Nexora][RightPanel][HookSkeletonReady]`**, **`[Nexora][ChatPipeline][HookSkeletonReady]`**, **`[Nexora][TypeC][HookSkeletonReady]`** | **REMOVE** | Same. |
| **`[Nexora][QA][ArchitectureStable]`** (QA:5, once) | **KEEP** | Optional single-line **shell composition** closure after **O1–O5** + **QA:1–QA:4**. |
| **`[Nexora][SceneApply][BridgeConnected]`** (once per bridge name) | **KEEP** | Confirms Type-C → scene bridge wiring without per-tick spam. |
| **`emitSceneApplyDiagnostic`** — **`destructive_reset_blocked`**, **`WorkspaceSceneClearBlocked`**, **`SceneParity][SceneResetCandidate`**, **`duplicate_scene_write_skipped`**, **`apply_skipped`** (narrow paths) | **KEEP** | Anti-destructive-reset + dedupe visibility. |
| **`[SceneApply]`** commit line | **REDUCE** | Now **`console.debug`** (was **`console.log`**). |
| **`emitRightPanelDiagnosticDev`** / panel audits in **HomeScreen** | **KEEP** | Anti-flash / authority / routing failures unchanged. |
| **`[Nexora][ChatPipeline][BridgeDispatch]`** success path | **REDUCE** | **`console.debug`**; **missing bridge** → **`console.warn`**. |
| **`[Nexora][ChatPipeline][Diagnostic]`** | **REDUCE** | **`stale_response_ignored`**, **`request_failed`**, **`duplicate_prompt_skipped`** → **`console.info`**; other events → **`console.debug`** (dedupe unchanged). |
| **`[Nexora][TypeC][PipelineEvent]`**, readiness snapshots, **`*Skipped`**, scenario status / selection **`console.log`** | **REDUCE** | **`console.debug`** for high-volume / skip paths. |
| **`[Nexora][TypeC][DecisionDraftCreated]`**, **`ExecutiveSummaryCreated`**, **`ScenarioDraftCreated`**, **`AIExecutiveInsightCreated`**, War Room / compare / sim exit / execution / alerts | **KEEP** | **`console.info`** for meaningful lifecycle (or unchanged **`info`**). |
| Sandbox strategy review/compare/promote | **REDUCE** | **`console.debug`**. |
| **`HOMESCREEN_OPTIMIZATION_TRACK` constant** | **REMOVE** | Unused after baseline removal. |

### KEEP (summary)

- Scene: **destructive / workspace clear block**, **reset candidate** warnings, **duplicate write** skip, **semantic dedupe**, **bridge connected** (once per name).
- Panel: **existing** **`emitRightPanelDiagnosticDev`** + **HomeScreen** routing / flash / authority **warn**/**error** paths.
- Chat: **stale response ignored**, **request failed**, **duplicate prompt skipped** at **info**; bridge **failure** at **warn**.
- Type-C: **meaningful lifecycle** **`info`** (War Room open, comparison, execution, AI/sandbox completion, alerts/memory clears).

### REDUCE (summary)

- Chat: bulk **`Diagnostic`** + successful **`BridgeDispatch`** → **debug**.
- Scene: **`apply_committed`** → **debug**.
- Type-C: pipeline + skips + sandbox strategy clicks → **debug**.

### REMOVE (summary)

- All **mount-once extraction / QA presence** **`console.info`** blocks removed from **`HomeScreen.tsx`**.
- Controller **HookSkeleton** / **SafetyRefs** mount logs removed from **scene / right-panel / chat / Type-C** hooks.
- **`HOMESCREEN_OPTIMIZATION_TRACK`** + module-load **Track** log removed.

### FUTURE DEBUG FLAGS

- Optional **`NEXORA_DEBUG_SCENE=1`** / **`NEXORA_DEBUG_TYPEC=1`** style gates if **verbose** pipeline / readiness traces are needed again without default console noise.

### Logging philosophy (Nexora)

Nexora diagnostics should:

- **Protect** architecture integrity (guards, rejections, blocked destructive paths).
- **Detect** loops, flash, stale responses, and ownership conflicts — at **info**/**warn**, not hidden.
- **Avoid** render-time **`console.*`** and default **Info**-level flooding; prefer **`debug`** for high-volume success/skip paths.
- **Stay** **`NODE_ENV !== "production"`**-gated where not already severity-only.

### Automated checks

| Command | Result |
|---------|--------|
| **`npx tsc --noEmit`** (filter **`HomeScreen.tsx`** + four controllers) | Expect **no** matching error lines. |

### Manual observability checklist (abbrev)

**General:** readable console · no startup wall · no identical **info** spam  

**Scene:** destructive block still visible · duplicate write still visible  

**Panel:** flash / dashboard guards still visible  

**Chat:** stale ignore + dup prompt still **info** · bridge failure **warn**  

**Type-C:** War Room / execution / errors still traceable at **info**  

**QA:** loop symptoms still surfaced via **warn**/**error** + critical **info**  

---

## QA:5 — Final Architecture Stability Report

**Scope:** Consolidated stability review after **O1–O5** and **QA:1–QA:4**. **Non-goals:** no redesign, no feature work, no ownership moves, no UI/routing/backend changes, no new dependencies, no circular imports.

**Optional dev marker:** **`[Nexora][QA][ArchitectureStable]`** in **`HomeScreen.tsx`** (once per mount, dev-only, **`useEffect`** + ref guard; payload: **`hasSceneController`**, **`hasRightPanelController`**, **`hasChatController`**, **`hasTypeCController`**, **`qaCompleted: true`**).

### 1. Final ownership audit

| Layer | Owns | Does not own |
|-------|------|----------------|
| **`HomeScreen`** | React **state** for scene, panels, chat, domain, selection, workspace, ingestion toggles, etc.; **refs** for dedupe / audits / bridges; **`useMemo`** wiring objects passed into controllers; **authority** **`requestPanelAuthorityOpen` / `Close`** and **`applyPanelControllerRequest`**; **composition** of the four hooks in stable order. | Canonical **`applySceneChangeSafe`** implementation (delegates to **`useSceneApplyController`**); canonical **`sendText`** ( **`useChatPipelineController`** ); **`openRightPanel` / `closeRightPanel`** implementations ( **`useRightPanelController`** ); Type-C **pure** scenario/decision math ( **`lib/typec/*`** + **`useTypeCOrchestration`** callbacks). |
| **`useTypeCOrchestration`** | Type-C **callbacks** + **read model** shape; **refs** (`lastTypeCSignatureRef`, pipeline, executive panel hints); **dev diagnostics** on lifecycle; **effect** for execution-driven alert refresh. | **`sceneJson` / `setSceneJson`**; **`rightPanelState`**; **`messages`** — receives setters + bridge **refs** from shell. |
| **`useSceneApplyController`** | **`applySceneChangeSafe`**, dedupe/safety **refs**, **`emitSceneApplyDiagnostic`**, Type-C **bridge** `useEffect` → **`applyTypeCSceneUpdateRef`**. | **`setSceneJson`** definition lives in shell but is **injected**; consumers never reimplement apply. |
| **`useRightPanelController`** | **`openRightPanel` / `closeRightPanel`**, dedupe **refs**, **`emitRightPanelDiagnostic`**, **`getActivePanelId` / `isPanelOpen`**. | Panel **React state**; **`openSimPanel`** definition — shell provides; **`useRightPanelControllerBridgeWiring`** assigns **`typeCOpenSimPanelRef`**. |
| **`useChatPipelineController`** | **`sendText`** lifecycle, **`emitChatPipelineDiagnostic`**, bridge **dispatch** helpers, message helpers. | **Messages state**; bridge **implementations** — passed via **`bridges`** from shell. |
| **Render / UI** (`RightPanelHost`, `SceneRenderer`, panels, chat UI) | **Presentation**: props, local UI state, no orchestration ownership. | Cross-cutting **write** paths to scene/panel/chat without going through shell/controller contracts. |

**Confirmed:** orchestration **logic** lives in **controllers** + **`lib/*`**; **HomeScreen** is primarily **shell composition**; UI remains **consumer-oriented**.

### 2. Final bridge audit

| Bridge | Mechanism | Ownership |
|--------|-----------|-----------|
| **Chat → scene** | **`chatPipelineBridges`** → **`applySceneChangeSafe`** / upstream dedupe wrappers from shell. | Shell wires; chat controller **dispatches** only. |
| **Chat → right panel** | **`requestPanelAuthorityOpen`** / **`openRightPanel`** (and related) via **`bridges`**. | Same. |
| **Chat → Type-C** | **`runTypeCAction`** / **`applyTypeCChatIntent`** (as wired in **`HomeScreen`**). | Same. |
| **Type-C → scene** | **`applyTypeCSceneUpdateRef.current`** assigned in **`useSceneApplyController`** `useEffect` from **`applySceneChangeSafe`**. | Explicit **ref** contract; no import cycle (hook assigns **callback** from scene controller). |
| **Type-C → panel** | **`openTypeCSimPanelRef`** assigned in **`useRightPanelControllerBridgeWiring`** from **`openSimPanel`**. | Explicit **ref**; Type-C reads **`openTypeCSimPanelRef.current`**. |
| **Scene → panel** | Indirect: object clicks / chat intents → **HomeScreen** routing → **`useRightPanelController`**; no hidden scene hook → panel setter. | **No** `useSceneApplyController` → `setRightPanelState` chain. |

**Verified:** bridges are **explicit** (refs + injected callbacks); **no** controller imports **`HomeScreen`**; **circular dependency risk** remains **low** if **`lib/actions`** and **`HomeScreen`** stay acyclic (existing pattern: actions receive deps, not the whole screen).

### 3. Final anti-loop audit

| Risk | Primary protections | Residual watch |
|------|---------------------|----------------|
| **Stale chat runs** | **`activeRunIdRef`**, **`staleRunGuardRef`**, **`emitChatPipelineDiagnostic("stale_response_ignored")`** (**info**). | **`useChatPipelineController`** exhaustive-deps **WATCH** (QA:1) — stale closure if **`sendTextDeps`** drift without tests. |
| **Duplicate panel opens** | **`lastPanelRequestSigRef`**, **`lastOpenIntentRef`**, authority window + **`emitRightPanelDiagnosticDev`**. | **`openSimPanel`** identity churn → bridge re-run (**QA:2**). |
| **Dashboard spam** | Panel source priority, **`traceRightPanelPathAudit`**, analyze locks, **`DashboardOverrideCandidate`** warnings. | Large **`HomeScreen`** effect surface — regression risk if memos loosen. |
| **Duplicate scene writes** | Semantic + JSON signatures, **`duplicate_scene_write_skipped`**, upstream chat dedupe. | Hydration / workspace edge cases — **`SceneParity`** warnings. |
| **Panel flash** | Authority rank, click-intent lock, dedupe open signatures, right-panel diagnostics. | Same as dashboard spam. |
| **Duplicate assistant messages** | **`lastAssistantMessageSignatureRef`**, pipeline ordering in **`sendText`**. | Burst sends under slow network — manual E2E. |
| **Bridge storms** | Chat **250ms** dedupe on **`BridgeDispatch`**; diagnostic **220ms** dedupe; scene skip paths short-circuit **`console.debug`**. | Intent loops still diagnosable via **warn** if bridges missing. |
| **Destructive scene reset** | **`workspace_empty_payload_after_hydration`** block, **`WorkspaceSceneClearBlocked`**. | **Strongest** single guard on scene clear. |

**Strongest:** destructive workspace clear **block** + chat **stale-response** handling + panel **authority** dedupe.  
**Weakest (by surface area):** **`HomeScreen`** size and **chat** hook dependency hygiene — **process** risk, not known runtime bug.

### 4. Final observability audit

- **Kept (critical):** scene **destructive / duplicate / bridge-connected**; panel **diagnostics** + routing **errors**; chat **`stale_response_ignored`**, **`request_failed`**, **`duplicate_prompt_skipped`** (**info**); bridge **failure** **warn**; Type-C **lifecycle info** (War Room, execution, AI/sandbox completion).
- **Reduced (QA:4):** startup extraction baselines **removed**; hot-path **`debug`** for chat diagnostics, scene commits, Type-C skips/pipeline.
- **Future candidates:** env-flag **`NEXORA_DEBUG_*`** (see **QA:4**); optional sampling for **`emitRightPanelDiagnosticDev`** if panel traces grow.

**Verified posture:** diagnostics **dev-gated** or severity-only; **no** intentional render-time **`console.info`** in controllers; **no** repeated startup **info** wall after **QA:4**.

### 5. Maintainability assessment

- **Readability:** orchestration entry points are **four named hooks** + **`HomeScreenOptimizationInventory.md`**; easier than monolithic inline **`useCallback`** blocks pre-O1–O5.
- **Controller isolation:** each controller is a **single module** with typed **input/output**; shell passes **deps** only.
- **Scaling:** new intents → extend **`lib/actions`** + **`bridges`** without forking **`applySceneChangeSafe`**.
- **Onboarding / AI context:** agents can load **one controller file** + **inventory** instead of full **`HomeScreen`** for many tasks — **material** context savings (exact line count reduction varies by branch; **HomeScreen** remains large but **thinner** at orchestration seams).

### 6. Future risk assessment

#### LOW RISK

- Explicit **bridge refs**; **single** canonical write paths; **QA:4** observability baseline.

#### MEDIUM RISK

- **`HomeScreen`** still coordinates **many** domains (ingestion, workspace, demos) adjacent to controllers.
- **Shared** dedupe refs live on shell — correct but **dense**; edits need discipline.

#### HIGH RISK (future, not blocking)

- Further **splits** (e.g. ingestion-only shell) without **inventory** updates could re-blur ownership.
- **Production** observability not yet unified (dev **`console`** vs product analytics) — **Option B** below.

### 7. Future roadmap guidance

| Option | Theme | When to favor |
|--------|--------|----------------|
| **A — D3 Data Connectors** | API/CSV ingestion, connector orchestration | Data-driven demos and **workspace** fidelity are the bottleneck. |
| **B — Production Readiness** | Perf/memory, prod diagnostics, deploy hardening | Shipping a **narrow** Nexora SKU or external pilot. |
| **C — Type-C UX Polish** | Executive / War Room / visual hierarchy | Type-C is the **hero** differentiator for the next release. |
| **D — AI Layer Expansion** | Local routing, model orchestration, multi-agent | **Inference cost**, **latency**, or **governance** is the primary constraint. |

Recommended **default sequencing:** **B** (short prod-hardening pass) before **A** if external data touches **real** backends; **C** in parallel with **B** if UX debt blocks demos; **D** when product commits to **multi-model** strategy.

---

## FINAL ARCHITECTURE SUMMARY

### Architecture overview

```text
HomeScreen (shell: state + refs + authority + composition)
    ├── useTypeCOrchestration(state, setters, bridge refs, …)
    ├── useSceneApplyController(sceneJson, setSceneJson, bridgeRefs, …)
    ├── useRightPanelController(panel snapshot, authority bridges, …)
    │       └── useRightPanelControllerBridgeWiring(typeCOpenSimPanelRef, openSimPanel)
    └── useChatPipelineController(messages, bridges, sendTextDeps, …)
              ↓ explicit bridges (refs + callbacks)
    lib/scene · lib/ui/right-panel · lib/chat · lib/typec · lib/actions
              ↓
    Render/UI (RightPanelHost, SceneRenderer, chat UI, …)
```

### Controller ownership (one line each)

- **Type-C:** scenario / decision / sim / compare / execution / alerts / memory **orchestration** + **callbacks**.
- **Scene apply:** **all** scene JSON **writes** through **`applySceneChangeSafe`** + diagnostics + Type-C **ref** bridge.
- **Right panel:** **open/close** + **dedupe** + diagnostics; **Type-C sim** open via **ref** bridge.
- **Chat pipeline:** **`sendText`** + **stale-run** + **routing** + **bridge dispatch** + diagnostics.

### Bridge overview

Refs and injected callbacks only — **no** hidden globals for cross-domain writes; **Type-C ↔ scene** and **Type-C ↔ panel** are **effect-assigned** bridges (documented in **QA:2** / **QA:4**).

### Observability overview

**Severity-first** at **info**/**warn** for integrity breaks; **volume** at **debug** after **QA:4**; optional **`[Nexora][QA][ArchitectureStable]`** once per dev session for **composition sanity**.

### Nexora architecture philosophy

- **Controllers** own **orchestration** (mutations, sequencing, dedupe).
- **Render layers** **consume** state and callbacks; they do not own cross-domain write policy.
- **`HomeScreen`** is **shell composition**: wire hooks, pass **bridges**, keep **authority** and **workspace** rules explicit.
- **Bridges** are **explicit** (named refs and **`bridges`** objects).
- **Diagnostics** **protect** stability (anti-loop, anti-flash, anti-destructive-reset).
- **Scene / panel / chat** interactions must stay **anti-loop** and **anti-flash** safe by default.

### Automated checks

| Command | Result |
|---------|--------|
| **`npx tsc --noEmit`** (filter **`HomeScreen.tsx`** + `app/screens/hooks/{typec,scene,right-panel,chat}/**`) | Expect **no** matching error lines. |

### Final QA checklist (abbrev)

**Architecture:** controller ownership clear · shell stable · no circular **controller → HomeScreen** imports  

**Scene / panel / chat / Type-C / bridges / observability / general:** as **QA:1–QA:4** consolidated — no regressions introduced by this **documentation + optional marker** pass.

---

## Current Extraction Boundaries

Markers in `HomeScreen.tsx` locate each zone. Below: **concrete ownership** as of O1:2 (names are representative; grep the boundary comment for the live anchor).

### 1. Type-C Orchestration

**State (owned in this zone)**

- `typeCScenarioState` / `setTypeCScenarioState`
- `typeCDecisionReadiness`, `typeCDecisionDraft`, `typeCCommandExecutiveSummary`
- `typeCAIExecutiveInsight`, `typeCAIInsight`, `typeCAIInsightLoading`, `typeCAIInsightError`
- `typeCMultiAgentInsight`, `typeCMultiAgentLoading`, `typeCMultiAgentError`
- `typeCSandboxResult`, `typeCSandboxLoading`, `typeCSandboxError`
- `connectionSuggestions`, `scenarioDrafts`, `activeTypeCScenario`, `activeSimulation`
- `scenarioComparison`, `scenarioComparisonDrafts`, `decisionRecommendation`
- `executionState`, `executionScenario`, `typeCAlerts`, `typeCMemoryState`

**Refs**

- `lastTypeCSignatureRef`, `lastTypeCExecutiveActionPanelRef`, `typeCPipelineEventsRef`

**Related read-model (adjacent)**

- `typeCMode` (`useMemo` → `getNexoraMode()`), `nexoraMode` from `useNexoraOperatorMode()` — shared with shell; extraction must define whether the hook **owns** mode or **receives** it as a prop.

**Callbacks / effects (high level)**

- Scenario builder flows (`buildTypeCScenarioFromScene`, `selectTypeCScenario`, …), decision readiness refresh, executive summary builders, AI / multi-agent / sandbox request handlers, connection suggestion application (`applyTypeCConnectionSuggestionsToScene`), execution lifecycle (`startTypeCExecution`, `pauseTypeCExecution`, …), alerts and memory mutations, pipeline event tracking (`createTypeCPipelineEvent`, `trackTypeCPipelineEvent` pattern).
- Effects that **gate on `typeCMode === "type_c"`** and call `applySceneChangeSafe` for `ensureTypeCCoreObject` / Type-C scene mutations — **tight coupling** to Scene Apply; extraction order should treat “Type-C + scene side-effect” as a contract to preserve.

**External modules (`app/lib/typec/*`, plus)**

- `getNexoraMode`, `detectTypeCIntent`, `addTypeCObjectToScene`, `buildTypeCObjectDraft`, `ensureTypeCCoreObject`, `addTypeCSystemModeling`, scenario/comparison/execution/memory/alert builders, `typeCAIAdapter`, `typeCMultiAgentAdapter`, `typeCSandboxAdapter`, `routeTypeCExecutiveAction`, `typeCAdaptiveGuidance`, etc. (see import block in `HomeScreen.tsx`).

**Risk level:** **High** — crosses scene, panel opens from executive actions, and chat intents.

**Extraction difficulty:** **High** — largest state surface; many cross-boundary calls.

**Suggested target hook:** `useTypeCOrchestration`

**O1:4 — hook skeleton:** `app/screens/hooks/typec/useTypeCOrchestration.ts` exists. HomeScreen builds `TypeCOrchestrationState` / `TypeCOrchestrationRefs` via `useMemo` and calls `useTypeCOrchestration`; **no Type-C business logic had moved** before O1:5.

**O1:5 — scenario + decision callbacks:** The following now live in `useTypeCOrchestration` (HomeScreen passes `sceneJson`, `typeCMode`, orchestration state snapshot, refs, and setters; **state remains in HomeScreen**):

- `trackTypeCPipelineEvent`
- `refreshTypeCDecisionReadiness`
- `createTypeCDecisionDraft`
- `createTypeCExecutiveSummary`
- `createTypeCScenarioDraft`
- `applyTypeCScenarioStatusIntent`

**O1:6 — AI / sandbox / multi-agent callbacks:** The following now live in `useTypeCOrchestration`. HomeScreen still owns all Type-C state and supplies adapter request payloads (`typeCAIInsightRequest`, `typeCMultiAgentRequest`, `typeCSandboxRequest`), capability flags, and a `typeCExecutiveInsightContextRef` updated each render after focus + executive summary resolve (so the hook can stay above late selection hooks without changing behavior).

- `enhanceTypeCExecutiveSummary`
- `handleEnhanceTypeCExecutiveSummary`
- `handleGenerateTypeCAIInsight`
- `handleCloseTypeCAIInsight`
- `handleRunTypeCMultiAgent`
- `handleCloseTypeCMultiAgent`
- `handleRunTypeCSandbox`
- `handleCloseTypeCSandbox`
- `handleReviewTypeCSandboxStrategy`
- `handleCompareTypeCSandboxStrategy`
- `handlePromoteTypeCSandboxStrategy`

**O1:7 — connection / scenario drafts / simulation / comparison:** The following now live in `useTypeCOrchestration`. HomeScreen still owns all Type-C state; scene mutations use `applyTypeCSceneUpdateRef` (**wired to `applySceneChangeSafe` in `useSceneApplyController`** via `useEffect` since O2:6), and War Room panel entry uses `openTypeCSimPanelRef` (**O3:6:** `useRightPanelControllerBridgeWiring` assigns `openSimPanel` into that ref in an effect). No scene-apply logic is duplicated in the hook.

- `cancelTypeCConnectionSuggestions`
- `cancelTypeCScenarioDrafts`
- `applyTypeCConnectionSuggestions`
- `openTypeCScenarioDraftWarRoom`
- `compareTypeCScenarioDrafts`
- `closeTypeCScenarioCompare`
- `openBestTypeCScenarioInWarRoom`
- `exitTypeCScenarioSimulation`

**O1:9 — execution / alerts / memory (complete):** The following live in `useTypeCOrchestration`, including the execution alert refresh interval (`useEffect` mirroring the prior HomeScreen effect). HomeScreen still owns `executionState`, `executionScenario`, `typeCAlerts`, and `typeCMemoryState` plus all setters.

- `handleStartTypeCExecution`
- `handlePauseTypeCExecution`
- `handleStopTypeCExecution`
- `handleAcknowledgeTypeCAlert`
- `handleClearTypeCAlerts`
- `handleClearTypeCMemory`

HomeScreen still owns Type-C state. `useTypeCOrchestration` owns Type-C callback orchestration for O1:5–O1:7, O1:9, and O1:10 (cleanup: no duplicate callback bodies in HomeScreen). Scene apply, right panel, chat pipeline, ingestion, demo/pilot, and persistence remain separate future zones.

**O1:10 — Type-C callback extraction cleanup (complete):** Verified that HomeScreen does not re-implement the O1:5 / O1:6 / O1:7 / O1:9 callback groups; it only owns Type-C state, composes `typeCOrchestrationState` / refs, passes inputs into `useTypeCOrchestration`, and destructures `typeCOrchestration.callbacks` for UI and chat wiring. Non-orchestration Type-C helpers (e.g. `detectTypeCIntent`, `buildTypeCConnectionSuggestions` inside `applyTypeCChatIntent`, executive action routing) intentionally remain in HomeScreen until their zones extract.

**Next optimize phases (post Type-C orchestration):**

- Scene Apply Controller
- Right Panel Controller
- Chat Pipeline Controller

**Non-goals (still in HomeScreen):** `applyTypeCChatIntent` still performs chat-only connection suggestion creation (`buildTypeCConnectionSuggestions` + `setConnectionSuggestions`) and object/scene edits; that is **not** part of O1:7.

---

### 2. Scene Apply Controller

Program-level inventory, O2 phased roadmap, and regression checklist: **O2 — Scene Apply Controller Extraction** (above).

**State**

- `sceneJson` / `setSceneJson` (canonical scene root used across the shell)

**Refs / dedupe**

- `lastSceneApplySigRef`, `lastSceneWriteSourceRef`, `lastSceneWriteAtRef` — owned by `useSceneApplyController` (O2:5); exposed on `sceneApplyController.refs`.
- `lastUpstreamSceneApplySigBySourceRef`, `lastSceneResetTraceSigRef` (latter **shared** into the hook)
- `sceneIntentQueueRef`, `sceneIntentEpoch` / `setSceneIntentEpoch`
- `lastSceneSemanticApplyRef`, `lastSceneVisualApplySignatureRef` (**passed into** the hook as `refs`; also updated by unified reaction / parity paths in HomeScreen — **shared**)
- `lastSceneParityVisibleTraceRef`, `lastSceneParityTraceRef` (dev parity traces)
- **`applyTypeCSceneUpdateRef`** — HomeScreen still creates the ref for `useTypeCOrchestration`; **`useSceneApplyController`** assigns `current` to `applySceneChangeSafe` in an effect via `bridgeRefs` (O2:6).
- **Scene-write diagnostics (O2:7)** — `emitSceneApplyDiagnostic` on `sceneApplyController.callbacks`; legacy console labels preserved for safety / tooling where required.

**Callbacks**

- `buildSceneSemanticSigForUpstreamDedupe`
- **`applySceneChangeSafe`** — central `setSceneJson` orchestration; writer strings for `traceSceneWrite` / dev traces
- `applySceneChangeUpstreamDedup` — bridges upstream sources (chat, Type-C, etc.) into `applySceneChangeSafe`

**Guards / contracts**

- Workspace empty clear block, reset candidate warnings, hydration vs dedupe policy (`bypassDedupe`, semantic signatures via `buildSceneSemanticSignature` / related helpers).
- Imports from **`./homeScreenSceneApply`** (`evaluateWorkspaceHydrateScene`, `evaluateSnapshotRestoreScene`, `evaluateHistoryUndoScene`, `evaluateBackupRestoreScene`, `evaluateUnifiedReactionSceneReplacement`, …) delegating to **`./sceneApplyContract`** (`decideSceneCanonApply` patterns).
- **`traceSceneWrite`** from `../lib/debug/sceneWriteTrace` for write provenance.
- **`applySceneFromChat`** from `../lib/scene/sceneApplyContract` (separate from `app/screens/sceneApplyContract.ts` used by `homeScreenSceneApply`).

**External modules**

- `../lib/scene/sceneIntent`, scene resolution helpers, loop normalization, `applySceneFromChat` from `sceneApplyContract`, workspace/scanner integration call sites that *invoke* apply (orchestration stays in HomeScreen today).

**Risk level:** **High** — single writer choke-point; regressions are user-visible immediately.

**Extraction difficulty:** **High** — many callers; must preserve setter ordering and dedupe invariants.

**Suggested target hook:** `useSceneApplyController`

---

### 3. Chat Pipeline Controller

**O4 anchor (HomeScreen):** grep **`O4 Extraction Boundary: Chat Pipeline Controller`** (above **`sendText`**). Planning + ownership table: **[## O4 — Chat Pipeline Controller Extraction](#o4--chat-pipeline-controller-extraction)**.

**State / refs**

- `input` / `setInput`, `messages` / `setMessages`, `messagesRef` (mirror for async/lifecycle)
- `isSendingRef`, `decisionMemoryEntries`, `decisionMemorySignatureRef`
- Chat pipeline debug: `writeChatPipelineDebug` and related `__NEXORA_DEBUG__` merge patterns (large ref block near panel/chat intersection)

**Callbacks / flow**

- **`sendText`** — async pipeline: Type-C chat intent, entry flow, `runNexoraChatPromptPipeline`, `chatToBackendLifecycle`, local fallback (`getLocalChatResponse`), decision assistant merge, panel routing side effects, scene updates via `applySceneChange*` / `applySceneFromChat` / `homeScreenChatApplyPrep` helpers.

**External modules**

- `../lib/chat/chatRequestLifecycle`, `../lib/chat/chatPipelineStability`, `../lib/chat/selectedObjectGuard`, `../lib/chat/localChatFallback`, `../lib/api/chatApi`, `../lib/decision/decisionRouter`, `./homeScreenResponseReaders`, `./homeScreenChatApplyPrep`, `applySceneFromChat` / scene contracts.

**Side effects**

- Touches **Right Panel** (`requestPanelAuthorityOpen`, panel merges) and **Scene Apply** — extraction must document a **narrow callback surface** (e.g. `onRequestPanelOpen`, `onApplyScene`) passed from shell or sibling hooks.

**Risk level:** **High**

**Extraction difficulty:** **High**

**Suggested target hook:** `useChatPipelineController`

---

### 4. Right Panel Controller

**State**

- `rightPanelState` / `_setRightPanelState` (wrapped by `setRightPanelState` and `commitRightPanelStateFromAuthority`)

**Refs / validation**

- `previousRightPanelViewRef`, `lastRightPanelChangeSourceRef`, `lastPanelRequestSigRef`
- `validatedPanelCacheRef`, `getValidatedPanelSharedDataOnce`
- Large **panel authority** cluster: `panelUserExplicitCloseRef`, `panelAuthorityLockAtRef`, `activePanelAuthorityWindowRef`, `lastOpenIntentRef`, `lastUpstreamPanelCommitSigRef`, … (grep `O1 Extraction Boundary: Right panel controller`)

**Callbacks**

- `stageRightPanelWriteMeta`, `setRightPanelState`, `commitRightPanelStateFromAuthority`
- **`requestPanelAuthorityOpen`**, **`applyPanelControllerRequest`**, `routeIntentToPanel`, legacy tab sync, inspector host id resolution

**External modules**

- `./homeScreenPanelHelpers` (`resolvePreferredPanelFamilyFromIntent`, dev `logPanel*` helpers)
- `./homeScreenShellGuards` (`toPanelOpenSource`, `isAutomaticRightPanelSource`, executive action helpers)
- `../lib/ui/right-panel/rightPanelRouter`, `../lib/ui/right-panel/rightPanelTypes`, `../lib/ui/right-panel/panelController` (and types), **`RightPanelHost`** (`../components/right-panel/RightPanelHost`)

**Risk level:** **High** — visible flashing / authority fights if ordering changes.

**Extraction difficulty:** **High** — widest cross-cutting dependency fan-out.

**Suggested target hook:** `useRightPanelController`

---

### 5. Ingestion Controller

**State / refs (representative)**

- `lastTextIngestionResult`, `lastMultiSourceIngestion`, `openCompareAfterPipelineReadyRef`, pipeline HUD refs (`commitPipelineStatusRef`, `mergePipelineStatusRef`, `pendingTrustMultiSourceContextRef`, …)
- Interaction dispatch: `dispatchInteraction` with `run_ingestion` / `ingestion_failed` intents

**Callbacks / effects**

- **`runBusinessTextIngestionPipeline`**, `runUnifiedMultiSourceAssessment`, dev/product event listeners (`nexora:run-business-text-ingestion`, multi-source events) — wired in a `useEffect` dependency block with `requestPanelAuthorityOpen` / pipeline updates.

**External modules**

- `./homeScreenIngestionDev`, `./homeScreenMultiSourceIngestionDev`, `./homeScreenIngestionSceneBridge` (`runIngestionThroughFragilitySceneBridge`, signatures), `../lib/api/ingestionApi`
- Downstream: **Scene Apply** (`applySceneChangeSafe` with `isIngestionUpdate`), **Right Panel** (compare / authority), **audit/trust** refs when multi-source completes (B.12 / B.18 cluster)

**Risk level:** **High** (async + bridge + panel + scene)

**Extraction difficulty:** **High**

**Suggested target hook:** `useIngestionController`

---

### 6. Demo / Pilot Controller

**Ownership**

- `isPilotProductMode`, `pilotRuntimeDomainLine`, `investorDemo`, `useCustomerDemoMode` / `activeProfile`, `activeDomainDemo` (`resolveDomainDemo`)
- **`runPilotDemoScenario`** — dispatches pilot ingestion custom event
- Retail / investor narrative bindings and demo-only HUD copy (grep `investorDemo`, `activeDomainDemo`, pilot scenario constants)

**External modules**

- Domain demo / investor demo hooks and lib helpers under `app/lib` domain/product demos (as imported by HomeScreen)

**Risk level:** **Medium** — fewer paths than chat/panel, but easy to break pilot gating.

**Extraction difficulty:** **Medium**

**Suggested target hook:** `useDemoPilotController`

---

### 7. Persistence Controller

**Ownership**

- Workspace: `loadWorkspaceSnapshot`, `saveWorkspaceSnapshot`, `saveProjectSnapshot`, `applyWorkspaceProjectState`, `workspaceHydrated`, active workspace/project IDs
- **Snapshots / decisions:** `appendSnapshot`, `saveDecisionSnapshotNow`, `snapshots` state, compare/diff keys
- **History / undo:** `loadHistory`, `prepareUndoHistoryPop`, `evaluateHistoryUndoScene` (via `homeScreenSceneApply`)
- **Backup / restore:** `buildBackup`, `saveBackup`, `restorePreview` / `setRestorePreview`, `buildBackupRestorePreviewContents`, `evaluateBackupRestoreScene`
- **Local prefs / memory / session keys:** `PREFS_KEY`, `MEMORY_KEY`, `SESSION_KEY`, `AUTO_BACKUP_KEY`, auto-backup toggle persistence

**External modules**

- `./homeScreenPersistenceApply` (project/workspace apply helpers), `../lib/workspace/workspacePersistence`, `../lib/workspace/workspaceModel`, `../lib/decision/decisionStore`

**Risk level:** **High** — data loss class bugs.

**Extraction difficulty:** **High** — many `useEffect` ordering assumptions with hydrate flags (`isRestoringRef`, `projectHydratingRef`, …).

**Suggested target hook:** `useHomeScreenPersistenceController`

---

## Dependency Direction

Expected safe flow:

```text
HomeScreen shell (layout, providers, event wiring)
  -> controller hooks (orchestration, stable callbacks)
  -> lib contracts / helpers (pure + policy: sceneApplyContract, panelController, chatRequestLifecycle, homeScreen* modules)
  -> presentational components (RightPanelHost, TypeC* panels, SceneCanvas)
```

**Do not allow**

- Components importing HomeScreen or reaching into HomeScreen refs
- Lib contracts importing HomeScreen (keep adapters in `homeScreen*` or thin hook facades)
- Controller hooks importing heavy UI implementations **unless** the prompt explicitly carves an exception (prefer passing render props / slot callbacks from the shell)

---

## Extraction Order

Recommended sequence (each step should be its own prompt / PR):

1. Type-C **read-only** inventory / types (`O1:3`)
2. Type-C **hook skeleton** (`O1:4`)
3. Type-C **scenario + decision** callbacks (`O1:5`)
4. Type-C **AI / sandbox / multi-agent** callbacks (`O1:6`)
5. Type-C **connection / simulation / compare** callbacks (`O1:7`)
6. Type-C **execution / alerts / memory** callbacks (`O1:9`)
7. Type-C **callback extraction cleanup** — verify no duplicate locals; trim imports (`O1:10`)
8. **Scene apply controller** skeleton (`O1:11`)
9. Scene **dedupe + write guards** (`O1:12`)
10. **Right panel controller** skeleton (`O1:13`)
11. **Chat pipeline controller** skeleton (`O1:14`)
12. **Ingestion controller** inventory + extraction (`O1:15`)
13. **Demo/pilot controller** (can parallelize after 6 with care)
14. **Persistence controller** (often last before cleanup—most hydrate ordering risk)
15. **Final HomeScreen import cleanup** (`O1:16`)

Rationale: stabilize **Type-C + scene** contracts before **panel + chat**, then **ingestion** (bridges all three), then **persistence** (depends on correct apply paths), then import hygiene.

---

## Bug Tracking Checklist

After **each** extraction PR, verify:

- [ ] O1:1 **baseline** log `[Nexora][HomeScreenOptimize][Baseline]` still appears **once** per mount in dev (StrictMode-safe)
- [ ] No new **render-loop** logs or per-frame spam
- [ ] No **panel flash** on load or after chat
- [ ] **Scene object count** stable after initial load / workspace hydrate (compare baseline payload if needed)
- [ ] **Type-C core object** present when `typeCMode === "type_c"`
- [ ] **Analyze System** still runs (explicit selection + debounce paths)
- [ ] **Chat** sends and receives (backend + local fallback smoke)
- [ ] **Right panel** opens from **explicit** navigation / object click
- [ ] **Right panel** opens from **chat intent** / pipeline suggestion
- [ ] **Ingestion bridge** still updates scene + pipeline HUD without duplicate merges
- [ ] `npx tsc --noEmit` passes (or known baseline unchanged)

---

## AI Usage Optimization

- **One boundary per prompt** — cite the exact `O1 Extraction Boundary: …` comment and this inventory section header.
- **Avoid pasting all of `HomeScreen.tsx`** — use ripgrep / scoped reads; only attach the block being moved plus its immediate callers/callees.
- **Define I/O contracts** for each new hook up front: inputs (refs, setters, mode flags), outputs (callbacks, readonly snapshots), and **forbidden** side effects.
- **Avoid regenerate-the-world loops** — prefer a single file (or hook file + one call-site patch) per PR.
- **Prefer small diffs** — move code in chunks that keep tests and manual checklist green.

---

## Next Prompts

Planned sequence (adjust only with explicit architecture sign-off):

| ID | Title |
|----|--------|
| O1:3 | Extract Type-C State Shape Map |
| O1:4 | Create `useTypeCOrchestration` Hook Skeleton |
| O1:5 | Move Type-C Scenario + Decision Callbacks |
| O1:6 | Move Type-C AI / Sandbox / Multi-Agent Callbacks |
| O1:7 | Move Type-C Connection / Simulation / Compare Callbacks |
| O1:9 | Move Type-C Execution / Alerts / Memory Callbacks |
| O1:10 | Type-C Callback Extraction Cleanup / HomeScreen Slim-Down Check |
| O1:11 | Extract Scene Apply Controller Skeleton |
| O1:12 | Move Scene Dedupe + Scene Write Guards |
| O1:13 | Extract Right Panel Controller Skeleton |
| O1:14 | Extract Chat Pipeline Controller Skeleton |
| O1:15 | Extract Ingestion Controller Inventory |
| O1:16 | Final HomeScreen Import Cleanup |

---

## Appendix: Related files (read before extracting)

| File | Role |
|------|------|
| `homeScreenUtils.ts` | Shared screen helpers |
| `homeScreenResponseReaders.ts` | Response read / slice helpers for chat + panels |
| `homeScreenSceneApply.ts` | Scene canon decisions → `sceneApplyContract` |
| `homeScreenPanelHelpers.ts` | Panel intent + dev trace helpers (router-safe) |
| `homeScreenExecutionApply.ts` | Execution result → `applyNexoraUiState` prep |
| `homeScreenShellGuards.ts` | Panel source mapping + small guards |
| `homeScreenChatApplyPrep.ts` | Chat-side apply prep (imported by HomeScreen) |
| `homeScreenPersistenceApply.ts` | Workspace/project persistence apply helpers |
| `RightPanelHost.tsx` | Panel host render authority |
| `rightPanelRouter.ts` | Canonical view resolution |
| `panelController.ts` | Controller requests / merges |
| `sceneApplyContract.ts` (`app/screens`) | Canon scene apply policy used by `homeScreenSceneApply` |
| `sceneApplyContract.ts` (`app/lib/scene`) | Chat-oriented helpers such as `applySceneFromChat` |
| `sceneWriteTrace.ts` | Scene write provenance / dev trace |
