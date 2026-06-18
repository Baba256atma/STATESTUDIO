import {
  calculateObjectHealth,
} from "../object-intelligence/ObjectHealthEngine.ts";
import {
  calculateObjectImportance,
} from "../object-intelligence/ObjectImportanceEngine.ts";
import {
  buildObjectTrendRegistry,
  calculateObjectTrendProfile,
} from "../object-intelligence/ObjectTrendEngine.ts";
import { buildObjectHealthRegistry } from "../object-intelligence/ObjectHealthEngine.ts";
import { buildObjectImportanceRegistry } from "../object-intelligence/ObjectImportanceEngine.ts";
import type { ObjectHealthResult } from "../object-intelligence/objectHealthContract.ts";
import type { ObjectImportanceProfile } from "../object-intelligence/objectImportanceContract.ts";
import type { ObjectTrendDirection, ObjectTrendProfile } from "../object-intelligence/objectTrendContract.ts";
import { buildScenarioBlueprintRegistry } from "./ScenarioBuilderEngine.ts";
import {
  EMPTY_OBJECT_IMPACT_PROFILE_REGISTRY,
  OBJECT_IMPACT_SIMULATION_DIAGNOSTICS,
  OBJECT_IMPACT_SIMULATION_ENGINE_VERSION,
  type ObjectHealthImpactChange,
  type ObjectImpactChangeDirection,
  type ObjectImpactProfile,
  type ObjectImpactProfileRegistry,
  type ObjectImpactResult,
  type ObjectImpactSimulationBuildInput,
  type ObjectImportanceImpactChange,
  type ObjectTrendImpactChange,
} from "./objectImpactSimulationContract.ts";
import type { ScenarioBlueprint, ScenarioObjectChange } from "./scenarioBuilderContract.ts";
import type { ScenarioType } from "./scenarioGenerationContract.ts";

let latestObjectImpactProfileRegistry: ObjectImpactProfileRegistry =
  EMPTY_OBJECT_IMPACT_PROFILE_REGISTRY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveChangeDirection(delta: number): ObjectImpactChangeDirection {
  if (delta > 0) return "up";
  if (delta < 0) return "down";
  return "neutral";
}

function trendDirectionRank(direction: ObjectTrendDirection): number {
  const ranks: Readonly<Record<ObjectTrendDirection, number>> = Object.freeze({
    Improving: 3,
    Stable: 2,
    Declining: 1,
    Volatile: 0,
  });
  return ranks[direction];
}

function projectTrendDirection(
  baseline: ObjectTrendDirection,
  healthDelta: number,
  scenarioType: ScenarioType
): ObjectTrendDirection {
  if (healthDelta >= 12) return "Improving";
  if (healthDelta <= -20) return "Volatile";
  if (healthDelta <= -8) return "Declining";
  if (scenarioType === "opportunity" && healthDelta > 0) return "Improving";
  if (scenarioType === "risk" && healthDelta < 0) return "Declining";
  return baseline;
}

function buildHealthChange(
  baseline: ObjectHealthResult,
  projected: ObjectHealthResult
): ObjectHealthImpactChange {
  const delta = projected.healthScore - baseline.healthScore;
  return Object.freeze({
    baselineScore: baseline.healthScore,
    projectedScore: projected.healthScore,
    delta,
    direction: resolveChangeDirection(delta),
    baselineState: baseline.healthState,
    projectedState: projected.healthState,
  });
}

function buildTrendChange(
  baseline: ObjectTrendProfile,
  projectedDirection: ObjectTrendDirection,
  healthDelta: number,
  scenarioType: ScenarioType
): ObjectTrendImpactChange {
  const directionDelta =
    trendDirectionRank(projectedDirection) - trendDirectionRank(baseline.trendDirection);
  const strengthAdjustment =
    scenarioType === "risk"
      ? Math.min(0, healthDelta * 0.35)
      : scenarioType === "opportunity"
        ? Math.max(0, healthDelta * 0.3)
        : healthDelta * 0.25;
  const projectedStrength = clampScore(baseline.trendStrength + strengthAdjustment);
  const delta = projectedStrength - baseline.trendStrength;

  return Object.freeze({
    baselineDirection: baseline.trendDirection,
    projectedDirection,
    baselineStrength: baseline.trendStrength,
    projectedStrength,
    delta,
    direction: resolveChangeDirection(delta + directionDelta * 5),
  });
}

