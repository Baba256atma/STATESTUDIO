import { buildDomainFoundationManifest, validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import { DomainKpiPlatformFreeze } from "./domainKpiPlatformFreezeIndex.ts";
import { DomainRegulationCertificationLayer } from "./domainRegulationCertificationIndex.ts";
import {
  createDomainReasoningRegistry,
  freezeDomainReasoningRegistry,
  registerDomainReasoningPackage,
  validateDomainReasoningFoundation,
  validateDomainReasoningRegistry,
  type DomainReasoningPackage,
  type DomainReasoningRegistry,
} from "./domainReasoningIndex.ts";
import {
  DomainReasoningQueryLayer,
  buildDomainReasoningReferenceLookup,
  buildDomainReasoningSnapshot,
  diffDomainReasoningSnapshots,
  findDomainReasoningContract,
  queryDomainReasoningPackages,
  validateDomainReasoningSnapshot,
} from "./domainReasoningQueryIndex.ts";
import {
  buildDomainReasoningExportBundle,
  compareDomainReasoningExportBundles,
  validateDomainReasoningExportBundle,
} from "./domainReasoningExport.ts";
import {
  DOMAIN_REASONING_EXPORT_CONTRACT_VERSION,
  type DomainReasoningCertificationDiagnostic,
  type DomainReasoningCertificationGate,
  type DomainReasoningCertificationResult,
} from "./domainReasoningExportTypes.ts";

function gate(gateId: string, description: string, passed: boolean): DomainReasoningCertificationGate {
  return Object.freeze({ gateId, description, passed });
}

function diagnosticFromGate(gateResult: DomainReasoningCertificationGate): DomainReasoningCertificationDiagnostic {
  return Object.freeze({
    code: gateResult.passed ? "certification_gate_passed" : "certification_gate_failed",
    message: gateResult.description,
    gateId: gateResult.gateId,
    severity: gateResult.passed ? "info" : "error",
  });
}

function placeholderReasoningPackage(description = "Neutral placeholder reasoning package metadata."): DomainReasoningPackage {
  return Object.freeze({
    contractVersion: "DOM-6:1",
    reasoningPackageId: "reasoning-package.certification.core",
    domainId: "domain.reasoning-certification",
    name: "Reasoning Certification Fixture",
    description,
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    contracts: Object.freeze([
      Object.freeze({
        contractId: "reasoning-contract.certification.primary",
        label: "Certification Reasoning Contract",
        description: "Neutral placeholder reasoning contract metadata.",
        scope: "domain",
        status: "active",
        inputs: Object.freeze([
          Object.freeze({
            inputId: "input.certification.primary",
            label: "Certification Input",
            description: "Neutral input metadata.",
            required: true,
            reference: Object.freeze({
              domainId: "domain.reasoning-certification",
              vocabularyId: "vocabulary.certification.core",
              termId: "term.certification.primary",
              ontologyId: "ontology.certification.core",
              entityTypeId: "entity.certification.source",
              attributeId: "attribute.certification.value",
            }),
          }),
        ]),
        outputs: Object.freeze([
          Object.freeze({
            outputId: "output.certification.primary",
            label: "Certification Output",
            description: "Neutral output metadata.",
            reference: Object.freeze({
              domainId: "domain.reasoning-certification",
              kpiPackageId: "kpi-package.certification.core",
              kpiId: "kpi.certification.primary",
            }),
          }),
        ]),
        evidenceRequirements: Object.freeze([
          Object.freeze({
            evidenceRequirementId: "evidence-requirement.certification.primary",
            label: "Certification Evidence Requirement",
            description: "Neutral evidence requirement metadata.",
            required: true,
            reference: Object.freeze({
              domainId: "domain.reasoning-certification",
              regulationPackageId: "regulation-package.certification.core",
              regulationId: "regulation.certification.primary",
            }),
          }),
        ]),
        assumptions: Object.freeze([
          Object.freeze({
            assumptionId: "assumption.certification.primary",
            label: "Certification Assumption",
            description: "Neutral assumption metadata.",
            required: true,
            uncertaintyImpact: "medium",
          }),
        ]),
        confidence: Object.freeze({
          required: true,
          evidenceCoverageRequired: true,
          assumptionCoverageRequired: true,
          explanation: "Confidence metadata is structurally required.",
        }),
        uncertainty: Object.freeze({
          required: true,
          sources: Object.freeze(["assumption", "evidence"]),
          explanation: "Uncertainty metadata is structurally required.",
        }),
        trace: Object.freeze({
          required: true,
          traceInputIds: Object.freeze(["input.certification.primary"]),
          traceOutputIds: Object.freeze(["output.certification.primary"]),
          traceEvidenceRequirementIds: Object.freeze(["evidence-requirement.certification.primary"]),
          traceAssumptionIds: Object.freeze(["assumption.certification.primary"]),
        }),
      }),
    ]),
  });
}

function certificationFixtureRegistry(description?: string): DomainReasoningRegistry {
  return registerDomainReasoningPackage(createDomainReasoningRegistry(), placeholderReasoningPackage(description)).registry;
}

function hasQueryCapability(): boolean {
  return (
    typeof DomainReasoningQueryLayer.queryDomainReasoningPackages === "function" &&
    typeof DomainReasoningQueryLayer.findReasoningPackagesByDomain === "function" &&
    typeof DomainReasoningQueryLayer.sortDomainReasoningPackages === "function"
  );
}

function hasLookupCapability(): boolean {
  const fixture = certificationFixtureRegistry();
  return (
    typeof DomainReasoningQueryLayer.findDomainReasoningContract === "function" &&
    typeof DomainReasoningQueryLayer.findReasoningInputs === "function" &&
    typeof DomainReasoningQueryLayer.findReasoningOutputs === "function" &&
    findDomainReasoningContract(fixture, "reasoning-contract.certification.primary").found
  );
}

function hasReferenceInspectionCapability(): boolean {
  const fixture = certificationFixtureRegistry();
  const lookup = buildDomainReasoningReferenceLookup(fixture, "attribute.certification.value");
  return (
    typeof DomainReasoningQueryLayer.buildDomainReasoningReferenceLookup === "function" &&
    typeof DomainReasoningQueryLayer.findReasoningReferencingOntologyAttribute === "function" &&
    lookup.matches.length === 1
  );
}

function snapshotDiffPasses(): boolean {
  const left = buildDomainReasoningSnapshot(certificationFixtureRegistry());
  const right = buildDomainReasoningSnapshot(
    certificationFixtureRegistry("Modified neutral placeholder reasoning package metadata.")
  );
  return diffDomainReasoningSnapshots(left, right).entries.some((entry) => entry.type === "modified");
}

function domCompatibilityPasses(): boolean {
  return (
    validateDomainFoundation().valid &&
    buildDomainFoundationManifest().metadataOnly === true &&
    DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status === "PASS" &&
    DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze().status === "PASS" &&
    DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze().status === "PASS" &&
    DomainRegulationCertificationLayer.runDomainRegulationRegression().failed === 0
  );
}

export function runDomainReasoningCertification(registry: DomainReasoningRegistry): DomainReasoningCertificationResult {
  const exportBundle = buildDomainReasoningExportBundle(registry);
  const secondBundle = buildDomainReasoningExportBundle(registry);
  const exportValidation = validateDomainReasoningExportBundle(exportBundle);
  const snapshotValidation = validateDomainReasoningSnapshot(exportBundle.reasoningSnapshot);
  const reproducible = compareDomainReasoningExportBundles(exportBundle, secondBundle).equal;
  const frozenRegistry = freezeDomainReasoningRegistry(registry);
  const frozenBundle = buildDomainReasoningExportBundle(frozenRegistry);

  const gates: readonly DomainReasoningCertificationGate[] = Object.freeze([
    gate("reasoning-foundation-valid", "Reasoning foundation validation passes.", validateDomainReasoningFoundation().valid),
    gate("registry-valid", "Reasoning registry validation passes.", validateDomainReasoningRegistry(registry).valid),
    gate("snapshot-valid", "Reasoning snapshot validation passes.", snapshotValidation.valid),
    gate("export-bundle-valid", "Reasoning export bundle validation passes.", exportValidation.valid),
    gate("deterministic-reproducibility", "Export bundle generation is deterministically reproducible.", reproducible),
    gate(
      "query-capability-available",
      "Reasoning query capability APIs are available and callable.",
      hasQueryCapability() && Array.isArray(queryDomainReasoningPackages(registry))
    ),
    gate("lookup-capability-available", "Reasoning lookup capability APIs are available and callable.", hasLookupCapability()),
    gate(
      "reference-inspection-capability-available",
      "Reasoning direct reference inspection APIs are available without semantic matching.",
      hasReferenceInspectionCapability()
    ),
    gate("snapshot-diff-capability", "Reasoning snapshot diff capability detects deterministic metadata changes.", snapshotDiffPasses()),
    gate(
      "frozen-registry-readable",
      "Frozen reasoning registry can be read and exported.",
      frozenBundle.metadata.frozen === true && validateDomainReasoningExportBundle(frozenBundle).valid
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
      DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze().status === "PASS"
    ),
    gate(
      "dom-5-compatibility",
      "DOM-5 regulation platform public APIs remain compatible.",
      DomainRegulationCertificationLayer.runDomainRegulationRegression().failed === 0 && domCompatibilityPasses()
    ),
    gate(
      "metadata-only-boundary",
      "Reasoning certification remains metadata-only with no runtime behavior.",
      exportBundle.metadata.metadataOnly &&
        !exportBundle.metadata.runtimeBehavior &&
        exportBundle.reasoningManifest.metadataOnly &&
        !exportBundle.reasoningManifest.runtimeBehavior &&
        exportBundle.reasoningManifest.reasoningEngine === false &&
        exportBundle.referenceInspectionCapability.metadataOnly &&
        !exportBundle.referenceInspectionCapability.runtimeBehavior
    ),
  ]);

  const passed = gates.every((entry) => entry.passed);

  return Object.freeze({
    contractVersion: DOMAIN_REASONING_EXPORT_CONTRACT_VERSION,
    status: passed ? "PASS" : "FAIL",
    gates,
    diagnostics: Object.freeze(gates.map(diagnosticFromGate)),
    exportBundle,
  });
}
