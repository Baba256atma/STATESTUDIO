/**
 * KNL-5 — Industry Models metadata registry.
 */

import {
  INDUSTRY_CAPABILITY_KEYS,
  INDUSTRY_CATEGORY_KEYS,
  INDUSTRY_MODELS_CONTRACT_VERSION,
  INDUSTRY_MODELS_DEFAULT_LIMITS,
  INDUSTRY_MODELS_ID,
  INDUSTRY_MODELS_NAMESPACE,
  INDUSTRY_MODELS_OWNER,
  INDUSTRY_NAMESPACE_KEYS,
  INDUSTRY_SECTOR_KEYS,
  INDUSTRY_SECTOR_LABELS,
} from "./industryModelCatalog.ts";
import type {
  BusinessSector,
  IndustryCapability,
  IndustryCategory,
  IndustryModel,
  IndustryModelRegistrationInput,
  IndustryNamespace,
  IndustryResult,
  IndustrySnapshot,
  IndustryModelsState,
  IndustryTemplate,
  IndustryTemplateRegistrationInput,
  IndustryCategoryRegistrationInput,
  IndustryMetadata,
} from "./industryModelTypes.ts";
import {
  validateIndustryCategoryRegistration,
  validateIndustryModelRegistration,
  validateIndustryTemplateRegistration,
} from "./industryModelValidation.ts";
import { initializeKnowledgeGraph } from "./knowledgeGraphRegistry.ts";

export const INDUSTRY_MODELS_REGISTRY_VERSION = "KNL/5-REGISTRY-1" as const;

