/**
 * MRP:10:10 — Dashboard Home MVP Freeze Contract.
 *
 * Official Executive Landing Surface protection layer for Nexora Type-C.
 * Hierarchy, ownership, routing, and integration boundaries are frozen.
 */

import { DEFAULT_DASHBOARD_MODE, CANONICAL_DASHBOARD_MODE_OWNER } from "../dashboardModeRuntimeContract.ts";
import {
  DASHBOARD_HOME_CANONICAL_SECTION_ORDER,
  DASHBOARD_HOME_LAYOUT_ZONES,
  type DashboardHomeLayoutSectionId,
  type DashboardHomeLayoutZoneId,
} from "../dashboardHomeLayout/dashboardHomeLayoutContract.ts";
import { MAIN_RIGHT_PANEL_TABS } from "../../ui/mainRightPanelContract.ts";
import { OBJECT_PANEL_DASHBOARD_ACTIONS } from "../../object-panel/objectPanelActionRouterContract.ts";

export const DASHBOARD_HOME_FREEZE_VERSION = "10.10.0";

export const DASHBOARD_HOME_MVP_APPROVAL_STATUS = "MVP Approved" as const;

export type DashboardHomeMvpApprovalStatus = typeof DASHBOARD_HOME_MVP_APPROVAL_STATUS;

/** Canonical owner of the executive landing surface mount and hierarchy. */
export const CANONICAL_DASHBOARD_HOME_OWNER =
  "ExecutiveDashboardHomeSurface + DashboardRuntimePanel(overview)" as const;

/** Dashboard Home is not a dedicated workspace mode — it is the overview landing surface. */
export const CANONICAL_DASHBOARD_HOME_MODE = DEFAULT_DASHBOARD_MODE;

export const CANONICAL_DASHBOARD_HOME_SURFACE_COMPONENT =
  "frontend/app/components/dashboard/ExecutiveDashboardHomeSurface.tsx" as const;

export type DashboardHomeExecutiveResponsibility =
  | "executive_awareness"
  | "executive_readiness"
  | "executive_guidance"
  | "executive_continuity";

export type DashboardHomeOutOfScopeResponsibility =
  | "detailed_analysis"
  | "comparison_workspaces"
  | "scenario_workspaces"
  | "war_room_workspaces"
  | "assistant_conversations";

/** Frozen executive responsibilities — Dashboard Home owns these four pillars only. */
export const DASHBOARD_HOME_EXECUTIVE_RESPONSIBILITIES = Object.freeze([
  "executive_awareness",
  "executive_readiness",
  "executive_guidance",
  "executive_continuity",
] as const satisfies readonly DashboardHomeExecutiveResponsibility[]);

/** Explicitly out of scope — dedicated modes and Assistant own these. */
export const DASHBOARD_HOME_OUT_OF_SCOPE = Object.freeze([
  "detailed_analysis",
  "comparison_workspaces",
  "scenario_workspaces",
  "war_room_workspaces",
  "assistant_conversations",
] as const satisfies readonly DashboardHomeOutOfScopeResponsibility[]);

/** Frozen canonical zone → section mapping. Immutable without migration review. */
export const DASHBOARD_HOME_FROZEN_HIERARCHY = Object.freeze({
  executive_status: Object.freeze([
    "executive_summary",
    "workspace_snapshot",
    "daily_readiness",
  ] as const satisfies readonly DashboardHomeLayoutSectionId[]),
  executive_action: Object.freeze(["quick_actions"] as const),
  executive_guidance: Object.freeze([
    "recommendations_surface",
    "intelligence_briefing",
  ] as const),
  executive_continuity: Object.freeze([
    "recent_activity_timeline",
    "favorites_layer",
    "workspace_recovery",
  ] as const),
});

export type DashboardHomeFrozenContractId =
  | "dashboard_home_layout"
  | "dashboard_home_hierarchy"
  | "dashboard_home_navigation"
  | "dashboard_home_integration";

export type DashboardHomeFrozenContractEntry = Readonly<{
  id: DashboardHomeFrozenContractId;
  title: string;
  owner: string;
  modulePath: string;
  status: DashboardHomeMvpApprovalStatus;
  allowed: readonly string[];
  prohibited: readonly string[];
}>;

