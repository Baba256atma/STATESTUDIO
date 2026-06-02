import type { ExecutiveCameraBounds } from "../camera/executive2DCameraProfile";

export type ExecutiveEmptySpaceMeasurement = {
  rawSpan: number;
  operationalSpan: number;
  emptySpaceRatio: number;
  exceedsThreshold: boolean;
  recoveryCompression: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function measureExecutiveEmptySpace(input: {
  rawSpan: number;
  operationalSpan: number;
  objectCount: number;
  clusterCount: number;
}): ExecutiveEmptySpaceMeasurement {
  const rawSpan = Math.max(0.75, input.rawSpan);
  const operationalSpan = Math.max(0.75, input.operationalSpan);
  const emptySpaceRatio = clamp(1 - operationalSpan / rawSpan, 0, 0.92);

  const threshold =
    input.objectCount <= 10 ? 0.28 : input.objectCount <= 25 ? 0.34 : input.objectCount <= 50 ? 0.42 : 0.5;
  const exceedsThreshold = emptySpaceRatio >= threshold;

  let recoveryCompression = 1;
  if (exceedsThreshold) {
    const severity = emptySpaceRatio - threshold;
    recoveryCompression = clamp(1 - severity * (input.objectCount <= 25 ? 0.72 : 0.48), 0.58, 1);
    if (input.clusterCount > 1 && input.objectCount <= 50) {
      recoveryCompression = clamp(recoveryCompression + 0.04, 0.58, 1);
    }
  }

  return {
    rawSpan,
    operationalSpan,
    emptySpaceRatio: Number(emptySpaceRatio.toFixed(3)),
    exceedsThreshold,
    recoveryCompression: Number(recoveryCompression.toFixed(3)),
  };
}

export function applyEmptySpaceRecoveryToBounds(
  bounds: ExecutiveCameraBounds & { min: [number, number, number]; max: [number, number, number] },
  targetCenter: [number, number, number],
  recoveryCompression: number
): ExecutiveCameraBounds & { min: [number, number, number]; max: [number, number, number] } {
  const compression = clamp(recoveryCompression, 0.55, 1);
  const [cx, cy, cz] = targetCenter;
  const halfX = (bounds.size[0] / 2) * compression;
  const halfY = (bounds.size[1] / 2) * compression;
  const halfZ = (bounds.size[2] / 2) * compression;
  const min: [number, number, number] = [cx - halfX, cy - halfY, cz - halfZ];
  const max: [number, number, number] = [cx + halfX, cy + halfY, cz + halfZ];
  return {
    min,
    max,
    center: [cx, cy, cz],
    size: [halfX * 2, halfY * 2, halfZ * 2],
  };
}

export function computeExecutiveReadabilityScore(input: {
  objectCount: number;
  emptySpaceRatio: number;
  clusterCount: number;
  compressionApplied: number;
}): number {
  let score = 100;
  score -= input.emptySpaceRatio * 42;
  if (input.objectCount <= 10 && input.emptySpaceRatio > 0.25) score -= 12;
  if (input.clusterCount > 1 && input.objectCount <= 50) score += 4;
  if (input.compressionApplied < 0.95) score += 6;
  return Math.round(clamp(score, 0, 100));
}
