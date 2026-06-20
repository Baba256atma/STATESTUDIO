"use client";

import React from "react";

import {
  logMainRightPanelTabChange,
  warnMainRightPanelStateBrake,
  type MainRightPanelTab,
} from "../../lib/ui/mainRightPanelStateContract";
import type { DashboardContext } from "../../lib/ui/mainRightPanelContract";
import type { DashboardMode } from "../../lib/dashboard/dashboardModeRuntimeContract";
import type { SceneJson } from "../../lib/sceneTypes";
import { dashboardModeLabel } from "../../lib/dashboard/dashboardModeRuntimeContract";
import type { AnalyzeWorkspaceContextView } from "../../lib/dashboard/analyze/analyzeModeContract";
import type { CompareWorkspaceContextView } from "../../lib/dashboard/compare/compareModeContract";
import type { FocusModeContextView } from "../../lib/dashboard/focus/focusModeContract";
import type { ScenarioWorkspaceContextView } from "../../lib/dashboard/scenario/scenarioModeContract";
import type { WarRoomWorkspaceContextView } from "../../lib/dashboard/warRoom/warRoomModeContract";
import type { ExecutiveWorkspaceId } from "../../lib/dashboard/executiveWorkspaceRegistryContract";
import { resolveWorkspaceIdFromDashboardMode } from "../../lib/dashboard/executiveWorkspaceLifecycleContract";
import type { WorkspaceRecentsContextInput } from "../../lib/workspaces/workspaceRecentsContract";
import type { WorkspaceRecentReturnKind } from "../../lib/workspaces/workspaceRecentsContract";
import type { WorkspaceRecommendationContext } from "../../lib/workspaces/workspaceRecommendationContract";
import type { AssistantActionCardContext } from "../../lib/assistant-bridge/assistantActionCardContract";
import { MAIN_RIGHT_PANEL_TABS } from "../../lib/ui/mainRightPanelContract";
import { logMainRightPanelRuntime } from "../../lib/ui/mainRightPanelRuntimeEnforcement";
import { traceMrp10Runtime, logMrp10RuntimeRenderChain } from "../../lib/dashboard/dashboardHomeReturnPath/dashboardHomeRuntimeTrace";
import { nx } from "../ui/nexoraTheme";
import {
  traceMrpCleanHeader,
  traceMrpCollapseControlMounted,
  traceMrpCollapseControlRelocatedToHeader,
  traceMrpDuplicateCollapseControlsRemoved,
  traceMrpTabRenameDashboardToInsight,
  traceMrpTabsMounted,
} from "../../lib/ui/mrpShellDiagnostics";
import { mrpTabButtonStyle, traceNexoraMRPTabs } from "../../lib/ui/mainRightPanelDesignTokens";
import {
  mrpHeaderCollapseButtonStyle,
  mrpHeaderShellStyle,
  mrpHeaderTabRowStyle,
  traceNexoraMRPHeader,
} from "../../lib/ui/mainRightPanelHeaderContract";
import { useSyncMrpContextStore } from "../../lib/ui/mrpContext/useSyncMrpContextStore.ts";
import { DashboardRuntimePanel } from "./DashboardRuntimePanel";
import { MrpDynamicWorkspaceZone } from "./MrpDynamicWorkspaceZone";
import { MainRightPanelAssistantPlaceholder } from "./MainRightPanelAssistantPlaceholder";
import { MainRightPanelContextHeader } from "./MainRightPanelContextHeader";
import { MrpChatFirstAssistantSurface } from "./MrpChatFirstAssistantSurface";
import type { ExecutiveAssistantActionCard } from "../../lib/ui/executiveAssistantPanelTypes";
import type { EmptyWorkspaceState } from "../../lib/workspace/emptyWorkspaceContract";
import type { WorkspaceDomainSelection } from "../../lib/workspace/workspaceDomainContract";
import type { WorkspaceSituationContext } from "../../lib/workspace/workspaceSituationContract";
import type { WorkspaceGoal } from "../../lib/workspace/workspaceGoalContract";
import type { WorkspaceDraftModel } from "../../lib/workspace/workspaceDraftModelContract";
import type { WorkspaceModel, WorkspaceObject } from "../../lib/workspace/workspaceApprovedModelContract";

