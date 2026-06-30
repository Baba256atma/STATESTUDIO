/**
 * SMM-4 — Snapshot & Version Platform metadata validation.
 */

import {
  SMM_SNAPSHOT_COMPATIBLE_VERSIONS,
  SMM_SNAPSHOT_CONTRACT_VERSION,
  SMM_SNAPSHOT_MANDATORY_FIELDS,
  SMM_SNAPSHOT_REGISTRY_KEYS,
  SMM_VERSION_MANDATORY_FIELDS,
} from "./sharedMentalModelSnapshotContracts.ts";
import type {
  SharedMentalModelSnapshotPlatformManifest,
  SharedMentalModelSnapshotPlatformRecord,
  SharedMentalModelSnapshotRegistryBundle,
  SharedMentalModelSnapshotValidationIssue,
  SharedMentalModelSnapshotValidationReport,
  SharedMentalModelVersionPlatformRecord,
} from "./sharedMentalModelSnapshotTypes.ts";

function issue(code: string, message: string, field?: string): SharedMentalModelSnapshotValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: SharedMentalModelSnapshotValidationIssue[]): SharedMentalModelSnapshotValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateSharedMentalModelSnapshotRecord(
  record: SharedMentalModelSnapshotPlatformRecord
): SharedMentalModelSnapshotValidationReport {
  const issues: SharedMentalModelSnapshotValidationIssue[] = [];
  for (const field of SMM_SNAPSHOT_MANDATORY_FIELDS) {
    if (!(field in record)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}`, field));
    }
  }
  if (!record.snapshotId.trim()) {
    issues.push(issue("missing_snapshot_id", "Snapshot ID is required.", "snapshotId"));
  }
  if (!record.versionId.trim()) {
    issues.push(issue("missing_version_id", "Version ID is required.", "versionId"));
  }
  return report(issues);
}

export function validateSharedMentalModelVersionPlatformRecord(
  record: SharedMentalModelVersionPlatformRecord
): SharedMentalModelSnapshotValidationReport {
  const issues: SharedMentalModelSnapshotValidationIssue[] = [];
  for (const field of SMM_VERSION_MANDATORY_FIELDS) {
    if (!(field in record)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}`, field));
    }
  }
  if (!record.versionId.trim()) {
    issues.push(issue("missing_version_id", "Version ID is required.", "versionId"));
  }
  return report(issues);
}

export function validateDuplicateSnapshots(
  registry: SharedMentalModelSnapshotRegistryBundle
): SharedMentalModelSnapshotValidationReport {
  const snapshotIds = registry.snapshotRegistry.map((entry) => entry.snapshotId);
  if (snapshotIds.length !== new Set(snapshotIds).size) {
    return report([issue("duplicate_snapshot", "Duplicate snapshot identities detected.")]);
  }
  const versionIds = registry.versionRegistry.map((entry) => entry.versionId);
  if (versionIds.length !== new Set(versionIds).size) {
    return report([issue("duplicate_version", "Duplicate version identities detected.")]);
  }
  return report([]);
}

export function validateBrokenLineage(
  registry: SharedMentalModelSnapshotRegistryBundle
): SharedMentalModelSnapshotValidationReport {
  const issues: SharedMentalModelSnapshotValidationIssue[] = [];
  const snapshotIds = new Set(registry.snapshotRegistry.map((entry) => entry.snapshotId));
  const versionIds = new Set(registry.versionRegistry.map((entry) => entry.versionId));

  for (const lineage of registry.lineageRegistry) {
    if (!snapshotIds.has(lineage.snapshotId)) {
      issues.push(issue("broken_lineage", `Lineage ${lineage.lineageId} references unknown snapshot.`));
    }
    if (!versionIds.has(lineage.versionId)) {
      issues.push(issue("broken_lineage", `Lineage ${lineage.lineageId} references unknown version.`));
    }
    if (lineage.parentSnapshotId && !snapshotIds.has(lineage.parentSnapshotId)) {
      issues.push(issue("broken_lineage", `Lineage ${lineage.lineageId} has broken parent snapshot.`));
    }
    if (lineage.parentVersionId && !versionIds.has(lineage.parentVersionId)) {
      issues.push(issue("broken_lineage", `Lineage ${lineage.lineageId} has broken parent version.`));
    }
  }
  return report(issues);
}

