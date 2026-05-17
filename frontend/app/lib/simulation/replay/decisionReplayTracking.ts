/**
 * D7:1:9 — Decision replay markers (causality + war-room + outcomes).
 */

import type { DecisionSimulationOutcome } from "../decision/strategicDecisionTypes.ts";
import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type { WarRoomInterventionHistoryEntry, WarRoomSessionHistory } from "../warroom/warRoomTypes.ts";
import type { DecisionReplayMarker } from "./replayTypes.ts";

function markersFromWarRoomHistory(
  history: WarRoomSessionHistory | undefined
): DecisionReplayMarker[] {
  if (!history) return [];
  return history.interventionSequence.map((entry: WarRoomInterventionHistoryEntry) =>
    Object.freeze({
      decisionId: entry.decisionId,
      appliedAtTick: entry.stepIndex,
      sourceTimelineId: entry.sourceTimelineId,
      projectedTimelineId: entry.projectedTimelineId,
      resultingScenarioChanges: Object.freeze([entry.targetScenarioId]),
    })
  );
}

function markersFromOutcomes(
  outcomes: readonly DecisionSimulationOutcome[] | undefined
): DecisionReplayMarker[] {
  if (!outcomes?.length) return [];
  return outcomes.map((o) =>
    Object.freeze({
      decisionId: o.decisionId,
      appliedAtTick: o.consequenceSnapshot.appliedAtTick,
      sourceTimelineId: o.sourceTimelineId,
      projectedTimelineId: o.projectedTimeline.timelineId,
      decisionType: undefined,
      rationale: o.consequenceSnapshot.narrative.summary,
      resultingScenarioChanges: Object.freeze(
        o.consequenceSnapshot.effects.flatMap((e) => [...e.affectedObjectIds])
      ),
    })
  );
}

function markersFromTimelineCausality(timeline: OperationalTimeline): DecisionReplayMarker[] {
  const markers: DecisionReplayMarker[] = [];
  for (const link of timeline.causality) {
    if (!link.sourceEventId.includes("decision_evt::")) continue;
    const decisionId = link.sourceEventId.replace("decision_evt::", "");
    markers.push(
      Object.freeze({
        decisionId,
        appliedAtTick: Math.floor(Number(link.generatedTick) || 0),
        resultingScenarioChanges: Object.freeze([...link.affectedObjectIds].sort()),
      })
    );
  }
  return markers;
}

export function extractDecisionReplayMarkers(input: {
  timeline: OperationalTimeline;
  warRoomHistory?: WarRoomSessionHistory;
  interventionOutcomes?: readonly DecisionSimulationOutcome[];
  warRoomInterventionFingerprints?: readonly string[];
}): readonly DecisionReplayMarker[] {
  const merged = new Map<string, DecisionReplayMarker>();

  for (const m of markersFromTimelineCausality(input.timeline)) {
    merged.set(m.decisionId, m);
  }
  for (const m of markersFromWarRoomHistory(input.warRoomHistory)) {
    merged.set(m.decisionId, { ...merged.get(m.decisionId), ...m });
  }
  for (const m of markersFromOutcomes(input.interventionOutcomes)) {
    const prev = merged.get(m.decisionId);
    merged.set(m.decisionId, prev ? { ...prev, ...m } : m);
  }

  return Object.freeze(
    [...merged.values()].sort(
      (a, b) => a.appliedAtTick - b.appliedAtTick || a.decisionId.localeCompare(b.decisionId)
    )
  );
}
