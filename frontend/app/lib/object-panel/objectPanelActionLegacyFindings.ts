/**
 * MRP:2:1 — Legacy object panel routing findings (documented, not reused blindly).
 */

export const OBJECT_PANEL_LEGACY_ROUTING_FINDINGS = Object.freeze({
  rightPanelHost: {
    path: "frontend/app/components/right-panel/RightPanelHost.tsx",
    behavior: "Legacy executive_object_action handler opens SIM/RSK panel views via requestPanelAuthorityOpen.",
    risk: "Bypasses Dashboard Mode Runtime; duplicates destination logic.",
    status: "isolated_fallback",
  },
  rightPanelRouter: {
    path: "frontend/app/lib/ui/right-panel/rightPanelRouter.ts",
    behavior: "Maps canonical right-panel views to shell sections and portal hosts.",
    risk: "Competing router chain for executive workflows.",
    status: "legacy_compatibility",
  },
  executiveObjectPanel: {
    path: "frontend/app/components/panels/ExecutiveObjectPanel.tsx",
    behavior: "MRP dock object panel shell wrapping ExecutiveActionPanel.",
    risk: "Separate from scene-native ObjectInfoHud; both emit action events.",
    status: "dual_surface",
  },
  executiveNavigationBridge: {
    path: null,
    behavior: null,
    risk: null,
    status: "not_found",
  },
  executivePlaneNavigationResolver: {
    path: null,
    behavior: null,
    risk: null,
    status: "not_found",
  },
  homeScreenExecutiveObjectAction: {
    path: "frontend/app/screens/HomeScreen.tsx",
    behavior: "nexora:executive-object-action listener opened legacy panel routes.",
    risk: "focus_object toggled camera focus; analyze opened risk_flow panel.",
    status: "replaced_for_dashboard_actions",
  },
});

export const DASHBOARD_ROUTED_OBJECT_ACTIONS = Object.freeze([
  "focus",
  "analyze",
  "compare",
  "scenario",
  "war_room",
] as const);
