"use client";

/**
 * STAGE-2D:6V — live Stage mesh positions for connection/label sync.
 * Objects publish lerped world-local positions; connections consume them.
 */

type PositionTuple = readonly [number, number, number];

export type ExecutiveStageMotionLiveSample = Readonly<{
  position: PositionTuple;
  opacity: number;
  scale: number;
  visible: boolean;
}>;

const positions = new Map<string, PositionTuple>();
const motionSamples = new Map<string, ExecutiveStageMotionLiveSample>();

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
  motionSamples.delete(objectId);
}

export function publishExecutiveStageMotionLiveSample(
  objectId: string,
  sample: ExecutiveStageMotionLiveSample,
): void {
  motionSamples.set(
    objectId,
    Object.freeze({
      position: Object.freeze([
        sample.position[0],
        sample.position[1],
        sample.position[2],
      ] as const),
      opacity: sample.opacity,
      scale: sample.scale,
      visible: sample.visible,
    }),
  );
}

export function readExecutiveStageMotionLiveSamples(): Readonly<
  Record<string, ExecutiveStageMotionLiveSample>
> {
  return Object.freeze(
    Object.fromEntries(
      [...motionSamples.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([id, sample]) => [id, sample]),
    ),
  );
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
