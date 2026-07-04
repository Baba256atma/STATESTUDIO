export type {
  ExecutiveKpiInsight,
  ExecutiveKpiInsightAudienceLevel,
  ExecutiveKpiInsightCategory,
  ExecutiveKpiInsightConfidenceLevel,
  ExecutiveKpiInsightLifecycleState,
  ExecutiveKpiInsightManifest,
  ExecutiveKpiInsightMetadata,
  ExecutiveKpiInsightPlatform as ExecutiveKpiInsightPlatformContract,
  ExecutiveKpiInsightRegistry,
  ExecutiveKpiInsightSeverityLevel,
  ExecutiveKpiInsightValidation,
} from "./executiveKpiInsightTypes.ts";

export { getExecutiveKpiInsightManifest } from "./executiveKpiInsightManifest.ts";
export {
  EXECUTIVE_KPI_INSIGHTS,
  EXECUTIVE_KPI_INSIGHT_AUDIENCE_LEVELS,
  EXECUTIVE_KPI_INSIGHT_CATEGORIES,
  EXECUTIVE_KPI_INSIGHT_CONFIDENCE_LEVELS,
  EXECUTIVE_KPI_INSIGHT_LIFECYCLE_STATES,
  EXECUTIVE_KPI_INSIGHT_PUBLIC_APIS,
  EXECUTIVE_KPI_INSIGHT_REGISTRY,
  EXECUTIVE_KPI_INSIGHT_SEVERITY_LEVELS,
  listExecutiveKpiInsightAudienceLevels,
  listExecutiveKpiInsightCategories,
  listExecutiveKpiInsightConfidenceLevels,
  listExecutiveKpiInsightLifecycleStates,
  listExecutiveKpiInsightSeverityLevels,
  listExecutiveKpiInsights,
} from "./executiveKpiInsightRegistry.ts";
export { validateExecutiveKpiInsights } from "./executiveKpiInsightValidation.ts";

import { getExecutiveKpiInsightManifest } from "./executiveKpiInsightManifest.ts";
import {
  EXECUTIVE_KPI_INSIGHT_REGISTRY,
  listExecutiveKpiInsightAudienceLevels,
  listExecutiveKpiInsightCategories,
  listExecutiveKpiInsightConfidenceLevels,
  listExecutiveKpiInsightLifecycleStates,
  listExecutiveKpiInsightSeverityLevels,
  listExecutiveKpiInsights,
} from "./executiveKpiInsightRegistry.ts";
import { validateExecutiveKpiInsights } from "./executiveKpiInsightValidation.ts";
import type { ExecutiveKpiInsightPlatform as ExecutiveKpiInsightPlatformType } from "./executiveKpiInsightTypes.ts";

export function getExecutiveKpiInsightPlatform(): ExecutiveKpiInsightPlatformType {
  const manifest = getExecutiveKpiInsightManifest();
  return Object.freeze({
    registry: EXECUTIVE_KPI_INSIGHT_REGISTRY,
    manifest,
    validation: validateExecutiveKpiInsights(EXECUTIVE_KPI_INSIGHT_REGISTRY, manifest),
  });
}

export const ExecutiveKpiInsightPlatform = Object.freeze({
  getExecutiveKpiInsightPlatform,
  getExecutiveKpiInsightManifest,
  validateExecutiveKpiInsights,
  listExecutiveKpiInsights,
  listExecutiveKpiInsightCategories,
  listExecutiveKpiInsightSeverityLevels,
  listExecutiveKpiInsightConfidenceLevels,
  listExecutiveKpiInsightAudienceLevels,
  listExecutiveKpiInsightLifecycleStates,
});
