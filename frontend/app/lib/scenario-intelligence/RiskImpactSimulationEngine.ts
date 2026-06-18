import { buildExecutiveRiskSummary } from "../risk-intelligence/ExecutiveRiskSummary.ts";
import { calculateObjectRiskProfile } from "../risk-intelligence/ObjectRiskEngine.ts";
import { buildRiskPropagationProfile } from "../risk-intelligence/RiskPropagationEngine.ts";
import type { ExecutiveRiskSummary, ExecutiveRiskSummaryProfile } from "../risk-intelligence/executiveRiskSummaryContract.ts";
import type { RiskPropagationProfile } from "../risk-intelligence/riskPropagationProfileContract.ts";
import { buildScenarioBlueprintRegistry } from "./ScenarioBuilderEngine.ts";
import {
  EMPTY_RISK_IMPACT_PROFILE_REGISTRY,
  RISK_IMPACT_SIMULATION_DIAGNOSTICS,
  RISK_IMPACT_SIMULATION_ENGINE_VERSION,
  type RiskDecreaseImpact,
  type RiskImpactProfile,
  type RiskImpactProfileRegistry,
  type RiskImpactResult,
  type RiskImpactSimulationBuildInput,
  type RiskImpactSubjectKind,
  type RiskIncreaseImpact,
  type RiskPropagationImpact,
} from "./riskImpactSimulationContract.ts";
import type { ScenarioBlueprint } from "./scenarioBuilderContract.ts";
import type { ScenarioType } from "./scenarioGenerationContract.ts";

let latestRiskImpactProfileRegistry: RiskImpactProfileRegistry = EMPTY_RISK_IMPACT_PROFILE_REGISTRY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readSceneObjects(sceneJson: unknown): readonly unknown[] {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  return Array.isArray(objects) ? objects : [];
}

function readSceneRelationships(sceneJson: unknown): readonly unknown[] {
  const relationships = (sceneJson as { scene?: { relationships?: unknown[] } } | null)?.scene
    ?.relationships;
  return Array.isArray(relationships) ? relationships : [];
}

function readSceneKpis(sceneJson: unknown): readonly unknown[] {
  const scene = (sceneJson as { scene?: Record<string, unknown> } | null)?.scene;
  if (!scene) return [];
  if (Array.isArray(scene.kpis)) return scene.kpis;
  if (Array.isArray(scene.metrics)) return scene.metrics;
  return [];
}

function projectRiskScore(
  baselineScore: number,
  scenarioType: ScenarioType,
  hasBlueprintChange: boolean
): number {
  if (scenarioType === "baseline") return baselineScore;
  if (scenarioType === "risk") return clampScore(baselineScore + (hasBlueprintChange ? 16 : 10));
  if (scenarioType === "opportunity") return clampScore(Math.max(0, baselineScore - 14));
  if (scenarioType === "alternative") return clampScore(baselineScore + (hasBlueprintChange ? 7 : 4));
  return baselineScore;
}

function projectPropagationScore(
  baseline: RiskPropagationProfile,
  blueprint: ScenarioBlueprint,
  scenarioType: ScenarioType
): number {
  if (scenarioType === "baseline") return baseline.propagationScore;
  const changeBoost = blueprint.changeCount * 1.5;
  if (scenarioType === "risk") return clampScore(baseline.propagationScore + 14 + changeBoost);
  if (scenarioType === "opportunity") return clampScore(Math.max(0, baseline.propagationScore - 12));
  return clampScore(baseline.propagationScore + changeBoost);
}

function buildRiskIncreaseImpact(baseline: number, projected: number): RiskIncreaseImpact {
  const delta = projected - baseline;
  return Object.freeze({
    baselineRiskScore: baseline,
    projectedRiskScore: projected,
    riskDelta: Math.max(0, delta),
    increaseDetected: delta > 2,
  });
}

function buildRiskDecreaseImpact(baseline: number, projected: number): RiskDecreaseImpact {
  const delta = projected - baseline;
  return Object.freeze({
    baselineRiskScore: baseline,
    projectedRiskScore: projected,
    riskDelta: Math.min(0, delta),
    decreaseDetected: delta < -2,
  });
}

function buildRiskPropagationImpact(
  subjectId: string,
  baselinePropagation: RiskPropagationProfile,
  projectedPropagationScore: number,
  scenarioType: ScenarioType
): RiskPropagationImpact {
  const relevantChains = baselinePropagation.riskChains.filter(
    (chain) => chain.sourceId === subjectId || chain.targetId === subjectId
  );
  const affectedTargets = new Set(relevantChains.map((chain) => chain.targetId));
  const propagationDelta = projectedPropagationScore - baselinePropagation.propagationScore;

  return Object.freeze({
    baselinePropagationScore: baselinePropagation.propagationScore,
    projectedPropagationScore,
    propagationDelta,
    affectedChainCount: relevantChains.length,
    affectedTargetCount: affectedTargets.size,
    propagationDetected:
      scenarioType !== "baseline" &&
      relevantChains.length > 0 &&
      propagationDelta > 2,
  });
}

