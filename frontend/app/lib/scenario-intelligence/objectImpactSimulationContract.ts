/**
 * DS:7:3 — Object Impact Simulation Engine contract.
 *
 * Read-only object-level impact estimation from Object Intelligence and
 * scenario blueprint proposals. No scene mutation or execution authority.
 */

import type { ObjectHealthState } from "../object-intelligence/objectHealthContract.ts";
import type { ObjectImportanceLevel } from "../object-intelligence/objectImportanceContract.ts";
import type { ObjectTrendDirection } from "../object-intelligence/objectTrendContract.ts";
import type { ScenarioBlueprintRegistry } from "./scenarioBuilderContract.ts";
import type { ScenarioType } from "./scenarioGenerationContract.ts";

export const OBJECT_IMPACT_SIMULATION_DIAGNOSTIC = "[OBJECT_IMPACT_SIMULATION]" as const;

export const OBJECT_IMPACT_READY_DIAGNOSTIC = "[OBJECT_IMPACT_READY]" as const;

export const OBJECT_IMPACT_SIMULATION_ENGINE_VERSION = "7.3.0" as const;

export type ObjectImpactChangeDirection = "up" | "down" | "neutral";

export type ObjectHealthImpactChange = Readonly<{
  baselineScore: number;
  projectedScore: number;
  delta: number;
  direction: ObjectImpactChangeDirection;
  baselineState: ObjectHealthState;
  projectedState: ObjectHealthState;
}>;

export type ObjectTrendImpactChange = Readonly<{
  baselineDirection: ObjectTrendDirection;
  projectedDirection: ObjectTrendDirection;
  baselineStrength: number;
  projectedStrength: number;
  delta: number;
  direction: ObjectImpactChangeDirection;
}>;

export type ObjectImportanceImpactChange = Readonly<{
  baselineScore: number;
  projectedScore: number;
  baselineLevel: ObjectImportanceLevel;
  projectedLevel: ObjectImportanceLevel;
  delta: number;
  direction: ObjectImpactChangeDirection;
}>;

export type ObjectImpactResult = Readonly<{
  objectId: string;
  scenarioId: string;
  label: string;
  healthChange: ObjectHealthImpactChange;
  trendChange: ObjectTrendImpactChange;
  importanceChange: ObjectImportanceImpactChange;
  compositeImpactScore: number;
  simulationReady: true;
  applied: false;
}>;

export type ObjectImpactProfile = Readonly<{
  profileId: string;
  scenarioId: string;
  scenarioType: ScenarioType;
  objectId: string;
  label: string;
  impactResult: ObjectImpactResult;
  readOnly: true;
}>;

export type ObjectImpactProfileRegistry = Readonly<{
  version: typeof OBJECT_IMPACT_SIMULATION_ENGINE_VERSION;
  profiles: readonly ObjectImpactProfile[];
  profileById: Readonly<Record<string, ObjectImpactProfile>>;
  profilesByObjectId: Readonly<Record<string, readonly ObjectImpactProfile[]>>;
  profilesByScenarioId: Readonly<Record<string, readonly ObjectImpactProfile[]>>;
  profileCount: number;
  objectCount: number;
  scenarioCount: number;
  readOnly: true;
  sceneMutation: false;
  simulationActive: false;
  diagnostics: readonly [
    typeof OBJECT_IMPACT_SIMULATION_DIAGNOSTIC,
    typeof OBJECT_IMPACT_READY_DIAGNOSTIC,
  ];
}>;

export type ObjectImpactSimulationBuildInput = Readonly<{
  sceneJson?: unknown;
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  historicalSnapshots?: readonly import("../object-intelligence/objectTrendContract.ts").ObjectTrendSnapshot[];
  sourceUpdates?: readonly import("../object-intelligence/objectTrendContract.ts").ObjectTrendSourceUpdate[];
  objectHealthHistory?: readonly import("../object-intelligence/objectTrendContract.ts").ObjectHealthHistoryPoint[];
  blueprintRegistry?: ScenarioBlueprintRegistry;
  scenarioIds?: readonly string[];
}>;

export const OBJECT_IMPACT_SIMULATION_DIAGNOSTICS = Object.freeze([
  OBJECT_IMPACT_SIMULATION_DIAGNOSTIC,
  OBJECT_IMPACT_READY_DIAGNOSTIC,
] as const);

export const EMPTY_OBJECT_IMPACT_PROFILE_REGISTRY: ObjectImpactProfileRegistry = Object.freeze({
  version: OBJECT_IMPACT_SIMULATION_ENGINE_VERSION,
  profiles: Object.freeze([]),
  profileById: Object.freeze({}),
  profilesByObjectId: Object.freeze({}),
  profilesByScenarioId: Object.freeze({}),
  profileCount: 0,
  objectCount: 0,
  scenarioCount: 0,
  readOnly: true,
  sceneMutation: false,
  simulationActive: false,
  diagnostics: OBJECT_IMPACT_SIMULATION_DIAGNOSTICS,
});
