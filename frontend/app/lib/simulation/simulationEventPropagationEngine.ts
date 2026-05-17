/**
 * D7:1:3 — Deterministic simulation event propagation engine (immutable results).
 */

import type { SimulationEvent } from "./simulationEventTypes.ts";
import type { SimulationStateSnapshot } from "./simulationStateSnapshot.ts";
import {
  applyAttenuation,
  PROPAGATION_INTENSITY_CUTOFF,
  shouldCutoffAtDepth,
} from "./simulationPropagationAttenuation.ts";
import { logSimulationPropagationDev } from "./simulationPropagationDevLog.ts";
import {
  DEFAULT_MAX_PROPAGATION_TRAVERSED_NODES,
  guardCircularTraversal,
  guardDuplicateTraversal,
  guardInvalidSource,
  guardPropagationDepth,
  guardPropagationNodeBudget,
  guardStalePropagationTick,
} from "./simulationPropagationGuards.ts";
import {
  getOutgoingPropagationEdges,
  reconstructPropagationPath,
  type SimulationObjectGraph,
} from "./simulationPropagationGraph.ts";
import type {
  SimulationPropagationCascadeRecord,
  SimulationPropagationChain,
  SimulationPropagationEvent,
  SimulationPropagationPath,
  SimulationPropagationRejection,
  SimulationPropagationSnapshotState,
  SimulationPropagationType,
} from "./simulationPropagationTypes.ts";
import { SIMULATION_PROPAGATION_LABELS } from "./simulationPropagationTypes.ts";

export interface PropagateSimulationEventInput {
  event: SimulationEvent;
  objectGraph: SimulationObjectGraph;
  currentSnapshot?: SimulationStateSnapshot | null;
  tick: number;
  maxTraversedNodes?: number;
}

export interface SimulationPropagationResult {
  sourceEventId: string;
  propagationEvents: readonly SimulationPropagationEvent[];
  paths: readonly SimulationPropagationPath[];
  chains: readonly SimulationPropagationChain[];
  intensityByObjectId: Readonly<Record<string, number>>;
  snapshotFragment: SimulationPropagationSnapshotState;
  rejections: readonly SimulationPropagationRejection[];
}

type QueueItem = Readonly<{
  objectId: string;
  depth: number;
  intensity: number;
  path: readonly string[];
}>;

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function resolvePropagationSeed(event: SimulationEvent): {
  propagationType: SimulationPropagationType;
  baseIntensity: number;
  sourceObjectId: string;
  reason: string;
} | null {
  const sourceObjectId = String(
    event.sourceObjectId ??
      (event.payload as { objectId?: string } | undefined)?.objectId ??
      event.targetObjectIds?.[0] ??
      ""
  ).trim();
  if (!sourceObjectId) return null;

  switch (event.type) {
    case "risk_increase": {
      const payload = event.payload as { delta?: number } | undefined;
      const delta = Number(payload?.delta ?? 0.15);
      return {
        propagationType: "risk_escalation",
        baseIntensity: clamp01(0.55 + (Number.isFinite(delta) ? delta : 0.15)),
        sourceObjectId,
        reason: SIMULATION_PROPAGATION_LABELS.risk_escalation,
      };
    }
    case "resource_shift": {
      const payload = event.payload as { loadDelta?: number } | undefined;
      const delta = Number(payload?.loadDelta ?? 0.12);
      return {
        propagationType: "resource_pressure",
        baseIntensity: clamp01(0.5 + (Number.isFinite(delta) ? delta : 0.12)),
        sourceObjectId,
        reason: SIMULATION_PROPAGATION_LABELS.resource_pressure,
      };
    }
    case "operational_alert":
      return {
        propagationType: "operational_delay",
        baseIntensity: 0.45,
        sourceObjectId,
        reason: SIMULATION_PROPAGATION_LABELS.operational_delay,
      };
    case "state_change": {
      const payload = event.payload as {
        patch?: Record<string, unknown>;
        recovery?: boolean;
      } | undefined;
      const patch = payload?.patch ?? {};
      if (payload?.recovery || patch.recovery === true) {
        return {
          propagationType: "recovery",
          baseIntensity: clamp01(Number(patch.intensity ?? 0.5) || 0.5),
          sourceObjectId,
          reason: SIMULATION_PROPAGATION_LABELS.recovery,
        };
      }
      if (patch.stabilization === true || patch.stabilize === true) {
        return {
          propagationType: "stabilization",
          baseIntensity: clamp01(Number(patch.intensity ?? 0.55) || 0.55),
          sourceObjectId,
          reason: SIMULATION_PROPAGATION_LABELS.stabilization,
        };
      }
      const risk = Number(patch.risk ?? patch.pressure ?? 0.4);
      return {
        propagationType: Number.isFinite(risk) && risk < 0 ? "stabilization" : "dependency_failure",
        baseIntensity: clamp01(Math.abs(Number.isFinite(risk) ? risk : 0.4)),
        sourceObjectId,
        reason: SIMULATION_PROPAGATION_LABELS.dependency_failure,
      };
    }
    case "timeline_branch":
      return {
        propagationType: "confidence_drop",
        baseIntensity: 0.35,
        sourceObjectId,
        reason: SIMULATION_PROPAGATION_LABELS.confidence_drop,
      };
    default:
      return null;
  }
}

