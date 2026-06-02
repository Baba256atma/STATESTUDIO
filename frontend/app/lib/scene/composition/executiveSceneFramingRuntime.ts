import type { ExecutiveCameraPresetId } from "../camera/executiveCameraPresetRegistry";
import { countSceneRelationships, calculateExecutiveCameraDistance } from "../executiveSceneComposition";
import { resolveExecutiveDensityCompression } from "../objectScaling/executiveDensityCompressionRuntime";
import { readSceneRelationshipEdges } from "../interaction/executiveRelationshipExplorationRuntime";
import {
  analyzeExecutiveSceneBounds,
  computeTightFormationBounds,
  mergeExecutiveBounds,
} from "./executiveSceneBoundsRuntime";
import { detectExecutiveObjectClusters } from "./executiveClusterDetectionRuntime";
import {
  applyEmptySpaceRecoveryToBounds,
  computeExecutiveReadabilityScore,
  measureExecutiveEmptySpace,
} from "./executiveEmptySpaceGovernance";
import {
  logE91DensityCompression,
  logE91FitScene,
  logE91GlobalView,
  logE91SceneFraming,
} from "./executiveSceneFramingDiagnostics";
import type {
  ExecutiveLayoutPreset,
  ExecutiveSceneBoundsSnapshot,
  ExecutiveSceneFramingInput,
  ExecutiveSceneFramingResult,
} from "./executiveSceneFramingTypes";

const framingCache = new Map<string, ExecutiveSceneFramingResult>();

function normalizePreset(preset: ExecutiveCameraPresetId): ExecutiveCameraPresetId {
  if (preset === "GLOBAL_VIEW") return "GLOBAL";
  if (preset === "VIEW_2D" || preset === "VIEW_3D") return "EXECUTIVE";
  return preset;
}

export function mapCameraPresetToLayoutPreset(preset: ExecutiveCameraPresetId): ExecutiveLayoutPreset {
  const normalized = normalizePreset(preset);
  if (normalized === "RISK") return "RISK";
  if (normalized === "OPERATIONS" || normalized === "FOCUS" || normalized === "FIT_SCENE") return "OPERATIONAL";
  return "STRATEGIC";
}

export function resolveExecutiveAdaptivePadding(input: {
  objectCount: number;
  preset: ExecutiveCameraPresetId;
  layoutPreset: ExecutiveLayoutPreset;
  emptySpaceRatio: number;
}): number {
  const normalized = normalizePreset(input.preset);
  let padding =
    input.objectCount <= 10
      ? 1.02
      : input.objectCount <= 25
        ? 1.06
        : input.objectCount <= 50
          ? 1.1
          : 1.16;

  if (normalized === "FIT_SCENE") padding *= 0.9;
  else if (normalized === "GLOBAL") padding *= 0.94;
  else if (normalized === "FOCUS") padding *= 0.92;
  else if (normalized === "OPERATIONS") padding *= 0.96;

  if (input.layoutPreset === "RISK") padding *= 1.05;
  if (input.layoutPreset === "OPERATIONAL") padding *= 0.97;

  if (input.emptySpaceRatio > 0.35) padding *= 0.94;
  return Number(padding.toFixed(3));
}

function buildFramingSignature(input: ExecutiveSceneFramingInput, boundsSignature: string): string {
  return [
    normalizePreset(input.preset),
    input.mode,
    boundsSignature,
    Math.round(Number(input.viewportWidth ?? 0)),
    Math.round(Number(input.viewportHeight ?? 0)),
    input.focusObjectId ?? "",
    (input.visibleObjectIds ?? []).join(","),
  ].join("|");
}

function resolveOperationalBounds(input: {
  analysis: ReturnType<typeof analyzeExecutiveSceneBounds>;
  preset: ExecutiveCameraPresetId;
  objectCount: number;
  clusters: ReturnType<typeof detectExecutiveObjectClusters>;
}): {
  bounds: ReturnType<typeof mergeExecutiveBounds>;
  emptySpaceRecoveryApplied: boolean;
  emptySpaceRatio: number;
} {
  const normalized = normalizePreset(input.preset);
  const visible = input.analysis.visible;
  const object = input.analysis.object;
  if (!visible || !object) {
    throw new Error("missing_bounds");
  }

  const visiblePositions = input.analysis.objects.map((entry) => entry.position);
  const formationBounds = computeTightFormationBounds(visiblePositions, input.objectCount);
  const relationshipBounds = input.analysis.relationship
    ? {
        min: input.analysis.relationship.min,
        max: input.analysis.relationship.max,
        center: input.analysis.relationship.center,
        size: input.analysis.relationship.size,
      }
    : null;

  let operational = mergeExecutiveBounds(formationBounds, relationshipBounds);

  const rawSpan = object.span;
  const formationSpan = Math.max(...formationBounds.size);
  const emptySpace = measureExecutiveEmptySpace({
    rawSpan,
    operationalSpan: formationSpan,
    objectCount: input.objectCount,
    clusterCount: input.clusters.length,
  });

  let emptySpaceRecoveryApplied = false;
  if (emptySpace.exceedsThreshold && input.objectCount <= 50) {
    operational = applyEmptySpaceRecoveryToBounds(
      operational,
      formationBounds.center,
      emptySpace.recoveryCompression
    );
    emptySpaceRecoveryApplied = true;
  } else if (input.objectCount <= 25 && rawSpan > formationSpan * 1.35) {
    operational = mergeExecutiveBounds(formationBounds, operational);
  }

  if (normalized === "FIT_SCENE") {
    operational = applyEmptySpaceRecoveryToBounds(operational, formationBounds.center, 0.88);
    emptySpaceRecoveryApplied = true;
  } else if (normalized === "GLOBAL" && relationshipBounds) {
    operational = mergeExecutiveBounds(operational, relationshipBounds);
  }

  return {
    bounds: operational,
    emptySpaceRecoveryApplied,
    emptySpaceRatio: emptySpace.emptySpaceRatio,
  };
}

