import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import { DomainKpiPlatformFreeze } from "./domainKpiPlatformFreezeIndex.ts";
import { DomainRegulationCertificationLayer } from "./domainRegulationCertificationIndex.ts";
import {
  createDomainReasoningRegistry,
  registerDomainReasoningPackage,
  validateDomainReasoningFoundation,
  type DomainReasoningPackage,
  type DomainReasoningRegistry,
} from "./domainReasoningIndex.ts";
import { DomainReasoningQueryLayer } from "./domainReasoningQueryIndex.ts";
import {
  DomainReasoningCertificationLayer,
  buildDomainReasoningExportBundle,
  compareDomainReasoningExportBundles,
  listDomainReasoningRegressionApiCoverage,
  runDomainReasoningCertification,
  runDomainReasoningRegression,
  validateDomainReasoningExportBundle,
} from "./domainReasoningCertificationIndex.ts";

function reasoningPackage(description = "Neutral placeholder reasoning metadata."): DomainReasoningPackage {
  return Object.freeze({
    contractVersion: "DOM-6:1",
    reasoningPackageId: "reasoning-package.certification-test.core",
    domainId: "domain.reasoning-certification-test",
    name: "Reasoning Certification Test Package",
    description,
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    contracts: Object.freeze([
      Object.freeze({
        contractId: "reasoning-contract.certification-test.primary",
        label: "Certification Test Contract",
        description: "Neutral reasoning contract metadata.",
        scope: "domain",
        status: "active",
        inputs: Object.freeze([
          Object.freeze({
            inputId: "input.certification-test.primary",
            label: "Certification Test Input",
            description: "Neutral input metadata.",
            required: true,
            reference: Object.freeze({
              domainId: "domain.reasoning-certification-test",
              vocabularyId: "vocabulary.certification-test.core",
              termId: "term.certification-test.primary",
              ontologyId: "ontology.certification-test.core",
              entityTypeId: "entity.certification-test.source",
              attributeId: "attribute.certification-test.value",
            }),
          }),
        ]),
        outputs: Object.freeze([
          Object.freeze({
            outputId: "output.certification-test.primary",
            label: "Certification Test Output",
            description: "Neutral output metadata.",
            reference: Object.freeze({
              domainId: "domain.reasoning-certification-test",
              kpiPackageId: "kpi-package.certification-test.core",
              kpiId: "kpi.certification-test.primary",
            }),
          }),
        ]),
        evidenceRequirements: Object.freeze([
          Object.freeze({
            evidenceRequirementId: "evidence-requirement.certification-test.primary",
            label: "Certification Test Evidence Requirement",
            description: "Neutral evidence metadata.",
            required: true,
            reference: Object.freeze({
              domainId: "domain.reasoning-certification-test",
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
          traceInputIds: Object.freeze(["input.certification-test.primary"]),
          traceOutputIds: Object.freeze(["output.certification-test.primary"]),
          traceEvidenceRequirementIds: Object.freeze(["evidence-requirement.certification-test.primary"]),
          traceAssumptionIds: Object.freeze(["assumption.certification-test.primary"]),
        }),
      }),
    ]),
  });
}

function fixtureRegistry(description?: string): DomainReasoningRegistry {
  return registerDomainReasoningPackage(createDomainReasoningRegistry(), reasoningPackage(description)).registry;
}

test("generates reasoning export bundle", () => {
  const bundle = buildDomainReasoningExportBundle(fixtureRegistry());

  assert.equal(bundle.metadata.contractVersion, "DOM-6:3");
  assert.equal(bundle.metadata.packageCount, 1);
  assert.equal(bundle.reasoningSnapshot.packageCount, 1);
  assert.equal(bundle.snapshotMetadata.valid, true);
  assert.equal(bundle.diffMetadata.equal, true);
  assert.equal(bundle.exportValid, true);
});

test("validates reasoning export bundle", () => {
  assert.equal(validateDomainReasoningExportBundle(buildDomainReasoningExportBundle(fixtureRegistry())).valid, true);
});

test("compares reasoning export bundles", () => {
  const left = buildDomainReasoningExportBundle(fixtureRegistry());
  const right = buildDomainReasoningExportBundle(fixtureRegistry());

  assert.equal(compareDomainReasoningExportBundles(left, right).equal, true);
});

test("uses deterministic reasoning export fingerprint", () => {
  const first = buildDomainReasoningExportBundle(fixtureRegistry());
  const second = buildDomainReasoningExportBundle(fixtureRegistry());
  const modified = buildDomainReasoningExportBundle(fixtureRegistry("Modified neutral placeholder reasoning metadata."));

  assert.equal(first.fingerprint, second.fingerprint);
  assert.notEqual(first.fingerprint, modified.fingerprint);
});

test("passes reasoning certification", () => {
  assert.equal(runDomainReasoningCertification(fixtureRegistry()).status, "PASS");
});

test("returns reasoning certification gate details", () => {
  const result = runDomainReasoningCertification(fixtureRegistry());

  assert.equal(result.gates.length >= 16, true);
  assert.equal(result.gates.every((gate) => gate.passed), true);
  assert.equal(result.diagnostics.length, result.gates.length);
  assert.equal(result.diagnostics.every((diagnostic) => diagnostic.severity === "info"), true);
});

test("validates query capability gate", () => {
  const result = runDomainReasoningCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "query-capability-available")?.passed, true);
});

test("validates lookup capability gate", () => {
  const result = runDomainReasoningCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "lookup-capability-available")?.passed, true);
});

test("validates reference inspection capability gate", () => {
  const result = runDomainReasoningCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "reference-inspection-capability-available")?.passed, true);
});

test("validates snapshot diff capability gate", () => {
  const result = runDomainReasoningCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "snapshot-diff-capability")?.passed, true);
});

test("validates frozen registry readability", () => {
  const result = runDomainReasoningCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "frozen-registry-readable")?.passed, true);
});

test("returns reasoning regression metadata", () => {
  const regression = runDomainReasoningRegression();

  assert.equal(regression.contractVersion, "DOM-6:3");
  assert.equal(regression.failed, 0);
  assert.equal(regression.entries.some((entry) => entry.phaseId === "DOM-6:3"), true);
});

test("exports public reasoning certification APIs", () => {
  const coverage = listDomainReasoningRegressionApiCoverage();

  assert.equal(typeof DomainReasoningCertificationLayer.buildDomainReasoningExportBundle, "function");
  assert.equal(typeof DomainReasoningCertificationLayer.runDomainReasoningCertification, "function");
  assert.equal(Object.isFrozen(DomainReasoningCertificationLayer), true);
  assert.equal(coverage.includes("DomainReasoningCertificationLayer"), true);
});

test("keeps DOM-6:1 compatibility", () => {
  assert.equal(validateDomainReasoningFoundation().valid, true);
  assert.equal(fixtureRegistry().contractVersion, "DOM-6:1");
});

test("keeps DOM-6:2 compatibility", () => {
  assert.equal(typeof DomainReasoningQueryLayer.queryDomainReasoningPackages, "function");
  assert.equal(typeof DomainReasoningQueryLayer.buildDomainReasoningSnapshot, "function");
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

test("does not expose reasoning execution behavior", () => {
  const coverage = listDomainReasoningRegressionApiCoverage().join(" ");

  assert.equal(coverage.includes("execute"), false);
  assert.equal(coverage.includes("infer"), false);
  assert.equal(coverage.includes("score"), false);
  assert.equal(coverage.includes("rank"), false);
});