function mergeIntensity(
  map: Record<string, number>,
  objectId: string,
  intensity: number
): void {
  const id = String(objectId ?? "").trim();
  if (!id || intensity <= 0) return;
  map[id] = Math.min(1, Math.max(map[id] ?? 0, intensity));
}

function buildSnapshotFragment(input: {
  tick: number;
  sourceObjectId: string;
  propagationType: SimulationPropagationType;
  propagationEvents: readonly SimulationPropagationEvent[];
  paths: readonly SimulationPropagationPath[];
  chains: readonly SimulationPropagationChain[];
  intensityMap: Readonly<Record<string, number>>;
}): SimulationPropagationSnapshotState {
  const affectedObjectIds = Object.keys(input.intensityMap).sort();
  const cascadeHistory: SimulationPropagationCascadeRecord[] = [
    {
      tick: input.tick,
      sourceObjectId: input.sourceObjectId,
      propagationType: input.propagationType,
      affectedCount: affectedObjectIds.length,
      maxDepth: pathsMaxDepth(input.paths),
    },
  ];
  const fingerprint = stableStringify({
    tick: input.tick,
    source: input.sourceObjectId,
    type: input.propagationType,
    events: input.propagationEvents.map((e) => `${e.id}:${e.targetObjectId}:${e.depth}:${e.intensity}`),
    intensity: input.intensityMap,
  });
  return {
    activePropagations: [...input.propagationEvents],
    propagationChains: [...input.chains],
    intensityMap: { ...input.intensityMap },
    affectedObjectIds,
    cascadeHistory,
    fingerprint,
  };
}

function pathsMaxDepth(paths: readonly SimulationPropagationPath[]): number {
  let max = 0;
  for (const p of paths) max = Math.max(max, p.depth);
  return max;
}

/**
 * Propagate operational consequences from a single simulation event (iterative BFS; no recursion).
 */
