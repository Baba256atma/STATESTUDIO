import { resolveDashboardSurfaceForObjectSelection } from "../dashboard/dashboardContextBridge.ts";
import type { DashboardContext } from "../ui/mainRightPanelContract.ts";
import type { DashboardSurfaceId } from "../dashboard/dashboardSurfaceRegistry.ts";
import { publishObjectClickSelectionContext } from "./objectClickSelectionContextCache.ts";
import { traceObjectClickDashboardCommitBlocked } from "./objectClickDashboardCommitGuard.ts";

export type { MrpSelectedObjectContext } from "./mrpSelectedObjectBridgeContract.ts";
export {
  buildMrpSelectedObjectContext,
  shouldCommitMrpSelectedObjectContext,
  shouldPublishMrpSelectedObjectContext,
} from "./mrpSelectedObjectBridgeContract.ts";

export type PublishedMrpSelectedObjectFromClick = Readonly<{
  surfaceId: DashboardSurfaceId;
  dashboardContext: DashboardContext;
  selectedObjectId: string;
}>;

export function publishMrpSelectedObjectFromClick(input: {
  objectId: string;
  eventId: string;
  objectName?: string | null;
  objectType?: string | null;
  workspaceId?: string | null;
  priorContext?: DashboardContext | null;
}): PublishedMrpSelectedObjectFromClick {
  const resolved = resolveDashboardSurfaceForObjectSelection({
    objectId: input.objectId,
    reason: `object_click:${input.eventId}`,
    priorContext: input.priorContext ?? null,
  });

  traceObjectClickDashboardCommitBlocked({
    source: "object_click",
    intent: "object_selected",
    reason: `object_click:${input.eventId}`,
    selectedObjectId: input.objectId,
    workspaceId: input.workspaceId ?? null,
    surfaceId: resolved.surfaceId,
  });

  publishObjectClickSelectionContext({
    selectedObjectId: input.objectId,
    selectedObjectName: input.objectName ?? input.objectId,
    selectedObjectType: input.objectType ?? null,
    selectedWorkspaceId: input.workspaceId ?? null,
    dashboardContext: resolved.dashboardContext,
    surfaceId: resolved.surfaceId,
    eventId: input.eventId,
  });

  return Object.freeze({
    surfaceId: resolved.surfaceId,
    dashboardContext: resolved.dashboardContext,
    selectedObjectId: input.objectId,
  });
}

/** @deprecated Object click must not commit dashboard context. Use publishMrpSelectedObjectFromClick. */
export function commitMrpSelectedObjectFromClick(
  _dispatch: unknown,
  input: {
    objectId: string;
    eventId: string;
    priorContext?: DashboardContext | null;
    objectName?: string | null;
    objectType?: string | null;
    workspaceId?: string | null;
  }
): PublishedMrpSelectedObjectFromClick {
  return publishMrpSelectedObjectFromClick(input);
}
