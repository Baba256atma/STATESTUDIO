/**
 * ASS-1 — Executive Assistant Platform domain types.
 */

import type {
  ASS_CAPABILITY_KEYS,
  ASS_CONVERSATION_SCOPE_KEYS,
  ASS_EXTENSION_POINT_KEYS,
  ASS_INTEGRATION_KEYS,
  ASS_PLATFORM_CONTRACT_VERSION,
  ASS_REGISTRY_KEYS,
} from "./executiveAssistantPlatformContracts.ts";

export type ExecutiveAssistantCapabilityKey = (typeof ASS_CAPABILITY_KEYS)[number];
export type ExecutiveAssistantConversationScopeKey = (typeof ASS_CONVERSATION_SCOPE_KEYS)[number];
export type ExecutiveAssistantIntegrationKey = (typeof ASS_INTEGRATION_KEYS)[number];
export type ExecutiveAssistantExtensionPointKey = (typeof ASS_EXTENSION_POINT_KEYS)[number];
export type ExecutiveAssistantRegistryKey = (typeof ASS_REGISTRY_KEYS)[number];

export type ExecutiveAssistantPlatformIdentity = Readonly<{
  layerId: typeof import("./executiveAssistantPlatformContracts.ts").ASS_PLATFORM_LAYER_ID;
  appId: "APP";
  title: typeof import("./executiveAssistantPlatformContracts.ts").ASS_PLATFORM_NAME;
  platformId: typeof import("./executiveAssistantPlatformContracts.ts").ASS_PLATFORM_ID;
  version: typeof ASS_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof import("./executiveAssistantPlatformContracts.ts").ASS_PLATFORM_ARCHITECTURE_VERSION;
  contractVersion: typeof ASS_PLATFORM_CONTRACT_VERSION;
  compatibilityVersion: typeof import("./executiveAssistantPlatformContracts.ts").ASS_PLATFORM_COMPATIBILITY_VERSION;
  mvpStatus: string;
  releaseStage: string;
  compatibilityLevel: string;
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformBoundaries = Readonly<{
  owns: readonly string[];
  doesNotOwn: readonly string[];
  readOnly: true;
}>;

export type ExecutiveAssistantCapabilityRegistration = Readonly<{
  capabilityId: string;
  capabilityKey: ExecutiveAssistantCapabilityKey;
  label: string;
  description: string;
  version: typeof ASS_PLATFORM_CONTRACT_VERSION;
  metadataOnly: true;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantIntegrationRegistration = Readonly<{
  integrationId: string;
  integrationKey: ExecutiveAssistantIntegrationKey;
  label: string;
  platformRef: string;
  consumptionMode: "reference_only" | "contract_consumer";
  futureReady: boolean;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantConversationScopeRegistration = Readonly<{
  scopeId: string;
  scopeKey: ExecutiveAssistantConversationScopeKey;
  label: string;
  description: string;
  version: typeof ASS_PLATFORM_CONTRACT_VERSION;
  architectureOnly: true;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantExtensionRegistration = Readonly<{
  extensionId: string;
  extensionKey: ExecutiveAssistantExtensionPointKey;
  label: string;
  status: "reserved" | "certified";
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantManifestRegistration = Readonly<{
  manifestRegistryId: string;
  manifestId: string;
  version: typeof ASS_PLATFORM_CONTRACT_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformRegistrySnapshot = Readonly<{
  capabilityCount: number;
  integrationCount: number;
  conversationScopeCount: number;
  extensionCount: number;
  manifestCount: number;
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformRegistry = Readonly<{
  capabilities: readonly ExecutiveAssistantCapabilityRegistration[];
  integrations: readonly ExecutiveAssistantIntegrationRegistration[];
  conversationScopes: readonly ExecutiveAssistantConversationScopeRegistration[];
  extensions: readonly ExecutiveAssistantExtensionRegistration[];
  manifests: readonly ExecutiveAssistantManifestRegistration[];
  snapshot: ExecutiveAssistantPlatformRegistrySnapshot;
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./executiveAssistantPlatformContracts.ts").ASS_PLATFORM_ID;
  version: typeof ASS_PLATFORM_CONTRACT_VERSION;
  title: typeof import("./executiveAssistantPlatformContracts.ts").ASS_PLATFORM_NAME;
  goal: string;
  lifecycle: "build";
  principles: readonly string[];
  publicApis: readonly string[];
  capabilityKeys: readonly string[];
  conversationScopeKeys: readonly string[];
  integrationKeys: readonly string[];
  extensionPoints: readonly string[];
  upstreamPlatforms: readonly string[];
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformValidationIssue = Readonly<{
  code: string;
  message: string;
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformValidationReport = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveAssistantPlatformValidationIssue[];
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformState = Readonly<{
  platformId: typeof import("./executiveAssistantPlatformContracts.ts").ASS_PLATFORM_ID;
  foundationVersion: typeof ASS_PLATFORM_CONTRACT_VERSION;
  contractVersion: typeof ASS_PLATFORM_CONTRACT_VERSION;
  initialized: boolean;
  capabilityCount: number;
  integrationCount: number;
  conversationScopeCount: number;
  extensionCount: number;
  supportedCapabilities: readonly string[];
  supportedIntegrations: readonly string[];
  supportedConversationScopes: readonly string[];
  supportedExtensionPoints: readonly string[];
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type ExecutiveAssistantVersionMetadata = Readonly<{
  contractVersion: typeof ASS_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof import("./executiveAssistantPlatformContracts.ts").ASS_PLATFORM_ARCHITECTURE_VERSION;
  apiVersion: typeof import("./executiveAssistantPlatformContracts.ts").ASS_PLATFORM_API_VERSION;
  compatibilityVersion: typeof import("./executiveAssistantPlatformContracts.ts").ASS_PLATFORM_COMPATIBILITY_VERSION;
  pattern: RegExp;
  readOnly: true;
}>;
