/**
 * SMM-5 — Synchronization, scope, policy, reference, manifest, and validation registries.
 */

import { buildSharedMentalModelSnapshotPlatform } from "./sharedMentalModelSnapshotExports.ts";
import {
  SMM_SYNC_CONTRACT_VERSION,
  SMM_SYNC_DEFAULT_LIMITS,
  SMM_SYNC_POLICY_KEYS,
} from "./sharedMentalModelSynchronizationContracts.ts";
import type {
  SharedMentalModelSynchronizationInput,
  SharedMentalModelSynchronizationManifestRecord,
  SharedMentalModelSynchronizationPolicyRecord,
  SharedMentalModelSynchronizationRecord,
  SharedMentalModelSynchronizationReferenceRecord,
  SharedMentalModelSynchronizationRegistrationResult,
  SharedMentalModelSynchronizationRegistryBundle,
  SharedMentalModelSynchronizationScopeRecord,
  SharedMentalModelSynchronizationValidationRuleRecord,
} from "./sharedMentalModelSynchronizationTypes.ts";

const synchronizationRegistry = new Map<string, SharedMentalModelSynchronizationRecord>();
const scopeRegistry = new Map<string, SharedMentalModelSynchronizationScopeRecord>();
const policyRegistry = new Map<string, SharedMentalModelSynchronizationPolicyRecord>();
const referenceRegistry = new Map<string, SharedMentalModelSynchronizationReferenceRecord>();
const manifestRegistry = new Map<string, SharedMentalModelSynchronizationManifestRecord>();
const validationRegistry = new Map<string, SharedMentalModelSynchronizationValidationRuleRecord>();

function result<T>(success: boolean, reason: string, record: T | null): SharedMentalModelSynchronizationRegistrationResult<T> {
  return Object.freeze({ success, reason, record, readOnly: true as const });
}

export function createStableSynchronizationId(scope: string, seed: string): string {
  return `smm-sync-${scope}-${seed}`;
}

export function createStableScopeMappingId(scope: string, seed: string): string {
  return `smm-sync-scope-${scope}-${seed}`;
}

export function createStableSyncReferenceId(role: string, seed: string): string {
  return `smm-sync-ref-${role}-${seed}`;
}

export function createStableSyncManifestId(synchronizationId: string): string {
  return `smm-sync-manifest-${synchronizationId}`;
}

export function createStableSyncValidationRuleId(ruleKey: string): string {
  return `smm-sync-validation-${ruleKey}`;
}

export function buildSharedMentalModelSynchronizationRecord(
  input: SharedMentalModelSynchronizationInput,
  timestamp: string
): SharedMentalModelSynchronizationRecord {
  return Object.freeze({
    synchronizationId: input.synchronizationId,
    sourceReferenceId: input.sourceReferenceId,
    targetReferenceId: input.targetReferenceId,
    synchronizationScope: input.synchronizationScope,
    synchronizationPolicy: input.synchronizationPolicy,
    synchronizationStatusMetadata: Object.freeze(input.synchronizationStatusMetadata ?? {}),
    versionCompatibilityMetadata: Object.freeze({
      ...(input.versionCompatibilityMetadata ?? {}),
      contractVersion: SMM_SYNC_CONTRACT_VERSION,
    }),
    snapshotReferenceIds: Object.freeze(input.snapshotReferenceIds ?? []),
    createdAt: timestamp,
    createdMetadata: Object.freeze(input.createdMetadata ?? {}),
    extensionMetadata: Object.freeze(input.extensionMetadata ?? {}),
    readOnly: true as const,
  });
}

export function isSharedMentalModelSynchronizationImmutable(record: SharedMentalModelSynchronizationRecord): boolean {
  return Object.isFrozen(record);
}

export function resetSharedMentalModelSynchronizationStoreForTests(): void {
  synchronizationRegistry.clear();
  scopeRegistry.clear();
  policyRegistry.clear();
  referenceRegistry.clear();
  manifestRegistry.clear();
  validationRegistry.clear();
}

