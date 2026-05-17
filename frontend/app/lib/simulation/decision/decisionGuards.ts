/**
 * D7:1:7 — Strategic decision simulation guard rails.
 */

import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type { SimulationStateSnapshot } from "../simulationStateSnapshot.ts";
import type { StrategicDecisionInput, StrategicDecisionType } from "./strategicDecisionTypes.ts";
import { logDecisionDev } from "./decisionDevLog.ts";

export type DecisionGuardCode =
  | "empty_decision_id"
  | "invalid_decision_type"
  | "missing_targets"
  | "invalid_intensity"
  | "corrupted_timeline"
  | "snapshot_tick_mismatch"
  | "insufficient_resources"
  | "duplicate_simulation"
  | "recursive_decision_loop"
  | "impossible_operational_action"
  | "stale_timeline";

const TYPES_REQUIRING_TARGETS: StrategicDecisionType[] = [
  "resource_reallocation",
  "risk_mitigation",
  "expansion",
  "stabilization",
  "capacity_increase",
];

const TYPES_REQUIRING_RESOURCES: StrategicDecisionType[] = ["capacity_increase", "expansion"];

export type DecisionGuardResult =
  | { ok: true; appliedAtTick: number; normalizedIntensity: number }
  | { ok: false; code: DecisionGuardCode; message: string };

function reject(code: DecisionGuardCode, message: string): DecisionGuardResult {
  const result = { ok: false as const, code, message };
  logDecisionDev("DecisionGuard", { code, message });
  return result;
}

export function normalizeDecisionIntensity(intensity?: number): number {
  const n = Number(intensity ?? 0.5);
  if (!Number.isFinite(n)) return 0.5;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function guardStrategicDecisionSimulation(input: {
  decision: StrategicDecisionInput;
  activeTimeline: OperationalTimeline;
  currentSnapshot?: SimulationStateSnapshot;
  resourceAvailability?: Readonly<Record<string, number>>;
  priorSimulationFingerprints?: readonly string[];
  pendingFingerprint?: string;
  decisionChain?: readonly string[];
}): DecisionGuardResult {
  const decisionId = String(input.decision.decisionId ?? "").trim();
  if (!decisionId) return reject("empty_decision_id", "Decision id is required");

  const validTypes: StrategicDecisionType[] = [
    "resource_reallocation",
    "risk_mitigation",
    "cost_reduction",
    "expansion",
    "stabilization",
    "operational_pause",
    "capacity_increase",
  ];
  if (!validTypes.includes(input.decision.type)) {
    return reject("invalid_decision_type", `Unknown decision type: ${input.decision.type}`);
  }

  const targets = (input.decision.targetObjectIds ?? [])
    .map((id) => String(id ?? "").trim())
    .filter(Boolean);
  if (TYPES_REQUIRING_TARGETS.includes(input.decision.type) && targets.length === 0) {
    return reject("missing_targets", `${input.decision.type} requires at least one target object`);
  }

  const intensity = normalizeDecisionIntensity(input.decision.intensity);
  if (input.decision.intensity != null && (intensity < 0 || intensity > 1)) {
    return reject("invalid_intensity", "Decision intensity must be between 0 and 1");
  }

  if (!input.activeTimeline?.timelineId || !Array.isArray(input.activeTimeline.snapshots)) {
    return reject("corrupted_timeline", "Active timeline is missing or corrupted");
  }

  if (input.activeTimeline.status === "completed") {
    return reject("stale_timeline", "Cannot simulate decisions on a completed timeline");
  }

  const appliedAtTick = input.activeTimeline.currentTick;
  if (input.currentSnapshot && input.currentSnapshot.timestamp.tick !== appliedAtTick) {
    return reject(
      "snapshot_tick_mismatch",
      `Snapshot tick ${input.currentSnapshot.timestamp.tick} does not match timeline tick ${appliedAtTick}`
    );
  }

  if ((input.decisionChain ?? []).includes(decisionId)) {
    return reject("recursive_decision_loop", `Decision ${decisionId} already appears in simulation chain`);
  }

  if (input.decision.type === "operational_pause" && intensity > 0.95 && targets.length === 0) {
    return reject("impossible_operational_action", "Global operational pause requires explicit scope or lower intensity");
  }

  if (
    input.resourceAvailability != null &&
    TYPES_REQUIRING_RESOURCES.includes(input.decision.type)
  ) {
    const availability = input.resourceAvailability;
    const required = input.decision.type === "capacity_increase" ? 0.35 : 0.25;
    const hasCapacity = targets.some((id) => Number(availability[id] ?? 0) >= required);
    if (targets.length > 0 && !hasCapacity) {
      return reject(
        "insufficient_resources",
        `${input.decision.type} requires resource availability ≥ ${required} on at least one target`
      );
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (
    pending &&
    (input.priorSimulationFingerprints ?? []).some((fp) => String(fp).trim() === pending)
  ) {
    return reject("duplicate_simulation", "Identical decision simulation was already executed");
  }

  return { ok: true, appliedAtTick, normalizedIntensity: intensity };
}
