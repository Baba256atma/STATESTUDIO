/**
 * D7:1:4 — Safe bridge to existing replay track contracts (read-only adapter).
 */

import type { NexoraSimulationSnapshot } from "../domainSimulationScenarioEngine.ts";
import type { NexoraReplayFrame, NexoraReplayTrack } from "../outcomeComparisonReplay.ts";
import type { OperationalTimeline } from "./timelineTypes.ts";
import { EXECUTIVE_TIMELINE_PHASE_LABELS } from "./timelineExecutiveSemantics.ts";

function operationalSnapshotToNexoraSnapshot(
  snapshot: OperationalTimeline["snapshots"][number]
): NexoraSimulationSnapshot {
  const objectStates =
    snapshot.objectStates &&
    typeof snapshot.objectStates === "object" &&
    !Array.isArray(snapshot.objectStates)
      ? { ...(snapshot.objectStates as NexoraSimulationSnapshot["objectStates"]) }
      : {};
  return {
    stepIndex: snapshot.timestamp.tick,
    objectStates,
    relationStates: {},
    loopStates: {},
    kpiStates: {},
  };
}

/** Map operational timeline snapshots to Nexora replay frames without mutating timeline history. */
export function buildReplayFramesFromOperationalTimeline(
  timeline: OperationalTimeline
): NexoraReplayFrame[] {
  const ordered = [...timeline.snapshots].sort((a, b) => a.timestamp.tick - b.timestamp.tick);
  return ordered.map((snapshot, index) => {
    const historyEntry = timeline.history.entries.find((e) => e.tick === snapshot.timestamp.tick);
    const phaseLabel = historyEntry
      ? EXECUTIVE_TIMELINE_PHASE_LABELS[historyEntry.executivePhase]
      : `Tick ${snapshot.timestamp.tick}`;
    return {
      index,
      label: phaseLabel,
      snapshot: operationalSnapshotToNexoraSnapshot(snapshot),
      notes: historyEntry?.causalLinkIds?.length
        ? [`Causal links: ${historyEntry.causalLinkIds.join(", ")}`]
        : [],
    };
  });
}

export function buildReplayTrackFromOperationalTimeline(
  timeline: OperationalTimeline
): NexoraReplayTrack {
  const frames = buildReplayFramesFromOperationalTimeline(timeline);
  const phases = timeline.history.entries.map((e) => e.executiveLabel).filter(Boolean);
  const summary =
    phases.length > 0
      ? `Operational timeline ${timeline.timelineId}: ${phases[phases.length - 1]} at tick ${timeline.currentTick}.`
      : `Operational timeline ${timeline.timelineId} with ${frames.length} frames.`;
  return {
    scenarioId: timeline.timelineId,
    playbackMode: "timeline",
    frames,
    summary,
    notes: ["D7:1:4 operational timeline replay adapter"],
  };
}
