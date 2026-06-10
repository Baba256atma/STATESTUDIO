/**
 * MRP:2:1 — Object Panel action router runtime.
 * MRP:9:1 — Entry points consolidated through requestWorkspaceLaunch.
 */

import {
  normalizeDashboardMode,
  type DashboardMode,
} from "../dashboard/dashboardModeRuntimeContract.ts";
import {
  buildObjectPanelActionPayload,
  isObjectPanelDashboardAction,
  normalizeObjectPanelDashboardAction,
  warnObjectActionRouterBrake,
  type ObjectPanelActionPayload,
  type ObjectPanelActionRequestInput,
  type ObjectPanelActionRouteResult,
  type ObjectPanelDashboardAction,
} from "./objectPanelActionRouterContract.ts";
import { discoverExecutiveWorkspace } from "../dashboard/executiveWorkspaceRegistryRuntime.ts";
import { requestWorkspaceLaunch } from "../dashboard/workspaceLauncher/workspaceLauncherRuntime.ts";
import { warnWorkspaceEntryPointBrake } from "../dashboard/workspaceLauncher/workspaceLauncherContract.ts";

export function resolveDashboardModeFromObjectPanelAction(
  action: ObjectPanelDashboardAction
): DashboardMode {
  const entry = discoverExecutiveWorkspace({ by: "objectPanelAction", action });
  return entry?.dashboardMode ?? "overview";
}

export function routeObjectPanelActionRequest(
  input: ObjectPanelActionRequestInput
): ObjectPanelActionRouteResult {
  const objectId = typeof input.objectId === "string" ? input.objectId.trim() : "";
  if (!objectId) {
    warnObjectActionRouterBrake("Missing object.", { action: input.action ?? null });
    warnWorkspaceEntryPointBrake("Object panel missing object.", { action: input.action ?? null });
    return Object.freeze({
      success: false,
      mode: null,
      payload: null,
      reason: "missing_object",
    });
  }

  const normalizedAction = normalizeObjectPanelDashboardAction(input.action);
  if (!normalizedAction || !isObjectPanelDashboardAction(normalizedAction)) {
    warnObjectActionRouterBrake("Invalid action.", {
      action: input.action ?? null,
      objectId,
    });
    warnWorkspaceEntryPointBrake("Object panel invalid action.", {
      action: input.action ?? null,
      objectId,
    });
    return Object.freeze({
      success: false,
      mode: null,
      payload: null,
      reason: "invalid_action",
    });
  }

  const launch = requestWorkspaceLaunch({
    source: "object_panel",
    objectPanelAction: normalizedAction,
    objectId,
    objectName: typeof input.objectName === "string" ? input.objectName : objectId,
  });

  if (!launch.approved || !launch.dashboardMode) {
    return Object.freeze({
      success: false,
      mode: null,
      payload: null,
      reason: launch.reason,
    });
  }

  const mode = normalizeDashboardMode(launch.dashboardMode, { warn: false });
  const payload = buildObjectPanelActionPayload({
    action: normalizedAction,
    objectId,
    objectName: typeof input.objectName === "string" ? input.objectName : objectId,
    timestamp: input.timestamp,
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.debug?.("[ObjectActionRouter][Route]", {
      action: payload.action,
      objectId: payload.objectId,
      objectName: payload.objectName,
      mode,
      source: "requestWorkspaceLaunch",
    });
  }

  return Object.freeze({
    success: true,
    mode,
    payload,
    reason: "object_panel_to_dashboard_mode",
  });
}

export function buildDashboardModeActionFromRoute(
  result: ObjectPanelActionRouteResult
): {
  mode: DashboardMode;
  routeObject: Pick<ObjectPanelActionPayload, "objectId" | "objectName">;
} | null {
  if (!result.success || !result.mode || !result.payload) {
    warnObjectActionRouterBrake("Failed route.", {
      reason: result.reason,
    });
    return null;
  }
  return {
    mode: result.mode,
    routeObject: {
      objectId: result.payload.objectId,
      objectName: result.payload.objectName,
    },
  };
}
