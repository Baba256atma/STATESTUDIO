/**
 * SMM-5 — Synchronization Platform domain types.
 */

import type {
  SMM_SYNC_CONTRACT_VERSION,
  SMM_SYNC_POLICY_KEYS,
  SMM_SYNC_REGISTRY_KEYS,
  SMM_SYNC_SCOPE_KEYS,
  SMM_SYNC_STATUS_KEYS,
} from "./sharedMentalModelSynchronizationContracts.ts";

export type SharedMentalModelSynchronizationScopeKey = (typeof SMM_SYNC_SCOPE_KEYS)[number];
export type SharedMentalModelSynchronizationPolicyKey = (typeof SMM_SYNC_POLICY_KEYS)[number];
export type SharedMentalModelSynchronizationStatusKey = (typeof SMM_SYNC_STATUS_KEYS)[number];
export type SharedMentalModelSynchronizationRegistryKey = (typeof SMM_SYNC_REGISTRY_KEYS)[number];

export type SharedMentalModelSynchronizationRecord = Readonly<{
  synchronizationId: string;
  sourceReferenceId: string;
  targetReferenceId: string;
  synchronizationScope: SharedMentalModelSynchronizationScopeKey;
  synchronizationPolicy: SharedMentalModelSynchronizationPolicyKey;
  synchronizationStatusMetadata: Readonly<Record<string, string>>;
  versionCompatibilityMetadata: Readonly<Record<string, string>>;
  snapshotReferenceIds: readonly string[];
  createdAt: string;
  createdMetadata: Readonly<Record<string, string>>;
  extensionMetadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type SharedMentalModelSynchronizationScopeRecord = Readonly<{
  scopeMappingId: string;
  synchronizationScope: SharedMentalModelSynchronizationScopeKey;
  sourceScopeRef: string;
  targetScopeRef: string;
  modelId: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelSynchronizationPolicyRecord = Readonly<{
  policyId: string;
  policyKey: SharedMentalModelSynchronizationPolicyKey;
  label: string;
  description: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelSynchronizationReferenceRecord = Readonly<{
  referenceId: string;
  synchronizationId: string;
  referenceRole: "source" | "target";
  contentRef: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelSynchronizationManifestRecord = Readonly<{
  manifestId: string;
  synchronizationId: string;
  scopeKey: SharedMentalModelSynchronizationScopeKey;
  policyKey: SharedMentalModelSynchronizationPolicyKey;
  payloadRef: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelSynchronizationValidationRuleRecord = Readonly<{
  validationRuleId: string;
  ruleKey: string;
  description: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelSynchronizationStateMetadata = Readonly<{
  stateId: string;
  synchronizationId: string;
  status: SharedMentalModelSynchronizationStatusKey;
  stateMetadata: Readonly<Record<string, string>>;
  recordedAt: string;
  readOnly: true;
}>;

export type SharedMentalModelSynchronizationRegistryBundle = Readonly<{
  synchronizationRegistry: readonly SharedMentalModelSynchronizationRecord[];
  synchronizationCount: number;
  scopeRegistry: readonly SharedMentalModelSynchronizationScopeRecord[];
  scopeCount: number;
  policyRegistry: readonly SharedMentalModelSynchronizationPolicyRecord[];
  policyCount: number;
  referenceRegistry: readonly SharedMentalModelSynchronizationReferenceRecord[];
  referenceCount: number;
  manifestRegistry: readonly SharedMentalModelSynchronizationManifestRecord[];
  manifestCount: number;
  validationRegistry: readonly SharedMentalModelSynchronizationValidationRuleRecord[];
  validationCount: number;
  readOnly: true;
}>;

export type SharedMentalModelSynchronizationPlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./sharedMentalModelSynchronizationContracts.ts").SMM_SYNC_PLATFORM_ID;
  version: typeof SMM_SYNC_CONTRACT_VERSION;
  title: typeof import("./sharedMentalModelSynchronizationContracts.ts").SMM_SYNC_PLATFORM_NAME;
  goal: string;
  registryKeys: readonly string[];
  synchronizationCount: number;
  policyCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type SharedMentalModelSynchronizationValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type SharedMentalModelSynchronizationValidationReport = Readonly<{
  valid: boolean;
  issues: readonly SharedMentalModelSynchronizationValidationIssue[];
  readOnly: true;
}>;

export type SharedMentalModelSynchronizationLayerState = Readonly<{
  contractVersion: typeof SMM_SYNC_CONTRACT_VERSION;
  snapshotDependency: typeof import("./sharedMentalModelSynchronizationContracts.ts").SMM_SYNC_SNAPSHOT_DEPENDENCY;
  initialized: boolean;
  registry: SharedMentalModelSynchronizationRegistryBundle;
  timestamp: string;
  readOnly: true;
}>;

export type SharedMentalModelSynchronizationBuildResult = Readonly<{
  success: boolean;
  reason: string;
  data: SharedMentalModelSynchronizationLayerState | null;
  readOnly: true;
}>;

export type SharedMentalModelSynchronizationInput = Readonly<{
  synchronizationId: string;
  sourceReferenceId: string;
  targetReferenceId: string;
  synchronizationScope: SharedMentalModelSynchronizationScopeKey;
  synchronizationPolicy: SharedMentalModelSynchronizationPolicyKey;
  synchronizationStatusMetadata?: Readonly<Record<string, string>>;
  versionCompatibilityMetadata?: Readonly<Record<string, string>>;
  snapshotReferenceIds?: readonly string[];
  createdMetadata?: Readonly<Record<string, string>>;
  extensionMetadata?: Readonly<Record<string, string>>;
}>;

export type SharedMentalModelSynchronizationRegistrationResult<T> = Readonly<{
  success: boolean;
  reason: string;
  record: T | null;
  readOnly: true;
}>;
