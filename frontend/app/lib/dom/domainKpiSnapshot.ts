import {
  DOMAIN_KPI_CONTRACT_VERSION,
  domainKpiValidationResult,
  type DomainKpiPackage,
  type DomainKpiRegistry,
  type DomainKpiValidationResult,
  type RegisteredDomainKpiPackage,
} from "./domainKpiIndex.ts";
import type {
  DomainKpiDiff,
  DomainKpiDiffEntry,
  DomainKpiSnapshot,
  DomainKpiSnapshotEntry,
} from "./domainKpiQueryTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function versionKey(kpiPackage: DomainKpiPackage): string {
  const version = kpiPackage.version;
  return [version.major, version.minor, version.patch, version.label ?? ""].join(".");
}

function packageFingerprint(entry: RegisteredDomainKpiPackage): string {
  const kpis = entry.package.kpis
    .map((kpi) =>
      [
        kpi.kpiId,
        kpi.label,
        kpi.description,
        kpi.intent.label,
        kpi.intent.description,
        kpi.intent.direction,
        kpi.unit.unitType,
        kpi.unit.unitLabel,
        kpi.unit.precision,
        kpi.aggregation.aggregationType,
        kpi.aggregation.window,
        kpi.aggregation.description,
        kpi.reference?.vocabularyId ?? "",
        kpi.reference?.ontologyId ?? "",
        kpi.reference?.entityTypeId ?? "",
        kpi.reference?.attributeId ?? "",
        kpi.scope,
        kpi.status,
      ].join(":")
    )
    .sort()
    .join(",");

  return stableHash(
    [
      entry.package.contractVersion,
      entry.package.kpiPackageId,
      entry.package.domainId,
      entry.package.name,
      entry.package.description,
      versionKey(entry.package),
      entry.package.scope,
      entry.package.status,
      entry.registrationOrder,
      kpis,
    ].join("||")
  );
}

function snapshotEntry(entry: RegisteredDomainKpiPackage): DomainKpiSnapshotEntry {
  return Object.freeze({
    kpiPackageId: entry.package.kpiPackageId,
    domainId: entry.package.domainId,
    registrationOrder: entry.registrationOrder,
    scope: entry.package.scope,
    status: entry.package.status,
    kpiIds: Object.freeze(entry.package.kpis.map((kpi) => kpi.kpiId).sort()),
    fingerprint: packageFingerprint(entry),
  });
}

function snapshotFingerprint(entries: readonly DomainKpiSnapshotEntry[]): string {
  return stableHash(
    entries
      .map((entry) =>
        [
          entry.kpiPackageId,
          entry.domainId,
          entry.registrationOrder,
          entry.scope,
          entry.status,
          entry.kpiIds.join(","),
          entry.fingerprint,
        ].join("|")
      )
      .join("||")
  );
}

export function buildDomainKpiSnapshot(registry: DomainKpiRegistry): DomainKpiSnapshot {
  const entries = Object.freeze(
    registry.packages
      .map(snapshotEntry)
      .sort((left, right) => left.kpiPackageId.localeCompare(right.kpiPackageId))
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

export function validateDomainKpiSnapshot(snapshot: DomainKpiSnapshot): DomainKpiValidationResult {
  const issues = [];
  if (snapshot.contractVersion !== DOMAIN_KPI_CONTRACT_VERSION) {
    issues.push(
      Object.freeze({
        code: "invalid_snapshot_contract_version",
        field: "contractVersion",
        message: "Snapshot contract version must match DOM-4:1 KPI contract.",
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
  return domainKpiValidationResult(issues);
}

export function compareDomainKpiSnapshots(left: DomainKpiSnapshot, right: DomainKpiSnapshot): boolean {
  return left.fingerprint === right.fingerprint;
}

export function diffDomainKpiSnapshots(left: DomainKpiSnapshot, right: DomainKpiSnapshot): DomainKpiDiff {
  const leftById = new Map(left.entries.map((entry) => [entry.kpiPackageId, entry]));
  const rightById = new Map(right.entries.map((entry) => [entry.kpiPackageId, entry]));
  const kpiPackageIds = [...new Set([...leftById.keys(), ...rightById.keys()])].sort((a, b) =>
    a.localeCompare(b)
  );
  const entries: DomainKpiDiffEntry[] = [];

  for (const kpiPackageId of kpiPackageIds) {
    const leftEntry = leftById.get(kpiPackageId) ?? null;
    const rightEntry = rightById.get(kpiPackageId) ?? null;
    if (!leftEntry && rightEntry) {
      entries.push(Object.freeze({ type: "added", kpiPackageId, left: null, right: rightEntry }));
    } else if (leftEntry && !rightEntry) {
      entries.push(Object.freeze({ type: "removed", kpiPackageId, left: leftEntry, right: null }));
    } else if (leftEntry && rightEntry && leftEntry.fingerprint !== rightEntry.fingerprint) {
      entries.push(Object.freeze({ type: "modified", kpiPackageId, left: leftEntry, right: rightEntry }));
    }
  }

  return Object.freeze({
    equal: entries.length === 0,
    leftFingerprint: left.fingerprint,
    rightFingerprint: right.fingerprint,
    entries: Object.freeze(entries),
  });
}
