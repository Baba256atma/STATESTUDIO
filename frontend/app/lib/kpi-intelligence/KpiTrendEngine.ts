import { buildKpiIntelligenceRegistry } from "./KpiIntelligenceRuntime.ts";
import {
  EMPTY_KPI_TREND_REGISTRY,
  KPI_TREND_DIAGNOSTICS,
  KPI_TREND_ENGINE_VERSION,
  type KpiHistoricalSnapshot,
  type KpiTrendBuildInput,
  type KpiTrendDirection,
  type KpiTrendProfile,
  type KpiTrendRegistry,
} from "./kpiTrendContract.ts";
import type { KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";

let latestKpiTrendRegistry: KpiTrendRegistry = EMPTY_KPI_TREND_REGISTRY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function snapshotTime(snapshot: KpiHistoricalSnapshot, index: number): number {
  if (!snapshot.capturedAt) return index;
  const parsed = Date.parse(snapshot.capturedAt);
  return Number.isFinite(parsed) ? parsed : index;
}

function snapshotsForKpi(
  snapshots: readonly KpiHistoricalSnapshot[],
  kpiId: string
): readonly KpiHistoricalSnapshot[] {
  return Object.freeze(
    snapshots
      .filter((snapshot) => snapshot.kpiId === kpiId && Number.isFinite(snapshot.value))
      .sort((a, b) => snapshotTime(a, 0) - snapshotTime(b, 0))
  );
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function volatility(values: readonly number[]): number {
  if (values.length < 3) return 0;
  const deltas = values.slice(1).map((value, index) => value - values[index]);
  const signChanges = deltas.slice(1).filter((delta, index) => {
    const previous = deltas[index];
    return Math.sign(delta) !== 0 && Math.sign(previous) !== 0 && Math.sign(delta) !== Math.sign(previous);
  }).length;
  const mean = average(values);
  const spread = Math.max(...values) - Math.min(...values);
  const spreadRatio = mean === 0 ? spread : Math.abs(spread / mean);
  return clampScore(signChanges * 35 + spreadRatio * 100);
}

export function resolveKpiTrendDirection(values: readonly number[]): KpiTrendDirection {
  if (values.length < 2) return "Stable";
  const volatilityScore = volatility(values);
  if (volatilityScore >= 55) return "Volatile";
  const first = values[0] ?? 0;
  const last = values[values.length - 1] ?? first;
  const baseline = Math.abs(first) || 1;
  const movement = ((last - first) / baseline) * 100;
  if (movement >= 5) return "Improving";
  if (movement <= -5) return "Declining";
  return "Stable";
}

export function calculateKpiTrendProfile(
  profile: KpiIntelligenceProfile,
  historicalSnapshots: readonly KpiHistoricalSnapshot[] = []
): KpiTrendProfile {
  const snapshots = snapshotsForKpi(historicalSnapshots, profile.kpiId);
  const values = snapshots.length > 0 ? snapshots.map((snapshot) => snapshot.value) : [profile.value];
  const first = values[0] ?? profile.value;
  const last = values[values.length - 1] ?? profile.value;
  const direction = resolveKpiTrendDirection(values);
  const movementStrength = Math.abs(first) === 0 ? Math.abs(last - first) : Math.abs(((last - first) / first) * 100);
  const trendStrength = direction === "Volatile" ? volatility(values) : clampScore(movementStrength);

  return Object.freeze({
    kpiId: profile.kpiId,
    label: profile.label,
    trendDirection: direction,
    trendStrength,
    snapshotCount: snapshots.length,
    sourceProfile: profile,
  });
}

function dedupeProfiles(profiles: readonly KpiTrendProfile[]): readonly KpiTrendProfile[] {
  const byId = new Map<string, KpiTrendProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.kpiId)) byId.set(profile.kpiId, profile);
  }
  return Object.freeze([...byId.values()]);
}

function readSceneSnapshots(sceneJson: unknown): readonly KpiHistoricalSnapshot[] {
  const scene = (sceneJson as { scene?: Record<string, unknown> } | null)?.scene;
  const snapshots = scene?.kpiSnapshots ?? scene?.historicalKpis ?? scene?.kpiHistory;
  if (!Array.isArray(snapshots)) return Object.freeze([]);
  return Object.freeze(
    snapshots
      .filter((snapshot): snapshot is KpiHistoricalSnapshot => {
        const record = snapshot as Partial<KpiHistoricalSnapshot>;
        return typeof record.kpiId === "string" && typeof record.value === "number";
      })
      .map((snapshot) => Object.freeze({ ...snapshot }))
  );
}

export function buildKpiTrendRegistry(input: KpiTrendBuildInput = {}): KpiTrendRegistry {
  const sourceProfiles = input.profiles ?? buildKpiIntelligenceRegistry(input).profiles;
  const snapshots = input.historicalSnapshots ?? readSceneSnapshots(input.sceneJson);
  const profiles = dedupeProfiles(
    sourceProfiles.map((profile) => calculateKpiTrendProfile(profile, snapshots))
  );
  const trendByKpiId = Object.freeze(
    profiles.reduce<Record<string, KpiTrendProfile>>((registry, profile) => {
      registry[profile.kpiId] = profile;
      return registry;
    }, {})
  );

  latestKpiTrendRegistry = Object.freeze({
    version: KPI_TREND_ENGINE_VERSION,
    profiles,
    trendByKpiId,
    kpiCount: profiles.length,
    readOnly: true,
    sceneMutation: false,
    mrpMutation: false,
    diagnostics: KPI_TREND_DIAGNOSTICS,
  });

  return latestKpiTrendRegistry;
}

export function getKpiTrendRegistry(): KpiTrendRegistry {
  return latestKpiTrendRegistry;
}

export function resetKpiTrendEngineForTests(): void {
  latestKpiTrendRegistry = EMPTY_KPI_TREND_REGISTRY;
}

export const KpiTrendEngine = Object.freeze({
  calculateKpiTrendProfile,
  buildKpiTrendRegistry,
  getKpiTrendRegistry,
  resolveKpiTrendDirection,
});
