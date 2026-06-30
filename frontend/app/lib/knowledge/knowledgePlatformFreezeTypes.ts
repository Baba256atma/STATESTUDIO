/**
 * KNL-15 — Knowledge Platform Freeze domain types.
 */

import type {
  COMPATIBILITY_CONSUMER_KEYS,
  EXTENSION_POLICY_KEYS,
  FREEZE_DEPENDENCY_KEYS,
  FREEZE_STATUS_KEYS,
  KNL_FROZEN_PHASE_KEYS,
  KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
  KNOWLEDGE_PLATFORM_FREEZE_NAMESPACE,
  KNOWLEDGE_PLATFORM_RELEASE_TAG,
  KNOWLEDGE_PLATFORM_RELEASE_VERSION,
} from "./knowledgePlatformFreezeCatalog.ts";

export type KnowledgePlatformFreezeIdentifier = string;
export type KnlFrozenPhaseKey = (typeof KNL_FROZEN_PHASE_KEYS)[number];
export type FreezeStatusKey = (typeof FREEZE_STATUS_KEYS)[number];
export type FreezeDependencyKey = (typeof FREEZE_DEPENDENCY_KEYS)[number];
export type CompatibilityConsumerKey = (typeof COMPATIBILITY_CONSUMER_KEYS)[number];
export type ExtensionPolicyKey = (typeof EXTENSION_POLICY_KEYS)[number];

