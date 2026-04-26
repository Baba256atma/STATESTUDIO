"use client";

import React from "react";

import ConflictMapPanel from "../panels/ConflictMapPanel";
import FocusInsightCard from "../panels/FocusInsightCard";
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
import { WarRoomPanel } from "../warroom/WarRoomPanel";
import type { CenterExecutionSurface, CanonicalRightPanelView, RightPanelState } from "../../lib/ui/right-panel/rightPanelTypes";
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
import type { NexoraB18CompareResolved } from "../../lib/scenario/nexoraScenarioBuilder.ts";
import type { PanelResolvedData, PanelSharedData } from "../../lib/panels/panelDataResolverTypes";
import { validatePanelSharedDataWithDiagnostics } from "../../lib/panels/panelDataContract";
import { getPanelCognitiveFlow } from "../../lib/ui/right-panel/panelCognitiveFlow";
import {
  getPanelHelpSuggestions,
  resolvePanelButtonRole,
  type PanelHelpSuggestion,
} from "../../lib/ui/right-panel/panelInteractionModel";
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
import { insightPanelHostFrame, nx, softCardStyle } from "../ui/nexoraTheme";
import { pickDecisionAnalysisFromResponse } from "../../lib/panels/buildScenarioExplanationFromDecisionAnalysis";
import { dedupeCaseFallbackLog } from "../../lib/debug/panelConsoleTraceDedupe";
import { buildDecisionTimelineModel } from "../../lib/decision/timeline/buildDecisionTimelineModel";
import type { PanelReadiness } from "../../lib/panels/panelDataReadiness";
import {
  resolveAdviceReadiness,
  resolveConflictReadiness,
  resolveDecisionTimelineReadiness,
  resolveRiskReadiness,
} from "../../lib/panels/panelDataReadiness";
import type { RiskPanelData } from "../../lib/panels/panelDataContract";
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

function stabilizePanelPayload<T>(
  payload: T,
  resolve: (p: T) => PanelReadiness,
  lastRef: React.MutableRefObject<T | null>
): { safe: T; displayReadiness: PanelReadiness } {
  const current = resolve(payload);
  if (current === "ready") {
    lastRef.current = payload;
  }
  if (current === "empty") {
    lastRef.current = null;
  }
  const safe = (current === "ready" ? payload : (lastRef.current ?? payload)) as T;
  const displayReadiness = resolve(safe);
  return { safe, displayReadiness };
}

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
  onOpenCenterComponent?: ((component: CenterExecutionSurface) => void) | null;
  onOpenObjectInspectionCenter?: (() => void) | null;
  onOpenPanelView?: ((view: CanonicalRightPanelView) => void) | null;
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

