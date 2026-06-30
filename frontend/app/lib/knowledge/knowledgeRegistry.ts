/**
 * KNL-1 — Knowledge Platform metadata registry.
 */

import {
  KNOWLEDGE_CAPABILITY_KEYS,
  KNOWLEDGE_CATEGORY_KEYS,
  KNOWLEDGE_DEFAULT_LIMITS,
  KNOWLEDGE_DOMAIN_KEYS,
  KNOWLEDGE_EXTENSION_POINT_KEYS,
  KNOWLEDGE_EXTENSION_REGISTRY,
  KNOWLEDGE_NAMESPACE_KEYS,
  KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
} from "./knowledgeConstants.ts";
import type {
  KnowledgeCapability,
  KnowledgeCategory,
  KnowledgeDomain,
  KnowledgeExtensionPoint,
  KnowledgeNamespace,
  KnowledgePlatformResult,
  KnowledgeProvider,
  KnowledgeRegistrySnapshot,
} from "./knowledgeTypes.ts";
import type {
  KnowledgeCapabilityRegistrationInput,
  KnowledgeCategoryRegistrationInput,
  KnowledgeDomainRegistrationInput,
  KnowledgeExtensionPointRegistrationInput,
  KnowledgeNamespaceRegistrationInput,
  KnowledgeProviderRegistrationInput,
} from "./knowledgeTypes.ts";
import {
  validateKnowledgeCapabilityRegistration,
  validateKnowledgeCategoryRegistration,
  validateKnowledgeDomainRegistration,
  validateKnowledgeExtensionPointRegistration,
  validateKnowledgeNamespaceRegistration,
  validateKnowledgeProviderRegistration,
} from "./knowledgeValidation.ts";

export const KNOWLEDGE_REGISTRY_VERSION = "KNL/1-REGISTRY-1" as const;

const domainRegistry = new Map<string, KnowledgeDomain>();
const categoryRegistry = new Map<string, KnowledgeCategory>();
const providerRegistry = new Map<string, KnowledgeProvider>();
const capabilityRegistry = new Map<string, KnowledgeCapability>();
const namespaceRegistry = new Map<string, KnowledgeNamespace>();
const extensionPointRegistry = new Map<string, KnowledgeExtensionPoint>();

