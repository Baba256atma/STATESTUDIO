export type {
  ExecutiveKpiCompatibilityEntry,
  ExecutiveKpiCompatibilityStatus,
  ExecutiveKpiConsumerEntry,
  ExecutiveKpiIntegrationCategory,
  ExecutiveKpiIntegrationDependency,
  ExecutiveKpiIntegrationLifecycleState,
  ExecutiveKpiIntegrationManifest,
  ExecutiveKpiIntegrationMetadata,
  ExecutiveKpiIntegrationPhase,
  ExecutiveKpiIntegrationPlatform as ExecutiveKpiIntegrationPlatformContract,
  ExecutiveKpiIntegrationRegistry,
  ExecutiveKpiIntegrationValidation,
} from "./executiveKpiIntegrationTypes.ts";

export { EXECUTIVE_KPI_COMPATIBILITY_MATRIX, listExecutiveKpiCompatibilityMatrix } from "./executiveKpiIntegrationCompatibility.ts";
export { getExecutiveKpiIntegrationManifest } from "./executiveKpiIntegrationManifest.ts";
export {
  EXECUTIVE_KPI_CONSUMER_REGISTRY,
  EXECUTIVE_KPI_INTEGRATION_CATEGORIES,
  EXECUTIVE_KPI_INTEGRATION_DEPENDENCIES,
  EXECUTIVE_KPI_INTEGRATION_LIFECYCLE_STATES,
  EXECUTIVE_KPI_INTEGRATION_PHASES,
  EXECUTIVE_KPI_INTEGRATION_PUBLIC_APIS,
  EXECUTIVE_KPI_INTEGRATION_REGISTRY,
  listExecutiveKpiConsumerRegistry,
  listExecutiveKpiIntegrationDependencies,
  listExecutiveKpiIntegrationLifecycleStates,
  listExecutiveKpiIntegrationPhases,
} from "./executiveKpiIntegrationRegistry.ts";
export { validateExecutiveKpiIntegration } from "./executiveKpiIntegrationValidation.ts";

import { EXECUTIVE_KPI_COMPATIBILITY_MATRIX, listExecutiveKpiCompatibilityMatrix } from "./executiveKpiIntegrationCompatibility.ts";
import { getExecutiveKpiIntegrationManifest } from "./executiveKpiIntegrationManifest.ts";
import {
  EXECUTIVE_KPI_INTEGRATION_REGISTRY,
  listExecutiveKpiConsumerRegistry,
  listExecutiveKpiIntegrationDependencies,
  listExecutiveKpiIntegrationLifecycleStates,
  listExecutiveKpiIntegrationPhases,
} from "./executiveKpiIntegrationRegistry.ts";
import type { ExecutiveKpiIntegrationPlatform as ExecutiveKpiIntegrationPlatformType } from "./executiveKpiIntegrationTypes.ts";
import { validateExecutiveKpiIntegration } from "./executiveKpiIntegrationValidation.ts";

export function getExecutiveKpiIntegrationPlatform(): ExecutiveKpiIntegrationPlatformType {
  const manifest = getExecutiveKpiIntegrationManifest();
  return Object.freeze({
    registry: EXECUTIVE_KPI_INTEGRATION_REGISTRY,
    compatibilityMatrix: EXECUTIVE_KPI_COMPATIBILITY_MATRIX,
    manifest,
    validation: validateExecutiveKpiIntegration(EXECUTIVE_KPI_INTEGRATION_REGISTRY, manifest),
  });
}

export const ExecutiveKpiIntegrationPlatform = Object.freeze({
  getExecutiveKpiIntegrationPlatform,
  getExecutiveKpiIntegrationManifest,
  validateExecutiveKpiIntegration,
  listExecutiveKpiIntegrationPhases,
  listExecutiveKpiIntegrationDependencies,
  listExecutiveKpiCompatibilityMatrix,
  listExecutiveKpiConsumerRegistry,
  listExecutiveKpiIntegrationLifecycleStates,
});
