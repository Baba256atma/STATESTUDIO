/**
 * Phase 5:2 — Advisory context normalization.
 * Normalizes intelligence snapshots into comparable standardized advisory inputs.
 */

import type { ImpactDirection } from "../../dashboardVisualSignalContract.ts";
import { getOperationalIntelligenceSnapshotForExecutiveSummary } from "../../operationalIntelligence/operationalIntelligenceRuntime.ts";
import { getRiskIntelligenceSnapshotForExecutiveSummary } from "../../riskIntelligence/riskIntelligenceRuntime.ts";
import { getTimelineIntelligenceSnapshotForExecutiveSummary } from "../../timelineIntelligence/timelineIntelligenceRuntime.ts";
import { getScenarioIntelligenceSnapshotForExecutiveSummary } from "../../scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { getWarRoomIntelligenceSnapshotForExecutiveSummary } from "../../warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import type {
  AdvisoryContextAggregationInput,
  AdvisoryInputConfidence,
  AdvisoryInputImpact,
  AdvisoryInputPriority,
  OperationalAdvisoryInputs,
  RiskAdvisoryInputs,
  ScenarioAdvisoryInputs,
  StandardizedAdvisoryInput,
  TimelineAdvisoryInputs,
  WarRoomAdvisoryInputs,
} from "./advisoryContextContract.ts";
import {
  computeAdvisoryInputScore,
  mapLevelToImpact,
  mapLevelToPriority,
} from "./advisoryPriorityScoring.ts";
import { isRegisteredAdvisorySource, listRegisteredAdvisorySources } from "./advisoryAggregationRegistry.ts";

function buildInput(
  source: StandardizedAdvisoryInput["source"],
  domain: string,
  label: string,
  level: string,
  explanation: string,
  trend: ImpactDirection,
  confidence: AdvisoryInputConfidence,
  timestamp: string,
  impactOverride?: AdvisoryInputImpact
): StandardizedAdvisoryInput {
  const priority = mapLevelToPriority(level);
  const impact = impactOverride ?? mapLevelToImpact(level);
  return Object.freeze({
    source,
    domain,
    label,
    priority,
    confidence,
    impact,
    timestamp,
    explanation,
    trend,
    score: computeAdvisoryInputScore(priority, impact),
  });
}

function mapConfidence(level: string): AdvisoryInputConfidence {
  if (level === "high") return "high";
  if (level === "low") return "low";
  return "moderate";
}

export type CollectedIntelligenceSnapshots = Readonly<{
  operational: ReturnType<typeof getOperationalIntelligenceSnapshotForExecutiveSummary>;
  risk: ReturnType<typeof getRiskIntelligenceSnapshotForExecutiveSummary>;
  timeline: ReturnType<typeof getTimelineIntelligenceSnapshotForExecutiveSummary>;
  scenario: ReturnType<typeof getScenarioIntelligenceSnapshotForExecutiveSummary>;
  warRoom: ReturnType<typeof getWarRoomIntelligenceSnapshotForExecutiveSummary>;
}>;

export function collectRegisteredIntelligenceSnapshots(
  input: AdvisoryContextAggregationInput
): CollectedIntelligenceSnapshots {
  const feedInput = {
    dashboardContext: input.dashboardContext,
    normalizedContext: input.normalizedContext,
    selectedObjectId: input.selectedObjectId,
    selectedObjectLabel: input.selectedObjectLabel,
    timelineActive: input.timelineActive ?? input.dashboardContext === "war_room",
    objectsInScene: input.objectsInScene,
  };

  const sources = listRegisteredAdvisorySources();
  if (!sources.every(isRegisteredAdvisorySource)) {
    throw new Error("Advisory aggregation registry contains unregistered sources.");
  }

  return Object.freeze({
    operational: getOperationalIntelligenceSnapshotForExecutiveSummary({
      ...feedInput,
      signalCount: undefined,
    }),
    risk: getRiskIntelligenceSnapshotForExecutiveSummary(feedInput),
    timeline: getTimelineIntelligenceSnapshotForExecutiveSummary(feedInput),
    scenario: getScenarioIntelligenceSnapshotForExecutiveSummary(feedInput),
    warRoom: getWarRoomIntelligenceSnapshotForExecutiveSummary(feedInput),
  });
}