export type MainRightPanelShellProps = {
  activeTab: MainRightPanelTab;
  dashboardMode: DashboardMode;
  dashboardContext: DashboardContext;
  subWorkspaceMode?: string | null;
  dashboardRouteObjectId?: string | null;
  dashboardRouteObjectName?: string | null;
  focusContext?: FocusModeContextView | null;
  analyzeContext?: AnalyzeWorkspaceContextView | null;
  compareContext?: CompareWorkspaceContextView | null;
  scenarioContext?: ScenarioWorkspaceContextView | null;
  warRoomContext?: WarRoomWorkspaceContextView | null;
  assistantActionCardContext: AssistantActionCardContext;
  onTabChange: (tab: MainRightPanelTab) => void;
  onWorkspaceLaunch?: (workspaceId: ExecutiveWorkspaceId) => void;
  launcherSelectedObjectId?: string | null;
  launcherSelectedObjectLabel?: string | null;
  launcherSelectedObjectType?: string | null;
  launcherSelectedObjectStatus?: string | null;
  /** Read-only scene snapshot for MRP workspace metrics (Risk). No scene writes. */
  workspaceSceneJson?: SceneJson | null;
  recommendationContext?: WorkspaceRecommendationContext;
  recentsContext?: WorkspaceRecentsContextInput;
  onRecentReturn?: (input: {
    workspaceId: ExecutiveWorkspaceId;
    returnKind: WorkspaceRecentReturnKind;
  }) => void;
  onReturnToDashboardHome?: () => void;
  onMrpContextBack?: () => void;
  /** Legacy RightPanelHost — isolated to Dashboard runtime legacy host slot. */
  legacyDashboardHost?: React.ReactNode;
  /** Type-C: assistant tab uses integrated executive stack hosts instead of placeholder. */
  useIntegratedAssistantStack?: boolean;
  showAssistantScenarioHost?: boolean;
  showAssistantComparisonHost?: boolean;
  assistantContextSummary?: string | null;
  assistantGovernanceSummary?: string | null;
  assistantAnalyticsSummary?: string | null;
  assistantQuestionSuggestions?: readonly string[];
  assistantQuestionsLoading?: boolean;
  onAssistantQuestionSelect?: (question: string) => void;
  assistantRecommendedActions?: readonly ExecutiveAssistantActionCard[];
  onAssistantActionSelect?: (action: ExecutiveAssistantActionCard) => void;
  assistantThemeMode?: "day" | "night";
  emptyWorkspaceState?: EmptyWorkspaceState | null;
  workspaceDomainSelection?: WorkspaceDomainSelection | null;
  workspaceSituation?: WorkspaceSituationContext | null;
  workspaceGoals?: readonly WorkspaceGoal[];
  workspaceDraftModel?: WorkspaceDraftModel | null;
  workspaceModel?: WorkspaceModel | null;
  workspaceObjects?: readonly WorkspaceObject[];
  workspaceSceneCreated?: boolean;
  /** MRP:12:2 — collapsed rail preserves tab + dashboard mode in parent state. */
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

const TAB_LABELS: Record<MainRightPanelTab, string> = {
  dashboard: "Insight",
  assistant: "Assistant",
};

function resolveActiveWorkspaceIdFromMode(mode: DashboardMode): ExecutiveWorkspaceId | null {
  return resolveWorkspaceIdFromDashboardMode(mode);
}

const collapseButtonStyle: React.CSSProperties = mrpHeaderCollapseButtonStyle({
  border: nx.border,
  background: nx.btnSecondaryBg,
  color: nx.textSoft,
});

function MainRightPanelShellComponent(props: MainRightPanelShellProps): React.ReactElement {
  const activeTab = props.activeTab;
  const collapsed = props.collapsed === true;
  const previousTabRef = React.useRef<MainRightPanelTab>(activeTab);
  const lastRuntimeTraceSignatureRef = React.useRef<string | null>(null);
  const isDedicatedDashboardMode = props.dashboardMode !== "overview";

  React.useEffect(() => {
    traceMrpCleanHeader();
    traceMrpTabsMounted();
    traceMrpTabRenameDashboardToInsight();
    traceMrpCollapseControlRelocatedToHeader();
    traceMrpDuplicateCollapseControlsRemoved();
    traceMrpCollapseControlMounted();
    traceNexoraMRPTabs();
    traceNexoraMRPHeader();
    traceMrp10Runtime("MainRightPanelShell mounted");
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("nexora:executive-assistant-collapsed-changed", {
        detail: { collapsed },
      })
    );
  }, [collapsed]);

  const handleToggleCollapse = React.useCallback(() => {
    props.onToggleCollapse?.();
  }, [props.onToggleCollapse]);

  React.useEffect(() => {
    const runtimeTraceSignature = JSON.stringify({
      activeTab,
      dashboardMode: props.dashboardMode,
      rendering: activeTab === "dashboard" ? "DashboardRuntimePanel" : "MainRightPanelAssistantPlaceholder",
    });
    if (lastRuntimeTraceSignatureRef.current === runtimeTraceSignature) return;
    lastRuntimeTraceSignatureRef.current = runtimeTraceSignature;
    logMainRightPanelRuntime({ owner: "MainRightPanelShell", activeTab, dashboardMode: props.dashboardMode });
    logMrp10RuntimeRenderChain({
      activeTab,
      dashboardMode: props.dashboardMode,
      rendering: activeTab === "dashboard" ? "DashboardRuntimePanel" : "MainRightPanelAssistantPlaceholder",
    });
  }, [activeTab, props.dashboardMode]);

  React.useEffect(() => {
    const previousTab = previousTabRef.current;
    if (previousTab === activeTab) return;
    logMainRightPanelTabChange({
      fromTab: previousTab,
      toTab: activeTab,
      source: "MainRightPanelShell.activeTab",
    });
    previousTabRef.current = activeTab;
  }, [activeTab]);

  const handleTabClick = React.useCallback(
    (tab: MainRightPanelTab) => {
      if (tab === activeTab) return;
      if (!(MAIN_RIGHT_PANEL_TABS as readonly string[]).includes(tab)) {
        warnMainRightPanelStateBrake("Unauthorized tab click ignored.", {
          attemptedTab: tab,
          allowedTabs: MAIN_RIGHT_PANEL_TABS,
        });
        return;
      }
      props.onTabChange(tab);
    },
    [activeTab, props.onTabChange]
  );

  const activeWorkspaceId = React.useMemo(
    () => resolveActiveWorkspaceIdFromMode(props.dashboardMode),
    [props.dashboardMode]
  );
  const emptyWorkspaceMode = props.emptyWorkspaceState?.state === "empty";
  const domainLabel = props.workspaceDomainSelection?.domainName ?? null;
  const situationCaptured = Boolean(props.workspaceSituation?.situationText.trim());
  const goalsDefined = Boolean(props.workspaceGoals?.length);
  const draftObjectCount = props.workspaceDraftModel?.objects.length ?? 0;
  const approvedObjectCount = props.workspaceObjects?.length ?? props.workspaceModel?.approvedObjects.length ?? 0;
  const modelApproved = props.workspaceModel?.status === "approved";
  const workspaceSceneCreated = props.workspaceSceneCreated === true;
  const selectedObjectId = props.launcherSelectedObjectId ?? props.dashboardRouteObjectId;
  const selectedObjectLabel = props.launcherSelectedObjectLabel ?? props.dashboardRouteObjectName;

  useSyncMrpContextStore({
    activeTab,
    dashboardMode: props.dashboardMode,
    dashboardContext: props.dashboardContext,
    selectedObjectId,
    selectedObjectLabel,
    routeObjectId: props.dashboardRouteObjectId,
    routeObjectName: props.dashboardRouteObjectName,
    subWorkspaceMode: props.subWorkspaceMode,
    focusContext: props.focusContext,
    analyzeContext: props.analyzeContext,
    compareContext: props.compareContext,
    scenarioContext: props.scenarioContext,
    warRoomContext: props.warRoomContext,
  });

  const handleContextBackNavigation = React.useCallback(() => {
    if (props.onMrpContextBack) {
      props.onMrpContextBack();
      return;
    }
    props.onReturnToDashboardHome?.();
  }, [props.onMrpContextBack, props.onReturnToDashboardHome]);

  const renderDashboardRuntime = React.useCallback(
    () => (
      <DashboardRuntimePanel
        mode={props.dashboardMode}
        routeObjectId={props.dashboardRouteObjectId}
        routeObjectName={props.dashboardRouteObjectName}
        focusContext={props.focusContext}
        analyzeContext={props.analyzeContext}
        compareContext={props.compareContext}
        scenarioContext={props.scenarioContext}
        warRoomContext={props.warRoomContext}
        legacyHost={props.legacyDashboardHost}
        activeWorkspaceId={activeWorkspaceId}
        selectedObjectId={selectedObjectId}
        selectedObjectLabel={selectedObjectLabel}
        selectedObjectType={props.launcherSelectedObjectType ?? null}
        selectedObjectStatus={props.launcherSelectedObjectStatus ?? null}
        onWorkspaceLaunch={props.onWorkspaceLaunch}
        recommendationContext={props.recommendationContext}
        recentsContext={props.recentsContext}
        onRecentReturn={props.onRecentReturn}
        onReturnToDashboardHome={props.onReturnToDashboardHome}
      />
    ),
    [
      activeWorkspaceId,
      props.analyzeContext,
      props.compareContext,
      props.dashboardMode,
      props.dashboardRouteObjectId,
      props.dashboardRouteObjectName,
      props.focusContext,
      props.launcherSelectedObjectStatus,
      props.launcherSelectedObjectType,
      props.legacyDashboardHost,
      props.onRecentReturn,
      props.onReturnToDashboardHome,
      props.onWorkspaceLaunch,
      props.recommendationContext,
      props.recentsContext,
      props.scenarioContext,
      props.warRoomContext,
      selectedObjectId,
      selectedObjectLabel,
    ]
  );

  const panelBody = (
    <>
      <div
        id="nexora-mrp-panel-dashboard"
        role="tabpanel"
        aria-labelledby="nexora-mrp-tab-dashboard"
        hidden={activeTab !== "dashboard"}
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          display: activeTab === "dashboard" ? "flex" : "none",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <MainRightPanelDiscoveryStrip
          domainLabel={domainLabel}
          situationCaptured={situationCaptured}
          goalsDefined={goalsDefined}
          draftObjectCount={draftObjectCount}
          approvedObjectCount={approvedObjectCount}
          modelApproved={modelApproved}
          workspaceSceneCreated={workspaceSceneCreated}
        />
        {emptyWorkspaceMode ? (
          <MainRightPanelEmptyWorkspaceMessage
            domainLabel={domainLabel}
            situationCaptured={situationCaptured}
            goalsDefined={goalsDefined}
            draftObjectCount={draftObjectCount}
            approvedObjectCount={approvedObjectCount}
            modelApproved={modelApproved}
            workspaceSceneCreated={workspaceSceneCreated}
          />
        ) : (
          <MrpDynamicWorkspaceZone
            dashboardMode={props.dashboardMode}
            dashboardContext={props.dashboardContext}
            subWorkspaceMode={props.subWorkspaceMode}
            selectedObjectId={selectedObjectId}
            selectedObjectLabel={selectedObjectLabel}
            selectedObjectType={props.launcherSelectedObjectType ?? null}
            selectedObjectStatus={props.launcherSelectedObjectStatus ?? null}
            routeObjectId={props.dashboardRouteObjectId}
            routeObjectName={props.dashboardRouteObjectName}
            workspaceSceneJson={props.workspaceSceneJson}
            renderDashboardRuntime={renderDashboardRuntime}
          />
        )}
      </div>

      <div
        id="nexora-mrp-panel-assistant"
        role="tabpanel"
        aria-labelledby="nexora-mrp-tab-assistant"
        hidden={activeTab !== "assistant"}
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          display: activeTab === "assistant" ? "flex" : "none",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <MainRightPanelDiscoveryStrip
          domainLabel={domainLabel}
          situationCaptured={situationCaptured}
          goalsDefined={goalsDefined}
          draftObjectCount={draftObjectCount}
          approvedObjectCount={approvedObjectCount}
          modelApproved={modelApproved}
          workspaceSceneCreated={workspaceSceneCreated}
        />
        {emptyWorkspaceMode ? (
          <MainRightPanelEmptyWorkspaceMessage
            variant="assistant"
            domainLabel={domainLabel}
            situationCaptured={situationCaptured}
            goalsDefined={goalsDefined}
            draftObjectCount={draftObjectCount}
            approvedObjectCount={approvedObjectCount}
            modelApproved={modelApproved}
            workspaceSceneCreated={workspaceSceneCreated}
          />
        ) : props.useIntegratedAssistantStack ? (
          <MrpChatFirstAssistantSurface
            questionSuggestions={props.assistantQuestionSuggestions}
            questionsLoading={props.assistantQuestionsLoading}
            insightText={props.assistantContextSummary}
            governanceText={props.assistantGovernanceSummary}
            analyticsText={props.assistantAnalyticsSummary}
            showScenarioHost={props.showAssistantScenarioHost}
            showAnalyticsHost={props.showAssistantComparisonHost}
            recommendedActions={props.assistantRecommendedActions}
            themeMode={props.assistantThemeMode}
            onQuestionSelect={props.onAssistantQuestionSelect}
            onWorkspaceLaunch={props.onWorkspaceLaunch}
            onActionSelect={props.onAssistantActionSelect}
          />
        ) : (
          <MainRightPanelAssistantPlaceholder actionCardContext={props.assistantActionCardContext} />
        )}
      </div>
    </>
  );

  return (
    <div
      id="nexora-main-right-panel-shell"
      data-nx="main-right-panel-shell"
      data-nx-mrp-state={collapsed ? "collapsed" : "expanded"}
      data-nx-mrp-tab={activeTab}
      data-nx-dashboard-mode={props.dashboardMode}
      style={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: collapsed ? nx.workspacePanelBg : undefined,
      }}
    >
      {collapsed ? (
        <header
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: "10px 6px",
            width: "100%",
          }}
        >
          <button
            type="button"
            aria-label="Expand main right panel"
            title="Expand main right panel"
            onClick={handleToggleCollapse}
            style={collapseButtonStyle}
          >
            ⟨
          </button>
          <span
            aria-hidden
            style={{
              writingMode: "vertical-rl",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: nx.lowMuted,
            }}
          >
            {TAB_LABELS[activeTab]}
          </span>
        </header>
      ) : (
        <div
          role="tablist"
          aria-label="Main right panel"
          style={mrpHeaderShellStyle(nx.borderSoft)}
        >
          <div style={mrpHeaderTabRowStyle()}>
            {MAIN_RIGHT_PANEL_TABS.map((tab) => {
              const selected = activeTab === tab;
              const showModeHint = tab === "dashboard" && selected && isDedicatedDashboardMode;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`nexora-mrp-panel-${tab}`}
                  id={`nexora-mrp-tab-${tab}`}
                  onClick={() => handleTabClick(tab)}
                  title={
                    showModeHint
                      ? `${TAB_LABELS[tab]} — ${dashboardModeLabel(props.dashboardMode)} mode active. Use Insight Home to return.`
                      : TAB_LABELS[tab]
                  }
                  style={mrpTabButtonStyle({
                    selected,
                    navTileActiveBorder: nx.navTileActiveBorder,
                    navTileActiveBg: nx.navTileActiveBg,
                    border: nx.border,
                    bgControl: nx.bgControl,
                    text: nx.text,
                    muted: nx.muted,
                  })}
                >
                  {showModeHint
                    ? `${TAB_LABELS[tab]} · ${dashboardModeLabel(props.dashboardMode)}`
                    : TAB_LABELS[tab]}
                </button>
              );
            })}
          </div>
          {props.onToggleCollapse ? (
            <button
              type="button"
              aria-label="Collapse main right panel"
              title="Collapse main right panel"
              onClick={handleToggleCollapse}
              style={collapseButtonStyle}
            >
              ›
            </button>
          ) : null}
        </div>
      )}

      <div
        aria-hidden={collapsed}
        style={{
          flex: collapsed ? 0 : 1,
          minHeight: collapsed ? 0 : undefined,
          minWidth: 0,
          display: collapsed ? "none" : "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <MainRightPanelContextHeader onBackNavigation={handleContextBackNavigation} />
        {panelBody}
      </div>
    </div>
  );
}

