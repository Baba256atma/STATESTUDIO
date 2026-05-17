/**
 * D7:1:1 — Deterministic simulation runtime shell (explicit cycles only; no auto-run).
 */

import { advanceSimulationTick, createSimulationTimestamp } from "./simulationClock.ts";
import { logSimulationDev } from "./simulationDevLog.ts";
import type { SimulationEvent, SimulationEventPayloadStateChange } from "./simulationEventTypes.ts";
import {
  assertMaxTicks,
  DEFAULT_MAX_QUEUED_EVENTS,
  DEFAULT_MAX_SIMULATION_TICKS,
  guardDuplicateEvent,
  guardEventQueueCapacity,
  guardStaleSimulation,
  validateRuntimeTransition,
  validateSimulationSnapshot,
  type SimulationGuardResult,
} from "./simulationGuards.ts";
import {
  cloneObjectStates,
  createSimulationStateSnapshot,
  type SimulationStateSnapshot,
} from "./simulationStateSnapshot.ts";
import type {
  SimulationBranchId,
  SimulationOperationalMetrics,
  SimulationRuntimeConfig,
  SimulationRuntimeState,
} from "./simulationTypes.ts";

export interface SimulationRuntime {
  readonly config: SimulationRuntimeConfig;
  readonly branchId: SimulationBranchId;
  readonly runtimeState: SimulationRuntimeState;
  readonly currentTick: number;
  readonly snapshots: readonly SimulationStateSnapshot[];
  readonly pendingEvents: readonly SimulationEvent[];
  readonly processedEventIds: ReadonlySet<string>;
  readonly objectStates: Record<string, unknown>;
  readonly propagationState: unknown;
  readonly operationalMetrics: SimulationOperationalMetrics;
}

export type SimulationCycleResult =
  | { ok: true; runtime: SimulationRuntime; snapshot: SimulationStateSnapshot }
  | { ok: false; guard: SimulationGuardResult };

function resolveMaxTicks(config: SimulationRuntimeConfig): number {
  return Math.max(1, Math.floor(Number(config.maxTicks ?? DEFAULT_MAX_SIMULATION_TICKS)));
}

function resolveMaxQueued(config: SimulationRuntimeConfig): number {
  return Math.max(1, Math.floor(Number(config.maxQueuedEvents ?? DEFAULT_MAX_QUEUED_EVENTS)));
}

function sortEventsDeterministic(events: readonly SimulationEvent[]): SimulationEvent[] {
  return [...events].sort((a, b) => {
    const idCmp = String(a.id).localeCompare(String(b.id));
    if (idCmp !== 0) return idCmp;
    return String(a.createdAt).localeCompare(String(b.createdAt));
  });
}

function applyStateChangeEvent(
  objectStates: Record<string, unknown>,
  event: SimulationEvent
): Record<string, unknown> {
  const payload = event.payload as SimulationEventPayloadStateChange | undefined;
  const objectId = String(payload?.objectId ?? event.sourceObjectId ?? "").trim();
  if (!objectId) return objectStates;
  const patch =
    payload?.patch && typeof payload.patch === "object" && !Array.isArray(payload.patch)
      ? payload.patch
      : {};
  const prev =
    objectStates[objectId] && typeof objectStates[objectId] === "object" && !Array.isArray(objectStates[objectId])
      ? (objectStates[objectId] as Record<string, unknown>)
      : {};
  return {
    ...objectStates,
    [objectId]: { ...prev, ...patch },
  };
}

function applyOperationalEventMetrics(
  metrics: SimulationOperationalMetrics,
  event: SimulationEvent
): SimulationOperationalMetrics {
  switch (event.type) {
    case "risk_increase": {
      const payload = event.payload as { delta?: number } | undefined;
      const delta = Number(payload?.delta ?? 0.05);
      const next = Math.min(1, (metrics.fragility ?? 0.2) + (Number.isFinite(delta) ? delta : 0.05));
      return { ...metrics, fragility: next };
    }
    case "resource_shift": {
      const payload = event.payload as { loadDelta?: number } | undefined;
      const delta = Number(payload?.loadDelta ?? 0.03);
      const next = Math.min(1, (metrics.operationalLoad ?? 0.3) + (Number.isFinite(delta) ? delta : 0.03));
      return { ...metrics, operationalLoad: next };
    }
    case "operational_alert":
      return { ...metrics, confidence: Math.max(0, (metrics.confidence ?? 0.7) - 0.02) };
    default:
      return metrics;
  }
}

