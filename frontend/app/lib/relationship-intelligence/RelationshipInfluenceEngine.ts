import {
  EMPTY_RELATIONSHIP_INFLUENCE_REGISTRY,
  RELATIONSHIP_INFLUENCE_DIAGNOSTICS,
  RELATIONSHIP_INFLUENCE_ENGINE_VERSION,
  type RelationshipInfluenceBuildInput,
  type RelationshipInfluenceDirection,
  type RelationshipInfluenceFactors,
  type RelationshipInfluenceLevel,
  type RelationshipInfluenceProfile,
  type RelationshipInfluenceRegistry,
} from "./relationshipInfluenceContract.ts";

type RelationshipRecord = Readonly<Record<string, unknown>>;
type ObjectRecord = Readonly<Record<string, unknown>>;

let latestRelationshipInfluenceRegistry: RelationshipInfluenceRegistry =
  EMPTY_RELATIONSHIP_INFLUENCE_REGISTRY;

function asRecord(value: unknown): RelationshipRecord | null {
  return value && typeof value === "object" ? (value as RelationshipRecord) : null;
}

function readSceneRelationships(sceneJson: unknown): readonly unknown[] {
  const relationships = (sceneJson as { scene?: { relationships?: unknown[] } } | null)?.scene
    ?.relationships;
  return Array.isArray(relationships) ? relationships : [];
}

function readSceneObjects(sceneJson: unknown): readonly unknown[] {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  return Array.isArray(objects) ? objects : [];
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
  if (typeof value === "boolean") return value ? 100 : 0;
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "critical" || normalized === "high" || normalized === "strong") return 90;
  if (normalized === "medium" || normalized === "moderate") return 60;
  if (normalized === "low" || normalized === "weak") return 30;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  return parsed >= 0 && parsed <= 1 ? clampScore(parsed * 100) : clampScore(parsed);
}

function metadata(record: RelationshipRecord): RelationshipRecord {
  return asRecord(record.metadata) ?? Object.freeze({});
}

function resolveRelationshipId(record: RelationshipRecord, index: number): string {
  return (
    readString(record.relationshipId) ||
    readString(record.id) ||
    `relationship:${readString(record.sourceId) || "source"}:${readString(record.targetId) || "target"}:${index + 1}`
  );
}

function resolveSourceId(record: RelationshipRecord): string {
  return readString(record.sourceId) || readString(record.sourceObjectId) || readString(record.from);
}

function resolveTargetId(record: RelationshipRecord): string {
  return readString(record.targetId) || readString(record.targetObjectId) || readString(record.to);
}

function resolveRelationshipType(record: RelationshipRecord): string {
  return (
    readString(record.type) ||
    readString(record.relationshipType) ||
    readString(metadata(record).type) ||
    "dependency"
  );
}

function buildObjectMap(objects: readonly unknown[]): Readonly<Record<string, ObjectRecord>> {
  return Object.freeze(
    objects.reduce<Record<string, ObjectRecord>>((registry, raw) => {
      const record = asRecord(raw);
      const id = record ? readString(record.id) || readString(record.objectId) || readString(record.name) : "";
      if (record && id) registry[id] = record;
      return registry;
    }, {})
  );
}

function arrayStrings(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return Object.freeze([]);
  return Object.freeze(value.map((entry) => readString(entry).toLowerCase()).filter(Boolean));
}

function objectInfluenceTags(record: ObjectRecord | undefined): readonly string[] {
  if (!record) return Object.freeze([]);
  return Object.freeze([
    ...arrayStrings(record.tags),
    readString(record.category).toLowerCase(),
    readString(record.role).toLowerCase(),
    readString(record.type).toLowerCase(),
  ].filter(Boolean));
}

function scoreBusinessInfluence(
  record: RelationshipRecord,
  source?: ObjectRecord,
  target?: ObjectRecord
): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.businessInfluence) ??
    readScore(meta.businessInfluence) ??
    readScore(record.business_influence) ??
    readScore(meta.business_influence) ??
    readScore(record.influence) ??
    readScore(meta.influence);
  if (explicit != null) return explicit;

  const type = resolveRelationshipType(record);
  const tags = [...objectInfluenceTags(source), ...objectInfluenceTags(target), type.toLowerCase()];
  if (tags.some((tag) => ["executive", "strategic", "revenue", "customer", "influences"].includes(tag))) {
    return 82;
  }
  if (type === "supports" || type === "blocks") return 72;
  return 50;
}

function scoreDecisionInfluence(record: RelationshipRecord, source?: ObjectRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.decisionInfluence) ??
    readScore(meta.decisionInfluence) ??
    readScore(record.decision_influence) ??
    readScore(meta.decision_influence);
  if (explicit != null) return explicit;

  const tags = objectInfluenceTags(source);
  if (tags.some((tag) => ["executive", "owner", "decision", "governance"].includes(tag))) return 78;
  return resolveRelationshipType(record) === "ownership" || resolveRelationshipType(record) === "owns" ? 70 : 45;
}

function scoreDependencyInfluence(record: RelationshipRecord, target?: ObjectRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.dependencyInfluence) ??
    readScore(meta.dependencyInfluence) ??
    readScore(record.dependency_influence) ??
    readScore(meta.dependency_influence) ??
    readScore(record.dependency) ??
    readScore(meta.dependency);
  if (explicit != null) return explicit;

  const dependencies = Array.isArray(target?.dependencies) ? target.dependencies.length : 0;
  if (dependencies > 0) return clampScore(40 + dependencies * 12);
  const type = resolveRelationshipType(record);
  if (type === "dependency" || type === "supplies" || type === "flow") return 70;
  return 40;
}

