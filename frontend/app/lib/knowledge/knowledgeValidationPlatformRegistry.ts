/**
 * KNL-10 — Knowledge Validation Platform metadata registry.
 */

import {
  KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
  KNOWLEDGE_VALIDATION_DEFAULT_LIMITS,
  KNOWLEDGE_VALIDATION_NAMESPACE,
  KNOWLEDGE_VALIDATION_OWNER,
  KNOWLEDGE_VALIDATION_PLATFORM_ID,
  VALIDATION_CATEGORY_KEYS,
  VALIDATION_DEPENDENCY_KEYS,
  VALIDATION_EXTENSION_POINT_KEYS,
  VALIDATION_NAMESPACE_KEYS,
  VALIDATION_PLATFORM_ID_MAP,
  VALIDATION_PROFILE_CATEGORY_MAP,
  VALIDATION_PROFILE_DEPENDENCY_MAP,
  VALIDATION_PROFILE_KEYS,
  VALIDATION_PROFILE_LABELS,
  VALIDATION_PROFILE_TARGET_MAP,
  VALIDATION_SCOPE_KEYS,
} from "./knowledgeValidationPlatformCatalog.ts";
import type {
  KnowledgeValidationCategoryRegistrationInput,
  KnowledgeValidationPlatformResult,
  KnowledgeValidationPlatformSnapshot,
  KnowledgeValidationPlatformState,
  KnowledgeValidationProfile,
  KnowledgeValidationProfileRegistrationInput,
  KnowledgeValidationRuleRegistrationInput,
  ValidationCategory,
  ValidationDependency,
  ValidationExtensionPoint,
  ValidationMetadata,
  ValidationNamespace,
  ValidationRule,
  ValidationScope,
  ValidationTarget,
} from "./knowledgeValidationPlatformTypes.ts";
import {
  validateKnowledgeValidationCategoryRegistration,
  validateKnowledgeValidationProfileRegistration,
  validateKnowledgeValidationRuleRegistration,
} from "./knowledgeValidationPlatformValidation.ts";
import { initializeKnowledgeRetrievalEngine } from "./knowledgeRetrievalRegistry.ts";

export const KNOWLEDGE_VALIDATION_REGISTRY_VERSION = "KNL/10-REGISTRY-1" as const;

