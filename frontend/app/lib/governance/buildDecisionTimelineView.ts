import type { DecisionTimelineEvent, DecisionTimelineViewEvent } from "./decisionTimelineModel";

function sourceLabel(source: DecisionTimelineEvent["source"]) {
  switch (source) {
    case "user":
      return "User";
    case "ai_reasoning":
      return "AI";
    case "multi_agent":
      return "Multi-agent";
    case "simulation_engine":
      return "Simulation";
    default:
      return "Recommendation";
  }
}

function confidenceLabel(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value > 0.75) return `High ${Math.round(value * 100)}%`;
  if (value >= 0.45) return `Medium ${Math.round(value * 100)}%`;
  return `Low ${Math.round(value * 100)}%`;
}

export function buildDecisionTimelineView(events: DecisionTimelineEvent[]): DecisionTimelineViewEvent[] {
  return [...events]
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((event) => ({
      ...event,
      sourceLabel: sourceLabel(event.source),
      confidenceLabel: confidenceLabel(event.confidence),
    }));
}
