/**
 * MRP:10:7 — Workspace Snapshot legacy isolation findings.
 */

export const WORKSPACE_SNAPSHOT_LEGACY_ISOLATION = Object.freeze({
  executiveSummaryLayer: {
    status: "separate",
    note: "Summary = dashboard status. Snapshot = operational context. Not merged.",
  },
  executiveBriefingLayer: {
    status: "separate",
    note: "Readiness ≠ Recommendations. Briefing not reused for readiness scoring.",
  },
  deprecatedReadiness: {
    firstMeaningfulState: {
      path: "frontend/app/components/panels/ExecutiveDashboardPanel.tsx",
      status: "legacy_isolated",
    },
    syntheticKpi: {
      status: "not_used",
      note: "No synthetic KPIs or confidence mathematics in snapshot layer.",
    },
  },
  routing: {
    reviewRecommendations: "onFocusRecommendations — scroll only",
    resumeSession: "onRecentReturn — approved chain",
    openAnalyze: "onWorkspaceLaunch(analyze)",
    status: "approved",
  },
});
