/**
 * ASS-1 — Public Executive Assistant Platform exports and foundation facade.
 */

import {
  ASS_CAPABILITY_KEYS,
  ASS_CONVERSATION_SCOPE_KEYS,
  ASS_EXTENSION_POINT_KEYS,
  ASS_FUTURE_DEPENDENCY_RULES,
  ASS_INTEGRATION_KEYS,
  ASS_PLATFORM_CONTRACT_VERSION,
  ASS_PLATFORM_ID,
  ASS_PLATFORM_NAME,
  ASS_PLATFORM_PRINCIPLES,
  ASS_PUBLIC_API_REGISTRY,
  ASS_RELEASE_METADATA,
} from "./executiveAssistantPlatformContracts.ts";
import { getExecutiveAssistantPlatformManifest } from "./executiveAssistantPlatformManifest.ts";
import {
  getExecutiveAssistantPlatformIdentity,
  getExecutiveAssistantPlatformRegistry,
  getExecutiveAssistantPlatformRegistrySnapshot,
  getExecutiveAssistantPlatformSourceMetadata,
  getExecutiveAssistantUpstreamPlatformKeys,
  resetExecutiveAssistantPlatformRegistryForTests,
  seedDefaultExecutiveAssistantPlatformRegistry,
} from "./executiveAssistantPlatformRegistry.ts";
import type {
  ExecutiveAssistantPlatformResult,
  ExecutiveAssistantPlatformState,
  ExecutiveAssistantPlatformValidationReport,
  ExecutiveAssistantVersionMetadata,
} from "./executiveAssistantPlatformTypes.ts";
import {
  getExecutiveAssistantPlatformBoundaries,
  getExecutiveAssistantPlatformPositionStatement,
  validateExecutiveAssistantPlatformContracts,
} from "./executiveAssistantPlatformValidation.ts";
import { ASS_VERSION_PATTERN } from "./executiveAssistantPlatformContracts.ts";

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): ExecutiveAssistantPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetExecutiveAssistantPlatformFoundationForTests(): void {
  platformInitialized = false;
  lastInitializedAt = null;
  resetExecutiveAssistantPlatformRegistryForTests();
}

export function isExecutiveAssistantPlatformInitialized(): boolean {
  return platformInitialized;
}

export function getExecutiveAssistantPlatformVersionMetadata(): ExecutiveAssistantVersionMetadata {
  return Object.freeze({
    contractVersion: ASS_PLATFORM_CONTRACT_VERSION,
    architectureVersion: "ASS/1-arch",
    apiVersion: "ASS/1",
    compatibilityVersion: "ASS/1-compat",
    pattern: ASS_VERSION_PATTERN,
    readOnly: true as const,
  });
}

export function isExecutiveAssistantVersionConsistent(): boolean {
  const metadata = getExecutiveAssistantPlatformVersionMetadata();
  return metadata.contractVersion === ASS_PLATFORM_CONTRACT_VERSION && metadata.pattern.test(ASS_PLATFORM_CONTRACT_VERSION);
}

export function getExecutiveAssistantPlatformState(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantPlatformState {
  const snapshot = getExecutiveAssistantPlatformRegistrySnapshot();
  return Object.freeze({
    platformId: ASS_PLATFORM_ID,
    foundationVersion: ASS_PLATFORM_CONTRACT_VERSION,
    contractVersion: ASS_PLATFORM_CONTRACT_VERSION,
    initialized: platformInitialized,
    capabilityCount: snapshot.capabilityCount,
    integrationCount: snapshot.integrationCount,
    conversationScopeCount: snapshot.conversationScopeCount,
    extensionCount: snapshot.extensionCount,
    supportedCapabilities: ASS_CAPABILITY_KEYS,
    supportedIntegrations: ASS_INTEGRATION_KEYS,
    supportedConversationScopes: ASS_CONVERSATION_SCOPE_KEYS,
    supportedExtensionPoints: ASS_EXTENSION_POINT_KEYS,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildExecutiveAssistantPlatformFoundation(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantPlatformResult<ExecutiveAssistantPlatformState> {
  seedDefaultExecutiveAssistantPlatformRegistry(timestamp);
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Executive Assistant platform foundation created.", getExecutiveAssistantPlatformState(timestamp));
}

export function validateExecutiveAssistantPlatform(): ExecutiveAssistantPlatformValidationReport {
  const manifest = getExecutiveAssistantPlatformManifest();
  return validateExecutiveAssistantPlatformContracts(platformInitialized, manifest);
}

export {
  getExecutiveAssistantPlatformRegistry,
  getExecutiveAssistantPlatformManifest,
  getExecutiveAssistantPlatformIdentity,
  getExecutiveAssistantPlatformBoundaries,
  getExecutiveAssistantPlatformPositionStatement,
  getExecutiveAssistantUpstreamPlatformKeys,
  getExecutiveAssistantPlatformSourceMetadata,
  ASS_PUBLIC_API_REGISTRY,
  ASS_RELEASE_METADATA,
  ASS_FUTURE_DEPENDENCY_RULES,
};

export const ExecutiveAssistantPlatform = Object.freeze({
  buildExecutiveAssistantPlatformFoundation,
  validateExecutiveAssistantPlatform,
  getExecutiveAssistantPlatformRegistry,
  getExecutiveAssistantPlatformManifest,
  getExecutiveAssistantPlatformIdentity,
  getExecutiveAssistantPlatformBoundaries,
  getExecutiveAssistantPlatformPositionStatement,
  getExecutiveAssistantPlatformState,
  getExecutiveAssistantPlatformVersionMetadata,
  isExecutiveAssistantPlatformInitialized,
  resetExecutiveAssistantPlatformFoundationForTests,
  version: ASS_PLATFORM_CONTRACT_VERSION,
});

export { ASS_PLATFORM_ID, ASS_PLATFORM_NAME };
