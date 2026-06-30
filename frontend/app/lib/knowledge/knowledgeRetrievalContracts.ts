/**
 * KNL-9 — Knowledge Retrieval Engine contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  KNOWLEDGE_RETRIEVAL_ARCHITECTURE_VERSION,
  KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
  KNOWLEDGE_RETRIEVAL_ENGINE_ID,
  KNOWLEDGE_RETRIEVAL_ENGINE_NAME,
  KNOWLEDGE_RETRIEVAL_FORBIDDEN_PATTERNS,
  KNOWLEDGE_RETRIEVAL_FUTURE_PHASE_KEYS,
  KNOWLEDGE_RETRIEVAL_GOVERNANCE_RULES,
  KNOWLEDGE_RETRIEVAL_MUST_NOT_OWN,
  KNOWLEDGE_RETRIEVAL_NAMESPACE,
  KNOWLEDGE_RETRIEVAL_PRINCIPLES,
  KNOWLEDGE_RETRIEVAL_PUBLIC_API_REGISTRY,
  RETRIEVAL_CATEGORY_KEYS,
  RETRIEVAL_SOURCE_KEYS,
} from "./knowledgeRetrievalCatalog.ts";
import {
  getKnowledgeRetrievalEngineSnapshot,
  initializeKnowledgeRetrievalEngine,
  isKnowledgeRetrievalEngineInitialized,
} from "./knowledgeRetrievalRegistry.ts";
import type {
  KnowledgeCategoryMapping,
  KnowledgeIndex,
  KnowledgeIndexEntry,
  KnowledgeNamespaceMapping,
  KnowledgeResultDescriptor,
  KnowledgeRetrievalExtensionPoint,
  KnowledgeRetrievalManifest,
  KnowledgeRetrievalMetadata,
  KnowledgeRetrievalRequest,
  KnowledgeRetrievalSource,
  KnowledgeRetrievalTarget,
} from "./knowledgeRetrievalTypes.ts";
import type { KnowledgeRetrievalEngineValidationReport } from "./knowledgeRetrievalTypes.ts";
import {
  validateBestPracticePlatformDependency,
  validateBusinessOntologyDependency,
  validateBusinessVocabularyDependency,
  validateFrameworkLibraryDependency,
  validateIndustryModelsDependency,
  validateKnowledgeFoundationDependency,
  validateKnowledgeGraphDependency,
  validateKnowledgeRetrievalContractVersion,
  validateKnowledgeRetrievalCoreNamespace,
  validateKnowledgeRetrievalDependencyDeclarations,
  validatePolicyRuleBaseDependency,
} from "./knowledgeRetrievalValidation.ts";

export const KNOWLEDGE_RETRIEVAL_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noExecution: true,
  noSearch: true,
  noQuery: true,
  noRanking: true,
  noRecommendations: true,
  noSemanticSearch: true,
  noRetrieval: true,
  noGraphTraversal: true,
  noMachineLearning: true,
  noLlm: true,
  noRuntime: true,
  noReact: true,
  metadataOnly: true,
  descriptiveOnly: true,
  readOnly: true as const,
});

export const KNOWLEDGE_RETRIEVAL_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...KNOWLEDGE_RETRIEVAL_FORBIDDEN_PATTERNS,
] as const);

export const KNOWLEDGE_RETRIEVAL_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/9",
  title: "Knowledge Retrieval Engine",
  goal: "Canonical metadata-only knowledge retrieval infrastructure and index registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/knowledgeRetrievalCatalog.ts",
    "frontend/app/lib/knowledge/knowledgeRetrievalTypes.ts",
    "frontend/app/lib/knowledge/knowledgeRetrievalContracts.ts",
    "frontend/app/lib/knowledge/knowledgeRetrievalRegistry.ts",
    "frontend/app/lib/knowledge/knowledgeRetrievalValidation.ts",
    "frontend/app/lib/knowledge/knowledgeRetrievalEngine.ts",
    "frontend/app/lib/knowledge/knowledgeRetrievalEngine.test.ts",
    "docs/knl-9-knowledge-retrieval-engine-report.md",
  ]),
  forbiddenPatterns: KNOWLEDGE_RETRIEVAL_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["KNL/1", "KNL/2", "KNL/3", "KNL/4", "KNL/5", "KNL/6", "KNL/7", "KNL/8"]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_9]", "[KNOWLEDGE_RETRIEVAL]", "[METADATA_ONLY]"]),
} satisfies StageManifest);

function createMetadata(metadataId: string, timestamp: string): KnowledgeRetrievalMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    namespace: KNOWLEDGE_RETRIEVAL_NAMESPACE,
    owner: "knowledge-retrieval-engine",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveKnowledgeRetrievalMetadataExample(timestamp: string): KnowledgeRetrievalMetadata {
  return createMetadata("knowledge-retrieval-metadata-example-001", timestamp);
}

export function resolveKnowledgeRetrievalRequestExample(_timestamp: string): KnowledgeRetrievalRequest {
  return Object.freeze({
    requestId: "knowledge-retrieval-request-example-001",
    sourceKey: "knl_foundation",
    categoryKey: "knl_foundation",
    namespaceKey: "knowledge-retrieval-engine",
    filterKey: "by_source",
    selectorKey: "single_source",
    description: "Example retrieval request contract (metadata only, not executable).",
    readOnly: true as const,
  });
}

export function resolveKnowledgeRetrievalTargetExample(timestamp: string): KnowledgeRetrievalTarget {
  return Object.freeze({
    targetId: "retrieval-target-knl_foundation",
    targetKey: "foundation_registry",
    sourceKey: "knl_foundation",
    platformId: "knowledge-platform",
    label: "Knowledge Foundation",
    description: "Example retrieval target contract.",
    version: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    metadata: resolveKnowledgeRetrievalMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeRetrievalSourceExample(timestamp: string): KnowledgeRetrievalSource {
  return Object.freeze({
    sourceId: "retrieval-source-knl_foundation",
    sourceKey: "knl_foundation",
    platformId: "knowledge-platform",
    label: "Knowledge Foundation",
    description: "Example retrieval source contract (reference only).",
    version: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    metadata: resolveKnowledgeRetrievalMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeIndexEntryExample(_timestamp: string): KnowledgeIndexEntry {
  return Object.freeze({
    entryId: "knowledge-index-entry-knl_foundation",
    indexId: "knowledge-index-knl_foundation",
    sourceKey: "knl_foundation",
    label: "Knowledge Foundation Index Entry",
    description: "Example index entry contract (metadata only).",
    readOnly: true as const,
  });
}

export function resolveKnowledgeIndexExample(timestamp: string): KnowledgeIndex {
  return Object.freeze({
    indexId: "knowledge-index-knl_foundation",
    indexName: "index_knl_foundation",
    sourceKey: "knl_foundation",
    categoryKey: "knl_foundation",
    label: "Knowledge Foundation Index",
    description: "Example knowledge index contract (no querying).",
    entries: Object.freeze([resolveKnowledgeIndexEntryExample(timestamp)]),
    version: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    metadata: resolveKnowledgeRetrievalMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeNamespaceMappingExample(_timestamp: string): KnowledgeNamespaceMapping {
  return Object.freeze({
    mappingId: "namespace-mapping-knl_foundation",
    namespaceKey: "knowledge-retrieval-sources",
    sourceKey: "knl_foundation",
    description: "Example namespace mapping contract.",
    readOnly: true as const,
  });
}

export function resolveKnowledgeCategoryMappingExample(_timestamp: string): KnowledgeCategoryMapping {
  return Object.freeze({
    mappingId: "category-mapping-knl_foundation",
    categoryKey: "knl_foundation",
    sourceKey: "knl_foundation",
    description: "Example category mapping contract.",
    readOnly: true as const,
  });
}

export function resolveKnowledgeResultDescriptorExample(_timestamp: string): KnowledgeResultDescriptor {
  return Object.freeze({
    descriptorId: "knowledge-result-descriptor-example-001",
    sourceKey: "knl_foundation",
    label: "Foundation Result Descriptor",
    description: "Example result descriptor contract (metadata only, no results).",
    readOnly: true as const,
  });
}

export function resolveKnowledgeRetrievalExtensionPointExample(timestamp: string): KnowledgeRetrievalExtensionPoint {
  return Object.freeze({
    extensionPointId: "retrieval-extension-knowledge-validation",
    extensionPointKey: "knowledge_validation",
    label: "Knowledge Validation",
    description: "Reserved extension point for KNL-10 Knowledge Validation Platform.",
    version: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    metadata: resolveKnowledgeRetrievalMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function getKnowledgeRetrievalManifest(timestamp: string = new Date(0).toISOString()): KnowledgeRetrievalManifest {
  if (!isKnowledgeRetrievalEngineInitialized()) {
    initializeKnowledgeRetrievalEngine(timestamp);
  }
  return Object.freeze({
    platformId: KNOWLEDGE_RETRIEVAL_ENGINE_ID,
    platformName: KNOWLEDGE_RETRIEVAL_ENGINE_NAME,
    namespace: KNOWLEDGE_RETRIEVAL_NAMESPACE,
    contractVersion: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    architectureVersion: KNOWLEDGE_RETRIEVAL_ARCHITECTURE_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    industryDependency: "KNL/5",
    frameworkDependency: "KNL/6",
    policyDependency: "KNL/7",
    bestPracticeDependency: "KNL/8",
    supportedSources: RETRIEVAL_SOURCE_KEYS,
    supportedCategories: RETRIEVAL_CATEGORY_KEYS,
    publicApis: KNOWLEDGE_RETRIEVAL_PUBLIC_API_REGISTRY,
    principles: KNOWLEDGE_RETRIEVAL_PRINCIPLES,
    mustNotOwn: KNOWLEDGE_RETRIEVAL_MUST_NOT_OWN,
    governanceRules: KNOWLEDGE_RETRIEVAL_GOVERNANCE_RULES,
    futurePhases: KNOWLEDGE_RETRIEVAL_FUTURE_PHASE_KEYS,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function validateKnowledgeRetrievalEngine(
  timestamp: string = new Date(0).toISOString()
): KnowledgeRetrievalEngineValidationReport {
  const issues: KnowledgeRetrievalEngineValidationReport["issues"][number][] = [];

  const dependencyValidation = validateKnowledgeRetrievalDependencyDeclarations();
  if (!dependencyValidation.valid) issues.push(...dependencyValidation.issues);

  const versionValidation = validateKnowledgeRetrievalContractVersion();
  if (!versionValidation.valid) issues.push(...versionValidation.issues);

  const namespaceValidation = validateKnowledgeRetrievalCoreNamespace();
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);

  if (!isKnowledgeRetrievalEngineInitialized()) {
    initializeKnowledgeRetrievalEngine(timestamp);
  }

  const foundationValidation = validateKnowledgeFoundationDependency(timestamp);
  if (!foundationValidation.valid) issues.push(...foundationValidation.issues);

  const ontologyValidation = validateBusinessOntologyDependency(timestamp);
  if (!ontologyValidation.valid) issues.push(...ontologyValidation.issues);

  const vocabularyValidation = validateBusinessVocabularyDependency(timestamp);
  if (!vocabularyValidation.valid) issues.push(...vocabularyValidation.issues);

  const graphValidation = validateKnowledgeGraphDependency(timestamp);
  if (!graphValidation.valid) issues.push(...graphValidation.issues);

  const industryValidation = validateIndustryModelsDependency(timestamp);
  if (!industryValidation.valid) issues.push(...industryValidation.issues);

  const frameworkValidation = validateFrameworkLibraryDependency(timestamp);
  if (!frameworkValidation.valid) issues.push(...frameworkValidation.issues);

  const policyValidation = validatePolicyRuleBaseDependency(timestamp);
  if (!policyValidation.valid) issues.push(...policyValidation.issues);

  const bestPracticeValidation = validateBestPracticePlatformDependency(timestamp);
  if (!bestPracticeValidation.valid) issues.push(...bestPracticeValidation.issues);

  const manifestValidation = validateStageManifest(KNOWLEDGE_RETRIEVAL_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const }));
    }
  }

  const snapshot = getKnowledgeRetrievalEngineSnapshot();
  if (snapshot.sourceCount < RETRIEVAL_SOURCE_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "sources_incomplete",
        message: "Retrieval source registry must contain all seeded KNL sources.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.indexCount < RETRIEVAL_SOURCE_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "indexes_incomplete",
        message: "Knowledge index registry must contain seeded indexes.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.categoryCount < RETRIEVAL_CATEGORY_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_incomplete",
        message: "Knowledge category registry must contain seeded defaults.",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze({
    valid: issues.length === 0,
    foundationValid: foundationValidation.valid,
    ontologyValid: ontologyValidation.valid,
    vocabularyValid: vocabularyValidation.valid,
    graphValid: graphValidation.valid,
    industryValid: industryValidation.valid,
    frameworkValid: frameworkValidation.valid,
    policyValid: policyValidation.valid,
    bestPracticeValid: bestPracticeValidation.valid,
    engineInitialized: isKnowledgeRetrievalEngineInitialized(),
    registryValid:
      snapshot.sourceCount >= RETRIEVAL_SOURCE_KEYS.length &&
      snapshot.indexCount >= RETRIEVAL_SOURCE_KEYS.length &&
      snapshot.categoryCount >= RETRIEVAL_CATEGORY_KEYS.length,
    identityValid: versionValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const KnowledgeRetrievalContract = Object.freeze({
  KNOWLEDGE_RETRIEVAL_PUBLIC_API_RULES,
  KNOWLEDGE_RETRIEVAL_SELF_MANIFEST,
  getKnowledgeRetrievalManifest,
  validateKnowledgeRetrievalEngine,
  resolveKnowledgeRetrievalSourceExample,
  resolveKnowledgeIndexExample,
  version: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
});
