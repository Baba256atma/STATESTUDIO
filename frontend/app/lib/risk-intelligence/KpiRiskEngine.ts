import { buildKpiIntelligenceRegistry } from "../kpi-intelligence/KpiIntelligenceRuntime.ts";
import { calculateKpiHealthProfile } from "../kpi-intelligence/KpiHealthEngine.ts";
import { calculateKpiImpactProfile } from "../kpi-intelligence/KpiImpactEngine.ts";
import { calculateKpiTrendProfile } from "../kpi-intelligence/KpiTrendEngine.ts";
import {
  DEFAULT_KPI_HEALTH_THRESHOLDS,
  type KpiHealthProfile,
  type KpiHealthThresholds,
} from "../kpi-intelligence/kpiHealthContract.ts";
import type { KpiImpactProfile } from "../kpi-intelligence/kpiImpactContract.ts";
import type {
  KpiHistoricalSnapshot,
  KpiTrendDirection,
  KpiTrendProfile,
} from "../kpi-intelligence/kpiTrendContract.ts";
import type { KpiIntelligenceProfile } from "../kpi-intelligence/kpiIntelligenceContract.ts";
import {
  EMPTY_KPI_RISK_REGISTRY,
  KPI_RISK_INTELLIGENCE_DIAGNOSTICS,
  KPI_RISK_INTELLIGENCE_ENGINE_VERSION,
  type KpiRiskBuildInput,
  type KpiRiskFactors,
  type KpiRiskProfile,
  type KpiRiskRegistry,
} from "./kpiRiskProfileContract.ts";

type KpiRecord = Readonly<Record<string, unknown>>;

let latestKpiRiskRegistry: KpiRiskRegistry = EMPTY_KPI_RISK_REGISTRY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
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

function rawKpiRecordsById(input: KpiRiskBuildInput): Readonly<Record<string, KpiRecord>> {
  const records = [...(input.kpis ?? []), ...(input.dataSourceKpis ?? [])];
  return Object.freeze(
    records.reduce<Record<string, KpiRecord>>((registry, raw) => {
      if (!raw || typeof raw !== "object") return registry;
      const record = raw as KpiRecord;
      const id = readString(record.id) || readString(record.kpiId) || readString(record.name);
      if (id) registry[id] = record;
      return registry;
    }, {})
  );
}

function resolveTrendRiskScore(trend: KpiTrendProfile): number {
  const baseByDirection: Readonly<Record<KpiTrendDirection, number>> = Object.freeze({
    Improving: 25,
    Stable: 45,
    Declining: 75,
    Volatile: 80,
  });
  const base = baseByDirection[trend.trendDirection];
  return clampScore(base * 0.7 + trend.trendStrength * 0.3);
}

function detectDecliningKpi(trend: KpiTrendProfile): boolean {
  return trend.trendDirection === "Declining";
}

function detectVolatileKpi(trend: KpiTrendProfile): boolean {
  return trend.trendDirection === "Volatile";
}

function detectCriticalKpi(
  health: KpiHealthProfile,
  impact: KpiImpactProfile,
  kpiRiskScore: number
): boolean {
  if (kpiRiskScore >= 85) return true;
  if (health.healthState === "Critical") return true;
  return (
    health.healthState === "Warning" &&
    (impact.impactLevel === "Critical" || impact.impactLevel === "High")
  );
}

function buildRiskReasoning(
  kpiRiskScore: number,
  decliningKpi: boolean,
  criticalKpi: boolean,
  volatileKpi: boolean,
  factors: KpiRiskFactors
): readonly string[] {
  return Object.freeze([
    `KPI risk score is ${kpiRiskScore}.`,
    decliningKpi ? "Declining KPI detected." : "KPI is not declining.",
    criticalKpi ? "Critical KPI detected." : "KPI is not critical.",
    volatileKpi ? "Volatile KPI detected." : "KPI is not volatile.",
    `Health ${factors.healthScore} (${factors.healthState}), trend ${factors.trendDirection} at strength ${factors.trendStrength}, impact ${factors.impactScore}.`,
  ]);
}

