import {
  EMPTY_KPI_INTELLIGENCE_REGISTRY,
  KPI_INTELLIGENCE_DIAGNOSTICS,
  KPI_INTELLIGENCE_RUNTIME_VERSION,
  KPI_INTELLIGENCE_SUPPORTED_CATEGORIES,
  type KpiIntelligenceBuildInput,
  type KpiIntelligenceCategory,
  type KpiIntelligenceDirection,
  type KpiIntelligenceProfile,
  type KpiIntelligenceRegistry,
  type KpiIntelligenceSource,
} from "./kpiIntelligenceContract.ts";

type KpiRecord = Readonly<Record<string, unknown>>;

let latestKpiIntelligenceRegistry: KpiIntelligenceRegistry = EMPTY_KPI_INTELLIGENCE_REGISTRY;

function asRecord(value: unknown): KpiRecord | null {
  return value && typeof value === "object" ? (value as KpiRecord) : null;
}

function readSceneKpis(sceneJson: unknown): readonly unknown[] {
  const scene = (sceneJson as { scene?: Record<string, unknown> } | null)?.scene;
  if (!scene) return [];
  if (Array.isArray(scene.kpis)) return scene.kpis;
  if (Array.isArray(scene.metrics)) return scene.metrics;
  if (Array.isArray(scene.kpiBoard)) return scene.kpiBoard;
  return [];
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readScore(value: unknown): number | null {
  const numeric = readNumber(value);
  if (numeric != null) return numeric >= 0 && numeric <= 1 ? clampScore(numeric * 100) : clampScore(numeric);
  const normalized = readString(value).toLowerCase();
  if (normalized === "critical" || normalized === "high") return 90;
  if (normalized === "medium" || normalized === "warning") return 60;
  if (normalized === "low") return 30;
  if (normalized === "healthy" || normalized === "good") return 85;
  return null;
}

function normalizeCategory(value: unknown, fallbackText: string): KpiIntelligenceCategory {
  const normalized = `${readString(value)} ${fallbackText}`.toLowerCase();
  if (normalized.includes("revenue") || normalized.includes("growth") || normalized.includes("sales")) {
    return "Revenue";
  }
  if (normalized.includes("cost") || normalized.includes("expense") || normalized.includes("efficiency")) {
    return "Cost";
  }
  if (normalized.includes("margin") || normalized.includes("profit")) return "Margin";
  if (normalized.includes("schedule") || normalized.includes("timeline") || normalized.includes("milestone")) {
    return "Schedule";
  }
  if (normalized.includes("quality") || normalized.includes("defect") || normalized.includes("rework")) {
    return "Quality";
  }
  if (normalized.includes("capacity") || normalized.includes("utilization") || normalized.includes("throughput")) {
    return "Capacity";
  }
  if (normalized.includes("delivery") || normalized.includes("on_time") || normalized.includes("shipping")) {
    return "Delivery";
  }
  if (normalized.includes("risk")) return "Risk Exposure";
  return "Revenue";
}

function normalizeDirection(value: unknown, category: KpiIntelligenceCategory): KpiIntelligenceDirection {
  const normalized = readString(value).toLowerCase();
  if (normalized === "up" || normalized === "higher" || normalized === "increase") return "up";
  if (normalized === "down" || normalized === "lower" || normalized === "decrease") return "down";
  if (normalized === "neutral" || normalized === "flat") return "neutral";
  return category === "Cost" || category === "Risk Exposure" || category === "Quality" ? "down" : "up";
}

function resolveKpiId(record: KpiRecord, index: number, source: KpiIntelligenceSource): string {
  return (
    readString(record.kpiId) ||
    readString(record.id) ||
    readString(record.key) ||
    `${source}:kpi:${index + 1}`
  );
}

function resolveLabel(record: KpiRecord, kpiId: string): string {
  return readString(record.label) || readString(record.name) || readString(record.title) || kpiId;
}

function resolveValue(record: KpiRecord): number {
  return readNumber(record.value) ?? readNumber(record.current) ?? readNumber(record.actual) ?? 0;
}

function resolveTarget(record: KpiRecord, direction: KpiIntelligenceDirection): number {
  const explicit = readNumber(record.target) ?? readNumber(record.goal) ?? readNumber(record.threshold);
  if (explicit != null) return explicit;
  return direction === "down" ? 0 : 100;
}

function calculatePerformanceScore(
  value: number,
  target: number,
  direction: KpiIntelligenceDirection
): number {
  if (direction === "neutral") return 50;
  if (target === 0) {
    if (direction === "down") return value <= 0 ? 100 : clampScore(100 - value);
    return value > 0 ? 100 : 0;
  }
  const ratio = value / target;
  if (direction === "down") return clampScore((2 - ratio) * 100);
  return clampScore(ratio * 100);
}

function createKpiIntelligenceProfile(
  raw: unknown,
  index: number,
  source: KpiIntelligenceSource
): KpiIntelligenceProfile | null {
  const record = asRecord(raw);
  if (!record) return null;

  const kpiId = resolveKpiId(record, index, source);
  const label = resolveLabel(record, kpiId);
  const category = normalizeCategory(record.category ?? record.type, `${kpiId} ${label}`);
  const direction = normalizeDirection(record.direction, category);
  const value = resolveValue(record);
  const target = resolveTarget(record, direction);
  const intelligenceScore =
    readScore(record.intelligenceScore) ??
    readScore(record.score) ??
    calculatePerformanceScore(value, target, direction);

  return Object.freeze({
    kpiId,
    label,
    category,
    value,
    target,
    intelligenceScore,
    confidence: readScore(record.confidence) ?? readScore(record.dataConfidence) ?? 70,
    direction,
    source,
  });
}

function dedupeProfiles(profiles: readonly KpiIntelligenceProfile[]): readonly KpiIntelligenceProfile[] {
  const byId = new Map<string, KpiIntelligenceProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.kpiId)) byId.set(profile.kpiId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildKpiIntelligenceRegistry(
  input: KpiIntelligenceBuildInput = {}
): KpiIntelligenceRegistry {
  const sceneKpis = input.kpis ?? readSceneKpis(input.sceneJson);
  const dataSourceKpis = input.dataSourceKpis ?? [];
  const profiles = dedupeProfiles([
    ...sceneKpis
      .map((kpi, index) => createKpiIntelligenceProfile(kpi, index, "scene"))
      .filter((profile): profile is KpiIntelligenceProfile => profile != null),
    ...dataSourceKpis
      .map((kpi, index) => createKpiIntelligenceProfile(kpi, index, "data_source"))
      .filter((profile): profile is KpiIntelligenceProfile => profile != null),
  ]);
  const profileByKpiId = Object.freeze(
    profiles.reduce<Record<string, KpiIntelligenceProfile>>((registry, profile) => {
      registry[profile.kpiId] = profile;
      return registry;
    }, {})
  );

  latestKpiIntelligenceRegistry = Object.freeze({
    version: KPI_INTELLIGENCE_RUNTIME_VERSION,
    profiles,
    profileByKpiId,
    kpiCount: profiles.length,
    supportedCategories: KPI_INTELLIGENCE_SUPPORTED_CATEGORIES,
    visualRendering: false,
    sceneMutation: false,
    mrpMutation: false,
    diagnostics: KPI_INTELLIGENCE_DIAGNOSTICS,
  });

  return latestKpiIntelligenceRegistry;
}

export function getKpiIntelligenceRegistry(): KpiIntelligenceRegistry {
  return latestKpiIntelligenceRegistry;
}

export function resetKpiIntelligenceRuntimeForTests(): void {
  latestKpiIntelligenceRegistry = EMPTY_KPI_INTELLIGENCE_REGISTRY;
}

export const KpiIntelligenceRuntime = Object.freeze({
  buildKpiIntelligenceRegistry,
  getKpiIntelligenceRegistry,
});