const profileRegistry = new Map<string, KnowledgeValidationProfile>();
const ruleRegistry = new Map<string, ValidationRule>();
const categoryRegistry = new Map<string, ValidationCategory>();
const scopeRegistry = new Map<string, ValidationScope>();
const targetRegistry = new Map<string, ValidationTarget>();
const namespaceRegistry = new Map<string, ValidationNamespace>();
const dependencyRegistry = new Map<string, ValidationDependency>();
const extensionPointRegistry = new Map<string, ValidationExtensionPoint>();
const metadataRegistry = new Map<string, ValidationMetadata>();

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): KnowledgeValidationPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function createMetadata(metadataId: string, timestamp: string, extensions: Readonly<Record<string, string>> = {}) {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    namespace: KNOWLEDGE_VALIDATION_NAMESPACE,
    owner: KNOWLEDGE_VALIDATION_OWNER,
    extensions: Object.freeze({ ...extensions }),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resetKnowledgeValidationPlatformRegistryForTests(): void {
  profileRegistry.clear();
  ruleRegistry.clear();
  categoryRegistry.clear();
  scopeRegistry.clear();
  targetRegistry.clear();
  namespaceRegistry.clear();
  dependencyRegistry.clear();
  extensionPointRegistry.clear();
  metadataRegistry.clear();
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isKnowledgeValidationPlatformInitialized(): boolean {
  return platformInitialized;
}

export function getKnowledgeValidationPlatformState(
  timestamp: string = new Date(0).toISOString()
): KnowledgeValidationPlatformState {
  const snapshot = getKnowledgeValidationPlatformSnapshot();
  return Object.freeze({
    platformId: KNOWLEDGE_VALIDATION_PLATFORM_ID,
    contractVersion: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    industryDependency: "KNL/5",
    frameworkDependency: "KNL/6",
    policyDependency: "KNL/7",
    bestPracticeDependency: "KNL/8",
    retrievalDependency: "KNL/9",
    initialized: platformInitialized,
    profileCount: snapshot.profileCount,
    ruleCount: snapshot.ruleCount,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function initializeKnowledgeValidationPlatform(
  timestamp: string = new Date(0).toISOString()
): KnowledgeValidationPlatformResult<KnowledgeValidationPlatformState> {
  const retrieval = initializeKnowledgeRetrievalEngine(timestamp);
  if (!retrieval.success) {
    return createResult(false, "KNL/9 Knowledge Retrieval Engine initialization failed.", null);
  }
  seedKnowledgeValidationCatalog(timestamp);
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Knowledge validation platform initialized.", getKnowledgeValidationPlatformState(timestamp));
}

export function registerKnowledgeValidationProfile(
  input: KnowledgeValidationProfileRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeValidationPlatformResult<KnowledgeValidationProfile> {
  const validation = validateKnowledgeValidationProfileRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (profileRegistry.size >= KNOWLEDGE_VALIDATION_DEFAULT_LIMITS.maxRegisteredProfiles) {
    return createResult(false, "Validation profile registration limit reached.", null);
  }
  if (profileRegistry.has(input.profileId)) {
    return createResult(false, `Validation profile already registered: ${input.profileId}.`, null);
  }
  const duplicateName = [...profileRegistry.values()].some(
    (entry) => entry.profileName.trim().toLowerCase() === input.profileName.trim().toLowerCase()
  );
  if (duplicateName) {
    return createResult(false, `Validation profile name already registered: ${input.profileName}.`, null);
  }
  const resultDescriptor = Object.freeze({
    descriptorId: `validation-result-${input.profileId}`,
    label: input.resultDescriptorLabel,
    description: input.resultDescriptorDescription,
    readOnly: true as const,
  });
  const entry = Object.freeze({
    profileId: input.profileId,
    profileKey: input.profileKey,
    profileName: input.profileName,
    label: input.label,
    description: input.description,
    categoryKey: input.categoryKey,
    scopeKey: input.scopeKey,
    targetKey: input.targetKey,
    dependencyKey: input.dependencyKey,
    platformId: input.platformId,
    status: input.status,
    resultDescriptor,
    version: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-profile-${input.profileId}`, timestamp),
    readOnly: true as const,
  });
  profileRegistry.set(entry.profileId, entry);
  return createResult(true, "Knowledge validation profile registered.", entry);
}

export function registerKnowledgeValidationRule(
  input: KnowledgeValidationRuleRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeValidationPlatformResult<ValidationRule> {
  const validation = validateKnowledgeValidationRuleRegistration(input, [...profileRegistry.keys()]);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (ruleRegistry.size >= KNOWLEDGE_VALIDATION_DEFAULT_LIMITS.maxRegisteredRules) {
    return createResult(false, "Validation rule registration limit reached.", null);
  }
  if (ruleRegistry.has(input.ruleId)) {
    return createResult(false, `Validation rule already registered: ${input.ruleId}.`, null);
  }
  const resultDescriptor = Object.freeze({
    descriptorId: `validation-rule-result-${input.ruleId}`,
    label: input.resultDescriptorLabel,
    description: input.resultDescriptorDescription,
    readOnly: true as const,
  });
  const entry = Object.freeze({
    ruleId: input.ruleId,
    profileId: input.profileId,
    profileKey: input.profileKey,
    ruleName: input.ruleName,
    label: input.label,
    description: input.description,
    categoryKey: input.categoryKey,
    scopeKey: input.scopeKey,
    severity: input.severity,
    status: input.status,
    resultDescriptor,
    version: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-rule-${input.ruleId}`, timestamp),
    readOnly: true as const,
  });
  ruleRegistry.set(entry.ruleId, entry);
  return createResult(true, "Knowledge validation rule registered.", entry);
}

export function registerKnowledgeValidationCategory(
  input: KnowledgeValidationCategoryRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeValidationPlatformResult<ValidationCategory> {
  const validation = validateKnowledgeValidationCategoryRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (categoryRegistry.size >= KNOWLEDGE_VALIDATION_DEFAULT_LIMITS.maxRegisteredCategories) {
    return createResult(false, "Validation category registration limit reached.", null);
  }
  if (categoryRegistry.has(input.categoryId)) {
    return createResult(false, `Validation category already registered: ${input.categoryId}.`, null);
  }
  const duplicateKey = [...categoryRegistry.values()].some((entry) => entry.categoryKey === input.categoryKey);
  if (duplicateKey) {
    return createResult(false, `Validation category key already registered: ${input.categoryKey}.`, null);
  }
  const entry = Object.freeze({
    categoryId: input.categoryId,
    categoryKey: input.categoryKey,
    label: input.label,
    description: input.description,
    version: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-category-${input.categoryId}`, timestamp),
    readOnly: true as const,
  });
  categoryRegistry.set(entry.categoryId, entry);
  return createResult(true, "Knowledge validation category registered.", entry);
}

function registerValidationScope(
  scopeKey: (typeof VALIDATION_SCOPE_KEYS)[number],
  timestamp: string
): KnowledgeValidationPlatformResult<ValidationScope> {
  const scopeId = `validation-scope-${scopeKey}`;
  if (scopeRegistry.has(scopeId)) {
    return createResult(false, `Validation scope already registered: ${scopeId}.`, null);
  }
  const entry = Object.freeze({
    scopeId,
    scopeKey,
    label: scopeKey,
    description: `${scopeKey} validation scope metadata.`,
    version: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-scope-${scopeKey}`, timestamp),
    readOnly: true as const,
  });
  scopeRegistry.set(entry.scopeId, entry);
  return createResult(true, "Validation scope registered.", entry);
}

function registerValidationTarget(
  profileKey: (typeof VALIDATION_PROFILE_KEYS)[number],
  timestamp: string
): KnowledgeValidationPlatformResult<ValidationTarget> {
  const targetKey = VALIDATION_PROFILE_TARGET_MAP[profileKey];
  const targetId = `validation-target-${profileKey}`;
  if (targetRegistry.has(targetId)) {
    return createResult(false, `Validation target already registered: ${targetId}.`, null);
  }
  const entry = Object.freeze({
    targetId,
    targetKey,
    platformId: VALIDATION_PLATFORM_ID_MAP[profileKey],
    profileKey,
    label: VALIDATION_PROFILE_LABELS[profileKey],
    description: `Validation target metadata for ${VALIDATION_PROFILE_LABELS[profileKey]}.`,
    version: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-target-${profileKey}`, timestamp),
    readOnly: true as const,
  });
  targetRegistry.set(entry.targetId, entry);
  return createResult(true, "Validation target registered.", entry);
}

function registerValidationDependency(
  dependencyKey: (typeof VALIDATION_DEPENDENCY_KEYS)[number],
  timestamp: string
): KnowledgeValidationPlatformResult<ValidationDependency> {
  const dependencyId = `validation-dependency-${dependencyKey.replace("/", "-").toLowerCase()}`;
  if (dependencyRegistry.has(dependencyId)) {
    return createResult(false, `Validation dependency already registered: ${dependencyId}.`, null);
  }
  const entry = Object.freeze({
    dependencyId,
    dependencyKey,
    label: dependencyKey,
    description: `${dependencyKey} validation dependency metadata.`,
    version: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-dependency-${dependencyKey.replace("/", "-")}`, timestamp),
    readOnly: true as const,
  });
  dependencyRegistry.set(entry.dependencyId, entry);
  return createResult(true, "Validation dependency registered.", entry);
}

function registerValidationNamespace(
  namespaceKey: (typeof VALIDATION_NAMESPACE_KEYS)[number],
  timestamp: string
): KnowledgeValidationPlatformResult<ValidationNamespace> {
  const namespaceId = `validation-namespace-${namespaceKey}`;
  if (namespaceRegistry.has(namespaceId)) {
    return createResult(false, `Validation namespace already registered: ${namespaceId}.`, null);
  }
  const entry = Object.freeze({
    namespaceId,
    namespaceKey,
    label: namespaceKey,
    description: `${namespaceKey} validation namespace metadata.`,
    version: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-namespace-${namespaceKey}`, timestamp),
    readOnly: true as const,
  });
  namespaceRegistry.set(entry.namespaceId, entry);
  return createResult(true, "Validation namespace registered.", entry);
}

function registerValidationExtensionPoint(
  extensionPointKey: (typeof VALIDATION_EXTENSION_POINT_KEYS)[number],
  timestamp: string
): KnowledgeValidationPlatformResult<ValidationExtensionPoint> {
  const extensionPointId = `validation-extension-${extensionPointKey.replace(/_/g, "-")}`;
  if (extensionPointRegistry.has(extensionPointId)) {
    return createResult(false, `Validation extension point already registered: ${extensionPointId}.`, null);
  }
  const entry = Object.freeze({
    extensionPointId,
    extensionPointKey,
    label: extensionPointKey,
    description: `${extensionPointKey} validation extension point metadata.`,
    version: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-extension-${extensionPointKey}`, timestamp),
    readOnly: true as const,
  });
  extensionPointRegistry.set(entry.extensionPointId, entry);
  return createResult(true, "Validation extension point registered.", entry);
}

export function getKnowledgeValidationPlatformSnapshot(): KnowledgeValidationPlatformSnapshot {
  return Object.freeze({
    platformVersion: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    profileCount: profileRegistry.size,
    ruleCount: ruleRegistry.size,
    categoryCount: categoryRegistry.size || VALIDATION_CATEGORY_KEYS.length,
    scopeCount: scopeRegistry.size || VALIDATION_SCOPE_KEYS.length,
    targetCount: targetRegistry.size || VALIDATION_PROFILE_KEYS.length,
    namespaceCount: namespaceRegistry.size || VALIDATION_NAMESPACE_KEYS.length,
    dependencyCount: dependencyRegistry.size || VALIDATION_DEPENDENCY_KEYS.length,
    readOnly: true as const,
  });
}

export function getKnowledgeValidationPlatformRegistry(): Readonly<{
  profiles: readonly KnowledgeValidationProfile[];
  rules: readonly ValidationRule[];
  categories: readonly ValidationCategory[];
  scopes: readonly ValidationScope[];
  targets: readonly ValidationTarget[];
  namespaces: readonly ValidationNamespace[];
  dependencies: readonly ValidationDependency[];
  extensionPoints: readonly ValidationExtensionPoint[];
  metadataRecords: readonly ValidationMetadata[];
  snapshot: KnowledgeValidationPlatformSnapshot;
  readOnly: true;
}> {
  return Object.freeze({
    profiles: Object.freeze(
      [...profileRegistry.values()].sort((a, b) => a.profileId.localeCompare(b.profileId))
    ),
    rules: Object.freeze(
      [...ruleRegistry.values()].sort((a, b) => a.ruleId.localeCompare(b.ruleId))
    ),
    categories: Object.freeze(
      [...categoryRegistry.values()].sort((a, b) => a.categoryId.localeCompare(b.categoryId))
    ),
    scopes: Object.freeze(
      [...scopeRegistry.values()].sort((a, b) => a.scopeId.localeCompare(b.scopeId))
    ),
    targets: Object.freeze(
      [...targetRegistry.values()].sort((a, b) => a.targetId.localeCompare(b.targetId))
    ),
    namespaces: Object.freeze(
      [...namespaceRegistry.values()].sort((a, b) => a.namespaceId.localeCompare(b.namespaceId))
    ),
    dependencies: Object.freeze(
      [...dependencyRegistry.values()].sort((a, b) => a.dependencyId.localeCompare(b.dependencyId))
    ),
    extensionPoints: Object.freeze(
      [...extensionPointRegistry.values()].sort((a, b) => a.extensionPointId.localeCompare(b.extensionPointId))
    ),
    metadataRecords: Object.freeze(
      [...metadataRegistry.values()].sort((a, b) => a.metadataId.localeCompare(b.metadataId))
    ),
    snapshot: getKnowledgeValidationPlatformSnapshot(),
    readOnly: true as const,
  });
}

export function seedKnowledgeValidationCatalog(timestamp: string = new Date(0).toISOString()): void {
  if (profileRegistry.size > 0) {
    return;
  }
  for (const namespaceKey of VALIDATION_NAMESPACE_KEYS) {
    registerValidationNamespace(namespaceKey, timestamp);
  }
  for (const categoryKey of VALIDATION_CATEGORY_KEYS) {
    registerKnowledgeValidationCategory(
      Object.freeze({
        categoryId: `validation-category-${categoryKey}`,
        categoryKey,
        label: categoryKey,
        description: `${categoryKey} validation category metadata.`,
      }),
      timestamp
    );
  }
  for (const scopeKey of VALIDATION_SCOPE_KEYS) {
    registerValidationScope(scopeKey, timestamp);
  }
  for (const dependencyKey of VALIDATION_DEPENDENCY_KEYS) {
    registerValidationDependency(dependencyKey, timestamp);
  }
  for (const extensionPointKey of VALIDATION_EXTENSION_POINT_KEYS) {
    registerValidationExtensionPoint(extensionPointKey, timestamp);
  }
  for (const profileKey of VALIDATION_PROFILE_KEYS) {
    registerValidationTarget(profileKey, timestamp);
    const profileId = `validation-profile-${profileKey}`;
    registerKnowledgeValidationProfile(
      Object.freeze({
        profileId,
        profileKey,
        profileName: profileKey,
        label: `${VALIDATION_PROFILE_LABELS[profileKey]} Validation Profile`,
        description: `Metadata validation profile for ${VALIDATION_PROFILE_LABELS[profileKey]} (not executable).`,
        categoryKey: VALIDATION_PROFILE_CATEGORY_MAP[profileKey],
        scopeKey: "platform",
        targetKey: VALIDATION_PROFILE_TARGET_MAP[profileKey],
        dependencyKey: VALIDATION_PROFILE_DEPENDENCY_MAP[profileKey],
        platformId: VALIDATION_PLATFORM_ID_MAP[profileKey],
        status: "active",
        resultDescriptorLabel: `${VALIDATION_PROFILE_LABELS[profileKey]} Result Descriptor`,
        resultDescriptorDescription: `Result descriptor metadata for ${VALIDATION_PROFILE_LABELS[profileKey]} validation (no runtime execution).`,
      }),
      timestamp
    );
    registerKnowledgeValidationRule(
      Object.freeze({
        ruleId: `validation-rule-${profileKey}-001`,
        profileId,
        profileKey,
        ruleName: `${profileKey}_integrity_rule`,
        label: `${VALIDATION_PROFILE_LABELS[profileKey]} Integrity Rule`,
        description: `Primary integrity validation rule metadata for ${VALIDATION_PROFILE_LABELS[profileKey]}.`,
        categoryKey: VALIDATION_PROFILE_CATEGORY_MAP[profileKey],
        scopeKey: "registry",
        severity: "major",
        status: "active",
        resultDescriptorLabel: `${VALIDATION_PROFILE_LABELS[profileKey]} Rule Result`,
        resultDescriptorDescription: `Rule result descriptor metadata (not executable).`,
      }),
      timestamp
    );
  }
  const rootMetadata = createMetadata("knowledge-validation-platform-root-metadata", timestamp, Object.freeze({ catalog: "default" }));
  metadataRegistry.set(rootMetadata.metadataId, rootMetadata);
}

export const KnowledgeValidationPlatformRegistry = Object.freeze({
  resetKnowledgeValidationPlatformRegistryForTests,
  initializeKnowledgeValidationPlatform,
  registerKnowledgeValidationProfile,
  registerKnowledgeValidationRule,
  registerKnowledgeValidationCategory,
  getKnowledgeValidationPlatformRegistry,
  getKnowledgeValidationPlatformSnapshot,
  seedKnowledgeValidationCatalog,
});
