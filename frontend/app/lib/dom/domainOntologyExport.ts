import {
  buildDomainOntologyManifest,
  validateDomainOntologyRegistry,
  type DomainOntologyRegistry,
} from "./domainOntologyIndex.ts";
import {
  buildDomainOntologySnapshot,
  compareDomainOntologySnapshots,
  validateDomainOntologySnapshot,
} from "./domainOntologyQueryIndex.ts";
import {
  DOMAIN_ONTOLOGY_EXPORT_CONTRACT_VERSION,
  type DomainOntologyCapabilityMetadata,
  type DomainOntologyExportBundle,
  type DomainOntologyExportComparison,
  type DomainOntologyExportMetadata,
  type DomainOntologyExportSection,
  type DomainOntologyExportValidationResult,
} from "./domainOntologyExportTypes.ts";

const EXPORT_SECTIONS: readonly DomainOntologyExportSection[] = Object.freeze([
  "ontologyManifest",
  "ontologySnapshot",
  "validation",
  "queryCapability",
  "lookupCapability",
  "traversalCapability",
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

function capability(capabilityId: string, publicApis: readonly string[]): DomainOntologyCapabilityMetadata {
  return Object.freeze({
    capabilityId,
    publicApis: Object.freeze([...publicApis]),
    deterministic: true,
    metadataOnly: true,
    runtimeBehavior: false,
  });
}

function metadata(registry: DomainOntologyRegistry): DomainOntologyExportMetadata {
  return Object.freeze({
    contractVersion: DOMAIN_ONTOLOGY_EXPORT_CONTRACT_VERSION,
    registryId: registry.registryId,
    frozen: registry.frozen,
    ontologyCount: registry.ontologies.length,
    sections: EXPORT_SECTIONS,
    deterministic: true,
    metadataOnly: true,
    runtimeBehavior: false,
  });
}

function bundleFingerprint(bundle: Omit<DomainOntologyExportBundle, "fingerprint" | "exportValid">): string {
  return stableHash(
    [
      bundle.metadata.contractVersion,
      bundle.metadata.registryId,
      bundle.metadata.frozen,
      bundle.metadata.ontologyCount,
      bundle.metadata.sections.join(","),
      bundle.ontologyManifest.version,
      bundle.ontologyManifest.validation.valid,
      bundle.ontologySnapshot.fingerprint,
      bundle.validation.valid,
      bundle.queryCapability.publicApis.join(","),
      bundle.lookupCapability.publicApis.join(","),
      bundle.traversalCapability.publicApis.join(","),
      bundle.diffCapability.publicApis.join(","),
    ].join("||")
  );
}

export function buildDomainOntologyExportBundle(registry: DomainOntologyRegistry): DomainOntologyExportBundle {
  const validation = validateDomainOntologyRegistry(registry);
  const bundleBase = Object.freeze({
    metadata: metadata(registry),
    ontologyManifest: buildDomainOntologyManifest(),
    ontologySnapshot: buildDomainOntologySnapshot(registry),
    validation,
    queryCapability: capability("domain-ontology-query", [
      "queryDomainOntologies",
      "filterDomainOntologies",
      "sortDomainOntologies",
      "findOntologiesByDomain",
      "findOntologiesByScope",
      "findOntologiesByStatus",
      "findOntologyContainingEntityType",
      "findOntologyContainingRelationshipType",
    ]),
    lookupCapability: capability("domain-ontology-lookup", [
      "findDomainEntityType",
      "findDomainRelationshipType",
      "findDomainAttribute",
      "findDomainConstraint",
      "findAttributesByOwner",
      "findConstraintsByTarget",
    ]),
    traversalCapability: capability("domain-ontology-direct-traversal", [
      "findOutgoingRelationshipTypes",
      "findIncomingRelationshipTypes",
      "findConnectedEntityTypes",
      "buildOntologyTraversalResult",
    ]),
    diffCapability: capability("domain-ontology-snapshot-diff", [
      "buildDomainOntologySnapshot",
      "validateDomainOntologySnapshot",
      "compareDomainOntologySnapshots",
      "diffDomainOntologySnapshots",
    ]),
  });
  const fingerprint = bundleFingerprint(bundleBase);
  const exportValid =
    validation.valid &&
    bundleBase.ontologyManifest.validation.valid &&
    validateDomainOntologySnapshot(bundleBase.ontologySnapshot).valid;

  return Object.freeze({
    ...bundleBase,
    fingerprint,
    exportValid,
  });
}

export function validateDomainOntologyExportBundle(
  bundle: DomainOntologyExportBundle
): DomainOntologyExportValidationResult {
  const issues: string[] = [];

  if (bundle.metadata.contractVersion !== DOMAIN_ONTOLOGY_EXPORT_CONTRACT_VERSION) {
    issues.push("invalid_export_contract_version");
  }
  if (bundle.metadata.ontologyCount !== bundle.ontologySnapshot.ontologyCount) {
    issues.push("metadata_snapshot_count_mismatch");
  }
  if (bundle.metadata.registryId !== bundle.ontologySnapshot.registryId) {
    issues.push("metadata_snapshot_registry_mismatch");
  }
  if (!bundle.validation.valid) issues.push("registry_validation_failed");
  if (!bundle.ontologyManifest.validation.valid) issues.push("manifest_validation_failed");
  if (!validateDomainOntologySnapshot(bundle.ontologySnapshot).valid) {
    issues.push("snapshot_validation_failed");
  }
  if (bundle.fingerprint !== bundleFingerprint(bundle)) {
    issues.push("invalid_export_fingerprint");
  }
  if (
    !bundle.metadata.metadataOnly ||
    bundle.metadata.runtimeBehavior ||
    !bundle.queryCapability.metadataOnly ||
    bundle.queryCapability.runtimeBehavior ||
    !bundle.lookupCapability.metadataOnly ||
    bundle.lookupCapability.runtimeBehavior ||
    !bundle.traversalCapability.metadataOnly ||
    bundle.traversalCapability.runtimeBehavior ||
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

export function compareDomainOntologyExportBundles(
  left: DomainOntologyExportBundle,
  right: DomainOntologyExportBundle
): DomainOntologyExportComparison {
  const fingerprintEqual = left.fingerprint === right.fingerprint;
  const metadataEqual = JSON.stringify(left.metadata) === JSON.stringify(right.metadata);
  const validationEqual = left.validation.valid === right.validation.valid;
  const snapshotEqual = compareDomainOntologySnapshots(left.ontologySnapshot, right.ontologySnapshot);

  return Object.freeze({
    equal: fingerprintEqual && metadataEqual && validationEqual && snapshotEqual,
    fingerprintEqual,
    metadataEqual,
    validationEqual,
    snapshotEqual,
  });
}
