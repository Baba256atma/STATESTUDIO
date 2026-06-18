import {
  EMPTY_OBJECT_INTELLIGENCE_REGISTRY,
  OBJECT_INTELLIGENCE_DIAGNOSTICS,
  OBJECT_INTELLIGENCE_RUNTIME_VERSION,
  type ObjectIntelligenceBuildInput,
  type ObjectIntelligenceProfile,
  type ObjectIntelligenceRegistry,
  type ObjectIntelligenceSource,
  type ObjectIntelligenceTrend,
} from "./objectIntelligenceContract.ts";

type ObjectRecord = Readonly<Record<string, unknown>>;

let latestRegistry: ObjectIntelligenceRegistry = EMPTY_OBJECT_INTELLIGENCE_REGISTRY;

function readSceneObjects(sceneJson: unknown): readonly unknown[] {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  return Array.isArray(objects) ? objects : [];
}

function asRecord(value: unknown): ObjectRecord | null {
  return value && typeof value === "object" ? (value as ObjectRecord) : null;
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readNumericScore(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return clampScore(value);
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "critical") return 20;
    if (normalized === "high") return 35;
    if (normalized === "medium" || normalized === "warning") return 60;
    if (normalized === "low" || normalized === "healthy") return 85;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? clampScore(parsed) : null;
  }
  return null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeTrend(value: unknown): ObjectIntelligenceTrend {
  const normalized = readString(value).toLowerCase();
  if (["improving", "up", "rising", "recovering"].includes(normalized)) return "improving";
  if (["declining", "down", "falling", "deteriorating", "degrading"].includes(normalized)) {
    return "declining";
  }
  if (["stable", "flat", "steady"].includes(normalized)) return "stable";
  return "unknown";
}

function resolveObjectId(record: ObjectRecord, index: number, source: ObjectIntelligenceSource): string {
  return (
    readString(record.objectId) ||
    readString(record.id) ||
    readString(record.name) ||
    `${source}:object:${index + 1}`
  );
}

function resolveObjectLabel(record: ObjectRecord, objectId: string): string {
  return (
    readString(record.label) ||
    readString(record.display_label) ||
    readString(record.name) ||
    readString(record.canonical_name) ||
    objectId
  );
}

function resolveObjectType(record: ObjectRecord): string {
  return readString(record.objectType) || readString(record.type) || readString(record.category) || "unknown";
}

function resolveHealth(record: ObjectRecord): number {
  return (
    readNumericScore(record.health) ??
    readNumericScore(record.scanner_severity) ??
    readNumericScore(record.status) ??
    75
  );
}

function resolveImpact(record: ObjectRecord): number {
  return (
    readNumericScore(record.impact) ??
    readNumericScore(record.scanner_emphasis) ??
    readNumericScore(record.emphasis) ??
    (readString(record.scanner_severity).toLowerCase() === "critical" ? 90 : 50)
  );
}

function resolveConfidence(record: ObjectRecord): number {
  return readNumericScore(record.confidence) ?? (readString(record.sourceId) ? 80 : 65);
}

function resolveImportance(record: ObjectRecord): number {
  const tags = Array.isArray(record.tags) ? record.tags.map((tag) => readString(tag).toLowerCase()) : [];
  const role = readString(record.role).toLowerCase();
  if (readNumericScore(record.importance) != null) return readNumericScore(record.importance) ?? 0;
  if (tags.includes("critical") || role.includes("critical") || role.includes("executive")) return 90;
  if (readNumericScore(record.emphasis) != null) return readNumericScore(record.emphasis) ?? 0;
  return 55;
}

function createObjectIntelligenceProfile(
  raw: unknown,
  index: number,
  source: ObjectIntelligenceSource
): ObjectIntelligenceProfile | null {
  const record = asRecord(raw);
  if (!record) return null;
  const objectId = resolveObjectId(record, index, source);
  const health = resolveHealth(record);
  const impact = resolveImpact(record);
  return Object.freeze({
    objectId,
    label: resolveObjectLabel(record, objectId),
    objectType: resolveObjectType(record),
    source,
    health,
    impact,
    confidence: resolveConfidence(record),
    importance: resolveImportance(record),
    trend: normalizeTrend(record.trend),
  });
}

function dedupeProfiles(profiles: readonly ObjectIntelligenceProfile[]): readonly ObjectIntelligenceProfile[] {
  const byId = new Map<string, ObjectIntelligenceProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.objectId)) byId.set(profile.objectId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildObjectIntelligenceRegistry(
  input: ObjectIntelligenceBuildInput = {}
): ObjectIntelligenceRegistry {
  const sceneObjects = input.sceneObjects ?? readSceneObjects(input.sceneJson);
  const dataSourceObjects = input.dataSourceObjects ?? [];
  const profiles = dedupeProfiles([
    ...sceneObjects
      .map((object, index) => createObjectIntelligenceProfile(object, index, "scene"))
      .filter((profile): profile is ObjectIntelligenceProfile => profile != null),
    ...dataSourceObjects
      .map((object, index) => createObjectIntelligenceProfile(object, index, "data_source"))
      .filter((profile): profile is ObjectIntelligenceProfile => profile != null),
  ]);
  const profileByObjectId = Object.freeze(
    profiles.reduce<Record<string, ObjectIntelligenceProfile>>((registry, profile) => {
      registry[profile.objectId] = profile;
      return registry;
    }, {})
  );

  latestRegistry = Object.freeze({
    version: OBJECT_INTELLIGENCE_RUNTIME_VERSION,
    profiles,
    profileByObjectId,
    objectCount: profiles.length,
    sceneMutation: false,
    simulation: false,
    diagnostics: OBJECT_INTELLIGENCE_DIAGNOSTICS,
  });

  return latestRegistry;
}

export function getObjectIntelligenceRegistry(): ObjectIntelligenceRegistry {
  return latestRegistry;
}

export function resetObjectIntelligenceRuntimeForTests(): void {
  latestRegistry = EMPTY_OBJECT_INTELLIGENCE_REGISTRY;
}
