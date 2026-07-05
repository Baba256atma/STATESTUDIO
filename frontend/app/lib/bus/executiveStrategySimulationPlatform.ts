export type {
  ExecutiveStrategySimulation as ExecutiveStrategySimulationContract,
  ExecutiveStrategySimulationAssumption,
  ExecutiveStrategySimulationCategory,
  ExecutiveStrategySimulationConstraint,
  ExecutiveStrategySimulationDependency,
  ExecutiveStrategySimulationEvidence,
  ExecutiveStrategySimulationExtensionPolicy,
  ExecutiveStrategySimulationIdentity,
  ExecutiveStrategySimulationManifest,
  ExecutiveStrategySimulationName,
  ExecutiveStrategySimulationOutcomeDefinition,
  ExecutiveStrategySimulationPlatform as ExecutiveStrategySimulationPlatformContract,
  ExecutiveStrategySimulationPlatformDependency,
  ExecutiveStrategySimulationProfile,
  ExecutiveStrategySimulationPurpose,
  ExecutiveStrategySimulationRegistry,
  ExecutiveStrategySimulationRelationship,
  ExecutiveStrategySimulationRelationshipType,
  ExecutiveStrategySimulationScenarioDefinition,
  ExecutiveStrategySimulationScope,
  ExecutiveStrategySimulationStatus,
  ExecutiveStrategySimulationValidation,
} from "./executiveStrategySimulationTypes.ts";

export { getExecutiveStrategySimulationManifest } from "./executiveStrategySimulationManifest.ts";
export {
  EXECUTIVE_STRATEGY_SIMULATION_ASSUMPTION_REGISTRY,
  EXECUTIVE_STRATEGY_SIMULATION_CONSTRAINT_REGISTRY,
  EXECUTIVE_STRATEGY_SIMULATION_DEPENDENCIES,
  EXECUTIVE_STRATEGY_SIMULATION_DEPENDENCY_REGISTRY,
  EXECUTIVE_STRATEGY_SIMULATION_EVIDENCE_REGISTRY,
  EXECUTIVE_STRATEGY_SIMULATION_EXTENSION_POLICY,
  EXECUTIVE_STRATEGY_SIMULATION_OUTCOME_REGISTRY,
  EXECUTIVE_STRATEGY_SIMULATION_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_SIMULATION_REGISTRY,
  EXECUTIVE_STRATEGY_SIMULATION_RELATIONSHIPS,
  EXECUTIVE_STRATEGY_SIMULATION_SCENARIO_REGISTRY,
  EXECUTIVE_STRATEGY_SIMULATIONS,
  listExecutiveStrategySimulationPublicApis,
  listExecutiveStrategySimulations,
} from "./executiveStrategySimulationRegistry.ts";

import { getExecutiveStrategySimulationManifest } from "./executiveStrategySimulationManifest.ts";
import {
  EXECUTIVE_STRATEGY_SIMULATION_REGISTRY,
  listExecutiveStrategySimulationPublicApis,
  listExecutiveStrategySimulations,
} from "./executiveStrategySimulationRegistry.ts";
import type {
  ExecutiveStrategySimulationPlatform as ExecutiveStrategySimulationPlatformType,
  ExecutiveStrategySimulationValidation as ExecutiveStrategySimulationValidationType,
} from "./executiveStrategySimulationTypes.ts";

function buildBuilderValidation(): ExecutiveStrategySimulationValidationType {
  const registry = EXECUTIVE_STRATEGY_SIMULATION_REGISTRY;
  const valid =
    registry.platformId === "BUS-25" &&
    registry.simulations.length > 0 &&
    registry.scenarios.length > 0 &&
    registry.outcomes.length > 0 &&
    registry.assumptions.length > 0 &&
    registry.constraints.length > 0 &&
    registry.relationships.length > 0 &&
    registry.publicApis.length > 0 &&
    registry.metadataOnly &&
    registry.immutable;
  return Object.freeze({
    valid,
    errors: Object.freeze(valid ? [] : ["builder-registry-validation-failed"]),
    warnings: Object.freeze([]),
  });
}

function validateExecutiveStrategySimulationFacade(): ExecutiveStrategySimulationValidationType {
  return buildBuilderValidation();
}

export function buildExecutiveStrategySimulation(): ExecutiveStrategySimulationPlatformType {
  const manifest = getExecutiveStrategySimulationManifest();
  return Object.freeze({
    registry: EXECUTIVE_STRATEGY_SIMULATION_REGISTRY,
    manifest,
    validation: buildBuilderValidation(),
  });
}

export const ExecutiveStrategySimulationPlatform = Object.freeze({
  buildExecutiveStrategySimulation,
  validateExecutiveStrategySimulation: validateExecutiveStrategySimulationFacade,
  getExecutiveStrategySimulationManifest,
  listExecutiveStrategySimulations,
  listExecutiveStrategySimulationPublicApis,
});
