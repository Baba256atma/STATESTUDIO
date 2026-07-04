import { DomainFoundation } from "./domainFoundationIndex.ts";
import { DOMAIN_FOUNDATION_PUBLIC_APIS } from "./domainFoundationManifest.ts";
import { DomainRegistryQuery, DOMAIN_REGISTRY_QUERY_PUBLIC_APIS } from "./domainRegistryQueryIndex.ts";
import { DomainRegistryStatsLayer, DOMAIN_REGISTRY_STATS_PUBLIC_APIS } from "./domainRegistryStatsIndex.ts";
import {
  buildDomainRegistryExportBundle,
  isExportBundleReproducible,
  validateDomainRegistryExportBundle,
} from "./domainRegistryExport.ts";
import {
  DOMAIN_REGISTRY_EXPORT_CONTRACT_VERSION,
  type DomainRegistryCertificationGate,
  type DomainRegistryCertificationResult,
} from "./domainRegistryExportTypes.ts";
import type { DomainRegistry } from "./domainFoundationIndex.ts";
import { validateDomainRegistrySnapshot, validateSnapshotAgainstRegistry } from "./domainRegistryQueryIndex.ts";
import { runDomainRegistryRegression } from "./domainRegistryRegression.ts";

function gate(gateId: string, description: string, passed: boolean): DomainRegistryCertificationGate {
  return Object.freeze({ gateId, description, passed });
}

function arePublicApisAvailable(): boolean {
  const foundationApis = DOMAIN_FOUNDATION_PUBLIC_APIS.every((apiName) => {
    if (apiName === "DomainFoundation") {
      return typeof DomainFoundation === "object";
    }
    return typeof (DomainFoundation as Record<string, unknown>)[apiName] === "function";
  });

  const queryApis = DOMAIN_REGISTRY_QUERY_PUBLIC_APIS.every((apiName) => {
    if (apiName === "DomainRegistryQuery") {
      return typeof DomainRegistryQuery === "object";
    }
    return typeof (DomainRegistryQuery as Record<string, unknown>)[apiName] === "function";
  });

  const statsApis = DOMAIN_REGISTRY_STATS_PUBLIC_APIS.every((apiName) => {
    if (apiName === "DomainRegistryStatsLayer") {
      return typeof DomainRegistryStatsLayer === "object";
    }
    return typeof (DomainRegistryStatsLayer as Record<string, unknown>)[apiName] === "function";
  });

  return foundationApis && queryApis && statsApis;
}

function isStatsConsistent(bundle: ReturnType<typeof buildDomainRegistryExportBundle>): boolean {
  return (
    bundle.registryStats.totalDomains === bundle.metadata.domainCount &&
    bundle.registryStats.registryId === bundle.metadata.registryId &&
    bundle.registryStats.frozen === bundle.metadata.frozen &&
    bundle.registryStats.deterministic === true
  );
}

function isIndexConsistent(bundle: ReturnType<typeof buildDomainRegistryExportBundle>): boolean {
  return (
    bundle.registryIndex.registryId === bundle.metadata.registryId &&
    bundle.registryIndex.frozen === bundle.metadata.frozen &&
    bundle.registryIndex.dependencyIndex.entries.length === bundle.metadata.domainCount &&
    bundle.registryIndex.deterministic === true
  );
}

export function runDomainRegistryCertification(registry: DomainRegistry): DomainRegistryCertificationResult {
  const exportBundle = buildDomainRegistryExportBundle(registry);
  const exportValidation = validateDomainRegistryExportBundle(exportBundle);
  const snapshotValidation = validateDomainRegistrySnapshot(exportBundle.registrySnapshot);
  const snapshotRegistryValidation = validateSnapshotAgainstRegistry(registry, exportBundle.registrySnapshot);
  const regression = runDomainRegistryRegression();
  const reproducible = isExportBundleReproducible(registry);

  const gates: readonly DomainRegistryCertificationGate[] = Object.freeze([
    gate(
      "foundation-registry-valid",
      "Foundation registry validation passes.",
      exportBundle.validation.valid
    ),
    gate(
      "snapshot-valid",
      "Registry snapshot validation passes.",
      snapshotValidation.valid
    ),
    gate(
      "snapshot-matches-registry",
      "Registry snapshot matches live registry state.",
      snapshotRegistryValidation.valid
    ),
    gate(
      "stats-consistent",
      "Registry statistics are consistent with registry state.",
      isStatsConsistent(exportBundle)
    ),
    gate(
      "index-consistent",
      "Registry indexes are consistent with registry state.",
      isIndexConsistent(exportBundle)
    ),
    gate(
      "export-bundle-valid",
      "Export bundle validation passes.",
      exportValidation.valid && exportBundle.exportValid
    ),
    gate(
      "deterministic-reproducibility",
      "Export bundle generation is deterministically reproducible.",
      reproducible
    ),
    gate(
      "frozen-registry-readable",
      "Frozen registry state can be exported read-only.",
      registry.frozen ? exportBundle.metadata.frozen === true && exportValidation.valid : true
    ),
    gate(
      "public-apis-available",
      "DOM-1:1 through DOM-1:3 public APIs are available.",
      arePublicApisAvailable()
    ),
    gate(
      "regression-suite-passes",
      "DOM-1 foundation regression suite passes.",
      regression.failed === 0 && regression.passed === regression.totalTests
    ),
    gate(
      "metadata-only-export",
      "Export bundle remains metadata-only with no runtime behavior.",
      exportBundle.foundationManifest.metadataOnly === true &&
        exportBundle.foundationManifest.runtimeBehavior === false
    ),
  ]);

  const passed = gates.every((entry) => entry.passed);

  return Object.freeze({
    contractVersion: DOMAIN_REGISTRY_EXPORT_CONTRACT_VERSION,
    status: passed ? "PASS" : "FAIL",
    gates,
    exportBundle,
  });
}
