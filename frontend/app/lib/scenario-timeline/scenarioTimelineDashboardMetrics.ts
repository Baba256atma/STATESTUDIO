/**
 * APP-5:8 — Scenario Timeline Dashboard metrics builder.
 */

import { SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_LIMITS } from "./scenarioTimelineDashboardConstants.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type { ScenarioTimelineHistoryMilestone } from "./scenarioTimelineHistoryTypes.ts";
import type { ScenarioTimelineView } from "./scenarioTimelineApiTypes.ts";
import type {
  ScenarioTimelineDashboardChangeRecord,
  ScenarioTimelineDashboardMetrics,
  ScenarioTimelineDashboardMilestoneView,
} from "./scenarioTimelineDashboardTypes.ts";
import type { ScenarioTimelineLifecycleStatus } from "./scenarioTimelineLifecycleTypes.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

export function mapDashboardMilestones(
  milestones: readonly ScenarioTimelineHistoryMilestone[]
): readonly ScenarioTimelineDashboardMilestoneView[] {
  return Object.freeze(
    milestones.map((entry) =>
      Object.freeze({
        milestoneId: entry.milestoneId,
        milestoneKey: entry.milestoneKey,
        stage: entry.stage,
        title: entry.title,
        summary: entry.summary,
        timestamp: entry.timestamp,
        readOnly: true as const,
      })
    )
  );
}

export function buildDashboardRecentChanges(
  events: readonly ScenarioTimelineEvent[]
): readonly ScenarioTimelineDashboardChangeRecord[] {
  const changes: ScenarioTimelineDashboardChangeRecord[] = [];
  for (let index = 1; index < events.length; index += 1) {
    const previous = events[index - 1]!;
    const current = events[index]!;
    changes.push(
      Object.freeze({
        eventId: current.eventId,
        fromStage: previous.stage,
        toStage: current.stage,
        timestamp: current.timestamp,
        title: current.title,
        summary: current.summary,
        readOnly: true as const,
      })
    );
  }
  return Object.freeze(changes.slice(-SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_LIMITS.maxRecentChanges));
}

export function selectDashboardRecentEvents(
  events: readonly ScenarioTimelineEvent[]
): readonly ScenarioTimelineEvent[] {
  return Object.freeze(events.slice(-SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_LIMITS.maxRecentEvents));
}

export function buildScenarioTimelineDashboardMetricsFromView(view: ScenarioTimelineView): ScenarioTimelineDashboardMetrics {
  const query = view.query;
  const completedStages = query?.completedStages ?? view.lifecycle?.completedStages ?? [];
  const remainingStages = query?.remainingStages ?? view.lifecycle?.remainingStages ?? [];
  const milestones = query?.milestones ?? view.history?.milestones ?? [];

  return Object.freeze({
    eventCount: view.events.length,
    milestoneCount: milestones.length,
    completedStageCount: completedStages.length,
    remainingStageCount: remainingStages.length,
    historyDurationMs: query?.duration ?? null,
    progressPercent: query?.progress ?? view.progress,
    readOnly: true as const,
  });
}

export function resolveDashboardStageData(view: ScenarioTimelineView): {
  currentStage: ScenarioTimelineLifecycleStage | null;
  progress: number | null;
  status: ScenarioTimelineLifecycleStatus | null;
  completedStages: readonly ScenarioTimelineLifecycleStage[];
  remainingStages: readonly ScenarioTimelineLifecycleStage[];
  historyDuration: number | null;
} {
  const query = view.query;
  return {
    currentStage: query?.lifecycle?.currentStage ?? view.lifecycle?.currentStage ?? null,
    progress: query?.progress ?? view.progress,
    status: query?.status ?? view.status,
    completedStages: Object.freeze([...(query?.completedStages ?? view.lifecycle?.completedStages ?? [])]),
    remainingStages: Object.freeze([...(query?.remainingStages ?? view.lifecycle?.remainingStages ?? [])]),
    historyDuration: query?.duration ?? null,
  };
}

export const ScenarioTimelineDashboardMetricsBuilder = Object.freeze({
  mapDashboardMilestones,
  buildDashboardRecentChanges,
  selectDashboardRecentEvents,
  buildScenarioTimelineDashboardMetricsFromView,
  resolveDashboardStageData,
});
