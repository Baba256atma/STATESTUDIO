/**
 * MRP:9:1 — Dashboard Workspace Launcher runtime.
 *
 * Reads registry. Requests transitions. Never executes workspaces.
 */

import type { DashboardMode } from "../dashboardModeRuntimeContract.ts";
import {
  getExecutiveWorkspaceEntry,
  listExecutiveWorkspaceIds,
  validateExecutiveWorkspaceOpenRequest,
  warnWorkspaceRegistryBrake,
  type ExecutiveWorkspaceCatalogEntry,
  type ExecutiveWorkspaceId,
} from "../executiveWorkspaceRegistryContract.ts";
import { initializeExecutiveWorkspaceRegistry } from "../executiveWorkspaceRegistryRuntime.ts";
import { getActiveWorkspaceLifecycleState } from "../executiveWorkspaceLifecycleRuntime.ts";
import {
  resolveWorkspaceIdFromObjectPanelAction,
} from "../executiveWorkspaceLifecycleContract.ts";
import { requestExecutiveWorkspaceTransition } from "../executiveWorkspaceTransitionControllerRuntime.ts";
import { getWorkspaceNavigationSummary } from "../executiveWorkspaceNavigationHistoryRuntime.ts";
import {
  isObjectPanelDashboardAction,
  normalizeObjectPanelDashboardAction,
  type ObjectPanelDashboardAction,
} from "../../object-panel/objectPanelActionRouterContract.ts";
import {
  resolveLauncherCardBadge,
  resolveLauncherCardStatus,
  warnWorkspaceEntryPointBrake,
  warnWorkspaceLauncherBrake,
  warnWorkspaceLauncherStateBrake,
  warnWorkspaceLaunchTransitionBrake,
  type WorkspaceLaunchRequestInput,
  type WorkspaceLaunchRequestResult,
  type WorkspaceLauncherCardView,
  type WorkspaceLauncherStateView,
} from "./workspaceLauncherContract.ts";

function isLauncherCatalogEntry(entry: ExecutiveWorkspaceCatalogEntry): boolean {
  if (entry.id === "overview") return false;
  if (entry.availability === "future") return true;
  return entry.availability === "available" && entry.objectPanelAction !== null;
}

function resolveEntryLaunchable(entry: ExecutiveWorkspaceCatalogEntry): boolean {
  return entry.availability === "available" && entry.objectPanelAction !== null && entry.dashboardMode !== null;
}

export function listLauncherCatalogEntries(): readonly ExecutiveWorkspaceCatalogEntry[] {
  initializeExecutiveWorkspaceRegistry();
  return Object.freeze(
    listExecutiveWorkspaceIds()
      .map((id) => getExecutiveWorkspaceEntry(id))
      .filter(isLauncherCatalogEntry)
  );
}

export function buildWorkspaceLauncherCardView(input: {
  entry: ExecutiveWorkspaceCatalogEntry;
  activeWorkspaceId: ExecutiveWorkspaceId | null;
}): WorkspaceLauncherCardView {
  const isActive = input.activeWorkspaceId === input.entry.id;
  const launchable = resolveEntryLaunchable(input.entry);
  const status = resolveLauncherCardStatus({
    availability: input.entry.availability,
    isActive,
    launchable,
  });

  return Object.freeze({
    workspaceId: input.entry.id,
    name: input.entry.name,
    description: input.entry.description,
    availability: input.entry.availability,
    status,
    launchable,
    badge: resolveLauncherCardBadge({ status, availability: input.entry.availability }),
    isActive,
    dashboardMode: input.entry.dashboardMode,
    objectPanelAction: input.entry.objectPanelAction,
  });
}

export function buildWorkspaceLauncherState(
  activeWorkspaceId: ExecutiveWorkspaceId | null = null
): WorkspaceLauncherStateView {
  initializeExecutiveWorkspaceRegistry();
  const activeLifecycle = getActiveWorkspaceLifecycleState();
  const resolvedActiveId = activeWorkspaceId ?? activeLifecycle?.workspaceId ?? null;
  const navigation = getWorkspaceNavigationSummary();
  const recentId = navigation.previousWorkspaceId;

  const cards = listLauncherCatalogEntries().map((entry) =>
    buildWorkspaceLauncherCardView({
      entry,
      activeWorkspaceId: resolvedActiveId,
    })
  );

  const activeEntry = resolvedActiveId ? getExecutiveWorkspaceEntry(resolvedActiveId) : null;
  const recentEntry = recentId ? getExecutiveWorkspaceEntry(recentId) : null;

  return Object.freeze({
    activeWorkspaceId: resolvedActiveId,
    activeWorkspaceName: activeEntry?.name ?? null,
    recentWorkspaceId: recentId,
    recentWorkspaceName: recentEntry?.name ?? null,
    cards,
    source: "workspace_launcher",
  });
}

