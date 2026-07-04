import { buildDomainFoundationManifest, validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import { DomainKpiPlatformFreeze } from "./domainKpiPlatformFreezeIndex.ts";
import { DomainRegulationCertificationLayer } from "./domainRegulationCertificationIndex.ts";
import { DomainReasoningPlatformFreeze } from "./domainReasoningPlatformFreezeIndex.ts";
import {
  createDomainRecommendationRegistry,
  freezeDomainRecommendationRegistry,
  registerDomainRecommendationPackage,
  validateDomainRecommendationFoundation,
  validateDomainRecommendationRegistry,
  type DomainRecommendationPackage,
  type DomainRecommendationRegistry,
} from "./domainRecommendationIndex.ts";
import {
  DomainRecommendationQueryLayer,
  buildDomainRecommendationReferenceLookup,
  buildDomainRecommendationSnapshot,
  diffDomainRecommendationSnapshots,
  findDomainRecommendationContract,
  queryDomainRecommendationPackages,
  validateDomainRecommendationSnapshot,
} from "./domainRecommendationQueryIndex.ts";
import {
  buildDomainRecommendationExportBundle,
  compareDomainRecommendationExportBundles,
  validateDomainRecommendationExportBundle,
} from "./domainRecommendationExport.ts";
import {
  DOMAIN_RECOMMENDATION_EXPORT_CONTRACT_VERSION,
  type DomainRecommendationCertificationDiagnostic,
  type DomainRecommendationCertificationGate,
  type DomainRecommendationCertificationResult,
} from "./domainRecommendationExportTypes.ts";

function gate(gateId: string, description: string, passed: boolean): DomainRecommendationCertificationGate {
  return Object.freeze({ gateId, description, passed });
}

function diagnosticFromGate(gateResult: DomainRecommendationCertificationGate): DomainRecommendationCertificationDiagnostic {
  return Object.freeze({
    code: gateResult.passed ? "certification_gate_passed" : "certification_gate_failed",
    message: gateResult.description,
    gateId: gateResult.gateId,
    severity: gateResult.passed ? "info" : "error",
  });
}

function placeholderRecommendationPackage(description = "Neutral placeholder recommendation package metadata."): DomainRecommendationPackage {
  return Object.freeze({
    contractVersion: "DOM-7:1",
    recommendationPackageId: "recommendation-package.certification.core",
    domainId: "domain.recommendation-certification",
    name: "Recommendation Certification Fixture",
    description,
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    contracts: Object.freeze([
      Object.freeze({
        contractId: "recommendation-contract.certification.primary",
        label: "Certification Recommendation Contract",
        description: "Neutral placeholder recommendation contract metadata.",
        scope: "domain",
        status: "active",
        inputs: Object.freeze([
          Object.freeze({
            inputId: "input.certification.primary",
            label: "Certification Input",
            description: "Neutral input metadata.",
            required: true,
            reference: Object.freeze({
              domainId: "domain.recommendation-certification",
              reasoningPackageId: "reasoning-package.certification.core",
              reasoningContractId: "reasoning-contract.certification.primary",
            }),
          }),
        ]),
        outputs: Object.freeze([
          Object.freeze({
            outputId: "output.certification.primary",
            label: "Certification Output",
            description: "Neutral output metadata.",
          }),
        ]),
        rationale: Object.freeze({
          required: true,
          rationaleInputs: Object.freeze(["input.certification.primary"]),
          rationaleAssumptions: Object.freeze(["assumption.certification.primary"]),
          explanation: "Rationale metadata is structurally required.",
        }),
        constraints: Object.freeze([
          Object.freeze({
            constraintId: "constraint.certification.primary",
            label: "Certification Constraint",
            description: "Neutral constraint metadata.",
            required: true,
            severity: "warning",
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
          rationaleCoverageRequired: true,
          explanation: "Confidence metadata is structurally required.",
        }),
        uncertainty: Object.freeze({
          required: true,
          sources: Object.freeze(["assumption", "constraint"]),
          explanation: "Uncertainty metadata is structurally required.",
        }),
        trace: Object.freeze({
          required: true,
          traceInputIds: Object.freeze(["input.certification.primary"]),
          traceOutputIds: Object.freeze(["output.certification.primary"]),
          traceConstraintIds: Object.freeze(["constraint.certification.primary"]),
          traceAssumptionIds: Object.freeze(["assumption.certification.primary"]),
        }),
      }),
    ]),
  });
}

function certificationFixtureRegistry(description?: string): DomainRecommendationRegistry {
  return registerDomainRecommendationPackage(createDomainRecommendationRegistry(), placeholderRecommendationPackage(description)).registry;
}

function hasQueryCapability(): boolean {
  return (
    typeof DomainRecommendationQueryLayer.queryDomainRecommendationPackages === "function" &&
    typeof DomainRecommendationQueryLayer.findRecommendationPackagesByDomain === "function" &&
    typeof DomainRecommendationQueryLayer.sortDomainRecommendationPackages === "function"
  );
}

function hasLookupCapability(): boolean {
  const fixture = certificationFixtureRegistry();
  return (
    typeof DomainRecommendationQueryLayer.findDomainRecommendationContract === "function" &&
    typeof DomainRecommendationQueryLayer.findRecommendationInputs === "function" &&
    typeof DomainRecommendationQueryLayer.findRecommendationOutputs === "function" &&
    findDomainRecommendationContract(fixture, "recommendation-contract.certification.primary").found
  );
}

function hasReferenceInspectionCapability(): boolean {
  const fixture = certificationFixtureRegistry();
  const lookup = buildDomainRecommendationReferenceLookup(fixture, "reasoning-contract.certification.primary");
  return (
    typeof DomainRecommendationQueryLayer.buildDomainRecommendationReferenceLookup === "function" &&
    typeof DomainRecommendationQueryLayer.findRecommendationsReferencingReasoning === "function" &&
    lookup.matches.length === 1
  );
}

function snapshotDiffPasses(): boolean {
  const left = buildDomainRecommendationSnapshot(certificationFixtureRegistry());
  const right = buildDomainRecommendationSnapshot(
    certificationFixtureRegistry("Modified neutral placeholder recommendation package metadata.")
  );
  return diffDomainRecommendationSnapshots(left, right).entries.some((entry) => entry.type === "modified");
}

function domCompatibilityPasses(): boolean {
  return (
    validateDomainFoundation().valid &&
    buildDomainFoundationManifest().metadataOnly === true &&
    DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status === "PASS" &&
    DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze().status === "PASS" &&
    DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze().status === "PASS" &&
    DomainRegulationCertificationLayer.runDomainRegulationRegression().failed === 0 &&
    DomainReasoningPlatformFreeze.runDomainReasoningPlatformFreeze().status === "PASS"
  );
}

export function runDomainRecommendationCertification(
  registry: DomainRecommendationRegistry
): DomainRecommendationCertificationResult {
  const exportBundle = buildDomainRecommendationExportBundle(registry);
  const secondBundle = buildDomainRecommendationExportBundle(registry);
  const exportValidation = validateDomainRecommendationExportBundle(exportBundle);
  const snapshotValidation = validateDomainRecommendationSnapshot(exportBundle.recommendationSnapshot);
  const reproducible = compareDomainRecommendationExportBundles(exportBundle, secondBundle).equal;
  const frozenRegistry = freezeDomainRecommendationRegistry(registry);
  const frozenBundle = buildDomainRecommendationExportBundle(frozenRegistry);

  const gates: readonly DomainRecommendationCertificationGate[] = Object.freeze([
    gate("recommendation-foundation-valid", "Recommendation foundation validation passes.", validateDomainRecommendationFoundation().valid),
    gate("registry-valid", "Recommendation registry validation passes.", validateDomainRecommendationRegistry(registry).valid),
    gate("snapshot-valid", "Recommendation snapshot validation passes.", snapshotValidation.valid),
    gate("export-bundle-valid", "Recommendation export bundle validation passes.", exportValidation.valid),
    gate("deterministic-reproducibility", "Export bundle generation is deterministically reproducible.", reproducible),
    gate(
      "query-capability-available",
      "Recommendation query capability APIs are available and callable.",
      hasQueryCapability() && Array.isArray(queryDomainRecommendationPackages(registry))
    ),
    gate("lookup-capability-available", "Recommendation lookup capability APIs are available and callable.", hasLookupCapability()),
    gate(
      "reference-inspection-capability-available",
      "Recommendation direct reference inspection APIs are available without semantic matching.",
      hasReferenceInspectionCapability()
    ),
    gate("snapshot-diff-capability", "Recommendation snapshot diff capability detects deterministic metadata changes.", snapshotDiffPasses()),
    gate(
      "frozen-registry-readable",
      "Frozen recommendation registry can be read and exported.",
      frozenBundle.metadata.frozen === true && validateDomainRecommendationExportBundle(frozenBundle).valid
    ),
    gate("dom-1-compatibility", "DOM-1 foundation public APIs remain compatible.", validateDomainFoundation().valid),
    gate("dom-2-compatibility", "DOM-2 vocabulary platform public APIs remain compatible.", DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status === "PASS"),
    gate("dom-3-compatibility", "DOM-3 ontology platform public APIs remain compatible.", DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze().status === "PASS"),
    gate("dom-4-compatibility", "DOM-4 KPI platform public APIs remain compatible.", DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze().status === "PASS"),
    gate("dom-5-compatibility", "DOM-5 regulation platform public APIs remain compatible.", DomainRegulationCertificationLayer.runDomainRegulationRegression().failed === 0),
    gate("dom-6-compatibility", "DOM-6 reasoning platform public APIs remain compatible.", DomainReasoningPlatformFreeze.runDomainReasoningPlatformFreeze().status === "PASS" && domCompatibilityPasses()),
    gate(
      "metadata-only-boundary",
      "Recommendation certification remains metadata-only with no runtime behavior.",
      exportBundle.metadata.metadataOnly &&
        !exportBundle.metadata.runtimeBehavior &&
        exportBundle.recommendationManifest.metadataOnly &&
        !exportBundle.recommendationManifest.runtimeBehavior &&
        exportBundle.recommendationManifest.recommendationEngine === false &&
        exportBundle.referenceInspectionCapability.metadataOnly &&
        !exportBundle.referenceInspectionCapability.runtimeBehavior
    ),
  ]);

  const passed = gates.every((entry) => entry.passed);
  return Object.freeze({
    contractVersion: DOMAIN_RECOMMENDATION_EXPORT_CONTRACT_VERSION,
    status: passed ? "PASS" : "FAIL",
    gates,
    diagnostics: Object.freeze(gates.map(diagnosticFromGate)),
    exportBundle,
  });
}
