import {
  buildDomainRegulationManifest,
  validateDomainRegulationRegistry,
  type DomainRegulationRegistry,
} from "./domainRegulationIndex.ts";
import {
  buildDomainRegulationSnapshot,
  compareDomainRegulationSnapshots,
  diffDomainRegulationSnapshots,
  validateDomainRegulationSnapshot,
} from "./domainRegulationQueryIndex.ts";
import {
  DOMAIN_REGULATION_EXPORT_CONTRACT_VERSION,
  type DomainRegulationCapabilityMetadata,
  type DomainRegulationDiffMetadata,
  type DomainRegulationExportBundle,
  type DomainRegulationExportComparison,
  type DomainRegulationExportMetadata,
  type DomainRegulationExportSection,
  type DomainRegulationExportValidationResult,
  type DomainRegulationSnapshotMetadata,
} from "./domainRegulationExportTypes.ts";

const EXPORT_SECTIONS: readonly DomainRegulationExportSection[] = Object.freeze([
  "regulationManifest",
  "regulationSnapshot",
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

function capability(capabilityId: string, publicApis: readonly string[]): DomainRegulationCapabilityMetadata {
  return Object.freeze({
    capabilityId,
    publicApis: Object.freeze([...publicApis]),
    deterministic: true,
    metadataOnly: true,
    runtimeBehavior: false,
  });
}

function metadata(registry: DomainRegulationRegistry): DomainRegulationExportMetadata {
  return Object.freeze({
    contractVersion: DOMAIN_REGULATION_EXPORT_CONTRACT_VERSION,
    registryId: registry.registryId,
    frozen: registry.frozen,
    packageCount: registry.packages.length,
    sections: EXPORT_SECTIONS,
    deterministic: true,
    metadataOnly: true,
    runtimeBehavior: false,
  });
}

function snapshotMetadata(bundle: Pick<DomainRegulationExportBundle, "regulationSnapshot">): DomainRegulationSnapshotMetadata {
  const snapshot = bundle.regulationSnapshot;
  return Object.freeze({
    registryId: snapshot.registryId,
    packageCount: snapshot.packageCount,
    fingerprint: snapshot.fingerprint,
    valid: validateDomainRegulationSnapshot(snapshot).valid,
    deterministic: true,
    metadataOnly: true,
  });
}

function diffMetadata(bundle: Pick<DomainRegulationExportBundle, "regulationSnapshot">): DomainRegulationDiffMetadata {
  const diff = diffDomainRegulationSnapshots(bundle.regulationSnapshot, bundle.regulationSnapshot);
  return Object.freeze({
    comparisonBaseline: "self",
    equal: diff.equal,
    entryCount: diff.entries.length,
    deterministic: true,
    metadataOnly: true,
  });
}

function bundleFingerprint(bundle: Omit<DomainRegulationExportBundle, "fingerprint" | "exportValid">): string {
  return stableHash(
    [
      bundle.metadata.contractVersion,
      bundle.metadata.registryId,
      bundle.metadata.frozen,
      bundle.metadata.packageCount,
      bundle.metadata.sections.join(","),
      bundle.regulationManifest.version,
      bundle.regulationManifest.validation.valid,
      bundle.regulationSnapshot.fingerprint,
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

export function buildDomainRegulationExportBundle(registry: DomainRegulationRegistry): DomainRegulationExportBundle {
  const validation = validateDomainRegulationRegistry(registry);
  const bundleBase = Object.freeze({
    metadata: metadata(registry),
    regulationManifest: buildDomainRegulationManifest(),
    regulationSnapshot: buildDomainRegulationSnapshot(registry),
    validation,
    queryCapability: capability("domain-regulation-query", [
      "queryDomainRegulationPackages",
      "filterDomainRegulationPackages",
      "sortDomainRegulationPackages",
      "findRegulationPackagesByDomain",
      "findRegulationPackagesByScope",
      "findRegulationPackagesByStatus",
      "findRegulationPackagesByJurisdictionScope",
      "findRegulationPackageContainingRegulation",
    ]),
    lookupCapability: capability("domain-regulation-lookup", [
      "findDomainRegulation",
      "findDomainObligation",
      "findDomainControl",
      "findDomainEvidence",
      "findRegulationsByDomain",
      "findObligationsByRegulation",
      "findControlsByObligation",
      "findEvidenceByControl",
    ]),
    referenceInspectionCapability: capability("domain-regulation-reference-inspection", [
      "findRegulationsReferencingVocabularyTerm",
      "findRegulationsReferencingOntologyEntity",
      "findRegulationsReferencingOntologyAttribute",
      "findRegulationsReferencingKpi",
      "buildDomainRegulationReferenceLookup",
    ]),
    snapshotMetadata: snapshotMetadata({
      regulationSnapshot: buildDomainRegulationSnapshot(registry),
    }),
    diffMetadata: diffMetadata({
      regulationSnapshot: buildDomainRegulationSnapshot(registry),
    }),
    diffCapability: capability("domain-regulation-snapshot-diff", [
      "buildDomainRegulationSnapshot",
      "validateDomainRegulationSnapshot",
      "compareDomainRegulationSnapshots",
      "diffDomainRegulationSnapshots",
    ]),
  });
  const fingerprint = bundleFingerprint(bundleBase);
  const exportValid =
    validation.valid &&
    bundleBase.regulationManifest.validation.valid &&
    validateDomainRegulationSnapshot(bundleBase.regulationSnapshot).valid;

  return Object.freeze({
    ...bundleBase,
    fingerprint,
    exportValid,
  });
}

export function validateDomainRegulationExportBundle(
  bundle: DomainRegulationExportBundle
): DomainRegulationExportValidationResult {
  const issues: string[] = [];

  if (bundle.metadata.contractVersion !== DOMAIN_REGULATION_EXPORT_CONTRACT_VERSION) {
    issues.push("invalid_export_contract_version");
  }
  if (bundle.metadata.packageCount !== bundle.regulationSnapshot.packageCount) {
    issues.push("metadata_snapshot_count_mismatch");
  }
  if (bundle.metadata.registryId !== bundle.regulationSnapshot.registryId) {
    issues.push("metadata_snapshot_registry_mismatch");
  }
  if (!bundle.validation.valid) issues.push("registry_validation_failed");
  if (!bundle.regulationManifest.validation.valid) issues.push("manifest_validation_failed");
  if (!validateDomainRegulationSnapshot(bundle.regulationSnapshot).valid) issues.push("snapshot_validation_failed");
  if (bundle.snapshotMetadata.fingerprint !== bundle.regulationSnapshot.fingerprint) {
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

export function compareDomainRegulationExportBundles(
  left: DomainRegulationExportBundle,
  right: DomainRegulationExportBundle
): DomainRegulationExportComparison {
  const fingerprintEqual = left.fingerprint === right.fingerprint;
  const metadataEqual = JSON.stringify(left.metadata) === JSON.stringify(right.metadata);
  const validationEqual = left.validation.valid === right.validation.valid;
  const snapshotEqual = compareDomainRegulationSnapshots(left.regulationSnapshot, right.regulationSnapshot);

  return Object.freeze({
    equal: fingerprintEqual && metadataEqual && validationEqual && snapshotEqual,
    fingerprintEqual,
    metadataEqual,
    validationEqual,
    snapshotEqual,
  });
}