function compositeImpactScore(
  riskIncrease: RiskIncreaseImpact,
  riskDecrease: RiskDecreaseImpact,
  riskPropagation: RiskPropagationImpact
): number {
  return clampScore(
    riskIncrease.riskDelta * 0.4 +
      Math.abs(riskDecrease.riskDelta) * 0.25 +
      Math.abs(riskPropagation.propagationDelta) * 0.35
  );
}

function hasObjectChange(blueprint: ScenarioBlueprint, objectId: string): boolean {
  return blueprint.objectChanges.some((change) => change.objectId === objectId);
}

function hasRelationshipChange(blueprint: ScenarioBlueprint, relationshipId: string): boolean {
  return blueprint.relationshipChanges.some((change) => change.relationshipId === relationshipId);
}

function hasKpiChange(blueprint: ScenarioBlueprint, kpiId: string): boolean {
  return blueprint.kpiChanges.some((change) => change.kpiId === kpiId);
}

function projectedObjectRiskScore(
  objectId: string,
  baselineScore: number,
  blueprint: ScenarioBlueprint,
  scenarioType: ScenarioType
): number {
  const objectChange = blueprint.objectChanges.find((change) => change.objectId === objectId);
  if (objectChange) {
    const projected = calculateObjectRiskProfile(
      Object.freeze({
        ...objectChange.baselineState,
        ...objectChange.proposedState,
        id: objectId,
      }),
      0,
      "simulation"
    );
    if (projected) return projected.riskScore;
  }
  return projectRiskScore(baselineScore, scenarioType, hasObjectChange(blueprint, objectId));
}

function projectedSubjectRiskScore(
  entry: ExecutiveRiskSummaryProfile,
  blueprint: ScenarioBlueprint,
  scenarioType: ScenarioType
): number {
  if (entry.nodeKind === "object") {
    return projectedObjectRiskScore(entry.nodeId, entry.riskScore, blueprint, scenarioType);
  }
  if (entry.nodeKind === "relationship") {
    return projectRiskScore(
      entry.riskScore,
      scenarioType,
      hasRelationshipChange(blueprint, entry.nodeId)
    );
  }
  return projectRiskScore(entry.riskScore, scenarioType, hasKpiChange(blueprint, entry.nodeId));
}

function buildImpactResult(
  subjectId: string,
  subjectKind: RiskImpactSubjectKind,
  label: string,
  scenarioId: string,
  baselineRiskScore: number,
  projectedRiskScore: number,
  baselinePropagation: RiskPropagationProfile,
  projectedPropagationScore: number,
  scenarioType: ScenarioType
): RiskImpactResult {
  const riskIncrease = buildRiskIncreaseImpact(baselineRiskScore, projectedRiskScore);
  const riskDecrease = buildRiskDecreaseImpact(baselineRiskScore, projectedRiskScore);
  const riskPropagation = buildRiskPropagationImpact(
    subjectKind === "propagation" ? baselinePropagation.propagationId : subjectId,
    baselinePropagation,
    projectedPropagationScore,
    scenarioType
  );

  return Object.freeze({
    subjectId,
    subjectKind,
    scenarioId,
    label,
    riskIncrease,
    riskDecrease,
    riskPropagation,
    netRiskDelta: projectedRiskScore - baselineRiskScore,
    compositeImpactScore: compositeImpactScore(riskIncrease, riskDecrease, riskPropagation),
    simulationReady: true,
    applied: false,
  });
}

function buildProfilesForBlueprint(
  blueprint: ScenarioBlueprint,
  executiveSummary: ExecutiveRiskSummary,
  baselinePropagation: RiskPropagationProfile
): readonly RiskImpactProfile[] {
  const projectedPropagationScore = projectPropagationScore(
    baselinePropagation,
    blueprint,
    blueprint.scenarioType
  );

  const propagationResult = buildImpactResult(
    baselinePropagation.propagationId,
    "propagation",
    "Business Graph Risk Propagation",
    blueprint.scenarioId,
    baselinePropagation.propagationScore,
    projectedPropagationScore,
    baselinePropagation,
    projectedPropagationScore,
    blueprint.scenarioType
  );

  const subjectProfiles = executiveSummary.profiles.map((entry) => {
    const baselineRiskScore = entry.riskScore;
    const projectedRiskScore = projectedSubjectRiskScore(entry, blueprint, blueprint.scenarioType);
    const impactResult = buildImpactResult(
      entry.nodeId,
      entry.nodeKind,
      entry.label,
      blueprint.scenarioId,
      baselineRiskScore,
      projectedRiskScore,
      baselinePropagation,
      projectedPropagationScore,
      blueprint.scenarioType
    );

    return Object.freeze({
      profileId: `risk-impact:${blueprint.scenarioId}:${entry.nodeKind}:${entry.nodeId}`,
      scenarioId: blueprint.scenarioId,
      scenarioType: blueprint.scenarioType,
      subjectId: entry.nodeId,
      subjectKind: entry.nodeKind,
      label: entry.label,
      impactResult,
      readOnly: true as const,
    });
  });

  return Object.freeze([
    Object.freeze({
      profileId: `risk-impact:${blueprint.scenarioId}:propagation:${baselinePropagation.propagationId}`,
      scenarioId: blueprint.scenarioId,
      scenarioType: blueprint.scenarioType,
      subjectId: baselinePropagation.propagationId,
      subjectKind: "propagation" as const,
      label: propagationResult.label,
      impactResult: propagationResult,
      readOnly: true as const,
    }),
    ...subjectProfiles,
  ]);
}

