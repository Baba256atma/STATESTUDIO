"use client";

import React from "react";

import ConflictMapPanel from "../panels/ConflictMapPanel";
import ObjectSelectionPanel from "../panels/ObjectSelectionPanel";
import RiskPropagationPanel from "../panels/RiskPropagationPanel";
import { RiskExplanationPanel } from "../panels/RiskExplanationPanel";
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
import type { NexoraB18CompareResolved, NexoraB18SimulateResolved } from "../../lib/scenario/nexoraScenarioBuilder.ts";
import type { PanelResolvedData, PanelSharedData } from "../../lib/panels/panelDataResolverTypes";
import { validatePanelSharedDataWithDiagnostics } from "../../lib/panels/panelDataContract";
import { getPanelCognitiveFlow } from "../../lib/ui/right-panel/panelCognitiveFlow";
import { buildAdvicePanelPayload } from "./builders/buildAdvicePanelPayload";
import { buildConflictPanelPayload } from "./builders/buildConflictPanelPayload";
import { buildTimelinePanelPayload } from "./builders/buildTimelinePanelPayload";
import { buildDashboardPanelPayload } from "./builders/buildDashboardPanelPayload";
import { buildWarRoomPanelPayload } from "./builders/buildWarRoomPanelPayload";
import { normalizeWarRoomIntelligence } from "./normalizers/normalizeWarRoomIntelligence";
import { normalizeStrategicCouncilPanelData } from "./normalizers/normalizeStrategicCouncilPanelData";
import {
  buildCanonicalPanelPayload,
  buildMergedPanelData,
} from "../../lib/panels/panelDataAdapter";
import { peekPanelSelfDebugLink } from "../../lib/debug/debugCorrelationBridge";
import { emitDebugEvent, shouldEmitSelfDebug } from "../../lib/debug/debugEmit";
import { getRecentDebugEvents } from "../../lib/debug/debugEventStore";
import { emitGuardRailAlerts, runGuardChecks } from "../../lib/debug/debugGuardRails";
import { insightPanelHostFrame } from "../ui/nexoraTheme";
import { pickDecisionAnalysisFromResponse } from "../../lib/panels/buildScenarioExplanationFromDecisionAnalysis";
import { dedupeCaseFallbackLog } from "../../lib/debug/panelConsoleTraceDedupe";
const logConflictPayloadSource = (..._args: any[]) => {};
const logPanelDataUnderfed = (..._args: any[]) => {};
const logPanelFallback = (..._args: any[]) => {};
const logPanelFlow = (..._args: any[]) => {};
const logPanelPayloadSource = (..._args: any[]) => {};
const logPanelRender = (..._args: any[]) => {};
const logPanelRenderDeep = (..._args: any[]) => {};
const logPanelResolver = (..._args: any[]) => {};
const logRegistryMiss = (..._args: any[]) => {};
const logRenderGuardTrace = (..._args: any[]) => {};
const logRightPanelSafeRender = (..._args: any[]) => {};
const logRiskFlowRunSimulation = (..._args: any[]) => {};
const logUnsupportedViewFallback = (..._args: any[]) => {};

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
  guidedPromptDebug?: {
    prompt: string;
    resolvedPanel: RightPanelView;
    actualView: RightPanelView | null;
    contractSalvaged: boolean;
    contractRenderable: boolean;
  } | null;
  panelFamilyAuditDebug?: {
    prompt: string;
    expectedFamily: RightPanelView;
    source: string;
    contractRenderable?: boolean;
    contractSalvaged?: boolean;
  } | null;
  warRoom: WarRoomController;
  onSceneUpdateFromTimeline: (payload: any) => void;
  onSimulateDecision?: (() => void) | null;
  onRunContextualSimulation?: ((originView: RightPanelView) => void) | null;
  onCompareOptions?: (() => void) | null;
  onRunContextualCompare?: ((originView: RightPanelView) => void) | null;
  onOpenWarRoom?: (() => void) | null;
  onOpenContextualWarRoom?: ((originView: RightPanelView) => void) | null;
  onOpenRiskFlow?: ((originView: RightPanelView) => void) | null;
  onOpenWhyThis?: ((originView: RightPanelView) => void) | null;
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
  onOpenCenterComponent?: ((component: "compare" | "timeline" | "analysis") => void) | null;
  onPreviewDecision?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
  onSaveScenario?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
  onApplyDecisionSafe?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
};

type PanelDataReadiness = "empty" | "partial" | "full";

function traceViewSync(detail: {
  label:
    | "[Nexora][ViewSync] host_render"
    | "[Nexora][ViewSync] desync_detected"
    | "[Nexora][ViewSync] desync_fixed";
  activeTab: string | null;
  currentRightPanelView: string | null;
  renderedView: string | null;
  legacyTab: string | null;
  source: string;
  reason: string;
}) {
  return;
}

function shouldTracePayloadSelection(view: RightPanelView | null, panel: "advice" | "conflict" | "timeline" | "dashboard" | "war_room" | "risk"): boolean {
  if (panel === "advice") return view === "advice";
  if (panel === "conflict") return view === "conflict";
  if (panel === "timeline") {
    return (
      view === "timeline" ||
      view === "decision_timeline" ||
      view === "confidence_calibration" ||
      view === "outcome_feedback" ||
      view === "pattern_intelligence" ||
      view === "scenario_tree"
    );
  }
  if (panel === "dashboard") {
    return (
      view === "dashboard" ||
      view === "strategic_command" ||
      view === "decision_lifecycle" ||
      view === "strategic_learning" ||
      view === "meta_decision" ||
      view === "cognitive_style" ||
      view === "team_decision" ||
      view === "org_memory" ||
      view === "decision_governance" ||
      view === "decision_policy" ||
      view === "executive_approval" ||
      view === "decision_council" ||
      view === "collaboration_intelligence" ||
      view === "kpi"
    );
  }
  if (panel === "war_room") return view === "war_room";
  return view === "risk" || view === "fragility";
}

function isConcreteSelfRenderingView(
  view: RightPanelView | null
): view is "advice" | "timeline" | "war_room" | "risk" | "fragility" | "object" {
  return (
    view === "advice" ||
    view === "timeline" ||
    view === "war_room" ||
    view === "risk" ||
    view === "fragility" ||
    view === "object"
  );
}

