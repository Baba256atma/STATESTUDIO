/**
 * DS:7:4 — Relationship Impact Simulation Engine contract.
 *
 * Read-only relationship-level impact estimation from Relationship
 * Intelligence and scenario blueprint proposals.
 */

import type { DependencyLevel } from "../relationship-intelligence/dependencyIntelligenceContract.ts";
import type {
  RelationshipInfluenceDirection,
  RelationshipInfluenceLevel,
} from "../relationship-intelligence/relationshipInfluenceContract.ts";
import type {
  RelationshipRiskExposureLevel,
  RelationshipRiskType,
} from "../relationship-intelligence/relationshipRiskExposureContract.ts";
import type { ScenarioBlueprintRegistry } from "./scenarioBuilderContract.ts";
import type { ScenarioType } from "./scenarioGenerationContract.ts";

export const RELATIONSHIP_IMPACT_SIMULATION_DIAGNOSTIC =
  "[RELATIONSHIP_IMPACT_SIMULATION]" as const;

export const RELATIONSHIP_IMPACT_READY_DIAGNOSTIC = "[RELATIONSHIP_IMPACT_READY]" as const;

export const RELATIONSHIP_IMPACT_SIMULATION_ENGINE_VERSION = "7.4.0" as const;

export type RelationshipImpactChangeDirection = "up" | "down" | "neutral";

export type RelationshipDependencyImpactChange = Readonly<{
  baselineScore: number;
  projectedScore: number;
  baselineLevel: DependencyLevel;
  projectedLevel: DependencyLevel;
  baselineSinglePointOfFailure: boolean;
  projectedSinglePointOfFailure: boolean;
  delta: number;
  direction: RelationshipImpactChangeDirection;
}>;

export type RelationshipInfluenceImpactChange = Readonly<{
  baselineScore: number;
  projectedScore: number;
  baselineLevel: RelationshipInfluenceLevel;
  projectedLevel: RelationshipInfluenceLevel;
  baselineDirection: RelationshipInfluenceDirection;
  projectedDirection: RelationshipInfluenceDirection;
  delta: number;
  direction: RelationshipImpactChangeDirection;
}>;

export type RelationshipRiskExposureImpactChange = Readonly<{
  baselineScore: number;
  projectedScore: number;
  baselineLevel: RelationshipRiskExposureLevel;
  projectedLevel: RelationshipRiskExposureLevel;
  baselineRiskTypes: readonly RelationshipRiskType[];
  projectedRiskTypes: readonly RelationshipRiskType[];
  delta: number;
  direction: RelationshipImpactChangeDirection;
}>;

export type RelationshipImpactResult = Readonly<{
  relationshipId: string;
  scenarioId: string;
  sourceId: string;
  targetId: string;
  label: string;
  dependencyChange: RelationshipDependencyImpactChange;
  influenceChange: RelationshipInfluenceImpactChange;
  riskExposureChange: RelationshipRiskExposureImpactChange;
  compositeImpactScore: number;
  simulationReady: true;
  applied: false;
}>;

export type RelationshipImpactProfile = Readonly<{
  profileId: string;
  scenarioId: string;
  scenarioType: ScenarioType;
  relationshipId: string;
  sourceId: string;
  targetId: string;
  label: string;
  impactResult: RelationshipImpactResult;
  readOnly: true;
}>;

export type RelationshipImpactProfileRegistry = Readonly<{
  version: typeof RELATIONSHIP_IMPACT_SIMULATION_ENGINE_VERSION;
  profiles: readonly RelationshipImpactProfile[];
  profileById: Readonly<Record<string, RelationshipImpactProfile>>;
  profilesByRelationshipId: Readonly<Record<string, readonly RelationshipImpactProfile[]>>;
  profilesByScenarioId: Readonly<Record<string, readonly RelationshipImpactProfile[]>>;
  profileCount: number;
  relationshipCount: number;
  scenarioCount: number;
  readOnly: true;
  sceneMutation: false;
  simulationActive: false;
  diagnostics: readonly [
    typeof RELATIONSHIP_IMPACT_SIMULATION_DIAGNOSTIC,
    typeof RELATIONSHIP_IMPACT_READY_DIAGNOSTIC,
  ];
}>;

export type RelationshipImpactSimulationBuildInput = Readonly<{
  sceneJson?: unknown;
  relationships?: readonly unknown[];
  objects?: readonly unknown[];
  blueprintRegistry?: ScenarioBlueprintRegistry;
  scenarioIds?: readonly string[];
}>;

export const RELATIONSHIP_IMPACT_SIMULATION_DIAGNOSTICS = Object.freeze([
  RELATIONSHIP_IMPACT_SIMULATION_DIAGNOSTIC,
  RELATIONSHIP_IMPACT_READY_DIAGNOSTIC,
] as const);

export const EMPTY_RELATIONSHIP_IMPACT_PROFILE_REGISTRY: RelationshipImpactProfileRegistry =
  Object.freeze({
    version: RELATIONSHIP_IMPACT_SIMULATION_ENGINE_VERSION,
    profiles: Object.freeze([]),
    profileById: Object.freeze({}),
    profilesByRelationshipId: Object.freeze({}),
    profilesByScenarioId: Object.freeze({}),
    profileCount: 0,
    relationshipCount: 0,
    scenarioCount: 0,
    readOnly: true,
    sceneMutation: false,
    simulationActive: false,
    diagnostics: RELATIONSHIP_IMPACT_SIMULATION_DIAGNOSTICS,
  });