function resolveLaunchTarget(input: WorkspaceLaunchRequestInput): {
  workspaceId: ExecutiveWorkspaceId | null;
  entry: ExecutiveWorkspaceCatalogEntry | null;
  objectPanelAction: ObjectPanelDashboardAction | null;
  reason: string;
} {
  if (input.workspaceId) {
    const entry = getExecutiveWorkspaceEntry(input.workspaceId);
    if (!entry) {
      warnWorkspaceLauncherBrake("Unknown workspace.", { workspaceId: input.workspaceId });
      return { workspaceId: null, entry: null, objectPanelAction: null, reason: "unknown_workspace" };
    }
    return {
      workspaceId: entry.id,
      entry,
      objectPanelAction: entry.objectPanelAction,
      reason: "resolved_by_workspace_id",
    };
  }

  const normalizedAction = normalizeObjectPanelDashboardAction(input.objectPanelAction);
  if (!normalizedAction || !isObjectPanelDashboardAction(normalizedAction)) {
    warnWorkspaceEntryPointBrake("Invalid launch action.", {
      source: input.source,
      action: input.objectPanelAction ?? null,
    });
    return { workspaceId: null, entry: null, objectPanelAction: null, reason: "invalid_action" };
  }

  const workspaceId = resolveWorkspaceIdFromObjectPanelAction(normalizedAction);
  if (!workspaceId) {
    warnWorkspaceLauncherBrake("Missing workspace mapping.", { action: normalizedAction });
    return { workspaceId: null, entry: null, objectPanelAction: null, reason: "missing_workspace" };
  }

  const entry = getExecutiveWorkspaceEntry(workspaceId);
  return {
    workspaceId,
    entry,
    objectPanelAction: normalizedAction,
    reason: "resolved_by_object_panel_action",
  };
}

export function requestWorkspaceLaunch(
  input: WorkspaceLaunchRequestInput
): WorkspaceLaunchRequestResult {
  initializeExecutiveWorkspaceRegistry();

  const target = resolveLaunchTarget(input);
  if (!target.workspaceId || !target.entry) {
    return Object.freeze({
      approved: false,
      workspaceId: null,
      dashboardMode: null,
      objectPanelAction: null,
      routeObject: null,
      source: input.source,
      reason: target.reason,
    });
  }

  const objectId = typeof input.objectId === "string" ? input.objectId.trim() : "";
  if (target.entry.objectPanelAction && !objectId) {
    warnWorkspaceEntryPointBrake("Missing object for launch.", {
      source: input.source,
      workspaceId: target.workspaceId,
    });
    return Object.freeze({
      approved: false,
      workspaceId: target.workspaceId,
      dashboardMode: target.entry.dashboardMode,
      objectPanelAction: target.entry.objectPanelAction,
      routeObject: null,
      source: input.source,
      reason: "missing_object",
    });
  }

  const active = getActiveWorkspaceLifecycleState();
  if (active?.workspaceId === target.workspaceId && active.currentState === "active") {
    warnWorkspaceLauncherStateBrake("Already active workspace.", {
      workspaceId: target.workspaceId,
      source: input.source,
    });
    return Object.freeze({
      approved: false,
      workspaceId: target.workspaceId,
      dashboardMode: target.entry.dashboardMode,
      objectPanelAction: target.entry.objectPanelAction,
      routeObject: objectId
        ? Object.freeze({
            objectId,
            objectName:
              (typeof input.objectName === "string" && input.objectName.trim()) || objectId,
          })
        : null,
      source: input.source,
      reason: "already_active",
    });
  }

  const registryValidation = validateExecutiveWorkspaceOpenRequest({
    workspaceId: target.workspaceId,
    objectPanelAction: target.objectPanelAction ?? undefined,
  });
  if (!registryValidation.valid) {
    warnWorkspaceRegistryBrake("Registry mismatch.", {
      workspaceId: target.workspaceId,
      reason: registryValidation.reason,
    });
    return Object.freeze({
      approved: false,
      workspaceId: target.workspaceId,
      dashboardMode: target.entry.dashboardMode,
      objectPanelAction: target.entry.objectPanelAction,
      routeObject: null,
      source: input.source,
      reason: registryValidation.reason,
    });
  }

  const transition = requestExecutiveWorkspaceTransition({
    targetWorkspaceId: target.workspaceId,
    source:
      input.source === "object_panel"
        ? "object_panel"
        : input.source === "assistant_bridge"
          ? "assistant_bridge"
          : "dashboard_direct",
  });

  if (!transition.approved) {
    warnWorkspaceLaunchTransitionBrake("Transition rejected.", {
      workspaceId: target.workspaceId,
      source: input.source,
      reason: transition.reason,
    });
    return Object.freeze({
      approved: false,
      workspaceId: target.workspaceId,
      dashboardMode: target.entry.dashboardMode,
      objectPanelAction: target.entry.objectPanelAction,
      routeObject: null,
      source: input.source,
      reason: transition.reason,
    });
  }

  const objectName =
    (typeof input.objectName === "string" && input.objectName.trim()) || objectId || "";

  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.debug?.("[WorkspaceLauncher][Request]", {
      workspaceId: target.workspaceId,
      source: input.source,
      objectId: objectId || null,
    });
  }

  return Object.freeze({
    approved: true,
    workspaceId: target.workspaceId,
    dashboardMode: target.entry.dashboardMode,
    objectPanelAction: target.entry.objectPanelAction,
    routeObject: objectId
      ? Object.freeze({ objectId, objectName })
      : null,
    source: input.source,
    reason: "launch_request_approved",
  });
}

export function mapWorkspaceLaunchSourceToRouteType(
  source: WorkspaceLaunchRequestResult["source"]
): "object_panel" | "assistant_bridge" | "dashboard_direct" {
  if (source === "object_panel") return "object_panel";
  if (source === "assistant_bridge") return "assistant_bridge";
  return "dashboard_direct";
}

export function isWorkspaceLaunchExecutable(result: WorkspaceLaunchRequestResult): result is WorkspaceLaunchRequestResult & {
  approved: true;
  dashboardMode: DashboardMode;
} {
  return result.approved && result.dashboardMode !== null;
}
