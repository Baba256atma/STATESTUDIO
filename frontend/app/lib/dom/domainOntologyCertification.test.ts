import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import {
  createDomainOntologyRegistry,
  freezeDomainOntologyRegistry,
  registerDomainOntology,
  validateDomainOntologyFoundation,
  type DomainOntologyPackage,
} from "./domainOntologyIndex.ts";
import {
  buildDomainOntologySnapshot,
  queryDomainOntologies,
} from "./domainOntologyQueryIndex.ts";
import {
  DomainOntologyCertificationLayer,
  buildDomainOntologyExportBundle,
  compareDomainOntologyExportBundles,
  listDomainOntologyRegressionApiCoverage,
  runDomainOntologyCertification,
  runDomainOntologyRegression,
  validateDomainOntologyExportBundle,
} from "./domainOntologyCertificationIndex.ts";

function ontologyPackage(overrides: Partial<DomainOntologyPackage> = {}): DomainOntologyPackage {
  return Object.freeze({
    contractVersion: "DOM-3:1",
    ontologyId: "ontology.certification.core",
    domainId: "domain.certification",
    name: "Certification Ontology",
    description: "Neutral placeholder ontology metadata for certification tests.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    entityTypes: Object.freeze([
      Object.freeze({
        entityTypeId: "entity.certification.source",
        label: "Certification Source",
        description: "Neutral source entity metadata.",
        scope: "domain",
        status: "active",
      }),
      Object.freeze({
        entityTypeId: "entity.certification.target",
        label: "Certification Target",
        description: "Neutral target entity metadata.",
        scope: "domain",
        status: "active",
      }),
    ]),
    relationshipTypes: Object.freeze([
      Object.freeze({
        relationshipTypeId: "relationship.certification.link",
        label: "Certification Link",
        description: "Neutral relationship metadata.",
        sourceEntityTypeId: "entity.certification.source",
        targetEntityTypeId: "entity.certification.target",
        scope: "domain",
        status: "active",
      }),
    ]),
    attributes: Object.freeze([
      Object.freeze({
        attributeId: "attribute.certification.label",
        ownerEntityTypeId: "entity.certification.source",
        label: "Certification Label",
        description: "Neutral attribute metadata.",
        valueType: "string",
        required: false,
        scope: "domain",
        status: "active",
      }),
    ]),
    constraints: Object.freeze([
      Object.freeze({
        constraintId: "constraint.certification.label",
        targetType: "attribute",
        targetId: "attribute.certification.label",
        label: "Certification Constraint",
        description: "Neutral constraint metadata.",
        severity: "warning",
        scope: "domain",
        status: "active",
      }),
    ]),
    ...overrides,
  });
}

function fixtureRegistry() {
  const registered = registerDomainOntology(createDomainOntologyRegistry(), ontologyPackage());
  assert.equal(registered.success, true);
  return registered.registry;
}

test("generates export bundle", () => {
  const bundle = buildDomainOntologyExportBundle(fixtureRegistry());

  assert.equal(bundle.metadata.contractVersion, "DOM-3:3");
  assert.equal(bundle.metadata.ontologyCount, 1);
  assert.equal(bundle.ontologyManifest.contractVersion, "DOM-3:1");
  assert.equal(bundle.ontologySnapshot.ontologyCount, 1);
  assert.equal(bundle.exportValid, true);
  assert.equal(typeof bundle.fingerprint, "string");
});

test("validates export bundle", () => {
  const validation = validateDomainOntologyExportBundle(buildDomainOntologyExportBundle(fixtureRegistry()));

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
});

test("compares export bundles", () => {
  const comparison = compareDomainOntologyExportBundles(
    buildDomainOntologyExportBundle(fixtureRegistry()),
    buildDomainOntologyExportBundle(fixtureRegistry())
  );

  assert.equal(comparison.equal, true);
  assert.equal(comparison.fingerprintEqual, true);
  assert.equal(comparison.snapshotEqual, true);
});

test("uses deterministic fingerprint", () => {
  const first = buildDomainOntologyExportBundle(fixtureRegistry());
  const second = buildDomainOntologyExportBundle(fixtureRegistry());

  assert.equal(first.fingerprint, second.fingerprint);
});

test("passes certification", () => {
  const certification = runDomainOntologyCertification(fixtureRegistry());

  assert.equal(certification.status, "PASS");
  assert.equal(certification.gates.every((gate) => gate.passed), true);
});

test("returns certification gate details", () => {
  const certification = runDomainOntologyCertification(fixtureRegistry());

  assert.ok(certification.gates.length >= 13);
  assert.ok(certification.gates.every((gate) => gate.gateId.length > 0));
  assert.ok(certification.gates.every((gate) => gate.description.length > 0));
});

test("certifies query capability gate", () => {
  const certification = runDomainOntologyCertification(fixtureRegistry());

  assert.equal(certification.gates.find((gate) => gate.gateId === "query-capability-available")?.passed, true);
});

test("certifies lookup capability gate", () => {
  const certification = runDomainOntologyCertification(fixtureRegistry());

  assert.equal(certification.gates.find((gate) => gate.gateId === "lookup-capability-available")?.passed, true);
});

test("certifies traversal capability gate", () => {
  const certification = runDomainOntologyCertification(fixtureRegistry());

  assert.equal(
    certification.gates.find((gate) => gate.gateId === "direct-traversal-capability-available")?.passed,
    true
  );
});

test("certifies snapshot diff gate", () => {
  const certification = runDomainOntologyCertification(fixtureRegistry());

  assert.equal(certification.gates.find((gate) => gate.gateId === "snapshot-diff-capability")?.passed, true);
});

test("supports frozen registry readability", () => {
  const frozen = freezeDomainOntologyRegistry(fixtureRegistry());
  const bundle = buildDomainOntologyExportBundle(frozen);
  const certification = runDomainOntologyCertification(frozen);

  assert.equal(bundle.metadata.frozen, true);
  assert.equal(validateDomainOntologyExportBundle(bundle).valid, true);
  assert.equal(certification.gates.find((gate) => gate.gateId === "frozen-registry-readable")?.passed, true);
});

test("returns regression result", () => {
  const regression = runDomainOntologyRegression();

  assert.equal(regression.contractVersion, "DOM-3:3");
  assert.equal(regression.failed, 0);
  assert.equal(regression.passed, regression.totalTests);
  assert.equal(regression.metadataOnly, true);
});

test("exports public certification APIs", () => {
  assert.equal(typeof DomainOntologyCertificationLayer.buildDomainOntologyExportBundle, "function");
  assert.equal(typeof DomainOntologyCertificationLayer.runDomainOntologyCertification, "function");
  assert.equal(typeof DomainOntologyCertificationLayer.runDomainOntologyRegression, "function");
  assert.equal(listDomainOntologyRegressionApiCoverage().includes("DomainOntologyCertificationLayer"), true);
  assert.equal(Object.isFrozen(DomainOntologyCertificationLayer), true);
});

test("keeps DOM-3:1 regression compatibility", () => {
  assert.equal(validateDomainOntologyFoundation().valid, true);
  assert.equal(fixtureRegistry().contractVersion, "DOM-3:1");
});

test("keeps DOM-3:2 regression compatibility", () => {
  const registry = fixtureRegistry();

  assert.equal(buildDomainOntologySnapshot(registry).ontologyCount, 1);
  assert.equal(queryDomainOntologies(registry).length, 1);
});

test("keeps DOM-2 compatibility", () => {
  assert.equal(DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status, "PASS");
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});
