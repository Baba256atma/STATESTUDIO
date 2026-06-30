/**
 * SMM-7 — Governance Platform contracts and constants.
 */

export const SMM_GOVERNANCE_CONTRACT_VERSION = "SMM/7" as const;
export const SMM_GOVERNANCE_PLATFORM_ID = "smm-governance-platform" as const;
export const SMM_GOVERNANCE_PLATFORM_NAME = "Shared Mental Model Governance Platform" as const;
export const SMM_GOVERNANCE_QUERY_DEPENDENCY = "SMM/6" as const;
export const SMM_GOVERNANCE_SYNC_DEPENDENCY = "SMM/5" as const;
export const SMM_GOVERNANCE_SNAPSHOT_DEPENDENCY = "SMM/4" as const;
export const SMM_GOVERNANCE_IDENTITY_DEPENDENCY = "SMM/3" as const;
export const SMM_GOVERNANCE_DOMAIN_DEPENDENCY = "SMM/2" as const;
export const SMM_GOVERNANCE_FOUNDATION_DEPENDENCY = "SMM/1" as const;

export const SMM_GOVERNANCE_TAGS = Object.freeze([
  "[SMM_7]",
  "[GOVERNANCE]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_INFERENCE]",
  "[NO_RUNTIME]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SMM_GOVERNANCE_POLICY_KEYS = Object.freeze([
  "ownership",
  "stewardship",
  "read_access",
  "write_access",
  "retention",
  "archival",
  "compliance",
  "certification",
] as const);

export const SMM_GOVERNANCE_LIFECYCLE_STATUS_KEYS = Object.freeze([
  "draft",
  "active",
  "under_review",
  "certified",
  "archived",
] as const);

export const SMM_GOVERNANCE_REGISTRY_KEYS = Object.freeze([
  "governance_registry",
  "ownership_registry",
  "stewardship_registry",
  "policy_registry",
  "compliance_registry",
  "audit_registry",
  "lifecycle_registry",
  "manifest_registry",
] as const);

export const SMM_GOVERNANCE_PUBLIC_API_REGISTRY = Object.freeze([
  "buildSharedMentalModelGovernancePlatform",
  "validateSharedMentalModelGovernance",
  "getSharedMentalModelGovernanceRegistry",
  "getSharedMentalModelGovernancePolicies",
  "getSharedMentalModelGovernanceManifest",
] as const);

export const SMM_GOVERNANCE_COMPATIBLE_VERSIONS = Object.freeze([
  "SMM/1",
  "SMM/2",
  "SMM/3",
  "SMM/4",
  "SMM/5",
  "SMM/6",
] as const);

export const SMM_GOVERNANCE_PRINCIPLES = Object.freeze([
  "governance_records_immutable_after_registration",
  "policies_are_descriptive_metadata_only",
  "no_policy_execution_no_permission_evaluation",
  "no_workflow_logic_no_audit_execution",
  "future_engines_consume_governance_contracts_unchanged",
  "reference_based_registries",
] as const);

export const SMM_GOVERNANCE_MANDATORY_FIELDS = Object.freeze([
  "governanceId",
  "modelReferenceId",
  "ownerReferenceId",
  "stewardReferenceId",
  "governancePolicyReferenceId",
  "complianceMetadata",
  "auditReferenceId",
  "lifecycleMetadata",
  "versionCompatibilityMetadata",
  "createdAt",
  "createdMetadata",
  "extensionMetadata",
  "readOnly",
] as const);

export const SMM_GOVERNANCE_DEFAULT_LIMITS = Object.freeze({
  maxGovernanceRecords: 4096,
  maxOwnershipRecords: 4096,
  maxStewardshipRecords: 2048,
  maxPolicies: 256,
  maxComplianceRecords: 4096,
  maxAuditReferences: 8192,
  maxLifecycleRecords: 8192,
  maxManifests: 4096,
} as const);

export const SMM_GOVERNANCE_MUST_NOT_OWN = Object.freeze([
  "ai_reasoning",
  "business_policies",
  "authorization_engines",
  "permission_evaluation",
  "runtime_governance",
  "workflow_execution",
  "approval_processes",
  "audit_execution",
] as const);
