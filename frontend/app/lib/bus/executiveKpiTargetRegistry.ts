import type {
  ExecutiveKpiMeasurementPeriod,
  ExecutiveKpiReviewCadence,
  ExecutiveKpiTarget,
  ExecutiveKpiTargetLifecycleState,
  ExecutiveKpiTargetRegistry,
  ExecutiveKpiTargetType,
  ExecutiveKpiThresholdPolicy,
  ExecutiveKpiTolerancePolicy,
} from "./executiveKpiTargetTypes.ts";

export const EXECUTIVE_KPI_TARGET_TYPES: readonly ExecutiveKpiTargetType[] = Object.freeze([
  "Strategic Target",
  "Operational Target",
  "Compliance Target",
  "Quality Target",
  "Growth Target",
  "Financial Target",
  "Risk Target",
  "Project Target",
  "Custom Target",
] as const);

export const EXECUTIVE_KPI_THRESHOLD_POLICIES: readonly ExecutiveKpiThresholdPolicy[] = Object.freeze([
  "Minimum",
  "Maximum",
  "Target Range",
  "Exact Target",
  "Observation Only",
] as const);

export const EXECUTIVE_KPI_TOLERANCE_POLICIES: readonly ExecutiveKpiTolerancePolicy[] = Object.freeze([
  "None",
  "Low",
  "Medium",
  "High",
  "Custom",
] as const);

export const EXECUTIVE_KPI_MEASUREMENT_PERIODS: readonly ExecutiveKpiMeasurementPeriod[] = Object.freeze([
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Semiannual",
  "Annual",
  "Rolling",
  "Custom",
] as const);

export const EXECUTIVE_KPI_REVIEW_CADENCES: readonly ExecutiveKpiReviewCadence[] = Object.freeze([
  "Continuous",
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "On Demand",
] as const);

export const EXECUTIVE_KPI_TARGET_LIFECYCLE_STATES: readonly ExecutiveKpiTargetLifecycleState[] = Object.freeze([
  "Draft",
  "Candidate",
  "Approved",
  "Active",
  "Deprecated",
  "Archived",
] as const);

export const EXECUTIVE_KPI_TARGETS: readonly ExecutiveKpiTarget[] = Object.freeze([
  Object.freeze({
    targetId: "financial-health-strategic-target",
    kpiId: "executive-financial-health",
    targetName: "Financial Health Strategic Target",
    targetDescription: "Metadata target declaration for executive financial health.",
    targetOwner: Object.freeze({ ownerId: "finance-target-owner", ownerName: "Finance Target Owner", ownerRole: "Target Steward", ownershipScope: "Domain" }),
    targetCategory: "Financial",
    measurementPeriod: "Monthly",
    reviewCadence: "Monthly",
    targetDirection: "Higher Is Better",
    targetType: "Financial Target",
    thresholdPolicy: "Observation Only",
    tolerancePolicy: "None",
    effectiveDateMetadata: Object.freeze({ effectiveDateId: "financial-effective-date", datePolicy: "Declared", metadataOnly: true }),
    expirationMetadata: Object.freeze({ expirationId: "financial-expiration", expirationPolicy: "Open Ended", metadataOnly: true }),
    lifecycleState: "Draft",
    governanceMetadata: Object.freeze({ governanceId: "financial-target-governance", stewardshipRequired: true, reviewRequired: true, metadataOnly: true }),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    targetId: "operational-readiness-operational-target",
    kpiId: "executive-operational-readiness",
    targetName: "Operational Readiness Target",
    targetDescription: "Metadata target declaration for executive operational readiness.",
    targetOwner: Object.freeze({ ownerId: "operations-target-owner", ownerName: "Operations Target Owner", ownerRole: "Target Steward", ownershipScope: "Domain" }),
    targetCategory: "Operational",
    measurementPeriod: "Weekly",
    reviewCadence: "Weekly",
    targetDirection: "Higher Is Better",
    targetType: "Operational Target",
    thresholdPolicy: "Observation Only",
    tolerancePolicy: "None",
    effectiveDateMetadata: Object.freeze({ effectiveDateId: "operational-effective-date", datePolicy: "Declared", metadataOnly: true }),
    expirationMetadata: Object.freeze({ expirationId: "operational-expiration", expirationPolicy: "Open Ended", metadataOnly: true }),
    lifecycleState: "Draft",
    governanceMetadata: Object.freeze({ governanceId: "operational-target-governance", stewardshipRequired: true, reviewRequired: true, metadataOnly: true }),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_KPI_TARGET_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveKpiTargetPlatform",
  "getExecutiveKpiTargetPlatform",
  "getExecutiveKpiTargetManifest",
  "validateExecutiveKpiTargets",
  "listExecutiveKpiTargets",
  "listExecutiveTargetTypes",
  "listExecutiveThresholdPolicies",
  "listExecutiveTolerancePolicies",
  "listExecutiveMeasurementPeriods",
  "listExecutiveReviewCadences",
  "listExecutiveKpiTargetLifecycleStates",
] as const);

export const EXECUTIVE_KPI_TARGET_REGISTRY: ExecutiveKpiTargetRegistry = Object.freeze({
  platformId: "BUS-4",
  platformName: "Executive KPI Target & Threshold Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-1",
  definitionPlatformId: "BUS-2",
  sourceMappingPlatformId: "BUS-3",
  targets: EXECUTIVE_KPI_TARGETS,
  targetTypes: EXECUTIVE_KPI_TARGET_TYPES,
  thresholdPolicies: EXECUTIVE_KPI_THRESHOLD_POLICIES,
  tolerancePolicies: EXECUTIVE_KPI_TOLERANCE_POLICIES,
  measurementPeriods: EXECUTIVE_KPI_MEASUREMENT_PERIODS,
  reviewCadences: EXECUTIVE_KPI_REVIEW_CADENCES,
  lifecycleStates: EXECUTIVE_KPI_TARGET_LIFECYCLE_STATES,
  publicApis: EXECUTIVE_KPI_TARGET_PUBLIC_APIS,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveKpiTargets(): readonly ExecutiveKpiTarget[] {
  return EXECUTIVE_KPI_TARGETS;
}

export function listExecutiveTargetTypes(): readonly ExecutiveKpiTargetType[] {
  return EXECUTIVE_KPI_TARGET_TYPES;
}

export function listExecutiveThresholdPolicies(): readonly ExecutiveKpiThresholdPolicy[] {
  return EXECUTIVE_KPI_THRESHOLD_POLICIES;
}

export function listExecutiveTolerancePolicies(): readonly ExecutiveKpiTolerancePolicy[] {
  return EXECUTIVE_KPI_TOLERANCE_POLICIES;
}

export function listExecutiveMeasurementPeriods(): readonly ExecutiveKpiMeasurementPeriod[] {
  return EXECUTIVE_KPI_MEASUREMENT_PERIODS;
}

export function listExecutiveReviewCadences(): readonly ExecutiveKpiReviewCadence[] {
  return EXECUTIVE_KPI_REVIEW_CADENCES;
}

export function listExecutiveKpiTargetLifecycleStates(): readonly ExecutiveKpiTargetLifecycleState[] {
  return EXECUTIVE_KPI_TARGET_LIFECYCLE_STATES;
}
