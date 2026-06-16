/**
 * MRP:3:2 — Pure resolver for Context Header display fields.
 */

import type { DashboardContext } from "../mainRightPanelContract.ts";
import { dashboardModeLabel, type DashboardMode } from "../../dashboard/dashboardModeRuntimeContract.ts";
import { getExecutiveWorkspaceEntry } from "../../dashboard/executiveWorkspaceRegistryContract.ts";
import { resolveWorkspaceIdFromDashboardMode } from "../../dashboard/executiveWorkspaceLifecycleContract.ts";
import { getNexoraLeftNavItem, type NexoraLeftNavMode } from "../nexoraLeftNavContract.ts";
import {
  DEFAULT_MRP_ACTIVE_MODE,
  DEFAULT_MRP_BACK_LABEL,
  DEFAULT_MRP_PANEL_NAME,
  DEFAULT_MRP_SELECTED_OBJECT,
  type MrpContextHeaderView,
  type MrpContextResolverInput,
} from "./mrpContextStoreContract.ts";
import { getMrpContextHistoryDepth } from "./mrpContextHistoryRuntime.ts";

const OVERVIEW_CONTEXT_PANEL_NAMES: Readonly<Record<DashboardContext, string>> = Object.freeze({
  overview: "Insight Home",
  sources: "Sources",
  compare: "Compare",
  scenario: "Scenario",
  risk: "Risk",
  war_room: "War Room",
  timeline: "Timeline",
  settings: "Settings",
  advisory: "Advisory",
  governance: "Governance",
});

const OVERVIEW_CONTEXT_ACTIVE_MODES: Readonly<Record<DashboardContext, string>> = Object.freeze({
  overview: "Executive Summary",
  sources: "Live Operations",
  compare: "Comparison",
  scenario: "Scenario Planning",
  risk: "Forecast",
  war_room: "Response Plan",
  timeline: "Decision Timeline",
  settings: "Configuration",
  advisory: "Recommendation / Overview",
  governance: "Approval • Policy • Authority",
});

const DEDICATED_PANEL_NAME_OVERRIDES: Partial<Record<DashboardMode, string>> = Object.freeze({
  analyze: "Risk",
});

function normalizeDisplayString(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function resolveSelectedObjectLabel(input: MrpContextResolverInput): string {
  const label =
    input.selectedObjectLabel ??
    input.routeObjectName ??
    input.selectedObjectId ??
    input.routeObjectId;
  return normalizeDisplayString(label, DEFAULT_MRP_SELECTED_OBJECT);
}

function resolveOverviewPanelName(dashboardContext: DashboardContext): string {
  return OVERVIEW_CONTEXT_PANEL_NAMES[dashboardContext] ?? DEFAULT_MRP_PANEL_NAME;
}

function resolveOverviewActiveMode(dashboardContext: DashboardContext): string {
  return OVERVIEW_CONTEXT_ACTIVE_MODES[dashboardContext] ?? DEFAULT_MRP_ACTIVE_MODE;
}

function resolveDedicatedPanelName(mode: DashboardMode): string {
  const override = DEDICATED_PANEL_NAME_OVERRIDES[mode];
  if (override) return override;

  const workspaceId = resolveWorkspaceIdFromDashboardMode(mode);
  const entry = workspaceId ? getExecutiveWorkspaceEntry(workspaceId) : null;
  if (entry?.name?.trim()) return entry.name.trim();

  return dashboardModeLabel(mode);
}

function resolveDedicatedActiveMode(input: MrpContextResolverInput): string {
  if (input.subWorkspaceMode?.trim()) {
    return input.subWorkspaceMode.trim();
  }

  switch (input.dashboardMode) {
    case "focus":
      return normalizeDisplayString(input.focusContext?.impact, "Object Focus");
    case "analyze":
      return normalizeDisplayString(
        input.analyzeContext?.analysisStatusLabel,
        "Forecast"
      );
    case "compare":
      return normalizeDisplayString(
        input.compareContext?.comparisonStatusLabel,
        "Comparison"
      );
    case "scenario":
      return normalizeDisplayString(
        input.scenarioContext?.scenarioStatusLabel,
        "Scenario Planning"
      );
    case "war_room":
      return normalizeDisplayString(
        input.warRoomContext?.warRoomStatusLabel,
        "Response Plan"
      );
    default:
      return dashboardModeLabel(input.dashboardMode);
  }
}

export function resolveMrpPanelName(input: MrpContextResolverInput): string {
  if (input.dashboardMode === "overview") {
    return resolveOverviewPanelName(input.dashboardContext);
  }
  if (input.dashboardMode === "advisory") {
    return "Advisory";
  }
  if (input.dashboardMode === "governance") {
    return "Governance";
  }
  return resolveDedicatedPanelName(input.dashboardMode);
}

export function resolveMrpActiveMode(input: MrpContextResolverInput): string {
  if (input.dashboardMode === "advisory") {
    return "Recommendation / Overview";
  }
  if (input.dashboardMode === "governance") {
    return "Approval • Policy • Authority";
  }
  if (input.dashboardMode === "overview") {
    if (input.dashboardContext === "advisory") {
      return resolveOverviewActiveMode("advisory");
    }
    if (input.subWorkspaceMode?.trim()) {
      return input.subWorkspaceMode.trim();
    }
    return resolveOverviewActiveMode(input.dashboardContext);
  }
  return resolveDedicatedActiveMode(input);
}

export function resolveMrpBackNavigation(input: MrpContextResolverInput): Readonly<{
  showBackNavigation: boolean;
  backLabel: string;
}> {
  const depth = input.navigationBackStackDepth ?? getMrpContextHistoryDepth();
  const showBackNavigation = input.dashboardMode !== "overview" || depth > 0;
  return Object.freeze({
    showBackNavigation,
    backLabel: DEFAULT_MRP_BACK_LABEL,
  });
}

export function buildMrpContextHeaderView(
  input: MrpContextResolverInput,
  revision: number
): MrpContextHeaderView {
  const back = resolveMrpBackNavigation(input);
  return Object.freeze({
    panelName: resolveMrpPanelName(input),
    activeMode: resolveMrpActiveMode(input),
    selectedObject: resolveSelectedObjectLabel(input),
    backLabel: back.backLabel,
    showBackNavigation: back.showBackNavigation,
    revision,
    source: "mrp_context_store",
  });
}

export function buildMrpContextSignature(input: MrpContextResolverInput): string {
  return JSON.stringify({
    activeTab: input.activeTab,
    dashboardMode: input.dashboardMode,
    dashboardContext: input.dashboardContext,
    selectedObjectId: input.selectedObjectId ?? null,
    selectedObjectLabel: input.selectedObjectLabel ?? null,
    routeObjectId: input.routeObjectId ?? null,
    routeObjectName: input.routeObjectName ?? null,
    subWorkspaceMode: input.subWorkspaceMode ?? null,
    navigationBackStackDepth: input.navigationBackStackDepth ?? 0,
    focusImpact: input.focusContext?.impact ?? null,
    analyzeStatus: input.analyzeContext?.analysisStatusLabel ?? null,
    compareStatus: input.compareContext?.comparisonStatusLabel ?? null,
    scenarioStatus: input.scenarioContext?.scenarioStatusLabel ?? null,
    warRoomStatus: input.warRoomContext?.warRoomStatusLabel ?? null,
  });
}

/** Resolve left-nav label when panel name should mirror navigation chrome. */
export function resolveLeftNavPanelNameHint(mode: NexoraLeftNavMode): string {
  return getNexoraLeftNavItem(mode).label;
}
