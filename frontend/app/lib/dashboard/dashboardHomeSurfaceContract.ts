/**
 * MRP:10:1 — Executive Dashboard Home Surface contract.
 * MRP:10:10 — MVP Approved (frozen).
 *
 * Dashboard Home is the default landing mode (overview). Read-only aggregation —
 * no duplicate navigation state.
 */

export const CANONICAL_DASHBOARD_HOME_SURFACE_OWNER = "ExecutiveDashboardHomeSurface" as const;

export const DASHBOARD_HOME_SURFACE_CONTRACT_STATUS = "MVP Approved" as const;

import type { DashboardMode } from "./dashboardModeRuntimeContract.ts";
import type { ExecutiveWorkspaceId } from "./executiveWorkspaceRegistryContract.ts";
import type { ExecutiveWorkspaceLifecycleState } from "./executiveWorkspaceLifecycleContract.ts";

export type DashboardHomeIntelligenceCard = Readonly<{
  id: string;
  label: string;
  value: string;
  detail: string;
}>;

export type DashboardHomeStatusView = Readonly<{
  dashboardMode: DashboardMode;
  dashboardModeLabel: string;
  activeWorkspaceId: ExecutiveWorkspaceId | null;
  activeWorkspaceName: string | null;
  activeWorkspaceLifecycle: ExecutiveWorkspaceLifecycleState | null;
  selectedObjectId: string | null;
  selectedObjectLabel: string | null;
  navigationCurrentWorkspaceId: ExecutiveWorkspaceId | null;
  navigationRecentPath: readonly ExecutiveWorkspaceId[];
  navigationBackStackDepth: number;
  hasSelectedObject: boolean;
  isHomeMode: boolean;
  source: "dashboard_home_surface";
}>;

export type DashboardHomeSurfaceView = Readonly<{
  status: DashboardHomeStatusView;
  intelligenceCards: readonly DashboardHomeIntelligenceCard[];
  recommendedNextAction: string | null;
  source: "dashboard_home_surface";
}>;
