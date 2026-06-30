/**
 * KNL-9 — Knowledge Retrieval Engine domain types.
 */

import type {
  KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
  KNOWLEDGE_RETRIEVAL_NAMESPACE,
  RETRIEVAL_CATEGORY_KEYS,
  RETRIEVAL_EXTENSION_POINT_KEYS,
  RETRIEVAL_FILTER_KEYS,
  RETRIEVAL_NAMESPACE_KEYS,
  RETRIEVAL_SELECTOR_KEYS,
  RETRIEVAL_SOURCE_KEYS,
  RETRIEVAL_TARGET_KEYS,
} from "./knowledgeRetrievalCatalog.ts";

export type KnowledgeRetrievalIdentifier = string;
export type RetrievalSourceKey = (typeof RETRIEVAL_SOURCE_KEYS)[number];
export type RetrievalCategoryKey = (typeof RETRIEVAL_CATEGORY_KEYS)[number];
export type RetrievalNamespaceKey = (typeof RETRIEVAL_NAMESPACE_KEYS)[number];
export type RetrievalFilterKey = (typeof RETRIEVAL_FILTER_KEYS)[number];
export type RetrievalSelectorKey = (typeof RETRIEVAL_SELECTOR_KEYS)[number];
export type RetrievalTargetKey = (typeof RETRIEVAL_TARGET_KEYS)[number];
export type RetrievalExtensionPointKey = (typeof RETRIEVAL_EXTENSION_POINT_KEYS)[number];
export type KnowledgeRetrievalVersion = typeof KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION | string;

