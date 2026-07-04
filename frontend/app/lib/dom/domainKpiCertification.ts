import {
  buildDomainFoundationManifest,
  validateDomainFoundation,
} from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import {
  createDomainKpiRegistry,
  freezeDomainKpiRegistry,
  registerDomainKpiPackage,
  validateDomainKpiFoundation,
  validateDomainKpiRegistry,
  type DomainKpiPackage,
  type DomainKpiRegistry,
} from "./domainKpiIndex.ts";
import {
  DomainKpiQueryLayer,
  buildDomainKpiReferenceLookup,
  buildDomainKpiSnapshot,
  diffDomainKpiSnapshots,
  findDomainKpi,
  queryDomainKpiPackages,
  validateDomainKpiSnapshot,
} from "./domainKpiQueryIndex.ts";
import {
  buildDomainKpiExportBundle,
  compareDomainKpiExportBundles,
  validateDomainKpiExportBundle,
} from "./domainKpiExport.ts";
import {
  DOMAIN_KPI_EXPORT_CONTRACT_VERSION,
  type DomainKpiCertificationGate,
  type DomainKpiCertificationResult,
} from "./domainKpiExportTypes.ts";

function gate(gateId: string, description: string, passed: boolean): DomainKpiCertificationGate {
  return Object.freeze({ gateId, description, passed });
}

function placeholderKpiPackage(description = "Neutral placeholder KPI package metadata."): DomainKpiPackage {
  return Object.freeze({
    contractVersion: "DOM-4:1",
    kpiPackageId: "kpi-package.certification.core",
    domainId: "domain.kpi-certification",
    name: "KPI Certification Fixture",
    description,
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    kpis: Object.freeze([
      Object.freeze({
        kpiId: "kpi.certification.primary",
        label: "Certification KPI",
        description: "Neutral placeholder KPI metadata.",
        intent: Object.freeze({
          label: "Certification Intent",
          description: "Neutral measurement intent metadata.",
          direction: "neutral",
        }),
        unit: Object.freeze({
          unitType: "count",
          unitLabel: "items",
          precision: 0,
        }),
        aggregation: Object.freeze({
          aggregationType: "sum",
          window: "monthly",
          description: "Neutral aggregation metadata.",
        }),
        reference: Object.freeze({
          vocabularyId: "vocabulary.certification.core",
          ontologyId: "relationship.certification.link",
          entityTypeId: "entity.certification.source",
          attributeId: "attribute.certification.value",
        }),
        scope: "domain",
        status: "active",
      }),
    ]),
  });
}

function certificationFixtureRegistry(description?: string): DomainKpiRegistry {
  return registerDomainKpiPackage(createDomainKpiRegistry(), placeholderKpiPackage(description)).registry;
}

function hasQueryCapability(): boolean {
  return (
    typeof DomainKpiQueryLayer.queryDomainKpiPackages === "function" &&
    typeof DomainKpiQueryLayer.findKpiPackagesByDomain === "function" &&
    typeof DomainKpiQueryLayer.sortDomainKpiPackages === "function"
  );
}

function hasLookupCapability(): boolean {
  const fixture = certificationFixtureRegistry();
  return (
    typeof DomainKpiQueryLayer.findDomainKpi === "function" &&
    typeof DomainKpiQueryLayer.findKpisByUnitType === "function" &&
    typeof DomainKpiQueryLayer.findKpisByAggregationType === "function" &&
    typeof DomainKpiQueryLayer.findKpisByDirection === "function" &&
    findDomainKpi(fixture, "kpi.certification.primary").found
  );
}

function hasReferenceInspectionCapability(): boolean {
  const fixture = certificationFixtureRegistry();
  const lookup = buildDomainKpiReferenceLookup(fixture, "attribute.certification.value");
  return (
    typeof DomainKpiQueryLayer.buildDomainKpiReferenceLookup === "function" &&
    typeof DomainKpiQueryLayer.findKpisReferencingOntologyAttribute === "function" &&
    lookup.matches.length === 1
  );
}

