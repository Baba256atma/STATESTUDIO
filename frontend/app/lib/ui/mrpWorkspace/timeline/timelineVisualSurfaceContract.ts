/**
 * MRP:4D:4 — Timeline workspace executive visual surface contract.
 *
 * Read-only presentation layer — no charts, simulation, or AI generation.
 */

export const MRP_TIMELINE_VISUAL_TAG = "[MRP_TIMELINE_VISUAL]" as const;

export const TIMELINE_VISUAL_SURFACE_VERSION = "4D.4.0";

export type TimelineSummaryVisual = Readonly<{
  totalEvents: number;
  decisionsRecorded: number;
  riskEvents: number;
  lastActivity: string;
}>;

export type TimelineRecentEventRow = Readonly<{
  time: string;
  event: string;
  category: string;
}>;

export type TimelineDecisionHistoryRow = Readonly<{
  decision: string;
  date: string;
  status: string;
}>;

export type TimelineVisualSurface = Readonly<{
  summary: TimelineSummaryVisual;
  recentEvents: readonly TimelineRecentEventRow[];
  decisionHistory: readonly TimelineDecisionHistoryRow[];
  recentEventsEmptyMessage: string | null;
  decisionHistoryEmptyMessage: string | null;
}>;

export const DEFAULT_TIMELINE_SUMMARY_VISUAL: TimelineSummaryVisual = Object.freeze({
  totalEvents: 0,
  decisionsRecorded: 0,
  riskEvents: 0,
  lastActivity: "None",
});

export const DEFAULT_TIMELINE_VISUAL_SURFACE: TimelineVisualSurface = Object.freeze({
  summary: DEFAULT_TIMELINE_SUMMARY_VISUAL,
  recentEvents: Object.freeze([]),
  decisionHistory: Object.freeze([]),
  recentEventsEmptyMessage: "No recent timeline events in the active runtime scan.",
  decisionHistoryEmptyMessage: "No decision history recorded in the active runtime scan.",
});

export const TIMELINE_SUMMARY_METRIC_LABELS = Object.freeze({
  totalEvents: "Total Events",
  decisionsRecorded: "Decisions Recorded",
  riskEvents: "Risk Events",
  lastActivity: "Last Activity",
});

export const TIMELINE_RECENT_EVENTS_COLUMN_LABELS = Object.freeze({
  time: "Time",
  event: "Event",
  category: "Category",
});

export const TIMELINE_DECISION_HISTORY_COLUMN_LABELS = Object.freeze({
  decision: "Decision",
  date: "Date",
  status: "Status",
});
