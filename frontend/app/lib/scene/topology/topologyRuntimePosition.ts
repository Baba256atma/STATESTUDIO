/**
 * Shared runtime position resolution for topology objects and connection endpoints.
 */

import type { SceneObject } from "../../sceneTypes.ts";
import { resolveStableObjectId } from "../objectRegistryRuntime.ts";
import type { SceneTopologyBinding } from "./topologySceneBindingTypes.ts";
import {
  isValidScenePosition,
  resolveRuntimeScenePosition,
  type ScenePosition,
} from "./topologyScenePositioning.ts";
import { logTopologyPositionMismatch } from "./topologyRuntimePositionDevLog.ts";
import type { SceneConnectionLine } from "./topologyConnectionTypes.ts";

export type TopologyRuntimePositionSource =
  | "runtime_layout"
  | "topology_binding"
  | "json"
  | "origin";

export type TopologyRuntimePositionResult = {
  position: ScenePosition;
  source: TopologyRuntimePositionSource;
};

export type TopologyRuntimePositionContext = {
  objectId: string;
  runtimeLayoutPositions?: Record<string, [number, number, number]>;
  bindings?: readonly SceneTopologyBinding[];
  sceneObjects?: readonly SceneObject[];
  topologyEnabled?: boolean;
};

export const TOPOLOGY_POSITION_MISMATCH_TOLERANCE = 0.01;

function readTuplePosition(tuple: readonly number[] | undefined): ScenePosition | null {
  if (!tuple || tuple.length < 3) return null;
  const position = {
    x: Number(tuple[0]),
    y: Number(tuple[1]),
    z: Number(tuple[2]),
  };
  return isValidScenePosition(position) ? position : null;
}

function findBindingIndex(
  objectId: string,
  bindings: readonly SceneTopologyBinding[] | undefined,
  sceneObjects?: readonly SceneObject[]
): number {
  if (!bindings || bindings.length === 0) return -1;
  const directIndex = bindings.findIndex(
    (binding) => binding.objectId === objectId || binding.nodeId === objectId
  );
  if (directIndex >= 0) return directIndex;
  if (!sceneObjects) return -1;

  return sceneObjects.findIndex((object, index) => {
    const stableId = resolveStableObjectId(object, index);
    const label = (object as { label?: string }).label;
    return (
      stableId === objectId ||
      (object.id != null && String(object.id) === objectId) ||
      (object.name != null && String(object.name) === objectId) ||
      (label != null && String(label) === objectId)
    );
  });
}

export function collectTopologyRuntimePositionAliasKeys(input: {
  objectId: string;
  bindings?: readonly SceneTopologyBinding[];
  sceneObjects?: readonly SceneObject[];
}): string[] {
  const keys = new Set<string>();
  const normalized = String(input.objectId ?? "").trim();
  if (normalized) keys.add(normalized);

  const bindingIndex = findBindingIndex(normalized, input.bindings, input.sceneObjects);
  if (bindingIndex < 0) return [...keys];

  const binding = input.bindings?.[bindingIndex];
  const object = input.sceneObjects?.[bindingIndex];
  if (binding?.objectId) keys.add(binding.objectId);
  if (binding?.nodeId) keys.add(binding.nodeId);

  if (object) {
    const stableId = resolveStableObjectId(object, bindingIndex);
    keys.add(stableId);
    if (object.id != null) keys.add(String(object.id));
    if (object.name != null) keys.add(String(object.name));
    const label = (object as { label?: string }).label;
    if (label != null) keys.add(String(label));
  }

  return [...keys];
}

export function resolveTopologyRuntimePosition(
  context: TopologyRuntimePositionContext
): TopologyRuntimePositionResult {
  const objectId = String(context.objectId ?? "").trim();
  const aliasKeys = collectTopologyRuntimePositionAliasKeys({
    objectId,
    bindings: context.bindings,
    sceneObjects: context.sceneObjects,
  });

  if (context.runtimeLayoutPositions) {
    for (const key of aliasKeys) {
      const position = readTuplePosition(context.runtimeLayoutPositions[key]);
      if (position) {
        return { position, source: "runtime_layout" };
      }
    }
  }

  const bindingIndex = findBindingIndex(objectId, context.bindings, context.sceneObjects);
  const binding = bindingIndex >= 0 ? context.bindings?.[bindingIndex] : undefined;

  if (binding && context.topologyEnabled) {
    const resolved = resolveRuntimeScenePosition({
      objectId: binding.objectId,
      jsonPosition: binding.originalPosition,
      topologyPosition: binding.topologyPosition ?? binding.finalPosition,
      topologyEnabled: true,
    });
    if (resolved.source === "topology") {
      return { position: resolved.position, source: "topology_binding" };
    }
    if (resolved.source === "json") {
      return { position: resolved.position, source: "json" };
    }
  }

  if (binding?.originalPosition && isValidScenePosition(binding.originalPosition)) {
    return {
      position: {
        x: binding.originalPosition.x,
        y: binding.originalPosition.y,
        z: binding.originalPosition.z,
      },
      source: "json",
    };
  }

  return {
    position: { x: 0, y: 0, z: 0 },
    source: "origin",
  };
}

export function topologyPositionDistance(a: ScenePosition, b: ScenePosition): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function auditTopologyConnectionEndpointAlignment(input: {
  lines: readonly SceneConnectionLine[];
  runtimeLayoutPositions?: Record<string, [number, number, number]>;
  bindings?: readonly SceneTopologyBinding[];
  sceneObjects?: readonly SceneObject[];
  topologyEnabled?: boolean;
  tolerance?: number;
}): void {
  const tolerance = input.tolerance ?? TOPOLOGY_POSITION_MISMATCH_TOLERANCE;
  const contextBase = {
    runtimeLayoutPositions: input.runtimeLayoutPositions,
    bindings: input.bindings,
    sceneObjects: input.sceneObjects,
    topologyEnabled: input.topologyEnabled,
  };

  for (const line of input.lines) {
    if (!line.valid) continue;

    for (const endpoint of ["source", "target"] as const) {
      const endpointId = endpoint === "source" ? line.sourceId : line.targetId;
      const endpointPosition =
        endpoint === "source" ? line.sourcePosition : line.targetPosition;
      const runtime = resolveTopologyRuntimePosition({
        objectId: endpointId,
        ...contextBase,
      });

      if (runtime.source !== "runtime_layout") continue;

      const distance = topologyPositionDistance(runtime.position, endpointPosition);
      if (distance <= tolerance) continue;

      logTopologyPositionMismatch(
        `${endpointId} runtime=${JSON.stringify(runtime.position)} line=${JSON.stringify(endpointPosition)} distance=${distance.toFixed(4)}`
      );
    }
  }
}
