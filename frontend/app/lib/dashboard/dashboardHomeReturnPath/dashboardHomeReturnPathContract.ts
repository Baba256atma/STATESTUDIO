/**
 * MRP:10:11 — Dashboard Home overview return path contract.
 *
 * Approved navigation back to the executive landing surface (overview mode).
 */

import type { NexoraWorkspaceAction } from "../../workspace/nexoraWorkspaceStateContract.ts";
import { DEFAULT_DASHBOARD_MODE } from "../dashboardModeRuntimeContract.ts";

export const DASHBOARD_HOME_RETURN_ACTION_LABEL = "Dashboard Home" as const;

export const DASHBOARD_HOME_RETURN_ROUTE_SOURCE = "dashboard_home_return" as const;

export type DashboardHomeReturnRequest = Readonly<{
  objectId?: string | null;
  objectName?: string | null;
}>;

/** Canonical workspace action — dispatches through NexoraWorkspaceState.setDashboardMode. */
export function buildDashboardHomeReturnAction(
  input: DashboardHomeReturnRequest = {}
): NexoraWorkspaceAction {
  const objectId = typeof input.objectId === "string" ? input.objectId.trim() : "";
  const objectName =
    (typeof input.objectName === "string" && input.objectName.trim()) || objectId || "";

  return Object.freeze({
    type: "setDashboardMode",
    mode: DEFAULT_DASHBOARD_MODE,
    routeObject: objectId
      ? Object.freeze({ objectId, objectName: objectName || objectId })
      : undefined,
  });
}
