# MRP:2:2 — Focus Mode Implementation Report

**Date:** 2026-06-07  
**Scope:** First real Dashboard mode — Focus. Executive Object Context Surface. Bridge-only for other actions.

---

## 1. Focus Architecture

### Flow

```
Select Object (HomeScreen.selectedObjectIdState)
      ↓
Object Panel → Click [Focus]
      ↓
Object Panel Action Router (MRP:2:1)
      ↓
NexoraWorkspaceState.dashboardMode = "focus"
      ↓
DashboardRuntimePanel → FocusModeSurface
      ↓
Executive Object Context (read-only)
```

### Components

| Layer | File | Role |
|-------|------|------|
| Contract | `frontend/app/lib/dashboard/focus/focusModeContract.ts` | Resolve focus context, brake logs |
| Surface | `frontend/app/components/dashboard/focus/FocusModeSurface.tsx` | Executive information UI |
| Runtime panel | `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx` | Mode switch; renders Focus surface |
| Data builder | `frontend/app/lib/panels/executiveObjectPanelData.ts` | Reused read-only builder |

Focus is **not** analysis, scenario, or war room. It is a dedicated object context landing page.

---

## 2. Object Context Source

Dashboard consumes existing selection context — no secondary object store.

| Field | Source |
|-------|--------|
| Object ID | `dashboardRouteObjectId` (from route) → fallback `selectedObjectIdState` |
| Object name | Route name → `buildExecutiveObjectPanelData` → label resolver |
| Status, type, insight, confidence, risk | `buildExecutiveObjectPanelData()` from sceneJson, responseData, riskPropagation, recommendation |
| Impact | Derived from `riskLevel` in panel data |
| Description | `insight` field from panel data |

**HomeScreen wiring:**

- `dashboardFocusObjectData` — memoized call to `buildExecutiveObjectPanelData` (not gated on legacy panel open state)
- `focusModeContext` — memoized `resolveFocusModeContext()` → passed to `MainRightPanelShell`

---

## 3. State Ownership Validation

| Concern | Owner | Dashboard role |
|---------|-------|----------------|
| Object selection | `HomeScreen.selectedObjectIdState` | Read-only consumer |
| Route object | `NexoraWorkspaceState.dashboardRouteObjectId/Name` | Set by router on Focus click |
| Dashboard mode | `NexoraWorkspaceState.dashboardMode` | Set by router |
| Focus UI state | None (derived) | Pure props from parent |
| Camera focus | `executiveFocusModeRuntime` | **Not used** — decoupled from Dashboard Focus |

**Validated:** No `setSelectedObjectId`, no selection dispatch, no new object stores, no useEffect sync loops.

---

## 4. Runtime Protection Added

### Brake logs — `[FocusMode][Brake]`

| Message | Trigger |
|---------|---------|
| Missing object | No route or selected object ID |
| Missing selection context | ID present but panel data unavailable |
| Invalid object state | Panel data with empty objectId |

### Fallback behavior

- **No object:** Focus surface shows *"No active object selected."*
- **Partial context:** Safe fallback view with route name and pending confidence
- **Routing failure (MRP:2:1):** Dashboard mode unchanged; existing brakes apply

### Performance guards

- Memoized context derivation (no recursive updates)
- `setDashboardMode` dedupe unchanged from MRP:2:1
- Legacy host hidden in Focus mode (no competing panel content)
- No camera, timeline, topology, or scene mutations added

---

## 5. Risks Discovered

| Risk | Mitigation |
|------|------------|
| Name collision: Dashboard Focus vs `executiveFocusModeRuntime` (camera) | Dashboard Focus does not call camera focus toggle |
| `ExecutiveObjectPanel` gated on legacy panel open | Dashboard uses independent `dashboardFocusObjectData` memo with same builder |
| Dual object panel surfaces (scene HUD + MRP dock) | Scene HUD remains action emitter; Dashboard is destination |
| Legacy `RightPanelHost` object views | Hidden during Focus mode |
| Partial data when object not in scene context | Fallback context with explicit pending fields |
| Future action buttons in Focus surface | Disabled placeholders only — no routing yet |

---

## 6. Recommendations for Analyze Mode

1. **Follow Focus pattern:** `analyzeModeContract.ts` + `AnalyzeModeSurface.tsx` + read-only context from existing builders (likely extend `buildExecutiveObjectPanelData` or risk/recommendation modules).
2. **Wire via MRP:2:1 router:** Object Panel [Analyze] already routes to `dashboardMode: "analyze"` — replace placeholder in `DashboardRuntimePanel` when mode is analyze.
3. **Do not reopen legacy `risk_flow` panel** for primary Analyze action — Dashboard remains single destination.
4. **Context authority:** Use `dashboardRouteObjectId` + `selectedObjectIdState` same as Focus; add analyze-specific fields as derived view model only.
5. **Keep legacy host isolated** for analyze mode as well.
6. **Add certification tests** mirroring `focusModeContract.test.ts`.

---

## Focus Surface Layout

Implemented in `FocusModeSurface`:

- **Focus Header** — mode label + object name
- **Metrics** — Status, Impact, Confidence, Object Type, Last Updated
- **Object Description**
- **Available Executive Actions** — Analyze, Compare, Scenario, War Room (disabled)

---

## Files Added / Modified

**New**

- `frontend/app/lib/dashboard/focus/focusModeContract.ts`
- `frontend/app/lib/dashboard/focus/focusModeContract.test.ts`
- `frontend/app/lib/dashboard/focus/focusModeLegacyFindings.ts`
- `frontend/app/components/dashboard/focus/FocusModeSurface.tsx`

**Modified**

- `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx`
- `frontend/app/components/main-right-panel/MainRightPanelShell.tsx`
- `frontend/app/screens/HomeScreen.tsx`

---

## Verification

- `node --test app/lib/dashboard/focus/focusModeContract.test.ts`
- `npm run build`
- Manual: Select object → Focus → Dashboard shows object context surface
- Manual: Focus with no selection → *"No active object selected."*
