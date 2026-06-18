import {
  EMPTY_RELATIONSHIP_STRENGTH_REGISTRY,
  RELATIONSHIP_STRENGTH_DIAGNOSTICS,
  RELATIONSHIP_STRENGTH_ENGINE_VERSION,
  type RelationshipStrengthBuildInput,
  type RelationshipStrengthFactors,
  type RelationshipStrengthLevel,
  type RelationshipStrengthProfile,
  type RelationshipStrengthRegistry,
} from "./relationshipStrengthContract.ts";

type RelationshipRecord = Readonly<Record<string, unknown>>;
type ObjectRecord = Readonly<Record<string, unknown>>;

let latestRelationshipStrengthRegistry: RelationshipStrengthRegistry =
  EMPTY_RELATIONSHIP_STRENGTH_REGISTRY;

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
  return Object.freeze(value.map((entry) => readString(entry)).filter(Boolean));
}

function scoreInteractionFrequency(record: RelationshipRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.interactionFrequency) ??
    readScore(meta.interactionFrequency) ??
    readScore(record.interaction_frequency) ??
    readScore(meta.interaction_frequency) ??
    readScore(record.frequency) ??
    readScore(meta.frequency);
  if (explicit != null) return explicit;

  const interactionCount =
    readScore(record.interactionCount) ??
    readScore(meta.interactionCount) ??
    readScore(record.interaction_count) ??
    readScore(meta.interaction_count);
  if (interactionCount != null) return clampScore(interactionCount * 10);

  const type = resolveRelationshipType(record);
  if (type === "supplies" || type === "dependency" || type === "flow") return 72;
  if (type === "reports_to" || type === "ownership" || type === "owns") return 64;
  return 50;
}

function scoreSharedDependencies(
  record: RelationshipRecord,
  objectById: Readonly<Record<string, ObjectRecord>>
): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.sharedDependencies) ??
    readScore(meta.sharedDependencies) ??
    readScore(record.shared_dependencies) ??
    readScore(meta.shared_dependencies);
  if (explicit != null) return explicit;

  const directShared = arrayStrings(record.sharedDependencyIds ?? meta.sharedDependencyIds);
  if (directShared.length > 0) return clampScore(directShared.length * 25);

  const source = objectById[resolveSourceId(record)];
  const target = objectById[resolveTargetId(record)];
  const sourceDependencies = new Set(arrayStrings(source?.dependencies));
  const targetDependencies = arrayStrings(target?.dependencies);
  const shared = targetDependencies.filter((dependency) => sourceDependencies.has(dependency));
  return clampScore(shared.length * 25);
}

function scoreRelationshipHistory(record: RelationshipRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.relationshipHistory) ??
    readScore(meta.relationshipHistory) ??
    readScore(record.relationship_history) ??
    readScore(meta.relationship_history) ??
    readScore(record.historyScore) ??
    readScore(meta.historyScore);
  if (explicit != null) return explicit;

  const events = Array.isArray(record.history)
    ? record.history
    : Array.isArray(meta.history)
      ? meta.history
      : [];
  if (events.length > 0) return clampScore(45 + events.length * 12);
  return readString(record.createdAt) ? 58 : 45;
}

function scoreDataConfidence(record: RelationshipRecord): number {
  const meta = metadata(record);
  return (
    readScore(record.dataConfidence) ??
    readScore(meta.dataConfidence) ??
    readScore(record.data_confidence) ??
    readScore(meta.data_confidence) ??
    readScore(record.confidence) ??
    readScore(meta.confidence) ??
    70
  );
}

export function resolveRelationshipStrengthLevel(strengthScore: number): RelationshipStrengthLevel {
  if (strengthScore >= 85) return "Critical";
  if (strengthScore >= 65) return "Strong";
  if (strengthScore >= 40) return "Moderate";
  return "Weak";
}

function buildStrengthReasoning(
  level: RelationshipStrengthLevel,
  score: number,
  factors: RelationshipStrengthFactors
): readonly string[] {
  return Object.freeze([
    `Relationship strength is ${level}.`,
    `Strength score is ${score}.`,
    `Interaction frequency ${factors.interactionFrequency}, shared dependencies ${factors.sharedDependencies}, relationship history ${factors.relationshipHistory}, data confidence ${factors.dataConfidence}.`,
  ]);
}

export function calculateRelationshipStrengthProfile(
  raw: unknown,
  index = 0,
  objectById: Readonly<Record<string, ObjectRecord>> = Object.freeze({})
): RelationshipStrengthProfile | null {
  const record = asRecord(raw);
  if (!record) return null;

  const sourceId = resolveSourceId(record);
  const targetId = resolveTargetId(record);
  if (!sourceId || !targetId) return null;

  const strengthFactors: RelationshipStrengthFactors = Object.freeze({
    interactionFrequency: scoreInteractionFrequency(record),
    sharedDependencies: scoreSharedDependencies(record, objectById),
    relationshipHistory: scoreRelationshipHistory(record),
    dataConfidence: scoreDataConfidence(record),
  });
  const strengthScore = clampScore(
    strengthFactors.interactionFrequency * 0.3 +
      strengthFactors.sharedDependencies * 0.2 +
      strengthFactors.relationshipHistory * 0.25 +
      strengthFactors.dataConfidence * 0.25
  );
  const strengthLevel = resolveRelationshipStrengthLevel(strengthScore);

  return Object.freeze({
    relationshipId: resolveRelationshipId(record, index),
    sourceId,
    targetId,
    relationshipType: resolveRelationshipType(record),
    strengthScore,
    strengthLevel,
    strengthFactors,
    strengthReasoning: buildStrengthReasoning(strengthLevel, strengthScore, strengthFactors),
  });
}

function dedupeProfiles(
  profiles: readonly RelationshipStrengthProfile[]
): readonly RelationshipStrengthProfile[] {
  const byId = new Map<string, RelationshipStrengthProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.relationshipId)) byId.set(profile.relationshipId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildRelationshipStrengthRegistry(
  input: RelationshipStrengthBuildInput = {}
): RelationshipStrengthRegistry {
  const relationships = input.relationships ?? readSceneRelationships(input.sceneJson);
  const objects = input.objects ?? readSceneObjects(input.sceneJson);
  const objectById = buildObjectMap(objects);
  const profiles = dedupeProfiles(
    relationships
      .map((relationship, index) => calculateRelationshipStrengthProfile(relationship, index, objectById))
      .filter((profile): profile is RelationshipStrengthProfile => profile != null)
  );
  const strengthByRelationshipId = Object.freeze(
    profiles.reduce<Record<string, RelationshipStrengthProfile>>((registry, profile) => {
      registry[profile.relationshipId] = profile;
      return registry;
    }, {})
  );

  latestRelationshipStrengthRegistry = Object.freeze({
    version: RELATIONSHIP_STRENGTH_ENGINE_VERSION,
    profiles,
    strengthByRelationshipId,
    relationshipCount: profiles.length,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    diagnostics: RELATIONSHIP_STRENGTH_DIAGNOSTICS,
  });

  return latestRelationshipStrengthRegistry;
}

export function getRelationshipStrengthRegistry(): RelationshipStrengthRegistry {
  return latestRelationshipStrengthRegistry;
}

export function resetRelationshipStrengthEngineForTests(): void {
  latestRelationshipStrengthRegistry = EMPTY_RELATIONSHIP_STRENGTH_REGISTRY;
}

export const RelationshipStrengthEngine = Object.freeze({
  calculateRelationshipStrengthProfile,
  buildRelationshipStrengthRegistry,
  getRelationshipStrengthRegistry,
  resolveRelationshipStrengthLevel,
});