function createMetadata(metadataId: string, timestamp: string) {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    owner: "knowledge-platform-foundation",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

function createResult<T>(success: boolean, reason: string, data: T | null): KnowledgePlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetKnowledgeRegistryForTests(): void {
  domainRegistry.clear();
  categoryRegistry.clear();
  providerRegistry.clear();
  capabilityRegistry.clear();
  namespaceRegistry.clear();
  extensionPointRegistry.clear();
}

export function registerKnowledgeDomain(
  input: KnowledgeDomainRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgePlatformResult<KnowledgeDomain> {
  const validation = validateKnowledgeDomainRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (domainRegistry.has(input.domainId)) {
    return createResult(false, `Knowledge domain already registered: ${input.domainId}.`, null);
  }
  if (domainRegistry.size >= KNOWLEDGE_DEFAULT_LIMITS.maxRegisteredDomains) {
    return createResult(false, "Knowledge domain registry limit reached.", null);
  }
  const entry = Object.freeze({
    domainId: input.domainId,
    domainKey: input.domainKey,
    label: input.label.trim(),
    description: input.description.trim(),
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-domain-${input.domainId}`, timestamp),
    readOnly: true as const,
  });
  domainRegistry.set(entry.domainId, entry);
  return createResult(true, "Knowledge domain registered.", entry);
}

export function registerKnowledgeCategory(
  input: KnowledgeCategoryRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgePlatformResult<KnowledgeCategory> {
  const validation = validateKnowledgeCategoryRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (categoryRegistry.has(input.categoryId)) {
    return createResult(false, `Knowledge category already registered: ${input.categoryId}.`, null);
  }
  if (categoryRegistry.size >= KNOWLEDGE_DEFAULT_LIMITS.maxRegisteredCategories) {
    return createResult(false, "Knowledge category registry limit reached.", null);
  }
  const entry = Object.freeze({
    categoryId: input.categoryId,
    categoryKey: input.categoryKey,
    label: input.label.trim(),
    description: input.description.trim(),
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-category-${input.categoryId}`, timestamp),
    readOnly: true as const,
  });
  categoryRegistry.set(entry.categoryId, entry);
  return createResult(true, "Knowledge category registered.", entry);
}

export function registerKnowledgeProvider(
  input: KnowledgeProviderRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgePlatformResult<KnowledgeProvider> {
  const validation = validateKnowledgeProviderRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (providerRegistry.has(input.providerId)) {
    return createResult(false, `Knowledge provider already registered: ${input.providerId}.`, null);
  }
  if (providerRegistry.size >= KNOWLEDGE_DEFAULT_LIMITS.maxRegisteredProviders) {
    return createResult(false, "Knowledge provider registry limit reached.", null);
  }
  const entry = Object.freeze({
    providerId: input.providerId,
    namespaceId: input.namespaceId,
    label: input.label.trim(),
    description: input.description.trim(),
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-provider-${input.providerId}`, timestamp),
    readOnly: true as const,
  });
  providerRegistry.set(entry.providerId, entry);
  return createResult(true, "Knowledge provider registered.", entry);
}

export function registerKnowledgeCapability(
  input: KnowledgeCapabilityRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgePlatformResult<KnowledgeCapability> {
  const validation = validateKnowledgeCapabilityRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (capabilityRegistry.has(input.capabilityId)) {
    return createResult(false, `Knowledge capability already registered: ${input.capabilityId}.`, null);
  }
  if (capabilityRegistry.size >= KNOWLEDGE_DEFAULT_LIMITS.maxRegisteredCapabilities) {
    return createResult(false, "Knowledge capability registry limit reached.", null);
  }
  const entry = Object.freeze({
    capabilityId: input.capabilityId,
    capabilityKey: input.capabilityKey,
    label: input.label.trim(),
    description: input.description.trim(),
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-capability-${input.capabilityId}`, timestamp),
    readOnly: true as const,
  });
  capabilityRegistry.set(entry.capabilityId, entry);
  return createResult(true, "Knowledge capability registered.", entry);
}

export function registerKnowledgeNamespace(
  input: KnowledgeNamespaceRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgePlatformResult<KnowledgeNamespace> {
  const validation = validateKnowledgeNamespaceRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (namespaceRegistry.has(input.namespaceId)) {
    return createResult(false, `Knowledge namespace already registered: ${input.namespaceId}.`, null);
  }
  if (namespaceRegistry.size >= KNOWLEDGE_DEFAULT_LIMITS.maxRegisteredNamespaces) {
    return createResult(false, "Knowledge namespace registry limit reached.", null);
  }
  const entry = Object.freeze({
    namespaceId: input.namespaceId,
    namespaceKey: input.namespaceKey,
    label: input.label.trim(),
    description: input.description.trim(),
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-namespace-${input.namespaceId}`, timestamp),
    readOnly: true as const,
  });
  namespaceRegistry.set(entry.namespaceId, entry);
  return createResult(true, "Knowledge namespace registered.", entry);
}

export function registerKnowledgeExtensionPoint(
  input: KnowledgeExtensionPointRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgePlatformResult<KnowledgeExtensionPoint> {
  const validation = validateKnowledgeExtensionPointRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (extensionPointRegistry.has(input.extensionPointId)) {
    return createResult(false, `Knowledge extension point already registered: ${input.extensionPointId}.`, null);
  }
  if (extensionPointRegistry.size >= KNOWLEDGE_DEFAULT_LIMITS.maxRegisteredExtensionPoints) {
    return createResult(false, "Knowledge extension point registry limit reached.", null);
  }
  const entry = Object.freeze({
    extensionPointId: input.extensionPointId,
    extensionPointKey: input.extensionPointKey,
    label: input.label.trim(),
    description: input.description.trim(),
    phaseKey: input.phaseKey,
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-extension-${input.extensionPointId}`, timestamp),
    readOnly: true as const,
  });
  extensionPointRegistry.set(entry.extensionPointId, entry);
  return createResult(true, "Knowledge extension point registered.", entry);
}

export function getKnowledgeRegistrySnapshot(): KnowledgeRegistrySnapshot {
  return Object.freeze({
    registryVersion: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    domainCount: domainRegistry.size || KNOWLEDGE_DOMAIN_KEYS.length,
    categoryCount: categoryRegistry.size || KNOWLEDGE_CATEGORY_KEYS.length,
    providerCount: providerRegistry.size,
    capabilityCount: capabilityRegistry.size || KNOWLEDGE_CAPABILITY_KEYS.length,
    namespaceCount: namespaceRegistry.size || KNOWLEDGE_NAMESPACE_KEYS.length,
    extensionPointCount: extensionPointRegistry.size || KNOWLEDGE_EXTENSION_POINT_KEYS.length,
    readOnly: true as const,
  });
}

export function getKnowledgeRegistry(): Readonly<{
  domains: readonly KnowledgeDomain[];
  categories: readonly KnowledgeCategory[];
  providers: readonly KnowledgeProvider[];
  capabilities: readonly KnowledgeCapability[];
  namespaces: readonly KnowledgeNamespace[];
  extensionPoints: readonly KnowledgeExtensionPoint[];
  snapshot: KnowledgeRegistrySnapshot;
  readOnly: true;
}> {
  return Object.freeze({
    domains: Object.freeze([...domainRegistry.values()].sort((a, b) => a.domainId.localeCompare(b.domainId))),
    categories: Object.freeze([...categoryRegistry.values()].sort((a, b) => a.categoryId.localeCompare(b.categoryId))),
    providers: Object.freeze([...providerRegistry.values()].sort((a, b) => a.providerId.localeCompare(b.providerId))),
    capabilities: Object.freeze(
      [...capabilityRegistry.values()].sort((a, b) => a.capabilityId.localeCompare(b.capabilityId))
    ),
    namespaces: Object.freeze(
      [...namespaceRegistry.values()].sort((a, b) => a.namespaceId.localeCompare(b.namespaceId))
    ),
    extensionPoints: Object.freeze(
      [...extensionPointRegistry.values()].sort((a, b) => a.extensionPointId.localeCompare(b.extensionPointId))
    ),
    snapshot: getKnowledgeRegistrySnapshot(),
    readOnly: true as const,
  });
}

export function seedDefaultKnowledgeRegistry(timestamp: string = new Date(0).toISOString()): void {
  if (domainRegistry.size > 0) {
    return;
  }
  for (const domainKey of KNOWLEDGE_DOMAIN_KEYS) {
    registerKnowledgeDomain(
      Object.freeze({
        domainId: `knowledge-domain-${domainKey}`,
        domainKey,
        label: domainKey,
        description: `${domainKey} knowledge domain metadata.`,
      }),
      timestamp
    );
  }
  for (const categoryKey of KNOWLEDGE_CATEGORY_KEYS) {
    registerKnowledgeCategory(
      Object.freeze({
        categoryId: `knowledge-category-${categoryKey}`,
        categoryKey,
        label: categoryKey,
        description: `${categoryKey} registry category metadata.`,
      }),
      timestamp
    );
  }
  for (const capabilityKey of KNOWLEDGE_CAPABILITY_KEYS) {
    registerKnowledgeCapability(
      Object.freeze({
        capabilityId: `knowledge-capability-${capabilityKey}`,
        capabilityKey,
        label: capabilityKey,
        description: `${capabilityKey} foundation capability metadata.`,
      }),
      timestamp
    );
  }
  for (const namespaceKey of KNOWLEDGE_NAMESPACE_KEYS) {
    registerKnowledgeNamespace(
      Object.freeze({
        namespaceId: `knowledge-namespace-${namespaceKey}`,
        namespaceKey,
        label: namespaceKey,
        description: `${namespaceKey} namespace metadata.`,
      }),
      timestamp
    );
  }
  for (const extensionPointKey of KNOWLEDGE_EXTENSION_POINT_KEYS) {
    registerKnowledgeExtensionPoint(
      Object.freeze({
        extensionPointId: `knowledge-extension-${extensionPointKey}`,
        extensionPointKey,
        label: extensionPointKey,
        description: `Reserved extension point for ${extensionPointKey}.`,
        phaseKey: extensionPointKey,
      }),
      timestamp
    );
  }
  for (const extension of KNOWLEDGE_EXTENSION_REGISTRY) {
    if (!extensionPointRegistry.has(extension.extensionId)) {
      const key = extension.phaseKey as (typeof KNOWLEDGE_EXTENSION_POINT_KEYS)[number];
      if ((KNOWLEDGE_EXTENSION_POINT_KEYS as readonly string[]).includes(key)) {
        continue;
      }
    }
  }
}

export const KnowledgeRegistry = Object.freeze({
  resetKnowledgeRegistryForTests,
  registerKnowledgeDomain,
  registerKnowledgeCategory,
  registerKnowledgeProvider,
  registerKnowledgeCapability,
  registerKnowledgeNamespace,
  registerKnowledgeExtensionPoint,
  getKnowledgeRegistry,
  getKnowledgeRegistrySnapshot,
  seedDefaultKnowledgeRegistry,
});
