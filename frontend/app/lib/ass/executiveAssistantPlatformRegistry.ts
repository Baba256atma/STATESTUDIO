/**
 * ASS-1 — Platform, capability, integration, conversation scope, extension, and manifest registries.
 */

import {
  ASS_CAPABILITY_KEYS,
  ASS_CAPABILITY_LABELS,
  ASS_CONVERSATION_SCOPE_KEYS,
  ASS_CONVERSATION_SCOPE_LABELS,
  ASS_DEFAULT_LIMITS,
  ASS_EXTENSION_POINT_KEYS,
  ASS_EXTENSION_REGISTRY,
  ASS_INTEGRATION_KEYS,
  ASS_INTEGRATION_LABELS,
  ASS_PLATFORM_CONTRACT_VERSION,
  ASS_PLATFORM_ID,
  ASS_PLATFORM_NAME,
  ASS_PLATFORM_SOURCE,
  ASS_UPSTREAM_PLATFORM_KEYS,
} from "./executiveAssistantPlatformContracts.ts";
import type {
  ExecutiveAssistantCapabilityKey,
  ExecutiveAssistantCapabilityRegistration,
  ExecutiveAssistantConversationScopeKey,
  ExecutiveAssistantConversationScopeRegistration,
  ExecutiveAssistantExtensionPointKey,
  ExecutiveAssistantExtensionRegistration,
  ExecutiveAssistantIntegrationKey,
  ExecutiveAssistantIntegrationRegistration,
  ExecutiveAssistantManifestRegistration,
  ExecutiveAssistantPlatformIdentity,
  ExecutiveAssistantPlatformRegistry,
  ExecutiveAssistantPlatformRegistrySnapshot,
  ExecutiveAssistantPlatformResult,
} from "./executiveAssistantPlatformTypes.ts";

const capabilityRegistry = new Map<string, ExecutiveAssistantCapabilityRegistration>();
const integrationRegistry = new Map<string, ExecutiveAssistantIntegrationRegistration>();
const conversationScopeRegistry = new Map<string, ExecutiveAssistantConversationScopeRegistration>();
const extensionRegistry = new Map<string, ExecutiveAssistantExtensionRegistration>();
const manifestRegistry = new Map<string, ExecutiveAssistantManifestRegistration>();

function createResult<T>(success: boolean, reason: string, data: T | null): ExecutiveAssistantPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export const ASS_PLATFORM_IDENTITY: ExecutiveAssistantPlatformIdentity = Object.freeze({
  layerId: "ASS",
  appId: "APP",
  title: ASS_PLATFORM_NAME,
  platformId: ASS_PLATFORM_ID,
  version: ASS_PLATFORM_CONTRACT_VERSION,
  architectureVersion: "ASS/1-arch",
  contractVersion: ASS_PLATFORM_CONTRACT_VERSION,
  compatibilityVersion: "ASS/1-compat",
  mvpStatus: "active",
  releaseStage: "mvp-foundation",
  compatibilityLevel: "foundation",
  readOnly: true as const,
});

export function getExecutiveAssistantPlatformIdentity(): ExecutiveAssistantPlatformIdentity {
  return ASS_PLATFORM_IDENTITY;
}

export function isExecutiveAssistantPlatformIdentityImmutable(): boolean {
  return Object.isFrozen(ASS_PLATFORM_IDENTITY);
}

export function resetExecutiveAssistantPlatformRegistryForTests(): void {
  capabilityRegistry.clear();
  integrationRegistry.clear();
  conversationScopeRegistry.clear();
  extensionRegistry.clear();
  manifestRegistry.clear();
}

export function getExecutiveAssistantPlatformRegistrySnapshot(): ExecutiveAssistantPlatformRegistrySnapshot {
  return Object.freeze({
    capabilityCount: capabilityRegistry.size,
    integrationCount: integrationRegistry.size,
    conversationScopeCount: conversationScopeRegistry.size,
    extensionCount: extensionRegistry.size,
    manifestCount: manifestRegistry.size,
    readOnly: true as const,
  });
}

