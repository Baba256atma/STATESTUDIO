# MRP:7:5 — Assistant Integration QA + Dashboard Authority Validation Report

**Date:** 2026-06-07  
**Scope:** Full QA validation of MRP Assistant ↔ Dashboard integration (MRP:7 series). No new features. Architecture compliance only.

---

## MRP Freeze Gate Decision

### **PASS WITH WARNINGS**

| Category | Result |
|----------|--------|
| MRP:7 Assistant ↔ Dashboard core architecture | **PASS** |
| Dashboard authority | **PASS** |
| Assistant authority | **PASS** |
| Bridge transport | **PASS** |
| Context synchronization | **PASS** |
| Conversation continuity | **PASS** |
| Legacy parallel paths | **WARNING** (documented, pre-existing) |
| HUD zoning (MRP-HUD:1) | **WARNING** (documented blocker, not introduced by MRP:7) |

**Evidence:** 33/33 automated contract tests pass (`app/lib/assistant-bridge/*.test.ts`). Production build passes (`npm run build`).

**Rationale for PASS WITH WARNINGS (not FAIL):** The canonical MRP Assistant integration path — action cards → bridge → HomeScreen validation → `setDashboardMode` — has zero ownership violations and zero execution bypasses. Warnings are confined to **legacy parallel surfaces** (LeftCommandAssistant chat/SIM, legacy dashboard context router, scene executive focus store) that predate MRP:7 and are documented with migration recommendations. These do not invalidate the MRP:7 contract architecture.

**Rationale for not full PASS:** Legacy bypass paths remain active outside MRP Assistant tab. MRP-HUD:1 HUD zoning repair is still outstanding before full MRP Freeze.

---

## 1. Authority Validation Matrix

| Concern | Owner | Verified | Evidence |
|---------|-------|----------|----------|
| Route state | Dashboard (`NexoraWorkspaceState.dashboardMode`) | ✅ PASS | `nexoraWorkspaceStateContract.ts:153-178` — only reducer dispatch sets mode |
| Workspace state | Dashboard Runtime | ✅ PASS | `DashboardRuntimePanel.tsx` renders from `dashboardMode` prop |
| Workspace lifecycle | Dashboard (completionStatus publish) | ✅ PASS | `HomeScreen.tsx:10191-10197`, `18737-18742` |
| Dashboard rendering | Dashboard Runtime | ✅ PASS | Dedicated mode shells hide legacy host |
| Dashboard modes | `NexoraWorkspaceState.dashboardMode` | ✅ PASS | `dashboardModeRuntimeContract.ts:27` canonical owner |
| Conversation | Assistant continuity session | ✅ PASS | `useAssistantConversationContinuity.ts` — stable `sessionIdRef` |
| Context awareness | Assistant (read-only copies) | ✅ PASS | `conversationContinuityContract.ts` — `source: assistant_continuity_runtime` |
| Action suggestions | Assistant action cards | ✅ PASS | Cards emit only; never dispatch |
| Bridge transport | `assistantDashboardBridgeContract.ts` | ✅ PASS | Event emit + validate; no state writes |
| Sync transport | `assistantContextSyncContract.ts` | ✅ PASS | Read-only publish/consume; `source: dashboard_runtime` |

### Duplicated ownership check

| Pair | Verdict | Notes |
|------|---------|-------|
| Assistant → Dashboard mode | ✅ No duplication | Assistant modules never import workspace reducer |
| Sync summary → Dashboard state | ✅ No duplication | Assistant receives frozen copies only |
| Card context → Sync summary | ✅ Subset relationship | Card context is read-only subset |
| `dashboardMode` ↔ `dashboardContext` | ⚠️ WARNING | Intentional legacy mirror via `syncDashboardModeAndContext` |
| Scene executive focus ↔ Dashboard focus | ⚠️ WARNING | Two focus semantics (`executiveFocusModeRuntime` vs `dashboardMode: focus`) |
| `rightPanelState.view` ↔ `dashboardMode` | ⚠️ WARNING | Legacy mirror documented in `mainRightPanelStateContract.ts` |

