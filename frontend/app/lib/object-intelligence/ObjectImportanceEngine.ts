import {
  EMPTY_OBJECT_IMPORTANCE_REGISTRY,
  OBJECT_IMPORTANCE_DIAGNOSTICS,
  OBJECT_IMPORTANCE_ENGINE_VERSION,
  type ObjectImportanceBuildInput,
  type ObjectImportanceFactors,
  type ObjectImportanceLevel,
  type ObjectImportanceProfile,
  type ObjectImportanceRegistry,
} from "./objectImportanceContract.ts";

type ObjectRecord = Readonly<Record<string, unknown>>;

let latestImportanceRegistry: ObjectImportanceRegistry = EMPTY_OBJECT_IMPORTANCE_REGISTRY;

function asRecord(value: unknown): ObjectRecord | null {
  return value && typeof value === "object" ? (value as ObjectRecord) : null;
}

function readSceneObjects(sceneJson: unknown): readonly unknown[] {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  return Array.isArray(objects) ? objects : [];
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readNumericScore(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return clampScore(value);
  if (typeof value === "boolean") return value ? 100 : 0;
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase();
  if (normalized === "strategic" || normalized === "critical" || normalized === "executive") return 95;
  if (normalized === "important" || normalized === "high") return 80;
  if (normalized === "relevant" || normalized === "medium") return 55;
  if (normalized === "minor" || normalized === "low") return 25;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? clampScore(parsed) : null;
}

function resolveObjectId(record: ObjectRecord, index: number, sourcePrefix: string): string {
  return (
    readString(record.objectId) ||
    readString(record.id) ||
    readString(record.name) ||
    `${sourcePrefix}:object:${index + 1}`
  );
}

function countArrayValues(...values: readonly unknown[]): number {
  return values.reduce<number>((count, value) => count + (Array.isArray(value) ? value.length : 0), 0);
}

function scoreBusinessInfluence(record: ObjectRecord): number {
  const explicit =
    readNumericScore(record.businessInfluence) ??
    readNumericScore(record.business_influence) ??
    readNumericScore(record.businessImpact) ??
    readNumericScore(record.business_impact) ??
    readNumericScore(record.impactScore) ??
    readNumericScore(record.impact);
  if (explicit != null) return explicit;

  const meaning = readString(record.business_meaning);
  const kpiCount = countArrayValues(record.kpis, record.connectedKpiIds, record.connected_kpi_ids);
  return clampScore((meaning ? 55 : 25) + kpiCount * 15);
}

function scoreExecutiveRelevance(record: ObjectRecord): number {
  const explicit =
    readNumericScore(record.executiveRelevance) ??
    readNumericScore(record.executive_relevance) ??
    readNumericScore(record.importance);
  if (explicit != null) return explicit;

  const tags = Array.isArray(record.tags) ? record.tags.map((tag) => readString(tag).toLowerCase()) : [];
  const role = readString(record.role).toLowerCase();
  const category = readString(record.category).toLowerCase();
  if (tags.includes("executive") || role.includes("executive") || category.includes("executive")) return 95;
  if (tags.includes("strategic") || role.includes("strategic") || category.includes("strategic")) return 85;
  if (tags.includes("critical") || role.includes("critical")) return 80;
  return 45;
}

function scoreDependencyWeight(record: ObjectRecord): number {
  const explicit =
    readNumericScore(record.dependencyWeight) ??
    readNumericScore(record.dependency_weight) ??
    readNumericScore(record.dependencyImpact) ??
    readNumericScore(record.dependency_impact);
  if (explicit != null) return explicit;

  const dependencyCount = countArrayValues(record.dependencies, record.dependents);
  return clampScore(dependencyCount * 22);
}

function scoreTopologyCentrality(record: ObjectRecord): number {
  const explicit =
    readNumericScore(record.topologyCentrality) ??
    readNumericScore(record.topology_centrality) ??
    readNumericScore(record.centrality) ??
    readNumericScore(record.connectionCount) ??
    readNumericScore(record.connection_count);
  if (explicit != null) return explicit;

  const connectionCount = countArrayValues(record.connections, record.relationships);
  const hasHubRole = readString(record.role).toLowerCase().includes("hub");
  return clampScore(connectionCount * 18 + (hasHubRole ? 30 : 0));
}

export function resolveObjectImportanceLevel(importanceScore: number): ObjectImportanceLevel {
  if (importanceScore >= 85) return "Strategic";
  if (importanceScore >= 65) return "Important";
  if (importanceScore >= 40) return "Relevant";
  return "Minor";
}

function buildImportanceReasoning(
  level: ObjectImportanceLevel,
  score: number,
  factors: ObjectImportanceFactors
): readonly string[] {
  return Object.freeze([
    `Importance level is ${level}.`,
    `Importance score is ${score}.`,
    `Business influence ${factors.businessInfluence}, executive relevance ${factors.executiveRelevance}, dependency weight ${factors.dependencyWeight}, topology centrality ${factors.topologyCentrality}.`,
  ]);
}

export function calculateObjectImportance(
  raw: unknown,
  index = 0,
  sourcePrefix = "object"
): ObjectImportanceProfile | null {
  const record = asRecord(raw);
  if (!record) return null;

  const importanceFactors: ObjectImportanceFactors = Object.freeze({
    businessInfluence: scoreBusinessInfluence(record),
    executiveRelevance: scoreExecutiveRelevance(record),
    dependencyWeight: scoreDependencyWeight(record),
    topologyCentrality: scoreTopologyCentrality(record),
  });
  const importanceScore = clampScore(
    importanceFactors.businessInfluence * 0.3 +
      importanceFactors.executiveRelevance * 0.25 +
      importanceFactors.dependencyWeight * 0.25 +
      importanceFactors.topologyCentrality * 0.2
  );
  const importanceLevel = resolveObjectImportanceLevel(importanceScore);

  return Object.freeze({
    objectId: resolveObjectId(record, index, sourcePrefix),
    importanceScore,
    importanceLevel,
    importanceFactors,
    importanceReasoning: buildImportanceReasoning(importanceLevel, importanceScore, importanceFactors),
  });
}

function dedupeImportanceProfiles(
  profiles: readonly ObjectImportanceProfile[]
): readonly ObjectImportanceProfile[] {
  const byId = new Map<string, ObjectImportanceProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.objectId)) byId.set(profile.objectId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildObjectImportanceRegistry(
  input: ObjectImportanceBuildInput = {}
): ObjectImportanceRegistry {
  const sceneObjects = input.sceneObjects ?? readSceneObjects(input.sceneJson);
  const dataSourceObjects = input.dataSourceObjects ?? [];
  const profiles = dedupeImportanceProfiles([
    ...sceneObjects
      .map((object, index) => calculateObjectImportance(object, index, "scene"))
      .filter((profile): profile is ObjectImportanceProfile => profile != null),
    ...dataSourceObjects
      .map((object, index) => calculateObjectImportance(object, index, "data_source"))
      .filter((profile): profile is ObjectImportanceProfile => profile != null),
  ]);
  const importanceByObjectId = Object.freeze(
    profiles.reduce<Record<string, ObjectImportanceProfile>>((registry, profile) => {
      registry[profile.objectId] = profile;
      return registry;
    }, {})
  );

  latestImportanceRegistry = Object.freeze({
    version: OBJECT_IMPORTANCE_ENGINE_VERSION,
    profiles,
    importanceByObjectId,
    objectCount: profiles.length,
    sceneMutation: false,
    simulation: false,
    diagnostics: OBJECT_IMPORTANCE_DIAGNOSTICS,
  });

  return latestImportanceRegistry;
}

export function getObjectImportanceRegistry(): ObjectImportanceRegistry {
  return latestImportanceRegistry;
}

export function resetObjectImportanceEngineForTests(): void {
  latestImportanceRegistry = EMPTY_OBJECT_IMPORTANCE_REGISTRY;
}

export const ObjectImportanceEngine = Object.freeze({
  calculateObjectImportance,
  buildObjectImportanceRegistry,
  getObjectImportanceRegistry,
  resolveObjectImportanceLevel,
});