export function validateInvalidParentReferences(
  registry: SharedMentalModelSnapshotRegistryBundle
): SharedMentalModelSnapshotValidationReport {
  const issues: SharedMentalModelSnapshotValidationIssue[] = [];
  const snapshotIds = new Set(registry.snapshotRegistry.map((entry) => entry.snapshotId));

  for (const snapshot of registry.snapshotRegistry) {
    if (snapshot.parentSnapshotId && !snapshotIds.has(snapshot.parentSnapshotId)) {
      issues.push(issue("invalid_parent_reference", `Snapshot ${snapshot.snapshotId} has invalid parent snapshot.`));
    }
    if (snapshot.parentSnapshotId === snapshot.snapshotId) {
      issues.push(issue("self_parent_reference", `Snapshot ${snapshot.snapshotId} cannot be its own parent.`));
    }
  }

  for (const version of registry.versionRegistry) {
    if (version.previousVersionId && !registry.versionRegistry.some((entry) => entry.versionId === version.previousVersionId)) {
      issues.push(issue("invalid_parent_reference", `Version ${version.versionId} has invalid previous version.`));
    }
    if (version.previousVersionId === version.versionId) {
      issues.push(issue("self_parent_reference", `Version ${version.versionId} cannot reference itself.`));
    }
  }
  return report(issues);
}

export function validateInvalidBranchReferences(
  registry: SharedMentalModelSnapshotRegistryBundle
): SharedMentalModelSnapshotValidationReport {
  const issues: SharedMentalModelSnapshotValidationIssue[] = [];
  const branchIds = new Set(registry.branchRegistry.map((entry) => entry.branchId));

  for (const snapshot of registry.snapshotRegistry) {
    if (!branchIds.has(snapshot.branchReferenceId)) {
      issues.push(issue("invalid_branch_reference", `Snapshot ${snapshot.snapshotId} references unknown branch.`));
    }
  }

  for (const branch of registry.branchRegistry) {
    if (branch.parentBranchId && !branchIds.has(branch.parentBranchId)) {
      issues.push(issue("invalid_branch_reference", `Branch ${branch.branchId} has invalid parent branch.`));
    }
    if (branch.parentBranchId === branch.branchId) {
      issues.push(issue("self_branch_reference", `Branch ${branch.branchId} cannot be its own parent.`));
    }
  }

  for (const lineage of registry.lineageRegistry) {
    if (!branchIds.has(lineage.branchReferenceId)) {
      issues.push(issue("invalid_branch_reference", `Lineage ${lineage.lineageId} references unknown branch.`));
    }
  }
  return report(issues);
}

export function validateVersionContinuity(
  registry: SharedMentalModelSnapshotRegistryBundle
): SharedMentalModelSnapshotValidationReport {
  const issues: SharedMentalModelSnapshotValidationIssue[] = [];
  const versionById = new Map(registry.versionRegistry.map((entry) => [entry.versionId, entry]));

  for (const version of registry.versionRegistry) {
    if (version.nextVersionId) {
      const next = versionById.get(version.nextVersionId);
      if (!next) {
        issues.push(issue("version_continuity", `Version ${version.versionId} references unknown next version.`));
      } else if (next.previousVersionId !== version.versionId) {
        issues.push(issue("version_continuity", `Version chain broken between ${version.versionId} and ${version.nextVersionId}.`));
      }
    }
    if (version.previousVersionId) {
      const previous = versionById.get(version.previousVersionId);
      if (!previous) {
        issues.push(issue("version_continuity", `Version ${version.versionId} references unknown previous version.`));
      } else if (previous.nextVersionId !== null && previous.nextVersionId !== version.versionId) {
        issues.push(issue("version_continuity", `Previous version ${version.previousVersionId} does not link forward to ${version.versionId}.`));
      }
    }
  }
  return report(issues);
}

