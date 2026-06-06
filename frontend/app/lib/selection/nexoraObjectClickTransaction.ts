import type { Object3D } from "three";

export type ObjectClickEventRef = {
  eventId: string;
  objectId: string;
  timestamp: number;
};

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

export function logObjectClickDiagnostic(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  console.debug(label, payload);
}
