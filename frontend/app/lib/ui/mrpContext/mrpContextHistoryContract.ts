/**
 * MRP:3:3 — MRP Context History + Back Navigation contract.
 */

import type { DashboardContext } from "../mainRightPanelContract.ts";
import type { DashboardMode } from "../../dashboard/dashboardModeRuntimeContract.ts";
import type { MainRightPanelTab } from "../mainRightPanelContract.ts";

export const MRP_CONTEXT_HISTORY_VERSION = "3.3.0";
export const MRP_CONTEXT_HISTORY_MAX_DEPTH = 50;

export const MRP_HISTORY_RUNTIME_TAG = "[MRP_HISTORY_RUNTIME]" as const;
export const MRP_BACK_NAVIGATION_TAG = "[MRP_BACK_NAVIGATION]" as const;

export type MrpContextTransitionType = "panel" | "workspace" | "sub_workspace";

export type MrpContextHistoryEntry = Readonly<{
  transitionType: MrpContextTransitionType;
  signature: string;
  activeTab: MainRightPanelTab;
  dashboardMode: DashboardMode;
  dashboardContext: DashboardContext;
  subWorkspaceMode: string | null;
  selectedObjectId: string | null;
  selectedObjectLabel: string | null;
  routeObjectId: string | null;
  routeObjectName: string | null;
  panelName: string;
  activeMode: string;
  selectedObject: string;
}>;

export type MrpContextHistorySummary = Readonly<{
  depth: number;
  maxDepth: number;
  canNavigateBack: boolean;
  currentSignature: string | null;
}>;

export type MrpContextBackNavigationResult = Readonly<{
  approved: boolean;
  entry: MrpContextHistoryEntry | null;
  reason: string;
}>;
