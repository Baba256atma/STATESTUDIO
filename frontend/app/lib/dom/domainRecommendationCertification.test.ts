import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import { DomainKpiPlatformFreeze } from "./domainKpiPlatformFreezeIndex.ts";
import { DomainRegulationCertificationLayer } from "./domainRegulationCertificationIndex.ts";
import { DomainReasoningPlatformFreeze } from "./domainReasoningPlatformFreezeIndex.ts";
import {
  createDomainRecommendationRegistry,
  registerDomainRecommendationPackage,
  validateDomainRecommendationFoundation,
  type DomainRecommendationPackage,
  type DomainRecommendationRegistry,
} from "./domainRecommendationIndex.ts";
import { DomainRecommendationQueryLayer } from "./domainRecommendationQueryIndex.ts";
import {
  DomainRecommendationCertificationLayer,
  buildDomainRecommendationExportBundle,
  compareDomainRecommendationExportBundles,
  listDomainRecommendationRegressionApiCoverage,
  runDomainRecommendationCertification,
  runDomainRecommendationRegression,
  validateDomainRecommendationExportBundle,
} from "./domainRecommendationCertificationIndex.ts";

function recommendationPackage(description = "Neutral placeholder recommendation metadata."): DomainRecommendationPackage {
  return Object.freeze({
    contractVersion: "DOM-7:1",
    recommendationPackageId: "recommendation-package.certification-test.core",
    domainId: "domain.recommendation-certification-test",
    name: "Recommendation Certification Test Package",
    description,
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    contracts: Object.freeze([
      Object.freeze({
        contractId: "recommendation-contract.certification-test.primary",
        label: "Certification Test Contract",
        description: "Neutral recommendation contract metadata.",
        scope: "domain",
        status: "active",
        inputs: Object.freeze([
          Object.freeze({
            inputId: "input.certification-test.primary",
            label: "Certification Test Input",
            description: "Neutral input metadata.",
            required: true,
            reference: Object.freeze({
              domainId: "domain.recommendation-certification-test",
              vocabularyId: "vocabulary.certification-test.core",
              termId: "term.certification-test.primary",
              ontologyId: "ontology.certification-test.core",
              entityTypeId: "entity.certification-test.source",
              attributeId: "attribute.certification-test.value",
              reasoningPackageId: "reasoning-package.certification-test.core",
              reasoningContractId: "reasoning-contract.certification-test.primary",
            }),
          }),
        ]),
        outputs: Object.freeze([
          Object.freeze({
            outputId: "output.certification-test.primary",
            label: "Certification Test Output",
            description: "Neutral output metadata.",
            reference: Object.freeze({
              domainId: "domain.recommendation-certification-test",
              kpiPackageId: "kpi-package.certification-test.core",
              kpiId: "kpi.certification-test.primary",
              regulationPackageId: "regulation-package.certification-test.core",
              regulationId: "regulation.certification-test.primary",
            }),
          }),
        ]),
        rationale: Object.freeze({
          required: true,
          rationaleInputs: Object.freeze(["input.certification-test.primary"]),
          rationaleAssumptions: Object.freeze(["assumption.certification-test.primary"]),
          explanation: "Rationale metadata is structurally required.",
        }),
        constraints: Object.freeze([
          Object.freeze({
            constraintId: "constraint.certification-test.primary",
            label: "Certification Test Constraint",
            description: "Neutral constraint metadata.",
            required: true,
            severity: "warning",
            reference: Object.freeze({
              domainId: "domain.recommendation-certification-test",
              regulationPackageId: "regulation-package.certification-test.core",
              regulationId: "regulation.certification-test.primary",
            }),
          }),
        ]),
        assumptions: Object.freeze([
          Object.freeze({
            assumptionId: "assumption.certification-test.primary",
            label: "Certification Test Assumption",
            description: "Neutral assumption metadata.",
            required: true,
            uncertaintyImpact: "medium",
            reference: Object.freeze({
              domainId: "domain.recommendation-certification-test",
              reasoningPackageId: "reasoning-package.certification-test.core",
              reasoningContractId: "reasoning-contract.certification-test.primary",
            }),
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
          traceInputIds: Object.freeze(["input.certification-test.primary"]),
          traceOutputIds: Object.freeze(["output.certification-test.primary"]),
          traceConstraintIds: Object.freeze(["constraint.certification-test.primary"]),
          traceAssumptionIds: Object.freeze(["assumption.certification-test.primary"]),
        }),
      }),
    ]),
  });
}

function fixtureRegistry(description?: string): DomainRecommendationRegistry {
  return registerDomainRecommendationPackage(createDomainRecommendationRegistry(), recommendationPackage(description)).registry;
}

test("generates recommendation export bundle", () => {
  const bundle = buildDomainRecommendationExportBundle(fixtureRegistry());

  assert.equal(bundle.metadata.contractVersion, "DOM-7:3");
  assert.equal(bundle.metadata.packageCount, 1);
  assert.equal(bundle.recommendationSnapshot.packageCount, 1);
  assert.equal(bundle.snapshotMetadata.valid, true);
  assert.equal(bundle.diffMetadata.equal, true);
  assert.equal(bundle.exportValid, true);
});

test("validates recommendation export bundle", () => {
  assert.equal(validateDomainRecommendationExportBundle(buildDomainRecommendationExportBundle(fixtureRegistry())).valid, true);
});

test("compares recommendation export bundles", () => {
  const left = buildDomainRecommendationExportBundle(fixtureRegistry());
  const right = buildDomainRecommendationExportBundle(fixtureRegistry());

  assert.equal(compareDomainRecommendationExportBundles(left, right).equal, true);
});

test("uses deterministic recommendation export fingerprint", () => {
  const first = buildDomainRecommendationExportBundle(fixtureRegistry());
  const second = buildDomainRecommendationExportBundle(fixtureRegistry());
  const modified = buildDomainRecommendationExportBundle(fixtureRegistry("Modified neutral placeholder recommendation metadata."));

  assert.equal(first.fingerprint, second.fingerprint);
  assert.notEqual(first.fingerprint, modified.fingerprint);
});

test("passes recommendation certification", () => {
  assert.equal(runDomainRecommendationCertification(fixtureRegistry()).status, "PASS");
});

test("returns recommendation certification gate details", () => {
  const result = runDomainRecommendationCertification(fixtureRegistry());

  assert.equal(result.gates.length >= 17, true);
  assert.equal(result.gates.every((gate) => gate.passed), true);
  assert.equal(result.diagnostics.length, result.gates.length);
  assert.equal(result.diagnostics.every((diagnostic) => diagnostic.severity === "info"), true);
});

test("validates query capability gate", () => {
  const result = runDomainRecommendationCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "query-capability-available")?.passed, true);
});

