# MRP:9:5 — Dashboard Navigation Layer Legacy Audit

**Date:** 2026-06-07  
**Scope:** Consolidated legacy navigation audit for MRP:9 Dashboard Navigation Layer (Launcher, Recommendations, Favorites, Recents) plus inherited MRP:8 workspace infrastructure findings.

---

## Executive Summary

The canonical Dashboard Navigation System operates through four unified surfaces inside `DashboardRuntimePanel`:

| Surface | Question Answered | Authority |
|---------|-------------------|-----------|
| Workspace Launcher (MRP:9:1) | What exists? | Entry surface → `requestWorkspaceLaunch` |
| Executive Recommendations (MRP:9:2) | What deserves attention? | Advisory only → launch via dashboard |
| Executive Favorites (MRP:9:3) | What matters frequently? | Executive-owned metadata → launch via dashboard |
| Executive Recents (MRP:9:4) | What was I doing? | Read-only history projection → return via dashboard |

**Dashboard remains sole execution authority.** All launch and return paths must flow through `requestWorkspaceLaunch` / `requestExecutiveWorkspaceBackNavigation` → Transition Controller → Lifecycle → History → `setDashboardMode`.

---

## 1. Canonical Navigation Path (Adopted)

```
Dashboard Surface UI
  → requestWorkspaceLaunch() / validateRecentReturnPath()
  → Transition Controller (requestExecutiveWorkspaceTransition)
  → Lifecycle Commit (commitExecutiveWorkspaceTransition)
  → History Record (recordForwardNavigationAfterCommit)
  → HomeScreen executeApprovedWorkspaceLaunch / handleRecentReturn
  → setDashboardMode dispatch
```

**Status:** ✅ Adopted for all four MRP:9 surfaces and object panel router.

---

## 2. Duplicate Ownership Findings

| Finding | Path | Conflict | Status |
|---------|------|----------|--------|
| Dashboard Context Router | `dashboardContextRouter.ts` | Direct `setDashboardContext` bypasses launcher/recommendations/favorites/recents | **documented_bypass** |
| Executive OS Shortcuts | `useExecutiveOS.ts` | Direct war room / compare open | **documented_bypass** |
| Executive Quick Actions | `executiveQuickActionsTypes.ts` | Command bar shortcuts parallel to favorites/recents | **documented_parallel** |
| SIM/RSK Panels | `HomeScreen.tsx` | Parallel execution contexts outside navigation layer | **documented_bypass** |
| Hardcoded Dashboard Modes | `DashboardRuntimePanel.tsx` | Mode conditionals vs registry shell metadata | **documented_parallel** |
| Enterprise Recommendation Engines | `lib/recommendation/` | Strategic AI domain — different from workspace navigation | **decoupled** |
| Legacy Compare Panel Model | `buildComparePanelModel.ts` | Parallel recommendation UI in legacy panels | **documented_parallel** |

---

## 3. Navigation Bypass Findings

| Bypass | Source | Target | Risk | Mitigation |
|--------|--------|--------|------|------------|
| `setDashboardContext` | `dashboardContextRouter.ts` | Any dashboard mode | Medium — skips transition controller | Documented; migration Phase 2 |
| `runRecommendation` | `useExecutiveOS.ts` | War room / compare | Medium — skips recommendation surface | Documented; migration Phase 3 |
| SIM/RSK panel open | `HomeScreen.tsx` | Simulation contexts | High — outside workspace registry | Documented; migration Phase 3 |
| Timeline panel actions | `RightPanelHost.tsx` | Legacy views | Low — not yet wired to launcher | Pending adoption |
| Assistant bridge hardcoded maps | `assistantDashboardBridgeContract.ts` | Workspace modes | Low — indirect via object panel | Pending registry adoption |
| Left command assistant chat | `components/assistant/` | Chat/SIM paths | Low — pre-MRP:7 parallel path | Documented bypass |

---

## 4. Legacy Activation Paths

### 4.1 Old Dashboard Routes

- `dashboardContextRouter.ts` — direct mode authority without navigation layer validation
- Per-mode legacy findings in `dashboard/analyze/`, `compare/`, `scenario/`, `warRoom/`, `focus/` — mode-specific parallel paths (pre-MRP:8)

### 4.2 Old Canonical Routes

- Object panel pre-MRP:9:1 inline transition — **adopted** (now routes through `requestWorkspaceLaunch`)
- Assistant bridge → object panel chain — **inherited_protection** (indirect canonical path)

### 4.3 Old Workspace Launchers

- No floating/modal launcher remains — consolidated into `DashboardWorkspaceLauncher`
- Executive OS war room controller — **documented_bypass**

### 4.4 Old Shortcut Systems

- `executiveQuickActionsTypes.ts` — command bar quick actions
- `buildExecutiveCommandBarModel.ts` — scene-level shortcuts
- `useExecutiveOS.ts` — reviewRecord / openWarRoom shortcuts

### 4.5 Old Recommendation Systems

- `lib/recommendation/` — enterprise strategic recommendation (decoupled domain)
- `useExecutiveOS.ts` — direct workspace open from recommendations
- Risk/war room intelligence text recommendations — observational only (partial integration via systemSignals)

