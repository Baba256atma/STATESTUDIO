import { buildKpiImpactRegistry } from "./KpiImpactEngine.ts";
import { buildKpiIntelligenceRegistry } from "./KpiIntelligenceRuntime.ts";
import {
  EMPTY_KPI_DEPENDENCY_REGISTRY,
  KPI_DEPENDENCY_DIAGNOSTICS,
  KPI_DEPENDENCY_ENGINE_VERSION,
  type KpiDependencyBuildInput,
  type KpiDependencyLevel,
  type KpiDependencyProfile,
  type KpiDependencyRegistry,
} from "./kpiDependencyContract.ts";
import type { KpiImpactProfile } from "./kpiImpactContract.ts";
import type { KpiIntelligenceCategory, KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";

type KpiRecord = Readonly<Record<string, unknown>>;

let latestKpiDependencyRegistry: KpiDependencyRegistry = EMPTY_KPI_DEPENDENCY_REGISTRY;

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

function rawKpiRecordsById(input: KpiDependencyBuildInput): Readonly<Record<string, KpiRecord>> {
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

function byKpiId<T extends { kpiId: string }>(profiles: readonly T[]): Readonly<Record<string, T>> {
  return Object.freeze(
    profiles.reduce<Record<string, T>>((registry, profile) => {
      registry[profile.kpiId] = profile;
      return registry;
    }, {})
  );
}

function categoryDependencyBaseline(category?: KpiIntelligenceCategory): number {
  if (category === "Revenue" || category === "Margin") return 82;
  if (category === "Delivery" || category === "Capacity") return 76;
  if (category === "Risk Exposure") return 78;
  if (category === "Schedule" || category === "Quality") return 68;
  if (category === "Cost") return 64;
  return 55;
}

function dependencyCount(raw: KpiRecord | undefined): number {
  if (!raw) return 0;
  if (Array.isArray(raw.dependencies)) return raw.dependencies.length;
  if (Array.isArray(raw.dependencyIds)) return raw.dependencyIds.length;
  if (Array.isArray(raw.relatedObjects)) return raw.relatedObjects.length;
  return 0;
}

export function resolveKpiDependencyLevel(dependencyScore: number): KpiDependencyLevel {
  if (dependencyScore >= 85) return "Critical Dependency";
  if (dependencyScore >= 65) return "Highly Dependent";
  if (dependencyScore >= 40) return "Dependent";
  return "Independent";
}

export function calculateKpiDependencyProfile(
  profile: KpiIntelligenceProfile,
  impactProfile?: KpiImpactProfile,
  raw?: KpiRecord
): KpiDependencyProfile {
  const explicit =
    readScore(raw?.dependencyScore) ??
    readScore(raw?.dependency) ??
    readScore(raw?.dependencyWeight) ??
    readScore(raw?.dependency_weight);
  const count = dependencyCount(raw);
  const dependencyScore =
    explicit ??
    (count > 0
      ? clampScore(45 + count * 12)
      : clampScore(categoryDependencyBaseline(profile.category) * 0.65 + (impactProfile?.impactScore ?? 50) * 0.35));

  return Object.freeze({
    kpiId: profile.kpiId,
    label: profile.label,
    dependencyScore,
    dependencyLevel: resolveKpiDependencyLevel(dependencyScore),
    dependencyCount: count,
    sourceProfile: profile,
    impactProfile,
  });
}

function dedupeProfiles(profiles: readonly KpiDependencyProfile[]): readonly KpiDependencyProfile[] {
  const byId = new Map<string, KpiDependencyProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.kpiId)) byId.set(profile.kpiId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildKpiDependencyRegistry(input: KpiDependencyBuildInput = {}): KpiDependencyRegistry {
  const sourceProfiles = input.profiles ?? buildKpiIntelligenceRegistry(input).profiles;
  const impactProfiles =
    input.impactProfiles ?? buildKpiImpactRegistry({ ...input, profiles: sourceProfiles }).profiles;
  const impactById = byKpiId<KpiImpactProfile>(impactProfiles);
  const rawById = rawKpiRecordsById(input);
  const profiles = dedupeProfiles(
    sourceProfiles.map((profile) =>
      calculateKpiDependencyProfile(profile, impactById[profile.kpiId], rawById[profile.kpiId])
    )
  );
  const dependencyByKpiId = Object.freeze(
    profiles.reduce<Record<string, KpiDependencyProfile>>((registry, profile) => {
      registry[profile.kpiId] = profile;
      return registry;
    }, {})
  );

  latestKpiDependencyRegistry = Object.freeze({
    version: KPI_DEPENDENCY_ENGINE_VERSION,
    profiles,
    dependencyByKpiId,
    kpiCount: profiles.length,
    readOnly: true,
    sceneMutation: false,
    objectMutation: false,
    mrpMutation: false,
    diagnostics: KPI_DEPENDENCY_DIAGNOSTICS,
  });

  return latestKpiDependencyRegistry;
}

export function getKpiDependencyRegistry(): KpiDependencyRegistry {
  return latestKpiDependencyRegistry;
}

export function resetKpiDependencyEngineForTests(): void {
  latestKpiDependencyRegistry = EMPTY_KPI_DEPENDENCY_REGISTRY;
}

export const KpiDependencyEngine = Object.freeze({
  calculateKpiDependencyProfile,
  buildKpiDependencyRegistry,
  getKpiDependencyRegistry,
  resolveKpiDependencyLevel,
});
