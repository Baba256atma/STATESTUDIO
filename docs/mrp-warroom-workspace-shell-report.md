# MRP:6:1 — War Room Workspace Shell Report

**Date:** 2026-06-07  
**Scope:** War Room Mode foundation — executive war room workspace shell only. No engines, simulation, or recommendation execution.

---

## 1. War Room Runtime Architecture

### Architecture rule

**War Room is a Dashboard mode.** It is NOT a separate panel, router, or runtime authority. Dashboard Runtime remains the sole authority.

### Flow

```
Object Panel → [War Room]
      ↓
Object Panel Action Router (MRP:2:1)
      ↓
NexoraWorkspaceState.dashboardMode = "war_room"
      ↓
DashboardRuntimePanel → WarRoomWorkspaceShell
      ↓
Module slots + Executive Situation Summary placeholder
```

### Components

| Layer | File | Role |
|-------|------|------|
| Contract | `frontend/app/lib/dashboard/warRoom/warRoomModeContract.ts` | Workspace context, module registry, future card slots, brakes |
| Shell | `frontend/app/components/dashboard/warRoom/WarRoomWorkspaceShell.tsx` | Executive war room workspace UI |
| Runtime panel | `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx` | Renders War Room shell when mode is `war_room` |
| Object context | `dashboardFocusObjectData` memo in HomeScreen | Shared read-only builder (all executive modes) |

### Workspace layout

- **War Room** header
- **Object** + **Status** (Ready / Limited)
- **Executive Situation Summary:** *No active war room session.* + future intelligence message
- **War Room Modules** (placeholders):
  - Situation Assessment, Strategic Risks, Executive Priorities
  - Scenario Intelligence, Recommendation Center, Action Center, Decision Review

### Future card extension points (contract only)

`WAR_ROOM_FUTURE_CARD_SLOTS`: Situation, Risk, Decision, Recommendation, Scenario, Timeline Cards.

---

## 2. Context Ownership Map

| Concern | Owner | War Room role |
|---------|-------|----------------|
| Object selection | `HomeScreen.selectedObjectIdState` | Read-only |
| Route object | `dashboardRouteObjectId` / `dashboardRouteObjectName` | Set by MRP:2:1 router |
| Dashboard mode | `NexoraWorkspaceState.dashboardMode` | Set by router; War Room never writes |
| Object panel data | `buildExecutiveObjectPanelData()` | Read-only input |
| War Room workspace | `WarRoomWorkspaceShell` | Presentation only |
| War Room engines | Not implemented | Future module attachment |

**Shared context input:** `WarRoomModeContextInput` aliases `FocusModeContextInput`. Reuses Focus, Analyze, Compare, and Scenario object context sources via `resolveFocusObjectId()`.

---

## 3. State Authority Validation

| Rule | Status |
|------|--------|
| No duplicated object state | ✅ Reuses `dashboardFocusObjectData` memo |
| No duplicated dashboard state | ✅ Mode owned by workspace reducer only |
| War Room workspace does not own selection | ✅ No dispatch/setters in shell or contract |
| War Room is not a separate runtime authority | ✅ No local mode, routing, or session stores |
| No engine execution | ✅ No warRoomController, orchestration, or useWarRoomState invocation |
| No useEffect sync loops | ✅ Pure memoized derivation in HomeScreen |
| Legacy host hidden in War Room mode | ✅ All five executive modes in `isDedicatedMode` |

---

## 4. Runtime Protections

### Brake logs — `[WarRoomMode][Brake]`

| Message | Trigger |
|---------|---------|
| Missing object | No route or selected object ID |
| Invalid war room context | ID present but panel data unavailable/mismatch |
| Missing war room contract | Module registry empty (defensive) |

`Missing dashboard runtime` remains in MRP:2:1 Object Action Router.

### Fallback behavior

- **No object:** *"No active object selected."*
- **Partial context:** Workspace renders with **Limited** status and placeholders
- **Routing failure:** Dashboard mode unchanged (MRP:2:1 brakes)

### Performance guards

- Memoized `warRoomModeContext` — no recursive updates
- No scene refresh, camera movement, topology recalculation, timeline mutation
- No simulation, recommendation, or background processing
- Legacy `RightPanelHost` not mounted in War Room dedicated mode

---

## 5. Risks Discovered

| Risk | Mitigation |
|------|------------|
| Legacy `open_war_room` / RightPanelHost war_room view | Object Panel [War Room] routes to Dashboard only (MRP:2:1) |
| `executiveWarRoomRuntime` scene store name collision | Dashboard War Room does not invoke scene war room on mount |
| `warRoomController` / `useWarRoomState` legacy hooks | Not wired to MRP shell |
| `executiveWarRoomOrchestrationEngine` | Not invoked from workspace shell |
| `warRoomIntelligence` Phase 4 module | Future wiring must use WAR_ROOM_WORKSPACE_MODULES slots |
| 40+ legacy war room files in codebase | Documented; shell imports none of them |
| HUD overlap (MRP-HUD:1 blocker) | This prompt does not modify HUD zoning |

---

## 6. Preparation Work for Assistant → Dashboard Integration

1. **Keep Assistant isolated** in `MainRightPanelAssistantPlaceholder` — no war room or dashboard mode leakage into Assistant tab.
2. **Define assistant→dashboard handoff contract** when Assistant suggests executive actions (e.g. route via MRP:2:1 object panel router, not direct panel opens).
3. **Dashboard tab authority:** Any Assistant-initiated workspace navigation must dispatch `setDashboardMode` through workspace reducer only.
4. **Context propagation:** Assistant responses referencing an object should use existing `dashboardRouteObjectId` fields, not new stores.
5. **MRP Freeze readiness:** All six executive modes (overview + focus/analyze/compare/scenario/war_room) now have dedicated or placeholder shells; legacy host only visible in overview.
6. **Complete MRP-HUD:1** before freeze to resolve Object Panel ↔ MRP overlap diagnostics.

---

## Files Added / Modified

**New**

- `frontend/app/lib/dashboard/warRoom/warRoomModeContract.ts`
- `frontend/app/lib/dashboard/warRoom/warRoomModeContract.test.ts`
- `frontend/app/lib/dashboard/warRoom/warRoomModeLegacyFindings.ts`
- `frontend/app/components/dashboard/warRoom/WarRoomWorkspaceShell.tsx`

**Modified**

- `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx`
- `frontend/app/components/main-right-panel/MainRightPanelShell.tsx`
- `frontend/app/screens/HomeScreen.tsx`

---

## Verification

- `node --test app/lib/dashboard/warRoom/warRoomModeContract.test.ts`
- `npm run build`
- Manual: Select object → War Room → Dashboard shows War Room workspace with object, Ready status, situation summary placeholder

---

## Executive Mode Coverage (Post MRP:6:1)

| Dashboard Mode | Shell | Status |
|----------------|-------|--------|
| overview | Generic placeholder + legacy host | MRP:1:2 |
| focus | FocusModeSurface | MRP:2:2 |
| analyze | AnalyzeWorkspaceShell | MRP:3:1 |
| compare | CompareWorkspaceShell | MRP:4:1 |
| scenario | ScenarioWorkspaceShell | MRP:5:1 |
| war_room | WarRoomWorkspaceShell | MRP:6:1 |

All Object Panel primary actions now route to dedicated Dashboard workspace shells.
