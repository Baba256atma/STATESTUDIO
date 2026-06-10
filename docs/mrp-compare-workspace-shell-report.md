# MRP:4:1 — Compare Workspace Shell Report

**Date:** 2026-06-07  
**Scope:** Compare Mode foundation — executive comparison workspace shell only. No comparison engines.

---

## 1. Compare Runtime Architecture

### Flow

```
Object Panel → [Compare]
      ↓
Object Panel Action Router (MRP:2:1)
      ↓
NexoraWorkspaceState.dashboardMode = "compare"
      ↓
DashboardRuntimePanel → CompareWorkspaceShell
      ↓
Module slots (coming soon)
```

### Components

| Layer | File | Role |
|-------|------|------|
| Contract | `frontend/app/lib/dashboard/compare/compareModeContract.ts` | Workspace context, module registry, brakes |
| Shell | `frontend/app/components/dashboard/compare/CompareWorkspaceShell.tsx` | Executive comparison workspace UI |
| Runtime panel | `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx` | Renders Compare shell when mode is `compare` |
| Object context | `dashboardFocusObjectData` memo in HomeScreen | Shared read-only builder (Focus/Analyze/Compare) |

Compare Mode is a **valid Dashboard mode** under `NexoraWorkspaceState.dashboardMode`. Dashboard Runtime remains the authority.

### Phase 1 state model

- **Primary object:** from route object ID or selected object ID
- **Target object:** placeholder `"Not Selected"` (no second selection yet)
- **Status:** `"Waiting For Comparison Target"` when primary resolved; `"Limited Context"` when panel data incomplete

---

## 2. Context Ownership Map

| Concern | Owner | Compare role |
|---------|-------|----------------|
| Object selection | `HomeScreen.selectedObjectIdState` | Read-only |
| Route object | `dashboardRouteObjectId` / `dashboardRouteObjectName` | Set by MRP:2:1 router |
| Dashboard mode | `NexoraWorkspaceState.dashboardMode` | Set by router; Compare never writes |
| Object panel data | `buildExecutiveObjectPanelData()` | Read-only input |
| Compare workspace | `CompareWorkspaceShell` | Presentation only |
| Target selection | Not implemented | Future prompt |

**Shared context input:** `CompareModeContextInput` aliases `FocusModeContextInput`. Object ID resolution reuses `resolveFocusObjectId()`.

---

## 3. State Authority Validation

| Rule | Status |
|------|--------|
| No duplicated object state | ✅ Reuses `dashboardFocusObjectData` memo |
| No duplicated dashboard state | ✅ Mode owned by workspace reducer only |
| Compare workspace does not own selection | ✅ No dispatch/setters in shell or contract |
| Compare workspace is not a second runtime | ✅ No local mode or selection stores |
| No useEffect sync loops | ✅ Pure memoized derivation in HomeScreen |
| Legacy host hidden in Compare mode | ✅ `isDedicatedMode` guard extended |

---

## 4. Runtime Protections

### Brake logs — `[CompareMode][Brake]`

| Message | Trigger |
|---------|---------|
| Missing object | No route or selected object ID |
| Invalid comparison context | ID present but panel data unavailable/mismatch |
| Missing comparison contract | Module registry empty (defensive) |

`Missing dashboard runtime` remains in MRP:2:1 Object Action Router.

### Fallback behavior

- **No object:** *"No active object selected."*
- **Partial context:** Workspace renders with **Limited Context** status and placeholders
- **Routing failure:** Dashboard mode unchanged (MRP:2:1 brakes)

### Performance guards

- Memoized `compareModeContext` — no recursive updates
- No scene, camera, timeline, topology, or HUD layout changes
- Legacy `RightPanelHost` not mounted in Compare dedicated mode

---

## 5. Risks Discovered

| Risk | Mitigation |
|------|------------|
| Legacy `compare` panel in RightPanelHost | Object Panel [Compare] routes to Dashboard only (MRP:2:1) |
| `buildComparePanelModel` / `compareClient` legacy engines | Documented; future wiring must use workspace module slots |
| `DecisionComparePanel` legacy UI | Not mounted in MRP; Compare workspace is canonical |
| Target object selection deferred | Phase 1 placeholder; status communicates readiness |
| Shared memo name `dashboardFocusObjectData` | Serves Focus, Analyze, Compare; rename optional follow-up |
| Scenario comparison name overlap | `scenarioCompareTypes` separate from Dashboard module slot |

---

## 6. Preparation Work for Scenario Mode

1. **Follow Compare/Analyze pattern:** `scenarioModeContract.ts` + `ScenarioWorkspaceShell.tsx`.
2. **Reuse shared object context memo** — same `dashboardFocusObjectData` input.
3. **Define scenario module slots** (simulation branches, timeline forks, outcome preview) as placeholders.
4. **Wire via MRP:2:1 router** — `[Scenario]` already maps to `dashboardMode: "scenario"`.
5. **Extend `isDedicatedMode`** in DashboardRuntimePanel for scenario dedicated rendering.
6. **Do not implement scenario engine** in foundation prompt — shell only.
7. **Avoid legacy `run_scenario` / simulate panel opens** for primary Object Panel Scenario action.

---

## Workspace Layout

Implemented in `CompareWorkspaceShell`:

- **Comparison Workspace** header
- **Primary** + **Target** (Not Selected) + **Status**
- **Comparison Modules:**
  - Impact Comparison (coming soon)
  - Risk Comparison (coming soon)
  - Confidence Comparison (coming soon)
  - Scenario Comparison (coming soon)

---

## Files Added / Modified

**New**

- `frontend/app/lib/dashboard/compare/compareModeContract.ts`
- `frontend/app/lib/dashboard/compare/compareModeContract.test.ts`
- `frontend/app/lib/dashboard/compare/compareModeLegacyFindings.ts`
- `frontend/app/components/dashboard/compare/CompareWorkspaceShell.tsx`

**Modified**

- `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx`
- `frontend/app/components/main-right-panel/MainRightPanelShell.tsx`
- `frontend/app/screens/HomeScreen.tsx`

---

## Verification

- `node --test app/lib/dashboard/compare/compareModeContract.test.ts`
- `npm run build`
- Manual: Select object → Compare → Dashboard shows Comparison Workspace with primary object, Not Selected target, Waiting For Comparison Target status
