import {
  EMPTY_RELATIONSHIP_RISK_EXPOSURE_REGISTRY,
  RELATIONSHIP_RISK_DIAGNOSTICS,
  RELATIONSHIP_RISK_ENGINE_VERSION,
  type RelationshipRiskExposureBuildInput,
  type RelationshipRiskExposureFactors,
  type RelationshipRiskExposureLevel,
  type RelationshipRiskExposureProfile,
  type RelationshipRiskExposureRegistry,
  type RelationshipRiskType,
} from "./relationshipRiskExposureContract.ts";

type RelationshipRecord = Readonly<Record<string, unknown>>;
type ObjectRecord = Readonly<Record<string, unknown>>;

let latestRelationshipRiskExposureRegistry: RelationshipRiskExposureRegistry =
  EMPTY_RELATIONSHIP_RISK_EXPOSURE_REGISTRY;

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
  return Object.freeze(value.map((entry) => readString(entry).toLowerCase()).filter(Boolean));
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

function objectTags(record: ObjectRecord | undefined): readonly string[] {
  if (!record) return Object.freeze([]);
  return Object.freeze([
    ...arrayStrings(record.tags),
    readString(record.risk_kind).toLowerCase(),
    readString(record.category).toLowerCase(),
    readString(record.role).toLowerCase(),
  ].filter(Boolean));
}

function scoreOperationalRisk(record: RelationshipRecord, source?: ObjectRecord, target?: ObjectRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.operationalRisk) ??
    readScore(meta.operationalRisk) ??
    readScore(record.operational_risk) ??
    readScore(meta.operational_risk);
  if (explicit != null) return explicit;

  const tags = [...objectTags(source), ...objectTags(target), resolveRelationshipType(record).toLowerCase()];
  if (tags.some((tag) => ["operational", "production", "inventory", "delivery", "resource"].includes(tag))) {
    return 78;
  }
  if (resolveRelationshipType(record) === "blocks") return 82;
  return 45;
}

function scoreFinancialRisk(record: RelationshipRecord, source?: ObjectRecord, target?: ObjectRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.financialRisk) ??
    readScore(meta.financialRisk) ??
    readScore(record.financial_risk) ??
    readScore(meta.financial_risk);
  if (explicit != null) return explicit;

  const tags = [...objectTags(source), ...objectTags(target)];
  if (tags.some((tag) => ["financial", "revenue", "margin", "cost", "cash"].includes(tag))) return 80;
  return 35;
}

function scoreSupplyRisk(record: RelationshipRecord, source?: ObjectRecord, target?: ObjectRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.supplyRisk) ??
    readScore(meta.supplyRisk) ??
    readScore(record.supply_risk) ??
    readScore(meta.supply_risk);
  if (explicit != null) return explicit;

  const type = resolveRelationshipType(record);
  const tags = [...objectTags(source), ...objectTags(target), type.toLowerCase()];
  if (tags.some((tag) => ["supplier", "supply", "supplies", "inventory", "dependency"].includes(tag))) {
    return 84;
  }
  return 30;
}

function scoreExecutionRisk(record: RelationshipRecord, source?: ObjectRecord, target?: ObjectRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.executionRisk) ??
    readScore(meta.executionRisk) ??
    readScore(record.execution_risk) ??
    readScore(meta.execution_risk);
  if (explicit != null) return explicit;

  const tags = [...objectTags(source), ...objectTags(target), resolveRelationshipType(record).toLowerCase()];
  if (tags.some((tag) => ["execution", "delivery", "project", "blocks", "workflow"].includes(tag))) {
    return 76;
  }
  if (readString(record.direction) === "bi") return 58;
  return 40;
}

export function resolveRelationshipRiskExposureLevel(
  riskExposureScore: number
): RelationshipRiskExposureLevel {
  if (riskExposureScore >= 85) return "Critical";
  if (riskExposureScore >= 65) return "High";
  if (riskExposureScore >= 40) return "Medium";
  return "Low";
}

function detectRiskTypes(factors: RelationshipRiskExposureFactors): readonly RelationshipRiskType[] {
  const types: RelationshipRiskType[] = [];
  if (factors.operationalRisk >= 60) types.push("Operational Risk");
  if (factors.financialRisk >= 60) types.push("Financial Risk");
  if (factors.supplyRisk >= 60) types.push("Supply Risk");
  if (factors.executionRisk >= 60) types.push("Execution Risk");
  return Object.freeze(types);
}

