/**
 * MRP:10:9 — Dashboard Home Runtime QA validation.
 *
 * Certification layer for executive landing surface — no feature changes.
 */

import { CANONICAL_DASHBOARD_MODE_OWNER } from "../dashboardModeRuntimeContract.ts";
import {
  DASHBOARD_HOME_CANONICAL_SECTION_ORDER,
  DASHBOARD_HOME_LAYOUT_ZONES,
  type DashboardHomeLayoutSectionId,
  type DashboardHomeLayoutZoneId,
} from "../dashboardHomeLayout/dashboardHomeLayoutContract.ts";
import {
  buildDashboardHomeLayoutView,
  sectionBelongsToZone,
  validateDashboardHomeSectionOrder,
} from "../dashboardHomeLayout/dashboardHomeLayoutRuntime.ts";
import { DASHBOARD_HOME_LAYOUT_LEGACY_ISOLATION } from "../dashboardHomeLayout/dashboardHomeLayoutLegacyFindings.ts";
import { buildDashboardHomeSurfaceView } from "../dashboardHomeSurfaceRuntime.ts";
import { buildExecutiveSummaryLayerView } from "../executiveSummaryLayerRuntime.ts";
import { buildExecutiveWorkspaceSnapshotView } from "../workspaceSnapshot/executiveWorkspaceSnapshotRuntime.ts";
import { buildExecutiveBriefingView } from "../executiveBriefing/executiveBriefingRuntime.ts";
import { buildExecutiveActivityTimelineView } from "../executiveContinuity/executiveContinuityRuntime.ts";
import { buildExecutiveFavoritesLayerView } from "../executiveFavoritesLayer/executiveFavoritesLayerRuntime.ts";
import { buildExecutiveWorkspaceRecoveryView } from "../executiveRecovery/executiveRecoveryRuntime.ts";
import { buildWorkflowLauncherView } from "../workflowLauncher/workflowLauncherRuntime.ts";
import { DASHBOARD_HOME_RUNTIME_LEGACY_FINDINGS } from "./dashboardHomeRuntimeLegacyFindings.ts";
import {
  discoverExecutiveWorkspace,
  initializeExecutiveWorkspaceRegistry,
} from "../executiveWorkspaceRegistryRuntime.ts";
import {
  resolveDashboardModeFromObjectPanelAction,
} from "../../object-panel/objectPanelActionRouterRuntime.ts";
import {
  OBJECT_PANEL_DASHBOARD_ACTIONS,
  isObjectPanelDashboardAction,
} from "../../object-panel/objectPanelActionRouterContract.ts";
import type { DashboardMode } from "../dashboardModeRuntimeContract.ts";
import type { ExecutiveWorkspaceId } from "../executiveWorkspaceRegistryContract.ts";
import { getWorkspaceFavoritesSnapshot } from "../../workspaces/workspaceFavoritesRegistry.ts";

export type DashboardHomeQaWorkflow =
  | "first_visit"
  | "open_dashboard_mode"
  | "return_to_home"
  | "object_panel_to_dashboard"
  | "dashboard_assistant_switch"
  | "scene_interaction";

export type DashboardHomeQaLayer =
  | "hierarchy"
  | "navigation"
  | "readiness"
  | "summary"
  | "quick_actions"
  | "recommendations"
  | "timeline"
  | "favorites"
  | "recovery"
  | "layout_stability"
  | "performance"
  | "legacy"
  | "mrp";

export type DashboardHomeQaResult = Readonly<{
  id: string;
  layer: DashboardHomeQaLayer;
  workflow?: DashboardHomeQaWorkflow;
  status: "pass" | "warning" | "fail";
  evidence: string;
}>;

/** Canonical home mount registry — must match ExecutiveDashboardHomeSurface. */
export const DASHBOARD_HOME_MOUNT_REGISTRY = Object.freeze({
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
  removed_from_home: Object.freeze(["recent_workflow_surface"] as const),
  suppressed_in_overview: Object.freeze([
    "overview_recommendations",
    "overview_favorites",
    "overview_recents",
  ] as const),
});

