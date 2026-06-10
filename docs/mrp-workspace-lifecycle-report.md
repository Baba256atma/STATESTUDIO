# MRP:8:2 — Executive Workspace Lifecycle Manager Report

**Date:** 2026-06-07  
**Scope:** Lifecycle architecture and dashboard workspace state contract only. No workspace features, engines, or UI redesign.

---

## 1. Lifecycle Architecture

### Principle

**Registry describes. Lifecycle manages. Dashboard executes. Workspace renders. Assistant observes.**

The Lifecycle Manager is a mandatory validation layer between Registry metadata and Dashboard execution. It tracks workspace state transitions without executing, rendering, or mutating workspace content.

### Flow

```
Registry (metadata seed)
     ↓
Lifecycle Manager (validate + track transitions)
     ↓
Dashboard Runtime (setDashboardMode — authority)
     ↓
Workspace UI (renders)
     ↑
Assistant (observes via sync summary — read-only)
```

### Components

| Layer | File | Role |
|-------|------|------|
| Contract | `executiveWorkspaceLifecycleContract.ts` | States, transition matrix, state view, validation |
| Runtime | `executiveWorkspaceLifecycleRuntime.ts` | Manager — init, prepare, commit, pause, resume |
| Legacy | `executiveWorkspaceLifecycleLegacyFindings.ts` | Gaps, bypass paths, migration notes |
| Router integration | `objectPanelActionRouterRuntime.ts` | Lifecycle validation before route |
| Dashboard integration | `HomeScreen.tsx` | Commit on open, pause/resume on tab switch |
| Sync extension | `assistantContextSyncContract.ts` | Read-only lifecycle fields in context summary |

---

## 2. State Contract

### `DashboardWorkspaceStateView`

| Field | Type | Purpose |
|-------|------|---------|
| `workspaceId` | `ExecutiveWorkspaceId` | Canonical workspace identity |
| `currentState` | `ExecutiveWorkspaceLifecycleState` | Present lifecycle state |
| `previousState` | `ExecutiveWorkspaceLifecycleState \| null` | Prior state |
| `activationTimestamp` | `number \| null` | When workspace became active |
| `lastTransitionTimestamp` | `number` | Last transition time |
| `availabilityState` | Registry availability | Seeded from catalog |
| `lifecycleStatus` | Same as currentState | Executive-visible status |
| `source` | `"workspace_lifecycle_manager"` | Authority marker |

**Metadata only.** No business payloads. No engine payloads.

### Lifecycle States

`registered` · `available` · `opening` · `active` · `paused` · `completed` · `closed` · `deprecated` · `future`

---

## 3. Transition Matrix

| From | Allowed To |
|------|------------|
| registered | available |
| available | opening |
| opening | active |
| active | paused, completed |
| paused | active |
| active | completed |
| completed | closed |

### Rejected transitions (examples)

| From | To | Result |
|------|-----|--------|
| closed | active | ❌ Blocked |
| deprecated | active | ❌ Blocked |
| opening | registered | ❌ Blocked |
| future | active | ❌ Blocked |

### Primary flow

```
Available → Opening → Active → Completed → Closed
```

### Alternative flow

```
Active → Paused → Active
```

---

## 4. Ownership Boundaries

| Concern | Owner |
|---------|-------|
| Metadata | Workspace Registry |
| Lifecycle state | Lifecycle Manager |
| Execution | Dashboard Runtime |
| Presentation | Workspace UI |
| Conversation | Assistant |
| Transport | Bridge |

**No shared ownership.** Lifecycle never calls `setDashboardMode`, never renders, never modifies dashboard content.

---

## 5. Validation Model

### Open validation chain

1. **Registry** — `validateExecutiveWorkspaceOpenRequest()`
2. **Lifecycle** — `validateWorkspaceLifecycleOpen()`
3. **Prepare** — `prepareWorkspaceLifecycleOpen()` (available→opening or paused→active)
4. **Dashboard dispatch** — `setDashboardMode`
5. **Commit** — `commitWorkspaceLifecycleOpen()` (opening→active)

