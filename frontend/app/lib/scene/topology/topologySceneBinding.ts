/**
 * Pure scene ↔ topology binding layer (no React, no mutation, no rendering).
 */

import type { SceneObject } from "../../sceneTypes.ts";
import { logTopologyBindingBrake } from "./topologyBindingDevLog.ts";
import { generateTopology } from "./topologyEngine.ts";
import type { TopologyNode } from "./topologyTypes.ts";
import {
  DEFAULT_SCENE_TOPOLOGY_MODE,
  type SceneTopologyBinding,
  type SceneTopologyBindingResult,
  type SceneTopologyBindingSource,
  type SceneTopologyMode,
} from "./topologySceneBindingTypes.ts";

const ZERO_POSITION = Object.freeze({ x: 0, y: 0, z: 0 });

const SUPPORTED_TOPOLOGY_MODES = new Set<SceneTopologyMode>(["off", "auto", "flow", "hub"]);

export function buildEmptySceneTopologyIdleBinding(): SceneTopologyBindingResult {
  return {
    topologyEnabled: false,
    topologyType: "off",
    bindings: [],
    connections: [],
    diagnostics: {
      objectCount: 0,
      bindingCount: 0,
      missingPositionCount: 0,
      fallbackCount: 0,
      warnings: [],
      idle: true,
      reason: "empty_scene",
    },
  };
}

function clonePosition(position: { x: number; y: number; z: number }) {
  return { x: position.x, y: position.y, z: position.z };
}

function isFinitePosition(value: unknown): value is { x: number; y: number; z: number } {
  if (!value || typeof value !== "object") return false;
  const record = value as { x?: unknown; y?: unknown; z?: unknown };
  return (
    Number.isFinite(record.x) &&
    Number.isFinite(record.y) &&
    Number.isFinite(record.z)
  );
}

export function resolveSceneObjectId(object: SceneObject, index: number): string {
  const id = String(object.id ?? "").trim();
  if (id) return id;
  const name = String(object.name ?? object.label ?? "").trim();
  if (name) return name;
  return `object-${index}`;
}

export function readSceneObjectOriginalPosition(
  object: SceneObject
): { x: number; y: number; z: number } | undefined {
  const transformPos = (object as { transform?: { pos?: unknown } }).transform?.pos;
  const raw =
    (Array.isArray(object.position) && object.position.length >= 3
      ? object.position
      : Array.isArray(object.pos) && object.pos.length >= 3
        ? object.pos
        : Array.isArray(transformPos) && transformPos.length >= 3
          ? transformPos
          : null);
  if (!raw) return undefined;
  const position = {
    x: Number(raw[0]),
    y: Number(raw[1]),
    z: Number(raw[2]),
  };
  return isFinitePosition(position) ? position : undefined;
}

export function sceneObjectToTopologyNode(object: SceneObject, index: number): TopologyNode {
  const id = resolveSceneObjectId(object, index);
  const name = String(object.label ?? object.name ?? id).trim() || id;
  const position = readSceneObjectOriginalPosition(object);
  return {
    id,
    name,
    ...(position ? { position: clonePosition(position) } : {}),
  };
}

export function sceneObjectsToTopologyNodes(objects: readonly SceneObject[]): TopologyNode[] {
  return objects.map((object, index) => sceneObjectToTopologyNode(object, index));
}

function buildJsonBindings(input: {
  sceneObjects: readonly SceneObject[];
  warnings: string[];
}): SceneTopologyBinding[] {
  const { sceneObjects, warnings } = input;

  const seenIds = new Map<string, number>();
  return sceneObjects.map((object, index) => {
    const objectId = resolveSceneObjectId(object, index);
    const duplicateCount = seenIds.get(objectId) ?? 0;
    seenIds.set(objectId, duplicateCount + 1);
    if (duplicateCount > 0) {
      const warning = `Duplicate object id detected: ${objectId}`;
      warnings.push(warning);
      logTopologyBindingBrake(warning);
    }

    const originalPosition = readSceneObjectOriginalPosition(object);
    if (!originalPosition) {
      const warning = `Missing JSON position for object: ${objectId}`;
      warnings.push(warning);
      logTopologyBindingBrake(warning);
    }

    const source: SceneTopologyBindingSource = originalPosition ? "json" : "fallback";
    return {
      objectId,
      nodeId: objectId,
      ...(originalPosition ? { originalPosition: clonePosition(originalPosition) } : {}),
      finalPosition: clonePosition(originalPosition ?? ZERO_POSITION),
      source,
    };
  });
}