function processEventsForTick(
  runtime: SimulationRuntime,
  events: readonly SimulationEvent[]
): {
  objectStates: Record<string, unknown>;
  operationalMetrics: SimulationOperationalMetrics;
  processedIds: string[];
  acceptedEvents: SimulationEvent[];
} {
  let objectStates = cloneObjectStates(runtime.objectStates);
  let operationalMetrics = { ...runtime.operationalMetrics };
  const processedIds: string[] = [];
  const acceptedEvents: SimulationEvent[] = [];
  const ordered = sortEventsDeterministic(events);

  for (const event of ordered) {
    const dup = guardDuplicateEvent(event, runtime.processedEventIds);
    if (!dup.ok) continue;
    const pendingDup = acceptedEvents.some((e) => e.id === event.id);
    if (pendingDup) continue;

    switch (event.type) {
      case "state_change":
        objectStates = applyStateChangeEvent(objectStates, event);
        break;
      case "risk_increase":
      case "resource_shift":
      case "operational_alert":
        operationalMetrics = applyOperationalEventMetrics(operationalMetrics, event);
        break;
      case "timeline_branch":
        break;
      default:
        break;
    }
    processedIds.push(event.id);
    acceptedEvents.push(event);
  }

  return { objectStates, operationalMetrics, processedIds, acceptedEvents };
}

function withRuntimeState(
  runtime: SimulationRuntime,
  patch: Partial<{
    runtimeState: SimulationRuntimeState;
    currentTick: number;
    snapshots: readonly SimulationStateSnapshot[];
    pendingEvents: readonly SimulationEvent[];
    processedEventIds: ReadonlySet<string>;
    objectStates: Record<string, unknown>;
    propagationState: unknown;
    operationalMetrics: SimulationOperationalMetrics;
  }>
): SimulationRuntime {
  return {
    config: runtime.config,
    branchId: runtime.branchId,
    runtimeState: patch.runtimeState ?? runtime.runtimeState,
    currentTick: patch.currentTick ?? runtime.currentTick,
    snapshots: patch.snapshots ?? runtime.snapshots,
    pendingEvents: patch.pendingEvents ?? runtime.pendingEvents,
    processedEventIds: patch.processedEventIds ?? runtime.processedEventIds,
    objectStates: patch.objectStates ?? runtime.objectStates,
    propagationState: patch.propagationState ?? runtime.propagationState,
    operationalMetrics: patch.operationalMetrics ?? runtime.operationalMetrics,
  };
}

export function createSimulationRuntime(config: SimulationRuntimeConfig): SimulationRuntime {
  const simulationId = String(config.simulationId ?? "").trim() || `sim-${Date.now()}`;
  const normalizedConfig: SimulationRuntimeConfig = { ...config, simulationId };
  const branchId: SimulationBranchId = config.branchId ?? "main";
  const timestamp = createSimulationTimestamp(0, { epochSimulatedAt: config.epochSimulatedAt });
  const initialSnapshot = createSimulationStateSnapshot({
    simulationId,
    branchId,
    timestamp,
    objectStates: {},
    operationalMetrics: { fragility: 0.2, confidence: 0.75, operationalLoad: 0.3 },
  });
  const snapValid = validateSimulationSnapshot(initialSnapshot);
  if (!snapValid.ok) {
    logSimulationDev("SimulationGuard", { phase: "create", ...snapValid });
  }
  logSimulationDev("Simulation", {
    phase: "created",
    simulationId,
    branchId,
  });
  return {
    config: normalizedConfig,
    branchId,
    runtimeState: "idle",
    currentTick: 0,
    snapshots: [initialSnapshot],
    pendingEvents: [],
    processedEventIds: new Set(),
    objectStates: {},
    propagationState: null,
    operationalMetrics: { fragility: 0.2, confidence: 0.75, operationalLoad: 0.3 },
  };
}

export function prepareSimulationRuntime(runtime: SimulationRuntime): SimulationCycleResult {
  const transition = validateRuntimeTransition(runtime.runtimeState, "prepared");
  if (!transition.ok) return { ok: false, guard: transition };
  const stale = guardStaleSimulation(runtime.config.simulationId, runtime.config.simulationId);
  if (!stale.ok) return { ok: false, guard: stale };
  logSimulationDev("Simulation", { phase: "prepared", simulationId: runtime.config.simulationId });
  return {
    ok: true,
    runtime: withRuntimeState(runtime, { runtimeState: "prepared" }),
    snapshot: runtime.snapshots[runtime.snapshots.length - 1]!,
  };
}

export function startSimulationRuntime(runtime: SimulationRuntime): SimulationCycleResult {
  const transition = validateRuntimeTransition(runtime.runtimeState, "running");
  if (!transition.ok) return { ok: false, guard: transition };
  logSimulationDev("Simulation", { phase: "running", simulationId: runtime.config.simulationId });
  return {
    ok: true,
    runtime: withRuntimeState(runtime, { runtimeState: "running" }),
    snapshot: runtime.snapshots[runtime.snapshots.length - 1]!,
  };
}

export function pauseSimulationRuntime(runtime: SimulationRuntime): SimulationCycleResult {
  const transition = validateRuntimeTransition(runtime.runtimeState, "paused");
  if (!transition.ok) return { ok: false, guard: transition };
  return {
    ok: true,
    runtime: withRuntimeState(runtime, { runtimeState: "paused" }),
    snapshot: runtime.snapshots[runtime.snapshots.length - 1]!,
  };
}

