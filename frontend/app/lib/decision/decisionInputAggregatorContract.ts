/**
 * D:1 — Decision Input Aggregator contract.
 *
 * Read-only profile for intelligence consumed by decision recommendation engines.
 * Aggregates DS intelligence, scenario results, compare results, and war room
 * signals without recalculating source systems or mutating inputs.
 */

import type { KpiIntelligenceProfile, KpiIntelligenceRegistry } from "../kpi-intelligence/kpiIntelligenceContract.ts";
import type { ObjectIntelligenceProfile, ObjectIntelligenceRegistry } from "../object-intelligence/objectIntelligenceContract.ts";
import type {
  RelationshipIntelligenceProfile,
  RelationshipIntelligenceRegistry,
} from "../relationship-intelligence/relationshipIntelligenceContract.ts";
import type { RiskIntelligenceProfile, RiskIntelligenceRegistry } from "../risk-intelligence/riskIntelligenceContract.ts";
import type { ScenarioComparisonResult } from "../scenario-authoring/ScenarioComparisonContract.ts";
import type { ExecutiveSimulationSummary } from "../scenario-authoring/simulationResultAggregatorContract.ts";
import type { WarRoomSignal } from "../warroom/WarRoomContract.ts";

export const DECISION_INPUT_AGGREGATOR_DIAGNOSTIC = "[DECISION_INPUT_AGGREGATOR]" as const;

export const DECISION_INPUT_READY_DIAGNOSTIC = "[DECISION_INPUT_READY]" as const;

export const D1_INPUT_AGGREGATOR_COMPLETE_TAG = "[D1_INPUT_AGGREGATOR_COMPLETE]" as const;

export const DECISION_INPUT_AGGREGATOR_VERSION = "1.0.0" as const;

export type DecisionDsIntelligenceSlice = Readonly<{
  objectProfiles: readonly ObjectIntelligenceProfile[];
  relationshipProfiles: readonly RelationshipIntelligenceProfile[];
  kpiProfiles: readonly KpiIntelligenceProfile[];
  riskProfiles: readonly RiskIntelligenceProfile[];
  objectCount: number;
  relationshipCount: number;
  kpiCount: number;
  riskCount: number;
  dsProfileCount: number;
  readOnly: true;
  recalculation: false;
}>;

export type DecisionScenarioResultsSlice = Readonly<{
  scenarioResults: readonly ExecutiveSimulationSummary[];
  scenarioResultCount: number;
  averageScenarioConfidence: number;
  readOnly: true;
  recalculation: false;
}>;

export type DecisionCompareResultsSlice = Readonly<{
  compareResults: readonly ScenarioComparisonResult[];
  compareResultCount: number;
  differenceCount: number;
  readOnly: true;
  recalculation: false;
}>;

export type DecisionWarRoomSignalsSlice = Readonly<{
  signals: readonly WarRoomSignal[];
  signalCount: number;
  criticalSignalCount: number;
  readOnly: true;
  recalculation: false;
}>;

export type DecisionInputProfile = Readonly<{
  version: typeof DECISION_INPUT_AGGREGATOR_VERSION;
  profileId: string;
  generatedAt: string;
  dsIntelligence: DecisionDsIntelligenceSlice;
  scenarioResults: DecisionScenarioResultsSlice;
  compareResults: DecisionCompareResultsSlice;
  warRoomSignals: DecisionWarRoomSignalsSlice;
  totalInputCount: number;
  readinessScore: number;
  readOnly: true;
  recalculation: false;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [
    typeof DECISION_INPUT_AGGREGATOR_DIAGNOSTIC,
    typeof DECISION_INPUT_READY_DIAGNOSTIC,
  ];
}>;

export type DecisionInputAggregatorInput = Readonly<{
  profileId: string;
  generatedAt: string;
  objectIntelligence?: ObjectIntelligenceRegistry;
  relationshipIntelligence?: RelationshipIntelligenceRegistry;
  kpiIntelligence?: KpiIntelligenceRegistry;
  riskIntelligence?: RiskIntelligenceRegistry;
  scenarioResults?: readonly ExecutiveSimulationSummary[];
  compareResults?: readonly ScenarioComparisonResult[];
  warRoomSignals?: readonly WarRoomSignal[];
}>;

export const DECISION_INPUT_AGGREGATOR_DIAGNOSTICS = Object.freeze([
  DECISION_INPUT_AGGREGATOR_DIAGNOSTIC,
  DECISION_INPUT_READY_DIAGNOSTIC,
] as const);

export const EMPTY_DECISION_INPUT_PROFILE: DecisionInputProfile = Object.freeze({
  version: DECISION_INPUT_AGGREGATOR_VERSION,
  profileId: "",
  generatedAt: "",
  dsIntelligence: Object.freeze({
    objectProfiles: Object.freeze([]),
    relationshipProfiles: Object.freeze([]),
    kpiProfiles: Object.freeze([]),
    riskProfiles: Object.freeze([]),
    objectCount: 0,
    relationshipCount: 0,
    kpiCount: 0,
    riskCount: 0,
    dsProfileCount: 0,
    readOnly: true,
    recalculation: false,
  }),
  scenarioResults: Object.freeze({
    scenarioResults: Object.freeze([]),
    scenarioResultCount: 0,
    averageScenarioConfidence: 0,
    readOnly: true,
    recalculation: false,
  }),
  compareResults: Object.freeze({
    compareResults: Object.freeze([]),
    compareResultCount: 0,
    differenceCount: 0,
    readOnly: true,
    recalculation: false,
  }),
  warRoomSignals: Object.freeze({
    signals: Object.freeze([]),
    signalCount: 0,
    criticalSignalCount: 0,
    readOnly: true,
    recalculation: false,
  }),
  totalInputCount: 0,
  readinessScore: 0,
  readOnly: true,
  recalculation: false,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  simulationMutation: false,
  diagnostics: DECISION_INPUT_AGGREGATOR_DIAGNOSTICS,
});
