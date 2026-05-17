/**
 * D7:1:2 — Deterministic operational transition rules (no randomness).
 */

import type { OperationalSimulationState } from "./operationalStateTypes.ts";
import { defaultSeverityForState } from "./operationalStateTypes.ts";
import type { SimulationTransitionReason } from "./simulationTransitions.ts";

/** Primary escalation ladder (severity increases down the list). */
export const OPERATIONAL_ESCALATION_LADDER: readonly OperationalSimulationState[] = [
  "stable",
  "monitoring",
  "strained",
  "degraded",
  "critical",
] as const;

const LADDER_INDEX: Readonly<Record<string, number>> = Object.fromEntries(
  OPERATIONAL_ESCALATION_LADDER.map((s, i) => [s, i])
);

/** Direct allowed transitions (executive semantics). */
const ALLOWED_EDGES: Readonly<Record<OperationalSimulationState, readonly OperationalSimulationState[]>> = {
  stable: ["monitoring", "accelerated", "uncertain"],
  monitoring: ["stable", "strained", "accelerated", "uncertain"],
  strained: ["monitoring", "degraded", "blocked", "uncertain"],
  degraded: ["strained", "critical", "recovering", "blocked"],
  critical: ["degraded", "recovering"],
  recovering: ["strained", "stable", "degraded"],
  blocked: ["strained", "recovering", "degraded"],
  accelerated: ["stable", "monitoring"],
  uncertain: ["monitoring", "strained", "stable"],
};

export function isDirectTransitionAllowed(
  from: OperationalSimulationState,
  to: OperationalSimulationState
): boolean {
  if (from === to) return true;
  const allowed = ALLOWED_EDGES[from] ?? [];
  return allowed.includes(to);
}

export function ladderIndex(state: OperationalSimulationState): number {
  const idx = LADDER_INDEX[state];
  return typeof idx === "number" ? idx : -1;
}

export function ladderDistance(
  from: OperationalSimulationState,
  to: OperationalSimulationState
): number {
  const a = ladderIndex(from);
  const b = ladderIndex(to);
  if (a < 0 || b < 0) return Number.POSITIVE_INFINITY;
  return Math.abs(b - a);
}

/**
 * Max escalation steps per tick from pressure (deterministic).
 * High pressure allows +2 on ladder; default +1.
 */
export function maxEscalationStepsForPressure(pressure: number): number {
  const p = Math.min(1, Math.max(0, Number(pressure) || 0));
  if (p >= 0.85) return 2;
  if (p >= 0.55) return 1;
  return 1;
}

export function targetStateFromPressure(
  current: OperationalSimulationState,
  pressure: number
): OperationalSimulationState {
  const p = Math.min(1, Math.max(0, Number(pressure) || 0));
  const idx = ladderIndex(current);
  if (idx < 0) {
    if (p >= 0.75) return "strained";
    if (p >= 0.45) return "monitoring";
    return current;
  }
  if (p >= 0.9) return "critical";
  if (p >= 0.72) return "degraded";
  if (p >= 0.52) return "strained";
  if (p >= 0.32) return "monitoring";
  if (p <= 0.12 && (current === "recovering" || current === "monitoring")) return "stable";
  if (p <= 0.18 && current === "strained") return "monitoring";
  return current;
}

export function targetStateForRecovery(
  current: OperationalSimulationState,
  recoveryPressure: number
): OperationalSimulationState {
  const p = Math.min(1, Math.max(0, Number(recoveryPressure) || 0));
  if (p > 0.25) return current;
  if (current === "critical") return "recovering";
  if (current === "degraded") return "recovering";
  if (current === "recovering") return "stable";
  if (current === "blocked") return "strained";
  return current;
}

export function reasonForPressureDelta(
  delta: number,
  fromPropagation: boolean
): SimulationTransitionReason {
  if (delta < 0) return "recovery";
  if (fromPropagation) return "propagation";
  if (delta >= 0.35) return "risk_escalation";
  if (delta >= 0.15) return "resource_pressure";
  return "event";
}

export function clampSeverity(severity: number): number {
  if (!Number.isFinite(severity)) return 0.35;
  return Math.min(1, Math.max(0, severity));
}

export function metadataSeverityForState(state: OperationalSimulationState): number {
  return defaultSeverityForState(state);
}

export function stepTowardTargetOnLadder(
  current: OperationalSimulationState,
  target: OperationalSimulationState,
  maxSteps: number
): OperationalSimulationState {
  if (current === target) return current;
  const curIdx = ladderIndex(current);
  const tgtIdx = ladderIndex(target);
  if (curIdx < 0 || tgtIdx < 0) {
    return isDirectTransitionAllowed(current, target) ? target : current;
  }
  const steps = Math.max(1, Math.floor(maxSteps) || 1);
  if (tgtIdx > curIdx) {
    const nextIdx = Math.min(tgtIdx, curIdx + steps);
    return OPERATIONAL_ESCALATION_LADDER[nextIdx] ?? current;
  }
  const nextIdx = Math.max(tgtIdx, curIdx - steps);
  return OPERATIONAL_ESCALATION_LADDER[nextIdx] ?? current;
}
