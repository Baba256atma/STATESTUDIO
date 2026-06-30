/**
 * SMM-5 — Synchronization Platform metadata validation.
 */

import {
  SMM_SYNC_COMPATIBLE_VERSIONS,
  SMM_SYNC_CONTRACT_VERSION,
  SMM_SYNC_MANDATORY_FIELDS,
  SMM_SYNC_POLICY_KEYS,
  SMM_SYNC_REGISTRY_KEYS,
  SMM_SYNC_SCOPE_KEYS,
} from "./sharedMentalModelSynchronizationContracts.ts";
import type {
  SharedMentalModelSynchronizationPlatformManifest,
  SharedMentalModelSynchronizationRecord,
  SharedMentalModelSynchronizationRegistryBundle,
  SharedMentalModelSynchronizationValidationIssue,
  SharedMentalModelSynchronizationValidationReport,
} from "./sharedMentalModelSynchronizationTypes.ts";

function issue(code: string, message: string, field?: string): SharedMentalModelSynchronizationValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: SharedMentalModelSynchronizationValidationIssue[]): SharedMentalModelSynchronizationValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateSharedMentalModelSynchronizationRecord(
  record: SharedMentalModelSynchronizationRecord
): SharedMentalModelSynchronizationValidationReport {
  const issues: SharedMentalModelSynchronizationValidationIssue[] = [];
  for (const field of SMM_SYNC_MANDATORY_FIELDS) {
    if (!(field in record)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}`, field));
    }
  }
  if (!record.synchronizationId.trim()) {
    issues.push(issue("missing_sync_id", "Synchronization ID is required.", "synchronizationId"));
  }
  if (record.sourceReferenceId === record.targetReferenceId) {
    issues.push(issue("self_reference", "Source and target references must differ.", "targetReferenceId"));
  }
  return report(issues);
}

export function validateDuplicateSynchronizations(
  registry: SharedMentalModelSynchronizationRegistryBundle
): SharedMentalModelSynchronizationValidationReport {
  const syncIds = registry.synchronizationRegistry.map((entry) => entry.synchronizationId);
  if (syncIds.length !== new Set(syncIds).size) {
    return report([issue("duplicate_synchronization", "Duplicate synchronization records detected.")]);
  }
  return report([]);
}

export function validateInvalidReferences(
  registry: SharedMentalModelSynchronizationRegistryBundle
): SharedMentalModelSynchronizationValidationReport {
  const issues: SharedMentalModelSynchronizationValidationIssue[] = [];
  const referenceIds = new Set(registry.referenceRegistry.map((entry) => entry.referenceId));
  const syncIds = new Set(registry.synchronizationRegistry.map((entry) => entry.synchronizationId));

  for (const sync of registry.synchronizationRegistry) {
    if (!referenceIds.has(sync.sourceReferenceId)) {
      issues.push(issue("invalid_reference", `Synchronization ${sync.synchronizationId} has invalid source reference.`));
    }
    if (!referenceIds.has(sync.targetReferenceId)) {
      issues.push(issue("invalid_reference", `Synchronization ${sync.synchronizationId} has invalid target reference.`));
    }
  }

  for (const reference of registry.referenceRegistry) {
    if (!syncIds.has(reference.synchronizationId)) {
      issues.push(issue("invalid_reference", `Reference ${reference.referenceId} references unknown synchronization.`));
    }
  }
  return report(issues);
}

export function validateInvalidScopes(
  registry: SharedMentalModelSynchronizationRegistryBundle
): SharedMentalModelSynchronizationValidationReport {
  const issues: SharedMentalModelSynchronizationValidationIssue[] = [];
  const scopeKeys = new Set(SMM_SYNC_SCOPE_KEYS);

  for (const sync of registry.synchronizationRegistry) {
    if (!scopeKeys.has(sync.synchronizationScope)) {
      issues.push(issue("invalid_scope", `Synchronization ${sync.synchronizationId} has invalid scope.`));
    }
  }

  for (const scope of registry.scopeRegistry) {
    if (!scopeKeys.has(scope.synchronizationScope)) {
      issues.push(issue("invalid_scope", `Scope mapping ${scope.scopeMappingId} has invalid scope.`));
    }
  }
  return report(issues);
}

export function validateInvalidPolicies(
  registry: SharedMentalModelSynchronizationRegistryBundle
): SharedMentalModelSynchronizationValidationReport {
  const issues: SharedMentalModelSynchronizationValidationIssue[] = [];
  const policyKeys = new Set(SMM_SYNC_POLICY_KEYS);
  const registeredPolicyKeys = new Set(registry.policyRegistry.map((entry) => entry.policyKey));

  for (const sync of registry.synchronizationRegistry) {
    if (!policyKeys.has(sync.synchronizationPolicy)) {
      issues.push(issue("invalid_policy", `Synchronization ${sync.synchronizationId} has invalid policy.`));
    }
    if (!registeredPolicyKeys.has(sync.synchronizationPolicy)) {
      issues.push(issue("invalid_policy", `Synchronization ${sync.synchronizationId} references unregistered policy.`));
    }
  }
  return report(issues);
}

export function validateVersionCompatibility(
  registry: SharedMentalModelSynchronizationRegistryBundle
): SharedMentalModelSynchronizationValidationReport {
  const issues: SharedMentalModelSynchronizationValidationIssue[] = [];
  for (const sync of registry.synchronizationRegistry) {
    const contractVersion = sync.versionCompatibilityMetadata.contractVersion;
    if (contractVersion && contractVersion !== SMM_SYNC_CONTRACT_VERSION) {
      issues.push(issue("version_compatibility", `Synchronization ${sync.synchronizationId} has incompatible contract version.`));
    }
    for (const version of SMM_SYNC_COMPATIBLE_VERSIONS) {
      const key = `compatible_${version.replace("/", "_")}`;
      if (sync.versionCompatibilityMetadata[key] === "false") {
        issues.push(issue("version_compatibility", `Synchronization ${sync.synchronizationId} declares incompatibility with ${version}.`));
      }
    }
  }
  return report(issues);
}

export function validateSynchronizationManifestConsistency(
  registry: SharedMentalModelSynchronizationRegistryBundle
): SharedMentalModelSynchronizationValidationReport {
  const issues: SharedMentalModelSynchronizationValidationIssue[] = [];
  const syncById = new Map(registry.synchronizationRegistry.map((entry) => [entry.synchronizationId, entry]));

  for (const manifest of registry.manifestRegistry) {
    const sync = syncById.get(manifest.synchronizationId);
    if (!sync) {
      issues.push(issue("manifest_consistency", `Manifest ${manifest.manifestId} references unknown synchronization.`));
      continue;
    }
    if (sync.synchronizationScope !== manifest.scopeKey) {
      issues.push(issue("manifest_consistency", `Manifest ${manifest.manifestId} scope mismatch.`));
    }
    if (sync.synchronizationPolicy !== manifest.policyKey) {
      issues.push(issue("manifest_consistency", `Manifest ${manifest.manifestId} policy mismatch.`));
    }
  }
  return report(issues);
}

export function validateSynchronizationRegistryCompleteness(
  registry: SharedMentalModelSynchronizationRegistryBundle
): SharedMentalModelSynchronizationValidationReport {
  const issues: SharedMentalModelSynchronizationValidationIssue[] = [];
  if (registry.policyCount < SMM_SYNC_POLICY_KEYS.length) {
    issues.push(issue("registry_completeness", "Policy registry is incomplete."));
  }
  if (registry.validationCount === 0) {
    issues.push(issue("registry_completeness", "Validation registry has no entries."));
  }
  if (registry.synchronizationCount === 0 && registry.referenceCount === 0) {
    issues.push(issue("empty_registry", "Synchronization registry has no entries."));
  }
  return report(issues);
}

export function validateSharedMentalModelSynchronizationRegistry(
  registry: SharedMentalModelSynchronizationRegistryBundle
): SharedMentalModelSynchronizationValidationReport {
  const issues: SharedMentalModelSynchronizationValidationIssue[] = [];
  for (const validation of [
    validateDuplicateSynchronizations(registry),
    validateInvalidReferences(registry),
    validateInvalidScopes(registry),
    validateInvalidPolicies(registry),
    validateVersionCompatibility(registry),
    validateSynchronizationManifestConsistency(registry),
    validateSynchronizationRegistryCompleteness(registry),
  ]) {
    issues.push(...validation.issues);
  }
  for (const sync of registry.synchronizationRegistry) {
    issues.push(...validateSharedMentalModelSynchronizationRecord(sync).issues);
  }
  return report(issues);
}

export function validateSharedMentalModelSynchronizationPlatformManifest(
  manifest: SharedMentalModelSynchronizationPlatformManifest
): SharedMentalModelSynchronizationValidationReport {
  const issues: SharedMentalModelSynchronizationValidationIssue[] = [];
  if (manifest.version !== SMM_SYNC_CONTRACT_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Manifest version must be SMM/5."));
  }
  if (manifest.registryKeys.length !== SMM_SYNC_REGISTRY_KEYS.length) {
    issues.push(issue("manifest_registry_keys", "Manifest registry keys are incomplete."));
  }
  for (const version of SMM_SYNC_COMPATIBLE_VERSIONS) {
    if (!(manifest.compatibility as readonly string[]).includes(version)) {
      issues.push(issue("manifest_compatibility", `Manifest missing compatibility for ${version}.`));
    }
  }
  return report(issues);
}

export function getDefaultSynchronizationCompatibility(): readonly string[] {
  return Object.freeze([...SMM_SYNC_COMPATIBLE_VERSIONS, SMM_SYNC_CONTRACT_VERSION]);
}
