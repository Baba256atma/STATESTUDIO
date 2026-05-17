/**
 * D7:1:1 — Simulation guard rails (no infinite loops, no invalid transitions).
 */

import type { SimulationRuntimeState } from "./simulationTypes.ts";
import type { SimulationStateSnapshot } from "./simulationStateSnapshot.ts";
import type { SimulationEvent } from "./simulationEventTypes.ts";
import { logSimulationDev } from "./simulationDevLog.ts";

export const DEFAULT_MAX_SIMULATION_TICKS = 10_000;
export const DEFAULT_MAX_QUEUED_EVENTS = 512;

export type SimulationGuardCode =
  | "max_ticks_exceeded"
  | "duplicate_event"
  | "stale_simulation"
  | "invalid_snapshot"
  | "invalid_runtime_transition"
  | "event_queue_overflow"
  | "runtime_not_running"
  | "empty_simulation_id";

export type SimulationGuardResult =
  | { ok: true }
  | { ok: false; code: SimulationGuardCode; message: string };

const ALLOWED_RUNTIME_TRANSITIONS: Readonly<
  Record<SimulationRuntimeState, readonly SimulationRuntimeState[]>
> = {
  idle: ["prepared", "failed"],
  prepared: ["running", "failed", "idle"],
  running: ["paused", "completed", "failed"],
  paused: ["running", "completed", "failed"],
  completed: ["idle"],
  failed: ["idle", "prepared"],
};

export function validateRuntimeTransition(
  from: SimulationRuntimeState,
  to: SimulationRuntimeState
): SimulationGuardResult {
  const allowed = ALLOWED_RUNTIME_TRANSITIONS[from] ?? [];
  if (!allowed.includes(to)) {
    const message = `Invalid simulation runtime transition: ${from} → ${to}`;
    logSimulationDev("SimulationGuard", { code: "invalid_runtime_transition", from, to });
    return { ok: false, code: "invalid_runtime_transition", message };
  }
  return { ok: true };
}

export function assertMaxTicks(
  tick: number,
  maxTicks: number = DEFAULT_MAX_SIMULATION_TICKS
): SimulationGuardResult {
  const safeTick = Math.max(0, Math.floor(Number(tick) || 0));
  const safeMax = Math.max(1, Math.floor(Number(maxTicks) || DEFAULT_MAX_SIMULATION_TICKS));
  if (safeTick >= safeMax) {
    const message = `Simulation tick ${safeTick} exceeds max ${safeMax}`;
    logSimulationDev("SimulationGuard", { code: "max_ticks_exceeded", tick: safeTick, maxTicks: safeMax });
    return { ok: false, code: "max_ticks_exceeded", message };
  }
  return { ok: true };
}

export function isDuplicateSimulationEvent(
  eventId: string,
  processedEventIds: ReadonlySet<string>
): boolean {
  const id = String(eventId ?? "").trim();
  if (!id) return true;
  return processedEventIds.has(id);
}

export function guardDuplicateEvent(
  event: SimulationEvent,
  processedEventIds: ReadonlySet<string>
): SimulationGuardResult {
  const id = String(event.id ?? "").trim();
  if (!id) {
    return { ok: false, code: "duplicate_event", message: "Simulation event requires a non-empty id" };
  }
  if (processedEventIds.has(id)) {
    logSimulationDev("SimulationGuard", { code: "duplicate_event", eventId: id });
    return { ok: false, code: "duplicate_event", message: `Duplicate simulation event: ${id}` };
  }
  return { ok: true };
}

export function guardStaleSimulation(
  activeSimulationId: string,
  expectedSimulationId: string
): SimulationGuardResult {
  const active = String(activeSimulationId ?? "").trim();
  const expected = String(expectedSimulationId ?? "").trim();
  if (!expected) {
    return { ok: false, code: "empty_simulation_id", message: "Expected simulation id is empty" };
  }
  if (active !== expected) {
    logSimulationDev("SimulationGuard", {
      code: "stale_simulation",
      activeSimulationId: active,
      expectedSimulationId: expected,
    });
    return {
      ok: false,
      code: "stale_simulation",
      message: `Stale simulation: active=${active || "(none)"} expected=${expected}`,
    };
  }
  return { ok: true };
}

export function validateSimulationSnapshot(
  snapshot: SimulationStateSnapshot | null | undefined
): SimulationGuardResult {
  if (!snapshot || typeof snapshot !== "object") {
    return { ok: false, code: "invalid_snapshot", message: "Snapshot is missing" };
  }
  const simulationId = String(snapshot.simulationId ?? "").trim();
  if (!simulationId) {
    return { ok: false, code: "invalid_snapshot", message: "Snapshot simulationId is empty" };
  }
  const tick = snapshot.timestamp?.tick;
  if (!Number.isFinite(Number(tick)) || Number(tick) < 0) {
    return { ok: false, code: "invalid_snapshot", message: "Snapshot tick is invalid" };
  }
  if (typeof snapshot.fingerprint !== "string" || !snapshot.fingerprint.trim()) {
    return { ok: false, code: "invalid_snapshot", message: "Snapshot fingerprint is missing" };
  }
  if (!snapshot.objectStates || typeof snapshot.objectStates !== "object" || Array.isArray(snapshot.objectStates)) {
    return { ok: false, code: "invalid_snapshot", message: "Snapshot objectStates must be a plain object" };
  }
  return { ok: true };
}

export function guardEventQueueCapacity(
  pendingCount: number,
  maxQueued: number = DEFAULT_MAX_QUEUED_EVENTS
): SimulationGuardResult {
  const count = Math.max(0, Math.floor(Number(pendingCount) || 0));
  const max = Math.max(1, Math.floor(Number(maxQueued) || DEFAULT_MAX_QUEUED_EVENTS));
  if (count > max) {
    logSimulationDev("SimulationGuard", { code: "event_queue_overflow", pendingCount: count, maxQueued: max });
    return {
      ok: false,
      code: "event_queue_overflow",
      message: `Event queue overflow: ${count} > ${max}`,
    };
  }
  return { ok: true };
}
