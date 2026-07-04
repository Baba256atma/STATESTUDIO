import {
  DOMAIN_REGULATION_CONTRACT_VERSION,
  domainRegulationValidationResult,
  type DomainRegulationPackage,
  type DomainRegulationRegistry,
  type DomainRegulationValidationResult,
  type RegisteredDomainRegulationPackage,
} from "./domainRegulationIndex.ts";
import type {
  DomainRegulationDiff,
  DomainRegulationDiffEntry,
  DomainRegulationSnapshot,
  DomainRegulationSnapshotEntry,
} from "./domainRegulationQueryTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function versionKey(regulationPackage: DomainRegulationPackage): string {
  const version = regulationPackage.version;
  return [version.major, version.minor, version.patch, version.label ?? ""].join(".");
}

function packageFingerprint(entry: RegisteredDomainRegulationPackage): string {
  const regulations = entry.package.regulations
    .map((regulation) =>
      [
        regulation.regulationId,
        regulation.label,
        regulation.description,
        regulation.reference?.domainId ?? "",
        regulation.reference?.vocabularyId ?? "",
        regulation.reference?.termId ?? "",
        regulation.reference?.ontologyId ?? "",
        regulation.reference?.entityTypeId ?? "",
        regulation.reference?.relationshipTypeId ?? "",
        regulation.reference?.attributeId ?? "",
        regulation.reference?.kpiPackageId ?? "",
        regulation.reference?.kpiId ?? "",
        regulation.scope,
        regulation.jurisdictionScope,
        regulation.status,
      ].join(":")
    )
    .sort()
    .join(",");
  const obligations = entry.package.obligations
    .map((obligation) =>
      [
        obligation.obligationId,
        obligation.regulationId,
        obligation.label,
        obligation.description,
        [...obligation.controlIds].sort().join(","),
        obligation.scope,
        obligation.status,
      ].join(":")
    )
    .sort()
    .join(",");
  const controls = entry.package.controls
    .map((control) =>
      [
        control.controlId,
        control.label,
        control.description,
        [...control.evidenceIds].sort().join(","),
        control.scope,
        control.status,
      ].join(":")
    )
    .sort()
    .join(",");
  const evidence = entry.package.evidence
    .map((item) =>
      [item.evidenceId, item.label, item.description, item.sourceDescription, item.scope, item.status].join(":")
    )
    .sort()
    .join(",");

  return stableHash(
    [
      entry.package.contractVersion,
      entry.package.regulationPackageId,
      entry.package.domainId,
      entry.package.name,
      entry.package.description,
      versionKey(entry.package),
      entry.package.scope,
      entry.package.jurisdictionScope,
      entry.package.status,
      entry.registrationOrder,
      regulations,
      obligations,
      controls,
      evidence,
    ].join("||")
  );
}

function snapshotEntry(entry: RegisteredDomainRegulationPackage): DomainRegulationSnapshotEntry {
  return Object.freeze({
    regulationPackageId: entry.package.regulationPackageId,
    domainId: entry.package.domainId,
    registrationOrder: entry.registrationOrder,
    scope: entry.package.scope,
    status: entry.package.status,
    jurisdictionScope: entry.package.jurisdictionScope,
    regulationIds: Object.freeze(entry.package.regulations.map((regulation) => regulation.regulationId).sort()),
    obligationIds: Object.freeze(entry.package.obligations.map((obligation) => obligation.obligationId).sort()),
    controlIds: Object.freeze(entry.package.controls.map((control) => control.controlId).sort()),
    evidenceIds: Object.freeze(entry.package.evidence.map((evidence) => evidence.evidenceId).sort()),
    fingerprint: packageFingerprint(entry),
  });
}

function snapshotFingerprint(entries: readonly DomainRegulationSnapshotEntry[]): string {
  return stableHash(
    entries
      .map((entry) =>
        [
          entry.regulationPackageId,
          entry.domainId,
          entry.registrationOrder,
          entry.scope,
          entry.status,
          entry.jurisdictionScope,
          entry.regulationIds.join(","),
          entry.obligationIds.join(","),
          entry.controlIds.join(","),
          entry.evidenceIds.join(","),
          entry.fingerprint,
        ].join("|")
      )
      .join("||")
  );
}

export function buildDomainRegulationSnapshot(registry: DomainRegulationRegistry): DomainRegulationSnapshot {
  const entries = Object.freeze(
    registry.packages
      .map(snapshotEntry)
      .sort((left, right) => left.regulationPackageId.localeCompare(right.regulationPackageId))
  );
  return Object.freeze({
    contractVersion: registry.contractVersion,
    registryId: registry.registryId,
    frozen: registry.frozen,
    packageCount: entries.length,
    entries,
    fingerprint: snapshotFingerprint(entries),
  });
}

export function validateDomainRegulationSnapshot(
  snapshot: DomainRegulationSnapshot
): DomainRegulationValidationResult {
  const issues = [];
  if (snapshot.contractVersion !== DOMAIN_REGULATION_CONTRACT_VERSION) {
    issues.push(
      Object.freeze({
        code: "invalid_snapshot_contract_version",
        field: "contractVersion",
        message: "Snapshot contract version must match DOM-5:1 regulation contract.",
        severity: "error" as const,
      })
    );
  }
  if (snapshot.packageCount !== snapshot.entries.length) {
    issues.push(
      Object.freeze({
        code: "invalid_snapshot_package_count",
        field: "packageCount",
        message: "Snapshot package count must match entry count.",
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
  return domainRegulationValidationResult(issues);
}

export function compareDomainRegulationSnapshots(
  left: DomainRegulationSnapshot,
  right: DomainRegulationSnapshot
): boolean {
  return left.fingerprint === right.fingerprint;
}

export function diffDomainRegulationSnapshots(
  left: DomainRegulationSnapshot,
  right: DomainRegulationSnapshot
): DomainRegulationDiff {
  const leftById = new Map(left.entries.map((entry) => [entry.regulationPackageId, entry]));
  const rightById = new Map(right.entries.map((entry) => [entry.regulationPackageId, entry]));
  const regulationPackageIds = [...new Set([...leftById.keys(), ...rightById.keys()])].sort((a, b) =>
    a.localeCompare(b)
  );
  const entries: DomainRegulationDiffEntry[] = [];

  for (const regulationPackageId of regulationPackageIds) {
    const leftEntry = leftById.get(regulationPackageId) ?? null;
    const rightEntry = rightById.get(regulationPackageId) ?? null;
    if (!leftEntry && rightEntry) {
      entries.push(Object.freeze({ type: "added", regulationPackageId, left: null, right: rightEntry }));
    } else if (leftEntry && !rightEntry) {
      entries.push(Object.freeze({ type: "removed", regulationPackageId, left: leftEntry, right: null }));
    } else if (leftEntry && rightEntry && leftEntry.fingerprint !== rightEntry.fingerprint) {
      entries.push(Object.freeze({ type: "modified", regulationPackageId, left: leftEntry, right: rightEntry }));
    }
  }

  return Object.freeze({
    equal: entries.length === 0,
    leftFingerprint: left.fingerprint,
    rightFingerprint: right.fingerprint,
    entries: Object.freeze(entries),
  });
}
