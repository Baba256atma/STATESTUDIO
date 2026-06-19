/**
 * S:2 — Relationship Simulation Engine contract.
 *
 * Projects read-only relationship-level deltas from ScenarioSimulationRequest
 * and DS:4 Relationship Intelligence. No topology, scene, object, DS, or
 * routing mutation authority.
 */

import type {
  RelationshipIntelligenceProfile,
  RelationshipIntelligenceRegistry,
} from "../relationship-intelligence/relationshipIntelligenceContract.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";

export const RELATIONSHIP_SIMULATION_ENGINE_DIAGNOSTIC = "[RELATIONSHIP_SIMULATION_ENGINE]" as const;

export const RELATIONSHIP_SIMULATION_READY_DIAGNOSTIC = "[RELATIONSHIP_SIMULATION_READY]" as const;

export const S2_RELATIONSHIP_SIMULATION_COMPLETE_TAG = "[S2_RELATIONSHIP_SIMULATION_COMPLETE]" as const;

export const RELATIONSHIP_SIMULATION_ENGINE_VERSION = "1.0.0" as const;

export type RelationshipSimulationEngineInput = Readonly<{
  request: ScenarioSimulationRequest;
  relationshipIntelligence?: RelationshipIntelligenceRegistry;
}>;

export type RelationshipSimulationImpact = Readonly<{
  relationshipId: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  baselineDependency: number;
  baselineInfluence: number;
  baselineRiskExposure: number;
  dependencyDelta: number;
  influenceDelta: number;
  riskExposureDelta: number;
  relationshipConfidence: number;
  readOnly: true;
  topologyMutation: false;
}>;

export type RelationshipSimulationResult = Readonly<{
  version: typeof RELATIONSHIP_SIMULATION_ENGINE_VERSION;
  request: ScenarioSimulationRequest;
  relationshipImpacts: readonly RelationshipSimulationImpact[];
  relationshipCount: number;
  averageDependencyDelta: number;
  averageInfluenceDelta: number;
  averageRiskExposureDelta: number;
  averageRelationshipConfidence: number;
  readOnly: true;
  topologyMutation: false;
  objectMutation: false;
  sceneMutation: false;
  dsMutation: false;
  routingMutation: false;
  simulationExecuted: true;
  diagnostics: readonly [
    typeof RELATIONSHIP_SIMULATION_ENGINE_DIAGNOSTIC,
    typeof RELATIONSHIP_SIMULATION_READY_DIAGNOSTIC,
  ];
}>;

export const RELATIONSHIP_SIMULATION_ENGINE_DIAGNOSTICS = Object.freeze([
  RELATIONSHIP_SIMULATION_ENGINE_DIAGNOSTIC,
  RELATIONSHIP_SIMULATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_RELATIONSHIP_SIMULATION_RESULT: RelationshipSimulationResult = Object.freeze({
  version: RELATIONSHIP_SIMULATION_ENGINE_VERSION,
  request: Object.freeze({
    draftId: "",
    sceneMutation: false,
    dsMutation: false,
    routingMutation: false,
  }),
  relationshipImpacts: Object.freeze([]),
  relationshipCount: 0,
  averageDependencyDelta: 0,
  averageInfluenceDelta: 0,
  averageRiskExposureDelta: 0,
  averageRelationshipConfidence: 0,
  readOnly: true,
  topologyMutation: false,
  objectMutation: false,
  sceneMutation: false,
  dsMutation: false,
  routingMutation: false,
  simulationExecuted: true,
  diagnostics: RELATIONSHIP_SIMULATION_ENGINE_DIAGNOSTICS,
});
