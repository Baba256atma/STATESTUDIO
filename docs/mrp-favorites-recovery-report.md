# MRP:10:6 — Favorites + Executive Workspace Recovery Report

**Date:** 2026-06-07  
**Scope:** Favorites Layer + Workspace Recovery Layer on Dashboard Home. Read-only presentation — no management UI, no new persistence.

---

## Verdict: **COMPLETE**

| Check | Result |
|-------|--------|
| Favorites Layer on Dashboard Home | **PASS** |
| Workspace Recovery Layer renders | **PASS** |
| Recovery uses existing runtime context | **PASS** |
| No new persistence systems | **PASS** |
| No AI ranking | **PASS** |
| Favorites ≠ Recommendations | **PASS** |
| Recovery ≠ Activity Timeline | **PASS** |
| Build | **PASS** |
| Tests | **PASS** |

---

## 1. Favorites Architecture

```
ExecutiveDashboardHomeSurface
  ├── … (Summary, Quick Actions, Recommendations, Activity Timeline)
  ├── ExecutiveFavoritesLayer              ← MRP:10:6 (NEW)
  │     └── ExecutiveFavoriteCard × N
  ├── ExecutiveWorkspaceRecoveryLayer      ← MRP:10:6 (NEW)
  │     └── ExecutiveRecoveryCard × N
  └── ExecutiveWorkspaceOverview           (favorites management suppressed on home)
```

**Favorites layer:**

| Module | Role |
|--------|------|
| `executiveFavoritesLayerContract.ts` | Card shape, item types, future entity slots |
| `executiveFavoritesLayerRuntime.ts` | Read-only projection from favorites registry snapshot |
| `ExecutiveFavoritesLayer.tsx` | Display + Quick Open only (no pin/unpin/rename) |
| `ExecutiveFavoriteCard.tsx` | Name, type, last opened, Quick Open |

**Rules enforced:**
- Only explicitly pinned registry items displayed
- No auto-favorites, no inference, no AI ranking
- Launch via `validatePinnedActionLaunch` → `onWorkspaceLaunch`

---

## 2. Recovery Architecture

```
ExecutiveWorkspaceRecoveryLayer
  └── buildExecutiveWorkspaceRecoveryView()
        ├── Navigation history (primary)
        └── previewRecentReturnPath (resume validation)
```

**Recovery entries:** One most-recent resumable context per workspace type (analyze, compare, scenario, war_room, focus).

| Field | Source |
|-------|--------|
| Activity Name | Static recovery config per workspace |
| Workspace Type | Registry name category |
| Timestamp | Navigation history entry |
| Resume Action | `previewRecentReturnPath` approval |

**Recovery ≠ Timeline:** Timeline shows chronological events. Recovery shows resumable session contexts only.

**Recovery ≠ Favorites:** Recovery from navigation history. Favorites from user pins.

---

## 3. Data Source Map

| Source | Path | Layer |
|--------|------|-------|
| Favorites Registry | `workspaceFavoritesRegistry.ts` | **Favorites — approved** |
| Navigation History | `executiveWorkspaceNavigationHistoryRuntime.ts` | **Recovery — approved** |
| Workspace Recents | `workspaceRecentsRegistry.ts` | Return path preview |
| Workspace Lifecycle | `executiveWorkspaceLifecycleRuntime.ts` | Read-only (entry snapshots) |
| Recommendations Engine | `workspaceRecommendationEngine.ts` | **Not consumed** |
| Legacy Executive OS | `useExecutiveOS.ts` | **Isolated** |
| Legacy Quick Actions | `executiveQuickActionsTypes.ts` | **Isolated** |

No new session stores, recovery databases, or event streams.

---

## 4. Resume Routing Validation

| Action | Route |
|--------|-------|
| Favorite Quick Open | `validatePinnedActionLaunch` → `onWorkspaceLaunch` → `requestWorkspaceLaunch` |
| Recovery Resume | `onRecoveryResume` → `onRecentReturn` → `handleRecentReturn` |

No router bypasses. No legacy navigation. No direct state mutations.

---

## 5. Empty-State Behavior

| Section | Empty Message | Brakes |
|---------|---------------|--------|
| Favorites | "No favorites available." | None |
| Recovery | "No recoverable workspace context found." | None |

Valid executive states — no warnings or errors.

---

## 6. Future Extensibility Strategy

**Favorites reserved slots:** strategic_plan, advisory_briefing, simulation, operational_investigation, executive_playbook

**Recovery reserved slots:** multi_step_workflows, scenario_chains, advisory_sessions, strategic_planning_sessions

Future entities append to runtime projectors without Dashboard Home redesign.

Non-home modes retain full `ExecutiveFavoritesSurface` with management UI (`includeFavorites` defaults true).

---

## 7. Performance Validation

| Rule | Validation |
|------|------------|
| No polling | Favorites via `useSyncExternalStore`; recovery via `useMemo` |
| No session scanning loops | Single history read per memo cycle |
| No render loops | Stable snapshot from favorites registry |
| No duplicated state | Layer views derived, not stored |
| No scene/HUD updates | Dashboard Home only |

---

## 8. MRP Protection

**Not modified:**
- Assistant Tab
- Dashboard Router internals
- Recommendations Layer
- Activity Timeline components
- Scene Timeline
- Object Panel
- Scene HUD Zones

---

## 9. Files Created / Updated

**Created:**
- `frontend/app/lib/dashboard/executiveFavoritesLayer/executiveFavoritesLayerContract.ts`
- `frontend/app/lib/dashboard/executiveFavoritesLayer/executiveFavoritesLayerRuntime.ts`
- `frontend/app/lib/dashboard/executiveFavoritesLayer/executiveFavoritesLayerRuntime.test.ts`
- `frontend/app/lib/dashboard/executiveRecovery/executiveRecoveryContract.ts`
- `frontend/app/lib/dashboard/executiveRecovery/executiveRecoveryRuntime.ts`
- `frontend/app/lib/dashboard/executiveRecovery/executiveRecoveryLegacyFindings.ts`
- `frontend/app/lib/dashboard/executiveRecovery/executiveRecoveryRuntime.test.ts`
- `frontend/app/components/dashboard/ExecutiveFavoriteCard.tsx`
- `frontend/app/components/dashboard/ExecutiveFavoritesLayer.tsx`
- `frontend/app/components/dashboard/ExecutiveRecoveryCard.tsx`
- `frontend/app/components/dashboard/ExecutiveWorkspaceRecoveryLayer.tsx`
- `docs/mrp-favorites-recovery-report.md`

**Updated:**
- `frontend/app/components/dashboard/ExecutiveDashboardHomeSurface.tsx`
- `frontend/app/components/dashboard/ExecutiveWorkspaceOverview.tsx`
- `frontend/app/lib/dashboard/index.ts`

---

## Definition of Done

- [x] Favorites Layer renders correctly
- [x] Recovery Layer renders correctly
- [x] Recovery uses existing runtime context
- [x] No new persistence systems
- [x] No AI ranking
- [x] No recommendation crossover
- [x] No router regressions
- [x] No duplicated stores
- [x] Build passes
- [x] Runtime stable
