export type {
  ExecutiveStrategicObjective as ExecutiveStrategicObjectiveContract,
  ExecutiveStrategicObjectiveDependency,
  ExecutiveStrategicObjectiveExtensionPolicy,
  ExecutiveStrategicObjectiveIdentity,
  ExecutiveStrategicObjectiveManifest,
  ExecutiveStrategicObjectiveName,
  ExecutiveStrategicObjectivePlatformDependency,
  ExecutiveStrategicObjectivePurpose,
  ExecutiveStrategicObjectiveRelationship,
  ExecutiveStrategicObjectiveRelationshipType,
  ExecutiveStrategicObjectiveRegistry,
  ExecutiveStrategicObjectiveScope,
  ExecutiveStrategicObjectiveSuccessCriteria,
  ExecutiveStrategicObjectivesPlatform as ExecutiveStrategicObjectivesPlatformContract,
  ExecutiveStrategicObjectiveValidation,
} from "./executiveStrategicObjectiveTypes.ts";

export { getExecutiveStrategicObjectivesManifest } from "./executiveStrategicObjectiveManifest.ts";
export {
  EXECUTIVE_STRATEGIC_OBJECTIVE_DEPENDENCIES,
  EXECUTIVE_STRATEGIC_OBJECTIVE_EXTENSION_POLICY,
  EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY,
  EXECUTIVE_STRATEGIC_OBJECTIVE_RELATIONSHIPS,
  EXECUTIVE_STRATEGIC_OBJECTIVES,
  listExecutiveStrategicObjectives,
  listExecutiveStrategicObjectivesPublicApis,
} from "./executiveStrategicObjectiveRegistry.ts";

import { getExecutiveStrategicObjectivesManifest } from "./executiveStrategicObjectiveManifest.ts";
import {
  EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY,
  listExecutiveStrategicObjectives,
  listExecutiveStrategicObjectivesPublicApis,
} from "./executiveStrategicObjectiveRegistry.ts";
import type {
  ExecutiveStrategicObjectivesPlatform as ExecutiveStrategicObjectivesPlatformType,
  ExecutiveStrategicObjectiveValidation as ExecutiveStrategicObjectiveValidationType,
} from "./executiveStrategicObjectiveTypes.ts";

function buildBuilderValidation(): ExecutiveStrategicObjectiveValidationType {
  const registry = EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY;
  const valid =
    registry.platformId === "BUS-20" &&
    registry.objectives.length > 0 &&
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

function validateExecutiveStrategicObjectiveFacade(): ExecutiveStrategicObjectiveValidationType {
  return buildBuilderValidation();
}

export function buildExecutiveStrategicObjective(): ExecutiveStrategicObjectivesPlatformType {
  const manifest = getExecutiveStrategicObjectivesManifest();
  return Object.freeze({
    registry: EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY,
    manifest,
    validation: buildBuilderValidation(),
  });
}

export const ExecutiveStrategicObjectivesPlatform = Object.freeze({
  buildExecutiveStrategicObjective,
  validateExecutiveStrategicObjective: validateExecutiveStrategicObjectiveFacade,
  getExecutiveStrategicObjectivesManifest,
  listExecutiveStrategicObjectives,
  listExecutiveStrategicObjectivesPublicApis,
});
