import type { Object3D } from "three";

/** Minimum invisible hit-proxy scale for standard executive meshes. */
export const OBJECT_SELECTION_HIT_PROXY_BASE_SCALE = 1.3;
/** Maximum invisible hit-proxy scale for dense or zoomed-out scenes. */
export const OBJECT_SELECTION_HIT_PROXY_MAX_SCALE = 1.55;
/** One pointer gesture may commit only one object id within this window. */
export const POINTER_SELECTION_GATE_MS = 120;

export type ObjectClickEventRef = {
  eventId: string;
  objectId: string;
  timestamp: number;
};

export type PointerSelectionGateEntry = {
  clickEventId: string;
  pointerId: number;
  timeStamp: number;
  acceptedObjectId: string;
  acceptedAt: number;
};

type PointerEventLike = {
  pointerId?: number;
  timeStamp?: number;
  clientX?: number;
  clientY?: number;
  nativeEvent?: {
    pointerId?: number;
    timeStamp?: number;
    clientX?: number;
    clientY?: number;
  };
};

let activePointerSelectionGate: PointerSelectionGateEntry | null = null;

export function getPointerSelectionGate(): PointerSelectionGateEntry | null {
  return activePointerSelectionGate;
}

export function clearPointerSelectionGateForTests(): void {
  activePointerSelectionGate = null;
}

export function parseClickEventId(clickEventId: string): { pointerId: number; timeStamp: number } {
  const [pointerIdRaw, timeStampRaw] = clickEventId.split(":");
  return {
    pointerId: Number(pointerIdRaw) || 0,
    timeStamp: Number(timeStampRaw) || 0,
  };
}

export function readPointerEventMeta(event: PointerEventLike): {
  pointerId: number;
  timeStamp: number;
  clickEventId: string;
} {
  const pointerId = event.pointerId ?? event.nativeEvent?.pointerId ?? 0;
  const timeStamp = event.timeStamp ?? event.nativeEvent?.timeStamp ?? Date.now();
  const clickEventId = buildObjectClickEventId(event);
  return { pointerId, timeStamp, clickEventId };
}

export function tryAcceptPointerObjectSelection(
  objectId: string,
  event: PointerEventLike
): { accepted: true; clickEventId: string } | { accepted: false; reason: string; clickEventId: string } {
  const { pointerId, timeStamp, clickEventId } = readPointerEventMeta(event);
  const normalizedObjectId = objectId.trim();
  if (!normalizedObjectId) {
    return { accepted: false, reason: "invalid_object_id", clickEventId };
  }

  const gate = activePointerSelectionGate;
  if (gate && gate.clickEventId === clickEventId) {
    if (gate.acceptedObjectId === normalizedObjectId) {
      return { accepted: false, reason: "duplicate_same_object", clickEventId };
    }
    logObjectClickDiagnostic("[Nexora][MultiHitObjectClickBlocked]", {
      acceptedObjectId: gate.acceptedObjectId,
      blockedObjectId: normalizedObjectId,
      pointerId,
      timeStamp,
    });
    return { accepted: false, reason: "multi_hit_blocked", clickEventId };
  }

  activePointerSelectionGate = {
    clickEventId,
    pointerId,
    timeStamp,
    acceptedObjectId: normalizedObjectId,
    acceptedAt: Date.now(),
  };
  return { accepted: true, clickEventId };
}

export function shouldBlockPointerMissAfterObjectClick(now = Date.now()): boolean {
  const gate = activePointerSelectionGate;
  if (!gate) return false;
  return now - gate.acceptedAt <= POINTER_SELECTION_GATE_MS;
}

export function buildObjectClickEventId(event: {
  pointerId?: number;
  timeStamp?: number;
  nativeEvent?: { pointerId?: number; timeStamp?: number };
}): string {
  const pointerId = event.pointerId ?? event.nativeEvent?.pointerId ?? 0;
  const timeStamp = event.timeStamp ?? event.nativeEvent?.timeStamp ?? Date.now();
  return `${pointerId}:${timeStamp}`;
}

export function sortRaycastIntersectionsByDistance<T extends { distance?: number }>(
  intersections: readonly T[]
): T[] {
  return [...intersections].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
}

export function isNearestRaycastHit(event: {
  object?: Object3D;
  intersections?: Array<{ object: Object3D; distance?: number }>;
}): boolean {
  const intersections = event.intersections;
  if (!intersections?.length || !event.object) return true;
  const nearest = sortRaycastIntersectionsByDistance(intersections)[0]?.object;
  if (!nearest) return true;
  let hit: Object3D | null = event.object;
  while (hit) {
    if (hit === nearest) return true;
    hit = hit.parent;
  }
  return false;
}

export function isNearestSelectableObjectHit(
  event: {
    object?: Object3D;
    intersections?: Array<{ object: Object3D; distance?: number }>;
  },
  objectId: string
): boolean {
  const normalizedObjectId = objectId.trim();
  if (!normalizedObjectId) return false;
  const intersections = event.intersections;
  if (!intersections?.length) return false;
  const nearest = sortRaycastIntersectionsByDistance(intersections)[0]?.object;
  if (!nearest) return true;
  const nearestObjectId = resolveSelectableObjectIdFromObject3D(nearest);
  if (nearestObjectId) {
    return nearestObjectId === normalizedObjectId;
  }
  return isNearestRaycastHit(event);
}

export function resolveObjectSelectionHitProxyScale(input: {
  sceneObjectCount: number;
  workspaceViewMode?: "2D" | "3D" | string | null;
}): number {
  const densityBoost =
    input.sceneObjectCount >= 12 ? 0.15 : input.sceneObjectCount >= 6 ? 0.1 : input.sceneObjectCount >= 2 ? 0.05 : 0;
  const viewBoost = input.workspaceViewMode === "2D" ? 0.05 : 0;
  return Math.min(
    OBJECT_SELECTION_HIT_PROXY_MAX_SCALE,
    OBJECT_SELECTION_HIT_PROXY_BASE_SCALE + densityBoost + viewBoost
  );
}

export function resolveSelectableObjectIdFromObject3D(
  object: Object3D | null | undefined,
  readObjectId?: (node: Object3D) => string | null
): string | null {
  let node: Object3D | null | undefined = object;
  while (node) {
    const userDataId =
      typeof (node as { userData?: { objectId?: unknown } }).userData?.objectId === "string"
        ? String((node as { userData?: { objectId?: string } }).userData?.objectId).trim()
        : "";
    if (userDataId) return userDataId;
    if (readObjectId) {
      const resolved = readObjectId(node);
      if (resolved) return resolved;
    }
    node = node.parent;
  }
  return null;
}

export function logObjectClickDiagnostic(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  console.debug(label, payload);
}
