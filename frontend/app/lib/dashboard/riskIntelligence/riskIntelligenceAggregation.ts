/**
 * Phase 4:3 — Risk Intelligence aggregation.
 * Consumes operational intelligence; does not duplicate operational ownership.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";
import { getDashboardSurfaceVisualBundle } from "../dashboardSurfaceVisualRegistry.ts";
import { getOperationalIntelligenceSnapshotForExecutiveSummary } from "../operationalIntelligence/operationalIntelligenceRuntime.ts";
import { getTimelineIntelligenceSnapshotForRiskIntelligence } from "../timelineIntelligence/timelineIntelligenceRuntime.ts";
import {
  type ActiveRisksCard,
  type ExecutiveAttentionRequiredCard,
  type ExecutiveRiskAttention,
  type RiskConfidenceCard,
  type RiskConfidenceLevel,
  type RiskContextSource,
  type RiskExposureCard,
  type RiskExposureLevel,
  type RiskIntelligenceAggregationInput,
  type RiskIntelligenceSnapshot,
  type RiskIntelligenceSurfaceModel,
  type RiskMomentum,
  type RiskMomentumCard,
  CANONICAL_RISK_INTELLIGENCE_OWNER,
  CANONICAL_RISK_INTELLIGENCE_SURFACE_ID,
} from "./riskIntelligenceContract.ts";
import {
  reportActiveRisk,
  reportExecutiveAttentionRequired,
  reportRiskConfidence,
  reportRiskExposure,
  reportRiskIntelligence,
  reportRiskIntelligenceSurface,
  reportRiskMomentum,
} from "./riskIntelligenceLogging.ts";

const EXPOSURE_LABEL: Readonly<Record<RiskExposureLevel, string>> = Object.freeze({
  low: "Low Exposure",
  moderate: "Moderate Exposure",
  high: "High Exposure",
  critical: "Critical Exposure",
});

const MOMENTUM_LABEL: Readonly<Record<RiskMomentum, string>> = Object.freeze({
  improving: "Improving",
  stable: "Stable",
  worsening: "Worsening",
});

const MOMENTUM_ARROW: Readonly<Record<RiskMomentum, string>> = Object.freeze({
  improving: "↑",
  stable: "→",
  worsening: "↓",
});

const ATTENTION_LABEL: Readonly<Record<ExecutiveRiskAttention, string>> = Object.freeze({
  monitor: "Monitor",
  review: "Review Required",
  investigate: "Investigate",
  immediate_attention: "Immediate Executive Review",
});

function mapPressureToExposure(
  pressure: string,
  health: string,
  context: DashboardContext
): RiskExposureLevel {
  if (health === "critical" || context === "war_room") return "critical";
  if (pressure === "critical" || pressure === "high" || context === "risk") return "high";
  if (pressure === "moderate" || health === "degraded" || health === "watch") return "moderate";
  return "low";
}

function mapMomentumFromOperational(
  demandDirection: string,
  activityTrend: ImpactDirection,
  context: DashboardContext
): RiskMomentum {
  if (context === "risk" || context === "war_room" || demandDirection === "growing") return "worsening";
  if (demandDirection === "declining" || activityTrend === "improving") return "improving";
  return "stable";
}

function mapMomentumToDirection(momentum: RiskMomentum): ImpactDirection {
  if (momentum === "improving") return "improving";
  if (momentum === "worsening") return "deteriorating";
  return "stable";
}

function resolveActiveRiskCount(
  context: DashboardContext,
  operationalPressure: string,
  objectAttention: number
): number {
  if (context === "war_room") return 3;
  if (context === "risk" || operationalPressure === "critical") return 2;
  if (operationalPressure === "high" || objectAttention > 0) return 1;
  return 0;
}

function resolveExecutiveAttention(
  exposure: RiskExposureLevel,
  momentum: RiskMomentum,
  activeCount: number
): ExecutiveRiskAttention {
  if (exposure === "critical" || (activeCount >= 2 && momentum === "worsening")) return "immediate_attention";
  if (exposure === "high" || activeCount >= 1) return "investigate";
  if (exposure === "moderate" || momentum === "worsening") return "review";
  return "monitor";
}

function resolveConfidence(exposure: RiskExposureLevel, context: DashboardContext): RiskConfidenceLevel {
  if (context === "overview" && exposure === "low") return "high";
  if (exposure === "critical" || exposure === "high") return "low";
  if (exposure === "moderate") return "moderate";
  return "high";
}

function collectContextSources(input: RiskIntelligenceAggregationInput): readonly RiskContextSource[] {
  const sources: RiskContextSource[] = ["operational", "dashboard"];
  if (input.normalizedContext?.source === "object" || input.selectedObjectId) sources.push("object");
  if (input.normalizedContext?.source === "timeline" || input.timelineActive) sources.push("timeline");
  return Object.freeze([...new Set(sources)]);
}

function buildActiveRisksCard(
  context: DashboardContext,
  count: number,
  operationalSummary: string
): ActiveRisksCard {
  const summary =
    count === 0
      ? "No active risks detected"
      : count === 1
        ? "1 active risk under monitoring"
        : `${count} active risks require awareness`;
  const topRisk =
    count === 0
      ? "System posture stable"
      : context === "war_room"
        ? "Elevated threat trajectory"
        : context === "risk"
          ? "Exposure widening on primary path"
          : operationalSummary;

  return Object.freeze({
    count,
    summary,
    topRisk,
    attentionStatus: count > 0 ? "Active monitoring" : "Clear",
  });
}

export function aggregateRiskIntelligence(input: RiskIntelligenceAggregationInput): RiskIntelligenceSurfaceModel {
  const operational = getOperationalIntelligenceSnapshotForExecutiveSummary({
    dashboardContext: input.dashboardContext,
    normalizedContext: input.normalizedContext,
    selectedObjectId: input.selectedObjectId,
    selectedObjectLabel: input.selectedObjectLabel,
    objectsInScene: input.objectsInScene,
    timelineActive: input.timelineActive,
  });

  const timeline = getTimelineIntelligenceSnapshotForRiskIntelligence({
    dashboardContext: input.dashboardContext,
    normalizedContext: input.normalizedContext,
    selectedObjectId: input.selectedObjectId,
    selectedObjectLabel: input.selectedObjectLabel,
    objectsInScene: input.objectsInScene,
    timelineActive: input.timelineActive,
  });

  let exposureLevel = mapPressureToExposure(
    operational.pressure.level,
    operational.health.level,
    input.dashboardContext
  );
  let momentum = mapMomentumFromOperational(
    operational.demandImpact.direction,
    operational.signals.activityTrend,
    input.dashboardContext
  );

  if (timeline.momentum.level === "blocked" || timeline.momentum.level === "slowing") {
    momentum = "worsening";
  }
  if (timeline.milestonePressure.level === "critical") {
    exposureLevel = "critical";
  } else if (timeline.milestonePressure.level === "high" && exposureLevel !== "critical") {
    exposureLevel = "high";
  }
  if (timeline.scheduleDrift.level === "major_drift" && exposureLevel === "low") {
    exposureLevel = "moderate";
  }

  const activeCount = resolveActiveRiskCount(
    input.dashboardContext,
    operational.pressure.level,
    operational.activeObjects.requiringAttention
  );
  const confidenceLevel = resolveConfidence(exposureLevel, input.dashboardContext);
  let executiveStatus = resolveExecutiveAttention(exposureLevel, momentum, activeCount);
  if (timeline.decisionWindows.status === "missed") {
    executiveStatus = "immediate_attention";
  } else if (
    timeline.decisionWindows.status === "active" &&
    (executiveStatus === "monitor" || executiveStatus === "review")
  ) {
    executiveStatus = "investigate";
  }

  const visualBundle = getDashboardSurfaceVisualBundle(CANONICAL_RISK_INTELLIGENCE_SURFACE_ID);
  const trajectoryChart = visualBundle.microCharts.find(
    (chart) => chart.kind === "trend_line" && chart.label === "Risk Trajectory"
  );
  const trendPoints =
    trajectoryChart?.kind === "trend_line"
      ? trajectoryChart.points
      : ([0.35, 0.4, 0.48, 0.52, 0.61, 0.68, 0.74] as const);

  const snapshot: RiskIntelligenceSnapshot = Object.freeze({
    activeRisks: buildActiveRisksCard(
      input.dashboardContext,
      activeCount,
      operational.pressure.attentionStatus
    ),
    exposure: Object.freeze({
      level: exposureLevel,
      label: EXPOSURE_LABEL[exposureLevel],
      trend: mapMomentumToDirection(momentum),
      confidence: confidenceLevel,
    }),
    momentum: Object.freeze({
      momentum,
      label: MOMENTUM_LABEL[momentum],
      trendPoints,
      indicator: MOMENTUM_ARROW[momentum],
    }),
    confidence: Object.freeze({
      level: confidenceLevel,
      trend: confidenceLevel === "high" ? "improving" : confidenceLevel === "low" ? "deteriorating" : "stable",
      summary:
        confidenceLevel === "high"
          ? "Assessment supported by consistent operational signals"
          : confidenceLevel === "moderate"
            ? "Mixed signals — review recommended"
            : "Elevated uncertainty — validate before acting",
    }),
    executiveAttention: Object.freeze({
      status: executiveStatus,
      label: ATTENTION_LABEL[executiveStatus],
      urgency:
        executiveStatus === "immediate_attention"
          ? "Urgent"
          : executiveStatus === "investigate"
            ? "Elevated"
            : "Standard",
      recommendation:
        executiveStatus === "immediate_attention"
          ? "Convene executive review before operational impact spreads"
          : executiveStatus === "investigate"
            ? "Investigate top risk path and linked operational pressure"
            : executiveStatus === "review"
              ? "Schedule risk review within current planning window"
              : "Continue monitoring — no immediate action required",
    }),
  });

  const model: RiskIntelligenceSurfaceModel = Object.freeze({
    surfaceId: CANONICAL_RISK_INTELLIGENCE_SURFACE_ID,
    owner: CANONICAL_RISK_INTELLIGENCE_OWNER,
    headline: "What could negatively impact the system?",
    snapshot,
    visualBundle,
    contextSources: collectContextSources(input),
  });

  reportRiskIntelligence({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    version: "4.3.0",
    operationalHealth: operational.health.level,
    operationalPressure: operational.pressure.level,
  });
  reportActiveRisk(snapshot.activeRisks);
  reportRiskExposure(snapshot.exposure);
  reportRiskMomentum(snapshot.momentum);
  reportRiskConfidence(snapshot.confidence);
  reportExecutiveAttentionRequired(snapshot.executiveAttention);
  reportRiskIntelligenceSurface(model);

  return model;
}
