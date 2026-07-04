import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import { DomainKpiPlatformFreeze } from "./domainKpiPlatformFreezeIndex.ts";
import {
  createDomainRegulationRegistry,
  registerDomainRegulationPackage,
  validateDomainRegulationFoundation,
  type DomainRegulationPackage,
  type DomainRegulationRegistry,
} from "./domainRegulationIndex.ts";
import { DomainRegulationQueryLayer } from "./domainRegulationQueryIndex.ts";
import {
  DomainRegulationCertificationLayer,
  buildDomainRegulationExportBundle,
  compareDomainRegulationExportBundles,
  listDomainRegulationRegressionApiCoverage,
  runDomainRegulationCertification,
  runDomainRegulationRegression,
  validateDomainRegulationExportBundle,
} from "./domainRegulationCertificationIndex.ts";

function regulationPackage(description = "Neutral placeholder regulation metadata."): DomainRegulationPackage {
  return Object.freeze({
    contractVersion: "DOM-5:1",
    regulationPackageId: "regulation-package.certification-test.core",
    domainId: "domain.regulation-certification-test",
    name: "Regulation Certification Test Package",
    description,
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    jurisdictionScope: "unspecified",
    status: "active",
    regulations: Object.freeze([
      Object.freeze({
        regulationId: "regulation.certification-test.primary",
        label: "Certification Test Regulation",
        description: "Neutral placeholder regulation metadata.",
        reference: Object.freeze({
          domainId: "domain.regulation-certification-test",
          vocabularyId: "vocabulary.certification-test.core",
          termId: "term.certification-test.primary",
          ontologyId: "ontology.certification-test.core",
          entityTypeId: "entity.certification-test.source",
          attributeId: "attribute.certification-test.value",
          kpiPackageId: "kpi-package.certification-test.core",
          kpiId: "kpi.certification-test.primary",
        }),
        scope: "domain",
        jurisdictionScope: "unspecified",
        status: "active",
      }),
    ]),
    obligations: Object.freeze([
      Object.freeze({
        obligationId: "obligation.certification-test.primary",
        regulationId: "regulation.certification-test.primary",
        label: "Certification Test Obligation",
        description: "Neutral placeholder obligation metadata.",
        controlIds: Object.freeze(["control.certification-test.primary"]),
        scope: "domain",
        status: "active",
      }),
    ]),
    controls: Object.freeze([
      Object.freeze({
        controlId: "control.certification-test.primary",
        label: "Certification Test Control",
        description: "Neutral placeholder control metadata.",
        evidenceIds: Object.freeze(["evidence.certification-test.primary"]),
        scope: "domain",
        status: "active",
      }),
    ]),
    evidence: Object.freeze([
      Object.freeze({
        evidenceId: "evidence.certification-test.primary",
        label: "Certification Test Evidence",
        description: "Neutral placeholder evidence metadata.",
        sourceDescription: "Neutral placeholder source metadata.",
        scope: "domain",
        status: "active",
      }),
    ]),
  });
}

function fixtureRegistry(description?: string): DomainRegulationRegistry {
  return registerDomainRegulationPackage(createDomainRegulationRegistry(), regulationPackage(description)).registry;
}

test("generates regulation export bundle", () => {
  const bundle = buildDomainRegulationExportBundle(fixtureRegistry());

  assert.equal(bundle.metadata.contractVersion, "DOM-5:3");
  assert.equal(bundle.metadata.packageCount, 1);
  assert.equal(bundle.regulationSnapshot.packageCount, 1);
  assert.equal(bundle.snapshotMetadata.valid, true);
  assert.equal(bundle.diffMetadata.equal, true);
  assert.equal(bundle.exportValid, true);
});

test("validates regulation export bundle", () => {
  assert.equal(validateDomainRegulationExportBundle(buildDomainRegulationExportBundle(fixtureRegistry())).valid, true);
});

test("compares regulation export bundles", () => {
  const left = buildDomainRegulationExportBundle(fixtureRegistry());
  const right = buildDomainRegulationExportBundle(fixtureRegistry());

  assert.equal(compareDomainRegulationExportBundles(left, right).equal, true);
});

test("uses deterministic regulation export fingerprint", () => {
  const first = buildDomainRegulationExportBundle(fixtureRegistry());
  const second = buildDomainRegulationExportBundle(fixtureRegistry());
  const modified = buildDomainRegulationExportBundle(fixtureRegistry("Modified neutral placeholder regulation metadata."));

  assert.equal(first.fingerprint, second.fingerprint);
  assert.notEqual(first.fingerprint, modified.fingerprint);
});

test("passes regulation certification", () => {
  assert.equal(runDomainRegulationCertification(fixtureRegistry()).status, "PASS");
});

test("returns regulation certification gate details", () => {
  const result = runDomainRegulationCertification(fixtureRegistry());

  assert.equal(result.gates.length >= 15, true);
  assert.equal(result.gates.every((gate) => gate.passed), true);
  assert.equal(result.diagnostics.length, result.gates.length);
  assert.equal(result.diagnostics.every((diagnostic) => diagnostic.severity === "info"), true);
});

test("validates query capability gate", () => {
  const result = runDomainRegulationCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "query-capability-available")?.passed, true);
});

test("validates lookup capability gate", () => {
  const result = runDomainRegulationCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "lookup-capability-available")?.passed, true);
});

test("validates reference inspection capability gate", () => {
  const result = runDomainRegulationCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "reference-inspection-capability-available")?.passed, true);
});

test("validates snapshot diff gate", () => {
  const result = runDomainRegulationCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "snapshot-diff-capability")?.passed, true);
});

test("validates frozen registry readability", () => {
  const result = runDomainRegulationCertification(fixtureRegistry());

  assert.equal(result.gates.find((gate) => gate.gateId === "frozen-registry-readable")?.passed, true);
});

test("returns regulation regression result", () => {
  const regression = runDomainRegulationRegression();

  assert.equal(regression.contractVersion, "DOM-5:3");
  assert.equal(regression.failed, 0);
  assert.equal(regression.entries.some((entry) => entry.phaseId === "DOM-5:3"), true);
});

test("exports public regulation certification APIs", () => {
  const coverage = listDomainRegulationRegressionApiCoverage();

  assert.equal(typeof DomainRegulationCertificationLayer.buildDomainRegulationExportBundle, "function");
  assert.equal(typeof DomainRegulationCertificationLayer.runDomainRegulationCertification, "function");
  assert.equal(Object.isFrozen(DomainRegulationCertificationLayer), true);
  assert.equal(coverage.includes("DomainRegulationCertificationLayer"), true);
});

test("keeps DOM-5:1 regression compatibility", () => {
  assert.equal(validateDomainRegulationFoundation().valid, true);
  assert.equal(fixtureRegistry().contractVersion, "DOM-5:1");
});

test("keeps DOM-5:2 regression compatibility", () => {
  assert.equal(typeof DomainRegulationQueryLayer.queryDomainRegulationPackages, "function");
  assert.equal(typeof DomainRegulationQueryLayer.buildDomainRegulationSnapshot, "function");
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
