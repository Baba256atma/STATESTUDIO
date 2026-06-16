/**
 * MRP:3:4 — Dynamic Workspace Loader contract.
 *
 * Section C mount authority for Insight tab workspaces.
 * Loader architecture only — no intelligence, charts, or business logic.
 */

import type { DashboardContext } from "../mainRightPanelContract.ts";
import type { DashboardMode } from "../../dashboard/dashboardModeRuntimeContract.ts";

export const MRP_WORKSPACE_LOADER_VERSION = "3.4.0";

export const MRP_WORKSPACE_LOADER_TAG = "[MRP_WORKSPACE_LOADER]" as const;
export const MRP_DYNAMIC_RENDER_ZONE_TAG = "[MRP_DYNAMIC_RENDER_ZONE]" as const;
export const MRP_LOADER_RUNTIME_RECOVERED_TAG = "[MRP_LOADER_RUNTIME_RECOVERED]" as const;
export const MRP_BUILD_RECOVERED_TAG = "[MRP_BUILD_RECOVERED]" as const;
export const MRP_PHASE4B_UNBLOCKED_TAG = "[MRP_PHASE4B_UNBLOCKED]" as const;
export const MRP_CERTIFIED_WORKSPACE_RENDERER_CONNECTED_TAG =
  "[MRP_CERTIFIED_WORKSPACE_RENDERER_CONNECTED]" as const;
export const MRP_PHASE4_RUNTIME_CERTIFIED_TAG = "[MRP_PHASE4_RUNTIME_CERTIFIED]" as const;
export const MRP_EXECUTIVE_INTELLIGENCE_LAYER_COMPLETE_TAG =
  "[MRP_EXECUTIVE_INTELLIGENCE_LAYER_COMPLETE]" as const;

export const MRP_WORKSPACE_REGISTRY_MAX_ACTIVE_MOUNTS = 1;

export type MrpWorkspaceId =
  | "executive_summary"
  | "operational"
  | "risk"
  | "timeline"
  | "compare"
  | "scenario"
  | "war_room"
  | "advisory"
  | "governance";

export type MrpWorkspaceLoaderStatus = "loader_ready" | "placeholder" | "delegated" | "foundation";

export type MrpWorkspaceMountTarget =
  | "loader_shell"
  | "dashboard_runtime"
  | "executive_summary_workspace"
  | "operational_workspace"
  | "risk_workspace"
  | "timeline_workspace"
  | "scenario_workspace"
  | "war_room_workspace"
  | "advisory_workspace"
  | "governance_workspace";

export type MrpWorkspaceRegistryEntry = Readonly<{
  id: MrpWorkspaceId;
  title: string;
  description: string;
  loaderStatus: MrpWorkspaceLoaderStatus;
  mountTarget: MrpWorkspaceMountTarget;
}>;

export type MrpWorkspaceResolveInput = Readonly<{
  dashboardMode: DashboardMode;
  dashboardContext: DashboardContext;
  subWorkspaceMode?: string | null;
}>;

export type MrpWorkspaceMountPlan = Readonly<{
  workspaceId: MrpWorkspaceId;
  mountTarget: MrpWorkspaceMountTarget;
  mountKey: string;
  title: string;
}>;

export type MrpWorkspaceMountRecord = Readonly<{
  workspaceId: MrpWorkspaceId;
  mountKey: string;
  mountGeneration: number;
  mountedAt: number;
}>;

export type MrpWorkspaceLoaderSnapshot = Readonly<{
  activeMount: MrpWorkspaceMountRecord | null;
  activeMountCount: number;
  mountGeneration: number;
  lastMountKey: string | null;
  lastUnmountKey: string | null;
}>;

export type MrpWorkspaceMountLifecycleResult = Readonly<{
  mounted: boolean;
  unmountedPrevious: boolean;
  duplicatePrevented: boolean;
  workspaceId: MrpWorkspaceId;
  mountKey: string;
}>;
