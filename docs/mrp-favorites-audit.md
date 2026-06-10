# MRP:9:3 — Workspace Favorites Legacy Audit

**Date:** 2026-06-07  
**Scope:** Audit of legacy shortcuts and quick-access systems relative to executive favorites.

---

## Executive Principle

> Recommendations tell the executive: "What may matter now."  
> Favorites tell Nexora: "What matters often."  
> The executive owns favorites. Dashboard owns execution. Controller owns transitions.

---

## Canonical Favorites Path (MRP:9:3)

```
Executive Action (Pin / Unpin / Reorder / Launch)
     ↓
WorkspaceFavoritesRegistry (executive-owned state + persistence adapter)
     ↓ validatePinnedActionLaunch()
     ↓ User clicks Launch
     ↓
requestWorkspaceLaunch() → HomeScreen executeApprovedWorkspaceLaunch
```

---

## Legacy System Inventory

| System | Path | Conflict | Status |
|--------|------|----------|--------|
| Executive quick actions | `lib/ui/executiveQuickActionsTypes.ts` | Parallel command-bar shortcuts | **documented_parallel** |
| Executive command bar | `lib/ui/buildExecutiveCommandBarModel.ts` | Scene-level shortcuts | **documented_parallel** |
| Workspace launcher (9:1) | `workspaceLauncher/` | Complementary full catalog | **complementary** |
| Recommendations (9:2) | `workspaceRecommendationEngine.ts` | Dynamic vs intentional | **complementary** |
| Executive OS | `lib/executive/useExecutiveOS.ts` | Direct war room open bypass | **documented_bypass** |
| Assistant action cards | `assistantActionCardContract.ts` | User-initiated launch | **read_only_compatible** |

---

## Ownership Matrix

| Concern | Owner |
|---------|-------|
| Favorite pin/unpin/reorder | Executive (via Favorites UI) |
| Favorite persistence | WorkspaceFavoritesRegistry + adapter |
| Workspace launch | Dashboard (HomeScreen) |
| Transitions | Transition Controller |
| History / Lifecycle | Unchanged — favorites never write |

---

## Assistant Compatibility

| Allowed | Blocked |
|---------|---------|
| Read favorites | Create favorites |
| Reference favorites | Delete favorites |
| Suggest favorites (read-only) | Reorder favorites |
| | Auto-launch favorites |

---

## Brake Log Coverage

| Prefix | Purpose |
|--------|---------|
| `[FavoritesRegistry][Brake]` | Persistence / snapshot validation |
| `[PinnedAction][Brake]` | Invalid favorite / missing target |
| `[FavoritesManager][Brake]` | Pin/unpin/reorder management errors |
| `[FavoritesAuthority][Brake]` | Active workspace / registry / object guards |

---

## Duplicates & Bypasses

No favorites path bypasses `requestWorkspaceLaunch`. Legacy command-bar and Executive OS shortcuts remain parallel surfaces documented for future consolidation.
