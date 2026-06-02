import type {
  ExecutiveDensityCompressionInput,
  ExecutiveDensityCompressionResult,
} from "./executiveObjectScalingTypes";
import { logExecutiveDensityCompressionDiagnostic } from "./executiveScalingDiagnostics";

const compressionCache = new Map<string, ExecutiveDensityCompressionResult>();

function clampCount(value: number | undefined): number {
  return Math.max(0, Math.floor(Number(value ?? 0)));
}

function buildCompressionSignature(input: ExecutiveDensityCompressionInput): string {
  return [
    clampCount(input.objectCount),
    clampCount(input.relationshipCount),
    Number((input.boundsSpan ?? 0).toFixed(1)),
  ].join("|");
}

/** Low-density scenes pull the camera closer and tighten layout spacing. */
export function resolveExecutiveDensityCompression(
  input: ExecutiveDensityCompressionInput
): ExecutiveDensityCompressionResult {
  const signature = buildCompressionSignature(input);
  const cached = compressionCache.get(signature);
  if (cached) return cached;

  const objectCount = Math.max(1, clampCount(input.objectCount));
  const relationshipCount = clampCount(input.relationshipCount);

  let cameraDistanceMultiplier = 1;
  let layoutSpacingMultiplier = 1;
  let fitPaddingMultiplier = 1;
  let emptySpaceReduction = 0;

  if (objectCount <= 1) {
    cameraDistanceMultiplier = 0.58;
    layoutSpacingMultiplier = 0.72;
    fitPaddingMultiplier = 0.68;
    emptySpaceReduction = 0.42;
  } else if (objectCount <= 5) {
    cameraDistanceMultiplier = 0.64;
    layoutSpacingMultiplier = 0.78;
    fitPaddingMultiplier = 0.74;
    emptySpaceReduction = 0.36;
  } else if (objectCount <= 10) {
    cameraDistanceMultiplier = 0.72;
    layoutSpacingMultiplier = 0.84;
    fitPaddingMultiplier = 0.8;
    emptySpaceReduction = 0.28;
  } else if (objectCount <= 25) {
    cameraDistanceMultiplier = 0.84;
    layoutSpacingMultiplier = 0.9;
    fitPaddingMultiplier = 0.88;
    emptySpaceReduction = 0.18;
  } else if (objectCount <= 50) {
    cameraDistanceMultiplier = 0.94;
    layoutSpacingMultiplier = 0.96;
    fitPaddingMultiplier = 0.94;
    emptySpaceReduction = 0.1;
  }

  if (relationshipCount <= 2 && objectCount <= 15) {
    cameraDistanceMultiplier *= 0.92;
    emptySpaceReduction += 0.04;
  }

  const result: ExecutiveDensityCompressionResult = {
    cameraDistanceMultiplier,
    layoutSpacingMultiplier,
    fitPaddingMultiplier,
    emptySpaceReduction: Math.min(0.48, emptySpaceReduction),
    signature,
  };

  compressionCache.set(signature, result);
  logExecutiveDensityCompressionDiagnostic(signature, {
    objectCount,
    relationshipCount,
    boundsSpan: input.boundsSpan ?? null,
    cameraDistanceMultiplier: Number(cameraDistanceMultiplier.toFixed(3)),
    layoutSpacingMultiplier: Number(layoutSpacingMultiplier.toFixed(3)),
    fitPaddingMultiplier: Number(fitPaddingMultiplier.toFixed(3)),
    emptySpaceReduction: Number(result.emptySpaceReduction.toFixed(3)),
  });

  return result;
}

export function resetExecutiveDensityCompressionForTests(): void {
  compressionCache.clear();
}
