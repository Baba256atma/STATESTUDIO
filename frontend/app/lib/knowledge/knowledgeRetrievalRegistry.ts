/**
 * KNL-9 — Knowledge Retrieval Engine metadata registry.
 */

import {
  KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
  KNOWLEDGE_RETRIEVAL_DEFAULT_LIMITS,
  KNOWLEDGE_RETRIEVAL_ENGINE_ID,
  KNOWLEDGE_RETRIEVAL_NAMESPACE,
  KNOWLEDGE_RETRIEVAL_OWNER,
  RETRIEVAL_CATEGORY_KEYS,
  RETRIEVAL_EXTENSION_POINT_KEYS,
  RETRIEVAL_FILTER_KEYS,
  RETRIEVAL_NAMESPACE_KEYS,
  RETRIEVAL_PLATFORM_ID_MAP,
  RETRIEVAL_SELECTOR_KEYS,
  RETRIEVAL_SOURCE_KEYS,
  RETRIEVAL_SOURCE_LABELS,
  RETRIEVAL_TARGET_MAP,
} from "./knowledgeRetrievalCatalog.ts";
import type {
  KnowledgeCategoryMapping,
  KnowledgeCategoryRegistrationInput,
  KnowledgeFilter,
  KnowledgeIndex,
  KnowledgeIndexRegistrationInput,
  KnowledgeNamespaceMapping,
  KnowledgeRetrievalCategory,
  KnowledgeRetrievalExtensionPoint,
  KnowledgeRetrievalMetadata,
  KnowledgeRetrievalNamespace,
  KnowledgeRetrievalResult,
  KnowledgeRetrievalSource,
  KnowledgeRetrievalSourceRegistrationInput,
  KnowledgeRetrievalTarget,
  KnowledgeSelector,
  KnowledgeRetrievalEngineSnapshot,
  KnowledgeRetrievalEngineState,
} from "./knowledgeRetrievalTypes.ts";
import {
  validateKnowledgeCategoryRegistration,
  validateKnowledgeIndexRegistration,
  validateKnowledgeRetrievalSourceRegistration,
} from "./knowledgeRetrievalValidation.ts";
import { initializeBestPracticePlatform } from "./bestPracticeRegistry.ts";

export const KNOWLEDGE_RETRIEVAL_REGISTRY_VERSION = "KNL/9-REGISTRY-1" as const;

const sourceRegistry = new Map<string, KnowledgeRetrievalSource>();
const indexRegistry = new Map<string, KnowledgeIndex>();
const categoryRegistry = new Map<string, KnowledgeRetrievalCategory>();
const targetRegistry = new Map<string, KnowledgeRetrievalTarget>();
const namespaceRegistry = new Map<string, KnowledgeRetrievalNamespace>();
const filterRegistry = new Map<string, KnowledgeFilter>();
const selectorRegistry = new Map<string, KnowledgeSelector>();
const namespaceMappingRegistry = new Map<string, KnowledgeNamespaceMapping>();
const categoryMappingRegistry = new Map<string, KnowledgeCategoryMapping>();
const extensionPointRegistry = new Map<string, KnowledgeRetrievalExtensionPoint>();
const metadataRegistry = new Map<string, KnowledgeRetrievalMetadata>();

let engineInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): KnowledgeRetrievalResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function createMetadata(metadataId: string, timestamp: string, extensions: Readonly<Record<string, string>> = {}) {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    namespace: KNOWLEDGE_RETRIEVAL_NAMESPACE,
    owner: KNOWLEDGE_RETRIEVAL_OWNER,
    extensions: Object.freeze({ ...extensions }),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resetKnowledgeRetrievalRegistryForTests(): void {
  sourceRegistry.clear();
  indexRegistry.clear();
  categoryRegistry.clear();
  targetRegistry.clear();
  namespaceRegistry.clear();
  filterRegistry.clear();
  selectorRegistry.clear();
  namespaceMappingRegistry.clear();
  categoryMappingRegistry.clear();
  extensionPointRegistry.clear();
  metadataRegistry.clear();
  engineInitialized = false;
  lastInitializedAt = null;
}

export function isKnowledgeRetrievalEngineInitialized(): boolean {
  return engineInitialized;
}

export function getKnowledgeRetrievalEngineState(
  timestamp: string = new Date(0).toISOString()
): KnowledgeRetrievalEngineState {
  const snapshot = getKnowledgeRetrievalEngineSnapshot();
  return Object.freeze({
    platformId: KNOWLEDGE_RETRIEVAL_ENGINE_ID,
    contractVersion: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    industryDependency: "KNL/5",
    frameworkDependency: "KNL/6",
    policyDependency: "KNL/7",
    bestPracticeDependency: "KNL/8",
    initialized: engineInitialized,
    sourceCount: snapshot.sourceCount,
    indexCount: snapshot.indexCount,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function initializeKnowledgeRetrievalEngine(
  timestamp: string = new Date(0).toISOString()
): KnowledgeRetrievalResult<KnowledgeRetrievalEngineState> {
  const bestPractice = initializeBestPracticePlatform(timestamp);
  if (!bestPractice.success) {
    return createResult(false, "KNL/8 Best Practices initialization failed.", null);
  }
  seedKnowledgeRetrievalCatalog(timestamp);
  engineInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Knowledge retrieval engine initialized.", getKnowledgeRetrievalEngineState(timestamp));
}

export function registerKnowledgeRetrievalSource(
  input: KnowledgeRetrievalSourceRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeRetrievalResult<KnowledgeRetrievalSource> {
  const validation = validateKnowledgeRetrievalSourceRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (sourceRegistry.size >= KNOWLEDGE_RETRIEVAL_DEFAULT_LIMITS.maxRegisteredSources) {
    return createResult(false, "Retrieval source registration limit reached.", null);
  }
  if (sourceRegistry.has(input.sourceId)) {
    return createResult(false, `Retrieval source already registered: ${input.sourceId}.`, null);
  }
  const duplicateKey = [...sourceRegistry.values()].some((entry) => entry.sourceKey === input.sourceKey);
  if (duplicateKey) {
    return createResult(false, `Retrieval source key already registered: ${input.sourceKey}.`, null);
  }
  const entry = Object.freeze({
    sourceId: input.sourceId,
    sourceKey: input.sourceKey,
    platformId: input.platformId,
    label: input.label,
    description: input.description,
    version: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-source-${input.sourceId}`, timestamp),
    readOnly: true as const,
  });
  sourceRegistry.set(entry.sourceId, entry);
  return createResult(true, "Knowledge retrieval source registered.", entry);
}

export function registerKnowledgeIndex(
  input: KnowledgeIndexRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeRetrievalResult<KnowledgeIndex> {
  const validation = validateKnowledgeIndexRegistration(
    input,
    [...sourceRegistry.values()].map((entry) => entry.sourceKey),
    [...categoryRegistry.values()].map((entry) => entry.categoryKey)
  );
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (indexRegistry.size >= KNOWLEDGE_RETRIEVAL_DEFAULT_LIMITS.maxRegisteredIndexes) {
    return createResult(false, "Knowledge index registration limit reached.", null);
  }
  if (indexRegistry.has(input.indexId)) {
    return createResult(false, `Knowledge index already registered: ${input.indexId}.`, null);
  }
  const duplicateName = [...indexRegistry.values()].some(
    (entry) => entry.indexName.trim().toLowerCase() === input.indexName.trim().toLowerCase()
  );
  if (duplicateName) {
    return createResult(false, `Knowledge index name already registered: ${input.indexName}.`, null);
  }
  const entryId = `knowledge-index-entry-${input.indexId}`;
  const indexEntry = Object.freeze({
    entryId,
    indexId: input.indexId,
    sourceKey: input.sourceKey,
    label: input.entryLabel ?? `${input.label} Entry`,
    description: input.entryDescription ?? `Index entry metadata for ${input.label}.`,
    readOnly: true as const,
  });
  const entry = Object.freeze({
    indexId: input.indexId,
    indexName: input.indexName,
    sourceKey: input.sourceKey,
    categoryKey: input.categoryKey,
    label: input.label,
    description: input.description,
    entries: Object.freeze([indexEntry]),
    version: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-index-${input.indexId}`, timestamp),
    readOnly: true as const,
  });
  indexRegistry.set(entry.indexId, entry);
  return createResult(true, "Knowledge index registered.", entry);
}

export function registerKnowledgeCategory(
  input: KnowledgeCategoryRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeRetrievalResult<KnowledgeRetrievalCategory> {
  const validation = validateKnowledgeCategoryRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (categoryRegistry.size >= KNOWLEDGE_RETRIEVAL_DEFAULT_LIMITS.maxRegisteredCategories) {
    return createResult(false, "Knowledge category registration limit reached.", null);
  }
  if (categoryRegistry.has(input.categoryId)) {
    return createResult(false, `Knowledge category already registered: ${input.categoryId}.`, null);
  }
  const duplicateKey = [...categoryRegistry.values()].some((entry) => entry.categoryKey === input.categoryKey);
  if (duplicateKey) {
    return createResult(false, `Knowledge category key already registered: ${input.categoryKey}.`, null);
  }
  const entry = Object.freeze({
    categoryId: input.categoryId,
    categoryKey: input.categoryKey,
    label: input.label,
    description: input.description,
    version: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-category-${input.categoryId}`, timestamp),
    readOnly: true as const,
  });
  categoryRegistry.set(entry.categoryId, entry);
  return createResult(true, "Knowledge category registered.", entry);
}

function registerKnowledgeRetrievalTarget(
  sourceKey: (typeof RETRIEVAL_SOURCE_KEYS)[number],
  timestamp: string
): KnowledgeRetrievalResult<KnowledgeRetrievalTarget> {
  const targetKey = RETRIEVAL_TARGET_MAP[sourceKey];
  const targetId = `retrieval-target-${sourceKey}`;
  if (targetRegistry.has(targetId)) {
    return createResult(false, `Retrieval target already registered: ${targetId}.`, null);
  }
  const entry = Object.freeze({
    targetId,
    targetKey,
    sourceKey,
    platformId: RETRIEVAL_PLATFORM_ID_MAP[sourceKey],
    label: RETRIEVAL_SOURCE_LABELS[sourceKey],
    description: `Retrieval target metadata for ${RETRIEVAL_SOURCE_LABELS[sourceKey]}.`,
    version: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-target-${sourceKey}`, timestamp),
    readOnly: true as const,
  });
  targetRegistry.set(entry.targetId, entry);
  return createResult(true, "Knowledge retrieval target registered.", entry);
}

function registerKnowledgeRetrievalNamespace(
  namespaceKey: (typeof RETRIEVAL_NAMESPACE_KEYS)[number],
  timestamp: string
): KnowledgeRetrievalResult<KnowledgeRetrievalNamespace> {
  const namespaceId = `retrieval-namespace-${namespaceKey}`;
  if (namespaceRegistry.has(namespaceId)) {
    return createResult(false, `Retrieval namespace already registered: ${namespaceId}.`, null);
  }
  const entry = Object.freeze({
    namespaceId,
    namespaceKey,
    label: namespaceKey,
    description: `${namespaceKey} knowledge retrieval namespace metadata.`,
    version: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-namespace-${namespaceKey}`, timestamp),
    readOnly: true as const,
  });
  namespaceRegistry.set(entry.namespaceId, entry);
  return createResult(true, "Knowledge retrieval namespace registered.", entry);
}

function registerKnowledgeFilter(
  filterKey: (typeof RETRIEVAL_FILTER_KEYS)[number],
  timestamp: string
): KnowledgeRetrievalResult<KnowledgeFilter> {
  const filterId = `knowledge-filter-${filterKey}`;
  if (filterRegistry.has(filterId)) {
    return createResult(false, `Knowledge filter already registered: ${filterId}.`, null);
  }
  const entry = Object.freeze({
    filterId,
    filterKey,
    label: filterKey,
    description: `${filterKey} knowledge filter metadata (not executable).`,
    version: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-filter-${filterKey}`, timestamp),
    readOnly: true as const,
  });
  filterRegistry.set(entry.filterId, entry);
  return createResult(true, "Knowledge filter registered.", entry);
}

function registerKnowledgeSelector(
  selectorKey: (typeof RETRIEVAL_SELECTOR_KEYS)[number],
  timestamp: string
): KnowledgeRetrievalResult<KnowledgeSelector> {
  const selectorId = `knowledge-selector-${selectorKey}`;
  if (selectorRegistry.has(selectorId)) {
    return createResult(false, `Knowledge selector already registered: ${selectorId}.`, null);
  }
  const entry = Object.freeze({
    selectorId,
    selectorKey,
    label: selectorKey,
    description: `${selectorKey} knowledge selector metadata (not executable).`,
    version: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-selector-${selectorKey}`, timestamp),
    readOnly: true as const,
  });
  selectorRegistry.set(entry.selectorId, entry);
  return createResult(true, "Knowledge selector registered.", entry);
}

function registerKnowledgeRetrievalExtensionPoint(
  extensionPointKey: (typeof RETRIEVAL_EXTENSION_POINT_KEYS)[number],
  timestamp: string
): KnowledgeRetrievalResult<KnowledgeRetrievalExtensionPoint> {
  const extensionPointId = `retrieval-extension-${extensionPointKey.replace(/_/g, "-")}`;
  if (extensionPointRegistry.has(extensionPointId)) {
    return createResult(false, `Retrieval extension point already registered: ${extensionPointId}.`, null);
  }
  const entry = Object.freeze({
    extensionPointId,
    extensionPointKey,
    label: extensionPointKey,
    description: `${extensionPointKey} knowledge retrieval extension point metadata.`,
    version: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-extension-${extensionPointKey}`, timestamp),
    readOnly: true as const,
  });
  extensionPointRegistry.set(entry.extensionPointId, entry);
  return createResult(true, "Knowledge retrieval extension point registered.", entry);
}

export function getKnowledgeRetrievalEngineSnapshot(): KnowledgeRetrievalEngineSnapshot {
  return Object.freeze({
    platformVersion: KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
    sourceCount: sourceRegistry.size,
    indexCount: indexRegistry.size,
    categoryCount: categoryRegistry.size || RETRIEVAL_CATEGORY_KEYS.length,
    targetCount: targetRegistry.size || RETRIEVAL_SOURCE_KEYS.length,
    namespaceCount: namespaceRegistry.size || RETRIEVAL_NAMESPACE_KEYS.length,
    filterCount: filterRegistry.size || RETRIEVAL_FILTER_KEYS.length,
    selectorCount: selectorRegistry.size || RETRIEVAL_SELECTOR_KEYS.length,
    readOnly: true as const,
  });
}

export function getKnowledgeRetrievalEngineRegistry(): Readonly<{
  sources: readonly KnowledgeRetrievalSource[];
  indexes: readonly KnowledgeIndex[];
  categories: readonly KnowledgeRetrievalCategory[];
  targets: readonly KnowledgeRetrievalTarget[];
  namespaces: readonly KnowledgeRetrievalNamespace[];
  filters: readonly KnowledgeFilter[];
  selectors: readonly KnowledgeSelector[];
  namespaceMappings: readonly KnowledgeNamespaceMapping[];
  categoryMappings: readonly KnowledgeCategoryMapping[];
  extensionPoints: readonly KnowledgeRetrievalExtensionPoint[];
  metadataRecords: readonly KnowledgeRetrievalMetadata[];
  snapshot: KnowledgeRetrievalEngineSnapshot;
  readOnly: true;
}> {
  return Object.freeze({
    sources: Object.freeze(
      [...sourceRegistry.values()].sort((a, b) => a.sourceId.localeCompare(b.sourceId))
    ),
    indexes: Object.freeze(
      [...indexRegistry.values()].sort((a, b) => a.indexId.localeCompare(b.indexId))
    ),
    categories: Object.freeze(
      [...categoryRegistry.values()].sort((a, b) => a.categoryId.localeCompare(b.categoryId))
    ),
    targets: Object.freeze(
      [...targetRegistry.values()].sort((a, b) => a.targetId.localeCompare(b.targetId))
    ),
    namespaces: Object.freeze(
      [...namespaceRegistry.values()].sort((a, b) => a.namespaceId.localeCompare(b.namespaceId))
    ),
    filters: Object.freeze(
      [...filterRegistry.values()].sort((a, b) => a.filterId.localeCompare(b.filterId))
    ),
    selectors: Object.freeze(
      [...selectorRegistry.values()].sort((a, b) => a.selectorId.localeCompare(b.selectorId))
    ),
    namespaceMappings: Object.freeze(
      [...namespaceMappingRegistry.values()].sort((a, b) => a.mappingId.localeCompare(b.mappingId))
    ),
    categoryMappings: Object.freeze(
      [...categoryMappingRegistry.values()].sort((a, b) => a.mappingId.localeCompare(b.mappingId))
    ),
    extensionPoints: Object.freeze(
      [...extensionPointRegistry.values()].sort((a, b) => a.extensionPointId.localeCompare(b.extensionPointId))
    ),
    metadataRecords: Object.freeze(
      [...metadataRegistry.values()].sort((a, b) => a.metadataId.localeCompare(b.metadataId))
    ),
    snapshot: getKnowledgeRetrievalEngineSnapshot(),
    readOnly: true as const,
  });
}

export function seedKnowledgeRetrievalCatalog(timestamp: string = new Date(0).toISOString()): void {
  if (sourceRegistry.size > 0) {
    return;
  }
  for (const namespaceKey of RETRIEVAL_NAMESPACE_KEYS) {
    registerKnowledgeRetrievalNamespace(namespaceKey, timestamp);
  }
  for (const filterKey of RETRIEVAL_FILTER_KEYS) {
    registerKnowledgeFilter(filterKey, timestamp);
  }
  for (const selectorKey of RETRIEVAL_SELECTOR_KEYS) {
    registerKnowledgeSelector(selectorKey, timestamp);
  }
  for (const extensionPointKey of RETRIEVAL_EXTENSION_POINT_KEYS) {
    registerKnowledgeRetrievalExtensionPoint(extensionPointKey, timestamp);
  }
  for (const categoryKey of RETRIEVAL_CATEGORY_KEYS) {
    registerKnowledgeCategory(
      Object.freeze({
        categoryId: `knowledge-category-${categoryKey}`,
        categoryKey,
        label: RETRIEVAL_SOURCE_LABELS[categoryKey],
        description: `${RETRIEVAL_SOURCE_LABELS[categoryKey]} retrieval category metadata.`,
      }),
      timestamp
    );
  }
  for (const sourceKey of RETRIEVAL_SOURCE_KEYS) {
    registerKnowledgeRetrievalSource(
      Object.freeze({
        sourceId: `retrieval-source-${sourceKey}`,
        sourceKey,
        platformId: RETRIEVAL_PLATFORM_ID_MAP[sourceKey],
        label: RETRIEVAL_SOURCE_LABELS[sourceKey],
        description: `Metadata reference to ${RETRIEVAL_SOURCE_LABELS[sourceKey]} platform (no loading).`,
      }),
      timestamp
    );
    registerKnowledgeRetrievalTarget(sourceKey, timestamp);
    namespaceMappingRegistry.set(
      `namespace-mapping-${sourceKey}`,
      Object.freeze({
        mappingId: `namespace-mapping-${sourceKey}`,
        namespaceKey: "knowledge-retrieval-sources",
        sourceKey,
        description: `Namespace mapping metadata for ${RETRIEVAL_SOURCE_LABELS[sourceKey]}.`,
        readOnly: true as const,
      })
    );
    categoryMappingRegistry.set(
      `category-mapping-${sourceKey}`,
      Object.freeze({
        mappingId: `category-mapping-${sourceKey}`,
        categoryKey: sourceKey,
        sourceKey,
        description: `Category mapping metadata for ${RETRIEVAL_SOURCE_LABELS[sourceKey]}.`,
        readOnly: true as const,
      })
    );
    registerKnowledgeIndex(
      Object.freeze({
        indexId: `knowledge-index-${sourceKey}`,
        indexName: `index_${sourceKey}`,
        sourceKey,
        categoryKey: sourceKey,
        label: `${RETRIEVAL_SOURCE_LABELS[sourceKey]} Index`,
        description: `Knowledge index metadata for ${RETRIEVAL_SOURCE_LABELS[sourceKey]} (no querying).`,
        entryLabel: `${RETRIEVAL_SOURCE_LABELS[sourceKey]} Index Entry`,
        entryDescription: `Primary index entry metadata for ${RETRIEVAL_SOURCE_LABELS[sourceKey]}.`,
      }),
      timestamp
    );
  }
  const rootMetadata = createMetadata("knowledge-retrieval-engine-root-metadata", timestamp, Object.freeze({ catalog: "default" }));
  metadataRegistry.set(rootMetadata.metadataId, rootMetadata);
}

export const KnowledgeRetrievalRegistry = Object.freeze({
  resetKnowledgeRetrievalRegistryForTests,
  initializeKnowledgeRetrievalEngine,
  registerKnowledgeRetrievalSource,
  registerKnowledgeIndex,
  registerKnowledgeCategory,
  getKnowledgeRetrievalEngineRegistry,
  getKnowledgeRetrievalEngineSnapshot,
  seedKnowledgeRetrievalCatalog,
});
