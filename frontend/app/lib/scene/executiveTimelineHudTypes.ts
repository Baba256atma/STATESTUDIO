/**
 * ARCHITECTURE CONTRACT:
 * Scene-native executive timeline HUD contracts. Canonical MVP timeline state,
 * event phases, routing, and brake helpers live in
 * ../timeline/timelineArchitectureContract.
 * The HUD may visualize events; it must not own storage, engines, MRP tabs, or
 * standalone timeline routing.
 */

import type { DecisionExecutionResult } from "../executive/decisionExecutionTypes";
import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import { buildDecisionTimeline } from "../governance/buildDecisionTimeline";
import type { DecisionTimelineEvent } from "../governance/decisionTimelineModel";

export type TimelineEventStatus = "completed" | "active" | "pending";

export type TimelineEventSeverity = "info" | "watch" | "warning" | "critical";

export type TimelineEventSpatialStatus = "planned" | "active" | "completed" | "blocked" | "simulated";

export type TimelineSpatialMarkerType =
  | "decision"
  | "risk"
  | "scenario"
  | "operational"
  | "recovery";

export type TimelineSpatialAnchorRef = {
  kind?: "object" | "cluster" | "global" | "relationship" | "scenario";
  objectId?: string | null;
  objectIds?: readonly string[];
  clusterId?: string | null;
  scenarioId?: string | null;
  relationshipId?: string | null;
};

export type TimelineEvent = {
  id: string;
  title: string;
  /** Semantic labels such as "Now" or "T-4h" for placeholder story beats. */
  timestamp?: string;
  /** Stable ISO timestamp for machine-generated events. */
  timestampIso?: string;
  status: TimelineEventStatus;
  /** E2:94 — optional spatial anchoring metadata. */
  summary?: string;
  narrativeSummary?: string;
  severity?: TimelineEventSeverity;
  spatialStatus?: TimelineEventSpatialStatus;
  markerType?: TimelineSpatialMarkerType;
  relatedObjectIds?: readonly string[];
  scenarioId?: string | null;
  relationshipId?: string | null;
  riskId?: string | null;
  decisionId?: string | null;
  tick?: number | null;
  snapshotId?: string | null;
  spatialAnchor?: TimelineSpatialAnchorRef | null;
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

export const EXECUTIVE_TIMELINE_CONTROLS: readonly {
  id: ExecutiveTimelineControlId;
  label: string;
  icon: string;
}[] = [
  { id: "replay", label: "Replay", icon: "↺" },
  { id: "previous", label: "Previous", icon: "◀" },
  { id: "next", label: "Next", icon: "▶" },
  { id: "pause", label: "Pause", icon: "⏸" },
  { id: "speed", label: "Speed", icon: "⏩" },
  { id: "snapshot", label: "Snapshot", icon: "◫" },
] as const;

/** Default executive story when canonical timeline data is not yet available. */
export const EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS: TimelineEvent[] = [
  { id: "baseline", title: "Baseline", status: "completed", timestamp: "T-4h", markerType: "operational", severity: "info" },
  {
    id: "supplier_delay",
    title: "Supplier Delay",
    status: "completed",
    timestamp: "T-2h",
    markerType: "risk",
    severity: "warning",
    spatialStatus: "completed",
  },
  {
    id: "inventory_risk",
    title: "Inventory Risk",
    status: "active",
    timestamp: "Now",
    markerType: "risk",
    severity: "critical",
    spatialStatus: "active",
  },
  {
    id: "scenario_simulated",
    title: "Scenario Simulated",
    status: "pending",
    timestamp: "Next",
    markerType: "scenario",
    severity: "watch",
    spatialStatus: "simulated",
  },
  {
    id: "decision_accepted",
    title: "Decision Accepted",
    status: "pending",
    markerType: "decision",
    severity: "watch",
    spatialStatus: "planned",
  },
  {
    id: "execution_pending",
    title: "Execution Pending",
    status: "pending",
    markerType: "operational",
    severity: "info",
    spatialStatus: "planned",
  },
];

export const EXECUTIVE_TIMELINE_SCENARIO_TRACKS: ExecutiveTimelineScenarioTrack[] = [
  { id: "scenario_a", label: "Scenario A", status: "idle" },
  { id: "scenario_b", label: "Scenario B", status: "idle" },
  { id: "scenario_compare", label: "Comparison", status: "idle" },
];

function inferMarkerType(event: DecisionTimelineEvent): TimelineSpatialMarkerType {
  const type = event.type;
  if (type === "simulation" || type === "comparison") return "scenario";
  if (type === "recommendation" || type === "action" || type === "approval_approved") return "decision";
  if (type === "prompt" || type === "reasoning") return "operational";
  const title = event.title.toLowerCase();
  if (title.includes("risk") || title.includes("delay")) return "risk";
  if (title.includes("scenario")) return "scenario";
  return "operational";
}

function mapDecisionEventsToTimelineEvents(events: DecisionTimelineEvent[]): TimelineEvent[] {
  if (!events.length) return EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS;

  const trimmed = events.slice(-8);
  const activeIndex = Math.max(0, trimmed.length - 1);

  return trimmed.map((event, index) => ({
    id: event.id,
    title: event.title,
    summary: event.summary,
    narrativeSummary: event.summary,
    timestampIso: new Date(event.timestamp).toISOString(),
    status: index < activeIndex ? "completed" : index === activeIndex ? "active" : "pending",
    relatedObjectIds: event.related_ids ?? [],
    decisionId: event.id,
    markerType: inferMarkerType(event),
    severity:
      event.type === "simulation" || event.title.toLowerCase().includes("risk")
        ? "warning"
        : event.confidence != null && event.confidence >= 0.8
          ? "watch"
          : "info",
    spatialStatus:
      index < activeIndex ? "completed" : index === activeIndex ? "active" : "planned",
    spatialAnchor:
      event.related_ids?.length
        ? {
            kind: event.related_ids.length > 1 ? "cluster" : "object",
            objectId: event.related_ids[0] ?? null,
            objectIds: event.related_ids,
          }
        : null,
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