function buildRiskReasoning(
  level: RelationshipRiskExposureLevel,
  score: number,
  types: readonly RelationshipRiskType[],
  factors: RelationshipRiskExposureFactors
): readonly string[] {
  return Object.freeze([
    `Risk exposure level is ${level}.`,
    `Risk exposure score is ${score}.`,
    `Detected risk types: ${types.length > 0 ? types.join(", ") : "none"}.`,
    `Operational ${factors.operationalRisk}, financial ${factors.financialRisk}, supply ${factors.supplyRisk}, execution ${factors.executionRisk}.`,
  ]);
}

export function calculateRelationshipRiskExposureProfile(
  raw: unknown,
  index = 0,
  objectById: Readonly<Record<string, ObjectRecord>> = Object.freeze({})
): RelationshipRiskExposureProfile | null {
  const record = asRecord(raw);
  if (!record) return null;

  const sourceId = resolveSourceId(record);
  const targetId = resolveTargetId(record);
  if (!sourceId || !targetId) return null;

  const source = objectById[sourceId];
  const target = objectById[targetId];
  const riskExposureFactors: RelationshipRiskExposureFactors = Object.freeze({
    operationalRisk: scoreOperationalRisk(record, source, target),
    financialRisk: scoreFinancialRisk(record, source, target),
    supplyRisk: scoreSupplyRisk(record, source, target),
    executionRisk: scoreExecutionRisk(record, source, target),
  });
  const riskTypes = detectRiskTypes(riskExposureFactors);
  const riskExposureScore = clampScore(
    riskExposureFactors.operationalRisk * 0.3 +
      riskExposureFactors.financialRisk * 0.2 +
      riskExposureFactors.supplyRisk * 0.3 +
      riskExposureFactors.executionRisk * 0.2
  );
  const riskExposureLevel = resolveRelationshipRiskExposureLevel(riskExposureScore);

  return Object.freeze({
    relationshipId: resolveRelationshipId(record, index),
    sourceId,
    targetId,
    relationshipType: resolveRelationshipType(record),
    riskExposureScore,
    riskExposureLevel,
    riskTypes,
    riskExposureFactors,
    riskExposureReasoning: buildRiskReasoning(
      riskExposureLevel,
      riskExposureScore,
      riskTypes,
      riskExposureFactors
    ),
  });
}

function dedupeProfiles(
  profiles: readonly RelationshipRiskExposureProfile[]
): readonly RelationshipRiskExposureProfile[] {
  const byId = new Map<string, RelationshipRiskExposureProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.relationshipId)) byId.set(profile.relationshipId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildRelationshipRiskExposureRegistry(
  input: RelationshipRiskExposureBuildInput = {}
): RelationshipRiskExposureRegistry {
  const relationships = input.relationships ?? readSceneRelationships(input.sceneJson);
  const objects = input.objects ?? readSceneObjects(input.sceneJson);
  const objectById = buildObjectMap(objects);
  const profiles = dedupeProfiles(
    relationships
      .map((relationship, index) =>
        calculateRelationshipRiskExposureProfile(relationship, index, objectById)
      )
      .filter((profile): profile is RelationshipRiskExposureProfile => profile != null)
  );
  const riskExposureByRelationshipId = Object.freeze(
    profiles.reduce<Record<string, RelationshipRiskExposureProfile>>((registry, profile) => {
      registry[profile.relationshipId] = profile;
      return registry;
    }, {})
  );

  latestRelationshipRiskExposureRegistry = Object.freeze({
    version: RELATIONSHIP_RISK_ENGINE_VERSION,
    profiles,
    riskExposureByRelationshipId,
    relationshipCount: profiles.length,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    diagnostics: RELATIONSHIP_RISK_DIAGNOSTICS,
  });

  return latestRelationshipRiskExposureRegistry;
}

export function getRelationshipRiskExposureRegistry(): RelationshipRiskExposureRegistry {
  return latestRelationshipRiskExposureRegistry;
}

export function resetRelationshipRiskExposureEngineForTests(): void {
  latestRelationshipRiskExposureRegistry = EMPTY_RELATIONSHIP_RISK_EXPOSURE_REGISTRY;
}

export const RelationshipRiskExposureEngine = Object.freeze({
  calculateRelationshipRiskExposureProfile,
  buildRelationshipRiskExposureRegistry,
  getRelationshipRiskExposureRegistry,
  resolveRelationshipRiskExposureLevel,
});
