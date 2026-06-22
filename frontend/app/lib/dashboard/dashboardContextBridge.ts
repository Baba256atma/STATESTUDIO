/**
 * Dashboard context integration bridge.
 * Commits delegate to the canonical Dashboard Context Router except object-click
 * selection, which is read-only toward workspace/dashboard state (NW-B:8-5).
 */

import type { DashboardContext } from "../ui/mainRightPanelContract.ts";
import { resolveNexoraLeftNavMode } from "../ui/nexoraLeftNavContract.ts";
import type { NexoraRouteResolution, RouteRequestSource } from "../routing/nexoraRoutingContract.ts";
import {
  createDefaultNexoraWorkspaceState,
  normalizeNexoraWorkspaceState,
  type NexoraWorkspaceAction,
  type NexoraWorkspaceState,
} from "../workspace/nexoraWorkspaceStateContract.ts";
import { DEFAULT_DASHBOARD_MODE } from "./dashboardModeRuntimeContract.ts";
import type { DashboardSurfaceId } from "./dashboardSurfaceRegistry.ts";
import {
  routeAndCommitDashboardContext,
  routeAndCommitDashboardRouteResolution,
  routeDashboardContext,
  warnDashboardContextBypassAttempt,
} from "./dashboardContextRouter.ts";
import type { DashboardContextCommitSource } from "./dashboardContextTypes.ts";
import {
  traceObjectClickDashboardCommitBlocked,
} from "../selection/objectClickDashboardCommitGuard.ts";

export type { DashboardContextCommitSource } from "./dashboardContextTypes.ts";

export type ObjectSelectionDashboardSurface = Readonly<{
  surfaceId: DashboardSurfaceId;
  dashboardContext: DashboardContext;
  objectId: string;
}>;

export function seedWorkspaceStateFromPreferredTab(preferredRightPanelTab: unknown): NexoraWorkspaceState {
  const leftNavMode = resolveNexoraLeftNavMode(preferredRightPanelTab, { warn: false });
  return normalizeNexoraWorkspaceState({
    ...createDefaultNexoraWorkspaceState(),
    activeLeftNavMode: leftNavMode,
    activeMRPTab: "dashboard",
    dashboardMode: DEFAULT_DASHBOARD_MODE,
    dashboardContext: "overview",
  });
}

/** @deprecated Use routeAndCommitDashboardRouteResolution directly. */
export function commitDashboardRouteResolution(
  dispatch: (action: NexoraWorkspaceAction) => void,
  resolution: NexoraRouteResolution,
  options: {
    source: DashboardContextCommitSource;
    priorContext?: DashboardContext | null;
    currentWorkspaceState?: NexoraWorkspaceState;
    workspaceId?: string | null;
  }
): DashboardSurfaceId {
  const result = routeAndCommitDashboardRouteResolution(dispatch, resolution, {
    source: options.source,
    priorContext: options.priorContext ?? null,
    currentWorkspaceState: options.currentWorkspaceState,
    workspaceId: options.workspaceId,
  });
  return result.surfaceId;
}

/** @deprecated Use routeAndCommitDashboardContext directly. */
export function commitDashboardContextUpdate(
  dispatch: (action: NexoraWorkspaceAction) => void,
  input: {
    dashboardContext: unknown;
    source: DashboardContextCommitSource;
    reason: string;
    priorContext?: DashboardContext | null;
    selectedObjectId?: string | null;
    currentWorkspaceState?: NexoraWorkspaceState;
    workspaceId?: string | null;
  }
): DashboardSurfaceId {
  const result = routeAndCommitDashboardContext(dispatch, {
    source: input.source,
    priorContext: input.priorContext ?? null,
    currentWorkspaceState: input.currentWorkspaceState,
    workspaceId: input.workspaceId,
    raw: {
      dashboardContext: input.dashboardContext,
      objectId: input.selectedObjectId,
      reason: input.reason,
    },
  });
  return result.surfaceId;
}

/** Read-only resolver for object-click dashboard surface (no workspace commit). */
export function resolveDashboardSurfaceForObjectSelection(input: {
  objectId: string;
  reason?: string;
  priorContext?: DashboardContext | null;
}): ObjectSelectionDashboardSurface {
  const routeResult = routeDashboardContext({
    source: "object",
    intent: "object_selected",
    priorContext: input.priorContext ?? null,
    raw: {
      objectId: input.objectId,
      dashboardContext: "sources",
      reason: input.reason ?? "object_selected",
    },
  });
  return Object.freeze({
    surfaceId: routeResult.surfaceId,
    dashboardContext: routeResult.normalized.dashboardContext,
    objectId: input.objectId,
  });
}

/**
 * @deprecated NW-B:8-5 — object click must not commit dashboard context.
 * Use resolveDashboardSurfaceForObjectSelection + publishMrpSelectedObjectFromClick.
 */
export function routeDashboardContextFromObjectSelection(
  dispatch: (action: NexoraWorkspaceAction) => void,
  input: { objectId: string; reason?: string; priorContext?: DashboardContext | null }
): DashboardSurfaceId {
  traceObjectClickDashboardCommitBlocked({
    source: "object",
    intent: "object_selected",
    reason: input.reason ?? "object_selected",
    selectedObjectId: input.objectId,
  });
  void dispatch;
  return resolveDashboardSurfaceForObjectSelection(input).surfaceId;
}

export function guardDirectDashboardContextWrite(owner: string, source: string): void {
  warnDashboardContextBypassAttempt(owner, source);
}
