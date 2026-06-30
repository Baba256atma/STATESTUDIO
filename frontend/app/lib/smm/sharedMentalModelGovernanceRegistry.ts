/**
 * SMM-7 — Governance, ownership, stewardship, policy, compliance, audit, lifecycle, and manifest registries.
 */

import { buildSharedMentalModelQueryPlatform } from "./sharedMentalModelQueryExports.ts";
import {
  SMM_GOVERNANCE_CONTRACT_VERSION,
  SMM_GOVERNANCE_DEFAULT_LIMITS,
  SMM_GOVERNANCE_POLICY_KEYS,
} from "./sharedMentalModelGovernanceContracts.ts";
import type {
  SharedMentalModelComplianceRecord,
  SharedMentalModelGovernanceAuditRecord,
  SharedMentalModelGovernanceInput,
  SharedMentalModelGovernanceLifecycleRecord,
  SharedMentalModelGovernanceManifestRecord,
  SharedMentalModelGovernancePolicyRecord,
  SharedMentalModelGovernanceRecord,
  SharedMentalModelGovernanceRegistrationResult,
  SharedMentalModelGovernanceRegistryBundle,
  SharedMentalModelOwnershipRecord,
  SharedMentalModelStewardshipRecord,
} from "./sharedMentalModelGovernanceTypes.ts";

const governanceRegistry = new Map<string, SharedMentalModelGovernanceRecord>();
const ownershipRegistry = new Map<string, SharedMentalModelOwnershipRecord>();
const stewardshipRegistry = new Map<string, SharedMentalModelStewardshipRecord>();
const policyRegistry = new Map<string, SharedMentalModelGovernancePolicyRecord>();
const complianceRegistry = new Map<string, SharedMentalModelComplianceRecord>();
const auditRegistry = new Map<string, SharedMentalModelGovernanceAuditRecord>();
const lifecycleRegistry = new Map<string, SharedMentalModelGovernanceLifecycleRecord>();
const manifestRegistry = new Map<string, SharedMentalModelGovernanceManifestRecord>();

function result<T>(success: boolean, reason: string, record: T | null): SharedMentalModelGovernanceRegistrationResult<T> {
  return Object.freeze({ success, reason, record, readOnly: true as const });
}

export function createStableGovernanceId(seed: string): string {
  return `smm-governance-${seed}`;
}

export function createStableOwnershipId(governanceId: string): string {
  return `smm-ownership-${governanceId}`;
}

export function createStableStewardshipId(governanceId: string): string {
  return `smm-stewardship-${governanceId}`;
}

export function createStableGovernancePolicyRefId(policyKey: string): string {
  return `smm-governance-policy-ref-${policyKey}`;
}

export function createStableComplianceId(governanceId: string, complianceKey: string): string {
  return `smm-compliance-${governanceId}-${complianceKey}`;
}

export function createStableGovernanceAuditRefId(governanceId: string): string {
  return `smm-governance-audit-${governanceId}`;
}

export function createStableGovernanceLifecycleId(governanceId: string, status: string): string {
  return `smm-governance-lifecycle-${governanceId}-${status}`;
}

export function createStableGovernanceManifestId(governanceId: string): string {
  return `smm-governance-manifest-${governanceId}`;
}

export function buildSharedMentalModelGovernanceRecord(
  input: SharedMentalModelGovernanceInput,
  timestamp: string
): SharedMentalModelGovernanceRecord {
  return Object.freeze({
    governanceId: input.governanceId,
    modelReferenceId: input.modelReferenceId,
    ownerReferenceId: input.ownerReferenceId,
    stewardReferenceId: input.stewardReferenceId ?? null,
    governancePolicyReferenceId: input.governancePolicyReferenceId,
    complianceMetadata: Object.freeze(input.complianceMetadata ?? {}),
    auditReferenceId: input.auditReferenceId,
    lifecycleMetadata: Object.freeze(input.lifecycleMetadata ?? {}),
    versionCompatibilityMetadata: Object.freeze({
      ...(input.versionCompatibilityMetadata ?? {}),
      contractVersion: SMM_GOVERNANCE_CONTRACT_VERSION,
    }),
    createdAt: timestamp,
    createdMetadata: Object.freeze(input.createdMetadata ?? {}),
    extensionMetadata: Object.freeze(input.extensionMetadata ?? {}),
    readOnly: true as const,
  });
}