export function completeSimulationRuntime(runtime: SimulationRuntime): SimulationCycleResult {
  const transition = validateRuntimeTransition(runtime.runtimeState, "completed");
  if (!transition.ok) return { ok: false, guard: transition };
  return {
    ok: true,
    runtime: withRuntimeState(runtime, { runtimeState: "completed" }),
    snapshot: runtime.snapshots[runtime.snapshots.length - 1]!,
  };
}

export function failSimulationRuntime(
  runtime: SimulationRuntime,
  reason?: string
): SimulationCycleResult {
  const transition = validateRuntimeTransition(runtime.runtimeState, "failed");
  if (!transition.ok) return { ok: false, guard: transition };
  logSimulationDev("SimulationGuard", {
    phase: "failed",
    simulationId: runtime.config.simulationId,
    reason: reason ?? "unspecified",
  });
  return {
    ok: true,
    runtime: withRuntimeState(runtime, { runtimeState: "failed" }),
    snapshot: runtime.snapshots[runtime.snapshots.length - 1]!,
  };
}

export function enqueueSimulationEvent(
  runtime: SimulationRuntime,
  event: SimulationEvent
): SimulationCycleResult {
  const stale = guardStaleSimulation(runtime.config.simulationId, runtime.config.simulationId);
  if (!stale.ok) return { ok: false, guard: stale };
  const dup = guardDuplicateEvent(event, runtime.processedEventIds);
  if (!dup.ok) return { ok: false, guard: dup };
  const queueGuard = guardEventQueueCapacity(
    runtime.pendingEvents.length + 1,
    resolveMaxQueued(runtime.config)
  );
  if (!queueGuard.ok) return { ok: false, guard: queueGuard };
  const pending = [...runtime.pendingEvents, event];
  logSimulationDev("Simulation", {
    phase: "enqueue",
    eventId: event.id,
    type: event.type,
    queueSize: pending.length,
  });
  return {
    ok: true,
    runtime: withRuntimeState(runtime, { pendingEvents: pending }),
    snapshot: runtime.snapshots[runtime.snapshots.length - 1]!,
  };
}

/**
 * Single deterministic simulation cycle: process queued events, advance tick, append snapshot.
 * Caller must invoke explicitly — never scheduled automatically.
 */
export function advanceSimulationCycle(runtime: SimulationRuntime): SimulationCycleResult {
  if (runtime.runtimeState !== "running") {
    return {
      ok: false,
      guard: {
        ok: false,
        code: "runtime_not_running",
        message: `Cannot advance cycle while runtime is ${runtime.runtimeState}`,
      },
    };
  }

  const nextTick = advanceSimulationTick(runtime.currentTick);
  const maxGuard = assertMaxTicks(nextTick, resolveMaxTicks(runtime.config));
  if (!maxGuard.ok) return { ok: false, guard: maxGuard };

  const {
    objectStates,
    operationalMetrics,
    processedIds,
    acceptedEvents,
  } = processEventsForTick(runtime, runtime.pendingEvents);

  const processedEventIds = new Set(runtime.processedEventIds);
  for (const id of processedIds) processedEventIds.add(id);

  const remainingPending = runtime.pendingEvents.filter(
    (e) => !acceptedEvents.some((a) => a.id === e.id)
  );

  const timestamp = createSimulationTimestamp(nextTick, {
    epochSimulatedAt: runtime.config.epochSimulatedAt,
  });

  const snapshot = createSimulationStateSnapshot({
    simulationId: runtime.config.simulationId,
    branchId: runtime.branchId,
    timestamp,
    objectStates,
    propagationState: runtime.propagationState,
    operationalMetrics,
  });

  const snapGuard = validateSimulationSnapshot(snapshot);
  if (!snapGuard.ok) return { ok: false, guard: snapGuard };

  logSimulationDev("SimulationTick", {
    simulationId: runtime.config.simulationId,
    tick: nextTick,
    processedEvents: acceptedEvents.length,
    pendingRemaining: remainingPending.length,
  });
  logSimulationDev("SimulationSnapshot", {
    simulationId: runtime.config.simulationId,
    tick: nextTick,
    fingerprint: snapshot.fingerprint,
    objectCount: Object.keys(snapshot.objectStates).length,
  });

  const nextRuntime = withRuntimeState(runtime, {
    currentTick: nextTick,
    snapshots: [...runtime.snapshots, snapshot],
    pendingEvents: remainingPending,
    processedEventIds,
    objectStates,
    operationalMetrics,
  });

  return { ok: true, runtime: nextRuntime, snapshot };
}

/** Replay reconstruction order: snapshots sorted by tick (deterministic). */
export function buildSimulationReplayTimeline(
  runtime: SimulationRuntime
): readonly SimulationStateSnapshot[] {
  return [...runtime.snapshots].sort((a, b) => a.timestamp.tick - b.timestamp.tick);
}
