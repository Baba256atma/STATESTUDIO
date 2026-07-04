import {
  DOMAIN_REASONING_CONTRACT_VERSION,
  domainReasoningValidationResult,
  type DomainReasoningPackage,
  type DomainReasoningRegistry,
  type DomainReasoningValidationResult,
  type RegisteredDomainReasoningPackage,
} from "./domainReasoningIndex.ts";
import type {
  DomainReasoningDiff,
  DomainReasoningDiffEntry,
  DomainReasoningSnapshot,
  DomainReasoningSnapshotEntry,
} from "./domainReasoningQueryTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function versionKey(reasoningPackage: DomainReasoningPackage): string {
  const version = reasoningPackage.version;
  return [version.major, version.minor, version.patch, version.label ?? ""].join(".");
}

function packageFingerprint(entry: RegisteredDomainReasoningPackage): string {
  const contracts = entry.package.contracts
    .map((contract) =>
      [
        contract.contractId,
        contract.label,
        contract.description,
        contract.scope,
        contract.status,
        contract.inputs.map((input) => [input.inputId, input.label, input.required, input.reference?.termId ?? ""].join(":")).sort().join(","),
        contract.outputs.map((output) => [output.outputId, output.label, output.reference?.kpiId ?? ""].join(":")).sort().join(","),
        contract.evidenceRequirements
          .map((evidence) => [evidence.evidenceRequirementId, evidence.label, evidence.required, evidence.reference?.regulationId ?? ""].join(":"))
          .sort()
          .join(","),
        contract.assumptions
          .map((assumption) => [assumption.assumptionId, assumption.label, assumption.required, assumption.uncertaintyImpact].join(":"))
          .sort()
          .join(","),
        contract.confidence.required,
        contract.confidence.evidenceCoverageRequired,
        contract.confidence.assumptionCoverageRequired,
        contract.uncertainty.required,
        contract.uncertainty.sources.join(","),
        contract.trace.required,
        contract.trace.traceInputIds.join(","),
        contract.trace.traceOutputIds.join(","),
        contract.trace.traceEvidenceRequirementIds.join(","),
        contract.trace.traceAssumptionIds.join(","),
      ].join("|")
    )
    .sort()
    .join("||");

  return stableHash(
    [
      entry.package.contractVersion,
      entry.package.reasoningPackageId,
      entry.package.domainId,
      entry.package.name,
      entry.package.description,
      versionKey(entry.package),
      entry.package.scope,
      entry.package.status,
      entry.registrationOrder,
      contracts,
    ].join("||")
  );
}

function snapshotEntry(entry: RegisteredDomainReasoningPackage): DomainReasoningSnapshotEntry {
  const contracts = entry.package.contracts;
  return Object.freeze({
    reasoningPackageId: entry.package.reasoningPackageId,
    domainId: entry.package.domainId,
    registrationOrder: entry.registrationOrder,
    scope: entry.package.scope,
    status: entry.package.status,
    contractIds: Object.freeze(contracts.map((contract) => contract.contractId).sort()),
    inputIds: Object.freeze(contracts.flatMap((contract) => contract.inputs.map((input) => input.inputId)).sort()),
    outputIds: Object.freeze(contracts.flatMap((contract) => contract.outputs.map((output) => output.outputId)).sort()),
    assumptionIds: Object.freeze(
      contracts.flatMap((contract) => contract.assumptions.map((assumption) => assumption.assumptionId)).sort()
    ),
    evidenceRequirementIds: Object.freeze(
      contracts
        .flatMap((contract) => contract.evidenceRequirements.map((evidence) => evidence.evidenceRequirementId))
        .sort()
    ),
    confidenceRequired: contracts.some((contract) => contract.confidence.required),
    uncertaintyRequired: contracts.some((contract) => contract.uncertainty.required),
    traceRequired: contracts.some((contract) => contract.trace.required),
    fingerprint: packageFingerprint(entry),
  });
}

function snapshotFingerprint(entries: readonly DomainReasoningSnapshotEntry[]): string {
  return stableHash(
    entries
      .map((entry) =>
        [
          entry.reasoningPackageId,
          entry.domainId,
          entry.registrationOrder,
          entry.scope,
          entry.status,
          entry.contractIds.join(","),
          entry.inputIds.join(","),
          entry.outputIds.join(","),
          entry.assumptionIds.join(","),
          entry.evidenceRequirementIds.join(","),
          entry.confidenceRequired,
          entry.uncertaintyRequired,
          entry.traceRequired,
          entry.fingerprint,
        ].join("|")
      )
      .join("||")
  );
}

export function buildDomainReasoningSnapshot(registry: DomainReasoningRegistry): DomainReasoningSnapshot {
  const entries = Object.freeze(
    registry.packages
      .map(snapshotEntry)
      .sort((left, right) => left.reasoningPackageId.localeCompare(right.reasoningPackageId))
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

export function validateDomainReasoningSnapshot(snapshot: DomainReasoningSnapshot): DomainReasoningValidationResult {
  const issues = [];
  if (snapshot.contractVersion !== DOMAIN_REASONING_CONTRACT_VERSION) {
    issues.push(
      Object.freeze({
        code: "invalid_snapshot_contract_version",
        field: "contractVersion",
        message: "Snapshot contract version must match DOM-6:1 reasoning contract.",
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
  return domainReasoningValidationResult(issues);
}

export function compareDomainReasoningSnapshots(left: DomainReasoningSnapshot, right: DomainReasoningSnapshot): boolean {
  return left.fingerprint === right.fingerprint;
}

export function diffDomainReasoningSnapshots(
  left: DomainReasoningSnapshot,
  right: DomainReasoningSnapshot
): DomainReasoningDiff {
  const leftById = new Map(left.entries.map((entry) => [entry.reasoningPackageId, entry]));
  const rightById = new Map(right.entries.map((entry) => [entry.reasoningPackageId, entry]));
  const reasoningPackageIds = [...new Set([...leftById.keys(), ...rightById.keys()])].sort((a, b) =>
    a.localeCompare(b)
  );
  const entries: DomainReasoningDiffEntry[] = [];

  for (const reasoningPackageId of reasoningPackageIds) {
    const leftEntry = leftById.get(reasoningPackageId) ?? null;
    const rightEntry = rightById.get(reasoningPackageId) ?? null;
    if (!leftEntry && rightEntry) {
      entries.push(Object.freeze({ type: "added", reasoningPackageId, left: null, right: rightEntry }));
    } else if (leftEntry && !rightEntry) {
      entries.push(Object.freeze({ type: "removed", reasoningPackageId, left: leftEntry, right: null }));
    } else if (leftEntry && rightEntry && leftEntry.fingerprint !== rightEntry.fingerprint) {
      entries.push(Object.freeze({ type: "modified", reasoningPackageId, left: leftEntry, right: rightEntry }));
    }
  }

  return Object.freeze({
    equal: entries.length === 0,
    leftFingerprint: left.fingerprint,
    rightFingerprint: right.fingerprint,
    entries: Object.freeze(entries),
  });
}
