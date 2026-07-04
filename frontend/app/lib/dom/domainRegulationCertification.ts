import {
  buildDomainFoundationManifest,
  validateDomainFoundation,
} from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import { DomainKpiPlatformFreeze } from "./domainKpiPlatformFreezeIndex.ts";
import {
  createDomainRegulationRegistry,
  freezeDomainRegulationRegistry,
  registerDomainRegulationPackage,
  validateDomainRegulationFoundation,
  validateDomainRegulationRegistry,
  type DomainRegulationPackage,
  type DomainRegulationRegistry,
} from "./domainRegulationIndex.ts";
import {
  DomainRegulationQueryLayer,
  buildDomainRegulationReferenceLookup,
  buildDomainRegulationSnapshot,
  diffDomainRegulationSnapshots,
  findDomainRegulation,
  queryDomainRegulationPackages,
  validateDomainRegulationSnapshot,
} from "./domainRegulationQueryIndex.ts";
import {
  buildDomainRegulationExportBundle,
  compareDomainRegulationExportBundles,
  validateDomainRegulationExportBundle,
} from "./domainRegulationExport.ts";
import {
  DOMAIN_REGULATION_EXPORT_CONTRACT_VERSION,
  type DomainRegulationCertificationDiagnostic,
  type DomainRegulationCertificationGate,
  type DomainRegulationCertificationResult,
} from "./domainRegulationExportTypes.ts";

function gate(gateId: string, description: string, passed: boolean): DomainRegulationCertificationGate {
  return Object.freeze({ gateId, description, passed });
}

function diagnosticFromGate(gateResult: DomainRegulationCertificationGate): DomainRegulationCertificationDiagnostic {
  return Object.freeze({
    code: gateResult.passed ? "certification_gate_passed" : "certification_gate_failed",
    message: gateResult.description,
    gateId: gateResult.gateId,
    severity: gateResult.passed ? "info" : "error",
  });
}

function placeholderRegulationPackage(
  description = "Neutral placeholder regulation package metadata."
): DomainRegulationPackage {
  return Object.freeze({
    contractVersion: "DOM-5:1",
    regulationPackageId: "regulation-package.certification.core",
    domainId: "domain.regulation-certification",
    name: "Regulation Certification Fixture",
    description,
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    jurisdictionScope: "unspecified",
    status: "active",
    regulations: Object.freeze([
      Object.freeze({
        regulationId: "regulation.certification.primary",
        label: "Certification Regulation",
        description: "Neutral placeholder regulation metadata.",
        reference: Object.freeze({
          domainId: "domain.regulation-certification",
          vocabularyId: "vocabulary.certification.core",
          termId: "term.certification.primary",
          ontologyId: "ontology.certification.core",
          entityTypeId: "entity.certification.source",
          attributeId: "attribute.certification.value",
          kpiPackageId: "kpi-package.certification.core",
          kpiId: "kpi.certification.primary",
        }),
        scope: "domain",
        jurisdictionScope: "unspecified",
        status: "active",
      }),
    ]),
    obligations: Object.freeze([
      Object.freeze({
        obligationId: "obligation.certification.primary",
        regulationId: "regulation.certification.primary",
        label: "Certification Obligation",
        description: "Neutral placeholder obligation metadata.",
        controlIds: Object.freeze(["control.certification.primary"]),
        scope: "domain",
        status: "active",
      }),
    ]),
    controls: Object.freeze([
      Object.freeze({
        controlId: "control.certification.primary",
        label: "Certification Control",
        description: "Neutral placeholder control metadata.",
        evidenceIds: Object.freeze(["evidence.certification.primary"]),
        scope: "domain",
        status: "active",
      }),
    ]),
    evidence: Object.freeze([
      Object.freeze({
        evidenceId: "evidence.certification.primary",
        label: "Certification Evidence",
        description: "Neutral placeholder evidence metadata.",
        sourceDescription: "Neutral placeholder source metadata.",
        scope: "domain",
        status: "active",
      }),
    ]),
  });
}

function certificationFixtureRegistry(description?: string): DomainRegulationRegistry {
  return registerDomainRegulationPackage(
    createDomainRegulationRegistry(),
    placeholderRegulationPackage(description)
  ).registry;
}

function hasQueryCapability(): boolean {
  return (
    typeof DomainRegulationQueryLayer.queryDomainRegulationPackages === "function" &&
    typeof DomainRegulationQueryLayer.findRegulationPackagesByDomain === "function" &&
    typeof DomainRegulationQueryLayer.sortDomainRegulationPackages === "function"
  );
}

function hasLookupCapability(): boolean {
  const fixture = certificationFixtureRegistry();
  return (
    typeof DomainRegulationQueryLayer.findDomainRegulation === "function" &&
    typeof DomainRegulationQueryLayer.findDomainObligation === "function" &&
    typeof DomainRegulationQueryLayer.findDomainControl === "function" &&
    typeof DomainRegulationQueryLayer.findDomainEvidence === "function" &&
    findDomainRegulation(fixture, "regulation.certification.primary").found
  );
}