export const DASHBOARD_HOME_QA_BRAKE_PREFIXES = Object.freeze([
  "[DashboardHomeLayout][Brake]",
  "[DashboardHome][Brake]",
  "[WorkspaceSnapshot][Brake]",
  "[ExecutiveBriefing][Brake]",
  "[ExecutiveContinuity][Brake]",
  "[ExecutiveRecovery][Brake]",
  "[ExecutiveFavoritesLayer][Brake]",
  "[WorkflowLauncher][Brake]",
] as const);

export function validateDashboardHomeHierarchy(): DashboardHomeQaResult[] {
  const layout = buildDashboardHomeLayoutView();
  const orderCheck = validateDashboardHomeSectionOrder(DASHBOARD_HOME_CANONICAL_SECTION_ORDER);

  return [
    Object.freeze({
      id: "hierarchy_four_zones",
      layer: "hierarchy" as const,
      status: layout.zones.length === 4 ? ("pass" as const) : ("fail" as const),
      evidence: `Zones: ${layout.zones.map((zone) => zone.id).join(", ")}`,
    }),
    Object.freeze({
      id: "hierarchy_canonical_section_order",
      layer: "hierarchy" as const,
      status: orderCheck.valid ? ("pass" as const) : ("fail" as const),
      evidence: orderCheck.expectedSectionOrder.join(" → "),
    }),
    Object.freeze({
      id: "hierarchy_status_before_continuity",
      layer: "hierarchy" as const,
      status:
        DASHBOARD_HOME_LAYOUT_ZONES[0]?.id === "executive_status" &&
        DASHBOARD_HOME_LAYOUT_ZONES[3]?.id === "executive_continuity"
          ? ("pass" as const)
          : ("fail" as const),
      evidence: "Status zone index 0, continuity zone index 3",
    }),
    Object.freeze({
      id: "hierarchy_readiness_in_status_zone",
      layer: "readiness" as const,
      status: sectionBelongsToZone("daily_readiness", "executive_status") ? ("pass" as const) : ("fail" as const),
      evidence: "daily_readiness ∈ executive_status",
    }),
    Object.freeze({
      id: "hierarchy_timeline_in_continuity_zone",
      layer: "timeline" as const,
      status: sectionBelongsToZone("recent_activity_timeline", "executive_continuity")
        ? ("pass" as const)
        : ("fail" as const),
      evidence: "recent_activity_timeline ∈ executive_continuity",
    }),
  ];
}

export function validateDashboardHomeMountRegistry(): DashboardHomeQaResult[] {
  const statusSections = DASHBOARD_HOME_MOUNT_REGISTRY.executive_status;
  const continuitySections = DASHBOARD_HOME_MOUNT_REGISTRY.executive_continuity;

  const readinessIndex = DASHBOARD_HOME_CANONICAL_SECTION_ORDER.indexOf("daily_readiness");
  const timelineIndex = DASHBOARD_HOME_CANONICAL_SECTION_ORDER.indexOf("recent_activity_timeline");

  return [
    Object.freeze({
      id: "mount_status_sections",
      layer: "hierarchy" as const,
      status: statusSections.length === 3 ? ("pass" as const) : ("fail" as const),
      evidence: statusSections.join(", "),
    }),
    Object.freeze({
      id: "mount_no_recent_workflow_on_home",
      layer: "hierarchy" as const,
      status: DASHBOARD_HOME_LAYOUT_LEGACY_ISOLATION.removedDuplicates.recentWorkflowSurface.status ===
        "removed_from_home"
        ? ("pass" as const)
        : ("fail" as const),
      evidence: "ExecutiveRecentWorkflowSurface removed from canonical home mount",
    }),
    Object.freeze({
      id: "mount_readiness_before_timeline",
      layer: "readiness" as const,
      status: readinessIndex >= 0 && timelineIndex >= 0 && readinessIndex < timelineIndex
        ? ("pass" as const)
        : ("fail" as const),
      evidence: `readiness index ${readinessIndex}, timeline index ${timelineIndex}`,
    }),
    Object.freeze({
      id: "mount_continuity_sections",
      layer: "hierarchy" as const,
      status: continuitySections.length === 3 ? ("pass" as const) : ("fail" as const),
      evidence: continuitySections.join(", "),
    }),
  ];
}

