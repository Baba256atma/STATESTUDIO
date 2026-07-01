import { validateIdentity } from "./identityIndex.ts";
import type {
  IdentityRegistrySnapshot,
  IdentityRegistryValidationIssue,
  IdentityRegistryValidationResult,
} from "./identityRegistryContracts.ts";
import { buildIdentityRegistryIndexes } from "./identityRegistryIndexes.ts";
import type { IdentityRegistry, IdentityRegistryMetadataUpdate } from "./identityRegistryTypes.ts";

export function registryIssue(
  code: IdentityRegistryValidationIssue["code"],
  field: string,
  message: string
): IdentityRegistryValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

export function registryValidationResult(
  issues: readonly IdentityRegistryValidationIssue[]
): IdentityRegistryValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze([...issues]),
  });
}

function isValidTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && Number.isFinite(Date.parse(value));
}

function isMetadataObject(value: unknown): value is NonNullable<IdentityRegistryMetadataUpdate["metadata"]> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function validateMetadataUpdate(
  update: IdentityRegistryMetadataUpdate
): IdentityRegistryValidationResult {
  const issues: IdentityRegistryValidationIssue[] = [];

  if (!isValidTimestamp(update.updatedAt)) {
    issues.push(registryIssue("invalid_update", "updatedAt", "Metadata update requires a valid timestamp."));
  }
  if (update.version !== undefined && (!Number.isInteger(update.version) || update.version <= 0)) {
    issues.push(registryIssue("invalid_update", "version", "Metadata update version must be a positive integer."));
  }
  if (update.metadata !== undefined && !isMetadataObject(update.metadata)) {
    issues.push(registryIssue("invalid_update", "metadata", "Metadata update must be an object."));
  }
  if (
    update.tags !== undefined &&
    (!Array.isArray(update.tags) || update.tags.some((tag) => typeof tag !== "string" || tag.trim().length === 0))
  ) {
    issues.push(registryIssue("invalid_update", "tags", "Metadata update tags must be non-empty strings."));
  }

  return registryValidationResult(issues);
}

function serialized(value: unknown): string {
  return JSON.stringify(value);
}

export function validateRegistryConsistency(registry: IdentityRegistry): IdentityRegistryValidationResult {
  const issues: IdentityRegistryValidationIssue[] = [];
  const seenIds = new Set<string>();

  registry.identities.forEach((identity, index) => {
    const identityValidation = validateIdentity(identity);
    if (!identityValidation.valid) {
      issues.push(registryIssue("invalid_identity", `${index}`, "Registry contains an invalid identity."));
    }
    if (seenIds.has(identity.id)) {
      issues.push(registryIssue("duplicate_id", `${index}.id`, `Duplicate identity id: ${identity.id}.`));
    }
    seenIds.add(identity.id);
  });

  const rebuiltIndexes = buildIdentityRegistryIndexes(registry.identities);
  if (serialized(registry.indexes) !== serialized(rebuiltIndexes)) {
    issues.push(registryIssue("index_inconsistent", "indexes", "Registry indexes are not synchronized."));
  }

  return registryValidationResult(issues);
}

export function validateSnapshotIntegrity(snapshot: IdentityRegistrySnapshot): IdentityRegistryValidationResult {
  const registry: IdentityRegistry = Object.freeze({
    contractVersion: snapshot.contractVersion,
    registryId: snapshot.registryId,
    identities: snapshot.identities,
    indexes: snapshot.indexes,
  });
  const registryValidation = validateRegistryConsistency(registry);
  const issues = [...registryValidation.issues];

  if (snapshot.totalIdentities !== snapshot.identities.length) {
    issues.push(registryIssue("snapshot_inconsistent", "totalIdentities", "Snapshot total does not match identities."));
  }
  if (snapshot.statistics.totalIdentities !== snapshot.totalIdentities) {
    issues.push(registryIssue("snapshot_inconsistent", "statistics", "Snapshot statistics do not match total."));
  }

  return registryValidationResult(issues);
}
