/**
 * Phase 4:1 — Executive Summary aggregation from dashboard and scene context.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import {
  type ExecutiveAttentionLevel,
  type ExecutiveSummaryAggregationInput,
  type ExecutiveSummaryAggregationSource,
  type ExecutiveSummaryCard,
  type ExecutiveSummarySurfaceModel,
  type SystemStatusLevel,
  CANONICAL_EXECUTIVE_SUMMARY_OWNER,
  CANONICAL_EXECUTIVE_SUMMARY_SURFACE_ID,
} from "./executiveSummaryContract.ts";
import { getDashboardSurfaceVisualBundle } from "../dashboardSurfaceVisualRegistry.ts";
import {
  reportExecutiveAttention,
  reportExecutiveSummary,
  reportExecutiveSummarySurface,
  reportSummaryAggregation,
} from "./executiveSummaryLogging.ts";
import { getOperationalIntelligenceSnapshotForExecutiveSummary } from "../operationalIntelligence/operationalIntelligenceRuntime.ts";
import { getRiskIntelligenceSnapshotForExecutiveSummary } from "../riskIntelligence/riskIntelligenceRuntime.ts";
import { getTimelineIntelligenceSnapshotForExecutiveSummary } from "../timelineIntelligence/timelineIntelligenceRuntime.ts";
import { getScenarioIntelligenceSnapshotForExecutiveSummary } from "../scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { getWarRoomIntelligenceSnapshotForExecutiveSummary } from "../warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import { getExecutiveAdvisorySnapshotForExecutiveSummary } from "../executiveAdvisory/executiveAdvisoryRuntime.ts";
import { getAdvisoryContextForExecutiveSummary } from "../executiveAdvisory/aggregation/advisoryAggregationRuntime.ts";
import { getAdvisoryConfidenceForExecutiveSummary } from "../executiveAdvisory/confidence/advisoryConfidenceRuntime.ts";
import { getAdvisoryExplanationForExecutiveSummary } from "../executiveAdvisory/explainability/advisoryExplainabilityRuntime.ts";
import { getDecisionGuidanceSnapshotForExecutiveSummary } from "../decisionGuidance/decisionGuidanceRuntime.ts";
import { getGovernanceIntelligenceSnapshotForExecutiveSummary } from "../governanceIntelligence/governanceIntelligenceRuntime.ts";
import { getStrategicAlignmentSnapshotForExecutiveSummary } from "../strategicAlignment/strategicAlignmentRuntime.ts";
import { getPolicyConstraintIntelligenceSnapshotForExecutiveSummary } from "../policyConstraintIntelligence/policyConstraintIntelligenceRuntime.ts";
import { getStakeholderIntelligenceSnapshotForExecutiveSummary } from "../stakeholderIntelligence/stakeholderIntelligenceRuntime.ts";
import { getConsensusIntelligenceSnapshotForExecutiveSummary } from "../consensusIntelligence/consensusIntelligenceRuntime.ts";
import { getInstitutionalAlignmentSnapshotForExecutiveSummary } from "../institutionalAlignment/institutionalAlignmentRuntime.ts";
import { getAdvisoryWarRoomIntegrationForExecutiveSummary } from "../advisoryWarRoomIntegration/advisoryWarRoomIntegrationRuntime.ts";

const ATTENTION_LABEL: Readonly<Record<ExecutiveAttentionLevel, string>> = Object.freeze({
  attention_required: "Executive Attention Required",
  monitor: "Monitor",
  stable: "Stable",
  unknown: "Unknown",
});

const SYSTEM_STATUS_LABEL: Readonly<Record<SystemStatusLevel, string>> = Object.freeze({
  healthy: "Healthy",
  attention_needed: "Attention Needed",
  critical: "Critical",
});

function resolveAttentionForContext(context: DashboardContext): ExecutiveAttentionLevel {
  if (context === "war_room" || context === "risk") return "attention_required";
  if (context === "scenario" || context === "timeline") return "monitor";
  if (context === "overview" || context === "settings") return "stable";
  return "monitor";
}

function resolveSystemStatus(context: DashboardContext, attention: ExecutiveAttentionLevel): SystemStatusLevel {
  if (attention === "attention_required") return "critical";
  if (context === "sources" || attention === "monitor") return "attention_needed";
  return "healthy";
}

function resolveHeadline(context: DashboardContext, attention: ExecutiveAttentionLevel): string {
  if (attention === "attention_required") {
    return "Executive attention required — review priority signals";
  }
  if (context === "overview") {
    return "What requires my attention right now?";
  }
  return `Executive situational overview — ${context.replace("_", " ")} context`;
}

function resolveInvestigateNext(context: DashboardContext, input: ExecutiveSummaryAggregationInput): string {
  if (input.selectedObjectId) return "Investigate selected object context and linked operational signals";
  if (context === "risk") return "Review risk trajectory and exposure indicators";
  if (context === "war_room") return "Review war room threat level and action urgency";
  if (context === "timeline") return "Review timeline momentum and advisory guidance candidates";
  if (context === "scenario") return "Compare scenario scores and branch separation";
  return "Scan active signals and open contexts for priority focus";
}

function collectAggregationSources(
  input: ExecutiveSummaryAggregationInput
): readonly ExecutiveSummaryAggregationSource[] {
  const sources: ExecutiveSummaryAggregationSource[] = ["dashboard"];

  const normalizedSource = input.normalizedContext?.source;
  if (normalizedSource === "scene") sources.push("scene");
  if (normalizedSource === "object" || input.selectedObjectId) sources.push("object");
  if (normalizedSource === "timeline" || input.timelineActive) sources.push("timeline");

  if (input.dashboardContext === "sources" || input.dashboardContext === "settings") {
    sources.push("operational");
  }
  if (input.dashboardContext === "risk") sources.push("risk");
  if (input.dashboardContext === "scenario") sources.push("scenario");
  if (input.dashboardContext === "war_room") sources.push("war_room");

  return Object.freeze([...new Set(sources)]);
}

function mapOperationalHealthToSystemStatus(
  healthLevel: string,
  fallback: SystemStatusLevel
): SystemStatusLevel {
  if (healthLevel === "critical") return "critical";
  if (healthLevel === "degraded" || healthLevel === "watch") return "attention_needed";
  if (healthLevel === "healthy") return "healthy";
  return fallback;
}

function buildSummaryCards(
  input: ExecutiveSummaryAggregationInput,
  attention: ExecutiveAttentionLevel,
  systemStatus: SystemStatusLevel
): readonly ExecutiveSummaryCard[] {
  const operationalInput = {
    dashboardContext: input.dashboardContext,
    normalizedContext: input.normalizedContext,
    selectedObjectId: input.selectedObjectId,
    selectedObjectLabel: input.selectedObjectLabel,
    timelineActive: input.timelineActive,
    signalCount: input.openContextCount,
  };
  const operational = getOperationalIntelligenceSnapshotForExecutiveSummary(operationalInput);
  const feedInput = {
    dashboardContext: input.dashboardContext,
    normalizedContext: input.normalizedContext,
    selectedObjectId: input.selectedObjectId,
    selectedObjectLabel: input.selectedObjectLabel,
    timelineActive: input.timelineActive,
  };
  const risk = getRiskIntelligenceSnapshotForExecutiveSummary(feedInput);
  const timeline = getTimelineIntelligenceSnapshotForExecutiveSummary(feedInput);
  const scenario = getScenarioIntelligenceSnapshotForExecutiveSummary(feedInput);
  const warRoom = getWarRoomIntelligenceSnapshotForExecutiveSummary(feedInput);
  const advisory = getExecutiveAdvisorySnapshotForExecutiveSummary(feedInput);
  const advisoryContext = getAdvisoryContextForExecutiveSummary(feedInput);
  const advisoryConfidence = getAdvisoryConfidenceForExecutiveSummary(feedInput);
  const advisoryExplanation = getAdvisoryExplanationForExecutiveSummary(feedInput);
  const decisionGuidance = getDecisionGuidanceSnapshotForExecutiveSummary(feedInput);
  const governanceIntelligence = getGovernanceIntelligenceSnapshotForExecutiveSummary(feedInput);
  const strategicAlignment = getStrategicAlignmentSnapshotForExecutiveSummary(feedInput);
  const policyConstraintIntelligence = getPolicyConstraintIntelligenceSnapshotForExecutiveSummary(feedInput);
  const stakeholderIntelligence = getStakeholderIntelligenceSnapshotForExecutiveSummary(feedInput);
  const consensusIntelligence = getConsensusIntelligenceSnapshotForExecutiveSummary(feedInput);
  const institutionalAlignment = getInstitutionalAlignmentSnapshotForExecutiveSummary(feedInput);
  const advisoryWarRoomIntegration = getAdvisoryWarRoomIntegrationForExecutiveSummary(feedInput);

  const enrichedSystemStatus =
    risk.exposure.level === "critical"
      ? "critical"
      : risk.exposure.level === "high"
        ? "attention_needed"
        : mapOperationalHealthToSystemStatus(operational.health.level, systemStatus);
  const objectLabel = input.selectedObjectLabel?.trim() || input.selectedObjectId || "None";
  const objectsInView = operational.activeObjects.selectedObject
    ? `${operational.activeObjects.objectsInScene} in scene · 1 selected`
    : `${operational.activeObjects.objectsInScene} in scene`;
  const openContexts = String(operational.signals.signalCount);
  const priorityFocus =
    timeline.decisionWindows.status === "active"
      ? timeline.decisionWindows.currentWindow
      : input.dashboardContext === "scenario"
        ? scenario.comparisonContract.summary
        : risk.executiveAttention.status === "immediate_attention"
          ? risk.executiveAttention.recommendation
          : input.dashboardContext === "war_room"
            ? advisoryContext.topPriority?.explanation ?? advisory.guidanceCandidates.candidates[0]?.suggestion ?? warRoom.decisionFocus.recommendation
            : input.dashboardContext === "timeline"
              ? advisoryContext.topPriority?.explanation ?? advisory.guidanceCandidates.candidates[0]?.suggestion ?? timeline.decisionWindows.currentWindow
              : risk.activeRisks.count > 0
              ? `Risk: ${risk.activeRisks.topRisk}`
              : timeline.momentum.level === "blocked"
                ? `Timeline blocked — ${timeline.milestonePressure.label}`
                : operational.pressure.level === "high" || operational.pressure.level === "critical"
                  ? `Operational pressure: ${operational.pressure.level}`
                  : "Executive summary scan";

  const enrichedAttention: ExecutiveAttentionLevel =
    risk.executiveAttention.status === "immediate_attention" ||
    risk.executiveAttention.status === "investigate"
      ? "attention_required"
      : risk.executiveAttention.status === "review" ||
          operational.health.level === "critical" ||
          operational.pressure.level === "critical"
        ? "monitor"
        : operational.health.level === "degraded" || operational.pressure.level === "high"
          ? "monitor"
          : attention;

  return Object.freeze([
    Object.freeze({
      kind: "system_status" as const,
      title: "System Status",
      primaryValue: SYSTEM_STATUS_LABEL[enrichedSystemStatus],
      secondaryValue:
        input.dashboardContext === "timeline" || input.dashboardContext === "war_room"
          ? `Risk exposure: ${risk.exposure.label} · Confidence: ${advisoryConfidence.overall.label}`
          : `Risk exposure: ${risk.exposure.label} · Ops: ${operational.health.status}`,
      attention: enrichedAttention,
    }),
    Object.freeze({
      kind: "active_objects" as const,
      title: "Active Objects",
      primaryValue: objectsInView,
      secondaryValue: operational.activeObjects.summary,
      attention: input.selectedObjectId ? "monitor" : "stable",
    }),
    Object.freeze({
      kind: "active_signals" as const,
      title: "Active Signals",
      primaryValue: openContexts,
      secondaryValue:
        input.dashboardContext === "war_room"
          ? `${operational.signals.recentSummary} · War Room: ${warRoom.decisionFocus.label}`
          : input.dashboardContext === "timeline"
            ? `${operational.signals.recentSummary} · Why: ${advisoryExplanation.guidance.executiveSummary.slice(0, 60)}…`
            : input.dashboardContext === "scenario"
              ? `${operational.signals.recentSummary} · Scenario: ${scenario.confidence.label}`
              : `${operational.signals.recentSummary} · Timeline: ${timeline.momentum.label}`,
      attention: input.timelineActive ? "monitor" : enrichedAttention,
    }),
    Object.freeze({
      kind: "executive_attention" as const,
      title: "Executive Attention",
      primaryValue: ATTENTION_LABEL[enrichedAttention],
      secondaryValue:
        input.dashboardContext === "war_room"
          ? `Priority: ${priorityFocus} · Consensus: ${consensusIntelligence.consensusLevel.label} · Institutional: ${institutionalAlignment.institutionalHealth.label}`
          : input.dashboardContext === "timeline"
            ? `Priority: ${priorityFocus} · Consensus: ${consensusIntelligence.consensusAttention.label} · Institutional: ${institutionalAlignment.institutionalAttention.label}`
            : input.dashboardContext === "scenario"
              ? `Priority: ${priorityFocus} · Impact: ${scenario.expectedImpact.label}`
              : `Priority: ${priorityFocus} · Timeline ${timeline.momentum.label}`,
      attention: enrichedAttention,
    }),
  ]);
}

export function aggregateExecutiveSummary(input: ExecutiveSummaryAggregationInput): ExecutiveSummarySurfaceModel {
  const attention = resolveAttentionForContext(input.dashboardContext);
  const systemStatus = resolveSystemStatus(input.dashboardContext, attention);
  const aggregationSources = Object.freeze([
    ...new Set<ExecutiveSummaryAggregationSource>([
      ...collectAggregationSources(input),
      "operational",
      "risk",
      "timeline",
      "scenario",
      "war_room",
      "advisory",
      "advisory_context",
      "advisory_confidence",
      "advisory_explainability",
      "decision_guidance",
      "governance_intelligence",
      "strategic_alignment",
      "policy_constraint_intelligence",
      "stakeholder_intelligence",
      "consensus_intelligence",
      "institutional_alignment",
      "advisory_war_room_integration",
    ]),
  ]);
  const visualBundle = getDashboardSurfaceVisualBundle(CANONICAL_EXECUTIVE_SUMMARY_SURFACE_ID);

  const model: ExecutiveSummarySurfaceModel = Object.freeze({
    surfaceId: CANONICAL_EXECUTIVE_SUMMARY_SURFACE_ID,
    owner: CANONICAL_EXECUTIVE_SUMMARY_OWNER,
    attention,
    headline: resolveHeadline(input.dashboardContext, attention),
    systemStatus,
    cards: buildSummaryCards(input, attention, systemStatus),
    visualBundle,
    aggregationSources,
    investigateNext: resolveInvestigateNext(input.dashboardContext, input),
  });

  reportExecutiveSummary({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    version: "4.1.0",
  });
  reportSummaryAggregation(aggregationSources, input.dashboardContext);
  reportExecutiveAttention(attention, model.headline);
  reportExecutiveSummarySurface(model);

  return model;
}