export const MainRightPanelShell = React.memo(MainRightPanelShellComponent);
MainRightPanelShell.displayName = "MainRightPanelShell";

export default MainRightPanelShell;

function MainRightPanelDiscoveryStrip(props: {
  domainLabel: string | null;
  situationCaptured: boolean;
  goalsDefined: boolean;
  draftObjectCount: number;
  approvedObjectCount: number;
  modelApproved: boolean;
  workspaceSceneCreated: boolean;
}): React.ReactElement {
  return (
    <div
      data-nx="mrp-domain-context"
      style={{
        flexShrink: 0,
        borderBottom: `1px solid ${nx.borderSoft}`,
        color: nx.lowMuted,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "8px 12px",
      }}
    >
      {props.domainLabel ? `Selected Domain: ${props.domainLabel}` : "No Domain Selected"}
      {" · "}
      {props.situationCaptured ? "Situation Captured" : "Situation Not Yet Defined"}
      {" · "}
      {props.goalsDefined ? "Goals Defined" : "No Goals Selected"}
      {" · "}
      {props.draftObjectCount > 0 ? `Draft Objects Generated: ${props.draftObjectCount}` : "No Draft Objects"}
      {" · "}
      {props.approvedObjectCount > 0 ? `Approved Objects: ${props.approvedObjectCount}` : "No Approved Objects"}
      {" · "}
      {props.modelApproved ? "Model Status: Approved" : "Model Status: Draft"}
      {" · "}
      {props.workspaceSceneCreated ? "Scene Created" : "Scene Pending"}
    </div>
  );
}