function buildImportanceChange(
  baseline: ObjectImportanceProfile,
  projected: ObjectImportanceProfile
): ObjectImportanceImpactChange {
  const delta = projected.importanceScore - baseline.importanceScore;
  return Object.freeze({
    baselineScore: baseline.importanceScore,
    projectedScore: projected.importanceScore,
    baselineLevel: baseline.importanceLevel,
    projectedLevel: projected.importanceLevel,
    delta,
    direction: resolveChangeDirection(delta),
  });
}

function compositeImpactScore(
  healthChange: ObjectHealthImpactChange,
  trendChange: ObjectTrendImpactChange,
  importanceChange: ObjectImportanceImpactChange
): number {
  return clampScore(
    Math.abs(healthChange.delta) * 0.5 +
      Math.abs(trendChange.delta) * 0.25 +
      Math.abs(importanceChange.delta) * 0.25
  );
}

function resolveObjectLabel(
  objectId: string,
  objectChange: ScenarioObjectChange | undefined,
  baselineSnapshot: Readonly<Record<string, unknown>> | undefined
): string {
  return (
    objectChange?.label ||
    readString(baselineSnapshot?.label) ||
    readString(baselineSnapshot?.name) ||
    objectId
  );
}

function buildImpactResult(
  objectId: string,
  scenarioId: string,
  label: string,
  baselineHealth: ObjectHealthResult,
  baselineTrend: ObjectTrendProfile,
  baselineImportance: ObjectImportanceProfile,
  proposedRecord: unknown,
  scenarioType: ScenarioType
): ObjectImpactResult {
  const projectedHealth =
    calculateObjectHealth(proposedRecord, 0, "simulation") ?? baselineHealth;
  const projectedImportance =
    calculateObjectImportance(proposedRecord, 0, "simulation") ?? baselineImportance;
  const healthChange = buildHealthChange(baselineHealth, projectedHealth);
  const trendChange = buildTrendChange(
    baselineTrend,
    projectTrendDirection(baselineTrend.trendDirection, healthChange.delta, scenarioType),
    healthChange.delta,
    scenarioType
  );
  const importanceChange = buildImportanceChange(baselineImportance, projectedImportance);

  return Object.freeze({
    objectId,
    scenarioId,
    label,
    healthChange,
    trendChange,
    importanceChange,
    compositeImpactScore: compositeImpactScore(healthChange, trendChange, importanceChange),
    simulationReady: true,
    applied: false,
  });
}

function objectChangeMap(blueprint: ScenarioBlueprint): Readonly<Record<string, ScenarioObjectChange>> {
  return Object.freeze(
    blueprint.objectChanges.reduce<Record<string, ScenarioObjectChange>>((registry, change) => {
      registry[change.objectId] = change;
      return registry;
    }, {})
  );
}

function buildProfilesForBlueprint(
  blueprint: ScenarioBlueprint,
  healthByObjectId: Readonly<Record<string, ObjectHealthResult>>,
  trendByObjectId: Readonly<Record<string, ObjectTrendProfile>>,
  importanceByObjectId: Readonly<Record<string, ObjectImportanceProfile>>
): readonly ObjectImpactProfile[] {
  const changes = objectChangeMap(blueprint);
  const objectIds = Object.keys(blueprint.baselineState.objectSnapshots);

  const profiles = objectIds
    .map((objectId) => {
      const baselineHealth = healthByObjectId[objectId];
      const baselineTrend = trendByObjectId[objectId];
      const baselineImportance = importanceByObjectId[objectId];
      if (!baselineHealth || !baselineTrend || !baselineImportance) return null;

      const objectChange = changes[objectId];
      const baselineSnapshot = blueprint.baselineState.objectSnapshots[objectId];
      const proposedRecord = Object.freeze({
        ...baselineSnapshot,
        ...(objectChange?.proposedState ?? {}),
        id: objectId,
      });
      const impactResult = buildImpactResult(
        objectId,
        blueprint.scenarioId,
        resolveObjectLabel(objectId, objectChange, baselineSnapshot),
        baselineHealth,
        baselineTrend,
        baselineImportance,
        proposedRecord,
        blueprint.scenarioType
      );

      return Object.freeze({
        profileId: `impact-profile:${blueprint.scenarioId}:${objectId}`,
        scenarioId: blueprint.scenarioId,
        scenarioType: blueprint.scenarioType,
        objectId,
        label: impactResult.label,
        impactResult,
        readOnly: true as const,
      });
    })
    .filter((profile) => profile != null) as ObjectImpactProfile[];

  return Object.freeze(profiles);
}

