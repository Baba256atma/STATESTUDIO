import {
  DOMAIN_ONTOLOGY_CONTRACT_VERSION,
  domainOntologyValidationResult,
  type DomainOntologyPackage,
  type DomainOntologyRegistry,
  type DomainOntologyValidationResult,
  type RegisteredDomainOntology,
} from "./domainOntologyIndex.ts";
import type {
  DomainOntologyDiff,
  DomainOntologyDiffEntry,
  DomainOntologySnapshot,
  DomainOntologySnapshotEntry,
} from "./domainOntologyQueryTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function versionKey(ontologyPackage: DomainOntologyPackage): string {
  const version = ontologyPackage.version;
  return [version.major, version.minor, version.patch, version.label ?? ""].join(".");
}

function packageFingerprint(entry: RegisteredDomainOntology): string {
  const ontologyPackage = entry.package;
  const entityTypes = ontologyPackage.entityTypes
    .map((entity) => [entity.entityTypeId, entity.label, entity.description, entity.scope, entity.status].join(":"))
    .sort()
    .join(",");
  const relationshipTypes = ontologyPackage.relationshipTypes
    .map((relationship) =>
      [
        relationship.relationshipTypeId,
        relationship.sourceEntityTypeId,
        relationship.targetEntityTypeId,
        relationship.label,
        relationship.description,
        relationship.scope,
        relationship.status,
      ].join(":")
    )
    .sort()
    .join(",");
  const attributes = ontologyPackage.attributes
    .map((attribute) =>
      [
        attribute.attributeId,
        attribute.ownerEntityTypeId,
        attribute.label,
        attribute.description,
        attribute.valueType,
        attribute.required,
        attribute.scope,
        attribute.status,
      ].join(":")
    )
    .sort()
    .join(",");
  const constraints = ontologyPackage.constraints
    .map((constraint) =>
      [
        constraint.constraintId,
        constraint.targetType,
        constraint.targetId,
        constraint.label,
        constraint.description,
        constraint.severity,
        constraint.scope,
        constraint.status,
      ].join(":")
    )
    .sort()
    .join(",");

  return stableHash(
    [
      ontologyPackage.contractVersion,
      ontologyPackage.ontologyId,
      ontologyPackage.domainId,
      ontologyPackage.vocabularyId ?? "",
      ontologyPackage.name,
      ontologyPackage.description,
      versionKey(ontologyPackage),
      ontologyPackage.scope,
      ontologyPackage.status,
      entry.registrationOrder,
      entityTypes,
      relationshipTypes,
      attributes,
      constraints,
    ].join("||")
  );
}

function snapshotEntry(entry: RegisteredDomainOntology): DomainOntologySnapshotEntry {
  return Object.freeze({
    ontologyId: entry.package.ontologyId,
    domainId: entry.package.domainId,
    registrationOrder: entry.registrationOrder,
    scope: entry.package.scope,
    status: entry.package.status,
    entityTypeIds: Object.freeze(entry.package.entityTypes.map((item) => item.entityTypeId).sort()),
    relationshipTypeIds: Object.freeze(entry.package.relationshipTypes.map((item) => item.relationshipTypeId).sort()),
    attributeIds: Object.freeze(entry.package.attributes.map((item) => item.attributeId).sort()),
    constraintIds: Object.freeze(entry.package.constraints.map((item) => item.constraintId).sort()),
    fingerprint: packageFingerprint(entry),
  });
}

function snapshotFingerprint(entries: readonly DomainOntologySnapshotEntry[]): string {
  return stableHash(
    entries
      .map((entry) =>
        [
          entry.ontologyId,
          entry.domainId,
          entry.registrationOrder,
          entry.scope,
          entry.status,
          entry.entityTypeIds.join(","),
          entry.relationshipTypeIds.join(","),
          entry.attributeIds.join(","),
          entry.constraintIds.join(","),
          entry.fingerprint,
        ].join("|")
      )
      .join("||")
  );
}

export function buildDomainOntologySnapshot(registry: DomainOntologyRegistry): DomainOntologySnapshot {
  const entries = Object.freeze(
    registry.ontologies
      .map(snapshotEntry)
      .sort((left, right) => left.ontologyId.localeCompare(right.ontologyId))
  );
  return Object.freeze({
    contractVersion: registry.contractVersion,
    registryId: registry.registryId,
    frozen: registry.frozen,
    ontologyCount: entries.length,
    entries,
    fingerprint: snapshotFingerprint(entries),
  });
}

export function validateDomainOntologySnapshot(snapshot: DomainOntologySnapshot): DomainOntologyValidationResult {
  const issues = [];
  if (snapshot.contractVersion !== DOMAIN_ONTOLOGY_CONTRACT_VERSION) {
    issues.push(
      Object.freeze({
        code: "invalid_snapshot_contract_version",
        field: "contractVersion",
        message: "Snapshot contract version must match DOM-3:1 ontology contract.",
        severity: "error" as const,
      })
    );
  }
  if (snapshot.ontologyCount !== snapshot.entries.length) {
    issues.push(
      Object.freeze({
        code: "invalid_snapshot_ontology_count",
        field: "ontologyCount",
        message: "Snapshot ontology count must match entry count.",
        severity: "error" as const,
      })
    );
  }
  if (snapshot.fingerprint !== snapshotFingerprint(snapshot.entries)) {
    issues.push(
      Object.freeze({
        code: "invalid_snapshot_fingerprint",
        field: "fingerprint",
        message: "Snapshot fingerprint must match deterministic entry fingerprint.",
        severity: "error" as const,
      })
    );
  }
  return domainOntologyValidationResult(issues);
}

export function compareDomainOntologySnapshots(
  left: DomainOntologySnapshot,
  right: DomainOntologySnapshot
): boolean {
  return left.fingerprint === right.fingerprint;
}

export function diffDomainOntologySnapshots(
  left: DomainOntologySnapshot,
  right: DomainOntologySnapshot
): DomainOntologyDiff {
  const leftById = new Map(left.entries.map((entry) => [entry.ontologyId, entry]));
  const rightById = new Map(right.entries.map((entry) => [entry.ontologyId, entry]));
  const ontologyIds = [...new Set([...leftById.keys(), ...rightById.keys()])].sort((a, b) =>
    a.localeCompare(b)
  );
  const entries: DomainOntologyDiffEntry[] = [];

  for (const ontologyId of ontologyIds) {
    const leftEntry = leftById.get(ontologyId) ?? null;
    const rightEntry = rightById.get(ontologyId) ?? null;
    if (!leftEntry && rightEntry) {
      entries.push(Object.freeze({ type: "added", ontologyId, left: null, right: rightEntry }));
    } else if (leftEntry && !rightEntry) {
      entries.push(Object.freeze({ type: "removed", ontologyId, left: leftEntry, right: null }));
    } else if (leftEntry && rightEntry && leftEntry.fingerprint !== rightEntry.fingerprint) {
      entries.push(Object.freeze({ type: "modified", ontologyId, left: leftEntry, right: rightEntry }));
    }
  }

  return Object.freeze({
    equal: entries.length === 0,
    leftFingerprint: left.fingerprint,
    rightFingerprint: right.fingerprint,
    entries: Object.freeze(entries),
  });
}
