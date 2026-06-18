import {
  EMPTY_DISCOVERED_KPI_REGISTRY,
  KPI_DISCOVERY_DIAGNOSTICS,
  KPI_DISCOVERY_ENGINE_VERSION,
  type DiscoveredKpi,
  type DiscoveredKpiRegistry,
  type DiscoveredKpiSource,
  type KpiDiscoveryBuildInput,
} from "./kpiDiscoveryContract.ts";
import type { KpiIntelligenceCategory } from "./kpiIntelligenceContract.ts";

type DiscoveryRecord = Readonly<Record<string, unknown>>;

let latestDiscoveredKpiRegistry: DiscoveredKpiRegistry = EMPTY_DISCOVERED_KPI_REGISTRY;

function asRecord(value: unknown): DiscoveryRecord | null {
  return value && typeof value === "object" ? (value as DiscoveryRecord) : null;
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
  if (normalized === "high" || normalized === "strong") return 85;
  if (normalized === "medium" || normalized === "moderate") return 60;
  if (normalized === "low" || normalized === "weak") return 35;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  return parsed >= 0 && parsed <= 1 ? clampScore(parsed * 100) : clampScore(parsed);
}

function readSceneArray(sceneJson: unknown, key: string): readonly unknown[] {
  const scene = (sceneJson as { scene?: Record<string, unknown> } | null)?.scene;
  const value = scene?.[key];
  return Array.isArray(value) ? value : [];
}

function readSceneDataSources(sceneJson: unknown): readonly unknown[] {
  return readSceneArray(sceneJson, "dataSources");
}

function readSceneObjects(sceneJson: unknown): readonly unknown[] {
  return readSceneArray(sceneJson, "objects");
}

function readSceneRelationships(sceneJson: unknown): readonly unknown[] {
  return readSceneArray(sceneJson, "relationships");
}

function normalizeCategory(value: unknown, fallbackText: string): KpiIntelligenceCategory | null {
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
  return null;
}

function detectCategories(value: unknown, fallbackText: string): readonly KpiIntelligenceCategory[] {
  const normalized = `${readString(value)} ${fallbackText}`.toLowerCase();
  const categories: KpiIntelligenceCategory[] = [];
  if (normalized.includes("revenue") || normalized.includes("growth") || normalized.includes("sales")) {
    categories.push("Revenue");
  }
  if (normalized.includes("cost") || normalized.includes("expense") || normalized.includes("efficiency")) {
    categories.push("Cost");
  }
  if (normalized.includes("margin") || normalized.includes("profit")) categories.push("Margin");
  if (normalized.includes("schedule") || normalized.includes("timeline") || normalized.includes("milestone")) {
    categories.push("Schedule");
  }
  if (normalized.includes("quality") || normalized.includes("defect") || normalized.includes("rework")) {
    categories.push("Quality");
  }
  if (normalized.includes("capacity") || normalized.includes("utilization") || normalized.includes("throughput")) {
    categories.push("Capacity");
  }
  if (normalized.includes("delivery") || normalized.includes("on_time") || normalized.includes("shipping")) {
    categories.push("Delivery");
  }
  if (normalized.includes("risk")) categories.push("Risk Exposure");
  return Object.freeze(categories);
}

function readSourceId(record: DiscoveryRecord, source: DiscoveredKpiSource, index: number): string {
  return (
    readString(record.sourceId) ||
    readString(record.objectId) ||
    readString(record.relationshipId) ||
    readString(record.id) ||
    readString(record.name) ||
    `${source}:${index + 1}`
  );
}

function readName(record: DiscoveryRecord, category: KpiIntelligenceCategory, sourceId: string): string {
  return (
    readString(record.kpiName) ||
    readString(record.kpi) ||
    readString(record.metric) ||
    readString(record.metricName) ||
    readString(record.label) ||
    readString(record.name) ||
    `${category} KPI from ${sourceId}`
  );
}

function explicitKpiNames(record: DiscoveryRecord): readonly string[] {
  const values = [record.kpi, record.kpiName, record.metric, record.metricName, record.measure];
  const names = values.map(readString).filter(Boolean);
  if (Array.isArray(record.kpis)) {
    names.push(...record.kpis.map(readString).filter(Boolean));
  }
  if (Array.isArray(record.metrics)) {
    names.push(...record.metrics.map(readString).filter(Boolean));
  }
  return Object.freeze(names);
}