**No shared authority violations in MRP:7 path.**

---

## 2. Route Validation Matrix

All five routes share one validated execution chain:

```
Assistant Action Card
     ↓ launchAssistantActionCard()
     ↓ emitAssistantExecutiveActionRequest()
     ↓ nexora:assistant-dashboard-action
     ↓ HomeScreen applyAssistantDashboardActionRef
     ↓ routeAssistantExecutiveActionRequest()
     ↓ applyObjectPanelRouteRef()
     ↓ dispatch setDashboardMode
     ↓ publishDashboardContextSummary (routeType: assistant_bridge)
     ↓ DashboardRuntimePanel workspace shell
```

| Route | Assistant Action | Panel Action | Dashboard Mode | Shell | Result |
|-------|------------------|--------------|----------------|-------|--------|
| Focus | `FOCUS_OBJECT` | `focus` | `focus` | `FocusModeSurface` | ✅ PASS |
| Analyze | `OPEN_ANALYZE` | `analyze` | `analyze` | `AnalyzeWorkspaceShell` | ✅ PASS |
| Compare | `OPEN_COMPARE` | `compare` | `compare` | `CompareWorkspaceShell` | ✅ PASS |
| Scenario | `OPEN_SCENARIO` | `scenario` | `scenario` | `ScenarioWorkspaceShell` | ✅ PASS |
| War Room | `OPEN_WARROOM` | `war_room` | `war_room` | `WarRoomWorkspaceShell` | ✅ PASS |

**Automated evidence:** `validateAssistantRouteMappingMatrix()` — 5/5 pass. `assistantDashboardBridgeContract.test.ts` — routes all executable actions.

**No bypass paths in MRP Assistant action card flow.**

Object Panel (scene-native) uses the same `applyObjectPanelRouteRef` path with `routeType: object_panel` — authorized non-assistant entry point, not a bypass.

---

## 3. Bridge Validation Results

| Check | Result | Evidence |
|-------|--------|----------|
| Bridge emits events only | ✅ PASS | `emitAssistantExecutiveActionRequest` — no reducer import |
| Consumer validates source | ✅ PASS | `HomeScreen.tsx:15608` — rejects `source !== "assistant"` |
| Double validation (emit + consume) | ✅ PASS | Bridge blocks future actions at emit; runtime re-validates at consume |
| Future actions blocked | ✅ PASS | `OPEN_RISK` etc. → `unauthorized_future_action` |
| Missing object fails safely | ✅ PASS | `missing_object` brake + ack failure |
| Invalid action fails safely | ✅ PASS | `invalid_action` brake |
| Missing dashboard runtime | ✅ PASS | `applyAssistantDashboardActionRef` returns false + ack |
| Ack path | ✅ PASS | `nexora:assistant-action-card-launch-ack` |

**Brake prefix verified:** `[AssistantBridge][Brake]` — fires in dev, no-op in production. Runtime survives.

---

## 4. Synchronization Validation Results

| Check | Result | Evidence |
|-------|--------|----------|
| Dashboard publishes summaries | ✅ PASS | After route execution + passive return |
| Assistant consumes read-only | ✅ PASS | `consumeDashboardExecutiveContextSummary` returns frozen copy |
| Assistant receives current object | ✅ PASS | `objectId`, `objectName` in summary |
| Assistant receives current workspace | ✅ PASS | `workspaceType` |
| Assistant receives last workspace | ✅ PASS | `lastWorkspaceType` |
| Assistant receives last action | ✅ PASS | `lastRouteType` |
| Assistant receives current mode | ✅ PASS | `currentDashboardMode` |
| Assistant receives status | ✅ PASS | `workspaceStatus`, `completionStatus` |
| No engine internals transferred | ✅ PASS | Payload contract excludes engine/sim/analysis fields |
| No dashboard ownership transfer | ✅ PASS | `source: dashboard_runtime` required |
| Dedupe prevents sync loops | ✅ PASS | `buildContextSummarySignature` + `lastPublishedSignature` |
| Invalid sync fails safely | ✅ PASS | Rejects `source: assistant` — test verified |

