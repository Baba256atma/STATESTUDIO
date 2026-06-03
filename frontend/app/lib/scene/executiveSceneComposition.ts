import type { SceneJson } from "../sceneTypes";
import {
  evaluateExecutiveSceneDensity,
  resolveSceneDensityTier,
} from "./density";
import type { ExecutiveCameraPresetId } from "./camera/executiveCameraPresetRegistry";
import { resolveExecutiveDensityCompression } from "./objectScaling/executiveDensityCompressionRuntime";
import { resolveExecutiveObjectScale } from "./objectScaling/executiveObjectScalingRuntime";
import type { ExecutiveObjectImportanceTier } from "./objectScaling/executiveObjectScalingTypes";
import type { ExecutiveObjectLayoutRole } from "./composition/normalizeExecutiveObjectLayout";
import type { WorkspaceViewMode } from "../workspace/workspaceViewModeTypes";
import { shouldSuppressIdleDebugLog } from "../runtime/idleRuntimeStabilityGuard";

export interface ExecutiveSceneCompositionRules {
  targetViewportCoverage: number;
  minCameraDistance: number;
  maxCameraDistance: number;
  preferredObjectCoverage: number;
  fitPadding: number;
}

/** @deprecated Use SceneDensityTier from density runtime — kept for backward compatibility. */
export type SceneDensity = "single" | "small" | "medium" | "large";

export const EXECUTIVE_SCENE_COMPOSITION: ExecutiveSceneCompositionRules = {
  targetViewportCoverage: 0.3,
  minCameraDistance: 11,
  maxCameraDistance: 46,
  preferredObjectCoverage: 0.16,
  fitPadding: 1.65,
};

const logged = new Set<string>();
const normalizedExecutiveScaleCache = new Map<string, number>();

function roundScaleBucket(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.round(value * 100) / 100;
}

function clampScale(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.max(0.25, Math.min(1.35, value));
}

function logExecutiveSceneComposition(tag: string, key: string, payload: unknown): void {
  if (process.env.NODE_ENV === "production") return;
  const signature = `${tag}:${key}`;
  if (logged.has(signature)) return;
  if (shouldSuppressIdleDebugLog(signature)) return;
  logged.add(signature);
  console.info(tag, payload);
}

function isSceneJson(value: unknown): value is SceneJson {
  return Boolean(value && typeof value === "object" && (value as SceneJson).scene);
}

function readRelationships(sceneJson: unknown): unknown[] {
  if (!isSceneJson(sceneJson)) return [];
  const raw = sceneJson.scene.relationships;
  return Array.isArray(raw) ? raw : [];
}

function mapTierToLegacyDensity(tier: ReturnType<typeof resolveSceneDensityTier>): SceneDensity {
  if (tier === "sparse") return "single";
  if (tier === "moderate") return "small";
  if (tier === "dense") return "medium";
  return "large";
}

export function classifySceneDensity(input: {
  objectCount: number;
  relationshipCount?: number;
  boundsSize?: [number, number, number] | null;
}): SceneDensity {
  const objectCount = Math.max(0, Math.floor(input.objectCount));
  const relationshipCount = Math.max(0, Math.floor(input.relationshipCount ?? 0));
  const span = input.boundsSize
    ? Math.max(input.boundsSize[0] ?? 0, input.boundsSize[1] ?? 0, input.boundsSize[2] ?? 0)
    : 0;
  const tier = resolveSceneDensityTier({ objectCount, relationshipCount, boundsSpan: span });
  const density = mapTierToLegacyDensity(tier);

  logExecutiveSceneComposition("[Nexora][SceneDensity]", `${objectCount}:${relationshipCount}:${density}`, {
    objectCount,
    relationshipCount,
    density,
    tier,
    boundsSpan: Number(span.toFixed(2)),
  });

  return density;
}

export function preferredCoverageForDensity(density: SceneDensity): number {
  if (density === "single") return 0.24;
  if (density === "small") return 0.28;
  if (density === "medium") return 0.34;
  return 0.4;
}

