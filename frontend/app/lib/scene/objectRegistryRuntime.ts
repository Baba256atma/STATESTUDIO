/**
 * E2:67 — Stable scene object identity for React keys and runtime lookup.
 */

import type { SceneObject } from "../sceneTypes";

type RegistryEntry = {
  stableId: string;
  object: SceneObject;
  contentSignature: string;
};

const registryByStableId = new Map<string, RegistryEntry>();
const stableIdByContentSignature = new Map<string, string>();

function normalizeId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function hashStableObjectFingerprint(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function buildObjectIdentityFingerprint(object: SceneObject): string {
  return JSON.stringify({
    type: object?.type ?? null,
    label: (object as any)?.label ?? null,
    role: (object as any)?.role ?? null,
    category: (object as any)?.category ?? null,
    domain: (object as any)?.domain ?? null,
    canonical_name: (object as any)?.canonical_name ?? null,
    display_label: (object as any)?.display_label ?? null,
  });
}

/** Canonical React key: id → name → semantic fingerprint. */
export function resolveStableObjectId(object: SceneObject, index: number): string {
  void index;
  const id = normalizeId(object?.id);
  if (id) return id;
  const name = normalizeId(object?.name);
  if (name) return name;
  const label = normalizeId((object as any)?.label);
  if (label) return label;
  const fingerprint = buildObjectIdentityFingerprint(object);
  return `${object?.type ?? "obj"}:${hashStableObjectFingerprint(fingerprint)}`;
}

export function buildSceneObjectContentSignature(object: SceneObject, index: number): string {
  return JSON.stringify({
    stableId: resolveStableObjectId(object, index),
    type: object?.type ?? null,
    name: object?.name ?? null,
    id: object?.id ?? null,
  });
}

export function buildSceneObjectsRegistrySignature(objects: SceneObject[]): string {
  if (!Array.isArray(objects) || objects.length === 0) return "empty";
  return objects
    .map((object, index) => buildSceneObjectContentSignature(object, index))
    .join("|");
}

function shallowSceneObjectVisualEqual(a: SceneObject, b: SceneObject): boolean {
  return (
    a?.id === b?.id &&
    a?.name === b?.name &&
    a?.type === b?.type &&
    JSON.stringify(a?.position ?? null) === JSON.stringify(b?.position ?? null) &&
    JSON.stringify(a?.material ?? null) === JSON.stringify(b?.material ?? null) &&
    JSON.stringify(a?.tags ?? null) === JSON.stringify(b?.tags ?? null)
  );
}

/**
 * Preserve object references and stable ids across scene array recreation.
 * Objects with identical stable ids reuse the prior runtime instance when visually equal.
 */
export function syncSceneObjectRegistry(objects: SceneObject[]): SceneObject[] {
  if (!Array.isArray(objects) || objects.length === 0) {
    return [];
  }

  return objects.map((object, index) => {
    const stableId = resolveStableObjectId(object, index);
    const contentSignature = buildSceneObjectContentSignature(object, index);
    stableIdByContentSignature.set(contentSignature, stableId);

    const existing = registryByStableId.get(stableId);
    if (existing) {
      if (existing.object === object) {
        return existing.object;
      }
      if (shallowSceneObjectVisualEqual(existing.object, object)) {
        return existing.object;
      }
    }

    registryByStableId.set(stableId, { stableId, object, contentSignature });
    return object;
  });
}

export function resetSceneObjectRegistryForTests(): void {
  registryByStableId.clear();
  stableIdByContentSignature.clear();
}