**Brake prefix verified:** `[AssistantContextSync][Brake]`

---

## 5. Conversation Continuity Validation

| Check | Result | Evidence |
|-------|--------|----------|
| Session survives tab change | ✅ PASS | `sessionIdRef` never reset; passive return merge test |
| Session survives workspace change | ✅ PASS | `conversationContinuityContract.test.ts` — stable-session test |
| Session survives route change | ✅ PASS | Awareness merge updates copy only |
| Session survives object change | ✅ PASS | Signature update without session reset |
| No unexpected reset | ✅ PASS | `mergeConversationContinuityFromSync` preserves `sessionId` |
| No state duplication | ✅ PASS | Awareness is derived copy, not parallel authority |
| Context not lost on return | ✅ PASS | `returned_passive` → lifecycle `exit`, object preserved |
| Invalid sync ignored | ✅ PASS | Previous continuity preserved on reject |

**Brake prefix verified:** `[ConversationContinuity][Brake]`

---

## 6. Action Card Validation

| Check | Result | Evidence |
|-------|--------|----------|
| Cards create requests only | ✅ PASS | `launchAssistantActionCard` → emit only |
| Cards never open routes directly | ✅ PASS | No `setDashboardMode` in card modules |
| Cards never change workspace state | ✅ PASS | No reducer imports |
| Cards never change scene state | ✅ PASS | No scene store imports |
| Dashboard validates first | ✅ PASS | HomeScreen consumer required for execution |
| Coming-soon cards blocked | ✅ PASS | `Route not ready.` — test verified |
| Missing object blocked | ✅ PASS | `Object not available.` — test verified |

**Brake prefix verified:** `[AssistantActionCard][Brake]`

---

## 7. Legacy Architecture Findings

Legacy paths identified. **Not removed** — documented with migration recommendations.

### WARNING — LeftCommandAssistant (parallel assistant surface)

**Path:** `HomeScreen.tsx:15740+` — `handleLeftCommandRun`

| Command | Behavior | Bypasses MRP bridge? |
|---------|----------|---------------------|
| `analyze` | `sendText(...)` chat pipeline | ⚠️ YES — does not use `OPEN_ANALYZE` |
| `compare` | `dispatchCanonicalAction(normalizeCompareOptions(...))` | ⚠️ YES — opens SIM compare panel |
| `simulate` | `dispatchCanonicalAction(normalizeRunSimulation(...))` | ⚠️ YES — opens SIM scenario panel |

**Migration recommendation:** Route workspace-intent commands through `emitAssistantExecutiveActionRequest` when dashboard handoff is intended. Keep chat-only commands separate with explicit labeling.

### WARNING — Legacy dashboard context router

**Path:** `dashboardContextRouter.ts` — `commitDashboardContextUpdate` uses `setDashboardContext`, not `setDashboardMode`.

Used from left-nav, legacy panel opens, MRP redirects. Does not set route objects (cleared on `setDashboardContext`).

**Migration recommendation:** Migrate callers to `setDashboardMode` + route object when object-scoped workspaces are required.

### WARNING — Executive object action SIM fallback (dead code)

**Path:** `HomeScreen.tsx:15692-15698` — `compare_scenarios`, `open_war_room` SIM panel opens

**Status:** Unreachable today — `shouldRouteExecutiveActionToDashboard` returns true for these actions (early return at line 15643). Maintenance risk if action lists diverge.

**Migration recommendation:** Remove dead SIM branches or add explicit `/* unreachable: routed to dashboard */` guard comment.

### WARNING — Scene executive focus vs dashboard focus

**Path:** `ObjectInfoHud.tsx` — `getExecutiveFocusModeSnapshot().enabled` for focus UI

Separate from `dashboardMode: "focus"`. Two focus semantics coexist.

