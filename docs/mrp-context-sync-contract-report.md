# MRP:7:3 — Executive Workspace Return Flow + Context Sync Report

**Date:** 2026-06-07  
**Scope:** Dashboard ↔ Assistant read-only context synchronization and passive return flow. No AI memory, agents, engines, or UI redesign.

---

## 1. Synchronization Architecture

### Principle

**Dashboard executes. Assistant understands. Dashboard owns reality. Assistant owns conversation.**

The synchronization layer transfers **read-only context copies** only. It never transfers execution data, engine output, simulation payloads, or analysis payloads.

### Flow

```
Assistant
     ↓
Action Request (MRP:7:1 bridge)
     ↓
Dashboard Workspace opens
     ↓
publishDashboardExecutiveContextSummary()
     ↓
nexora:dashboard-assistant-context-sync (CustomEvent)
     ↓
useAssistantExecutiveContextSync() — read-only consumer
     ↓
AssistantExecutiveContextPanel + continuity message
     ↓
Executive returns to Assistant tab (passive)
     ↓
publishDashboardExecutiveContextSummary(returned_passive)
     ↓
Assistant receives updated copy — no relaunch
```

### Components

| Layer | File | Role |
|-------|------|------|
| Contract | `assistantContextSyncContract.ts` | Summary types, build, validate, publish, consume |
| Consumer hook | `useAssistantExecutiveContextSync.ts` | Event listener → read-only state copy |
| Context panel | `AssistantExecutiveContextPanel.tsx` | Read-only continuity display |
| Publisher | `HomeScreen.tsx` | Publishes after route execution and passive return |
| Legacy findings | `assistantContextSyncLegacyFindings.ts` | Inspection notes from prior runtimes |

The bridge (MRP:7:1) owns **action transport**. The sync contract owns **read-only context transfer**. Neither owns dashboard state.

---

## 2. Ownership Map

| Concern | Owner | Assistant role |
|---------|-------|----------------|
| Workspace state | `NexoraWorkspaceState.dashboardMode` | Read-only copy via sync event |
| Route state | Dashboard Runtime + object panel router | Never modified by Assistant |
| Execution state | Dashboard consumer dispatch | Assistant observes completion status only |
| Conversation state | Assistant tab | Assistant owns |
| Contextual awareness | Assistant (via sync summary) | Receives copies; never writes back |
| Action transport | Bridge contract (MRP:7:1) | Unchanged |
| Sync transport | `DASHBOARD_ASSISTANT_CONTEXT_SYNC_EVENT` | Publish from Dashboard; consume in Assistant |

### Authority rules

- Dashboard validates context contract, workspace identity, completion status, and synchronization payload.
- Invalid synchronization fails safely — Assistant and Dashboard remain alive.
- Assistant receives copies only. Never overwrites dashboard, object, timeline, scene, or route state.

---

## 3. Return Flow Lifecycle

```
Workspace Open
       ↓
Workspace Active (completionStatus: active | opened)
       ↓
Executive switches MRP tab: Dashboard → Assistant
       ↓
handleMainRightPanelTabChange() — passive return only
       ↓
publishDashboardExecutiveContextSummary({
  completionStatus: "returned_passive",
  routeType: "return_passive",
})
       ↓
Assistant context update (read-only)
       ↓
Executive continues conversation without re-asking
```

### Return rules (enforced)

Returning to Assistant must **NOT**:

- Reopen workspace
- Rerun workspace or route
- Trigger dashboard actions
- Refresh scene, camera, topology, or HUD

Return is **passive only** — tab switch publishes a summary copy. Dashboard mode and route object remain unchanged.

---

## 4. Context Payload Specification

### Event

`nexora:dashboard-assistant-context-sync`

### Payload: `DashboardExecutiveContextSummary`

| Field | Type | Description |
|-------|------|-------------|
| `workspaceType` | `DashboardMode` | Current workspace mode |
| `objectId` | `string \| null` | Route or selected object ID |
| `objectName` | `string \| null` | Human-readable object label |
| `workspaceStatus` | `"inactive" \| "active"` | Whether a dedicated workspace is active |
| `completionStatus` | `WorkspaceCompletionStatus` | Session phase |
| `executionTimestamp` | `number` | Publish time (ms) |
| `routeType` | `DashboardContextRouteType` | How the workspace was reached |
| `currentDashboardMode` | `DashboardMode` | Authoritative dashboard mode |
| `lastWorkspaceType` | `DashboardMode \| null` | Prior workspace for continuity |
| `lastRouteType` | `DashboardContextRouteType \| null` | Prior route for continuity |
| `executiveFocusObjectId` | `string \| null` | Current executive focus object |
| `source` | `"dashboard_runtime"` | Required authority marker |

