import type { DashboardContext } from "../ui/mainRightPanelContract";

export type TimelineEventPhase = "past" | "present" | "future";

export interface TimelineEvent {
  id: string;
  title: string;
  phase: TimelineEventPhase;
  timestamp: string;
  description?: string;
  sourceId?: string;
  objectId?: string;
  scenarioId?: string;
}

export type TimelineState = "hidden" | "collapsed" | "expanded";

export type TimelineViewMode = "global" | "object" | "scenario";

export const TIMELINE_ARCHITECTURE_CONTRACT = Object.freeze({
  location: "bottom_scene_region",
  surface: "scene_native_runtime_component",
  notLeftNavPage: true,
  notMainRightPanelTab: true,
  notApplicationRoute: true,
  dashboardContext: "timeline" satisfies DashboardContext,
  states: ["hidden", "collapsed", "expanded"] as const satisfies readonly TimelineState[],
  phases: ["past", "present", "future"] as const satisfies readonly TimelineEventPhase[],
  viewModes: ["global", "object", "scenario"] as const satisfies readonly TimelineViewMode[],
  routingFlow: [
    "timeline_request",
    "dashboard_context",
    "timeline_context",
    "scene_timeline",
  ] as const,
});

const timelineWarnings = new Set<string>();

function warnTimelineBrake(message: string, payload?: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(payload ?? {})}`;
  if (timelineWarnings.has(key)) return;
  timelineWarnings.add(key);
  console.warn(message, payload ?? {});
}

export function normalizeTimelineState(value: TimelineState | string | null | undefined): TimelineState {
  if (value === "hidden" || value === "collapsed" || value === "expanded") return value;
  warnTimelineBrake("[Timeline][Brake] Invalid timeline state.", {
    received: value ?? null,
    fallback: "collapsed",
  });
  return "collapsed";
}

export function resolveTimelineState(input: {
  visible?: boolean;
  collapsed?: boolean;
  expanded?: boolean;
  heightMode?: string | null;
}): TimelineState {
  if (input.visible === false) return "hidden";
  if (input.expanded === true) return "expanded";
  if (input.collapsed === true) return "collapsed";
  if (input.heightMode === "expanded" || input.heightMode === "full") return "expanded";
  if (input.heightMode === "collapsed" || input.heightMode === "compact") return "collapsed";
  return "collapsed";
}

export function normalizeTimelineEvent(value: unknown): TimelineEvent | null {
  if (!value || typeof value !== "object") {
    warnTimelineBrake("[Timeline][Brake] Invalid timeline event.", {
      reason: "not_object",
    });
    return null;
  }
  const record = value as Partial<TimelineEvent>;
  const id = typeof record.id === "string" ? record.id.trim() : "";
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const timestamp = typeof record.timestamp === "string" ? record.timestamp.trim() : "";
  const phase = record.phase;
  if (!id || !title || !timestamp || (phase !== "past" && phase !== "present" && phase !== "future")) {
    warnTimelineBrake("[Timeline][Brake] Invalid timeline event.", {
      hasId: Boolean(id),
      hasTitle: Boolean(title),
      hasTimestamp: Boolean(timestamp),
      phase: phase ?? null,
    });
    return null;
  }
  return {
    ...record,
    id,
    title,
    timestamp,
    phase,
  };
}

export function warnTimelineRoutingFailure(payload?: Readonly<Record<string, unknown>>): void {
  warnTimelineBrake("[Timeline][Brake] Timeline routing failure.", payload);
}

export function warnTimelineContextUnavailable(payload?: Readonly<Record<string, unknown>>): void {
  warnTimelineBrake("[Timeline][Brake] Timeline context unavailable.", payload);
}
