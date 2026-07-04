import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_DOMAIN_STATUS,
  createDomainRegistry,
  registerDomain,
  validateDomainFoundation,
  type DomainPackage,
} from "./domainFoundationIndex.ts";
import {
  createDomainVocabularyRegistry,
  freezeDomainVocabularyRegistry,
  getDomainVocabulary,
  registerDomainVocabulary,
  validateDomainVocabularyFoundation,
  type DomainVocabularyPackage,
} from "./domainVocabularyIndex.ts";
import {
  buildDomainVocabularySnapshot,
  queryDomainVocabularies,
  resolveDomainSynonym,
} from "./domainVocabularyQueryIndex.ts";
import {
  DomainVocabularyCertificationLayer,
  buildDomainVocabularyExportBundle,
  compareDomainVocabularyExportBundles,
  listDomainVocabularyRegressionApiCoverage,
  runDomainVocabularyCertification,
  runDomainVocabularyRegression,
  validateDomainVocabularyExportBundle,
} from "./domainVocabularyCertificationIndex.ts";

function domainPackage(): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId: "domain.certification",
      name: "Certification",
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: "Certification Domain",
        description: "Neutral certification domain metadata.",
        category: "other",
        tags: Object.freeze(["certification"]),
      }),
      capabilities: Object.freeze([
        Object.freeze({
          id: "metadata-export",
          name: "Metadata Export",
          description: "Supports deterministic metadata export tests.",
          enabled: true,
        }),
      ]),
      dependencies: Object.freeze([]),
      status: DEFAULT_DOMAIN_STATUS,
    }),
  });
}

function vocabularyPackage(overrides: Partial<DomainVocabularyPackage> = {}): DomainVocabularyPackage {
  return Object.freeze({
    contractVersion: "DOM-2:1",
    vocabularyId: "vocabulary.certification.core",
    domainId: "domain.certification",
    name: "Certification Core Vocabulary",
    description: "Neutral placeholder vocabulary metadata for certification tests.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    status: "active",
    terms: Object.freeze([
      Object.freeze({
        termId: "term.certification.primary",
        label: "Certification Primary",
        definition: Object.freeze({
          text: "Neutral placeholder definition for certification tests.",
          language: "en",
        }),
        synonyms: Object.freeze([
          Object.freeze({
            label: "Certification Alias",
            normalizedLabel: "certification alias",
          }),
        ]),
        scope: "domain",
        status: "active",
      }),
    ]),
    ...overrides,
  });
}

function fixtureRegistry() {
  const domainRegistry = registerDomain(createDomainRegistry(), domainPackage()).registry;
  const registered = registerDomainVocabulary(
    createDomainVocabularyRegistry(),
    vocabularyPackage(),
    domainRegistry
  );
  assert.equal(registered.success, true);
  return registered.registry;
}

test("generates export bundle", () => {
  const bundle = buildDomainVocabularyExportBundle(fixtureRegistry());

  assert.equal(bundle.metadata.contractVersion, "DOM-2:3");
  assert.equal(bundle.metadata.vocabularyCount, 1);
  assert.equal(bundle.vocabularyManifest.contractVersion, "DOM-2:1");
  assert.equal(bundle.vocabularySnapshot.vocabularyCount, 1);
  assert.equal(bundle.exportValid, true);
  assert.equal(typeof bundle.fingerprint, "string");
});

test("validates export bundle", () => {
  const validation = validateDomainVocabularyExportBundle(buildDomainVocabularyExportBundle(fixtureRegistry()));

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
});

test("compares export bundles", () => {
  const left = buildDomainVocabularyExportBundle(fixtureRegistry());
  const right = buildDomainVocabularyExportBundle(fixtureRegistry());
  const comparison = compareDomainVocabularyExportBundles(left, right);

  assert.equal(comparison.equal, true);
  assert.equal(comparison.fingerprintEqual, true);
  assert.equal(comparison.snapshotEqual, true);
});