### 4.6 Old Favorites Systems

- No prior favorites registry — MRP:9:3 is net-new
- Executive quick actions serve as legacy parallel for pinned actions

### 4.7 Old Recent Activity Systems

- MRP:8:4 navigation history is authoritative source
- Assistant `navigationRecentPath` — complementary partial signal
- Executive quick return actions — parallel to recents surface

### 4.8 Old Routing Bridges

- `assistantDashboardBridgeContract.ts` — hardcoded action maps vs full registry
- `dashboardContextBridge.ts` — context normalization (no execution authority)

---

## 5. Conflicting Authority Matrix

| Layer | Canonical Owner | Legacy Challenger | Resolution |
|-------|----------------|-------------------|------------|
| Execution | Dashboard (`setDashboardMode`) | `dashboardContextRouter` | Dashboard wins; legacy documented |
| Launch | `requestWorkspaceLaunch` | Executive OS direct open | Launcher wins; legacy documented |
| Advisory | `evaluateWorkspaceRecommendations` | Enterprise recommendation engines | Decoupled domains |
| Favorites | `WorkspaceFavoritesRegistry` | Executive quick actions | Registry wins; quick actions parallel |
| Recents | `buildWorkspaceRecentsView` (read-only) | Quick return shortcuts | History projection wins |
| History | `executiveWorkspaceNavigationHistoryRuntime` | None | Single authority |
| Transition | `executiveWorkspaceTransitionController` | Direct lifecycle writes | Controller wins |
| Lifecycle | `executiveWorkspaceLifecycleRuntime` | SIM/RSK panels | Lifecycle wins for registered workspaces |

---

## 6. Assistant Integration Audit

| Capability | Allowed | Evidence |
|------------|---------|----------|
| Read current workspace | ✅ Yes | Context sync contract |
| Read recommendations | ✅ Yes | Read-only advisory projection |
| Read favorites | ✅ Yes | Read-only registry snapshot |
| Read recents | ✅ Yes | History summary fields |
| Read history summaries | ✅ Yes | `navigationRecentPath` signal |
| Launch workspaces | ❌ No | User click → dashboard execution |
| Modify navigation | ❌ No | No write APIs exposed |
| Modify history | ❌ No | Recents guard: `assertRecentsCannotMutateHistory` |
| Modify lifecycle | ❌ No | No lifecycle write from assistant |
| Modify registry | ❌ No | Metadata read-only |
| Modify favorites | ❌ No | Executive-owned only |
| Modify recents | ❌ No | Read-only projection |

---

## 7. HUD Stability Audit

| Surface | Changed by MRP:9 | Result |
|---------|------------------|--------|
| Scene HUD | No | ✅ Unchanged |
| Object Panel | Consolidated launch path only | ✅ No layout change |
| Timeline Panel | No | ✅ Unchanged |
| HUD Zoning | No | ⚠️ Pre-existing MRP-HUD:1 warning |
| MRP Layout | Dashboard panel sections added | ✅ By design (MRP:9:1–9:4) |
| Assistant Layout | No | ✅ Unchanged |
| Dashboard Layout | Four navigation sections in order | ✅ By design |

---

## 8. Adoption Plan

1. **Phase 1 (MRP:9:5):** Navigation layer freeze certification — **complete**
2. **Phase 2:** `dashboardContextRouter` adopts `requestWorkspaceLaunch`
3. **Phase 3:** Executive OS routes through navigation layer
4. **Phase 4:** Timeline actions integrate with recents return paths
5. **Phase 5:** Assistant read-only sync of navigation summary fields
6. **Phase 6:** SIM/RSK panels migrate to registered workspaces

---

## 9. Source References

| Module | Legacy Findings File |
|--------|---------------------|
| Launcher | `workspaceLauncher/workspaceLauncherLegacyFindings.ts` |
| Recommendations | `workspaces/workspaceRecommendationLegacyFindings.ts` |
| Favorites | `workspaces/workspaceFavoritesLegacyFindings.ts` |
| Recents | `workspaces/workspaceRecentsLegacyFindings.ts` |
| Cross-layer | `workspaces/executiveDashboardNavigationLegacyFindings.ts` |
| MRP:8 Registry | `executiveWorkspaceRegistryLegacyFindings.ts` |
| MRP:8 Lifecycle | `executiveWorkspaceLifecycleLegacyFindings.ts` |
| MRP:8 Transition | `executiveWorkspaceTransitionLegacyFindings.ts` |
| MRP:8 History | `executiveWorkspaceNavigationHistoryLegacyFindings.ts` |
| Object Panel | `object-panel/objectPanelActionLegacyFindings.ts` |
| Assistant Bridge | `assistant-bridge/assistantDashboardBridgeLegacyFindings.ts` |

---

## 10. Audit Verdict

**No blocking ownership conflicts within the canonical Dashboard Navigation path.**

Legacy bypasses are **documented, isolated, and non-blocking** for MRP:9 freeze. They predate the navigation layer and do not interfere with the four-surface executive operating model when used through the dashboard.

**Recommendation:** Proceed to freeze with **PASS WITH WARNINGS** pending legacy path migration in subsequent phases.
