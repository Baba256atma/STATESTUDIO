export type {
  ExecutiveOkrAlignment,
  ExecutiveOkrAlignmentCategory,
  ExecutiveOkrAlignmentLifecycleState,
  ExecutiveOkrAlignmentManifest,
  ExecutiveOkrAlignmentMetadata,
  ExecutiveOkrAlignmentPlatform as ExecutiveOkrAlignmentPlatformContract,
  ExecutiveOkrAlignmentRegistry,
  ExecutiveOkrAlignmentStrength,
  ExecutiveOkrAlignmentValidation,
  ExecutiveOkrDependencyType,
  ExecutiveOkrStrategicTheme,
} from "./executiveOkrAlignmentTypes.ts";

export { getExecutiveOkrAlignmentManifest } from "./executiveOkrAlignmentManifest.ts";
export {
  EXECUTIVE_OKR_ALIGNMENTS,
  EXECUTIVE_OKR_ALIGNMENT_CATEGORIES,
  EXECUTIVE_OKR_ALIGNMENT_LIFECYCLE_STATES,
  EXECUTIVE_OKR_ALIGNMENT_PUBLIC_APIS,
  EXECUTIVE_OKR_ALIGNMENT_REGISTRY,
  EXECUTIVE_OKR_ALIGNMENT_STRENGTH_LEVELS,
  EXECUTIVE_OKR_DEPENDENCY_TYPES,
  EXECUTIVE_OKR_STRATEGIC_THEMES,
  listExecutiveAlignmentCategories,
  listExecutiveAlignmentStrengthLevels,
  listExecutiveDependencyTypes,
  listExecutiveOkrAlignmentLifecycleStates,
  listExecutiveOkrAlignments,
  listExecutiveStrategicThemes,
} from "./executiveOkrAlignmentRegistry.ts";
export { validateExecutiveOkrAlignments } from "./executiveOkrAlignmentValidation.ts";

import { getExecutiveOkrAlignmentManifest } from "./executiveOkrAlignmentManifest.ts";
import {
  EXECUTIVE_OKR_ALIGNMENT_REGISTRY,
  listExecutiveAlignmentCategories,
  listExecutiveAlignmentStrengthLevels,
  listExecutiveDependencyTypes,
  listExecutiveOkrAlignmentLifecycleStates,
  listExecutiveOkrAlignments,
  listExecutiveStrategicThemes,
} from "./executiveOkrAlignmentRegistry.ts";
import type { ExecutiveOkrAlignmentPlatform as ExecutiveOkrAlignmentPlatformType } from "./executiveOkrAlignmentTypes.ts";
import { validateExecutiveOkrAlignments } from "./executiveOkrAlignmentValidation.ts";

export function getExecutiveOkrAlignmentPlatform(): ExecutiveOkrAlignmentPlatformType {
  const manifest = getExecutiveOkrAlignmentManifest();
  return Object.freeze({
    registry: EXECUTIVE_OKR_ALIGNMENT_REGISTRY,
    manifest,
    validation: validateExecutiveOkrAlignments(EXECUTIVE_OKR_ALIGNMENT_REGISTRY, manifest),
  });
}

export const ExecutiveOkrAlignmentPlatform = Object.freeze({
  getExecutiveOkrAlignmentPlatform,
  getExecutiveOkrAlignmentManifest,
  validateExecutiveOkrAlignments,
  listExecutiveOkrAlignments,
  listExecutiveAlignmentCategories,
  listExecutiveAlignmentStrengthLevels,
  listExecutiveDependencyTypes,
  listExecutiveStrategicThemes,
  listExecutiveOkrAlignmentLifecycleStates,
});