export function normalizeOperationalInputs(
  snapshots: CollectedIntelligenceSnapshots,
  timestamp: string
): OperationalAdvisoryInputs {
  const { operational } = snapshots;
  return Object.freeze({
    health: buildInput(
      "operational",
      "operational_health",
      "Operational Health",
      operational.health.level,
      operational.health.status,
      operational.health.trend,
      mapConfidence(operational.health.confidence),
      timestamp
    ),
    pressure: buildInput(
      "operational",
      "operational_pressure",
      "Operational Pressure",
      operational.pressure.level,
      operational.pressure.attentionStatus,
      operational.pressure.trend,
      "moderate",
      timestamp
    ),
    signals: buildInput(
      "operational",
      "operational_signals",
      "Operational Signals",
      operational.signals.signalCount >= 4 ? "high" : operational.signals.signalCount >= 2 ? "moderate" : "low",
      operational.signals.recentSummary,
      operational.signals.activityTrend,
      "moderate",
      timestamp
    ),
    demandImpact: buildInput(
      "operational",
      "demand_impact",
      "Demand Impact",
      operational.demandImpact.direction === "growing" ? "high" : "moderate",
      operational.demandImpact.summaryValue,
      operational.demandImpact.direction === "growing" ? "deteriorating" : "stable",
      "moderate",
      timestamp
    ),
  });
}

export function normalizeRiskInputs(
  snapshots: CollectedIntelligenceSnapshots,
  timestamp: string
): RiskAdvisoryInputs {
  const { risk } = snapshots;
  return Object.freeze({
    exposure: buildInput(
      "risk",
      "risk_exposure",
      "Risk Exposure",
      risk.exposure.level,
      risk.exposure.label,
      risk.exposure.trend,
      mapConfidence(risk.exposure.confidence),
      timestamp
    ),
    momentum: buildInput(
      "risk",
      "risk_momentum",
      "Risk Momentum",
      risk.momentum.momentum === "worsening" ? "high" : risk.momentum.momentum === "improving" ? "low" : "moderate",
      risk.momentum.label,
      risk.momentum.momentum === "worsening" ? "deteriorating" : "stable",
      "moderate",
      timestamp
    ),
    confidence: buildInput(
      "risk",
      "risk_confidence",
      "Risk Confidence",
      risk.confidence.level,
      risk.confidence.summary,
      risk.confidence.trend,
      mapConfidence(risk.confidence.level),
      timestamp
    ),
    executiveAttention: buildInput(
      "risk",
      "executive_attention",
      "Executive Attention Required",
      risk.executiveAttention.status,
      risk.executiveAttention.recommendation,
      risk.executiveAttention.status === "immediate_attention" ? "deteriorating" : "stable",
      mapConfidence(risk.confidence.level),
      timestamp,
      risk.executiveAttention.status === "immediate_attention" ? "high" : "moderate"
    ),
  });
}

export function normalizeTimelineInputs(
  snapshots: CollectedIntelligenceSnapshots,
  timestamp: string
): TimelineAdvisoryInputs {
  const { timeline } = snapshots;
  return Object.freeze({
    momentum: buildInput(
      "timeline",
      "timeline_momentum",
      "Timeline Momentum",
      timeline.momentum.level,
      timeline.momentum.label,
      timeline.momentum.trend,
      mapConfidence(timeline.momentum.confidence),
      timestamp
    ),
    milestonePressure: buildInput(
      "timeline",
      "milestone_pressure",
      "Milestone Pressure",
      timeline.milestonePressure.level,
      timeline.milestonePressure.upcomingSummary,
      timeline.momentum.trend,
      "moderate",
      timestamp
    ),
    scheduleDrift: buildInput(
      "timeline",
      "schedule_drift",
      "Schedule Drift",
      timeline.scheduleDrift.level,
      timeline.scheduleDrift.label,
      timeline.scheduleDrift.trend,
      mapConfidence(timeline.scheduleDrift.confidence),
      timestamp
    ),
    decisionWindows: buildInput(
      "timeline",
      "decision_windows",
      "Decision Windows",
      timeline.decisionWindows.status,
      timeline.decisionWindows.currentWindow,
      timeline.decisionWindows.status === "missed" ? "deteriorating" : "stable",
      mapConfidence(timeline.scheduleDrift.confidence),
      timestamp,
      timeline.decisionWindows.status === "active" ? "high" : "moderate"
    ),
  });
}

