/**
 * SMM-7 — Governance Platform metadata validation.
 */

import {
  SMM_GOVERNANCE_COMPATIBLE_VERSIONS,
  SMM_GOVERNANCE_CONTRACT_VERSION,
  SMM_GOVERNANCE_LIFECYCLE_STATUS_KEYS,
  SMM_GOVERNANCE_MANDATORY_FIELDS,
  SMM_GOVERNANCE_POLICY_KEYS,
  SMM_GOVERNANCE_REGISTRY_KEYS,
} from "./sharedMentalModelGovernanceContracts.ts";
import type {
  SharedMentalModelGovernancePlatformManifest,
  SharedMentalModelGovernanceRecord,
  SharedMentalModelGovernanceRegistryBundle,
  SharedMentalModelGovernanceValidationIssue,
  SharedMentalModelGovernanceValidationReport,
} from "./sharedMentalModelGovernanceTypes.ts";

function issue(code: string, message: string, field?: string): SharedMentalModelGovernanceValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: SharedMentalModelGovernanceValidationIssue[]): SharedMentalModelGovernanceValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateSharedMentalModelGovernanceRecord(
  record: SharedMentalModelGovernanceRecord
): SharedMentalModelGovernanceValidationReport {
  const issues: SharedMentalModelGovernanceValidationIssue[] = [];
  for (const field of SMM_GOVERNANCE_MANDATORY_FIELDS) {
    if (!(field in record)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}`, field));
    }
  }
  if (!record.governanceId.trim()) {
    issues.push(issue("missing_governance_id", "Governance ID is required.", "governanceId"));
  }
  return report(issues);
}

export function validateDuplicateGovernanceIds(
  registry: SharedMentalModelGovernanceRegistryBundle
): SharedMentalModelGovernanceValidationReport {
  const governanceIds = registry.governanceRegistry.map((entry) => entry.governanceId);
  if (governanceIds.length !== new Set(governanceIds).size) {
    return report([issue("duplicate_governance_id", "Duplicate governance IDs detected.")]);
  }
  return report([]);
}

export function validateInvalidOwnerReferences(
  registry: SharedMentalModelGovernanceRegistryBundle
): SharedMentalModelGovernanceValidationReport {
  const issues: SharedMentalModelGovernanceValidationIssue[] = [];
  const ownerRefs = new Set(registry.ownershipRegistry.map((entry) => entry.ownerReferenceId));
  const governanceIds = new Set(registry.governanceRegistry.map((entry) => entry.governanceId));

  for (const governance of registry.governanceRegistry) {
    if (!ownerRefs.has(governance.ownerReferenceId)) {
      issues.push(issue("invalid_owner_reference", `Governance ${governance.governanceId} has invalid owner reference.`));
    }
  }

  for (const ownership of registry.ownershipRegistry) {
    if (!governanceIds.has(ownership.governanceId)) {
      issues.push(issue("invalid_owner_reference", `Ownership ${ownership.ownershipId} references unknown governance.`));
    }
    if (ownership.ownerReferenceId !== registry.governanceRegistry.find((entry) => entry.governanceId === ownership.governanceId)?.ownerReferenceId) {
      issues.push(issue("invalid_owner_reference", `Ownership ${ownership.ownershipId} owner mismatch with governance record.`));
    }
  }
  return report(issues);
}

export function validateInvalidStewardReferences(
  registry: SharedMentalModelGovernanceRegistryBundle
): SharedMentalModelGovernanceValidationReport {
  const issues: SharedMentalModelGovernanceValidationIssue[] = [];
  const stewardRefs = new Set(registry.stewardshipRegistry.map((entry) => entry.stewardReferenceId));
  const governanceIds = new Set(registry.governanceRegistry.map((entry) => entry.governanceId));

  for (const governance of registry.governanceRegistry) {
    if (governance.stewardReferenceId && !stewardRefs.has(governance.stewardReferenceId)) {
      issues.push(issue("invalid_steward_reference", `Governance ${governance.governanceId} has invalid steward reference.`));
    }
  }

  for (const stewardship of registry.stewardshipRegistry) {
    if (!governanceIds.has(stewardship.governanceId)) {
      issues.push(issue("invalid_steward_reference", `Stewardship ${stewardship.stewardshipId} references unknown governance.`));
    }
  }
  return report(issues);
}

export function validateInvalidPolicyReferences(
  registry: SharedMentalModelGovernanceRegistryBundle
): SharedMentalModelGovernanceValidationReport {
  const issues: SharedMentalModelGovernanceValidationIssue[] = [];
  const policyIds = new Set(registry.policyRegistry.map((entry) => entry.policyId));
  const policyKeys = new Set(SMM_GOVERNANCE_POLICY_KEYS);

  for (const governance of registry.governanceRegistry) {
    if (!policyIds.has(governance.governancePolicyReferenceId)) {
      issues.push(issue("invalid_policy_reference", `Governance ${governance.governanceId} has invalid policy reference.`));
    }
  }

  for (const manifest of registry.manifestRegistry) {
    if (!policyKeys.has(manifest.policyKey)) {
      issues.push(issue("invalid_policy_reference", `Manifest ${manifest.manifestId} has invalid policy key.`));
    }
  }

  if (registry.policyCount < SMM_GOVERNANCE_POLICY_KEYS.length) {
    issues.push(issue("invalid_policy_reference", "Policy registry is incomplete."));
  }
  return report(issues);
}

export function validateInvalidAuditReferences(
  registry: SharedMentalModelGovernanceRegistryBundle
): SharedMentalModelGovernanceValidationReport {
  const issues: SharedMentalModelGovernanceValidationIssue[] = [];
  const auditRefs = new Set(registry.auditRegistry.map((entry) => entry.auditReferenceId));
  const governanceIds = new Set(registry.governanceRegistry.map((entry) => entry.governanceId));

  for (const governance of registry.governanceRegistry) {
    if (!auditRefs.has(governance.auditReferenceId)) {
      issues.push(issue("invalid_audit_reference", `Governance ${governance.governanceId} has invalid audit reference.`));
    }
  }

  for (const audit of registry.auditRegistry) {
    if (!governanceIds.has(audit.governanceId)) {
      issues.push(issue("invalid_audit_reference", `Audit ${audit.auditReferenceId} references unknown governance.`));
    }
  }
  return report(issues);
}

export function validateLifecycleConsistency(
  registry: SharedMentalModelGovernanceRegistryBundle
): SharedMentalModelGovernanceValidationReport {
  const issues: SharedMentalModelGovernanceValidationIssue[] = [];
  const lifecycleStatuses = new Set(SMM_GOVERNANCE_LIFECYCLE_STATUS_KEYS);
  const governanceIds = new Set(registry.governanceRegistry.map((entry) => entry.governanceId));

  for (const lifecycle of registry.lifecycleRegistry) {
    if (!governanceIds.has(lifecycle.governanceId)) {
      issues.push(issue("lifecycle_consistency", `Lifecycle ${lifecycle.lifecycleId} references unknown governance.`));
    }
    if (!lifecycleStatuses.has(lifecycle.status)) {
      issues.push(issue("lifecycle_consistency", `Lifecycle ${lifecycle.lifecycleId} has invalid status.`));
    }
  }

  for (const governance of registry.governanceRegistry) {
    const lifecycles = registry.lifecycleRegistry.filter((entry) => entry.governanceId === governance.governanceId);
    if (lifecycles.length === 0 && Object.keys(governance.lifecycleMetadata).length === 0) {
      issues.push(issue("lifecycle_consistency", `Governance ${governance.governanceId} has no lifecycle metadata.`));
    }
  }
  return report(issues);
}

export function validateGovernanceManifestConsistency(
  registry: SharedMentalModelGovernanceRegistryBundle
): SharedMentalModelGovernanceValidationReport {
  const issues: SharedMentalModelGovernanceValidationIssue[] = [];
  const governanceById = new Map(registry.governanceRegistry.map((entry) => [entry.governanceId, entry]));

  for (const manifest of registry.manifestRegistry) {
    const governance = governanceById.get(manifest.governanceId);
    if (!governance) {
      issues.push(issue("manifest_consistency", `Manifest ${manifest.manifestId} references unknown governance.`));
      continue;
    }
    const policyRef = governance.governancePolicyReferenceId;
    const policy = registry.policyRegistry.find((entry) => entry.policyId === policyRef);
    if (policy && policy.policyKey !== manifest.policyKey) {
      issues.push(issue("manifest_consistency", `Manifest ${manifest.manifestId} policy key mismatch.`));
    }
  }
  return report(issues);
}

export function validateGovernanceRegistryCompleteness(
  registry: SharedMentalModelGovernanceRegistryBundle
): SharedMentalModelGovernanceValidationReport {
  const issues: SharedMentalModelGovernanceValidationIssue[] = [];
  if (registry.policyCount < SMM_GOVERNANCE_POLICY_KEYS.length) {
    issues.push(issue("registry_completeness", "Policy registry is incomplete."));
  }
  if (registry.governanceCount === 0) {
    issues.push(issue("empty_registry", "Governance registry has no entries."));
  }
  return report(issues);
}

export function validateSharedMentalModelGovernanceRegistry(
  registry: SharedMentalModelGovernanceRegistryBundle
): SharedMentalModelGovernanceValidationReport {
  const issues: SharedMentalModelGovernanceValidationIssue[] = [];
  for (const validation of [
    validateDuplicateGovernanceIds(registry),
    validateInvalidOwnerReferences(registry),
    validateInvalidStewardReferences(registry),
    validateInvalidPolicyReferences(registry),
    validateInvalidAuditReferences(registry),
    validateLifecycleConsistency(registry),
    validateGovernanceManifestConsistency(registry),
    validateGovernanceRegistryCompleteness(registry),
  ]) {
    issues.push(...validation.issues);
  }
  for (const governance of registry.governanceRegistry) {
    issues.push(...validateSharedMentalModelGovernanceRecord(governance).issues);
  }
  return report(issues);
}

export function validateSharedMentalModelGovernancePlatformManifest(
  manifest: SharedMentalModelGovernancePlatformManifest
): SharedMentalModelGovernanceValidationReport {
  const issues: SharedMentalModelGovernanceValidationIssue[] = [];
  if (manifest.version !== SMM_GOVERNANCE_CONTRACT_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Manifest version must be SMM/7."));
  }
  if (manifest.registryKeys.length !== SMM_GOVERNANCE_REGISTRY_KEYS.length) {
    issues.push(issue("manifest_registry_keys", "Manifest registry keys are incomplete."));
  }
  for (const version of SMM_GOVERNANCE_COMPATIBLE_VERSIONS) {
    if (!(manifest.compatibility as readonly string[]).includes(version)) {
      issues.push(issue("manifest_compatibility", `Manifest missing compatibility for ${version}.`));
    }
  }
  return report(issues);
}

export function getDefaultGovernanceCompatibility(): readonly string[] {
  return Object.freeze([...SMM_GOVERNANCE_COMPATIBLE_VERSIONS, SMM_GOVERNANCE_CONTRACT_VERSION]);
}
