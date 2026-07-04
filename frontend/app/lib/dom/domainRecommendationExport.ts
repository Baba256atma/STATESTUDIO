import {
  buildDomainRecommendationManifest,
  validateDomainRecommendationRegistry,
  type DomainRecommendationRegistry,
} from "./domainRecommendationIndex.ts";
import {
  buildDomainRecommendationSnapshot,
  compareDomainRecommendationSnapshots,
  diffDomainRecommendationSnapshots,
  validateDomainRecommendationSnapshot,
} from "./domainRecommendationQueryIndex.ts";
import {
  DOMAIN_RECOMMENDATION_EXPORT_CONTRACT_VERSION,
  type DomainRecommendationCapabilityMetadata,
  type DomainRecommendationDiffMetadata,
  type DomainRecommendationExportBundle,
  type DomainRecommendationExportComparison,
  type DomainRecommendationExportMetadata,
  type DomainRecommendationExportSection,
  type DomainRecommendationExportValidationResult,
  type DomainRecommendationSnapshotMetadata,
} from "./domainRecommendationExportTypes.ts";

const EXPORT_SECTIONS: readonly DomainRecommendationExportSection[] = Object.freeze([
  "recommendationManifest",
  "recommendationSnapshot",
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

function capability(capabilityId: string, publicApis: readonly string[]): DomainRecommendationCapabilityMetadata {
  return Object.freeze({ capabilityId, publicApis: Object.freeze([...publicApis]), deterministic: true, metadataOnly: true, runtimeBehavior: false });
}

function metadata(registry: DomainRecommendationRegistry): DomainRecommendationExportMetadata {
  return Object.freeze({
    contractVersion: DOMAIN_RECOMMENDATION_EXPORT_CONTRACT_VERSION,
    registryId: registry.registryId,
    frozen: registry.frozen,
    packageCount: registry.packages.length,
    sections: EXPORT_SECTIONS,
    deterministic: true,
    metadataOnly: true,
    runtimeBehavior: false,
  });
}

function snapshotMetadata(bundle: Pick<DomainRecommendationExportBundle, "recommendationSnapshot">): DomainRecommendationSnapshotMetadata {
  const snapshot = bundle.recommendationSnapshot;
  return Object.freeze({
    registryId: snapshot.registryId,
    packageCount: snapshot.packageCount,
    fingerprint: snapshot.fingerprint,
    valid: validateDomainRecommendationSnapshot(snapshot).valid,
    deterministic: true,
    metadataOnly: true,
  });
}

function diffMetadata(bundle: Pick<DomainRecommendationExportBundle, "recommendationSnapshot">): DomainRecommendationDiffMetadata {
  const diff = diffDomainRecommendationSnapshots(bundle.recommendationSnapshot, bundle.recommendationSnapshot);
  return Object.freeze({
    comparisonBaseline: "self",
    equal: diff.equal,
    entryCount: diff.entries.length,
    deterministic: true,
    metadataOnly: true,
  });
}

function bundleFingerprint(bundle: Omit<DomainRecommendationExportBundle, "fingerprint" | "exportValid">): string {
  return stableHash(
    [
      bundle.metadata.contractVersion,
      bundle.metadata.registryId,
      bundle.metadata.frozen,
      bundle.metadata.packageCount,
      bundle.metadata.sections.join(","),
      bundle.recommendationManifest.version,
      bundle.recommendationManifest.validation.valid,
      bundle.recommendationSnapshot.fingerprint,
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

export function buildDomainRecommendationExportBundle(registry: DomainRecommendationRegistry): DomainRecommendationExportBundle {
  const validation = validateDomainRecommendationRegistry(registry);
  const recommendationSnapshot = buildDomainRecommendationSnapshot(registry);
  const bundleBase = Object.freeze({
    metadata: metadata(registry),
    recommendationManifest: buildDomainRecommendationManifest(),
    recommendationSnapshot,
    validation,
    queryCapability: capability("domain-recommendation-query", [
      "queryDomainRecommendationPackages",
      "filterDomainRecommendationPackages",
      "sortDomainRecommendationPackages",
      "findRecommendationPackagesByDomain",
      "findRecommendationPackagesByScope",
      "findRecommendationPackagesByStatus",
      "findRecommendationPackageContainingContract",
    ]),
    lookupCapability: capability("domain-recommendation-lookup", [
      "findDomainRecommendationContract",
      "findRecommendationInputs",
      "findRecommendationOutputs",
      "findRecommendationRationale",
      "findRecommendationConstraints",
      "findRecommendationAssumptions",
      "findRecommendationConfidenceMetadata",
      "findRecommendationUncertaintyMetadata",
      "findRecommendationTraceMetadata",
    ]),
    referenceInspectionCapability: capability("domain-recommendation-reference-inspection", [
      "findRecommendationsReferencingVocabularyTerm",
      "findRecommendationsReferencingOntologyEntity",
      "findRecommendationsReferencingOntologyAttribute",
      "findRecommendationsReferencingKpi",
      "findRecommendationsReferencingRegulation",
      "findRecommendationsReferencingReasoning",
      "buildDomainRecommendationReferenceLookup",
    ]),
    snapshotMetadata: snapshotMetadata({ recommendationSnapshot }),
    diffMetadata: diffMetadata({ recommendationSnapshot }),
    diffCapability: capability("domain-recommendation-snapshot-diff", [
      "buildDomainRecommendationSnapshot",
      "validateDomainRecommendationSnapshot",
      "compareDomainRecommendationSnapshots",
      "diffDomainRecommendationSnapshots",
    ]),
  });
  const fingerprint = bundleFingerprint(bundleBase);
  const exportValid =
    validation.valid &&
    bundleBase.recommendationManifest.validation.valid &&
    validateDomainRecommendationSnapshot(bundleBase.recommendationSnapshot).valid;

  return Object.freeze({ ...bundleBase, fingerprint, exportValid });
}

export function validateDomainRecommendationExportBundle(
  bundle: DomainRecommendationExportBundle
): DomainRecommendationExportValidationResult {
  const issues: string[] = [];
  if (bundle.metadata.contractVersion !== DOMAIN_RECOMMENDATION_EXPORT_CONTRACT_VERSION) issues.push("invalid_export_contract_version");
  if (bundle.metadata.packageCount !== bundle.recommendationSnapshot.packageCount) issues.push("metadata_snapshot_count_mismatch");
  if (bundle.metadata.registryId !== bundle.recommendationSnapshot.registryId) issues.push("metadata_snapshot_registry_mismatch");
  if (!bundle.validation.valid) issues.push("registry_validation_failed");
  if (!bundle.recommendationManifest.validation.valid) issues.push("manifest_validation_failed");
  if (!validateDomainRecommendationSnapshot(bundle.recommendationSnapshot).valid) issues.push("snapshot_validation_failed");
  if (bundle.snapshotMetadata.fingerprint !== bundle.recommendationSnapshot.fingerprint) issues.push("snapshot_metadata_fingerprint_mismatch");
  if (!bundle.snapshotMetadata.valid || !bundle.snapshotMetadata.metadataOnly) issues.push("snapshot_metadata_invalid");
  if (!bundle.diffMetadata.equal || bundle.diffMetadata.entryCount !== 0 || !bundle.diffMetadata.metadataOnly) issues.push("diff_metadata_invalid");
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
  return Object.freeze({ valid: issues.length === 0 && bundle.exportValid, issues: Object.freeze(issues) });
}

export function compareDomainRecommendationExportBundles(
  left: DomainRecommendationExportBundle,
  right: DomainRecommendationExportBundle
): DomainRecommendationExportComparison {
  const fingerprintEqual = left.fingerprint === right.fingerprint;
  const metadataEqual = JSON.stringify(left.metadata) === JSON.stringify(right.metadata);
  const validationEqual = left.validation.valid === right.validation.valid;
  const snapshotEqual = compareDomainRecommendationSnapshots(left.recommendationSnapshot, right.recommendationSnapshot);
  return Object.freeze({ equal: fingerprintEqual && metadataEqual && validationEqual && snapshotEqual, fingerprintEqual, metadataEqual, validationEqual, snapshotEqual });
}
