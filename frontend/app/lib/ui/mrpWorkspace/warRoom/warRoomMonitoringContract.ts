/**
 * MRP:4F:5 — War Room watch & monitor layer contract.
 *
 * Tracks execution after commitment — no simulation or timeline ownership.
 */

export const WAR_ROOM_MONITORING_TAG = "[MRP_WARROOM_MONITORING]" as const;

export const WAR_ROOM_MONITORING_VERSION = "4F.5.0";

export const WAR_ROOM_MONITORING_CONTEXT = "war_room" as const;

export const WAR_ROOM_MONITORING_PURPOSE =
  "Track execution after commitment." as const;

export type WarRoomMonitorCategoryId =
  | "critical_objects"
  | "strategic_risks"
  | "operational_signals"
  | "decision_health";

export type WarRoomMonitoringVisualSectionId =
  | "watch_list"
  | "alerts"
  | "decision_health"
  | "escalation_indicators";

export type WarRoomMonitorSeverity = "critical" | "warning" | "stable" | "info";

export type WarRoomWatchItem = Readonly<{
  id: string;
  label: string;
  category: WarRoomMonitorCategoryId;
  severity: WarRoomMonitorSeverity;
  summary: string;
}>;

export type WarRoomMonitorAlert = Readonly<{
  id: string;
  title: string;
  severity: Exclude<WarRoomMonitorSeverity, "stable">;
  category: WarRoomMonitorCategoryId;
  detail: string;
}>;

export type WarRoomDecisionHealthSignal = Readonly<{
  id: string;
  label: string;
  status: "healthy" | "at_risk" | "critical";
  detail: string;
}>;

export type WarRoomEscalationLevel = "none" | "watch" | "escalate" | "critical";

export type WarRoomEscalationIndicator = Readonly<{
  id: string;
  label: string;
  level: WarRoomEscalationLevel;
  reason: string;
}>;

export type WarRoomMonitoringLayer = Readonly<{
  watchItems: readonly WarRoomWatchItem[];
  alerts: readonly WarRoomMonitorAlert[];
  decisionHealth: readonly WarRoomDecisionHealthSignal[];
  escalationIndicators: readonly WarRoomEscalationIndicator[];
  executionTrackingOwned: true;
}>;

export type WarRoomMonitoringSurface = Readonly<{
  purpose: typeof WAR_ROOM_MONITORING_PURPOSE;
  watchList: readonly WarRoomWatchItem[];
  alerts: readonly WarRoomMonitorAlert[];
  decisionHealth: readonly WarRoomDecisionHealthSignal[];
  escalationIndicators: readonly WarRoomEscalationIndicator[];
  dashboardContext: typeof WAR_ROOM_MONITORING_CONTEXT;
  executionTrackingOwned: true;
}>;

export const WAR_ROOM_MONITOR_CATEGORY_ORDER: readonly WarRoomMonitorCategoryId[] =
  Object.freeze([
    "critical_objects",
    "strategic_risks",
    "operational_signals",
    "decision_health",
  ]);

export const WAR_ROOM_MONITOR_CATEGORY_LABELS: Readonly<
  Record<WarRoomMonitorCategoryId, string>
> = Object.freeze({
  critical_objects: "Critical Objects",
  strategic_risks: "Strategic Risks",
  operational_signals: "Operational Signals",
  decision_health: "Decision Health",
});

export const WAR_ROOM_MONITORING_VISUAL_SECTION_ORDER: readonly WarRoomMonitoringVisualSectionId[] =
  Object.freeze([
    "watch_list",
    "alerts",
    "decision_health",
    "escalation_indicators",
  ]);

export const WAR_ROOM_MONITORING_VISUAL_SECTION_LABELS: Readonly<
  Record<WarRoomMonitoringVisualSectionId, string>
> = Object.freeze({
  watch_list: "Watch List",
  alerts: "Alerts",
  decision_health: "Decision Health",
  escalation_indicators: "Escalation Indicators",
});

export const DEFAULT_WAR_ROOM_MONITORING_LAYER: WarRoomMonitoringLayer = Object.freeze({
  watchItems: Object.freeze([]),
  alerts: Object.freeze([]),
  decisionHealth: Object.freeze([]),
  escalationIndicators: Object.freeze([]),
  executionTrackingOwned: true,
});

export const DEFAULT_WAR_ROOM_MONITORING_SURFACE: WarRoomMonitoringSurface = Object.freeze({
  purpose: WAR_ROOM_MONITORING_PURPOSE,
  watchList: Object.freeze([]),
  alerts: Object.freeze([]),
  decisionHealth: Object.freeze([]),
  escalationIndicators: Object.freeze([]),
  dashboardContext: WAR_ROOM_MONITORING_CONTEXT,
  executionTrackingOwned: true,
});
