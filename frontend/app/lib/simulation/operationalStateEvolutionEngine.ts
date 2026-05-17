/**
 * D7:1:2 — Operational State Evolution Engine (immutable, deterministic).
 */

import type { SimulationEvent } from "./simulationEventTypes.ts";
import type { SimulationOperationalMetrics } from "./simulationTypes.ts";
import { logOperationalEvolutionDev } from "./operationalStateEvolutionDevLog.ts";
import {
  capTransitionHistory,
  validateOperationalTransition,
} from "./operationalStateEvolutionGuards.ts";
import {
  clampSeverity,
  maxEscalationStepsForPressure,
  metadataSeverityForState,
  reasonForPressureDelta,
  stepTowardTargetOnLadder,
  targetStateForRecovery,
  targetStateFromPressure,
} from "./operationalStateTransitionRules.ts";
import type {
  OperationalSimulationState,
  SimulatedObjectState,
} from "./operationalStateTypes.ts";
import {
  createDefaultOperationalMetadata,
  createInitialSimulatedObjectState,
} from "./operationalStateTypes.ts";
import type { PropagationEvolutionSignal } from "./propagationEvolutionSignals.ts";
import { mergePropagationPressureByObject } from "./propagationEvolutionSignals.ts";
import type {
  AppliedOperationalTransition,
  OperationalTransitionRejection,
  SimulationStateTransition,
} from "./simulationTransitions.ts";

export interface OperationalEvolutionInput {
  currentStates: Readonly<Record<string, SimulatedObjectState>>;
  simulationEvents: readonly SimulationEvent[];
  propagationEffects?: readonly PropagationEvolutionSignal[];
  tick: number;
  operationalMetrics?: SimulationOperationalMetrics;
}

export interface OperationalEvolutionResult {
  nextStates: Readonly<Record<string, SimulatedObjectState>>;
  transitionsApplied: readonly AppliedOperationalTransition[];
  rejections: readonly OperationalTransitionRejection[];
}

function sortEvents(events: readonly SimulationEvent[]): SimulationEvent[] {
  return [...events].sort((a, b) => {
    const c = String(a.id).localeCompare(String(b.id));
    if (c !== 0) return c;
    return String(a.createdAt).localeCompare(String(b.createdAt));
  });
}

function collectObjectIds(
  states: Readonly<Record<string, SimulatedObjectState>>,
  events: readonly SimulationEvent[],
  propagation: Readonly<Record<string, number>>
): string[] {
  const ids = new Set<string>(Object.keys(states));
  for (const e of events) {
    if (e.sourceObjectId) ids.add(String(e.sourceObjectId).trim());
    for (const t of e.targetObjectIds ?? []) {
      const id = String(t ?? "").trim();
      if (id) ids.add(id);
    }
    const payload = e.payload as { objectId?: string } | undefined;
    if (payload?.objectId) ids.add(String(payload.objectId).trim());
  }
  for (const id of Object.keys(propagation)) ids.add(id);
  return [...ids].sort();
}

function eventPressureByObject(events: readonly SimulationEvent[]): Record<string, number> {
  const pressure: Record<string, number> = {};
  const add = (objectId: string, delta: number) => {
    const id = String(objectId ?? "").trim();
    if (!id) return;
    pressure[id] = Math.min(1, (pressure[id] ?? 0) + delta);
  };

  for (const event of sortEvents(events)) {
    switch (event.type) {
      case "risk_increase": {
        const payload = event.payload as { delta?: number } | undefined;
        const delta = Number(payload?.delta ?? 0.12);
        const targets =
          (event.targetObjectIds?.length ?? 0) > 0
            ? event.targetObjectIds!
            : event.sourceObjectId
              ? [event.sourceObjectId]
              : [];
        for (const id of targets) add(id, Number.isFinite(delta) ? delta : 0.12);
        break;
      }
      case "resource_shift": {
        const payload = event.payload as { loadDelta?: number } | undefined;
        const delta = Number(payload?.loadDelta ?? 0.1);
        for (const id of event.targetObjectIds ?? []) add(id, delta);
        if (event.sourceObjectId) add(event.sourceObjectId, delta * 0.5);
        break;
      }
      case "state_change": {
        const payload = event.payload as {
          objectId?: string;
          patch?: Record<string, unknown>;
        } | undefined;
        const objectId = String(payload?.objectId ?? event.sourceObjectId ?? "").trim();
        if (!objectId) break;
        const patch = payload?.patch ?? {};
        const explicit = patch.operationalState as OperationalSimulationState | undefined;
        if (explicit) {
          pressure[objectId] = metadataSeverityForState(explicit);
        } else {
          const patchPressure = Number(patch.pressure ?? patch.risk ?? 0);
          if (Number.isFinite(patchPressure) && patchPressure > 0) {
            add(objectId, Math.min(0.4, patchPressure));
          }
        }
        break;
      }
      case "operational_alert": {
        for (const id of event.targetObjectIds ?? []) add(id, 0.08);
        if (event.sourceObjectId) add(event.sourceObjectId, 0.06);
        break;
      }
      default:
        break;
    }
  }
  return pressure;
}

