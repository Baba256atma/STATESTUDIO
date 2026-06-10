/**
 * Dashboard context integration bridge.
 * All commits delegate to the canonical Dashboard Context Router.
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
  warnDashboardContextBypassAttempt,
} from "./dashboardContextRouter.ts";
import type { DashboardContextCommitSource } from "./dashboardContextTypes.ts";

export type { DashboardContextCommitSource } from "./dashboardContextTypes.ts";

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
  options: { source: DashboardContextCommitSource; priorContext?: DashboardContext | null }
): DashboardSurfaceId {
  const result = routeAndCommitDashboardRouteResolution(dispatch, resolution, {
    source: options.source,
    priorContext: options.priorContext ?? null,
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
  }
): DashboardSurfaceId {
  const result = routeAndCommitDashboardContext(dispatch, {
    source: input.source,
    priorContext: input.priorContext ?? null,
    raw: {
      dashboardContext: input.dashboardContext,
      objectId: input.selectedObjectId,
      reason: input.reason,
    },
  });
  return result.surfaceId;
}

export function routeDashboardContextFromObjectSelection(
  dispatch: (action: NexoraWorkspaceAction) => void,
  input: { objectId: string; reason?: string; priorContext?: DashboardContext | null }
): DashboardSurfaceId {
  const result = routeAndCommitDashboardContext(dispatch, {
    source: "object",
    intent: "object_selected",
    priorContext: input.priorContext ?? null,
    raw: {
      objectId: input.objectId,
      dashboardContext: "sources",
      reason: input.reason ?? "object_selected",
    },
  });
  return result.surfaceId;
}

export function guardDirectDashboardContextWrite(owner: string, source: string): void {
  warnDashboardContextBypassAttempt(owner, source);
}
