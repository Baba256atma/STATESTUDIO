export type {
  ExecutiveKpiEffectiveDateMetadata,
  ExecutiveKpiExpirationMetadata,
  ExecutiveKpiMeasurementPeriod,
  ExecutiveKpiReviewCadence,
  ExecutiveKpiTarget,
  ExecutiveKpiTargetGovernanceMetadata,
  ExecutiveKpiTargetLifecycleState,
  ExecutiveKpiTargetManifest,
  ExecutiveKpiTargetOwner,
  ExecutiveKpiTargetPlatform as ExecutiveKpiTargetPlatformContract,
  ExecutiveKpiTargetRegistry,
  ExecutiveKpiTargetType,
  ExecutiveKpiTargetValidation,
  ExecutiveKpiThresholdPolicy,
  ExecutiveKpiTolerancePolicy,
} from "./executiveKpiTargetTypes.ts";

export { getExecutiveKpiTargetManifest } from "./executiveKpiTargetManifest.ts";
export {
  EXECUTIVE_KPI_MEASUREMENT_PERIODS,
  EXECUTIVE_KPI_REVIEW_CADENCES,
  EXECUTIVE_KPI_TARGETS,
  EXECUTIVE_KPI_TARGET_LIFECYCLE_STATES,
  EXECUTIVE_KPI_TARGET_PUBLIC_APIS,
  EXECUTIVE_KPI_TARGET_REGISTRY,
  EXECUTIVE_KPI_TARGET_TYPES,
  EXECUTIVE_KPI_THRESHOLD_POLICIES,
  EXECUTIVE_KPI_TOLERANCE_POLICIES,
  listExecutiveKpiTargetLifecycleStates,
  listExecutiveKpiTargets,
  listExecutiveMeasurementPeriods,
  listExecutiveReviewCadences,
  listExecutiveTargetTypes,
  listExecutiveThresholdPolicies,
  listExecutiveTolerancePolicies,
} from "./executiveKpiTargetRegistry.ts";
export { validateExecutiveKpiTargets } from "./executiveKpiTargetValidation.ts";

import { getExecutiveKpiTargetManifest } from "./executiveKpiTargetManifest.ts";
import {
  EXECUTIVE_KPI_TARGET_REGISTRY,
  listExecutiveKpiTargetLifecycleStates,
  listExecutiveKpiTargets,
  listExecutiveMeasurementPeriods,
  listExecutiveReviewCadences,
  listExecutiveTargetTypes,
  listExecutiveThresholdPolicies,
  listExecutiveTolerancePolicies,
} from "./executiveKpiTargetRegistry.ts";
import { validateExecutiveKpiTargets } from "./executiveKpiTargetValidation.ts";
import type { ExecutiveKpiTargetPlatform as ExecutiveKpiTargetPlatformType } from "./executiveKpiTargetTypes.ts";

export function getExecutiveKpiTargetPlatform(): ExecutiveKpiTargetPlatformType {
  const manifest = getExecutiveKpiTargetManifest();
  return Object.freeze({
    registry: EXECUTIVE_KPI_TARGET_REGISTRY,
    manifest,
    validation: validateExecutiveKpiTargets(EXECUTIVE_KPI_TARGET_REGISTRY, manifest),
  });
}

export const ExecutiveKpiTargetPlatform = Object.freeze({
  getExecutiveKpiTargetPlatform,
  getExecutiveKpiTargetManifest,
  validateExecutiveKpiTargets,
  listExecutiveKpiTargets,
  listExecutiveTargetTypes,
  listExecutiveThresholdPolicies,
  listExecutiveTolerancePolicies,
  listExecutiveMeasurementPeriods,
  listExecutiveReviewCadences,
  listExecutiveKpiTargetLifecycleStates,
});
