/**
 * D7:1:1 — Pure selectors for simulation runtime / snapshots (no React, no scene).
 */

import type { SimulationRuntime } from "./simulationRuntime.ts";
import type { SimulationStateSnapshot } from "./simulationStateSnapshot.ts";
import type { SimulationEvent } from "./simulationEventTypes.ts";
import type { SimulationRuntimeMeta } from "./simulationTypes.ts";

export function selectSimulationRuntimeMeta(runtime: SimulationRuntime): SimulationRuntimeMeta {
  return {
    simulationId: runtime.config.simulationId,
    branchId: runtime.branchId,
    runtimeState: runtime.runtimeState,
    currentTick: runtime.currentTick,
    snapshotCount: runtime.snapshots.length,
    pendingEventCount: runtime.pendingEvents.length,
    processedEventCount: runtime.processedEventIds.size,
  };
}

export function selectLatestSimulationSnapshot(
  runtime: SimulationRuntime
): SimulationStateSnapshot | null {
  const last = runtime.snapshots[runtime.snapshots.length - 1];
  return last ?? null;
}

export function selectSimulationSnapshotAtTick(
  runtime: SimulationRuntime,
  tick: number
): SimulationStateSnapshot | null {
  const target = Math.max(0, Math.floor(Number(tick) || 0));
  for (let i = runtime.snapshots.length - 1; i >= 0; i -= 1) {
    const snap = runtime.snapshots[i];
    if (snap.timestamp.tick === target) return snap;
    if (snap.timestamp.tick < target) break;
  }
  return null;
}

export function selectPendingSimulationEvents(runtime: SimulationRuntime): readonly SimulationEvent[] {
  return runtime.pendingEvents;
}

export function selectProcessedSimulationEventIds(runtime: SimulationRuntime): readonly string[] {
  return [...runtime.processedEventIds].sort();
}

export function selectSimulationObjectState(
  runtime: SimulationRuntime,
  objectId: string
): unknown {
  const latest = selectLatestSimulationSnapshot(runtime);
  if (!latest) return undefined;
  return latest.objectStates[String(objectId ?? "").trim()];
}

export function selectReplayOrderedSnapshots(
  runtime: SimulationRuntime
): readonly SimulationStateSnapshot[] {
  return [...runtime.snapshots].sort((a, b) => a.timestamp.tick - b.timestamp.tick);
}
