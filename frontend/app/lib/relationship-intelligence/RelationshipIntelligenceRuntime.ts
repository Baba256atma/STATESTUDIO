import {
  EMPTY_RELATIONSHIP_INTELLIGENCE_REGISTRY,
  RELATIONSHIP_INTELLIGENCE_DIAGNOSTICS,
  RELATIONSHIP_INTELLIGENCE_RUNTIME_VERSION,
  type RelationshipIntelligenceBuildInput,
  type RelationshipIntelligenceProfile,
  type RelationshipIntelligenceRegistry,
} from "./relationshipIntelligenceContract.ts";

type RelationshipRecord = Readonly<Record<string, unknown>>;

let latestRelationshipIntelligenceRegistry: RelationshipIntelligenceRegistry =
  EMPTY_RELATIONSHIP_INTELLIGENCE_REGISTRY;

function asRecord(value: unknown): RelationshipRecord | null {
  return value && typeof value === "object" ? (value as RelationshipRecord) : null;
}

function readSceneRelationships(sceneJson: unknown): readonly unknown[] {
  const relationships = (sceneJson as { scene?: { relationships?: unknown[] } } | null)?.scene
    ?.relationships;
  return Array.isArray(relationships) ? relationships : [];
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

function scoreStrength(record: RelationshipRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.strength) ??
    readScore(meta.strength) ??
    readScore(record.weight) ??
    readScore(meta.weight);
  if (explicit != null) return explicit;

  const type = resolveRelationshipType(record);
  if (type === "blocks" || type === "risk") return 82;
  if (type === "dependency" || type === "supplies") return 72;
  if (type === "influences" || type === "supports") return 64;
  return 50;
}

function scoreDependency(record: RelationshipRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.dependency) ??
    readScore(meta.dependency) ??
    readScore(record.dependencyWeight) ??
    readScore(meta.dependencyWeight);
  if (explicit != null) return explicit;

  const type = resolveRelationshipType(record);
  if (type === "dependency" || type === "supplies") return 85;
  if (type === "blocks" || type === "resource") return 70;
  if (type === "supports") return 62;
  return 40;
}

function scoreInfluence(record: RelationshipRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.influence) ??
    readScore(meta.influence) ??
    readScore(record.influenceWeight) ??
    readScore(meta.influenceWeight);
  if (explicit != null) return explicit;

  const type = resolveRelationshipType(record);
  const direction = readString(record.direction);
  if (type === "influences" || type === "blocks") return direction === "bi" ? 88 : 78;
  if (type === "reports_to" || type === "ownership" || type === "owns") return 72;
  if (direction === "bi") return 66;
  return 52;
}

function scoreConfidence(record: RelationshipRecord): number {
  const meta = metadata(record);
  return (
    readScore(record.confidence) ??
    readScore(meta.confidence) ??
    readScore(record.sourceConfidence) ??
    readScore(meta.sourceConfidence) ??
    70
  );
}

function scoreRiskExposure(record: RelationshipRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.riskExposure) ??
    readScore(meta.riskExposure) ??
    readScore(record.risk) ??
    readScore(meta.risk);
  if (explicit != null) return explicit;

  const type = resolveRelationshipType(record);
  if (type === "blocks" || type === "risk") return 90;
  if (type === "dependency" || type === "supplies") return 62;
  return 35;
}

export function createRelationshipIntelligenceProfile(
  raw: unknown,
  index = 0
): RelationshipIntelligenceProfile | null {
  const record = asRecord(raw);
  if (!record) return null;

  const sourceId = resolveSourceId(record);
  const targetId = resolveTargetId(record);
  if (!sourceId || !targetId) return null;

  return Object.freeze({
    relationshipId: resolveRelationshipId(record, index),
    sourceId,
    targetId,
    relationshipType: resolveRelationshipType(record),
    strength: scoreStrength(record),
    dependency: scoreDependency(record),
    influence: scoreInfluence(record),
    confidence: scoreConfidence(record),
    riskExposure: scoreRiskExposure(record),
  });
}

function dedupeProfiles(
  profiles: readonly RelationshipIntelligenceProfile[]
): readonly RelationshipIntelligenceProfile[] {
  const byId = new Map<string, RelationshipIntelligenceProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.relationshipId)) byId.set(profile.relationshipId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildRelationshipIntelligenceRegistry(
  input: RelationshipIntelligenceBuildInput = {}
): RelationshipIntelligenceRegistry {
  const relationships = input.relationships ?? readSceneRelationships(input.sceneJson);
  const profiles = dedupeProfiles(
    relationships
      .map((relationship, index) => createRelationshipIntelligenceProfile(relationship, index))
      .filter((profile): profile is RelationshipIntelligenceProfile => profile != null)
  );
  const profileByRelationshipId = Object.freeze(
    profiles.reduce<Record<string, RelationshipIntelligenceProfile>>((registry, profile) => {
      registry[profile.relationshipId] = profile;
      return registry;
    }, {})
  );

  latestRelationshipIntelligenceRegistry = Object.freeze({
    version: RELATIONSHIP_INTELLIGENCE_RUNTIME_VERSION,
    profiles,
    profileByRelationshipId,
    relationshipCount: profiles.length,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    diagnostics: RELATIONSHIP_INTELLIGENCE_DIAGNOSTICS,
  });

  return latestRelationshipIntelligenceRegistry;
}

export function getRelationshipIntelligenceRegistry(): RelationshipIntelligenceRegistry {
  return latestRelationshipIntelligenceRegistry;
}

export function resetRelationshipIntelligenceRuntimeForTests(): void {
  latestRelationshipIntelligenceRegistry = EMPTY_RELATIONSHIP_INTELLIGENCE_REGISTRY;
}
