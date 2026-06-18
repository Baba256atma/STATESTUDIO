import { calculateDependencyProfile } from "../relationship-intelligence/DependencyIntelligenceEngine.ts";
import { calculateRelationshipInfluenceProfile } from "../relationship-intelligence/RelationshipInfluenceEngine.ts";
import { calculateRelationshipRiskExposureProfile } from "../relationship-intelligence/RelationshipRiskExposureEngine.ts";
import { buildDependencyIntelligenceRegistry } from "../relationship-intelligence/DependencyIntelligenceEngine.ts";
import { buildRelationshipInfluenceRegistry } from "../relationship-intelligence/RelationshipInfluenceEngine.ts";
import { buildRelationshipRiskExposureRegistry } from "../relationship-intelligence/RelationshipRiskExposureEngine.ts";
import type { DependencyProfile } from "../relationship-intelligence/dependencyIntelligenceContract.ts";
import type { RelationshipInfluenceProfile } from "../relationship-intelligence/relationshipInfluenceContract.ts";
import type { RelationshipRiskExposureProfile } from "../relationship-intelligence/relationshipRiskExposureContract.ts";
import { buildScenarioBlueprintRegistry } from "./ScenarioBuilderEngine.ts";
import {
  EMPTY_RELATIONSHIP_IMPACT_PROFILE_REGISTRY,
  RELATIONSHIP_IMPACT_SIMULATION_DIAGNOSTICS,
  RELATIONSHIP_IMPACT_SIMULATION_ENGINE_VERSION,
  type RelationshipDependencyImpactChange,
  type RelationshipImpactChangeDirection,
  type RelationshipImpactProfile,
  type RelationshipImpactProfileRegistry,
  type RelationshipImpactResult,
  type RelationshipImpactSimulationBuildInput,
  type RelationshipInfluenceImpactChange,
  type RelationshipRiskExposureImpactChange,
} from "./relationshipImpactSimulationContract.ts";
import type { ScenarioBlueprint, ScenarioRelationshipChange } from "./scenarioBuilderContract.ts";
import type { ScenarioType } from "./scenarioGenerationContract.ts";
import { resolveDependencyLevel } from "../relationship-intelligence/DependencyIntelligenceEngine.ts";
import { resolveRelationshipInfluenceLevel } from "../relationship-intelligence/RelationshipInfluenceEngine.ts";
import { resolveRelationshipRiskExposureLevel } from "../relationship-intelligence/RelationshipRiskExposureEngine.ts";

type SceneRecord = Readonly<Record<string, unknown>>;

let latestRelationshipImpactProfileRegistry: RelationshipImpactProfileRegistry =
  EMPTY_RELATIONSHIP_IMPACT_PROFILE_REGISTRY;

function asRecord(value: unknown): SceneRecord | null {
  return value && typeof value === "object" ? (value as SceneRecord) : null;
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
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "critical" || normalized === "high") return 85;
  if (normalized === "medium" || normalized === "moderate") return 60;
  if (normalized === "low") return 30;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  return parsed >= 0 && parsed <= 1 ? clampScore(parsed * 100) : clampScore(parsed);
}

function projectDependencyProfile(
  baseline: DependencyProfile,
  scenarioType: ScenarioType,
  proposedRecord: Readonly<Record<string, unknown>>
): DependencyProfile {
  if (scenarioType === "baseline") return baseline;

  const status = readString(proposedRecord.status).toLowerCase();
  let adjustment = 0;
  if (scenarioType === "risk" || status === "broken" || status === "degraded") adjustment += 12;
  if (scenarioType === "opportunity" || status === "healthy") adjustment -= 8;
  if (scenarioType === "alternative") adjustment += 5;
  const dependencyScore = clampScore(baseline.dependencyScore + adjustment);
  const dependencyFactors = Object.freeze({
    ...baseline.dependencyFactors,
    continuityRisk: clampScore(baseline.dependencyFactors.continuityRisk + adjustment * 0.6),
  });
  const singlePointOfFailure =
    dependencyScore >= 75 &&
    dependencyFactors.redundancy < 35 &&
    dependencyFactors.continuityRisk >= 65;

  return Object.freeze({
    ...baseline,
    dependencyScore,
    dependencyLevel: resolveDependencyLevel(dependencyScore),
    singlePointOfFailure,
    dependencyFactors,
  });
}

