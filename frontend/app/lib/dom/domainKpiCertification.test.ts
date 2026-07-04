import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import {
  createDomainKpiRegistry,
  freezeDomainKpiRegistry,
  registerDomainKpiPackage,
  validateDomainKpiFoundation,
  type DomainKpiPackage,
} from "./domainKpiIndex.ts";
import {
  buildDomainKpiSnapshot,
  queryDomainKpiPackages,
} from "./domainKpiQueryIndex.ts";
import {
  DomainKpiCertificationLayer,
  buildDomainKpiExportBundle,
  compareDomainKpiExportBundles,
  listDomainKpiRegressionApiCoverage,
  runDomainKpiCertification,
  runDomainKpiRegression,
  validateDomainKpiExportBundle,
} from "./domainKpiCertificationIndex.ts";

function kpiPackage(overrides: Partial<DomainKpiPackage> = {}): DomainKpiPackage {
  return Object.freeze({
    contractVersion: "DOM-4:1",
    kpiPackageId: "kpi-package.certification.core",
    domainId: "domain.certification",
    name: "Certification KPI Package",
    description: "Neutral placeholder KPI package metadata for certification tests.",
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
    ...overrides,
  });
}

function fixtureRegistry() {
  const registered = registerDomainKpiPackage(createDomainKpiRegistry(), kpiPackage());
  assert.equal(registered.success, true);
  return registered.registry;
}

test("generates export bundle", () => {
  const bundle = buildDomainKpiExportBundle(fixtureRegistry());

  assert.equal(bundle.metadata.contractVersion, "DOM-4:3");
  assert.equal(bundle.metadata.packageCount, 1);
  assert.equal(bundle.kpiManifest.contractVersion, "DOM-4:1");
  assert.equal(bundle.kpiSnapshot.packageCount, 1);
  assert.equal(bundle.exportValid, true);
});

test("validates export bundle", () => {
  const validation = validateDomainKpiExportBundle(buildDomainKpiExportBundle(fixtureRegistry()));

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
});

test("compares export bundles", () => {
  const comparison = compareDomainKpiExportBundles(
    buildDomainKpiExportBundle(fixtureRegistry()),
    buildDomainKpiExportBundle(fixtureRegistry())
  );

  assert.equal(comparison.equal, true);
  assert.equal(comparison.fingerprintEqual, true);
  assert.equal(comparison.snapshotEqual, true);
});

test("uses deterministic fingerprint", () => {
  const first = buildDomainKpiExportBundle(fixtureRegistry());
  const second = buildDomainKpiExportBundle(fixtureRegistry());

  assert.equal(first.fingerprint, second.fingerprint);
});

test("passes certification", () => {
  const certification = runDomainKpiCertification(fixtureRegistry());

  assert.equal(certification.status, "PASS");
  assert.equal(certification.gates.every((gate) => gate.passed), true);
});

test("returns certification gate details", () => {
  const certification = runDomainKpiCertification(fixtureRegistry());

  assert.ok(certification.gates.length >= 14);
  assert.ok(certification.gates.every((gate) => gate.gateId.length > 0));
  assert.ok(certification.gates.every((gate) => gate.description.length > 0));
});

test("certifies query capability gate", () => {
  const certification = runDomainKpiCertification(fixtureRegistry());

  assert.equal(certification.gates.find((gate) => gate.gateId === "query-capability-available")?.passed, true);
});

test("certifies lookup capability gate", () => {
  const certification = runDomainKpiCertification(fixtureRegistry());

  assert.equal(certification.gates.find((gate) => gate.gateId === "lookup-capability-available")?.passed, true);
});

test("certifies reference inspection capability gate", () => {
  const certification = runDomainKpiCertification(fixtureRegistry());

  assert.equal(
    certification.gates.find((gate) => gate.gateId === "reference-inspection-capability-available")?.passed,
    true
  );
});

test("certifies snapshot diff gate", () => {
  const certification = runDomainKpiCertification(fixtureRegistry());

  assert.equal(certification.gates.find((gate) => gate.gateId === "snapshot-diff-capability")?.passed, true);
});

test("supports frozen registry readability", () => {
  const frozen = freezeDomainKpiRegistry(fixtureRegistry());
  const bundle = buildDomainKpiExportBundle(frozen);
  const certification = runDomainKpiCertification(frozen);

  assert.equal(bundle.metadata.frozen, true);
  assert.equal(validateDomainKpiExportBundle(bundle).valid, true);
  assert.equal(certification.gates.find((gate) => gate.gateId === "frozen-registry-readable")?.passed, true);
});

test("returns regression result", () => {
  const regression = runDomainKpiRegression();

  assert.equal(regression.contractVersion, "DOM-4:3");
  assert.equal(regression.failed, 0);
  assert.equal(regression.passed, regression.totalTests);
  assert.equal(regression.metadataOnly, true);
});

test("exports public certification APIs", () => {
  assert.equal(typeof DomainKpiCertificationLayer.buildDomainKpiExportBundle, "function");
  assert.equal(typeof DomainKpiCertificationLayer.runDomainKpiCertification, "function");
  assert.equal(typeof DomainKpiCertificationLayer.runDomainKpiRegression, "function");
  assert.equal(listDomainKpiRegressionApiCoverage().includes("DomainKpiCertificationLayer"), true);
  assert.equal(Object.isFrozen(DomainKpiCertificationLayer), true);
});

test("keeps DOM-4:1 regression compatibility", () => {
  assert.equal(validateDomainKpiFoundation().valid, true);
  assert.equal(fixtureRegistry().contractVersion, "DOM-4:1");
});

test("keeps DOM-4:2 regression compatibility", () => {
  const registry = fixtureRegistry();

  assert.equal(buildDomainKpiSnapshot(registry).packageCount, 1);
  assert.equal(queryDomainKpiPackages(registry).length, 1);
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
