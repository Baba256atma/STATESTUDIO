/**
 * D7:1:4 — Operational timeline contracts (deterministic temporal evolution).
 */

import type { SimulationStateSnapshot } from "../simulationStateSnapshot.ts";
import type { SimulationBranchId, SimulationOperationalMetrics } from "../simulationTypes.ts";

export type OperationalTimelineStatus = "idle" | "running" | "paused" | "completed";

export interface TimelineSnapshotReference {
  tick: number;
  snapshotId: string;
  createdAt: string;
  fingerprint: string;
}

export interface TimelineCausalLink {
  linkId: string;
  sourceEventId: string;
  affectedObjectIds: string[];
  generatedTick: number;
  reason?: string;
  propagationType?: string;
}

/** Executive-readable timeline phase (no engine jargon). */
export type ExecutiveTimelinePhase =
  | "stable_operations"
  | "pressure_emergence"
  | "escalation_phase"
  | "operational_degradation"
  | "recovery_progression"
  | "stabilization_period"
  | "operational_slowdown";

export interface ExecutiveTimelinePhaseMarker {
  tick: number;
  phase: ExecutiveTimelinePhase;
  label: string;
  summary?: string;
}

export interface OperationalTimelineHistoryEntry {
  tick: number;
  snapshotId: string;
  executivePhase: ExecutiveTimelinePhase;
  executiveLabel: string;
  causalLinkIds: readonly string[];
  operationalMetrics?: SimulationOperationalMetrics;
}

export interface OperationalTimelineHistory {
  entries: readonly OperationalTimelineHistoryEntry[];
  fingerprint: string;
}

/** Playback-ready index (no UI). */
export interface TimelineScrubPoint {
  tick: number;
  snapshotId: string;
  label: string;
}

export interface TimelinePlaybackIndex {
  timelineId: string;
  branchId: SimulationBranchId;
  minTick: number;
  maxTick: number;
  scrubPoints: readonly TimelineScrubPoint[];
  /** Branch-ready anchor for future multiverse (unused in D7:1:4). */
  branchAnchorId: string;
}

export interface OperationalTimeline {
  timelineId: string;
  branchId: SimulationBranchId;
  createdAt: string;
  snapshots: readonly SimulationStateSnapshot[];
  snapshotIndex: readonly TimelineSnapshotReference[];
  currentTick: number;
  status: OperationalTimelineStatus;
  causality: readonly TimelineCausalLink[];
  history: OperationalTimelineHistory;
  playback: TimelinePlaybackIndex;
  /** Future branching parent tick (null = root timeline). */
  parentTimelineId?: string | null;
  forkTick?: number | null;
}