function projectInfluenceProfile(
  baseline: RelationshipInfluenceProfile,
  scenarioType: ScenarioType,
  proposedRecord: Readonly<Record<string, unknown>>
): RelationshipInfluenceProfile {
  if (scenarioType === "baseline") return baseline;

  const confidence = readScore(proposedRecord.confidence);
  const status = readString(proposedRecord.status).toLowerCase();
  let adjustment = confidence != null ? confidence - baseline.influenceFactors.confidence : 0;
  if (scenarioType === "risk" || status === "broken") adjustment -= 8;
  if (scenarioType === "opportunity" || status === "healthy") adjustment += 8;
  const influenceScore = clampScore(baseline.influenceScore + adjustment);
  const influenceFactors = Object.freeze({
    ...baseline.influenceFactors,
    confidence: clampScore(baseline.influenceFactors.confidence + adjustment * 0.5),
  });

  return Object.freeze({
    ...baseline,
    influenceScore,
    influenceLevel: resolveRelationshipInfluenceLevel(influenceScore),
    influenceFactors,
  });
}

function projectRiskExposureProfile(
  baseline: RelationshipRiskExposureProfile,
  scenarioType: ScenarioType,
  proposedRecord: Readonly<Record<string, unknown>>
): RelationshipRiskExposureProfile {
  if (scenarioType === "baseline") return baseline;

  const status = readString(proposedRecord.status).toLowerCase();
  let adjustment = 0;
  if (scenarioType === "risk" || status === "broken" || status === "degraded") adjustment += 14;
  if (scenarioType === "opportunity" || status === "healthy") adjustment -= 12;
  if (scenarioType === "alternative") adjustment += 4;
  const riskExposureScore = clampScore(baseline.riskExposureScore + adjustment);
  const riskExposureFactors = Object.freeze({
    operationalRisk: clampScore(baseline.riskExposureFactors.operationalRisk + adjustment * 0.35),
    financialRisk: clampScore(baseline.riskExposureFactors.financialRisk + adjustment * 0.2),
    supplyRisk: clampScore(baseline.riskExposureFactors.supplyRisk + adjustment * 0.3),
    executionRisk: clampScore(baseline.riskExposureFactors.executionRisk + adjustment * 0.15),
  });
  const riskTypes = Object.freeze(
    (
      [
        ["Operational Risk", riskExposureFactors.operationalRisk],
        ["Financial Risk", riskExposureFactors.financialRisk],
        ["Supply Risk", riskExposureFactors.supplyRisk],
        ["Execution Risk", riskExposureFactors.executionRisk],
      ] as const
    )
      .filter(([, score]) => score >= 60)
      .map(([type]) => type)
  );

  return Object.freeze({
    ...baseline,
    riskExposureScore,
    riskExposureLevel: resolveRelationshipRiskExposureLevel(riskExposureScore),
    riskExposureFactors,
    riskTypes,
  });
}

function resolveChangeDirection(delta: number): RelationshipImpactChangeDirection {
  if (delta > 0) return "up";
  if (delta < 0) return "down";
  return "neutral";
}

function buildObjectMap(objects: readonly unknown[]): Readonly<Record<string, SceneRecord>> {
  return Object.freeze(
    objects.reduce<Record<string, SceneRecord>>((registry, raw) => {
      const record = asRecord(raw);
      const id = record ? readString(record.id) || readString(record.objectId) || readString(record.name) : "";
      if (record && id) registry[id] = record;
      return registry;
    }, {})
  );
}

function resolveRelationshipLabel(
  relationshipId: string,
  baseline: DependencyProfile,
  snapshot: Readonly<Record<string, unknown>> | undefined
): string {
  const type = readString(snapshot?.type) || readString(snapshot?.relationshipType) || baseline.relationshipType;
  return type || `${baseline.sourceId} -> ${baseline.targetId}` || relationshipId;
}

function buildDependencyChange(
  baseline: DependencyProfile,
  projected: DependencyProfile
): RelationshipDependencyImpactChange {
  const delta = projected.dependencyScore - baseline.dependencyScore;
  return Object.freeze({
    baselineScore: baseline.dependencyScore,
    projectedScore: projected.dependencyScore,
    baselineLevel: baseline.dependencyLevel,
    projectedLevel: projected.dependencyLevel,
    baselineSinglePointOfFailure: baseline.singlePointOfFailure,
    projectedSinglePointOfFailure: projected.singlePointOfFailure,
    delta,
    direction: resolveChangeDirection(delta),
  });
}

function buildInfluenceChange(
  baseline: RelationshipInfluenceProfile,
  projected: RelationshipInfluenceProfile
): RelationshipInfluenceImpactChange {
  const delta = projected.influenceScore - baseline.influenceScore;
  return Object.freeze({
    baselineScore: baseline.influenceScore,
    projectedScore: projected.influenceScore,
    baselineLevel: baseline.influenceLevel,
    projectedLevel: projected.influenceLevel,
    baselineDirection: baseline.influenceDirection,
    projectedDirection: projected.influenceDirection,
    delta,
    direction: resolveChangeDirection(delta),
  });
}

