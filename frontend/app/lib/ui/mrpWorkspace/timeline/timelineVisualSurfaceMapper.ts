/**
 * MRP:4D:4 — Map TimelineWorkspaceState to executive visual surface views.
 */

import {
  DEFAULT_TIMELINE_SUMMARY_VISUAL,
  DEFAULT_TIMELINE_VISUAL_SURFACE,
  type TimelineVisualSurface,
} from "./timelineVisualSurfaceContract.ts";
import {
  TIMELINE_LOADING_HEADLINE,
  type TimelineWorkspaceState,
} from "./timelineWorkspaceStateContract.ts";

function formatLastActivity(timestamp: number, fallback: string): string {
  if (!timestamp) return fallback;
  const date = new Date(timestamp);
  const timeLabel = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfEntryDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDelta = Math.round((startOfToday - startOfEntryDay) / 86_400_000);

  if (dayDelta === 0) return `Today · ${timeLabel}`;
  if (dayDelta === 1) return `Yesterday · ${timeLabel}`;
  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} · ${timeLabel}`;
}

export function buildTimelineVisualSurfaceFromState(
  state: TimelineWorkspaceState
): TimelineVisualSurface {
  if (state.phase === "loading") {
    return Object.freeze({
      summary: DEFAULT_TIMELINE_SUMMARY_VISUAL,
      recentEvents: Object.freeze([]),
      decisionHistory: Object.freeze([]),
      recentEventsEmptyMessage: TIMELINE_LOADING_HEADLINE,
      decisionHistoryEmptyMessage: TIMELINE_LOADING_HEADLINE,
    });
  }

  if (state.phase === "empty") {
    return DEFAULT_TIMELINE_VISUAL_SURFACE;
  }

  const summary = Object.freeze({
    totalEvents: state.totalEvents,
    decisionsRecorded: state.decisionEventCount,
    riskEvents: state.riskEventCount,
    lastActivity: formatLastActivity(
      state.lastEventAt,
      state.objectContext.hasSelection ? state.objectContext.lastActivity : "None"
    ),
  });

  const recentEventsEmptyMessage =
    state.recentEventRows.length === 0
      ? "No recent timeline events in the active runtime scan."
      : null;
  const decisionHistoryEmptyMessage =
    state.decisionHistoryRows.length === 0
      ? "No decision history recorded in the active runtime scan."
      : null;

  return Object.freeze({
    summary,
    recentEvents: state.recentEventRows,
    decisionHistory: state.decisionHistoryRows,
    recentEventsEmptyMessage,
    decisionHistoryEmptyMessage,
  });
}
