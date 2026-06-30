/**
 * KNL-10 — Knowledge Validation Platform domain types.
 */

import type {
  KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
  KNOWLEDGE_VALIDATION_NAMESPACE,
  VALIDATION_CATEGORY_KEYS,
  VALIDATION_DEPENDENCY_KEYS,
  VALIDATION_EXTENSION_POINT_KEYS,
  VALIDATION_NAMESPACE_KEYS,
  VALIDATION_PROFILE_KEYS,
  VALIDATION_SCOPE_KEYS,
  VALIDATION_SEVERITY_KEYS,
  VALIDATION_STATUS_KEYS,
  VALIDATION_TARGET_KEYS,
} from "./knowledgeValidationPlatformCatalog.ts";

export type KnowledgeValidationIdentifier = string;
export type ValidationProfileKey = (typeof VALIDATION_PROFILE_KEYS)[number];
export type ValidationCategoryKey = (typeof VALIDATION_CATEGORY_KEYS)[number];
export type ValidationScopeKey = (typeof VALIDATION_SCOPE_KEYS)[number];
export type ValidationTargetKey = (typeof VALIDATION_TARGET_KEYS)[number];
export type ValidationSeverityKey = (typeof VALIDATION_SEVERITY_KEYS)[number];
export type ValidationStatusKey = (typeof VALIDATION_STATUS_KEYS)[number];
export type ValidationNamespaceKey = (typeof VALIDATION_NAMESPACE_KEYS)[number];
export type ValidationDependencyKey = (typeof VALIDATION_DEPENDENCY_KEYS)[number];
export type ValidationExtensionPointKey = (typeof VALIDATION_EXTENSION_POINT_KEYS)[number];
export type KnowledgeValidationVersion = typeof KNOWLEDGE_VALIDATION_CONTRACT_VERSION | string;

