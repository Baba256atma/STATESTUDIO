/**
 * SMM-3 — Identity, reference, snapshot, version, and scope registries.
 */

import { buildSharedMentalModelContracts } from "./sharedMentalModelExports.ts";
import { buildSharedMentalModelIdentityRecord } from "./sharedMentalModelIdentity.ts";
import { SMM_IDENTITY_CONTRACT_VERSION, SMM_IDENTITY_DEFAULT_LIMITS } from "./sharedMentalModelIdentityContracts.ts";
import type {
  SharedMentalModelArtifactRecord,
  SharedMentalModelIdentityInput,
  SharedMentalModelIdentityRecord,
  SharedMentalModelIdentityRegistryBundle,
  SharedMentalModelReferenceInput,
  SharedMentalModelReferenceRecord,
  SharedMentalModelRegistrationResult,
  SharedMentalModelScopeRegistrationRecord,
  SharedMentalModelSnapshotRecord,
  SharedMentalModelVersionRecord,
} from "./sharedMentalModelIdentityTypes.ts";

const identityRegistry = new Map<string, SharedMentalModelIdentityRecord>();
const referenceRegistry = new Map<string, SharedMentalModelReferenceRecord>();
const snapshotRegistry = new Map<string, SharedMentalModelSnapshotRecord>();
const versionRegistry = new Map<string, SharedMentalModelVersionRecord>();
const artifactRegistry = new Map<string, SharedMentalModelArtifactRecord>();
const executiveRegistry = new Map<string, SharedMentalModelScopeRegistrationRecord>();
const workspaceRegistry = new Map<string, SharedMentalModelScopeRegistrationRecord>();
const organizationRegistry = new Map<string, SharedMentalModelScopeRegistrationRecord>();
const scenarioRegistry = new Map<string, SharedMentalModelScopeRegistrationRecord>();

function result<T>(success: boolean, reason: string, record: T | null): SharedMentalModelRegistrationResult<T> {
  return Object.freeze({ success, reason, record, readOnly: true as const });
}

export function resetSharedMentalModelIdentityStoreForTests(): void {
  identityRegistry.clear();
  referenceRegistry.clear();
  snapshotRegistry.clear();
  versionRegistry.clear();
  artifactRegistry.clear();
  executiveRegistry.clear();
  workspaceRegistry.clear();
  organizationRegistry.clear();
  scenarioRegistry.clear();
}

export function getSharedMentalModelIdentityRegistry(): SharedMentalModelIdentityRegistryBundle {
  const sortByKey = <T>(entries: readonly T[], getKey: (entry: T) => string) =>
    Object.freeze([...entries].sort((left, right) => getKey(left).localeCompare(getKey(right))));

  const identities = sortByKey([...identityRegistry.values()], (entry) => entry.modelId);
  const references = sortByKey([...referenceRegistry.values()], (entry) => entry.referenceId);
  const snapshots = sortByKey([...snapshotRegistry.values()], (entry) => entry.snapshotId);
  const versions = sortByKey([...versionRegistry.values()], (entry) => entry.versionId);
  const artifacts = sortByKey([...artifactRegistry.values()], (entry) => entry.artifactId);
  const executives = sortByKey([...executiveRegistry.values()], (entry) => entry.registrationId);
  const workspaces = sortByKey([...workspaceRegistry.values()], (entry) => entry.registrationId);
  const organizations = sortByKey([...organizationRegistry.values()], (entry) => entry.registrationId);
  const scenarios = sortByKey([...scenarioRegistry.values()], (entry) => entry.registrationId);

  return Object.freeze({
    identityRegistry: identities,
    identityCount: identities.length,
    referenceRegistry: references,
    referenceCount: references.length,
    snapshotRegistry: snapshots,
    snapshotCount: snapshots.length,
    versionRegistry: versions,
    versionCount: versions.length,
    artifactRegistry: artifacts,
    artifactCount: artifacts.length,
    executiveRegistry: executives,
    executiveCount: executives.length,
    workspaceRegistry: workspaces,
    workspaceCount: workspaces.length,
    organizationRegistry: organizations,
    organizationCount: organizations.length,
    scenarioRegistry: scenarios,
    scenarioCount: scenarios.length,
    readOnly: true as const,
  });
}

export function registerSharedMentalModelIdentity(
  input: SharedMentalModelIdentityInput,
  timestamp: string
): SharedMentalModelRegistrationResult<SharedMentalModelIdentityRecord> {
  if (identityRegistry.has(input.modelId)) {
    return result(false, "Duplicate model identity.", null);
  }
  if (identityRegistry.size >= SMM_IDENTITY_DEFAULT_LIMITS.maxIdentities) {
    return result(false, "Identity registry limit reached.", null);
  }
  const record = buildSharedMentalModelIdentityRecord(input, timestamp);
  identityRegistry.set(record.modelId, record);
  return result(true, "Model identity registered.", record);
}

