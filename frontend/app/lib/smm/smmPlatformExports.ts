/**
 * SMM-1 — Public platform exports and foundation facade.
 */

import {
  SMM_EXTENSION_POINT_KEYS,
  SMM_FUTURE_DEPENDENCY_RULES,
  SMM_MODEL_ARTIFACT_TYPE_KEYS,
  SMM_MODEL_CONTRACT_KEYS,
  SMM_MODEL_SCOPE_KEYS,
  SMM_PLATFORM_CONTRACT_VERSION,
  SMM_PLATFORM_ID,
  SMM_PLATFORM_NAME,
  SMM_PLATFORM_PRINCIPLES,
  SMM_PUBLIC_API_REGISTRY,
  SMM_RELEASE_METADATA,
} from "./smmPlatformContracts.ts";
import { getSmmPlatformBoundaries, getSmmPlatformPositionStatement, validateSmmPlatformBoundaries } from "./smmPlatformBoundaries.ts";
import { getSmmPlatformIdentity, isSmmPlatformIdentityImmutable } from "./smmPlatformIdentity.ts";
import {
  getSmmPlatformRegistry,
  getSmmPlatformRegistrySnapshot,
  resetSmmPlatformRegistryForTests,
  seedDefaultSmmPlatformRegistry,
} from "./smmPlatformRegistry.ts";
import type {
  SmmPlatformManifest,
  SmmPlatformResult,
  SmmPlatformState,
  SmmPlatformValidationReport,
} from "./smmPlatformTypes.ts";
import { getSmmPlatformVersionMetadata, isSmmVersionConsistent } from "./smmPlatformVersion.ts";

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): SmmPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetSmmPlatformFoundationForTests(): void {
  platformInitialized = false;
  lastInitializedAt = null;
  resetSmmPlatformRegistryForTests();
}

export function isSmmPlatformInitialized(): boolean {
  return platformInitialized;
}

export function getSmmPlatformState(timestamp: string = new Date(0).toISOString()): SmmPlatformState {
  const snapshot = getSmmPlatformRegistrySnapshot();
  return Object.freeze({
    platformId: SMM_PLATFORM_ID,
    foundationVersion: SMM_PLATFORM_CONTRACT_VERSION,
    contractVersion: SMM_PLATFORM_CONTRACT_VERSION,
    initialized: platformInitialized,
    scopeCount: snapshot.scopeCount,
    artifactTypeCount: snapshot.artifactTypeCount,
    modelContractCount: snapshot.modelContractCount,
    extensionPointCount: snapshot.extensionPointCount,
    supportedScopes: SMM_MODEL_SCOPE_KEYS,
    supportedArtifactTypes: SMM_MODEL_ARTIFACT_TYPE_KEYS,
    supportedModelContracts: SMM_MODEL_CONTRACT_KEYS,
    supportedExtensionPoints: SMM_EXTENSION_POINT_KEYS,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildSmmPlatformFoundation(
  timestamp: string = new Date(0).toISOString()
): SmmPlatformResult<SmmPlatformState> {
  seedDefaultSmmPlatformRegistry(timestamp);
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "SMM platform foundation created.", getSmmPlatformState(timestamp));
}

export function createSmmPlatformFoundation(
  timestamp: string = new Date(0).toISOString()
): SmmPlatformResult<SmmPlatformState> {
  return buildSmmPlatformFoundation(timestamp);
}

export function validateSmmPlatformContracts(): SmmPlatformValidationReport {
  const issues = [...validateSmmPlatformBoundaries()];
  if (!isSmmPlatformIdentityImmutable()) {
    issues.push(Object.freeze({
      code: "identity_mutable",
      message: "Platform identity must be immutable.",
      readOnly: true as const,
    }));
  }
  if (!isSmmVersionConsistent()) {
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
    const registry = getSmmPlatformRegistry();
    if (registry.scopes.length !== SMM_MODEL_SCOPE_KEYS.length) {
      issues.push(Object.freeze({
        code: "scope_registry_incomplete",
        message: "Model scope registry is incomplete.",
        readOnly: true as const,
      }));
    }
    if (registry.artifactTypes.length !== SMM_MODEL_ARTIFACT_TYPE_KEYS.length) {
      issues.push(Object.freeze({
        code: "artifact_type_registry_incomplete",
        message: "Model artifact type registry is incomplete.",
        readOnly: true as const,
      }));
    }
    if (registry.modelContracts.length !== SMM_MODEL_CONTRACT_KEYS.length) {
      issues.push(Object.freeze({
        code: "model_contract_registry_incomplete",
        message: "Model contract registry is incomplete.",
        readOnly: true as const,
      }));
    }
    if (registry.extensionPoints.length !== SMM_EXTENSION_POINT_KEYS.length) {
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

export function getSmmPlatformManifest(): SmmPlatformManifest {
  return Object.freeze({
    manifestId: "smm-platform-foundation-manifest",
    platformId: SMM_PLATFORM_ID,
    version: SMM_PLATFORM_CONTRACT_VERSION,
    title: SMM_PLATFORM_NAME,
    goal: "Canonical Shared Mental Model platform identity, boundaries, model contracts, and extension points.",
    lifecycle: "build" as const,
    principles: SMM_PLATFORM_PRINCIPLES,
    publicApis: SMM_PUBLIC_API_REGISTRY,
    extensionPoints: SMM_EXTENSION_POINT_KEYS,
    modelScopeKeys: SMM_MODEL_SCOPE_KEYS,
    modelArtifactTypeKeys: SMM_MODEL_ARTIFACT_TYPE_KEYS,
    readOnly: true as const,
  });
}

export {
  getSmmPlatformIdentity,
  getSmmPlatformBoundaries,
  getSmmPlatformPositionStatement,
  getSmmPlatformRegistry,
  getSmmPlatformVersionMetadata,
  SMM_PUBLIC_API_REGISTRY,
  SMM_RELEASE_METADATA,
  SMM_FUTURE_DEPENDENCY_RULES,
};

export const SharedMentalModelPlatform = Object.freeze({
  getSmmPlatformIdentity,
  getSmmPlatformBoundaries,
  getSmmPlatformPositionStatement,
  getSmmPlatformRegistry,
  getSmmPlatformVersionMetadata,
  buildSmmPlatformFoundation,
  createSmmPlatformFoundation,
  validateSmmPlatformContracts,
  getSmmPlatformManifest,
  getSmmPlatformState,
  isSmmPlatformInitialized,
  resetSmmPlatformFoundationForTests,
  version: SMM_PLATFORM_CONTRACT_VERSION,
});

export const SmmPlatformFoundation = SharedMentalModelPlatform;
