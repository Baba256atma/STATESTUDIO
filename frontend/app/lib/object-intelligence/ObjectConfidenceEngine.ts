import {
  EMPTY_OBJECT_CONFIDENCE_REGISTRY,
  OBJECT_CONFIDENCE_DIAGNOSTICS,
  OBJECT_CONFIDENCE_ENGINE_VERSION,
  type ObjectConfidenceBuildInput,
  type ObjectConfidenceFactors,
  type ObjectConfidenceRegistry,
  type ObjectConfidenceResult,
} from "./objectConfidenceContract.ts";

type ObjectRecord = Readonly<Record<string, unknown>>;

let latestConfidenceRegistry: ObjectConfidenceRegistry = EMPTY_OBJECT_CONFIDENCE_REGISTRY;

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
  if (normalized === "verified" || normalized === "high" || normalized === "fresh") return 90;
  if (normalized === "medium" || normalized === "partial" || normalized === "stale") return 60;
  if (normalized === "low" || normalized === "unknown" || normalized === "unverified") return 30;
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

function scoreDataQuality(record: ObjectRecord): number {
  const explicit =
    readNumericScore(record.dataQuality) ??
    readNumericScore(record.data_quality) ??
    readNumericScore(record.quality);
  if (explicit != null) return explicit;

  const checks = [
    readString(record.objectId) || readString(record.id) || readString(record.name),
    readString(record.label) || readString(record.display_label) || readString(record.canonical_name),
    readString(record.objectType) || readString(record.type) || readString(record.category),
    record.semantic != null || readString(record.business_meaning) || Array.isArray(record.tags),
  ];
  return clampScore((checks.filter(Boolean).length / checks.length) * 100);
}

function scoreDataFreshness(record: ObjectRecord): number {
  const explicit =
    readNumericScore(record.dataFreshness) ??
    readNumericScore(record.data_freshness) ??
    readNumericScore(record.freshness);
  if (explicit != null) return explicit;

  const rawDate =
    readString(record.updatedAt) ||
    readString(record.updated_at) ||
    readString(record.lastUpdatedAt) ||
    readString(record.last_updated_at) ||
    readString(record.createdAt) ||
    readString(record.created_at);
  const timestamp = Date.parse(rawDate);
  if (!Number.isFinite(timestamp)) return 65;

  const ageDays = (Date.now() - timestamp) / 86_400_000;
  if (ageDays <= 1) return 95;
  if (ageDays <= 7) return 85;
  if (ageDays <= 30) return 70;
  if (ageDays <= 90) return 50;
  return 30;
}

function scoreSourceReliability(record: ObjectRecord): number {
  return (
    readNumericScore(record.sourceReliability) ??
    readNumericScore(record.source_reliability) ??
    readNumericScore(record.sourceConfidence) ??
    readNumericScore(record.source_confidence) ??
    readNumericScore(record.confidence) ??
    (readString(record.sourceId) ? 80 : 65)
  );
}

function scoreRelationshipCertainty(record: ObjectRecord): number {
  const explicit =
    readNumericScore(record.relationshipCertainty) ??
    readNumericScore(record.relationship_certainty) ??
    readNumericScore(record.relationshipConfidence) ??
    readNumericScore(record.relationship_confidence);
  if (explicit != null) return explicit;

  const relationships = Array.isArray(record.relationships) ? record.relationships : [];
  if (relationships.length === 0) return 70;

  let total = 0;
  for (const relationship of relationships) {
    const rel = asRecord(relationship);
    const confidence = rel ? readNumericScore(rel.confidence) : null;
    total += confidence ?? 65;
  }
  return clampScore(total / relationships.length);
}

function describeBand(score: number): string {
  if (score >= 85) return "strong";
  if (score >= 70) return "solid";
  if (score >= 45) return "limited";
  return "weak";
}