test("validates lookup capability gate", () => {
  const result = runDomainRecommendationCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "lookup-capability-available")?.passed, true);
});

test("validates reference inspection capability gate", () => {
  const result = runDomainRecommendationCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "reference-inspection-capability-available")?.passed, true);
});

test("validates snapshot diff capability gate", () => {
  const result = runDomainRecommendationCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "snapshot-diff-capability")?.passed, true);
});

test("validates frozen registry readability", () => {
  const result = runDomainRecommendationCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "frozen-registry-readable")?.passed, true);
});

test("returns recommendation regression metadata", () => {
  const regression = runDomainRecommendationRegression();

  assert.equal(regression.contractVersion, "DOM-7:3");
  assert.equal(regression.failed, 0);
  assert.equal(regression.entries.some((entry) => entry.phaseId === "DOM-7:3"), true);
});

test("exports public recommendation certification APIs", () => {
  const coverage = listDomainRecommendationRegressionApiCoverage();

  assert.equal(typeof DomainRecommendationCertificationLayer.buildDomainRecommendationExportBundle, "function");
  assert.equal(typeof DomainRecommendationCertificationLayer.runDomainRecommendationCertification, "function");
  assert.equal(Object.isFrozen(DomainRecommendationCertificationLayer), true);
  assert.equal(coverage.includes("DomainRecommendationCertificationLayer"), true);
});

test("keeps DOM-7:1 compatibility", () => {
  assert.equal(validateDomainRecommendationFoundation().valid, true);
  assert.equal(fixtureRegistry().contractVersion, "DOM-7:1");
});

test("keeps DOM-7:2 compatibility", () => {
  assert.equal(typeof DomainRecommendationQueryLayer.queryDomainRecommendationPackages, "function");
  assert.equal(typeof DomainRecommendationQueryLayer.buildDomainRecommendationSnapshot, "function");
});

test("keeps DOM-6 compatibility", () => {
  assert.equal(DomainReasoningPlatformFreeze.runDomainReasoningPlatformFreeze().status, "PASS");
});

test("keeps DOM-5 compatibility", () => {
  assert.equal(DomainRegulationCertificationLayer.runDomainRegulationRegression().failed, 0);
});

test("keeps DOM-4 compatibility", () => {
  assert.equal(DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze().status, "PASS");
});

test("keeps DOM-3 compatibility", () => {
  assert.equal(DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze().status, "PASS");
});

test("keeps DOM-2 compatibility", () => {
  assert.equal(DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status, "PASS");
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});

test("does not expose recommendation generation behavior", () => {
  const coverage = listDomainRecommendationRegressionApiCoverage().join(" ");

  assert.equal(coverage.includes("generate"), false);
  assert.equal(coverage.includes("execute"), false);
  assert.equal(coverage.includes("infer"), false);
  assert.equal(coverage.includes("score"), false);
  assert.equal(coverage.includes("rank"), false);
});
