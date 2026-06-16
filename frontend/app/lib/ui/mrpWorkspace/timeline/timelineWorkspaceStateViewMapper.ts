/**
 * MRP:4D:1 / 4D:2 — Map TimelineWorkspaceState to workspace card views.
 */

import {
  TIMELINE_WORKSPACE_SECTION_ORDER,
  type TimelineWorkspaceCardTone,
  type TimelineWorkspaceCardView,
  type TimelineWorkspaceView,
} from "./timelineWorkspaceContract.ts";
import { MRP_TIMELINE_STATE_TAG } from "./timelineWorkspaceMetricsContract.ts";
import { buildTimelineVisualSurfaceFromState } from "./timelineVisualSurfaceMapper.ts";
import {
  TIMELINE_EMPTY_DETAIL,
  TIMELINE_EMPTY_HEADLINE,
  TIMELINE_LOADING_DETAIL,
  TIMELINE_LOADING_HEADLINE,
  type TimelineFieldSnapshot,
  type TimelineWorkspaceState,
} from "./timelineWorkspaceStateContract.ts";

function resolveFieldTone(
  state: TimelineWorkspaceState,
  fallback: TimelineWorkspaceCardTone
): TimelineWorkspaceCardTone {
  if (state.phase === "loading") return "neutral";
  if (state.phase === "empty") return "muted";
  if (state.riskEventCount > 0) return "critical";
  if (state.decisionEventCount > 0) return "warning";
  return fallback;
}

function buildMetricsFieldSnapshots(state: TimelineWorkspaceState): Readonly<{
  timelineSummary: TimelineFieldSnapshot;
  recentEvents: TimelineFieldSnapshot;
  importantChanges: TimelineFieldSnapshot;
  decisionHistory: TimelineFieldSnapshot;
  riskEvolution: TimelineFieldSnapshot;
}> {
  const hasEvents = state.totalEvents > 0;

  return Object.freeze({
    timelineSummary: Object.freeze({
      headline: hasEvents
        ? `${state.totalEvents} tracked timeline event${state.totalEvents === 1 ? "" : "s"}`
        : "No timeline events detected",
      detail: hasEvents
        ? `${state.recentEventCount} recent · ${state.decisionEventCount} decision · ${state.riskEventCount} risk`
        : `${MRP_TIMELINE_STATE_TAG} Structural scan — no navigation or scene timeline markers detected.`,
    }),
    recentEvents: Object.freeze({
      headline: hasEvents
        ? `${state.recentEventCount} recent event${state.recentEventCount === 1 ? "" : "s"}`
        : "No recent timeline activity",
      detail: hasEvents
        ? "Derived from read-only navigation history within the recent activity window."
        : `${MRP_TIMELINE_STATE_TAG} Recent events derive from executive continuity navigation history.`,
    }),
    importantChanges: Object.freeze({
      headline: hasEvents
        ? `${state.decisionEventCount + state.riskEventCount} material change signal${state.decisionEventCount + state.riskEventCount === 1 ? "" : "s"}`
        : "No material changes detected",
      detail: hasEvents
        ? "Decision and risk event markers from read-only runtime sources."
        : `${MRP_TIMELINE_STATE_TAG} Important changes follow derived timeline metrics.`,
    }),
    decisionHistory: Object.freeze({
      headline: hasEvents
        ? `${state.decisionEventCount} decision event${state.decisionEventCount === 1 ? "" : "s"}`
        : "No decision history signal",
      detail: hasEvents
        ? "Decision workspace transitions and scene decision markers."
        : `${MRP_TIMELINE_STATE_TAG} Decision history activates when decision markers are present.`,
    }),
    riskEvolution: Object.freeze({
      headline: hasEvents
        ? `${state.riskEventCount} risk event${state.riskEventCount === 1 ? "" : "s"}`
        : "No risk evolution signal",
      detail: hasEvents
        ? "Risk workspace transitions and scene risk markers."
        : `${MRP_TIMELINE_STATE_TAG} Risk evolution derives from read-only workspace runtime data.`,
    }),
  });
}

function buildFieldCard(
  id: TimelineWorkspaceCardView["id"],
  label: string,
  field: TimelineFieldSnapshot,
  state: TimelineWorkspaceState,
  tone: TimelineWorkspaceCardTone
): TimelineWorkspaceCardView {
  return Object.freeze({
    id,
    label,
    headline:
      state.phase === "loading"
        ? TIMELINE_LOADING_HEADLINE
        : state.phase === "empty"
          ? TIMELINE_EMPTY_HEADLINE
          : field.headline,
    detail:
      state.phase === "loading"
        ? TIMELINE_LOADING_DETAIL
        : state.phase === "empty"
          ? TIMELINE_EMPTY_DETAIL
          : field.detail,
    tone: resolveFieldTone(state, tone),
  });
}

export function buildTimelineWorkspaceViewFromState(
  state: TimelineWorkspaceState
): TimelineWorkspaceView {
  const metricsFields =
    state.phase === "ready" ? buildMetricsFieldSnapshots(state) : null;

  const cards: TimelineWorkspaceCardView[] = [
    buildFieldCard(
      "timeline_summary",
      "Timeline Summary",
      metricsFields?.timelineSummary ?? state.timelineSummary,
      state,
      "accent"
    ),
    buildFieldCard(
      "recent_events",
      "Recent Events",
      metricsFields?.recentEvents ?? state.recentEvents,
      state,
      "neutral"
    ),
    buildFieldCard(
      "important_changes",
      "Important Changes",
      metricsFields?.importantChanges ?? state.importantChanges,
      state,
      "warning"
    ),
    buildFieldCard(
      "decision_history",
      "Decision History",
      metricsFields?.decisionHistory ?? state.decisionHistory,
      state,
      "accent"
    ),
    buildFieldCard(
      "risk_evolution",
      "Risk Evolution",
      metricsFields?.riskEvolution ?? state.riskEvolution,
      state,
      "critical"
    ),
  ];

  const orderedCards = TIMELINE_WORKSPACE_SECTION_ORDER.map(
    (id) => cards.find((card) => card.id === id)!
  );

  return Object.freeze({
    workspaceId: "timeline",
    cards: Object.freeze(orderedCards),
    objectContext: state.objectContext,
    visualSurface: buildTimelineVisualSurfaceFromState(state),
    sceneCoverage: state.sceneCoverage,
    sceneAwarenessReadOnly: state.sceneAwarenessReadOnly,
    scanPurpose:
      "Review timeline posture and recent executive changes within 5–10 seconds.",
    phase: state.phase,
    revision: state.revision,
    source: "timeline_workspace_runtime_state",
  });
}
