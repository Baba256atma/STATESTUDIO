/**
 * KNL-8 — Best Practices metadata registry.
 */

import {
  BEST_PRACTICE_CATEGORY_KEYS,
  BEST_PRACTICE_CONTRACT_VERSION,
  BEST_PRACTICE_DEFAULT_LIMITS,
  BEST_PRACTICE_EXTENSION_POINT_KEYS,
  BEST_PRACTICE_FRAMEWORK_MAP,
  BEST_PRACTICE_LABELS,
  BEST_PRACTICE_NAMESPACE_KEYS,
  BEST_PRACTICE_PLATFORM_ID,
  BEST_PRACTICE_NAMESPACE,
  BEST_PRACTICE_OWNER,
  BEST_PRACTICE_POLICY_MAP,
  BEST_PRACTICE_SOURCE_KEYS,
} from "./bestPracticeCatalog.ts";
import type {
  BestPractice,
  BestPracticeCategory,
  BestPracticeCategoryRegistrationInput,
  BestPracticeExtensionPoint,
  BestPracticeMetadata,
  BestPracticeNamespace,
  BestPracticeOwner,
  BestPracticePlatformSnapshot,
  BestPracticePlatformState,
  BestPracticePrinciple,
  BestPracticeRegistrationInput,
  BestPracticeResult,
  BestPracticeSource,
  BestPracticeTemplate,
  BestPracticeTemplateRegistrationInput,
} from "./bestPracticeTypes.ts";
import type { BestPracticeCategoryKey } from "./bestPracticeTypes.ts";
import {
  validateBestPracticeCategoryRegistration,
  validateBestPracticeRegistration,
  validateBestPracticeTemplateRegistration,
} from "./bestPracticeValidation.ts";
import { initializePolicyRuleBase } from "./policyRuleRegistry.ts";

export const BEST_PRACTICE_REGISTRY_VERSION = "KNL/8-REGISTRY-1" as const;

