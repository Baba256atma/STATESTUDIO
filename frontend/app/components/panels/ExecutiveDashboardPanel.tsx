"use client";

import React from "react";

import { CustomerDemoHero } from "../demo/CustomerDemoHero";
import { nx, panelSurfaceStyle, primaryButtonStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";
import type { CustomerDemoProfile } from "../../lib/demo/customerDemoTypes";
import type { NexoraB8PanelContext } from "../../lib/panels/panelDataContract";
import { buildSimulateMeaningRows } from "../../lib/panels/nexoraPanelMeaning";
import type { DecisionImpactState } from "../../lib/impact/decisionImpactTypes";
import { mapDecisionBrief } from "../../lib/executive/decisionSummaryMapper";
import { buildCanonicalRecommendation } from "../../lib/decision/recommendation/buildCanonicalRecommendation";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import type { DecisionExecutionResult } from "../../lib/executive/decisionExecutionTypes";
import { buildComparePanelModel } from "../../lib/decision/recommendation/buildComparePanelModel";
import { buildScenarioBranchingTreeModel } from "../../lib/decision/scenario/buildScenarioBranchingTreeModel";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import { buildDecisionConfidenceModel } from "../../lib/decision/confidence/buildDecisionConfidenceModel";
import { DecisionActionBar } from "../executive/DecisionActionBar";
import { buildDecisionExecutionIntent } from "../../lib/execution/buildDecisionExecutionIntent";
import type { DecisionAutomationResult } from "../../lib/execution/decisionAutomationTypes";
import type { DecisionExecutionIntent } from "../../lib/execution/decisionExecutionIntent";
import { buildDecisionTimeline } from "../../lib/governance/buildDecisionTimeline";
import { buildDecisionTimelineView } from "../../lib/governance/buildDecisionTimelineView";
import { buildDecisionConfidenceCalibration } from "../../lib/decision/confidence/calibration/buildDecisionConfidenceCalibration";
import { buildDecisionOutcomeAssessment } from "../../lib/decision/confidence/calibration/buildDecisionOutcomeAssessment";
import { buildDecisionPatternIntelligence } from "../../lib/decision/patterns/buildDecisionPatternIntelligence";
import { buildObservedOutcomeAssessment } from "../../lib/decision/outcome/buildObservedOutcomeAssessment";
import { buildDecisionOutcomeFeedback } from "../../lib/decision/outcome/buildDecisionOutcomeFeedback";
import { buildDecisionFeedbackSignal } from "../../lib/decision/outcome/buildDecisionFeedbackSignal";
import { buildStrategicLearningState } from "../../lib/decision/learning/buildStrategicLearningState";
import { buildMetaDecisionState } from "../../lib/decision/meta/buildMetaDecisionState";
import { selectDefaultCognitiveStyle } from "../../lib/cognitive/selectDefaultCognitiveStyle";
import { buildTeamDecisionState } from "../../lib/team/buildTeamDecisionState";
import { buildCollaborationState } from "../../lib/collaboration/buildCollaborationState";
import { loadCollaborationEnvelope } from "../../lib/collaboration/collaborationStore";
import { buildStrategicCommandState } from "../../lib/command/buildStrategicCommandState";
import { buildAutonomousDecisionCouncilState } from "../../lib/council/buildAutonomousDecisionCouncilState";
import { loadOrgScopedDecisionMemoryEntries } from "../../lib/decision/memory/decisionMemoryStore";
import { buildOrgMemoryState } from "../../lib/org-memory/buildOrgMemoryState";
import { buildDecisionPolicyState } from "../../lib/policy/buildDecisionPolicyState";
import { buildDecisionGovernanceState } from "../../lib/governance/buildDecisionGovernanceState";
import { buildApprovalWorkflowState } from "../../lib/approval/buildApprovalWorkflowState";
import { loadApprovalWorkflowEnvelope } from "../../lib/approval/approvalWorkflowStore";
import { guardHeavyComputation } from "../../lib/ops/performanceGuard";
import { dedupePanelConsoleTrace } from "../../lib/debug/panelConsoleTraceDedupe";
import type { NexoraB18SimulateResolved } from "../../lib/scenario/nexoraScenarioBuilder.ts";

type ExecutiveDashboardPanelProps = {
  sceneJson?: any;
  responseData?: any;
  activeMode?: string | null;
  conflicts?: any[] | null;
  objectSelection?: any | null;
  riskPropagation?: any | null;
  decisionMemoryEntries?: DecisionMemoryEntry[];
  strategicAdvice?: any | null;
  strategicCouncil?: any | null;
  decisionImpact?: DecisionImpactState | null;
  decisionCockpit?: any | null;
  selectedObjectLabel?: string | null;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
  onOpenWarRoom?: (() => void) | null;
  onOpenStrategicCommand?: (() => void) | null;
  demoProfile?: CustomerDemoProfile | null;
  decisionResult?: DecisionExecutionResult | null;
  decisionLoading?: boolean;
  decisionStatus?: "idle" | "loading" | "ready" | "error";
  decisionError?: string | null;
  activeExecutiveView?: "simulate" | "compare" | "dashboard" | null;
  /** B.9 — HUD decision context when simulate opened from pipeline CTAs. */
  nexoraB8PanelContext?: NexoraB8PanelContext | null;
  /** B.18 — deterministic scenario variants from resolver (audit + trust). */
  nexoraB18Simulate?: NexoraB18SimulateResolved | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  onSimulateDecision?: (() => void) | null;
  onCompareOptions?: (() => void) | null;
  onOpenTimeline?: (() => void) | null;
  onOpenScenarioTree?: (() => void) | null;
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
  onPreviewDecision?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
  onSaveScenario?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
  onApplyDecisionSafe?: ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void) | null;
};

