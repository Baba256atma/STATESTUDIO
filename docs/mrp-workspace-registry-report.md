# MRP:8:1 — Executive Workspace Registry + Catalog Report

**Date:** 2026-06-07  
**Scope:** Unified workspace registry architecture only. No workspace UI, engines, or business logic.

---

## 1. Registry Architecture

### Principle

**Registry describes. Dashboard decides. Workspace renders. Assistant requests.**

The Executive Workspace Registry is the single source of truth for Dashboard workspace metadata. It does not execute workspaces, own dashboard state, or render UI.

### Flow

```
Registry (metadata catalog)
     ↓ discover / validate
Dashboard Runtime (authority)
     ↓ setDashboardMode
Workspace UI Shell (renders)
     ↑
Assistant / Object Panel (request via approved contracts)
```

### Components

| Layer | File | Role |
|-------|------|------|
| Contract | `executiveWorkspaceRegistryContract.ts` | Catalog schema, entries, validation, brakes |
| Runtime | `executiveWorkspaceRegistryRuntime.ts` | Initialize once, discover, list |
| Legacy findings | `executiveWorkspaceRegistryLegacyFindings.ts` | Duplicate routes, migration plan |
| Adoption | `objectPanelActionRouterRuntime.ts` | Resolves modes via registry |
| Discovery | `DashboardRuntimePanel.tsx` | Dedicated mode detection via registry |

### Registry vs Intelligence Surface Registry

| Registry | Domain |
|----------|--------|
| `executiveWorkspaceRegistryContract.ts` | **Executive workspaces** (Focus, Analyze, War Room, etc.) |
| `dashboardSurfaceRegistry.ts` | **Intelligence surfaces** (operational, risk intelligence accordion panels) |

These are decoupled. Cross-reference via `futureCapabilityFlags` when domains align.

---

## 2. Workspace Catalog Schema

### `ExecutiveWorkspaceCatalogEntry`

| Field | Type | Purpose |
|-------|------|---------|
| `id` | `ExecutiveWorkspaceId` | Canonical workspace identity |
| `name` | `string` | Display name |
| `category` | `ExecutiveWorkspaceCategory` | Grouping (analysis, operations, etc.) |
| `dashboardMode` | `DashboardMode \| null` | Maps to `NexoraWorkspaceState.dashboardMode` |
| `objectPanelAction` | `ObjectPanelDashboardAction \| null` | Object panel route key |
| `assistantAction` | `AssistantExecutiveActionKind \| null` | Bridge action key |
| `owner` | `ExecutiveWorkspaceOwner` | `dashboard_runtime` or `workspace_ui` |
| `availability` | `ExecutiveWorkspaceAvailabilityState` | Lifecycle availability |
| `lifecycleType` | `ExecutiveWorkspaceLifecycleType` | persistent / session / transient |
| `description` | `string` | Executive-visible description |
| `shellComponent` | `string \| null` | UI shell reference (metadata only) |
| `routeContract` | `string` | Mode contract file path |
| `futureCapabilityFlags` | `readonly string[]` | Reserved capability placeholders |

### Catalog entries (14 total)

| ID | Availability | Dashboard Mode | Shell |
|----|--------------|----------------|-------|
| overview | available | overview | — |
| focus | available | focus | FocusModeSurface |
| analyze | available | analyze | AnalyzeWorkspaceShell |
| compare | available | compare | CompareWorkspaceShell |
| scenario | available | scenario | ScenarioWorkspaceShell |
| war_room | available | war_room | WarRoomWorkspaceShell |
| risk | future | — | — |
| timeline | future | — | — |
| simulation | future | — | — |
| decision_center | future | — | — |
| recommendations | future | — | — |
| governance | future | — | — |
| forecasting | future | — | — |
| optimization | future | — | — |

---

## 3. Ownership Model

| Concern | Owner | Registry role |
|---------|-------|---------------|
| Metadata | Registry | Owns catalog entries |
| Execution | Dashboard Runtime | Validates then `setDashboardMode` |
| UI rendering | Workspace shells | Named in `shellComponent` metadata |
| Conversation | Assistant | Requests via bridge — never reads registry as authority |
| Transport | Bridge | Maps actions — registry provides lookup target |

**No ownership overlap.** Registry never dispatches, never renders, never mutates state.

---

## 4. Lifecycle Model

| State | Meaning | Dashboard behavior |
|-------|---------|-------------------|
| `available` | Openable workspace | Dashboard may open after validation |
| `disabled` | Temporarily blocked | Validation rejects with `workspace_disabled` |
| `experimental` | Limited rollout | Reserved — dashboard decides handling |
| `deprecated` | Sunset path | Validation rejects; migration recommended |
| `future` | Placeholder only | Validation rejects with `workspace_not_available` |

Registry reports state. Dashboard decides how to handle it.

---

## 5. Validation Model

