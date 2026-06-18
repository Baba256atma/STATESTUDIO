import {
  EMPTY_OBJECT_TREND_REGISTRY,
  OBJECT_TREND_DIAGNOSTICS,
  OBJECT_TREND_ENGINE_VERSION,
  type ObjectHealthHistoryPoint,
  type ObjectTrendBuildInput,
  type ObjectTrendDirection,
  type ObjectTrendProfile,
  type ObjectTrendRegistry,
  type ObjectTrendSnapshot,
  type ObjectTrendSourceUpdate,
} from "./objectTrendContract.ts";

type ObjectRecord = Readonly<Record<string, unknown>>;

let latestTrendRegistry: ObjectTrendRegistry = EMPTY_OBJECT_TREND_REGISTRY;

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
  if (typeof value !== "string") return null;
  const parsed = Number(value.trim());
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

function readTimestamp(value: string | number | null | undefined, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function collectBaseObjectIds(input: ObjectTrendBuildInput): readonly string[] {
  const sceneObjects = input.sceneObjects ?? readSceneObjects(input.sceneJson);
  const dataSourceObjects = input.dataSourceObjects ?? [];
  const ids = new Set<string>();

  sceneObjects.forEach((object, index) => {
    const record = asRecord(object);
    if (record) ids.add(resolveObjectId(record, index, "scene"));
  });
  dataSourceObjects.forEach((object, index) => {
    const record = asRecord(object);
    if (record) ids.add(resolveObjectId(record, index, "data_source"));
  });
  input.historicalSnapshots?.forEach((snapshot) => ids.add(snapshot.objectId));
  input.sourceUpdates?.forEach((update) => ids.add(update.objectId));
  input.objectHealthHistory?.forEach((point) => ids.add(point.objectId));

  return Object.freeze([...ids].filter(Boolean));
}

function collectTrendEvidence(
  objectId: string,
  snapshots: readonly ObjectTrendSnapshot[],
  sourceUpdates: readonly ObjectTrendSourceUpdate[],
  healthHistory: readonly ObjectHealthHistoryPoint[]
): readonly number[] {
  const ordered: Array<{ timestamp: number; score: number }> = [];
  let fallback = 0;

  for (const snapshot of snapshots) {
    if (snapshot.objectId !== objectId) continue;
    const score =
      readNumericScore(snapshot.healthScore) ??
      readNumericScore(snapshot.confidenceScore) ??
      readNumericScore(snapshot.impactScore);
    if (score == null) continue;
    ordered.push({ timestamp: readTimestamp(snapshot.timestamp, fallback++), score });
  }

  for (const point of healthHistory) {
    if (point.objectId !== objectId) continue;
    ordered.push({
      timestamp: readTimestamp(point.timestamp, fallback++),
      score: clampScore(point.healthScore),
    });
  }

  for (const update of sourceUpdates) {
    if (update.objectId !== objectId) continue;
    const explicit = readNumericScore(update.healthScore);
    const signalScore =
      explicit ??
      (update.signal === "positive"
        ? 80
        : update.signal === "negative"
          ? 35
          : update.signal === "volatile"
            ? 50
            : update.signal === "neutral"
              ? 55
              : null);
    if (signalScore == null) continue;
    ordered.push({ timestamp: readTimestamp(update.timestamp, fallback++), score: signalScore });
  }

  return Object.freeze(ordered.sort((a, b) => a.timestamp - b.timestamp).map((entry) => entry.score));
}

function countDirectionReversals(evidence: readonly number[]): number {
  let previousDirection = 0;
  let reversals = 0;
  for (let index = 1; index < evidence.length; index += 1) {
    const delta = evidence[index] - evidence[index - 1];
    const direction = Math.abs(delta) < 3 ? 0 : delta > 0 ? 1 : -1;
    if (direction !== 0 && previousDirection !== 0 && direction !== previousDirection) {
      reversals += 1;
    }
    if (direction !== 0) previousDirection = direction;
  }
  return reversals;
}

function resolveTrendDirection(evidence: readonly number[]): ObjectTrendDirection {
  if (evidence.length < 2) return "Stable";
  const deltas = evidence.slice(1).map((score, index) => score - evidence[index]);
  const volatility = Math.max(...evidence) - Math.min(...evidence);
  const reversals = countDirectionReversals(evidence);
  if (volatility >= 30 && reversals >= 1) return "Volatile";

  const slope = evidence[evidence.length - 1] - evidence[0];
  const averageStep = deltas.reduce((sum, delta) => sum + delta, 0) / deltas.length;
  if (slope >= 8 && averageStep >= 1.5) return "Improving";
  if (slope <= -8 && averageStep <= -1.5) return "Declining";
  return "Stable";
}

function resolveTrendStrength(direction: ObjectTrendDirection, evidence: readonly number[]): number {
  if (evidence.length < 2) return 0;
  const volatility = Math.max(...evidence) - Math.min(...evidence);
  const slope = Math.abs(evidence[evidence.length - 1] - evidence[0]);
  const reversals = countDirectionReversals(evidence);
  if (direction === "Volatile") return clampScore(volatility + reversals * 15);
  if (direction === "Stable") return clampScore(100 - Math.min(100, volatility * 2));
  return clampScore(slope * 2 + Math.max(0, evidence.length - 2) * 5);
}

function buildTrendReasoning(
  direction: ObjectTrendDirection,
  strength: number,
  evidence: readonly number[]
): readonly string[] {
  if (evidence.length === 0) {
    return Object.freeze(["No historical trend evidence is available."]);
  }
  const first = evidence[0];
  const last = evidence[evidence.length - 1];
  return Object.freeze([
    `Trend direction is ${direction}.`,
    `Trend strength is ${strength}.`,
    `Evidence moved from ${first} to ${last} across ${evidence.length} point(s).`,
  ]);
}

export function calculateObjectTrendProfile(
  objectId: string,
  input: Pick<ObjectTrendBuildInput, "historicalSnapshots" | "sourceUpdates" | "objectHealthHistory"> = {}
): ObjectTrendProfile {
  const trendEvidence = collectTrendEvidence(
    objectId,
    input.historicalSnapshots ?? [],
    input.sourceUpdates ?? [],
    input.objectHealthHistory ?? []
  );
  const trendDirection = resolveTrendDirection(trendEvidence);
  const trendStrength = resolveTrendStrength(trendDirection, trendEvidence);

  return Object.freeze({
    objectId,
    trendDirection,
    trendStrength,
    trendEvidence,
    trendReasoning: buildTrendReasoning(trendDirection, trendStrength, trendEvidence),
  });
}

function dedupeTrendProfiles(profiles: readonly ObjectTrendProfile[]): readonly ObjectTrendProfile[] {
  const byId = new Map<string, ObjectTrendProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.objectId)) byId.set(profile.objectId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildObjectTrendRegistry(input: ObjectTrendBuildInput = {}): ObjectTrendRegistry {
  const profiles = dedupeTrendProfiles(
    collectBaseObjectIds(input).map((objectId) => calculateObjectTrendProfile(objectId, input))
  );
  const trendByObjectId = Object.freeze(
    profiles.reduce<Record<string, ObjectTrendProfile>>((registry, profile) => {
      registry[profile.objectId] = profile;
      return registry;
    }, {})
  );

  latestTrendRegistry = Object.freeze({
    version: OBJECT_TREND_ENGINE_VERSION,
    profiles,
    trendByObjectId,
    objectCount: profiles.length,
    sceneMutation: false,
    simulation: false,
    diagnostics: OBJECT_TREND_DIAGNOSTICS,
  });

  return latestTrendRegistry;
}

export function getObjectTrendRegistry(): ObjectTrendRegistry {
  return latestTrendRegistry;
}

export function resetObjectTrendEngineForTests(): void {
  latestTrendRegistry = EMPTY_OBJECT_TREND_REGISTRY;
}

export const ObjectTrendEngine = Object.freeze({
  calculateObjectTrendProfile,
  buildObjectTrendRegistry,
  getObjectTrendRegistry,
});