function buildRiskExposureChange(
  baseline: RelationshipRiskExposureProfile,
  projected: RelationshipRiskExposureProfile
): RelationshipRiskExposureImpactChange {
  const delta = projected.riskExposureScore - baseline.riskExposureScore;
  return Object.freeze({
    baselineScore: baseline.riskExposureScore,
    projectedScore: projected.riskExposureScore,
    baselineLevel: baseline.riskExposureLevel,
    projectedLevel: projected.riskExposureLevel,
    baselineRiskTypes: baseline.riskTypes,
    projectedRiskTypes: projected.riskTypes,
    delta,
    direction: resolveChangeDirection(delta),
  });
}

function compositeImpactScore(
  dependencyChange: RelationshipDependencyImpactChange,
  influenceChange: RelationshipInfluenceImpactChange,
  riskExposureChange: RelationshipRiskExposureImpactChange
): number {
  return clampScore(
    Math.abs(dependencyChange.delta) * 0.35 +
      Math.abs(influenceChange.delta) * 0.3 +
      Math.abs(riskExposureChange.delta) * 0.35
  );
}

function relationshipChangeMap(
  blueprint: ScenarioBlueprint
): Readonly<Record<string, ScenarioRelationshipChange>> {
  return Object.freeze(
    blueprint.relationshipChanges.reduce<Record<string, ScenarioRelationshipChange>>(
      (registry, change) => {
        registry[change.relationshipId] = change;
        return registry;
      },
      {}
    )
  );
}

function buildImpactResult(
  relationshipId: string,
  scenarioId: string,
  label: string,
  baselineDependency: DependencyProfile,
  baselineInfluence: RelationshipInfluenceProfile,
  baselineRisk: RelationshipRiskExposureProfile,
  proposedRecord: Readonly<Record<string, unknown>>,
  objectById: Readonly<Record<string, SceneRecord>>,
  scenarioType: ScenarioType
): RelationshipImpactResult {
  const calculatedDependency =
    calculateDependencyProfile(proposedRecord, 0, objectById) ?? baselineDependency;
  const calculatedInfluence =
    calculateRelationshipInfluenceProfile(proposedRecord, 0, objectById) ?? baselineInfluence;
  const calculatedRisk =
    calculateRelationshipRiskExposureProfile(proposedRecord, 0, objectById) ?? baselineRisk;

  const projectedDependency =
    scenarioType === "baseline"
      ? baselineDependency
      : projectDependencyProfile(calculatedDependency, scenarioType, proposedRecord);
  const projectedInfluence =
    scenarioType === "baseline"
      ? baselineInfluence
      : projectInfluenceProfile(calculatedInfluence, scenarioType, proposedRecord);
  const projectedRisk =
    scenarioType === "baseline"
      ? baselineRisk
      : projectRiskExposureProfile(calculatedRisk, scenarioType, proposedRecord);

  const dependencyChange = buildDependencyChange(baselineDependency, projectedDependency);
  const influenceChange = buildInfluenceChange(baselineInfluence, projectedInfluence);
  const riskExposureChange = buildRiskExposureChange(baselineRisk, projectedRisk);

  return Object.freeze({
    relationshipId,
    scenarioId,
    sourceId: baselineDependency.sourceId,
    targetId: baselineDependency.targetId,
    label,
    dependencyChange,
    influenceChange,
    riskExposureChange,
    compositeImpactScore: compositeImpactScore(dependencyChange, influenceChange, riskExposureChange),
    simulationReady: true,
    applied: false,
  });
}

function buildProfilesForBlueprint(
  blueprint: ScenarioBlueprint,
  dependencyByRelationshipId: Readonly<Record<string, DependencyProfile>>,
  influenceByRelationshipId: Readonly<Record<string, RelationshipInfluenceProfile>>,
  riskByRelationshipId: Readonly<Record<string, RelationshipRiskExposureProfile>>,
  objectById: Readonly<Record<string, SceneRecord>>
): readonly RelationshipImpactProfile[] {
  const changes = relationshipChangeMap(blueprint);
  const relationshipIds = Object.keys(blueprint.baselineState.relationshipSnapshots);

  const profiles = relationshipIds
    .map((relationshipId) => {
      const baselineDependency = dependencyByRelationshipId[relationshipId];
      const baselineInfluence = influenceByRelationshipId[relationshipId];
      const baselineRisk = riskByRelationshipId[relationshipId];
      if (!baselineDependency || !baselineInfluence || !baselineRisk) return null;

      const relationshipChange = changes[relationshipId];
      const baselineSnapshot = blueprint.baselineState.relationshipSnapshots[relationshipId];
      const proposedRecord = Object.freeze({
        ...baselineSnapshot,
        ...(relationshipChange?.proposedState ?? {}),
        id: relationshipId,
        relationshipId,
        sourceId: baselineDependency.sourceId,
        targetId: baselineDependency.targetId,
      });
      const impactResult = buildImpactResult(
        relationshipId,
        blueprint.scenarioId,
        resolveRelationshipLabel(relationshipId, baselineDependency, baselineSnapshot),
        baselineDependency,
        baselineInfluence,
        baselineRisk,
        proposedRecord,
        objectById,
        blueprint.scenarioType
      );

      return Object.freeze({
        profileId: `relationship-impact:${blueprint.scenarioId}:${relationshipId}`,
        scenarioId: blueprint.scenarioId,
        scenarioType: blueprint.scenarioType,
        relationshipId,
        sourceId: baselineDependency.sourceId,
        targetId: baselineDependency.targetId,
        label: impactResult.label,
        impactResult,
        readOnly: true as const,
      });
    })
    .filter((profile) => profile != null) as RelationshipImpactProfile[];

  return Object.freeze(profiles);
}