export type KnowledgeRetrievalMetadata = Readonly<{
  metadataId: KnowledgeRetrievalIdentifier;
  metadataVersion: typeof KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION;
  namespace: typeof KNOWLEDGE_RETRIEVAL_NAMESPACE | string;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type KnowledgeRetrievalRequest = Readonly<{
  requestId: KnowledgeRetrievalIdentifier;
  sourceKey: RetrievalSourceKey;
  categoryKey: RetrievalCategoryKey;
  namespaceKey: RetrievalNamespaceKey;
  filterKey: RetrievalFilterKey | null;
  selectorKey: RetrievalSelectorKey | null;
  description: string;
  readOnly: true;
}>;

export type KnowledgeRetrievalTarget = Readonly<{
  targetId: KnowledgeRetrievalIdentifier;
  targetKey: RetrievalTargetKey;
  sourceKey: RetrievalSourceKey;
  platformId: string;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION;
  metadata: KnowledgeRetrievalMetadata;
  readOnly: true;
}>;

export type KnowledgeRetrievalSource = Readonly<{
  sourceId: KnowledgeRetrievalIdentifier;
  sourceKey: RetrievalSourceKey;
  platformId: string;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION;
  metadata: KnowledgeRetrievalMetadata;
  readOnly: true;
}>;

export type KnowledgeIndexEntry = Readonly<{
  entryId: KnowledgeRetrievalIdentifier;
  indexId: KnowledgeRetrievalIdentifier;
  sourceKey: RetrievalSourceKey;
  label: string;
  description: string;
  readOnly: true;
}>;

export type KnowledgeIndex = Readonly<{
  indexId: KnowledgeRetrievalIdentifier;
  indexName: string;
  sourceKey: RetrievalSourceKey;
  categoryKey: RetrievalCategoryKey;
  label: string;
  description: string;
  entries: readonly KnowledgeIndexEntry[];
  version: typeof KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION;
  metadata: KnowledgeRetrievalMetadata;
  readOnly: true;
}>;

export type KnowledgeNamespaceMapping = Readonly<{
  mappingId: KnowledgeRetrievalIdentifier;
  namespaceKey: RetrievalNamespaceKey;
  sourceKey: RetrievalSourceKey;
  description: string;
  readOnly: true;
}>;

export type KnowledgeCategoryMapping = Readonly<{
  mappingId: KnowledgeRetrievalIdentifier;
  categoryKey: RetrievalCategoryKey;
  sourceKey: RetrievalSourceKey;
  description: string;
  readOnly: true;
}>;

export type KnowledgeFilter = Readonly<{
  filterId: KnowledgeRetrievalIdentifier;
  filterKey: RetrievalFilterKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION;
  metadata: KnowledgeRetrievalMetadata;
  readOnly: true;
}>;

export type KnowledgeSelector = Readonly<{
  selectorId: KnowledgeRetrievalIdentifier;
  selectorKey: RetrievalSelectorKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION;
  metadata: KnowledgeRetrievalMetadata;
  readOnly: true;
}>;

export type KnowledgeResultDescriptor = Readonly<{
  descriptorId: KnowledgeRetrievalIdentifier;
  sourceKey: RetrievalSourceKey;
  label: string;
  description: string;
  readOnly: true;
}>;

export type KnowledgeRetrievalCategory = Readonly<{
  categoryId: KnowledgeRetrievalIdentifier;
  categoryKey: RetrievalCategoryKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION;
  metadata: KnowledgeRetrievalMetadata;
  readOnly: true;
}>;

export type KnowledgeRetrievalNamespace = Readonly<{
  namespaceId: KnowledgeRetrievalIdentifier;
  namespaceKey: RetrievalNamespaceKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION;
  metadata: KnowledgeRetrievalMetadata;
  readOnly: true;
}>;

export type KnowledgeRetrievalExtensionPoint = Readonly<{
  extensionPointId: KnowledgeRetrievalIdentifier;
  extensionPointKey: RetrievalExtensionPointKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION;
  metadata: KnowledgeRetrievalMetadata;
  readOnly: true;
}>;

export type KnowledgeRetrievalManifest = Readonly<{
  platformId: typeof import("./knowledgeRetrievalCatalog.ts").KNOWLEDGE_RETRIEVAL_ENGINE_ID;
  platformName: typeof import("./knowledgeRetrievalCatalog.ts").KNOWLEDGE_RETRIEVAL_ENGINE_NAME;
  namespace: typeof KNOWLEDGE_RETRIEVAL_NAMESPACE;
  contractVersion: typeof KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION;
  architectureVersion: typeof import("./knowledgeRetrievalCatalog.ts").KNOWLEDGE_RETRIEVAL_ARCHITECTURE_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  frameworkDependency: "KNL/6";
  policyDependency: "KNL/7";
  bestPracticeDependency: "KNL/8";
  supportedSources: readonly RetrievalSourceKey[];
  supportedCategories: readonly RetrievalCategoryKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  governanceRules: readonly Readonly<{ ruleId: string; description: string; enforced: true }>[];
  futurePhases: readonly string[];
  generatedAt: string;
  readOnly: true;
}>;

export type KnowledgeRetrievalValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type KnowledgeRetrievalValidationResult = Readonly<{
  valid: boolean;
  issues: readonly KnowledgeRetrievalValidationIssue[];
  readOnly: true;
}>;

export type KnowledgeRetrievalResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type KnowledgeRetrievalSourceRegistrationInput = Readonly<{
  sourceId: KnowledgeRetrievalIdentifier;
  sourceKey: RetrievalSourceKey;
  platformId: string;
  label: string;
  description: string;
}>;

export type KnowledgeIndexRegistrationInput = Readonly<{
  indexId: KnowledgeRetrievalIdentifier;
  indexName: string;
  sourceKey: RetrievalSourceKey;
  categoryKey: RetrievalCategoryKey;
  label: string;
  description: string;
  entryLabel?: string;
  entryDescription?: string;
}>;

export type KnowledgeCategoryRegistrationInput = Readonly<{
  categoryId: KnowledgeRetrievalIdentifier;
  categoryKey: RetrievalCategoryKey;
  label: string;
  description: string;
}>;

export type KnowledgeRetrievalEngineSnapshot = Readonly<{
  platformVersion: typeof KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION;
  sourceCount: number;
  indexCount: number;
  categoryCount: number;
  targetCount: number;
  namespaceCount: number;
  filterCount: number;
  selectorCount: number;
  readOnly: true;
}>;

export type KnowledgeRetrievalEngineState = Readonly<{
  platformId: typeof import("./knowledgeRetrievalCatalog.ts").KNOWLEDGE_RETRIEVAL_ENGINE_ID;
  contractVersion: typeof KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  frameworkDependency: "KNL/6";
  policyDependency: "KNL/7";
  bestPracticeDependency: "KNL/8";
  initialized: boolean;
  sourceCount: number;
  indexCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type KnowledgeRetrievalEngineValidationReport = Readonly<{
  valid: boolean;
  foundationValid: boolean;
  ontologyValid: boolean;
  vocabularyValid: boolean;
  graphValid: boolean;
  industryValid: boolean;
  frameworkValid: boolean;
  policyValid: boolean;
  bestPracticeValid: boolean;
  engineInitialized: boolean;
  registryValid: boolean;
  identityValid: boolean;
  issues: readonly KnowledgeRetrievalValidationIssue[];
  readOnly: true;
}>;