export type ValidationMetadata = Readonly<{
  metadataId: KnowledgeValidationIdentifier;
  metadataVersion: typeof KNOWLEDGE_VALIDATION_CONTRACT_VERSION;
  namespace: typeof KNOWLEDGE_VALIDATION_NAMESPACE | string;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type ValidationNamespace = Readonly<{
  namespaceId: KnowledgeValidationIdentifier;
  namespaceKey: ValidationNamespaceKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_VALIDATION_CONTRACT_VERSION;
  metadata: ValidationMetadata;
  readOnly: true;
}>;

export type ValidationCategory = Readonly<{
  categoryId: KnowledgeValidationIdentifier;
  categoryKey: ValidationCategoryKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_VALIDATION_CONTRACT_VERSION;
  metadata: ValidationMetadata;
  readOnly: true;
}>;

export type ValidationScope = Readonly<{
  scopeId: KnowledgeValidationIdentifier;
  scopeKey: ValidationScopeKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_VALIDATION_CONTRACT_VERSION;
  metadata: ValidationMetadata;
  readOnly: true;
}>;

export type ValidationTarget = Readonly<{
  targetId: KnowledgeValidationIdentifier;
  targetKey: ValidationTargetKey;
  platformId: string;
  profileKey: ValidationProfileKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_VALIDATION_CONTRACT_VERSION;
  metadata: ValidationMetadata;
  readOnly: true;
}>;

export type ValidationDependency = Readonly<{
  dependencyId: KnowledgeValidationIdentifier;
  dependencyKey: ValidationDependencyKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_VALIDATION_CONTRACT_VERSION;
  metadata: ValidationMetadata;
  readOnly: true;
}>;

export type ValidationResultDescriptor = Readonly<{
  descriptorId: KnowledgeValidationIdentifier;
  label: string;
  description: string;
  readOnly: true;
}>;

export type KnowledgeValidationProfile = Readonly<{
  profileId: KnowledgeValidationIdentifier;
  profileKey: ValidationProfileKey;
  profileName: string;
  label: string;
  description: string;
  categoryKey: ValidationCategoryKey;
  scopeKey: ValidationScopeKey;
  targetKey: ValidationTargetKey;
  dependencyKey: ValidationDependencyKey;
  platformId: string;
  status: ValidationStatusKey;
  resultDescriptor: ValidationResultDescriptor;
  version: typeof KNOWLEDGE_VALIDATION_CONTRACT_VERSION;
  metadata: ValidationMetadata;
  readOnly: true;
}>;

export type ValidationRule = Readonly<{
  ruleId: KnowledgeValidationIdentifier;
  profileId: KnowledgeValidationIdentifier;
  profileKey: ValidationProfileKey;
  ruleName: string;
  label: string;
  description: string;
  categoryKey: ValidationCategoryKey;
  scopeKey: ValidationScopeKey;
  severity: ValidationSeverityKey;
  status: ValidationStatusKey;
  resultDescriptor: ValidationResultDescriptor;
  version: typeof KNOWLEDGE_VALIDATION_CONTRACT_VERSION;
  metadata: ValidationMetadata;
  readOnly: true;
}>;

export type ValidationExtensionPoint = Readonly<{
  extensionPointId: KnowledgeValidationIdentifier;
  extensionPointKey: ValidationExtensionPointKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_VALIDATION_CONTRACT_VERSION;
  metadata: ValidationMetadata;
  readOnly: true;
}>;

export type ValidationManifest = Readonly<{
  platformId: typeof import("./knowledgeValidationPlatformCatalog.ts").KNOWLEDGE_VALIDATION_PLATFORM_ID;
  platformName: typeof import("./knowledgeValidationPlatformCatalog.ts").KNOWLEDGE_VALIDATION_PLATFORM_NAME;
  namespace: typeof KNOWLEDGE_VALIDATION_NAMESPACE;
  contractVersion: typeof KNOWLEDGE_VALIDATION_CONTRACT_VERSION;
  architectureVersion: typeof import("./knowledgeValidationPlatformCatalog.ts").KNOWLEDGE_VALIDATION_ARCHITECTURE_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  frameworkDependency: "KNL/6";
  policyDependency: "KNL/7";
  bestPracticeDependency: "KNL/8";
  retrievalDependency: "KNL/9";
  supportedProfiles: readonly ValidationProfileKey[];
  supportedCategories: readonly ValidationCategoryKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  governanceRules: readonly Readonly<{ ruleId: string; description: string; enforced: true }>[];
  futurePhases: readonly string[];
  generatedAt: string;
  readOnly: true;
}>;

export type KnowledgeValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type KnowledgeValidationResult = Readonly<{
  valid: boolean;
  issues: readonly KnowledgeValidationIssue[];
  readOnly: true;
}>;

export type KnowledgeValidationPlatformResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type KnowledgeValidationProfileRegistrationInput = Readonly<{
  profileId: KnowledgeValidationIdentifier;
  profileKey: ValidationProfileKey;
  profileName: string;
  label: string;
  description: string;
  categoryKey: ValidationCategoryKey;
  scopeKey: ValidationScopeKey;
  targetKey: ValidationTargetKey;
  dependencyKey: ValidationDependencyKey;
  platformId: string;
  status: ValidationStatusKey;
  resultDescriptorLabel: string;
  resultDescriptorDescription: string;
}>;

export type KnowledgeValidationRuleRegistrationInput = Readonly<{
  ruleId: KnowledgeValidationIdentifier;
  profileId: KnowledgeValidationIdentifier;
  profileKey: ValidationProfileKey;
  ruleName: string;
  label: string;
  description: string;
  categoryKey: ValidationCategoryKey;
  scopeKey: ValidationScopeKey;
  severity: ValidationSeverityKey;
  status: ValidationStatusKey;
  resultDescriptorLabel: string;
  resultDescriptorDescription: string;
}>;

export type KnowledgeValidationCategoryRegistrationInput = Readonly<{
  categoryId: KnowledgeValidationIdentifier;
  categoryKey: ValidationCategoryKey;
  label: string;
  description: string;
}>;

export type KnowledgeValidationPlatformSnapshot = Readonly<{
  platformVersion: typeof KNOWLEDGE_VALIDATION_CONTRACT_VERSION;
  profileCount: number;
  ruleCount: number;
  categoryCount: number;
  scopeCount: number;
  targetCount: number;
  namespaceCount: number;
  dependencyCount: number;
  readOnly: true;
}>;

export type KnowledgeValidationPlatformState = Readonly<{
  platformId: typeof import("./knowledgeValidationPlatformCatalog.ts").KNOWLEDGE_VALIDATION_PLATFORM_ID;
  contractVersion: typeof KNOWLEDGE_VALIDATION_CONTRACT_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  frameworkDependency: "KNL/6";
  policyDependency: "KNL/7";
  bestPracticeDependency: "KNL/8";
  retrievalDependency: "KNL/9";
  initialized: boolean;
  profileCount: number;
  ruleCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type KnowledgeValidationPlatformValidationReport = Readonly<{
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
  platformInitialized: boolean;
  registryValid: boolean;
  identityValid: boolean;
  issues: readonly KnowledgeValidationIssue[];
  readOnly: true;
}>;