function MainRightPanelEmptyWorkspaceMessage(props: {
  variant?: "dashboard" | "assistant";
  domainLabel?: string | null;
  situationCaptured?: boolean;
  goalsDefined?: boolean;
  draftObjectCount?: number;
  approvedObjectCount?: number;
  modelApproved?: boolean;
  workspaceSceneCreated?: boolean;
}): React.ReactElement {
  const assistant = props.variant === "assistant";
  return (
    <div
      data-nx="mrp-empty-workspace-message"
      style={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        overflow: "hidden",
      }}
    >
      <section
        style={{
          width: "100%",
          borderRadius: 8,
          border: `1px solid ${nx.border}`,
          background: nx.bgPanelSoft,
          padding: 14,
          display: "grid",
          gap: 8,
        }}
      >
        <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {assistant ? "Assistant Context" : "Insight"}
        </div>
        <div style={{ color: nx.text, fontSize: 14, fontWeight: 800 }}>
          No model exists yet.
        </div>
        <p style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45, margin: 0 }}>
          {assistant
            ? "Assistant context will become workspace-specific after a first model is created."
            : "Executive summaries, risks, opportunities, and scenarios will appear after this workspace has an approved model."}
        </p>
        <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800 }}>
          {props.domainLabel ? `Selected Domain: ${props.domainLabel}` : "No Domain Selected"}
          {" · "}
          {props.situationCaptured ? "Situation Captured" : "Situation Not Yet Defined"}
          {" · "}
          {props.goalsDefined ? "Goals Defined" : "No Goals Selected"}
          {" · "}
          {(props.draftObjectCount ?? 0) > 0
            ? `Draft Objects Generated: ${props.draftObjectCount}`
            : "No Draft Objects"}
          {" · "}
          {(props.approvedObjectCount ?? 0) > 0
            ? `Approved Objects: ${props.approvedObjectCount}`
            : "No Approved Objects"}
          {" · "}
          {props.modelApproved ? "Model Status: Approved" : "Model Status: Draft"}
          {" · "}
          {props.workspaceSceneCreated ? "Scene Created" : "Scene Pending"}
        </div>
      </section>
    </div>
  );
}
