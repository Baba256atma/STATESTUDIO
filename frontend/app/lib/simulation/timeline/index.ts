/**
 * D7:1:4 — Operational timeline evolution (public surface).
 */

export type {
  OperationalTimelineStatus,
  TimelineSnapshotReference,
  TimelineCausalLink,
  ExecutiveTimelinePhase,
  ExecutiveTimelinePhaseMarker,
  OperationalTimelineHistoryEntry,
  OperationalTimelineHistory,
  TimelineScrubPoint,
  TimelinePlaybackIndex,
  OperationalTimeline,
} from "./timelineTypes.ts";

export {
  EXECUTIVE_TIMELINE_PHASE_LABELS,
  resolveExecutiveTimelinePhase,
} from "./timelineExecutiveSemantics.ts";

export {
  buildTimelineSnapshotId,
  buildTimelineSnapshotReference,
  indexSnapshotsForTimeline,
  findSnapshotReferenceAtTick,
  freezeSimulationSnapshot,
} from "./timelineSnapshotIndex.ts";

export type { TimelineGuardCode, TimelineGuardResult } from "./timelineGuards.ts";
export {
  guardTimelineTickProgression,
  guardSnapshotTickAlignment,
  guardSnapshotOrder,
  guardCausalLinksForTick,
  guardStaleTimelineMutation,
  validateOperationalTimeline,
} from "./timelineGuards.ts";

export {
  buildTimelineHistoryFingerprint,
  appendTimelineHistoryEntry,
  createEmptyTimelineHistory,
} from "./timelineHistory.ts";

export { buildTimelinePlaybackIndex, resolvePlaybackTickAtIndex } from "./timelinePlayback.ts";

export {
  buildReplayFramesFromOperationalTimeline,
  buildReplayTrackFromOperationalTimeline,
} from "./timelineReplayBridge.ts";

export type {
  CreateOperationalTimelineInput,
  AdvanceOperationalTimelineInput,
  TimelineAdvanceResult,
} from "./operationalTimelineEvolutionEngine.ts";

export {
  buildCausalLinksFromTurn,
  buildTimelineSnapshotFromLayers,
  createOperationalTimeline,
  advanceOperationalTimeline,
  setOperationalTimelineStatus,
  operationalTimelineFingerprint,
  getReplayOrderedTimelineSnapshots,
  getSnapshotAtTimelineTick,
} from "./operationalTimelineEvolutionEngine.ts";
