/**
 * Runtime scene positioning from topology bindings (pure, read-only).
 */

import type { SceneObject } from "../../sceneTypes.ts";
import { resolveStableObjectId } from "../objectRegistryRuntime.ts";
import { logTopologyPositioningBrake } from "./topologyPositioningDevLog.ts";
import type { SceneTopologyBinding, SceneTopologyBindingResult } from "./topologySceneBindingTypes.ts";

export type ScenePosition = {
  x: number;
  y: number;
  z: number;
};

export type RuntimeScenePositionSource = "topology" | "json" | "origin";

export type RuntimeScenePositionResult = {
  position: ScenePosition;
  source: RuntimeScenePositionSource;
};

const ORIGIN_POSITION = Object.freeze({ x: 0, y: 0, z: 0 });

export function isValidScenePosition(
  position: unknown
): position is ScenePosition {
  if (!position || typeof position !== "object") return false;
  const record = position as { x?: unknown; y?: unknown; z?: unknown };
  return (
    Number.isFinite(record.x) &&
    Number.isFinite(record.y) &&
    Number.isFinite(record.z)
  );
}

export function resolveRuntimeScenePosition(input: {
  objectId: string;
  jsonPosition?: ScenePosition;
  topologyPosition?: ScenePosition;
  topologyEnabled: boolean;
}): RuntimeScenePositionResult {
  const { objectId, jsonPosition, topologyPosition, topologyEnabled } = input;

  if (topologyEnabled) {
    if (topologyPosition == null) {
      logTopologyPositioningBrake(`Missing finalPosition for object: ${objectId}`);
    } else if (!isValidScenePosition(topologyPosition)) {
      logTopologyPositioningBrake(`Invalid finalPosition for object: ${objectId}`);
    } else {
      return {
        position: {
          x: topologyPosition.x,
          y: topologyPosition.y,
          z: topologyPosition.z,
        },
        source: "topology",
      };
    }
  }

  if (isValidScenePosition(jsonPosition)) {
    if (topologyEnabled) {
      logTopologyPositioningBrake(`Fallback to JSON position for object: ${objectId}`);
    }
    return {
      position: {
        x: jsonPosition.x,
        y: jsonPosition.y,
        z: jsonPosition.z,
      },
      source: "json",
    };
  }

  if (topologyEnabled) {
    logTopologyPositioningBrake(`Fallback to origin position for object: ${objectId}`);
  }
  return {
    position: { ...ORIGIN_POSITION },
    source: "origin",
  };
}

function scenePositionToTuple(position: ScenePosition): [number, number, number] {
  return [position.x, position.y, position.z];
}

function registerLayoutPositionKey(
  map: Record<string, [number, number, number]>,
  key: string | null | undefined,
  tuple: [number, number, number]
): void {
  const normalized = String(key ?? "").trim();
  if (!normalized) return;
  map[normalized] = tuple;
}

export function buildTopologyPositionLookupMap(input: {
  bindings: readonly SceneTopologyBinding[];
  sceneObjects?: readonly SceneObject[];
  topologyEnabled: boolean;
}): Map<string, ScenePosition> {
  const map = new Map<string, ScenePosition>();
  if (!input.topologyEnabled) return map;

  input.bindings.forEach((binding, index) => {
    if (!binding.finalPosition || !isValidScenePosition(binding.finalPosition)) return;
    const position = {
      x: binding.finalPosition.x,
      y: binding.finalPosition.y,
      z: binding.finalPosition.z,
    };
    const keys = new Set<string>([binding.objectId, binding.nodeId]);
    const object = input.sceneObjects?.[index];
    if (object) {
      keys.add(resolveStableObjectId(object, index));
      if (object.id != null) keys.add(String(object.id));
      if (object.name != null) keys.add(String(object.name));
      const label = (object as { label?: string }).label;
      if (label != null) keys.add(String(label));
    }
    keys.forEach((key) => {
      const normalized = String(key ?? "").trim();
      if (!normalized) return;
      map.set(normalized, position);
    });
  });
  return map;
}

export function buildTopologyRuntimeLayoutPositions(input: {
  sceneObjects: readonly SceneObject[];
  binding: SceneTopologyBindingResult;
}): Record<string, [number, number, number]> | undefined {
  const { sceneObjects, binding } = input;
  if (!binding.topologyEnabled) return undefined;

  if (binding.bindings.length === 0) {
    if (binding.diagnostics.idle === true || sceneObjects.length === 0) {
      return undefined;
    }
    if (binding.topologyEnabled && sceneObjects.length > 0) {
      logTopologyPositioningBrake("Topology enabled but binding is empty");
    }
    return undefined;
  }

  const layoutPositions: Record<string, [number, number, number]> = {};

  for (let index = 0; index < sceneObjects.length; index += 1) {
    const object = sceneObjects[index];
    const bindingEntry = binding.bindings[index];
    const objectId =
      bindingEntry?.objectId ??
      (object ? resolveStableObjectId(object, index) : `object-${index}`);

    if (!bindingEntry) {
      logTopologyPositioningBrake(`Missing topology binding for object: ${objectId}`);
      continue;
    }

    const resolved = resolveRuntimeScenePosition({
      objectId,
      jsonPosition: bindingEntry.originalPosition,
      topologyPosition: bindingEntry.topologyPosition ?? bindingEntry.finalPosition,
      topologyEnabled: true,
    });

    const tuple = scenePositionToTuple(resolved.position);
    registerLayoutPositionKey(layoutPositions, bindingEntry.objectId, tuple);
    registerLayoutPositionKey(layoutPositions, bindingEntry.nodeId, tuple);

    if (object) {
      const stableId = resolveStableObjectId(object, index);
      registerLayoutPositionKey(layoutPositions, stableId, tuple);
      registerLayoutPositionKey(layoutPositions, object.id != null ? String(object.id) : undefined, tuple);
      registerLayoutPositionKey(layoutPositions, object.name != null ? String(object.name) : undefined, tuple);
      registerLayoutPositionKey(
        layoutPositions,
        (object as { label?: string }).label != null
          ? String((object as { label?: string }).label)
          : undefined,
        tuple
      );
    }
  }

  return layoutPositions;
}

export function resolveEffectiveLayoutPositions(input: {
  topologyLayoutPositions?: Record<string, [number, number, number]>;
  executiveLayoutPositions?: Record<string, [number, number, number]>;
  topologyEnabled: boolean;
}): Record<string, [number, number, number]> | undefined {
  if (input.topologyEnabled && input.topologyLayoutPositions) {
    return input.topologyLayoutPositions;
  }
  return input.executiveLayoutPositions;
}
