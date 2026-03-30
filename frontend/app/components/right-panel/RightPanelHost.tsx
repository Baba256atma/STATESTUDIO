"use client";

import React from "react";

import ConflictMapPanel from "../panels/ConflictMapPanel";
import ObjectSelectionPanel from "../panels/ObjectSelectionPanel";
import RiskPropagationPanel from "../panels/RiskPropagationPanel";
import DecisionReplayPanel from "../panels/DecisionReplayPanel";
import StrategicAdvicePanel from "../panels/StrategicAdvicePanel";
import OpponentMovesPanel from "../panels/OpponentMovesPanel";
import StrategicPatternsPanel from "../panels/StrategicPatternsPanel";
import ExecutiveDashboardPanel from "../panels/ExecutiveDashboardPanel";
import { StrategicCommandPanel } from "../executive/StrategicCommandPanel";
import { DecisionComparePanel } from "../executive/DecisionComparePanel";
import { DecisionTimelinePanel } from "../executive/DecisionTimelinePanel";
import { DecisionMemoryPanel } from "../executive/DecisionMemoryPanel";
import { ScenarioBranchingTreePanel } from "../executive/ScenarioBranchingTreePanel";
import { DecisionLifecyclePanel } from "../executive/DecisionLifecyclePanel";
import { StrategicLearningPanel } from "../executive/StrategicLearningPanel";
import { MetaDecisionPanel } from "../executive/MetaDecisionPanel";
import { CognitiveStylePanel } from "../executive/CognitiveStylePanel";
import { TeamDecisionPanel } from "../executive/TeamDecisionPanel";
import { OrgMemoryPanel } from "../executive/OrgMemoryPanel";
import { DecisionPolicyPanel } from "../executive/DecisionPolicyPanel";
import { DecisionGovernancePanel } from "../executive/DecisionGovernancePanel";
import { ExecutiveApprovalPanel } from "../executive/ExecutiveApprovalPanel";
import { DecisionTimelinePanel as GovernanceDecisionTimelinePanel } from "../governance/DecisionTimelinePanel";
import { DecisionConfidenceCalibrationPanel } from "../executive/DecisionConfidenceCalibrationPanel";
import { DecisionPatternIntelligencePanel } from "../executive/DecisionPatternIntelligencePanel";
import { DecisionOutcomeFeedbackPanel } from "../executive/DecisionOutcomeFeedbackPanel";
import { CollaborationIntelligencePanel } from "../executive/CollaborationIntelligencePanel";
import { AutonomousDecisionCouncilPanel } from "../executive/AutonomousDecisionCouncilPanel";
import CollaborationPanel from "../panels/CollaborationPanel";
import ProductWorkspacePanel from "../panels/ProductWorkspacePanel";
import { WarRoomPanel } from "../warroom/WarRoomPanel";
import type { RightPanelState } from "../../lib/ui/right-panel/rightPanelTypes";
import type { RightPanelView } from "../../lib/ui/right-panel/rightPanelTypes";
import type { DecisionExecutionResult } from "../../lib/executive/decisionExecutionTypes";
import type { DecisionImpactState } from "../../lib/impact/decisionImpactTypes";
import type { StrategicCouncilResult } from "../../lib/council/strategicCouncilTypes";
import type { CustomerDemoProfile } from "../../lib/demo/customerDemoTypes";
import type { WarRoomController } from "../../lib/warroom/warRoomTypes";
import { useCanonicalRecommendation } from "../../lib/decision/recommendation/useCanonicalRecommendation";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import type { DecisionAutomationResult } from "../../lib/execution/decisionAutomationTypes";
import type { DecisionExecutionIntent } from "../../lib/execution/decisionExecutionIntent";
import { RightPanelFallback } from "./RightPanelFallback";
import { buildPanelResolvedData } from "../../lib/panels/buildPanelResolvedData";
import type { PanelResolvedData, PanelSharedData } from "../../lib/panels/panelDataResolverTypes";
import { validatePanelSharedData } from "../../lib/panels/panelDataContract";
import { ensurePanelSafeRender } from "../../lib/ui/right-panel/panelRegressionGuard";
import { runPanelConsistencyTestHarness } from "../../lib/ui/right-panel/panelTestHarness";
import { autoFixRightPanelState } from "../../lib/ui/right-panel/panelAutoFix";
import { getPanelIntelligence } from "../../lib/ui/right-panel/panelIntelligence";
import { getPanelCognitiveFlow, recordPanelCognitiveFlowHistory } from "../../lib/ui/right-panel/panelCognitiveFlow";
import { getRightPanelRegistryEntry } from "../../lib/ui/right-panel/rightPanelRegistry";

type RightPanelHostProps = {
  rightPanelState: RightPanelState;
  panelData: PanelSharedData;
  backendBase: string;
  episodeId: string | null;
  sceneJson?: any;
  responseData?: any;
  activeMode?: string | null;
  conflicts?: any[] | null;
  objectSelection?: any | null;
  memoryInsights?: any | null;
  decisionMemoryEntries?: DecisionMemoryEntry[];
  riskPropagation?: any | null;
  strategicAdvice?: any | null;
  strategicCouncil?: StrategicCouncilResult | null;
  decisionImpact?: DecisionImpactState | null;
  decisionCockpit?: any | null;
  opponentModel?: any | null;
  strategicPatterns?: any | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  focusedId?: string | null;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
  demoProfile?: CustomerDemoProfile | null;
  decisionResult?: DecisionExecutionResult | null;
  decisionLoading?: boolean;
  decisionStatus?: "idle" | "loading" | "ready" | "error";
  decisionError?: string | null;
  activeExecutiveView?: "simulate" | "compare" | "dashboard" | null;
  warRoom: WarRoomController;
  onSceneUpdateFromTimeline: (payload: any) => void;
  onSimulateDecision?: (() => void) | null;
  onCompareOptions?: (() => void) | null;
  onOpenWarRoom?: (() => void) | null;
  onCloseWarRoom?: (() => void) | null;
  onOpenStrategicCommand?: (() => void) | null;
  onOpenTimeline?: (() => void) | null;
  onOpenDashboard?: (() => void) | null;
  onOpenMemory?: (() => void) | null;
  onOpenDecisionLifecycle?: (() => void) | null;
  onOpenStrategicLearning?: (() => void) | null;
  onOpenMetaDecision?: (() => void) | null;
  onOpenCognitiveStyle?: (() => void) | null;
  onOpenTeamDecision?: (() => void) | null;
  onOpenCollaborationIntelligence?: (() => void) | null;
  onOpenDecisionCouncil?: (() => void) | null;
  onOpenOrgMemory?: (() => void) | null;
  onOpenDecisionPolicy?: (() => void) | null;
  onOpenDecisionGovernance?: (() => void) | null;
  onOpenExecutiveApproval?: (() => void) | null;
  onOpenDecisionTimeline?: (() => void) | null;
  onOpenConfidenceCalibration?: (() => void) | null;
  onOpenOutcomeFeedback?: (() => void) | null;
  onOpenPatternIntelligence?: (() => void) | null;
  onOpenObject?: ((id?: string | null) => void) | null;
  onOpenScenarioTree?: (() => void) | null;
  onPreviewDecision?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
  onSaveScenario?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
  onApplyDecisionSafe?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
};

