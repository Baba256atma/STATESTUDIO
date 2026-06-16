/**
 * Global Scene Panel reset — position-aware reclick support.
 *
 * Evaluates reset against effective object positions (visual + scene channels),
 * not last action signature.
 */

import { normalizeExecutiveObjectLayout } from "../composition/normalizeExecutiveObjectLayout.ts";
import type { SceneJson } from "../../sceneTypes.ts";

export const GLOBAL_RESET_RECLICK_FIXED_TAG = "[GLOBAL_RESET_RECLICK_FIXED]" as const;
export const GLOBAL_RESET_APPLIED_LOG = "[GLOBAL_RESET_APPLIED]" as const;
export const GLOBAL_RESET_NOOP_LOG = "[GLOBAL_RESET_NOOP_ALREADY_GLOBAL]" as const;

const POSITION_EPSILON = 0.05;

let globalResetGeneration = 0;
let lastAppliedGlobalResetGeneration = -1;

export type GlobalLayoutResolveOptions = {
  domainId?: string | null;
  scenePurpose?: string | null;
  centerObjectId?: string | null;
};

export type GlobalResetPositionContext = {
  currentLayoutPositions?: Record<string, [number, number, number]>;
  positionOverrides?: Record<string, { position?: [number, number, number] }>;
};

function readObjectId(obj: unknown, index: number): string {
  const record = obj as { id?: unknown; name?: unknown; type?: unknown } | null;
  return String(record?.id ?? record?.name ?? `${record?.type ?? "obj"}:${index}`);
}

function readTransformPos(obj: unknown): [number, number, number] | null {
  const record = obj as { transform?: { pos?: unknown } } | null;
  const source = record?.transform?.pos;
  if (!Array.isArray(source) || source.length < 3) return null;
  return [Number(source[0]) || 0, Number(source[1]) || 0, Number(source[2]) || 0];
}

function readPositionField(obj: unknown): [number, number, number] | null {
  const record = obj as { position?: unknown; pos?: unknown } | null;
  const source = Array.isArray(record?.position) && record.position.length >= 3
    ? record.position
    : Array.isArray(record?.pos) && record.pos.length >= 3
      ? record.pos
      : null;
  if (!source) return null;
  return [Number(source[0]) || 0, Number(source[1]) || 0, Number(source[2]) || 0];
}

function readTransformPosition(obj: unknown, index: number): [number, number, number] {
  return (
    readTransformPos(obj) ??
    readPositionField(obj) ?? [index * 1.8 - 1.8, 0, 0]
  );
}

function readLayoutPosition(
  objectId: string,
  obj: unknown,
  layoutPositions?: Record<string, [number, number, number]>
): [number, number, number] | null {
  if (!layoutPositions) return null;
  const record = obj as { id?: unknown; name?: unknown } | null;
  return (
    layoutPositions[objectId] ??
    (record?.id != null ? layoutPositions[String(record.id)] : undefined) ??
    (record?.name != null ? layoutPositions[String(record.name)] : undefined) ??
    null
  );
}

function resolveDefaultObjectPosition(
  obj: unknown,
  index: number,
  layoutPositions?: Record<string, [number, number, number]>
): [number, number, number] {
  const objectId = readObjectId(obj, index);
  const layoutPosition = readLayoutPosition(objectId, obj, layoutPositions);
  if (layoutPosition) return layoutPosition;
  return [index * 1.8 - 1.8, 0, 0];
}

function roundPosition(value: [number, number, number]): [number, number, number] {
  return [
    Math.round(value[0] * 100) / 100,
    Math.round(value[1] * 100) / 100,
    Math.round(value[2] * 100) / 100,
  ];
}

function positionsEqual(a: [number, number, number], b: [number, number, number]): boolean {
  return (
    Math.abs(a[0] - b[0]) <= POSITION_EPSILON &&
    Math.abs(a[1] - b[1]) <= POSITION_EPSILON &&
    Math.abs(a[2] - b[2]) <= POSITION_EPSILON
  );
}

function readSceneMeta(sceneJson: unknown): GlobalLayoutResolveOptions {
  const meta = (sceneJson as { meta?: Record<string, unknown> } | null)?.meta;
  return {
    domainId: typeof meta?.domain === "string" ? meta.domain : null,
    scenePurpose:
      (typeof meta?.demo_id === "string" && meta.demo_id) ||
      (typeof meta?.scenePurpose === "string" && meta.scenePurpose) ||
      null,
  };
}

/** Canonical template/global layout — independent of user-moved scene transforms. */
export function resolveCanonicalGlobalLayoutPositions(
  sceneJson: unknown,
  options?: GlobalLayoutResolveOptions
): Record<string, [number, number, number]> {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  if (!Array.isArray(objects) || !objects.length) return {};

  const meta = readSceneMeta(sceneJson);
  const structuralObjects = objects.map((obj, index) => ({
    ...(obj as object),
    id: readObjectId(obj, index),
    position: undefined,
    pos: undefined,
    transform: {
      ...((obj as { transform?: object }).transform ?? {}),
      pos: [index * 1.8 - 1.8, 0, 0] as [number, number, number],
    },
  }));

  const layout = normalizeExecutiveObjectLayout(structuralObjects, {
    domainId: options?.domainId ?? meta.domainId ?? null,
    scenePurpose: options?.scenePurpose ?? meta.scenePurpose ?? null,
    centerObjectId: options?.centerObjectId ?? null,
  });

  return layout.positions as Record<string, [number, number, number]>;
}

