# MRP:3:1 — Analyze Workspace Shell Report

**Date:** 2026-06-07  
**Scope:** Analyze Mode foundation — executive analysis workspace shell only. No intelligence engines.

---

## 1. Analyze Runtime Architecture

### Flow

```
Select Object (HomeScreen.selectedObjectIdState)
      ↓
Object Panel → [Analyze]
      ↓
Object Panel Action Router (MRP:2:1)
      ↓
NexoraWorkspaceState.dashboardMode = "analyze"
      ↓
DashboardRuntimePanel → AnalyzeWorkspaceShell
      ↓
Module slots (coming soon)
```

### Components

| Layer | File | Role |
|-------|------|------|
| Contract | `frontend/app/lib/dashboard/analyze/analyzeModeContract.ts` | Workspace context resolution, module registry, brakes |
| Shell | `frontend/app/components/dashboard/analyze/AnalyzeWorkspaceShell.tsx` | Executive analysis workspace UI |
| Runtime panel | `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx` | Renders Analyze shell when mode is `analyze` |
| Object context | `dashboardFocusObjectData` memo in HomeScreen | Shared read-only builder (same as Focus) |

Analyze Mode is a **valid Dashboard mode** under `NexoraWorkspaceState.dashboardMode`. Dashboard Runtime remains the authority.

---

## 2. Context Ownership Map

| Concern | Owner | Analyze role |
|---------|-------|----------------|
| Object selection | `HomeScreen.selectedObjectIdState` | Read-only |
| Route object | `dashboardRouteObjectId` / `dashboardRouteObjectName` | Set by MRP:2:1 router |
| Dashboard mode | `NexoraWorkspaceState.dashboardMode` | Set by router; Analyze never writes |
| Object panel data | `buildExecutiveObjectPanelData()` | Read-only input to workspace |
| Analyze workspace | `AnalyzeWorkspaceShell` | Presentation only |
| Module engines | Not implemented | Future slots in `ANALYZE_WORKSPACE_MODULES` |

**Shared context input:** `AnalyzeModeContextInput` aliases `FocusModeContextInput`. Object ID resolution reuses `resolveFocusObjectId()` from Focus contract.

---

## 3. State Authority Validation

| Rule | Status |
|------|--------|
| No duplicated object state | ✅ Reuses `dashboardFocusObjectData` memo |
| No duplicated dashboard state | ✅ Mode owned by workspace reducer only |
| Analyze workspace does not own selection | ✅ No dispatch/setters in shell or contract |
| Analyze workspace does not own mode | ✅ No mode mutations |
| No useEffect sync loops | ✅ Pure memoized derivation in HomeScreen |
| Legacy host hidden in Analyze mode | ✅ Same as Focus — `isDedicatedMode` guard |

---

## 4. Runtime Protections

### Brake logs — `[AnalyzeMode][Brake]`

| Message | Trigger |
|---------|---------|
| Missing object | No route or selected object ID |
| Missing analysis context | ID present but panel data unavailable/mismatch |
| Invalid workspace state | Panel data with empty objectId |

`Missing dashboard runtime` remains in MRP:2:1 Object Action Router.

### Fallback behavior

- **No object:** *"No active object selected."*
- **Partial context:** Workspace renders with status **Limited** and module placeholders
- **Routing failure:** Dashboard mode unchanged (MRP:2:1 brakes)

### Performance guards

- Memoized `analyzeModeContext` — no recursive updates
- No scene, camera, timeline, topology, or HUD layout changes
- Legacy `RightPanelHost` not mounted in Analyze dedicated mode

---

## 5. Risks Discovered

| Risk | Mitigation |
|------|------------|
| Legacy `risk_flow` panel opened by old analyze paths | Object Panel [Analyze] routes to Dashboard only (MRP:2:1) |
| `nexora:request-object-analyze` chat path still active | Documented as separate chat path; Dashboard route is canonical for Object Panel |
| Phase 4 `riskIntelligence` modules exist separately | Module slots reserved; future wiring must use slots, not bypass Dashboard |
| Shared memo name `dashboardFocusObjectData` | Serves both Focus and Analyze; rename optional follow-up |
| Scenario module name overlap with `scenarioIntelligence` | Documented; Compare/Scenario modes are separate future prompts |

---

## 6. Preparation Work for Compare Mode

1. **Follow Analyze/Focus pattern:** `compareModeContract.ts` + `CompareWorkspaceShell.tsx`.
2. **Reuse shared object context memo** — same `dashboardFocusObjectData` input.
3. **Add Compare module slots** in contract (e.g. side-by-side options, scenario pairs) as placeholders.
4. **Wire via MRP:2:1 router** — `[Compare]` already maps to `dashboardMode: "compare"`.
5. **Hide legacy host** in Compare dedicated mode (`isDedicatedMode` extension).
6. **Do not implement comparison engine** in Compare foundation prompt — shell only.

---

## Workspace Layout

Implemented in `AnalyzeWorkspaceShell`:

- **Analysis Workspace** header
- **Object** + **Status** (Ready / Limited)
- **Analysis Modules** list:
  - Risk Analysis (coming soon)
  - Impact Analysis (coming soon)
  - Confidence Analysis (coming soon)
  - Dependency Analysis (coming soon)
  - Scenario Analysis (coming soon)
  - Executive Recommendations (coming soon)

---

## Files Added / Modified

**New**

- `frontend/app/lib/dashboard/analyze/analyzeModeContract.ts`
- `frontend/app/lib/dashboard/analyze/analyzeModeContract.test.ts`
- `frontend/app/lib/dashboard/analyze/analyzeModeLegacyFindings.ts`
- `frontend/app/components/dashboard/analyze/AnalyzeWorkspaceShell.tsx`

**Modified**

- `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx`
- `frontend/app/components/main-right-panel/MainRightPanelShell.tsx`
- `frontend/app/screens/HomeScreen.tsx`

---

## Verification

- `node --test app/lib/dashboard/analyze/analyzeModeContract.test.ts`
- `npm run build`
- Manual: Select object → Analyze → Dashboard shows Analysis Workspace with object name, Ready status, module list
