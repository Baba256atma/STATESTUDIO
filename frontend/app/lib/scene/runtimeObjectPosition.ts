/**
 * Unified runtime object position resolver for scene objects and connection endpoints.
 */

import type { SceneObject } from "../sceneTypes.ts";
import { resolveStableObjectId } from "./objectRegistryRuntime.ts";
import { isValidScenePosition, type ScenePosition } from "./topology/topologyScenePositioning.ts";
import { logRuntimeObjectPositionProvider } from "./runtimeObjectPositionDevLog.ts";
import {
  logRelationshipPositionCacheBuilt,
  logRelationshipPositionCacheFallback,
  logRelationshipPositionCacheHit,
  logRelationshipPositionCacheMiss,
} from "./relationshipPositionCacheDevLog.ts";

export type RuntimeObjectPositionProvider =
  | "topologyRuntime.position"
  | "layoutEngine.position"
  | "sceneObject.position"
  | "sceneObject.transform.pos"
  | "fallback.position";

export type RuntimeObjectPositionContext = {
  topologyRuntimeLayoutPositions?: Record<string, [number, number, number]>;
  layoutPositions?: Record<string, [number, number, number]>;
};

export type RuntimeObjectPositionInput = {
  objectId: string;
  sceneObjects: readonly any[];
  topologyRuntimeLayoutPositions?: Record<string, [number, number, number]>;
  layoutPositions?: Record<string, [number, number, number]>;
  logProvider?: boolean;
};

export type RuntimeObjectPositionResult = {
  position: ScenePosition;
  provider: RuntimeObjectPositionProvider;
};

export type RuntimeObjectPositionLookupCache = Readonly<{
  signature: string;
  lookup: ReadonlyMap<string, RuntimeObjectPositionResult>;
  sceneObjectCount: number;
}>;

