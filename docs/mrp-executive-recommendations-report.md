# MRP:10:4 — Executive Recommendations Surface Report

**Date:** 2026-06-07  
**Scope:** Executive Recommendations Surface + Intelligence Briefing Layer on Dashboard Home. Read-only presentation — no new intelligence engines.

---

## Verdict: **COMPLETE**

| Check | Result |
|-------|--------|
| Recommendations Surface on Dashboard Home | **PASS** |
| Intelligence Briefing Layer renders | **PASS** |
| Recommendations remain read-only | **PASS** |
| Actions use approved Dashboard routing | **PASS** |
| No new intelligence engines | **PASS** |
| No duplicated stores | **PASS** |
| No legacy pipeline reuse | **PASS** |
| Build | **PASS** |
| Tests | **PASS** |

---

## 1. Recommendation Architecture

```
ExecutiveDashboardHomeSurface
  ├── ExecutiveSummaryCardsRow              ← MRP:10:2
  ├── ExecutiveWorkflowQuickActionsBar      ← MRP:10:3
  ├── ExecutiveRecommendationsSurface       ← MRP:10:4 (NEW)
  │     ├── ExecutiveIntelligenceBriefingLayer
  │     └── ExecutiveRecommendationCard × N
  ├── ExecutiveRecentWorkflowSurface        ← MRP:10:3
  └── ExecutiveWorkspaceOverview            ← MRP:9 (recommendations suppressed on home)
```

**Layer split:**

| Module | Role |
|--------|------|
| `executiveBriefingContract.ts` | Card shape, types, confidence labels, future source slots |
| `executiveBriefingRuntime.ts` | Read-only projection from workspace recommendation engine |
| `executiveBriefingLegacyFindings.ts` | Legacy pipeline isolation audit |
| `ExecutiveRecommendationsSurface.tsx` | Dashboard Home briefing board shell |
| `ExecutiveIntelligenceBriefingLayer.tsx` | One-paragraph executive narrative |
| `ExecutiveRecommendationCard.tsx` | Title, summary, type, confidence, action |

Presentation only — no reasoning, no analysis execution, no simulations.

---

## 2. Recommendation Source Map

| Source | Path | Briefing Layer |
|--------|------|----------------|
| Workspace Recommendation Engine | `workspaceRecommendationEngine.ts` | **Primary — approved** |
| Workspace Recommendation Contract | `workspaceRecommendationContract.ts` | Context input types |
| Executive Summary Layer | `executiveSummaryLayerRuntime.ts` | Independent read (attention count) |
| Legacy Executive Dashboard Panel | `ExecutiveDashboardPanel.tsx` | **Not connected** |
| Legacy Executive OS Panel | `ExecutiveRecommendationsPanel.tsx` | **Not connected** |
| Canonical Recommendation Pipeline | governance/collaboration modules | **Not connected** |

Briefing runtime calls `evaluateWorkspaceRecommendations(context)` and projects cards. No new recommendation generation.

---

## 3. Briefing Contract Design

**Card shape (`ExecutiveRecommendationCardView`):**

| Field | Source |
|-------|--------|
| Title | Engine card title |
| Summary | Engine card description |
| Recommendation Type | Mapped from signal + priority |
| Confidence | Mapped from priority (Low / Medium / High) |
| Suggested Action | Workspace ID → action label |
| Launchable | Engine launchable flag |

**Recommendation types (fixed set):** Attention, Opportunity, Risk, Insight, Follow-Up

**Confidence (fixed set):** Low, Medium, High — no percentages

**Display cap:** 3–7 cards (`EXECUTIVE_BRIEFING_MAX_DISPLAY = 7`)

**Briefing narrative:** Built from type counts — one paragraph maximum. Nominal state: *"System operating normally. No recommendations require attention."*

---

## 4. Approved Routing Destinations

| Action Label | Route |
|--------------|-------|
| Open Analyze Mode | `onWorkspaceLaunch("analyze")` → `requestWorkspaceLaunch` |
| Open Compare Mode | `onWorkspaceLaunch("compare")` |
| Open Scenario Mode | `onWorkspaceLaunch("scenario")` |
| Open War Room Mode | `onWorkspaceLaunch("war_room")` |
| Review Recommendations (Quick Actions) | `scrollIntoView` on `#dashboard-home-recommendations` |

No router bypasses. No legacy canonical routes. No direct workflow execution.

---

## 5. Empty-State Behavior

| Scenario | Display | Brakes / Errors |
|----------|---------|-----------------|
| No recommendations | Briefing: "System operating normally…" | None |
| Object required for launch | Action button disabled | None |
| Active workspace filtered | Card omitted by engine | Engine brake only (dev) |

Valid executive state — no warnings, no failure placeholders.

---

## 6. Future Extensibility Strategy

Reserved source slots in contract (no implementation yet):

- `risk_engine`
- `scenario_engine`
- `strategic_planning_engine`
- `operational_intelligence_engine`
- `advisory_engine`

Future engines can append to briefing runtime projection without redesigning Dashboard Home layout or card components.

Non-home workspace modes retain `ExecutiveWorkspaceRecommendations` via `ExecutiveWorkspaceOverview` (`includeRecommendations` defaults true).

---

## 7. Performance Validation

| Rule | Validation |
|------|------------|
| No polling | Single `useMemo` on recommendation context |
| No render loops | Stable context object from HomeScreen props |
| No regeneration loops | Engine evaluated once per memo cycle |
| No effect chains | Pure callback routing on card click |
| No duplicated state | Briefing view derived, not stored |
| No scene/HUD updates | Dashboard Home surface only |

---

## 8. MRP Protection

**Not modified:**
- Assistant Tab
- Dashboard Router internals
- Timeline Panel
- Object Panel
- Scene HUD Zones
- Workflow Launcher Architecture

---

## 9. Files Created / Updated

**Created:**
- `frontend/app/lib/dashboard/executiveBriefing/executiveBriefingContract.ts`
- `frontend/app/lib/dashboard/executiveBriefing/executiveBriefingRuntime.ts`
- `frontend/app/lib/dashboard/executiveBriefing/executiveBriefingLegacyFindings.ts`
- `frontend/app/lib/dashboard/executiveBriefing/executiveBriefingRuntime.test.ts`
- `frontend/app/components/dashboard/ExecutiveRecommendationCard.tsx`
- `frontend/app/components/dashboard/ExecutiveIntelligenceBriefingLayer.tsx`
- `frontend/app/components/dashboard/ExecutiveRecommendationsSurface.tsx`
- `docs/mrp-executive-recommendations-report.md`

**Updated:**
- `frontend/app/components/dashboard/ExecutiveDashboardHomeSurface.tsx`
- `frontend/app/components/dashboard/ExecutiveWorkspaceOverview.tsx`
- `frontend/app/lib/dashboard/index.ts`

---

## Definition of Done

- [x] Executive Recommendations Surface renders on Dashboard Home
- [x] Intelligence Briefing Layer renders correctly
- [x] Recommendations remain read-only
- [x] Actions use approved Dashboard routing
- [x] No new intelligence engines
- [x] No duplicated stores
- [x] No routing regressions
- [x] No legacy recommendation pipeline reuse
- [x] Build passes
- [x] Runtime stable
