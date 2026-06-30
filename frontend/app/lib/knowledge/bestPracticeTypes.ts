/**
 * KNL-8 — Best Practices domain types.
 */

import type {
  BEST_PRACTICE_CATEGORY_KEYS,
  BEST_PRACTICE_CONTEXT_KEYS,
  BEST_PRACTICE_CONTRACT_VERSION,
  BEST_PRACTICE_EXTENSION_POINT_KEYS,
  BEST_PRACTICE_NAMESPACE,
  BEST_PRACTICE_NAMESPACE_KEYS,
  BEST_PRACTICE_SOURCE_KEYS,
} from "./bestPracticeCatalog.ts";

export type BestPracticeIdentifier = string;
export type BestPracticeCategoryKey = (typeof BEST_PRACTICE_CATEGORY_KEYS)[number];
export type BestPracticeSourceKey = (typeof BEST_PRACTICE_SOURCE_KEYS)[number];
export type BestPracticeContextKey = (typeof BEST_PRACTICE_CONTEXT_KEYS)[number];
export type BestPracticeNamespaceKey = (typeof BEST_PRACTICE_NAMESPACE_KEYS)[number];
export type BestPracticeExtensionPointKey = (typeof BEST_PRACTICE_EXTENSION_POINT_KEYS)[number];
export type BestPracticeVersion = typeof BEST_PRACTICE_CONTRACT_VERSION | string;