function normalizeLookupKey(value: unknown): string | null {
  if (value == null) return null;
  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function collectObjectAliasKeysFromObject(object: any, index: number): string[] {
  const keys = new Set<string>();
  const stableId = resolveStableObjectId(object as SceneObject, index);
  keys.add(stableId);

  const id = normalizeLookupKey(object?.id);
  if (id) keys.add(id);
  const name = normalizeLookupKey(object?.name);
  if (name) keys.add(name);
  const label = normalizeLookupKey((object as { label?: string }).label);
  if (label) keys.add(label);
  const objectId = normalizeLookupKey((object as { objectId?: string }).objectId);
  if (objectId) keys.add(objectId);

  return [...keys];
}

function readTuplePosition(tuple: readonly number[] | undefined): ScenePosition | null {
  if (!tuple || tuple.length < 3) return null;
  const position = {
    x: Number(tuple[0]),
    y: Number(tuple[1]),
    z: Number(tuple[2]),
  };
  return isValidScenePosition(position) ? position : null;
}

function collectObjectAliasKeys(objectId: string, sceneObjects: readonly any[]): string[] {
  const keys = new Set<string>();
  const normalized = String(objectId ?? "").trim();
  if (normalized) keys.add(normalized);

  const index = sceneObjects.findIndex((object, objectIndex) => {
    const stableId = resolveStableObjectId(object as SceneObject, objectIndex);
    const label = (object as { label?: string }).label;
    return (
      stableId === normalized ||
      (object?.id != null && String(object.id) === normalized) ||
      (object?.name != null && String(object.name) === normalized) ||
      (label != null && String(label) === normalized)
    );
  });

  if (index < 0) return [...keys];

  const object = sceneObjects[index];
  const stableId = resolveStableObjectId(object as SceneObject, index);
  keys.add(stableId);
  if (object?.id != null) keys.add(String(object.id));
  if (object?.name != null) keys.add(String(object.name));
  const label = (object as { label?: string }).label;
  if (label != null) keys.add(String(label));

  return [...keys];
}

function readPositionFromMap(
  map: Record<string, [number, number, number]> | undefined,
  aliasKeys: readonly string[]
): ScenePosition | null {
  if (!map) return null;
  for (const key of aliasKeys) {
    const position = readTuplePosition(map[key]);
    if (position) return position;
  }
  return null;
}

function readSceneObjectJsonPosition(
  object: any
): { position: ScenePosition; provider: RuntimeObjectPositionProvider } | null {
  if (!object) return null;

  const candidates: Array<{ value: unknown; provider: RuntimeObjectPositionProvider }> = [
    { value: object.position, provider: "sceneObject.position" },
    { value: object.transform?.pos, provider: "sceneObject.transform.pos" },
    { value: object.pos, provider: "sceneObject.position" },
  ];

  for (const candidate of candidates) {
    const value = candidate.value;
    if (Array.isArray(value) && value.length >= 3) {
      const position = {
        x: Number(value[0]) || 0,
        y: Number(value[1]) || 0,
        z: Number(value[2]) || 0,
      };
      if (isValidScenePosition(position)) {
        return { position, provider: candidate.provider };
      }
    }
    if (value && typeof value === "object" && "x" in value && "y" in value && "z" in value) {
      const position = {
        x: Number((value as { x: unknown }).x) || 0,
        y: Number((value as { y: unknown }).y) || 0,
        z: Number((value as { z: unknown }).z) || 0,
      };
      if (isValidScenePosition(position)) {
        return { position, provider: candidate.provider };
      }
    }
  }

  return null;
}

function findSceneObjectIndex(objectId: string, sceneObjects: readonly any[]): number {
  const normalized = String(objectId ?? "").trim();
  return sceneObjects.findIndex((object, index) => {
    const stableId = resolveStableObjectId(object as SceneObject, index);
    const label = (object as { label?: string }).label;
    return (
      stableId === normalized ||
      (object?.id != null && String(object.id) === normalized) ||
      (object?.name != null && String(object.name) === normalized) ||
      (label != null && String(label) === normalized)
    );
  });
}

function fallbackPositionFromIndex(index: number, total: number): ScenePosition {
  const unit = total > 1 ? index / Math.max(1, total - 1) : 0;
  const angle = unit * Math.PI * 2;
  const radius = 2.2;
  return {
    x: Math.cos(angle) * radius,
    y: 0,
    z: Math.sin(angle) * radius,
  };
}

const BASELINE_POSITIONS: Record<string, [number, number, number]> = {
  obj_inventory: [-1.6, 0, 0],
  obj_delivery: [0, 0, 0],
  obj_risk_zone: [1.6, 0, 0],
};

function resolveRuntimeObjectPositionAtIndex(input: {
  index: number;
  sceneObjects: readonly any[];
  topologyRuntimeLayoutPositions?: Record<string, [number, number, number]>;
  layoutPositions?: Record<string, [number, number, number]>;
  objectId?: string;
  logProvider?: boolean;
}): RuntimeObjectPositionResult {
  const object = input.sceneObjects[input.index];
  const aliasKeys = collectObjectAliasKeysFromObject(object, input.index);
  const objectId = input.objectId ?? aliasKeys[0] ?? resolveStableObjectId(object as SceneObject, input.index);

  const topologyPosition = readPositionFromMap(input.topologyRuntimeLayoutPositions, aliasKeys);
  if (topologyPosition) {
    const result = { position: topologyPosition, provider: "topologyRuntime.position" as const };
    if (input.logProvider !== false) {
      logRuntimeObjectPositionProvider({ objectId, provider: result.provider, position: result.position });
    }
    return result;
  }

  const layoutPosition = readPositionFromMap(input.layoutPositions, aliasKeys);
  if (layoutPosition) {
    const result = { position: layoutPosition, provider: "layoutEngine.position" as const };
    if (input.logProvider !== false) {
      logRuntimeObjectPositionProvider({ objectId, provider: result.provider, position: result.position });
    }
    return result;
  }

  const jsonPosition = readSceneObjectJsonPosition(object);
  if (jsonPosition) {
    if (input.logProvider !== false) {
      logRuntimeObjectPositionProvider({
        objectId,
        provider: jsonPosition.provider,
        position: jsonPosition.position,
      });
    }
    return jsonPosition;
  }

  for (const aliasKey of aliasKeys) {
    if (BASELINE_POSITIONS[aliasKey]) {
      const [x, y, z] = BASELINE_POSITIONS[aliasKey];
      const result = {
        position: { x, y, z },
        provider: "fallback.position" as const,
      };
      if (input.logProvider !== false) {
        logRuntimeObjectPositionProvider({ objectId, provider: result.provider, position: result.position });
      }
      return result;
    }
  }

  const result = {
    position: fallbackPositionFromIndex(input.index, input.sceneObjects.length),
    provider: "fallback.position" as const,
  };
  if (input.logProvider !== false) {
    logRuntimeObjectPositionProvider({ objectId, provider: result.provider, position: result.position });
  }
  return result;
}

export function buildRuntimeObjectPositionLookupSignature(
  sceneObjects: readonly any[],
  context?: RuntimeObjectPositionContext
): string {
  const objectSignature = sceneObjects
    .map((object, index) => {
      const stableId = resolveStableObjectId(object as SceneObject, index);
      return JSON.stringify({
        stableId,
        id: object?.id ?? null,
        name: object?.name ?? null,
        label: (object as { label?: string }).label ?? null,
        objectId: (object as { objectId?: string }).objectId ?? null,
        position: object?.position ?? null,
        pos: object?.pos ?? null,
        transform: object?.transform ?? null,
      });
    })
    .join("|");
  return [
    objectSignature || "empty",
    JSON.stringify(context?.topologyRuntimeLayoutPositions ?? null),
    JSON.stringify(context?.layoutPositions ?? null),
  ].join("::");
}

export function buildRuntimeObjectPositionLookupCache(input: {
  sceneObjects: readonly any[];
  context?: RuntimeObjectPositionContext;
  logBuilt?: boolean;
}): RuntimeObjectPositionLookupCache {
  const signature = buildRuntimeObjectPositionLookupSignature(input.sceneObjects, input.context);
  const lookup = new Map<string, RuntimeObjectPositionResult>();

  for (let index = 0; index < input.sceneObjects.length; index += 1) {
    const resolved = resolveRuntimeObjectPositionAtIndex({
      index,
      sceneObjects: input.sceneObjects,
      topologyRuntimeLayoutPositions: input.context?.topologyRuntimeLayoutPositions,
      layoutPositions: input.context?.layoutPositions,
      logProvider: false,
    });
    for (const aliasKey of collectObjectAliasKeysFromObject(input.sceneObjects[index], index)) {
      if (!lookup.has(aliasKey)) {
        lookup.set(aliasKey, resolved);
      }
    }
  }

  for (const [baselineKey, tuple] of Object.entries(BASELINE_POSITIONS)) {
    if (lookup.has(baselineKey)) continue;
    const position = readTuplePosition(tuple);
    if (!position) continue;
    lookup.set(baselineKey, {
      position,
      provider: "fallback.position",
    });
  }

  if (input.logBuilt !== false) {
    logRelationshipPositionCacheBuilt({
      signature,
      objectCount: input.sceneObjects.length,
      aliasCount: lookup.size,
    });
  }

  return Object.freeze({
    signature,
    lookup,
    sceneObjectCount: input.sceneObjects.length,
  });
}

export function getRuntimeObjectPositionFromLookup(
  cache: RuntimeObjectPositionLookupCache | null | undefined,
  objectId: string
): RuntimeObjectPositionResult | null {
  const normalized = normalizeLookupKey(objectId);
  if (!cache || !normalized) return null;
  return cache.lookup.get(normalized) ?? null;
}

export function resolveRuntimeObjectPositionWithLookup(input: {
  objectId: string;
  sceneObjects: readonly any[];
  topologyRuntimeLayoutPositions?: Record<string, [number, number, number]>;
  layoutPositions?: ContextLayoutPositions;
  positionLookup?: RuntimeObjectPositionLookupCache | null;
  logProvider?: boolean;
}): RuntimeObjectPositionResult {
  const objectId = String(input.objectId ?? "").trim();
  const cached = getRuntimeObjectPositionFromLookup(input.positionLookup, objectId);
  if (cached) {
    logRelationshipPositionCacheHit(objectId);
    if (input.logProvider !== false) {
      logRuntimeObjectPositionProvider({
        objectId,
        provider: cached.provider,
        position: cached.position,
      });
    }
    return cached;
  }

  if (input.positionLookup) {
    logRelationshipPositionCacheMiss(objectId);
    logRelationshipPositionCacheFallback(objectId);
  }

  return resolveRuntimeObjectPosition({
    objectId,
    sceneObjects: input.sceneObjects,
    topologyRuntimeLayoutPositions: input.topologyRuntimeLayoutPositions,
    layoutPositions: input.layoutPositions,
    logProvider: input.logProvider,
  });
}

type ContextLayoutPositions = Record<string, [number, number, number]>;

export function resolveRuntimeObjectPositionFromContextWithLookup(
  objectId: string,
  sceneObjects: readonly any[],
  context?: RuntimeObjectPositionContext,
  positionLookup?: RuntimeObjectPositionLookupCache | null,
  logProvider = true
): RuntimeObjectPositionResult {
  return resolveRuntimeObjectPositionWithLookup({
    objectId,
    sceneObjects,
    topologyRuntimeLayoutPositions: context?.topologyRuntimeLayoutPositions,
    layoutPositions: context?.layoutPositions,
    positionLookup,
    logProvider,
  });
}

function hashUnit(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

export function resolveRuntimeObjectPosition(
  input: RuntimeObjectPositionInput
): RuntimeObjectPositionResult {
  const objectId = String(input.objectId ?? "").trim();
  const aliasKeys = collectObjectAliasKeys(objectId, input.sceneObjects);

  const topologyPosition = readPositionFromMap(input.topologyRuntimeLayoutPositions, aliasKeys);
  if (topologyPosition) {
    const result = { position: topologyPosition, provider: "topologyRuntime.position" as const };
    if (input.logProvider !== false) {
      logRuntimeObjectPositionProvider({ objectId, provider: result.provider, position: result.position });
    }
    return result;
  }

  const layoutPosition = readPositionFromMap(input.layoutPositions, aliasKeys);
  if (layoutPosition) {
    const result = { position: layoutPosition, provider: "layoutEngine.position" as const };
    if (input.logProvider !== false) {
      logRuntimeObjectPositionProvider({ objectId, provider: result.provider, position: result.position });
    }
    return result;
  }

  const matchedIndex = findSceneObjectIndex(objectId, input.sceneObjects);
  const matchedObject = matchedIndex >= 0 ? input.sceneObjects[matchedIndex] : undefined;
  const jsonPosition = readSceneObjectJsonPosition(matchedObject);
  if (jsonPosition) {
    if (input.logProvider !== false) {
      logRuntimeObjectPositionProvider({
        objectId,
        provider: jsonPosition.provider,
        position: jsonPosition.position,
      });
    }
    return jsonPosition;
  }

  if (BASELINE_POSITIONS[objectId]) {
    const [x, y, z] = BASELINE_POSITIONS[objectId];
    const result = {
      position: { x, y, z },
      provider: "fallback.position" as const,
    };
    if (input.logProvider !== false) {
      logRuntimeObjectPositionProvider({ objectId, provider: result.provider, position: result.position });
    }
    return result;
  }

  if (matchedIndex >= 0) {
    const result = {
      position: fallbackPositionFromIndex(matchedIndex, input.sceneObjects.length),
      provider: "fallback.position" as const,
    };
    if (input.logProvider !== false) {
      logRuntimeObjectPositionProvider({ objectId, provider: result.provider, position: result.position });
    }
    return result;
  }

  const unit = hashUnit(objectId);
  const angle = unit * Math.PI * 2;
  const radius = 2.2;
  const result = {
    position: { x: Math.cos(angle) * radius, y: 0, z: Math.sin(angle) * radius },
    provider: "fallback.position" as const,
  };
  if (input.logProvider !== false) {
    logRuntimeObjectPositionProvider({ objectId, provider: result.provider, position: result.position });
  }
  return result;
}

export function resolveRuntimeObjectPositionFromContext(
  objectId: string,
  sceneObjects: readonly any[],
  context?: RuntimeObjectPositionContext,
  logProvider = true
): RuntimeObjectPositionResult {
  return resolveRuntimeObjectPosition({
    objectId,
    sceneObjects,
    topologyRuntimeLayoutPositions: context?.topologyRuntimeLayoutPositions,
    layoutPositions: context?.layoutPositions,
    logProvider,
  });
}
