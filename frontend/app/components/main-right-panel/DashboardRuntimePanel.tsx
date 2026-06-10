"use client";

import type React from "react";
import { useEffect } from "react";

import { AnalyzeWorkspaceShell } from "../dashboard/analyze/AnalyzeWorkspaceShell";
import { CompareWorkspaceShell } from "../dashboard/compare/CompareWorkspaceShell";
import { FocusModeSurface } from "../dashboard/focus/FocusModeSurface";
import { ScenarioWorkspaceShell } from "../dashboard/scenario/ScenarioWorkspaceShell";
import { WarRoomWorkspaceShell } from "../dashboard/warRoom/WarRoomWorkspaceShell";
import { ExecutiveDashboardHomeSurface } from "../dashboard/ExecutiveDashboardHomeSurface";
import { ExecutiveWorkspaceOverview } from "../dashboard/ExecutiveWorkspaceOverview";
import { DedicatedDashboardModeHeader } from "../dashboard/DedicatedDashboardModeHeader";
import {
  resolveDashboardRuntimeState,
  type DashboardMode,
} from "../../lib/dashboard/dashboardModeRuntimeContract";
import { isDedicatedExecutiveWorkspaceMode } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import type { WorkspaceRecommendationContext } from "../../lib/workspaces/workspaceRecommendationContract";
import type { WorkspaceRecentsContextInput } from "../../lib/workspaces/workspaceRecentsContract";
import type { WorkspaceRecentReturnKind } from "../../lib/workspaces/workspaceRecentsContract";
import type { AnalyzeWorkspaceContextView } from "../../lib/dashboard/analyze/analyzeModeContract";
import type { CompareWorkspaceContextView } from "../../lib/dashboard/compare/compareModeContract";
import type { FocusModeContextView } from "../../lib/dashboard/focus/focusModeContract";
import type { ScenarioWorkspaceContextView } from "../../lib/dashboard/scenario/scenarioModeContract";
import type { WarRoomWorkspaceContextView } from "../../lib/dashboard/warRoom/warRoomModeContract";
import {
  shouldSuppressLegacyDashboardHost,
  traceMrp10Runtime,
  logMrp10RuntimeRenderChain,
} from "../../lib/dashboard/dashboardHomeReturnPath/dashboardHomeRuntimeTrace";

export type DashboardRuntimePanelProps = {
  mode: DashboardMode;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
  focusContext?: FocusModeContextView | null;
  analyzeContext?: AnalyzeWorkspaceContextView | null;
  compareContext?: CompareWorkspaceContextView | null;
  scenarioContext?: ScenarioWorkspaceContextView | null;
  warRoomContext?: WarRoomWorkspaceContextView | null;
  legacyHost?: React.ReactNode;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  onWorkspaceLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
  recommendationContext?: WorkspaceRecommendationContext;
  recentsContext?: WorkspaceRecentsContextInput;
  onRecentReturn?: (input: {
    workspaceId: ExecutiveWorkspaceId;
    returnKind: WorkspaceRecentReturnKind;
  }) => void;
  onReturnToDashboardHome?: () => void;
};

export function DashboardRuntimePanel(props: DashboardRuntimePanelProps): React.ReactElement {
  const runtime = resolveDashboardRuntimeState({ dashboardMode: props.mode });
  const isHomeMode = runtime.mode === "overview";
  const isFocusMode = runtime.mode === "focus";
  const isAnalyzeMode = runtime.mode === "analyze";
  const isCompareMode = runtime.mode === "compare";
  const isScenarioMode = runtime.mode === "scenario";
  const isWarRoomMode = runtime.mode === "war_room";
  const isDedicatedMode = isDedicatedExecutiveWorkspaceMode(runtime.mode);

  const selectedObjectId = props.selectedObjectId ?? props.routeObjectId ?? null;
  const selectedObjectLabel = props.selectedObjectLabel ?? props.routeObjectName ?? null;

  const overviewProps = {
    activeWorkspaceId: props.activeWorkspaceId ?? null,
    selectedObjectId,
    selectedObjectLabel,
    selectedObjectType: props.selectedObjectType ?? null,
    selectedObjectStatus: props.selectedObjectStatus ?? null,
    onWorkspaceLaunch: props.onWorkspaceLaunch,
    recommendationContext: props.recommendationContext,
    recentsContext: props.recentsContext,
    onRecentReturn: props.onRecentReturn,
  };

  const suppressLegacyHost = shouldSuppressLegacyDashboardHost(runtime.mode);

  useEffect(() => {
    traceMrp10Runtime("DashboardRuntimePanel mounted", {
      activeTab: "dashboard",
      dashboardMode: runtime.mode,
      rendering: isHomeMode
        ? "ExecutiveDashboardHomeSurface"
        : isDedicatedMode
          ? "DedicatedDashboardModeHeader"
          : "DashboardRuntimePanel",
      mode: runtime.mode,
      isHomeMode,
      isDedicatedMode,
      suppressLegacyHost,
      hasLegacyHost: Boolean(props.legacyHost),
    });
    logMrp10RuntimeRenderChain({
      activeTab: "dashboard",
      dashboardMode: runtime.mode,
      rendering: isHomeMode
        ? "ExecutiveDashboardHomeSurface"
        : isDedicatedMode
          ? "DedicatedDashboardModeHeader"
          : "DashboardRuntimePanel",
    });
    if (suppressLegacyHost && props.legacyHost) {
      traceMrp10Runtime("legacyDashboardHost suppressed", {
        dashboardMode: runtime.mode,
        rendering: isHomeMode ? "ExecutiveDashboardHomeSurface" : "DedicatedDashboardModeHeader",
      });
    }
  }, [runtime.mode, isHomeMode, isDedicatedMode, suppressLegacyHost, props.legacyHost]);

  return (
    <div
      data-nx="dashboard-runtime-panel"
      data-nx-dashboard-mode={runtime.mode}
      data-nx-dashboard-route-object-id={props.routeObjectId ?? undefined}
      style={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {isHomeMode ? (
        <ExecutiveDashboardHomeSurface
          dashboardMode={runtime.mode}
          {...overviewProps}
        />
      ) : (
        <>
          <DedicatedDashboardModeHeader
            mode={runtime.mode}
            onReturnToDashboardHome={props.onReturnToDashboardHome}
          />
          <div
            style={{
              flex: 1,
              minHeight: 0,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <ExecutiveWorkspaceOverview {...overviewProps} />

            {isFocusMode ? (
              <FocusModeSurface context={props.focusContext ?? null} />
            ) : isAnalyzeMode ? (
              <AnalyzeWorkspaceShell context={props.analyzeContext ?? null} />
            ) : isCompareMode ? (
              <CompareWorkspaceShell context={props.compareContext ?? null} />
            ) : isScenarioMode ? (
              <ScenarioWorkspaceShell context={props.scenarioContext ?? null} />
            ) : isWarRoomMode ? (
              <WarRoomWorkspaceShell context={props.warRoomContext ?? null} />
            ) : null}
          </div>
        </>
      )}

      {!suppressLegacyHost && props.legacyHost ? (
        <div
          data-nx="dashboard-runtime-legacy-host"
          style={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {props.legacyHost}
        </div>
      ) : null}
    </div>
  );
}

export default DashboardRuntimePanel;