export function calculateExecutiveCameraDistance(input: {
  objectCount: number;
  relationshipCount?: number;
  boundsSize?: [number, number, number] | null;
  viewportWidth?: number;
  viewportHeight?: number;
  cameraPreset?: ExecutiveCameraPresetId | null;
  rules?: ExecutiveSceneCompositionRules;
}): {
  density: SceneDensity;
  distance: number;
  coverageEstimate: number;
} {
  const rules = input.rules ?? EXECUTIVE_SCENE_COMPOSITION;
  const densitySnapshot = evaluateExecutiveSceneDensity({
    objectCount: input.objectCount,
    relationshipCount: input.relationshipCount,
    boundsSize: input.boundsSize,
    viewportWidth: input.viewportWidth,
    viewportHeight: input.viewportHeight,
  });
  const density = mapTierToLegacyDensity(densitySnapshot.sceneDensity);
  const boundsSpan = Math.max(
    1.8,
    input.boundsSize?.[0] ?? 0,
    input.boundsSize?.[1] ?? 0,
    input.boundsSize?.[2] ?? 0
  );
  const viewportAspect =
    input.viewportWidth && input.viewportHeight
      ? Math.max(0.8, Math.min(2.4, input.viewportWidth / input.viewportHeight))
      : 1.6;
  const targetCoverage = Math.min(0.5, preferredCoverageForDensity(density));
  const aspectPullback = viewportAspect < 1.2 ? 1.22 : viewportAspect > 1.9 ? 1.08 : 1.14;
  const profilePullback =
    densitySnapshot.cameraProfile === "overview"
      ? 2.05
      : densitySnapshot.cameraProfile === "balanced"
        ? 1.82
        : densitySnapshot.cameraProfile === "tactical"
          ? 1.62
          : 1.48;
  const compression = resolveExecutiveDensityCompression({
    objectCount: input.objectCount,
    relationshipCount: input.relationshipCount,
    boundsSpan,
  });
  const effectiveFitPadding = rules.fitPadding * compression.fitPaddingMultiplier;
  const rawDistance =
    (boundsSpan / targetCoverage) *
    0.34 *
    profilePullback *
    aspectPullback *
    effectiveFitPadding *
    compression.cameraDistanceMultiplier;
  const distance = Math.max(rules.minCameraDistance, Math.min(rules.maxCameraDistance, rawDistance));
  const coverageEstimate = Math.min(0.5, Math.max(0.06, boundsSpan / Math.max(distance * 2.8, 1)));

  logExecutiveSceneComposition("[Nexora][ExecutiveCameraDistance]", `${density}:${distance.toFixed(2)}:${input.objectCount}`, {
    objectCount: input.objectCount,
    relationshipCount: input.relationshipCount ?? 0,
    density,
    cameraProfile: densitySnapshot.cameraProfile,
    cameraPreset: input.cameraPreset ?? null,
    distance: Number(distance.toFixed(2)),
    coverageEstimate: Number(coverageEstimate.toFixed(3)),
    compressionSignature: compression.signature,
    emptySpaceReduction: compression.emptySpaceReduction,
  });

  return { density, distance, coverageEstimate };
}

export function normalizeExecutiveObjectScale(input: {
  scale?: number | null;
  objectCount?: number;
  selected?: boolean;
  focused?: boolean;
  hovered?: boolean;
  dimmed?: boolean;
  importance?: ExecutiveObjectImportanceTier;
  viewportWidth?: number;
  viewportHeight?: number;
  cameraPreset?: ExecutiveCameraPresetId | null;
  objectId?: string | null;
  viewMode?: WorkspaceViewMode;
  role?: ExecutiveObjectLayoutRole | null;
  zoneLike?: boolean;
}): number {
  const raw = clampScale(Number(input.scale ?? 1));
  const objectCount = Math.max(1, Math.floor(input.objectCount ?? 1));
  const selected = input.selected === true;
  const focused = input.focused === true;
  const hovered = input.hovered === true;
  const dimmed = input.dimmed === true;
  const roundedRaw = roundScaleBucket(raw);
  const objectId = input.objectId?.trim() || "scene";
  const density = classifySceneDensity({ objectCount });
  const coverageEstimate = roundScaleBucket(preferredCoverageForDensity(density));
  const cacheSignature = [
    objectCount,
    selected ? 1 : 0,
    focused ? 1 : 0,
    hovered ? 1 : 0,
    dimmed ? 1 : 0,
    input.importance ?? "supporting",
    input.cameraPreset ?? "EXECUTIVE",
    Math.round(Number(input.viewportWidth ?? 0)),
    Math.round(Number(input.viewportHeight ?? 0)),
    input.viewMode ?? "3D",
    input.role ?? "other",
    input.zoneLike ? 1 : 0,
    roundedRaw,
  ].join("|");
  const cached = normalizedExecutiveScaleCache.get(cacheSignature);
  if (cached !== undefined) {
    return cached;
  }

  const normalized = resolveExecutiveObjectScale({
    rawScale: roundedRaw,
    objectCount,
    selected,
    focused,
    hovered,
    dimmed,
    importance: input.importance,
    viewportWidth: input.viewportWidth,
    viewportHeight: input.viewportHeight,
    cameraPreset: input.cameraPreset,
    objectId,
    viewMode: input.viewMode,
    role: input.role,
    zoneLike: input.zoneLike,
  }).scale;
  const roundedNormalized = roundScaleBucket(clampScale(normalized));

  if (Math.abs(normalized - roundedRaw) > 0.001) {
    const logSignature = `${objectCount}:${density}:${roundedRaw}:${roundedNormalized}`;
    logExecutiveSceneComposition("[Nexora][ExecutiveSceneScale]", logSignature, {
      objectCount,
      density,
      selected,
      focused,
      hovered,
      inputScale: roundedRaw,
      normalizedScale: roundedNormalized,
      coverageEstimate,
      dependencySignature: logSignature,
    });
  }

  normalizedExecutiveScaleCache.set(cacheSignature, roundedNormalized);
  return roundedNormalized;
}

export function countSceneRelationships(sceneJson: unknown): number {
  return readRelationships(sceneJson).length;
}

export function resetExecutiveSceneCompositionLogsForTests(): void {
  logged.clear();
  normalizedExecutiveScaleCache.clear();
}