export function calculateKpiRiskProfileFromIntelligence(
  health: KpiHealthProfile,
  trend: KpiTrendProfile,
  impact: KpiImpactProfile
): KpiRiskProfile {
  const healthRisk = 100 - health.healthScore;
  const trendRisk = resolveTrendRiskScore(trend);
  const kpiRiskScore = clampScore(healthRisk * 0.55 + trendRisk * 0.25 + impact.impactScore * 0.2);
  const riskFactors: KpiRiskFactors = Object.freeze({
    healthScore: health.healthScore,
    healthState: health.healthState,
    trendDirection: trend.trendDirection,
    trendStrength: trend.trendStrength,
    impactScore: impact.impactScore,
  });
  const decliningKpi = detectDecliningKpi(trend);
  const volatileKpi = detectVolatileKpi(trend);
  const criticalKpi = detectCriticalKpi(health, impact, kpiRiskScore);

  return Object.freeze({
    kpiId: health.kpiId,
    label: health.label,
    kpiRiskScore,
    decliningKpi,
    criticalKpi,
    volatileKpi,
    riskFactors,
    riskReasoning: buildRiskReasoning(
      kpiRiskScore,
      decliningKpi,
      criticalKpi,
      volatileKpi,
      riskFactors
    ),
  });
}

export function calculateKpiRiskProfile(
  profile: KpiIntelligenceProfile,
  input: Readonly<{
    historicalSnapshots?: readonly KpiHistoricalSnapshot[];
    thresholds?: Partial<KpiHealthThresholds>;
    raw?: KpiRecord;
  }> = {}
): KpiRiskProfile {
  const thresholds = normalizeThresholds(input.thresholds);
  const health = calculateKpiHealthProfile(profile, thresholds);
  const trend = calculateKpiTrendProfile(profile, input.historicalSnapshots ?? Object.freeze([]));
  const impact = calculateKpiImpactProfile(profile, input.raw);
  return calculateKpiRiskProfileFromIntelligence(health, trend, impact);
}

function dedupeProfiles(profiles: readonly KpiRiskProfile[]): readonly KpiRiskProfile[] {
  const byId = new Map<string, KpiRiskProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.kpiId)) byId.set(profile.kpiId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildKpiRiskRegistry(input: KpiRiskBuildInput = {}): KpiRiskRegistry {
  const thresholds = normalizeThresholds(input.thresholds);
  const sourceProfiles = input.profiles ?? buildKpiIntelligenceRegistry(input).profiles;
  const snapshots = input.historicalSnapshots ?? readSceneSnapshots(input.sceneJson);
  const rawById = rawKpiRecordsById(input);
  const profiles = dedupeProfiles(
    sourceProfiles.map((profile) =>
      calculateKpiRiskProfile(profile, {
        historicalSnapshots: snapshots,
        thresholds,
        raw: rawById[profile.kpiId],
      })
    )
  );
  const riskByKpiId = Object.freeze(
    profiles.reduce<Record<string, KpiRiskProfile>>((registry, profile) => {
      registry[profile.kpiId] = profile;
      return registry;
    }, {})
  );

  latestKpiRiskRegistry = Object.freeze({
    version: KPI_RISK_INTELLIGENCE_ENGINE_VERSION,
    profiles,
    riskByKpiId,
    kpiCount: profiles.length,
    readOnly: true,
    sceneMutation: false,
    mrpMutation: false,
    simulation: false,
    diagnostics: KPI_RISK_INTELLIGENCE_DIAGNOSTICS,
  });

  return latestKpiRiskRegistry;
}

export function getKpiRiskRegistry(): KpiRiskRegistry {
  return latestKpiRiskRegistry;
}

export function resetKpiRiskEngineForTests(): void {
  latestKpiRiskRegistry = EMPTY_KPI_RISK_REGISTRY;
}

export const KpiRiskEngine = Object.freeze({
  calculateKpiRiskProfile,
  calculateKpiRiskProfileFromIntelligence,
  buildKpiRiskRegistry,
  getKpiRiskRegistry,
});
