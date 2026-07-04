import type {
  ExecutiveKpiChangeControlPolicy,
  ExecutiveKpiComplianceLevel,
  ExecutiveKpiCriticalityLevel,
  ExecutiveKpiGovernance,
  ExecutiveKpiGovernanceCategory,
  ExecutiveKpiGovernanceLifecycleState,
  ExecutiveKpiGovernanceRegistry,
  ExecutiveKpiGovernanceReviewPolicy,
} from "./executiveKpiGovernanceTypes.ts";

export const EXECUTIVE_KPI_GOVERNANCE_CATEGORIES: readonly ExecutiveKpiGovernanceCategory[] = Object.freeze([
  "Corporate",
  "Strategic",
  "Operational",
  "Financial",
  "Risk",
  "Compliance",
  "Project",
  "Departmental",
  "Enterprise",
  "Custom",
] as const);

export const EXECUTIVE_KPI_CRITICALITY_LEVELS: readonly ExecutiveKpiCriticalityLevel[] = Object.freeze([
  "Critical",
  "High",
  "Medium",
  "Low",
  "Informational",
] as const);

export const EXECUTIVE_KPI_COMPLIANCE_LEVELS: readonly ExecutiveKpiComplianceLevel[] = Object.freeze([
  "Mandatory",
  "Regulated",
  "Internal",
  "Recommended",
  "Optional",
] as const);

export const EXECUTIVE_KPI_GOVERNANCE_REVIEW_POLICIES: readonly ExecutiveKpiGovernanceReviewPolicy[] = Object.freeze([
  "Continuous",
  "Monthly",
  "Quarterly",
  "Semiannual",
  "Annual",
  "On Demand",
] as const);

export const EXECUTIVE_KPI_CHANGE_CONTROL_POLICIES: readonly ExecutiveKpiChangeControlPolicy[] = Object.freeze([
  "Strict",
  "Controlled",
  "Managed",
  "Flexible",
  "Experimental",
] as const);

export const EXECUTIVE_KPI_GOVERNANCE_LIFECYCLE_STATES: readonly ExecutiveKpiGovernanceLifecycleState[] = Object.freeze([
  "Draft",
  "Candidate",
  "Approved",
  "Active",
  "Deprecated",
  "Archived",
] as const);

function role(roleId: string, displayName: string, responsibility: string) {
  return Object.freeze({ roleId, displayName, responsibility, metadataOnly: true });
}