function indexProfilesByRelationshipId(
  profiles: readonly RelationshipImpactProfile[]
): Readonly<Record<string, readonly RelationshipImpactProfile[]>> {
  const grouped = new Map<string, RelationshipImpactProfile[]>();
  for (const profile of profiles) {
    const bucket = grouped.get(profile.relationshipId) ?? [];
    bucket.push(profile);
    grouped.set(profile.relationshipId, bucket);
  }
  return Object.freeze(
    Object.fromEntries(
      [...grouped.entries()].map(([relationshipId, bucket]) => [
        relationshipId,
        Object.freeze([...bucket]),
      ])
    )
  );
}

function indexProfilesByScenarioId(
  profiles: readonly RelationshipImpactProfile[]
): Readonly<Record<string, readonly RelationshipImpactProfile[]>> {
  const grouped = new Map<string, RelationshipImpactProfile[]>();
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

export function buildRelationshipImpactProfileRegistry(
  input: RelationshipImpactSimulationBuildInput = {}
): RelationshipImpactProfileRegistry {
  const relationships = input.relationships ?? readSceneRelationships(input.sceneJson);
  const objects = input.objects ?? readSceneObjects(input.sceneJson);
  const objectById = buildObjectMap(objects);
  const intelligenceInput = Object.freeze({
    sceneJson: input.sceneJson,
    relationships,
    objects,
  });

  const dependencyRegistry = buildDependencyIntelligenceRegistry(intelligenceInput);
  const influenceRegistry = buildRelationshipInfluenceRegistry(intelligenceInput);
  const riskRegistry = buildRelationshipRiskExposureRegistry(intelligenceInput);

  const blueprintRegistry =
    input.blueprintRegistry ??
    buildScenarioBlueprintRegistry({
      sceneJson: input.sceneJson,
      objects,
      relationships,
    });

  const scenarioIds = input.scenarioIds ? new Set(input.scenarioIds) : null;
  const blueprints = blueprintRegistry.blueprints.filter((blueprint) =>
    scenarioIds ? scenarioIds.has(blueprint.scenarioId) : true
  );

  const profiles = Object.freeze(
    blueprints.flatMap((blueprint) =>
      buildProfilesForBlueprint(
        blueprint,
        dependencyRegistry.dependencyByRelationshipId,
        influenceRegistry.influenceByRelationshipId,
        riskRegistry.riskExposureByRelationshipId,
        objectById
      )
    )
  );
  const profileById = Object.freeze(
    profiles.reduce<Record<string, RelationshipImpactProfile>>((registry, profile) => {
      registry[profile.profileId] = profile;
      return registry;
    }, {})
  );

  latestRelationshipImpactProfileRegistry = Object.freeze({
    version: RELATIONSHIP_IMPACT_SIMULATION_ENGINE_VERSION,
    profiles,
    profileById,
    profilesByRelationshipId: indexProfilesByRelationshipId(profiles),
    profilesByScenarioId: indexProfilesByScenarioId(profiles),
    profileCount: profiles.length,
    relationshipCount: dependencyRegistry.relationshipCount,
    scenarioCount: blueprints.length,
    readOnly: true,
    sceneMutation: false,
    simulationActive: false,
    diagnostics: RELATIONSHIP_IMPACT_SIMULATION_DIAGNOSTICS,
  });

  return latestRelationshipImpactProfileRegistry;
}

export function getRelationshipImpactProfileRegistry(): RelationshipImpactProfileRegistry {
  return latestRelationshipImpactProfileRegistry;
}

export function resetRelationshipImpactSimulationEngineForTests(): void {
  latestRelationshipImpactProfileRegistry = EMPTY_RELATIONSHIP_IMPACT_PROFILE_REGISTRY;
}

export const RelationshipImpactSimulationEngine = Object.freeze({
  buildRelationshipImpactProfileRegistry,
  getRelationshipImpactProfileRegistry,
});