**Migration recommendation:** Align UI indicator with `nexoraWorkspaceState.dashboardMode === "focus"` or document dual semantics.

### PASS — Legacy object panel routing (authorized)

**Path:** `ExecutiveActionPanel.tsx` → `emitObjectPanelActionRequest` → same `applyObjectPanelRouteRef`

Scene-native, authorized, uses dashboard authority. Not an assistant bypass.

### PASS — Legacy executive actions routed to dashboard

**Path:** `PRIMARY_LEGACY_DASHBOARD_OBJECT_ACTIONS` in `objectPanelActionRouterContract.ts:67-74`

Legacy action IDs (`compare_scenarios`, `open_war_room`, etc.) correctly route to dashboard modes.

---

## 8. HUD Validation Findings

| Check | Result | Evidence |
|-------|--------|----------|
| Object Panel scene-native | ✅ PASS | `scene-object-panel-zone` in `sceneHudZoneContract.ts` |
| Timeline scene-native | ✅ PASS | `scene-timeline-zone` |
| MRP separate from scene HUD | ✅ PASS | `MainRightPanelShell` in MRP layout |
| Dashboard inside MRP | ✅ PASS | `DashboardRuntimePanel` in dashboard tab |
| Assistant inside MRP | ✅ PASS | `MainRightPanelAssistantPlaceholder` in assistant tab |
| HUD zone contract exists | ✅ PASS | `sceneHudZoneContract.ts` — hard-locked zones |
| Overlap diagnostics | ⚠️ WARNING | `mrpOverlapDetected` metric; MRP-HUD:1 repair still required |
| MRP:7 introduced HUD regressions | ✅ PASS | No HUD files modified in MRP:7 series |

**Brake prefix verified:** `[Nexora][HUDZoneBrake]` — `sceneHudZoneContract.ts:432`

**MRP-HUD:1 blocker remains documented** in prior MRP reports (`mrp-warroom-workspace-shell-report.md`, `mrp-assistant-dashboard-bridge-report.md`). Not a regression from MRP:7.

---

## 9. Runtime Brake Validation

| Prefix | Module | Fires safely | Runtime survives |
|--------|--------|--------------|------------------|
| `[AssistantBridge][Brake]` | `assistantDashboardBridgeContract.ts:109` | ✅ | ✅ |
| `[AssistantActionCard][Brake]` | `assistantActionCardContract.ts:92` | ✅ | ✅ |
| `[AssistantContextSync][Brake]` | `assistantContextSyncContract.ts:89` | ✅ | ✅ |
| `[ConversationContinuity][Brake]` | `conversationContinuityContract.ts:90` | ✅ | ✅ |
| `[Nexora][HUDZoneBrake]` | `sceneHudZoneContract.ts:432` | ✅ | ✅ |

All brake helpers are dev-only (`NODE_ENV === "production"` guard). No crash. No reset. Dedupe prevents log spam.

---

## 10. Performance Validation

| Check | Result | Evidence |
|-------|--------|----------|
| No rerender loops | ✅ PASS | Sync hook updates only on event; signature dedupe |
| No route loops | ✅ PASS | Tab switch publishes passive return only — no relaunch |
| No synchronization loops | ✅ PASS | `lastPublishedSignature` dedupe in sync contract |
| No recursive dispatch | ✅ PASS | Single dispatch per route request |
| No repeated bridge calls | ✅ PASS | One emit per card click |
| No repeated context transfers | ✅ PASS | Signature dedupe unless `force: true` (return only) |
| No repeated dashboard launches | ✅ PASS | Return flow does not call `applyObjectPanelRouteRef` |
| No hidden polling | ✅ PASS | Event-driven only; no intervals in assistant-bridge modules |
| No memory leaks (hook cleanup) | ✅ PASS | `removeEventListener` in both sync hooks |
| Analyze debounce (legacy path) | ✅ PASS | `HomeScreen.tsx:15757` — 1500ms debounce on left command analyze |

---

## 11. Failure Testing Results