const modelRegistry = new Map<string, IndustryModel>();
const templateRegistry = new Map<string, IndustryTemplate>();
const categoryRegistry = new Map<string, IndustryCategory>();
const sectorRegistry = new Map<string, BusinessSector>();
const capabilityRegistry = new Map<string, IndustryCapability>();
const namespaceRegistry = new Map<string, IndustryNamespace>();
const metadataRegistry = new Map<string, IndustryMetadata>();

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): IndustryResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function createMetadata(metadataId: string, timestamp: string, extensions: Readonly<Record<string, string>> = {}) {
  return Object.freeze({
    metadataId,
    metadataVersion: INDUSTRY_MODELS_CONTRACT_VERSION,
    namespace: INDUSTRY_MODELS_NAMESPACE,
    owner: INDUSTRY_MODELS_OWNER,
    extensions: Object.freeze({ ...extensions }),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resetIndustryModelsRegistryForTests(): void {
  modelRegistry.clear();
  templateRegistry.clear();
  categoryRegistry.clear();
  sectorRegistry.clear();
  capabilityRegistry.clear();
  namespaceRegistry.clear();
  metadataRegistry.clear();
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isIndustryModelsInitialized(): boolean {
  return platformInitialized;
}

export function getIndustryModelsState(timestamp: string = new Date(0).toISOString()): IndustryModelsState {
  const snapshot = getIndustryModelsSnapshot();
  return Object.freeze({
    platformId: INDUSTRY_MODELS_ID,
    contractVersion: INDUSTRY_MODELS_CONTRACT_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    initialized: platformInitialized,
    modelCount: snapshot.modelCount,
    templateCount: snapshot.templateCount,
    sectorCount: snapshot.sectorCount,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function initializeIndustryModels(
  timestamp: string = new Date(0).toISOString()
): IndustryResult<IndustryModelsState> {
  const graph = initializeKnowledgeGraph(timestamp);
  if (!graph.success) {
    return createResult(false, "KNL/4 Knowledge Graph initialization failed.", null);
  }
  seedIndustryModelsCatalog(timestamp);
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Industry models platform initialized.", getIndustryModelsState(timestamp));
}

export function registerIndustryModel(
  input: IndustryModelRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): IndustryResult<IndustryModel> {
  const validation = validateIndustryModelRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (modelRegistry.has(input.modelId)) {
    return createResult(false, `Industry model already registered: ${input.modelId}.`, null);
  }
  if (modelRegistry.size >= INDUSTRY_MODELS_DEFAULT_LIMITS.maxRegisteredModels) {
    return createResult(false, "Industry model registry limit reached.", null);
  }
  const entry = Object.freeze({
    modelId: input.modelId,
    sectorKey: input.sectorKey,
    categoryKey: input.categoryKey,
    label: input.label.trim(),
    description: input.description.trim(),
    profileId: null,
    ontologyEntityId: input.ontologyEntityId ?? null,
    vocabularyTermId: input.vocabularyTermId ?? null,
    graphNodeId: input.graphNodeId ?? null,
    version: INDUSTRY_MODELS_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-model-${input.modelId}`, timestamp),
    readOnly: true as const,
  });
  modelRegistry.set(entry.modelId, entry);
  return createResult(true, "Industry model registered.", entry);
}

export function registerIndustryTemplate(
  input: IndustryTemplateRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): IndustryResult<IndustryTemplate> {
  const registeredModelIds = [...modelRegistry.keys()];
  const validation = validateIndustryTemplateRegistration(input, registeredModelIds);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (templateRegistry.has(input.templateId)) {
    return createResult(false, `Industry template already registered: ${input.templateId}.`, null);
  }
  if (templateRegistry.size >= INDUSTRY_MODELS_DEFAULT_LIMITS.maxRegisteredTemplates) {
    return createResult(false, "Industry template registry limit reached.", null);
  }
  const entry = Object.freeze({
    templateId: input.templateId,
    modelId: input.modelId,
    templateType: input.templateType,
    label: input.label.trim(),
    description: input.description.trim(),
    sectorKey: input.sectorKey,
    ontologyEntityId: input.ontologyEntityId ?? null,
    vocabularyTermId: input.vocabularyTermId ?? null,
    graphNodeId: input.graphNodeId ?? null,
    version: INDUSTRY_MODELS_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-template-${input.templateId}`, timestamp),
    readOnly: true as const,
  });
  templateRegistry.set(entry.templateId, entry);
  return createResult(true, "Industry template registered.", entry);
}

export function registerIndustryCategory(
  input: IndustryCategoryRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): IndustryResult<IndustryCategory> {
  const validation = validateIndustryCategoryRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (categoryRegistry.has(input.categoryId)) {
    return createResult(false, `Industry category already registered: ${input.categoryId}.`, null);
  }
  const duplicateKey = [...categoryRegistry.values()].some((entry) => entry.categoryKey === input.categoryKey);
  if (duplicateKey) {
    return createResult(false, `Industry category key already registered: ${input.categoryKey}.`, null);
  }
  if (categoryRegistry.size >= INDUSTRY_MODELS_DEFAULT_LIMITS.maxRegisteredCategories) {
    return createResult(false, "Industry category registry limit reached.", null);
  }
  const entry = Object.freeze({
    categoryId: input.categoryId,
    categoryKey: input.categoryKey,
    label: input.label.trim(),
    description: input.description.trim(),
    version: INDUSTRY_MODELS_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-category-${input.categoryId}`, timestamp),
    readOnly: true as const,
  });
  categoryRegistry.set(entry.categoryId, entry);
  return createResult(true, "Industry category registered.", entry);
}

function registerIndustrySector(
  sectorKey: (typeof INDUSTRY_SECTOR_KEYS)[number],
  timestamp: string
): IndustryResult<BusinessSector> {
  const sectorId = `industry-sector-${sectorKey}`;
  if (sectorRegistry.has(sectorId)) {
    return createResult(false, `Sector already registered: ${sectorId}.`, null);
  }
  const entry = Object.freeze({
    sectorId,
    sectorKey,
    label: INDUSTRY_SECTOR_LABELS[sectorKey],
    description: `${INDUSTRY_SECTOR_LABELS[sectorKey]} industry sector metadata template.`,
    version: INDUSTRY_MODELS_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-sector-${sectorKey}`, timestamp),
    readOnly: true as const,
  });
  sectorRegistry.set(entry.sectorId, entry);
  return createResult(true, "Industry sector registered.", entry);
}

function registerIndustryCapability(
  capabilityKey: (typeof INDUSTRY_CAPABILITY_KEYS)[number],
  timestamp: string
): IndustryResult<IndustryCapability> {
  const capabilityId = `industry-capability-${capabilityKey}`;
  if (capabilityRegistry.has(capabilityId)) {
    return createResult(false, `Capability already registered: ${capabilityId}.`, null);
  }
  const entry = Object.freeze({
    capabilityId,
    capabilityKey,
    label: capabilityKey,
    description: `${capabilityKey} industry models capability metadata.`,
    version: INDUSTRY_MODELS_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-capability-${capabilityKey}`, timestamp),
    readOnly: true as const,
  });
  capabilityRegistry.set(entry.capabilityId, entry);
  return createResult(true, "Industry capability registered.", entry);
}

function registerIndustryNamespace(
  namespaceKey: (typeof INDUSTRY_NAMESPACE_KEYS)[number],
  timestamp: string
): IndustryResult<IndustryNamespace> {
  const namespaceId = `industry-namespace-${namespaceKey}`;
  if (namespaceRegistry.has(namespaceId)) {
    return createResult(false, `Namespace already registered: ${namespaceId}.`, null);
  }
  const entry = Object.freeze({
    namespaceId,
    namespaceKey,
    label: namespaceKey,
    description: `${namespaceKey} industry namespace metadata.`,
    version: INDUSTRY_MODELS_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-namespace-${namespaceKey}`, timestamp),
    readOnly: true as const,
  });
  namespaceRegistry.set(entry.namespaceId, entry);
  return createResult(true, "Industry namespace registered.", entry);
}

export function getIndustryModelsSnapshot(): IndustrySnapshot {
  return Object.freeze({
    platformVersion: INDUSTRY_MODELS_CONTRACT_VERSION,
    modelCount: modelRegistry.size,
    templateCount: templateRegistry.size,
    categoryCount: categoryRegistry.size || INDUSTRY_CATEGORY_KEYS.length,
    sectorCount: sectorRegistry.size || INDUSTRY_SECTOR_KEYS.length,
    capabilityCount: capabilityRegistry.size || INDUSTRY_CAPABILITY_KEYS.length,
    namespaceCount: namespaceRegistry.size || INDUSTRY_NAMESPACE_KEYS.length,
    readOnly: true as const,
  });
}

export function getIndustryModelsRegistry(): Readonly<{
  models: readonly IndustryModel[];
  templates: readonly IndustryTemplate[];
  categories: readonly IndustryCategory[];
  sectors: readonly BusinessSector[];
  capabilities: readonly IndustryCapability[];
  namespaces: readonly IndustryNamespace[];
  metadataRecords: readonly IndustryMetadata[];
  snapshot: IndustrySnapshot;
  readOnly: true;
}> {
  return Object.freeze({
    models: Object.freeze([...modelRegistry.values()].sort((a, b) => a.modelId.localeCompare(b.modelId))),
    templates: Object.freeze([...templateRegistry.values()].sort((a, b) => a.templateId.localeCompare(b.templateId))),
    categories: Object.freeze(
      [...categoryRegistry.values()].sort((a, b) => a.categoryId.localeCompare(b.categoryId))
    ),
    sectors: Object.freeze([...sectorRegistry.values()].sort((a, b) => a.sectorId.localeCompare(b.sectorId))),
    capabilities: Object.freeze(
      [...capabilityRegistry.values()].sort((a, b) => a.capabilityId.localeCompare(b.capabilityId))
    ),
    namespaces: Object.freeze(
      [...namespaceRegistry.values()].sort((a, b) => a.namespaceId.localeCompare(b.namespaceId))
    ),
    metadataRecords: Object.freeze(
      [...metadataRegistry.values()].sort((a, b) => a.metadataId.localeCompare(b.metadataId))
    ),
    snapshot: getIndustryModelsSnapshot(),
    readOnly: true as const,
  });
}

export function seedIndustryModelsCatalog(timestamp: string = new Date(0).toISOString()): void {
  if (sectorRegistry.size > 0) {
    return;
  }
  for (const categoryKey of INDUSTRY_CATEGORY_KEYS) {
    registerIndustryCategory(
      Object.freeze({
        categoryId: `industry-category-${categoryKey}`,
        categoryKey,
        label: categoryKey,
        description: `${categoryKey} industry category metadata.`,
      }),
      timestamp
    );
  }
  for (const capabilityKey of INDUSTRY_CAPABILITY_KEYS) {
    registerIndustryCapability(capabilityKey, timestamp);
  }
  for (const namespaceKey of INDUSTRY_NAMESPACE_KEYS) {
    registerIndustryNamespace(namespaceKey, timestamp);
  }
  for (const sectorKey of INDUSTRY_SECTOR_KEYS) {
    registerIndustrySector(sectorKey, timestamp);
    const modelId = `industry-model-${sectorKey}`;
    registerIndustryModel(
      Object.freeze({
        modelId,
        sectorKey,
        categoryKey: sectorKey === "government" || sectorKey === "education" ? "public_sector" : "primary",
        label: INDUSTRY_SECTOR_LABELS[sectorKey],
        description: `Canonical ${INDUSTRY_SECTOR_LABELS[sectorKey]} industry model metadata template.`,
        ontologyEntityId: "business-relationship-type-contains",
      }),
      timestamp
    );
    registerIndustryTemplate(
      Object.freeze({
        templateId: `industry-template-${sectorKey}-process`,
        modelId,
        templateType: "process",
        label: `${INDUSTRY_SECTOR_LABELS[sectorKey]} Process Template`,
        description: `Process template metadata for ${INDUSTRY_SECTOR_LABELS[sectorKey]}.`,
        sectorKey,
        ontologyEntityId: "business-relationship-type-produces",
      }),
      timestamp
    );
    registerIndustryTemplate(
      Object.freeze({
        templateId: `industry-template-${sectorKey}-kpi`,
        modelId,
        templateType: "kpi",
        label: `${INDUSTRY_SECTOR_LABELS[sectorKey]} KPI Template`,
        description: `KPI template metadata for ${INDUSTRY_SECTOR_LABELS[sectorKey]}.`,
        sectorKey,
        ontologyEntityId: "business-relationship-type-measures",
      }),
      timestamp
    );
  }
  const rootMetadata = createMetadata("industry-models-root-metadata", timestamp, Object.freeze({ catalog: "default" }));
  metadataRegistry.set(rootMetadata.metadataId, rootMetadata);
}

export const IndustryModelsRegistry = Object.freeze({
  resetIndustryModelsRegistryForTests,
  initializeIndustryModels,
  registerIndustryModel,
  registerIndustryTemplate,
  registerIndustryCategory,
  getIndustryModelsRegistry,
  getIndustryModelsSnapshot,
  seedIndustryModelsCatalog,
});
