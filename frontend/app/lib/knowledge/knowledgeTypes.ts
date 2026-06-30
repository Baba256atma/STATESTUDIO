/**
 * KNL-1 — Knowledge Platform domain types.
 */

import type {
  KNOWLEDGE_CAPABILITY_KEYS,
  KNOWLEDGE_CATEGORY_KEYS,
  KNOWLEDGE_DOMAIN_KEYS,
  KNOWLEDGE_EXTENSION_POINT_KEYS,
  KNOWLEDGE_NAMESPACE_KEYS,
  KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
} from "./knowledgeConstants.ts";

export type KnowledgeIdentifier = string;
export type KnowledgeNamespaceId = string;
export type KnowledgeDomainKey = (typeof KNOWLEDGE_DOMAIN_KEYS)[number];
export type KnowledgeCategoryKey = (typeof KNOWLEDGE_CATEGORY_KEYS)[number];
export type KnowledgeCapabilityKey = (typeof KNOWLEDGE_CAPABILITY_KEYS)[number];
export type KnowledgeExtensionPointKey = (typeof KNOWLEDGE_EXTENSION_POINT_KEYS)[number];
export type KnowledgeNamespaceKey = (typeof KNOWLEDGE_NAMESPACE_KEYS)[number];

export type KnowledgeVersion = typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION | string;

export type KnowledgeMetadata = Readonly<{
  metadataId: string;
  metadataVersion: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type KnowledgePlatformIdentity = Readonly<{
  layerId: "KNL";
  appId: "KNL";
  title: typeof import("./knowledgeConstants.ts").KNOWLEDGE_PLATFORM_NAME;
  platformId: typeof import("./knowledgeConstants.ts").KNOWLEDGE_PLATFORM_ID;
  version: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type KnowledgeDomain = Readonly<{
  domainId: KnowledgeIdentifier;
  domainKey: KnowledgeDomainKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  metadata: KnowledgeMetadata;
  readOnly: true;
}>;

export type KnowledgeCategory = Readonly<{
  categoryId: KnowledgeIdentifier;
  categoryKey: KnowledgeCategoryKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  metadata: KnowledgeMetadata;
  readOnly: true;
}>;

export type KnowledgePackage = Readonly<{
  packageId: KnowledgeIdentifier;
  namespaceId: KnowledgeNamespaceId;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  metadata: KnowledgeMetadata;
  readOnly: true;
}>;

export type KnowledgeSource = Readonly<{
  sourceId: KnowledgeIdentifier;
  providerId: KnowledgeIdentifier;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  metadata: KnowledgeMetadata;
  readOnly: true;
}>;

export type KnowledgeEntity = Readonly<{
  entityId: KnowledgeIdentifier;
  namespaceId: KnowledgeNamespaceId;
  domainKey: KnowledgeDomainKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  metadata: KnowledgeMetadata;
  readOnly: true;
}>;

export type KnowledgeProvider = Readonly<{
  providerId: KnowledgeIdentifier;
  namespaceId: KnowledgeNamespaceId;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  metadata: KnowledgeMetadata;
  readOnly: true;
}>;

export type KnowledgeConsumer = Readonly<{
  consumerId: KnowledgeIdentifier;
  label: string;
  integrationPath: string;
  status: "registered" | "reserved";
  readOnly: true;
}>;

export type KnowledgeCapability = Readonly<{
  capabilityId: KnowledgeIdentifier;
  capabilityKey: KnowledgeCapabilityKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  metadata: KnowledgeMetadata;
  readOnly: true;
}>;

export type KnowledgeNamespace = Readonly<{
  namespaceId: KnowledgeNamespaceId;
  namespaceKey: KnowledgeNamespaceKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  metadata: KnowledgeMetadata;
  readOnly: true;
}>;

export type KnowledgeExtensionPoint = Readonly<{
  extensionPointId: KnowledgeIdentifier;
  extensionPointKey: KnowledgeExtensionPointKey;
  label: string;
  description: string;
  phaseKey: string;
  version: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  metadata: KnowledgeMetadata;
  readOnly: true;
}>;

export type KnowledgeRegistration = Readonly<{
  registrationId: KnowledgeIdentifier;
  registryType: KnowledgeCategoryKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  registeredAt: string;
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

export type KnowledgePlatformResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type KnowledgePlatformManifest = Readonly<{
  platformId: typeof import("./knowledgeConstants.ts").KNOWLEDGE_PLATFORM_ID;
  platformName: typeof import("./knowledgeConstants.ts").KNOWLEDGE_PLATFORM_NAME;
  layerId: "KNL";
  contractVersion: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof import("./knowledgeConstants.ts").KNOWLEDGE_PLATFORM_ARCHITECTURE_VERSION;
  supportedDomains: readonly KnowledgeDomainKey[];
  supportedCapabilities: readonly KnowledgeCapabilityKey[];
  supportedNamespaces: readonly KnowledgeNamespaceKey[];
  extensionPoints: readonly KnowledgeExtensionPointKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  futurePhases: readonly string[];
  dependencyRules: readonly Readonly<{ ruleId: string; description: string; enforced: true; readOnly: true }>[];
  generatedAt: string;
  readOnly: true;
}>;

export type KnowledgeRegistrySnapshot = Readonly<{
  registryVersion: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  domainCount: number;
  categoryCount: number;
  providerCount: number;
  capabilityCount: number;
  namespaceCount: number;
  extensionPointCount: number;
  readOnly: true;
}>;

export type KnowledgePlatformState = Readonly<{
  platformId: typeof import("./knowledgeConstants.ts").KNOWLEDGE_PLATFORM_ID;
  foundationVersion: "KNL/1";
  contractVersion: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  initialized: boolean;
  domainCount: number;
  providerCount: number;
  capabilityCount: number;
  supportedDomains: readonly KnowledgeDomainKey[];
  supportedCapabilities: readonly KnowledgeCapabilityKey[];
  timestamp: string;
  readOnly: true;
}>;

export type KnowledgeDomainRegistrationInput = Readonly<{
  domainId: KnowledgeIdentifier;
  domainKey: KnowledgeDomainKey;
  label: string;
  description: string;
}>;

export type KnowledgeProviderRegistrationInput = Readonly<{
  providerId: KnowledgeIdentifier;
  namespaceId: KnowledgeNamespaceId;
  label: string;
  description: string;
}>;

export type KnowledgeCapabilityRegistrationInput = Readonly<{
  capabilityId: KnowledgeIdentifier;
  capabilityKey: KnowledgeCapabilityKey;
  label: string;
  description: string;
}>;

export type KnowledgeCategoryRegistrationInput = Readonly<{
  categoryId: KnowledgeIdentifier;
  categoryKey: KnowledgeCategoryKey;
  label: string;
  description: string;
}>;

export type KnowledgeNamespaceRegistrationInput = Readonly<{
  namespaceId: KnowledgeNamespaceId;
  namespaceKey: KnowledgeNamespaceKey;
  label: string;
  description: string;
}>;

export type KnowledgeExtensionPointRegistrationInput = Readonly<{
  extensionPointId: KnowledgeIdentifier;
  extensionPointKey: KnowledgeExtensionPointKey;
  label: string;
  description: string;
  phaseKey: string;
}>;

export type KnowledgePlatformValidationReport = Readonly<{
  valid: boolean;
  foundationInitialized: boolean;
  registryValid: boolean;
  identityValid: boolean;
  issues: readonly KnowledgeValidationIssue[];
  readOnly: true;
}>;
