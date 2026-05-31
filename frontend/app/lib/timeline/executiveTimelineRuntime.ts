import type {
  ExecutiveTimelineHudModel,
  TimelineEvent,
  TimelineEventStatus,
} from "../scene/executiveTimelineHudTypes";
import {
  resolveTimelinePriority,
  shouldDisplayTimelinePriority,
  type TimelinePriorityCategory,
} from "./timelinePriorityRuntime";
import type { TimelineCompressionMode } from "./timelineCompressionRuntime";

export type TimelineOutcomeMarker =
  | "approved"
  | "risk_increased"
  | "scenario_updated"
  | "action_recommended"
  | "monitoring";

export type TimelineStoryItem = {
  id: string;
  headline: string;
  timestamp?: string;
  timestampIso?: string;
  severity: TimelinePriorityCategory;
  marker: TimelineOutcomeMarker;
  markerLabel: string;
  scenarioLabel: string;
  cause: string;
  impact: string;
  action: string;
  outcome: string;
  status: TimelineEventStatus;
};

const logKeys = new Set<string>();

function log(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.("[Nexora][TimelineStory]", payload);
}

function markerForEvent(event: TimelineEvent): TimelineOutcomeMarker {
  const title = event.title.toLowerCase();
  if (title.includes("approved") || title.includes("accepted")) return "approved";
  if (title.includes("risk") || title.includes("delay")) return "risk_increased";
  if (title.includes("scenario") || title.includes("simulated")) return "scenario_updated";
  if (title.includes("decision") || title.includes("recommended")) return "action_recommended";
  return "monitoring";
}

export function timelineOutcomeMarkerLabel(marker: TimelineOutcomeMarker): string {
  if (marker === "approved") return "Approved";
  if (marker === "risk_increased") return "Risk Increased";
  if (marker === "scenario_updated") return "Scenario Updated";
  if (marker === "action_recommended") return "Action Recommended";
  return "Monitoring";
}

export function timelineOutcomeMarkerGlyph(marker: TimelineOutcomeMarker): string {
  if (marker === "approved") return "✓";
  if (marker === "risk_increased") return "⚠";
  if (marker === "scenario_updated") return "↻";
  if (marker === "action_recommended") return "→";
  return "●";
}

function scenarioLabelForEvent(event: TimelineEvent, model: ExecutiveTimelineHudModel): string {
  const title = event.title.toLowerCase();
  const activeTrack = model.scenarioTracks?.find((track) => track.status === "active");
  if (title.includes("baseline")) return "Baseline";
  if (title.includes("scenario")) return activeTrack?.label ?? "Scenario";
  return activeTrack?.label ?? "Baseline";
}

function narrativeForEvent(event: TimelineEvent, marker: TimelineOutcomeMarker) {
  if (marker === "risk_increased") {
    return {
      cause: "Signal changed",
      impact: "Executive risk posture increased",
      action: "Review mitigation path",
      outcome: "Monitoring",
    };
  }
  if (marker === "scenario_updated") {
    return {
      cause: "Alternative evaluated",
      impact: "Scenario context updated",
      action: "Compare against baseline",
      outcome: "Scenario ready",
    };
  }
  if (marker === "approved") {
    return {
      cause: "Decision threshold met",
      impact: "Execution path cleared",
      action: "Track follow-through",
      outcome: "Approved",
    };
  }
  if (marker === "action_recommended") {
    return {
      cause: "Decision point reached",
      impact: "Next move identified",
      action: "Assess tradeoff",
      outcome: "Recommendation",
    };
  }
  return {
    cause: "System state observed",
    impact: "Context maintained",
    action: "Continue monitoring",
    outcome: event.status === "active" ? "Active" : "Tracked",
  };
}

function toStoryItem(event: TimelineEvent, model: ExecutiveTimelineHudModel): TimelineStoryItem {
  const severity = resolveTimelinePriority(event);
  const marker = markerForEvent(event);
  const narrative = narrativeForEvent(event, marker);
  return {
    id: event.id,
    headline: event.title,
    timestamp: event.timestamp,
    timestampIso: event.timestampIso,
    severity,
    marker,
    markerLabel: timelineOutcomeMarkerLabel(marker),
    scenarioLabel: scenarioLabelForEvent(event, model),
    cause: narrative.cause,
    impact: narrative.impact,
    action: narrative.action,
    outcome: narrative.outcome,
    status: event.status,
  };
}

export function buildExecutiveTimelineStoryItems(
  model: ExecutiveTimelineHudModel,
  mode: TimelineCompressionMode
): TimelineStoryItem[] {
  const storyItems = model.events
    .map((event) => toStoryItem(event, model))
    .filter((item) => shouldDisplayTimelinePriority(item.severity, mode));

  log({
    mode,
    rawEventCount: model.events.length,
    storyItemCount: storyItems.length,
    visiblePriorities: Array.from(new Set(storyItems.map((item) => item.severity))),
  });
  return storyItems;
}

export function getTimelineStorySummary(items: readonly TimelineStoryItem[]): string {
  const active = items.find((item) => item.status === "active") ?? items[0] ?? null;
  if (!active) return "No decision story available";
  return `${active.markerLabel}: ${active.headline}`;
}

export function resetExecutiveTimelineRuntimeForTests(): void {
  logKeys.clear();
}
