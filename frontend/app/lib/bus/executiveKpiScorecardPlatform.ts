export type {
  ExecutiveKpiScorecard,
  ExecutiveKpiScorecardCategory,
  ExecutiveKpiScorecardHierarchyLevel,
  ExecutiveKpiScorecardLifecycleState,
  ExecutiveKpiScorecardManifest,
  ExecutiveKpiScorecardMetadata,
  ExecutiveKpiScorecardOwner,
  ExecutiveKpiScorecardPlatform as ExecutiveKpiScorecardPlatformContract,
  ExecutiveKpiScorecardRegistry,
  ExecutiveKpiScorecardValidation,
  ExecutiveKpiScorecardVisibilityLevel,
  ExecutiveKpiScorecardVisibilityMetadata,
} from "./executiveKpiScorecardTypes.ts";

export { getExecutiveKpiScorecardManifest } from "./executiveKpiScorecardManifest.ts";
export {
  EXECUTIVE_KPI_SCORECARDS,
  EXECUTIVE_KPI_SCORECARD_CATEGORIES,
  EXECUTIVE_KPI_SCORECARD_HIERARCHY_LEVELS,
  EXECUTIVE_KPI_SCORECARD_LIFECYCLE_STATES,
  EXECUTIVE_KPI_SCORECARD_PUBLIC_APIS,
  EXECUTIVE_KPI_SCORECARD_REGISTRY,
  EXECUTIVE_KPI_SCORECARD_VISIBILITY_LEVELS,
  listExecutiveKpiScorecards,
  listExecutiveScorecardCategories,
  listExecutiveScorecardHierarchyLevels,
  listExecutiveScorecardLifecycleStates,
  listExecutiveScorecardVisibilityLevels,
} from "./executiveKpiScorecardRegistry.ts";
export { validateExecutiveKpiScorecards } from "./executiveKpiScorecardValidation.ts";

import { getExecutiveKpiScorecardManifest } from "./executiveKpiScorecardManifest.ts";
import {
  EXECUTIVE_KPI_SCORECARD_REGISTRY,
  listExecutiveKpiScorecards,
  listExecutiveScorecardCategories,
  listExecutiveScorecardHierarchyLevels,
  listExecutiveScorecardLifecycleStates,
  listExecutiveScorecardVisibilityLevels,
} from "./executiveKpiScorecardRegistry.ts";
import { validateExecutiveKpiScorecards } from "./executiveKpiScorecardValidation.ts";
import type { ExecutiveKpiScorecardPlatform as ExecutiveKpiScorecardPlatformType } from "./executiveKpiScorecardTypes.ts";

export function getExecutiveKpiScorecardPlatform(): ExecutiveKpiScorecardPlatformType {
  const manifest = getExecutiveKpiScorecardManifest();
  return Object.freeze({
    registry: EXECUTIVE_KPI_SCORECARD_REGISTRY,
    manifest,
    validation: validateExecutiveKpiScorecards(EXECUTIVE_KPI_SCORECARD_REGISTRY, manifest),
  });
}

export const ExecutiveKpiScorecardPlatform = Object.freeze({
  getExecutiveKpiScorecardPlatform,
  getExecutiveKpiScorecardManifest,
  validateExecutiveKpiScorecards,
  listExecutiveKpiScorecards,
  listExecutiveScorecardCategories,
  listExecutiveScorecardHierarchyLevels,
  listExecutiveScorecardVisibilityLevels,
  listExecutiveScorecardLifecycleStates,
});
