/**
 * E2:10 — Scene-native executive timeline HUD contracts.
 */

import type { DecisionExecutionResult } from "../executive/decisionExecutionTypes";
import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import { buildDecisionTimeline } from "../governance/buildDecisionTimeline";
import type { DecisionTimelineEvent } from "../governance/decisionTimelineModel";

export type TimelineEventStatus = "completed" | "active" | "pending";

export type TimelineEvent = {
  id: string;
  title: string;
  timestamp?: string;
  status: TimelineEventStatus;
};

export type ExecutiveTimelineScenarioTrack = {
  id: string;
  label: string;
  status: "idle" | "active" | "completed";
};

export type ExecutiveTimelineHudModel = {
  events: TimelineEvent[];
  focusedEventId?: string | null;
  scenarioTracks?: ExecutiveTimelineScenarioTrack[];
};

export type ExecutiveTimelineControlId =
  | "replay"
  | "previous"
  | "next"
  | "pause"
  | "speed"
  | "snapshot";

export const EXECUTIVE_TIMELINE_CONTROLS: readonly { id: ExecutiveTimelineControlId; label: string }[] = [
  { id: "replay", label: "Replay" },
  { id: "previous", label: "Previous" },
  { id: "next", label: "Next" },
  { id: "pause", label: "Pause" },
  { id: "speed", label: "Speed" },
  { id: "snapshot", label: "Snapshot" },
] as const;

/** Default executive story when canonical timeline data is not yet available. */
export const EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS: TimelineEvent[] = [
  { id: "baseline", title: "Baseline", status: "completed", timestamp: "T-4h" },
  { id: "supplier_delay", title: "Supplier Delay", status: "completed", timestamp: "T-2h" },
  { id: "inventory_risk", title: "Inventory Risk", status: "active", timestamp: "Now" },
  { id: "scenario_simulated", title: "Scenario Simulated", status: "pending", timestamp: "Next" },
  { id: "decision_accepted", title: "Decision Accepted", status: "pending" },
  { id: "execution_pending", title: "Execution Pending", status: "pending" },
];

export const EXECUTIVE_TIMELINE_SCENARIO_TRACKS: ExecutiveTimelineScenarioTrack[] = [
  { id: "scenario_a", label: "Scenario A", status: "idle" },
  { id: "scenario_b", label: "Scenario B", status: "idle" },
  { id: "scenario_compare", label: "Comparison", status: "idle" },
];

function formatTimelineTimestamp(value: number | undefined): string | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return undefined;
  }
}

function mapDecisionEventsToTimelineEvents(events: DecisionTimelineEvent[]): TimelineEvent[] {
  if (!events.length) return EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS;

  const trimmed = events.slice(-8);
  const activeIndex = Math.max(0, trimmed.length - 1);

  return trimmed.map((event, index) => ({
    id: event.id,
    title: event.title,
    timestamp: formatTimelineTimestamp(event.timestamp),
    status: index < activeIndex ? "completed" : index === activeIndex ? "active" : "pending",
  }));
}

export type BuildExecutiveTimelineHudModelInput = {
  responseData?: unknown;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: DecisionExecutionResult | null;
};

export function buildExecutiveTimelineHudModel(
  input: BuildExecutiveTimelineHudModelInput
): ExecutiveTimelineHudModel {
  let events = EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS;

  try {
    const canonicalEvents = buildDecisionTimeline({
      responseData: (input.responseData ?? null) as Record<string, unknown> | null,
      canonicalRecommendation: input.canonicalRecommendation ?? null,
    });
    if (canonicalEvents.length >= 2) {
      events = mapDecisionEventsToTimelineEvents(canonicalEvents);
    }
  } catch {
    events = EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS;
  }

  const focusedEventId = events.find((event) => event.status === "active")?.id ?? events[0]?.id ?? null;

  return {
    events,
    focusedEventId,
    scenarioTracks: EXECUTIVE_TIMELINE_SCENARIO_TRACKS,
  };
}
