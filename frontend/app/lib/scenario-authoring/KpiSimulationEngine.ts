import {
  EMPTY_KPI_INTELLIGENCE_REGISTRY,
  type KpiIntelligenceProfile,
  type KpiIntelligenceRegistry,
} from "../kpi-intelligence/kpiIntelligenceContract.ts";
import { getKpiIntelligenceRegistry } from "../kpi-intelligence/KpiIntelligenceRuntime.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";
import {
  EMPTY_KPI_SIMULATION_RESULT,
  KPI_SIMULATION_ENGINE_DIAGNOSTICS,
  KPI_SIMULATION_ENGINE_VERSION,
  type KpiSimulationEngineInput,
  type KpiSimulationImpact,
  type KpiSimulationResult,
} from "./kpiSimulationEngineContract.ts";

let latestKpiSimulationResult: KpiSimulationResult = EMPTY_KPI_SIMULATION_RESULT;

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

function categoryImpactWeight(category: KpiIntelligenceProfile["category"]): number {
  if (category === "Risk Exposure") return 1.25;
  if (category === "Revenue" || category === "Margin") return 1.15;
  if (category === "Delivery" || category === "Schedule") return 1.05;
  if (category === "Cost" || category === "Quality") return 1;
  return 0.95;
}

function directionTrendDelta(direction: KpiIntelligenceProfile["direction"]): number {
  if (direction === "up") return 4;
  if (direction === "down") return -4;
  return 0;
}

function simulateProfile(
  profile: KpiIntelligenceProfile,
  request: ScenarioSimulationRequest
): KpiSimulationImpact {
  const pressure = scenarioPressure(request) * categoryImpactWeight(profile.category);
  const gap = profile.direction === "down"
    ? profile.value - profile.target
    : profile.target - profile.value;
  const normalizedGap = profile.target === 0 ? gap : (gap / Math.max(Math.abs(profile.target), 1)) * 100;
  const confidenceBuffer = profile.confidence * 0.04;
  const kpiHealthDelta = clampDelta(
    profile.intelligenceScore * 0.04 - normalizedGap * 0.08 - pressure * 8 + confidenceBuffer,
    -35,
    20
  );
  const kpiTrendDelta = clampDelta(
    directionTrendDelta(profile.direction) - normalizedGap * 0.05 - pressure * 4,
    -20,
    15
  );
  const kpiImpactDelta = clampDelta(
    (100 - profile.intelligenceScore) * 0.08 * pressure + Math.abs(normalizedGap) * 0.06,
    -8,
    35
  );
  const kpiConfidence = clampScore(profile.confidence * 0.84 + (request.baselineReference?.preserved ? 10 : 3));

  return Object.freeze({
    kpiId: profile.kpiId,
    label: profile.label,
    category: profile.category,
    source: profile.source,
    baselineValue: profile.value,
    baselineTarget: profile.target,
    baselineIntelligenceScore: profile.intelligenceScore,
    baselineDirection: profile.direction,
    kpiHealthDelta,
    kpiTrendDelta,
    kpiImpactDelta,
    kpiConfidence,
    deterministicScenarioDelta: true as const,
    forecastExecution: false as const,
    readOnly: true as const,
    kpiMutation: false as const,
  });
}

function resolveKpiIntelligence(kpiIntelligence: KpiIntelligenceRegistry | undefined): KpiIntelligenceRegistry {
  return kpiIntelligence ?? getKpiIntelligenceRegistry() ?? EMPTY_KPI_INTELLIGENCE_REGISTRY;
}

export function runKpiSimulation(input: KpiSimulationEngineInput): KpiSimulationResult {
  const request = freezeRequest(input.request);
  const kpiIntelligence = resolveKpiIntelligence(input.kpiIntelligence);
  const kpiImpacts = Object.freeze(
    kpiIntelligence.profiles.map((profile) => simulateProfile(profile, request))
  );

  latestKpiSimulationResult = Object.freeze({
    version: KPI_SIMULATION_ENGINE_VERSION,
    request,
    kpiImpacts,
    kpiCount: kpiImpacts.length,
    averageKpiHealthDelta: average(kpiImpacts.map((impact) => impact.kpiHealthDelta)),
    averageKpiTrendDelta: average(kpiImpacts.map((impact) => impact.kpiTrendDelta)),
    averageKpiImpactDelta: average(kpiImpacts.map((impact) => impact.kpiImpactDelta)),
    averageKpiConfidence: average(kpiImpacts.map((impact) => impact.kpiConfidence)),
    deterministicScenarioDelta: true as const,
    forecastExecution: false as const,
    readOnly: true as const,
    kpiMutation: false as const,
    sceneMutation: false as const,
    dsMutation: false as const,
    routingMutation: false as const,
    diagnostics: KPI_SIMULATION_ENGINE_DIAGNOSTICS,
  });

  return latestKpiSimulationResult;
}

export function getKpiSimulationResult(): KpiSimulationResult {
  return latestKpiSimulationResult;
}

export function resetKpiSimulationEngineForTests(): void {
  latestKpiSimulationResult = EMPTY_KPI_SIMULATION_RESULT;
}

export const KpiSimulationEngine = Object.freeze({
  runKpiSimulation,
  getKpiSimulationResult,
  resetKpiSimulationEngineForTests,
  diagnostics: KPI_SIMULATION_ENGINE_DIAGNOSTICS,
  emptyResult: EMPTY_KPI_SIMULATION_RESULT,
});