export function getExecutiveAssistantPlatformRegistry(): ExecutiveAssistantPlatformRegistry {
  const sortByKey = <T>(entries: readonly T[], getKey: (entry: T) => string) =>
    Object.freeze([...entries].sort((left, right) => getKey(left).localeCompare(getKey(right))));

  return Object.freeze({
    capabilities: sortByKey([...capabilityRegistry.values()], (entry) => entry.capabilityId),
    integrations: sortByKey([...integrationRegistry.values()], (entry) => entry.integrationId),
    conversationScopes: sortByKey([...conversationScopeRegistry.values()], (entry) => entry.scopeId),
    extensions: sortByKey([...extensionRegistry.values()], (entry) => entry.extensionId),
    manifests: sortByKey([...manifestRegistry.values()], (entry) => entry.manifestRegistryId),
    snapshot: getExecutiveAssistantPlatformRegistrySnapshot(),
    readOnly: true as const,
  });
}

export function registerExecutiveAssistantCapability(
  capabilityKey: ExecutiveAssistantCapabilityKey,
  timestamp: string
): ExecutiveAssistantPlatformResult<ExecutiveAssistantCapabilityRegistration> {
  if (capabilityRegistry.size >= ASS_DEFAULT_LIMITS.maxCapabilities && !capabilityRegistry.has(capabilityKey)) {
    return createResult(false, "Capability registry limit reached.", null);
  }
  const record = Object.freeze({
    capabilityId: `ass-capability-${capabilityKey}`,
    capabilityKey,
    label: ASS_CAPABILITY_LABELS[capabilityKey],
    description: `Architecture metadata for ${ASS_CAPABILITY_LABELS[capabilityKey].toLowerCase()}.`,
    version: ASS_PLATFORM_CONTRACT_VERSION,
    metadataOnly: true as const,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  capabilityRegistry.set(capabilityKey, record);
  return createResult(true, "Capability registered.", record);
}

export function registerExecutiveAssistantIntegration(
  integrationKey: ExecutiveAssistantIntegrationKey,
  timestamp: string
): ExecutiveAssistantPlatformResult<ExecutiveAssistantIntegrationRegistration> {
  if (integrationRegistry.size >= ASS_DEFAULT_LIMITS.maxIntegrations && !integrationRegistry.has(integrationKey)) {
    return createResult(false, "Integration registry limit reached.", null);
  }
  const futureReady = integrationKey === "IDN" || integrationKey === "LAY";
  const record = Object.freeze({
    integrationId: `ass-integration-${integrationKey.toLowerCase()}`,
    integrationKey,
    label: ASS_INTEGRATION_LABELS[integrationKey],
    platformRef: `${integrationKey.toLowerCase()}-platform`,
    consumptionMode: futureReady ? ("reference_only" as const) : ("contract_consumer" as const),
    futureReady,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  integrationRegistry.set(integrationKey, record);
  return createResult(true, "Integration registered.", record);
}

export function registerExecutiveAssistantConversationScope(
  scopeKey: ExecutiveAssistantConversationScopeKey,
  timestamp: string
): ExecutiveAssistantPlatformResult<ExecutiveAssistantConversationScopeRegistration> {
  if (conversationScopeRegistry.size >= ASS_DEFAULT_LIMITS.maxConversationScopes && !conversationScopeRegistry.has(scopeKey)) {
    return createResult(false, "Conversation scope registry limit reached.", null);
  }
  const record = Object.freeze({
    scopeId: `ass-conversation-scope-${scopeKey}`,
    scopeKey,
    label: ASS_CONVERSATION_SCOPE_LABELS[scopeKey],
    description: `Architecture-only ${ASS_CONVERSATION_SCOPE_LABELS[scopeKey].toLowerCase()}.`,
    version: ASS_PLATFORM_CONTRACT_VERSION,
    architectureOnly: true as const,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  conversationScopeRegistry.set(scopeKey, record);
  return createResult(true, "Conversation scope registered.", record);
}

export function registerExecutiveAssistantExtensionPoint(
  extensionKey: ExecutiveAssistantExtensionPointKey,
  timestamp: string
): ExecutiveAssistantPlatformResult<ExecutiveAssistantExtensionRegistration> {
  if (extensionRegistry.size >= ASS_DEFAULT_LIMITS.maxExtensionPoints && !extensionRegistry.has(extensionKey)) {
    return createResult(false, "Extension registry limit reached.", null);
  }
  const source = ASS_EXTENSION_REGISTRY.find((entry) => entry.phaseKey === extensionKey);
  const record = Object.freeze({
    extensionId: source?.extensionId ?? `ass-extension-${extensionKey}`,
    extensionKey,
    label: source?.label ?? extensionKey,
    status: "reserved" as const,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  extensionRegistry.set(extensionKey, record);
  return createResult(true, "Extension point registered.", record);
}

export function registerExecutiveAssistantManifestRegistryEntry(
  manifestId: string,
  timestamp: string
): ExecutiveAssistantPlatformResult<ExecutiveAssistantManifestRegistration> {
  const manifestRegistryId = "ass-manifest-registry-entry";
  if (manifestRegistry.has(manifestRegistryId)) {
    return createResult(false, "Manifest registry entry already exists.", null);
  }
  const record = Object.freeze({
    manifestRegistryId,
    manifestId,
    version: ASS_PLATFORM_CONTRACT_VERSION,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  manifestRegistry.set(manifestRegistryId, record);
  return createResult(true, "Manifest registry entry registered.", record);
}

export function seedDefaultExecutiveAssistantPlatformRegistry(timestamp: string): void {
  for (const capabilityKey of ASS_CAPABILITY_KEYS) {
    registerExecutiveAssistantCapability(capabilityKey, timestamp);
  }
  for (const integrationKey of ASS_INTEGRATION_KEYS) {
    registerExecutiveAssistantIntegration(integrationKey, timestamp);
  }
  for (const scopeKey of ASS_CONVERSATION_SCOPE_KEYS) {
    registerExecutiveAssistantConversationScope(scopeKey, timestamp);
  }
  for (const extensionKey of ASS_EXTENSION_POINT_KEYS) {
    registerExecutiveAssistantExtensionPoint(extensionKey, timestamp);
  }
  registerExecutiveAssistantManifestRegistryEntry("executive-assistant-platform-foundation-manifest", timestamp);
}

export function isExecutiveAssistantCapabilityKey(value: string): value is ExecutiveAssistantCapabilityKey {
  return (ASS_CAPABILITY_KEYS as readonly string[]).includes(value);
}

export function isExecutiveAssistantIntegrationKey(value: string): value is ExecutiveAssistantIntegrationKey {
  return (ASS_INTEGRATION_KEYS as readonly string[]).includes(value);
}

export function isExecutiveAssistantConversationScopeKey(value: string): value is ExecutiveAssistantConversationScopeKey {
  return (ASS_CONVERSATION_SCOPE_KEYS as readonly string[]).includes(value);
}

export function isExecutiveAssistantExtensionPointKey(value: string): value is ExecutiveAssistantExtensionPointKey {
  return (ASS_EXTENSION_POINT_KEYS as readonly string[]).includes(value);
}

export function getExecutiveAssistantUpstreamPlatformKeys(): readonly string[] {
  return ASS_UPSTREAM_PLATFORM_KEYS;
}

export function getExecutiveAssistantPlatformSourceMetadata(): Readonly<Record<string, string>> {
  return Object.freeze({
    source: ASS_PLATFORM_SOURCE,
    contractVersion: ASS_PLATFORM_CONTRACT_VERSION,
    readOnly: "true",
  });
}