export const EXECUTIVE_KPI_GOVERNANCE: readonly ExecutiveKpiGovernance[] = Object.freeze([
  Object.freeze({
    governanceId: "financial-health-governance",
    kpiId: "executive-financial-health",
    businessOwner: role("financial-business-owner", "Financial Business Owner", "Owns business metadata for financial KPI governance."),
    executiveOwner: role("financial-executive-owner", "Financial Executive Owner", "Owns executive metadata for financial KPI governance."),
    technicalSteward: role("financial-technical-steward", "Financial Technical Steward", "Owns technical metadata for financial KPI governance."),
    dataSteward: role("financial-data-steward", "Financial Data Steward", "Owns source metadata for financial KPI governance."),
    approvalAuthority: role("financial-approval-authority", "Financial Approval Authority", "Declares approval authority metadata."),
    reviewAuthority: role("financial-review-authority", "Financial Review Authority", "Declares review authority metadata."),
    governanceCategory: "Financial",
    complianceLevel: "Internal",
    criticalityLevel: "High",
    changeControlPolicy: "Controlled",
    reviewPolicy: "Quarterly",
    retentionPolicy: Object.freeze({ retentionPolicyId: "financial-retention", retentionClass: "Extended", metadataOnly: true }),
    documentationRequirement: Object.freeze({ documentationRequirementId: "financial-documentation", required: true, documentationClass: "Governance", metadataOnly: true }),
    lifecycleState: "Draft",
    governanceMetadata: Object.freeze({ metadataId: "financial-governance-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    governanceId: "operational-readiness-governance",
    kpiId: "executive-operational-readiness",
    businessOwner: role("operational-business-owner", "Operational Business Owner", "Owns business metadata for operational KPI governance."),
    executiveOwner: role("operational-executive-owner", "Operational Executive Owner", "Owns executive metadata for operational KPI governance."),
    technicalSteward: role("operational-technical-steward", "Operational Technical Steward", "Owns technical metadata for operational KPI governance."),
    dataSteward: role("operational-data-steward", "Operational Data Steward", "Owns source metadata for operational KPI governance."),
    approvalAuthority: role("operational-approval-authority", "Operational Approval Authority", "Declares approval authority metadata."),
    reviewAuthority: role("operational-review-authority", "Operational Review Authority", "Declares review authority metadata."),
    governanceCategory: "Operational",
    complianceLevel: "Internal",
    criticalityLevel: "Medium",
    changeControlPolicy: "Managed",
    reviewPolicy: "Monthly",
    retentionPolicy: Object.freeze({ retentionPolicyId: "operational-retention", retentionClass: "Standard", metadataOnly: true }),
    documentationRequirement: Object.freeze({ documentationRequirementId: "operational-documentation", required: true, documentationClass: "Governance", metadataOnly: true }),
    lifecycleState: "Draft",
    governanceMetadata: Object.freeze({ metadataId: "operational-governance-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_KPI_GOVERNANCE_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveKpiGovernancePlatform",
  "getExecutiveKpiGovernancePlatform",
  "getExecutiveKpiGovernanceManifest",
  "validateExecutiveKpiGovernance",
  "listExecutiveKpiGovernance",
  "listExecutiveGovernanceCategories",
  "listExecutiveComplianceLevels",
  "listExecutiveCriticalityLevels",
  "listExecutiveReviewPolicies",
  "listExecutiveChangeControlPolicies",
  "listExecutiveGovernanceLifecycleStates",
] as const);

export const EXECUTIVE_KPI_GOVERNANCE_REGISTRY: ExecutiveKpiGovernanceRegistry = Object.freeze({
  platformId: "BUS-5",
  platformName: "Executive KPI Governance Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-1",
  definitionPlatformId: "BUS-2",
  sourceMappingPlatformId: "BUS-3",
  targetPlatformId: "BUS-4",
  governance: EXECUTIVE_KPI_GOVERNANCE,
  governanceCategories: EXECUTIVE_KPI_GOVERNANCE_CATEGORIES,
  complianceLevels: EXECUTIVE_KPI_COMPLIANCE_LEVELS,
  criticalityLevels: EXECUTIVE_KPI_CRITICALITY_LEVELS,
  reviewPolicies: EXECUTIVE_KPI_GOVERNANCE_REVIEW_POLICIES,
  changeControlPolicies: EXECUTIVE_KPI_CHANGE_CONTROL_POLICIES,
  lifecycleStates: EXECUTIVE_KPI_GOVERNANCE_LIFECYCLE_STATES,
  publicApis: EXECUTIVE_KPI_GOVERNANCE_PUBLIC_APIS,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveKpiGovernance(): readonly ExecutiveKpiGovernance[] {
  return EXECUTIVE_KPI_GOVERNANCE;
}

export function listExecutiveGovernanceCategories(): readonly ExecutiveKpiGovernanceCategory[] {
  return EXECUTIVE_KPI_GOVERNANCE_CATEGORIES;
}

export function listExecutiveComplianceLevels(): readonly ExecutiveKpiComplianceLevel[] {
  return EXECUTIVE_KPI_COMPLIANCE_LEVELS;
}

export function listExecutiveCriticalityLevels(): readonly ExecutiveKpiCriticalityLevel[] {
  return EXECUTIVE_KPI_CRITICALITY_LEVELS;
}

export function listExecutiveReviewPolicies(): readonly ExecutiveKpiGovernanceReviewPolicy[] {
  return EXECUTIVE_KPI_GOVERNANCE_REVIEW_POLICIES;
}

export function listExecutiveChangeControlPolicies(): readonly ExecutiveKpiChangeControlPolicy[] {
  return EXECUTIVE_KPI_CHANGE_CONTROL_POLICIES;
}

export function listExecutiveGovernanceLifecycleStates(): readonly ExecutiveKpiGovernanceLifecycleState[] {
  return EXECUTIVE_KPI_GOVERNANCE_LIFECYCLE_STATES;
}