export function isSharedMentalModelGovernanceImmutable(record: SharedMentalModelGovernanceRecord): boolean {
  return Object.isFrozen(record);
}

export function resetSharedMentalModelGovernanceStoreForTests(): void {
  governanceRegistry.clear();
  ownershipRegistry.clear();
  stewardshipRegistry.clear();
  policyRegistry.clear();
  complianceRegistry.clear();
  auditRegistry.clear();
  lifecycleRegistry.clear();
  manifestRegistry.clear();
}

function seedDefaultPolicies(timestamp: string): void {
  const labels: Record<(typeof SMM_GOVERNANCE_POLICY_KEYS)[number], string> = {
    ownership: "Ownership Policy",
    stewardship: "Stewardship Policy",
    read_access: "Read Access Policy",
    write_access: "Write Access Policy",
    retention: "Retention Policy",
    archival: "Archival Policy",
    compliance: "Compliance Policy",
    certification: "Certification Policy",
  };
  for (const policyKey of SMM_GOVERNANCE_POLICY_KEYS) {
    const policyId = `smm-governance-policy-${policyKey}`;
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

export function getSharedMentalModelGovernanceRegistryBundle(): SharedMentalModelGovernanceRegistryBundle {
  const sortByKey = <T>(entries: readonly T[], getKey: (entry: T) => string) =>
    Object.freeze([...entries].sort((left, right) => getKey(left).localeCompare(getKey(right))));

  const governance = sortByKey([...governanceRegistry.values()], (entry) => entry.governanceId);
  const ownership = sortByKey([...ownershipRegistry.values()], (entry) => entry.ownershipId);
  const stewardship = sortByKey([...stewardshipRegistry.values()], (entry) => entry.stewardshipId);
  const policies = sortByKey([...policyRegistry.values()], (entry) => entry.policyId);
  const compliance = sortByKey([...complianceRegistry.values()], (entry) => entry.complianceId);
  const audits = sortByKey([...auditRegistry.values()], (entry) => entry.auditReferenceId);
  const lifecycles = sortByKey([...lifecycleRegistry.values()], (entry) => entry.lifecycleId);
  const manifests = sortByKey([...manifestRegistry.values()], (entry) => entry.manifestId);

  return Object.freeze({
    governanceRegistry: governance,
    governanceCount: governance.length,
    ownershipRegistry: ownership,
    ownershipCount: ownership.length,
    stewardshipRegistry: stewardship,
    stewardshipCount: stewardship.length,
    policyRegistry: policies,
    policyCount: policies.length,
    complianceRegistry: compliance,
    complianceCount: compliance.length,
    auditRegistry: audits,
    auditCount: audits.length,
    lifecycleRegistry: lifecycles,
    lifecycleCount: lifecycles.length,
    manifestRegistry: manifests,
    manifestCount: manifests.length,
    readOnly: true as const,
  });
}

export function getSharedMentalModelGovernanceRegistry(): readonly SharedMentalModelGovernanceRecord[] {
  return getSharedMentalModelGovernanceRegistryBundle().governanceRegistry;
}

export function getSharedMentalModelGovernancePolicies(): readonly SharedMentalModelGovernancePolicyRecord[] {
  return getSharedMentalModelGovernanceRegistryBundle().policyRegistry;
}

export function registerSharedMentalModelGovernance(
  input: SharedMentalModelGovernanceInput,
  timestamp: string
): SharedMentalModelGovernanceRegistrationResult<SharedMentalModelGovernanceRecord> {
  if (governanceRegistry.has(input.governanceId)) {
    return result(false, "Duplicate governance ID.", null);
  }
  if (governanceRegistry.size >= SMM_GOVERNANCE_DEFAULT_LIMITS.maxGovernanceRecords) {
    return result(false, "Governance registry limit reached.", null);
  }
  const record = buildSharedMentalModelGovernanceRecord(input, timestamp);
  governanceRegistry.set(record.governanceId, record);
  return result(true, "Governance record registered.", record);
}

export function registerSharedMentalModelOwnership(
  ownershipId: string,
  governanceId: string,
  modelReferenceId: string,
  ownerReferenceId: string,
  ownerLabel: string,
  timestamp: string
): SharedMentalModelGovernanceRegistrationResult<SharedMentalModelOwnershipRecord> {
  if (ownershipRegistry.has(ownershipId)) {
    return result(false, "Duplicate ownership ID.", null);
  }
  const record = Object.freeze({
    ownershipId,
    governanceId,
    modelReferenceId,
    ownerReferenceId,
    ownerLabel,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  ownershipRegistry.set(ownershipId, record);
  return result(true, "Ownership registered.", record);
}

export function registerSharedMentalModelStewardship(
  stewardshipId: string,
  governanceId: string,
  modelReferenceId: string,
  stewardReferenceId: string,
  stewardLabel: string,
  timestamp: string
): SharedMentalModelGovernanceRegistrationResult<SharedMentalModelStewardshipRecord> {
  if (stewardshipRegistry.has(stewardshipId)) {
    return result(false, "Duplicate stewardship ID.", null);
  }
  const record = Object.freeze({
    stewardshipId,
    governanceId,
    modelReferenceId,
    stewardReferenceId,
    stewardLabel,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  stewardshipRegistry.set(stewardshipId, record);
  return result(true, "Stewardship registered.", record);
}

export function registerSharedMentalModelCompliance(
  complianceId: string,
  governanceId: string,
  complianceKey: string,
  complianceValue: string,
  timestamp: string
): SharedMentalModelGovernanceRegistrationResult<SharedMentalModelComplianceRecord> {
  if (complianceRegistry.has(complianceId)) {
    return result(false, "Duplicate compliance ID.", null);
  }
  const record = Object.freeze({
    complianceId,
    governanceId,
    complianceKey,
    complianceValue,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  complianceRegistry.set(complianceId, record);
  return result(true, "Compliance registered.", record);
}

export function registerSharedMentalModelGovernanceAudit(
  auditReferenceId: string,
  governanceId: string,
  auditTrailRef: string,
  auditLabel: string,
  timestamp: string
): SharedMentalModelGovernanceRegistrationResult<SharedMentalModelGovernanceAuditRecord> {
  if (auditRegistry.has(auditReferenceId)) {
    return result(false, "Duplicate audit reference ID.", null);
  }
  const record = Object.freeze({
    auditReferenceId,
    governanceId,
    auditTrailRef,
    auditLabel,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  auditRegistry.set(auditReferenceId, record);
  return result(true, "Audit reference registered.", record);
}

export function registerSharedMentalModelGovernanceLifecycle(
  lifecycleId: string,
  governanceId: string,
  status: SharedMentalModelGovernanceLifecycleRecord["status"],
  lifecycleMetadata: Readonly<Record<string, string>>,
  timestamp: string
): SharedMentalModelGovernanceRegistrationResult<SharedMentalModelGovernanceLifecycleRecord> {
  if (lifecycleRegistry.has(lifecycleId)) {
    return result(false, "Duplicate lifecycle ID.", null);
  }
  const record = Object.freeze({
    lifecycleId,
    governanceId,
    status,
    lifecycleMetadata: Object.freeze(lifecycleMetadata),
    recordedAt: timestamp,
    readOnly: true as const,
  });
  lifecycleRegistry.set(lifecycleId, record);
  return result(true, "Lifecycle registered.", record);
}

export function registerSharedMentalModelGovernanceManifest(
  manifestId: string,
  governanceId: string,
  policyKey: SharedMentalModelGovernanceManifestRecord["policyKey"],
  payloadRef: string,
  timestamp: string
): SharedMentalModelGovernanceRegistrationResult<SharedMentalModelGovernanceManifestRecord> {
  if (manifestRegistry.has(manifestId)) {
    return result(false, "Duplicate governance manifest ID.", null);
  }
  const record = Object.freeze({
    manifestId,
    governanceId,
    policyKey,
    payloadRef,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  manifestRegistry.set(manifestId, record);
  return result(true, "Governance manifest registered.", record);
}

export function ensureSharedMentalModelGovernanceDependenciesReady(timestamp: string): boolean {
  const query = buildSharedMentalModelQueryPlatform(timestamp);
  if (!query.success) {
    return false;
  }
  seedDefaultPolicies(timestamp);
  return true;
}

export function lookupSharedMentalModelGovernance(governanceId: string): SharedMentalModelGovernanceRecord | null {
  return governanceRegistry.get(governanceId) ?? null;
}

export function lookupGovernancePolicyReference(policyKey: string): string {
  return createStableGovernancePolicyRefId(policyKey);
}
