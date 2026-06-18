import { buildKpiIntelligenceRegistry } from "./KpiIntelligenceRuntime.ts";
import {
  EMPTY_KPI_IMPACT_REGISTRY,
  KPI_IMPACT_DIAGNOSTICS,
  KPI_IMPACT_ENGINE_VERSION,
  type KpiImpactBuildInput,
  type KpiImpactFactors,
  type KpiImpactLevel,
  type KpiImpactProfile,
  type KpiImpactRegistry,
} from "./kpiImpactContract.ts";
import type { KpiIntelligenceCategory, KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";

type KpiRecord = Readonly<Record<string, unknown>>;

let latestKpiImpactRegistry: KpiImpactRegistry = EMPTY_KPI_IMPACT_REGISTRY;

function asRecord(value: unknown): KpiRecord | null {
  return value && typeof value === "object" ? (value as KpiRecord) : null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readScore(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value >= 0 && value <= 1 ? clampScore(value * 100) : clampScore(value);
  }
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "critical" || normalized === "high" || normalized === "strong") return 90;
  if (normalized === "medium" || normalized === "moderate") return 60;
  if (normalized === "low" || normalized === "weak") return 30;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  return parsed >= 0 && parsed <= 1 ? clampScore(parsed * 100) : clampScore(parsed);
}

function readSceneKpis(sceneJson: unknown): readonly unknown[] {
  const scene = (sceneJson as { scene?: Record<string, unknown> } | null)?.scene;
  if (!scene) return [];
  if (Array.isArray(scene.kpis)) return scene.kpis;
  if (Array.isArray(scene.metrics)) return scene.metrics;
  if (Array.isArray(scene.kpiBoard)) return scene.kpiBoard;
  return [];
}

function resolveRecordId(record: KpiRecord, index: number, source: "scene" | "data_source"): string {
  return (
    readString(record.kpiId) ||
    readString(record.id) ||
    readString(record.key) ||
    `${source}:kpi:${index + 1}`
  );
}

function rawKpiRecordsById(input: KpiImpactBuildInput): Readonly<Record<string, KpiRecord>> {
  const sceneKpis = input.kpis ?? readSceneKpis(input.sceneJson);
  const dataSourceKpis = input.dataSourceKpis ?? [];
  const records: Record<string, KpiRecord> = {};
  sceneKpis.forEach((raw, index) => {
    const record = asRecord(raw);
    if (record) records[resolveRecordId(record, index, "scene")] = record;
  });
  dataSourceKpis.forEach((raw, index) => {
    const record = asRecord(raw);
    if (record) records[resolveRecordId(record, index, "data_source")] = record;
  });
  return Object.freeze(records);
}

function categoryDefaults(category: KpiIntelligenceCategory): KpiImpactFactors {
  if (category === "Revenue") {
    return Object.freeze({ businessInfluence: 90, financialInfluence: 95, operationalInfluence: 60 });
  }
  if (category === "Margin") {
    return Object.freeze({ businessInfluence: 86, financialInfluence: 92, operationalInfluence: 62 });
  }
  if (category === "Cost") {
    return Object.freeze({ businessInfluence: 72, financialInfluence: 88, operationalInfluence: 66 });
  }
  if (category === "Schedule") {
    return Object.freeze({ businessInfluence: 68, financialInfluence: 58, operationalInfluence: 82 });
  }
  if (category === "Quality") {
    return Object.freeze({ businessInfluence: 74, financialInfluence: 60, operationalInfluence: 86 });
  }
  if (category === "Capacity") {
    return Object.freeze({ businessInfluence: 76, financialInfluence: 64, operationalInfluence: 90 });
  }
  if (category === "Delivery") {
    return Object.freeze({ businessInfluence: 82, financialInfluence: 66, operationalInfluence: 88 });
  }
  return Object.freeze({ businessInfluence: 84, financialInfluence: 76, operationalInfluence: 86 });
}

function impactFactorsForProfile(
  profile: KpiIntelligenceProfile,
  raw?: KpiRecord
): KpiImpactFactors {
  const defaults = categoryDefaults(profile.category);
  return Object.freeze({
    businessInfluence:
      readScore(raw?.businessInfluence) ??
      readScore(raw?.business_influence) ??
      readScore(raw?.executiveInfluence) ??
      defaults.businessInfluence,
    financialInfluence:
      readScore(raw?.financialInfluence) ??
      readScore(raw?.financial_influence) ??
      readScore(raw?.financialImpact) ??
      defaults.financialInfluence,
    operationalInfluence:
      readScore(raw?.operationalInfluence) ??
      readScore(raw?.operational_influence) ??
      readScore(raw?.operationalImpact) ??
      defaults.operationalInfluence,
  });
}

export function resolveKpiImpactLevel(impactScore: number): KpiImpactLevel {
  if (impactScore >= 85) return "Critical";
  if (impactScore >= 65) return "High";
  if (impactScore >= 40) return "Medium";
  return "Low";
}

export function calculateKpiImpactProfile(
  profile: KpiIntelligenceProfile,
  raw?: KpiRecord
): KpiImpactProfile {
  const impactFactors = impactFactorsForProfile(profile, raw);
  const impactScore = clampScore(
    impactFactors.businessInfluence * 0.4 +
      impactFactors.financialInfluence * 0.35 +
      impactFactors.operationalInfluence * 0.25
  );

  return Object.freeze({
    kpiId: profile.kpiId,
    label: profile.label,
    impactScore,
    impactLevel: resolveKpiImpactLevel(impactScore),
    impactFactors,
    sourceProfile: profile,
  });
}

function dedupeProfiles(profiles: readonly KpiImpactProfile[]): readonly KpiImpactProfile[] {
  const byId = new Map<string, KpiImpactProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.kpiId)) byId.set(profile.kpiId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildKpiImpactRegistry(input: KpiImpactBuildInput = {}): KpiImpactRegistry {
  const sourceProfiles = input.profiles ?? buildKpiIntelligenceRegistry(input).profiles;
  const rawById = rawKpiRecordsById(input);
  const profiles = dedupeProfiles(
    sourceProfiles.map((profile) => calculateKpiImpactProfile(profile, rawById[profile.kpiId]))
  );
  const impactByKpiId = Object.freeze(
    profiles.reduce<Record<string, KpiImpactProfile>>((registry, profile) => {
      registry[profile.kpiId] = profile;
      return registry;
    }, {})
  );

  latestKpiImpactRegistry = Object.freeze({
    version: KPI_IMPACT_ENGINE_VERSION,
    profiles,
    impactByKpiId,
    kpiCount: profiles.length,
    readOnly: true,
    sceneMutation: false,
    mrpMutation: false,
    diagnostics: KPI_IMPACT_DIAGNOSTICS,
  });

  return latestKpiImpactRegistry;
}

export function getKpiImpactRegistry(): KpiImpactRegistry {
  return latestKpiImpactRegistry;
}

export function resetKpiImpactEngineForTests(): void {
  latestKpiImpactRegistry = EMPTY_KPI_IMPACT_REGISTRY;
}

export const KpiImpactEngine = Object.freeze({
  calculateKpiImpactProfile,
  buildKpiImpactRegistry,
  getKpiImpactRegistry,
  resolveKpiImpactLevel,
});
