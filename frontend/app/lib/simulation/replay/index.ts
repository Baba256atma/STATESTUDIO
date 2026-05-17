/**
 * D7:1:9 — Executive simulation replay + strategic memory (public surface).
 */

export type {
  SimulationReplayStatus,
  SimulationReplaySession,
  StrategicMemoryKind,
  StrategicMemoryEntry,
  DecisionReplayMarker,
  DivergenceReplayPoint,
  PropagationReplayMarker,
  TimelineReconstructionBundle,
  StrategicMemoryIndex,
  StrategicMemorySnapshot,
  ExecutiveReplayNarrative,
  ReplayOrchestrationSnapshot,
  ReplayPanelContract,
  ReplayPanelScrubPoint,
  CreateSimulationReplaySessionInput,
  ReplaySimulationTimelineInput,
  ReplaySimulationTimelineResult,
  BuildStrategicMemoryInput,
} from "./replayTypes.ts";

export type { ReplayGuardCode, ReplayGuardResult } from "./replayGuards.ts";
export {
  buildReplayContentFingerprint,
  buildReplayRequestFingerprint,
  guardSimulationReplaySession,
  guardReplaySimulationTimeline,
  guardReplayFrameAccess,
  assertReplayReadOnlyTimeline,
} from "./replayGuards.ts";

export { logReplayDev } from "./replayDevLog.ts";
export type { ReplayDevChannel } from "./replayDevLog.ts";

export {
  reconstructTimelineForReplay,
  buildDivergenceReplayPoints,
  detectOperationalTransitions,
  resolveReplayTickAtFrame,
} from "./timelineReconstruction.ts";

export { extractDecisionReplayMarkers } from "./decisionReplayTracking.ts";

export {
  buildStrategicMemorySnapshot,
  buildStrategicMemoryIndex,
  lookupMemoryByDecisionId,
  lookupMemoryByTimelineId,
} from "./strategicMemoryIndex.ts";

export { buildExecutiveReplayNarrative } from "./executiveReplayNarratives.ts";

export {
  createSimulationReplaySession,
  replaySimulationTimeline,
  advanceReplayToFrame,
  buildReplayPanelContract,
  freezeReplayOrchestrationSnapshot,
} from "./executiveReplayOrchestrationEngine.ts";
