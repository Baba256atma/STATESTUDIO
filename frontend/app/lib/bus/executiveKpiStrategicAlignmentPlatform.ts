export type {
  ExecutiveAlignmentStrengthLevel,
  ExecutiveKpiStrategicAlignment,
  ExecutiveKpiStrategicAlignmentManifest,
  ExecutiveKpiStrategicAlignmentMetadata,
  ExecutiveKpiStrategicAlignmentPlatform as ExecutiveKpiStrategicAlignmentPlatformContract,
  ExecutiveKpiStrategicAlignmentRegistry,
  ExecutiveKpiStrategicAlignmentValidation,
  ExecutiveStrategicAlignmentCategory,
  ExecutiveStrategicAlignmentLifecycleState,
  ExecutiveStrategicHorizon,
} from "./executiveKpiStrategicAlignmentTypes.ts";

export { getExecutiveKpiStrategicAlignmentManifest } from "./executiveKpiStrategicAlignmentManifest.ts";
export {
  EXECUTIVE_ALIGNMENT_STRENGTH_LEVELS,
  EXECUTIVE_KPI_STRATEGIC_ALIGNMENTS,
  EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_PUBLIC_APIS,
  EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY,
  EXECUTIVE_STRATEGIC_ALIGNMENT_CATEGORIES,
  EXECUTIVE_STRATEGIC_ALIGNMENT_LIFECYCLE_STATES,
  EXECUTIVE_STRATEGIC_HORIZONS,
  listExecutiveAlignmentStrengthLevels,
  listExecutiveKpiStrategicAlignments,
  listExecutiveStrategicAlignmentCategories,
  listExecutiveStrategicAlignmentLifecycleStates,
  listExecutiveStrategicHorizons,
} from "./executiveKpiStrategicAlignmentRegistry.ts";
export { validateExecutiveKpiStrategicAlignments } from "./executiveKpiStrategicAlignmentValidation.ts";

import { getExecutiveKpiStrategicAlignmentManifest } from "./executiveKpiStrategicAlignmentManifest.ts";
import {
  EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY,
  listExecutiveAlignmentStrengthLevels,
  listExecutiveKpiStrategicAlignments,
  listExecutiveStrategicAlignmentCategories,
  listExecutiveStrategicAlignmentLifecycleStates,
  listExecutiveStrategicHorizons,
} from "./executiveKpiStrategicAlignmentRegistry.ts";
import { validateExecutiveKpiStrategicAlignments } from "./executiveKpiStrategicAlignmentValidation.ts";
import type { ExecutiveKpiStrategicAlignmentPlatform as ExecutiveKpiStrategicAlignmentPlatformType } from "./executiveKpiStrategicAlignmentTypes.ts";

export function getExecutiveKpiStrategicAlignmentPlatform(): ExecutiveKpiStrategicAlignmentPlatformType {
  const manifest = getExecutiveKpiStrategicAlignmentManifest();
  return Object.freeze({
    registry: EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY,
    manifest,
    validation: validateExecutiveKpiStrategicAlignments(EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY, manifest),
  });
}

export const ExecutiveKpiStrategicAlignmentPlatform = Object.freeze({
  getExecutiveKpiStrategicAlignmentPlatform,
  getExecutiveKpiStrategicAlignmentManifest,
  validateExecutiveKpiStrategicAlignments,
  listExecutiveKpiStrategicAlignments,
  listExecutiveStrategicAlignmentCategories,
  listExecutiveAlignmentStrengthLevels,
  listExecutiveStrategicHorizons,
  listExecutiveStrategicAlignmentLifecycleStates,
});
