/**
 * D7:1:3 — Propagation guard rails (no infinite cascades).
 */

import type { SimulationPropagationRejection } from "./simulationPropagationTypes.ts";
import { PROPAGATION_MAX_EFFECTIVE_DEPTH } from "./simulationPropagationAttenuation.ts";
import { logSimulationPropagationDev } from "./simulationPropagationDevLog.ts";

export const DEFAULT_MAX_PROPAGATION_TRAVERSED_NODES = 64;

export function guardPropagationDepth(depth: number): SimulationPropagationRejection | null {
  const d = Math.floor(Number(depth) || 0);
  if (d > PROPAGATION_MAX_EFFECTIVE_DEPTH) {
    const rejection: SimulationPropagationRejection = {
      code: "max_depth_exceeded",
      message: `Propagation depth ${d} exceeds max ${PROPAGATION_MAX_EFFECTIVE_DEPTH}`,
      depth: d,
    };
    logSimulationPropagationDev("PropagationGuard", { ...rejection });
    return rejection;
  }
  return null;
}

export function guardPropagationNodeBudget(
  traversedCount: number,
  maxNodes: number = DEFAULT_MAX_PROPAGATION_TRAVERSED_NODES
): SimulationPropagationRejection | null {
  if (traversedCount >= maxNodes) {
    const rejection: SimulationPropagationRejection = {
      code: "max_nodes_exceeded",
      message: `Traversed node count ${traversedCount} exceeds max ${maxNodes}`,
    };
    logSimulationPropagationDev("PropagationGuard", { ...rejection });
    return rejection;
  }
  return null;
}

export function guardCircularTraversal(
  path: readonly string[],
  nextObjectId: string
): SimulationPropagationRejection | null {
  const next = String(nextObjectId ?? "").trim();
  if (path.includes(next)) {
    const rejection: SimulationPropagationRejection = {
      code: "circular_dependency",
      message: `Circular propagation path detected at ${next}`,
      targetObjectId: next,
    };
    logSimulationPropagationDev("PropagationGuard", { ...rejection });
    return rejection;
  }
  return null;
}

export function guardDuplicateTraversal(
  visitKey: string,
  seen: ReadonlySet<string>
): SimulationPropagationRejection | null {
  if (seen.has(visitKey)) {
    const rejection: SimulationPropagationRejection = {
      code: "duplicate_traversal",
      message: `Duplicate traversal key ${visitKey}`,
    };
    logSimulationPropagationDev("PropagationGuard", { ...rejection });
    return rejection;
  }
  return null;
}

export function guardStalePropagationTick(
  tick: number,
  snapshotTick: number | null | undefined
): SimulationPropagationRejection | null {
  if (snapshotTick == null || !Number.isFinite(Number(snapshotTick))) return null;
  const t = Math.floor(Number(tick) || 0);
  const snap = Math.floor(Number(snapshotTick) || 0);
  if (t < snap) {
    const rejection: SimulationPropagationRejection = {
      code: "stale_tick",
      message: `Propagation tick ${t} is older than snapshot tick ${snap}`,
    };
    logSimulationPropagationDev("PropagationGuard", { ...rejection });
    return rejection;
  }
  return null;
}

export function guardInvalidSource(sourceObjectId: string | null | undefined): SimulationPropagationRejection | null {
  const id = String(sourceObjectId ?? "").trim();
  if (!id) {
    const rejection: SimulationPropagationRejection = {
      code: "invalid_source",
      message: "Propagation source object id is required",
    };
    logSimulationPropagationDev("PropagationGuard", { ...rejection });
    return rejection;
  }
  return null;
}