export function RightPanelHost(props: RightPanelHostProps) {
  const guardedView = ensurePanelSafeRender(props.rightPanelState.view, true);
  const safeView = guardedView.safeView;
  const panelStateEpoch = props.rightPanelState.timestamp ?? 0;

  if (process.env.NODE_ENV !== "production") {
    console.log("[Nexora][PanelRender]", {
      view: safeView,
      isOpen: props.rightPanelState.isOpen,
      componentMatched: !guardedView.shouldFallback,
      contextId: props.rightPanelState.contextId ?? null,
      timestamp: panelStateEpoch,
      hasData: Boolean(props.responseData ?? props.sceneJson ?? props.decisionResult ?? props.decisionMemoryEntries?.length),
    });
  }

  const dashboardRecommendation = useCanonicalRecommendation(props.responseData ?? props.sceneJson ?? null);
  const warRoomRecommendation = useCanonicalRecommendation(props.warRoom.intelligence ?? null);
  const mergedPanelData = React.useMemo<PanelSharedData>(
    () => ({
      ...props.panelData,
      strategicAdvice: props.panelData.strategicAdvice ?? props.strategicAdvice ?? props.sceneJson?.strategic_advice ?? null,
      decisionCockpit: props.panelData.decisionCockpit ?? props.decisionCockpit ?? props.responseData?.decision_cockpit ?? null,
      executiveSummary: props.panelData.executiveSummary ?? props.responseData?.executive_summary_surface ?? null,
      simulation: props.panelData.simulation ?? props.responseData?.decision_simulation ?? null,
      timeline: props.panelData.timeline ?? props.responseData?.timeline_impact ?? null,
      risk: props.panelData.risk ?? props.riskPropagation ?? props.responseData?.risk_propagation ?? null,
      memory: props.panelData.memory ?? props.memoryInsights ?? null,
      canonicalRecommendation: props.panelData.canonicalRecommendation ?? dashboardRecommendation ?? null,
      decisionResult: props.panelData.decisionResult ?? props.decisionResult ?? null,
      warRoom: props.panelData.warRoom ?? props.warRoom.intelligence ?? null,
      compare:
        props.panelData.compare ??
        props.responseData?.decision_comparison ??
        props.responseData?.comparison ??
        props.decisionResult?.comparison_result ??
        null,
      governance: props.panelData.governance ?? props.responseData?.decision_governance ?? null,
      approval: props.panelData.approval ?? props.responseData?.approval_workflow ?? null,
      policy: props.panelData.policy ?? props.responseData?.decision_policy ?? null,
      strategicCouncil: props.panelData.strategicCouncil ?? props.strategicCouncil ?? null,
      memoryEntries: props.panelData.memoryEntries ?? props.decisionMemoryEntries ?? [],
    }),
    [
      props.panelData,
      props.strategicAdvice,
      props.sceneJson,
      props.decisionCockpit,
      props.responseData,
      props.riskPropagation,
      props.memoryInsights,
      props.decisionResult,
      props.warRoom.intelligence,
      props.strategicCouncil,
      props.decisionMemoryEntries,
      dashboardRecommendation,
    ]
  );
  const safePanelData = React.useMemo<PanelSharedData>(
    () => validatePanelSharedData(mergedPanelData),
    [mergedPanelData]
  );
  const resolvedPanel = React.useMemo(
    () => {
      void panelStateEpoch;
      return isResolverManagedView(safeView)
        ? buildPanelResolvedData(safeView, safePanelData)
        : null;
    },
    [safeView, safePanelData, panelStateEpoch]
  );
  const autoFixed = React.useMemo(
    () => {
      void panelStateEpoch;
      return autoFixRightPanelState({
        view: safeView,
        contextId: props.rightPanelState.contextId ?? null,
        panelData: safePanelData,
        resolverStatus: resolvedPanel?.status,
      });
    },
    [safeView, props.rightPanelState.contextId, safePanelData, resolvedPanel?.status, panelStateEpoch]
  );
  const effectiveView = autoFixed.fixedView ?? safeView;
  const effectivePanelData = autoFixed.fixedPanelData ?? safePanelData;
  const effectiveResolvedPanel = React.useMemo(
    () => {
      void panelStateEpoch;
      return isResolverManagedView(effectiveView)
        ? buildPanelResolvedData(effectiveView, effectivePanelData)
        : null;
    },
    [effectiveView, effectivePanelData, panelStateEpoch]
  );
  const canonicalPanelPayload = React.useMemo(
    () => ({
      ...effectivePanelData,
      responseData: effectivePanelData.responseData ?? props.responseData ?? props.sceneJson ?? null,
      strategic_advice:
        effectivePanelData.advice ??
        effectivePanelData.strategicAdvice ??
        props.strategicAdvice ??
        props.sceneJson?.strategic_advice ??
        null,
      canonical_recommendation: effectivePanelData.canonicalRecommendation ?? dashboardRecommendation ?? null,
      decision_simulation: effectivePanelData.simulation ?? props.responseData?.decision_simulation ?? null,
      timeline_impact: effectivePanelData.timeline ?? props.responseData?.timeline_impact ?? null,
      decision_policy: effectivePanelData.policy ?? props.responseData?.decision_policy ?? null,
      decision_governance: effectivePanelData.governance ?? props.responseData?.decision_governance ?? null,
      approval_workflow: effectivePanelData.approval ?? props.responseData?.approval_workflow ?? null,
      multi_agent_decision: effectivePanelData.warRoom ?? null,
    }),
    [effectivePanelData, props.responseData, props.sceneJson, props.strategicAdvice, dashboardRecommendation]
  );
  const panelIntelligence = React.useMemo(
    () => {
      void panelStateEpoch;
      return getPanelIntelligence({
        view: effectiveView,
        panelData: effectivePanelData,
        resolverStatus: effectiveResolvedPanel?.status,
        context: {
          selectedObjectId: props.selectedObjectId ?? props.rightPanelState.contextId ?? null,
          sceneJson: props.sceneJson ?? null,
          activeMode: props.activeMode ?? null,
          memory: props.memoryInsights ?? effectivePanelData.memory ?? null,
          simulation: effectivePanelData.simulation ?? props.responseData?.decision_simulation ?? null,
          risk: effectivePanelData.risk ?? props.riskPropagation ?? null,
          userIntent:
            typeof props.responseData?.ai_reasoning?.intent === "string"
              ? props.responseData.ai_reasoning.intent
              : null,
        },
      });
    },
    [
      effectiveView,
      effectivePanelData,
      effectiveResolvedPanel?.status,
      props.selectedObjectId,
      props.rightPanelState.contextId,
      props.sceneJson,
      props.activeMode,
      props.memoryInsights,
      props.responseData,
      props.riskPropagation,
      panelStateEpoch,
    ]
  );
  const intelligentView = panelIntelligence.adaptedView ?? effectiveView;
  const intelligentResolvedPanel = React.useMemo(
    () => {
      void panelStateEpoch;
      return isResolverManagedView(intelligentView)
        ? buildPanelResolvedData(intelligentView, effectivePanelData)
        : null;
    },
    [intelligentView, effectivePanelData, panelStateEpoch]
  );
  const cognitiveFlow = React.useMemo(
    () => {
      void panelStateEpoch;
      return getPanelCognitiveFlow({
        currentView: intelligentView,
        panelData: effectivePanelData,
        context: {
          intent:
            typeof props.responseData?.ai_reasoning?.intent === "string"
              ? props.responseData.ai_reasoning.intent
              : undefined,
          riskLevel: getRiskSignalLevel(effectivePanelData.risk ?? props.riskPropagation ?? null),
          hasSimulation: Boolean(effectivePanelData.simulation ?? props.responseData?.decision_simulation),
          hasRecommendation: hasRecommendationSignal(effectivePanelData),
          hasDecision: Boolean(props.decisionResult ?? effectivePanelData.approval ?? effectivePanelData.policy),
          hasOutcome: Boolean(props.decisionMemoryEntries?.length),
        },
      });
    },
    [
      intelligentView,
      effectivePanelData,
      props.responseData,
      props.riskPropagation,
      props.decisionResult,
      props.decisionMemoryEntries,
      panelStateEpoch,
    ]
  );
  const cognitiveNextAction = React.useMemo(
    () => resolveFlowAction(cognitiveFlow.nextRecommendedView, props),
    [cognitiveFlow.nextRecommendedView, props]
  );
  const handleRiskFlowRunSimulation = () => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][RiskFlowRunSimulation]", {
        requestedView: "simulate",
      });
    }
    props.onSimulateDecision?.();
  };
  const registryEntry = getRightPanelRegistryEntry(intelligentView);
  const resolvedPanelData =
    intelligentResolvedPanel?.data ??
    effectiveResolvedPanel?.data ??
    resolvedPanel?.data ??
    null;

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!props.rightPanelState.isOpen) return;
    runPanelConsistencyTestHarness({
      currentView: intelligentView,
      panelData: effectivePanelData,
    });
  }, [props.rightPanelState.isOpen, intelligentView, effectivePanelData, panelStateEpoch]);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!props.rightPanelState.isOpen) return;
    recordPanelCognitiveFlowHistory(intelligentView);
  }, [props.rightPanelState.isOpen, intelligentView, panelStateEpoch]);

  if (!props.rightPanelState.isOpen) {
    return null;
  }

  if (!props.rightPanelState.view) {
    return (
      <RightPanelFallback
        title="Panel Unavailable"
        message="No panel target was provided, so Nexora is showing a guarded fallback in place."
        suggestedActionLabel={cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null}
        onSuggestedAction={cognitiveNextAction ?? null}
      />
    );
  }

  if (guardedView.shouldFallback) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Nexora][PanelFallback]", {
        panel: safeView,
        reason: guardedView.reason,
      });
    }
    return (
      <RightPanelFallback
        title="Panel Guard"
        message="This panel could not be rendered safely, so Nexora opened a guarded fallback instead."
        suggestedActionLabel={cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null}
        onSuggestedAction={cognitiveNextAction ?? resolveViewFallbackAction(safeView, props)}
      />
    );
  }

  const hasDecisionContext = Boolean(
    dashboardRecommendation ??
      props.responseData ??
      props.sceneJson ??
      props.decisionResult ??
      props.decisionMemoryEntries?.length ??
      effectivePanelData.advice ??
      effectivePanelData.strategicAdvice ??
      effectivePanelData.timeline ??
      effectivePanelData.simulation ??
      effectivePanelData.warRoom
  );

  if (process.env.NODE_ENV !== "production") {
    console.log("[Nexora][PanelRenderDeep]", {
      incomingView: props.rightPanelState.view ?? null,
      afterRouter: safeView,
      finalView: intelligentView,
      resolverStatus:
        intelligentResolvedPanel?.status ??
        effectiveResolvedPanel?.status ??
        resolvedPanel?.status ??
        null,
      hasData: Boolean(resolvedPanelData),
    });
    if (
      (intelligentView === "advice" || intelligentView === "timeline" || intelligentView === "war_room") &&
      shouldRenderResolvedFallback(intelligentResolvedPanel) &&
      (effectivePanelData.advice ||
        effectivePanelData.strategicAdvice ||
        effectivePanelData.timeline ||
        effectivePanelData.simulation ||
        effectivePanelData.warRoom)
    ) {
      console.warn("[Nexora][PanelDataUnderfed]", {
        panel: intelligentView,
        availableKeys: Object.keys(effectivePanelData ?? {}),
      });
    }
  }

  if (process.env.NODE_ENV !== "production" && (effectiveResolvedPanel || resolvedPanel)) {
    const resolverStatus = intelligentResolvedPanel?.status ?? effectiveResolvedPanel?.status ?? resolvedPanel.status;
    const usedFallback =
      autoFixed.fixType === "fallback_applied" ||
      shouldRenderResolvedFallback(intelligentResolvedPanel) ||
      shouldRenderResolvedFallback(effectiveResolvedPanel);
    console.log("[Nexora][PanelResolver]", {
      panel: intelligentView,
      status: resolverStatus,
      missingFields: intelligentResolvedPanel?.missingFields ?? effectiveResolvedPanel?.missingFields ?? resolvedPanel.missingFields,
    });
    console.log("[Nexora][PanelFlow]", {
      requestedView: props.rightPanelState.view ?? null,
      resolvedView: safeView,
      finalView: intelligentView,
      resolverStatus,
      hasResolvedData: Boolean(resolvedPanelData),
      usedFallback,
    });
    console.log("[Nexora][RightPanelSafeRender]", {
      view: intelligentView,
      fixType: autoFixed.fixType,
      prioritizedBlocks: panelIntelligence.enhancements.prioritizeBlocks ?? [],
      cognitiveStep: cognitiveFlow.currentStep,
      nextRecommendedView: cognitiveFlow.nextRecommendedView,
    });
  }

  if (!registryEntry.componentExists && registryEntry.fallbackAllowed) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Nexora][AutoFixPanelRegistryMiss]", {
        canonicalView: intelligentView,
        reason: "component_unavailable",
      });
    }
    return renderFallbackForView(
      intelligentView,
      cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
      cognitiveNextAction ?? resolveViewFallbackAction(intelligentView, props)
    );
  }

  if (isResolverManagedView(intelligentView) && !resolvedPanelData) {
    return renderFallbackForView(
      intelligentView,
      cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
      cognitiveNextAction ?? resolveViewFallbackAction(intelligentView, props)
    );
  }

  switch (intelligentView) {
    case "strategic_command":
      if (shouldRenderResolvedFallback(intelligentResolvedPanel)) {
        return renderResolvedFallback(
          intelligentResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          cognitiveNextAction ?? resolveViewFallbackAction(intelligentView, props)
        );
      }
      return (
        <StrategicCommandPanel
          workspaceId={props.responseData?.workspace_id ?? null}
          projectId={props.responseData?.project_id ?? null}
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? null}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onOpenView={(view) => {
            if (view === "dashboard" || view === "simulate" || view === "compare") {
              if (view === "compare") {
                props.onCompareOptions?.();
                return;
              }
              if (view === "simulate") {
                props.onSimulateDecision?.();
                return;
              }
              props.onOpenDashboard?.();
              return;
            }
            if (view === "timeline") return props.onOpenTimeline?.();
            if (view === "war_room") return props.onOpenWarRoom?.();
            if (view === "team_decision") return props.onOpenTeamDecision?.();
            if (view === "collaboration_intelligence") return props.onOpenCollaborationIntelligence?.();
            if (view === "decision_governance") return props.onOpenDecisionGovernance?.();
            if (view === "executive_approval") return props.onOpenExecutiveApproval?.();
            if (view === "decision_policy") return props.onOpenDecisionPolicy?.();
            if (view === "decision_council") return props.onOpenDecisionCouncil?.();
            if (view === "org_memory") return props.onOpenOrgMemory?.();
            if (view === "strategic_learning") return props.onOpenStrategicLearning?.();
            if (view === "decision_lifecycle") return props.onOpenDecisionLifecycle?.();
          }}
        />
      );
    case "timeline":
      if (shouldRenderResolvedFallback(intelligentResolvedPanel)) {
        return renderResolvedFallback(
          intelligentResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          cognitiveNextAction ?? resolveViewFallbackAction(intelligentView, props)
        );
      }
      if (!hasDecisionContext) {
        return (
          <RightPanelFallback
            title="Timeline"
            message="No risk progression timeline available yet."
            suggestedActionLabel="Run Simulation"
            onSuggestedAction={props.onSimulateDecision ?? null}
          />
        );
      }
      return (
        <DecisionTimelinePanel
          responseData={canonicalPanelPayload}
          strategicAdvice={
            effectivePanelData.advice ??
            effectivePanelData.strategicAdvice ??
            props.strategicAdvice ??
            props.sceneJson?.strategic_advice ??
            null
          }
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? undefined}
          decisionLoading={props.decisionLoading ?? false}
          decisionStatus={props.decisionStatus ?? "idle"}
          decisionError={props.decisionError ?? null}
          resolveObjectLabel={props.resolveObjectLabel ?? null}
          onCompareOptions={props.onCompareOptions ?? null}
          onSimulateDecision={props.onSimulateDecision ?? null}
          onReturnToWarRoom={props.onOpenWarRoom ?? null}
        />
      );
    case "decision_lifecycle":
      if (!hasDecisionContext) {
        return (
          <RightPanelFallback
            title="Decision Lifecycle"
            message="Recommendation will appear after analysis. Run a scenario to build the lifecycle view."
            suggestedActionLabel="Open Strategic Command"
            onSuggestedAction={props.onOpenStrategicCommand ?? null}
          />
        );
      }
      return (
        <DecisionLifecyclePanel
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? null}
          memoryEntries={props.decisionMemoryEntries ?? []}
          workspaceId={props.responseData?.workspace_id ?? null}
          projectId={props.responseData?.project_id ?? null}
          onOpenDecisionTimeline={props.onOpenDecisionTimeline ?? null}
          onOpenOutcomeFeedback={props.onOpenOutcomeFeedback ?? null}
          onOpenCompare={props.onCompareOptions ?? null}
        />
      );
    case "strategic_learning":
      return (
        <StrategicLearningPanel
          canonicalRecommendation={dashboardRecommendation}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onOpenMemory={props.onOpenMemory ?? null}
          onOpenPatternIntelligence={props.onOpenPatternIntelligence ?? null}
          onOpenDecisionLifecycle={props.onOpenDecisionLifecycle ?? null}
        />
      );
    case "meta_decision":
      return (
        <MetaDecisionPanel
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onOpenCompare={props.onCompareOptions ?? null}
          onOpenTimeline={props.onOpenTimeline ?? null}
          onOpenMemory={props.onOpenMemory ?? null}
        />
      );
    case "cognitive_style":
      return (
        <CognitiveStylePanel
          activeMode={props.activeMode ?? null}
          rightPanelView={props.rightPanelState.view ?? null}
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? null}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onOpenCompare={props.onCompareOptions ?? null}
          onOpenTimeline={props.onOpenTimeline ?? null}
          onOpenMemory={props.onOpenMemory ?? null}
        />
      );
    case "team_decision":
      return (
        <TeamDecisionPanel
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? null}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onOpenCompare={props.onCompareOptions ?? null}
          onOpenTimeline={props.onOpenTimeline ?? null}
          onOpenWarRoom={props.onOpenWarRoom ?? null}
          onOpenCognitiveStyle={props.onOpenCognitiveStyle ?? null}
          onOpenCollaborationIntelligence={props.onOpenCollaborationIntelligence ?? null}
        />
      );
    case "collaboration_intelligence":
      return (
        <CollaborationIntelligencePanel
          workspaceId={props.responseData?.workspace_id ?? null}
          projectId={props.responseData?.project_id ?? null}
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? null}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onOpenTeamDecision={props.onOpenTeamDecision ?? null}
          onOpenDecisionGovernance={props.onOpenDecisionGovernance ?? null}
          onOpenExecutiveApproval={props.onOpenExecutiveApproval ?? null}
        />
      );
    case "decision_council":
      if (shouldRenderResolvedFallback(intelligentResolvedPanel)) {
        return renderResolvedFallback(
          intelligentResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          cognitiveNextAction ?? resolveViewFallbackAction(intelligentView, props)
        );
      }
      return (
        <AutonomousDecisionCouncilPanel
          workspaceId={props.responseData?.workspace_id ?? null}
          projectId={props.responseData?.project_id ?? null}
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? null}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onOpenCompare={props.onCompareOptions ?? null}
          onOpenDecisionGovernance={props.onOpenDecisionGovernance ?? null}
          onOpenExecutiveApproval={props.onOpenExecutiveApproval ?? null}
          onOpenCollaborationIntelligence={props.onOpenCollaborationIntelligence ?? null}
        />
      );
    case "org_memory":
      return (
        <OrgMemoryPanel
          workspaceId={props.responseData?.workspace_id ?? null}
          memoryEntries={props.decisionMemoryEntries ?? []}
          canonicalRecommendation={dashboardRecommendation}
          onOpenMemory={props.onOpenMemory ?? null}
          onOpenStrategicLearning={props.onOpenStrategicLearning ?? null}
          onOpenTeamDecision={props.onOpenTeamDecision ?? null}
        />
      );
    case "decision_governance":
      if (shouldRenderResolvedFallback(intelligentResolvedPanel)) {
        return renderResolvedFallback(
          intelligentResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          cognitiveNextAction ?? resolveViewFallbackAction(intelligentView, props)
        );
      }
      return (
        <DecisionGovernancePanel
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? null}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onOpenCompare={props.onCompareOptions ?? null}
          onOpenTimeline={props.onOpenTimeline ?? null}
          onOpenTeamDecision={props.onOpenTeamDecision ?? null}
        />
      );
    case "decision_policy":
      if (shouldRenderResolvedFallback(intelligentResolvedPanel)) {
        return renderResolvedFallback(
          intelligentResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          cognitiveNextAction ?? resolveViewFallbackAction(intelligentView, props)
        );
      }
      return (
        <DecisionPolicyPanel
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? null}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onOpenDecisionGovernance={props.onOpenDecisionGovernance ?? null}
          onOpenExecutiveApproval={props.onOpenExecutiveApproval ?? null}
          onOpenCompare={props.onCompareOptions ?? null}
          onOpenTimeline={props.onOpenTimeline ?? null}
        />
      );
    case "executive_approval":
      if (shouldRenderResolvedFallback(intelligentResolvedPanel)) {
        return renderResolvedFallback(
          intelligentResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          cognitiveNextAction ?? resolveViewFallbackAction(intelligentView, props)
        );
      }
      return (
        <ExecutiveApprovalPanel
          workspaceId={props.responseData?.workspace_id ?? null}
          projectId={props.responseData?.project_id ?? null}
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? null}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onOpenCompare={props.onCompareOptions ?? null}
          onOpenDecisionGovernance={props.onOpenDecisionGovernance ?? null}
          onOpenTimeline={props.onOpenTimeline ?? null}
        />
      );
    case "decision_timeline":
      if (!hasDecisionContext) {
        return (
          <RightPanelFallback
            title="Decision Timeline"
            message="No decision history is available yet. Run analysis or save a scenario first."
            suggestedActionLabel="Review Recommendation"
            onSuggestedAction={props.onOpenStrategicCommand ?? null}
          />
        );
      }
      return (
        <GovernanceDecisionTimelinePanel
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          memoryEntries={props.decisionMemoryEntries ?? []}
        />
      );
    case "confidence_calibration":
      return (
        <DecisionConfidenceCalibrationPanel
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? null}
          memoryEntries={props.decisionMemoryEntries ?? []}
        />
      );
    case "outcome_feedback":
      return (
        <DecisionOutcomeFeedbackPanel
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? null}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onOpenDecisionTimeline={props.onOpenDecisionTimeline ?? null}
        />
      );
    case "pattern_intelligence":
      return (
        <DecisionPatternIntelligencePanel
          canonicalRecommendation={dashboardRecommendation}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onOpenMemory={props.onOpenMemory ?? null}
          onOpenCompare={props.onCompareOptions ?? null}
          onOpenConfidenceCalibration={props.onOpenConfidenceCalibration ?? null}
        />
      );
    case "conflict":
      return <ConflictMapPanel conflicts={props.conflicts ?? []} />;
    case "object":
      return props.rightPanelState.contextId ?? props.selectedObjectId ?? props.focusedId ? (
        <ObjectSelectionPanel selection={props.objectSelection ?? props.sceneJson?.object_selection ?? null} />
      ) : (
        <RightPanelFallback
          title="Object Focus"
          message="No object is selected yet. Choose an object from the scene or timeline first."
          suggestedActionLabel="Open Workspace"
          onSuggestedAction={props.onOpenObject ? () => props.onOpenObject?.(props.selectedObjectId ?? null) : null}
        />
      );
    case "memory":
      return (
        <DecisionMemoryPanel
          entries={props.decisionMemoryEntries ?? []}
          memoryInsights={props.memoryInsights ?? props.sceneJson?.memory_v2 ?? null}
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? null}
          resolveObjectLabel={props.resolveObjectLabel ?? null}
          onOpenTimeline={props.onOpenTimeline ?? null}
          onOpenCompare={props.onCompareOptions ?? null}
          onOpenWarRoom={props.onOpenWarRoom ?? null}
          onOpenObject={props.onOpenObject ?? null}
        />
      );
    case "scenario_tree":
      return (
        <ScenarioBranchingTreePanel
          responseData={props.responseData ?? props.sceneJson ?? undefined}
          strategicAdvice={props.strategicAdvice ?? props.sceneJson?.strategic_advice ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? undefined}
          memoryEntries={props.decisionMemoryEntries ?? []}
          resolveObjectLabel={props.resolveObjectLabel ?? null}
          onOpenCompare={props.onCompareOptions ?? null}
          onOpenTimeline={props.onOpenTimeline ?? null}
          onOpenWarRoom={props.onOpenWarRoom ?? null}
          onOpenObject={props.onOpenObject ?? null}
        />
      );
    case "risk":
      return props.riskPropagation ?? props.sceneJson?.risk_propagation ?? props.sceneJson?.scene?.risk_propagation ? (
        <RiskPropagationPanel
          risk={props.riskPropagation ?? props.sceneJson?.risk_propagation ?? props.sceneJson?.scene?.risk_propagation ?? null}
        />
      ) : (
        <RightPanelFallback
          title="Risk"
          message="No risk propagation is available yet. Run analysis or simulation to inspect exposure."
          suggestedActionLabel="Run Simulation"
          onSuggestedAction={handleRiskFlowRunSimulation}
        />
      );
    case "fragility":
      return props.riskPropagation ?? props.sceneJson?.risk_propagation ?? props.sceneJson?.scene?.risk_propagation ? (
        <RiskPropagationPanel
          risk={props.riskPropagation ?? props.sceneJson?.risk_propagation ?? props.sceneJson?.scene?.risk_propagation ?? null}
        />
      ) : (
        <RightPanelFallback
          title="Fragility"
          message="No fragility scan is available yet. Run analysis to inspect system fragility."
          suggestedActionLabel="Run Simulation"
          onSuggestedAction={handleRiskFlowRunSimulation}
        />
      );
    case "replay":
      return (
        <DecisionReplayPanel
          backendBase={props.backendBase}
          episodeId={props.episodeId}
          onSceneUpdate={props.onSceneUpdateFromTimeline}
        />
      );
    case "advice":
      if (shouldRenderResolvedFallback(intelligentResolvedPanel)) {
        return renderResolvedFallback(
          intelligentResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          cognitiveNextAction ?? resolveViewFallbackAction(intelligentView, props)
        );
      }
      return (
        <StrategicAdvicePanel
          data={effectivePanelData}
          advice={
            effectivePanelData.advice ??
            effectivePanelData.strategicAdvice ??
            props.strategicAdvice ??
            props.sceneJson?.strategic_advice ??
            null
          }
          canonicalRecommendation={dashboardRecommendation}
        />
      );
    case "opponent":
      return <OpponentMovesPanel model={props.opponentModel ?? props.sceneJson?.opponent_model ?? null} />;
    case "patterns":
      return <StrategicPatternsPanel patterns={props.strategicPatterns ?? props.sceneJson?.strategic_patterns ?? null} />;
    case "dashboard":
    case "simulate":
      if (intelligentView === "dashboard" && shouldRenderResolvedFallback(intelligentResolvedPanel)) {
        return renderResolvedFallback(
          intelligentResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          cognitiveNextAction ?? resolveViewFallbackAction(intelligentView, props)
        );
      }
      if (!hasDecisionContext && intelligentView === "simulate") {
        return (
          <RightPanelFallback
            title="Simulation"
            message="No simulation available yet. Run a scenario to generate results."
            suggestedActionLabel="Run Simulation"
            onSuggestedAction={props.onSimulateDecision ?? null}
          />
        );
      }
      if (!hasDecisionContext && intelligentView === "dashboard") {
        return (
          <RightPanelFallback
            title="Executive Dashboard"
            message="Executive overview is not ready yet. Ask Nexora to evaluate the current scenario."
            suggestedActionLabel="Open Strategic Command"
            onSuggestedAction={props.onOpenStrategicCommand ?? props.onOpenDashboard ?? null}
          />
        );
      }
      return (
        <ExecutiveDashboardPanel
          sceneJson={props.sceneJson ?? undefined}
          responseData={props.responseData ?? undefined}
          activeMode={props.activeMode}
          conflicts={props.conflicts ?? undefined}
          objectSelection={props.objectSelection ?? undefined}
          riskPropagation={props.riskPropagation ?? undefined}
          decisionMemoryEntries={props.decisionMemoryEntries ?? undefined}
          strategicAdvice={props.strategicAdvice ?? undefined}
          strategicCouncil={props.strategicCouncil ?? undefined}
          decisionImpact={props.decisionImpact ?? undefined}
          decisionCockpit={props.decisionCockpit ?? undefined}
          canonicalRecommendation={dashboardRecommendation}
          selectedObjectLabel={props.selectedObjectLabel}
          resolveObjectLabel={props.resolveObjectLabel ?? null}
          demoProfile={props.demoProfile ?? undefined}
          decisionResult={props.decisionResult ?? undefined}
          decisionLoading={props.decisionLoading ?? false}
          decisionStatus={props.decisionStatus ?? "idle"}
          decisionError={props.decisionError ?? null}
          activeExecutiveView={intelligentView === "simulate" ? "simulate" : props.activeExecutiveView ?? "dashboard"}
          onSimulateDecision={props.onSimulateDecision ?? null}
          onCompareOptions={props.onCompareOptions ?? null}
          onOpenWarRoom={props.onOpenWarRoom ?? null}
          onOpenStrategicCommand={props.onOpenStrategicCommand ?? null}
          onOpenTimeline={props.onOpenTimeline ?? null}
          onOpenScenarioTree={props.onOpenScenarioTree ?? null}
          onOpenMemory={props.onOpenMemory ?? null}
          onOpenDecisionLifecycle={props.onOpenDecisionLifecycle ?? null}
          onOpenStrategicLearning={props.onOpenStrategicLearning ?? null}
          onOpenMetaDecision={props.onOpenMetaDecision ?? null}
          onOpenCognitiveStyle={props.onOpenCognitiveStyle ?? null}
          onOpenTeamDecision={props.onOpenTeamDecision ?? null}
          onOpenCollaborationIntelligence={props.onOpenCollaborationIntelligence ?? null}
          onOpenDecisionCouncil={props.onOpenDecisionCouncil ?? null}
          onOpenOrgMemory={props.onOpenOrgMemory ?? null}
          onOpenDecisionPolicy={props.onOpenDecisionPolicy ?? null}
          onOpenDecisionGovernance={props.onOpenDecisionGovernance ?? null}
          onOpenExecutiveApproval={props.onOpenExecutiveApproval ?? null}
          onOpenDecisionTimeline={props.onOpenDecisionTimeline ?? null}
          onOpenConfidenceCalibration={props.onOpenConfidenceCalibration ?? null}
          onOpenOutcomeFeedback={props.onOpenOutcomeFeedback ?? null}
          onOpenPatternIntelligence={props.onOpenPatternIntelligence ?? null}
          onPreviewDecision={props.onPreviewDecision ?? null}
          onSaveScenario={props.onSaveScenario ?? null}
          onApplyDecisionSafe={props.onApplyDecisionSafe ?? null}
        />
      );
    case "compare":
      if (shouldRenderResolvedFallback(intelligentResolvedPanel)) {
        return renderResolvedFallback(
          intelligentResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          cognitiveNextAction ?? resolveViewFallbackAction(intelligentView, props)
        );
      }
      if (!hasDecisionContext) {
        return (
          <RightPanelFallback
            title="Compare Options"
            message="No comparison data is available yet. Compare options after analysis."
            suggestedActionLabel="Compare Options"
            onSuggestedAction={props.onCompareOptions ?? null}
          />
        );
      }
      return (
        <DecisionComparePanel
          responseData={props.responseData ?? undefined}
          strategicAdvice={props.strategicAdvice ?? props.sceneJson?.strategic_advice ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? undefined}
          decisionLoading={props.decisionLoading ?? false}
          decisionStatus={props.decisionStatus ?? "idle"}
          decisionError={props.decisionError ?? null}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onApplyRecommended={props.onSimulateDecision ?? props.onOpenWarRoom ?? null}
          onSimulateDeeper={props.onSimulateDecision ?? null}
          onViewRiskFlow={props.onOpenWarRoom ?? null}
          onViewScenarioTree={props.onOpenScenarioTree ?? null}
          onOpenDecisionTimeline={props.onOpenDecisionTimeline ?? null}
          onPreviewDecision={props.onPreviewDecision ?? null}
          onSaveScenario={props.onSaveScenario ?? null}
          onApplyDecisionSafe={props.onApplyDecisionSafe ?? null}
          onOpenDecisionPolicy={props.onOpenDecisionPolicy ?? null}
          onOpenExecutiveApproval={props.onOpenExecutiveApproval ?? null}
          resolveObjectLabel={props.resolveObjectLabel ?? null}
        />
      );
    case "war_room":
      if (shouldRenderResolvedFallback(intelligentResolvedPanel)) {
        return renderResolvedFallback(
          intelligentResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          cognitiveNextAction ?? resolveViewFallbackAction(intelligentView, props)
        );
      }
      if (!hasDecisionContext && !effectivePanelData.warRoom && !props.warRoom?.intelligence) {
        return (
          <RightPanelFallback
            title="War Room"
            message="No executive summary available yet."
            suggestedActionLabel="Open War Room Context"
            onSuggestedAction={props.onSimulateDecision ?? null}
          />
        );
      }
      return (
        <WarRoomPanel
          controller={props.warRoom}
          intelligence={(effectivePanelData.warRoom ?? canonicalPanelPayload) as Record<string, unknown> | null}
          selectedObjectLabel={props.selectedObjectLabel ?? null}
          strategicCouncil={props.strategicCouncil ?? null}
          decisionImpact={props.decisionImpact ?? undefined}
          canonicalRecommendation={warRoomRecommendation}
          resolveObjectLabel={props.resolveObjectLabel ?? null}
          demoProfile={props.demoProfile ?? undefined}
          decisionResult={props.decisionResult ?? undefined}
          decisionLoading={props.decisionLoading ?? false}
          decisionStatus={props.decisionStatus ?? "idle"}
          decisionError={props.decisionError ?? null}
          activeExecutiveView={props.activeExecutiveView ?? "dashboard"}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onSimulateDecision={props.onSimulateDecision ?? null}
          onCompareOptions={props.onCompareOptions ?? null}
          onOpenDecisionTimeline={props.onOpenDecisionTimeline ?? null}
          onPreviewDecision={props.onPreviewDecision ?? null}
          onSaveScenario={props.onSaveScenario ?? null}
          onApplyDecisionSafe={props.onApplyDecisionSafe ?? null}
          onOpenDecisionPolicy={props.onOpenDecisionPolicy ?? null}
          onOpenExecutiveApproval={props.onOpenExecutiveApproval ?? null}
          onClose={props.onCloseWarRoom ?? (() => {})}
        />
      );
    case "collaboration":
      return <CollaborationPanel backendBase={props.backendBase} episodeId={props.episodeId} />;
    case "workspace":
      return (
        <ProductWorkspacePanel
          backendBase={props.backendBase}
          episodeId={props.episodeId}
          responseData={props.responseData ?? undefined}
          currentScenarioInputs={[]}
        />
      );
    case "kpi":
      return (
        <RightPanelFallback
          title="KPI"
          message="No KPI analysis is available yet. Run an analysis to populate executive metrics."
          suggestedActionLabel="Review Advice"
          onSuggestedAction={props.onOpenStrategicCommand ?? null}
        />
      );
    default:
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Nexora] RightPanelHost fell back for unsupported view:", intelligentView);
      }
      return renderFallbackForView(
        intelligentView,
        cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
        cognitiveNextAction ?? resolveViewFallbackAction(intelligentView, props)
      );
  }
}