function candidateTexts(record: DiscoveryRecord): readonly string[] {
  return Object.freeze([
    readString(record.id),
    readString(record.name),
    readString(record.label),
    readString(record.type),
    readString(record.category),
    readString(record.description),
    readString(record.role),
    ...explicitKpiNames(record),
  ].filter(Boolean));
}

function confidenceFor(
  record: DiscoveryRecord,
  source: DiscoveredKpiSource,
  category: KpiIntelligenceCategory,
  hasExplicitKpiName: boolean
): number {
  const explicit =
    readScore(record.confidence) ??
    readScore(record.dataConfidence) ??
    readScore(record.sourceConfidence);
  if (explicit != null) return explicit;

  let confidence = source === "data_source" ? 72 : source === "object" ? 66 : 62;
  if (hasExplicitKpiName) confidence += 14;
  if (category === "Risk Exposure" || category === "Revenue" || category === "Delivery") confidence += 5;
  return clampScore(confidence);
}

function buildKpiId(source: DiscoveredKpiSource, sourceId: string, category: KpiIntelligenceCategory): string {
  const suffix = category.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const normalizedSource = sourceId.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return `${source}:${normalizedSource}:${suffix}`;
}

function discoverFromRecord(
  raw: unknown,
  index: number,
  source: DiscoveredKpiSource
): readonly DiscoveredKpi[] {
  const record = asRecord(raw);
  if (!record) return Object.freeze([]);

  const explicitNames = explicitKpiNames(record);
  const texts = explicitNames.length > 0 ? explicitNames : candidateTexts(record);
  const categories = new Set<KpiIntelligenceCategory>();
  for (const text of texts) {
    detectCategories(record.kpiType ?? record.metricType ?? record.category, text).forEach((category) =>
      categories.add(category)
    );
  }
  const directCategory = normalizeCategory(record.kpiType ?? record.metricType ?? record.category, "");
  if (directCategory) categories.add(directCategory);

  if (categories.size === 0) return Object.freeze([]);

  const sourceId = readSourceId(record, source, index);
  return Object.freeze(
    [...categories].sort().map((category) => {
      const hasExplicitKpiName = explicitNames.length > 0;
      return Object.freeze({
        kpiId: buildKpiId(source, sourceId, category),
        name: readName(record, category, sourceId),
        type: category,
        source,
        sourceId,
        confidence: confidenceFor(record, source, category, hasExplicitKpiName),
      });
    })
  );
}

function dedupeDiscoveredKpis(discovered: readonly DiscoveredKpi[]): readonly DiscoveredKpi[] {
  const byId = new Map<string, DiscoveredKpi>();
  for (const kpi of discovered) {
    if (!byId.has(kpi.kpiId)) byId.set(kpi.kpiId, kpi);
  }
  return Object.freeze([...byId.values()]);
}

export function buildDiscoveredKpiRegistry(
  input: KpiDiscoveryBuildInput = {}
): DiscoveredKpiRegistry {
  const dataSources = input.dataSources ?? readSceneDataSources(input.sceneJson);
  const objects = input.objects ?? readSceneObjects(input.sceneJson);
  const relationships = input.relationships ?? readSceneRelationships(input.sceneJson);
  const discoveredKpis = dedupeDiscoveredKpis([
    ...dataSources.flatMap((record, index) => discoverFromRecord(record, index, "data_source")),
    ...objects.flatMap((record, index) => discoverFromRecord(record, index, "object")),
    ...relationships.flatMap((record, index) => discoverFromRecord(record, index, "relationship")),
  ]);
  const discoveredKpiById = Object.freeze(
    discoveredKpis.reduce<Record<string, DiscoveredKpi>>((registry, discovered) => {
      registry[discovered.kpiId] = discovered;
      return registry;
    }, {})
  );

  latestDiscoveredKpiRegistry = Object.freeze({
    version: KPI_DISCOVERY_ENGINE_VERSION,
    discoveredKpis,
    discoveredKpiById,
    discoveredCount: discoveredKpis.length,
    readOnly: true,
    sceneMutation: false,
    objectMutation: false,
    relationshipMutation: false,
    diagnostics: KPI_DISCOVERY_DIAGNOSTICS,
  });

  return latestDiscoveredKpiRegistry;
}

export function getDiscoveredKpiRegistry(): DiscoveredKpiRegistry {
  return latestDiscoveredKpiRegistry;
}

export function resetKpiDiscoveryEngineForTests(): void {
  latestDiscoveredKpiRegistry = EMPTY_DISCOVERED_KPI_REGISTRY;
}

export const KpiDiscoveryEngine = Object.freeze({
  buildDiscoveredKpiRegistry,
  getDiscoveredKpiRegistry,
});