### Completion statuses

| Status | Meaning |
|--------|---------|
| `none` | No active session signal |
| `opened` | Workspace opened (overview or initial) |
| `active` | Dedicated workspace running |
| `returned_passive` | Executive left workspace tab passively |
| `completed` | Reserved for explicit completion signals |

### Route types

| Route | Trigger |
|-------|---------|
| `object_panel` | Object panel action → dashboard mode |
| `assistant_bridge` | Assistant action card → bridge → dashboard |
| `dashboard_direct` | Reserved for direct dashboard navigation |
| `return_passive` | Dashboard → Assistant tab switch |

### Future workspace placeholders (no implementation)

`risk`, `timeline`, `simulation`, `recommendations`, `decision_center` — reserved in `FUTURE_EXECUTIVE_WORKSPACE_TYPES`.

---

## 5. Validation Rules

1. Payload must be a non-null object with `source: "dashboard_runtime"`.
2. `currentDashboardMode` or `workspaceType` must be a valid dashboard mode string.
3. `completionStatus` must be present.
4. Invalid payloads log `[AssistantContextSync][Brake]` and are ignored.
5. Duplicate signatures are deduped unless `force: true` (return flow uses force).
6. Consumer `consumeDashboardExecutiveContextSummary()` returns read-only frozen copy.

### Brake messages

- `Invalid context payload`
- `Invalid synchronization contract`
- `Missing dashboard state`
- `Missing completion summary`
- `Missing workspace` (reserved)

### Fallback behavior

On invalid sync: ignore payload, keep Assistant alive, keep Dashboard alive, keep active workspace and object selection unchanged.

---

## 6. Future Workspace Integration Plan

When future workspace modes are implemented:

1. Add mode to `DashboardMode` in `dashboardModeRuntimeContract.ts`.
2. Map bridge future actions to the new mode (MRP:7:1 pattern).
3. Extend `FUTURE_EXECUTIVE_WORKSPACE_TYPES` with executable mapping — no sync contract changes required.
4. Publish uses the same `DashboardExecutiveContextSummary` shape; `workspaceType` and `completionStatus` carry continuity.
5. Assistant consumes via existing hook — no new ownership paths.

---

## 7. Legacy Inspection Findings

| System | Path | Status |
|--------|------|--------|
| Dashboard Runtime | `dashboardModeRuntimeContract.ts` | Authority preserved — publisher reads only |
| Assistant Bridge | `assistantDashboardBridgeContract.ts` | Downstream publisher after execution |
| Action Cards | `assistantActionCardContract.ts` | Read-only subset of sync summary |
| Workspace State | `nexoraWorkspaceStateContract.ts` | Dashboard authority; Assistant never writes reducer |
| War Room Store | `executiveWarRoomStore.ts` | Decoupled scene session — not merged into sync |

---

## 8. Performance & Safety Guarantees

- No rerender loops — consumer updates only on distinct sync events
- No synchronization loops — dedupe via `buildContextSummarySignature`
- No polling, background workers, or recursive updates
- No route refresh or workspace relaunch on return
- HUD panels unchanged (Object Panel, Timeline, Scene HUD, MRP layout)

---

## 9. Definition of Done

| Criterion | Status |
|-----------|--------|
| Dashboard publishes context summaries on workspace open | ✅ |
| Dashboard publishes passive return on tab switch | ✅ |
| Assistant receives read-only copies | ✅ |
| Assistant understands current workspace context | ✅ |
| Return flow passive (no relaunch) | ✅ |
| Ownership boundaries intact | ✅ |
| No duplicated state authority | ✅ |
| Build passes | ✅ |

---

## 10. Files Created / Modified

**Created**

- `frontend/app/lib/assistant-bridge/assistantContextSyncContract.ts`
- `frontend/app/lib/assistant-bridge/assistantContextSyncContract.test.ts`
- `frontend/app/lib/assistant-bridge/assistantContextSyncLegacyFindings.ts`
- `frontend/app/lib/assistant-bridge/useAssistantExecutiveContextSync.ts`
- `frontend/app/components/assistant/AssistantExecutiveContextPanel.tsx`

**Modified**

- `frontend/app/screens/HomeScreen.tsx` — publisher wiring + passive return
- `frontend/app/components/assistant/AssistantExecutiveLaunchSurface.tsx` — continuity message
- `frontend/app/components/main-right-panel/MainRightPanelAssistantPlaceholder.tsx` — sync hook + panel
