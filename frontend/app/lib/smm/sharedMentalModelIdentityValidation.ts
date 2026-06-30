/**
 * SMM-3 — Identity registry metadata validation.
 */

import {
  SMM_IDENTITY_COMPATIBLE_VERSIONS,
  SMM_IDENTITY_CONTRACT_VERSION,
  SMM_IDENTITY_MANDATORY_FIELDS,
  SMM_IDENTITY_REGISTRY_KEYS,
} from "./sharedMentalModelIdentityContracts.ts";
import type {
  SharedMentalModelIdentityRecord,
  SharedMentalModelIdentityRegistryBundle,
  SharedMentalModelIdentityValidationIssue,
  SharedMentalModelIdentityValidationReport,
  SharedMentalModelRegistryManifest,
} from "./sharedMentalModelIdentityTypes.ts";

function issue(code: string, message: string, field?: string): SharedMentalModelIdentityValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: SharedMentalModelIdentityValidationIssue[]): SharedMentalModelIdentityValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateSharedMentalModelIdentityRecord(
  record: SharedMentalModelIdentityRecord
): SharedMentalModelIdentityValidationReport {
  const issues: SharedMentalModelIdentityValidationIssue[] = [];
  for (const field of SMM_IDENTITY_MANDATORY_FIELDS) {
    if (!(field in record)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}`, field));
    }
  }
  if (!record.modelId.trim()) {
    issues.push(issue("missing_model_id", "Model ID is required.", "modelId"));
  }
  if (!record.modelVersion.trim()) {
    issues.push(issue("missing_model_version", "Model version is required.", "modelVersion"));
  }
  return report(issues);
}

export function validateDuplicateIdentities(
  registry: SharedMentalModelIdentityRegistryBundle
): SharedMentalModelIdentityValidationReport {
  const modelIds = registry.identityRegistry.map((entry) => entry.modelId);
  if (modelIds.length !== new Set(modelIds).size) {
    return report([issue("duplicate_identity", "Duplicate model identities detected.")]);
  }
  const referenceIds = registry.referenceRegistry.map((entry) => entry.referenceId);
  if (referenceIds.length !== new Set(referenceIds).size) {
    return report([issue("duplicate_reference", "Duplicate reference IDs detected.")]);
  }
  return report([]);
}

export function validateMissingReferences(
  registry: SharedMentalModelIdentityRegistryBundle
): SharedMentalModelIdentityValidationReport {
  const issues: SharedMentalModelIdentityValidationIssue[] = [];
  const referenceIds = new Set(registry.referenceRegistry.map((entry) => entry.referenceId));
  for (const identity of registry.identityRegistry) {
    if (!referenceIds.has(identity.workspaceReferenceId)) {
      issues.push(issue("missing_workspace_reference", `Missing workspace reference for ${identity.modelId}.`));
    }
    if (!referenceIds.has(identity.organizationReferenceId)) {
      issues.push(issue("missing_organization_reference", `Missing organization reference for ${identity.modelId}.`));
    }
    if (!referenceIds.has(identity.snapshotReferenceId)) {
      issues.push(issue("missing_snapshot_reference", `Missing snapshot reference for ${identity.modelId}.`));
    }
    if (identity.executiveReferenceId && !referenceIds.has(identity.executiveReferenceId)) {
      issues.push(issue("missing_executive_reference", `Missing executive reference for ${identity.modelId}.`));
    }
    if (identity.parentReferenceId && !referenceIds.has(identity.parentReferenceId)) {
      issues.push(issue("missing_parent_reference", `Missing parent reference for ${identity.modelId}.`));
    }
  }
  return report(issues);
}

export function validateParentChains(
  registry: SharedMentalModelIdentityRegistryBundle
): SharedMentalModelIdentityValidationReport {
  const issues: SharedMentalModelIdentityValidationIssue[] = [];
  for (const identity of registry.identityRegistry) {
    if (!identity.parentReferenceId) {
      continue;
    }
    const parentRef = registry.referenceRegistry.find((entry) => entry.referenceId === identity.parentReferenceId);
    if (!parentRef) {
      issues.push(issue("broken_parent_chain", `Broken parent chain for ${identity.modelId}.`));
      continue;
    }
    if (parentRef.modelId === identity.modelId) {
      issues.push(issue("self_parent_chain", `Model cannot reference itself as parent: ${identity.modelId}.`));
    }
  }
  return report(issues);
}

export function validateVersionReferences(
  registry: SharedMentalModelIdentityRegistryBundle
): SharedMentalModelIdentityValidationReport {
  const issues: SharedMentalModelIdentityValidationIssue[] = [];
  for (const version of registry.versionRegistry) {
    if (version.parentVersionId && !registry.versionRegistry.some((entry) => entry.versionId === version.parentVersionId)) {
      issues.push(issue("invalid_version_reference", `Invalid parent version for ${version.versionId}.`));
    }
    if (!registry.identityRegistry.some((entry) => entry.modelId === version.modelId)) {
      issues.push(issue("orphan_version", `Version ${version.versionId} references unknown model.`));
    }
  }
  return report(issues);
}

export function validateRegistryCompleteness(
  registry: SharedMentalModelIdentityRegistryBundle
): SharedMentalModelIdentityValidationReport {
  if (registry.identityCount === 0 && registry.referenceCount === 0) {
    return report([issue("empty_registry", "Identity registry has no entries.")]);
  }
  return report([]);
}

export function validateSharedMentalModelIdentityRegistry(
  registry: SharedMentalModelIdentityRegistryBundle
): SharedMentalModelIdentityValidationReport {
  const issues: SharedMentalModelIdentityValidationIssue[] = [];
  for (const validation of [
    validateDuplicateIdentities(registry),
    validateMissingReferences(registry),
    validateParentChains(registry),
    validateVersionReferences(registry),
    validateRegistryCompleteness(registry),
  ]) {
    issues.push(...validation.issues);
  }
  for (const identity of registry.identityRegistry) {
    issues.push(...validateSharedMentalModelIdentityRecord(identity).issues);
  }
  return report(issues);
}

export function validateSharedMentalModelRegistryManifest(
  manifest: SharedMentalModelRegistryManifest
): SharedMentalModelIdentityValidationReport {
  const issues: SharedMentalModelIdentityValidationIssue[] = [];
  if (manifest.version !== SMM_IDENTITY_CONTRACT_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Manifest version must be SMM/3."));
  }
  if (manifest.registryKeys.length !== SMM_IDENTITY_REGISTRY_KEYS.length) {
    issues.push(issue("manifest_registry_keys", "Manifest registry keys are incomplete."));
  }
  for (const version of SMM_IDENTITY_COMPATIBLE_VERSIONS) {
    if (!(manifest.compatibility as readonly string[]).includes(version)) {
      issues.push(issue("manifest_compatibility", `Manifest missing compatibility for ${version}.`));
    }
  }
  return report(issues);
}

export function getDefaultIdentityCompatibility(): readonly string[] {
  return Object.freeze([...SMM_IDENTITY_COMPATIBLE_VERSIONS, SMM_IDENTITY_CONTRACT_VERSION]);
}