function renderConcretePanelEmptyState(
  view: "advice" | "timeline" | "war_room",
  onSuggestedAction: (() => void) | null
) {
  if (view === "timeline") {
    return (
      <RightPanelFallback
        title="Timeline"
        message="No focused timeline yet. Run a simulation to see how the decision path unfolds."
        suggestedActionLabel="Run Simulation"
        onSuggestedAction={onSuggestedAction}
      />
    );
  }
  if (view === "advice") {
    return (
      <RightPanelFallback
        title="Advice"
        message="No strategic advice surface yet. Continue the analysis to populate recommendations."
        suggestedActionLabel="Review Context"
        onSuggestedAction={onSuggestedAction}
      />
    );
  }
  return (
    <RightPanelFallback
      title="War Room"
      message="War Room context is not loaded yet. Open the scenario to compare moves and constraints."
      suggestedActionLabel="Open War Room Context"
      onSuggestedAction={onSuggestedAction}
    />
  );
}

export function RightPanelHost(props: RightPanelHostProps) {
  const DEBUG_PANEL_TRACE = false;
  const viewToRender = props.rightPanelState.view;
  const panelStateEpoch = props.rightPanelState.timestamp ?? 0;
  const lastRenderViewSignatureRef = React.useRef<string | null>(null);
  const lastConcretePanelRenderSignatureRef = React.useRef<string | null>(null);
  const responseStrategicAdvice = props.responseData?.strategic_advice;
  const responseConflict = props.responseData?.conflict;
  const responseConflicts = props.responseData?.conflicts;
  const responseTimelineImpact = props.responseData?.timeline_impact;
  const responseSimulationTimeline = props.responseData?.decision_simulation?.timeline;
  const responseExecutiveSummary = props.responseData?.executive_summary_surface;
  const responseDecisionCockpit = props.responseData?.decision_cockpit;
  const sceneStrategicAdvice = props.sceneJson?.strategic_advice;
  const warRoomIntelligence = props.warRoom.intelligence;

  logPanelRender({
    view: viewToRender,
    isOpen: props.rightPanelState.isOpen,
    componentMatched: true,
    contextId: props.rightPanelState.contextId ?? null,
    timestamp: panelStateEpoch,
    hasData: Boolean(props.responseData ?? props.sceneJson ?? props.decisionResult ?? props.decisionMemoryEntries?.length),
  });

  const dashboardRecommendation = useCanonicalRecommendation(props.responseData ?? props.sceneJson ?? null);
  const warRoomRecommendation = useCanonicalRecommendation(props.warRoom.intelligence ?? null);
  const normalizedWarRoomPanelData = React.useMemo(
    () => normalizeWarRoomIntelligence(props.warRoom.intelligence),
    [props.warRoom.intelligence]
  );
  const normalizedStrategicCouncil = React.useMemo(
    () => normalizeStrategicCouncilPanelData(props.strategicCouncil),
    [props.strategicCouncil]
  );
  const aggregatedPanelData = React.useMemo<PanelSharedData>(
    () =>
      buildMergedPanelData({
        panelData: props.panelData,
        responseData: props.responseData,
        sceneJson: props.sceneJson,
        strategicAdvice: props.strategicAdvice,
        riskPropagation: props.riskPropagation,
        conflicts: props.conflicts,
        decisionResult: props.decisionResult,
        memoryInsights: props.memoryInsights,
        warRoomIntelligence: props.warRoom.intelligence,
        strategicCouncil: props.strategicCouncil,
        decisionCockpit: props.decisionCockpit,
        decisionMemoryEntries: props.decisionMemoryEntries,
        canonicalRecommendation: dashboardRecommendation,
        normalizedWarRoomPanelData,
        normalizedStrategicCouncil,
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
      normalizedWarRoomPanelData,
      normalizedStrategicCouncil,
      props.decisionMemoryEntries,
      dashboardRecommendation,
    ]
  );
  const panelContractValidation = React.useMemo(
    () => validatePanelSharedDataWithDiagnostics(aggregatedPanelData),
    [aggregatedPanelData]
  );
  const validatedPanelData = panelContractValidation.data;

  const lastHostPanelContractDebugSigRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!shouldEmitSelfDebug()) return;
    if (!panelContractValidation.contractFailed) return;
    const sig = panelContractValidation.contractDebugSignature;
    if (lastHostPanelContractDebugSigRef.current === sig) return;
    lastHostPanelContractDebugSigRef.current = sig;
    const detail = panelContractValidation.contractFailureDetail;
    if (!detail) return;
    emitDebugEvent({
      type: "contract_validation_failed",
      layer: "contract",
      source: "panelDataContract",
      status: "warn",
      message: `PanelSharedData validation failed (${detail.issueCount} issues); salvaged`,
      metadata: {
        issueCount: detail.issueCount,
        issuePaths: detail.issuePaths,
        rejectedSlices: detail.rejectedSlices,
        via: "RightPanelHost",
      },
    });
    emitGuardRailAlerts(runGuardChecks({ trigger: "contract_check" }, getRecentDebugEvents()));
  }, [panelContractValidation.contractFailed, panelContractValidation.contractDebugSignature]);
  const resolvedPanel = React.useMemo(
    () => (viewToRender && isResolverManagedView(viewToRender) ? buildPanelResolvedData(viewToRender, validatedPanelData) : null),
    [viewToRender, validatedPanelData]
  );
  const effectivePanelData = validatedPanelData;
  const basePanelPayload = React.useMemo(
    () =>
      buildCanonicalPanelPayload({
        panelData: effectivePanelData,
        responseData: props.responseData,
        sceneJson: props.sceneJson,
        strategicAdvice: props.strategicAdvice,
        canonicalRecommendation: dashboardRecommendation,
      }),
    [effectivePanelData, props.responseData, props.sceneJson, props.strategicAdvice, dashboardRecommendation]
  );
  const preserveConcreteSelfRenderingView = isConcreteSelfRenderingView(viewToRender);
  function traceConcretePanelRender(usedSamePanelEmptyState: boolean) {
    if (process.env.NODE_ENV === "production") return;
    if (!isConcreteSelfRenderingView(viewToRender)) return;
    if (!usedSamePanelEmptyState) return;
    const signature = [
      props.rightPanelState.view ?? "null",
      viewToRender ?? "null",
      "1",
    ].join("|");
    if (lastConcretePanelRenderSignatureRef.current === signature) return;
    lastConcretePanelRenderSignatureRef.current = signature;
    globalThis.console.log("[Nexora][ConcretePanelEmptyState]", {
      panel: viewToRender ?? null,
    });
  }
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const signature = [
      props.rightPanelState.view ?? "null",
      viewToRender ?? "null",
    ].join("|");
    if (lastRenderViewSignatureRef.current === signature) {
      return;
    }
    lastRenderViewSignatureRef.current = signature;
    globalThis.console.log("[NEXORA][HOST_RENDER]", {
      requested: props.rightPanelState.view ?? null,
      rendered: viewToRender ?? null,
    });
  }, [props.rightPanelState.view, viewToRender]);
  const bestResolvedPanel = resolvedPanel;
  const bestResolvedPanelData = bestResolvedPanel?.data ?? null;
  const bestResolvedPanelRecord =
    bestResolvedPanelData && typeof bestResolvedPanelData === "object" && !Array.isArray(bestResolvedPanelData)
      ? (bestResolvedPanelData as Record<string, unknown>)
      : null;
  const bestResolvedPanelStatus = bestResolvedPanel?.status ?? null;
  const bestResolvedPanelReadiness = React.useMemo(
    () => getResolvedPanelReadiness(viewToRender, bestResolvedPanel),
    [viewToRender, bestResolvedPanel]
  );
  const hasRenderableBestResolvedPanel = React.useMemo(
    () => hasRenderableResolvedPanelData(viewToRender, bestResolvedPanel),
    [viewToRender, bestResolvedPanel]
  );
  const cognitiveFlow = React.useMemo(
    () =>
      getPanelCognitiveFlow({
        currentView: viewToRender,
        panelData: effectivePanelData,
        context: {
          intent:
            typeof props.responseData?.ai_reasoning?.intent === "string"
              ? props.responseData.ai_reasoning.intent
              : undefined,
          riskLevel: getRiskSignalLevel(effectivePanelData.risk ?? props.riskPropagation ?? null),
          hasSimulation: Boolean(effectivePanelData.simulation ?? props.responseData?.decision_simulation),
          hasRecommendation: hasRecommendationSignal(effectivePanelData, props.responseData, props.sceneJson),
          hasDecision: Boolean(props.decisionResult ?? effectivePanelData.approval ?? effectivePanelData.policy),
          hasOutcome: Boolean(props.decisionMemoryEntries?.length),
        },
      }),
    [
      viewToRender,
      effectivePanelData,
      props.responseData,
      props.riskPropagation,
      props.decisionResult,
      props.decisionMemoryEntries,
      props.sceneJson,
    ]
  );
  const handleRiskFlowRunSimulation = React.useCallback(() => {
    logRiskFlowRunSimulation(viewToRender);
    props.onSimulateDecision?.();
  }, [viewToRender, props.onSimulateDecision]);
  const handleContextualSimulationAction = React.useCallback(() => {
    props.onSimulateDecision?.();
  }, [props.onSimulateDecision]);
  const handleContextualCompareAction = React.useCallback(() => {
    props.onCompareOptions?.();
  }, [props.onCompareOptions]);
  const handleContextualWarRoomAction = React.useCallback(() => {
    props.onOpenWarRoom?.();
  }, [props.onOpenWarRoom]);
  const handleContextualRiskFlowAction = React.useCallback(() => {
    props.onOpenRiskFlow?.(viewToRender);
  }, [props.onOpenRiskFlow, viewToRender]);
  const handleContextualWhyThisAction = React.useCallback(() => {
    props.onOpenWhyThis?.(viewToRender);
  }, [props.onOpenWhyThis, viewToRender]);
  const resolvedPanelData =
    bestResolvedPanelData ??
    null;
  const effectiveAdvicePayload = React.useMemo(() => {
    const { payload, sourceFlags } = buildAdvicePanelPayload({
      currentView: viewToRender,
      resolvedPanelData,
      canonicalAdvice: effectivePanelData.advice,
      canonicalStrategicAdvice: effectivePanelData.strategicAdvice,
      rawStrategicAdvice: props.strategicAdvice,
      responseStrategicAdvice,
      sceneStrategicAdvice,
    });
    logPanelPayloadSource("advice", viewToRender, {
      usedResolved: sourceFlags.usedResolved,
      usedCanonical: sourceFlags.usedCanonical,
      usedRaw: sourceFlags.usedRaw,
    });
    return payload;
  }, [
    viewToRender,
    resolvedPanelData,
    effectivePanelData.advice,
    effectivePanelData.strategicAdvice,
    props.strategicAdvice,
    responseStrategicAdvice,
    sceneStrategicAdvice,
  ]);
  const effectiveConflictPayload = React.useMemo(() => {
    const { payload, sourceFlags } = buildConflictPanelPayload({
      currentView: viewToRender,
      resolvedPanelData,
      canonicalConflict: effectivePanelData.conflict,
      responseConflict,
      responseConflicts,
      legacyConflicts: props.conflicts,
    });
    logConflictPayloadSource(viewToRender, sourceFlags);
    return payload;
  }, [viewToRender, resolvedPanelData, effectivePanelData.conflict, responseConflict, responseConflicts, props.conflicts]);
  const effectiveTimelinePayload = React.useMemo(() => {
    const { payload, sourceFlags } = buildTimelinePanelPayload({
      currentView: viewToRender,
      resolvedPanelData,
      canonicalTimeline: effectivePanelData.timeline,
      rawTimelineImpact: responseTimelineImpact,
      rawSimulationTimeline: responseSimulationTimeline,
      canonicalPanelPayload: basePanelPayload,
      advicePayload: effectiveAdvicePayload,
      fallbackStrategicAdvice: basePanelPayload.strategic_advice,
    });
    logPanelPayloadSource("timeline", viewToRender, {
      usedResolved: sourceFlags.usedResolved,
      usedCanonical: sourceFlags.usedCanonical,
      usedRaw: sourceFlags.usedRaw,
    });
    return payload;
  }, [
    viewToRender,
    resolvedPanelData,
    effectivePanelData.timeline,
    responseTimelineImpact,
    responseSimulationTimeline,
    basePanelPayload,
    effectiveAdvicePayload,
  ]);
  const effectiveDashboardPayload = React.useMemo(() => {
    const { payload, sourceFlags } = buildDashboardPanelPayload({
      currentView: viewToRender,
      resolvedPanelData,
      dashboard: effectivePanelData.dashboard,
      decisionCockpitSlice: effectivePanelData.decisionCockpit,
      executiveSummary: effectivePanelData.executiveSummary,
      rawExecutiveSummary: responseExecutiveSummary,
      rawDecisionCockpit: responseDecisionCockpit,
      canonicalPanelPayload: basePanelPayload,
      decisionCockpit: props.decisionCockpit,
      advicePayload: effectiveAdvicePayload,
      fallbackStrategicAdvice: basePanelPayload.strategic_advice,
      conflictPayload: effectiveConflictPayload,
      responseConflict,
      responseConflicts,
      legacyConflicts: props.conflicts,
    });
    logPanelPayloadSource("dashboard", viewToRender, {
      usedResolved: sourceFlags.usedResolved,
      usedCanonical: sourceFlags.usedCanonical,
      usedRaw: sourceFlags.usedRaw,
    });
    return payload;
  }, [
    viewToRender,
    resolvedPanelData,
    effectivePanelData.dashboard,
    effectivePanelData.decisionCockpit,
    effectivePanelData.executiveSummary,
    responseExecutiveSummary,
    responseDecisionCockpit,
    basePanelPayload,
    props.decisionCockpit,
    effectiveAdvicePayload,
    effectiveConflictPayload,
    responseConflict,
    responseConflicts,
    props.conflicts,
  ]);
  const effectiveWarRoomPayload = React.useMemo(() => {
    const { payload, sourceFlags } = buildWarRoomPanelPayload({
      currentView: viewToRender,
      resolvedPanelData,
      warRoom: effectivePanelData.warRoom,
      strategicCouncil: effectivePanelData.strategicCouncil,
      canonicalRecommendation: effectivePanelData.canonicalRecommendation,
      normalizedWarRoomPanelData,
      rawWarRoomIntelligence: warRoomIntelligence,
      canonicalPanelPayload: basePanelPayload,
      advicePayload: effectiveAdvicePayload,
      fallbackStrategicAdvice: basePanelPayload.strategic_advice,
      warRoomRecommendation,
      dashboardRecommendation,
    });
    logPanelPayloadSource("war_room", viewToRender, {
      usedResolved: sourceFlags.usedResolved,
      usedCanonical: sourceFlags.usedCanonical,
      usedRaw: sourceFlags.usedRaw,
    });
    return payload;
  }, [
    viewToRender,
    resolvedPanelData,
    effectivePanelData.warRoom,
    effectivePanelData.strategicCouncil,
    effectivePanelData.canonicalRecommendation,
    normalizedWarRoomPanelData,
    warRoomIntelligence,
    basePanelPayload,
    effectiveAdvicePayload,
    warRoomRecommendation,
    dashboardRecommendation,
  ]);
  const effectiveRiskPayload = React.useMemo(() => {
    const resolvedRecord = asLooseRecord(bestResolvedPanelData);
    const payload =
      (viewToRender === "fragility"
        ? effectivePanelData.fragility ?? effectivePanelData.risk
        : effectivePanelData.risk ?? effectivePanelData.fragility) ??
      (viewToRender === "fragility"
        ? resolvedRecord ?? props.riskPropagation ?? props.sceneJson?.risk_propagation ?? props.sceneJson?.scene?.risk_propagation ?? null
        : resolvedRecord ?? props.riskPropagation ?? props.sceneJson?.risk_propagation ?? props.sceneJson?.scene?.risk_propagation ?? null);
    return payload;
  }, [
    bestResolvedPanelData,
    effectivePanelData.fragility,
    effectivePanelData.risk,
    viewToRender,
    props.riskPropagation,
    props.sceneJson,
  ]);

  const fragilityScanFallbackUi = React.useMemo(
    () => (
      <RightPanelFallback
        title="Fragility"
        message="No fragility scan is available yet. Run analysis to inspect system fragility."
        suggestedActionLabel="Run Simulation"
        onSuggestedAction={handleRiskFlowRunSimulation}
      />
    ),
    [handleRiskFlowRunSimulation]
  );

  const riskPanelEmptyFallbackUi = React.useMemo(
    () => (
      <RightPanelFallback
        title="Risk"
        message="No risk propagation is available yet. Run analysis or simulation to inspect exposure."
        suggestedActionLabel="Run Simulation"
        onSuggestedAction={handleRiskFlowRunSimulation}
      />
    ),
    [handleRiskFlowRunSimulation]
  );

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production" && viewToRender !== props.rightPanelState.view) {
      globalThis.console.error("[NEXORA][ILLEGAL_OVERRIDE]", {
        requested: props.rightPanelState.view ?? null,
        rendered: viewToRender ?? null,
      });
      const hostLink = peekPanelSelfDebugLink();
      emitDebugEvent({
        type: "debug_warning",
        layer: "host",
        source: "RightPanelHost",
        status: "error",
        message: "Host render view differs from panel state view",
        metadata: {
          code: "host_render_mismatch",
          requested: props.rightPanelState.view ?? null,
          rendered: viewToRender ?? null,
          ...(hostLink
            ? {
                panelCorrelationId: hostLink.panelCorrelationId,
                ...(hostLink.chatCorrelationId ? { chatCorrelationId: hostLink.chatCorrelationId } : {}),
              }
            : {}),
        },
        correlationId: hostLink?.panelCorrelationId ?? undefined,
      });
    }
  }, [props.rightPanelState.view, viewToRender]);

  const lastHostDebugSignatureRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!shouldEmitSelfDebug()) return;
    if (!props.rightPanelState.isOpen) return;
    const requested = props.rightPanelState.view ?? null;
    const rendered = viewToRender ?? null;
    const signature = `${requested ?? "null"}|${rendered ?? "null"}|${hasRenderableBestResolvedPanel ? "1" : "0"}`;
    if (lastHostDebugSignatureRef.current === signature) return;
    lastHostDebugSignatureRef.current = signature;

    const hostLink = peekPanelSelfDebugLink();
    const hostLinkMeta = hostLink
      ? {
          panelCorrelationId: hostLink.panelCorrelationId,
          ...(hostLink.chatCorrelationId ? { chatCorrelationId: hostLink.chatCorrelationId } : {}),
          linkRequestedView: hostLink.requestedView,
          linkRawSource: hostLink.rawSource,
        }
      : {};

    if (!rendered) {
      emitDebugEvent({
        type: "panel_fallback_used",
        layer: "host",
        source: "RightPanelHost",
        status: "warn",
        message: "No panel target in host; guarded fallback",
        metadata: {
          reason: "no_panel_target",
          requestedView: requested,
          ...hostLinkMeta,
        },
        correlationId: hostLink?.panelCorrelationId ?? undefined,
      });
      return;
    }

    emitDebugEvent({
      type: "panel_rendered",
      layer: "host",
      source: "RightPanelHost",
      status: "ok",
      message: `Rendering panel ${rendered}`,
      metadata: {
        view: rendered,
        requestedView: requested,
        hasRenderableResolved: hasRenderableBestResolvedPanel,
        ...hostLinkMeta,
      },
      correlationId: hostLink?.panelCorrelationId ?? undefined,
    });
  }, [
    props.rightPanelState.isOpen,
    props.rightPanelState.view,
    viewToRender,
    hasRenderableBestResolvedPanel,
  ]);

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

  // Important: keep all hooks above this point.
  // Conditional returns below preserve React hook order stability.
  if (!props.rightPanelState.isOpen) {
    return null;
  }

  if (!viewToRender) {
    return (
      <RightPanelFallback
        title="No focused insight yet"
        message="Select a view from the executive rail or continue your analysis to open a matching insight."
        suggestedActionLabel={cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null}
        onSuggestedAction={null}
      />
    );
  }

  return (
    <div style={insightPanelHostFrame}>
      {(() => {
        switch (viewToRender) {
    case "strategic_command":
      if (shouldRenderResolvedFallback(bestResolvedPanel)) {
        return renderResolvedFallback(
          bestResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          null
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
                handleContextualCompareAction();
                return;
              }
              if (view === "simulate") {
                handleContextualSimulationAction();
                return;
              }
              props.onOpenDashboard?.();
              return;
            }
            if (view === "timeline") return props.onOpenTimeline?.();
            if (view === "war_room") return handleContextualWarRoomAction();
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
      if (props.onOpenCenterComponent) {
        return (
          <RightPanelFallback
            title="Decision Timeline"
            message="Timeline summary is available in this rail. Open the center workspace for the full timeline view."
            suggestedActionLabel="View Timeline"
            onSuggestedAction={() => props.onOpenCenterComponent?.("timeline")}
          />
        );
      }
      if (shouldRenderResolvedFallback(bestResolvedPanel)) {
        dedupeCaseFallbackLog("timeline", "resolved_panel_fallback", {
          readiness: bestResolvedPanelReadiness,
          hasRenderable: hasRenderableBestResolvedPanel,
        });
        traceConcretePanelRender(true);
        return renderConcretePanelEmptyState("timeline", props.onSimulateDecision ?? null);
      }
      if (!hasRenderableBestResolvedPanel && props.decisionStatus !== "loading" && props.decisionStatus !== "error") {
        dedupeCaseFallbackLog("timeline", "resolved_panel_not_renderable", {
          readiness: bestResolvedPanelReadiness,
          decisionStatus: props.decisionStatus ?? null,
        });
        traceConcretePanelRender(true);
        return renderConcretePanelEmptyState("timeline", props.onSimulateDecision ?? null);
      }
      traceConcretePanelRender(false);
      return (
        <DecisionTimelinePanel
          responseData={effectiveTimelinePayload}
          strategicAdvice={effectiveAdvicePayload}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? undefined}
          decisionLoading={props.decisionLoading ?? false}
          decisionStatus={props.decisionStatus ?? "idle"}
          decisionError={props.decisionError ?? null}
          resolveObjectLabel={props.resolveObjectLabel ?? null}
          onCompareOptions={handleContextualCompareAction}
          onSimulateDecision={handleContextualSimulationAction}
          onReturnToWarRoom={handleContextualWarRoomAction}
        />
      );
    case "decision_lifecycle":
      if (!hasDecisionContext) {
        dedupeCaseFallbackLog("decision_lifecycle", "missing_decision_context", {});
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
          onOpenDecisionTimeline={handleContextualWhyThisAction}
          onOpenOutcomeFeedback={props.onOpenOutcomeFeedback ?? null}
          onOpenCompare={handleContextualCompareAction}
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
          onOpenCompare={handleContextualCompareAction}
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
          onOpenCompare={handleContextualCompareAction}
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
          onOpenCompare={handleContextualCompareAction}
          onOpenTimeline={props.onOpenTimeline ?? null}
          onOpenWarRoom={handleContextualWarRoomAction}
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
      if (shouldRenderResolvedFallback(bestResolvedPanel)) {
        return renderResolvedFallback(
          bestResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          null
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
          onOpenCompare={handleContextualCompareAction}
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
      if (shouldRenderResolvedFallback(bestResolvedPanel)) {
        return renderResolvedFallback(
          bestResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          null
        );
      }
      return (
        <DecisionGovernancePanel
          responseData={props.responseData ?? props.sceneJson ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? null}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onOpenCompare={handleContextualCompareAction}
          onOpenTimeline={props.onOpenTimeline ?? null}
          onOpenTeamDecision={props.onOpenTeamDecision ?? null}
        />
      );
    case "decision_policy":
      if (shouldRenderResolvedFallback(bestResolvedPanel)) {
        return renderResolvedFallback(
          bestResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          null
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
          onOpenCompare={handleContextualCompareAction}
          onOpenTimeline={props.onOpenTimeline ?? null}
        />
      );
    case "executive_approval":
      if (shouldRenderResolvedFallback(bestResolvedPanel)) {
        return renderResolvedFallback(
          bestResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          null
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
          onOpenCompare={handleContextualCompareAction}
          onOpenDecisionGovernance={props.onOpenDecisionGovernance ?? null}
          onOpenTimeline={props.onOpenTimeline ?? null}
        />
      );
    case "decision_timeline":
      if (!hasRenderableBestResolvedPanel && !hasDecisionContext) {
        dedupeCaseFallbackLog("decision_timeline", "missing_decision_context", {});
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
          onOpenDecisionTimeline={handleContextualWhyThisAction}
        />
      );
    case "pattern_intelligence":
      return (
        <DecisionPatternIntelligencePanel
          canonicalRecommendation={dashboardRecommendation}
          memoryEntries={props.decisionMemoryEntries ?? []}
          onOpenMemory={props.onOpenMemory ?? null}
          onOpenCompare={handleContextualCompareAction}
          onOpenConfidenceCalibration={props.onOpenConfidenceCalibration ?? null}
        />
      );
    case "explanation":
      return (
        <RiskExplanationPanel
          responseData={props.responseData}
          sceneJson={props.sceneJson}
          selectedObjectId={props.selectedObjectId ?? props.focusedId ?? null}
          selectedObjectLabel={props.selectedObjectLabel ?? null}
          canonicalRecommendation={dashboardRecommendation}
          decisionResult={props.decisionResult ?? null}
          onSimulateDecision={props.onSimulateDecision ?? null}
          onApplyDecisionSafe={props.onApplyDecisionSafe ?? null}
        />
      );
    case "conflict":
      return <ConflictMapPanel conflicts={effectiveConflictPayload} />;
    case "object":
      if (props.rightPanelState.contextId ?? props.selectedObjectId ?? props.focusedId) {
        return <ObjectSelectionPanel selection={props.objectSelection ?? props.sceneJson?.object_selection ?? null} />;
      }
      dedupeCaseFallbackLog("object", "missing_object_context", {
        contextId: props.rightPanelState.contextId ?? null,
        selectedObjectId: props.selectedObjectId ?? null,
      });
      return (
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
          onOpenCompare={handleContextualCompareAction}
          onOpenWarRoom={handleContextualWarRoomAction}
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
          onOpenCompare={handleContextualCompareAction}
          onOpenTimeline={props.onOpenTimeline ?? null}
          onOpenWarRoom={handleContextualWarRoomAction}
          onOpenObject={props.onOpenObject ?? null}
        />
      );
    case "risk":
      if (hasRenderableRiskPayload(effectiveRiskPayload)) {
        return (
        <RiskPropagationPanel
          risk={effectiveRiskPayload}
          showRiskFlowEntry
          onOpenRiskFlow={handleContextualRiskFlowAction}
        />
        );
      }
      dedupeCaseFallbackLog("risk", "risk_payload_not_renderable", riskPayloadFallbackSignature(effectiveRiskPayload));
      return riskPanelEmptyFallbackUi;
    case "fragility":
      if (hasRenderableRiskPayload(effectiveRiskPayload)) {
        return (
        <RiskPropagationPanel
          risk={effectiveRiskPayload}
          showRiskFlowEntry={false}
        />
        );
      }
      dedupeCaseFallbackLog("fragility", "fragility_payload_not_renderable", riskPayloadFallbackSignature(effectiveRiskPayload));
      return fragilityScanFallbackUi;
    case "replay":
      return (
        <DecisionReplayPanel
          backendBase={props.backendBase}
          episodeId={props.episodeId}
          onSceneUpdate={props.onSceneUpdateFromTimeline}
        />
      );
    case "advice":
      if (shouldRenderResolvedFallback(bestResolvedPanel) || !hasRenderableBestResolvedPanel) {
        dedupeCaseFallbackLog(
          "advice",
          shouldRenderResolvedFallback(bestResolvedPanel) ? "resolved_panel_fallback" : "resolved_panel_not_renderable",
          {
            readiness: bestResolvedPanelReadiness,
            hasRenderable: hasRenderableBestResolvedPanel,
            resolvedFallback: shouldRenderResolvedFallback(bestResolvedPanel),
          }
        );
        traceConcretePanelRender(true);
        return renderConcretePanelEmptyState(
          "advice",
          null
        );
      }
      traceConcretePanelRender(false);
      return (
        <StrategicAdvicePanel
          data={effectivePanelData}
          advice={effectiveAdvicePayload}
          canonicalRecommendation={dashboardRecommendation}
        />
      );
    case "opponent":
      return <OpponentMovesPanel model={props.opponentModel ?? props.sceneJson?.opponent_model ?? null} />;
    case "patterns":
      return <StrategicPatternsPanel patterns={props.strategicPatterns ?? props.sceneJson?.strategic_patterns ?? null} />;
    case "dashboard":
    case "simulate":
      if ((viewToRender === "dashboard" || viewToRender === "simulate") && shouldRenderResolvedFallback(bestResolvedPanel)) {
        dedupeCaseFallbackLog(viewToRender ?? "unknown", "resolved_panel_fallback", {
          readiness: bestResolvedPanelReadiness,
        });
        return renderResolvedFallback(
          bestResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          null
        );
      }
      if (!hasRenderableBestResolvedPanel && !hasDecisionContext && viewToRender === "simulate") {
        dedupeCaseFallbackLog("simulate", "missing_decision_context", { hasDecisionContext });
        return (
          <RightPanelFallback
            title="Simulation"
            message="No simulation available yet. Run a scenario to generate results."
            suggestedActionLabel="Run Simulation"
            onSuggestedAction={handleContextualSimulationAction}
          />
        );
      }
      if (!hasRenderableBestResolvedPanel && !hasDecisionContext && viewToRender === "dashboard") {
        dedupeCaseFallbackLog("dashboard", "missing_decision_context", { hasDecisionContext });
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
          responseData={effectiveDashboardPayload}
          activeMode={props.activeMode}
          conflicts={Array.isArray(effectiveConflictPayload) ? effectiveConflictPayload : props.conflicts ?? undefined}
          objectSelection={props.objectSelection ?? undefined}
          riskPropagation={props.riskPropagation ?? undefined}
          decisionMemoryEntries={props.decisionMemoryEntries ?? undefined}
          strategicAdvice={effectiveAdvicePayload ?? undefined}
          strategicCouncil={props.strategicCouncil ?? undefined}
          decisionImpact={props.decisionImpact ?? undefined}
          decisionCockpit={(effectivePanelData.decisionCockpit ?? props.decisionCockpit) ?? undefined}
          canonicalRecommendation={dashboardRecommendation}
          selectedObjectLabel={props.selectedObjectLabel}
          resolveObjectLabel={props.resolveObjectLabel ?? null}
          demoProfile={props.demoProfile ?? undefined}
          decisionResult={props.decisionResult ?? undefined}
          decisionLoading={props.decisionLoading ?? false}
          decisionStatus={props.decisionStatus ?? "idle"}
          decisionError={props.decisionError ?? null}
          activeExecutiveView={viewToRender === "simulate" ? "simulate" : props.activeExecutiveView ?? "dashboard"}
          nexoraB8PanelContext={effectivePanelData.nexoraB8PanelContext ?? null}
          onSimulateDecision={handleContextualSimulationAction}
          onCompareOptions={handleContextualCompareAction}
          onOpenWarRoom={handleContextualWarRoomAction}
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
          onOpenDecisionTimeline={handleContextualWhyThisAction}
          onOpenConfidenceCalibration={props.onOpenConfidenceCalibration ?? null}
          onOpenOutcomeFeedback={props.onOpenOutcomeFeedback ?? null}
          onOpenPatternIntelligence={props.onOpenPatternIntelligence ?? null}
          onPreviewDecision={props.onPreviewDecision ?? null}
          onSaveScenario={props.onSaveScenario ?? null}
          onApplyDecisionSafe={props.onApplyDecisionSafe ?? null}
          nexoraB18Simulate={
            viewToRender === "simulate"
              ? ((bestResolvedPanelRecord?.nexoraB18Simulate as NexoraB18SimulateResolved | undefined) ?? null)
              : null
          }
        />
      );
    case "compare":
      if (props.onOpenCenterComponent) {
        return (
          <RightPanelFallback
            title="Compare Options"
            message="Comparison highlights are available here. Open the center workspace for deep multi-option analysis."
            suggestedActionLabel="Open Compare"
            onSuggestedAction={() => props.onOpenCenterComponent?.("compare")}
          />
        );
      }
      if (shouldRenderResolvedFallback(bestResolvedPanel)) {
        dedupeCaseFallbackLog("compare", "resolved_panel_fallback", { readiness: bestResolvedPanelReadiness });
        return renderResolvedFallback(
          bestResolvedPanel,
          cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null,
          null
        );
      }
      if (!hasRenderableBestResolvedPanel && !hasDecisionContext && props.decisionStatus !== "loading" && props.decisionStatus !== "error") {
        dedupeCaseFallbackLog("compare", "missing_decision_context", {
          hasDecisionContext,
          decisionStatus: props.decisionStatus ?? null,
        });
        return (
          <RightPanelFallback
            title="Compare Options"
            message="No comparison data is available yet. Compare options after analysis."
            suggestedActionLabel="Compare Options"
            onSuggestedAction={handleContextualCompareAction}
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
          onApplyRecommended={handleContextualSimulationAction}
          onSimulateDeeper={handleContextualSimulationAction}
          onViewRiskFlow={handleContextualRiskFlowAction}
          onViewScenarioTree={props.onOpenScenarioTree ?? null}
          onOpenDecisionTimeline={handleContextualWhyThisAction}
          onPreviewDecision={props.onPreviewDecision ?? null}
          onSaveScenario={props.onSaveScenario ?? null}
          onApplyDecisionSafe={props.onApplyDecisionSafe ?? null}
          onOpenDecisionPolicy={props.onOpenDecisionPolicy ?? null}
          onOpenExecutiveApproval={props.onOpenExecutiveApproval ?? null}
          resolveObjectLabel={props.resolveObjectLabel ?? null}
          nexoraB8PanelContext={effectivePanelData.nexoraB8PanelContext ?? null}
          nexoraB18Compare={
            (bestResolvedPanelRecord?.nexoraB18Compare as NexoraB18CompareResolved | undefined) ?? null
          }
        />
      );
    case "war_room":
      if (shouldRenderResolvedFallback(bestResolvedPanel)) {
        dedupeCaseFallbackLog("war_room", "resolved_panel_fallback", { readiness: bestResolvedPanelReadiness });
        traceConcretePanelRender(true);
        return renderConcretePanelEmptyState("war_room", handleContextualWarRoomAction);
      }
      if (!hasRenderableBestResolvedPanel) {
        dedupeCaseFallbackLog("war_room", "resolved_panel_not_renderable", {
          readiness: bestResolvedPanelReadiness,
        });
        traceConcretePanelRender(true);
        return (
          renderConcretePanelEmptyState("war_room", handleContextualWarRoomAction)
        );
      }
      traceConcretePanelRender(false);
      return (
        <WarRoomPanel
          controller={props.warRoom}
          intelligence={effectiveWarRoomPayload as Record<string, unknown> | null}
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
          onSimulateDecision={handleContextualSimulationAction}
          onCompareOptions={handleContextualCompareAction}
          onOpenDecisionTimeline={handleContextualWhyThisAction}
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
      dedupeCaseFallbackLog("kpi", "missing_kpi_analysis", {});
      return (
        <RightPanelFallback
          title="KPI"
          message="No KPI readout is available yet. Run an analysis to surface executive metrics here."
          suggestedActionLabel="Review Advice"
          onSuggestedAction={props.onOpenStrategicCommand ?? null}
        />
      );
    default:
      logUnsupportedViewFallback(viewToRender);
      return (
        <RightPanelFallback
          title="No focused insight yet"
          message="Select a scenario or question from the rail to open a matching executive view."
          suggestedActionLabel={null}
          onSuggestedAction={null}
        />
      );
        }
      })()}
    </div>
  );
}

function isResolverManagedView(view: RightPanelView): view is Exclude<RightPanelView, null> {
  return (
    view === "advice" ||
    view === "dashboard" ||
    view === "simulate" ||
    view === "conflict" ||
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

function getResolvedPanelReadiness(
  view: RightPanelView,
  resolved: PanelResolvedData | null
): PanelDataReadiness {
  if (!resolved || shouldRenderResolvedFallback(resolved)) {
    return "empty";
  }

  const data = resolved.data;
  if (Array.isArray(data)) {
    return data.length > 0 ? "partial" : "empty";
  }

  const record = asLooseRecord(data);
  if (!record) {
    return data ? "partial" : "empty";
  }

  const keys = Object.keys(record);
  if (!keys.length) {
    return "empty";
  }

  const hasText = (...fields: string[]) =>
    fields.some((field) => typeof record[field] === "string" && String(record[field]).trim().length > 0);
  const hasArray = (...fields: string[]) =>
    fields.some((field) => Array.isArray(record[field]) && (record[field] as unknown[]).length > 0);
  const hasNestedText = (field: string, nestedField: string) => {
    const nested = asLooseRecord(record[field]);
    return typeof nested?.[nestedField] === "string" && String(nested[nestedField]).trim().length > 0;
  };

  if (view === "advice") {
    if (
      hasArray("recommended_actions", "recommendations") ||
      hasText("summary", "title", "recommendation", "action", "why", "risk_summary") ||
      hasNestedText("primary_recommendation", "summary") ||
      hasNestedText("primary_recommendation", "action")
    ) {
      return hasArray("recommended_actions", "recommendations") ? "full" : "partial";
    }
    return "partial";
  }

  if (view === "timeline") {
    if (
      hasArray("events", "steps", "stages", "timeline", "markers", "phases") ||
      hasText("summary", "headline", "immediate", "near_term", "label")
    ) {
      return hasArray("events", "steps", "stages", "timeline", "markers", "phases") ? "full" : "partial";
    }
    return "partial";
  }

  if (view === "dashboard" || view === "war_room" || view === "strategic_command") {
    if (
      hasArray("options", "compare", "decision_blocks", "priorities", "risks", "recommended_actions") ||
      hasText(
        "summary",
        "headline",
        "recommendation",
        "action",
        "what_to_do",
        "why_it_matters",
        "happened",
        "rationale",
        "posture",
        "simulation_summary",
        "compare_summary",
        "executive_summary"
      )
    ) {
      return hasArray("options", "compare", "decision_blocks", "priorities", "risks", "recommended_actions")
        ? "full"
        : "partial";
    }
    return "partial";
  }

  if (view === "simulate") {
    const b18 = asLooseRecord(record.nexoraB18Simulate);
    if (b18 && Array.isArray(b18.variants) && (b18.variants as unknown[]).length > 0) {
      return "partial";
    }
    if (
      hasArray("options", "compare", "decision_blocks", "priorities", "risks", "recommended_actions") ||
      hasText(
        "summary",
        "headline",
        "recommendation",
        "action",
        "what_to_do",
        "why_it_matters",
        "happened",
        "rationale",
        "posture",
        "simulation_summary",
        "compare_summary",
        "executive_summary"
      )
    ) {
      return hasArray("options", "compare", "decision_blocks", "priorities", "risks", "recommended_actions")
        ? "full"
        : "partial";
    }
    return "partial";
  }

  if (view === "compare") {
    const b18c = asLooseRecord(record.nexoraB18Compare);
    if (b18c && Array.isArray(b18c.variants) && (b18c.variants as unknown[]).length > 0) {
      return "partial";
    }
    if (hasArray("options", "comparison") || hasText("summary", "recommendation", "rationale")) {
      return hasArray("options", "comparison") ? "full" : "partial";
    }
    return "partial";
  }

  if (view === "conflict") {
    if (hasArray("conflicts", "tradeoffs", "tensions", "conflict_points") || hasText("summary", "headline", "posture")) {
      return hasArray("conflicts", "tradeoffs", "tensions", "conflict_points") ? "full" : "partial";
    }
    return "partial";
  }

  if (view === "decision_governance" || view === "decision_policy" || view === "executive_approval" || view === "decision_council") {
    if (hasText("summary", "recommendation", "status", "what_to_do", "why_it_matters") || hasArray("options")) {
      return hasArray("options") ? "full" : "partial";
    }
    return "partial";
  }

  return keys.length > 0 ? "partial" : "empty";
}

function hasRenderableResolvedPanelData(
  view: RightPanelView,
  resolved: PanelResolvedData | null
) {
  return getResolvedPanelReadiness(view, resolved) !== "empty";
}

function hasRenderableRiskPayload(risk: unknown) {
  const record = asLooseRecord(risk);
  if (!record) return false;
  const edges = Array.isArray(record.edges) ? record.edges : [];
  const drivers = Array.isArray(record.drivers) ? record.drivers : [];
  const sources = Array.isArray(record.sources) ? record.sources : [];
  const summary = typeof record.summary === "string" ? record.summary.trim() : "";
  const level = typeof record.level === "string" ? record.level.trim() : "";
  const riskLevel = typeof record.risk_level === "string" ? record.risk_level.trim() : "";
  return edges.length > 0 || drivers.length > 0 || sources.length > 0 || summary.length > 0 || level.length > 0 || riskLevel.length > 0;
}

/** Stable semantic signature for CASE_FALLBACK dedupe when risk/fragility payload is thin or empty. */
function riskPayloadFallbackSignature(risk: unknown): Record<string, unknown> {
  const record = asLooseRecord(risk);
  if (!record) return { shape: "none" };
  const edges = Array.isArray(record.edges) ? record.edges.length : 0;
  const drivers = Array.isArray(record.drivers) ? record.drivers.length : 0;
  const sources = Array.isArray(record.sources) ? record.sources.length : 0;
  const summary = typeof record.summary === "string" ? record.summary : "";
  const level = typeof record.level === "string" ? record.level : "";
  const riskLevel = typeof record.risk_level === "string" ? record.risk_level : "";
  return {
    edges,
    drivers,
    sources,
    summaryLen: summary.length,
    level,
    riskLevel,
  };
}

function isPanelRenderable(
  view: RightPanelView,
  input: {
    resolved: PanelResolvedData | null;
    panelData: PanelSharedData | null | undefined;
    objectContextId?: string | null;
    selectedObjectId?: string | null;
    objectSelection?: unknown;
    sceneJson?: unknown;
  }
) {
  if (!view) return false;
  if (view === "fragility") {
    return hasRenderableRiskPayload(input.panelData?.fragility ?? input.panelData?.risk ?? null);
  }
  if (view === "object") {
    return hasMeaningfulObjectViewPayload({
      contextId: input.objectContextId ?? null,
      selectedObjectId: input.selectedObjectId ?? null,
      objectSelection: input.objectSelection ?? null,
      sceneJson: input.sceneJson ?? null,
    });
  }
  if (isResolverManagedView(view)) {
    return hasRenderableResolvedPanelData(view, input.resolved);
  }
  const slice = (input.panelData as Record<string, unknown> | null | undefined)?.[view];
  if (Array.isArray(slice)) return slice.length > 0;
  if (slice && typeof slice === "object") return Object.keys(slice as Record<string, unknown>).length > 0;
  return Boolean(slice);
}

function renderResolvedFallback(
  resolved: PanelResolvedData | null,
  suggestedActionLabel: string | null,
  onSuggestedAction: (() => void) | null
) {
  logPanelFallback({
    canonicalView: resolved?.title ?? "Panel",
    fallbackReason: resolved?.status ?? "fallback",
  });
  return (
    <RightPanelFallback
      title={resolved?.title ?? "Panel"}
      message={resolved?.message ?? "Select a scenario or question to populate this executive view."}
      suggestedActionLabel={suggestedActionLabel ?? resolved?.suggestedActionLabel ?? null}
      onSuggestedAction={onSuggestedAction}
    />
  );
}

function hasRecommendationSignal(
  panelData: PanelSharedData | null | undefined,
  responseData?: unknown,
  sceneJson?: unknown
) {
  const da = pickDecisionAnalysisFromResponse(responseData, sceneJson);
  const rec = da?.recommended_action as Record<string, unknown> | undefined;
  if (rec && typeof rec.id === "string" && rec.id.trim().length > 0) {
    return true;
  }
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

function hasMeaningfulObjectViewPayload(args: {
  contextId: string | null;
  selectedObjectId: string | null;
  objectSelection: unknown;
  sceneJson: unknown;
}) {
  if (typeof args.contextId === "string" && args.contextId.trim().length > 0) return true;
  if (typeof args.selectedObjectId === "string" && args.selectedObjectId.trim().length > 0) return true;

  const selection = asLooseRecord(args.objectSelection);
  const highlighted = Array.isArray(selection?.highlighted_objects) ? selection.highlighted_objects : [];
  if (highlighted.length > 0) return true;

  const sceneJson = asLooseRecord(args.sceneJson);
  const sceneSelection = asLooseRecord(sceneJson?.object_selection);
  const sceneHighlighted = Array.isArray(sceneSelection?.highlighted_objects) ? sceneSelection.highlighted_objects : [];
  return sceneHighlighted.length > 0;
}

function asLooseRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}