function isResolverManagedView(view: RightPanelView): view is Exclude<RightPanelView, null> {
  return (
    view === "advice" ||
    view === "dashboard" ||
    view === "simulate" ||
    view === "risk" ||
    view === "timeline" ||
    view === "compare" ||
    view === "war_room" ||
    view === "decision_governance" ||
    view === "executive_approval" ||
    view === "decision_policy" ||
    view === "decision_council" ||
    view === "strategic_command"
  );
}

function shouldRenderResolvedFallback(
  resolved: PanelResolvedData | null
) {
  return Boolean(resolved && (resolved.status === "fallback" || resolved.status === "empty_but_guided"));
}

function renderResolvedFallback(
  resolved: PanelResolvedData | null,
  suggestedActionLabel: string | null,
  onSuggestedAction: (() => void) | null
) {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[Nexora][PanelFallback]", {
      canonicalView: resolved?.title ?? "Panel",
      fallbackReason: resolved?.status ?? "fallback",
    });
  }
  return (
    <RightPanelFallback
      title={resolved?.title ?? "Panel"}
      message={resolved?.message ?? "This panel is waiting for more decision context."}
      suggestedActionLabel={suggestedActionLabel ?? resolved?.suggestedActionLabel ?? null}
      onSuggestedAction={onSuggestedAction}
    />
  );
}

