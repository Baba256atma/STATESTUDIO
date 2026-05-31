import type {
  ExecutiveCameraProfile,
  ExecutiveSceneDensityInput,
  ExecutiveSceneDensitySnapshot,
  SceneDensityTier,
} from "./executiveDensityTypes";
import { logExecutiveDensityResolved } from "./executiveDensityInstrumentation";
import { DEFAULT_EXECUTIVE_SCALE_PROFILE, getExecutiveObjectScaleProfile } from "./executiveObjectScaleProfile";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function resolveSceneDensityTier(input: {
  objectCount: number;
  relationshipCount?: number;
  boundsSpan?: number;
}): SceneDensityTier {
  const objectCount = Math.max(0, Math.floor(input.objectCount));
  const relationshipCount = Math.max(0, Math.floor(input.relationshipCount ?? 0));
  const boundsSpan = Math.max(0, input.boundsSpan ?? 0);

  if (objectCount <= 3 && relationshipCount <= 2 && boundsSpan <= 6) return "sparse";
  if (objectCount <= 12 && relationshipCount <= 16 && boundsSpan <= 14) return "moderate";
  if (objectCount <= 35 && relationshipCount <= 48 && boundsSpan <= 24) return "dense";
  return "critical";
}

export function resolveExecutiveCameraProfile(tier: SceneDensityTier): ExecutiveCameraProfile {
  if (tier === "sparse") return "overview";
  if (tier === "moderate") return "balanced";
  if (tier === "dense") return "tactical";
  return "compact";
}

export function resolveRecommendedSpacing(tier: SceneDensityTier, layoutPreset?: string | null): number {
  const preset = String(layoutPreset ?? "").toLowerCase();
  const presetBoost = preset.includes("compact") ? -0.08 : preset.includes("expanded") ? 0.12 : 0;
  const base =
    tier === "sparse" ? 1.45 : tier === "moderate" ? 1.25 : tier === "dense" ? 1.05 : 0.92;
  return Number(clamp(base + presetBoost, 0.82, 1.65).toFixed(3));
}

export function resolveRecommendedScale(tier: SceneDensityTier): number {
  const profile = getExecutiveObjectScaleProfile(DEFAULT_EXECUTIVE_SCALE_PROFILE);
  const tierFactor =
    tier === "sparse" ? 1.04 : tier === "moderate" ? 1 : tier === "dense" ? 0.94 : 0.88;
  return Number(clamp(profile.baseCore * tierFactor * profile.multiplier, profile.minScale, profile.maxScale).toFixed(3));
}

export function computeDensityScore(input: {
  objectCount: number;
  relationshipCount?: number;
  boundsSpan?: number;
  viewportWidth?: number;
  viewportHeight?: number;
}): number {
  const objectCount = Math.max(0, input.objectCount);
  const relationshipCount = Math.max(0, input.relationshipCount ?? 0);
  const boundsSpan = Math.max(0, input.boundsSpan ?? 0);
  const viewportArea = Math.max(1, (input.viewportWidth ?? 1440) * (input.viewportHeight ?? 900));
  const areaFactor = clamp(960_000 / viewportArea, 0.75, 1.35);
  const raw = objectCount * 1.15 + relationshipCount * 0.35 + boundsSpan * 0.8;
  return Number(clamp((raw / 40) * areaFactor, 0, 1).toFixed(3));
}

/** Continuous executive density evaluation for workspace scaling decisions. */
export function evaluateExecutiveSceneDensity(input: ExecutiveSceneDensityInput): ExecutiveSceneDensitySnapshot {
  const objectCount = Math.max(0, Math.floor(input.objectCount));
  const boundsSpan = input.boundsSize
    ? Math.max(input.boundsSize[0] ?? 0, input.boundsSize[1] ?? 0, input.boundsSize[2] ?? 0)
    : 0;
  const sceneDensity = resolveSceneDensityTier({
    objectCount,
    relationshipCount: input.relationshipCount,
    boundsSpan,
  });
  const densityScore = computeDensityScore({
    objectCount,
    relationshipCount: input.relationshipCount,
    boundsSpan,
    viewportWidth: input.viewportWidth,
    viewportHeight: input.viewportHeight,
  });
  const snapshot: ExecutiveSceneDensitySnapshot = {
    objectCount,
    sceneDensity,
    recommendedScale: resolveRecommendedScale(sceneDensity),
    recommendedSpacing: resolveRecommendedSpacing(sceneDensity, input.layoutPreset),
    cameraProfile: resolveExecutiveCameraProfile(sceneDensity),
    densityScore,
  };

  logExecutiveDensityResolved({
    objectCount,
    relationshipCount: input.relationshipCount ?? 0,
    sceneDensity,
    recommendedScale: snapshot.recommendedScale,
    recommendedSpacing: snapshot.recommendedSpacing,
    cameraProfile: snapshot.cameraProfile,
    densityScore,
    layoutPreset: input.layoutPreset ?? null,
  });

  return snapshot;
}