export type BestPracticeMetadata = Readonly<{
  metadataId: BestPracticeIdentifier;
  metadataVersion: typeof BEST_PRACTICE_CONTRACT_VERSION;
  namespace: typeof BEST_PRACTICE_NAMESPACE | string;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type BestPracticeNamespace = Readonly<{
  namespaceId: BestPracticeIdentifier;
  namespaceKey: BestPracticeNamespaceKey;
  label: string;
  description: string;
  version: typeof BEST_PRACTICE_CONTRACT_VERSION;
  metadata: BestPracticeMetadata;
  readOnly: true;
}>;

export type BestPracticeCategory = Readonly<{
  categoryId: BestPracticeIdentifier;
  categoryKey: BestPracticeCategoryKey;
  label: string;
  description: string;
  version: typeof BEST_PRACTICE_CONTRACT_VERSION;
  metadata: BestPracticeMetadata;
  readOnly: true;
}>;

export type BestPracticeOwner = Readonly<{
  ownerId: BestPracticeIdentifier;
  label: string;
  description: string;
  version: typeof BEST_PRACTICE_CONTRACT_VERSION;
  metadata: BestPracticeMetadata;
  readOnly: true;
}>;

export type BestPracticeSource = Readonly<{
  sourceId: BestPracticeIdentifier;
  sourceKey: BestPracticeSourceKey;
  label: string;
  description: string;
  version: typeof BEST_PRACTICE_CONTRACT_VERSION;
  metadata: BestPracticeMetadata;
  readOnly: true;
}>;

export type BestPracticePrinciple = Readonly<{
  principleId: BestPracticeIdentifier;
  label: string;
  description: string;
  categoryKey: BestPracticeCategoryKey;
  version: typeof BEST_PRACTICE_CONTRACT_VERSION;
  metadata: BestPracticeMetadata;
  readOnly: true;
}>;

export type BestPracticeGuideline = Readonly<{
  guidelineId: BestPracticeIdentifier;
  label: string;
  description: string;
  readOnly: true;
}>;

export type BestPracticeRecommendation = Readonly<{
  recommendationId: BestPracticeIdentifier;
  description: string;
  readOnly: true;
}>;

export type BestPracticeContext = Readonly<{
  contextId: BestPracticeIdentifier;
  contextKey: BestPracticeContextKey;
  label: string;
  description: string;
  readOnly: true;
}>;

export type BestPracticeIndustryMapping = Readonly<{
  mappingId: BestPracticeIdentifier;
  industryModelId: string;
  description: string;
  readOnly: true;
}>;

export type BestPracticeFrameworkMapping = Readonly<{
  mappingId: BestPracticeIdentifier;
  frameworkId: string;
  description: string;
  readOnly: true;
}>;

export type BestPracticePolicyMapping = Readonly<{
  mappingId: BestPracticeIdentifier;
  policyId: string;
  description: string;
  readOnly: true;
}>;

export type BestPracticeKpiMapping = Readonly<{
  mappingId: BestPracticeIdentifier;
  kpiLabel: string;
  description: string;
  readOnly: true;
}>;

export type BestPracticeRiskMapping = Readonly<{
  mappingId: BestPracticeIdentifier;
  riskLabel: string;
  description: string;
  readOnly: true;
}>;

export type BestPracticeTemplate = Readonly<{
  templateId: BestPracticeIdentifier;
  practiceId: BestPracticeIdentifier;
  categoryKey: BestPracticeCategoryKey;
  label: string;
  description: string;
  version: typeof BEST_PRACTICE_CONTRACT_VERSION;
  metadata: BestPracticeMetadata;
  readOnly: true;
}>;

export type BestPractice = Readonly<{
  practiceId: BestPracticeIdentifier;
  categoryKey: BestPracticeCategoryKey;
  canonicalName: string;
  label: string;
  description: string;
  principle: BestPracticePrinciple;
  guideline: BestPracticeGuideline;
  recommendation: BestPracticeRecommendation;
  context: BestPracticeContext;
  industryMapping: BestPracticeIndustryMapping;
  frameworkMapping: BestPracticeFrameworkMapping;
  policyMapping: BestPracticePolicyMapping;
  kpiMapping: BestPracticeKpiMapping;
  riskMapping: BestPracticeRiskMapping;
  ownerId: BestPracticeIdentifier | null;
  sourceId: BestPracticeIdentifier | null;
  ontologyEntityId: string | null;
  version: typeof BEST_PRACTICE_CONTRACT_VERSION;
  metadata: BestPracticeMetadata;
  readOnly: true;
}>;

export type BestPracticeExtensionPoint = Readonly<{
  extensionPointId: BestPracticeIdentifier;
  extensionPointKey: BestPracticeExtensionPointKey;
  label: string;
  description: string;
  version: typeof BEST_PRACTICE_CONTRACT_VERSION;
  metadata: BestPracticeMetadata;
  readOnly: true;
}>;

export type BestPracticeManifest = Readonly<{
  platformId: typeof import("./bestPracticeCatalog.ts").BEST_PRACTICE_PLATFORM_ID;
  platformName: typeof import("./bestPracticeCatalog.ts").BEST_PRACTICE_PLATFORM_NAME;
  namespace: typeof BEST_PRACTICE_NAMESPACE;
  contractVersion: typeof BEST_PRACTICE_CONTRACT_VERSION;
  architectureVersion: typeof import("./bestPracticeCatalog.ts").BEST_PRACTICE_ARCHITECTURE_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  frameworkDependency: "KNL/6";
  policyDependency: "KNL/7";
  supportedCategories: readonly BestPracticeCategoryKey[];
  supportedSources: readonly BestPracticeSourceKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  governanceRules: readonly Readonly<{ ruleId: string; description: string; enforced: true }>[];
  futurePhases: readonly string[];
  generatedAt: string;
  readOnly: true;
}>;

export type BestPracticeValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type BestPracticeValidationResult = Readonly<{
  valid: boolean;
  issues: readonly BestPracticeValidationIssue[];
  readOnly: true;
}>;

export type BestPracticeResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type BestPracticeRegistrationInput = Readonly<{
  practiceId: BestPracticeIdentifier;
  categoryKey: BestPracticeCategoryKey;
  canonicalName: string;
  label: string;
  description: string;
  principleLabel: string;
  principleDescription: string;
  guidelineLabel: string;
  guidelineDescription: string;
  recommendationDescription: string;
  contextKey: BestPracticeContextKey;
  contextDescription: string;
  kpiLabel: string;
  kpiDescription: string;
  riskLabel: string;
  riskDescription: string;
  ownerId?: string;
  sourceId?: string;
  ontologyEntityId?: string;
  frameworkId?: string;
  policyId?: string;
  industryModelId?: string;
}>;

export type BestPracticeTemplateRegistrationInput = Readonly<{
  templateId: BestPracticeIdentifier;
  practiceId: BestPracticeIdentifier;
  categoryKey: BestPracticeCategoryKey;
  label: string;
  description: string;
}>;

export type BestPracticeCategoryRegistrationInput = Readonly<{
  categoryId: BestPracticeIdentifier;
  categoryKey: BestPracticeCategoryKey;
  label: string;
  description: string;
}>;

export type BestPracticePlatformSnapshot = Readonly<{
  platformVersion: typeof BEST_PRACTICE_CONTRACT_VERSION;
  practiceCount: number;
  templateCount: number;
  categoryCount: number;
  principleCount: number;
  sourceCount: number;
  ownerCount: number;
  namespaceCount: number;
  readOnly: true;
}>;

export type BestPracticePlatformState = Readonly<{
  platformId: typeof import("./bestPracticeCatalog.ts").BEST_PRACTICE_PLATFORM_ID;
  contractVersion: typeof BEST_PRACTICE_CONTRACT_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  frameworkDependency: "KNL/6";
  policyDependency: "KNL/7";
  initialized: boolean;
  practiceCount: number;
  templateCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type BestPracticePlatformValidationReport = Readonly<{
  valid: boolean;
  foundationValid: boolean;
  ontologyValid: boolean;
  vocabularyValid: boolean;
  graphValid: boolean;
  industryValid: boolean;
  frameworkValid: boolean;
  policyValid: boolean;
  platformInitialized: boolean;
  registryValid: boolean;
  identityValid: boolean;
  issues: readonly BestPracticeValidationIssue[];
  readOnly: true;
}>;
