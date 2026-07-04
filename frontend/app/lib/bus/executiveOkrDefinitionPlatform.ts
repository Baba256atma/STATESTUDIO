export type {
  ExecutiveKeyResult,
  ExecutiveKeyResultCategory,
  ExecutiveKeyResultMeasurementMetadata,
  ExecutiveObjective,
  ExecutiveObjectiveCategory,
  ExecutiveObjectiveOwner,
  ExecutiveOkrDefinitionManifest,
  ExecutiveOkrDefinitionPlatform as ExecutiveOkrDefinitionPlatformContract,
  ExecutiveOkrDefinitionRegistry,
  ExecutiveOkrDefinitionValidation,
  ExecutiveOkrLifecycleState,
  ExecutiveOkrMetadata,
  ExecutiveOkrStrategicHorizon,
} from "./executiveOkrDefinitionTypes.ts";

export { getExecutiveOkrDefinitionManifest } from "./executiveOkrDefinitionManifest.ts";
export {
  EXECUTIVE_KEY_RESULTS,
  EXECUTIVE_KEY_RESULT_CATEGORIES,
  EXECUTIVE_OBJECTIVES,
  EXECUTIVE_OBJECTIVE_CATEGORIES,
  EXECUTIVE_OKR_DEFINITION_PUBLIC_APIS,
  EXECUTIVE_OKR_DEFINITION_REGISTRY,
  EXECUTIVE_OKR_KPI_LINKAGE_IDS,
  EXECUTIVE_OKR_LIFECYCLE_STATES,
  EXECUTIVE_OKR_STRATEGIC_HORIZONS,
  listExecutiveKeyResultCategories,
  listExecutiveKeyResults,
  listExecutiveObjectiveCategories,
  listExecutiveObjectives,
  listExecutiveOkrLifecycleStates,
  listExecutiveStrategicHorizons,
} from "./executiveOkrDefinitionRegistry.ts";
export { validateExecutiveOkrDefinitions } from "./executiveOkrDefinitionValidation.ts";

import { getExecutiveOkrDefinitionManifest } from "./executiveOkrDefinitionManifest.ts";
import {
  EXECUTIVE_OKR_DEFINITION_REGISTRY,
  listExecutiveKeyResultCategories,
  listExecutiveKeyResults,
  listExecutiveObjectiveCategories,
  listExecutiveObjectives,
  listExecutiveOkrLifecycleStates,
  listExecutiveStrategicHorizons,
} from "./executiveOkrDefinitionRegistry.ts";
import type { ExecutiveOkrDefinitionPlatform as ExecutiveOkrDefinitionPlatformType } from "./executiveOkrDefinitionTypes.ts";
import { validateExecutiveOkrDefinitions } from "./executiveOkrDefinitionValidation.ts";

export function getExecutiveOkrDefinitionPlatform(): ExecutiveOkrDefinitionPlatformType {
  const manifest = getExecutiveOkrDefinitionManifest();
  return Object.freeze({
    registry: EXECUTIVE_OKR_DEFINITION_REGISTRY,
    manifest,
    validation: validateExecutiveOkrDefinitions(EXECUTIVE_OKR_DEFINITION_REGISTRY, manifest),
  });
}

export const ExecutiveOkrDefinitionPlatform = Object.freeze({
  getExecutiveOkrDefinitionPlatform,
  getExecutiveOkrDefinitionManifest,
  validateExecutiveOkrDefinitions,
  listExecutiveObjectives,
  listExecutiveKeyResults,
  listExecutiveObjectiveCategories,
  listExecutiveKeyResultCategories,
  listExecutiveStrategicHorizons,
  listExecutiveOkrLifecycleStates,
});
