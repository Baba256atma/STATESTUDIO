/**
 * LLM-1 — Public platform exports and foundation facade.
 */

import {
  LLM_EXTENSION_POINT_KEYS,
  LLM_FUTURE_DEPENDENCY_RULES,
  LLM_PLATFORM_CONTRACT_VERSION,
  LLM_PLATFORM_ID,
  LLM_PLATFORM_NAME,
  LLM_PLATFORM_PRINCIPLES,
  LLM_PROVIDER_KEYS,
  LLM_PUBLIC_API_REGISTRY,
  LLM_RELEASE_METADATA,
} from "./llmPlatformContracts.ts";
import { getLlmPlatformBoundaries, validateLlmPlatformBoundaries } from "./llmPlatformBoundaries.ts";
import { getLlmPlatformIdentity, isLlmPlatformIdentityImmutable } from "./llmPlatformIdentity.ts";
import {
  getLlmPlatformRegistry,
  getLlmPlatformRegistrySnapshot,
  resetLlmPlatformRegistryForTests,
  seedDefaultLlmPlatformRegistry,
} from "./llmPlatformRegistry.ts";
import type {
  LlmPlatformManifest,
  LlmPlatformResult,
  LlmPlatformState,
  LlmPlatformValidationReport,
} from "./llmPlatformTypes.ts";
import { getLlmPlatformVersionMetadata, isLlmVersionConsistent } from "./llmPlatformVersion.ts";

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): LlmPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetLlmPlatformFoundationForTests(): void {
  platformInitialized = false;
  lastInitializedAt = null;
  resetLlmPlatformRegistryForTests();
}

export function isLlmPlatformInitialized(): boolean {
  return platformInitialized;
}

export function getLlmPlatformState(timestamp: string = new Date(0).toISOString()): LlmPlatformState {
  const snapshot = getLlmPlatformRegistrySnapshot();
  return Object.freeze({
    platformId: LLM_PLATFORM_ID,
    foundationVersion: LLM_PLATFORM_CONTRACT_VERSION,
    contractVersion: LLM_PLATFORM_CONTRACT_VERSION,
    initialized: platformInitialized,
    providerCount: snapshot.providerCount,
    runtimeContractCount: snapshot.runtimeContractCount,
    extensionPointCount: snapshot.extensionPointCount,
    supportedProviders: LLM_PROVIDER_KEYS,
    supportedExtensionPoints: LLM_EXTENSION_POINT_KEYS,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildLlmPlatformFoundation(
  timestamp: string = new Date(0).toISOString()
): LlmPlatformResult<LlmPlatformState> {
  seedDefaultLlmPlatformRegistry(timestamp);
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "LLM platform foundation created.", getLlmPlatformState(timestamp));
}

export function createLlmPlatformFoundation(
  timestamp: string = new Date(0).toISOString()
): LlmPlatformResult<LlmPlatformState> {
  return buildLlmPlatformFoundation(timestamp);
}

export function validateLlmPlatformContracts(): LlmPlatformValidationReport {
  const issues = [...validateLlmPlatformBoundaries()];
  if (!isLlmPlatformIdentityImmutable()) {
    issues.push(Object.freeze({
      code: "identity_mutable",
      message: "Platform identity must be immutable.",
      readOnly: true as const,
    }));
  }
  if (!isLlmVersionConsistent()) {
    issues.push(Object.freeze({
      code: "version_inconsistent",
      message: "Platform version metadata is inconsistent.",
      readOnly: true as const,
    }));
  }
  if (!platformInitialized) {
    issues.push(Object.freeze({
      code: "not_initialized",
      message: "Platform foundation has not been initialized.",
      readOnly: true as const,
    }));
  } else {
    const registry = getLlmPlatformRegistry();
    if (registry.providers.length !== LLM_PROVIDER_KEYS.length) {
      issues.push(Object.freeze({
        code: "provider_registry_incomplete",
        message: "Provider registry is incomplete.",
        readOnly: true as const,
      }));
    }
    if (registry.extensionPoints.length !== LLM_EXTENSION_POINT_KEYS.length) {
      issues.push(Object.freeze({
        code: "extension_registry_incomplete",
        message: "Extension point registry is incomplete.",
        readOnly: true as const,
      }));
    }
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export function getLlmPlatformManifest(): LlmPlatformManifest {
  return Object.freeze({
    manifestId: "llm-platform-foundation-manifest",
    platformId: LLM_PLATFORM_ID,
    version: LLM_PLATFORM_CONTRACT_VERSION,
    title: LLM_PLATFORM_NAME,
    goal: "Canonical LLM platform identity, boundaries, provider abstraction, runtime contracts, and extension points.",
    lifecycle: "build" as const,
    principles: LLM_PLATFORM_PRINCIPLES,
    publicApis: LLM_PUBLIC_API_REGISTRY,
    extensionPoints: LLM_EXTENSION_POINT_KEYS,
    providerKeys: LLM_PROVIDER_KEYS,
    readOnly: true as const,
  });
}

export {
  getLlmPlatformIdentity,
  getLlmPlatformBoundaries,
  getLlmPlatformRegistry,
  getLlmPlatformVersionMetadata,
  LLM_PUBLIC_API_REGISTRY,
  LLM_RELEASE_METADATA,
  LLM_FUTURE_DEPENDENCY_RULES,
};

export const LlmPlatformFoundation = Object.freeze({
  getLlmPlatformIdentity,
  getLlmPlatformBoundaries,
  getLlmPlatformRegistry,
  getLlmPlatformVersionMetadata,
  buildLlmPlatformFoundation,
  createLlmPlatformFoundation,
  validateLlmPlatformContracts,
  getLlmPlatformManifest,
  getLlmPlatformState,
  isLlmPlatformInitialized,
  resetLlmPlatformFoundationForTests,
  version: LLM_PLATFORM_CONTRACT_VERSION,
});