function seedDefaultPolicies(timestamp: string): void {
  const labels: Record<(typeof SMM_SYNC_POLICY_KEYS)[number], string> = {
    manual: "Manual Synchronization",
    automatic: "Automatic Synchronization",
    read_only: "Read-only Synchronization",
    reference_only: "Reference-only Synchronization",
    one_way: "One-way Synchronization",
    two_way: "Two-way Synchronization",
  };
  for (const policyKey of SMM_SYNC_POLICY_KEYS) {
    const policyId = `smm-sync-policy-${policyKey}`;
    if (policyRegistry.has(policyId)) {
      continue;
    }
    policyRegistry.set(
      policyId,
      Object.freeze({
        policyId,
        policyKey,
        label: labels[policyKey],
        description: `Descriptive metadata for ${labels[policyKey].toLowerCase()}.`,
        registeredAt: timestamp,
        readOnly: true as const,
      })
    );
  }
}

function seedDefaultValidationRules(timestamp: string): void {
  const rules = Object.freeze([
    Object.freeze({ ruleKey: "duplicate_synchronization", description: "Reject duplicate synchronization records." }),
    Object.freeze({ ruleKey: "invalid_references", description: "Reject synchronization with missing references." }),
    Object.freeze({ ruleKey: "invalid_scopes", description: "Reject unknown synchronization scopes." }),
    Object.freeze({ ruleKey: "invalid_policies", description: "Reject unknown synchronization policies." }),
    Object.freeze({ ruleKey: "version_compatibility", description: "Validate version compatibility metadata." }),
    Object.freeze({ ruleKey: "manifest_consistency", description: "Validate manifest consistency with records." }),
    Object.freeze({ ruleKey: "registry_completeness", description: "Ensure registry has required entries." }),
  ]);
  for (const rule of rules) {
    const validationRuleId = createStableSyncValidationRuleId(rule.ruleKey);
    if (validationRegistry.has(validationRuleId)) {
      continue;
    }
    validationRegistry.set(
      validationRuleId,
      Object.freeze({
        validationRuleId,
        ruleKey: rule.ruleKey,
        description: rule.description,
        registeredAt: timestamp,
        readOnly: true as const,
      })
    );
  }
}

export function getSharedMentalModelSynchronizationRegistryBundle(): SharedMentalModelSynchronizationRegistryBundle {
  const sortByKey = <T>(entries: readonly T[], getKey: (entry: T) => string) =>
    Object.freeze([...entries].sort((left, right) => getKey(left).localeCompare(getKey(right))));

  const synchronizations = sortByKey([...synchronizationRegistry.values()], (entry) => entry.synchronizationId);
  const scopes = sortByKey([...scopeRegistry.values()], (entry) => entry.scopeMappingId);
  const policies = sortByKey([...policyRegistry.values()], (entry) => entry.policyId);
  const references = sortByKey([...referenceRegistry.values()], (entry) => entry.referenceId);
  const manifests = sortByKey([...manifestRegistry.values()], (entry) => entry.manifestId);
  const validations = sortByKey([...validationRegistry.values()], (entry) => entry.validationRuleId);

  return Object.freeze({
    synchronizationRegistry: synchronizations,
    synchronizationCount: synchronizations.length,
    scopeRegistry: scopes,
    scopeCount: scopes.length,
    policyRegistry: policies,
    policyCount: policies.length,
    referenceRegistry: references,
    referenceCount: references.length,
    manifestRegistry: manifests,
    manifestCount: manifests.length,
    validationRegistry: validations,
    validationCount: validations.length,
    readOnly: true as const,
  });
}

export function getSharedMentalModelSynchronizationRegistry(): readonly SharedMentalModelSynchronizationRecord[] {
  return getSharedMentalModelSynchronizationRegistryBundle().synchronizationRegistry;
}

