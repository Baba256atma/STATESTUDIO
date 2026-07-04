export type {
  ExecutiveBusinessImpactCategory,
  ExecutiveBusinessImpactConfidenceLevel,
  ExecutiveBusinessImpactDimension,
  ExecutiveBusinessImpactHorizon,
  ExecutiveBusinessImpactLifecycleState,
  ExecutiveKpiBusinessImpact,
  ExecutiveKpiBusinessImpactManifest,
  ExecutiveKpiBusinessImpactMetadata,
  ExecutiveKpiBusinessImpactPlatform as ExecutiveKpiBusinessImpactPlatformContract,
  ExecutiveKpiBusinessImpactRegistry,
  ExecutiveKpiBusinessImpactValidation,
} from "./executiveKpiBusinessImpactTypes.ts";

export { getExecutiveKpiBusinessImpactManifest } from "./executiveKpiBusinessImpactManifest.ts";
export {
  EXECUTIVE_BUSINESS_IMPACT_CATEGORIES,
  EXECUTIVE_BUSINESS_IMPACT_CONFIDENCE_LEVELS,
  EXECUTIVE_BUSINESS_IMPACT_DIMENSIONS,
  EXECUTIVE_BUSINESS_IMPACT_HORIZONS,
  EXECUTIVE_BUSINESS_IMPACT_LIFECYCLE_STATES,
  EXECUTIVE_KPI_BUSINESS_IMPACTS,
  EXECUTIVE_KPI_BUSINESS_IMPACT_PUBLIC_APIS,
  EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY,
  listExecutiveBusinessImpactCategories,
  listExecutiveBusinessImpactConfidenceLevels,
  listExecutiveBusinessImpactDimensions,
  listExecutiveBusinessImpactHorizons,
  listExecutiveBusinessImpactLifecycleStates,
  listExecutiveKpiBusinessImpacts,
} from "./executiveKpiBusinessImpactRegistry.ts";
export { validateExecutiveKpiBusinessImpacts } from "./executiveKpiBusinessImpactValidation.ts";

import { getExecutiveKpiBusinessImpactManifest } from "./executiveKpiBusinessImpactManifest.ts";
import {
  EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY,
  listExecutiveBusinessImpactCategories,
  listExecutiveBusinessImpactConfidenceLevels,
  listExecutiveBusinessImpactDimensions,
  listExecutiveBusinessImpactHorizons,
  listExecutiveBusinessImpactLifecycleStates,
  listExecutiveKpiBusinessImpacts,
} from "./executiveKpiBusinessImpactRegistry.ts";
import { validateExecutiveKpiBusinessImpacts } from "./executiveKpiBusinessImpactValidation.ts";
import type { ExecutiveKpiBusinessImpactPlatform as ExecutiveKpiBusinessImpactPlatformType } from "./executiveKpiBusinessImpactTypes.ts";

export function getExecutiveKpiBusinessImpactPlatform(): ExecutiveKpiBusinessImpactPlatformType {
  const manifest = getExecutiveKpiBusinessImpactManifest();
  return Object.freeze({
    registry: EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY,
    manifest,
    validation: validateExecutiveKpiBusinessImpacts(EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY, manifest),
  });
}

export const ExecutiveKpiBusinessImpactPlatform = Object.freeze({
  getExecutiveKpiBusinessImpactPlatform,
  getExecutiveKpiBusinessImpactManifest,
  validateExecutiveKpiBusinessImpacts,
  listExecutiveKpiBusinessImpacts,
  listExecutiveBusinessImpactCategories,
  listExecutiveBusinessImpactDimensions,
  listExecutiveBusinessImpactHorizons,
  listExecutiveBusinessImpactConfidenceLevels,
  listExecutiveBusinessImpactLifecycleStates,
});