function renderFallbackForView(
  view: RightPanelView,
  suggestedActionLabel: string | null,
  onSuggestedAction: (() => void) | null
) {
  const copy = view ? getRightPanelRegistryEntry(view) : null;
  if (process.env.NODE_ENV !== "production") {
    if (copy) {
      console.warn("[Nexora][PanelFallback]", {
        canonicalView: view,
        fallbackReason: "view_fallback",
      });
    } else {
      console.warn("[Nexora][AutoFixPanelRegistryMiss]", {
        canonicalView: view ?? null,
        reason: "unknown_view_bypassed_router",
      });
    }
  }
  return (
    <RightPanelFallback
      title={copy?.fallbackTitle ?? "Panel Unavailable"}
      message={
        copy?.fallbackMessage ??
        `Unknown panel: ${String(view ?? "unknown")}. Nexora kept your requested view and rendered a guarded fallback instead.`
      }
      suggestedActionLabel={suggestedActionLabel}
      onSuggestedAction={onSuggestedAction}
    />
  );
}

function hasRecommendationSignal(panelData: PanelSharedData | null | undefined) {
  const advice = panelData?.strategicAdvice as Record<string, unknown> | null | undefined;
  const recommendation = panelData?.canonicalRecommendation as Record<string, unknown> | null | undefined;
  const actions = advice?.recommended_actions;
  return Boolean(
    (Array.isArray(actions) && actions.length > 0) ||
      (typeof advice?.summary === "string" && advice.summary.trim().length > 0) ||
      (recommendation && typeof recommendation.summary === "string" && recommendation.summary.trim().length > 0)
  );
}