function snapshotDiffPasses(): boolean {
  const left = buildDomainKpiSnapshot(certificationFixtureRegistry());
  const right = buildDomainKpiSnapshot(certificationFixtureRegistry("Modified neutral placeholder KPI package metadata."));
  return diffDomainKpiSnapshots(left, right).entries.some((entry) => entry.type === "modified");
}

function hasDomCompatibility(): boolean {
  const vocabularyFreeze = DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze();
  const ontologyFreeze = DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze();
  return (
    validateDomainFoundation().valid &&
    buildDomainFoundationManifest().metadataOnly === true &&
    vocabularyFreeze.status === "PASS" &&
    ontologyFreeze.status === "PASS"
  );
}

export function runDomainKpiCertification(registry: DomainKpiRegistry): DomainKpiCertificationResult {
  const exportBundle = buildDomainKpiExportBundle(registry);
  const secondBundle = buildDomainKpiExportBundle(registry);
  const exportValidation = validateDomainKpiExportBundle(exportBundle);
  const snapshotValidation = validateDomainKpiSnapshot(exportBundle.kpiSnapshot);
  const reproducible = compareDomainKpiExportBundles(exportBundle, secondBundle).equal;
  const frozenRegistry = freezeDomainKpiRegistry(registry);
  const frozenBundle = buildDomainKpiExportBundle(frozenRegistry);

  const gates: readonly DomainKpiCertificationGate[] = Object.freeze([
    gate("kpi-foundation-valid", "KPI foundation validation passes.", validateDomainKpiFoundation().valid),
    gate("registry-valid", "KPI registry validation passes.", validateDomainKpiRegistry(registry).valid),
    gate("snapshot-valid", "KPI snapshot validation passes.", snapshotValidation.valid),
    gate("export-bundle-valid", "KPI export bundle validation passes.", exportValidation.valid),
    gate("deterministic-reproducibility", "Export bundle generation is deterministically reproducible.", reproducible),
    gate(
      "query-capability-available",
      "KPI query capability APIs are available and callable.",
      hasQueryCapability() && Array.isArray(queryDomainKpiPackages(registry))
    ),
    gate("lookup-capability-available", "KPI lookup capability APIs are available and callable.", hasLookupCapability()),
    gate(
      "reference-inspection-capability-available",
      "KPI direct reference inspection APIs are available without semantic matching.",
      hasReferenceInspectionCapability()
    ),
    gate("snapshot-diff-capability", "KPI snapshot diff capability detects deterministic metadata changes.", snapshotDiffPasses()),
    gate(
      "frozen-registry-readable",
      "Frozen KPI registry can be read and exported.",
      frozenBundle.metadata.frozen === true && validateDomainKpiExportBundle(frozenBundle).valid
    ),
    gate("dom-1-compatibility", "DOM-1 foundation public APIs remain compatible.", validateDomainFoundation().valid),
    gate("dom-2-compatibility", "DOM-2 vocabulary platform public APIs remain compatible.", DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status === "PASS"),
    gate("dom-3-compatibility", "DOM-3 ontology platform public APIs remain compatible.", hasDomCompatibility()),
    gate(
      "metadata-only-boundary",
      "KPI certification remains metadata-only with no runtime behavior.",
      exportBundle.metadata.metadataOnly &&
        !exportBundle.metadata.runtimeBehavior &&
        exportBundle.kpiManifest.metadataOnly &&
        !exportBundle.kpiManifest.runtimeBehavior &&
        exportBundle.referenceInspectionCapability.metadataOnly &&
        !exportBundle.referenceInspectionCapability.runtimeBehavior
    ),
  ]);

  const passed = gates.every((entry) => entry.passed);

  return Object.freeze({
    contractVersion: DOMAIN_KPI_EXPORT_CONTRACT_VERSION,
    status: passed ? "PASS" : "FAIL",
    gates,
    exportBundle,
  });
}