export default function ExecutiveDashboardPanel(props: ExecutiveDashboardPanelProps) {
  const hasDashboardData = React.useMemo(
    () =>
      Boolean(
        props.sceneJson ??
          props.responseData ??
          props.canonicalRecommendation ??
          props.decisionResult ??
          props.decisionCockpit ??
          props.strategicAdvice ??
          props.riskPropagation ??
          props.decisionMemoryEntries?.length
      ),
    [
      props.sceneJson,
      props.responseData,
      props.canonicalRecommendation,
      props.decisionResult,
      props.decisionCockpit,
      props.strategicAdvice,
      props.riskPropagation,
      props.decisionMemoryEntries,
    ]
  );
  const showSoftEmptyState = !hasDashboardData;

  const fragility =
    props.sceneJson?.scene?.fragility ??
    props.responseData?.fragility ??
    props.responseData?.scene_json?.scene?.fragility ??
    null;
  const fragilityLevel = String(fragility?.level ?? "Unknown").replace(/^\w/, (value) => value.toUpperCase());
  const driverEntries = Array.isArray(props.responseData?.fragility_scan?.drivers)
    ? props.responseData.fragility_scan.drivers.map((driver: any) => ({
        label: String(driver?.label ?? driver?.code ?? "Driver"),
        value: typeof driver?.score === "number" ? `${Math.round(driver.score * 100)} impact` : "Active",
      }))
    : Object.entries((fragility?.drivers ?? {}) as Record<string, unknown>)
        .map(([key, value]) => ({
          label: prettifyLabel(key),
          value: `${Math.round(Number(value ?? 0) * 100)} impact`,
        }))
        .sort((a, b) => Number.parseInt(b.value || "0", 10) - Number.parseInt(a.value || "0", 10));

  const strategicAdvice = props.strategicAdvice ?? props.responseData?.strategic_advice ?? null;
  const cockpitExecutive = props.decisionCockpit?.executive ?? props.responseData?.decision_cockpit?.executive ?? null;
  const canonicalRecommendation = React.useMemo(
    () =>
      props.canonicalRecommendation ??
      props.responseData?.canonical_recommendation ??
      (hasDashboardData
        ? buildCanonicalRecommendation({
            strategicAdvice,
            cockpitExecutive,
            promptFeedback: props.responseData?.prompt_feedback ?? null,
            decisionSimulation: props.responseData?.decision_simulation ?? null,
            reply: props.responseData?.reply ?? null,
          })
        : null),
    [
      cockpitExecutive,
      hasDashboardData,
      props.canonicalRecommendation,
      props.responseData?.canonical_recommendation,
      props.responseData?.decision_simulation,
      props.responseData?.prompt_feedback,
      props.responseData?.reply,
      strategicAdvice,
    ]
  );

  dedupePanelConsoleTrace("PanelComponent", "dashboard", "main", {
    meaningfulData: hasDashboardData,
    hasExecutiveSummary: Boolean(props.responseData?.executive_summary_surface ?? props.responseData?.executive_insight),
    hasDecisionCockpit: Boolean(props.decisionCockpit ?? props.responseData?.decision_cockpit),
    hasRecommendation: Boolean(canonicalRecommendation),
    hasDecisionResult: Boolean(props.decisionResult),
  });

  dedupePanelConsoleTrace("PanelComponent", "dashboard", "surface_state", {
    hasDashboardData,
    showSoftEmptyState,
    activeExecutiveView: props.activeExecutiveView ?? "dashboard",
    hasResponseData: Boolean(props.responseData),
    hasSceneJson: Boolean(props.sceneJson),
    hasRecommendation: Boolean(canonicalRecommendation),
    hasDecisionResult: Boolean(props.decisionResult),
  });

  const decisionBrief = React.useMemo(
    () =>
      guardHeavyComputation("executive_dashboard_decision_brief", () =>
        mapDecisionBrief({
          fragility,
          decisionImpact: props.decisionImpact ?? null,
          strategicAdvice,
          strategicCouncil: null,
          cockpitExecutive,
          canonicalRecommendation,
          promptFeedback: props.responseData?.prompt_feedback ?? null,
          decisionSimulation: props.responseData?.decision_simulation ?? null,
          reply: props.responseData?.reply ?? null,
          selectedObjectLabel: props.selectedObjectLabel ?? null,
          resolveObjectLabel: props.resolveObjectLabel ?? null,
        })
      ),
    [
      canonicalRecommendation,
      cockpitExecutive,
      fragility,
      props.decisionImpact,
      props.responseData?.decision_simulation,
      props.responseData?.prompt_feedback,
      props.responseData?.reply,
      props.resolveObjectLabel,
      props.selectedObjectLabel,
      strategicAdvice,
    ]
  );

  const compareModel = React.useMemo(
    () =>
      guardHeavyComputation("executive_dashboard_compare_model", () =>
        buildComparePanelModel({
          canonicalRecommendation,
          decisionResult: props.decisionResult ?? null,
          strategicAdvice,
          responseData: props.responseData ?? null,
        })
      ),
    [canonicalRecommendation, props.decisionResult, props.responseData, strategicAdvice]
  );

  const nexoraB18SimulateBlock = React.useMemo(
    () => props.nexoraB18Simulate ?? null,
    [props.nexoraB18Simulate?.signature]
  );

  const scenarioTree = React.useMemo(
    () =>
      guardHeavyComputation("executive_dashboard_scenario_tree", () =>
        buildScenarioBranchingTreeModel({
          responseData: props.responseData ?? null,
          canonicalRecommendation,
          decisionResult: props.decisionResult ?? null,
          strategicAdvice,
          memoryEntries: props.decisionMemoryEntries ?? [],
        })
      ),
    [canonicalRecommendation, props.decisionMemoryEntries, props.decisionResult, props.responseData, strategicAdvice]
  );

  const confidenceModel = React.useMemo(
    () =>
      buildDecisionConfidenceModel({
        canonicalRecommendation,
        responseData: props.responseData ?? props.sceneJson ?? null,
        decisionResult: props.decisionResult ?? null,
      }),
    [canonicalRecommendation, props.decisionResult, props.responseData, props.sceneJson]
  );

  const memoryEntries = React.useMemo(() => props.decisionMemoryEntries ?? [], [props.decisionMemoryEntries]);
  const recentMemory = React.useMemo(() => memoryEntries.slice(0, 3), [memoryEntries]);
  const focusLabel =
    props.selectedObjectLabel ??
    resolveLabel(
      props.resolveObjectLabel,
      Array.isArray(props.objectSelection?.highlighted_objects) ? props.objectSelection.highlighted_objects[0] : null
    ) ??
    String(props.sceneJson?.meta?.label ?? props.sceneJson?.meta?.demo_title ?? "Operations");
  const situationText =
    cleanText(
      props.responseData?.executive_summary_surface?.happened ??
        cockpitExecutive?.summary ??
        props.responseData?.analysis_summary ??
        props.responseData?.reply
    ) ?? "Nexora is ready to brief the current operating condition.";
  const whyItMatters =
    cleanText(
      props.responseData?.executive_summary_surface?.why_it_matters ??
        decisionBrief.summary.core_problem ??
        canonicalRecommendation?.reasoning?.risk_summary
    ) ?? "The system is flagging a decision that merits executive review.";
  const pressureIndicators = [
    fragilityLevel !== "Unknown" ? `Fragility ${fragilityLevel}` : null,
    driverEntries[0]?.label ? driverEntries[0].label : null,
    props.riskPropagation?.edges?.length ? `${props.riskPropagation.edges.length} propagation links` : null,
  ].filter((value): value is string => !!value);
  const recommendedTargets =
    canonicalRecommendation?.primary.target_ids?.length
      ? canonicalRecommendation.primary.target_ids
          .slice(0, 2)
          .map((target: string) => resolveLabel(props.resolveObjectLabel, target))
          .join(", ")
      : decisionBrief.summary.primary_object;
  const primaryFuture =
    scenarioTree.branches.find((branch) => branch.id === scenarioTree.recommendedBranchId) ?? scenarioTree.branches[0] ?? null;
  const alternativeFuture =
    scenarioTree.branches.find((branch) => branch.id !== scenarioTree.recommendedBranchId) ?? null;
  const futureDivergence =
    alternativeFuture?.tradeoff_summary ??
    alternativeFuture?.impact_summary ??
    compareModel.tradeoffs[0] ??
    "The main divergence is how much operational stability the recommended path preserves versus the alternatives.";
  const executionIntent = React.useMemo(
    () =>
      buildDecisionExecutionIntent({
        source: "recommendation",
        canonicalRecommendation,
        responseData: props.responseData ?? null,
        decisionResult: props.decisionResult ?? null,
      }),
    [canonicalRecommendation, props.decisionResult, props.responseData]
  );
  const decisionTrace = React.useMemo(
    () =>
      guardHeavyComputation("executive_dashboard_decision_trace", () =>
        buildDecisionTimelineView(
          buildDecisionTimeline({
            responseData: props.responseData ?? null,
            canonicalRecommendation,
            memoryEntries,
          })
        ).slice(-3)
      ),
    [canonicalRecommendation, memoryEntries, props.responseData]
  );
  const calibration = React.useMemo(
    () =>
      buildDecisionConfidenceCalibration({
        canonicalRecommendation,
        confidenceModel,
        outcomeAssessment: buildDecisionOutcomeAssessment({
          canonicalRecommendation,
          responseData: props.responseData ?? null,
          decisionResult: props.decisionResult ?? null,
          memoryEntries,
        }),
        memoryEntries,
      }),
    [canonicalRecommendation, confidenceModel, memoryEntries, props.decisionResult, props.responseData]
  );
  const observedAssessment = React.useMemo(
    () =>
      buildObservedOutcomeAssessment({
        canonicalRecommendation,
        responseData: props.responseData ?? null,
        decisionResult: props.decisionResult ?? null,
        memoryEntries,
      }),
    [canonicalRecommendation, memoryEntries, props.decisionResult, props.responseData]
  );
  const outcomeFeedback = React.useMemo(
    () =>
      buildDecisionOutcomeFeedback({
        canonicalRecommendation,
        observedAssessment,
        memoryEntry: memoryEntries[0] ?? null,
        responseData: props.responseData ?? null,
      }),
    [canonicalRecommendation, memoryEntries, observedAssessment, props.responseData]
  );
  const feedbackCalibration = React.useMemo(
    () =>
      buildDecisionFeedbackSignal({
        canonicalRecommendation,
        outcomeFeedback,
        priorAdjustedScore: memoryEntries[0]?.calibration_result?.adjusted_confidence_score ?? null,
      }),
    [canonicalRecommendation, memoryEntries, outcomeFeedback]
  );
  const patternIntelligence = React.useMemo(
    () =>
      buildDecisionPatternIntelligence({
        memoryEntries,
        canonicalRecommendation,
      }),
    [canonicalRecommendation, memoryEntries]
  );
  const strategicLearning = React.useMemo(
    () =>
      buildStrategicLearningState({
        memoryEntries,
        canonicalRecommendation,
      }),
    [canonicalRecommendation, memoryEntries]
  );
  const metaDecision = React.useMemo(
    () =>
      buildMetaDecisionState({
        reasoning: props.responseData?.ai_reasoning ?? null,
        simulation: props.responseData?.decision_simulation ?? null,
        comparison: props.responseData?.decision_comparison ?? props.responseData?.comparison ?? null,
        canonicalRecommendation,
        calibration,
        responseData: props.responseData ?? null,
        memoryEntries,
      }),
    [
      calibration,
      canonicalRecommendation,
      memoryEntries,
      props.responseData?.ai_reasoning,
      props.responseData?.comparison,
      props.responseData?.decision_comparison,
      props.responseData?.decision_simulation,
      props.responseData,
    ]
  );
  const defaultCognitiveStyle = React.useMemo(
    () =>
      selectDefaultCognitiveStyle({
        activeMode: props.activeMode ?? null,
        rightPanelView: props.activeExecutiveView ?? "dashboard",
        responseData: props.responseData ?? null,
        canonicalRecommendation,
      }),
    [canonicalRecommendation, props.activeExecutiveView, props.activeMode, props.responseData]
  );
  const teamDecision = React.useMemo(
    () =>
      buildTeamDecisionState({
        responseData: props.responseData ?? null,
        canonicalRecommendation,
        decisionResult: props.decisionResult ?? null,
        memoryEntries,
      }),
    [canonicalRecommendation, memoryEntries, props.decisionResult, props.responseData]
  );
  const collaborationEnvelope = React.useMemo(
    () =>
      loadCollaborationEnvelope(
        props.responseData?.workspace_id ?? null,
        props.responseData?.project_id ?? null,
        executionIntent?.id ?? canonicalRecommendation?.id ?? null
      ),
    [props.responseData?.workspace_id, props.responseData?.project_id, executionIntent?.id, canonicalRecommendation?.id]
  );
  const collaborationState = React.useMemo(
    () =>
      buildCollaborationState({
        canonicalRecommendation,
        decisionExecutionIntent: executionIntent,
        responseData: props.responseData ?? null,
        decisionResult: props.decisionResult ?? null,
        memoryEntries,
        collaborationInputs: collaborationEnvelope?.inputs ?? [],
        teamDecisionState: teamDecision,
      }),
    [canonicalRecommendation, collaborationEnvelope?.inputs, executionIntent, memoryEntries, props.decisionResult, props.responseData, teamDecision]
  );
  const decisionCouncil = React.useMemo(
    () =>
      buildAutonomousDecisionCouncilState({
        responseData: props.responseData ?? null,
        canonicalRecommendation,
        decisionResult: props.decisionResult ?? null,
        memoryEntries,
        collaborationInputs: collaborationEnvelope?.inputs ?? [],
      }),
    [canonicalRecommendation, collaborationEnvelope?.inputs, memoryEntries, props.decisionResult, props.responseData]
  );
  const orgMemoryEntries = React.useMemo(() => {
    const scoped = loadOrgScopedDecisionMemoryEntries(props.responseData?.workspace_id ?? null);
    return Array.from(new Map([...scoped, ...memoryEntries].map((entry) => [entry.id, entry])).values());
  }, [props.responseData?.workspace_id, memoryEntries]);
  const orgMemory = React.useMemo(
    () =>
      buildOrgMemoryState({
        memoryEntries: orgMemoryEntries,
        canonicalRecommendation,
      }),
    [canonicalRecommendation, orgMemoryEntries]
  );
  const policy = React.useMemo(
    () =>
      buildDecisionPolicyState({
        canonicalRecommendation,
        decisionExecutionIntent: executionIntent,
        decisionResult: props.decisionResult ?? null,
        responseData: props.responseData ?? null,
        memoryEntries,
      }),
    [canonicalRecommendation, executionIntent, memoryEntries, props.decisionResult, props.responseData]
  );
  const governance = React.useMemo(
    () =>
      buildDecisionGovernanceState({
        canonicalRecommendation,
        decisionExecutionIntent: executionIntent,
        decisionResult: props.decisionResult ?? null,
        responseData: props.responseData ?? null,
        memoryEntries,
        orgMemoryState: orgMemory,
        teamDecisionState: teamDecision,
        metaDecisionState: metaDecision,
        policyState: policy,
      }),
    [canonicalRecommendation, executionIntent, memoryEntries, metaDecision, orgMemory, policy, props.decisionResult, props.responseData, teamDecision]
  );
  const approvalEnvelope = React.useMemo(
    () =>
      loadApprovalWorkflowEnvelope(
        props.responseData?.workspace_id ?? null,
        props.responseData?.project_id ?? null,
        governance.decision_id ?? executionIntent?.id ?? canonicalRecommendation?.id ?? null
      ),
    [props.responseData?.workspace_id, props.responseData?.project_id, governance.decision_id, executionIntent?.id, canonicalRecommendation?.id]
  );
  const approvalWorkflow = React.useMemo(
    () =>
      buildApprovalWorkflowState({
        canonicalRecommendation,
        decisionExecutionIntent: executionIntent,
        decisionGovernance: governance,
        decisionResult: props.decisionResult ?? null,
        responseData: props.responseData ?? null,
        memoryEntries,
        existingWorkflow: approvalEnvelope?.workflow ?? null,
        policyState: policy,
      }),
    [approvalEnvelope?.workflow, canonicalRecommendation, executionIntent, governance, memoryEntries, policy, props.decisionResult, props.responseData]
  );
  const strategicCommand = React.useMemo(
    () =>
      buildStrategicCommandState({
        responseData: props.responseData ?? null,
        canonicalRecommendation,
        decisionResult: props.decisionResult ?? null,
        memoryEntries,
        collaborationInputs: collaborationEnvelope?.inputs ?? [],
        confidenceModel,
        calibration,
        outcomeFeedback,
        metaDecision,
        teamDecision,
        collaborationState,
        orgMemory,
        policyState: policy,
        governanceState: governance,
        approvalWorkflow,
        decisionCouncil,
      }),
    [
      approvalWorkflow,
      calibration,
      canonicalRecommendation,
      collaborationEnvelope?.inputs,
      collaborationState,
      confidenceModel,
      decisionCouncil,
      governance,
      memoryEntries,
      metaDecision,
      orgMemory,
      outcomeFeedback,
      policy,
      props.decisionResult,
      props.responseData,
      teamDecision,
    ]
  );
  const surfaceLabel =
    props.activeExecutiveView === "simulate"
      ? "Decision Simulation"
      : props.activeExecutiveView === "compare"
        ? "Compare Options"
        : "Executive Dashboard";
  const surfaceSummary =
    props.activeExecutiveView === "simulate"
      ? "Review the current recommendation, trust level, and projected impact before you simulate."
      : props.activeExecutiveView === "compare"
        ? "Scan the recommendation, alternatives, and future paths before committing to a deeper comparison."
        : "Understand the situation, trust the recommendation, scan alternatives, and take action from one decision cockpit.";
  const simulationContract = props.responseData?.decision_simulation ?? null;
  const simulationSummary =
    cleanText(simulationContract?.summary ?? simulationContract?.impact?.summary) ?? null;
  const simulationImpactedNodes = Array.isArray(simulationContract?.impacted_nodes)
    ? simulationContract.impacted_nodes.map(String).filter(Boolean)
    : Array.isArray(simulationContract?.affected_objects)
      ? simulationContract.affected_objects.map(String).filter(Boolean)
      : [];
  const simulationRiskDelta =
    typeof simulationContract?.risk_delta === "number"
      ? simulationContract.risk_delta
      : typeof simulationContract?.impact?.risk_change === "number"
        ? simulationContract.impact.risk_change
        : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0, overflow: "auto", padding: 2 }}>
      <div
        style={{
          padding: 14,
          borderRadius: 18,
          border: `1px solid ${nx.border}`,
          background: "linear-gradient(180deg, rgba(15,23,42,0.68), rgba(2,6,23,0.32))",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ color: "#f8fafc", fontSize: 16, fontWeight: 800 }}>{surfaceLabel}</div>
          {props.activeMode ? (
            <div
              style={{
                padding: "5px 8px",
                borderRadius: 999,
                border: `1px solid ${nx.border}`,
                background: "rgba(2,6,23,0.45)",
                color: "#cbd5f5",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {props.activeMode}
            </div>
          ) : null}
        </div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45, maxWidth: 480 }}>{surfaceSummary}</div>
        {showSoftEmptyState ? (
          <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
            <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>Executive Dashboard</div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
              Waiting for decision context. Nexora is keeping the dashboard surface open while data settles.
            </div>
            {props.onOpenStrategicCommand ? (
              <div>
                <button type="button" onClick={props.onOpenStrategicCommand} style={secondaryButtonStyle}>
                  Open Strategic Command
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
        {props.activeExecutiveView === "simulate" && props.nexoraB8PanelContext ? (
          <div
            style={{
              ...softCardStyle,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              borderLeft: "3px solid rgba(96,165,250,0.55)",
            }}
          >
            <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Current decision context
            </div>
            {buildSimulateMeaningRows(props.nexoraB8PanelContext).map((row) => (
              <div key={row.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ color: nx.muted, fontSize: 10, fontWeight: 700 }}>{row.label}</span>
                <span style={{ color: nx.text, fontSize: 11, lineHeight: 1.4 }}>{row.text}</span>
              </div>
            ))}
          </div>
        ) : null}
        {props.activeExecutiveView === "simulate" && nexoraB18SimulateBlock?.variants?.length ? (
          <div style={{ ...softCardStyle, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Simulated paths (B.18)
            </div>
            <div style={{ color: nx.muted, fontSize: 11, lineHeight: 1.45 }}>
              Deterministic branches from audit + trust. No new ingestion or scanner calls.
            </div>
            {nexoraB18SimulateBlock.memoryInsights ? (
              <div style={{ color: "#bae6fd", fontSize: 11, fontWeight: 700, lineHeight: 1.45 }}>
                Historical pattern:{" "}
                {nexoraB18SimulateBlock.memoryInsights.historicalPatternLabel === "stable"
                  ? "stable"
                  : nexoraB18SimulateBlock.memoryInsights.historicalPatternLabel === "risky"
                    ? "risky"
                    : "mixed"}
              </div>
            ) : null}
            {(nexoraB18SimulateBlock.decisionContext.posture ||
              nexoraB18SimulateBlock.decisionContext.tradeoff ||
              nexoraB18SimulateBlock.decisionContext.nextMove) && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 700 }}>Decision context</div>
                {nexoraB18SimulateBlock.decisionContext.posture ? (
                  <div style={{ color: nx.text, fontSize: 11 }}>
                    <strong>Posture:</strong> {nexoraB18SimulateBlock.decisionContext.posture}
                  </div>
                ) : null}
                {nexoraB18SimulateBlock.decisionContext.tradeoff ? (
                  <div style={{ color: nx.muted, fontSize: 10 }}>
                    <strong>Tradeoff:</strong> {nexoraB18SimulateBlock.decisionContext.tradeoff}
                  </div>
                ) : null}
                {nexoraB18SimulateBlock.decisionContext.nextMove ? (
                  <div style={{ color: nx.muted, fontSize: 10 }}>
                    <strong>Next move:</strong> {nexoraB18SimulateBlock.decisionContext.nextMove}
                  </div>
                ) : null}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
              {nexoraB18SimulateBlock.variants.map((v) => (
                <div
                  key={v.id}
                  style={{
                    ...softCardStyle,
                    padding: 10,
                    gap: 4,
                    border:
                      v.id === nexoraB18SimulateBlock.recommendedOptionId
                        ? "1px solid rgba(34,197,94,0.35)"
                        : `1px solid ${nx.border}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                    <span style={{ color: nx.text, fontSize: 12, fontWeight: 800 }}>{v.label}</span>
                    {v.id === nexoraB18SimulateBlock.recommendedOptionId ? (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          color: "#bbf7d0",
                          border: "1px solid rgba(34,197,94,0.35)",
                          borderRadius: 999,
                          padding: "2px 6px",
                        }}
                      >
                        Recommended
                      </span>
                    ) : null}
                  </div>
                  <div style={{ color: nx.lowMuted, fontSize: 10 }}>
                    {v.fragilityLevel} fragility · {v.confidenceTier ?? "—"} confidence
                  </div>
                  <div style={{ color: "#93c5fd", fontSize: 10, lineHeight: 1.35 }}>
                    {v.drivers.slice(0, 3).join(" · ")}
                  </div>
                  <div style={{ color: nx.muted, fontSize: 10, lineHeight: 1.35 }}>{v.summary}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {props.activeExecutiveView === "simulate" ? (
          simulationSummary || simulationImpactedNodes.length || simulationRiskDelta !== null ? (
            <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
              <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>Simulation Output</div>
              <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
                {simulationSummary ?? "Simulation result is available for the current decision."}
              </div>
              {simulationImpactedNodes.length ? (
                <div style={{ color: "#cbd5e1", fontSize: 11 }}>
                  Impacted objects: {simulationImpactedNodes.slice(0, 6).join(", ")}
                </div>
              ) : null}
              {simulationRiskDelta !== null ? (
                <div style={{ color: simulationRiskDelta <= 0 ? "#86efac" : "#fca5a5", fontSize: 11 }}>
                  Risk change: {simulationRiskDelta > 0 ? "+" : ""}
                  {simulationRiskDelta.toFixed(2)}
                </div>
              ) : null}
            </div>
          ) : (
            <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
              <div style={{ color: nx.muted, fontSize: 12 }}>
                Run simulation to generate what-if propagation and impacted nodes.
              </div>
              <div>
                <button type="button" onClick={props.onSimulateDecision ?? (() => {})} style={secondaryButtonStyle}>
                  Run simulation
                </button>
              </div>
            </div>
          )
        ) : null}
      </div>

      {hasDashboardData ? (
        <>
      {props.demoProfile ? <CustomerDemoHero profile={props.demoProfile} /> : null}

      <DashboardSection
        label="Strategic Command"
        title={strategicCommand.headline}
        summary={strategicCommand.summary}
        accent="primary"
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <OptionSummaryCard
              title={`Priority: ${prettifyLabel(strategicCommand.priority)}`}
              summary={strategicCommand.priority_reason}
              tradeoff={strategicCommand.alerts[0]?.summary ?? null}
              accent
            />
            <OptionSummaryCard
              title="Next move"
              summary={strategicCommand.next_move}
              tradeoff={strategicCommand.next_move_reason}
            />
          </div>
          <PreviewAside
            label="Command posture"
            body={strategicCommand.explanation}
            ctaLabel="Open Strategic Command"
            onClick={props.onOpenStrategicCommand ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection label="Current Situation" title={focusLabel} summary={situationText}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            <BriefBlock label="What happened" text={situationText} />
            <BriefBlock label="Why it matters" text={whyItMatters} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            <DashboardStat label="Risk" value={fragilityLevel} tone={riskTone(decisionBrief.summary.risk_level)} />
            <DashboardStat label="Focus" value={decisionBrief.summary.primary_object} />
            <DashboardStat label="Pressure" value={pressureIndicators[0] ?? "Contained"} />
          </div>
        </div>
      </DashboardSection>

      <DashboardSection
        label="Recommended Move"
        title={decisionBrief.recommendation.action_title}
        summary={canonicalRecommendation?.reasoning.why ?? decisionBrief.recommendation.reasoning}
        accent="primary"
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ ...softCardStyle, padding: 12, gap: 8, border: "1px solid rgba(96,165,250,0.24)" }}>
            <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Action
            </div>
            <div style={{ color: "#f8fafc", fontSize: 16, fontWeight: 800, lineHeight: 1.3 }}>
              {decisionBrief.recommendation.action_title}
            </div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
              {canonicalRecommendation?.reasoning.why ?? decisionBrief.recommendation.reasoning}
            </div>
            <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 2 }}>
              Expected impact
            </div>
            <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800 }}>
              {decisionBrief.expected_impact.primary_effect}
            </div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
              {decisionBrief.expected_impact.system_change_summary}
            </div>
            <div style={{ color: "#93c5fd", fontSize: 11 }}>{decisionBrief.value_framing.qualitative_roi}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            <CompactTrustCard
              level={confidenceModel.level}
              score={confidenceModel.overall_score}
              explanation={confidenceModel.explanation}
              assumption={confidenceModel.assumptions[0] ?? null}
              uncertainty={confidenceModel.uncertainties[0] ?? null}
              traceSummary={decisionTrace.map((event) => event.title).join(" -> ")}
              onWhyThis={props.onOpenDecisionTimeline ?? null}
              calibrationLabel={calibration.calibration_label}
              onOpenCalibration={props.onOpenConfidenceCalibration ?? null}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <DashboardStat label="Confidence" value={`${Math.round(decisionBrief.summary.confidence * 100)}%`} tone="#93c5fd" />
              <DashboardStat label="Urgency" value={decisionBrief.recommendation.urgency.toUpperCase()} tone={riskTone(decisionBrief.summary.risk_level)} />
            </div>
            <DashboardStat label="Targets" value={recommendedTargets} />
          </div>
        </div>
      </DashboardSection>

      <DashboardSection
        label="Option Comparison Preview"
        title="Alternatives at a glance"
        summary={compareModel.compareSummary ?? "Compare the recommended move with the next strongest alternatives."}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
            <OptionSummaryCard
              title={compareModel.recommendedOption?.title ?? decisionBrief.recommendation.action_title}
              summary={compareModel.recommendedOption?.impact_summary ?? compareModel.reasoningWhy ?? "Recommended path"}
              tradeoff={compareModel.recommendedOption?.tradeoff ?? null}
              badge="Recommended"
              accent
            />
            {compareModel.alternatives.slice(0, 2).map((option) => (
              <OptionSummaryCard
                key={option.id}
                title={option.title}
                summary={option.impact_summary ?? option.summary ?? "Alternative path"}
                tradeoff={option.tradeoff ?? null}
              />
            ))}
            {!compareModel.alternatives.length ? (
              <OptionSummaryCard
                title="No alternative yet"
                summary="Run Compare Options to surface another decision path."
                tradeoff={null}
              />
            ) : null}
          </div>
          <PreviewAside
            label="Trade-off"
            body={
              compareModel.tradeoffs[0] ??
              compareModel.whyNotOthers[0] ??
              "The recommended move currently offers the strongest visible balance."
            }
            ctaLabel="Open Compare"
            onClick={props.onCompareOptions ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Future Path Preview"
        title="How the future could diverge"
        summary="Preview the recommended future against one meaningful alternative."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <FuturePathCard
              label="Recommended future"
              title={primaryFuture?.title ?? "Preferred path"}
              summary={primaryFuture?.summary ?? "No recommended future is visible yet."}
              accent
            />
            <FuturePathCard
              label="Alternative future"
              title={alternativeFuture?.title ?? "No alternative path yet"}
              summary={alternativeFuture?.summary ?? "Use Compare Options to expose another plausible future."}
            />
          </div>
          <PreviewAside
            label="Divergence"
            body={futureDivergence}
            ctaLabel={scenarioTree.compareAvailable ? "Open Scenario Tree" : "Open Timeline"}
            onClick={(scenarioTree.compareAvailable ? props.onOpenScenarioTree : props.onOpenTimeline) ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Pattern Intelligence"
        title="What similar decisions usually teach"
        summary="Use recurring decision evidence to sharpen the current recommendation without opening a separate review surface."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <OptionSummaryCard
              title="Pattern signal"
              summary={
                patternIntelligence.current_pattern_note ??
                patternIntelligence.top_success_patterns[0] ??
                "No strong recurring pattern is visible yet."
              }
              tradeoff={null}
              accent
            />
            <OptionSummaryCard
              title="Pattern warning"
              summary={
                patternIntelligence.top_failure_patterns[0] ??
                patternIntelligence.repeated_uncertainties[0] ??
                "No recurring weak spot has surfaced yet."
              }
              tradeoff={patternIntelligence.repeated_tradeoffs[0] ?? null}
            />
          </div>
          <PreviewAside
            label="Pattern-backed hint"
            body={
              patternIntelligence.recommendation_hint ??
              "Nexora needs more replay and outcome evidence before it can learn strong recurring decision behavior."
            }
            ctaLabel="Open Pattern Intelligence"
            onClick={props.onOpenPatternIntelligence ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Strategic Learning"
        title="How long-term guidance is evolving"
        summary="Use long-term memory, calibration, and pattern evidence to improve future recommendations."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <OptionSummaryCard
              title="Learning signal"
              summary={
                strategicLearning.learning_signals[0]?.summary ??
                "Strategic learning is still limited."
              }
              tradeoff={strategicLearning.current_recommendation_note ?? null}
              accent
            />
            <OptionSummaryCard
              title="Memory maturity"
              summary={strategicLearning.memory_evolution.summary}
              tradeoff={
                strategicLearning.domain_drift.drift_detected
                  ? strategicLearning.domain_drift.summary
                  : null
              }
            />
          </div>
          <PreviewAside
            label="Long-term guidance"
            body={
              strategicLearning.strategic_guidance ??
              "Nexora needs more replay-backed and calibrated decisions before stronger long-term guidance is available."
            }
            ctaLabel="Open Strategic Learning"
            onClick={props.onOpenStrategicLearning ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Decision Strategy"
        title="How Nexora is deciding this"
        summary="The meta-decision layer chooses the best decision approach before locking into a path."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <OptionSummaryCard
              title={prettifyLabel(metaDecision.selected_strategy)}
              summary={metaDecision.rationale}
              tradeoff={`Evidence ${prettifyLabel(metaDecision.evidence_strength)}, uncertainty ${prettifyLabel(metaDecision.uncertainty_level)}`}
              accent
            />
            <OptionSummaryCard
              title="Next posture"
              summary={prettifyLabel(metaDecision.action_posture)}
              tradeoff={metaDecision.warnings[0] ?? metaDecision.constraints[0] ?? null}
            />
          </div>
          <PreviewAside
            label="Why this strategy"
            body={metaDecision.rationale}
            ctaLabel="Open Decision Strategy"
            onClick={props.onOpenMetaDecision ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Decision Lens"
        title={`View as ${prettifyLabel(defaultCognitiveStyle.style)}`}
        summary="Nexora can reframe the same decision for different roles without changing the underlying recommendation."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <OptionSummaryCard
              title={`${prettifyLabel(defaultCognitiveStyle.style)} lens`}
              summary={defaultCognitiveStyle.reason}
              tradeoff="Same decision truth, different emphasis and next-action framing."
              accent
            />
            <OptionSummaryCard
              title="Useful for"
              summary={
                defaultCognitiveStyle.style === "executive"
                  ? "Clarity, impact, and next move"
                  : defaultCognitiveStyle.style === "analyst"
                    ? "Assumptions, evidence, and uncertainty"
                    : defaultCognitiveStyle.style === "operator"
                      ? "Dependencies, bottlenecks, and execution"
                      : "Exposure, downside, and resilience"
              }
              tradeoff={null}
            />
          </div>
          <PreviewAside
            label="Role-aware view"
            body="Switch between executive, analyst, operator, and investor framing without changing the recommendation."
            ctaLabel="Open Decision Lens"
            onClick={props.onOpenCognitiveStyle ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Team Decision"
        title="How the team is likely to align"
        summary="Bring executive, analyst, operator, and investor perspectives into one decision room without changing the shared recommendation."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <OptionSummaryCard
              title={`Team alignment: ${prettifyLabel(teamDecision.alignment.alignment_level)}`}
              summary={teamDecision.alignment.agreement_points[0] ?? "Team agreement is still forming."}
              tradeoff={teamDecision.alignment.disagreement_points[0] ?? null}
              accent
            />
            <OptionSummaryCard
              title="Team next move"
              summary={teamDecision.team_next_move}
              tradeoff={teamDecision.alignment.unresolved_questions[0] ?? null}
            />
          </div>
          <PreviewAside
            label="Collaboration signal"
            body={
              teamDecision.alignment.disagreement_points[0] ??
              "The team is broadly aligned around the current recommendation."
            }
            ctaLabel="Open Team Decision"
            onClick={props.onOpenTeamDecision ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Collaboration Intelligence"
        title={`Collaboration: ${prettifyLabel(collaborationState.alignment.alignment_level)}`}
        summary="Track how multiple contributors are shaping the same decision without turning the cockpit into a chat surface."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <OptionSummaryCard
              title="Main disagreement"
              summary={collaborationState.alignment.disagreement_points[0] ?? "No major disagreement is visible yet."}
              tradeoff={collaborationState.alignment.unresolved_questions[0] ?? null}
              accent
            />
            <OptionSummaryCard
              title="Next step"
              summary={collaborationState.next_steps[0] ?? "Add structured collaboration input."}
              tradeoff={collaborationState.decision_delta.changed ? collaborationState.decision_delta.summary : null}
            />
          </div>
          <PreviewAside
            label="Contributor signal"
            body={
              collaborationState.inputs[0]?.summary ??
              "Add structured team input to activate collaboration intelligence."
            }
            ctaLabel="Open Collaboration Intelligence"
            onClick={props.onOpenCollaborationIntelligence ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Decision Council"
        title={`Council consensus: ${prettifyLabel(decisionCouncil.consensus.consensus_level)}`}
        summary="Pressure-test the recommendation through Nexora's internal strategy, risk, operations, finance, and skepticism review."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <OptionSummaryCard
              title="Final recommendation"
              summary={decisionCouncil.consensus.final_recommendation}
              tradeoff={decisionCouncil.consensus.main_reservations[0] ?? null}
              accent
            />
            <OptionSummaryCard
              title="Next step"
              summary={decisionCouncil.next_steps[0] ?? "Open the council view for a fuller review."}
              tradeoff={decisionCouncil.debate.conflict_points[0] ?? null}
            />
          </div>
          <PreviewAside
            label="Council reservation"
            body={decisionCouncil.consensus.main_reservations[0] ?? decisionCouncil.explanation}
            ctaLabel="Open Decision Council"
            onClick={props.onOpenDecisionCouncil ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Organization Memory"
        title="What the organization has already learned"
        summary="Use cross-project decision memory to strengthen the current recommendation with broader organizational evidence."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <OptionSummaryCard
              title="Org memory signal"
              summary={
                orgMemory.current_decision_note ??
                orgMemory.relevant_signals[0]?.summary ??
                "Organization memory is still limited."
              }
              tradeoff={orgMemory.recurring_failures[0] ?? null}
              accent
            />
            <OptionSummaryCard
              title="Org guidance"
              summary={
                orgMemory.org_guidance ??
                "Nexora needs more cross-project replay-backed and calibrated evidence before stronger org guidance is available."
              }
              tradeoff={orgMemory.recurring_tradeoffs[0] ?? null}
            />
          </div>
          <PreviewAside
            label="Cross-project signal"
            body={
              orgMemory.relevant_signals[0]?.summary ??
              orgMemory.explanation
            }
            ctaLabel="Open Organization Memory"
            onClick={props.onOpenOrgMemory ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Decision Policy"
        title={`Policy: ${prettifyLabel(policy.posture)}`}
        summary="Understand which upstream policy drivers are shaping governance, approval, and action posture."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <OptionSummaryCard
              title="Policy driver"
              summary={policy.policy_drivers[0] ?? "No strong policy driver is visible yet."}
              tradeoff={policy.constraints[0] ?? null}
              accent
            />
            <OptionSummaryCard
              title="Next step"
              summary={policy.next_steps[0] ?? "Review policy posture before stronger action."}
              tradeoff={policy.active_rules[0] ? `Active rule: ${policy.active_rules[0].label}` : null}
            />
          </div>
          <PreviewAside
            label="Policy posture"
            body={policy.explanation}
            ctaLabel="Open Decision Policy"
            onClick={props.onOpenDecisionPolicy ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Decision Governance"
        title={`Governance: ${prettifyLabel(governance.mode)}`}
        summary="Use governance posture to see which actions are allowed now, which are gated, and what review is still required."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <OptionSummaryCard
              title="Allowed now"
              summary={governance.allowed_actions.map(prettifyLabel).join(", ") || "No action is currently allowed."}
              tradeoff={governance.blocked_actions[0] ? `Blocked: ${prettifyLabel(governance.blocked_actions[0])}` : null}
              accent
            />
            <OptionSummaryCard
              title="Next step"
              summary={governance.next_steps[0] ?? "Review governance before acting."}
              tradeoff={governance.approval.required ? `Approval: ${prettifyLabel(governance.approval.approver_role ?? "manager")}` : null}
            />
          </div>
          <PreviewAside
            label="Governance posture"
            body={governance.explanation}
            ctaLabel="Open Decision Governance"
            onClick={props.onOpenDecisionGovernance ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Executive Approval"
        title={`Approval: ${prettifyLabel(approvalWorkflow.status)}`}
        summary="Track whether this decision needs review, who owns it, and what remains blocked until approval is resolved."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <OptionSummaryCard
              title="Approval status"
              summary={approvalWorkflow.explanation}
              tradeoff={approvalWorkflow.blocked_until_approval_actions[0] ? `Blocked: ${prettifyLabel(approvalWorkflow.blocked_until_approval_actions[0])}` : null}
              accent
            />
            <OptionSummaryCard
              title="Next step"
              summary={approvalWorkflow.next_steps[0] ?? "Review approval posture before apply."}
              tradeoff={approvalWorkflow.requested_reviewer_role ? `Reviewer: ${prettifyLabel(approvalWorkflow.requested_reviewer_role)}` : null}
            />
          </div>
          <PreviewAside
            label="Approval posture"
            body={approvalWorkflow.explanation}
            ctaLabel="Open Executive Approval"
            onClick={props.onOpenExecutiveApproval ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Outcome Feedback"
        title="How prediction compares with reality"
        summary="Close the loop by checking whether observed evidence is matching the expected result."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <OptionSummaryCard
              title="Expected"
              summary={outcomeFeedback.expected_summary ?? "No expected outcome has been captured yet."}
              tradeoff={null}
              accent
            />
            <OptionSummaryCard
              title="Observed"
              summary={outcomeFeedback.observed_summary ?? "No observed outcome evidence is available yet."}
              tradeoff={
                observedAssessment.observation_available
                  ? `Observation strength: ${prettifyLabel(observedAssessment.observation_strength)}`
                  : null
              }
            />
          </div>
          <PreviewAside
            label="Calibration"
            body={`${prettifyLabel(feedbackCalibration.calibration_label)}. ${outcomeFeedback.feedback_summary}`}
            ctaLabel="Open Outcome Feedback"
            onClick={props.onOpenOutcomeFeedback ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Recent Decision Memory"
        title="What you reviewed recently"
        summary="Keep the latest strategic moves in view without opening a separate history surface."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
            {recentMemory.length ? (
              recentMemory.map((entry) => (
                <div key={entry.id} style={{ ...softCardStyle, padding: 12, gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{entry.title}</div>
                    <div style={{ color: nx.lowMuted, fontSize: 11 }}>{formatRelativeTime(entry.created_at)}</div>
                  </div>
                  <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
                    {entry.recommendation_summary ?? entry.situation_summary ?? "Recent decision snapshot available."}
                  </div>
                  {entry.recommendation_action ? (
                    <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700 }}>
                      {entry.recommendation_action}
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <div style={{ ...softCardStyle, padding: 12, gap: 6, gridColumn: "1 / -1" }}>
                <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
                  No recent decisions yet. Run a simulation or comparison to build decision memory.
                </div>
              </div>
            )}
          </div>
          <PreviewAside
            label="Recent pattern"
            body={
              recentMemory[0]?.impact_summary ??
              recentMemory[0]?.recommendation_summary ??
              "No recent decision pattern is visible yet."
            }
            ctaLabel="Open Decision Memory"
            onClick={props.onOpenMemory ?? null}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        label="Actions"
        title="Take the next step"
        summary="A manager should be able to act from this screen alone."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 10 }}>
          <DecisionActionBar
            intent={executionIntent}
            policyState={policy}
            governanceState={governance}
            approvalWorkflowState={approvalWorkflow}
            onOpenPolicy={props.onOpenDecisionPolicy ?? null}
            onOpenApproval={props.onOpenExecutiveApproval ?? null}
            onSimulateDecision={() => props.onSimulateDecision?.()}
            onPreviewImpact={props.onPreviewDecision ?? null}
            onCompareAlternatives={() => props.onCompareOptions?.()}
            onSaveScenario={props.onSaveScenario ?? null}
            onApplySafeMode={props.onApplyDecisionSafe ?? null}
          />
          <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
            <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Drill down
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={props.onOpenWarRoom ?? (() => {})} style={secondaryButtonStyle}>
                Open War Room
              </button>
              <button type="button" onClick={props.onOpenStrategicCommand ?? (() => {})} style={secondaryButtonStyle}>
                Open Strategic Command
              </button>
              <button type="button" onClick={props.onOpenDecisionLifecycle ?? (() => {})} style={secondaryButtonStyle}>
                Open Lifecycle
              </button>
              <button type="button" onClick={props.onOpenStrategicLearning ?? (() => {})} style={secondaryButtonStyle}>
                Open Learning
              </button>
              <button type="button" onClick={props.onOpenMetaDecision ?? (() => {})} style={secondaryButtonStyle}>
                Open Strategy
              </button>
              <button type="button" onClick={props.onOpenCognitiveStyle ?? (() => {})} style={secondaryButtonStyle}>
                Open Lens
              </button>
              <button type="button" onClick={props.onOpenTeamDecision ?? (() => {})} style={secondaryButtonStyle}>
                Open Team Decision
              </button>
              <button type="button" onClick={props.onOpenCollaborationIntelligence ?? (() => {})} style={secondaryButtonStyle}>
                Open Collaboration
              </button>
              <button type="button" onClick={props.onOpenDecisionCouncil ?? (() => {})} style={secondaryButtonStyle}>
                Open Decision Council
              </button>
              <button type="button" onClick={props.onOpenOrgMemory ?? (() => {})} style={secondaryButtonStyle}>
                Open Org Memory
              </button>
              <button type="button" onClick={props.onOpenDecisionPolicy ?? (() => {})} style={secondaryButtonStyle}>
                Open Policy
              </button>
              <button type="button" onClick={props.onOpenDecisionGovernance ?? (() => {})} style={secondaryButtonStyle}>
                Open Governance
              </button>
              <button type="button" onClick={props.onOpenExecutiveApproval ?? (() => {})} style={secondaryButtonStyle}>
                Open Approval
              </button>
              <button type="button" onClick={props.onOpenTimeline ?? (() => {})} style={secondaryButtonStyle}>
                View Timeline
              </button>
              <button type="button" onClick={props.onOpenScenarioTree ?? (() => {})} style={secondaryButtonStyle}>
                Open Scenario Tree
              </button>
            </div>
          </div>
        </div>
      </DashboardSection>
        </>
      ) : null}
    </div>
  );
}

function cleanText(value: unknown) {
  const text = String(value ?? "").trim();
  return text || null;
}

function prettifyLabel(value: string) {
  return String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function resolveLabel(resolveObjectLabel: ExecutiveDashboardPanelProps["resolveObjectLabel"], id: unknown) {
  const raw = typeof id === "string" ? id : "";
  if (!raw) return "Unknown";
  return resolveObjectLabel?.(raw) ?? prettifyLabel(raw.replace(/^obj_/, ""));
}

function DashboardSection(props: {
  label: string;
  title: string;
  summary: string;
  accent?: "primary" | "neutral";
  children: React.ReactNode;
}) {
  const primary = props.accent === "primary";
  return (
    <div
      style={{
        ...panelSurfaceStyle,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        border: primary ? "1px solid rgba(96,165,250,0.24)" : `1px solid ${nx.border}`,
        background: primary
          ? "linear-gradient(180deg, rgba(15,23,42,0.88), rgba(8,47,73,0.46))"
          : "rgba(15,23,42,0.78)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ color: primary ? "#bfdbfe" : "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {props.label}
        </div>
        <div style={{ color: "#f8fafc", fontSize: primary ? 16 : 15, fontWeight: 800 }}>{props.title}</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.summary}</div>
      </div>
      {props.children}
    </div>
  );
}

function BriefBlock(props: { label: string; text: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
      <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {props.label}
      </div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{props.text}</div>
    </div>
  );
}

function DashboardStat(props: { label: string; value: string; tone?: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 10, gap: 4, minHeight: 0 }}>
      <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {props.label}
      </div>
      <div
        style={{
          color: props.tone ?? nx.text,
          fontSize: 12,
          fontWeight: 800,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {props.value}
      </div>
    </div>
  );
}

function CompactTrustCard(props: {
  level: "low" | "medium" | "high";
  score: number;
  explanation: string;
  assumption: string | null;
  uncertainty: string | null;
  traceSummary: string;
  onWhyThis?: (() => void) | null;
  calibrationLabel: string;
  onOpenCalibration?: (() => void) | null;
}) {
  const tone = props.level === "high" ? nx.success : props.level === "medium" ? nx.warning : nx.risk;
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Confidence / Trust
        </div>
        <div style={{ color: tone, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {props.level} {Math.round(props.score * 100)}%
        </div>
      </div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{props.explanation}</div>
      {props.assumption ? (
        <div style={{ color: "#cbd5e1", fontSize: 11, lineHeight: 1.45 }}>
          Assumes: {props.assumption}
        </div>
      ) : null}
      {props.uncertainty ? (
        <div style={{ color: nx.warning, fontSize: 11, lineHeight: 1.45 }}>
          Watch out: {props.uncertainty}
        </div>
      ) : null}
      <div style={{ color: "#cbd5e1", fontSize: 11, lineHeight: 1.45 }}>
        Decision trace: {props.traceSummary || "Trace available in the audit trail."}
      </div>
      <div style={{ color: "#cbd5f5", fontSize: 11, lineHeight: 1.45 }}>
        Calibration: {prettifyLabel(props.calibrationLabel)}
      </div>
      {props.onWhyThis ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={props.onWhyThis} style={secondaryButtonStyle}>
            Why this?
          </button>
          {props.onOpenCalibration ? (
            <button type="button" onClick={props.onOpenCalibration} style={secondaryButtonStyle}>
              Open Calibration
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function OptionSummaryCard(props: {
  title: string;
  summary: string;
  tradeoff: string | null;
  badge?: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        ...softCardStyle,
        padding: 12,
        gap: 8,
        border: props.accent ? "1px solid rgba(96,165,250,0.24)" : `1px solid ${nx.border}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
        <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{props.title}</div>
        {props.badge ? (
          <div style={{ color: "#93c5fd", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {props.badge}
          </div>
        ) : null}
      </div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.summary}</div>
      {props.tradeoff ? (
        <div style={{ color: "#cbd5e1", fontSize: 11, lineHeight: 1.4 }}>Trade-off: {props.tradeoff}</div>
      ) : null}
    </div>
  );
}

function FuturePathCard(props: { label: string; title: string; summary: string; accent?: boolean }) {
  return (
    <div
      style={{
        ...softCardStyle,
        padding: 12,
        gap: 8,
        border: props.accent ? "1px solid rgba(96,165,250,0.24)" : `1px solid ${nx.border}`,
      }}
    >
      <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
        {props.label}
      </div>
      <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{props.title}</div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.summary}</div>
    </div>
  );
}

function PreviewAside(props: { label: string; body: string; ctaLabel: string; onClick?: (() => void) | null }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
      <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
        {props.label}
      </div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5, flex: 1 }}>{props.body}</div>
      <div>
        <button type="button" onClick={props.onClick ?? (() => {})} style={secondaryButtonStyle}>
          {props.ctaLabel}
        </button>
      </div>
    </div>
  );
}

function formatRelativeTime(timestamp: number) {
  const deltaMs = Date.now() - timestamp;
  const deltaMinutes = Math.max(1, Math.round(deltaMs / 60000));
  if (deltaMinutes < 60) return `${deltaMinutes}m ago`;
  const deltaHours = Math.round(deltaMinutes / 60);
  if (deltaHours < 24) return `${deltaHours}h ago`;
  const deltaDays = Math.round(deltaHours / 24);
  return `${deltaDays}d ago`;
}

function riskTone(level: "low" | "medium" | "high" | "critical") {
  if (level === "critical") return nx.risk;
  if (level === "high") return "#fda4af";
  if (level === "medium") return nx.warning;
  return nx.success;
}
