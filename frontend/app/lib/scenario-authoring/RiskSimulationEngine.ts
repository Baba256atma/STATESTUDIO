import {
  EMPTY_RISK_INTELLIGENCE_REGISTRY,
  type RiskIntelligenceMomentum,
  type RiskIntelligenceProfile,
  type RiskIntelligenceRegistry,
} from "../risk-intelligence/riskIntelligenceContract.ts";
import { getRiskIntelligenceRegistry } from "../risk-intelligence/RiskIntelligenceRuntime.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";
import {
  EMPTY_RISK_SIMULATION_RESULT,
  RISK_SIMULATION_ENGINE_DIAGNOSTICS,
  RISK_SIMULATION_ENGINE_VERSION,
  type RiskSimulationEngineInput,
  type RiskSimulationImpact,
  type RiskSimulationResult,
} from "./riskSimulationEngineContract.ts";

let latestRiskSimulationResult: RiskSimulationResult = EMPTY_RISK_SIMULATION_RESULT;

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
    baselineReference: request.baselineReference ? Object.freeze({ ...request.baselineReference }) : undefined,
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

function momentumDelta(momentum: RiskIntelligenceMomentum): number {
  if (momentum === "improving") return -6;
  if (momentum === "worsening") return 8;
  if (momentum === "stable") return 0;
  return 2;
}

function simulateProfile(profile: RiskIntelligenceProfile, request: ScenarioSimulationRequest): RiskSimulationImpact {
  const pressure = scenarioPressure(request);
  const severityDelta = clampDelta(profile.severity * 0.08 * pressure + momentumDelta(profile.momentum), -20, 35);
  const exposureDelta = clampDelta(profile.exposure * 0.09 * pressure + momentumDelta(profile.momentum) * 0.6, -20, 35);
  const riskDelta = clampDelta(severityDelta * 0.55 + exposureDelta * 0.45, -25, 40);
  const riskConfidence = clampScore(profile.confidence * 0.84 + (request.baselineReference?.preserved ? 10 : 3));

  return Object.freeze({
    riskId: profile.riskId,
    subjectId: profile.subjectId,
    label: profile.label,
    primaryCategory: profile.primaryCategory,
    baselineSeverity: profile.severity,
    baselineExposure: profile.exposure,
    baselineMomentum: profile.momentum,
    riskDelta,
    severityDelta,
    exposureDelta,
    riskConfidence,
    deterministicScenarioDelta: true as const,
    readOnly: true as const,
    riskMutation: false as const,
  });
}

function resolveRiskIntelligence(riskIntelligence: RiskIntelligenceRegistry | undefined): RiskIntelligenceRegistry {
  return riskIntelligence ?? getRiskIntelligenceRegistry() ?? EMPTY_RISK_INTELLIGENCE_REGISTRY;
}

export function runRiskSimulation(input: RiskSimulationEngineInput): RiskSimulationResult {
  const request = freezeRequest(input.request);
  const riskIntelligence = resolveRiskIntelligence(input.riskIntelligence);
  const riskImpacts = Object.freeze(riskIntelligence.profiles.map((profile) => simulateProfile(profile, request)));

  latestRiskSimulationResult = Object.freeze({
    version: RISK_SIMULATION_ENGINE_VERSION,
    request,
    riskImpacts,
    riskCount: riskImpacts.length,
    averageRiskDelta: average(riskImpacts.map((impact) => impact.riskDelta)),
    averageSeverityDelta: average(riskImpacts.map((impact) => impact.severityDelta)),
    averageExposureDelta: average(riskImpacts.map((impact) => impact.exposureDelta)),
    averageRiskConfidence: average(riskImpacts.map((impact) => impact.riskConfidence)),
    deterministicScenarioDelta: true as const,
    readOnly: true as const,
    riskMutation: false as const,
    sceneMutation: false as const,
    dsMutation: false as const,
    routingMutation: false as const,
    diagnostics: RISK_SIMULATION_ENGINE_DIAGNOSTICS,
  });

  return latestRiskSimulationResult;
}

export function getRiskSimulationResult(): RiskSimulationResult {
  return latestRiskSimulationResult;
}

export function resetRiskSimulationEngineForTests(): void {
  latestRiskSimulationResult = EMPTY_RISK_SIMULATION_RESULT;
}

export const RiskSimulationEngine = Object.freeze({
  runRiskSimulation,
  getRiskSimulationResult,
  resetRiskSimulationEngineForTests,
  diagnostics: RISK_SIMULATION_ENGINE_DIAGNOSTICS,
  emptyResult: EMPTY_RISK_SIMULATION_RESULT,
});