export function validateManifestConsistency(
  registry: SharedMentalModelSnapshotRegistryBundle
): SharedMentalModelSnapshotValidationReport {
  const issues: SharedMentalModelSnapshotValidationIssue[] = [];
  const snapshotIds = new Set(registry.snapshotRegistry.map((entry) => entry.snapshotId));

  for (const manifest of registry.manifestRegistry) {
    if (!snapshotIds.has(manifest.snapshotId)) {
      issues.push(issue("manifest_consistency", `Manifest ${manifest.manifestId} references unknown snapshot.`));
    }
    const snapshot = registry.snapshotRegistry.find((entry) => entry.snapshotId === manifest.snapshotId);
    if (snapshot && snapshot.versionId !== manifest.versionId) {
      issues.push(issue("manifest_consistency", `Manifest ${manifest.manifestId} version mismatch with snapshot.`));
    }
    if (snapshot && snapshot.modelId !== manifest.modelId) {
      issues.push(issue("manifest_consistency", `Manifest ${manifest.manifestId} model mismatch with snapshot.`));
    }
  }
  return report(issues);
}

export function validateSnapshotRegistryCompleteness(
  registry: SharedMentalModelSnapshotRegistryBundle
): SharedMentalModelSnapshotValidationReport {
  if (registry.snapshotCount === 0 && registry.versionCount === 0) {
    return report([issue("empty_registry", "Snapshot platform registry has no entries.")]);
  }
  return report([]);
}

export function validateSharedMentalModelSnapshotRegistry(
  registry: SharedMentalModelSnapshotRegistryBundle
): SharedMentalModelSnapshotValidationReport {
  const issues: SharedMentalModelSnapshotValidationIssue[] = [];
  for (const validation of [
    validateDuplicateSnapshots(registry),
    validateBrokenLineage(registry),
    validateInvalidParentReferences(registry),
    validateInvalidBranchReferences(registry),
    validateVersionContinuity(registry),
    validateManifestConsistency(registry),
    validateSnapshotRegistryCompleteness(registry),
  ]) {
    issues.push(...validation.issues);
  }
  for (const snapshot of registry.snapshotRegistry) {
    issues.push(...validateSharedMentalModelSnapshotRecord(snapshot).issues);
  }
  for (const version of registry.versionRegistry) {
    issues.push(...validateSharedMentalModelVersionPlatformRecord(version).issues);
  }
  return report(issues);
}

export function validateSharedMentalModelSnapshotPlatformManifest(
  manifest: SharedMentalModelSnapshotPlatformManifest
): SharedMentalModelSnapshotValidationReport {
  const issues: SharedMentalModelSnapshotValidationIssue[] = [];
  if (manifest.version !== SMM_SNAPSHOT_CONTRACT_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Manifest version must be SMM/4."));
  }
  if (manifest.registryKeys.length !== SMM_SNAPSHOT_REGISTRY_KEYS.length) {
    issues.push(issue("manifest_registry_keys", "Manifest registry keys are incomplete."));
  }
  for (const version of SMM_SNAPSHOT_COMPATIBLE_VERSIONS) {
    if (!(manifest.compatibility as readonly string[]).includes(version)) {
      issues.push(issue("manifest_compatibility", `Manifest missing compatibility for ${version}.`));
    }
  }
  return report(issues);
}

export function getDefaultSnapshotCompatibility(): readonly string[] {
  return Object.freeze([...SMM_SNAPSHOT_COMPATIBLE_VERSIONS, SMM_SNAPSHOT_CONTRACT_VERSION]);
}