function hasReferenceInspectionCapability(): boolean {
  const fixture = certificationFixtureRegistry();
  const lookup = buildDomainRegulationReferenceLookup(fixture, "attribute.certification.value");
  return (
    typeof DomainRegulationQueryLayer.buildDomainRegulationReferenceLookup === "function" &&
    typeof DomainRegulationQueryLayer.findRegulationsReferencingOntologyAttribute === "function" &&
    lookup.matches.length === 1
  );
}

function snapshotDiffPasses(): boolean {
  const left = buildDomainRegulationSnapshot(certificationFixtureRegistry());
  const right = buildDomainRegulationSnapshot(
    certificationFixtureRegistry("Modified neutral placeholder regulation package metadata.")
  );
  return diffDomainRegulationSnapshots(left, right).entries.some((entry) => entry.type === "modified");
}

function domCompatibilityPasses(): boolean {
  return (
    validateDomainFoundation().valid &&
    buildDomainFoundationManifest().metadataOnly === true &&
    DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status === "PASS" &&
    DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze().status === "PASS" &&
    DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze().status === "PASS"
  );
}

export function runDomainRegulationCertification(
  registry: DomainRegulationRegistry
): DomainRegulationCertificationResult {
  const exportBundle = buildDomainRegulationExportBundle(registry);
  const secondBundle = buildDomainRegulationExportBundle(registry);
  const exportValidation = validateDomainRegulationExportBundle(exportBundle);
  const snapshotValidation = validateDomainRegulationSnapshot(exportBundle.regulationSnapshot);
  const reproducible = compareDomainRegulationExportBundles(exportBundle, secondBundle).equal;
  const frozenRegistry = freezeDomainRegulationRegistry(registry);
  const frozenBundle = buildDomainRegulationExportBundle(frozenRegistry);

  const gates: readonly DomainRegulationCertificationGate[] = Object.freeze([
    gate("regulation-foundation-valid", "Regulation foundation validation passes.", validateDomainRegulationFoundation().valid),
    gate("registry-valid", "Regulation registry validation passes.", validateDomainRegulationRegistry(registry).valid),
    gate("snapshot-valid", "Regulation snapshot validation passes.", snapshotValidation.valid),
    gate("export-bundle-valid", "Regulation export bundle validation passes.", exportValidation.valid),
    gate("deterministic-reproducibility", "Export bundle generation is deterministically reproducible.", reproducible),
    gate(
      "query-capability-available",
      "Regulation query capability APIs are available and callable.",
      hasQueryCapability() && Array.isArray(queryDomainRegulationPackages(registry))
    ),
    gate("lookup-capability-available", "Regulation lookup capability APIs are available and callable.", hasLookupCapability()),
    gate(
      "reference-inspection-capability-available",
      "Regulation direct reference inspection APIs are available without semantic matching.",
      hasReferenceInspectionCapability()
    ),
    gate(
      "snapshot-diff-capability",
      "Regulation snapshot diff capability detects deterministic metadata changes.",
      snapshotDiffPasses()
    ),
    gate(
      "frozen-registry-readable",
      "Frozen regulation registry can be read and exported.",
      frozenBundle.metadata.frozen === true && validateDomainRegulationExportBundle(frozenBundle).valid
    ),
    gate("dom-1-compatibility", "DOM-1 foundation public APIs remain compatible.", validateDomainFoundation().valid),
    gate(
      "dom-2-compatibility",
      "DOM-2 vocabulary platform public APIs remain compatible.",
      DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status === "PASS"
    ),
    gate(
      "dom-3-compatibility",
      "DOM-3 ontology platform public APIs remain compatible.",
      DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze().status === "PASS"
    ),
    gate(
      "dom-4-compatibility",
      "DOM-4 KPI platform public APIs remain compatible.",
      DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze().status === "PASS" && domCompatibilityPasses()
    ),
    gate(
      "metadata-only-boundary",
      "Regulation certification remains metadata-only with no runtime behavior.",
      exportBundle.metadata.metadataOnly &&
        !exportBundle.metadata.runtimeBehavior &&
        exportBundle.regulationManifest.metadataOnly &&
        !exportBundle.regulationManifest.runtimeBehavior &&
        exportBundle.referenceInspectionCapability.metadataOnly &&
        !exportBundle.referenceInspectionCapability.runtimeBehavior
    ),
  ]);

  const passed = gates.every((entry) => entry.passed);

  return Object.freeze({
    contractVersion: DOMAIN_REGULATION_EXPORT_CONTRACT_VERSION,
    status: passed ? "PASS" : "FAIL",
    gates,
    diagnostics: Object.freeze(gates.map(diagnosticFromGate)),
    exportBundle,
  });
}
