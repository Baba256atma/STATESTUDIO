import {
  EMPTY_OBJECT_IMPACT_REGISTRY,
  OBJECT_IMPACT_DIAGNOSTICS,
  OBJECT_IMPACT_ENGINE_VERSION,
  type ObjectImpactBuildInput,
  type ObjectImpactFactors,
  type ObjectImpactLevel,
  type ObjectImpactRegistry,
  type ObjectImpactResult,
} from "./objectImpactContract.ts";

type ObjectRecord = Readonly<Record<string, unknown>>;

let latestImpactRegistry: ObjectImpactRegistry = EMPTY_OBJECT_IMPACT_REGISTRY;

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
  if (normalized === "critical") return 100;
  if (normalized === "high") return 80;
  if (normalized === "medium") return 55;
  if (normalized === "low") return 25;
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

function scoreRelationshipCount(record: ObjectRecord): number {
  const explicit =
    readNumericScore(record.relationshipCount) ??
    readNumericScore(record.relationship_count) ??
    readNumericScore(record.connectionCount) ??
    readNumericScore(record.connection_count);
  if (explicit != null) return explicit;

  const count = countArrayValues(
    record.relationships,
    record.connections,
    record.dependencies,
    record.dependents
  );
  return clampScore(count * 18);
}

function scoreConnectedKpis(record: ObjectRecord): number {
  const explicit =
    readNumericScore(record.connectedKpis) ??
    readNumericScore(record.connected_kpis) ??
    readNumericScore(record.kpiImpact) ??
    readNumericScore(record.kpi_impact);
  if (explicit != null) return explicit;

  const count = countArrayValues(record.kpis, record.connectedKpiIds, record.connected_kpi_ids);
  return clampScore(count * 25);
}

function scoreConnectedRisks(record: ObjectRecord): number {
  const explicit =
    readNumericScore(record.connectedRisks) ??
    readNumericScore(record.connected_risks) ??
    readNumericScore(record.riskImpact) ??
    readNumericScore(record.risk_impact) ??
    readNumericScore(record.scanner_severity);
  if (explicit != null) return explicit;

  const riskKind = readString(record.risk_kind);
  const count = countArrayValues(record.risks, record.connectedRiskIds, record.connected_risk_ids);
  return clampScore(count * 30 + (riskKind ? 20 : 0));
}

function scoreBusinessDependency(record: ObjectRecord): number {
  const explicit =
    readNumericScore(record.businessDependency) ??
    readNumericScore(record.business_dependency) ??
    readNumericScore(record.dependencyImpact) ??
    readNumericScore(record.dependency_impact) ??
    readNumericScore(record.importance);
  if (explicit != null) return explicit;

  const tags = Array.isArray(record.tags) ? record.tags.map((tag) => readString(tag).toLowerCase()) : [];
  const role = readString(record.role).toLowerCase();
  const meaning = readString(record.business_meaning);
  if (tags.includes("critical") || role.includes("critical") || role.includes("executive")) return 90;
  if (meaning) return 70;
  if (Array.isArray(record.dependencies) && record.dependencies.length > 0) return 60;
  return 35;
}

export function resolveObjectImpactLevel(impactScore: number): ObjectImpactLevel {
  if (impactScore >= 85) return "Critical";
  if (impactScore >= 65) return "High";
  if (impactScore >= 40) return "Medium";
  return "Low";
}

export function calculateObjectImpact(
  raw: unknown,
  index = 0,
  sourcePrefix = "object"
): ObjectImpactResult | null {
  const record = asRecord(raw);
  if (!record) return null;

  const impactFactors: ObjectImpactFactors = Object.freeze({
    relationshipCount: scoreRelationshipCount(record),
    connectedKpis: scoreConnectedKpis(record),
    connectedRisks: scoreConnectedRisks(record),
    businessDependency: scoreBusinessDependency(record),
  });
  const impactScore = clampScore(
    impactFactors.relationshipCount * 0.25 +
      impactFactors.connectedKpis * 0.25 +
      impactFactors.connectedRisks * 0.25 +
      impactFactors.businessDependency * 0.25
  );

  return Object.freeze({
    objectId: resolveObjectId(record, index, sourcePrefix),
    impactScore,
    impactLevel: resolveObjectImpactLevel(impactScore),
    impactFactors,
  });
}

function dedupeImpactResults(results: readonly ObjectImpactResult[]): readonly ObjectImpactResult[] {
  const byId = new Map<string, ObjectImpactResult>();
  for (const result of results) {
    if (!byId.has(result.objectId)) byId.set(result.objectId, result);
  }
  return Object.freeze([...byId.values()]);
}

export function buildObjectImpactRegistry(input: ObjectImpactBuildInput = {}): ObjectImpactRegistry {
  const sceneObjects = input.sceneObjects ?? readSceneObjects(input.sceneJson);
  const dataSourceObjects = input.dataSourceObjects ?? [];
  const objects = dedupeImpactResults([
    ...sceneObjects
      .map((object, index) => calculateObjectImpact(object, index, "scene"))
      .filter((result): result is ObjectImpactResult => result != null),
    ...dataSourceObjects
      .map((object, index) => calculateObjectImpact(object, index, "data_source"))
      .filter((result): result is ObjectImpactResult => result != null),
  ]);
  const impactByObjectId = Object.freeze(
    objects.reduce<Record<string, ObjectImpactResult>>((registry, result) => {
      registry[result.objectId] = result;
      return registry;
    }, {})
  );

  latestImpactRegistry = Object.freeze({
    version: OBJECT_IMPACT_ENGINE_VERSION,
    objects,
    impactByObjectId,
    objectCount: objects.length,
    sceneMutation: false,
    simulation: false,
    diagnostics: OBJECT_IMPACT_DIAGNOSTICS,
  });

  return latestImpactRegistry;
}

export function getObjectImpactRegistry(): ObjectImpactRegistry {
  return latestImpactRegistry;
}

export function resetObjectImpactEngineForTests(): void {
  latestImpactRegistry = EMPTY_OBJECT_IMPACT_REGISTRY;
}

export const ObjectImpactEngine = Object.freeze({
  calculateObjectImpact,
  buildObjectImpactRegistry,
  getObjectImpactRegistry,
  resolveObjectImpactLevel,
});
