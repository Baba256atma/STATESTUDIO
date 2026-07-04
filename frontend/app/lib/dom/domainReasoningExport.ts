import {
  buildDomainReasoningManifest,
  validateDomainReasoningRegistry,
  type DomainReasoningRegistry,
} from "./domainReasoningIndex.ts";
import {
  buildDomainReasoningSnapshot,
  compareDomainReasoningSnapshots,
  diffDomainReasoningSnapshots,
  validateDomainReasoningSnapshot,
} from "./domainReasoningQueryIndex.ts";
import {
  DOMAIN_REASONING_EXPORT_CONTRACT_VERSION,
  type DomainReasoningCapabilityMetadata,
  type DomainReasoningDiffMetadata,
  type DomainReasoningExportBundle,
  type DomainReasoningExportComparison,
  type DomainReasoningExportMetadata,
  type DomainReasoningExportSection,
  type DomainReasoningExportValidationResult,
  type DomainReasoningSnapshotMetadata,
} from "./domainReasoningExportTypes.ts";

const EXPORT_SECTIONS: readonly DomainReasoningExportSection[] = Object.freeze([
  "reasoningManifest",
  "reasoningSnapshot",
  "validation",
  "queryCapability",
  "lookupCapability",
  "referenceInspectionCapability",
  "snapshotMetadata",
  "diffMetadata",
  "diffCapability",
  "fingerprint",
]);

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function capability(capabilityId: string, publicApis: readonly string[]): DomainReasoningCapabilityMetadata {
  return Object.freeze({
    capabilityId,
    publicApis: Object.freeze([...publicApis]),
    deterministic: true,
    metadataOnly: true,
    runtimeBehavior: false,
  });
}

function metadata(registry: DomainReasoningRegistry): DomainReasoningExportMetadata {
  return Object.freeze({
    contractVersion: DOMAIN_REASONING_EXPORT_CONTRACT_VERSION,
    registryId: registry.registryId,
    frozen: registry.frozen,
    packageCount: registry.packages.length,
    sections: EXPORT_SECTIONS,
    deterministic: true,
    metadataOnly: true,
    runtimeBehavior: false,
  });
}

function snapshotMetadata(bundle: Pick<DomainReasoningExportBundle, "reasoningSnapshot">): DomainReasoningSnapshotMetadata {
  const snapshot = bundle.reasoningSnapshot;
  return Object.freeze({
    registryId: snapshot.registryId,
    packageCount: snapshot.packageCount,
    fingerprint: snapshot.fingerprint,
    valid: validateDomainReasoningSnapshot(snapshot).valid,
    deterministic: true,
    metadataOnly: true,
  });
}

function diffMetadata(bundle: Pick<DomainReasoningExportBundle, "reasoningSnapshot">): DomainReasoningDiffMetadata {
  const diff = diffDomainReasoningSnapshots(bundle.reasoningSnapshot, bundle.reasoningSnapshot);
  return Object.freeze({
    comparisonBaseline: "self",
    equal: diff.equal,
    entryCount: diff.entries.length,
    deterministic: true,
    metadataOnly: true,
  });
}

function bundleFingerprint(bundle: Omit<DomainReasoningExportBundle, "fingerprint" | "exportValid">): string {
  return stableHash(
    [
      bundle.metadata.contractVersion,
      bundle.metadata.registryId,
      bundle.metadata.frozen,
      bundle.metadata.packageCount,
      bundle.metadata.sections.join(","),
      bundle.reasoningManifest.version,
      bundle.reasoningManifest.validation.valid,
      bundle.reasoningSnapshot.fingerprint,
      bundle.validation.valid,
      bundle.queryCapability.publicApis.join(","),
      bundle.lookupCapability.publicApis.join(","),
      bundle.referenceInspectionCapability.publicApis.join(","),
      bundle.snapshotMetadata.registryId,
      bundle.snapshotMetadata.packageCount,
      bundle.snapshotMetadata.fingerprint,
      bundle.snapshotMetadata.valid,
      bundle.diffMetadata.comparisonBaseline,
      bundle.diffMetadata.equal,
      bundle.diffMetadata.entryCount,
      bundle.diffCapability.publicApis.join(","),
    ].join("||")
  );
}

