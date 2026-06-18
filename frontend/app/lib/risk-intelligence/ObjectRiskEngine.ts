import { calculateObjectHealth } from "../object-intelligence/ObjectHealthEngine.ts";
import { calculateObjectImpact } from "../object-intelligence/ObjectImpactEngine.ts";
import { calculateObjectImportance } from "../object-intelligence/ObjectImportanceEngine.ts";
import { calculateObjectTrendProfile } from "../object-intelligence/ObjectTrendEngine.ts";
import type { ObjectHealthResult } from "../object-intelligence/objectHealthContract.ts";
import type { ObjectImpactResult } from "../object-intelligence/objectImpactContract.ts";
import type { ObjectImportanceProfile } from "../object-intelligence/objectImportanceContract.ts";
import type {
  ObjectTrendDirection,
  ObjectTrendProfile,
} from "../object-intelligence/objectTrendContract.ts";
import {
  EMPTY_OBJECT_RISK_REGISTRY,
  OBJECT_RISK_DIAGNOSTICS,
  OBJECT_RISK_ENGINE_VERSION,
  type ObjectRiskBuildInput,
  type ObjectRiskFactors,
  type ObjectRiskLevel,
  type ObjectRiskProfile,
  type ObjectRiskRegistry,
} from "./objectRiskContract.ts";

type ObjectRecord = Readonly<Record<string, unknown>>;

let latestObjectRiskRegistry: ObjectRiskRegistry = EMPTY_OBJECT_RISK_REGISTRY;

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

function resolveObjectId(record: ObjectRecord, index: number, sourcePrefix: string): string {
  return (
    readString(record.objectId) ||
    readString(record.id) ||
    readString(record.name) ||
    `${sourcePrefix}:object:${index + 1}`
  );
}

function resolveTrendRiskScore(trend: ObjectTrendProfile): number {
  const baseByDirection: Readonly<Record<ObjectTrendDirection, number>> = Object.freeze({
    Improving: 25,
    Stable: 45,
    Declining: 75,
    Volatile: 80,
  });
  const base = baseByDirection[trend.trendDirection];
  return clampScore(base * 0.7 + trend.trendStrength * 0.3);
}

function buildRiskReasoning(
  riskScore: number,
  riskLevel: ObjectRiskLevel,
  factors: ObjectRiskFactors
): readonly string[] {
  return Object.freeze([
    `Risk level is ${riskLevel} at ${riskScore}.`,
    `Health score ${factors.healthScore} contributes inverse health risk ${100 - factors.healthScore}.`,
    `Trend is ${factors.trendDirection} with strength ${factors.trendStrength}.`,
    `Impact score ${factors.impactScore} and importance score ${factors.importanceScore} amplify exposure.`,
  ]);
}

export function resolveObjectRiskLevel(riskScore: number): ObjectRiskLevel {
  if (riskScore >= 85) return "Critical";
  if (riskScore >= 65) return "High";
  if (riskScore >= 40) return "Medium";
  return "Low";
}

export function calculateObjectRiskProfileFromIntelligence(
  health: ObjectHealthResult,
  trend: ObjectTrendProfile,
  impact: ObjectImpactResult,
  importance: ObjectImportanceProfile
): ObjectRiskProfile {
  const healthRisk = 100 - health.healthScore;
  const trendRisk = resolveTrendRiskScore(trend);
  const riskScore = clampScore(
    healthRisk * 0.55 + trendRisk * 0.25 + impact.impactScore * 0.12 + importance.importanceScore * 0.08
  );
  const riskFactors: ObjectRiskFactors = Object.freeze({
    healthScore: health.healthScore,
    trendDirection: trend.trendDirection,
    trendStrength: trend.trendStrength,
    impactScore: impact.impactScore,
    importanceScore: importance.importanceScore,
  });
  const riskLevel = resolveObjectRiskLevel(riskScore);

  return Object.freeze({
    objectId: health.objectId,
    riskScore,
    riskLevel,
    riskFactors,
    riskReasoning: buildRiskReasoning(riskScore, riskLevel, riskFactors),
  });
}

export function calculateObjectRiskProfile(
  raw: unknown,
  index = 0,
  sourcePrefix = "object",
  input: Pick<
    ObjectRiskBuildInput,
    "historicalSnapshots" | "sourceUpdates" | "objectHealthHistory"
  > = {}
): ObjectRiskProfile | null {
  const health = calculateObjectHealth(raw, index, sourcePrefix);
  const impact = calculateObjectImpact(raw, index, sourcePrefix);
  const importance = calculateObjectImportance(raw, index, sourcePrefix);
  if (!health || !impact || !importance) return null;

  const trend = calculateObjectTrendProfile(health.objectId, input);
  return calculateObjectRiskProfileFromIntelligence(health, trend, impact, importance);
}

function dedupeProfiles(profiles: readonly ObjectRiskProfile[]): readonly ObjectRiskProfile[] {
  const byId = new Map<string, ObjectRiskProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.objectId)) byId.set(profile.objectId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildObjectRiskRegistry(input: ObjectRiskBuildInput = {}): ObjectRiskRegistry {
  const sceneObjects = input.sceneObjects ?? readSceneObjects(input.sceneJson);
  const dataSourceObjects = input.dataSourceObjects ?? [];
  const trendContext = Object.freeze({
    historicalSnapshots: input.historicalSnapshots,
    sourceUpdates: input.sourceUpdates,
    objectHealthHistory: input.objectHealthHistory,
  });

  const profiles = dedupeProfiles([
    ...sceneObjects
      .map((object, index) => calculateObjectRiskProfile(object, index, "scene", trendContext))
      .filter((profile): profile is ObjectRiskProfile => profile != null),
    ...dataSourceObjects
      .map((object, index) =>
        calculateObjectRiskProfile(object, index, "data_source", trendContext)
      )
      .filter((profile): profile is ObjectRiskProfile => profile != null),
  ]);

  const riskByObjectId = Object.freeze(
    profiles.reduce<Record<string, ObjectRiskProfile>>((registry, profile) => {
      registry[profile.objectId] = profile;
      return registry;
    }, {})
  );

  latestObjectRiskRegistry = Object.freeze({
    version: OBJECT_RISK_ENGINE_VERSION,
    profiles,
    riskByObjectId,
    objectCount: profiles.length,
    sceneMutation: false,
    simulation: false,
    diagnostics: OBJECT_RISK_DIAGNOSTICS,
  });

  return latestObjectRiskRegistry;
}

export function getObjectRiskRegistry(): ObjectRiskRegistry {
  return latestObjectRiskRegistry;
}

export function resetObjectRiskEngineForTests(): void {
  latestObjectRiskRegistry = EMPTY_OBJECT_RISK_REGISTRY;
}

export const ObjectRiskEngine = Object.freeze({
  calculateObjectRiskProfile,
  calculateObjectRiskProfileFromIntelligence,
  buildObjectRiskRegistry,
  getObjectRiskRegistry,
  resolveObjectRiskLevel,
});
