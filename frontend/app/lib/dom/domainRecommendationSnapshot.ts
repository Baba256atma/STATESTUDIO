import {
  DOMAIN_RECOMMENDATION_CONTRACT_VERSION,
  domainRecommendationValidationResult,
  type DomainRecommendationPackage,
  type DomainRecommendationRegistry,
  type DomainRecommendationValidationResult,
  type RegisteredDomainRecommendationPackage,
} from "./domainRecommendationIndex.ts";
import type {
  DomainRecommendationDiff,
  DomainRecommendationDiffEntry,
  DomainRecommendationSnapshot,
  DomainRecommendationSnapshotEntry,
} from "./domainRecommendationQueryTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function versionKey(recommendationPackage: DomainRecommendationPackage): string {
  const version = recommendationPackage.version;
  return [version.major, version.minor, version.patch, version.label ?? ""].join(".");
}

function packageFingerprint(entry: RegisteredDomainRecommendationPackage): string {
  const contracts = entry.package.contracts
    .map((contract) =>
      [
        contract.contractId,
        contract.label,
        contract.description,
        contract.scope,
        contract.status,
        contract.inputs.map((input) => [input.inputId, input.label, input.required, input.reference?.reasoningContractId ?? ""].join(":")).sort().join(","),
        contract.outputs.map((output) => [output.outputId, output.label, output.reference?.kpiId ?? ""].join(":")).sort().join(","),
        contract.rationale.required,
        contract.rationale.rationaleInputs.join(","),
        contract.rationale.rationaleAssumptions.join(","),
        contract.constraints.map((constraint) => [constraint.constraintId, constraint.label, constraint.required, constraint.severity].join(":")).sort().join(","),
        contract.assumptions.map((assumption) => [assumption.assumptionId, assumption.label, assumption.required, assumption.uncertaintyImpact].join(":")).sort().join(","),
        contract.confidence.required,
        contract.confidence.evidenceCoverageRequired,
        contract.confidence.rationaleCoverageRequired,
        contract.uncertainty.required,
        contract.uncertainty.sources.join(","),
        contract.trace.required,
        contract.trace.traceInputIds.join(","),
        contract.trace.traceOutputIds.join(","),
        contract.trace.traceConstraintIds.join(","),
        contract.trace.traceAssumptionIds.join(","),
      ].join("|")
    )
    .sort()
    .join("||");
  return stableHash(
    [
      entry.package.contractVersion,
      entry.package.recommendationPackageId,
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

function snapshotEntry(entry: RegisteredDomainRecommendationPackage): DomainRecommendationSnapshotEntry {
  const contracts = entry.package.contracts;
  return Object.freeze({
    recommendationPackageId: entry.package.recommendationPackageId,
    domainId: entry.package.domainId,
    registrationOrder: entry.registrationOrder,
    scope: entry.package.scope,
    status: entry.package.status,
    contractIds: Object.freeze(contracts.map((contract) => contract.contractId).sort()),
    inputIds: Object.freeze(contracts.flatMap((contract) => contract.inputs.map((input) => input.inputId)).sort()),
    outputIds: Object.freeze(contracts.flatMap((contract) => contract.outputs.map((output) => output.outputId)).sort()),
    constraintIds: Object.freeze(contracts.flatMap((contract) => contract.constraints.map((constraint) => constraint.constraintId)).sort()),
    assumptionIds: Object.freeze(contracts.flatMap((contract) => contract.assumptions.map((assumption) => assumption.assumptionId)).sort()),
    rationaleRequired: contracts.some((contract) => contract.rationale.required),
    confidenceRequired: contracts.some((contract) => contract.confidence.required),
    uncertaintyRequired: contracts.some((contract) => contract.uncertainty.required),
    traceRequired: contracts.some((contract) => contract.trace.required),
    fingerprint: packageFingerprint(entry),
  });
}

function snapshotFingerprint(entries: readonly DomainRecommendationSnapshotEntry[]): string {
  return stableHash(
    entries
      .map((entry) =>
        [
          entry.recommendationPackageId,
          entry.domainId,
          entry.registrationOrder,
          entry.scope,
          entry.status,
          entry.contractIds.join(","),
          entry.inputIds.join(","),
          entry.outputIds.join(","),
          entry.constraintIds.join(","),
          entry.assumptionIds.join(","),
          entry.rationaleRequired,
          entry.confidenceRequired,
          entry.uncertaintyRequired,
          entry.traceRequired,
          entry.fingerprint,
        ].join("|")
      )
      .join("||")
  );
}

export function buildDomainRecommendationSnapshot(registry: DomainRecommendationRegistry): DomainRecommendationSnapshot {
  const entries = Object.freeze(
    registry.packages
      .map(snapshotEntry)
      .sort((left, right) => left.recommendationPackageId.localeCompare(right.recommendationPackageId))
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

export function validateDomainRecommendationSnapshot(
  snapshot: DomainRecommendationSnapshot
): DomainRecommendationValidationResult {
  const issues = [];
  if (snapshot.contractVersion !== DOMAIN_RECOMMENDATION_CONTRACT_VERSION) {
    issues.push(Object.freeze({ code: "invalid_snapshot_contract_version", field: "contractVersion", message: "Snapshot contract version must match DOM-7:1 recommendation contract.", severity: "error" as const }));
  }
  if (snapshot.packageCount !== snapshot.entries.length) {
    issues.push(Object.freeze({ code: "invalid_snapshot_package_count", field: "packageCount", message: "Snapshot package count must match entry count.", severity: "error" as const }));
  }
  if (snapshot.fingerprint !== snapshotFingerprint(snapshot.entries)) {
    issues.push(Object.freeze({ code: "invalid_snapshot_fingerprint", field: "fingerprint", message: "Snapshot fingerprint must match deterministic entry fingerprint.", severity: "error" as const }));
  }
  return domainRecommendationValidationResult(issues);
}

export function compareDomainRecommendationSnapshots(
  left: DomainRecommendationSnapshot,
  right: DomainRecommendationSnapshot
): boolean {
  return left.fingerprint === right.fingerprint;
}

export function diffDomainRecommendationSnapshots(
  left: DomainRecommendationSnapshot,
  right: DomainRecommendationSnapshot
): DomainRecommendationDiff {
  const leftById = new Map(left.entries.map((entry) => [entry.recommendationPackageId, entry]));
  const rightById = new Map(right.entries.map((entry) => [entry.recommendationPackageId, entry]));
  const recommendationPackageIds = [...new Set([...leftById.keys(), ...rightById.keys()])].sort((a, b) =>
    a.localeCompare(b)
  );
  const entries: DomainRecommendationDiffEntry[] = [];
  for (const recommendationPackageId of recommendationPackageIds) {
    const leftEntry = leftById.get(recommendationPackageId) ?? null;
    const rightEntry = rightById.get(recommendationPackageId) ?? null;
    if (!leftEntry && rightEntry) entries.push(Object.freeze({ type: "added", recommendationPackageId, left: null, right: rightEntry }));
    else if (leftEntry && !rightEntry) entries.push(Object.freeze({ type: "removed", recommendationPackageId, left: leftEntry, right: null }));
    else if (leftEntry && rightEntry && leftEntry.fingerprint !== rightEntry.fingerprint) entries.push(Object.freeze({ type: "modified", recommendationPackageId, left: leftEntry, right: rightEntry }));
  }
  return Object.freeze({
    equal: entries.length === 0,
    leftFingerprint: left.fingerprint,
    rightFingerprint: right.fingerprint,
    entries: Object.freeze(entries),
  });
}
