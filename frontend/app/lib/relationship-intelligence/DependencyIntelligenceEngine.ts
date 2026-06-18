import {
  DEPENDENCY_DIAGNOSTICS,
  DEPENDENCY_ENGINE_VERSION,
  EMPTY_DEPENDENCY_INTELLIGENCE_REGISTRY,
  type DependencyFactors,
  type DependencyIntelligenceBuildInput,
  type DependencyIntelligenceRegistry,
  type DependencyLevel,
  type DependencyProfile,
} from "./dependencyIntelligenceContract.ts";

type RelationshipRecord = Readonly<Record<string, unknown>>;
type ObjectRecord = Readonly<Record<string, unknown>>;

let latestDependencyIntelligenceRegistry: DependencyIntelligenceRegistry =
  EMPTY_DEPENDENCY_INTELLIGENCE_REGISTRY;

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
  if (normalized === "critical" || normalized === "high") return 90;
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

function arrayStrings(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return Object.freeze([]);
  return Object.freeze(value.map((entry) => readString(entry)).filter(Boolean));
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

function scoreDependencyWeight(record: RelationshipRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.dependencyScore) ??
    readScore(meta.dependencyScore) ??
    readScore(record.dependencyWeight) ??
    readScore(meta.dependencyWeight) ??
    readScore(record.dependency) ??
    readScore(meta.dependency);
  if (explicit != null) return explicit;

  const type = resolveRelationshipType(record);
  if (type === "dependency" || type === "supplies") return 86;
  if (type === "blocks" || type === "resource") return 76;
  if (type === "supports") return 60;
  return 35;
}

function scoreDirectionCriticality(record: RelationshipRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.directionCriticality) ??
    readScore(meta.directionCriticality) ??
    readScore(record.direction_criticality) ??
    readScore(meta.direction_criticality);
  if (explicit != null) return explicit;

  const direction = readString(record.direction);
  const type = resolveRelationshipType(record);
  if (type === "blocks") return 90;
  if (direction === "uni") return 78;
  if (direction === "bi") return 62;
  return 55;
}

function scoreRedundancy(
  record: RelationshipRecord,
  objectById: Readonly<Record<string, ObjectRecord>>
): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.redundancy) ??
    readScore(meta.redundancy) ??
    readScore(record.alternatePathCoverage) ??
    readScore(meta.alternatePathCoverage);
  if (explicit != null) return explicit;

  const alternates = arrayStrings(record.alternativeSourceIds ?? meta.alternativeSourceIds);
  if (alternates.length > 0) return clampScore(alternates.length * 35);

  const target = objectById[resolveTargetId(record)];
  const targetAlternates = arrayStrings(target?.alternativeSourceIds ?? target?.backupSourceIds);
  if (targetAlternates.length > 0) return clampScore(targetAlternates.length * 35);
  return 10;
}

function scoreContinuityRisk(record: RelationshipRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.continuityRisk) ??
    readScore(meta.continuityRisk) ??
    readScore(record.riskExposure) ??
    readScore(meta.riskExposure) ??
    readScore(record.risk) ??
    readScore(meta.risk);
  if (explicit != null) return explicit;

  const type = resolveRelationshipType(record);
  if (type === "blocks" || type === "risk") return 90;
  if (type === "dependency" || type === "supplies") return 70;
  return 45;
}

export function resolveDependencyLevel(dependencyScore: number): DependencyLevel {
  if (dependencyScore >= 85) return "Critical Dependency";
  if (dependencyScore >= 65) return "Highly Dependent";
  if (dependencyScore >= 40) return "Dependent";
  return "Independent";
}

function detectSinglePointOfFailure(
  dependencyScore: number,
  factors: DependencyFactors
): boolean {
  return dependencyScore >= 75 && factors.redundancy < 35 && factors.continuityRisk >= 65;
}

