/**
 * Phase 4:4 — Timeline Intelligence aggregation.
 * Consumes operational intelligence; normalized temporal signals only.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";
import { getDashboardSurfaceVisualBundle } from "../dashboardSurfaceVisualRegistry.ts";
import { getOperationalIntelligenceSnapshotForExecutiveSummary } from "../operationalIntelligence/operationalIntelligenceRuntime.ts";
import {
  type DecisionWindowsCard,
  type DecisionWindowStatus,
  type EventDensityCard,
  type EventDensityLevel,
  type MilestonePressureCard,
  type MilestonePressureLevel,
  type ScheduleDriftCard,
  type ScheduleDriftLevel,
  type TimelineContextSource,
  type TimelineGraphicalContract,
  type TimelineIntelligenceAggregationInput,
  type TimelineIntelligenceSnapshot,
  type TimelineIntelligenceSurfaceModel,
  type TimelineMomentumCard,
  type TimelineMomentumLevel,
  CANONICAL_TIMELINE_INTELLIGENCE_OWNER,
  CANONICAL_TIMELINE_INTELLIGENCE_SURFACE_ID,
} from "./timelineIntelligenceContract.ts";
import {
  reportDecisionWindow,
  reportEventDensity,
  reportMilestonePressure,
  reportScheduleDrift,
  reportTimelineIntelligence,
  reportTimelineIntelligenceSurface,
  reportTimelineMomentum,
} from "./timelineIntelligenceLogging.ts";

const MOMENTUM_LABEL: Readonly<Record<TimelineMomentumLevel, string>> = Object.freeze({
  accelerating: "Accelerating",
  stable: "Stable",
  slowing: "Slowing",
  blocked: "Blocked",
});

const PRESSURE_LABEL: Readonly<Record<MilestonePressureLevel, string>> = Object.freeze({
  low: "Low Pressure",
  moderate: "Moderate Pressure",
  high: "High Pressure",
  critical: "Critical Pressure",
});

const DRIFT_LABEL: Readonly<Record<ScheduleDriftLevel, string>> = Object.freeze({
  on_track: "On Track",
  minor_drift: "Minor Drift",
  moderate_drift: "Moderate Drift",
  major_drift: "Major Drift",
});

const DENSITY_LABEL: Readonly<Record<EventDensityLevel, string>> = Object.freeze({
  sparse: "Sparse Activity",
  normal: "Normal Activity",
  heavy: "Heavy Activity",
  overloaded: "Overloaded Activity",
});

const WINDOW_LABEL: Readonly<Record<DecisionWindowStatus, string>> = Object.freeze({
  upcoming: "Upcoming Decision Window",
  active: "Active Decision Window",
  missed: "Missed Decision Window",
  none: "No Immediate Decision Window",
});

function resolveMomentum(
  context: DashboardContext,
  timelineActive: boolean,
  operationalTrend: ImpactDirection
): TimelineMomentumLevel {
  if (context === "war_room" && timelineActive) return "blocked";
  if (context === "timeline" || timelineActive) return "accelerating";
  if (operationalTrend === "deteriorating") return "slowing";
  if (operationalTrend === "improving") return "accelerating";
  return "stable";
}

function resolveMilestonePressure(
  context: DashboardContext,
  signalCount: number,
  timelineActive: boolean
): MilestonePressureLevel {
  if (context === "war_room" || (timelineActive && signalCount >= 4)) return "critical";
  if (context === "timeline" || signalCount >= 3) return "high";
  if (signalCount >= 2 || context === "risk") return "moderate";
  return "low";
}

function resolveScheduleDrift(
  context: DashboardContext,
  healthLevel: string,
  timelineActive: boolean
): ScheduleDriftLevel {
  if (healthLevel === "critical") return "major_drift";
  if (timelineActive && healthLevel === "degraded") return "moderate_drift";
  if (context === "timeline" || healthLevel === "watch") return "minor_drift";
  return "on_track";
}

function resolveEventDensity(signalCount: number, timelineActive: boolean): EventDensityLevel {
  if (signalCount >= 5 || timelineActive) return "overloaded";
  if (signalCount >= 4) return "heavy";
  if (signalCount >= 2) return "normal";
  return "sparse";
}

function resolveDecisionWindow(
  context: DashboardContext,
  timelineActive: boolean,
  pressure: MilestonePressureLevel
): DecisionWindowStatus {
  if (context === "war_room" && pressure === "critical") return "missed";
  if (timelineActive || context === "timeline") return "active";
  if (pressure === "high" || pressure === "moderate") return "upcoming";
  return "none";
}

function collectContextSources(input: TimelineIntelligenceAggregationInput): readonly TimelineContextSource[] {
  const sources: TimelineContextSource[] = ["operational", "dashboard"];
  if (input.normalizedContext?.source === "object" || input.selectedObjectId) sources.push("object");
  if (input.normalizedContext?.source === "timeline" || input.timelineActive) sources.push("timeline");
  if (input.dashboardContext === "risk" || input.dashboardContext === "war_room") sources.push("risk");
  return Object.freeze([...new Set(sources)]);
}

function buildGraphicalContract(context: DashboardContext): TimelineGraphicalContract {
  return Object.freeze({
    baseline: "executive_timeline_baseline",
    nodes: Object.freeze(["present", "near_term", "mid_term"]),
    events: Object.freeze(
      context === "timeline"
        ? ["context_activation", "milestone_review", "decision_checkpoint"]
        : ["operational_pulse", "risk_watch"]
    ),
    attentionPoints: Object.freeze(
      context === "war_room" ? ["urgent_window", "threat_horizon"] : ["milestone_cluster"]
    ),
    decisionPoints: Object.freeze(["executive_review", "path_selection"]),
  });
}

export function aggregateTimelineIntelligence(
  input: TimelineIntelligenceAggregationInput
): TimelineIntelligenceSurfaceModel {
  const operational = getOperationalIntelligenceSnapshotForExecutiveSummary({
    dashboardContext: input.dashboardContext,
    normalizedContext: input.normalizedContext,
    selectedObjectId: input.selectedObjectId,
    selectedObjectLabel: input.selectedObjectLabel,
    objectsInScene: input.objectsInScene,
    timelineActive: input.timelineActive,
  });

  const timelineActive = input.timelineActive === true || input.dashboardContext === "timeline";
  const signalCount = operational.signals.signalCount;
  const momentumLevel = resolveMomentum(
    input.dashboardContext,
    timelineActive,
    operational.signals.activityTrend
  );
  const pressureLevel = resolveMilestonePressure(input.dashboardContext, signalCount, timelineActive);
  const driftLevel = resolveScheduleDrift(
    input.dashboardContext,
    operational.health.level,
    timelineActive
  );
  const densityLevel = resolveEventDensity(signalCount, timelineActive);
  const windowStatus = resolveDecisionWindow(input.dashboardContext, timelineActive, pressureLevel);

  const visualBundle = getDashboardSurfaceVisualBundle(CANONICAL_TIMELINE_INTELLIGENCE_SURFACE_ID);
  const momentumChart = visualBundle.microCharts.find(
    (chart) => chart.kind === "trend_line" && chart.label === "Timeline Momentum"
  );
  const trendPoints =
    momentumChart?.kind === "trend_line"
      ? momentumChart.points
      : ([0.58, 0.55, 0.57, 0.54, 0.56, 0.53, 0.52] as const);

  const momentumTrend: ImpactDirection =
    momentumLevel === "accelerating"
      ? "improving"
      : momentumLevel === "blocked" || momentumLevel === "slowing"
        ? "deteriorating"
        : "stable";

  const snapshot: TimelineIntelligenceSnapshot = Object.freeze({
    momentum: Object.freeze({
      level: momentumLevel,
      label: MOMENTUM_LABEL[momentumLevel],
      trend: momentumTrend,
      confidence: timelineActive ? "high" : momentumLevel === "stable" ? "moderate" : "low",
      trendPoints,
    }),
    milestonePressure: Object.freeze({
      level: pressureLevel,
      label: PRESSURE_LABEL[pressureLevel],
      upcomingSummary:
        pressureLevel === "critical" || pressureLevel === "high"
          ? "Compressed milestone cluster in near-term window"
          : "Milestones distributed across planning horizon",
      concentration: `${signalCount} temporal signals tracked`,
    }),
    scheduleDrift: Object.freeze({
      level: driftLevel,
      label: DRIFT_LABEL[driftLevel],
      trend: driftLevel === "on_track" ? "improving" : driftLevel === "major_drift" ? "deteriorating" : "stable",
      confidence: driftLevel === "on_track" ? "high" : "moderate",
    }),
    eventDensity: Object.freeze({
      level: densityLevel,
      label: DENSITY_LABEL[densityLevel],
      concentration: `${signalCount} events in current temporal window`,
      activityTrend: densityLevel === "overloaded" || densityLevel === "heavy" ? "deteriorating" : "stable",
    }),
    decisionWindows: Object.freeze({
      status: windowStatus,
      label: WINDOW_LABEL[windowStatus],
      currentWindow:
        windowStatus === "active"
          ? "Executive decision window is open"
          : windowStatus === "missed"
            ? "Prior decision window requires recovery"
            : "No active window",
      upcomingWindow:
        windowStatus === "upcoming"
          ? "Decision window opening within planning cycle"
          : windowStatus === "none"
            ? "Schedule next executive checkpoint"
            : "Monitor current window closure",
    }),
    graphicalContract: buildGraphicalContract(input.dashboardContext),
  });

  const model: TimelineIntelligenceSurfaceModel = Object.freeze({
    surfaceId: CANONICAL_TIMELINE_INTELLIGENCE_SURFACE_ID,
    owner: CANONICAL_TIMELINE_INTELLIGENCE_OWNER,
    headline: "Where is the system heading?",
    snapshot,
    visualBundle,
    contextSources: collectContextSources(input),
  });

  reportTimelineIntelligence({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    version: "4.4.0",
    operationalHealth: operational.health.level,
    timelineActive,
  });
  reportTimelineMomentum(snapshot.momentum);
  reportMilestonePressure(snapshot.milestonePressure);
  reportScheduleDrift(snapshot.scheduleDrift);
  reportEventDensity(snapshot.eventDensity);
  reportDecisionWindow(snapshot.decisionWindows);
  reportTimelineIntelligenceSurface(model);

  return model;
}
