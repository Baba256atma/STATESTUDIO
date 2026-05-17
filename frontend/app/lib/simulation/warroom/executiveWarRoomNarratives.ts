/**
 * D7:1:8 — Executive war-room session narratives.
 */

import type { ScenarioComparisonSnapshot } from "../comparison/scenarioComparisonTypes.ts";
import type {
  ExecutiveWarRoomSessionNarrative,
  WarRoomScenarioSlot,
  WarRoomSyncRecord,
} from "./warRoomTypes.ts";

export function buildExecutiveWarRoomSessionNarrative(input: {
  sessionTitle: string;
  scenarioSlots: readonly WarRoomScenarioSlot[];
  syncRecord?: WarRoomSyncRecord;
  comparisonSnapshots: readonly ScenarioComparisonSnapshot[];
  interventionCount: number;
}): ExecutiveWarRoomSessionNarrative {
  const alternatives = input.scenarioSlots.filter((s) => s.role === "alternative");
  const labels = alternatives.map((s) => s.executiveLabel ?? s.label).slice(0, 4);

  const headline =
    labels.length > 0
      ? `War-room session "${input.sessionTitle}" compares ${labels.join(", ")} under shared operational context.`
      : `War-room session "${input.sessionTitle}" explores coordinated strategic futures.`;

  const summaryParts: string[] = [];
  if (input.interventionCount > 0) {
    summaryParts.push(
      `${input.interventionCount} strategic intervention(s) were sequenced with preserved causality.`
    );
  }
  if (input.syncRecord) {
    summaryParts.push(
      `Timelines synchronized at tick ${input.syncRecord.syncTick} across ${input.syncRecord.synchronizedScenarioIds.length} scenarios.`
    );
  }
  if (input.comparisonSnapshots.length > 0) {
    const safer = input.comparisonSnapshots.find((s) => s.narrative.saferPath === "comparison");
    if (safer) {
      summaryParts.push(
        `Alternative "${safer.comparison.comparisonScenarioId}" shows a safer posture than baseline at the sync point.`
      );
    } else {
      summaryParts.push("Scenario comparisons highlight material tradeoffs between strategic paths.");
    }
  }

  const scenarioSummaries = input.scenarioSlots.map((slot) => {
    const role =
      slot.role === "baseline"
        ? "anchor reality"
        : slot.role === "intervention_projection"
          ? "intervention projection"
          : "alternative future";
    return `${slot.label} (${role})`;
  });

  const bullets: string[] = [];
  for (const snap of input.comparisonSnapshots.slice(0, 3)) {
    bullets.push(snap.narrative.headline);
  }
  if (alternatives.length > 3) {
    bullets.push(`${alternatives.length - 3} additional futures remain available for executive review.`);
  }

  return {
    headline,
    summary: summaryParts.join(" ") || "Coordinated strategic exploration is ready for executive review.",
    scenarioSummaries,
    bullets,
  };
}
