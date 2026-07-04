export type {
  ExecutiveKpiChangeControlPolicy,
  ExecutiveKpiComplianceLevel,
  ExecutiveKpiCriticalityLevel,
  ExecutiveKpiDocumentationRequirement,
  ExecutiveKpiGovernance,
  ExecutiveKpiGovernanceCategory,
  ExecutiveKpiGovernanceLifecycleState,
  ExecutiveKpiGovernanceManifest,
  ExecutiveKpiGovernanceMetadata,
  ExecutiveKpiGovernancePlatform as ExecutiveKpiGovernancePlatformContract,
  ExecutiveKpiGovernanceRegistry,
  ExecutiveKpiGovernanceReviewPolicy,
  ExecutiveKpiGovernanceRoleMetadata,
  ExecutiveKpiGovernanceValidation,
  ExecutiveKpiRetentionPolicyMetadata,
} from "./executiveKpiGovernanceTypes.ts";

export { getExecutiveKpiGovernanceManifest } from "./executiveKpiGovernanceManifest.ts";
export {
  EXECUTIVE_KPI_CHANGE_CONTROL_POLICIES,
  EXECUTIVE_KPI_COMPLIANCE_LEVELS,
  EXECUTIVE_KPI_CRITICALITY_LEVELS,
  EXECUTIVE_KPI_GOVERNANCE,
  EXECUTIVE_KPI_GOVERNANCE_CATEGORIES,
  EXECUTIVE_KPI_GOVERNANCE_LIFECYCLE_STATES,
  EXECUTIVE_KPI_GOVERNANCE_PUBLIC_APIS,
  EXECUTIVE_KPI_GOVERNANCE_REGISTRY,
  EXECUTIVE_KPI_GOVERNANCE_REVIEW_POLICIES,
  listExecutiveChangeControlPolicies,
  listExecutiveComplianceLevels,
  listExecutiveCriticalityLevels,
  listExecutiveGovernanceCategories,
  listExecutiveGovernanceLifecycleStates,
  listExecutiveKpiGovernance,
  listExecutiveReviewPolicies,
} from "./executiveKpiGovernanceRegistry.ts";
export { validateExecutiveKpiGovernance } from "./executiveKpiGovernanceValidation.ts";

import { getExecutiveKpiGovernanceManifest } from "./executiveKpiGovernanceManifest.ts";
import {
  EXECUTIVE_KPI_GOVERNANCE_REGISTRY,
  listExecutiveChangeControlPolicies,
  listExecutiveComplianceLevels,
  listExecutiveCriticalityLevels,
  listExecutiveGovernanceCategories,
  listExecutiveGovernanceLifecycleStates,
  listExecutiveKpiGovernance,
  listExecutiveReviewPolicies,
} from "./executiveKpiGovernanceRegistry.ts";
import { validateExecutiveKpiGovernance } from "./executiveKpiGovernanceValidation.ts";
import type { ExecutiveKpiGovernancePlatform as ExecutiveKpiGovernancePlatformType } from "./executiveKpiGovernanceTypes.ts";

export function getExecutiveKpiGovernancePlatform(): ExecutiveKpiGovernancePlatformType {
  const manifest = getExecutiveKpiGovernanceManifest();
  return Object.freeze({
    registry: EXECUTIVE_KPI_GOVERNANCE_REGISTRY,
    manifest,
    validation: validateExecutiveKpiGovernance(EXECUTIVE_KPI_GOVERNANCE_REGISTRY, manifest),
  });
}

export const ExecutiveKpiGovernancePlatform = Object.freeze({
  getExecutiveKpiGovernancePlatform,
  getExecutiveKpiGovernanceManifest,
  validateExecutiveKpiGovernance,
  listExecutiveKpiGovernance,
  listExecutiveGovernanceCategories,
  listExecutiveComplianceLevels,
  listExecutiveCriticalityLevels,
  listExecutiveReviewPolicies,
  listExecutiveChangeControlPolicies,
  listExecutiveGovernanceLifecycleStates,
});
