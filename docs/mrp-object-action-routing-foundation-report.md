# MRP:2:1 — Object Panel Action Routing Foundation Report

**Date:** 2026-06-07  
**Scope:** Bridge only — Object Panel actions route to Dashboard Runtime mode changes. No Focus/Analyze/Compare/Scenario/War Room module content.

---

## 1. Routing Contract

### Event

| Field | Value |
|-------|-------|
| Event name | `nexora:object-panel-action` |
| Constant | `OBJECT_PANEL_ACTION_EVENT` |
| Emitter | `emitObjectPanelActionRequest()` |
| Consumer | `HomeScreen` listener → `routeObjectPanelActionRequest()` → `setDashboardMode` |

### Allowed actions

| Object Panel Action | Dashboard Mode |
|--------------------|----------------|
| `focus` | `focus` |
| `analyze` | `analyze` |
| `compare` | `compare` |
| `scenario` | `scenario` |
| `war_room` | `war_room` |

### Flow

```
User clicks Object Panel action
        ↓
emitObjectPanelActionRequest (validate object + action)
        ↓
nexora:object-panel-action (CustomEvent)
        ↓
HomeScreen.applyObjectPanelRoute
        ↓
routeObjectPanelActionRequest
        ↓
dispatchNexoraWorkspaceState({ type: "setDashboardMode", mode, routeObject })
        ↓
DashboardRuntimePanel (placeholder: Current Mode + Object + "Module not implemented yet.")
```

### Brake logs

All brakes use prefix `[ObjectActionRouter][Brake]`:

- Missing object
- Invalid action
- Missing dashboard runtime
- Failed route

On failure: current dashboard mode is preserved; workspace does not crash.

---

## 2. Payload Contract

```typescript
{
  objectId: string;      // trimmed, required
  objectName: string;    // trimmed, falls back to objectId
  action: ObjectPanelDashboardAction;
  timestamp: number;     // Date.now() default
}
```

**Files:**

- `frontend/app/lib/object-panel/objectPanelActionRouterContract.ts`
- `frontend/app/lib/object-panel/objectPanelActionRouterRuntime.ts`

Payload is frozen and may evolve in later prompts without changing the event name.

---

## 3. Authority Boundaries

| Concern | Owner | Notes |
|---------|-------|-------|
| Object selection | `HomeScreen.selectedObjectIdState` | Unchanged |
| Object metadata | Object Panel (`ExecutiveActionPanel`, `SceneActionDock`) | Scene-native HUD |
| Action requests | Object Panel emitters | Request-only; no executive content |
| Dashboard mode | `NexoraWorkspaceState.dashboardMode` | Canonical |
| Route object context | `dashboardRouteObjectId` / `dashboardRouteObjectName` | Set on routed actions |
| Dashboard content | `DashboardRuntimePanel` | Placeholder until module prompts |
| Legacy panel views | `RightPanelHost` (legacy host slot) | Advanced actions only |

**Hard rule:** Object Panel never renders executive modules. Dashboard is the single destination.

**Dedupe guard:** `setDashboardMode` returns the same state reference when mode + route object are unchanged (no ping-pong, no remount churn).

---

## 4. Legacy Routing Findings

### Inspected surfaces

| Surface | Path | Finding |
|---------|------|---------|
| `RightPanelHost` | `frontend/app/components/right-panel/RightPanelHost.tsx` | Legacy SIM/RSK panel authority; opened advice, compare, war_room, risk_flow via `requestPanelAuthorityOpen`. |
| `rightPanelRouter` | `frontend/app/lib/ui/right-panel/rightPanelRouter.ts` | Deprecated compatibility layer; maps legacy views to shell sections. Documented to defer to Dashboard modes for MVP. |
| `ExecutiveObjectPanel` | `frontend/app/components/panels/ExecutiveObjectPanel.tsx` | MRP-docked object panel shell; dual surface alongside scene-native `ObjectInfoHud`. |
| `executiveNavigationBridge` | — | **Not found** in codebase. |
| `executivePlaneNavigationResolver` | — | **Not found** in codebase. |
| `HomeScreen` executive handler | `frontend/app/screens/HomeScreen.tsx` | Previously: `focus_object` → camera focus toggle; analyze/compare/war_room → legacy panel open. |

### Duplicated routing logic

- Object Panel primary actions and Scene Action Dock both emitted `nexora:executive-object-action`, which bypassed Dashboard Runtime.
- `rightPanelRouter` and `nexoraRoutingContract` both participate in panel view resolution.
- Legacy `dashboardContext` and new `dashboardMode` were both writable; writes now sync via `syncDashboardModeAndContext`.

### Changes in MRP:2:1

- Primary Object Panel actions emit `nexora:object-panel-action`.
- Scene Action Dock Focus/Scenario emit dashboard router directly; Explain stays legacy.
- Executive-object-action handler routes **only** whitelisted dashboard actions (`shouldRouteExecutiveActionToDashboard`); advanced actions (timeline, dependencies, risks, etc.) keep legacy fallback.

---

## 5. Risks Found

| Risk | Mitigation |
|------|------------|
| Dual object panel surfaces (scene HUD + MRP dock) | Scene-native panel is canonical for object click; MRP dock isolated |
| Legacy handler opening SIM panels for primary actions | Whitelist gate; dashboard actions no longer call `requestPanelAuthorityOpen` |
| `focus_object` camera/timeline mutation | Removed from dashboard action path; mode-only update |
| Routing loops / useEffect ping-pong | Stable refs for dispatch; reducer dedupe on identical mode+object |
| Advanced legacy actions incorrectly mapped to analyze | Removed `explain_object` / `show_risks` from legacy→dashboard map |
| Missing bridge files (`executiveNavigationBridge`) | Documented as not found; no blind reuse |

---

## 6. Follow-Up Work — Focus Route Implementation

Next prompt (Focus module) should:

1. Replace `DashboardRuntimePanel` placeholder body for `mode === "focus"` with Focus module shell.
2. Read `dashboardRouteObjectId` / `dashboardRouteObjectName` as Focus context authority.
3. Keep Object Panel as request emitter only — no Focus UI in scene HUD beyond action buttons.
4. Avoid reintroducing `toggleExecutiveFocusMode` for dashboard Focus; camera/scene focus is a separate concern if needed later.
5. Add Focus-specific certification tests alongside `objectPanelActionRouterContract.test.ts`.
6. Confirm legacy `object_focus` view in `RightPanelHost` remains isolated until explicitly retired.

---

## Files Added / Modified

**New**

- `frontend/app/lib/object-panel/objectPanelActionRouterContract.ts`
- `frontend/app/lib/object-panel/objectPanelActionRouterRuntime.ts`
- `frontend/app/lib/object-panel/objectPanelActionLegacyFindings.ts`
- `frontend/app/lib/object-panel/objectPanelActionRouterContract.test.ts`

**Modified**

- `frontend/app/lib/workspace/nexoraWorkspaceStateContract.ts` — route object fields + dedupe
- `frontend/app/components/panels/ExecutiveActionPanel.tsx` — five dashboard actions
- `frontend/app/components/scene/SceneActionDock.tsx` — Focus/Scenario via router
- `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx` — mode + object placeholder
- `frontend/app/components/main-right-panel/MainRightPanelShell.tsx` — route object props
- `frontend/app/screens/HomeScreen.tsx` — listeners + apply route

---

## Verification

- `objectPanelActionRouterContract.test.ts` — contract, routing, workspace dedupe
- `npm run build` — must pass
- Manual: click Analyze on Object Panel → Dashboard tab shows **Current Mode: Analyze**, **Object: {name}**, **Module not implemented yet.**
