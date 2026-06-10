# MRP:9:1 — Workspace Launcher Legacy Entry Point Audit

**Date:** 2026-06-07  
**Scope:** Audit of executive workspace entry paths before and after unified launcher adoption.

---

## Executive Principle

> The Dashboard is the operating system. The Workspace Launcher is the executive start menu. Workspaces launch through authority, not shortcuts.

---

## Canonical Launch Path (Post MRP:9:1)

```
Entry Surface (Launcher UI | Object Panel | Assistant Bridge)
     ↓
requestWorkspaceLaunch()
     ↓ Registry validation + active workspace check
     ↓ requestExecutiveWorkspaceTransition()
     ↓
Dashboard Authority (HomeScreen executeApprovedWorkspaceLaunch)
     ↓ setDashboardMode
     ↓ commitExecutiveWorkspaceTransition
     ↓ recordForwardNavigationAfterCommit
     ↓ publishDashboardContextSummary
     ↓
Active Workspace Shell
```

---

## Entry Point Inventory

| Entry Point | Path | Pre-9:1 | Post-9:1 | Status |
|-------------|------|---------|----------|--------|
| Workspace Launcher UI | `DashboardWorkspaceLauncher.tsx` | N/A | `requestWorkspaceLaunch(source: workspace_launcher)` | **adopted** |
| Object Panel actions | `objectPanelActionRouterRuntime.ts` | Inline transition request | `requestWorkspaceLaunch(source: object_panel)` | **adopted** |
| Assistant action cards | `assistantDashboardBridgeRuntime.ts` → HomeScreen | Object panel chain | Inherits via object panel route | **inherited_protection** |
| HomeScreen execution | `HomeScreen.tsx` | Direct dispatch + commit | `executeApprovedWorkspaceLaunchRef` | **adopted** |
| Timeline interactions | `RightPanelHost.tsx` | Legacy panel routing | Not yet wired | **pending_adoption** |
| SIM/RSK panels | `HomeScreen.tsx` | Parallel execution context | Outside launcher | **documented_bypass** |
| dashboardContextRouter | `dashboardContextRouter.ts` | Direct setDashboardContext | Bypasses launcher | **documented_bypass** |
| Executive OS | `useExecutiveOS.ts` | warRoom.openWarRoom() | Outside launcher | **documented_bypass** |
| Dashboard mode chips | `DashboardRuntimePanel.tsx` | Display-only badges | Non-interactive | **display_only** |

---

## Conflicting Ownership

| Conflict | Owner A | Owner B | Resolution |
|----------|---------|---------|------------|
| Mode execution | Dashboard (`setDashboardMode`) | Legacy SIM panel | MRP path uses Dashboard only |
| Transition coordination | Transition Controller | Direct lifecycle (pre-8:3) | Controller adopted |
| Launch metadata | Workspace Registry | Hardcoded action maps | Registry drives launcher cards |
| Context routing | dashboardContextRouter | Workspace launcher | Launcher for workspaces; router legacy |

---

## Duplicate Launch Paths

| Duplicate | Canonical Replacement |
|-----------|----------------------|
| Object panel inline transition | `requestWorkspaceLaunch` |
| Hardcoded DASHBOARD_MODES chips | Registry-driven launcher cards |
| Assistant hardcoded mode maps | Registry via object panel chain (pending full registry adoption) |

---

## Transition Bypasses

| Path | Bypass Type | Status |
|------|-------------|--------|
| Object panel direct lifecycle (pre-8:3) | Skipped controller | **resolved** (MRP:8:3) |
| Object panel inline transition (pre-9:1) | Outside requestWorkspaceLaunch | **resolved** (MRP:9:1) |
| SIM/RSK panel open | Outside entire stack | **documented** |
| setDashboardContext | No transition/history | **documented** |

---

## Legacy Activation Paths (Remaining)

1. **SIM/RSK panel** — Opens parallel workspace-like views without registry validation
2. **dashboardContextRouter** — Commits dashboard context without launcher or history
3. **Executive OS recommendations** — Opens war room via legacy controller
4. **Timeline panel actions** — Not yet routed through launcher

These do not invalidate the MRP:9:1 launcher architecture. They are scheduled for post-adoption migration.

---

## Brake Log Coverage

| Prefix | Layer | File |
|--------|-------|------|
| `[WorkspaceLauncher][Brake]` | Launcher validation | `workspaceLauncherContract.ts` |
| `[WorkspaceEntryPoint][Brake]` | Entry point consolidation | `workspaceLauncherContract.ts` |
| `[WorkspaceLaunchTransition][Brake]` | Transition integration | `workspaceLauncherContract.ts` |
| `[WorkspaceLauncherState][Brake]` | Single-active awareness | `workspaceLauncherContract.ts` |

---

## Consolidation Plan

See `workspaceLauncherLegacyFindings.ts` for machine-readable findings and phased adoption plan.

**Phase 1 (MRP:9:1):** Unified launcher + `requestWorkspaceLaunch` + object panel consolidation — **complete**

**Phase 2:** Timeline actions route through launcher

**Phase 3:** SIM/RSK migrate to registered workspaces

**Phase 4:** dashboardContextRouter adopts launcher

**Phase 5:** Executive OS recommendations route through launcher
