"use client";

/**
 * STAGE-2D:6V — live Stage mesh positions for connection/label sync.
 * Objects publish lerped world-local positions; connections consume them.
 */

type PositionTuple = readonly [number, number, number];

const positions = new Map<string, PositionTuple>();

export function publishExecutiveStage2DLivePosition(
  objectId: string,
  position: PositionTuple,
): void {
  positions.set(
    objectId,
    Object.freeze([position[0], position[1], position[2]] as const),
  );
}

export function clearExecutiveStage2DLivePosition(objectId: string): void {
  positions.delete(objectId);
}

export function readExecutiveStage2DLivePosition(
  objectId: string,
): PositionTuple | null {
  return positions.get(objectId) ?? null;
}

export function resolveExecutiveStage2DVisualAttachmentPosition(
  objectId: string,
  fallback: PositionTuple,
): PositionTuple {
  return positions.get(objectId) ?? fallback;
}