export function getSharedMentalModelSynchronizationPolicies(): readonly SharedMentalModelSynchronizationPolicyRecord[] {
  return getSharedMentalModelSynchronizationRegistryBundle().policyRegistry;
}

export function registerSharedMentalModelSynchronization(
  input: SharedMentalModelSynchronizationInput,
  timestamp: string
): SharedMentalModelSynchronizationRegistrationResult<SharedMentalModelSynchronizationRecord> {
  if (synchronizationRegistry.has(input.synchronizationId)) {
    return result(false, "Duplicate synchronization ID.", null);
  }
  if (synchronizationRegistry.size >= SMM_SYNC_DEFAULT_LIMITS.maxSynchronizations) {
    return result(false, "Synchronization registry limit reached.", null);
  }
  const record = buildSharedMentalModelSynchronizationRecord(input, timestamp);
  synchronizationRegistry.set(record.synchronizationId, record);
  return result(true, "Synchronization registered.", record);
}

export function registerSharedMentalModelSynchronizationScope(
  scopeMappingId: string,
  synchronizationScope: SharedMentalModelSynchronizationScopeRecord["synchronizationScope"],
  sourceScopeRef: string,
  targetScopeRef: string,
  modelId: string,
  timestamp: string
): SharedMentalModelSynchronizationRegistrationResult<SharedMentalModelSynchronizationScopeRecord> {
  if (scopeRegistry.has(scopeMappingId)) {
    return result(false, "Duplicate scope mapping ID.", null);
  }
  const record = Object.freeze({
    scopeMappingId,
    synchronizationScope,
    sourceScopeRef,
    targetScopeRef,
    modelId,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  scopeRegistry.set(scopeMappingId, record);
  return result(true, "Scope mapping registered.", record);
}

export function registerSharedMentalModelSynchronizationReference(
  referenceId: string,
  synchronizationId: string,
  referenceRole: SharedMentalModelSynchronizationReferenceRecord["referenceRole"],
  contentRef: string,
  timestamp: string
): SharedMentalModelSynchronizationRegistrationResult<SharedMentalModelSynchronizationReferenceRecord> {
  if (referenceRegistry.has(referenceId)) {
    return result(false, "Duplicate synchronization reference ID.", null);
  }
  const record = Object.freeze({
    referenceId,
    synchronizationId,
    referenceRole,
    contentRef,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  referenceRegistry.set(referenceId, record);
  return result(true, "Synchronization reference registered.", record);
}

export function registerSharedMentalModelSynchronizationManifest(
  manifestId: string,
  synchronizationId: string,
  scopeKey: SharedMentalModelSynchronizationManifestRecord["scopeKey"],
  policyKey: SharedMentalModelSynchronizationManifestRecord["policyKey"],
  payloadRef: string,
  timestamp: string
): SharedMentalModelSynchronizationRegistrationResult<SharedMentalModelSynchronizationManifestRecord> {
  if (manifestRegistry.has(manifestId)) {
    return result(false, "Duplicate synchronization manifest ID.", null);
  }
  const record = Object.freeze({
    manifestId,
    synchronizationId,
    scopeKey,
    policyKey,
    payloadRef,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  manifestRegistry.set(manifestId, record);
  return result(true, "Synchronization manifest registered.", record);
}

export function ensureSharedMentalModelSynchronizationDependenciesReady(timestamp: string): boolean {
  const snapshot = buildSharedMentalModelSnapshotPlatform(timestamp);
  if (!snapshot.success) {
    return false;
  }
  seedDefaultPolicies(timestamp);
  seedDefaultValidationRules(timestamp);
  return true;
}

export function lookupSharedMentalModelSynchronization(
  synchronizationId: string
): SharedMentalModelSynchronizationRecord | null {
  return synchronizationRegistry.get(synchronizationId) ?? null;
}
