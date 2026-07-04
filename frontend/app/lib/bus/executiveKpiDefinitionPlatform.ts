export type {
  ExecutiveKpiCategory,
  ExecutiveKpiCategoryDeclaration,
  ExecutiveKpiConfidenceRequirement,
  ExecutiveKpiDefinition,
  ExecutiveKpiDefinitionManifest,
  ExecutiveKpiDefinitionPlatform as ExecutiveKpiDefinitionPlatformContract,
  ExecutiveKpiDefinitionRegistry,
  ExecutiveKpiDefinitionValidation,
  ExecutiveKpiDirection,
  ExecutiveKpiGovernanceMetadata,
  ExecutiveKpiLifecycleState,
  ExecutiveKpiOwnerMetadata,
  ExecutiveKpiSourceRequirement,
  ExecutiveKpiUnitType,
} from "./executiveKpiDefinitionTypes.ts";

export { getExecutiveKpiDefinitionManifest } from "./executiveKpiDefinitionManifest.ts";
export {
  EXECUTIVE_KPI_CATEGORIES,
  EXECUTIVE_KPI_DEFINITIONS,
  EXECUTIVE_KPI_DEFINITION_PUBLIC_APIS,
  EXECUTIVE_KPI_DEFINITION_REGISTRY,
  EXECUTIVE_KPI_DIRECTIONS,
  EXECUTIVE_KPI_LIFECYCLE_STATES,
  listExecutiveKpiCategories,
  listExecutiveKpiDirections,
  listExecutiveKpiLifecycleStates,
  listExecutiveKpiDefinitions,
} from "./executiveKpiDefinitionRegistry.ts";
export { validateExecutiveKpiDefinitions } from "./executiveKpiDefinitionValidation.ts";

import { getExecutiveKpiDefinitionManifest } from "./executiveKpiDefinitionManifest.ts";
import {
  EXECUTIVE_KPI_DEFINITION_REGISTRY,
  listExecutiveKpiCategories,
  listExecutiveKpiDefinitions,
  listExecutiveKpiDirections,
  listExecutiveKpiLifecycleStates,
} from "./executiveKpiDefinitionRegistry.ts";
import { validateExecutiveKpiDefinitions } from "./executiveKpiDefinitionValidation.ts";
import type { ExecutiveKpiDefinitionPlatform as ExecutiveKpiDefinitionPlatformType } from "./executiveKpiDefinitionTypes.ts";

export function getExecutiveKpiDefinitionPlatform(): ExecutiveKpiDefinitionPlatformType {
  const manifest = getExecutiveKpiDefinitionManifest();
  return Object.freeze({
    registry: EXECUTIVE_KPI_DEFINITION_REGISTRY,
    manifest,
    validation: validateExecutiveKpiDefinitions(EXECUTIVE_KPI_DEFINITION_REGISTRY, manifest),
  });
}

export const ExecutiveKpiDefinitionPlatform = Object.freeze({
  getExecutiveKpiDefinitionPlatform,
  getExecutiveKpiDefinitionManifest,
  validateExecutiveKpiDefinitions,
  listExecutiveKpiDefinitions,
  listExecutiveKpiCategories,
  listExecutiveKpiLifecycleStates,
  listExecutiveKpiDirections,
});
