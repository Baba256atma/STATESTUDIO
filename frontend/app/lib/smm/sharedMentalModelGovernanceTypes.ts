/**
 * SMM-7 — Governance Platform domain types.
 */

import type {
  SMM_GOVERNANCE_CONTRACT_VERSION,
  SMM_GOVERNANCE_LIFECYCLE_STATUS_KEYS,
  SMM_GOVERNANCE_POLICY_KEYS,
  SMM_GOVERNANCE_REGISTRY_KEYS,
} from "./sharedMentalModelGovernanceContracts.ts";

export type SharedMentalModelGovernancePolicyKey = (typeof SMM_GOVERNANCE_POLICY_KEYS)[number];
export type SharedMentalModelGovernanceLifecycleStatusKey = (typeof SMM_GOVERNANCE_LIFECYCLE_STATUS_KEYS)[number];
export type SharedMentalModelGovernanceRegistryKey = (typeof SMM_GOVERNANCE_REGISTRY_KEYS)[number];

export type SharedMentalModelGovernanceRecord = Readonly<{
  governanceId: string;
  modelReferenceId: string;
  ownerReferenceId: string;
  stewardReferenceId: string | null;
  governancePolicyReferenceId: string;
  complianceMetadata: Readonly<Record<string, string>>;
  auditReferenceId: string;
  lifecycleMetadata: Readonly<Record<string, string>>;
  versionCompatibilityMetadata: Readonly<Record<string, string>>;
  createdAt: string;
  createdMetadata: Readonly<Record<string, string>>;
  extensionMetadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type SharedMentalModelOwnershipRecord = Readonly<{
  ownershipId: string;
  governanceId: string;
  modelReferenceId: string;
  ownerReferenceId: string;
  ownerLabel: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelStewardshipRecord = Readonly<{
  stewardshipId: string;
  governanceId: string;
  modelReferenceId: string;
  stewardReferenceId: string;
  stewardLabel: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelGovernancePolicyRecord = Readonly<{
  policyId: string;
  policyKey: SharedMentalModelGovernancePolicyKey;
  label: string;
  description: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelComplianceRecord = Readonly<{
  complianceId: string;
  governanceId: string;
  complianceKey: string;
  complianceValue: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelGovernanceAuditRecord = Readonly<{
  auditReferenceId: string;
  governanceId: string;
  auditTrailRef: string;
  auditLabel: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelGovernanceLifecycleRecord = Readonly<{
  lifecycleId: string;
  governanceId: string;
  status: SharedMentalModelGovernanceLifecycleStatusKey;
  lifecycleMetadata: Readonly<Record<string, string>>;
  recordedAt: string;
  readOnly: true;
}>;

export type SharedMentalModelGovernanceManifestRecord = Readonly<{
  manifestId: string;
  governanceId: string;
  policyKey: SharedMentalModelGovernancePolicyKey;
  payloadRef: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelGovernanceRegistryBundle = Readonly<{
  governanceRegistry: readonly SharedMentalModelGovernanceRecord[];
  governanceCount: number;
  ownershipRegistry: readonly SharedMentalModelOwnershipRecord[];
  ownershipCount: number;
  stewardshipRegistry: readonly SharedMentalModelStewardshipRecord[];
  stewardshipCount: number;
  policyRegistry: readonly SharedMentalModelGovernancePolicyRecord[];
  policyCount: number;
  complianceRegistry: readonly SharedMentalModelComplianceRecord[];
  complianceCount: number;
  auditRegistry: readonly SharedMentalModelGovernanceAuditRecord[];
  auditCount: number;
  lifecycleRegistry: readonly SharedMentalModelGovernanceLifecycleRecord[];
  lifecycleCount: number;
  manifestRegistry: readonly SharedMentalModelGovernanceManifestRecord[];
  manifestCount: number;
  readOnly: true;
}>;

export type SharedMentalModelGovernancePlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./sharedMentalModelGovernanceContracts.ts").SMM_GOVERNANCE_PLATFORM_ID;
  version: typeof SMM_GOVERNANCE_CONTRACT_VERSION;
  title: typeof import("./sharedMentalModelGovernanceContracts.ts").SMM_GOVERNANCE_PLATFORM_NAME;
  goal: string;
  registryKeys: readonly string[];
  governanceCount: number;
  policyCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type SharedMentalModelGovernanceValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type SharedMentalModelGovernanceValidationReport = Readonly<{
  valid: boolean;
  issues: readonly SharedMentalModelGovernanceValidationIssue[];
  readOnly: true;
}>;

export type SharedMentalModelGovernanceLayerState = Readonly<{
  contractVersion: typeof SMM_GOVERNANCE_CONTRACT_VERSION;
  queryDependency: typeof import("./sharedMentalModelGovernanceContracts.ts").SMM_GOVERNANCE_QUERY_DEPENDENCY;
  initialized: boolean;
  registry: SharedMentalModelGovernanceRegistryBundle;
  timestamp: string;
  readOnly: true;
}>;

export type SharedMentalModelGovernanceBuildResult = Readonly<{
  success: boolean;
  reason: string;
  data: SharedMentalModelGovernanceLayerState | null;
  readOnly: true;
}>;

export type SharedMentalModelGovernanceInput = Readonly<{
  governanceId: string;
  modelReferenceId: string;
  ownerReferenceId: string;
  stewardReferenceId?: string | null;
  governancePolicyReferenceId: string;
  complianceMetadata?: Readonly<Record<string, string>>;
  auditReferenceId: string;
  lifecycleMetadata?: Readonly<Record<string, string>>;
  versionCompatibilityMetadata?: Readonly<Record<string, string>>;
  createdMetadata?: Readonly<Record<string, string>>;
  extensionMetadata?: Readonly<Record<string, string>>;
}>;

export type SharedMentalModelGovernanceRegistrationResult<T> = Readonly<{
  success: boolean;
  reason: string;
  record: T | null;
  readOnly: true;
}>;
