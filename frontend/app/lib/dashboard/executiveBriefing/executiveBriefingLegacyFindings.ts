/**
 * MRP:10:4 — Executive Briefing legacy pipeline isolation findings.
 */

export const EXECUTIVE_BRIEFING_LEGACY_ISOLATION = Object.freeze({
  approvedSource: {
    path: "frontend/app/lib/workspaces/workspaceRecommendationEngine.ts",
    status: "approved",
    note: "Briefing layer consumes evaluateWorkspaceRecommendations only.",
  },
  deprecatedSurfaces: {
    executiveDashboardPanel: {
      path: "frontend/app/components/panels/ExecutiveDashboardPanel.tsx",
      status: "legacy_isolated",
      note: "Legacy canonical recommendation display — not wired to briefing layer.",
    },
    executiveRecommendationsPanel: {
      path: "frontend/app/components/executive/ExecutiveRecommendationsPanel.tsx",
      status: "legacy_isolated",
      note: "Executive OS panel — parallel path not reconnected.",
    },
    canonicalRecommendationPipeline: {
      status: "legacy_isolated",
      note: "Governance/collaboration canonicalRecommendation — not consumed by briefing.",
    },
  },
  routing: {
    workspaceLaunch: "onWorkspaceLaunch → requestWorkspaceLaunch → executeApprovedWorkspaceLaunch",
    focusRecommendations: "scrollIntoView on #dashboard-home-recommendations — no routing",
    status: "approved",
  },
});

export const EXECUTIVE_BRIEFING_APPROVED_DESTINATIONS = Object.freeze([
  "analyze",
  "compare",
  "scenario",
  "war_room",
  "dashboard_home_recommendations_section",
] as const);