function PanelHelpFooter(props: {
  view: RightPanelView;
  onOpenCenterComponent?: ((component: CenterExecutionSurface) => void) | null;
  onOpenPanelView?: ((view: CanonicalRightPanelView) => void) | null;
}) {
  const suggestions = getPanelHelpSuggestions(props.view).slice(0, 2);
  if (suggestions.length === 0) return null;
  const handleSuggestion = (suggestion: PanelHelpSuggestion) => {
    if (suggestion.targetType === "center_execution" && suggestion.centerSurface) {
      props.onOpenCenterComponent?.(suggestion.centerSurface);
      return;
    }
    if (suggestion.targetType === "right_panel" && suggestion.targetView) {
      props.onOpenPanelView?.(suggestion.targetView);
    }
  };
  return (
    <section
      aria-label="Panel help"
      style={{
        marginTop: 10,
        paddingTop: 10,
        borderTop: "1px solid rgba(148,163,184,0.14)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ color: "var(--nx-low-muted)", fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Help
      </div>
      <div style={{ color: "var(--nx-muted)", fontSize: 11, lineHeight: 1.35 }}>
        Use this rail to choose intent. Open the center workspace for execution.
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {suggestions.map((suggestion) => {
          const role = resolvePanelButtonRole({
            label: suggestion.label,
            targetView: suggestion.targetView ?? null,
          });
          return (
            <button
              key={`${suggestion.targetType}:${suggestion.label}`}
              type="button"
              onClick={() => handleSuggestion(suggestion)}
              style={{
                height: 24,
                padding: "0 8px",
                borderRadius: 6,
                border: "1px solid rgba(148,163,184,0.18)",
                background: role === "processing" ? "rgba(59,130,246,0.12)" : "rgba(2,6,23,0.34)",
                color: role === "processing" ? "var(--nx-accent-ink)" : "var(--nx-muted)",
                cursor: "pointer",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {suggestion.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function executiveRiskStatusFrom01(risk01: number): { dot: string; label: string } {
  if (risk01 >= 0.72) return { dot: "🔴", label: "Critical" };
  if (risk01 >= 0.35) return { dot: "🟡", label: "Warning" };
  return { dot: "🟢", label: "Stable" };
}

function executiveTitlesForView(
  view: CanonicalRightPanelView,
  ctx: {
    contextId: string | null | undefined;
    selectedObjectLabel: string | null | undefined;
    resolveObjectLabel: ((id: string | null | undefined) => string | null) | null | undefined;
  }
): { title: string; subtitle: string } {
  if (view === "object") {
    const id = typeof ctx.contextId === "string" ? ctx.contextId : null;
    const label =
      (ctx.selectedObjectLabel && String(ctx.selectedObjectLabel).trim()) ||
      (id ? ctx.resolveObjectLabel?.(id) : null) ||
      (id ? id : null) ||
      "Selection";
    return { title: "Scene Object", subtitle: `Inspecting ${label}` };
  }
  const known: Partial<Record<CanonicalRightPanelView, { title: string; subtitle: string }>> = {
    dashboard: { title: "Executive Overview", subtitle: "Decision posture and priorities" },
    kpi: { title: "Executive Overview", subtitle: "KPIs and operating signals" },
    strategic_command: { title: "Strategic Command", subtitle: "Navigate executive actions" },
    advice: { title: "Strategic Recommendation", subtitle: "Guided next step for this scenario" },
    conflict: { title: "Conflict Map", subtitle: "Tensions, tradeoffs, and alignment gaps" },
    timeline: { title: "Decision Timeline", subtitle: "Sequencing, owners, and commitments" },
    war_room: { title: "War Room", subtitle: "Pressure, stakeholders, and options" },
    risk: { title: "Risk Propagation", subtitle: "How exposure spreads through the system" },
    fragility: { title: "Risk Propagation", subtitle: "Fragility scan and weak links" },
    memory: { title: "Decision Memory", subtitle: "Past choices and institutional recall" },
    replay: { title: "Decision Replay", subtitle: "What changed and why it mattered" },
    simulate: { title: "Simulation", subtitle: "Forward-looking decision stress test" },
    compare: { title: "Compare Options", subtitle: "Side-by-side decision paths" },
    opponent: { title: "Opponent Moves", subtitle: "Counter-moves and competitive dynamics" },
    patterns: { title: "Strategic Patterns", subtitle: "Recurring structures in your system" },
    collaboration: { title: "Collaboration", subtitle: "Shared work and alignment" },
    explanation: { title: "Explanation", subtitle: "Structured rationale for the current read" },
  };
  return known[view] ?? { title: "Executive Insight", subtitle: "Context for the active view" };
}

function ExecutivePanelHeaderBar(props: {
  title: string;
  subtitle: string;
  status: { dot: string; label: string };
}) {
  return (
    <header
      style={{
        flexShrink: 0,
        padding: "10px 12px 12px",
        borderBottom: "1px solid rgba(148,163,184,0.12)",
        background: "rgba(2,6,23,0.2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <span title={props.status.label} style={{ fontSize: 13, lineHeight: 1.25, flexShrink: 0 }} aria-hidden>
          {props.status.dot}
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 750, color: "var(--nx-text)", letterSpacing: "-0.01em" }}>
            {props.title}
          </div>
          <div style={{ fontSize: 11, color: "var(--nx-muted)", marginTop: 3, lineHeight: 1.35 }}>{props.subtitle}</div>
        </div>
      </div>
    </header>
  );
}

function ExecutivePanelSkeletonBody() {
  const bar = (w: string, h: number) => (
    <div
      style={{
        height: h,
        width: w,
        maxWidth: "100%",
        borderRadius: 6,
        background: "rgba(148,163,184,0.1)",
      }}
    />
  );
  return (
    <div style={{ flex: 1, minHeight: 0, padding: "12px 12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
      {bar("44%", 11)}
      {bar("72%", 9)}
      <div style={{ flex: 1, minHeight: 120, borderRadius: 10, background: "rgba(148,163,184,0.06)" }} />
    </div>
  );
}

export function RightPanelHost(props: RightPanelHostProps) {
  const DEBUG_PANEL_TRACE = false;
  /** Authority is the only source of truth for which panel is shown (no lagged / alternate view). */
  const viewToRender = props.rightPanelState.view;
  const panelStateEpoch = props.rightPanelState.timestamp ?? 0;
  const [panelOpenHint, setPanelOpenHint] = React.useState<string | null>(null);
  const [panelOpenHintOpaque, setPanelOpenHintOpaque] = React.useState(false);
  const panelOpenHintTimersRef = React.useRef<number[]>([]);
  const bodyRef = React.useRef<HTMLDivElement | null>(null);
  const lastScnSubviewResetLogRef = React.useRef<string | null>(null);
  const lastCanonicalScenePanelSigRef = React.useRef<string | null>(null);
  const lastSceneRenderPathSigRef = React.useRef<string | null>(null);
  const lastScnSceneResolvedSigRef = React.useRef<string | null>(null);
  const [scnMode, setScnMode] = React.useState<"scene" | "workspace">("scene");
  React.useEffect(() => {
    const clearHintTimers = () => {
      panelOpenHintTimersRef.current.forEach((id) => window.clearTimeout(id));
      panelOpenHintTimersRef.current = [];
    };
    const onHint = (event: Event) => {
      const text = String((event as CustomEvent<{ text?: string }>).detail?.text ?? "").trim();
      if (!text) return;
      clearHintTimers();
      setPanelOpenHint(text);
      setPanelOpenHintOpaque(false);
      panelOpenHintTimersRef.current.push(
        window.setTimeout(() => setPanelOpenHintOpaque(true), 20)
      );
      panelOpenHintTimersRef.current.push(
        window.setTimeout(() => setPanelOpenHintOpaque(false), 420)
      );
      panelOpenHintTimersRef.current.push(
        window.setTimeout(() => {
          setPanelOpenHint(null);
          clearHintTimers();
        }, 1300)
      );
    };
    window.addEventListener("nexora:panel-open-hint", onHint as EventListener);
    return () => {
      clearHintTimers();
      window.removeEventListener("nexora:panel-open-hint", onHint as EventListener);
    };
  }, []);
  const lastRenderViewSignatureRef = React.useRef<string | null>(null);
  const lastStableRiskPayloadRef = React.useRef<unknown>(null);
  const lastStableConflictPayloadRef = React.useRef<unknown>(null);
  const lastStableAdviceBundleRef = React.useRef<{ panel: PanelSharedData; advice: unknown } | null>(null);
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

  React.useEffect(() => {
    if (viewToRender !== "risk" && viewToRender !== "fragility") lastStableRiskPayloadRef.current = null;
    if (viewToRender !== "conflict") lastStableConflictPayloadRef.current = null;
    if (viewToRender !== "advice") lastStableAdviceBundleRef.current = null;
  }, [viewToRender]);
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
  // --- STABILITY PATCH (prevent resolver churn + re-render loop) ---
  const stablePanelDataRef = React.useRef<PanelSharedData | null>(null);
  const stablePanelSignatureRef = React.useRef<string | null>(null);

  const stableAggregatedPanelData = React.useMemo(() => {
    try {
      const signature = JSON.stringify(aggregatedPanelData);
      if (stablePanelSignatureRef.current === signature && stablePanelDataRef.current) {
        return stablePanelDataRef.current;
      }
      stablePanelSignatureRef.current = signature;
      stablePanelDataRef.current = aggregatedPanelData;
      return aggregatedPanelData;
    } catch {
      // fallback (never break UI)
      return aggregatedPanelData;
    }
  }, [aggregatedPanelData]);
  const panelContractValidation = React.useMemo(
    () => validatePanelSharedDataWithDiagnostics(stableAggregatedPanelData),
    [stableAggregatedPanelData]
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
  const lastResolvedPanelRef = React.useRef<PanelResolvedData | null>(null);

  const resolvedPanel = React.useMemo(() => {
    if (!viewToRender || !isResolverManagedView(viewToRender)) return null;

    const next = buildPanelResolvedData(viewToRender, validatedPanelData);

    // prevent useless churn (same panel, same status)
    if (
      lastResolvedPanelRef.current &&
      lastResolvedPanelRef.current.status === next.status &&
      JSON.stringify(lastResolvedPanelRef.current.data) === JSON.stringify(next.data)
    ) {
      return lastResolvedPanelRef.current;
    }

    lastResolvedPanelRef.current = next;
    return next;
  }, [viewToRender, validatedPanelData]);
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
  const lastRenderableResolvedByViewRef = React.useRef<Partial<Record<Exclude<RightPanelView, null>, PanelResolvedData>>>({});

  const bestResolvedPanel = React.useMemo(() => {
    if (!viewToRender || !isResolverManagedView(viewToRender)) {
      return resolvedPanel;
    }

    const nextIsRenderable = Boolean(
      resolvedPanel &&
        !shouldRenderResolvedFallback(resolvedPanel) &&
        hasRenderableResolvedPanelData(viewToRender, resolvedPanel)
    );

    if (nextIsRenderable && resolvedPanel) {
      lastRenderableResolvedByViewRef.current[viewToRender] = resolvedPanel;
      return resolvedPanel;
    }

    const preserved = lastRenderableResolvedByViewRef.current[viewToRender] ?? null;
    if (preserved) {
      return preserved;
    }

    return resolvedPanel;
  }, [viewToRender, resolvedPanel]);

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

  const lastResolvedStabilitySignatureRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!viewToRender || !isResolverManagedView(viewToRender)) return;
    if (!resolvedPanel || !bestResolvedPanel) return;
    if (resolvedPanel === bestResolvedPanel) return;
    const signature = [
      viewToRender,
      resolvedPanel.status,
      bestResolvedPanel.status,
    ].join("|");
    if (lastResolvedStabilitySignatureRef.current === signature) return;
    lastResolvedStabilitySignatureRef.current = signature;
    globalThis.console?.debug?.("[Nexora][HostStability] preserved_last_renderable_panel", {
      view: viewToRender,
      incomingStatus: resolvedPanel.status,
      preservedStatus: bestResolvedPanel.status,
    });
  }, [viewToRender, resolvedPanel, bestResolvedPanel]);
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

  const lastPanelRenderStableSigRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const renderedFallback = Boolean(
      viewToRender && isResolverManagedView(viewToRender) && shouldRenderResolvedFallback(bestResolvedPanel)
    );
    const payload = {
      view: viewToRender,
      isOpen: props.rightPanelState.isOpen,
      hasView: Boolean(viewToRender),
      readiness: bestResolvedPanelReadiness,
      renderedFallback,
      contextId: props.rightPanelState.contextId ?? null,
    };
    const sig = JSON.stringify(payload);
    if (lastPanelRenderStableSigRef.current === sig) return;
    lastPanelRenderStableSigRef.current = sig;
    console.log("[Nexora][PanelRenderStable]", payload);
  }, [
    viewToRender,
    props.rightPanelState.isOpen,
    props.rightPanelState.contextId,
    bestResolvedPanelReadiness,
    bestResolvedPanel,
  ]);
  const isSceneFamilyView =
    viewToRender === "workspace" || viewToRender === "object" || viewToRender === "object_focus";
  const panelRenderKey = `${props.rightPanelState.view ?? "none"}:${props.rightPanelState.contextId ?? "none"}`;

  React.useEffect(() => {
    if (!isSceneFamilyView) return;
    bodyRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [isSceneFamilyView, viewToRender, props.rightPanelState.contextId]);

  const previousViewRef = React.useRef<RightPanelView>(null);
  React.useEffect(() => {
    const prevView = previousViewRef.current;
    if (prevView === viewToRender) return;
    const prevSceneFamily =
      prevView === "workspace" || prevView === "object" || prevView === "object_focus";
    if (prevSceneFamily && isSceneFamilyView) {
      // Never allow object/object_focus resolved cache to bleed back into workspace scene subview.
      lastResolvedPanelRef.current = null;
      lastRenderableResolvedByViewRef.current.workspace = undefined;
      lastRenderableResolvedByViewRef.current.object = undefined;
      lastRenderableResolvedByViewRef.current.object_focus = undefined;
    }
    previousViewRef.current = viewToRender;
  }, [isSceneFamilyView, viewToRender]);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production" || !isSceneFamilyView) return;
    const sig = `${viewToRender ?? "null"}|${props.rightPanelState.contextId ?? "null"}`;
    if (lastScnSubviewResetLogRef.current === sig) return;
    lastScnSubviewResetLogRef.current = sig;
    console.log("[Nexora][SCNSubviewReset]", {
      view: viewToRender,
      contextId: props.rightPanelState.contextId ?? null,
    });
  }, [isSceneFamilyView, props.rightPanelState.contextId, viewToRender]);
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (viewToRender !== "workspace" || scnMode !== "scene") return;
    const sig = `${viewToRender}|${props.rightPanelState.contextId ?? "null"}`;
    if (lastCanonicalScenePanelSigRef.current === sig) return;
    lastCanonicalScenePanelSigRef.current = sig;
    console.log("[Nexora][CanonicalScenePanel]", {
      path: "single",
      hasWorkspaceCTA: true,
      hasObjectCTA: true,
    });
  }, [props.rightPanelState.contextId, scnMode, viewToRender]);
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (viewToRender !== "workspace") return;
    const path = scnMode === "workspace" ? "scn_workspace_panel" : "canonical_scene_stack";
    const sig = `${path}|${viewToRender}|${props.rightPanelState.contextId ?? "null"}`;
    if (lastSceneRenderPathSigRef.current === sig) return;
    lastSceneRenderPathSigRef.current = sig;
    console.log("[Nexora][SceneRenderPath]", {
      path,
      viewToRender,
      scnMode,
      contextId: props.rightPanelState.contextId ?? null,
    });
  }, [props.rightPanelState.contextId, scnMode, viewToRender]);
  React.useEffect(() => {
    if (viewToRender !== "workspace") {
      setScnMode("scene");
    }
  }, [viewToRender]);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const onOpenRightPanel = (event: Event) => {
      const detail = (event as CustomEvent<{ view?: string | null }>).detail;
      if (detail?.view === "workspace") {
        setScnMode("scene");
      }
    };
    window.addEventListener("nexora:open-right-panel", onOpenRightPanel as EventListener);
    return () => window.removeEventListener("nexora:open-right-panel", onOpenRightPanel as EventListener);
  }, []);

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
  const riskSignal01 = getRiskSignalLevel(effectivePanelData.risk ?? props.riskPropagation ?? null);
  const executiveStatus = executiveRiskStatusFrom01(riskSignal01);
  const renderCanonicalScenePanel = React.useCallback(() => {
    const sceneCardStyle: React.CSSProperties = {
      position: "relative",
      width: "100%",
      margin: 0,
      flexShrink: 0,
      zIndex: "auto",
      transform: "none",
    };
    const fragilityLevelRaw =
      (effectivePanelData.fragility as Record<string, unknown> | null | undefined)?.level ??
      (effectivePanelData.risk as Record<string, unknown> | null | undefined)?.level ??
      null;
    const fragilityLevel =
      typeof fragilityLevelRaw === "string" && fragilityLevelRaw.trim()
        ? fragilityLevelRaw.trim()
        : riskSignal01 >= 0.72
          ? "critical"
          : riskSignal01 >= 0.35
            ? "warning"
            : "stable";
    const executivePrimary =
      dashboardRecommendation?.summary ??
      dashboardRecommendation?.headline ??
      (typeof props.responseData?.summary === "string" ? props.responseData.summary : null) ??
      "Scene posture is stable; inspect object-level pressure and risk flow to refine decisions.";
    const activeContextLine =
      props.selectedObjectLabel ??
      props.rightPanelState.contextId ??
      (typeof props.responseData?.workspace_id === "string" ? props.responseData.workspace_id : null) ??
      "No active object context yet.";
    const hasSceneData = Boolean(
      dashboardRecommendation?.summary ??
        dashboardRecommendation?.headline ??
        dashboardRecommendation?.recommended_action ??
        effectivePanelData.risk ??
        effectivePanelData.fragility ??
        props.responseData?.summary ??
        props.responseData?.workspace_id
    );
    const sceneModel = hasSceneData
      ? {
          primaryDecision:
            dashboardRecommendation?.recommended_action ??
            "Open Object Analysis to inspect leverage points before committing action.",
          riskSignal: Number.isFinite(riskSignal01) ? riskSignal01 : 0,
          fragilityLevel,
          executiveInsight: String(executivePrimary),
          activeContext: activeContextLine,
        }
      : {
          primaryDecision: "No action needed",
          riskSignal: 0,
          fragilityLevel: "stable",
          executiveInsight: "No system pressure detected",
          activeContext: "No active context yet",
        };
    if (process.env.NODE_ENV !== "production") {
      const sig = `${props.rightPanelState.contextId ?? "null"}|${hasSceneData ? "1" : "0"}|${sceneModel.fragilityLevel}`;
      if (lastScnSceneResolvedSigRef.current !== sig) {
        lastScnSceneResolvedSigRef.current = sig;
        console.log("[Nexora][SCNSceneResolved]", {
          view: viewToRender,
          source: "canonical_scene_stack",
          hasData: hasSceneData,
        });
      }
    }
    return (
      <div
        data-nexora-scene-panel-stack
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
          minHeight: 0,
          overflow: "visible",
        }}
      >
        <div style={{ ...softCardStyle, ...sceneCardStyle, padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
            Primary Decision
          </div>
          <div style={{ marginTop: 6, color: nx.text, fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>
            {sceneModel.primaryDecision}
          </div>
        </div>

        <div style={{ ...softCardStyle, ...sceneCardStyle, padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
            System Health
          </div>
          <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", gap: 10, color: nx.muted, fontSize: 12 }}>
            <span>Risk Signal</span>
            <strong style={{ color: nx.text }}>{sceneModel.riskSignal.toFixed(2)}</strong>
          </div>
          <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", gap: 10, color: nx.muted, fontSize: 12 }}>
            <span>Fragility Level</span>
            <strong style={{ color: nx.text }}>{sceneModel.fragilityLevel}</strong>
          </div>
        </div>

        <div style={{ ...softCardStyle, ...sceneCardStyle, padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
            Executive Insight
          </div>
          <div style={{ marginTop: 6, color: nx.text, fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>
            {sceneModel.executiveInsight}
          </div>
        </div>

        <div style={{ ...softCardStyle, ...sceneCardStyle, padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
            Active Context
          </div>
          <div style={{ marginTop: 6, color: nx.textSoft, fontSize: 12, lineHeight: 1.4 }}>{sceneModel.activeContext}</div>
        </div>

        <div style={{ ...softCardStyle, ...sceneCardStyle, padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
            Help / Actions
          </div>
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {hasSceneData ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (props.onOpenObjectInspectionCenter) {
                      props.onOpenObjectInspectionCenter();
                      return;
                    }
                    props.onOpenCenterComponent?.("object_inspection");
                  }}
                  style={{
                    borderRadius: 8,
                    border: "1px solid rgba(148,163,184,0.22)",
                    background: "rgba(2,6,23,0.38)",
                    color: nx.text,
                    padding: "8px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Open Object Analysis
                </button>
                <button
                  type="button"
                  onClick={() => props.onOpenCenterComponent?.("workspace")}
                  style={{
                    borderRadius: 8,
                    border: "1px solid rgba(148,163,184,0.22)",
                    background: "rgba(2,6,23,0.38)",
                    color: nx.text,
                    padding: "8px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Open Workspace
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("nexora:open-input-center"))}
                  style={{
                    borderRadius: 8,
                    border: "1px solid rgba(148,163,184,0.22)",
                    background: "rgba(2,6,23,0.38)",
                    color: nx.text,
                    padding: "8px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Analyze system
                </button>
                <button
                  type="button"
                  onClick={() => props.onOpenCenterComponent?.("workspace")}
                  style={{
                    borderRadius: 8,
                    border: "1px solid rgba(148,163,184,0.22)",
                    background: "rgba(2,6,23,0.38)",
                    color: nx.text,
                    padding: "8px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Open Workspace
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    dashboardRecommendation?.headline,
    dashboardRecommendation?.recommended_action,
    dashboardRecommendation?.summary,
    effectivePanelData.fragility,
    effectivePanelData.risk,
    nx.lowMuted,
    nx.muted,
    nx.text,
    nx.textSoft,
    props.onOpenCenterComponent,
    props.onOpenObjectInspectionCenter,
    props.responseData?.summary,
    props.responseData?.workspace_id,
    props.rightPanelState.contextId,
    props.selectedObjectLabel,
    riskSignal01,
    viewToRender,
  ]);

  // Important: keep all hooks above this point.
  // Conditional returns below preserve React hook order stability.
  if (!props.rightPanelState.isOpen) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Nexora][PanelHiddenByState]", {
        view: props.rightPanelState.view,
        expectedVisible: true,
      });
    }
    return (
      <div
        style={{
          ...insightPanelHostFrame,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid var(--nx-border)",
          background: "var(--nx-bg-panel-soft)",
          opacity: 0.6,
          transition: "opacity 120ms ease",
        }}
      >
        <div style={{ color: nx.lowMuted, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Inspector Collapsed
        </div>
      </div>
    );
  }

  if (!viewToRender) {
    if (props.decisionStatus === "loading" || props.decisionLoading) {
      return renderExecutiveLoadingShell(null, executiveStatus, props.rightPanelState.isOpen);
    }
    return (
      <div
        style={{
          ...insightPanelHostFrame,
          opacity: props.rightPanelState.isOpen ? 1 : 0.6,
          transition: "opacity 120ms ease",
        }}
      >
        <ExecutivePanelHeaderBar
          title="Executive Insight"
          subtitle="Choose a view from the rail to continue"
          status={executiveStatus}
        />
        <RightPanelFallback
          embedded
          title=""
          message="Select a view from the executive rail or continue your analysis to open a matching insight."
          suggestedActionLabel={cognitiveFlow.showNextStepCTA ? cognitiveFlow.nextStepLabel : null}
          onSuggestedAction={null}
        />
      </div>
    );
  }
  if (!hasDecisionContext && (props.decisionStatus === "loading" || props.decisionLoading)) {
    return renderExecutiveLoadingShell(props.rightPanelState.view, executiveStatus, props.rightPanelState.isOpen, {
      contextId: props.rightPanelState.contextId,
      selectedObjectLabel: props.selectedObjectLabel,
      resolveObjectLabel: props.resolveObjectLabel,
    });
  }

  // Panel header titles must follow `rightPanelState.view` only — not shell section, not legacy tab metadata.
  const panelHeaderCanonicalView = props.rightPanelState.view;
  const executiveTitles = executiveTitlesForView(panelHeaderCanonicalView, {
    contextId: props.rightPanelState.contextId,
    selectedObjectLabel: props.selectedObjectLabel,
    resolveObjectLabel: props.resolveObjectLabel,
  });
  const blockBodyForDecisionLoad =
    (props.decisionLoading || props.decisionStatus === "loading") &&
    isResolverManagedView(viewToRender) &&
    !hasRenderableBestResolvedPanel;

  return (
    <div
      style={{
        ...insightPanelHostFrame,
        opacity: props.rightPanelState.isOpen ? 1 : 0.6,
        transition: "opacity 120ms ease",
        overflow: "hidden",
      }}
    >
      <div
        id="nexora-right-panel-surface"
        className="nexora-right-panel"
        style={{
          flex: 1,
          minHeight: 0,
          height: "100%",
          minWidth: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {panelOpenHint ? (
          <div
            style={{
              flexShrink: 0,
              padding: "8px 12px 0",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--nx-muted)",
              opacity: panelOpenHintOpaque ? 1 : 0,
              transition: "opacity 800ms ease",
            }}
          >
            {panelOpenHint}
          </div>
        ) : null}
        <ExecutivePanelHeaderBar
          title={executiveTitles.title}
          subtitle={executiveTitles.subtitle}
          status={executiveStatus}
        />
      <div
        className="panel-body"
        ref={bodyRef}
        key={isSceneFamilyView ? panelRenderKey : String(viewToRender ?? "none")}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: 12,
          gap: 12,
        }}
      >
      <div
        className="panel-section"
        style={{
          position: "relative",
          width: "100%",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
      {blockBodyForDecisionLoad ? (
        <ExecutivePanelSkeletonBody />
      ) : (
        (() => {
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
            suggestedActionLabel="Open Timeline"
            onSuggestedAction={() => props.onOpenCenterComponent?.("timeline")}
          />
        );
      }
      if (shouldRenderResolvedFallback(bestResolvedPanel)) {
        dedupeCaseFallbackLog("timeline", "resolved_panel_fallback", {
          readiness: bestResolvedPanelReadiness,
          hasRenderable: hasRenderableBestResolvedPanel,
        });
      }
      if (!hasRenderableBestResolvedPanel && props.decisionStatus !== "loading" && props.decisionStatus !== "error") {
        dedupeCaseFallbackLog("timeline", "resolved_panel_not_renderable", {
          readiness: bestResolvedPanelReadiness,
          decisionStatus: props.decisionStatus ?? null,
        });
      }
      {
        const modelForReadiness = buildDecisionTimelineModel({
          responseData: effectiveTimelinePayload,
          strategicAdvice: effectiveAdvicePayload,
          canonicalRecommendation: dashboardRecommendation,
          decisionResult: props.decisionResult ?? null,
        });
        const timelineReadiness = resolveDecisionTimelineReadiness({
          stageCount: modelForReadiness.stages.length,
          decisionLoading: props.decisionLoading,
          decisionStatus: props.decisionStatus ?? null,
        });
        if (process.env.NODE_ENV !== "production") {
          globalThis.console.log("[Nexora][PanelStable]", { view: "timeline", readiness: timelineReadiness });
        }
        if (timelineReadiness === "loading") {
          return <RightPanelFallback mode="loading" embedded />;
        }
        if (timelineReadiness === "empty") {
          return (
            <RightPanelFallback
              mode="empty"
              embedded
              message="No timeline segments yet. Run a simulation to build the decision story."
            />
          );
        }
      }
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
            suggestedActionLabel="View analysis"
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
    case "conflict": {
      if (!hasRenderableBestResolvedPanel) {
        dedupeCaseFallbackLog("conflict", "resolved_panel_not_renderable", {
          readiness: bestResolvedPanelReadiness,
        });
      }
      const { safe: safeConflict, displayReadiness: conflictReadiness } = stabilizePanelPayload(
        effectiveConflictPayload,
        resolveConflictReadiness,
        lastStableConflictPayloadRef
      );
      if (process.env.NODE_ENV !== "production") {
        globalThis.console.log("[Nexora][PanelStable]", { view: "conflict", readiness: conflictReadiness });
      }
      if (conflictReadiness === "loading") {
        return <RightPanelFallback mode="loading" embedded />;
      }
      if (conflictReadiness === "empty") {
        return <RightPanelFallback mode="empty" embedded message="No active conflicts detected." />;
      }
      return <ConflictMapPanel conflicts={safeConflict as React.ComponentProps<typeof ConflictMapPanel>["conflicts"]} />;
    }
    case "object":
    case "object_focus": {
      const focusObjectId = String(
        props.rightPanelState.contextId ?? props.selectedObjectId ?? props.focusedId ?? ""
      ).trim();
      if (!focusObjectId) {
        return null;
      }
      if (process.env.NODE_ENV !== "production") {
        globalThis.console?.debug?.("[Nexora][FocusRender]", {
          view: props.rightPanelState.view ?? null,
          legacyTab: "object_focus",
          componentName: "FocusInsightCard",
          contextId: props.rightPanelState.contextId ?? null,
          selectedObjectId: props.selectedObjectId ?? null,
          focusedId: props.focusedId ?? null,
        });
      }
      return (
        <FocusInsightCard
          selectedObjectId={focusObjectId}
          selectedObjectLabel={props.selectedObjectLabel ?? null}
          responseData={props.responseData ?? props.sceneJson ?? null}
          sceneJson={props.sceneJson ?? null}
          riskPropagation={props.riskPropagation ?? null}
        />
      );
    }
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
    case "risk": {
      const { safe: safeRisk, displayReadiness: riskReadiness } = stabilizePanelPayload(
        effectiveRiskPayload,
        resolveRiskReadiness,
        lastStableRiskPayloadRef
      );
      if (process.env.NODE_ENV !== "production") {
        globalThis.console.log("[Nexora][PanelStable]", { view: "risk", readiness: riskReadiness });
      }
      if (riskReadiness === "loading") {
        return <RightPanelFallback mode="loading" embedded />;
      }
      if (riskReadiness === "empty") {
        return <RightPanelFallback mode="empty" embedded message="No significant risk detected." />;
      }
      if (!hasRenderableRiskPayload(safeRisk)) {
        dedupeCaseFallbackLog("risk", "risk_payload_not_renderable", riskPayloadFallbackSignature(safeRisk));
      }
      return (
        <RiskPropagationPanel
          mode="risk"
          risk={safeRisk as RiskPanelData}
          showRiskFlowEntry
          onOpenRiskFlow={handleContextualRiskFlowAction}
        />
      );
    }
    case "fragility": {
      const { safe: safeFragilityRisk, displayReadiness: fragilityReadiness } = stabilizePanelPayload(
        effectiveRiskPayload,
        resolveRiskReadiness,
        lastStableRiskPayloadRef
      );
      if (process.env.NODE_ENV !== "production") {
        globalThis.console.log("[Nexora][PanelStable]", { view: "fragility", readiness: fragilityReadiness });
      }
      if (fragilityReadiness === "loading") {
        return <RightPanelFallback mode="loading" embedded />;
      }
      if (fragilityReadiness === "empty") {
        return (
          <RightPanelFallback
            mode="empty"
            embedded
            message="Run a fragility scan from the inspector to populate drivers and weak-link signals."
          />
        );
      }
      if (!hasRenderableRiskPayload(safeFragilityRisk)) {
        dedupeCaseFallbackLog("fragility", "fragility_payload_not_renderable", riskPayloadFallbackSignature(safeFragilityRisk));
      }
      return (
        <RiskPropagationPanel
          mode="fragility"
          risk={safeFragilityRisk as RiskPanelData}
          showRiskFlowEntry={false}
          onOpenRiskFlow={null}
        />
      );
    }
    case "replay":
      return (
        <DecisionReplayPanel
          backendBase={props.backendBase}
          episodeId={props.episodeId}
          onSceneUpdate={props.onSceneUpdateFromTimeline}
        />
      );
    case "advice": {
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
      }
      const adviceCurrent = resolveAdviceReadiness(
        effectivePanelData,
        effectiveAdvicePayload,
        dashboardRecommendation
      );
      let safeAdvicePanel = effectivePanelData;
      let safeAdvicePayload = effectiveAdvicePayload as React.ComponentProps<typeof StrategicAdvicePanel>["advice"];
      if (adviceCurrent === "ready") {
        lastStableAdviceBundleRef.current = { panel: effectivePanelData, advice: effectiveAdvicePayload };
      }
      if (adviceCurrent === "empty") {
        lastStableAdviceBundleRef.current = null;
      }
      if (adviceCurrent !== "ready") {
        const bundle = lastStableAdviceBundleRef.current;
        if (bundle) {
          safeAdvicePanel = bundle.panel;
          safeAdvicePayload = bundle.advice as React.ComponentProps<typeof StrategicAdvicePanel>["advice"];
        }
      }
      const adviceDisplay = resolveAdviceReadiness(
        safeAdvicePanel,
        safeAdvicePayload,
        dashboardRecommendation
      );
      if (process.env.NODE_ENV !== "production") {
        globalThis.console.log("[Nexora][PanelStable]", { view: "advice", readiness: adviceDisplay });
      }
      if (adviceDisplay === "loading") {
        return <RightPanelFallback mode="loading" embedded />;
      }
      if (adviceDisplay === "empty") {
        return <RightPanelFallback mode="empty" embedded message="No strategic advice is available yet." />;
      }
      return (
        <StrategicAdvicePanel
          data={safeAdvicePanel}
          advice={safeAdvicePayload as React.ComponentProps<typeof StrategicAdvicePanel>["advice"]}
          canonicalRecommendation={dashboardRecommendation}
        />
      );
    }
    case "opponent":
      return <OpponentMovesPanel model={props.opponentModel ?? props.sceneJson?.opponent_model ?? null} />;
    case "patterns":
      return <StrategicPatternsPanel patterns={props.strategicPatterns ?? props.sceneJson?.strategic_patterns ?? null} />;
    case "simulate":
      return (
        <RightPanelFallback
          title="Simulation"
          message="Simulation is an execution workflow. The right rail keeps the intent; run the full surface in the center workspace."
          suggestedActionLabel="Open Simulation"
          onSuggestedAction={() => props.onOpenCenterComponent?.("simulation")}
        />
      );
    case "dashboard":
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
          activeExecutiveView={props.activeExecutiveView ?? "dashboard"}
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
          nexoraB18Simulate={null}
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
            suggestedActionLabel="Open Compare"
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
      }
      if (!hasRenderableBestResolvedPanel) {
        dedupeCaseFallbackLog("war_room", "resolved_panel_not_renderable", {
          readiness: bestResolvedPanelReadiness,
        });
      }
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
      return renderCanonicalScenePanel();
    case "kpi":
      dedupeCaseFallbackLog("kpi", "missing_kpi_analysis", {});
      return (
        <RightPanelFallback
          title="KPI"
          message="No KPI readout is available yet. Run an analysis to surface executive metrics here."
          suggestedActionLabel="View analysis"
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
        })()
      )}
      </div>
      {viewToRender === "workspace" ? null : (
        <div className="panel-section" style={{ position: "relative", width: "100%", margin: 0 }}>
          <PanelHelpFooter
            view={props.rightPanelState.view}
            onOpenCenterComponent={props.onOpenCenterComponent ?? null}
            onOpenPanelView={props.onOpenPanelView ?? null}
          />
        </div>
      )}
      </div>
      </div>
    </div>
  );
}

function isResolverManagedView(view: RightPanelView): view is Exclude<RightPanelView, null> {
  return (
    view === "advice" ||
    view === "dashboard" ||
    view === "conflict" ||
    view === "risk" ||
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

function renderExecutiveLoadingShell(
  view: RightPanelView | null,
  status: { dot: string; label: string },
  isOpen: boolean,
  titleCtx?: {
    contextId?: string | null;
    selectedObjectLabel?: string | null;
    resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
  }
) {
  const titles =
    view != null
      ? executiveTitlesForView(view, {
          contextId: titleCtx?.contextId ?? null,
          selectedObjectLabel: titleCtx?.selectedObjectLabel ?? null,
          resolveObjectLabel: titleCtx?.resolveObjectLabel ?? null,
        })
      : { title: "Executive Insight", subtitle: "Preparing this view" };
  return (
    <div
      style={{
        ...insightPanelHostFrame,
        opacity: isOpen ? 1 : 0.6,
        transition: "opacity 120ms ease",
        overflow: "hidden",
      }}
    >
      <div
        id="nexora-right-panel-surface"
        className="nexora-right-panel"
        style={{
          flex: 1,
          minHeight: 0,
          height: "100%",
          minWidth: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <ExecutivePanelHeaderBar title={titles.title} subtitle={titles.subtitle} status={status} />
        <ExecutivePanelSkeletonBody />
      </div>
    </div>
  );
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