function getRiskSignalLevel(risk: unknown) {
  if (!risk || typeof risk !== "object") return 0;
  const record = risk as Record<string, unknown>;
  const directScore = [record.score, record.risk_score, record.level_score].find(
    (value) => typeof value === "number" && Number.isFinite(value)
  );
  if (typeof directScore === "number") return Math.max(0, Math.min(1, directScore));
  const level = typeof record.level === "string" ? record.level.toLowerCase() : "";
  if (level === "critical") return 1;
  if (level === "high") return 0.85;
  if (level === "medium") return 0.55;
  return 0;
}

function resolveFlowAction(view: RightPanelView, props: RightPanelHostProps) {
  if (view === "dashboard") return props.onOpenDashboard ?? props.onOpenStrategicCommand ?? null;
  if (view === "risk") return props.onOpenWarRoom ?? props.onOpenDashboard ?? null;
  if (view === "simulate") return props.onSimulateDecision ?? props.onOpenDashboard ?? null;
  if (view === "decision_council") return props.onOpenDecisionCouncil ?? props.onOpenDashboard ?? null;
  if (view === "war_room") return props.onOpenWarRoom ?? props.onOpenDashboard ?? null;
  if (view === "memory") return props.onOpenMemory ?? props.onOpenOrgMemory ?? props.onOpenDashboard ?? null;
  return props.onOpenDashboard ?? null;
}

