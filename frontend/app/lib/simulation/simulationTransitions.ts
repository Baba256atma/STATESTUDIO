/**
 * D7:1:2 — Deterministic operational state transition contracts.
 */

import type { OperationalSimulationState } from "./operationalStateTypes.ts";

export type SimulationTransitionReason =
  | "event"
  | "propagation"
  | "resource_pressure"
  | "risk_escalation"
  | "recovery"
  | "manual";

export interface SimulationStateTransition {
  from: OperationalSimulationState;
  to: OperationalSimulationState;
  reason: SimulationTransitionReason;
  tick: number;
  confidence?: number;
  /** Optional executive note (replay / timeline). */
  note?: string;
}

export interface AppliedOperationalTransition extends SimulationStateTransition {
  objectId: string;
  transitionId: string;
}

export interface OperationalTransitionRejection {
  objectId: string;
  from: OperationalSimulationState;
  attemptedTo: OperationalSimulationState;
  reason: string;
  code:
    | "impossible_transition"
    | "escalation_path_required"
    | "duplicate_transition"
    | "stale_tick"
    | "severity_spike"
    | "transition_loop";
}
