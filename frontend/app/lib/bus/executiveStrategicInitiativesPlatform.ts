export type {
  ExecutiveStrategicInitiative as ExecutiveStrategicInitiativeContract,
  ExecutiveStrategicInitiativeDependency,
  ExecutiveStrategicInitiativeDeliverable,
  ExecutiveStrategicInitiativeExtensionPolicy,
  ExecutiveStrategicInitiativeIdentity,
  ExecutiveStrategicInitiativeManifest,
  ExecutiveStrategicInitiativeMilestone,
  ExecutiveStrategicInitiativeName,
  ExecutiveStrategicInitiativePlatformDependency,
  ExecutiveStrategicInitiativePurpose,
  ExecutiveStrategicInitiativeRegistry,
  ExecutiveStrategicInitiativeRelationship,
  ExecutiveStrategicInitiativeRelationshipType,
  ExecutiveStrategicInitiativeScope,
  ExecutiveStrategicInitiativeSuccessCriteria,
  ExecutiveStrategicInitiativeValidation,
  ExecutiveStrategicInitiativesPlatform as ExecutiveStrategicInitiativesPlatformContract,
} from "./executiveStrategicInitiativeTypes.ts";

export { getExecutiveStrategicInitiativesManifest } from "./executiveStrategicInitiativeManifest.ts";
export {
  EXECUTIVE_STRATEGIC_INITIATIVE_DEPENDENCIES,
  EXECUTIVE_STRATEGIC_INITIATIVE_EXTENSION_POLICY,
  EXECUTIVE_STRATEGIC_INITIATIVE_MILESTONES,
  EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY,
  EXECUTIVE_STRATEGIC_INITIATIVE_RELATIONSHIPS,
  EXECUTIVE_STRATEGIC_INITIATIVES,
  listExecutiveStrategicInitiatives,
  listExecutiveStrategicInitiativesPublicApis,
} from "./executiveStrategicInitiativeRegistry.ts";

import { getExecutiveStrategicInitiativesManifest } from "./executiveStrategicInitiativeManifest.ts";
import {
  EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY,
  listExecutiveStrategicInitiatives,
  listExecutiveStrategicInitiativesPublicApis,
} from "./executiveStrategicInitiativeRegistry.ts";
import type {
  ExecutiveStrategicInitiativesPlatform as ExecutiveStrategicInitiativesPlatformType,
  ExecutiveStrategicInitiativeValidation as ExecutiveStrategicInitiativeValidationType,
} from "./executiveStrategicInitiativeTypes.ts";

function buildBuilderValidation(): ExecutiveStrategicInitiativeValidationType {
  const registry = EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY;
  const valid =
    registry.platformId === "BUS-21" &&
    registry.initiatives.length > 0 &&
    registry.milestones.length > 0 &&
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

function validateExecutiveStrategicInitiativeFacade(): ExecutiveStrategicInitiativeValidationType {
  return buildBuilderValidation();
}

export function buildExecutiveStrategicInitiative(): ExecutiveStrategicInitiativesPlatformType {
  const manifest = getExecutiveStrategicInitiativesManifest();
  return Object.freeze({
    registry: EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY,
    manifest,
    validation: buildBuilderValidation(),
  });
}

export const ExecutiveStrategicInitiativesPlatform = Object.freeze({
  buildExecutiveStrategicInitiative,
  validateExecutiveStrategicInitiative: validateExecutiveStrategicInitiativeFacade,
  getExecutiveStrategicInitiativesManifest,
  listExecutiveStrategicInitiatives,
  listExecutiveStrategicInitiativesPublicApis,
});
