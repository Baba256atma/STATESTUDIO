import {
  EMPTY_RELATIONSHIP_INTELLIGENCE_REGISTRY,
  type RelationshipIntelligenceProfile,
  type RelationshipIntelligenceRegistry,
} from "../relationship-intelligence/relationshipIntelligenceContract.ts";
import { getRelationshipIntelligenceRegistry } from "../relationship-intelligence/RelationshipIntelligenceRuntime.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";
import {
  EMPTY_RELATIONSHIP_SIMULATION_RESULT,
  RELATIONSHIP_SIMULATION_ENGINE_DIAGNOSTICS,
  RELATIONSHIP_SIMULATION_ENGINE_VERSION,
  type RelationshipSimulationEngineInput,
  type RelationshipSimulationImpact,
  type RelationshipSimulationResult,
} from "./relationshipSimulationEngineContract.ts";

let latestRelationshipSimulationResult: RelationshipSimulationResult =
  EMPTY_RELATIONSHIP_SIMULATION_RESULT;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function clampDelta(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function freezeRequest(request: ScenarioSimulationRequest): ScenarioSimulationRequest {
  return Object.freeze({
    ...request,
    baselineReference: request.baselineReference
      ? Object.freeze({ ...request.baselineReference })
      : undefined,
    sceneMutation: false as const,
    dsMutation: false as const,
    routingMutation: false as const,
  });
}

function scenarioPressure(request: ScenarioSimulationRequest): number {
  const baselinePreserved = request.baselineReference?.preserved === true ? 0.85 : 1;
  const dryRunAdjustment = request.dryRun === true ? 0.9 : 1;
  return baselinePreserved * dryRunAdjustment;
}

function typePressure(profile: RelationshipIntelligenceProfile): number {
  if (profile.relationshipType === "dependency" || profile.relationshipType === "supplies") return 1.15;
  if (profile.relationshipType === "blocks" || profile.relationshipType === "risk") return 1.25;
  if (profile.relationshipType === "supports") return 0.85;
  return 1;
}

function simulateProfile(
  profile: RelationshipIntelligenceProfile,
  request: ScenarioSimulationRequest
): RelationshipSimulationImpact {
  const pressure = scenarioPressure(request) * typePressure(profile);
  const confidenceBuffer = profile.confidence * 0.05;
  const dependencyDelta = clampDelta((profile.dependency * 0.1 + profile.riskExposure * 0.05) * pressure - confidenceBuffer, -12, 35);
  const influenceDelta = clampDelta((profile.influence * 0.08 + profile.strength * 0.04) * pressure, -10, 30);
  const riskExposureDelta = clampDelta((profile.riskExposure * 0.12 + profile.dependency * 0.04) * pressure - confidenceBuffer * 0.5, -10, 40);
  const relationshipConfidence = clampScore(profile.confidence * 0.82 + (request.baselineReference?.preserved ? 10 : 3));

  return Object.freeze({
    relationshipId: profile.relationshipId,
    sourceId: profile.sourceId,
    targetId: profile.targetId,
    relationshipType: profile.relationshipType,
    baselineDependency: profile.dependency,
    baselineInfluence: profile.influence,
    baselineRiskExposure: profile.riskExposure,
    dependencyDelta,
    influenceDelta,
    riskExposureDelta,
    relationshipConfidence,
    readOnly: true as const,
    topologyMutation: false as const,
  });
}

function resolveRelationshipIntelligence(
  relationshipIntelligence: RelationshipIntelligenceRegistry | undefined
): RelationshipIntelligenceRegistry {
  return relationshipIntelligence ?? getRelationshipIntelligenceRegistry() ?? EMPTY_RELATIONSHIP_INTELLIGENCE_REGISTRY;
}

export function runRelationshipSimulation(
  input: RelationshipSimulationEngineInput
): RelationshipSimulationResult {
  const request = freezeRequest(input.request);
  const relationshipIntelligence = resolveRelationshipIntelligence(input.relationshipIntelligence);
  const relationshipImpacts = Object.freeze(
    relationshipIntelligence.profiles.map((profile) => simulateProfile(profile, request))
  );

  latestRelationshipSimulationResult = Object.freeze({
    version: RELATIONSHIP_SIMULATION_ENGINE_VERSION,
    request,
    relationshipImpacts,
    relationshipCount: relationshipImpacts.length,
    averageDependencyDelta: average(relationshipImpacts.map((impact) => impact.dependencyDelta)),
    averageInfluenceDelta: average(relationshipImpacts.map((impact) => impact.influenceDelta)),
    averageRiskExposureDelta: average(relationshipImpacts.map((impact) => impact.riskExposureDelta)),
    averageRelationshipConfidence: average(relationshipImpacts.map((impact) => impact.relationshipConfidence)),
    readOnly: true as const,
    topologyMutation: false as const,
    objectMutation: false as const,
    sceneMutation: false as const,
    dsMutation: false as const,
    routingMutation: false as const,
    simulationExecuted: true as const,
    diagnostics: RELATIONSHIP_SIMULATION_ENGINE_DIAGNOSTICS,
  });

  return latestRelationshipSimulationResult;
}

export function getRelationshipSimulationResult(): RelationshipSimulationResult {
  return latestRelationshipSimulationResult;
}

export function resetRelationshipSimulationEngineForTests(): void {
  latestRelationshipSimulationResult = EMPTY_RELATIONSHIP_SIMULATION_RESULT;
}

export const RelationshipSimulationEngine = Object.freeze({
  runRelationshipSimulation,
  getRelationshipSimulationResult,
  resetRelationshipSimulationEngineForTests,
  diagnostics: RELATIONSHIP_SIMULATION_ENGINE_DIAGNOSTICS,
  emptyResult: EMPTY_RELATIONSHIP_SIMULATION_RESULT,
});
