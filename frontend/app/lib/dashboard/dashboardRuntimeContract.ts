/**
 * Nexora Type-C Dashboard Runtime Contract.
 * Canonical owner: NexoraWorkspaceState.dashboardMode via DashboardRuntimePanel + legacy mirror dashboardContext.
 */

import type { DashboardContext } from "../ui/mainRightPanelContract.ts";
import type { DashboardSurfaceId } from "./dashboardSurfaceRegistry.ts";

export const CANONICAL_DASHBOARD_RUNTIME_OWNER = "NexoraWorkspaceState.dashboardMode";
export const CANONICAL_DASHBOARD_LEGACY_CONTEXT_MIRROR = "NexoraWorkspaceState.dashboardContext";
export const CANONICAL_DASHBOARD_RENDER_PATH =
  "Source → DashboardContextRouter → RightPanelHost → DashboardRuntimeContainer → DashboardAccordionSystem → DashboardSurface";

export type DashboardRuntimePhase =
  | "init"
  | "context_update"
  | "surface_resolve"
  | "surface_render"
  | "lifecycle_mount"
  | "lifecycle_unmount";

export type DashboardRuntimeContract = Readonly<{
  version: string;
  owner: typeof CANONICAL_DASHBOARD_RUNTIME_OWNER;
  renderPath: typeof CANONICAL_DASHBOARD_RENDER_PATH;
  allowedContexts: readonly DashboardContext[];
  prohibitedOwners: readonly string[];
}>;

export const DASHBOARD_RUNTIME_CONTRACT: DashboardRuntimeContract = Object.freeze({
  version: "4.1.0",
  owner: CANONICAL_DASHBOARD_RUNTIME_OWNER,
  renderPath: CANONICAL_DASHBOARD_RENDER_PATH,
  allowedContexts: Object.freeze([
    "overview",
    "sources",
    "scenario",
    "risk",
    "war_room",
    "timeline",
    "settings",
  ] as const),
  prohibitedOwners: Object.freeze([
    "rightPanelState.view",
    "rightPanelRouter",
    "inspectorContext",
    "activeExecutiveView",
    "parallel_dashboard_host",
  ]),
});

export type DashboardRuntimeContextUpdate = Readonly<{
  dashboardContext: DashboardContext;
  surfaceId: DashboardSurfaceId;
  source: string;
  reason: string;
}>;

const competingOwnerWarnings = new Set<string>();

export function validateDashboardRuntimeOwner(candidate: string, source: string): boolean {
  if (candidate === CANONICAL_DASHBOARD_RUNTIME_OWNER) return true;
  const key = `${candidate}:${source}`;
  if (competingOwnerWarnings.has(key)) return false;
  competingOwnerWarnings.add(key);
  return false;
}

export function isCanonicalDashboardRenderPath(path: string): boolean {
  return path === CANONICAL_DASHBOARD_RENDER_PATH;
}

export function resetDashboardRuntimeContractForTests(): void {
  competingOwnerWarnings.clear();
}
