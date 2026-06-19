import type { ObjectIntelligenceProfile, ObjectIntelligenceRegistry } from "../object-intelligence/objectIntelligenceContract.ts";
import { EMPTY_OBJECT_INTELLIGENCE_REGISTRY } from "../object-intelligence/objectIntelligenceContract.ts";
import { getObjectIntelligenceRegistry } from "../object-intelligence/ObjectIntelligenceRuntime.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";
import {
  EMPTY_OBJECT_SIMULATION_RESULT,
  OBJECT_SIMULATION_ENGINE_DIAGNOSTICS,
  OBJECT_SIMULATION_ENGINE_VERSION,
  type ObjectSimulationEngineInput,
  type ObjectSimulationImpact,
  type ObjectSimulationResult,
} from "./objectSimulationEngineContract.ts";

let latestObjectSimulationResult: ObjectSimulationResult = EMPTY_OBJECT_SIMULATION_RESULT;

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

function trendPressure(trend: ObjectIntelligenceProfile["trend"]): number {
  if (trend === "improving") return 4;
  if (trend === "stable") return 0;
  if (trend === "declining") return -8;
  return -2;
}

function scenarioPressure(request: ScenarioSimulationRequest): number {
  const baselinePreserved = request.baselineReference?.preserved === true ? 0.85 : 1;
  const dryRunAdjustment = request.dryRun === true ? 0.9 : 1;
  return baselinePreserved * dryRunAdjustment;
}

function simulateProfile(
  profile: ObjectIntelligenceProfile,
  request: ScenarioSimulationRequest
): ObjectSimulationImpact {
  const pressure = scenarioPressure(request);
  const exposure = (profile.impact * 0.14 + profile.importance * 0.08) * pressure;
  const resilience = profile.health * 0.05 + profile.confidence * 0.04;
  const objectHealthDelta = clampDelta(resilience - exposure, -40, 20);
  const objectImpactDelta = clampDelta((profile.impact * 0.09 + profile.importance * 0.06) * pressure, -10, 35);
  const objectTrendDelta = clampDelta(trendPressure(profile.trend) - objectImpactDelta * 0.25, -20, 15);
  const objectConfidence = clampScore(profile.confidence * 0.8 + (request.baselineReference?.preserved ? 12 : 4));

  return Object.freeze({
    objectId: profile.objectId,
    label: profile.label,
    objectType: profile.objectType,
    source: profile.source,
    baselineHealth: profile.health,
    baselineImpact: profile.impact,
    baselineTrend: profile.trend,
    objectHealthDelta,
    objectImpactDelta,
    objectTrendDelta,
    objectConfidence,
    readOnly: true as const,
    objectMutation: false as const,
  });
}

function resolveObjectIntelligence(
  objectIntelligence: ObjectIntelligenceRegistry | undefined
): ObjectIntelligenceRegistry {
  return objectIntelligence ?? getObjectIntelligenceRegistry() ?? EMPTY_OBJECT_INTELLIGENCE_REGISTRY;
}

export function runObjectSimulation(input: ObjectSimulationEngineInput): ObjectSimulationResult {
  const request = freezeRequest(input.request);
  const objectIntelligence = resolveObjectIntelligence(input.objectIntelligence);
  const objectImpacts = Object.freeze(
    objectIntelligence.profiles.map((profile) => simulateProfile(profile, request))
  );

  latestObjectSimulationResult = Object.freeze({
    version: OBJECT_SIMULATION_ENGINE_VERSION,
    request,
    objectImpacts,
    objectCount: objectImpacts.length,
    averageObjectHealthDelta: average(objectImpacts.map((impact) => impact.objectHealthDelta)),
    averageObjectImpactDelta: average(objectImpacts.map((impact) => impact.objectImpactDelta)),
    averageObjectTrendDelta: average(objectImpacts.map((impact) => impact.objectTrendDelta)),
    averageObjectConfidence: average(objectImpacts.map((impact) => impact.objectConfidence)),
    readOnly: true as const,
    objectMutation: false as const,
    sceneMutation: false as const,
    dsMutation: false as const,
    routingMutation: false as const,
    simulationExecuted: true as const,
    diagnostics: OBJECT_SIMULATION_ENGINE_DIAGNOSTICS,
  });

  return latestObjectSimulationResult;
}

export function getObjectSimulationResult(): ObjectSimulationResult {
  return latestObjectSimulationResult;
}

export function resetObjectSimulationEngineForTests(): void {
  latestObjectSimulationResult = EMPTY_OBJECT_SIMULATION_RESULT;
}

export const ObjectSimulationEngine = Object.freeze({
  runObjectSimulation,
  getObjectSimulationResult,
  resetObjectSimulationEngineForTests,
  diagnostics: OBJECT_SIMULATION_ENGINE_DIAGNOSTICS,
  emptyResult: EMPTY_OBJECT_SIMULATION_RESULT,
});
