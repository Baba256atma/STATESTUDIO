# MRP:10:12 — Dashboard Visible Right Rail Host Fix Report

**Date:** 2026-06-08  
**Scope:** Route `MainRightPanelShell` / `DashboardRuntimePanel` to the visible Type-C right rail instead of headless `ObjectPanelShell`.

---

## 1. Previous hidden mount path

```
/type-c
→ HomeScreen.panelContent
→ createPortal → #nexora-right-panel-root
→ ObjectPanelShell [headless: 1×1px, opacity:0]
   └── object-panel-host [display:none]
       └── MainRightPanelShell (0×0)
           └── DashboardRuntimePanel
               └── ExecutiveDashboardHomeSurface (0×0, not visible)

Visible right rail (user saw):
→ ExecutiveAssistantPanelShell
   └── Nexora AI / Scenario / Comparison
```

**Root cause:** Type-C clean mode hides `ObjectPanelShell` (`shouldShowExecutiveObjectPanelDock() === false`) while MRP continued portaling into `#nexora-right-panel-root` inside that hidden shell.

---

## 2. New visible mount path

```
/type-c (Type-C clean mode)
→ NexoraShell aside#nexora-right-rail
→ #nexora-visible-mrp-host [data-nx=visible-mrp-host] (359×840px, visible)
→ createPortal(panelContent)
   └── MainRightPanelShell
       ├── Dashboard tab → DashboardRuntimePanel → ExecutiveDashboardHomeSurface
       └── Assistant tab → MainRightPanelAssistantStackHosts
           ├── #nexora-executive-assistant-host
           ├── #nexora-executive-scenario-host
           └── #nexora-executive-comparison-host

ObjectPanelShell remains headless for scene/HUD infrastructure only.
ExecutiveAssistantPanelShell is NOT rendered when visible MRP host is active.
```

**Portal resolution:** `shouldUseVisibleMrpRightRailHost()` → portal to `#nexora-visible-mrp-host`; otherwise legacy `#nexora-right-panel-root`.

---

## 3. Files changed

| File | Change |
|------|--------|
| `frontend/app/lib/ui/executiveWorkspaceLayout.ts` | Added `visibleMrpHost: "nexora-visible-mrp-host"` zone id |
| `frontend/app/lib/ui/mainRightPanelVisibleHostRuntime.ts` | **NEW** — visible host policy, `[MRP10VisibleHost]` traces, bounding box measurement |
| `frontend/app/components/NexoraShell.tsx` | Renders visible MRP host; skips standalone `ExecutiveAssistantPanelShell` in Type-C clean mode |
| `frontend/app/components/main-right-panel/MainRightPanelAssistantStackHosts.tsx` | **NEW** — assistant/scenario/comparison portal targets inside MRP assistant tab |
| `frontend/app/components/main-right-panel/MainRightPanelShell.tsx` | `useIntegratedAssistantStack` prop for Type-C assistant tab |
| `frontend/app/screens/HomeScreen.tsx` | Portal routing to visible host; assistant host re-resolution; visible host traces |
| `frontend/scripts/mrp10-visible-host-evidence.mjs` | **NEW** — runtime validation script |
| `frontend/app/components/right-panel/RightPanelHost.tsx` | Type fix for trace detail (no behavior change) |

---

## 4. Runtime trace logs (live `/type-c`, Playwright)

```
[MRP10VisibleHost] activeTab=dashboard
dashboardMode=overview
visibleHost=right-rail
rendering=ExecutiveDashboardHomeSurface
hiddenObjectPanelShell=true
dashboardHomeBox width=358 height=700.96875
executiveAssistantShell hidden when dashboard active=true

[MRP10RuntimeTrace] MainRightPanelShell mounted { activeTab: dashboard, dashboardMode: overview }
[MRP10RuntimeTrace] ExecutiveDashboardHomeSurface mounted { dashboardMode: overview }
[MRP10RuntimeTrace] legacyDashboardHost suppressed { dashboardMode: overview }
```

**Assistant tab switch:**

```
[MRP10VisibleHost] activeTab=assistant
dashboardMode=overview
visibleHost=right-rail
rendering=ExecutiveAssistantPanelStack
hiddenObjectPanelShell=true
executiveAssistantShell hidden when dashboard active=false
```

---

## 5. Bounding box proof

| Element | Before (MRP:10:11-FIX) | After (MRP:10:12) |
|---------|------------------------|-------------------|
| `#nexora-visible-mrp-host` | N/A | **359 × 840 px** |
| `executive-dashboard-home-surface` | **0 × 0** | **358 × 701 px** |
| `#nexora-right-panel-root` children | 1 (hidden) | **0** |
| `executive-assistant-shell` present | true (visible stack) | **false** (integrated in MRP assistant tab) |

---

## 6. Screenshot proof

Dashboard tab — Dashboard Home visible in right rail:

![Dashboard Home visible](../frontend/.tmp/mrp10-visible-host-evidence/visible-mrp-host-dashboard.png)

Evidence artifacts: `frontend/.tmp/mrp10-visible-host-evidence/evidence.json`

Reproduce:

```bash
cd frontend && MRP10_BASE_URL=http://localhost:3000 node scripts/mrp10-visible-host-evidence.mjs
```

---

## 7. Build result

```
npm run build — PASS
```

---

## Definition of Done

| Criterion | Status |
|-----------|--------|
| Dashboard Home visible in right rail | ✅ 358×701px bounding box |
| MRP no longer mounts into hidden ObjectPanelShell | ✅ `hiddenRootChildCount: 0` |
| Assistant tab still works | ✅ Assistant stack hosts in MRP assistant tabpanel |
| Dedicated mode header path preserved | ✅ `DedicatedDashboardModeHeader` in `DashboardRuntimePanel` dedicated branch |
| Legacy RightPanelHost suppressed | ✅ `legacyDashboardHost suppressed` log |
| Build passes | ✅ |
| Runtime screenshot proves change | ✅ |

---

## Architecture rule enforced

**MRP lives in the visible right dock (`#nexora-visible-mrp-host`), not inside headless `ObjectPanelShell`.** Object/scene infrastructure remains in headless shell; dashboard and assistant UX is owned by `MainRightPanelShell` on the visible rail.
