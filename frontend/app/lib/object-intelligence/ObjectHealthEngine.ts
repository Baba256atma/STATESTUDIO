import {
  EMPTY_OBJECT_HEALTH_REGISTRY,
  OBJECT_HEALTH_DIAGNOSTICS,
  OBJECT_HEALTH_ENGINE_VERSION,
  type ObjectHealthBuildInput,
  type ObjectHealthFactors,
  type ObjectHealthRegistry,
  type ObjectHealthResult,
  type ObjectHealthState,
} from "./objectHealthContract.ts";

type ObjectRecord = Readonly<Record<string, unknown>>;

let latestHealthRegistry: ObjectHealthRegistry = EMPTY_OBJECT_HEALTH_REGISTRY;

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
  if (normalized === "healthy" || normalized === "high" || normalized === "active") return 90;
  if (normalized === "stable" || normalized === "medium" || normalized === "warning") return 65;
  if (normalized === "critical" || normalized === "low" || normalized === "inactive") return 30;
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

function scoreDataCompleteness(record: ObjectRecord): number {
  const checks = [
    readString(record.objectId) || readString(record.id) || readString(record.name),
    readString(record.label) || readString(record.display_label) || readString(record.canonical_name),
    readString(record.objectType) || readString(record.type) || readString(record.category),
    Array.isArray(record.position) || Array.isArray(record.pos) || record.sourceId != null,
  ];
  const complete = checks.filter(Boolean).length;
  return clampScore((complete / checks.length) * 100);
}

function scoreActivityLevel(record: ObjectRecord): number {
  const explicit =
    readNumericScore(record.activityLevel) ??
    readNumericScore(record.activity_level) ??
    readNumericScore(record.activityScore) ??
    readNumericScore(record.activity_score) ??
    readNumericScore(record.active);
  if (explicit != null) return explicit;

  const status = readString(record.status).toLowerCase();
  if (["active", "running", "online", "open"].includes(status)) return 90;
  if (["paused", "idle", "pending"].includes(status)) return 55;
  if (["inactive", "blocked", "offline"].includes(status)) return 25;

  const lastActiveAt = Date.parse(readString(record.lastActiveAt) || readString(record.last_active_at));
  if (Number.isFinite(lastActiveAt)) {
    const ageDays = (Date.now() - lastActiveAt) / 86_400_000;
    if (ageDays <= 1) return 90;
    if (ageDays <= 7) return 75;
    if (ageDays <= 30) return 55;
    return 35;
  }

  return 65;
}

function scoreRelationshipStability(record: ObjectRecord): number {
  const explicit =
    readNumericScore(record.relationshipStability) ??
    readNumericScore(record.relationship_stability) ??
    readNumericScore(record.stability);
  if (explicit != null) return explicit;

  const dependencies = Array.isArray(record.dependencies) ? record.dependencies : [];
  const relationships = Array.isArray(record.relationships) ? record.relationships : [];
  const relationshipCount = dependencies.length + relationships.length;
  const unstableRelationships = relationships.filter((relationship) => {
    const rel = asRecord(relationship);
    if (!rel) return false;
    const status = readString(rel.status).toLowerCase();
    const confidence = readNumericScore(rel.confidence);
    return ["unstable", "broken", "blocked", "weak"].includes(status) || (confidence != null && confidence < 45);
  }).length;

  if (relationshipCount === 0) return 70;
  return clampScore(90 - unstableRelationships * 22 - Math.max(0, relationshipCount - 4) * 5);
}

function scoreSourceConfidence(record: ObjectRecord): number {
  return (
    readNumericScore(record.sourceConfidence) ??
    readNumericScore(record.source_confidence) ??
    readNumericScore(record.confidence) ??
    (readString(record.sourceId) ? 80 : 65)
  );
}

export function resolveObjectHealthState(healthScore: number): ObjectHealthState {
  if (healthScore >= 85) return "Healthy";
  if (healthScore >= 70) return "Stable";
  if (healthScore >= 45) return "Warning";
  return "Critical";
}

export function calculateObjectHealth(
  raw: unknown,
  index = 0,
  sourcePrefix = "object"
): ObjectHealthResult | null {
  const record = asRecord(raw);
  if (!record) return null;

  const factors: ObjectHealthFactors = Object.freeze({
    dataCompleteness: scoreDataCompleteness(record),
    activityLevel: scoreActivityLevel(record),
    relationshipStability: scoreRelationshipStability(record),
    sourceConfidence: scoreSourceConfidence(record),
  });
  const healthScore = clampScore(
    factors.dataCompleteness * 0.35 +
      factors.activityLevel * 0.25 +
      factors.relationshipStability * 0.2 +
      factors.sourceConfidence * 0.2
  );

  return Object.freeze({
    objectId: resolveObjectId(record, index, sourcePrefix),
    healthScore,
    healthState: resolveObjectHealthState(healthScore),
    factors,
  });
}

function dedupeHealthResults(results: readonly ObjectHealthResult[]): readonly ObjectHealthResult[] {
  const byId = new Map<string, ObjectHealthResult>();
  for (const result of results) {
    if (!byId.has(result.objectId)) byId.set(result.objectId, result);
  }
  return Object.freeze([...byId.values()]);
}

export function buildObjectHealthRegistry(input: ObjectHealthBuildInput = {}): ObjectHealthRegistry {
  const sceneObjects = input.sceneObjects ?? readSceneObjects(input.sceneJson);
  const dataSourceObjects = input.dataSourceObjects ?? [];
  const objects = dedupeHealthResults([
    ...sceneObjects
      .map((object, index) => calculateObjectHealth(object, index, "scene"))
      .filter((result): result is ObjectHealthResult => result != null),
    ...dataSourceObjects
      .map((object, index) => calculateObjectHealth(object, index, "data_source"))
      .filter((result): result is ObjectHealthResult => result != null),
  ]);
  const healthByObjectId = Object.freeze(
    objects.reduce<Record<string, ObjectHealthResult>>((registry, result) => {
      registry[result.objectId] = result;
      return registry;
    }, {})
  );

  latestHealthRegistry = Object.freeze({
    version: OBJECT_HEALTH_ENGINE_VERSION,
    objects,
    healthByObjectId,
    objectCount: objects.length,
    sceneMutation: false,
    simulation: false,
    diagnostics: OBJECT_HEALTH_DIAGNOSTICS,
  });

  return latestHealthRegistry;
}

export function getObjectHealthRegistry(): ObjectHealthRegistry {
  return latestHealthRegistry;
}

export function resetObjectHealthEngineForTests(): void {
  latestHealthRegistry = EMPTY_OBJECT_HEALTH_REGISTRY;
}

export const ObjectHealthEngine = Object.freeze({
  calculateObjectHealth,
  buildObjectHealthRegistry,
  getObjectHealthRegistry,
  resolveObjectHealthState,
});
