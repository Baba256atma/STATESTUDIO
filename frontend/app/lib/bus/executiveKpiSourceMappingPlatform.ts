export type {
  ExecutiveKpiCoverageLevel,
  ExecutiveKpiFreshnessExpectation,
  ExecutiveKpiMappingConfidenceMetadata,
  ExecutiveKpiSourceField,
  ExecutiveKpiSourceGovernanceMetadata,
  ExecutiveKpiSourceMapping,
  ExecutiveKpiSourceMappingLifecycleState,
  ExecutiveKpiSourceMappingManifest,
  ExecutiveKpiSourceMappingPlatform as ExecutiveKpiSourceMappingPlatformContract,
  ExecutiveKpiSourceMappingRegistry,
  ExecutiveKpiSourceMappingValidation,
  ExecutiveKpiSourceOwnerMetadata,
  ExecutiveKpiSourceType,
} from "./executiveKpiSourceMappingTypes.ts";

export { getExecutiveKpiSourceMappingManifest } from "./executiveKpiSourceMappingManifest.ts";
export {
  EXECUTIVE_KPI_COVERAGE_LEVELS,
  EXECUTIVE_KPI_FRESHNESS_EXPECTATIONS,
  EXECUTIVE_KPI_SOURCE_MAPPING_LIFECYCLE_STATES,
  EXECUTIVE_KPI_SOURCE_MAPPING_PUBLIC_APIS,
  EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY,
  EXECUTIVE_KPI_SOURCE_MAPPINGS,
  EXECUTIVE_KPI_SOURCE_TYPES,
  listExecutiveKpiCoverageLevels,
  listExecutiveKpiFreshnessExpectations,
  listExecutiveKpiSourceMappingLifecycleStates,
  listExecutiveKpiSourceMappings,
  listExecutiveKpiSourceTypes,
} from "./executiveKpiSourceMappingRegistry.ts";
export { validateExecutiveKpiSourceMappings } from "./executiveKpiSourceMappingValidation.ts";

import { getExecutiveKpiSourceMappingManifest } from "./executiveKpiSourceMappingManifest.ts";
import {
  EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY,
  listExecutiveKpiCoverageLevels,
  listExecutiveKpiFreshnessExpectations,
  listExecutiveKpiSourceMappingLifecycleStates,
  listExecutiveKpiSourceMappings,
  listExecutiveKpiSourceTypes,
} from "./executiveKpiSourceMappingRegistry.ts";
import { validateExecutiveKpiSourceMappings } from "./executiveKpiSourceMappingValidation.ts";
import type { ExecutiveKpiSourceMappingPlatform as ExecutiveKpiSourceMappingPlatformType } from "./executiveKpiSourceMappingTypes.ts";

export function getExecutiveKpiSourceMappingPlatform(): ExecutiveKpiSourceMappingPlatformType {
  const manifest = getExecutiveKpiSourceMappingManifest();
  return Object.freeze({
    registry: EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY,
    manifest,
    validation: validateExecutiveKpiSourceMappings(EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY, manifest),
  });
}

export const ExecutiveKpiSourceMappingPlatform = Object.freeze({
  getExecutiveKpiSourceMappingPlatform,
  getExecutiveKpiSourceMappingManifest,
  validateExecutiveKpiSourceMappings,
  listExecutiveKpiSourceMappings,
  listExecutiveKpiSourceTypes,
  listExecutiveKpiCoverageLevels,
  listExecutiveKpiFreshnessExpectations,
  listExecutiveKpiSourceMappingLifecycleStates,
});
