"use client";

import React from "react";

import type { DashboardContext } from "../mainRightPanelContract.ts";
import type { DashboardMode } from "../../dashboard/dashboardModeRuntimeContract.ts";
import type { MainRightPanelTab } from "../mainRightPanelContract.ts";
import type { AnalyzeWorkspaceContextView } from "../../dashboard/analyze/analyzeModeContract.ts";
import type { CompareWorkspaceContextView } from "../../dashboard/compare/compareModeContract.ts";
import type { FocusModeContextView } from "../../dashboard/focus/focusModeContract.ts";
import type { ScenarioWorkspaceContextView } from "../../dashboard/scenario/scenarioModeContract.ts";
import type { WarRoomWorkspaceContextView } from "../../dashboard/warRoom/warRoomModeContract.ts";
import { getMrpContextHistoryDepth } from "./mrpContextHistoryRuntime.ts";
import { recordMrpContextHistoryTransition } from "./mrpContextHistoryRuntime.ts";
import { publishMrpContextStore } from "./mrpContextStoreRuntime.ts";
import type { MrpContextResolverInput } from "./mrpContextStoreContract.ts";

export type SyncMrpContextStoreInput = Readonly<{
  activeTab: MainRightPanelTab;
  dashboardMode: DashboardMode;
  dashboardContext: DashboardContext;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
  subWorkspaceMode?: string | null;
  focusContext?: FocusModeContextView | null;
  analyzeContext?: AnalyzeWorkspaceContextView | null;
  compareContext?: CompareWorkspaceContextView | null;
  scenarioContext?: ScenarioWorkspaceContextView | null;
  warRoomContext?: WarRoomWorkspaceContextView | null;
}>;

export function buildMrpContextResolverInput(
  input: SyncMrpContextStoreInput
): MrpContextResolverInput {
  return Object.freeze({
    activeTab: input.activeTab,
    dashboardMode: input.dashboardMode,
    dashboardContext: input.dashboardContext,
    selectedObjectId: input.selectedObjectId ?? null,
    selectedObjectLabel: input.selectedObjectLabel ?? null,
    routeObjectId: input.routeObjectId ?? null,
    routeObjectName: input.routeObjectName ?? null,
    subWorkspaceMode: input.subWorkspaceMode ?? null,
    navigationBackStackDepth: getMrpContextHistoryDepth(),
    focusContext: input.focusContext ?? null,
    analyzeContext: input.analyzeContext ?? null,
    compareContext: input.compareContext ?? null,
    scenarioContext: input.scenarioContext ?? null,
    warRoomContext: input.warRoomContext ?? null,
  });
}

export function useSyncMrpContextStore(input: SyncMrpContextStoreInput): void {
  React.useEffect(() => {
    const resolverInput = buildMrpContextResolverInput(input);
    recordMrpContextHistoryTransition(resolverInput);
    publishMrpContextStore(resolverInput);
  }, [
    input.activeTab,
    input.dashboardMode,
    input.dashboardContext,
    input.selectedObjectId,
    input.selectedObjectLabel,
    input.routeObjectId,
    input.routeObjectName,
    input.subWorkspaceMode,
    input.focusContext,
    input.analyzeContext,
    input.compareContext,
    input.scenarioContext,
    input.warRoomContext,
  ]);
}

export default useSyncMrpContextStore;