export function buildDomainReasoningExportBundle(registry: DomainReasoningRegistry): DomainReasoningExportBundle {
  const validation = validateDomainReasoningRegistry(registry);
  const reasoningSnapshot = buildDomainReasoningSnapshot(registry);
  const bundleBase = Object.freeze({
    metadata: metadata(registry),
    reasoningManifest: buildDomainReasoningManifest(),
    reasoningSnapshot,
    validation,
    queryCapability: capability("domain-reasoning-query", [
      "queryDomainReasoningPackages",
      "filterDomainReasoningPackages",
      "sortDomainReasoningPackages",
      "findReasoningPackagesByDomain",
      "findReasoningPackagesByScope",
      "findReasoningPackagesByStatus",
      "findReasoningPackageContainingContract",
    ]),
    lookupCapability: capability("domain-reasoning-lookup", [
      "findDomainReasoningContract",
      "findReasoningInputs",
      "findReasoningOutputs",
      "findReasoningAssumptions",
      "findReasoningEvidenceRequirements",
      "findReasoningConfidenceMetadata",
      "findReasoningUncertaintyMetadata",
      "findReasoningTraceMetadata",
    ]),
    referenceInspectionCapability: capability("domain-reasoning-reference-inspection", [
      "findReasoningReferencingVocabularyTerm",
      "findReasoningReferencingOntologyEntity",
      "findReasoningReferencingOntologyAttribute",
      "findReasoningReferencingKpi",
      "findReasoningReferencingRegulation",
      "buildDomainReasoningReferenceLookup",
    ]),
    snapshotMetadata: snapshotMetadata({ reasoningSnapshot }),
    diffMetadata: diffMetadata({ reasoningSnapshot }),
    diffCapability: capability("domain-reasoning-snapshot-diff", [
      "buildDomainReasoningSnapshot",
      "validateDomainReasoningSnapshot",
      "compareDomainReasoningSnapshots",
      "diffDomainReasoningSnapshots",
    ]),
  });
  const fingerprint = bundleFingerprint(bundleBase);
  const exportValid =
    validation.valid &&
    bundleBase.reasoningManifest.validation.valid &&
    validateDomainReasoningSnapshot(bundleBase.reasoningSnapshot).valid;

  return Object.freeze({
    ...bundleBase,
    fingerprint,
    exportValid,
  });
}

export function validateDomainReasoningExportBundle(
  bundle: DomainReasoningExportBundle
): DomainReasoningExportValidationResult {
  const issues: string[] = [];

  if (bundle.metadata.contractVersion !== DOMAIN_REASONING_EXPORT_CONTRACT_VERSION) {
    issues.push("invalid_export_contract_version");
  }
  if (bundle.metadata.packageCount !== bundle.reasoningSnapshot.packageCount) {
    issues.push("metadata_snapshot_count_mismatch");
  }
  if (bundle.metadata.registryId !== bundle.reasoningSnapshot.registryId) {
    issues.push("metadata_snapshot_registry_mismatch");
  }
  if (!bundle.validation.valid) issues.push("registry_validation_failed");
  if (!bundle.reasoningManifest.validation.valid) issues.push("manifest_validation_failed");
  if (!validateDomainReasoningSnapshot(bundle.reasoningSnapshot).valid) issues.push("snapshot_validation_failed");
  if (bundle.snapshotMetadata.fingerprint !== bundle.reasoningSnapshot.fingerprint) {
    issues.push("snapshot_metadata_fingerprint_mismatch");
  }
  if (!bundle.snapshotMetadata.valid || !bundle.snapshotMetadata.metadataOnly) {
    issues.push("snapshot_metadata_invalid");
  }
  if (!bundle.diffMetadata.equal || bundle.diffMetadata.entryCount !== 0 || !bundle.diffMetadata.metadataOnly) {
    issues.push("diff_metadata_invalid");
  }
  if (bundle.fingerprint !== bundleFingerprint(bundle)) issues.push("invalid_export_fingerprint");
  if (
    !bundle.metadata.metadataOnly ||
    bundle.metadata.runtimeBehavior ||
    !bundle.queryCapability.metadataOnly ||
    bundle.queryCapability.runtimeBehavior ||
    !bundle.lookupCapability.metadataOnly ||
    bundle.lookupCapability.runtimeBehavior ||
    !bundle.referenceInspectionCapability.metadataOnly ||
    bundle.referenceInspectionCapability.runtimeBehavior ||
    !bundle.diffCapability.metadataOnly ||
    bundle.diffCapability.runtimeBehavior
  ) {
    issues.push("metadata_only_boundary_failed");
  }

  return Object.freeze({
    valid: issues.length === 0 && bundle.exportValid,
    issues: Object.freeze(issues),
  });
}

export function compareDomainReasoningExportBundles(
  left: DomainReasoningExportBundle,
  right: DomainReasoningExportBundle
): DomainReasoningExportComparison {
  const fingerprintEqual = left.fingerprint === right.fingerprint;
  const metadataEqual = JSON.stringify(left.metadata) === JSON.stringify(right.metadata);
  const validationEqual = left.validation.valid === right.validation.valid;
  const snapshotEqual = compareDomainReasoningSnapshots(left.reasoningSnapshot, right.reasoningSnapshot);

  return Object.freeze({
    equal: fingerprintEqual && metadataEqual && validationEqual && snapshotEqual,
    fingerprintEqual,
    metadataEqual,
    validationEqual,
    snapshotEqual,
  });
}