### Tab switch lifecycle

| Event | Lifecycle transition |
|-------|---------------------|
| Dashboard → Assistant | `active → paused` |
| Assistant → Dashboard | `paused → active` |

Lifecycle snapshot published read-only via context sync (`lifecycleState`, `previousLifecycleState`, `lifecycleTransitionTimestamp`).

---

## 6. Failure Handling

| Scenario | Behavior |
|----------|----------|
| Invalid transition | Brake log, route rejected, current workspace preserved |
| Unknown workspace | Safe failure, no crash |
| Future workspace open | Rejected at lifecycle + registry |
| Lifecycle/registry mismatch | Rejected with brake |
| Duplicate active | Brake log, transition still applied with warning |

**Fallback:** Keep current workspace active. Keep dashboard, assistant, selection, and MRP alive. Never reset executive session.

### Brake prefix

`[WorkspaceLifecycle][Brake]`

---

## 7. Legacy Findings

| Finding | Status |
|---------|--------|
| Context sync `completionStatus` parallel to lifecycle | Partial integration — lifecycle fields added to sync |
| `setDashboardMode` without lifecycle (pre-8:2) | Adopted — router + HomeScreen wired |
| SIM/RSK panel bypass | Documented — outside lifecycle |
| Registry availability vs runtime lifecycle | Decoupled correctly — registry seeds once |
| Conversation continuity lifecyclePhase | Read-only observer — not authoritative |

---

## 8. Future Workspace Expansion Plan

Future workspaces (risk, timeline, simulation, decision_center, recommendations, governance, forecasting, optimization) are seeded with `future` lifecycle state from registry catalog.

To activate a future workspace:
1. Update registry entry — `availability: available`, assign `dashboardMode`
2. Lifecycle auto-seeds on init — transitions become available
3. Implement workspace UI shell
4. No Lifecycle Manager architecture changes required

---

## 9. Performance Guarantees

| Rule | Status |
|------|--------|
| Initialize once | ✅ |
| No rerender loops | ✅ Static module state |
| No transition loops | ✅ Validated transition matrix |
| No recursive state updates | ✅ Single transition per call |
| No lifecycle polling | ✅ Event-driven only |
| No scene/timeline mutation | ✅ |

---

## 10. Definition of Done

| Criterion | Status |
|-----------|--------|
| Lifecycle Manager exists | ✅ |
| Workspace state contract exists | ✅ |
| Transition matrix validated | ✅ |
| Invalid transitions blocked | ✅ |
| Ownership boundaries preserved | ✅ |
| No duplicated state authority | ✅ |
| No transition loops | ✅ |
| No route bypasses (object panel path) | ✅ |
| Build passes | ✅ |

---

## 11. Files Created / Modified

**Created**

- `frontend/app/lib/dashboard/executiveWorkspaceLifecycleContract.ts`
- `frontend/app/lib/dashboard/executiveWorkspaceLifecycleRuntime.ts`
- `frontend/app/lib/dashboard/executiveWorkspaceLifecycleLegacyFindings.ts`
- `frontend/app/lib/dashboard/executiveWorkspaceLifecycleContract.test.ts`
- `docs/mrp-workspace-lifecycle-report.md`

**Modified**

- `frontend/app/lib/object-panel/objectPanelActionRouterRuntime.ts` — lifecycle validation layer
- `frontend/app/screens/HomeScreen.tsx` — commit, pause, resume, sync lifecycle fields
- `frontend/app/lib/assistant-bridge/assistantContextSyncContract.ts` — read-only lifecycle in summary
- `frontend/app/lib/dashboard/index.ts` — exports

---

## Final Architecture Rule — Verified

**Registry describes. Lifecycle manages. Dashboard executes. Workspace renders. Assistant observes.**