function resolveViewFallbackAction(view: RightPanelView, props: RightPanelHostProps) {
  if (view === "risk" || view === "fragility") return props.onSimulateDecision ?? props.onOpenWarRoom ?? null;
  if (view === "timeline") return props.onSimulateDecision ?? props.onOpenTimeline ?? null;
  if (view === "compare") return props.onCompareOptions ?? null;
  if (view === "war_room") return props.onOpenWarRoom ?? props.onSimulateDecision ?? null;
  if (view === "decision_council") return props.onOpenDecisionCouncil ?? null;
  if (view === "decision_governance") return props.onOpenDecisionGovernance ?? null;
  if (view === "executive_approval") return props.onOpenExecutiveApproval ?? null;
  if (view === "decision_policy") return props.onOpenDecisionPolicy ?? null;
  if (view === "strategic_command") return props.onOpenStrategicCommand ?? null;
  if (view === "memory" || view === "org_memory") return props.onOpenMemory ?? props.onOpenOrgMemory ?? null;
  if (view === "workspace" || view === "object") return props.onOpenObject ? () => props.onOpenObject?.(props.selectedObjectId ?? null) : null;
  if (view === "simulate") return props.onSimulateDecision ?? null;
  if (view === "dashboard") return props.onOpenStrategicCommand ?? props.onOpenDashboard ?? null;
  return null;
}
