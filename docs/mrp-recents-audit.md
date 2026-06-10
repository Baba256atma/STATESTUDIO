# MRP:9:4 — Workspace Recents Legacy Audit

**Date:** 2026-06-07  
**Scope:** Audit of legacy history/recent-action systems relative to executive recents surface.

---

## Executive Principle

> Favorites: "What I use often."  
> Recommendations: "What Nexora suggests."  
> Recents: "What I was doing."  
> History remembers. Dashboard presents. Controller governs.

---

## Canonical Recents Path (MRP:9:4)

```
Navigation History (authoritative, MRP:8:4)
     ↓ read-only
WorkspaceRecentsRegistry.buildWorkspaceRecentsView()
     ↓
ExecutiveWorkspaceRecentsSurface
     ↓ user Return click
     ↓ validateRecentReturnPath()
     ↓ back_via_history → requestExecutiveWorkspaceBackNavigation
     ↓ forward_via_launch → requestWorkspaceLaunch
     ↓
Dashboard Authority (HomeScreen)
```

Recents **never** modify, delete, reorder, or inject history.

---

## Legacy System Inventory

| System | Path | Relationship | Status |
|--------|------|--------------|--------|
| Navigation history | `executiveWorkspaceNavigationHistoryRuntime.ts` | Authoritative source | **authoritative_source** |
| Assistant path sync | `assistantContextSyncContract.ts` | Partial path for assistant | **complementary** |
| Executive quick actions | `executiveQuickActionsTypes.ts` | Parallel command-bar returns | **documented_parallel** |
| Executive OS | `useExecutiveOS.ts` | Direct war room shortcuts | **documented_bypass** |
| Workspace launcher | MRP:9:1 | Forward launches | **complementary** |
| Favorites | MRP:9:3 | Intentional pins vs activity trail | **complementary** |
| Recommendations | MRP:9:2 | Dynamic vs historical | **complementary** |

---

## History Authority

| Allowed | Blocked |
|---------|---------|
| Read history entries | Modify history |
| Display back stack | Delete history |
| Navigate via controller | Reorder history |
| Project recents view | Inject history entries |

---

## Assistant Compatibility

| Allowed | Blocked |
|---------|---------|
| Read recents | Modify recents |
| Reference recent activity | Inject recents |
| Suggest returning (advisory) | Auto-launch recents |

---

## Brake Log Coverage

| Prefix | Purpose |
|--------|---------|
| `[WorkspaceRecents][Brake]` | Invalid recent workspace |
| `[WorkspaceReturnPath][Brake]` | Return path validation |
| `[RecentsHistoryAuthority][Brake]` | Blocked history mutation |
| `[RecentsWorkspaceAuthority][Brake]` | Active workspace / registry guards |
| `[RecentsRetention][Brake]` | Retention trimming |

---

## Duplicates & Bypasses

No recents path bypasses transition controller or mutates history. Legacy Executive OS and command-bar quick actions remain parallel surfaces documented for future consolidation.
