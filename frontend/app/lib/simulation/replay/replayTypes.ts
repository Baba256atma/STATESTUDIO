/**
 * D7:1:9 — Executive simulation replay + strategic memory contracts.
 */

import type { ScenarioBranchForestState } from "../branching/branchingTypes.ts";
import type { ScenarioComparisonSnapshot } from "../comparison/scenarioComparisonTypes.ts";
import type { DecisionSimulationOutcome } from "../decision/strategicDecisionTypes.ts";
import type { NexoraReplayTrack } from "../outcomeComparisonReplay.ts";
import type { SimulationStateSnapshot } from "../simulationStateSnapshot.ts";
import type {
  OperationalTimeline,
  TimelineCausalLink,
  TimelinePlaybackIndex,
} from "../timeline/timelineTypes.ts";
import type { WarRoomOrchestrationSnapshot, WarRoomSessionHistory } from "../warroom/warRoomTypes.ts";
import type { ReplayGuardResult } from "./replayGuards.ts";

export type SimulationReplayStatus = "prepared" | "playing" | "paused" | "completed";

export interface SimulationReplaySession {
  replayId: string;
  sourceTimelineId: string;
  createdAt: string;
  replayStatus: SimulationReplayStatus;
  title?: string;
  sourceWarRoomSessionId?: string;
}

export type StrategicMemoryKind =
  | "timeline_phase"
  | "decision"
  | "divergence"
  | "propagation"
  | "comparison"
  | "intervention"
  | "sync";

export interface StrategicMemoryEntry {
  entryId: string;
  timelineId: string;
  relatedDecisionIds?: readonly string[];
  keyEvents?: readonly string[];
  replayImportanceScore?: number;
  createdAt: string;
  kind: StrategicMemoryKind;
  tick?: number;
  summary?: string;
}

export interface DecisionReplayMarker {
  decisionId: string;
  appliedAtTick: number;
  resultingScenarioChanges?: readonly string[];
  sourceTimelineId?: string;
  projectedTimelineId?: string;
  decisionType?: string;
  rationale?: string;
}

export interface DivergenceReplayPoint {
  tick: number;
  branchId?: string;
  parentTimelineId?: string;
  changedObjectIds: readonly string[];
  operationalImpactScore?: number;
  summary?: string;
}

export interface PropagationReplayMarker {
  tick: number;
  sourceEventId: string;
  affectedObjectIds: readonly string[];
  propagationType?: string;
}

export interface TimelineReconstructionBundle {
  timelineId: string;
  orderedSnapshots: readonly SimulationStateSnapshot[];
  causalityByTick: Readonly<Record<number, readonly TimelineCausalLink[]>>;
  decisionMarkers: readonly DecisionReplayMarker[];
  divergencePoints: readonly DivergenceReplayPoint[];
  propagationMarkers: readonly PropagationReplayMarker[];
  playbackIndex: TimelinePlaybackIndex;
  replayTrack: NexoraReplayTrack;
  fingerprint: string;
}

export interface StrategicMemoryIndex {
  byTimelineId: Readonly<Record<string, readonly string[]>>;
  byReplayId: Readonly<Record<string, readonly string[]>>;
  byDecisionId: Readonly<Record<string, readonly string[]>>;
  byScenarioId: Readonly<Record<string, readonly string[]>>;
}

export interface StrategicMemorySnapshot {
  memoryId: string;
  entries: readonly StrategicMemoryEntry[];
  index: StrategicMemoryIndex;
  fingerprint: string;
}

export interface ExecutiveReplayNarrative {
  headline: string;
  summary: string;
  bullets: readonly string[];
  escalationTick?: number;
  recoveryTick?: number;
}

export interface ReplayOrchestrationSnapshot {
  session: SimulationReplaySession;
  reconstruction: TimelineReconstructionBundle;
  memory: StrategicMemorySnapshot;
  narrative: ExecutiveReplayNarrative;
  currentFrameIndex: number;
  currentTick: number;
  fingerprint: string;
}

/** Future replay UI contract (no rendering in D7:1:9). */
export interface ReplayPanelContract {
  replayId: string;
  sourceTimelineId: string;
  status: SimulationReplayStatus;
  minTick: number;
  maxTick: number;
  scrubPoints: readonly ReplayPanelScrubPoint[];
  decisionMarkers: readonly DecisionReplayMarker[];
  memoryHighlights: readonly string[];
  narrativeHeadline: string;
  viewHint: "timeline_scrub" | "decision_audit" | "divergence_map" | "memory_index";
}

export interface ReplayPanelScrubPoint {
  frameIndex: number;
  tick: number;
  label: string;
}

export interface CreateSimulationReplaySessionInput {
  replayId: string;
  sourceTimelineId: string;
  title?: string;
  sourceWarRoomSessionId?: string;
}

export interface ReplaySimulationTimelineInput {
  session: SimulationReplaySession;
  sourceTimeline: OperationalTimeline;
  warRoomHistory?: WarRoomSessionHistory;
  warRoomSnapshot?: WarRoomOrchestrationSnapshot;
  interventionOutcomes?: readonly DecisionSimulationOutcome[];
  comparisonSnapshots?: readonly ScenarioComparisonSnapshot[];
  branchForest?: ScenarioBranchForestState;
  priorReplayFingerprints?: readonly string[];
  startAtTick?: number;
}

export type ReplaySimulationTimelineResult =
  | { ok: true; snapshot: ReplayOrchestrationSnapshot; panelContract: ReplayPanelContract }
  | { ok: false; guard: ReplayGuardResult };

export interface BuildStrategicMemoryInput {
  memoryId: string;
  sourceTimeline: OperationalTimeline;
  reconstruction: TimelineReconstructionBundle;
  warRoomHistory?: WarRoomSessionHistory;
  interventionOutcomes?: readonly DecisionSimulationOutcome[];
  comparisonSnapshots?: readonly ScenarioComparisonSnapshot[];
  branchForest?: ScenarioBranchForestState;
}