const practiceRegistry = new Map<string, BestPractice>();
const templateRegistry = new Map<string, BestPracticeTemplate>();
const categoryRegistry = new Map<string, BestPracticeCategory>();
const principleRegistry = new Map<string, BestPracticePrinciple>();
const sourceRegistry = new Map<string, BestPracticeSource>();
const ownerRegistry = new Map<string, BestPracticeOwner>();
const namespaceRegistry = new Map<string, BestPracticeNamespace>();
const extensionPointRegistry = new Map<string, BestPracticeExtensionPoint>();
const metadataRegistry = new Map<string, BestPracticeMetadata>();

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): BestPracticeResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function createMetadata(metadataId: string, timestamp: string, extensions: Readonly<Record<string, string>> = {}) {
  return Object.freeze({
    metadataId,
    metadataVersion: BEST_PRACTICE_CONTRACT_VERSION,
    namespace: BEST_PRACTICE_NAMESPACE,
    owner: BEST_PRACTICE_OWNER,
    extensions: Object.freeze({ ...extensions }),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resetBestPracticeRegistryForTests(): void {
  practiceRegistry.clear();
  templateRegistry.clear();
  categoryRegistry.clear();
  principleRegistry.clear();
  sourceRegistry.clear();
  ownerRegistry.clear();
  namespaceRegistry.clear();
  extensionPointRegistry.clear();
  metadataRegistry.clear();
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isBestPracticePlatformInitialized(): boolean {
  return platformInitialized;
}

export function getBestPracticePlatformState(timestamp: string = new Date(0).toISOString()): BestPracticePlatformState {
  const snapshot = getBestPracticePlatformSnapshot();
  return Object.freeze({
    platformId: BEST_PRACTICE_PLATFORM_ID,
    contractVersion: BEST_PRACTICE_CONTRACT_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    industryDependency: "KNL/5",
    frameworkDependency: "KNL/6",
    policyDependency: "KNL/7",
    initialized: platformInitialized,
    practiceCount: snapshot.practiceCount,
    templateCount: snapshot.templateCount,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function initializeBestPracticePlatform(
  timestamp: string = new Date(0).toISOString()
): BestPracticeResult<BestPracticePlatformState> {
  const policy = initializePolicyRuleBase(timestamp);
  if (!policy.success) {
    return createResult(false, "KNL/7 Policy & Rule Base initialization failed.", null);
  }
  seedBestPracticeCatalog(timestamp);
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Best practice platform initialized.", getBestPracticePlatformState(timestamp));
}

export function registerBestPractice(
  input: BestPracticeRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): BestPracticeResult<BestPractice> {
  const validation = validateBestPracticeRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (practiceRegistry.size >= BEST_PRACTICE_DEFAULT_LIMITS.maxRegisteredPractices) {
    return createResult(false, "Best practice registration limit reached.", null);
  }
  if (practiceRegistry.has(input.practiceId)) {
    return createResult(false, `Best practice already registered: ${input.practiceId}.`, null);
  }
  const duplicateName = [...practiceRegistry.values()].some(
    (entry) => entry.canonicalName.trim().toLowerCase() === input.canonicalName.trim().toLowerCase()
  );
  if (duplicateName) {
    return createResult(false, `Canonical name already registered: ${input.canonicalName}.`, null);
  }
  const frameworkId = input.frameworkId ?? BEST_PRACTICE_FRAMEWORK_MAP[input.categoryKey];
  const policyId = input.policyId ?? BEST_PRACTICE_POLICY_MAP[input.categoryKey];
  const industryModelId = input.industryModelId ?? "industry-model-technology";
  const principle = Object.freeze({
    principleId: `best-practice-principle-${input.practiceId}`,
    label: input.principleLabel,
    description: input.principleDescription,
    categoryKey: input.categoryKey,
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-principle-${input.practiceId}`, timestamp),
    readOnly: true as const,
  });
  principleRegistry.set(principle.principleId, principle);
  const entry = Object.freeze({
    practiceId: input.practiceId,
    categoryKey: input.categoryKey,
    canonicalName: input.canonicalName,
    label: input.label,
    description: input.description,
    principle,
    guideline: Object.freeze({
      guidelineId: `best-practice-guideline-${input.practiceId}`,
      label: input.guidelineLabel,
      description: input.guidelineDescription,
      readOnly: true as const,
    }),
    recommendation: Object.freeze({
      recommendationId: `best-practice-recommendation-${input.practiceId}`,
      description: input.recommendationDescription,
      readOnly: true as const,
    }),
    context: Object.freeze({
      contextId: `best-practice-context-${input.practiceId}`,
      contextKey: input.contextKey,
      label: input.contextKey,
      description: input.contextDescription,
      readOnly: true as const,
    }),
    industryMapping: Object.freeze({
      mappingId: `best-practice-industry-${input.practiceId}`,
      industryModelId,
      description: `Industry mapping metadata for ${input.label}.`,
      readOnly: true as const,
    }),
    frameworkMapping: Object.freeze({
      mappingId: `best-practice-framework-${input.practiceId}`,
      frameworkId,
      description: `Framework mapping metadata for ${input.label}.`,
      readOnly: true as const,
    }),
    policyMapping: Object.freeze({
      mappingId: `best-practice-policy-${input.practiceId}`,
      policyId,
      description: `Policy mapping metadata for ${input.label}.`,
      readOnly: true as const,
    }),
    kpiMapping: Object.freeze({
      mappingId: `best-practice-kpi-${input.practiceId}`,
      kpiLabel: input.kpiLabel,
      description: input.kpiDescription,
      readOnly: true as const,
    }),
    riskMapping: Object.freeze({
      mappingId: `best-practice-risk-${input.practiceId}`,
      riskLabel: input.riskLabel,
      description: input.riskDescription,
      readOnly: true as const,
    }),
    ownerId: input.ownerId ?? null,
    sourceId: input.sourceId ?? null,
    ontologyEntityId: input.ontologyEntityId ?? null,
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-practice-${input.practiceId}`, timestamp),
    readOnly: true as const,
  });
  practiceRegistry.set(entry.practiceId, entry);
  return createResult(true, "Best practice registered.", entry);
}

export function registerBestPracticeTemplate(
  input: BestPracticeTemplateRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): BestPracticeResult<BestPracticeTemplate> {
  const validation = validateBestPracticeTemplateRegistration(input, [...practiceRegistry.keys()]);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (templateRegistry.size >= BEST_PRACTICE_DEFAULT_LIMITS.maxRegisteredTemplates) {
    return createResult(false, "Best practice template registration limit reached.", null);
  }
  if (templateRegistry.has(input.templateId)) {
    return createResult(false, `Best practice template already registered: ${input.templateId}.`, null);
  }
  const entry = Object.freeze({
    templateId: input.templateId,
    practiceId: input.practiceId,
    categoryKey: input.categoryKey,
    label: input.label,
    description: input.description,
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-template-${input.templateId}`, timestamp),
    readOnly: true as const,
  });
  templateRegistry.set(entry.templateId, entry);
  return createResult(true, "Best practice template registered.", entry);
}

export function registerBestPracticeCategory(
  input: BestPracticeCategoryRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): BestPracticeResult<BestPracticeCategory> {
  const validation = validateBestPracticeCategoryRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (categoryRegistry.size >= BEST_PRACTICE_DEFAULT_LIMITS.maxRegisteredCategories) {
    return createResult(false, "Best practice category registration limit reached.", null);
  }
  if (categoryRegistry.has(input.categoryId)) {
    return createResult(false, `Best practice category already registered: ${input.categoryId}.`, null);
  }
  const duplicateKey = [...categoryRegistry.values()].some((entry) => entry.categoryKey === input.categoryKey);
  if (duplicateKey) {
    return createResult(false, `Best practice category key already registered: ${input.categoryKey}.`, null);
  }
  const entry = Object.freeze({
    categoryId: input.categoryId,
    categoryKey: input.categoryKey,
    label: input.label,
    description: input.description,
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-category-${input.categoryId}`, timestamp),
    readOnly: true as const,
  });
  categoryRegistry.set(entry.categoryId, entry);
  return createResult(true, "Best practice category registered.", entry);
}

function registerBestPracticeSource(
  sourceKey: (typeof BEST_PRACTICE_SOURCE_KEYS)[number],
  timestamp: string
): BestPracticeResult<BestPracticeSource> {
  const sourceId = `best-practice-source-${sourceKey}`;
  if (sourceRegistry.has(sourceId)) {
    return createResult(false, `Best practice source already registered: ${sourceId}.`, null);
  }
  const entry = Object.freeze({
    sourceId,
    sourceKey,
    label: sourceKey,
    description: `${sourceKey} best practice source metadata.`,
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-source-${sourceKey}`, timestamp),
    readOnly: true as const,
  });
  sourceRegistry.set(entry.sourceId, entry);
  return createResult(true, "Best practice source registered.", entry);
}

function registerBestPracticeOwner(
  ownerId: string,
  label: string,
  description: string,
  timestamp: string
): BestPracticeResult<BestPracticeOwner> {
  if (ownerRegistry.has(ownerId)) {
    return createResult(false, `Best practice owner already registered: ${ownerId}.`, null);
  }
  const entry = Object.freeze({
    ownerId,
    label,
    description,
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-owner-${ownerId}`, timestamp),
    readOnly: true as const,
  });
  ownerRegistry.set(entry.ownerId, entry);
  return createResult(true, "Best practice owner registered.", entry);
}

function registerBestPracticeNamespace(
  namespaceKey: (typeof BEST_PRACTICE_NAMESPACE_KEYS)[number],
  timestamp: string
): BestPracticeResult<BestPracticeNamespace> {
  const namespaceId = `best-practice-namespace-${namespaceKey}`;
  if (namespaceRegistry.has(namespaceId)) {
    return createResult(false, `Best practice namespace already registered: ${namespaceId}.`, null);
  }
  const entry = Object.freeze({
    namespaceId,
    namespaceKey,
    label: namespaceKey,
    description: `${namespaceKey} best practice namespace metadata.`,
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-namespace-${namespaceKey}`, timestamp),
    readOnly: true as const,
  });
  namespaceRegistry.set(entry.namespaceId, entry);
  return createResult(true, "Best practice namespace registered.", entry);
}

function registerBestPracticeExtensionPoint(
  extensionPointKey: (typeof BEST_PRACTICE_EXTENSION_POINT_KEYS)[number],
  timestamp: string
): BestPracticeResult<BestPracticeExtensionPoint> {
  const extensionPointId = `best-practice-extension-${extensionPointKey.replace(/_/g, "-")}`;
  if (extensionPointRegistry.has(extensionPointId)) {
    return createResult(false, `Best practice extension point already registered: ${extensionPointId}.`, null);
  }
  const entry = Object.freeze({
    extensionPointId,
    extensionPointKey,
    label: extensionPointKey,
    description: `${extensionPointKey} best practice extension point metadata.`,
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-extension-${extensionPointKey}`, timestamp),
    readOnly: true as const,
  });
  extensionPointRegistry.set(entry.extensionPointId, entry);
  return createResult(true, "Best practice extension point registered.", entry);
}

export function getBestPracticePlatformSnapshot(): BestPracticePlatformSnapshot {
  return Object.freeze({
    platformVersion: BEST_PRACTICE_CONTRACT_VERSION,
    practiceCount: practiceRegistry.size,
    templateCount: templateRegistry.size,
    categoryCount: categoryRegistry.size || BEST_PRACTICE_CATEGORY_KEYS.length,
    principleCount: principleRegistry.size,
    sourceCount: sourceRegistry.size || BEST_PRACTICE_SOURCE_KEYS.length,
    ownerCount: ownerRegistry.size,
    namespaceCount: namespaceRegistry.size || BEST_PRACTICE_NAMESPACE_KEYS.length,
    readOnly: true as const,
  });
}

export function getBestPracticePlatformRegistry(): Readonly<{
  practices: readonly BestPractice[];
  templates: readonly BestPracticeTemplate[];
  categories: readonly BestPracticeCategory[];
  principles: readonly BestPracticePrinciple[];
  sources: readonly BestPracticeSource[];
  owners: readonly BestPracticeOwner[];
  namespaces: readonly BestPracticeNamespace[];
  extensionPoints: readonly BestPracticeExtensionPoint[];
  metadataRecords: readonly BestPracticeMetadata[];
  snapshot: BestPracticePlatformSnapshot;
  readOnly: true;
}> {
  return Object.freeze({
    practices: Object.freeze(
      [...practiceRegistry.values()].sort((a, b) => a.practiceId.localeCompare(b.practiceId))
    ),
    templates: Object.freeze(
      [...templateRegistry.values()].sort((a, b) => a.templateId.localeCompare(b.templateId))
    ),
    categories: Object.freeze(
      [...categoryRegistry.values()].sort((a, b) => a.categoryId.localeCompare(b.categoryId))
    ),
    principles: Object.freeze(
      [...principleRegistry.values()].sort((a, b) => a.principleId.localeCompare(b.principleId))
    ),
    sources: Object.freeze(
      [...sourceRegistry.values()].sort((a, b) => a.sourceId.localeCompare(b.sourceId))
    ),
    owners: Object.freeze(
      [...ownerRegistry.values()].sort((a, b) => a.ownerId.localeCompare(b.ownerId))
    ),
    namespaces: Object.freeze(
      [...namespaceRegistry.values()].sort((a, b) => a.namespaceId.localeCompare(b.namespaceId))
    ),
    extensionPoints: Object.freeze(
      [...extensionPointRegistry.values()].sort((a, b) => a.extensionPointId.localeCompare(b.extensionPointId))
    ),
    metadataRecords: Object.freeze(
      [...metadataRegistry.values()].sort((a, b) => a.metadataId.localeCompare(b.metadataId))
    ),
    snapshot: getBestPracticePlatformSnapshot(),
    readOnly: true as const,
  });
}

export function seedBestPracticeCatalog(timestamp: string = new Date(0).toISOString()): void {
  if (practiceRegistry.size > 0) {
    return;
  }
  for (const categoryKey of BEST_PRACTICE_CATEGORY_KEYS) {
    registerBestPracticeCategory(
      Object.freeze({
        categoryId: `best-practice-category-${categoryKey}`,
        categoryKey,
        label: BEST_PRACTICE_LABELS[categoryKey],
        description: `${BEST_PRACTICE_LABELS[categoryKey]} best practice category metadata.`,
      }),
      timestamp
    );
  }
  for (const sourceKey of BEST_PRACTICE_SOURCE_KEYS) {
    registerBestPracticeSource(sourceKey, timestamp);
  }
  for (const namespaceKey of BEST_PRACTICE_NAMESPACE_KEYS) {
    registerBestPracticeNamespace(namespaceKey, timestamp);
  }
  for (const extensionPointKey of BEST_PRACTICE_EXTENSION_POINT_KEYS) {
    registerBestPracticeExtensionPoint(extensionPointKey, timestamp);
  }
  registerBestPracticeOwner(
    "best-practice-owner-executive",
    "Executive Office",
    "Executive best practice ownership metadata.",
    timestamp
  );
  registerBestPracticeOwner(
    "best-practice-owner-operations",
    "Operations Office",
    "Operational best practice ownership metadata.",
    timestamp
  );
  for (const categoryKey of BEST_PRACTICE_CATEGORY_KEYS) {
    const practiceId = `best-practice-${categoryKey}`;
    const label = BEST_PRACTICE_LABELS[categoryKey];
    registerBestPractice(
      Object.freeze({
        practiceId,
        categoryKey,
        canonicalName: categoryKey,
        label: `${label} Best Practice`,
        description: `Canonical metadata best practice for ${label}.`,
        principleLabel: `${label} Principle`,
        principleDescription: `Core principle metadata for ${label} (descriptive only).`,
        guidelineLabel: `${label} Guideline`,
        guidelineDescription: `Guideline metadata for ${label} (descriptive only).`,
        recommendationDescription: `Documented recommendation metadata for ${label} (not executable).`,
        contextKey: "organization",
        contextDescription: `Organizational context metadata for ${label}.`,
        kpiLabel: `${label} KPI`,
        kpiDescription: `KPI mapping metadata for ${label}.`,
        riskLabel: `${label} Risk`,
        riskDescription: `Risk mapping metadata for ${label}.`,
        ownerId: categoryKey === "operational_excellence" || categoryKey === "process_improvement"
          ? "best-practice-owner-operations"
          : "best-practice-owner-executive",
        sourceId: "best-practice-source-industry_standard",
        ontologyEntityId: "business-relationship-type-supports",
        frameworkId: BEST_PRACTICE_FRAMEWORK_MAP[categoryKey],
        policyId: BEST_PRACTICE_POLICY_MAP[categoryKey],
        industryModelId: "industry-model-technology",
      }),
      timestamp
    );
    registerBestPracticeTemplate(
      Object.freeze({
        templateId: `best-practice-template-${categoryKey}`,
        practiceId,
        categoryKey,
        label: `${label} Template`,
        description: `Standard template metadata for ${label} best practice.`,
      }),
      timestamp
    );
  }
  const rootMetadata = createMetadata("best-practice-platform-root-metadata", timestamp, Object.freeze({ catalog: "default" }));
  metadataRegistry.set(rootMetadata.metadataId, rootMetadata);
}

export const BestPracticeRegistry = Object.freeze({
  resetBestPracticeRegistryForTests,
  initializeBestPracticePlatform,
  registerBestPractice,
  registerBestPracticeTemplate,
  registerBestPracticeCategory,
  getBestPracticePlatformRegistry,
  getBestPracticePlatformSnapshot,
  seedBestPracticeCatalog,
});
