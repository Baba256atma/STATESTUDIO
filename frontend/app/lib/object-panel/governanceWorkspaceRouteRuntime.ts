/**
 * MRP:5B:2 — Governance workspace route commit (Dashboard tab only).
 */

import { commitDashboardContextUpdate } from "../dashboard/dashboardContextBridge.ts";
import { commitExecutiveWorkspaceTransition } from "../dashboard/executiveWorkspaceTransitionControllerRuntime.ts";
import type { DashboardContextCommitSource } from "../dashboard/dashboardContextTypes.ts";
import type { NexoraWorkspaceAction } from "../workspace/nexoraWorkspaceStateContract.ts";

export const GOVERNANCE_DASHBOARD_CONTEXT = "governance" as const;
export const GOVERNANCE_RUNTIME_ROUTE_TAG = "[MRP_5B2_RUNTIME]" as const;

export type GovernanceWorkspaceRouteInput = Readonly<{
  objectId?: string | null;
  objectName?: string | null;
  source?: DashboardContextCommitSource;
  reason?: string;
}>;

export function commitGovernanceWorkspaceRoute(
  dispatch: (action: NexoraWorkspaceAction) => void,
  input: GovernanceWorkspaceRouteInput = {}
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
    mode: "governance",
    routeObject,
  });
  dispatch({ type: "setMRPTab", tab: "dashboard" });

  commitDashboardContextUpdate(dispatch, {
    dashboardContext: GOVERNANCE_DASHBOARD_CONTEXT,
    source: input.source ?? "left_nav",
    reason: input.reason ?? "governance_workspace_route",
    selectedObjectId: objectId || null,
  });

  const commitResult = commitExecutiveWorkspaceTransition("governance");
  return commitResult.approved;
}