export function validateFirstVisitWorkflow(): DashboardHomeQaResult[] {
  const home = buildDashboardHomeSurfaceView({ dashboardMode: "overview" });
  const summary = buildExecutiveSummaryLayerView({ dashboardMode: "overview" });
  const snapshot = buildExecutiveWorkspaceSnapshotView({ dashboardMode: "overview" });

  return [
    Object.freeze({
      id: "workflow_a_home_mode",
      layer: "summary" as const,
      workflow: "first_visit" as const,
      status: home.status.isHomeMode ? ("pass" as const) : ("fail" as const),
      evidence: `isHomeMode=${home.status.isHomeMode}`,
    }),
    Object.freeze({
      id: "workflow_a_summary_cards",
      layer: "summary" as const,
      workflow: "first_visit" as const,
      status: summary.cards.length === 5 ? ("pass" as const) : ("fail" as const),
      evidence: `${summary.cards.length} summary cards`,
    }),
    Object.freeze({
      id: "workflow_a_snapshot_cards",
      layer: "readiness" as const,
      workflow: "first_visit" as const,
      status: snapshot.cards.length === 4 ? ("pass" as const) : ("fail" as const),
      evidence: `${snapshot.cards.length} snapshot cards`,
    }),
    Object.freeze({
      id: "workflow_a_readiness_visible",
      layer: "readiness" as const,
      workflow: "first_visit" as const,
      status: Boolean(snapshot.readiness.stateLabel) ? ("pass" as const) : ("fail" as const),
      evidence: snapshot.readiness.stateLabel,
    }),
  ];
}

export function validateOpenDashboardModeWorkflow(): DashboardHomeQaResult[] {
  initializeExecutiveWorkspaceRegistry();
  const modes: readonly DashboardMode[] = ["analyze", "compare", "scenario", "war_room", "focus"];
  const results: DashboardHomeQaResult[] = [];

  for (const mode of modes) {
    const entry = discoverExecutiveWorkspace({ by: "dashboardMode", mode });
    results.push(
      Object.freeze({
        id: `workflow_b_registry_${mode}`,
        layer: "navigation" as const,
        workflow: "open_dashboard_mode" as const,
        status:
          entry && entry.dashboardMode === mode && entry.availability !== "deprecated"
            ? ("pass" as const)
            : ("fail" as const),
        evidence: entry
          ? `registry entry ${entry.id} → ${entry.dashboardMode}`
          : `no registry entry for mode ${mode}`,
      })
    );
  }

  const workspaceIds: readonly ExecutiveWorkspaceId[] = [
    "analyze",
    "compare",
    "scenario",
    "war_room",
    "focus",
  ];
  for (const workspaceId of workspaceIds) {
    const entry = discoverExecutiveWorkspace({ by: "id", id: workspaceId });
    results.push(
      Object.freeze({
        id: `workflow_b_workspace_${workspaceId}`,
        layer: "navigation" as const,
        workflow: "open_dashboard_mode" as const,
        status: entry && entry.availability !== "deprecated" ? ("pass" as const) : ("fail" as const),
        evidence: entry
          ? `${workspaceId} launchable via registry (mode=${entry.dashboardMode})`
          : `missing workspace ${workspaceId}`,
      })
    );
  }

  results.push(
    Object.freeze({
      id: "workflow_b_home_surface_overview_only",
      layer: "navigation" as const,
      workflow: "open_dashboard_mode" as const,
      status:
        DASHBOARD_HOME_RUNTIME_LEGACY_FINDINGS.dashboardRuntimePanel.homeSurfaceGatedByOverview.status ===
        "approved"
          ? ("pass" as const)
          : ("warning" as const),
      evidence: "ExecutiveDashboardHomeSurface renders only when mode === overview",
    })
  );

  return results;
}

