# MRP:5:1 — Scenario Workspace Shell Report

**Date:** 2026-06-07  
**Scope:** Scenario Mode foundation — executive scenario workspace shell only. No simulation, forecasting, or decision engines.

---

## 1. Scenario Runtime Architecture

### Flow

```
Object Panel → [Scenario]
      ↓
Object Panel Action Router (MRP:2:1)
      ↓
NexoraWorkspaceState.dashboardMode = "scenario"
      ↓
DashboardRuntimePanel → ScenarioWorkspaceShell
      ↓
Module slots + Scenario Center placeholder
```

### Components

| Layer | File | Role |
|-------|------|------|
| Contract | `frontend/app/lib/dashboard/scenario/scenarioModeContract.ts` | Workspace context, module registry, future extension slots, brakes |
| Shell | `frontend/app/components/dashboard/scenario/ScenarioWorkspaceShell.tsx` | Executive scenario workspace UI |
| Runtime panel | `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx` | Renders Scenario shell when mode is `scenario` |
| Object context | `dashboardFocusObjectData` memo in HomeScreen | Shared read-only builder (all executive modes) |

Scenario Mode is a **valid Dashboard mode** under `NexoraWorkspaceState.dashboardMode`. Dashboard Runtime remains the authority.

### Workspace layout

- **Scenario Workspace** header
- **Object** + **Status** (Ready / Limited)
- **Scenario Center:** *No active scenario.* + future generation message
- **Future Areas** (placeholders):
  - Scenario Builder, Scenario Timeline
  - Impact / Risk / Opportunity Projection
  - Executive Recommendation Layer

### Future extension points (contract only, not UI engines)

`SCENARIO_FUTURE_EXTENSION_SLOTS`: Scenario A, Scenario B, Scenario Timeline, Scenario Results, Scenario Comparison, Scenario Recommendation.

---

## 2. Context Ownership Map

| Concern | Owner | Scenario role |
|---------|-------|----------------|
| Object selection | `HomeScreen.selectedObjectIdState` | Read-only |
| Route object | `dashboardRouteObjectId` / `dashboardRouteObjectName` | Set by MRP:2:1 router |
| Dashboard mode | `NexoraWorkspaceState.dashboardMode` | Set by router; Scenario never writes |
| Object panel data | `buildExecutiveObjectPanelData()` | Read-only input |
| Scenario workspace | `ScenarioWorkspaceShell` | Presentation only |
| Simulation engines | Not implemented | Future module attachment |

**Shared context input:** `ScenarioModeContextInput` aliases `FocusModeContextInput`. Object ID resolution reuses `resolveFocusObjectId()`.

---

## 3. State Authority Validation

| Rule | Status |
|------|--------|
| No duplicated object state | ✅ Reuses `dashboardFocusObjectData` memo |
| No duplicated dashboard state | ✅ Mode owned by workspace reducer only |
| Scenario workspace does not own selection | ✅ No dispatch/setters in shell or contract |
| Scenario workspace is not a runtime authority | ✅ No local mode, selection, or simulation stores |
| No simulation execution | ✅ No scenarioActionClient or engine invocation |
| No useEffect sync loops | ✅ Pure memoized derivation in HomeScreen |
| Legacy host hidden in Scenario mode | ✅ `isDedicatedMode` guard extended |

---

## 4. Runtime Protections

### Brake logs — `[ScenarioMode][Brake]`

| Message | Trigger |
|---------|---------|
| Missing object | No route or selected object ID |
| Invalid scenario context | ID present but panel data unavailable/mismatch |
| Missing scenario contract | Module registry empty (defensive) |

`Missing dashboard runtime` remains in MRP:2:1 Object Action Router.

### Fallback behavior

- **No object:** *"No active object selected."*
- **Partial context:** Workspace renders with **Limited** status and placeholders
- **Routing failure:** Dashboard mode unchanged (MRP:2:1 brakes)

### Performance guards

- Memoized `scenarioModeContext` — no recursive updates
- No scene refresh, camera movement, topology recalculation, timeline mutation
- No background processing or simulation execution
- Legacy `RightPanelHost` not mounted in Scenario dedicated mode

---

## 5. Risks Discovered

| Risk | Mitigation |
|------|------------|
| Legacy `run_scenario` / simulate panel paths | Object Panel [Scenario] routes to Dashboard only (MRP:2:1) |
| `scenarioActionClient` / comparison engines exist | Not invoked from workspace shell |
| `scenarioIntelligence` Phase 4 module | Future wiring must use workspace module slots |
| `executiveMultiScenarioUniverse` scene playback | Decoupled; workspace mount does not trigger playback |
| Many legacy scenario files (100+) | Documented; shell does not import simulation layer |
| **HUD overlap blocker** | MRP-HUD:1 repair pass still required before MRP Freeze — Object Panel ↔ MRP collision diagnostics may remain active |

---

## 6. Preparation Work for War Room Mode

1. **Follow Scenario/Compare pattern:** `warRoomModeContract.ts` + `WarRoomWorkspaceShell.tsx`.
2. **Reuse shared object context memo** — same `dashboardFocusObjectData` input.
3. **Define War Room module slots** (crisis coordination, stakeholder map, decision queue, live intelligence feeds) as placeholders.
4. **Wire via MRP:2:1 router** — `[War Room]` already maps to `dashboardMode: "war_room"`.
5. **Extend `isDedicatedMode`** in DashboardRuntimePanel for war_room dedicated rendering.
6. **Do not implement war room orchestration engine** in foundation prompt — shell only.
7. **Avoid legacy `open_war_room` panel opens** for primary Object Panel War Room action.
8. **Complete MRP-HUD:1** before MRP Freeze to resolve HUD zoning overlap regressions.

---

## Files Added / Modified

**New**

- `frontend/app/lib/dashboard/scenario/scenarioModeContract.ts`
- `frontend/app/lib/dashboard/scenario/scenarioModeContract.test.ts`
- `frontend/app/lib/dashboard/scenario/scenarioModeLegacyFindings.ts`
- `frontend/app/components/dashboard/scenario/ScenarioWorkspaceShell.tsx`

**Modified**

- `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx`
- `frontend/app/components/main-right-panel/MainRightPanelShell.tsx`
- `frontend/app/screens/HomeScreen.tsx`

---

## Verification

- `node --test app/lib/dashboard/scenario/scenarioModeContract.test.ts`
- `npm run build`
- Manual: Select object → Scenario → Dashboard shows Scenario Workspace with object, Ready status, Scenario Center placeholder

---

## Known Blocker (External to MRP:5:1)

**MRP-HUD:1 — HUD Zoning Repair Pass** remains required before MRP Freeze. This prompt does not modify HUD zoning; it consumes existing layout contracts only. Overlap diagnostics between Object Panel and MRP may still be reported until MRP-HUD:1 is completed.
