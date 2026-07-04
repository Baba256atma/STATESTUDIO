import {
  buildDomainFoundationManifest,
  listDomains,
  validateDomainFoundation,
  validateDomainRegistry,
} from "./domainFoundationIndex.ts";
import type { DomainRegistry } from "./domainFoundationIndex.ts";
import {
  buildDomainRegistrySnapshot,
  validateDomainRegistrySnapshot,
  validateSnapshotAgainstRegistry,
} from "./domainRegistryQueryIndex.ts";
import {
  buildCompleteDomainRegistryIndex,
  buildDomainRegistryStats,
} from "./domainRegistryStatsIndex.ts";
import {
  DOMAIN_REGISTRY_EXPORT_CONTRACT_VERSION,
  type DomainRegistryExportBundle,
  type DomainRegistryExportComparison,
  type DomainRegistryExportMetadata,
  type DomainRegistryExportSection,
  type DomainRegistryExportValidationResult,
} from "./domainRegistryExportTypes.ts";

const EXPORT_SECTIONS: readonly DomainRegistryExportSection[] = Object.freeze([
  "foundationManifest",
  "registrySnapshot",
  "registryStats",
  "registryIndex",
  "validation",
  "fingerprint",
]);

function buildExportFingerprint(bundle: Omit<DomainRegistryExportBundle, "fingerprint" | "exportValid">): string {
  return [
    bundle.metadata.contractVersion,
    bundle.metadata.registryId,
    String(bundle.metadata.frozen),
    String(bundle.metadata.domainCount),
    bundle.foundationManifest.platform.version,
    bundle.registrySnapshot.fingerprint,
    String(bundle.registryStats.totalDomains),
    bundle.registryIndex.contractVersion,
    String(bundle.validation.valid),
    bundle.registryStats.mostConnectedDomains.join(","),
  ].join(";;");
}

function buildExportMetadata(registry: DomainRegistry, domainCount: number): DomainRegistryExportMetadata {
  return Object.freeze({
    contractVersion: DOMAIN_REGISTRY_EXPORT_CONTRACT_VERSION,
    registryId: registry.registryId,
    frozen: registry.frozen,
    domainCount,
    sections: EXPORT_SECTIONS,
    deterministic: true,
  });
}

export function buildDomainRegistryExportBundle(registry: DomainRegistry): DomainRegistryExportBundle {
  const foundationManifest = buildDomainFoundationManifest(validateDomainFoundation());
  const registrySnapshot = buildDomainRegistrySnapshot(registry);
  const registryStats = buildDomainRegistryStats(registry);
  const registryIndex = buildCompleteDomainRegistryIndex(registry);
  const validation = validateDomainRegistry(registry);
  const domainCount = listDomains(registry).length;

  const withoutFingerprint = Object.freeze({
    metadata: buildExportMetadata(registry, domainCount),
    foundationManifest,
    registrySnapshot,
    registryStats,
    registryIndex,
    validation,
  });

  const fingerprint = buildExportFingerprint(withoutFingerprint);
  const snapshotValid = validateDomainRegistrySnapshot(registrySnapshot).valid;
  const snapshotMatchesRegistry = validateSnapshotAgainstRegistry(registry, registrySnapshot).valid;
  const exportValid =
    validation.valid &&
    snapshotValid &&
    snapshotMatchesRegistry &&
    registryStats.totalDomains === domainCount &&
    registryIndex.dependencyIndex.entries.length === domainCount &&
    foundationManifest.metadataOnly === true &&
    foundationManifest.runtimeBehavior === false;

  return Object.freeze({
    ...withoutFingerprint,
    fingerprint,
    exportValid,
  });
}

export function validateDomainRegistryExportBundle(bundle: DomainRegistryExportBundle): DomainRegistryExportValidationResult {
  const issues: string[] = [];

  if (bundle.metadata.contractVersion !== DOMAIN_REGISTRY_EXPORT_CONTRACT_VERSION) {
    issues.push("Export bundle contract version must be DOM-1:4.");
  }

  if (bundle.metadata.deterministic !== true) {
    issues.push("Export bundle metadata must be deterministic.");
  }

  if (bundle.metadata.domainCount !== bundle.registrySnapshot.metadata.domainCount) {
    issues.push("Export metadata domain count must match snapshot domain count.");
  }

  if (bundle.metadata.domainCount !== bundle.registryStats.totalDomains) {
    issues.push("Export metadata domain count must match registry stats total.");
  }

  if (bundle.registryIndex.dependencyIndex.entries.length !== bundle.metadata.domainCount) {
    issues.push("Registry index entry count must match domain count.");
  }

  if (!bundle.validation.valid) {
    issues.push("Registry validation must pass for export bundle.");
  }

  if (!validateDomainRegistrySnapshot(bundle.registrySnapshot).valid) {
    issues.push("Registry snapshot must be valid.");
  }

  if (bundle.foundationManifest.metadataOnly !== true || bundle.foundationManifest.runtimeBehavior !== false) {
    issues.push("Foundation manifest must remain metadata-only.");
  }

  const expectedFingerprint = buildExportFingerprint(bundle);
  if (bundle.fingerprint !== expectedFingerprint) {
    issues.push("Export bundle fingerprint does not match bundle content.");
  }

  if (bundle.exportValid !== (issues.length === 0)) {
    issues.push("Export validity flag is inconsistent with bundle validation.");
  }

  return Object.freeze({
    valid: issues.length === 0 && bundle.exportValid,
    issues: Object.freeze(issues),
  });
}

export function compareDomainRegistryExportBundles(
  left: DomainRegistryExportBundle,
  right: DomainRegistryExportBundle
): DomainRegistryExportComparison {
  const metadataEqual =
    left.metadata.registryId === right.metadata.registryId &&
    left.metadata.frozen === right.metadata.frozen &&
    left.metadata.domainCount === right.metadata.domainCount &&
    left.metadata.contractVersion === right.metadata.contractVersion;

  return Object.freeze({
    equal: left.fingerprint === right.fingerprint && metadataEqual && left.validation.valid === right.validation.valid,
    fingerprintEqual: left.fingerprint === right.fingerprint,
    metadataEqual,
    validationEqual: left.validation.valid === right.validation.valid,
  });
}

export function isExportBundleReproducible(registry: DomainRegistry): boolean {
  const first = buildDomainRegistryExportBundle(registry);
  const second = buildDomainRegistryExportBundle(registry);
  return compareDomainRegistryExportBundles(first, second).equal;
}