test("uses deterministic fingerprint", () => {
  const first = buildDomainVocabularyExportBundle(fixtureRegistry());
  const second = buildDomainVocabularyExportBundle(fixtureRegistry());

  assert.equal(first.fingerprint, second.fingerprint);
});

test("passes certification", () => {
  const certification = runDomainVocabularyCertification(fixtureRegistry());

  assert.equal(certification.status, "PASS");
  assert.equal(certification.gates.every((gate) => gate.passed), true);
});

test("returns certification gate details", () => {
  const certification = runDomainVocabularyCertification(fixtureRegistry());

  assert.ok(certification.gates.length >= 12);
  assert.ok(certification.gates.every((gate) => gate.gateId.length > 0));
  assert.ok(certification.gates.every((gate) => gate.description.length > 0));
});

test("certifies query capability gate", () => {
  const certification = runDomainVocabularyCertification(fixtureRegistry());

  assert.equal(
    certification.gates.find((gate) => gate.gateId === "query-capability-available")?.passed,
    true
  );
});

test("certifies term lookup capability gate", () => {
  const certification = runDomainVocabularyCertification(fixtureRegistry());

  assert.equal(
    certification.gates.find((gate) => gate.gateId === "term-lookup-capability-available")?.passed,
    true
  );
});

test("certifies exact synonym resolution gate", () => {
  const certification = runDomainVocabularyCertification(fixtureRegistry());
  const resolved = resolveDomainSynonym(fixtureRegistry(), " Certification Alias ");
  const miss = resolveDomainSynonym(fixtureRegistry(), "Certification");

  assert.equal(
    certification.gates.find((gate) => gate.gateId === "exact-synonym-resolution")?.passed,
    true
  );
  assert.equal(resolved.resolved, true);
  assert.equal(miss.resolved, false);
});

test("certifies snapshot diff gate", () => {
  const certification = runDomainVocabularyCertification(fixtureRegistry());

  assert.equal(
    certification.gates.find((gate) => gate.gateId === "snapshot-diff-capability")?.passed,
    true
  );
});

test("supports frozen registry readability", () => {
  const frozen = freezeDomainVocabularyRegistry(fixtureRegistry());
  const bundle = buildDomainVocabularyExportBundle(frozen);
  const certification = runDomainVocabularyCertification(frozen);

  assert.equal(bundle.metadata.frozen, true);
  assert.equal(validateDomainVocabularyExportBundle(bundle).valid, true);
  assert.equal(
    certification.gates.find((gate) => gate.gateId === "frozen-registry-readable")?.passed,
    true
  );
});

test("returns regression result", () => {
  const regression = runDomainVocabularyRegression();

  assert.equal(regression.contractVersion, "DOM-2:3");
  assert.equal(regression.failed, 0);
  assert.equal(regression.passed, regression.totalTests);
  assert.equal(regression.metadataOnly, true);
});

test("exports public certification APIs", () => {
  assert.equal(typeof DomainVocabularyCertificationLayer.buildDomainVocabularyExportBundle, "function");
  assert.equal(typeof DomainVocabularyCertificationLayer.runDomainVocabularyCertification, "function");
  assert.equal(typeof DomainVocabularyCertificationLayer.runDomainVocabularyRegression, "function");
  assert.equal(
    listDomainVocabularyRegressionApiCoverage().includes("DomainVocabularyCertificationLayer"),
    true
  );
  assert.equal(Object.isFrozen(DomainVocabularyCertificationLayer), true);
});

test("keeps DOM-2:1 regression compatibility", () => {
  const registry = fixtureRegistry();

  assert.equal(validateDomainVocabularyFoundation().valid, true);
  assert.equal(getDomainVocabulary(registry, "vocabulary.certification.core")?.package.domainId, "domain.certification");
});

test("keeps DOM-2:2 regression compatibility", () => {
  const registry = fixtureRegistry();
  const snapshot = buildDomainVocabularySnapshot(registry);
  const queried = queryDomainVocabularies(registry, {
    filter: Object.freeze({ domainId: "domain.certification" }),
  });

  assert.equal(snapshot.vocabularyCount, 1);
  assert.equal(queried.length, 1);
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});