export type FreezeMetadata = Readonly<{
  metadataId: KnowledgePlatformFreezeIdentifier;
  metadataVersion: typeof KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION;
  namespace: typeof KNOWLEDGE_PLATFORM_FREEZE_NAMESPACE | string;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type FreezeIdentity = Readonly<{
  identityId: KnowledgePlatformFreezeIdentifier;
  layerId: "KNL";
  platformId: string;
  platformName: string;
  releaseVersion: typeof KNOWLEDGE_PLATFORM_RELEASE_VERSION;
  releaseTag: typeof KNOWLEDGE_PLATFORM_RELEASE_TAG;
  contractVersion: typeof KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type PlatformIdentity = Readonly<{
  platformId: string;
  platformName: string;
  layerId: "KNL";
  releaseVersion: typeof KNOWLEDGE_PLATFORM_RELEASE_VERSION;
  readOnly: true;
}>;

export type ReleaseTag = Readonly<{
  tagId: KnowledgePlatformFreezeIdentifier;
  tag: typeof KNOWLEDGE_PLATFORM_RELEASE_TAG;
  label: string;
  description: string;
  readOnly: true;
}>;

export type ReleaseMetadata = Readonly<{
  releaseId: KnowledgePlatformFreezeIdentifier;
  releaseVersion: typeof KNOWLEDGE_PLATFORM_RELEASE_VERSION;
  releaseTag: typeof KNOWLEDGE_PLATFORM_RELEASE_TAG;
  releaseDate: string;
  status: "released";
  contractVersion: typeof KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION;
  metadata: FreezeMetadata;
  readOnly: true;
}>;

export type FreezeDependency = Readonly<{
  dependencyId: KnowledgePlatformFreezeIdentifier;
  dependencyKey: FreezeDependencyKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION;
  metadata: FreezeMetadata;
  readOnly: true;
}>;

export type FreezeStatus = Readonly<{
  statusId: KnowledgePlatformFreezeIdentifier;
  statusKey: FreezeStatusKey;
  label: string;
  description: string;
  readOnly: true;
}>;

export type FreezeCompatibility = Readonly<{
  compatibilityId: KnowledgePlatformFreezeIdentifier;
  consumerKey: CompatibilityConsumerKey;
  knlVersion: typeof KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION;
  platformReference: string;
  label: string;
  description: string;
  compatible: true;
  readOnly: true;
}>;

export type CompatibilityMatrixEntry = Readonly<{
  entryId: KnowledgePlatformFreezeIdentifier;
  consumerKey: CompatibilityConsumerKey;
  consumerLabel: string;
  knlVersion: typeof KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION;
  platformReference: string;
  compatible: true;
  readOnly: true;
}>;

export type CompatibilityMatrix = Readonly<{
  matrixId: KnowledgePlatformFreezeIdentifier;
  releaseVersion: typeof KNOWLEDGE_PLATFORM_RELEASE_VERSION;
  entries: readonly CompatibilityMatrixEntry[];
  contractVersion: typeof KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type PlatformRegistryEntry = Readonly<{
  registryEntryId: KnowledgePlatformFreezeIdentifier;
  phaseKey: KnlFrozenPhaseKey;
  phaseId: string;
  platformId: string;
  label: string;
  frozen: true;
  readOnly: true;
}>;

export type PlatformRegistry = Readonly<{
  registryId: KnowledgePlatformFreezeIdentifier;
  entries: readonly PlatformRegistryEntry[];
  contractVersion: typeof KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExtensionPolicy = Readonly<{
  policyId: KnowledgePlatformFreezeIdentifier;
  policyKey: ExtensionPolicyKey;
  label: string;
  description: string;
  enforced: true;
  readOnly: true;
}>;

export type FreezeManifest = Readonly<{
  manifestId: KnowledgePlatformFreezeIdentifier;
  platformIdentity: PlatformIdentity;
  releaseMetadata: ReleaseMetadata;
  releaseTag: ReleaseTag;
  certifiedPhases: readonly Readonly<{ phaseKey: KnlFrozenPhaseKey; phaseId: string; platformId: string; label: string }>[];
  dependencyChain: readonly FreezeDependencyKey[];
  compatibilityMatrix: CompatibilityMatrix;
  platformRegistry: PlatformRegistry;
  extensionPolicy: readonly ExtensionPolicy[];
  governanceSummary: Readonly<{ status: string; policiesRegistered: number; contractVersion: string }>;
  certificationSummary: Readonly<{ status: string; phasesCertified: number; gatesPassed: number; contractVersion: string }>;
  contractVersion: typeof KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION;
  generatedAt: string;
  readOnly: true;
}>;

export type FreezeValidationResult = Readonly<{
  valid: boolean;
  certificationPassed: boolean;
  phasesComplete: boolean;
  manifestComplete: boolean;
  compatibilityComplete: boolean;
  releaseMetadataComplete: boolean;
  issues: readonly FreezeValidationIssue[];
  readOnly: true;
}>;

export type FreezeValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type KnowledgePlatformFreezeRunResult = Readonly<{
  success: boolean;
  reason: string;
  frozen: boolean;
  released: boolean;
  phasesFrozen: number;
  totalPhases: number;
  readOnly: true;
}>;

export type KnowledgePlatformFreezePlatformValidationReport = Readonly<{
  valid: boolean;
  certificationValid: boolean;
  platformInitialized: boolean;
  freezeValid: boolean;
  identityValid: boolean;
  issues: readonly FreezeValidationIssue[];
  readOnly: true;
}>;

export type KnowledgePlatformFreezePublicManifest = Readonly<{
  platformId: typeof import("./knowledgePlatformFreezeCatalog.ts").KNOWLEDGE_PLATFORM_FREEZE_PLATFORM_ID;
  platformName: typeof import("./knowledgePlatformFreezeCatalog.ts").KNOWLEDGE_PLATFORM_FREEZE_PLATFORM_NAME;
  namespace: typeof KNOWLEDGE_PLATFORM_FREEZE_NAMESPACE;
  contractVersion: typeof KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION;
  architectureVersion: typeof import("./knowledgePlatformFreezeCatalog.ts").KNOWLEDGE_PLATFORM_FREEZE_ARCHITECTURE_VERSION;
  certificationDependency: "KNL/14";
  releaseVersion: typeof KNOWLEDGE_PLATFORM_RELEASE_VERSION;
  releaseTag: typeof KNOWLEDGE_PLATFORM_RELEASE_TAG;
  frozenPhases: readonly KnlFrozenPhaseKey[];
  compatibilityConsumers: readonly CompatibilityConsumerKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  governanceRules: readonly Readonly<{ ruleId: string; description: string; enforced: true }>[];
  generatedAt: string;
  readOnly: true;
}>;