export function registerSharedMentalModelReference(
  input: SharedMentalModelReferenceInput,
  timestamp: string
): SharedMentalModelRegistrationResult<SharedMentalModelReferenceRecord> {
  if (referenceRegistry.has(input.referenceId)) {
    return result(false, "Duplicate reference ID.", null);
  }
  if (referenceRegistry.size >= SMM_IDENTITY_DEFAULT_LIMITS.maxReferences) {
    return result(false, "Reference registry limit reached.", null);
  }
  const record = Object.freeze({
    ...input,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  referenceRegistry.set(record.referenceId, record);
  return result(true, "Reference registered.", record);
}

export function registerSharedMentalModelSnapshot(
  snapshotId: string,
  modelId: string,
  modelVersion: string,
  payloadRef: string,
  timestamp: string
): SharedMentalModelRegistrationResult<SharedMentalModelSnapshotRecord> {
  if (snapshotRegistry.has(snapshotId)) {
    return result(false, "Duplicate snapshot ID.", null);
  }
  const record = Object.freeze({
    snapshotId,
    modelId,
    modelVersion,
    payloadRef,
    capturedAt: timestamp,
    readOnly: true as const,
  });
  snapshotRegistry.set(snapshotId, record);
  return result(true, "Snapshot registered.", record);
}

export function registerSharedMentalModelVersion(
  versionId: string,
  modelId: string,
  versionLabel: string,
  parentVersionId: string | null,
  timestamp: string
): SharedMentalModelRegistrationResult<SharedMentalModelVersionRecord> {
  if (versionRegistry.has(versionId)) {
    return result(false, "Duplicate version ID.", null);
  }
  const record = Object.freeze({
    versionId,
    modelId,
    versionLabel,
    parentVersionId,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  versionRegistry.set(versionId, record);
  return result(true, "Version registered.", record);
}

export function registerSharedMentalModelArtifact(
  artifactId: string,
  modelId: string,
  artifactTypeKey: string,
  contentRef: string,
  timestamp: string
): SharedMentalModelRegistrationResult<SharedMentalModelArtifactRecord> {
  if (artifactRegistry.has(artifactId)) {
    return result(false, "Duplicate artifact ID.", null);
  }
  const record = Object.freeze({
    artifactId,
    modelId,
    artifactTypeKey,
    contentRef,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  artifactRegistry.set(artifactId, record);
  return result(true, "Artifact registered.", record);
}

function registerScopeRecord(
  registry: Map<string, SharedMentalModelScopeRegistrationRecord>,
  registrationId: string,
  modelId: string,
  scopeRef: string,
  timestamp: string,
  label: string
): SharedMentalModelRegistrationResult<SharedMentalModelScopeRegistrationRecord> {
  if (registry.has(registrationId)) {
    return result(false, `Duplicate ${label} registration.`, null);
  }
  const record = Object.freeze({
    registrationId,
    modelId,
    scopeRef,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  registry.set(registrationId, record);
  return result(true, `${label} registered.`, record);
}

export function registerSharedMentalModelExecutive(
  registrationId: string,
  modelId: string,
  scopeRef: string,
  timestamp: string
) {
  return registerScopeRecord(executiveRegistry, registrationId, modelId, scopeRef, timestamp, "Executive");
}

export function registerSharedMentalModelWorkspace(
  registrationId: string,
  modelId: string,
  scopeRef: string,
  timestamp: string
) {
  return registerScopeRecord(workspaceRegistry, registrationId, modelId, scopeRef, timestamp, "Workspace");
}

export function registerSharedMentalModelOrganization(
  registrationId: string,
  modelId: string,
  scopeRef: string,
  timestamp: string
) {
  return registerScopeRecord(organizationRegistry, registrationId, modelId, scopeRef, timestamp, "Organization");
}

export function registerSharedMentalModelScenario(
  registrationId: string,
  modelId: string,
  scopeRef: string,
  timestamp: string
) {
  return registerScopeRecord(scenarioRegistry, registrationId, modelId, scopeRef, timestamp, "Scenario");
}

export function ensureSharedMentalModelIdentityDependenciesReady(timestamp: string): boolean {
  const domain = buildSharedMentalModelContracts(timestamp);
  return domain.success;
}

export function lookupSharedMentalModelIdentity(modelId: string): SharedMentalModelIdentityRecord | null {
  return identityRegistry.get(modelId) ?? null;
}

export function getIdentityRegistryMetadata(): Readonly<Record<string, string>> {
  return Object.freeze({
    contractVersion: SMM_IDENTITY_CONTRACT_VERSION,
    identityCount: String(identityRegistry.size),
    referenceCount: String(referenceRegistry.size),
    readOnly: "true",
  });
}