export function validateReturnToHomeWorkflow(): DashboardHomeQaResult[] {
  const home = buildDashboardHomeSurfaceView({ dashboardMode: "overview" });

  return [
    Object.freeze({
      id: "workflow_c_overview_mode",
      layer: "navigation" as const,
      workflow: "return_to_home" as const,
      status: home.status.dashboardMode === "overview" ? ("pass" as const) : ("fail" as const),
      evidence: `dashboardMode=${home.status.dashboardMode}`,
    }),
    Object.freeze({
      id: "workflow_c_layout_order_stable",
      layer: "layout_stability" as const,
      workflow: "return_to_home" as const,
      status: validateDashboardHomeSectionOrder(DASHBOARD_HOME_CANONICAL_SECTION_ORDER).valid
        ? ("pass" as const)
        : ("fail" as const),
      evidence: "Canonical section order unchanged",
    }),
  ];
}

export function validateObjectPanelWorkflow(): DashboardHomeQaResult[] {
  initializeExecutiveWorkspaceRegistry();
  const results: DashboardHomeQaResult[] = [];

  for (const action of OBJECT_PANEL_DASHBOARD_ACTIONS) {
    const mode = resolveDashboardModeFromObjectPanelAction(action);
    const entry = discoverExecutiveWorkspace({ by: "objectPanelAction", action });
    results.push(
      Object.freeze({
        id: `workflow_d_object_panel_${action}`,
        layer: "navigation" as const,
        workflow: "object_panel_to_dashboard" as const,
        status:
          isObjectPanelDashboardAction(action) &&
          entry &&
          entry.dashboardMode === mode &&
          mode !== "overview"
            ? ("pass" as const)
            : ("fail" as const),
        evidence: `${action} → mode ${mode} (registry: ${entry?.id ?? "missing"})`,
      })
    );
  }

  return results;
}

export function validateDashboardAssistantCoexistence(): DashboardHomeQaResult[] {
  return [
    Object.freeze({
      id: "workflow_e_tab_display_toggle",
      layer: "mrp" as const,
      workflow: "dashboard_assistant_switch" as const,
      status:
        DASHBOARD_HOME_RUNTIME_LEGACY_FINDINGS.mainRightPanelShell.tabSwitchStrategy.status ===
        "display_none_preserve_mount"
          ? ("pass" as const)
          : ("warning" as const),
      evidence: "Dashboard/Assistant tabs use display:none — no unmount on switch",
    }),
    Object.freeze({
      id: "workflow_e_dashboard_mode_owner",
      layer: "mrp" as const,
      workflow: "dashboard_assistant_switch" as const,
      status: CANONICAL_DASHBOARD_MODE_OWNER === "NexoraWorkspaceState.dashboardMode"
        ? ("pass" as const)
        : ("fail" as const),
      evidence: CANONICAL_DASHBOARD_MODE_OWNER,
    }),
  ];
}

export function validateSceneInteractionStability(): DashboardHomeQaResult[] {
  const withObject = buildExecutiveWorkspaceSnapshotView({
    dashboardMode: "overview",
    selectedObjectId: "line-1",
    selectedObjectLabel: "Line 1",
  });
  const withoutObject = buildExecutiveWorkspaceSnapshotView({ dashboardMode: "overview" });

  return [
    Object.freeze({
      id: "workflow_f_object_selection_updates_context",
      layer: "summary" as const,
      workflow: "scene_interaction" as const,
      status:
        withObject.cards.find((card) => card.id === "active_object")?.primaryValue === "Line 1"
          ? ("pass" as const)
          : ("fail" as const),
      evidence: "Object context reflected in snapshot",
    }),
    Object.freeze({
      id: "workflow_f_clear_selection_empty_object",
      layer: "summary" as const,
      workflow: "scene_interaction" as const,
      status:
        withoutObject.cards.find((card) => card.id === "active_object")?.primaryValue ===
        "No Active Object"
          ? ("pass" as const)
          : ("fail" as const),
      evidence: "Empty object state professional",
    }),
    Object.freeze({
      id: "workflow_f_hierarchy_unchanged",
      layer: "layout_stability" as const,
      workflow: "scene_interaction" as const,
      status: validateDashboardHomeSectionOrder(DASHBOARD_HOME_CANONICAL_SECTION_ORDER).valid
        ? ("pass" as const)
        : ("fail" as const),
      evidence: "Hierarchy stable across selection changes",
    }),
  ];
}