function buildDependencyReasoning(
  level: DependencyLevel,
  score: number,
  singlePointOfFailure: boolean,
  factors: DependencyFactors
): readonly string[] {
  return Object.freeze([
    `Dependency level is ${level}.`,
    `Dependency score is ${score}.`,
    singlePointOfFailure
      ? "Single point of failure detected."
      : "No single point of failure detected.",
    `Dependency weight ${factors.dependencyWeight}, direction criticality ${factors.directionCriticality}, redundancy ${factors.redundancy}, continuity risk ${factors.continuityRisk}.`,
  ]);
}

export function calculateDependencyProfile(
  raw: unknown,
  index = 0,
  objectById: Readonly<Record<string, ObjectRecord>> = Object.freeze({})
): DependencyProfile | null {
  const record = asRecord(raw);
  if (!record) return null;

  const sourceId = resolveSourceId(record);
  const targetId = resolveTargetId(record);
  if (!sourceId || !targetId) return null;

  const dependencyFactors: DependencyFactors = Object.freeze({
    dependencyWeight: scoreDependencyWeight(record),
    directionCriticality: scoreDirectionCriticality(record),
    redundancy: scoreRedundancy(record, objectById),
    continuityRisk: scoreContinuityRisk(record),
  });
  const dependencyScore = clampScore(
    dependencyFactors.dependencyWeight * 0.35 +
      dependencyFactors.directionCriticality * 0.25 +
      (100 - dependencyFactors.redundancy) * 0.2 +
      dependencyFactors.continuityRisk * 0.2
  );
  const dependencyLevel = resolveDependencyLevel(dependencyScore);
  const singlePointOfFailure = detectSinglePointOfFailure(dependencyScore, dependencyFactors);

  return Object.freeze({
    relationshipId: resolveRelationshipId(record, index),
    sourceId,
    targetId,
    relationshipType: resolveRelationshipType(record),
    dependencyScore,
    dependencyLevel,
    singlePointOfFailure,
    dependencyFactors,
    dependencyReasoning: buildDependencyReasoning(
      dependencyLevel,
      dependencyScore,
      singlePointOfFailure,
      dependencyFactors
    ),
  });
}

function dedupeProfiles(profiles: readonly DependencyProfile[]): readonly DependencyProfile[] {
  const byId = new Map<string, DependencyProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.relationshipId)) byId.set(profile.relationshipId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildDependencyIntelligenceRegistry(
  input: DependencyIntelligenceBuildInput = {}
): DependencyIntelligenceRegistry {
  const relationships = input.relationships ?? readSceneRelationships(input.sceneJson);
  const objects = input.objects ?? readSceneObjects(input.sceneJson);
  const objectById = buildObjectMap(objects);
  const profiles = dedupeProfiles(
    relationships
      .map((relationship, index) => calculateDependencyProfile(relationship, index, objectById))
      .filter((profile): profile is DependencyProfile => profile != null)
  );
  const dependencyByRelationshipId = Object.freeze(
    profiles.reduce<Record<string, DependencyProfile>>((registry, profile) => {
      registry[profile.relationshipId] = profile;
      return registry;
    }, {})
  );

  latestDependencyIntelligenceRegistry = Object.freeze({
    version: DEPENDENCY_ENGINE_VERSION,
    profiles,
    dependencyByRelationshipId,
    relationshipCount: profiles.length,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    diagnostics: DEPENDENCY_DIAGNOSTICS,
  });

  return latestDependencyIntelligenceRegistry;
}

export function getDependencyIntelligenceRegistry(): DependencyIntelligenceRegistry {
  return latestDependencyIntelligenceRegistry;
}

export function resetDependencyIntelligenceEngineForTests(): void {
  latestDependencyIntelligenceRegistry = EMPTY_DEPENDENCY_INTELLIGENCE_REGISTRY;
}

export const DependencyIntelligenceEngine = Object.freeze({
  calculateDependencyProfile,
  buildDependencyIntelligenceRegistry,
  getDependencyIntelligenceRegistry,
  resolveDependencyLevel,
});