/** All Dashboard Home contracts marked MVP Approved at freeze. */
export const DASHBOARD_HOME_FROZEN_CONTRACTS = Object.freeze([
  Object.freeze({
    id: "dashboard_home_layout",
    title: "Dashboard Home Layout Contract",
    owner: "dashboardHomeLayoutContract + DashboardHomeLayoutZone",
    modulePath: "frontend/app/lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutContract.ts",
    status: DASHBOARD_HOME_MVP_APPROVAL_STATUS,
    allowed: [
      "fixed_four_zone_layout",
      "visual_weight_emphasis",
      "zone_child_spacing",
      "layout_theme_tokens",
    ],
    prohibited: [
      "dynamic_reorder",
      "adaptive_sorting",
      "personalization_layout",
      "responsive_hierarchy_inversion",
    ],
  }),
  Object.freeze({
    id: "dashboard_home_hierarchy",
    title: "Dashboard Home Hierarchy Contract",
    owner: CANONICAL_DASHBOARD_HOME_OWNER,
    modulePath: "frontend/app/lib/dashboard/dashboardHomeFreeze/dashboardHomeFreezeContract.ts",
    status: DASHBOARD_HOME_MVP_APPROVAL_STATUS,
    allowed: [
      "canonical_section_order",
      "executive_scanning_sequence",
      "supplementary_workspace_tools_below_zones",
    ],
    prohibited: [
      "section_reorder",
      "duplicate_sections_on_home",
      "timeline_above_guidance",
      "readiness_displacement",
      "recommendations_as_primary_status",
    ],
  }),
  Object.freeze({
    id: "dashboard_home_navigation",
    title: "Dashboard Home Navigation Contract",
    owner: `${CANONICAL_DASHBOARD_MODE_OWNER} + requestWorkspaceLaunch`,
    modulePath: "frontend/app/lib/dashboard/dashboardHomeSurfaceContract.ts",
    status: DASHBOARD_HOME_MVP_APPROVAL_STATUS,
    allowed: [
      "overview_default_landing",
      "workspace_launch_from_home",
      "return_to_overview",
      "navigation_history_projection",
    ],
    prohibited: [
      "dashboard_home_as_dedicated_mode",
      "bypass_home_for_default_landing",
      "parallel_home_surface",
      "assistant_replaces_home",
      "object_panel_replaces_home",
    ],
  }),
  Object.freeze({
    id: "dashboard_home_integration",
    title: "Dashboard Home Integration Contract",
    owner: "MainRightPanelShell + DashboardRuntimePanel + ExecutiveDashboardHomeSurface",
    modulePath: "frontend/app/components/main-right-panel/MainRightPanelShell.tsx",
    status: DASHBOARD_HOME_MVP_APPROVAL_STATUS,
    allowed: [
      "mrp_dashboard_tab_default",
      "object_panel_mode_launch",
      "assistant_tab_isolation",
      "read_only_projections",
    ],
    prohibited: [
      "merge_dashboard_assistant",
      "legacy_right_rail_home_authority",
      "home_mount_on_assistant_tab",
      "polling_home_layers",
      "home_remount_storms",
    ],
  }),
] satisfies readonly DashboardHomeFrozenContractEntry[]);

export const DASHBOARD_HOME_ROUTING_FREEZE = Object.freeze({
  defaultMrpTab: "dashboard" as const,
  landingMode: CANONICAL_DASHBOARD_HOME_MODE,
  homeIsRootSurface: true,
  homeIsNotDedicatedMode: true,
  modeOwner: CANONICAL_DASHBOARD_MODE_OWNER,
  launchEntryPoint: "requestWorkspaceLaunch",
  returnEntryPoint: "onRecentReturn",
});

export const DASHBOARD_HOME_OBJECT_PANEL_INTEGRATION = Object.freeze({
  actions: OBJECT_PANEL_DASHBOARD_ACTIONS,
  behavior: "launch_dashboard_mode",
  homePreserved: true,
  prohibited: ["replace_dashboard_home", "direct_home_mutation"],
});

export const DASHBOARD_HOME_ASSISTANT_INTEGRATION = Object.freeze({
  mrpTabs: MAIN_RIGHT_PANEL_TABS,
  homeTab: "dashboard" as const,
  assistantTab: "assistant" as const,
  homeExclusiveToDashboardTab: true,
  assistantOwns: Object.freeze(["chat", "guidance", "advisory_conversations"]),
  prohibited: ["assistant_replaces_home", "home_on_assistant_tab"],
});

export const DASHBOARD_HOME_UX_FREEZE = Object.freeze({
  tone: Object.freeze(["calm", "executive", "structured", "decision_oriented"]),
  prohibitedDrift: Object.freeze([
    "developer_console",
    "monitoring_dashboard",
    "analytics_overload",
    "operations_wallboard",
  ]),
});

export const DASHBOARD_HOME_PERFORMANCE_FREEZE = Object.freeze({
  required: Object.freeze([
    "render_safe",
    "hydration_safe",
    "routing_safe",
    "loop_safe",
  ]),
  prohibited: Object.freeze([
    "polling_loops",
    "observer_storms",
    "resize_loops",
    "render_chains",
    "dashboard_remount_cycles",
  ]),
});

export const DASHBOARD_HOME_FUTURE_EXTENSION_RULES = Object.freeze({
  allowed: Object.freeze([
    "extend_dashboard_modes",
    "extend_recommendations",
    "extend_readiness",
    "extend_intelligence_engines",
    "enhance_visuals_without_hierarchy_change",
  ]),
  prohibitedWithoutMigration: Object.freeze([
    "reorder_hierarchy",
    "replace_dashboard_home",
    "bypass_dashboard_home",
    "merge_dashboard_assistant_architectures",
  ]),
});

export const DASHBOARD_HOME_FREEZE_BRAKE_PREFIX = "[DashboardHomeFreeze][Brake]" as const;

const loggedBrakes = new Set<string>();

export function warnDashboardHomeFreezeBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.(DASHBOARD_HOME_FREEZE_BRAKE_PREFIX, { message, ...detail });
}

export function resetDashboardHomeFreezeBrakesForTests(): void {
  loggedBrakes.clear();
}

export function isDashboardHomeFrozenSection(
  sectionId: DashboardHomeLayoutSectionId
): boolean {
  return DASHBOARD_HOME_CANONICAL_SECTION_ORDER.includes(sectionId);
}

export function isDashboardHomeFrozenZone(zoneId: DashboardHomeLayoutZoneId): boolean {
  return DASHBOARD_HOME_LAYOUT_ZONES.some((zone) => zone.id === zoneId);
}

export function getDashboardHomeFrozenContract(
  id: DashboardHomeFrozenContractId
): DashboardHomeFrozenContractEntry | null {
  return DASHBOARD_HOME_FROZEN_CONTRACTS.find((entry) => entry.id === id) ?? null;
}
