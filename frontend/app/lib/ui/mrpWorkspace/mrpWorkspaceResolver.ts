/**
 * MRP:3:4 — Resolve active workspace mount plan for Section C.
 */

import type { DashboardContext } from "../mainRightPanelContract.ts";
import {
  getMrpWorkspaceRegistryEntry,
} from "./mrpWorkspaceRegistry.ts";
import type {
  MrpWorkspaceId,
  MrpWorkspaceMountPlan,
  MrpWorkspaceMountTarget,
  MrpWorkspaceResolveInput,
} from "./mrpWorkspaceLoaderContract.ts";

function normalizeSubMode(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function resolveMrpWorkspaceId(input: MrpWorkspaceResolveInput): MrpWorkspaceId {
  const subMode = normalizeSubMode(input.subWorkspaceMode);

  if (subMode.includes("advisory")) return "advisory";
  if (subMode.includes("governance")) return "governance";
  if (subMode.includes("operational")) return "operational";
  if (subMode.includes("timeline")) return "timeline";
  if (subMode.includes("scenario")) return "scenario";
  if (subMode.includes("war room") || subMode.includes("war_room")) return "war_room";
  if (subMode.includes("risk") || subMode.includes("forecast")) return "risk";

  if (input.dashboardMode !== "overview") {
    switch (input.dashboardMode) {
      case "focus":
        return "executive_summary";
      case "analyze":
        return "risk";
      case "compare":
        return "compare";
      case "scenario":
        return "scenario";
      case "war_room":
        return "war_room";
      case "risk":
        return "risk";
      case "timeline":
        return "timeline";
      case "advisory":
        return "advisory";
      case "governance":
        return "governance";
      default:
        return "executive_summary";
    }
  }

  switch (input.dashboardContext) {
    case "sources":
      return "operational";
    case "risk":
      return "risk";
    case "timeline":
      return "timeline";
    case "compare":
      return "compare";
    case "scenario":
      return "scenario";
    case "war_room":
      return "war_room";
    case "settings":
      return "governance";
    case "governance":
      return "governance";
    case "advisory":
      return "advisory";
    default:
      return "executive_summary";
  }
}

export function resolveMrpWorkspaceMountTarget(
  workspaceId: MrpWorkspaceId,
  input: MrpWorkspaceResolveInput
): MrpWorkspaceMountTarget {
  const entry = getMrpWorkspaceRegistryEntry(workspaceId);

  if (workspaceId === "executive_summary") {
    if (input.dashboardMode === "overview" && input.dashboardContext === "overview") {
      return "executive_summary_workspace";
    }
    return "dashboard_runtime";
  }

  if (workspaceId === "operational") {
    if (input.dashboardMode === "overview" && input.dashboardContext === "sources") {
      return "operational_workspace";
    }
    return "loader_shell";
  }

  if (workspaceId === "risk") {
    if (
      input.dashboardMode === "risk" ||
      (input.dashboardMode === "overview" && input.dashboardContext === "risk")
    ) {
      return "risk_workspace";
    }
    return "loader_shell";
  }

  if (workspaceId === "timeline") {
    if (
      input.dashboardMode === "timeline" ||
      (input.dashboardMode === "overview" && input.dashboardContext === "timeline")
    ) {
      return "timeline_workspace";
    }
    return "loader_shell";
  }

  if (workspaceId === "scenario") {
    if (
      input.dashboardMode === "scenario" ||
      (input.dashboardMode === "overview" && input.dashboardContext === "scenario")
    ) {
      return "scenario_workspace";
    }
    return "loader_shell";
  }

  if (workspaceId === "compare") {
    return "dashboard_runtime";
  }

  if (workspaceId === "war_room") {
    if (
      input.dashboardMode === "war_room" ||
      (input.dashboardMode === "overview" && input.dashboardContext === "war_room")
    ) {
      return "war_room_workspace";
    }
    return "loader_shell";
  }

  if (workspaceId === "advisory") {
    if (
      input.dashboardMode === "advisory" ||
      input.dashboardContext === "advisory" ||
      normalizeSubMode(input.subWorkspaceMode).includes("advisory")
    ) {
      return "advisory_workspace";
    }
    return "loader_shell";
  }

  if (workspaceId === "governance") {
    if (
      input.dashboardMode === "governance" ||
      input.dashboardContext === "governance" ||
      input.dashboardContext === "settings" ||
      normalizeSubMode(input.subWorkspaceMode).includes("governance")
    ) {
      return "governance_workspace";
    }
    return "loader_shell";
  }

  if (entry.mountTarget === "dashboard_runtime") {
    return "dashboard_runtime";
  }

  if (entry.mountTarget === "executive_summary_workspace") {
    return "executive_summary_workspace";
  }

  if (entry.mountTarget === "operational_workspace") {
    return "operational_workspace";
  }

  if (entry.mountTarget === "risk_workspace") {
    return "risk_workspace";
  }

  if (entry.mountTarget === "timeline_workspace") {
    return "timeline_workspace";
  }

  if (entry.mountTarget === "scenario_workspace") {
    return "scenario_workspace";
  }

  if (entry.mountTarget === "war_room_workspace") {
    return "war_room_workspace";
  }

  if (entry.mountTarget === "advisory_workspace") {
    return "advisory_workspace";
  }

  if (entry.mountTarget === "governance_workspace") {
    return "governance_workspace";
  }

  if (input.dashboardMode !== "overview") {
    return "dashboard_runtime";
  }

  return "loader_shell";
}

export function buildMrpWorkspaceMountKey(
  workspaceId: MrpWorkspaceId,
  input: MrpWorkspaceResolveInput,
  mountTarget: MrpWorkspaceMountTarget
): string {
  return [
    workspaceId,
    mountTarget,
    input.dashboardMode,
    input.dashboardContext,
    normalizeSubMode(input.subWorkspaceMode) || "none",
  ].join(":");
}

export function resolveMrpWorkspaceMountPlan(
  input: MrpWorkspaceResolveInput
): MrpWorkspaceMountPlan {
  const workspaceId = resolveMrpWorkspaceId(input);
  const mountTarget = resolveMrpWorkspaceMountTarget(workspaceId, input);
  const entry = getMrpWorkspaceRegistryEntry(workspaceId);

  return Object.freeze({
    workspaceId,
    mountTarget,
    mountKey: buildMrpWorkspaceMountKey(workspaceId, input, mountTarget),
    title: entry.title,
  });
}

/** @internal Test helper for dashboard context mapping. */
export function resolveMrpWorkspaceIdFromDashboardContext(
  dashboardContext: DashboardContext
): MrpWorkspaceId {
  return resolveMrpWorkspaceId({
    dashboardMode: "overview",
    dashboardContext,
    subWorkspaceMode: null,
  });
}