function applyTransitionImmutable(
  state: SimulatedObjectState,
  to: OperationalSimulationState,
  transition: SimulationStateTransition
): SimulatedObjectState {
  const metadata = {
    ...state.metadata,
    severity: clampSeverity(metadataSeverityForState(to)),
    instabilityAccumulator: Math.min(
      1,
      (state.metadata.instabilityAccumulator ?? 0) +
        (metadataSeverityForState(to) - (state.metadata.severity ?? 0.2)) * 0.5
    ),
  };
  return {
    objectId: state.objectId,
    operationalState: to,
    metadata,
    lastUpdatedTick: transition.tick,
    transitionHistory: capTransitionHistory([...state.transitionHistory, transition]),
  };
}

function buildTransitionId(objectId: string, tick: number, from: string, to: string): string {
  return `op-${objectId}-${tick}-${from}-${to}`;
}

function evolveSingleObject(input: {
  state: SimulatedObjectState;
  tick: number;
  combinedPressure: number;
  fromPropagation: boolean;
  globalLoad: number;
}): {
  next: SimulatedObjectState;
  applied: AppliedOperationalTransition | null;
  rejection: OperationalTransitionRejection | null;
} {
  const { state, tick, combinedPressure, fromPropagation, globalLoad } = input;
  const pressure = Math.min(1, combinedPressure + globalLoad * 0.15);
  const recoveryTarget = targetStateForRecovery(state.operationalState, pressure);
  const pressureTarget = targetStateFromPressure(state.operationalState, pressure);

  const recoveryEligible = new Set<OperationalSimulationState>([
    "critical",
    "degraded",
    "recovering",
    "blocked",
  ]);
  let desired: OperationalSimulationState = pressureTarget;
  if (
    recoveryEligible.has(state.operationalState) &&
    metadataSeverityForState(recoveryTarget) < metadataSeverityForState(pressureTarget)
  ) {
    desired = recoveryTarget;
  }

  const maxSteps = maxEscalationStepsForPressure(pressure);
  let candidate = stepTowardTargetOnLadder(state.operationalState, desired, maxSteps);

  if (pressure >= 0.8 && candidate === "strained" && state.operationalState === "stable") {
    candidate = "monitoring";
  }
  if (pressure >= 0.92 && (candidate === "degraded" || candidate === "strained")) {
    candidate = stepTowardTargetOnLadder(candidate, "critical", 1);
  }
  if (fromPropagation && pressure >= 0.6 && candidate === state.operationalState) {
    candidate = stepTowardTargetOnLadder(state.operationalState, "strained", 1);
  }

  const from = state.operationalState;
  const to = candidate;
  if (from === to) {
    return {
      next: {
        ...state,
        metadata: {
          ...state.metadata,
          operationalLoad: Math.min(1, (state.metadata.operationalLoad ?? 0.35) + pressure * 0.05),
          instabilityAccumulator: Math.min(
            1,
            (state.metadata.instabilityAccumulator ?? 0) + pressure * 0.02
          ),
        },
        lastUpdatedTick: tick,
      },
      applied: null,
      rejection: null,
    };
  }

  const prevSeverity = state.metadata.severity ?? metadataSeverityForState(from);
  const nextSeverity = metadataSeverityForState(to);
  const lastKey =
    state.transitionHistory.length > 0
      ? `${tick}|${state.transitionHistory[state.transitionHistory.length - 1]!.from}|${state.transitionHistory[state.transitionHistory.length - 1]!.to}`
      : null;

  const rejection = validateOperationalTransition({
    objectId: state.objectId,
    from,
    to,
    tick,
    lastUpdatedTick: state.lastUpdatedTick,
    previousSeverity: prevSeverity,
    nextSeverity,
    history: state.transitionHistory,
    lastTransitionKey: lastKey,
  });

  if (rejection) {
    return { next: state, applied: null, rejection };
  }

  const delta = nextSeverity - prevSeverity;
  const transition: SimulationStateTransition = {
    from,
    to,
    reason: reasonForPressureDelta(delta, fromPropagation),
    tick,
    confidence: state.metadata.confidence,
    note: fromPropagation
      ? `Propagation-influenced shift to ${to}`
      : `Operational pressure shifted state to ${to}`,
  };

  const applied: AppliedOperationalTransition = {
    ...transition,
    objectId: state.objectId,
    transitionId: buildTransitionId(state.objectId, tick, from, to),
  };

  logOperationalEvolutionDev("Transition", {
    objectId: state.objectId,
    from,
    to,
    tick,
    reason: transition.reason,
  });

  return {
    next: applyTransitionImmutable(state, to, transition),
    applied,
    rejection: null,
  };
}

