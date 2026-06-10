# MRP:9:2 — Workspace Recommendation Legacy Audit

**Date:** 2026-06-07  
**Scope:** Audit of legacy recommendation/advisory systems relative to context-aware workspace recommendations.

---

## Executive Principle

> Launcher answers: "What workspaces exist?"  
> Recommendations answer: "What should I investigate next?"  
> The executive always decides.

Recommendations are **advisory only**. They never auto-launch, auto-navigate, or modify history/lifecycle.

---

## Canonical Recommendation Path (MRP:9:2)

```
Context Signals (object, risk, timeline, scenario, KPI, dashboard)
     ↓
WorkspaceRecommendationEngine.evaluateWorkspaceRecommendations()
     ↓ Rank + filter (registry, active workspace, duplicates)
     ↓
ExecutiveWorkspaceRecommendations UI (Quick Action Cards)
     ↓ User clicks "Open Workspace"
     ↓
requestWorkspaceLaunch() → Dashboard authority (HomeScreen)
```

---

## Legacy System Inventory

| System | Path | Domain | Conflict | Status |
|--------|------|--------|----------|--------|
| Enterprise strategic recommendation | `lib/recommendation/` | AI strategic advice | Different domain | **decoupled** |
| Executive OS recommendations | `lib/executive/useExecutiveOS.ts` | Direct war room open | Bypasses launcher | **documented_bypass** |
| Risk intelligence text | `lib/dashboard/riskIntelligence/` | Observational copy | Not actionable cards | **partial_integration** |
| War room decision focus | `lib/dashboard/warRoomIntelligence/` | Intelligence text | Not workspace routing | **decoupled** |
| Advisory priority scoring | `executiveAdvisory/aggregation/` | Accordion advisory | Different priority semantics | **decoupled** |
| Assistant action cards | `assistant-bridge/assistantActionCardContract.ts` | User-initiated launch | Read-only compatible | **read_only_compatible** |
| Legacy compare panel model | `decision/recommendation/buildComparePanelModel.ts` | Legacy panel UI | Parallel surface | **documented_parallel** |
| Workspace launcher (MRP:9:1) | `workspaceLauncher/` | Catalog + launch | Complementary — launcher lists, recommendations guide | **complementary** |

---

## Ownership Matrix

| Concern | Owner | MRP:9:2 Behavior |
|---------|-------|------------------|
| Recommendation generation | WorkspaceRecommendationEngine | Dashboard-owned, advisory |
| Quick action presentation | ExecutiveWorkspaceRecommendations | Dashboard UI only |
| Workspace launch | HomeScreen via requestWorkspaceLaunch | User-initiated only |
| Transition coordination | Transition Controller | Unchanged |
| History | Navigation History | Unchanged — recommendations never write |
| Assistant awareness | Read-only (future sync) | Cannot inject or override rankings |

---

## Duplicate / Bypass Findings

| Finding | Risk | Mitigation |
|---------|------|------------|
| Executive OS auto-opens war room | Medium | Documented; migrate to advisory + launcher |
| Risk intelligence recommendation strings | Low | Feed as context signals, not duplicate cards |
| Legacy compare panel recommendations | Low | Parallel until legacy panel retired |

---

## Assistant Compatibility

| Capability | Allowed | Blocked |
|------------|---------|---------|
| Read recommendations | ✅ (future context sync) | — |
| Read quick action state | ✅ | — |
| Inject recommendations | — | ✅ |
| Override ranking | — | ✅ |
| Launch workspaces | — | ✅ |

---

## Brake Log Coverage

| Prefix | Purpose |
|--------|---------|
| `[WorkspaceQuickAction][Brake]` | Quick action validation |
| `[WorkspaceRecommendation][Brake]` | Engine filtering (unavailable, duplicate) |
| `[WorkspaceRecommendationState][Brake]` | Active workspace / missing object filters |

---

## Consolidation Notes

MRP:9:2 does **not** replace enterprise strategic recommendation engines or intelligence accordion advisory layers. It adds a **workspace navigation guidance layer** above the launcher.

Future integration: pass `systemSignals` from risk/timeline/scenario intelligence runtimes into `WorkspaceRecommendationContext` without coupling UI to intelligence surfaces.
