/**
 * S:2 — Risk Simulation Engine contract.
 *
 * Projects deterministic risk-level scenario deltas from ScenarioSimulationRequest
 * and DS:6 Risk Intelligence. Read-only, no routing or scene mutation.
 */

import type {
  RiskIntelligenceProfile,
  RiskIntelligenceRegistry,
} from "../risk-intelligence/riskIntelligenceContract.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";

export const RISK_SIMULATION_ENGINE_DIAGNOSTIC = "[RISK_SIMULATION_ENGINE]" as const;

export const RISK_SIMULATION_READY_DIAGNOSTIC = "[RISK_SIMULATION_READY]" as const;

export const S2_RISK_SIMULATION_COMPLETE_TAG = "[S2_RISK_SIMULATION_COMPLETE]" as const;

export const RISK_SIMULATION_ENGINE_VERSION = "1.0.0" as const;

export type RiskSimulationEngineInput = Readonly<{
  request: ScenarioSimulationRequest;
  riskIntelligence?: RiskIntelligenceRegistry;
}>;

export type RiskSimulationImpact = Readonly<{
  riskId: string;
  subjectId: string;
  label: string;
  primaryCategory: RiskIntelligenceProfile["primaryCategory"];
  baselineSeverity: number;
  baselineExposure: number;
  baselineMomentum: RiskIntelligenceProfile["momentum"];
  riskDelta: number;
  severityDelta: number;
  exposureDelta: number;
  riskConfidence: number;
  deterministicScenarioDelta: true;
  readOnly: true;
  riskMutation: false;
}>;

export type RiskSimulationResult = Readonly<{
  version: typeof RISK_SIMULATION_ENGINE_VERSION;
  request: ScenarioSimulationRequest;
  riskImpacts: readonly RiskSimulationImpact[];
  riskCount: number;
  averageRiskDelta: number;
  averageSeverityDelta: number;
  averageExposureDelta: number;
  averageRiskConfidence: number;
  deterministicScenarioDelta: true;
  readOnly: true;
  riskMutation: false;
  sceneMutation: false;
  dsMutation: false;
  routingMutation: false;
  diagnostics: readonly [
    typeof RISK_SIMULATION_ENGINE_DIAGNOSTIC,
    typeof RISK_SIMULATION_READY_DIAGNOSTIC,
  ];
}>;

export const RISK_SIMULATION_ENGINE_DIAGNOSTICS = Object.freeze([
  RISK_SIMULATION_ENGINE_DIAGNOSTIC,
  RISK_SIMULATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_RISK_SIMULATION_RESULT: RiskSimulationResult = Object.freeze({
  version: RISK_SIMULATION_ENGINE_VERSION,
  request: Object.freeze({
    draftId: "",
    sceneMutation: false,
    dsMutation: false,
    routingMutation: false,
  }),
  riskImpacts: Object.freeze([]),
  riskCount: 0,
  averageRiskDelta: 0,
  averageSeverityDelta: 0,
  averageExposureDelta: 0,
  averageRiskConfidence: 0,
  deterministicScenarioDelta: true,
  readOnly: true,
  riskMutation: false,
  sceneMutation: false,
  dsMutation: false,
  routingMutation: false,
  diagnostics: RISK_SIMULATION_ENGINE_DIAGNOSTICS,
});