function scoreConfidence(record: RelationshipRecord): number {
  const meta = metadata(record);
  return (
    readScore(record.confidence) ??
    readScore(meta.confidence) ??
    readScore(record.dataConfidence) ??
    readScore(meta.dataConfidence) ??
    70
  );
}

export function resolveRelationshipInfluenceLevel(
  influenceScore: number
): RelationshipInfluenceLevel {
  if (influenceScore >= 85) return "Critical";
  if (influenceScore >= 65) return "High";
  if (influenceScore >= 40) return "Moderate";
  return "Low";
}

export function resolveRelationshipInfluenceDirection(
  record: unknown,
  influenceScore = 0
): RelationshipInfluenceDirection {
  const relationship = asRecord(record);
  if (!relationship) return "neutral";

  const explicit = readString(relationship.influenceDirection) || readString(metadata(relationship).influenceDirection);
  if (
    explicit === "source-to-target" ||
    explicit === "target-to-source" ||
    explicit === "bidirectional" ||
    explicit === "neutral"
  ) {
    return explicit;
  }

  const direction = readString(relationship.direction).toLowerCase();
  if (direction === "bi" || direction === "bidirectional") return "bidirectional";
  if (direction === "reverse" || direction === "target-to-source") return "target-to-source";
  return influenceScore >= 25 ? "source-to-target" : "neutral";
}

function buildInfluenceReasoning(
  level: RelationshipInfluenceLevel,
  direction: RelationshipInfluenceDirection,
  score: number,
  factors: RelationshipInfluenceFactors
): readonly string[] {
  return Object.freeze([
    `Relationship influence is ${level}.`,
    `Influence score is ${score} with ${direction} direction.`,
    `Business influence ${factors.businessInfluence}, decision influence ${factors.decisionInfluence}, dependency influence ${factors.dependencyInfluence}, confidence ${factors.confidence}.`,
  ]);
}

export function calculateRelationshipInfluenceProfile(
  raw: unknown,
  index = 0,
  objectById: Readonly<Record<string, ObjectRecord>> = Object.freeze({})
): RelationshipInfluenceProfile | null {
  const record = asRecord(raw);
  if (!record) return null;

  const sourceId = resolveSourceId(record);
  const targetId = resolveTargetId(record);
  if (!sourceId || !targetId) return null;

  const source = objectById[sourceId];
  const target = objectById[targetId];
  const influenceFactors: RelationshipInfluenceFactors = Object.freeze({
    businessInfluence: scoreBusinessInfluence(record, source, target),
    decisionInfluence: scoreDecisionInfluence(record, source),
    dependencyInfluence: scoreDependencyInfluence(record, target),
    confidence: scoreConfidence(record),
  });
  const influenceScore = clampScore(
    influenceFactors.businessInfluence * 0.35 +
      influenceFactors.decisionInfluence * 0.25 +
      influenceFactors.dependencyInfluence * 0.25 +
      influenceFactors.confidence * 0.15
  );
  const influenceLevel = resolveRelationshipInfluenceLevel(influenceScore);
  const influenceDirection = resolveRelationshipInfluenceDirection(record, influenceScore);

  return Object.freeze({
    relationshipId: resolveRelationshipId(record, index),
    sourceId,
    targetId,
    relationshipType: resolveRelationshipType(record),
    influenceScore,
    influenceLevel,
    influenceDirection,
    influenceFactors,
    influenceReasoning: buildInfluenceReasoning(
      influenceLevel,
      influenceDirection,
      influenceScore,
      influenceFactors
    ),
  });
}

function dedupeProfiles(
  profiles: readonly RelationshipInfluenceProfile[]
): readonly RelationshipInfluenceProfile[] {
  const byId = new Map<string, RelationshipInfluenceProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.relationshipId)) byId.set(profile.relationshipId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildRelationshipInfluenceRegistry(
  input: RelationshipInfluenceBuildInput = {}
): RelationshipInfluenceRegistry {
  const relationships = input.relationships ?? readSceneRelationships(input.sceneJson);
  const objects = input.objects ?? readSceneObjects(input.sceneJson);
  const objectById = buildObjectMap(objects);
  const profiles = dedupeProfiles(
    relationships
      .map((relationship, index) => calculateRelationshipInfluenceProfile(relationship, index, objectById))
      .filter((profile): profile is RelationshipInfluenceProfile => profile != null)
  );
  const influenceByRelationshipId = Object.freeze(
    profiles.reduce<Record<string, RelationshipInfluenceProfile>>((registry, profile) => {
      registry[profile.relationshipId] = profile;
      return registry;
    }, {})
  );

  latestRelationshipInfluenceRegistry = Object.freeze({
    version: RELATIONSHIP_INFLUENCE_ENGINE_VERSION,
    profiles,
    influenceByRelationshipId,
    relationshipCount: profiles.length,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    diagnostics: RELATIONSHIP_INFLUENCE_DIAGNOSTICS,
  });

  return latestRelationshipInfluenceRegistry;
}

export function getRelationshipInfluenceRegistry(): RelationshipInfluenceRegistry {
  return latestRelationshipInfluenceRegistry;
}

export function resetRelationshipInfluenceEngineForTests(): void {
  latestRelationshipInfluenceRegistry = EMPTY_RELATIONSHIP_INFLUENCE_REGISTRY;
}

export const RelationshipInfluenceEngine = Object.freeze({
  calculateRelationshipInfluenceProfile,
  buildRelationshipInfluenceRegistry,
  getRelationshipInfluenceRegistry,
  resolveRelationshipInfluenceDirection,
  resolveRelationshipInfluenceLevel,
});
