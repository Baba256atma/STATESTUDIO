import { buildKpiIntelligenceRegistry } from "./KpiIntelligenceRuntime.ts";
import {
  DEFAULT_KPI_HEALTH_THRESHOLDS,
  EMPTY_KPI_HEALTH_REGISTRY,
  KPI_HEALTH_DIAGNOSTICS,
  KPI_HEALTH_ENGINE_VERSION,
  type KpiHealthBuildInput,
  type KpiHealthProfile,
  type KpiHealthRegistry,
  type KpiHealthState,
  type KpiHealthThresholds,
} from "./kpiHealthContract.ts";
import type { KpiIntelligenceDirection, KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";

let latestKpiHealthRegistry: KpiHealthRegistry = EMPTY_KPI_HEALTH_REGISTRY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeThresholds(input?: Partial<KpiHealthThresholds>): KpiHealthThresholds {
  const healthy = clampScore(input?.healthy ?? DEFAULT_KPI_HEALTH_THRESHOLDS.healthy);
  const stable = clampScore(input?.stable ?? DEFAULT_KPI_HEALTH_THRESHOLDS.stable);
  const warning = clampScore(input?.warning ?? DEFAULT_KPI_HEALTH_THRESHOLDS.warning);
  return Object.freeze({
    healthy: Math.max(healthy, stable, warning),
    stable: Math.min(Math.max(stable, warning), Math.max(healthy, stable, warning)),
    warning: Math.min(warning, stable, healthy),
  });
}

export function resolveKpiHealthState(
  healthScore: number,
  thresholds: KpiHealthThresholds = DEFAULT_KPI_HEALTH_THRESHOLDS
): KpiHealthState {
  if (healthScore >= thresholds.healthy) return "Healthy";
  if (healthScore >= thresholds.stable) return "Stable";
  if (healthScore >= thresholds.warning) return "Warning";
  return "Critical";
}

function targetAlignment(profile: KpiIntelligenceProfile): number {
  const { value, target, direction } = profile;
  if (direction === "neutral") return 50;
  if (target === 0) {
    if (direction === "down") return value <= 0 ? 100 : clampScore(100 - value);
    return value > 0 ? 100 : 0;
  }
  const ratio = value / target;
  if (direction === "down") return clampScore((2 - ratio) * 100);
  return clampScore(ratio * 100);
}

function directionHealth(direction: KpiIntelligenceDirection): number {
  if (direction === "neutral") return 60;
  return 75;
}

export function calculateKpiHealthProfile(
  profile: KpiIntelligenceProfile,
  thresholds: KpiHealthThresholds = DEFAULT_KPI_HEALTH_THRESHOLDS
): KpiHealthProfile {
  const normalizedThresholds = normalizeThresholds(thresholds);
  const healthScore = clampScore(
    profile.intelligenceScore * 0.45 +
      targetAlignment(profile) * 0.35 +
      profile.confidence * 0.15 +
      directionHealth(profile.direction) * 0.05
  );

  return Object.freeze({
    kpiId: profile.kpiId,
    label: profile.label,
    healthScore,
    healthState: resolveKpiHealthState(healthScore, normalizedThresholds),
    thresholds: normalizedThresholds,
    sourceProfile: profile,
  });
}

function dedupeProfiles(profiles: readonly KpiHealthProfile[]): readonly KpiHealthProfile[] {
  const byId = new Map<string, KpiHealthProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.kpiId)) byId.set(profile.kpiId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildKpiHealthRegistry(input: KpiHealthBuildInput = {}): KpiHealthRegistry {
  const thresholds = normalizeThresholds(input.thresholds);
  const sourceProfiles = input.profiles ?? buildKpiIntelligenceRegistry(input).profiles;
  const profiles = dedupeProfiles(
    sourceProfiles.map((profile) => calculateKpiHealthProfile(profile, thresholds))
  );
  const healthByKpiId = Object.freeze(
    profiles.reduce<Record<string, KpiHealthProfile>>((registry, profile) => {
      registry[profile.kpiId] = profile;
      return registry;
    }, {})
  );

  latestKpiHealthRegistry = Object.freeze({
    version: KPI_HEALTH_ENGINE_VERSION,
    profiles,
    healthByKpiId,
    kpiCount: profiles.length,
    readOnly: true,
    sceneMutation: false,
    mrpMutation: false,
    diagnostics: KPI_HEALTH_DIAGNOSTICS,
  });

  return latestKpiHealthRegistry;
}

export function getKpiHealthRegistry(): KpiHealthRegistry {
  return latestKpiHealthRegistry;
}

export function resetKpiHealthEngineForTests(): void {
  latestKpiHealthRegistry = EMPTY_KPI_HEALTH_REGISTRY;
}

export const KpiHealthEngine = Object.freeze({
  calculateKpiHealthProfile,
  buildKpiHealthRegistry,
  getKpiHealthRegistry,
  resolveKpiHealthState,
});