export function normalizeScenarioInputs(
  snapshots: CollectedIntelligenceSnapshots,
  timestamp: string
): ScenarioAdvisoryInputs {
  const { scenario } = snapshots;
  return Object.freeze({
    expectedImpact: buildInput(
      "scenario",
      "expected_impact",
      "Expected Impact",
      scenario.expectedImpact.level,
      scenario.expectedImpact.summary,
      scenario.expectedImpact.trend,
      "moderate",
      timestamp,
      mapLevelToImpact(scenario.expectedImpact.level)
    ),
    confidence: buildInput(
      "scenario",
      "scenario_confidence",
      "Scenario Confidence",
      scenario.confidence.level,
      scenario.confidence.summary,
      scenario.confidence.trend,
      mapConfidence(scenario.confidence.level),
      timestamp
    ),
    tradeoffs: buildInput(
      "scenario",
      "tradeoffs",
      "Tradeoffs",
      scenario.tradeoffs.tradeoffs.length >= 3 ? "moderate" : "low",
      scenario.tradeoffs.summary,
      "stable",
      mapConfidence(scenario.confidence.level),
      timestamp
    ),
    investigationPaths: buildInput(
      "scenario",
      "investigation_paths",
      "Investigation Paths",
      scenario.investigationPaths.paths.some((path) => path.priority === "high") ? "high" : "moderate",
      scenario.investigationPaths.summary,
      "stable",
      mapConfidence(scenario.confidence.level),
      timestamp
    ),
  });
}

export function normalizeWarRoomInputs(
  snapshots: CollectedIntelligenceSnapshots,
  timestamp: string
): WarRoomAdvisoryInputs {
  const { warRoom } = snapshots;
  return Object.freeze({
    situationOverview: buildInput(
      "war_room",
      "situation_overview",
      "Situation Overview",
      warRoom.situationOverview.systemCondition === "Critical" ? "critical" : "moderate",
      warRoom.situationOverview.briefing,
      "stable",
      "moderate",
      timestamp
    ),
    criticalRisks: buildInput(
      "war_room",
      "critical_risks",
      "Critical Risks",
      warRoom.criticalRisks.exposure.includes("Critical") ? "critical" : "high",
      warRoom.criticalRisks.summary,
      "deteriorating",
      "low",
      timestamp,
      "high"
    ),
    decisionFocus: buildInput(
      "war_room",
      "decision_focus",
      "Decision Focus",
      warRoom.decisionFocus.focus,
      warRoom.decisionFocus.recommendation,
      warRoom.decisionFocus.trend,
      "moderate",
      timestamp,
      warRoom.decisionFocus.focus === "decision_required" ? "transformational" : "high"
    ),
    scenarioComparison: buildInput(
      "war_room",
      "scenario_comparison",
      "Scenario Comparison",
      "moderate",
      warRoom.scenarioComparison.comparisonSummary,
      "stable",
      "moderate",
      timestamp
    ),
  });
}

export function flattenNormalizedInputs(input: {
  operational: OperationalAdvisoryInputs;
  risk: RiskAdvisoryInputs;
  timeline: TimelineAdvisoryInputs;
  scenario: ScenarioAdvisoryInputs;
  warRoom: WarRoomAdvisoryInputs;
}): readonly StandardizedAdvisoryInput[] {
  return Object.freeze([
    input.operational.health,
    input.operational.pressure,
    input.operational.signals,
    input.operational.demandImpact,
    input.risk.exposure,
    input.risk.momentum,
    input.risk.confidence,
    input.risk.executiveAttention,
    input.timeline.momentum,
    input.timeline.milestonePressure,
    input.timeline.scheduleDrift,
    input.timeline.decisionWindows,
    input.scenario.expectedImpact,
    input.scenario.confidence,
    input.scenario.tradeoffs,
    input.scenario.investigationPaths,
    input.warRoom.situationOverview,
    input.warRoom.criticalRisks,
    input.warRoom.decisionFocus,
    input.warRoom.scenarioComparison,
  ]);
}