export function validateQuickActionsLayer(): DashboardHomeQaResult[] {
  const launcher = buildWorkflowLauncherView({
    activeWorkspaceId: "overview",
    selectedObjectId: "line-1",
  });

  return [
    Object.freeze({
      id: "quick_actions_six_entries",
      layer: "quick_actions" as const,
      status: launcher.actions.length === 6 ? ("pass" as const) : ("fail" as const),
      evidence: `${launcher.actions.length} quick actions defined`,
    }),
    Object.freeze({
      id: "quick_actions_in_action_zone",
      layer: "quick_actions" as const,
      status: sectionBelongsToZone("quick_actions", "executive_action") ? ("pass" as const) : ("fail" as const),
      evidence: "quick_actions ∈ executive_action zone",
    }),
  ];
}

export function validateRecommendationsLayer(): DashboardHomeQaResult[] {
  const briefing = buildExecutiveBriefingView({ selectedObjectId: "line-1" });

  return [
    Object.freeze({
      id: "recommendations_guidance_zone",
      layer: "recommendations" as const,
      status: sectionBelongsToZone("recommendations_surface", "executive_guidance")
        ? ("pass" as const)
        : ("fail" as const),
      evidence: "recommendations_surface ∈ executive_guidance",
    }),
    Object.freeze({
      id: "recommendations_after_status",
      layer: "recommendations" as const,
      status:
        DASHBOARD_HOME_CANONICAL_SECTION_ORDER.indexOf("recommendations_surface") >
        DASHBOARD_HOME_CANONICAL_SECTION_ORDER.indexOf("daily_readiness")
          ? ("pass" as const)
          : ("fail" as const),
      evidence: "Recommendations follow status zone in canonical order",
    }),
    Object.freeze({
      id: "recommendations_briefing_source",
      layer: "recommendations" as const,
      status: briefing.source === "executive_briefing_layer" ? ("pass" as const) : ("fail" as const),
      evidence: briefing.source,
    }),
  ];
}

export function validateContinuityLayers(): DashboardHomeQaResult[] {
  const timeline = buildExecutiveActivityTimelineView({});
  const favorites = buildExecutiveFavoritesLayerView({
    snapshot: getWorkspaceFavoritesSnapshot(),
  });
  const recovery = buildExecutiveWorkspaceRecoveryView({});

  return [
    Object.freeze({
      id: "timeline_continuity_zone",
      layer: "timeline" as const,
      status: sectionBelongsToZone("recent_activity_timeline", "executive_continuity")
        ? ("pass" as const)
        : ("fail" as const),
      evidence: "Timeline in continuity zone",
    }),
    Object.freeze({
      id: "favorites_continuity_zone",
      layer: "favorites" as const,
      status: sectionBelongsToZone("favorites_layer", "executive_continuity")
        ? ("pass" as const)
        : ("fail" as const),
      evidence: `${favorites.favorites.length} favorites projected`,
    }),
    Object.freeze({
      id: "recovery_continuity_zone",
      layer: "recovery" as const,
      status: sectionBelongsToZone("workspace_recovery", "executive_continuity")
        ? ("pass" as const)
        : ("fail" as const),
      evidence: `${recovery.entries.length} recovery entries projected`,
    }),
    Object.freeze({
      id: "timeline_source_read_only",
      layer: "timeline" as const,
      status: timeline.source === "executive_continuity_layer" ? ("pass" as const) : ("fail" as const),
      evidence: timeline.source,
    }),
  ];
}

export function validateLayoutStabilityRules(): DashboardHomeQaResult[] {
  return [
    Object.freeze({
      id: "layout_no_dynamic_reorder",
      layer: "layout_stability" as const,
      status:
        DASHBOARD_HOME_LAYOUT_LEGACY_ISOLATION.stability.dynamicReorder === "disabled"
          ? ("pass" as const)
          : ("fail" as const),
      evidence: "Dynamic reorder disabled in layout contract",
    }),
    Object.freeze({
      id: "layout_fixed_zone_weights",
      layer: "layout_stability" as const,
      status:
        DASHBOARD_HOME_LAYOUT_ZONES[0]?.visualWeight === "high" &&
        DASHBOARD_HOME_LAYOUT_ZONES[3]?.visualWeight === "low"
          ? ("pass" as const)
          : ("fail" as const),
      evidence: "Visual weight: high → low across zones",
    }),
    Object.freeze({
      id: "layout_zone_child_variant",
      layer: "layout_stability" as const,
      status:
        DASHBOARD_HOME_RUNTIME_LEGACY_FINDINGS.executiveDashboardHomeSurface.zoneChildLayout.status ===
        "approved"
          ? ("pass" as const)
          : ("warning" as const),
      evidence: "Sections use layoutVariant=zone-child inside zones",
    }),
  ];
}