/** Dynamic scene framing engine — bounds, density compression, and camera radius. */
export function resolveExecutiveSceneFraming(
  input: ExecutiveSceneFramingInput
): ExecutiveSceneFramingResult | null {
  const analysis = analyzeExecutiveSceneBounds({
    sceneJson: input.sceneJson,
    visibleObjectIds: input.visibleObjectIds,
    activeObjectIds: input.activeObjectIds,
    focusObjectId: input.focusObjectId,
  });
  if (!analysis.object || !analysis.visible) return null;

  const signature = buildFramingSignature(input, analysis.signature);
  const cached = framingCache.get(signature);
  if (cached) return cached;

  const objectCount = analysis.objects.length;
  const relationshipCount = countSceneRelationships(input.sceneJson);
  const relationships = readSceneRelationshipEdges(input.sceneJson);
  const clusters = detectExecutiveObjectClusters({
    objects: analysis.objects,
    relationships,
  });
  const layoutPreset = mapCameraPresetToLayoutPreset(input.preset);
  const boundsSpan = analysis.object.span;
  const compression = resolveExecutiveDensityCompression({
    objectCount,
    relationshipCount,
    boundsSpan,
  });

  logE91DensityCompression(`${signature}:compression`, {
    objectCount,
    relationshipCount,
    boundsSpan,
    cameraDistanceMultiplier: compression.cameraDistanceMultiplier,
    layoutSpacingMultiplier: compression.layoutSpacingMultiplier,
    emptySpaceReduction: compression.emptySpaceReduction,
  });

  const operationalResolution = resolveOperationalBounds({
    analysis,
    preset: input.preset,
    objectCount,
    clusters,
  });
  const adaptivePadding = resolveExecutiveAdaptivePadding({
    objectCount,
    preset: input.preset,
    layoutPreset,
    emptySpaceRatio: operationalResolution.emptySpaceRatio,
  });

  const distance = calculateExecutiveCameraDistance({
    objectCount,
    relationshipCount,
    boundsSize: operationalResolution.bounds.size,
    viewportWidth: input.viewportWidth,
    viewportHeight: input.viewportHeight,
    cameraPreset: normalizePreset(input.preset),
  });

  let cameraRadius = distance.distance * adaptivePadding;
  const normalized = normalizePreset(input.preset);
  if (normalized === "FIT_SCENE") cameraRadius *= 0.86;
  else if (normalized === "GLOBAL") cameraRadius *= 0.92;
  else if (normalized === "FOCUS") cameraRadius *= 0.9;
  else if (normalized === "OPERATIONS") cameraRadius *= 0.94;
  else if (normalized === "RISK") cameraRadius *= 1.04;

  cameraRadius = Math.max(8, Number(cameraRadius.toFixed(2)));

  const readabilityScore = computeExecutiveReadabilityScore({
    objectCount,
    emptySpaceRatio: operationalResolution.emptySpaceRatio,
    clusterCount: clusters.length,
    compressionApplied: compression.cameraDistanceMultiplier,
  });

  const operationalSnapshot: ExecutiveSceneBoundsSnapshot = {
    kind: "operational",
    min: operationalResolution.bounds.min,
    max: operationalResolution.bounds.max,
    center: operationalResolution.bounds.center,
    size: operationalResolution.bounds.size,
    span: Math.max(...operationalResolution.bounds.size),
    objectCount,
  };

  const result: ExecutiveSceneFramingResult = {
    bounds: operationalResolution.bounds,
    boundsAnalysis: {
      object: analysis.object,
      visible: analysis.visible,
      active: analysis.active,
      relationship: analysis.relationship,
      operational: operationalSnapshot,
    },
    cameraRadius,
    adaptivePadding,
    layoutPreset,
    readabilityScore,
    emptySpaceRatio: operationalResolution.emptySpaceRatio,
    emptySpaceRecoveryApplied: operationalResolution.emptySpaceRecoveryApplied,
    clusters,
    compression,
    signature,
  };

  framingCache.set(signature, result);
  logE91SceneFraming(signature, {
    preset: normalized,
    mode: input.mode,
    objectCount,
    relationshipCount,
    layoutPreset,
    readabilityScore,
    emptySpaceRatio: operationalResolution.emptySpaceRatio,
    emptySpaceRecoveryApplied: operationalResolution.emptySpaceRecoveryApplied,
    cameraRadius,
    adaptivePadding,
    clusterCount: clusters.length,
    operationalSpan: operationalSnapshot.span,
    objectSpan: analysis.object.span,
  });

  if (normalized === "FIT_SCENE") {
    logE91FitScene(signature, {
      cameraRadius,
      operationalSpan: operationalSnapshot.span,
      adaptivePadding,
    });
  }
  if (normalized === "GLOBAL") {
    logE91GlobalView(signature, {
      cameraRadius,
      operationalSpan: operationalSnapshot.span,
      relationshipIncluded: Boolean(analysis.relationship),
      clusterCount: clusters.length,
    });
  }

  return result;
}

export function resetExecutiveSceneFramingForTests(): void {
  framingCache.clear();
}
