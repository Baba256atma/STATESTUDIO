/**
 * D7:1:1 — Replay-compatible simulation state snapshots.
 */

import type {
  SimulationBranchId,
  SimulationOperationalMetrics,
  SimulationTimestamp,
} from "./simulationTypes.ts";

export interface SimulationStateSnapshot {
  simulationId: string;
  branchId: SimulationBranchId;
  timestamp: SimulationTimestamp;
  objectStates: Record<string, unknown>;
  propagationState?: unknown;
  operationalMetrics?: SimulationOperationalMetrics;
  /** Stable ordering fingerprint for replay dedupe / branch comparison. */
  fingerprint: string;
}

export type CreateSimulationSnapshotInput = Readonly<{
  simulationId: string;
  branchId?: SimulationBranchId;
  timestamp: SimulationTimestamp;
  objectStates: Record<string, unknown>;
  propagationState?: unknown;
  operationalMetrics?: SimulationOperationalMetrics;
}>;

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

/** Deterministic fingerprint for replay / branch diff (does not hash `propagationState` opaque blobs). */
export function buildSimulationSnapshotFingerprint(input: {
  simulationId: string;
  branchId: SimulationBranchId;
  tick: number;
  objectStates: Record<string, unknown>;
  operationalMetrics?: SimulationOperationalMetrics;
}): string {
  const objectKeys = Object.keys(input.objectStates).sort();
  const objectSlice = objectKeys.map((id) => ({
    id,
    state: input.objectStates[id],
  }));
  return stableStringify({
    simulationId: input.simulationId,
    branchId: input.branchId,
    tick: input.tick,
    objects: objectSlice,
    metrics: input.operationalMetrics ?? null,
  });
}

export function createSimulationStateSnapshot(
  input: CreateSimulationSnapshotInput
): SimulationStateSnapshot {
  const branchId = input.branchId ?? "main";
  const fingerprint = buildSimulationSnapshotFingerprint({
    simulationId: input.simulationId,
    branchId,
    tick: input.timestamp.tick,
    objectStates: input.objectStates,
    operationalMetrics: input.operationalMetrics,
  });
  return {
    simulationId: input.simulationId,
    branchId,
    timestamp: { ...input.timestamp },
    objectStates: { ...input.objectStates },
    ...(input.propagationState !== undefined ? { propagationState: input.propagationState } : {}),
    ...(input.operationalMetrics !== undefined
      ? { operationalMetrics: { ...input.operationalMetrics } }
      : {}),
    fingerprint,
  };
}

/** Shallow clone for immutable runtime progression. */
export function cloneObjectStates(
  objectStates: Record<string, unknown>
): Record<string, unknown> {
  return { ...objectStates };
}
