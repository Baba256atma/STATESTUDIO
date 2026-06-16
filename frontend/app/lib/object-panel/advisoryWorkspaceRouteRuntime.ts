/**
 * MRP Advisory Routing Hotfix — certified advisory workspace route (no legacy advice surface).
 */

import { commitDashboardContextUpdate } from "../dashboard/dashboardContextBridge.ts";
import { commitExecutiveWorkspaceTransition } from "../dashboard/executiveWorkspaceTransitionControllerRuntime.ts";
import type { DashboardContextCommitSource } from "../dashboard/dashboardContextTypes.ts";
import type { NexoraWorkspaceAction } from "../workspace/nexoraWorkspaceStateContract.ts";
import type {
  DashboardContextRouteType,
  WorkspaceCompletionStatus,
} from "../assistant-bridge/assistantContextSyncContract.ts";
import {
  ADVISORY_DASHBOARD_CONTEXT,
  ADVISORY_LEGACY_SURFACE_REMOVED_TAG,
  ADVISORY_SUB_WORKSPACE_MODE,
} from "./advisoryWorkspaceRouteContract.ts";

export {
  ADVISORY_DASHBOARD_CONTEXT,
  ADVISORY_DASHBOARDMODE_FIXED_TAG,
  ADVISORY_LEGACY_SURFACE_REMOVED_TAG,
  ADVISORY_SUB_WORKSPACE_MODE,
} from "./advisoryWorkspaceRouteContract.ts";

export type AdvisoryWorkspaceRouteInput = Readonly<{
  objectId?: string | null;
  objectName?: string | null;
  source?: DashboardContextCommitSource;
  reason?: string;
}>;

export function commitAdvisoryWorkspaceRoute(
  dispatch: (action: NexoraWorkspaceAction) => void,
  input: AdvisoryWorkspaceRouteInput = {}
): boolean {
  const objectId = typeof input.objectId === "string" ? input.objectId.trim() : "";
  const objectName =
    (typeof input.objectName === "string" && input.objectName.trim()) || objectId || "";
  const routeObject =
    objectId.length > 0
      ? Object.freeze({
          objectId,
          objectName: objectName || objectId,
        })
      : undefined;

  dispatch({
    type: "setDashboardMode",
    mode: "advisory",
    routeObject,
  });
  dispatch({ type: "setMRPTab", tab: "dashboard" });

  commitDashboardContextUpdate(dispatch, {
    dashboardContext: ADVISORY_DASHBOARD_CONTEXT,
    source: input.source ?? "object_panel",
    reason: input.reason ?? "advisory_workspace_route",
    selectedObjectId: objectId || null,
  });

  const commitResult = commitExecutiveWorkspaceTransition("advisory");
  return commitResult.approved;
}

export function resolveAdvisoryRouteTelemetry(input: AdvisoryWorkspaceRouteInput = {}): Readonly<{
  tag: typeof ADVISORY_LEGACY_SURFACE_REMOVED_TAG;
  workspaceId: "advisory";
  dashboardContext: typeof ADVISORY_DASHBOARD_CONTEXT;
  subWorkspaceMode: typeof ADVISORY_SUB_WORKSPACE_MODE;
  objectId: string | null;
}> {
  const objectId = typeof input.objectId === "string" ? input.objectId.trim() : "";
  return Object.freeze({
    tag: ADVISORY_LEGACY_SURFACE_REMOVED_TAG,
    workspaceId: "advisory",
    dashboardContext: ADVISORY_DASHBOARD_CONTEXT,
    subWorkspaceMode: ADVISORY_SUB_WORKSPACE_MODE,
    objectId: objectId || null,
  });
}

export function defaultAdvisoryRouteSummaryOptions(): Readonly<{
  routeType: DashboardContextRouteType;
  completionStatus: WorkspaceCompletionStatus;
}> {
  return Object.freeze({
    routeType: "object_panel",
    completionStatus: "active",
  });
}
