/**
 * KNL-11 — Knowledge Versioning Platform domain types.
 */

import type {
  KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
  KNOWLEDGE_VERSIONING_NAMESPACE,
  VERSION_DEPENDENCY_KEYS,
  VERSION_EXTENSION_POINT_KEYS,
  VERSION_NAMESPACE_KEYS,
  VERSION_SCOPE_KEYS,
  VERSION_STATUS_KEYS,
  VERSIONED_ASSET_KEYS,
} from "./knowledgeVersioningCatalog.ts";

export type KnowledgeVersioningIdentifier = string;
export type VersionedAssetKey = (typeof VERSIONED_ASSET_KEYS)[number];
export type VersionScopeKey = (typeof VERSION_SCOPE_KEYS)[number];
export type VersionStatusKey = (typeof VERSION_STATUS_KEYS)[number];
export type VersionNamespaceKey = (typeof VERSION_NAMESPACE_KEYS)[number];
export type VersionDependencyKey = (typeof VERSION_DEPENDENCY_KEYS)[number];
export type VersionExtensionPointKey = (typeof VERSION_EXTENSION_POINT_KEYS)[number];
export type KnowledgeVersionLabel = typeof KNOWLEDGE_VERSIONING_CONTRACT_VERSION | string;

export type VersionMetadata = Readonly<{
  metadataId: KnowledgeVersioningIdentifier;
  metadataVersion: typeof KNOWLEDGE_VERSIONING_CONTRACT_VERSION;
  namespace: typeof KNOWLEDGE_VERSIONING_NAMESPACE | string;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type VersionNamespace = Readonly<{
  namespaceId: KnowledgeVersioningIdentifier;
  namespaceKey: VersionNamespaceKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_VERSIONING_CONTRACT_VERSION;
  metadata: VersionMetadata;
  readOnly: true;
}>;

export type VersionStatus = Readonly<{
  statusId: KnowledgeVersioningIdentifier;
  statusKey: VersionStatusKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_VERSIONING_CONTRACT_VERSION;
  metadata: VersionMetadata;
  readOnly: true;
}>;

export type KnowledgeVersion = Readonly<{
  versionId: KnowledgeVersioningIdentifier;
  assetKey: VersionedAssetKey;
  versionLabel: KnowledgeVersionLabel;
  platformId: string;
  scopeKey: VersionScopeKey;
  status: VersionStatusKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_VERSIONING_CONTRACT_VERSION;
  metadata: VersionMetadata;
  readOnly: true;
}>;

export type VersionLineage = Readonly<{
  lineageId: KnowledgeVersioningIdentifier;
  assetKey: VersionedAssetKey;
  versionLabel: KnowledgeVersionLabel;
  description: string;
  readOnly: true;
}>;

export type VersionDependency = Readonly<{
  dependencyId: KnowledgeVersioningIdentifier;
  dependencyKey: VersionDependencyKey;
  assetKey: VersionedAssetKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_VERSIONING_CONTRACT_VERSION;
  metadata: VersionMetadata;
  readOnly: true;
}>;

export type VersionChangeDescriptor = Readonly<{
  changeId: KnowledgeVersioningIdentifier;
  label: string;
  description: string;
  readOnly: true;
}>;

export type VersionedKnowledgeAsset = Readonly<{
  assetId: KnowledgeVersioningIdentifier;
  assetKey: VersionedAssetKey;
  assetName: string;
  platformId: string;
  versionLabel: KnowledgeVersionLabel;
  scopeKey: VersionScopeKey;
  status: VersionStatusKey;
  label: string;
  description: string;
  lineage: VersionLineage;
  changeDescriptor: VersionChangeDescriptor;
  version: typeof KNOWLEDGE_VERSIONING_CONTRACT_VERSION;
  metadata: VersionMetadata;
  readOnly: true;
}>;

export type VersionCompatibility = Readonly<{
  compatibilityId: KnowledgeVersioningIdentifier;
  assetKey: VersionedAssetKey;
  versionLabel: KnowledgeVersionLabel;
  compatibleWithVersion: KnowledgeVersionLabel;
  platformId: string;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_VERSIONING_CONTRACT_VERSION;
  metadata: VersionMetadata;
  readOnly: true;
}>;

export type VersionReleaseDescriptor = Readonly<{
  releaseId: KnowledgeVersioningIdentifier;
  assetKey: VersionedAssetKey;
  versionLabel: KnowledgeVersionLabel;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_VERSIONING_CONTRACT_VERSION;
  metadata: VersionMetadata;
  readOnly: true;
}>;

export type VersionExtensionPoint = Readonly<{
  extensionPointId: KnowledgeVersioningIdentifier;
  extensionPointKey: VersionExtensionPointKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_VERSIONING_CONTRACT_VERSION;
  metadata: VersionMetadata;
  readOnly: true;
}>;

export type VersionManifest = Readonly<{
  platformId: typeof import("./knowledgeVersioningCatalog.ts").KNOWLEDGE_VERSIONING_PLATFORM_ID;
  platformName: typeof import("./knowledgeVersioningCatalog.ts").KNOWLEDGE_VERSIONING_PLATFORM_NAME;
  namespace: typeof KNOWLEDGE_VERSIONING_NAMESPACE;
  contractVersion: typeof KNOWLEDGE_VERSIONING_CONTRACT_VERSION;
  architectureVersion: typeof import("./knowledgeVersioningCatalog.ts").KNOWLEDGE_VERSIONING_ARCHITECTURE_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  frameworkDependency: "KNL/6";
  policyDependency: "KNL/7";
  bestPracticeDependency: "KNL/8";
  retrievalDependency: "KNL/9";
  validationDependency: "KNL/10";
  supportedAssets: readonly VersionedAssetKey[];
  supportedScopes: readonly VersionScopeKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  governanceRules: readonly Readonly<{ ruleId: string; description: string; enforced: true }>[];
  futurePhases: readonly string[];
  generatedAt: string;
  readOnly: true;
}>;

export type KnowledgeVersioningIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type KnowledgeVersioningValidationResult = Readonly<{
  valid: boolean;
  issues: readonly KnowledgeVersioningIssue[];
  readOnly: true;
}>;

export type KnowledgeVersioningResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type KnowledgeVersionRegistrationInput = Readonly<{
  versionId: KnowledgeVersioningIdentifier;
  assetKey: VersionedAssetKey;
  versionLabel: KnowledgeVersionLabel;
  platformId: string;
  scopeKey: VersionScopeKey;
  status: VersionStatusKey;
  label: string;
  description: string;
}>;

export type VersionedKnowledgeAssetRegistrationInput = Readonly<{
  assetId: KnowledgeVersioningIdentifier;
  assetKey: VersionedAssetKey;
  assetName: string;
  platformId: string;
  versionLabel: KnowledgeVersionLabel;
  scopeKey: VersionScopeKey;
  status: VersionStatusKey;
  label: string;
  description: string;
  lineageDescription: string;
  changeDescription: string;
}>;

export type KnowledgeVersionCompatibilityRegistrationInput = Readonly<{
  compatibilityId: KnowledgeVersioningIdentifier;
  assetKey: VersionedAssetKey;
  versionLabel: KnowledgeVersionLabel;
  compatibleWithVersion: KnowledgeVersionLabel;
  platformId: string;
  label: string;
  description: string;
}>;

export type KnowledgeVersioningPlatformSnapshot = Readonly<{
  platformVersion: typeof KNOWLEDGE_VERSIONING_CONTRACT_VERSION;
  versionCount: number;
  assetCount: number;
  compatibilityCount: number;
  dependencyCount: number;
  releaseCount: number;
  namespaceCount: number;
  statusCount: number;
  readOnly: true;
}>;

export type KnowledgeVersioningPlatformState = Readonly<{
  platformId: typeof import("./knowledgeVersioningCatalog.ts").KNOWLEDGE_VERSIONING_PLATFORM_ID;
  contractVersion: typeof KNOWLEDGE_VERSIONING_CONTRACT_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  frameworkDependency: "KNL/6";
  policyDependency: "KNL/7";
  bestPracticeDependency: "KNL/8";
  retrievalDependency: "KNL/9";
  validationDependency: "KNL/10";
  initialized: boolean;
  versionCount: number;
  assetCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type KnowledgeVersioningPlatformValidationReport = Readonly<{
  valid: boolean;
  foundationValid: boolean;
  ontologyValid: boolean;
  vocabularyValid: boolean;
  graphValid: boolean;
  industryValid: boolean;
  frameworkValid: boolean;
  policyValid: boolean;
  bestPracticeValid: boolean;
  retrievalValid: boolean;
  validationValid: boolean;
  platformInitialized: boolean;
  registryValid: boolean;
  identityValid: boolean;
  issues: readonly KnowledgeVersioningIssue[];
  readOnly: true;
}>;
