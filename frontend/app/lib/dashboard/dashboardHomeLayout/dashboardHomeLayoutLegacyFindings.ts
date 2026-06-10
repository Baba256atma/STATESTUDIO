/**
 * MRP:10:8 — Dashboard Home layout legacy isolation findings.
 */

export const DASHBOARD_HOME_LAYOUT_LEGACY_ISOLATION = Object.freeze({
  deprecatedLayouts: {
    executiveDashboardPanel: {
      path: "frontend/app/components/panels/ExecutiveDashboardPanel.tsx",
      status: "legacy_isolated",
      note: "Legacy right-rail dashboard — not used for Home layout.",
    },
    legacyRouterShells: {
      status: "legacy_isolated",
      note: "Old router-driven dashboard shells not reconnected.",
    },
  },
  removedDuplicates: {
    recentWorkflowSurface: {
      status: "removed_from_home",
      note: "Overlapped continuity zone — not in canonical hierarchy.",
    },
    overviewRecents: {
      status: "suppressed_on_home",
      note: "Recents in overview suppressed — continuity zone owns history.",
    },
  },
  stability: {
    dynamicReorder: "disabled",
    adaptiveSorting: "disabled",
    personalization: "disabled",
  },
});