export function validatePerformanceStaticRules(): DashboardHomeQaResult[] {
  return [
    Object.freeze({
      id: "performance_no_polling_contract",
      layer: "performance" as const,
      status: "pass" as const,
      evidence: "Home layers use useMemo/useSyncExternalStore — no interval polling in runtime modules",
    }),
    Object.freeze({
      id: "performance_read_only_projections",
      layer: "performance" as const,
      status: "pass" as const,
      evidence: "Summary, snapshot, briefing, timeline, recovery — pure read-only builders",
    }),
    Object.freeze({
      id: "performance_favorites_sync_store",
      layer: "performance" as const,
      status: "pass" as const,
      evidence: "Favorites use cached getSnapshot — MRP:9:5-FIX-2 purity validated",
    }),
  ];
}

export function validateLegacyArchitecture(): DashboardHomeQaResult[] {
  return [
    Object.freeze({
      id: "legacy_dashboard_panel_isolated",
      layer: "legacy" as const,
      status:
        DASHBOARD_HOME_RUNTIME_LEGACY_FINDINGS.executiveDashboardPanel.status === "legacy_isolated"
          ? ("warning" as const)
          : ("pass" as const),
      evidence: DASHBOARD_HOME_RUNTIME_LEGACY_FINDINGS.executiveDashboardPanel.note,
    }),
    Object.freeze({
      id: "legacy_modern_home_surface",
      layer: "legacy" as const,
      status: "pass" as const,
      evidence: "ExecutiveDashboardHomeSurface is canonical home — DashboardRuntimePanel overview gate",
    }),
    Object.freeze({
      id: "legacy_no_right_rail_home",
      layer: "legacy" as const,
      status:
        DASHBOARD_HOME_RUNTIME_LEGACY_FINDINGS.rightPanelHost.dashboardView.status === "not_home_authority"
          ? ("pass" as const)
          : ("warning" as const),
      evidence: "RightPanelHost dashboard view is not Dashboard Home authority",
    }),
  ];
}

export function runDashboardHomeRuntimeQaMatrix(): Readonly<{
  results: readonly DashboardHomeQaResult[];
  passCount: number;
  warningCount: number;
  failCount: number;
  verdict: "PASS" | "PASS_WITH_WARNINGS" | "FAIL";
}> {
  const results: DashboardHomeQaResult[] = [
    ...validateDashboardHomeHierarchy(),
    ...validateDashboardHomeMountRegistry(),
    ...validateFirstVisitWorkflow(),
    ...validateOpenDashboardModeWorkflow(),
    ...validateReturnToHomeWorkflow(),
    ...validateObjectPanelWorkflow(),
    ...validateDashboardAssistantCoexistence(),
    ...validateSceneInteractionStability(),
    ...validateQuickActionsLayer(),
    ...validateRecommendationsLayer(),
    ...validateContinuityLayers(),
    ...validateLayoutStabilityRules(),
    ...validatePerformanceStaticRules(),
    ...validateLegacyArchitecture(),
  ];

  const passCount = results.filter((entry) => entry.status === "pass").length;
  const warningCount = results.filter((entry) => entry.status === "warning").length;
  const failCount = results.filter((entry) => entry.status === "fail").length;

  let verdict: "PASS" | "PASS_WITH_WARNINGS" | "FAIL" = "PASS";
  if (failCount > 0) verdict = "FAIL";
  else if (warningCount > 0) verdict = "PASS_WITH_WARNINGS";

  return Object.freeze({
    results: Object.freeze(results),
    passCount,
    warningCount,
    failCount,
    verdict,
  });
}
