/**
 * Phase 4:6 — War Room Intelligence aggregation.
 * Unifies operational, risk, timeline, and scenario intelligence into decision context.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";
import { getDashboardSurfaceVisualBundle } from "../dashboardSurfaceVisualRegistry.ts";
import { getOperationalIntelligenceSnapshotForExecutiveSummary } from "../operationalIntelligence/operationalIntelligenceRuntime.ts";
import { getRiskIntelligenceSnapshotForExecutiveSummary } from "../riskIntelligence/riskIntelligenceRuntime.ts";
import { getTimelineIntelligenceSnapshotForExecutiveSummary } from "../timelineIntelligence/timelineIntelligenceRuntime.ts";
import { getScenarioIntelligenceSnapshotForExecutiveSummary } from "../scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import {
  type AdvisoryIntegrationContract,
  type CriticalRisksCard,
  type DecisionFocusCard,
  type ScenarioComparisonCard,
  type ScenarioComparisonEntry,
  type SituationOverviewCard,
  type TimelinePressureCard,
  type WarRoomContextSource,
  type WarRoomDecisionFocus,
  type WarRoomIntelligenceAggregationInput,
  type WarRoomIntelligenceSnapshot,
  type WarRoomIntelligenceSurfaceModel,
  type WarRoomTradeoffAnalysisCard,
  type WarRoomTradeoffEntry,
  CANONICAL_WAR_ROOM_INTELLIGENCE_OWNER,
  CANONICAL_WAR_ROOM_INTELLIGENCE_SURFACE_ID,
} from "./warRoomIntelligenceContract.ts";
import {
  reportCriticalRisk,
  reportDecisionFocus,
  reportScenarioComparison,
  reportSituationOverview,
  reportTimelinePressure,
  reportWarRoomIntelligence,
  reportWarRoomIntelligenceSurface,
  reportWarRoomTradeoffAnalysis,
} from "./warRoomIntelligenceLogging.ts";

const DECISION_FOCUS_LABEL: Readonly<Record<WarRoomDecisionFocus, string>> = Object.freeze({
  monitor: "Monitor",
  review: "Review",
  investigate: "Investigate",
  decision_required: "Decision Required",
});

const WAR_ROOM_DOMAIN_ORDER = Object.freeze([
  "situation_overview",
  "critical_risks",
  "timeline_pressure",
  "scenario_comparison",
  "tradeoff_analysis",
  "decision_focus",
] as const);

function collectContextSources(input: WarRoomIntelligenceAggregationInput): readonly WarRoomContextSource[] {
  const sources: WarRoomContextSource[] = [
    "operational",
    "risk",
    "timeline",
    "scenario",
    "dashboard",
  ];
  if (input.dashboardContext === "overview" || input.dashboardContext === "war_room") {
    sources.push("executive_summary");
  }
  return Object.freeze([...new Set(sources)]);
}

function resolveDecisionFocus(
  context: DashboardContext,
  riskAttention: string,
  decisionWindow: string,
  riskExposure: string
): WarRoomDecisionFocus {
  if (
    context === "war_room" &&
    (riskAttention === "immediate_attention" || decisionWindow === "missed" || riskExposure === "critical")
  ) {
    return "decision_required";
  }
  if (riskAttention === "investigate" || decisionWindow === "active") return "investigate";
  if (riskAttention === "review" || riskExposure === "high") return "review";
  return "monitor";
}

function buildSituationOverview(
  context: DashboardContext,
  operational: ReturnType<typeof getOperationalIntelligenceSnapshotForExecutiveSummary>,
  risk: ReturnType<typeof getRiskIntelligenceSnapshotForExecutiveSummary>
): SituationOverviewCard {
  const systemCondition =
    operational.health.level === "critical" || risk.exposure.level === "critical"
      ? "Critical"
      : operational.health.level === "degraded" || risk.exposure.level === "high"
        ? "Attention Needed"
        : "Stable";

  return Object.freeze({
    currentState: context === "war_room" ? "War Room Active" : "Decision Context Ready",
    executiveSummary:
      context === "war_room"
        ? "Multiple intelligence streams converged for executive decision"
        : "Intelligence feeds available for war room activation",
    systemCondition,
    attentionSummary: risk.executiveAttention.label,
    briefing: `${operational.health.status} · ${risk.activeRisks.count} active risks · ${operational.signals.signalCount} signals`,
  });
}

function buildCriticalRisks(
  risk: ReturnType<typeof getRiskIntelligenceSnapshotForExecutiveSummary>
): CriticalRisksCard {
  const topRisks = [
    risk.activeRisks.topRisk,
    risk.exposure.level === "critical" ? "Critical exposure threshold breached" : null,
    risk.momentum.momentum === "worsening" ? "Risk momentum deteriorating" : null,
  ].filter((entry): entry is string => entry !== null);

  return Object.freeze({
    topRisks: Object.freeze(topRisks.slice(0, 3)),
    exposure: risk.exposure.label,
    momentum: risk.momentum.label,
    urgency: risk.executiveAttention.urgency,
    summary: risk.activeRisks.summary,
  });
}

function buildTimelinePressure(
  timeline: ReturnType<typeof getTimelineIntelligenceSnapshotForExecutiveSummary>
): TimelinePressureCard {
  return Object.freeze({
    decisionWindow: timeline.decisionWindows.label,
    milestonePressure: timeline.milestonePressure.label,
    timelineMomentum: timeline.momentum.label,
    scheduleDrift: timeline.scheduleDrift.label,
    urgencySummary:
      timeline.decisionWindows.status === "active" || timeline.decisionWindows.status === "missed"
        ? timeline.decisionWindows.currentWindow
        : timeline.milestonePressure.upcomingSummary,
  });
}

function buildScenarioComparison(
  scenario: ReturnType<typeof getScenarioIntelligenceSnapshotForExecutiveSummary>
): ScenarioComparisonCard {
  const coreScenarios = scenario.portfolio.scenarios.filter((entry) => entry.id !== "additional").slice(0, 3);
  const tradeoffIndicators = scenario.tradeoffs.tradeoffs.map((entry) => entry.indicator);

  const entries: ScenarioComparisonEntry[] = coreScenarios.map((entry, index) =>
    Object.freeze({
      label: entry.label,
      impact: scenario.expectedImpact.label,
      confidence: scenario.confidence.label,
      tradeoff: tradeoffIndicators[index] ?? scenario.tradeoffs.tradeoffs[0]?.indicator ?? "Competing objectives",
      score: entry.score,
    })
  );

  const preferred = [...entries].sort((left, right) => right.score - left.score)[0];

  return Object.freeze({
    scenarios: Object.freeze(entries),
    comparisonSummary: scenario.comparisonContract.summary,
    preferredPath: preferred ? `${preferred.label} — ${preferred.tradeoff}` : "Compare available paths",
  });
}

function buildTradeoffAnalysis(
  scenario: ReturnType<typeof getScenarioIntelligenceSnapshotForExecutiveSummary>
): WarRoomTradeoffAnalysisCard {
  const warRoomTradeoffs: WarRoomTradeoffEntry[] = scenario.tradeoffs.tradeoffs.map((entry) =>
    Object.freeze({
      label: entry.label,
      indicator: entry.indicator,
      consequence: entry.summary,
    })
  );

  if (warRoomTradeoffs.length < 4) {
    warRoomTradeoffs.push(
      Object.freeze({
        label: "Speed vs Quality",
        indicator: "Faster Delivery ↓ Higher Risk",
        consequence: "Accelerated paths trade quality assurance for speed",
      })
    );
  }

  return Object.freeze({
    tradeoffs: Object.freeze(warRoomTradeoffs.slice(0, 4)),
    summary: "Tradeoffs organize decision consequences — not automated recommendations",
  });
}

function buildDecisionFocus(
  context: DashboardContext,
  risk: ReturnType<typeof getRiskIntelligenceSnapshotForExecutiveSummary>,
  timeline: ReturnType<typeof getTimelineIntelligenceSnapshotForExecutiveSummary>,
  scenario: ReturnType<typeof getScenarioIntelligenceSnapshotForExecutiveSummary>
): DecisionFocusCard {
  const focus = resolveDecisionFocus(
    context,
    risk.executiveAttention.status,
    timeline.decisionWindows.status,
    risk.exposure.level
  );

  const trend: ImpactDirection =
    focus === "decision_required" || focus === "investigate"
      ? "deteriorating"
      : focus === "review"
        ? "stable"
        : "improving";

  const recommendation =
    focus === "decision_required"
      ? "Executive path selection required — review scenario comparison and tradeoffs"
      : focus === "investigate"
        ? scenario.investigationPaths.paths[0]?.label ?? risk.executiveAttention.recommendation
        : focus === "review"
          ? risk.executiveAttention.recommendation
          : "Continue monitoring converged intelligence streams";

  return Object.freeze({
    focus,
    label: DECISION_FOCUS_LABEL[focus],
    urgency: risk.executiveAttention.urgency,
    recommendation,
    trend,
  });
}

function buildAdvisoryIntegration(context: DashboardContext, focus: WarRoomDecisionFocus): AdvisoryIntegrationContract {
  return Object.freeze({
    bridgeId: "war_room_to_executive_advisory",
    sourceContext: "war_room",
    targetEngine: "executive_advisory",
    readiness:
      context === "war_room" && (focus === "decision_required" || focus === "investigate")
        ? "ready"
        : context === "war_room"
          ? "pending"
          : "not_available",
    summary: "War Room Context → Executive Advisory Engine",
  });
}

export function aggregateWarRoomIntelligence(
  input: WarRoomIntelligenceAggregationInput
): WarRoomIntelligenceSurfaceModel {
  const feedInput = {
    dashboardContext: input.dashboardContext,
    normalizedContext: input.normalizedContext,
    selectedObjectId: input.selectedObjectId,
    selectedObjectLabel: input.selectedObjectLabel,
    timelineActive: input.timelineActive ?? input.dashboardContext === "war_room",
    objectsInScene: input.objectsInScene,
  };

  const operational = getOperationalIntelligenceSnapshotForExecutiveSummary({
    ...feedInput,
    signalCount: undefined,
  });
  const risk = getRiskIntelligenceSnapshotForExecutiveSummary(feedInput);
  const timeline = getTimelineIntelligenceSnapshotForExecutiveSummary(feedInput);
  const scenario = getScenarioIntelligenceSnapshotForExecutiveSummary(feedInput);

  const visualBundle = getDashboardSurfaceVisualBundle(CANONICAL_WAR_ROOM_INTELLIGENCE_SURFACE_ID);
  const threatChart = visualBundle.microCharts.find(
    (chart) => chart.kind === "trend_line" && chart.label === "Threat Level"
  );
  const threatPoints =
    threatChart?.kind === "trend_line"
      ? threatChart.points
      : ([0.3, 0.42, 0.55, 0.68, 0.78, 0.85, 0.92] as const);

  const situationOverview = buildSituationOverview(input.dashboardContext, operational, risk);
  const criticalRisks = buildCriticalRisks(risk);
  const timelinePressure = buildTimelinePressure(timeline);
  const scenarioComparison = buildScenarioComparison(scenario);
  const tradeoffAnalysis = buildTradeoffAnalysis(scenario);
  const decisionFocus = buildDecisionFocus(input.dashboardContext, risk, timeline, scenario);
  const advisoryIntegration = buildAdvisoryIntegration(input.dashboardContext, decisionFocus.focus);

  const snapshot: WarRoomIntelligenceSnapshot = Object.freeze({
    situationOverview,
    criticalRisks,
    timelinePressure,
    scenarioComparison,
    tradeoffAnalysis,
    decisionFocus,
    advisoryIntegration,
  });

  const model: WarRoomIntelligenceSurfaceModel = Object.freeze({
    surfaceId: CANONICAL_WAR_ROOM_INTELLIGENCE_SURFACE_ID,
    owner: CANONICAL_WAR_ROOM_INTELLIGENCE_OWNER,
    headline: "What decision deserves executive attention right now?",
    snapshot,
    visualBundle,
    contextSources: collectContextSources(input),
    domainOrder: WAR_ROOM_DOMAIN_ORDER,
  });

  reportWarRoomIntelligence({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    version: "4.6.0",
    decisionFocus: decisionFocus.focus,
    threatTrend: threatPoints[threatPoints.length - 1],
  });
  reportSituationOverview(snapshot.situationOverview);
  reportCriticalRisk(snapshot.criticalRisks);
  reportTimelinePressure(snapshot.timelinePressure);
  reportScenarioComparison(snapshot.scenarioComparison);
  reportWarRoomTradeoffAnalysis(snapshot.tradeoffAnalysis);
  reportDecisionFocus(snapshot.decisionFocus);
  reportWarRoomIntelligenceSurface(model);

  return model;
}
