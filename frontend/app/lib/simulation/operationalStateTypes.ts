/**
 * D7:1:2 — Canonical operational simulation states (executive-readable).
 */

import type { SimulationStateTransition } from "./simulationTransitions.ts";

/** Executive-oriented operational conditions — no engine jargon. */
export type OperationalSimulationState =
  | "stable"
  | "monitoring"
  | "strained"
  | "degraded"
  | "critical"
  | "recovering"
  | "blocked"
  | "accelerated"
  | "uncertain";

export interface OperationalStateMetadata {
  severity: number;
  confidence?: number;
  operationalLoad?: number;
  volatility?: number;
  /** Accumulated instability (0–1) for deterministic escalation. */
  instabilityAccumulator?: number;
}

export interface SimulatedObjectState {
  objectId: string;
  operationalState: OperationalSimulationState;
  metadata: OperationalStateMetadata;
  lastUpdatedTick: number;
  transitionHistory: SimulationStateTransition[];
}

export const OPERATIONAL_STATE_LABELS: Readonly<Record<OperationalSimulationState, string>> = {
  stable: "Stable",
  monitoring: "Monitoring",
  strained: "Strained",
  degraded: "Degraded",
  critical: "Critical",
  recovering: "Recovering",
  blocked: "Blocked",
  accelerated: "Accelerated",
  uncertain: "Uncertain",
};

export function createDefaultOperationalMetadata(
  state: OperationalSimulationState
): OperationalStateMetadata {
  const base = defaultSeverityForState(state);
  return {
    severity: base,
    confidence: 0.75,
    operationalLoad: state === "accelerated" ? 0.55 : 0.35,
    volatility: state === "uncertain" ? 0.45 : 0.2,
    instabilityAccumulator: 0,
  };
}

export function defaultSeverityForState(state: OperationalSimulationState): number {
  switch (state) {
    case "stable":
      return 0.1;
    case "monitoring":
      return 0.25;
    case "accelerated":
      return 0.3;
    case "strained":
      return 0.45;
    case "uncertain":
      return 0.5;
    case "recovering":
      return 0.4;
    case "degraded":
      return 0.65;
    case "blocked":
      return 0.7;
    case "critical":
      return 0.9;
    default:
      return 0.35;
  }
}

export function createInitialSimulatedObjectState(
  objectId: string,
  tick = 0,
  initial: OperationalSimulationState = "stable"
): SimulatedObjectState {
  return {
    objectId,
    operationalState: initial,
    metadata: createDefaultOperationalMetadata(initial),
    lastUpdatedTick: tick,
    transitionHistory: [],
  };
}
