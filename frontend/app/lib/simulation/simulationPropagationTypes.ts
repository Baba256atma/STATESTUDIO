/**
 * D7:1:3 — Simulation event propagation contracts (executive-readable).
 */

export type SimulationPropagationType =
  | "risk_escalation"
  | "resource_pressure"
  | "dependency_failure"
  | "operational_delay"
  | "confidence_drop"
  | "stabilization"
  | "recovery";

export interface SimulationPropagationEvent {
  id: string;
  propagationType: SimulationPropagationType;
  sourceObjectId: string;
  targetObjectId: string;
  intensity: number;
  depth: number;
  createdAtTick: number;
  reason?: string;
}

export interface SimulationPropagationPath {
  sourceObjectId: string;
  traversedObjectIds: string[];
  totalIntensity: number;
  depth: number;
}

export interface SimulationPropagationChain {
  chainId: string;
  rootEventId: string;
  propagationType: SimulationPropagationType;
  path: SimulationPropagationPath;
}

export interface SimulationPropagationCascadeRecord {
  tick: number;
  sourceObjectId: string;
  propagationType: SimulationPropagationType;
  affectedCount: number;
  maxDepth: number;
}

/** Replay-safe fragment stored on simulation snapshots (`propagationState`). */
export interface SimulationPropagationSnapshotState {
  activePropagations: SimulationPropagationEvent[];
  propagationChains: SimulationPropagationChain[];
  intensityMap: Record<string, number>;
  affectedObjectIds: string[];
  cascadeHistory: SimulationPropagationCascadeRecord[];
  fingerprint: string;
}

export const SIMULATION_PROPAGATION_LABELS: Readonly<Record<SimulationPropagationType, string>> = {
  risk_escalation: "Risk escalation",
  resource_pressure: "Supply pressure",
  dependency_failure: "Dependency strain",
  operational_delay: "Operational delay",
  confidence_drop: "Confidence erosion",
  stabilization: "Stabilization wave",
  recovery: "Recovery spread",
};

export type SimulationPropagationRejectionCode =
  | "max_depth_exceeded"
  | "max_nodes_exceeded"
  | "circular_dependency"
  | "duplicate_traversal"
  | "stale_tick"
  | "invalid_source"
  | "intensity_cutoff";

export interface SimulationPropagationRejection {
  code: SimulationPropagationRejectionCode;
  message: string;
  sourceObjectId?: string;
  targetObjectId?: string;
  depth?: number;
}
