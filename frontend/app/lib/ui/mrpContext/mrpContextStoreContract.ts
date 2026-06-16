/**
 * MRP:3:2 — Unified MRP Context Store contract.
 *
 * Section B (Context Header) reads from this store.
 * Panel Name, Active Mode, and Selected Object must never be undefined at runtime.
 */

import type { DashboardContext } from "../mainRightPanelContract.ts";
import type { DashboardMode } from "../../dashboard/dashboardModeRuntimeContract.ts";
import type { MainRightPanelTab } from "../mainRightPanelContract.ts";
import type { AnalyzeWorkspaceContextView } from "../../dashboard/analyze/analyzeModeContract.ts";
import type { CompareWorkspaceContextView } from "../../dashboard/compare/compareModeContract.ts";
import type { FocusModeContextView } from "../../dashboard/focus/focusModeContract.ts";
import type { ScenarioWorkspaceContextView } from "../../dashboard/scenario/scenarioModeContract.ts";
import type { WarRoomWorkspaceContextView } from "../../dashboard/warRoom/warRoomModeContract.ts";

export const MRP_CONTEXT_STORE_VERSION = "3.2.0";

export const MRP_CONTEXT_SYNC_TAG = "[MRP_CONTEXT_SYNC]" as const;
export const MRP_CONTEXT_GUARD_TAG = "[MRP_CONTEXT_GUARD]" as const;

export const DEFAULT_MRP_PANEL_NAME = "Insight Home";
export const DEFAULT_MRP_ACTIVE_MODE = "Executive Summary";
export const DEFAULT_MRP_SELECTED_OBJECT = "No object selected";
export const DEFAULT_MRP_BACK_LABEL = "← Back";

export type MrpContextHeaderView = Readonly<{
  panelName: string;
  activeMode: string;
  selectedObject: string;
  backLabel: string;
  showBackNavigation: boolean;
  revision: number;
  source: "mrp_context_store";
}>;

export type MrpContextStoreSnapshot = Readonly<{
  header: MrpContextHeaderView;
  activeTab: MainRightPanelTab;
  dashboardMode: DashboardMode;
  dashboardContext: DashboardContext;
  selectedObjectId: string | null;
  revision: number;
  signature: string;
}>;

export type MrpContextResolverInput = Readonly<{
  activeTab: MainRightPanelTab;
  dashboardMode: DashboardMode;
  dashboardContext: DashboardContext;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
  subWorkspaceMode?: string | null;
  navigationBackStackDepth?: number;
  focusContext?: FocusModeContextView | null;
  analyzeContext?: AnalyzeWorkspaceContextView | null;
  compareContext?: CompareWorkspaceContextView | null;
  scenarioContext?: ScenarioWorkspaceContextView | null;
  warRoomContext?: WarRoomWorkspaceContextView | null;
}>;

export type MrpContextPublishResult = Readonly<{
  changed: boolean;
  header: MrpContextHeaderView;
  revision: number;
  guarded: boolean;
  guardReason?: string;
}>;