function indexProfilesBySubjectId(
  profiles: readonly RiskImpactProfile[]
): Readonly<Record<string, readonly RiskImpactProfile[]>> {
  const grouped = new Map<string, RiskImpactProfile[]>();
  for (const profile of profiles) {
    const bucket = grouped.get(profile.subjectId) ?? [];
    bucket.push(profile);
    grouped.set(profile.subjectId, bucket);
  }
  return Object.freeze(
    Object.fromEntries(
      [...grouped.entries()].map(([subjectId, bucket]) => [subjectId, Object.freeze([...bucket])])
    )
  );
}

function indexProfilesByScenarioId(
  profiles: readonly RiskImpactProfile[]
): Readonly<Record<string, readonly RiskImpactProfile[]>> {
  const grouped = new Map<string, RiskImpactProfile[]>();
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

export function buildRiskImpactProfileRegistry(
  input: RiskImpactSimulationBuildInput = {}
): RiskImpactProfileRegistry {
  const objects = input.objects ?? input.sceneObjects ?? readSceneObjects(input.sceneJson);
  const relationships = input.relationships ?? readSceneRelationships(input.sceneJson);
  const kpis = input.kpis ?? readSceneKpis(input.sceneJson);
  const riskInput = Object.freeze({
    sceneJson: input.sceneJson,
    objects,
    relationships,
    kpis,
    sceneObjects: objects,
    dataSourceObjects: input.dataSourceObjects,
    dataSourceKpis: input.dataSourceKpis,
    historicalSnapshots: input.historicalSnapshots,
  });

  const executiveSummary = buildExecutiveRiskSummary(riskInput);
  const baselinePropagation = buildRiskPropagationProfile(riskInput);

  const blueprintRegistry =
    input.blueprintRegistry ??
    buildScenarioBlueprintRegistry({
      sceneJson: input.sceneJson,
      objects,
      relationships,
      kpis,
      risks: (input.sceneJson as { scene?: { risks?: unknown[] } } | null)?.scene?.risks,
    });

  const scenarioIds = input.scenarioIds ? new Set(input.scenarioIds) : null;
  const blueprints = blueprintRegistry.blueprints.filter((blueprint) =>
    scenarioIds ? scenarioIds.has(blueprint.scenarioId) : true
  );

  const profiles = Object.freeze(
    blueprints.flatMap((blueprint) =>
      buildProfilesForBlueprint(blueprint, executiveSummary, baselinePropagation)
    )
  );
  const profileById = Object.freeze(
    profiles.reduce<Record<string, RiskImpactProfile>>((registry, profile) => {
      registry[profile.profileId] = profile;
      return registry;
    }, {})
  );
  const subjectIds = new Set(profiles.map((profile) => profile.subjectId));

  latestRiskImpactProfileRegistry = Object.freeze({
    version: RISK_IMPACT_SIMULATION_ENGINE_VERSION,
    profiles,
    profileById,
    profilesBySubjectId: indexProfilesBySubjectId(profiles),
    profilesByScenarioId: indexProfilesByScenarioId(profiles),
    profileCount: profiles.length,
    subjectCount: subjectIds.size,
    scenarioCount: blueprints.length,
    readOnly: true,
    sceneMutation: false,
    simulationActive: false,
    diagnostics: RISK_IMPACT_SIMULATION_DIAGNOSTICS,
  });

  return latestRiskImpactProfileRegistry;
}

export function getRiskImpactProfileRegistry(): RiskImpactProfileRegistry {
  return latestRiskImpactProfileRegistry;
}

export function resetRiskImpactSimulationEngineForTests(): void {
  latestRiskImpactProfileRegistry = EMPTY_RISK_IMPACT_PROFILE_REGISTRY;
}

export const RiskImpactSimulationEngine = Object.freeze({
  buildRiskImpactProfileRegistry,
  getRiskImpactProfileRegistry,
});