/**
 * Evolve operational states for all known objects (immutable result).
 * Does not mutate `currentStates` or scene data.
 */
export function evolveOperationalState(input: OperationalEvolutionInput): OperationalEvolutionResult {
  const tick = Math.max(0, Math.floor(Number(input.tick) || 0));
  const eventPressure = eventPressureByObject(input.simulationEvents);
  const propagationPressure = mergePropagationPressureByObject(input.propagationEffects ?? []);
  const globalLoad = Math.min(
    1,
    Number(input.operationalMetrics?.operationalLoad ?? 0) || 0
  );

  const objectIds = collectObjectIds(input.currentStates, input.simulationEvents, propagationPressure);
  const nextStates: Record<string, SimulatedObjectState> = {};
  const transitionsApplied: AppliedOperationalTransition[] = [];
  const rejections: OperationalTransitionRejection[] = [];

  for (const objectId of objectIds) {
    const current =
      input.currentStates[objectId] ?? createInitialSimulatedObjectState(objectId, tick, "stable");
    const ep = eventPressure[objectId] ?? 0;
    const pp = propagationPressure[objectId] ?? 0;
    const combinedPressure = Math.min(1, ep + pp);
    const fromPropagation = pp > 0 && pp >= ep;

    const { next, applied, rejection } = evolveSingleObject({
      state: current,
      tick,
      combinedPressure,
      fromPropagation,
      globalLoad,
    });

    nextStates[objectId] = next;
    if (applied) transitionsApplied.push(applied);
    if (rejection) rejections.push(rejection);

    logOperationalEvolutionDev("OperationalState", {
      objectId,
      state: next.operationalState,
      severity: next.metadata.severity,
      tick,
    });
  }

  logOperationalEvolutionDev("SimulationProgression", {
    tick,
    objectCount: objectIds.length,
    transitions: transitionsApplied.length,
    rejections: rejections.length,
  });

  logOperationalEvolutionDev("StateEvolution", {
    tick,
    applied: transitionsApplied.length,
    rejected: rejections.length,
  });

  return {
    nextStates,
    transitionsApplied,
    rejections,
  };
}

/** Deterministic replay check: same inputs produce identical fingerprints. */
export function operationalEvolutionFingerprint(result: OperationalEvolutionResult): string {
  const rows = Object.keys(result.nextStates)
    .sort()
    .map((id) => {
      const s = result.nextStates[id]!;
      return `${id}:${s.operationalState}:${s.metadata.severity}:${s.transitionHistory.length}`;
    });
  return rows.join("|");
}

/** Map simulated states into simulation snapshot `objectStates` (opaque records, not sceneJson). */
export function simulatedStatesToSnapshotObjectStates(
  states: Readonly<Record<string, SimulatedObjectState>>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const id of Object.keys(states).sort()) {
    const s = states[id]!;
    out[id] = {
      operationalState: s.operationalState,
      metadata: { ...s.metadata },
      lastUpdatedTick: s.lastUpdatedTick,
      transitionHistory: s.transitionHistory.map((t) => ({ ...t })),
    };
  }
  return out;
}

export function snapshotObjectStatesToSimulatedStates(
  objectStates: Record<string, unknown> | null | undefined,
  tick = 0
): Record<string, SimulatedObjectState> {
  if (!objectStates || typeof objectStates !== "object") return {};
  const out: Record<string, SimulatedObjectState> = {};
  for (const objectId of Object.keys(objectStates).sort()) {
    const raw = objectStates[objectId];
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      out[objectId] = createInitialSimulatedObjectState(objectId, tick);
      continue;
    }
    const record = raw as Record<string, unknown>;
    const op = record.operationalState as OperationalSimulationState | undefined;
    const meta = record.metadata as SimulatedObjectState["metadata"] | undefined;
    const history = Array.isArray(record.transitionHistory)
      ? (record.transitionHistory as SimulationStateTransition[])
      : [];
    out[objectId] = {
      objectId,
      operationalState: op ?? "stable",
      metadata: meta ?? createDefaultOperationalMetadata(op ?? "stable"),
      lastUpdatedTick: Number(record.lastUpdatedTick ?? tick) || tick,
      transitionHistory: history,
    };
  }
  return out;
}