export function propagateSimulationEvent(
  input: PropagateSimulationEventInput
): SimulationPropagationResult {
  const tick = Math.max(0, Math.floor(Number(input.tick) || 0));
  const maxNodes = Math.max(
    1,
    Math.floor(Number(input.maxTraversedNodes ?? DEFAULT_MAX_PROPAGATION_TRAVERSED_NODES))
  );
  const snapshotTick = input.currentSnapshot?.timestamp?.tick ?? null;
  const rejections: SimulationPropagationRejection[] = [];

  const stale = guardStalePropagationTick(tick, snapshotTick);
  if (stale) rejections.push(stale);

  const seed = resolvePropagationSeed(input.event);
  const emptyResult = (partial?: Partial<SimulationPropagationResult>): SimulationPropagationResult => ({
    sourceEventId: input.event.id,
    propagationEvents: partial?.propagationEvents ?? [],
    paths: partial?.paths ?? [],
    chains: partial?.chains ?? [],
    intensityByObjectId: partial?.intensityByObjectId ?? {},
    snapshotFragment:
      partial?.snapshotFragment ??
      buildSnapshotFragment({
        tick,
        sourceObjectId: "",
        propagationType: "operational_delay",
        propagationEvents: [],
        paths: [],
        chains: [],
        intensityMap: {},
      }),
    rejections,
  });

  if (!seed) {
    rejections.push({
      code: "invalid_source",
      message: "Unable to resolve propagation seed from simulation event",
    });
    return emptyResult();
  }

  const sourceGuard = guardInvalidSource(seed.sourceObjectId);
  if (sourceGuard) {
    rejections.push(sourceGuard);
    return emptyResult();
  }

  logSimulationPropagationDev("SimulationPropagation", {
    eventId: input.event.id,
    type: seed.propagationType,
    source: seed.sourceObjectId,
    tick,
  });

  const propagationEvents: SimulationPropagationEvent[] = [];
  const paths: SimulationPropagationPath[] = [];
  const chains: SimulationPropagationChain[] = [];
  const intensityByObjectId: Record<string, number> = {};
  const visitKeys = new Set<string>();
  let traversedNodeCount = 0;

  mergeIntensity(intensityByObjectId, seed.sourceObjectId, seed.baseIntensity);

  const queue: QueueItem[] = [
    {
      objectId: seed.sourceObjectId,
      depth: 0,
      intensity: seed.baseIntensity,
      path: [seed.sourceObjectId],
    },
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const depthGuard = guardPropagationDepth(current.depth);
    if (depthGuard) {
      rejections.push(depthGuard);
      continue;
    }
    if (shouldCutoffAtDepth(current.depth + 1)) continue;

    const budgetGuard = guardPropagationNodeBudget(traversedNodeCount, maxNodes);
    if (budgetGuard) {
      rejections.push(budgetGuard);
      break;
    }

    const edges = getOutgoingPropagationEdges(input.objectGraph, current.objectId);
    for (const edge of edges) {
      const nextDepth = current.depth + 1;
      if (shouldCutoffAtDepth(nextDepth)) continue;

      const circular = guardCircularTraversal(current.path, edge.to);
      if (circular) {
        rejections.push(circular);
        continue;
      }

      const visitKey = `${edge.from}|${edge.to}|${nextDepth}|${input.event.id}`;
      const dup = guardDuplicateTraversal(visitKey, visitKeys);
      if (dup) {
        rejections.push(dup);
        continue;
      }
      visitKeys.add(visitKey);

      const edgeWeight = clamp01(Number(edge.weight ?? 1) || 1);
      const nextIntensity = applyAttenuation(current.intensity * edgeWeight, nextDepth);
      if (nextIntensity < PROPAGATION_INTENSITY_CUTOFF) {
        rejections.push({
          code: "intensity_cutoff",
          message: `Intensity below cutoff for ${edge.to} at depth ${nextDepth}`,
          targetObjectId: edge.to,
          depth: nextDepth,
        });
        continue;
      }

      traversedNodeCount += 1;
      const nextPath = [...current.path, edge.to];
      const path = reconstructPropagationPath(
        seed.sourceObjectId,
        nextPath,
        nextIntensity,
        nextDepth
      );
      paths.push(path);

      const propagationEvent: SimulationPropagationEvent = {
        id: `prop-${input.event.id}-${edge.from}-${edge.to}-d${nextDepth}`,
        propagationType: seed.propagationType,
        sourceObjectId: edge.from,
        targetObjectId: edge.to,
        intensity: nextIntensity,
        depth: nextDepth,
        createdAtTick: tick,
        reason: seed.reason,
      };
      propagationEvents.push(propagationEvent);
      mergeIntensity(intensityByObjectId, edge.to, nextIntensity);

      logSimulationPropagationDev("PropagationPath", {
        from: edge.from,
        to: edge.to,
        depth: nextDepth,
        intensity: nextIntensity,
      });

      queue.push({
        objectId: edge.to,
        depth: nextDepth,
        intensity: nextIntensity,
        path: nextPath,
      });
    }
  }

  propagationEvents.sort((a, b) => a.id.localeCompare(b.id));
  paths.sort((a, b) => {
    const d = a.depth - b.depth;
    if (d !== 0) return d;
    return a.traversedObjectIds.join(",").localeCompare(b.traversedObjectIds.join(","));
  });

  for (const path of paths) {
    chains.push({
      chainId: `chain-${input.event.id}-${path.depth}-${path.traversedObjectIds.join("-")}`,
      rootEventId: input.event.id,
      propagationType: seed.propagationType,
      path,
    });
  }
  chains.sort((a, b) => a.chainId.localeCompare(b.chainId));

  logSimulationPropagationDev("PropagationCascade", {
    eventId: input.event.id,
    events: propagationEvents.length,
    paths: paths.length,
    affected: Object.keys(intensityByObjectId).length,
    tick,
  });

  const snapshotFragment = buildSnapshotFragment({
    tick,
    sourceObjectId: seed.sourceObjectId,
    propagationType: seed.propagationType,
    propagationEvents,
    paths,
    chains,
    intensityMap: intensityByObjectId,
  });

  return {
    sourceEventId: input.event.id,
    propagationEvents,
    paths,
    chains,
    intensityByObjectId,
    snapshotFragment,
    rejections,
  };
}

