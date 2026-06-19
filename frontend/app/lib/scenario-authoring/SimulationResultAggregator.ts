import { getKpiSimulationResult } from "./KpiSimulationEngine.ts";
import { getObjectSimulationResult } from "./ObjectSimulationEngine.ts";
import { getRelationshipSimulationResult } from "./RelationshipSimulationEngine.ts";
import type { KpiSimulationResult } from "./kpiSimulationEngineContract.ts";
import type { ObjectSimulationResult } from "./objectSimulationEngineContract.ts";
import type { RelationshipSimulationResult } from "./relationshipSimulationEngineContract.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";
import {
  EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
  SIMULATION_RESULT_AGGREGATOR_DIAGNOSTICS,
  SIMULATION_RESULT_AGGREGATOR_VERSION,
  type ExecutiveSimulationSummary,
  type RiskSimulationResultInput,
  type SimulationMovement,
  type SimulationResultAggregatorInput,
} from "./simulationResultAggregatorContract.ts";

let latestExecutiveSimulationSummary: ExecutiveSimulationSummary =
  EMPTY_EXECUTIVE_SIMULATION_SUMMARY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function movement(delta: number, confidence: number): SimulationMovement {
  const direction = delta > 2 ? "positive" : delta < -2 ? "negative" : "neutral";
  return Object.freeze({
    direction,
    delta: Math.round(delta),
    confidence: clampScore(confidence),
  });
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

function resolveObjectSimulation(input?: ObjectSimulationResult | null): ObjectSimulationResult | null {
  return input ?? getObjectSimulationResult();
}

function resolveRelationshipSimulation(input?: RelationshipSimulationResult | null): RelationshipSimulationResult | null {
  return input ?? getRelationshipSimulationResult();
}

function resolveKpiSimulation(input?: KpiSimulationResult | null): KpiSimulationResult | null {
  return input ?? getKpiSimulationResult();
}

function riskDeltaFromInput(riskSimulation: RiskSimulationResultInput | null | undefined): number | null {
  if (!riskSimulation) return null;
  if (typeof riskSimulation.averageRiskDelta === "number") return riskSimulation.averageRiskDelta;
  return average(riskSimulation.riskImpacts.map((impact) => impact.riskDelta));
}

function riskConfidenceFromInput(riskSimulation: RiskSimulationResultInput | null | undefined): number | null {
  if (!riskSimulation) return null;
  if (typeof riskSimulation.averageRiskConfidence === "number") return riskSimulation.averageRiskConfidence;
  return average(riskSimulation.riskImpacts.map((impact) => impact.riskConfidence));
}

function deriveRiskMovement(
  relationshipSimulation: RelationshipSimulationResult | null,
  riskSimulation: RiskSimulationResultInput | null | undefined
): SimulationMovement {
  const explicitRiskDelta = riskDeltaFromInput(riskSimulation);
  const explicitRiskConfidence = riskConfidenceFromInput(riskSimulation);
  if (explicitRiskDelta != null) {
    return movement(-explicitRiskDelta, explicitRiskConfidence ?? 0);
  }

  const relationshipRiskDelta = relationshipSimulation?.averageRiskExposureDelta ?? 0;
  const relationshipConfidence = relationshipSimulation?.averageRelationshipConfidence ?? 0;
  return movement(-relationshipRiskDelta, relationshipConfidence);
}

function deriveKpiMovement(kpiSimulation: KpiSimulationResult | null): SimulationMovement {
  if (!kpiSimulation) return movement(0, 0);
  const delta =
    kpiSimulation.averageKpiHealthDelta * 0.45 -
    kpiSimulation.averageKpiImpactDelta * 0.25 +
    kpiSimulation.averageKpiTrendDelta * 0.3;
  return movement(delta, kpiSimulation.averageKpiConfidence);
}

function positiveEffects(input: {
  objectSimulation: ObjectSimulationResult | null;
  relationshipSimulation: RelationshipSimulationResult | null;
  kpiSimulation: KpiSimulationResult | null;
  riskMovement: SimulationMovement;
  kpiMovement: SimulationMovement;
}): readonly string[] {
  const effects: string[] = [];
  if ((input.objectSimulation?.averageObjectConfidence ?? 0) >= 70) {
    effects.push("Object simulation confidence remains strong.");
  }
  if ((input.relationshipSimulation?.averageRelationshipConfidence ?? 0) >= 70) {
    effects.push("Relationship simulation confidence remains strong.");
  }
  if (input.kpiMovement.direction === "positive") {
    effects.push("KPI movement improves under deterministic scenario delta.");
  }
  if (input.riskMovement.direction === "positive") {
    effects.push("Risk movement improves under simulated conditions.");
  }
  return Object.freeze(effects.slice(0, 4));
}

function negativeEffects(input: {
  objectSimulation: ObjectSimulationResult | null;
  relationshipSimulation: RelationshipSimulationResult | null;
  kpiSimulation: KpiSimulationResult | null;
  riskMovement: SimulationMovement;
  kpiMovement: SimulationMovement;
}): readonly string[] {
  const effects: string[] = [];
  if ((input.objectSimulation?.averageObjectHealthDelta ?? 0) < 0) {
    effects.push("Object health pressure increases.");
  }
  if ((input.relationshipSimulation?.averageRiskExposureDelta ?? 0) > 0) {
    effects.push("Relationship risk exposure increases.");
  }
  if (input.kpiMovement.direction === "negative") {
    effects.push("KPI movement deteriorates under deterministic scenario delta.");
  }
  if (input.riskMovement.direction === "negative") {
    effects.push("Risk movement worsens under simulated conditions.");
  }
  return Object.freeze(effects.slice(0, 4));
}

export function aggregateSimulationResults(
  input: SimulationResultAggregatorInput
): ExecutiveSimulationSummary {
  const request = freezeRequest(input.request);
  const objectSimulation = resolveObjectSimulation(input.objectSimulation);
  const relationshipSimulation = resolveRelationshipSimulation(input.relationshipSimulation);
  const kpiSimulation = resolveKpiSimulation(input.kpiSimulation);
  const riskMovement = deriveRiskMovement(relationshipSimulation, input.riskSimulation);
  const kpiMovement = deriveKpiMovement(kpiSimulation);
  const confidence = average([
    objectSimulation?.averageObjectConfidence ?? 0,
    relationshipSimulation?.averageRelationshipConfidence ?? 0,
    kpiSimulation?.averageKpiConfidence ?? 0,
    riskMovement.confidence,
  ].filter((value) => value > 0));
  const overallScenarioImpact = clampScore(
    50 +
      (objectSimulation?.averageObjectHealthDelta ?? 0) * 0.25 -
      (relationshipSimulation?.averageRiskExposureDelta ?? 0) * 0.2 +
      kpiMovement.delta * 0.3 +
      riskMovement.delta * 0.25
  );

  latestExecutiveSimulationSummary = Object.freeze({
    version: SIMULATION_RESULT_AGGREGATOR_VERSION,
    request,
    overallScenarioImpact,
    keyPositiveEffects: positiveEffects({
      objectSimulation,
      relationshipSimulation,
      kpiSimulation,
      riskMovement,
      kpiMovement,
    }),
    keyNegativeEffects: negativeEffects({
      objectSimulation,
      relationshipSimulation,
      kpiSimulation,
      riskMovement,
      kpiMovement,
    }),
    riskMovement,
    kpiMovement,
    confidence,
    objectCount: objectSimulation?.objectCount ?? 0,
    relationshipCount: relationshipSimulation?.relationshipCount ?? 0,
    kpiCount: kpiSimulation?.kpiCount ?? 0,
    riskCount: input.riskSimulation?.riskImpacts.length ?? 0,
    uiRendering: false as const,
    routingMutation: false as const,
    readOnly: true as const,
    diagnostics: SIMULATION_RESULT_AGGREGATOR_DIAGNOSTICS,
  });

  return latestExecutiveSimulationSummary;
}

export function getExecutiveSimulationSummary(): ExecutiveSimulationSummary {
  return latestExecutiveSimulationSummary;
}

export function resetSimulationResultAggregatorForTests(): void {
  latestExecutiveSimulationSummary = EMPTY_EXECUTIVE_SIMULATION_SUMMARY;
}

export const SimulationResultAggregator = Object.freeze({
  aggregateSimulationResults,
  getExecutiveSimulationSummary,
  resetSimulationResultAggregatorForTests,
  diagnostics: SIMULATION_RESULT_AGGREGATOR_DIAGNOSTICS,
  emptySummary: EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
});