function buildConfidenceReasoning(factors: ObjectConfidenceFactors): readonly string[] {
  return Object.freeze([
    `Data quality is ${describeBand(factors.dataQuality)} (${factors.dataQuality}%).`,
    `Data freshness is ${describeBand(factors.dataFreshness)} (${factors.dataFreshness}%).`,
    `Source reliability is ${describeBand(factors.sourceReliability)} (${factors.sourceReliability}%).`,
    `Relationship certainty is ${describeBand(factors.relationshipCertainty)} (${factors.relationshipCertainty}%).`,
  ]);
}

function buildConfidenceExplanation(score: number, factors: ObjectConfidenceFactors): string {
  const weakest = Object.entries(factors).reduce(
    (lowest, entry) => (entry[1] < lowest[1] ? entry : lowest),
    ["dataQuality", factors.dataQuality] as [string, number]
  );
  return `Confidence is ${score}% with ${describeBand(score)} support; weakest factor is ${weakest[0]} at ${weakest[1]}%.`;
}

export function calculateObjectConfidence(
  raw: unknown,
  index = 0,
  sourcePrefix = "object"
): ObjectConfidenceResult | null {
  const record = asRecord(raw);
  if (!record) return null;

  const confidenceFactors: ObjectConfidenceFactors = Object.freeze({
    dataQuality: scoreDataQuality(record),
    dataFreshness: scoreDataFreshness(record),
    sourceReliability: scoreSourceReliability(record),
    relationshipCertainty: scoreRelationshipCertainty(record),
  });
  const confidenceScore = clampScore(
    confidenceFactors.dataQuality * 0.3 +
      confidenceFactors.dataFreshness * 0.25 +
      confidenceFactors.sourceReliability * 0.25 +
      confidenceFactors.relationshipCertainty * 0.2
  );

  return Object.freeze({
    objectId: resolveObjectId(record, index, sourcePrefix),
    confidenceScore,
    confidenceExplanation: buildConfidenceExplanation(confidenceScore, confidenceFactors),
    confidenceReasoning: buildConfidenceReasoning(confidenceFactors),
    confidenceFactors,
  });
}

function dedupeConfidenceResults(results: readonly ObjectConfidenceResult[]): readonly ObjectConfidenceResult[] {
  const byId = new Map<string, ObjectConfidenceResult>();
  for (const result of results) {
    if (!byId.has(result.objectId)) byId.set(result.objectId, result);
  }
  return Object.freeze([...byId.values()]);
}

export function buildObjectConfidenceRegistry(
  input: ObjectConfidenceBuildInput = {}
): ObjectConfidenceRegistry {
  const sceneObjects = input.sceneObjects ?? readSceneObjects(input.sceneJson);
  const dataSourceObjects = input.dataSourceObjects ?? [];
  const objects = dedupeConfidenceResults([
    ...sceneObjects
      .map((object, index) => calculateObjectConfidence(object, index, "scene"))
      .filter((result): result is ObjectConfidenceResult => result != null),
    ...dataSourceObjects
      .map((object, index) => calculateObjectConfidence(object, index, "data_source"))
      .filter((result): result is ObjectConfidenceResult => result != null),
  ]);
  const confidenceByObjectId = Object.freeze(
    objects.reduce<Record<string, ObjectConfidenceResult>>((registry, result) => {
      registry[result.objectId] = result;
      return registry;
    }, {})
  );

  latestConfidenceRegistry = Object.freeze({
    version: OBJECT_CONFIDENCE_ENGINE_VERSION,
    objects,
    confidenceByObjectId,
    objectCount: objects.length,
    sceneMutation: false,
    simulation: false,
    diagnostics: OBJECT_CONFIDENCE_DIAGNOSTICS,
  });

  return latestConfidenceRegistry;
}

export function getObjectConfidenceRegistry(): ObjectConfidenceRegistry {
  return latestConfidenceRegistry;
}

export function resetObjectConfidenceEngineForTests(): void {
  latestConfidenceRegistry = EMPTY_OBJECT_CONFIDENCE_REGISTRY;
}

export const ObjectConfidenceEngine = Object.freeze({
  calculateObjectConfidence,
  buildObjectConfidenceRegistry,
  getObjectConfidenceRegistry,
});