function buildTopologyBindings(input: {
  sceneObjects: readonly SceneObject[];
  topologyMode: Exclude<SceneTopologyMode, "off">;
  warnings: string[];
}): SceneTopologyBindingResult {
  const { sceneObjects, topologyMode, warnings } = input;

  const topologyNodes = sceneObjectsToTopologyNodes(sceneObjects);
  const topologyResult = generateTopology(topologyMode, topologyNodes);

  if (topologyResult.nodes.length !== sceneObjects.length) {
    const warning = "Topology result node count does not match scene object count";
    warnings.push(warning);
    logTopologyBindingBrake(warning);
  }

  const seenIds = new Map<string, number>();
  let missingPositionCount = 0;
  let fallbackCount = 0;

  const bindings = sceneObjects.map((object, index) => {
    const objectId = resolveSceneObjectId(object, index);
    const duplicateCount = seenIds.get(objectId) ?? 0;
    seenIds.set(objectId, duplicateCount + 1);
    if (duplicateCount > 0) {
      const warning = `Duplicate object id detected: ${objectId}`;
      warnings.push(warning);
      logTopologyBindingBrake(warning);
    }

    const originalPosition = readSceneObjectOriginalPosition(object);
    const topologyNode = topologyResult.nodes[index];
    const topologyPosition =
      topologyNode?.position && isFinitePosition(topologyNode.position)
        ? clonePosition(topologyNode.position)
        : undefined;

    if (!topologyPosition) {
      const warning = `Missing topology position for object: ${objectId}`;
      warnings.push(warning);
      logTopologyBindingBrake(warning);
      missingPositionCount += 1;
    }
    if (!originalPosition) {
      const warning = `Missing JSON position for object: ${objectId}`;
      warnings.push(warning);
      logTopologyBindingBrake(warning);
      missingPositionCount += 1;
    }

    let source: SceneTopologyBindingSource = "topology";
    let finalPosition = topologyPosition;

    if (!finalPosition) {
      source = "fallback";
      finalPosition = clonePosition(originalPosition ?? ZERO_POSITION);
      fallbackCount += 1;
    }

    return {
      objectId,
      nodeId: topologyNode?.id ?? objectId,
      ...(originalPosition ? { originalPosition: clonePosition(originalPosition) } : {}),
      ...(topologyPosition ? { topologyPosition } : {}),
      finalPosition,
      source,
    };
  });

  return {
    topologyEnabled: true,
    topologyType: topologyResult.topology,
    bindings,
    connections: topologyResult.connections ? [...topologyResult.connections] : [],
    diagnostics: {
      objectCount: sceneObjects.length,
      bindingCount: bindings.length,
      missingPositionCount,
      fallbackCount,
      warnings,
    },
  };
}

export function bindTopologyToSceneObjects(input: {
  sceneObjects: readonly SceneObject[];
  topologyMode?: SceneTopologyMode;
}): SceneTopologyBindingResult {
  const topologyMode = input.topologyMode ?? DEFAULT_SCENE_TOPOLOGY_MODE;
  const sceneObjects = Array.isArray(input.sceneObjects) ? input.sceneObjects : [];
  const warnings: string[] = [];

  if (sceneObjects.length === 0) {
    return buildEmptySceneTopologyIdleBinding();
  }

  if (!SUPPORTED_TOPOLOGY_MODES.has(topologyMode)) {
    const warning = `Unsupported topology mode: ${String(topologyMode)}`;
    warnings.push(warning);
    logTopologyBindingBrake(warning);
    const bindings = buildJsonBindings({ sceneObjects, warnings });
    return {
      topologyEnabled: false,
      topologyType: "off",
      bindings,
      connections: [],
      diagnostics: {
        objectCount: sceneObjects.length,
        bindingCount: bindings.length,
        missingPositionCount: bindings.filter((binding) => !binding.originalPosition).length,
        fallbackCount: bindings.filter((binding) => binding.source === "fallback").length,
        warnings,
      },
    };
  }

  if (topologyMode === "off") {
    const bindings = buildJsonBindings({ sceneObjects, warnings });
    return {
      topologyEnabled: false,
      topologyType: "off",
      bindings,
      connections: [],
      diagnostics: {
        objectCount: sceneObjects.length,
        bindingCount: bindings.length,
        missingPositionCount: bindings.filter((binding) => !binding.originalPosition).length,
        fallbackCount: bindings.filter((binding) => binding.source === "fallback").length,
        warnings,
      },
    };
  }

  return buildTopologyBindings({
    sceneObjects,
    topologyMode,
    warnings,
  });
}
