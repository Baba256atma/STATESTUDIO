/**
 * SMM-3 — Registry & Identity Engine domain types.
 */

import type {
  SMM_IDENTITY_CONTRACT_VERSION,
  SMM_IDENTITY_REGISTRY_KEYS,
  SMM_IDENTITY_REFERENCE_TYPE_KEYS,
} from "./sharedMentalModelIdentityContracts.ts";

export type SharedMentalModelIdentityRegistryKey = (typeof SMM_IDENTITY_REGISTRY_KEYS)[number];
export type SharedMentalModelReferenceTypeKey = (typeof SMM_IDENTITY_REFERENCE_TYPE_KEYS)[number];

export type SharedMentalModelIdentityRecord = Readonly<{
  modelId: string;
  modelVersion: string;
  parentReferenceId: string | null;
  originMetadata: Readonly<Record<string, string>>;
  workspaceReferenceId: string;
  organizationReferenceId: string;
  executiveReferenceId: string | null;
  snapshotReferenceId: string;
  createdAt: string;
  extensionMetadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type SharedMentalModelReferenceRecord = Readonly<{
  referenceId: string;
  referenceType: SharedMentalModelReferenceTypeKey;
  targetId: string;
  contentRef: string;
  modelId: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelSnapshotRecord = Readonly<{
  snapshotId: string;
  modelId: string;
  modelVersion: string;
  payloadRef: string;
  capturedAt: string;
  readOnly: true;
}>;

export type SharedMentalModelVersionRecord = Readonly<{
  versionId: string;
  modelId: string;
  versionLabel: string;
  parentVersionId: string | null;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelArtifactRecord = Readonly<{
  artifactId: string;
  modelId: string;
  artifactTypeKey: string;
  contentRef: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelScopeRegistrationRecord = Readonly<{
  registrationId: string;
  modelId: string;
  scopeRef: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelIdentityRegistryBundle = Readonly<{
  identityRegistry: readonly SharedMentalModelIdentityRecord[];
  identityCount: number;
  referenceRegistry: readonly SharedMentalModelReferenceRecord[];
  referenceCount: number;
  snapshotRegistry: readonly SharedMentalModelSnapshotRecord[];
  snapshotCount: number;
  versionRegistry: readonly SharedMentalModelVersionRecord[];
  versionCount: number;
  artifactRegistry: readonly SharedMentalModelArtifactRecord[];
  artifactCount: number;
  executiveRegistry: readonly SharedMentalModelScopeRegistrationRecord[];
  executiveCount: number;
  workspaceRegistry: readonly SharedMentalModelScopeRegistrationRecord[];
  workspaceCount: number;
  organizationRegistry: readonly SharedMentalModelScopeRegistrationRecord[];
  organizationCount: number;
  scenarioRegistry: readonly SharedMentalModelScopeRegistrationRecord[];
  scenarioCount: number;
  readOnly: true;
}>;

export type SharedMentalModelRegistryManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./sharedMentalModelIdentityContracts.ts").SMM_IDENTITY_PLATFORM_ID;
  version: typeof SMM_IDENTITY_CONTRACT_VERSION;
  title: typeof import("./sharedMentalModelIdentityContracts.ts").SMM_IDENTITY_PLATFORM_NAME;
  goal: string;
  registryKeys: readonly string[];
  identityCount: number;
  referenceCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type SharedMentalModelReferenceResolution = Readonly<{
  success: boolean;
  reason: string;
  reference: SharedMentalModelReferenceRecord | null;
  readOnly: true;
}>;

export type SharedMentalModelIdentityValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type SharedMentalModelIdentityValidationReport = Readonly<{
  valid: boolean;
  issues: readonly SharedMentalModelIdentityValidationIssue[];
  readOnly: true;
}>;

export type SharedMentalModelIdentityLayerState = Readonly<{
  contractVersion: typeof SMM_IDENTITY_CONTRACT_VERSION;
  domainDependency: typeof import("./sharedMentalModelIdentityContracts.ts").SMM_IDENTITY_DOMAIN_DEPENDENCY;
  initialized: boolean;
  registry: SharedMentalModelIdentityRegistryBundle;
  timestamp: string;
  readOnly: true;
}>;

export type SharedMentalModelIdentityBuildResult = Readonly<{
  success: boolean;
  reason: string;
  data: SharedMentalModelIdentityLayerState | null;
  readOnly: true;
}>;

export type SharedMentalModelIdentityInput = Readonly<{
  modelId: string;
  modelVersion: string;
  parentReferenceId?: string | null;
  originMetadata?: Readonly<Record<string, string>>;
  workspaceReferenceId: string;
  organizationReferenceId: string;
  executiveReferenceId?: string | null;
  snapshotReferenceId: string;
  extensionMetadata?: Readonly<Record<string, string>>;
}>;

export type SharedMentalModelReferenceInput = Readonly<{
  referenceId: string;
  referenceType: SharedMentalModelReferenceTypeKey;
  targetId: string;
  contentRef: string;
  modelId: string;
}>;

export type SharedMentalModelRegistrationResult<T> = Readonly<{
  success: boolean;
  reason: string;
  record: T | null;
  readOnly: true;
}>;
