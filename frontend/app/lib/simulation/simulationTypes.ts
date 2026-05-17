/**
 * D7:1:1 — Nexora Reality Simulation Core — canonical runtime contracts.
 * Operational reality graph substrate; not scene rendering or physics.
 */

/** Explicit lifecycle for the simulation runtime shell (no auto-run). */
export type SimulationRuntimeState =
  | "idle"
  | "prepared"
  | "running"
  | "paused"
  | "completed"
  | "failed";

export interface SimulationTimestamp {
  tick: number;
  /** ISO-8601 simulated instant for replay / timeline inspection. */
  simulatedAt: string;
}

/** Branch anchor for future timeline branching (D7+); default `"main"`. */
export type SimulationBranchId = string;

export interface SimulationOperationalMetrics {
  fragility?: number;
  confidence?: number;
  operationalLoad?: number;
}

/** Runtime configuration — bounds and identity only; no UI or scene coupling. */
export interface SimulationRuntimeConfig {
  simulationId: string;
  branchId?: SimulationBranchId;
  maxTicks?: number;
  maxQueuedEvents?: number;
  /** ISO anchor for deterministic `simulatedAt` progression when not supplied per tick. */
  epochSimulatedAt?: string;
}

export interface SimulationRuntimeMeta {
  simulationId: string;
  branchId: SimulationBranchId;
  runtimeState: SimulationRuntimeState;
  currentTick: number;
  snapshotCount: number;
  pendingEventCount: number;
  processedEventCount: number;
}
