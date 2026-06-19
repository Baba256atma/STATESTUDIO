/**
 * S:2 — Simulation Result Aggregator contract.
 *
 * Aggregates read-only object, relationship, KPI, and risk simulation outputs
 * into an executive simulation summary. No UI rendering or routing authority.
 */

import type { KpiSimulationResult } from "./kpiSimulationEngineContract.ts";
import type { ObjectSimulationResult } from "./objectSimulationEngineContract.ts";
import type { RelationshipSimulationResult } from "./relationshipSimulationEngineContract.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";

export const SIMULATION_RESULT_AGGREGATOR_DIAGNOSTIC = "[SIMULATION_RESULT_AGGREGATOR]" as const;

export const SIMULATION_RESULT_READY_DIAGNOSTIC = "[SIMULATION_RESULT_READY]" as const;

export const S2_AGGREGATOR_COMPLETE_TAG = "[S2_AGGREGATOR_COMPLETE]" as const;

export const SIMULATION_RESULT_AGGREGATOR_VERSION = "1.0.0" as const;

export type RiskSimulationImpactInput = Readonly<{
  riskId: string;
  label?: string;
  riskDelta: number;
  riskConfidence: number;
}>;

export type RiskSimulationResultInput = Readonly<{
  riskImpacts: readonly RiskSimulationImpactInput[];
  averageRiskDelta?: number;
  averageRiskConfidence?: number;
  readOnly?: true;
  routingMutation?: false;
}>;

export type SimulationResultAggregatorInput = Readonly<{
  request: ScenarioSimulationRequest;
  objectSimulation?: ObjectSimulationResult | null;
  relationshipSimulation?: RelationshipSimulationResult | null;
  kpiSimulation?: KpiSimulationResult | null;
  riskSimulation?: RiskSimulationResultInput | null;
}>;

export type SimulationMovement = Readonly<{
  direction: "positive" | "negative" | "neutral";
  delta: number;
  confidence: number;
}>;

export type ExecutiveSimulationSummary = Readonly<{
  version: typeof SIMULATION_RESULT_AGGREGATOR_VERSION;
  request: ScenarioSimulationRequest;
  overallScenarioImpact: number;
  keyPositiveEffects: readonly string[];
  keyNegativeEffects: readonly string[];
  riskMovement: SimulationMovement;
  kpiMovement: SimulationMovement;
  confidence: number;
  objectCount: number;
  relationshipCount: number;
  kpiCount: number;
  riskCount: number;
  uiRendering: false;
  routingMutation: false;
  readOnly: true;
  diagnostics: readonly [
    typeof SIMULATION_RESULT_AGGREGATOR_DIAGNOSTIC,
    typeof SIMULATION_RESULT_READY_DIAGNOSTIC,
  ];
}>;

export const SIMULATION_RESULT_AGGREGATOR_DIAGNOSTICS = Object.freeze([
  SIMULATION_RESULT_AGGREGATOR_DIAGNOSTIC,
  SIMULATION_RESULT_READY_DIAGNOSTIC,
] as const);

export const EMPTY_EXECUTIVE_SIMULATION_SUMMARY: ExecutiveSimulationSummary = Object.freeze({
  version: SIMULATION_RESULT_AGGREGATOR_VERSION,
  request: Object.freeze({
    draftId: "",
    sceneMutation: false,
    dsMutation: false,
    routingMutation: false,
  }),
  overallScenarioImpact: 0,
  keyPositiveEffects: Object.freeze([]),
  keyNegativeEffects: Object.freeze([]),
  riskMovement: Object.freeze({ direction: "neutral", delta: 0, confidence: 0 }),
  kpiMovement: Object.freeze({ direction: "neutral", delta: 0, confidence: 0 }),
  confidence: 0,
  objectCount: 0,
  relationshipCount: 0,
  kpiCount: 0,
  riskCount: 0,
  uiRendering: false,
  routingMutation: false,
  readOnly: true,
  diagnostics: SIMULATION_RESULT_AGGREGATOR_DIAGNOSTICS,
});