function indexProfilesByObjectId(
  profiles: readonly ObjectImpactProfile[]
): Readonly<Record<string, readonly ObjectImpactProfile[]>> {
  const grouped = new Map<string, ObjectImpactProfile[]>();
  for (const profile of profiles) {
    const bucket = grouped.get(profile.objectId) ?? [];
    bucket.push(profile);
    grouped.set(profile.objectId, bucket);
  }
  return Object.freeze(
    Object.fromEntries(
      [...grouped.entries()].map(([objectId, bucket]) => [objectId, Object.freeze([...bucket])])
    )
  );
}

function indexProfilesByScenarioId(
  profiles: readonly ObjectImpactProfile[]
): Readonly<Record<string, readonly ObjectImpactProfile[]>> {
  const grouped = new Map<string, ObjectImpactProfile[]>();
  for (const profile of profiles) {
    const bucket = grouped.get(profile.scenarioId) ?? [];
    bucket.push(profile);
    grouped.set(profile.scenarioId, bucket);
  }
  return Object.freeze(
    Object.fromEntries(
      [...grouped.entries()].map(([scenarioId, bucket]) => [scenarioId, Object.freeze([...bucket])])
    )
  );
}

export function buildObjectImpactProfileRegistry(
  input: ObjectImpactSimulationBuildInput = {}
): ObjectImpactProfileRegistry {
  const healthRegistry = buildObjectHealthRegistry({
    sceneJson: input.sceneJson,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
  });
  const trendRegistry = buildObjectTrendRegistry({
    sceneJson: input.sceneJson,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
    historicalSnapshots: input.historicalSnapshots,
    sourceUpdates: input.sourceUpdates,
    objectHealthHistory: input.objectHealthHistory,
  });
  const importanceRegistry = buildObjectImportanceRegistry({
    sceneJson: input.sceneJson,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
  });

  const trendByObjectId: Record<string, ObjectTrendProfile> = {
    ...trendRegistry.trendByObjectId,
  };
  for (const health of healthRegistry.objects) {
    if (!trendByObjectId[health.objectId]) {
      trendByObjectId[health.objectId] = calculateObjectTrendProfile(health.objectId, input);
    }
  }
  const frozenTrendByObjectId = Object.freeze({ ...trendByObjectId });

  const blueprintRegistry =
    input.blueprintRegistry ??
    buildScenarioBlueprintRegistry({
      sceneJson: input.sceneJson,
      objects: input.sceneObjects,
      selectedObjectId: null,
    });

  const scenarioIds = input.scenarioIds ? new Set(input.scenarioIds) : null;
  const blueprints = blueprintRegistry.blueprints.filter((blueprint) =>
    scenarioIds ? scenarioIds.has(blueprint.scenarioId) : true
  );

  const profiles = Object.freeze(
    blueprints.flatMap((blueprint) =>
      buildProfilesForBlueprint(
        blueprint,
        healthRegistry.healthByObjectId,
        frozenTrendByObjectId,
        importanceRegistry.importanceByObjectId
      )
    )
  );
  const profileById = Object.freeze(
    profiles.reduce<Record<string, ObjectImpactProfile>>((registry, profile) => {
      registry[profile.profileId] = profile;
      return registry;
    }, {})
  );

  latestObjectImpactProfileRegistry = Object.freeze({
    version: OBJECT_IMPACT_SIMULATION_ENGINE_VERSION,
    profiles,
    profileById,
    profilesByObjectId: indexProfilesByObjectId(profiles),
    profilesByScenarioId: indexProfilesByScenarioId(profiles),
    profileCount: profiles.length,
    objectCount: healthRegistry.objectCount,
    scenarioCount: blueprints.length,
    readOnly: true,
    sceneMutation: false,
    simulationActive: false,
    diagnostics: OBJECT_IMPACT_SIMULATION_DIAGNOSTICS,
  });

  return latestObjectImpactProfileRegistry;
}

export function getObjectImpactProfileRegistry(): ObjectImpactProfileRegistry {
  return latestObjectImpactProfileRegistry;
}

export function resetObjectImpactSimulationEngineForTests(): void {
  latestObjectImpactProfileRegistry = EMPTY_OBJECT_IMPACT_PROFILE_REGISTRY;
}

export const ObjectImpactSimulationEngine = Object.freeze({
  buildObjectImpactProfileRegistry,
  getObjectImpactProfileRegistry,
});