`validateExecutiveWorkspaceOpenRequest()` checks:

1. Workspace exists in catalog
2. Workspace is not `future` / `disabled` / `deprecated`
3. Workspace has valid `dashboardMode` route
4. Ownership is authorized

### Integration points

| Path | Validation |
|------|------------|
| Object panel router | Registry validation before route success |
| Assistant bridge | Future actions blocked at bridge (MRP:7:1) — registry aligns |
| Dashboard runtime panel | `isDedicatedExecutiveWorkspaceMode()` for shell selection |

### Brake prefix

`[WorkspaceRegistry][Brake]` — duplicate ID, invalid route, missing definition, invalid lifecycle, unauthorized ownership, registry mismatch.

---

## 6. Legacy Migration Findings

### Duplicate definitions identified

| Location | Duplicate of registry |
|----------|----------------------|
| `objectPanelActionRouterRuntime.ts` | ~~OBJECT_PANEL_ACTION_TO_MODE~~ → **adopted** |
| `assistantDashboardBridgeContract.ts` | ASSISTANT_ACTION_TO_MODE maps — pending adoption |
| `dashboardModeRuntimeContract.ts` | DASHBOARD_MODES + labels — documented parallel |
| `DashboardRuntimePanel.tsx` | ~~isDedicatedMode hardcode~~ → **partial adoption** |
| `dashboardSurfaceRegistry.ts` | Different domain — decoupled |

### Legacy bypass paths (not removed)

| Path | Status |
|------|--------|
| Legacy `setDashboardContext` router | Pending registry validation adoption |
| SIM/RSK panel opens in HomeScreen | Documented bypass |
| LeftCommandAssistant chat/SIM paths | Documented bypass (MRP:7:5 QA) |

### Adoption plan

1. **Phase 1 (MRP:8:1):** Registry contract + catalog + validation ✅
2. **Phase 2:** Object panel router resolves modes from registry ✅
3. **Phase 3:** Assistant bridge resolves actions from registry
4. **Phase 4:** DashboardRuntimePanel dedicated mode from registry ✅ (detection)
5. **Phase 5:** Legacy dashboardContextRouter adopts validation
6. **Phase 6:** Future workspace shells register in catalog only

---

## 7. Future Expansion Strategy

Adding a new executive workspace requires:

1. **Registry entry** — add to `EXECUTIVE_WORKSPACE_CATALOG`
2. **Workspace UI** — implement shell component
3. **Dashboard validation** — extend `DashboardMode` when mode is active
4. **Nothing else** — no Dashboard Runtime architecture changes

Future placeholders already reserved: risk, timeline, simulation, decision_center, recommendations, governance, forecasting, optimization.

Each future entry includes `futureCapabilityFlags` for capability metadata without implementation.

---

## 8. Performance Guarantees

| Rule | Status |
|------|--------|
| Initialize once | ✅ `registryInitialized` flag |
| No rerender loops | ✅ Registry is static; no React state |
| No route loops | ✅ Validation only on route request |
| No recursive registration | ✅ Single init path |
| No runtime scanning loops | ✅ O(n) catalog lookup, n=14 |
| No workspace duplication | ✅ `detectDuplicateExecutiveWorkspaceDefinitions()` |
| No polling / background workers | ✅ None |

---

## 9. HUD Protection

No modifications to Object Panel, Timeline Panel, Scene HUD, MRP Layout, Assistant Layout, or Dashboard Layout visual structure. Architecture-only changes.

MRP-HUD:1 zoning blocker remains documented separately.

---

## 10. Definition of Done

| Criterion | Status |
|-----------|--------|
| Registry exists | ✅ |
| Dashboard discovers workspaces through registry | ✅ |
| Workspace metadata centralized | ✅ |
| Duplicate routes identified | ✅ |
| Legacy routing documented | ✅ |
| Ownership boundaries preserved | ✅ |
| No routing loops | ✅ |
| No registry loops | ✅ |
| Build passes | ✅ |

---

## 11. Files Created / Modified

**Created**

- `frontend/app/lib/dashboard/executiveWorkspaceRegistryContract.ts`
- `frontend/app/lib/dashboard/executiveWorkspaceRegistryRuntime.ts`
- `frontend/app/lib/dashboard/executiveWorkspaceRegistryLegacyFindings.ts`
- `frontend/app/lib/dashboard/executiveWorkspaceRegistryContract.test.ts`
- `docs/mrp-workspace-registry-report.md`

**Modified**

- `frontend/app/lib/object-panel/objectPanelActionRouterRuntime.ts` — registry mode resolution + validation
- `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx` — registry dedicated mode detection
- `frontend/app/lib/dashboard/index.ts` — exports

---

## Final Architecture Rule — Verified

**Registry describes. Dashboard decides. Workspace renders. Assistant requests.**

Dashboard Runtime remains the single executive workspace authority. Registry is metadata only.
