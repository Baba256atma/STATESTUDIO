/**
 * E2:67 / E2:68 — Detect rapid object remount cycles (same id within 3 seconds).
 */

import { getSceneRemountContext } from "./sceneRemountContext";

type MountRecord = {
  mountedAt: number;
  unmountedAt: number | null;
  reactKey: string;
  source: string;
};

const lifecycleByObjectId = new Map<string, MountRecord[]>();
const STRICT_MODE_REMount_THRESHOLD_MS = 120;

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

export type ObjectRemountTrace = {
  objectId: string;
  reactKey: string;
  reason: string;
  source: string;
  elapsedMs: number;
  previousKey?: string;
  nextKey?: string;
  parentSignature?: string;
  visibleObjectsSignature?: string;
  selectedObjectId?: string | null;
  viewMode?: string | null;
  stack?: string;
};

export function recordObjectMount(input: {
  objectId: string;
  reactKey: string;
  source: string;
}): ObjectRemountTrace | null {
  if (!isDev()) return null;
  const now = Date.now();
  const history = lifecycleByObjectId.get(input.objectId) ?? [];
  const last = history[history.length - 1];
  if (last && last.unmountedAt != null) {
    const elapsedMs = now - last.unmountedAt;
    if (elapsedMs <= STRICT_MODE_REMount_THRESHOLD_MS) {
      history.push({ mountedAt: now, unmountedAt: null, reactKey: input.reactKey, source: input.source });
      lifecycleByObjectId.set(input.objectId, history.slice(-8));
      return null;
    }
    if (elapsedMs <= 3000) {
      const ctx = getSceneRemountContext();
      return {
        objectId: input.objectId,
        reactKey: input.reactKey,
        reason: "rapid_remount",
        source: input.source,
        elapsedMs,
        previousKey: ctx.previousKey ?? last.reactKey,
        nextKey: ctx.nextKey ?? input.reactKey,
        parentSignature: ctx.parentSignature,
        visibleObjectsSignature: ctx.visibleObjectsSignature,
        selectedObjectId: ctx.selectedObjectId,
        viewMode: ctx.viewMode,
        stack: new Error("Object remount trace").stack,
      };
    }
  }
  history.push({ mountedAt: now, unmountedAt: null, reactKey: input.reactKey, source: input.source });
  lifecycleByObjectId.set(input.objectId, history.slice(-8));
  return null;
}

export function recordObjectUnmount(input: {
  objectId: string;
  reactKey: string;
  source: string;
}): void {
  if (!isDev()) return;
  const now = Date.now();
  const history = lifecycleByObjectId.get(input.objectId) ?? [];
  const last = history[history.length - 1];
  if (last && last.unmountedAt == null) {
    last.unmountedAt = now;
    return;
  }
  history.push({ mountedAt: now, unmountedAt: now, reactKey: input.reactKey, source: input.source });
  lifecycleByObjectId.set(input.objectId, history.slice(-8));
}

export function resetObjectRemountDetectorForTests(): void {
  lifecycleByObjectId.clear();
}
