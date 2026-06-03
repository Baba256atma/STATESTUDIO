/**
 * Topology layout camera framing (pure, read-only).
 */

import { logTopologyCameraBrake } from "./topologyCameraDevLog.ts";
import { isValidScenePosition, type ScenePosition } from "./topologyScenePositioning.ts";

export const DEFAULT_TOPOLOGY_CAMERA_PADDING = 6;
export const MIN_CAMERA_RADIUS = 10;

export type TopologyCameraFrame = {
  center: ScenePosition;
  radius: number;
  cameraPosition: ScenePosition;
  target: ScenePosition;
  valid: boolean;
  diagnostics: {
    positionCount: number;
    validPositionCount: number;
    warnings: string[];
  };
};

function clonePosition(position: ScenePosition): ScenePosition {
  return { x: position.x, y: position.y, z: position.z };
}

function distance3d(a: ScenePosition, b: ScenePosition): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function buildTopologyCameraSignature(
  bindings: readonly {
    objectId: string;
    finalPosition?: ScenePosition;
  }[]
): string {
  return bindings
    .map((binding) => {
      const position = binding.finalPosition;
      return `${binding.objectId}:${position?.x ?? "x"}:${position?.y ?? "y"}:${position?.z ?? "z"}`;
    })
    .join("|");
}

export function computeTopologyCameraFrame(input: {
  positions: readonly ScenePosition[];
  padding?: number;
}): TopologyCameraFrame {
  const warnings: string[] = [];
  const positions = Array.isArray(input.positions) ? input.positions : [];
  const padding = Number.isFinite(input.padding) ? Number(input.padding) : DEFAULT_TOPOLOGY_CAMERA_PADDING;

  if (positions.length === 0) {
    logTopologyCameraBrake("No positions provided");
    warnings.push("No positions provided");
    return {
      center: { x: 0, y: 0, z: 0 },
      radius: MIN_CAMERA_RADIUS,
      cameraPosition: { x: 0, y: MIN_CAMERA_RADIUS * 0.7, z: MIN_CAMERA_RADIUS * 1.6 },
      target: { x: 0, y: 0, z: 0 },
      valid: false,
      diagnostics: {
        positionCount: 0,
        validPositionCount: 0,
        warnings,
      },
    };
  }

  const validPositions: ScenePosition[] = [];
  for (const position of positions) {
    if (isValidScenePosition(position)) {
      validPositions.push(clonePosition(position));
      continue;
    }
    logTopologyCameraBrake("Invalid topology position ignored");
    warnings.push("Invalid topology position ignored");
  }

  if (validPositions.length === 0) {
    logTopologyCameraBrake("No valid positions found");
    warnings.push("No valid positions found");
    return {
      center: { x: 0, y: 0, z: 0 },
      radius: MIN_CAMERA_RADIUS,
      cameraPosition: { x: 0, y: MIN_CAMERA_RADIUS * 0.7, z: MIN_CAMERA_RADIUS * 1.6 },
      target: { x: 0, y: 0, z: 0 },
      valid: false,
      diagnostics: {
        positionCount: positions.length,
        validPositionCount: 0,
        warnings,
      },
    };
  }

  const center = validPositions.reduce(
    (accumulator, position) => ({
      x: accumulator.x + position.x,
      y: accumulator.y + position.y,
      z: accumulator.z + position.z,
    }),
    { x: 0, y: 0, z: 0 }
  );
  center.x /= validPositions.length;
  center.y /= validPositions.length;
  center.z /= validPositions.length;

  let maxDistance = 0;
  for (const position of validPositions) {
    maxDistance = Math.max(maxDistance, distance3d(center, position));
  }

  const radius = Math.max(MIN_CAMERA_RADIUS, maxDistance + padding);
  const cameraPosition = {
    x: center.x,
    y: center.y + radius * 0.7,
    z: center.z + radius * 1.6,
  };
  const target = clonePosition(center);

  const valid =
    isValidScenePosition(center) &&
    isValidScenePosition(cameraPosition) &&
    isValidScenePosition(target) &&
    Number.isFinite(radius) &&
    radius >= MIN_CAMERA_RADIUS;

  if (!valid) {
    logTopologyCameraBrake("Computed invalid camera frame");
    warnings.push("Computed invalid camera frame");
  }

  return {
    center: clonePosition(center),
    radius,
    cameraPosition,
    target,
    valid,
    diagnostics: {
      positionCount: positions.length,
      validPositionCount: validPositions.length,
      warnings,
    },
  };
}