| Scenario | Expected | Result | Evidence |
|----------|----------|--------|----------|
| Missing object | Safe failure | ✅ PASS | Bridge: `missing_object`; Card: `Object not available.` |
| Missing workspace | Safe failure | ✅ PASS | Sync brake: `Missing dashboard state` |
| Missing dashboard runtime | Safe failure | ✅ PASS | `applyAssistantDashboardActionRef` returns false + ack |
| Invalid route/action | Safe failure | ✅ PASS | `invalid_action` brake |
| Invalid action (future) | Safe failure | ✅ PASS | `unauthorized_future_action` |
| Invalid context payload | Safe failure | ✅ PASS | Sync rejected; continuity preserved |
| Invalid synchronization | Safe failure | ✅ PASS | `source !== dashboard_runtime` rejected |
| Invalid awareness | Safe failure | ✅ PASS | Continuity preserves previous state |
| Legacy route (SIM panel) | Parallel path | ⚠️ WARNING | Documented — not MRP:7 path |
| Dashboard survives | Yes | ✅ PASS | No reducer crash paths |
| Assistant survives | Yes | ✅ PASS | Invalid sync ignored |
| Executive session survives | Yes | ✅ PASS | Session ID preserved |

---

## 12. Automated Test Evidence

```
app/lib/assistant-bridge/assistantDashboardBridgeContract.test.ts   — 8 tests
app/lib/assistant-bridge/assistantActionCardContract.test.ts        — 5 tests
app/lib/assistant-bridge/assistantContextSyncContract.test.ts       — 6 tests
app/lib/assistant-bridge/conversationContinuityContract.test.ts     — 6 tests
app/lib/assistant-bridge/assistantIntegrationQaValidation.test.ts   — 8 tests
────────────────────────────────────────────────────────────────────
Total: 33/33 PASS
```

Build: `npm run build` — ✅ PASS

---

## 13. MRP Freeze Readiness Assessment

### Ready for MRP:7 Freeze

- ✅ Dashboard authority verified as single execution owner
- ✅ Assistant authority verified as conversation + awareness owner
- ✅ Bridge verified as transport-only
- ✅ Synchronization verified as read-only
- ✅ Continuity verified across tab/workspace/route changes
- ✅ No ownership violations in MRP:7 path
- ✅ No route bypasses in MRP:7 path
- ✅ No execution bypasses in MRP:7 path
- ✅ Build passes

### Pre-freeze warnings (non-blocking for MRP:7, blocking for full MRP)

1. **MRP-HUD:1** — HUD zoning repair pass required before full MRP Freeze
2. **LeftCommandAssistant** — parallel analyze/compare/simulate paths bypass MRP bridge
3. **Legacy dashboard context router** — `setDashboardContext` parallel to `setDashboardMode`
4. **Dual focus semantics** — scene executive focus vs dashboard focus mode
5. **Dead SIM fallback code** — unreachable but maintenance risk in `onExecutiveObjectAction`

### Recommended post-freeze migrations

1. Route LeftCommandAssistant workspace commands through bridge when dashboard handoff intended
2. Migrate `commitDashboardContextUpdate` callers to `setDashboardMode` + route object
3. Remove or guard dead SIM branches in executive object action handler
4. Complete MRP-HUD:1 before declaring full MRP architecture frozen

---

## 14. Files Created for This QA Pass

**Created**

- `frontend/app/lib/assistant-bridge/assistantIntegrationQaValidation.ts`
- `frontend/app/lib/assistant-bridge/assistantIntegrationQaValidation.test.ts`
- `docs/mrp-assistant-integration-qa-report.md`

**No feature changes. No HUD changes. No layout changes.**

---

## Final Architecture Rule — Verified

**Assistant may suggest. Assistant may explain. Assistant may remember context.**

**Dashboard alone executes. Dashboard remains the single authority.**

The MRP:7 integration architecture complies with this rule. Legacy parallel surfaces outside MRP:7 are documented and flagged for migration.