/** Matches AnimatableObject render priority: override → layout → transform channels. */
export function readEffectiveObjectPosition(
  obj: unknown,
  index: number,
  context?: GlobalResetPositionContext
): [number, number, number] {
  const objectId = readObjectId(obj, index);
  const overridePosition = context?.positionOverrides?.[objectId]?.position;
  if (overridePosition) return roundPosition(overridePosition);

  const layoutPosition = readLayoutPosition(objectId, obj, context?.currentLayoutPositions);
  if (layoutPosition) return roundPosition(layoutPosition);

  return roundPosition(readTransformPosition(obj, index));
}

function objectHasPositionDrift(
  obj: unknown,
  index: number,
  target: [number, number, number],
  context?: GlobalResetPositionContext
): boolean {
  const effective = readEffectiveObjectPosition(obj, index, context);
  if (!positionsEqual(effective, target)) return true;

  const transformPos = readTransformPos(obj);
  if (transformPos && !positionsEqual(roundPosition(transformPos), target)) return true;

  const positionField = readPositionField(obj);
  if (positionField && !positionsEqual(roundPosition(positionField), target)) return true;

  return false;
}

export function buildCurrentSceneObjectPositionSignature(
  sceneJson: unknown,
  context?: GlobalResetPositionContext
): string {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  if (!Array.isArray(objects) || !objects.length) return "empty";
  return objects
    .map((obj, index) => {
      const id = readObjectId(obj, index);
      const pos = readEffectiveObjectPosition(obj, index, context);
      return `${id}:${pos.join(",")}`;
    })
    .sort()
    .join("|");
}

export function buildDefaultSceneObjectPositionSignature(
  sceneJson: unknown,
  defaultLayoutPositions?: Record<string, [number, number, number]>
): string {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  if (!Array.isArray(objects) || !objects.length) return "empty";
  return objects
    .map((obj, index) => {
      const id = readObjectId(obj, index);
      const pos = roundPosition(resolveDefaultObjectPosition(obj, index, defaultLayoutPositions));
      return `${id}:${pos.join(",")}`;
    })
    .sort()
    .join("|");
}

export function sceneObjectsNeedGlobalReset(
  sceneJson: unknown,
  defaultLayoutPositions?: Record<string, [number, number, number]>,
  context?: GlobalResetPositionContext
): boolean {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  if (!Array.isArray(objects) || !objects.length) return false;

  for (let index = 0; index < objects.length; index += 1) {
    const obj = objects[index];
    const target = roundPosition(resolveDefaultObjectPosition(obj, index, defaultLayoutPositions));
    if (objectHasPositionDrift(obj, index, target, context)) return true;
  }
  return false;
}

export function bumpGlobalResetGeneration(): number {
  globalResetGeneration += 1;
  return globalResetGeneration;
}

export function getGlobalResetGenerationForTests(): number {
  return globalResetGeneration;
}

/** Generation replay dedupe only — position drift is evaluated separately. */
export function shouldApplyGlobalResetTransition(input: {
  resetGeneration: number;
  needsReset: boolean;
}): boolean {
  if (!input.needsReset) return false;
  if (lastAppliedGlobalResetGeneration === input.resetGeneration) return false;
  lastAppliedGlobalResetGeneration = input.resetGeneration;
  return true;
}

export function buildGlobalResetTransitionSignature(
  transitionSignature: string,
  resetGeneration: number
): string {
  return `${transitionSignature}:global-reset:${resetGeneration}`;
}

export function restoreSceneObjectsToGlobalLayout(
  sceneJson: SceneJson | null,
  defaultLayoutPositions?: Record<string, [number, number, number]>
): SceneJson | null {
  if (!sceneJson?.scene || !Array.isArray(sceneJson.scene.objects)) return sceneJson;

  let changed = false;
  const objects = sceneJson.scene.objects.map((obj, index) => {
    const target = roundPosition(resolveDefaultObjectPosition(obj, index, defaultLayoutPositions));
    const transformPos = readTransformPos(obj);
    const positionField = readPositionField(obj);
    const unchanged =
      (!transformPos || positionsEqual(roundPosition(transformPos), target)) &&
      (!positionField || positionsEqual(roundPosition(positionField), target));
    if (unchanged) return obj;
    changed = true;
    return {
      ...obj,
      position: target,
      pos: target,
      transform: {
        ...((obj.transform as object | undefined) ?? {}),
        pos: target,
      },
    };
  });

  if (!changed) return sceneJson;
  return {
    ...sceneJson,
    scene: {
      ...sceneJson.scene,
      objects,
    },
  };
}

export function logGlobalResetApplied(detail: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(GLOBAL_RESET_APPLIED_LOG, detail);
}

export function logGlobalResetNoopAlreadyGlobal(detail: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(GLOBAL_RESET_NOOP_LOG, detail);
}

export function resetGlobalSceneResetRuntimeForTests(): void {
  globalResetGeneration = 0;
  lastAppliedGlobalResetGeneration = -1;
}
