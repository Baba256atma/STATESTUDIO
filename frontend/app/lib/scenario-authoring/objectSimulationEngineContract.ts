/**
 * S:2 — Object Simulation Engine contract.
 *
 * Projects read-only object-level simulation deltas from ScenarioSimulationRequest
 * and DS:3 Object Intelligence profiles. No object, scene, DS, or routing
 * mutation authority.
 */

import type { ObjectIntelligenceProfile, ObjectIntelligenceRegistry } from "../object-intelligence/objectIntelligenceContract.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";

export const OBJECT_SIMULATION_ENGINE_DIAGNOSTIC = "[OBJECT_SIMULATION_ENGINE]" as const;

export const OBJECT_SIMULATION_READY_DIAGNOSTIC = "[OBJECT_SIMULATION_READY]" as const;

export const S2_OBJECT_SIMULATION_COMPLETE_TAG = "[S2_OBJECT_SIMULATION_COMPLETE]" as const;

export const OBJECT_SIMULATION_ENGINE_VERSION = "1.0.0" as const;

export type ObjectSimulationEngineInput = Readonly<{
  request: ScenarioSimulationRequest;
  objectIntelligence?: ObjectIntelligenceRegistry;
}>;

export type ObjectSimulationImpact = Readonly<{
  objectId: string;
  label: string;
  objectType: string;
  source: ObjectIntelligenceProfile["source"];
  baselineHealth: number;
  baselineImpact: number;
  baselineTrend: ObjectIntelligenceProfile["trend"];
  objectHealthDelta: number;
  objectImpactDelta: number;
  objectTrendDelta: number;
  objectConfidence: number;
  readOnly: true;
  objectMutation: false;
}>;

export type ObjectSimulationResult = Readonly<{
  version: typeof OBJECT_SIMULATION_ENGINE_VERSION;
  request: ScenarioSimulationRequest;
  objectImpacts: readonly ObjectSimulationImpact[];
  objectCount: number;
  averageObjectHealthDelta: number;
  averageObjectImpactDelta: number;
  averageObjectTrendDelta: number;
  averageObjectConfidence: number;
  readOnly: true;
  objectMutation: false;
  sceneMutation: false;
  dsMutation: false;
  routingMutation: false;
  simulationExecuted: true;
  diagnostics: readonly [
    typeof OBJECT_SIMULATION_ENGINE_DIAGNOSTIC,
    typeof OBJECT_SIMULATION_READY_DIAGNOSTIC,
  ];
}>;

export const OBJECT_SIMULATION_ENGINE_DIAGNOSTICS = Object.freeze([
  OBJECT_SIMULATION_ENGINE_DIAGNOSTIC,
  OBJECT_SIMULATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_OBJECT_SIMULATION_RESULT: ObjectSimulationResult = Object.freeze({
  version: OBJECT_SIMULATION_ENGINE_VERSION,
  request: Object.freeze({
    draftId: "",
    sceneMutation: false,
    dsMutation: false,
    routingMutation: false,
  }),
  objectImpacts: Object.freeze([]),
  objectCount: 0,
  averageObjectHealthDelta: 0,
  averageObjectImpactDelta: 0,
  averageObjectTrendDelta: 0,
  averageObjectConfidence: 0,
  readOnly: true,
  objectMutation: false,
  sceneMutation: false,
  dsMutation: false,
  routingMutation: false,
  simulationExecuted: true,
  diagnostics: OBJECT_SIMULATION_ENGINE_DIAGNOSTICS,
});
