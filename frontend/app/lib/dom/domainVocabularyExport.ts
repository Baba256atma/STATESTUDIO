import {
  buildDomainVocabularyManifest,
  validateDomainVocabularyRegistry,
  type DomainVocabularyRegistry,
} from "./domainVocabularyIndex.ts";
import {
  buildDomainVocabularySnapshot,
  compareDomainVocabularySnapshots,
  validateDomainVocabularySnapshot,
} from "./domainVocabularyQueryIndex.ts";
import type {
  DomainVocabularyCapabilityMetadata,
  DomainVocabularyExportBundle,
  DomainVocabularyExportComparison,
  DomainVocabularyExportMetadata,
  DomainVocabularyExportSection,
  DomainVocabularyExportValidationResult,
} from "./domainVocabularyExportTypes.ts";
import { DOMAIN_VOCABULARY_EXPORT_CONTRACT_VERSION } from "./domainVocabularyExportTypes.ts";

const EXPORT_SECTIONS: readonly DomainVocabularyExportSection[] = Object.freeze([
  "vocabularyManifest",
  "vocabularySnapshot",
  "validation",
  "queryCapability",
  "lookupCapability",
  "synonymResolutionCapability",
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

function capability(
  capabilityId: string,
  publicApis: readonly string[]
): DomainVocabularyCapabilityMetadata {
  return Object.freeze({
    capabilityId,
    publicApis: Object.freeze([...publicApis]),
    deterministic: true,
    metadataOnly: true,
    runtimeBehavior: false,
  });
}

function bundleFingerprint(bundle: Omit<DomainVocabularyExportBundle, "fingerprint" | "exportValid">): string {
  return stableHash(
    [
      bundle.metadata.contractVersion,
      bundle.metadata.registryId,
      bundle.metadata.frozen,
      bundle.metadata.vocabularyCount,
      bundle.metadata.sections.join(","),
      bundle.vocabularyManifest.version,
      bundle.vocabularyManifest.validation.valid,
      bundle.vocabularySnapshot.fingerprint,
      bundle.validation.valid,
      bundle.queryCapability.publicApis.join(","),
      bundle.lookupCapability.publicApis.join(","),
      bundle.synonymResolutionCapability.publicApis.join(","),
      bundle.diffCapability.publicApis.join(","),
    ].join("||")
  );
}

function metadata(registry: DomainVocabularyRegistry): DomainVocabularyExportMetadata {
  return Object.freeze({
    contractVersion: DOMAIN_VOCABULARY_EXPORT_CONTRACT_VERSION,
    registryId: registry.registryId,
    frozen: registry.frozen,
    vocabularyCount: registry.vocabularies.length,
    sections: EXPORT_SECTIONS,
    deterministic: true,
    metadataOnly: true,
    runtimeBehavior: false,
  });
}

export function buildDomainVocabularyExportBundle(
  registry: DomainVocabularyRegistry
): DomainVocabularyExportBundle {
  const validation = validateDomainVocabularyRegistry(registry);
  const bundleBase = Object.freeze({
    metadata: metadata(registry),
    vocabularyManifest: buildDomainVocabularyManifest(),
    vocabularySnapshot: buildDomainVocabularySnapshot(registry),
    validation,
    queryCapability: capability("domain-vocabulary-query", [
      "queryDomainVocabularies",
      "filterDomainVocabularies",
      "sortDomainVocabularies",
      "findVocabulariesByDomain",
      "findVocabulariesByScope",
      "findVocabulariesByStatus",
      "findVocabularyContainingTerm",
    ]),
    lookupCapability: capability("domain-term-lookup", [
      "findDomainTerm",
      "findTermsByDomain",
      "findTermsByScope",
      "findTermsByStatus",
    ]),
    synonymResolutionCapability: capability("domain-synonym-resolution", [
      "resolveDomainSynonym",
    ]),
    diffCapability: capability("domain-vocabulary-snapshot-diff", [
      "buildDomainVocabularySnapshot",
      "validateDomainVocabularySnapshot",
      "compareDomainVocabularySnapshots",
      "diffDomainVocabularySnapshots",
    ]),
  });
  const fingerprint = bundleFingerprint(bundleBase);
  const exportValid =
    validation.valid &&
    bundleBase.vocabularyManifest.validation.valid &&
    validateDomainVocabularySnapshot(bundleBase.vocabularySnapshot).valid;

  return Object.freeze({
    ...bundleBase,
    fingerprint,
    exportValid,
  });
}

export function validateDomainVocabularyExportBundle(
  bundle: DomainVocabularyExportBundle
): DomainVocabularyExportValidationResult {
  const issues: string[] = [];

  if (bundle.metadata.contractVersion !== DOMAIN_VOCABULARY_EXPORT_CONTRACT_VERSION) {
    issues.push("invalid_export_contract_version");
  }
  if (bundle.metadata.vocabularyCount !== bundle.vocabularySnapshot.vocabularyCount) {
    issues.push("metadata_snapshot_count_mismatch");
  }
  if (bundle.metadata.registryId !== bundle.vocabularySnapshot.registryId) {
    issues.push("metadata_snapshot_registry_mismatch");
  }
  if (!bundle.validation.valid) {
    issues.push("registry_validation_failed");
  }
  if (!bundle.vocabularyManifest.validation.valid) {
    issues.push("manifest_validation_failed");
  }
  if (!validateDomainVocabularySnapshot(bundle.vocabularySnapshot).valid) {
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
    !bundle.synonymResolutionCapability.metadataOnly ||
    bundle.synonymResolutionCapability.runtimeBehavior ||
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

export function compareDomainVocabularyExportBundles(
  left: DomainVocabularyExportBundle,
  right: DomainVocabularyExportBundle
): DomainVocabularyExportComparison {
  const fingerprintEqual = left.fingerprint === right.fingerprint;
  const metadataEqual = JSON.stringify(left.metadata) === JSON.stringify(right.metadata);
  const validationEqual = left.validation.valid === right.validation.valid;
  const snapshotEqual = compareDomainVocabularySnapshots(left.vocabularySnapshot, right.vocabularySnapshot);

  return Object.freeze({
    equal: fingerprintEqual && metadataEqual && validationEqual && snapshotEqual,
    fingerprintEqual,
    metadataEqual,
    validationEqual,
    snapshotEqual,
  });
}
