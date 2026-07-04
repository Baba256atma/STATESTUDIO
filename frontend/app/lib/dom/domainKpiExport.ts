import {
  buildDomainKpiManifest,
  validateDomainKpiRegistry,
  type DomainKpiRegistry,
} from "./domainKpiIndex.ts";
import {
  buildDomainKpiSnapshot,
  compareDomainKpiSnapshots,
  validateDomainKpiSnapshot,
} from "./domainKpiQueryIndex.ts";
import {
  DOMAIN_KPI_EXPORT_CONTRACT_VERSION,
  type DomainKpiCapabilityMetadata,
  type DomainKpiExportBundle,
  type DomainKpiExportComparison,
  type DomainKpiExportMetadata,
  type DomainKpiExportSection,
  type DomainKpiExportValidationResult,
} from "./domainKpiExportTypes.ts";

const EXPORT_SECTIONS: readonly DomainKpiExportSection[] = Object.freeze([
  "kpiManifest",
  "kpiSnapshot",
  "validation",
  "queryCapability",
  "lookupCapability",
  "referenceInspectionCapability",
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

function capability(capabilityId: string, publicApis: readonly string[]): DomainKpiCapabilityMetadata {
  return Object.freeze({
    capabilityId,
    publicApis: Object.freeze([...publicApis]),
    deterministic: true,
    metadataOnly: true,
    runtimeBehavior: false,
  });
}

function metadata(registry: DomainKpiRegistry): DomainKpiExportMetadata {
  return Object.freeze({
    contractVersion: DOMAIN_KPI_EXPORT_CONTRACT_VERSION,
    registryId: registry.registryId,
    frozen: registry.frozen,
    packageCount: registry.packages.length,
    sections: EXPORT_SECTIONS,
    deterministic: true,
    metadataOnly: true,
    runtimeBehavior: false,
  });
}

function bundleFingerprint(bundle: Omit<DomainKpiExportBundle, "fingerprint" | "exportValid">): string {
  return stableHash(
    [
      bundle.metadata.contractVersion,
      bundle.metadata.registryId,
      bundle.metadata.frozen,
      bundle.metadata.packageCount,
      bundle.metadata.sections.join(","),
      bundle.kpiManifest.version,
      bundle.kpiManifest.validation.valid,
      bundle.kpiSnapshot.fingerprint,
      bundle.validation.valid,
      bundle.queryCapability.publicApis.join(","),
      bundle.lookupCapability.publicApis.join(","),
      bundle.referenceInspectionCapability.publicApis.join(","),
      bundle.diffCapability.publicApis.join(","),
    ].join("||")
  );
}

export function buildDomainKpiExportBundle(registry: DomainKpiRegistry): DomainKpiExportBundle {
  const validation = validateDomainKpiRegistry(registry);
  const bundleBase = Object.freeze({
    metadata: metadata(registry),
    kpiManifest: buildDomainKpiManifest(),
    kpiSnapshot: buildDomainKpiSnapshot(registry),
    validation,
    queryCapability: capability("domain-kpi-query", [
      "queryDomainKpiPackages",
      "filterDomainKpiPackages",
      "sortDomainKpiPackages",
      "findKpiPackagesByDomain",
      "findKpiPackagesByScope",
      "findKpiPackagesByStatus",
      "findKpiPackageContainingKpi",
    ]),
    lookupCapability: capability("domain-kpi-lookup", [
      "findDomainKpi",
      "findKpisByDomain",
      "findKpisByScope",
      "findKpisByStatus",
      "findKpisByUnitType",
      "findKpisByAggregationType",
      "findKpisByDirection",
    ]),
    referenceInspectionCapability: capability("domain-kpi-reference-inspection", [
      "findKpisReferencingVocabularyTerm",
      "findKpisReferencingOntologyEntity",
      "findKpisReferencingOntologyAttribute",
      "findKpisReferencingOntologyRelationship",
      "buildDomainKpiReferenceLookup",
    ]),
    diffCapability: capability("domain-kpi-snapshot-diff", [
      "buildDomainKpiSnapshot",
      "validateDomainKpiSnapshot",
      "compareDomainKpiSnapshots",
      "diffDomainKpiSnapshots",
    ]),
  });
  const fingerprint = bundleFingerprint(bundleBase);
  const exportValid =
    validation.valid &&
    bundleBase.kpiManifest.validation.valid &&
    validateDomainKpiSnapshot(bundleBase.kpiSnapshot).valid;

  return Object.freeze({
    ...bundleBase,
    fingerprint,
    exportValid,
  });
}

export function validateDomainKpiExportBundle(bundle: DomainKpiExportBundle): DomainKpiExportValidationResult {
  const issues: string[] = [];

  if (bundle.metadata.contractVersion !== DOMAIN_KPI_EXPORT_CONTRACT_VERSION) {
    issues.push("invalid_export_contract_version");
  }
  if (bundle.metadata.packageCount !== bundle.kpiSnapshot.packageCount) {
    issues.push("metadata_snapshot_count_mismatch");
  }
  if (bundle.metadata.registryId !== bundle.kpiSnapshot.registryId) {
    issues.push("metadata_snapshot_registry_mismatch");
  }
  if (!bundle.validation.valid) issues.push("registry_validation_failed");
  if (!bundle.kpiManifest.validation.valid) issues.push("manifest_validation_failed");
  if (!validateDomainKpiSnapshot(bundle.kpiSnapshot).valid) issues.push("snapshot_validation_failed");
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

export function compareDomainKpiExportBundles(
  left: DomainKpiExportBundle,
  right: DomainKpiExportBundle
): DomainKpiExportComparison {
  const fingerprintEqual = left.fingerprint === right.fingerprint;
  const metadataEqual = JSON.stringify(left.metadata) === JSON.stringify(right.metadata);
  const validationEqual = left.validation.valid === right.validation.valid;
  const snapshotEqual = compareDomainKpiSnapshots(left.kpiSnapshot, right.kpiSnapshot);

  return Object.freeze({
    equal: fingerprintEqual && metadataEqual && validationEqual && snapshotEqual,
    fingerprintEqual,
    metadataEqual,
    validationEqual,
    snapshotEqual,
  });
}
