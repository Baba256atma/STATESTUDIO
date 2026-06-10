# MRP:8:4 — Executive Workspace Back Stack + Navigation History Report

**Date:** 2026-06-07  
**Scope:** Navigation history architecture only. No breadcrumbs UI, AI memory, or workspace features.

---

## 1. Back Stack Architecture

### Principle

**History remembers. Controller validates. Dashboard executes. Only one workspace remains active.**

Navigation history is **observational only**. It never executes workspaces, modifies lifecycle state, or becomes execution authority.

### Stack position in architecture

```
Workspace Registry (metadata)
        ↓
Lifecycle Manager (state)
        ↓
Transition Controller (handoff + single-active)
        ↓
Navigation History (back stack + path)  ← observational
        ↓
Dashboard Runtime (execution authority)
        ↓
Active Workspace UI
```

### Components

| Layer | File | Role |
|-------|------|------|
| Contract | `executiveWorkspaceNavigationHistoryContract.ts` | Schema, validation, depth limits, brakes |
| Runtime | `executiveWorkspaceNavigationHistoryRuntime.ts` | Back stack, path, record, controlled back |
| Legacy | `executiveWorkspaceNavigationHistoryLegacyFindings.ts` | Bypass paths, migration notes |
| Integration | `HomeScreen.tsx` | Record forward commits; sync navigation summary |
| Sync | `assistantContextSyncContract.ts` | Read-only path fields for Assistant |

---

## 2. Navigation Contract

### History records

- Workspace transitions (forward, back, passive pause/resume)
- Workspace entries and exits
- Transition timestamps
- Lifecycle snapshot metadata (state only)

### History does NOT

- Execute workspaces
- Modify workspaces or lifecycle
- Control transitions (Controller remains authority)
- Store business/engine/analysis/simulation payloads

### Default depth

**10 entries** — configurable via `initializeExecutiveWorkspaceNavigationHistory({ maxDepth })`. Overflow trims oldest entries with `[WorkspaceHistory][Brake]`.

**History ≠ AI memory.**

---

## 3. History Schema

### `WorkspaceNavigationHistoryEntry`

| Field | Type | Purpose |
|-------|------|---------|
| `workspaceId` | `ExecutiveWorkspaceId` | Target workspace |
| `workspaceName` | `string` | Display name from registry |
| `transitionType` | `forward \| back \| passive_pause \| passive_resume \| audit_failure` | Transition class |
| `timestamp` | `number` | When recorded |
| `originWorkspaceId` | `ExecutiveWorkspaceId \| null` | Source workspace |
| `targetWorkspaceId` | `ExecutiveWorkspaceId \| null` | Destination workspace |
| `lifecycleSnapshot` | `ExecutiveWorkspaceLifecycleState \| null` | Read-only lifecycle metadata |
| `source` | `"workspace_navigation_history"` | Authority marker |

### Back stack example

Path: Focus → Analyze → Compare → Scenario

| Current | Back stack (most recent first) |
|---------|-------------------------------|
| Scenario | Compare, Analyze, Focus |

---

## 4. Ownership Model

| Concern | Owner |
|---------|-------|
| Workspace metadata | Registry |
| Lifecycle state | Lifecycle Manager |
| Transitions | Transition Controller |
| Execution | Dashboard Runtime |
| Navigation history | Back Stack runtime |
| Conversation | Assistant |

**No ownership overlap.** Assistant receives read-only summaries via context sync.

---

## 5. Validation Model

### Forward navigation

1. Registry + lifecycle + transition controller (existing MRP:8:3 chain)
2. Dashboard `setDashboardMode`
3. `commitExecutiveWorkspaceTransition`
4. `recordForwardNavigationAfterCommit` — pushes origin to back stack

### Controlled back navigation

1. `requestExecutiveWorkspaceBackNavigation()` — peek stack, validate target
2. `requestExecutiveWorkspaceTransition` — **never bypasses controller**
3. Dashboard dispatch
4. `commitExecutiveWorkspaceBackNavigation` — commit + pop stack + record `back` entry

### Back validation checks

- Previous workspace exists in stack
- Target registered and available
- Lifecycle valid
- Transition controller approval

---

## 6. Failure Handling

| Scenario | Behavior |
|----------|----------|
| Empty back stack | Rejected safely |
| Invalid target | Brake + audit failure entry |
| Transition rejected | Audit entry; stack unchanged |
| History overflow | Trim oldest; brake log |
| Unauthorized mutation | Brake only |

### Brake prefix

`[WorkspaceHistory][Brake]`

**Fallback:** Keep current workspace, dashboard, assistant, and history intact. Never reset executive session.

---

## 7. Legacy Findings

| Finding | Status |
|---------|--------|
| Sync `lastWorkspaceType` only | Partial — extended with `navigationRecentPath` |
| Transition source not persisted | Adopted — recorded on commit |
| Direct `setDashboardMode` bypass | Guarded by router + transition path |
| Legacy context router | Documented bypass |
| Conversation continuity | Read-only observer |

---

## 8. Future Expansion Strategy

Future workspaces (timeline, risk, decision_center, simulation, governance, optimization, forecasting, recommendations) are reserved in `FUTURE_NAVIGATION_HISTORY_WORKSPACE_IDS`.

When activated:
1. Register in catalog
2. Add to single-active set if applicable
3. History automatically records transitions — no architecture changes

---

## 9. Assistant Integration (read-only)

Context sync extended with:

- `navigationPreviousWorkspaceId`
- `navigationRecentPath`

Assistant may observe current workspace, previous workspace, and recent path. Assistant may **not** modify history or execute navigation.

---

## 10. Definition of Done

| Criterion | Status |
|-----------|--------|
| Back stack exists | ✅ |
| Navigation history contract exists | ✅ |
| Controlled return flow exists | ✅ |
| History integrated with transitions | ✅ |
| Ownership preserved | ✅ |
| No history loops | ✅ |
| No navigation bypasses | ✅ |
| Build passes | ✅ |

---

## 11. Files Created / Modified

**Created**

- `frontend/app/lib/dashboard/executiveWorkspaceNavigationHistoryContract.ts`
- `frontend/app/lib/dashboard/executiveWorkspaceNavigationHistoryRuntime.ts`
- `frontend/app/lib/dashboard/executiveWorkspaceNavigationHistoryLegacyFindings.ts`
- `frontend/app/lib/dashboard/executiveWorkspaceNavigationHistoryContract.test.ts`
- `docs/mrp-workspace-history-report.md`

**Modified**

- `frontend/app/lib/dashboard/executiveWorkspaceTransitionControllerRuntime.ts` — return origin on commit
- `frontend/app/screens/HomeScreen.tsx` — record history + sync path
- `frontend/app/lib/assistant-bridge/assistantContextSyncContract.ts` — navigation fields
- `frontend/app/lib/dashboard/index.ts` — exports

---

## Final Architecture Rule — Verified

**History remembers. Controller validates. Dashboard executes. Only one workspace remains active.**