/** Batch propagate multiple events in stable order (replay-safe). */
export function propagateSimulationEvents(input: {
  events: readonly SimulationEvent[];
  objectGraph: SimulationObjectGraph;
  currentSnapshot?: SimulationStateSnapshot | null;
  tick: number;
  maxTraversedNodes?: number;
}): SimulationPropagationResult {
  const ordered = [...input.events].sort((a, b) => a.id.localeCompare(b.id));
  const mergedEvents: SimulationPropagationEvent[] = [];
  const mergedPaths: SimulationPropagationPath[] = [];
  const mergedChains: SimulationPropagationChain[] = [];
  const mergedRejections: SimulationPropagationRejection[] = [];
  const intensityByObjectId: Record<string, number> = {};
  let lastFragment: SimulationPropagationSnapshotState = buildSnapshotFragment({
    tick: input.tick,
    sourceObjectId: "",
    propagationType: "operational_delay",
    propagationEvents: [],
    paths: [],
    chains: [],
    intensityMap: {},
  });

  for (const event of ordered) {
    const result = propagateSimulationEvent({
      event,
      objectGraph: input.objectGraph,
      currentSnapshot: input.currentSnapshot,
      tick: input.tick,
      maxTraversedNodes: input.maxTraversedNodes,
    });
    mergedEvents.push(...result.propagationEvents);
    mergedPaths.push(...result.paths);
    mergedChains.push(...result.chains);
    mergedRejections.push(...result.rejections);
    for (const [id, intensity] of Object.entries(result.intensityByObjectId)) {
      mergeIntensity(intensityByObjectId, id, intensity);
    }
    if (result.propagationEvents.length > 0) {
      lastFragment = result.snapshotFragment;
    }
  }

  mergedEvents.sort((a, b) => a.id.localeCompare(b.id));
  mergedPaths.sort((a, b) => a.depth - b.depth || a.traversedObjectIds.join(",").localeCompare(b.traversedObjectIds.join(",")));
  mergedChains.sort((a, b) => a.chainId.localeCompare(b.chainId));

  const snapshotFragment: SimulationPropagationSnapshotState = {
    ...lastFragment,
    activePropagations: mergedEvents,
    propagationChains: mergedChains,
    intensityMap: { ...intensityByObjectId },
    affectedObjectIds: Object.keys(intensityByObjectId).sort(),
    cascadeHistory: [
      ...(lastFragment.cascadeHistory ?? []),
      {
        tick: input.tick,
        sourceObjectId: mergedPaths[0]?.sourceObjectId ?? "",
        propagationType: mergedEvents[0]?.propagationType ?? "operational_delay",
        affectedCount: Object.keys(intensityByObjectId).length,
        maxDepth: pathsMaxDepth(mergedPaths),
      },
    ],
    fingerprint: stableStringify({
      tick: input.tick,
      events: mergedEvents.map((e) => `${e.id}:${e.intensity}`),
      intensity: intensityByObjectId,
    }),
  };

  return {
    sourceEventId: ordered.map((e) => e.id).join(","),
    propagationEvents: mergedEvents,
    paths: mergedPaths,
    chains: mergedChains,
    intensityByObjectId,
    snapshotFragment,
    rejections: mergedRejections,
  };
}

export function simulationPropagationFingerprint(result: SimulationPropagationResult): string {
  return result.snapshotFragment.fingerprint;
}

/** Bridge to D7:1:2 operational evolution (consumer-only; not visual overlay). */
export function propagationResultToEvolutionSignals(
  result: SimulationPropagationResult
): import("./propagationEvolutionSignals.ts").PropagationEvolutionSignal[] {
  return Object.entries(result.intensityByObjectId)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([objectId, intensity]) => {
      const events = result.propagationEvents.filter((e) => e.targetObjectId === objectId);
      const depth = events.length > 0 ? Math.min(...events.map((e) => e.depth)) : 1;
      const fromSource = events.some((e) => e.sourceObjectId === objectId);
      return {
        objectId,
        intensity,
        depth,
        role: fromSource ? ("source" as const) : ("impacted" as const),
      };
    });
}
