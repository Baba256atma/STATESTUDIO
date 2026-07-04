import { listDomains, validateDomainRegistry } from "./domainFoundationIndex.ts";
import type { DomainRegistry } from "./domainFoundationIndex.ts";
import { sortDomains } from "./domainRegistryQuery.ts";
import {
  DOMAIN_REGISTRY_QUERY_CONTRACT_VERSION,
  type DomainRegistrySnapshot,
  type DomainRegistrySnapshotComparison,
  type DomainRegistrySnapshotMetadata,
  type DomainRegistrySnapshotValidationResult,
  type DomainSnapshotEntry,
} from "./domainRegistryQueryTypes.ts";

function buildSnapshotEntry(domain: DomainRegistry["domains"][number]): DomainSnapshotEntry {
  const manifest = domain.package.manifest;
  return Object.freeze({
    domainId: manifest.domainId,
    name: manifest.name,
    category: manifest.metadata.category,
    status: manifest.status,
    registrationOrder: domain.registrationOrder,
    versionMajor: manifest.version.major,
    versionMinor: manifest.version.minor,
    versionPatch: manifest.version.patch,
    capabilityIds: Object.freeze([...manifest.capabilities.map((capability) => capability.id)].sort()),
    dependencyIds: Object.freeze([...manifest.dependencies.map((dependency) => dependency.domainId)].sort()),
  });
}

function buildSnapshotFingerprint(entries: readonly DomainSnapshotEntry[]): string {
  return entries
    .map(
      (entry) =>
        `${entry.domainId}|${entry.name}|${entry.category}|${entry.status}|${entry.registrationOrder}|${entry.versionMajor}.${entry.versionMinor}.${entry.versionPatch}|${entry.capabilityIds.join(",")}|${entry.dependencyIds.join(",")}`
    )
    .join(";;");
}

function buildSnapshotMetadata(registry: DomainRegistry, domainCount: number): DomainRegistrySnapshotMetadata {
  return Object.freeze({
    contractVersion: DOMAIN_REGISTRY_QUERY_CONTRACT_VERSION,
    registryId: registry.registryId,
    frozen: registry.frozen,
    domainCount,
    snapshotSequence: 1,
    deterministic: true,
  });
}

export function buildDomainRegistrySnapshot(registry: DomainRegistry): DomainRegistrySnapshot {
  const domains = sortDomains(listDomains(registry), "registrationOrder", "asc");
  const entries = Object.freeze(domains.map((domain) => buildSnapshotEntry(domain)));
  const metadata = buildSnapshotMetadata(registry, entries.length);

  return Object.freeze({
    metadata,
    entries,
    fingerprint: buildSnapshotFingerprint(entries),
  });
}

export function validateDomainRegistrySnapshot(snapshot: DomainRegistrySnapshot): DomainRegistrySnapshotValidationResult {
  const issues: string[] = [];

  if (snapshot.metadata.contractVersion !== DOMAIN_REGISTRY_QUERY_CONTRACT_VERSION) {
    issues.push("Snapshot contract version must be DOM-1:2.");
  }

  if (snapshot.metadata.deterministic !== true) {
    issues.push("Snapshot metadata must be deterministic.");
  }

  if (snapshot.metadata.domainCount !== snapshot.entries.length) {
    issues.push("Snapshot domain count must match entry count.");
  }

  const domainIds = snapshot.entries.map((entry) => entry.domainId);
  if (new Set(domainIds).size !== domainIds.length) {
    issues.push("Snapshot entries must have unique domain ids.");
  }

  const orders = snapshot.entries.map((entry) => entry.registrationOrder);
  for (let index = 1; index < orders.length; index += 1) {
    if (orders[index] < orders[index - 1]) {
      issues.push("Snapshot entries must be sorted by registration order.");
      break;
    }
  }

  const expectedFingerprint = buildSnapshotFingerprint(snapshot.entries);
  if (snapshot.fingerprint !== expectedFingerprint) {
    issues.push("Snapshot fingerprint does not match entry content.");
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

function entriesEqual(left: readonly DomainSnapshotEntry[], right: readonly DomainSnapshotEntry[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    const leftEntry = left[index];
    const rightEntry = right[index];

    if (
      leftEntry.domainId !== rightEntry.domainId ||
      leftEntry.name !== rightEntry.name ||
      leftEntry.category !== rightEntry.category ||
      leftEntry.status !== rightEntry.status ||
      leftEntry.registrationOrder !== rightEntry.registrationOrder ||
      leftEntry.versionMajor !== rightEntry.versionMajor ||
      leftEntry.versionMinor !== rightEntry.versionMinor ||
      leftEntry.versionPatch !== rightEntry.versionPatch ||
      leftEntry.capabilityIds.join(",") !== rightEntry.capabilityIds.join(",") ||
      leftEntry.dependencyIds.join(",") !== rightEntry.dependencyIds.join(",")
    ) {
      return false;
    }
  }

  return true;
}

function metadataEqual(left: DomainRegistrySnapshotMetadata, right: DomainRegistrySnapshotMetadata): boolean {
  return (
    left.contractVersion === right.contractVersion &&
    left.registryId === right.registryId &&
    left.frozen === right.frozen &&
    left.domainCount === right.domainCount &&
    left.snapshotSequence === right.snapshotSequence &&
    left.deterministic === right.deterministic
  );
}

export function compareDomainRegistrySnapshots(
  left: DomainRegistrySnapshot,
  right: DomainRegistrySnapshot
): DomainRegistrySnapshotComparison {
  const entriesMatch = entriesEqual(left.entries, right.entries);
  const metadataMatch = metadataEqual(left.metadata, right.metadata);
  const fingerprintMatch = left.fingerprint === right.fingerprint;

  return Object.freeze({
    equal: entriesMatch && metadataMatch && fingerprintMatch,
    metadataEqual: metadataMatch,
    entriesEqual: entriesMatch,
    fingerprintEqual: fingerprintMatch,
  });
}

export function validateSnapshotAgainstRegistry(
  registry: DomainRegistry,
  snapshot: DomainRegistrySnapshot
): DomainRegistrySnapshotValidationResult {
  const snapshotValidation = validateDomainRegistrySnapshot(snapshot);
  if (!snapshotValidation.valid) {
    return snapshotValidation;
  }

  const registryValidation = validateDomainRegistry(registry);
  if (!registryValidation.valid) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze(["Registry state is invalid for snapshot comparison."]),
    });
  }

  const expected = buildDomainRegistrySnapshot(registry);
  const comparison = compareDomainRegistrySnapshots(expected, snapshot);
  if (!comparison.equal) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze(["Snapshot does not match current registry state."]),
    });
  }

  return Object.freeze({
    valid: true,
    issues: Object.freeze([]),
  });
}
