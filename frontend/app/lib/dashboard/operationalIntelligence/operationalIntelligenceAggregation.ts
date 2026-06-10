/**
 * Phase 4:2 — Operational Intelligence aggregation layer.
 * Normalizes scene, object, dashboard, and context activity into operational signals.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";
import { getDashboardSurfaceVisualBundle } from "../dashboardSurfaceVisualRegistry.ts";
import {
  type ActiveObjectsCard,
  type DemandImpactCard,
  type DemandImpactDirection,
  type OperationalContextSource,
  type OperationalHealthCard,
  type OperationalHealthLevel,
  type OperationalIntelligenceAggregationInput,
  type OperationalIntelligenceSnapshot,
  type OperationalIntelligenceSurfaceModel,
  type OperationalPressureCard,
  type OperationalPressureLevel,
  type OperationalSignalsCard,
  CANONICAL_OPERATIONAL_INTELLIGENCE_OWNER,
  CANONICAL_OPERATIONAL_INTELLIGENCE_SURFACE_ID,
} from "./operationalIntelligenceContract.ts";
import {
  reportDemandImpact,
  reportOperationalHealth,
  reportOperationalIntelligence,
  reportOperationalIntelligenceSurface,
  reportOperationalPressure,
  reportOperationalSignal,
} from "./operationalIntelligenceLogging.ts";

const HEALTH_LABEL: Readonly<Record<OperationalHealthLevel, string>> = Object.freeze({
  healthy: "Healthy",
  watch: "Watch",
  degraded: "Degraded",
  critical: "Critical",
});

const PRESSURE_LABEL: Readonly<Record<OperationalPressureLevel, string>> = Object.freeze({
  low: "Low",
  moderate: "Moderate",
  high: "High",
  critical: "Critical",
});

const DEMAND_ARROW: Readonly<Record<DemandImpactDirection, string>> = Object.freeze({
  growing: "↑",
  stable: "→",
  declining: "↓",
});

function resolveHealthLevel(context: DashboardContext): OperationalHealthLevel {
  if (context === "war_room") return "critical";
  if (context === "risk" || context === "sources") return "degraded";
  if (context === "scenario" || context === "timeline") return "watch";
  return "healthy";
}

function resolvePressureLevel(context: DashboardContext, health: OperationalHealthLevel): OperationalPressureLevel {
  if (health === "critical") return "critical";
  if (health === "degraded") return "high";
  if (context === "sources" || context === "settings") return "moderate";
  return "low";
}

function resolveDemandDirection(context: DashboardContext): DemandImpactDirection {
  if (context === "war_room" || context === "risk" || context === "sources") return "growing";
  if (context === "settings" || context === "overview") return "stable";
  return "declining";
}

function resolveHealthTrend(level: OperationalHealthLevel): ImpactDirection {
  if (level === "critical" || level === "degraded") return "deteriorating";
  if (level === "watch") return "stable";
  return "improving";
}

function collectContextSources(input: OperationalIntelligenceAggregationInput): readonly OperationalContextSource[] {
  const sources: OperationalContextSource[] = ["dashboard", "executive_summary"];
  if (input.normalizedContext?.source === "scene") sources.push("scene");
  if (input.normalizedContext?.source === "object" || input.selectedObjectId) sources.push("object");
  return Object.freeze([...new Set(sources)]);
}

function buildHealthCard(context: DashboardContext): OperationalHealthCard {
  const level = resolveHealthLevel(context);
  return Object.freeze({
    status: HEALTH_LABEL[level],
    level,
    trend: resolveHealthTrend(level),
    confidence: level === "healthy" ? "high" : level === "watch" ? "moderate" : "low",
  });
}

function buildActiveObjectsCard(input: OperationalIntelligenceAggregationInput): ActiveObjectsCard {
  const inScene = input.objectsInScene ?? (input.selectedObjectId ? 1 : 0);
  const label = input.selectedObjectLabel?.trim() || input.selectedObjectId || null;
  const requiringAttention = input.selectedObjectId ? 1 : Math.min(inScene, 2);
  const recentlyUpdated = input.timelineActive ? 2 : input.selectedObjectId ? 1 : 0;

  return Object.freeze({
    objectsInScene: inScene,
    selectedObject: label,
    requiringAttention,
    recentlyUpdated,
    summary: label
      ? `${label} selected — ${requiringAttention} requiring attention`
      : `${inScene} objects in scene — scan for activity`,
  });
}

function buildSignalsCard(input: OperationalIntelligenceAggregationInput): OperationalSignalsCard {
  const count = input.signalCount ?? (input.timelineActive ? 4 : input.selectedObjectId ? 3 : 2);
  return Object.freeze({
    signalCount: count,
    recentSummary: input.timelineActive
      ? "Timeline and context updates active"
      : "Incoming events and dashboard context tracked",
    activityTrend: input.timelineActive ? "deteriorating" : input.selectedObjectId ? "stable" : "improving",
  });
}

function buildPressureCard(context: DashboardContext, health: OperationalHealthLevel): OperationalPressureCard {
  const level = resolvePressureLevel(context, health);
  return Object.freeze({
    level,
    trend: level === "low" ? "improving" : level === "critical" ? "deteriorating" : "stable",
    attentionStatus:
      level === "critical" || level === "high"
        ? "Operational attention recommended"
        : "Operational load within normal range",
  });
}

function buildDemandImpactCard(context: DashboardContext, visualPoints: readonly number[]): DemandImpactCard {
  const direction = resolveDemandDirection(context);
  return Object.freeze({
    direction,
    summaryValue: `Demand Impact ${DEMAND_ARROW[direction]}`,
    trendPoints: visualPoints,
    indicator: DEMAND_ARROW[direction],
  });
}

export function aggregateOperationalIntelligence(
  input: OperationalIntelligenceAggregationInput
): OperationalIntelligenceSurfaceModel {
  const health = buildHealthCard(input.dashboardContext);
  const visualBundle = getDashboardSurfaceVisualBundle(CANONICAL_OPERATIONAL_INTELLIGENCE_SURFACE_ID);
  const demandChart = visualBundle.microCharts.find(
    (chart) => chart.kind === "trend_line" && chart.label === "Demand Trend"
  );
  const demandTrend =
    demandChart?.kind === "trend_line"
      ? demandChart.points
      : ([0.45, 0.5, 0.52, 0.55, 0.58, 0.6, 0.62] as const);

  const snapshot: OperationalIntelligenceSnapshot = Object.freeze({
    health,
    activeObjects: buildActiveObjectsCard(input),
    signals: buildSignalsCard(input),
    pressure: buildPressureCard(input.dashboardContext, health.level),
    demandImpact: buildDemandImpactCard(input.dashboardContext, demandTrend),
  });

  const model: OperationalIntelligenceSurfaceModel = Object.freeze({
    surfaceId: CANONICAL_OPERATIONAL_INTELLIGENCE_SURFACE_ID,
    owner: CANONICAL_OPERATIONAL_INTELLIGENCE_OWNER,
    headline: "How is the system operating right now?",
    snapshot,
    visualBundle,
    contextSources: collectContextSources(input),
  });

  reportOperationalIntelligence({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    version: "4.2.0",
  });
  reportOperationalHealth(snapshot.health);
  reportOperationalSignal(snapshot.signals);
  reportOperationalPressure(snapshot.pressure);
  reportDemandImpact(snapshot.demandImpact);
  reportOperationalIntelligenceSurface(model);

  return model;
}
