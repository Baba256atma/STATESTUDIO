/**
 * KNL-6 — Framework Library metadata registry.
 */

import {
  FRAMEWORK_CAPABILITY_KEYS,
  FRAMEWORK_CATEGORY_KEYS,
  FRAMEWORK_KEYS,
  FRAMEWORK_LABELS,
  FRAMEWORK_LIBRARY_CONTRACT_VERSION,
  FRAMEWORK_LIBRARY_DEFAULT_LIMITS,
  FRAMEWORK_LIBRARY_ID,
  FRAMEWORK_LIBRARY_NAMESPACE,
  FRAMEWORK_LIBRARY_OWNER,
  FRAMEWORK_NAMESPACE_KEYS,
} from "./frameworkLibraryCatalog.ts";
import type {
  Framework,
  FrameworkCapability,
  FrameworkCategory,
  FrameworkComponent,
  FrameworkComponentRegistrationInput,
  FrameworkCategoryRegistrationInput,
  FrameworkMetadata,
  FrameworkNamespace,
  FrameworkRegistrationInput,
  FrameworkResult,
  FrameworkSnapshot,
  FrameworkLibraryState,
  FrameworkTemplate,
  FrameworkTemplateRegistrationInput,
} from "./frameworkLibraryTypes.ts";
import type { FrameworkCategoryKey } from "./frameworkLibraryTypes.ts";
import {
  validateFrameworkCategoryRegistration,
  validateFrameworkRegistration,
  validateFrameworkTemplateRegistration,
} from "./frameworkLibraryValidation.ts";
import { initializeIndustryModels } from "./industryModelRegistry.ts";

export const FRAMEWORK_LIBRARY_REGISTRY_VERSION = "KNL/6-REGISTRY-1" as const;

const FRAMEWORK_CATEGORY_MAP: Readonly<Record<(typeof FRAMEWORK_KEYS)[number], FrameworkCategoryKey>> = Object.freeze({
  swot: "strategic_analysis",
  pestel: "strategic_analysis",
  porters_five_forces: "strategic_analysis",
  business_model_canvas: "strategic_analysis",
  balanced_scorecard: "performance_management",
  okr: "goal_setting",
  kpi_framework: "performance_management",
  value_chain: "operational_excellence",
  mckinsey_7s: "organizational_design",
  bcg_matrix: "strategic_analysis",
  ansoff_matrix: "strategic_analysis",
  vrio: "strategic_analysis",
  raci: "organizational_design",
  smart_goals: "goal_setting",
  pdca: "operational_excellence",
});

const frameworkRegistry = new Map<string, Framework>();
const templateRegistry = new Map<string, FrameworkTemplate>();
const categoryRegistry = new Map<string, FrameworkCategory>();
const componentRegistry = new Map<string, FrameworkComponent>();
const capabilityRegistry = new Map<string, FrameworkCapability>();
const namespaceRegistry = new Map<string, FrameworkNamespace>();
const metadataRegistry = new Map<string, FrameworkMetadata>();

let libraryInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): FrameworkResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function createMetadata(metadataId: string, timestamp: string, extensions: Readonly<Record<string, string>> = {}) {
  return Object.freeze({
    metadataId,
    metadataVersion: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    namespace: FRAMEWORK_LIBRARY_NAMESPACE,
    owner: FRAMEWORK_LIBRARY_OWNER,
    extensions: Object.freeze({ ...extensions }),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resetFrameworkLibraryRegistryForTests(): void {
  frameworkRegistry.clear();
  templateRegistry.clear();
  categoryRegistry.clear();
  componentRegistry.clear();
  capabilityRegistry.clear();
  namespaceRegistry.clear();
  metadataRegistry.clear();
  libraryInitialized = false;
  lastInitializedAt = null;
}

export function isFrameworkLibraryInitialized(): boolean {
  return libraryInitialized;
}

export function getFrameworkLibraryState(timestamp: string = new Date(0).toISOString()): FrameworkLibraryState {
  const snapshot = getFrameworkLibrarySnapshot();
  return Object.freeze({
    platformId: FRAMEWORK_LIBRARY_ID,
    contractVersion: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    industryDependency: "KNL/5",
    initialized: libraryInitialized,
    frameworkCount: snapshot.frameworkCount,
    templateCount: snapshot.templateCount,
    componentCount: snapshot.componentCount,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function initializeFrameworkLibrary(
  timestamp: string = new Date(0).toISOString()
): FrameworkResult<FrameworkLibraryState> {
  const industry = initializeIndustryModels(timestamp);
  if (!industry.success) {
    return createResult(false, "KNL/5 Industry Models initialization failed.", null);
  }
  seedFrameworkLibraryCatalog(timestamp);
  libraryInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Framework library initialized.", getFrameworkLibraryState(timestamp));
}

export function registerFramework(
  input: FrameworkRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): FrameworkResult<Framework> {
  const validation = validateFrameworkRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (frameworkRegistry.has(input.frameworkId)) {
    return createResult(false, `Framework already registered: ${input.frameworkId}.`, null);
  }
  const duplicateName = [...frameworkRegistry.values()].some(
    (entry) => entry.canonicalName.trim().toLowerCase() === input.canonicalName.trim().toLowerCase()
  );
  if (duplicateName) {
    return createResult(false, `Framework canonical name already registered: ${input.canonicalName}.`, null);
  }
  if (frameworkRegistry.size >= FRAMEWORK_LIBRARY_DEFAULT_LIMITS.maxRegisteredFrameworks) {
    return createResult(false, "Framework registry limit reached.", null);
  }
  const entry = Object.freeze({
    frameworkId: input.frameworkId,
    frameworkKey: input.frameworkKey,
    canonicalName: input.canonicalName.trim(),
    label: input.label.trim(),
    description: input.description.trim(),
    categoryKey: input.categoryKey,
    ontologyEntityId: input.ontologyEntityId ?? null,
    vocabularyTermId: input.vocabularyTermId ?? null,
    industryModelId: input.industryModelId ?? null,
    version: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-framework-${input.frameworkId}`, timestamp),
    readOnly: true as const,
  });
  frameworkRegistry.set(entry.frameworkId, entry);
  return createResult(true, "Framework registered.", entry);
}

export function registerFrameworkTemplate(
  input: FrameworkTemplateRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): FrameworkResult<FrameworkTemplate> {
  const registeredFrameworkIds = [...frameworkRegistry.keys()];
  const validation = validateFrameworkTemplateRegistration(input, registeredFrameworkIds);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (templateRegistry.has(input.templateId)) {
    return createResult(false, `Framework template already registered: ${input.templateId}.`, null);
  }
  if (templateRegistry.size >= FRAMEWORK_LIBRARY_DEFAULT_LIMITS.maxRegisteredTemplates) {
    return createResult(false, "Framework template registry limit reached.", null);
  }
  const entry = Object.freeze({
    templateId: input.templateId,
    frameworkId: input.frameworkId,
    label: input.label.trim(),
    description: input.description.trim(),
    categoryKey: input.categoryKey,
    version: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-template-${input.templateId}`, timestamp),
    readOnly: true as const,
  });
  templateRegistry.set(entry.templateId, entry);
  return createResult(true, "Framework template registered.", entry);
}

export function registerFrameworkCategory(
  input: FrameworkCategoryRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): FrameworkResult<FrameworkCategory> {
  const validation = validateFrameworkCategoryRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (categoryRegistry.has(input.categoryId)) {
    return createResult(false, `Framework category already registered: ${input.categoryId}.`, null);
  }
  const duplicateKey = [...categoryRegistry.values()].some((entry) => entry.categoryKey === input.categoryKey);
  if (duplicateKey) {
    return createResult(false, `Framework category key already registered: ${input.categoryKey}.`, null);
  }
  if (categoryRegistry.size >= FRAMEWORK_LIBRARY_DEFAULT_LIMITS.maxRegisteredCategories) {
    return createResult(false, "Framework category registry limit reached.", null);
  }
  const entry = Object.freeze({
    categoryId: input.categoryId,
    categoryKey: input.categoryKey,
    label: input.label.trim(),
    description: input.description.trim(),
    version: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-category-${input.categoryId}`, timestamp),
    readOnly: true as const,
  });
  categoryRegistry.set(entry.categoryId, entry);
  return createResult(true, "Framework category registered.", entry);
}

function registerFrameworkComponent(
  input: FrameworkComponentRegistrationInput,
  timestamp: string
): FrameworkResult<FrameworkComponent> {
  if (!frameworkRegistry.has(input.frameworkId)) {
    return createResult(false, `Framework not found: ${input.frameworkId}.`, null);
  }
  if (componentRegistry.has(input.componentId)) {
    return createResult(false, `Framework component already registered: ${input.componentId}.`, null);
  }
  const entry = Object.freeze({
    componentId: input.componentId,
    frameworkId: input.frameworkId,
    label: input.label.trim(),
    description: input.description.trim(),
    version: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-component-${input.componentId}`, timestamp),
    readOnly: true as const,
  });
  componentRegistry.set(entry.componentId, entry);
  return createResult(true, "Framework component registered.", entry);
}

function registerFrameworkCapability(
  capabilityKey: (typeof FRAMEWORK_CAPABILITY_KEYS)[number],
  timestamp: string
): FrameworkResult<FrameworkCapability> {
  const capabilityId = `framework-capability-${capabilityKey}`;
  if (capabilityRegistry.has(capabilityId)) {
    return createResult(false, `Capability already registered: ${capabilityId}.`, null);
  }
  const entry = Object.freeze({
    capabilityId,
    capabilityKey,
    label: capabilityKey,
    description: `${capabilityKey} framework library capability metadata.`,
    version: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-capability-${capabilityKey}`, timestamp),
    readOnly: true as const,
  });
  capabilityRegistry.set(entry.capabilityId, entry);
  return createResult(true, "Framework capability registered.", entry);
}

function registerFrameworkNamespace(
  namespaceKey: (typeof FRAMEWORK_NAMESPACE_KEYS)[number],
  timestamp: string
): FrameworkResult<FrameworkNamespace> {
  const namespaceId = `framework-namespace-${namespaceKey}`;
  if (namespaceRegistry.has(namespaceId)) {
    return createResult(false, `Namespace already registered: ${namespaceId}.`, null);
  }
  const entry = Object.freeze({
    namespaceId,
    namespaceKey,
    label: namespaceKey,
    description: `${namespaceKey} framework namespace metadata.`,
    version: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-namespace-${namespaceKey}`, timestamp),
    readOnly: true as const,
  });
  namespaceRegistry.set(entry.namespaceId, entry);
  return createResult(true, "Framework namespace registered.", entry);
}

export function getFrameworkLibrarySnapshot(): FrameworkSnapshot {
  return Object.freeze({
    platformVersion: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    frameworkCount: frameworkRegistry.size,
    templateCount: templateRegistry.size,
    categoryCount: categoryRegistry.size || FRAMEWORK_CATEGORY_KEYS.length,
    componentCount: componentRegistry.size,
    capabilityCount: capabilityRegistry.size || FRAMEWORK_CAPABILITY_KEYS.length,
    namespaceCount: namespaceRegistry.size || FRAMEWORK_NAMESPACE_KEYS.length,
    readOnly: true as const,
  });
}

export function getFrameworkLibraryRegistry(): Readonly<{
  frameworks: readonly Framework[];
  templates: readonly FrameworkTemplate[];
  categories: readonly FrameworkCategory[];
  components: readonly FrameworkComponent[];
  capabilities: readonly FrameworkCapability[];
  namespaces: readonly FrameworkNamespace[];
  metadataRecords: readonly FrameworkMetadata[];
  snapshot: FrameworkSnapshot;
  readOnly: true;
}> {
  return Object.freeze({
    frameworks: Object.freeze(
      [...frameworkRegistry.values()].sort((a, b) => a.frameworkId.localeCompare(b.frameworkId))
    ),
    templates: Object.freeze(
      [...templateRegistry.values()].sort((a, b) => a.templateId.localeCompare(b.templateId))
    ),
    categories: Object.freeze(
      [...categoryRegistry.values()].sort((a, b) => a.categoryId.localeCompare(b.categoryId))
    ),
    components: Object.freeze(
      [...componentRegistry.values()].sort((a, b) => a.componentId.localeCompare(b.componentId))
    ),
    capabilities: Object.freeze(
      [...capabilityRegistry.values()].sort((a, b) => a.capabilityId.localeCompare(b.capabilityId))
    ),
    namespaces: Object.freeze(
      [...namespaceRegistry.values()].sort((a, b) => a.namespaceId.localeCompare(b.namespaceId))
    ),
    metadataRecords: Object.freeze(
      [...metadataRegistry.values()].sort((a, b) => a.metadataId.localeCompare(b.metadataId))
    ),
    snapshot: getFrameworkLibrarySnapshot(),
    readOnly: true as const,
  });
}

export function seedFrameworkLibraryCatalog(timestamp: string = new Date(0).toISOString()): void {
  if (frameworkRegistry.size > 0) {
    return;
  }
  for (const categoryKey of FRAMEWORK_CATEGORY_KEYS) {
    registerFrameworkCategory(
      Object.freeze({
        categoryId: `framework-category-${categoryKey}`,
        categoryKey,
        label: categoryKey,
        description: `${categoryKey} framework category metadata.`,
      }),
      timestamp
    );
  }
  for (const capabilityKey of FRAMEWORK_CAPABILITY_KEYS) {
    registerFrameworkCapability(capabilityKey, timestamp);
  }
  for (const namespaceKey of FRAMEWORK_NAMESPACE_KEYS) {
    registerFrameworkNamespace(namespaceKey, timestamp);
  }
  for (const frameworkKey of FRAMEWORK_KEYS) {
    const frameworkId = `framework-${frameworkKey}`;
    const categoryKey = FRAMEWORK_CATEGORY_MAP[frameworkKey];
    registerFramework(
      Object.freeze({
        frameworkId,
        frameworkKey,
        canonicalName: frameworkKey,
        label: FRAMEWORK_LABELS[frameworkKey],
        description: `Canonical metadata template for ${FRAMEWORK_LABELS[frameworkKey]}.`,
        categoryKey,
        ontologyEntityId: "business-relationship-type-supports",
        industryModelId: "industry-model-technology",
      }),
      timestamp
    );
    registerFrameworkTemplate(
      Object.freeze({
        templateId: `framework-template-${frameworkKey}`,
        frameworkId,
        label: `${FRAMEWORK_LABELS[frameworkKey]} Template`,
        description: `Standard template metadata for ${FRAMEWORK_LABELS[frameworkKey]}.`,
        categoryKey,
      }),
      timestamp
    );
    registerFrameworkComponent(
      Object.freeze({
        componentId: `framework-component-${frameworkKey}-core`,
        frameworkId,
        label: `${FRAMEWORK_LABELS[frameworkKey]} Core Component`,
        description: `Core component metadata for ${FRAMEWORK_LABELS[frameworkKey]}.`,
      }),
      timestamp
    );
  }
  const rootMetadata = createMetadata("framework-library-root-metadata", timestamp, Object.freeze({ catalog: "default" }));
  metadataRegistry.set(rootMetadata.metadataId, rootMetadata);
}

export const FrameworkLibraryRegistry = Object.freeze({
  resetFrameworkLibraryRegistryForTests,
  initializeFrameworkLibrary,
  registerFramework,
  registerFrameworkTemplate,
  registerFrameworkCategory,
  getFrameworkLibraryRegistry,
  getFrameworkLibrarySnapshot,
  seedFrameworkLibraryCatalog,
});
