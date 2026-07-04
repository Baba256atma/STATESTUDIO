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
  getDomainVocabulary,
  registerDomainVocabulary,
  validateDomainVocabularyFoundation,
  type DomainVocabularyPackage,
} from "./domainVocabularyIndex.ts";
import {
  DomainVocabularyQueryLayer,
  buildDomainVocabularySnapshot,
  compareDomainVocabularySnapshots,
  diffDomainVocabularySnapshots,
  findDomainTerm,
  findTermsByDomain,
  findTermsByScope,
  findTermsByStatus,
  findVocabulariesByDomain,
  findVocabulariesByScope,
  findVocabulariesByStatus,
  findVocabularyContainingTerm,
  queryDomainVocabularies,
  resolveDomainSynonym,
  sortDomainVocabularies,
  validateDomainVocabularySnapshot,
} from "./domainVocabularyQueryIndex.ts";

function domainPackage(domainId: string, name: string): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId,
      name,
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: `${name} Domain`,
        description: `${name} domain package registration metadata.`,
        category: "other",
        tags: Object.freeze([name.toLowerCase()]),
      }),
      capabilities: Object.freeze([
        Object.freeze({
          id: "package-registration",
          name: "Package Registration",
          description: "Registers the domain package in the foundation registry.",
          enabled: true,
        }),
      ]),
      dependencies: Object.freeze([]),
      status: DEFAULT_DOMAIN_STATUS,
    }),
  });
}

function vocabularyPackage(
  vocabularyId: string,
  domainId: string,
  orderLabel: string,
  overrides: Partial<DomainVocabularyPackage> = {}
): DomainVocabularyPackage {
  return Object.freeze({
    contractVersion: "DOM-2:1",
    vocabularyId,
    domainId,
    name: `${orderLabel} Vocabulary`,
    description: `${orderLabel} controlled terminology metadata.`,
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    status: "active",
    terms: Object.freeze([
      Object.freeze({
        termId: `term.${orderLabel.toLowerCase()}.primary`,
        label: `${orderLabel} Primary`,
        definition: Object.freeze({
          text: `${orderLabel} neutral placeholder definition.`,
          language: "en",
        }),
        synonyms: Object.freeze([
          Object.freeze({
            label: `${orderLabel} Alias`,
            normalizedLabel: `${orderLabel.toLowerCase()} alias`,
          }),
        ]),
        scope: "domain",
        status: "active",
      }),
      Object.freeze({
        termId: `term.${orderLabel.toLowerCase()}.secondary`,
        label: `${orderLabel} Secondary`,
        definition: Object.freeze({
          text: `${orderLabel} secondary neutral placeholder definition.`,
          language: "en",
        }),
        synonyms: Object.freeze([]),
        scope: "module",
        status: "draft",
      }),
    ]),
    ...overrides,
  });
}

function fixtureRegistry() {
  const domainA = domainPackage("domain.alpha", "Alpha");
  const domainB = domainPackage("domain.beta", "Beta");
  const firstDomain = registerDomain(createDomainRegistry(), domainA);
  const secondDomain = registerDomain(firstDomain.registry, domainB);
  assert.equal(secondDomain.success, true);

  const first = registerDomainVocabulary(
    createDomainVocabularyRegistry(),
    vocabularyPackage("vocabulary.beta.core", "domain.beta", "Beta"),
    secondDomain.registry
  );
  assert.equal(first.success, true);
  const second = registerDomainVocabulary(
    first.registry,
    vocabularyPackage("vocabulary.alpha.core", "domain.alpha", "Alpha"),
    secondDomain.registry
  );
  assert.equal(second.success, true);
  const third = registerDomainVocabulary(
    second.registry,
    vocabularyPackage("vocabulary.alpha.archive", "domain.alpha", "Archive", {
      status: "archived",
      terms: Object.freeze([
        Object.freeze({
          termId: "term.archive.primary",
          label: "Archive Primary",
          definition: Object.freeze({
            text: "Archive neutral placeholder definition.",
            language: "en",
          }),
          synonyms: Object.freeze([]),
          scope: "feature",
          status: "deprecated",
        }),
      ]),
    }),
    secondDomain.registry
  );
  assert.equal(third.success, true);
  return third.registry;
}

test("queries vocabularies by domain", () => {
  const result = findVocabulariesByDomain(fixtureRegistry(), "domain.alpha");

  assert.deepEqual(result.map((entry) => entry.package.vocabularyId), [
    "vocabulary.alpha.core",
    "vocabulary.alpha.archive",
  ]);
});

test("queries vocabularies by scope", () => {
  const result = findVocabulariesByScope(fixtureRegistry(), "feature");

  assert.deepEqual(result.map((entry) => entry.package.vocabularyId), [
    "vocabulary.alpha.archive",
  ]);
});

test("queries vocabularies by status", () => {
  const result = findVocabulariesByStatus(fixtureRegistry(), "archived");

  assert.deepEqual(result.map((entry) => entry.package.vocabularyId), [
    "vocabulary.alpha.archive",
  ]);
});

test("sorts by vocabulary id", () => {
  const result = sortDomainVocabularies(fixtureRegistry().vocabularies, "vocabularyId");

  assert.deepEqual(result.map((entry) => entry.package.vocabularyId), [
    "vocabulary.alpha.archive",
    "vocabulary.alpha.core",
    "vocabulary.beta.core",
  ]);
});

test("sorts by domain id", () => {
  const result = sortDomainVocabularies(fixtureRegistry().vocabularies, "domainId");

  assert.deepEqual(result.map((entry) => entry.package.domainId), [
    "domain.alpha",
    "domain.alpha",
    "domain.beta",
  ]);
});

test("sorts by registration order", () => {
  const result = sortDomainVocabularies(fixtureRegistry().vocabularies, "registrationOrder");

  assert.deepEqual(result.map((entry) => entry.package.vocabularyId), [
    "vocabulary.beta.core",
    "vocabulary.alpha.core",
    "vocabulary.alpha.archive",
  ]);
});

test("finds vocabulary containing term", () => {
  const match = findVocabularyContainingTerm(fixtureRegistry(), "term.alpha.primary");

  assert.equal(match?.package.vocabularyId, "vocabulary.alpha.core");
});

test("finds term by id", () => {
  const result = findDomainTerm(fixtureRegistry(), "term.beta.primary");

  assert.equal(result.found, true);
  assert.equal(result.term?.label, "Beta Primary");
  assert.equal(result.vocabulary?.package.vocabularyId, "vocabulary.beta.core");
});

test("finds terms by domain", () => {
  const result = findTermsByDomain(fixtureRegistry(), "domain.alpha");

  assert.deepEqual(result.map((entry) => entry.term?.termId), [
    "term.alpha.primary",
    "term.alpha.secondary",
    "term.archive.primary",
  ]);
});

test("finds terms by scope", () => {
  const result = findTermsByScope(fixtureRegistry(), "module");

  assert.deepEqual(result.map((entry) => entry.term?.termId), [
    "term.beta.secondary",
    "term.alpha.secondary",
  ]);
});

test("finds terms by status", () => {
  const result = findTermsByStatus(fixtureRegistry(), "deprecated");

  assert.deepEqual(result.map((entry) => entry.term?.termId), ["term.archive.primary"]);
});

test("resolves synonym exactly after deterministic normalization", () => {
  const result = resolveDomainSynonym(fixtureRegistry(), " Alpha Alias ");

  assert.equal(result.resolved, true);
  assert.equal(result.normalizedSynonym, "alpha alias");
  assert.equal(result.term?.termId, "term.alpha.primary");
});

test("builds deterministic vocabulary snapshots", () => {
  const first = buildDomainVocabularySnapshot(fixtureRegistry());
  const second = buildDomainVocabularySnapshot(fixtureRegistry());

  assert.equal(first.fingerprint, second.fingerprint);
  assert.equal(first.vocabularyCount, 3);
  assert.deepEqual(first.entries.map((entry) => entry.vocabularyId), [
    "vocabulary.alpha.archive",
    "vocabulary.alpha.core",
    "vocabulary.beta.core",
  ]);
});

test("validates vocabulary snapshots", () => {
  const validation = validateDomainVocabularySnapshot(buildDomainVocabularySnapshot(fixtureRegistry()));

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
});

test("compares vocabulary snapshots", () => {
  const left = buildDomainVocabularySnapshot(fixtureRegistry());
  const right = buildDomainVocabularySnapshot(fixtureRegistry());

  assert.equal(compareDomainVocabularySnapshots(left, right), true);
});

test("diffs added vocabularies", () => {
  const empty = buildDomainVocabularySnapshot(createDomainVocabularyRegistry());
  const populated = buildDomainVocabularySnapshot(fixtureRegistry());
  const diff = diffDomainVocabularySnapshots(empty, populated);

  assert.equal(diff.equal, false);
  assert.equal(diff.entries.some((entry) => entry.type === "added"), true);
});

test("diffs removed vocabularies", () => {
  const populated = buildDomainVocabularySnapshot(fixtureRegistry());
  const empty = buildDomainVocabularySnapshot(createDomainVocabularyRegistry());
  const diff = diffDomainVocabularySnapshots(populated, empty);

  assert.equal(diff.equal, false);
  assert.equal(diff.entries.some((entry) => entry.type === "removed"), true);
});

test("diffs modified vocabularies", () => {
  const left = fixtureRegistry();
  const domainRegistry = registerDomain(createDomainRegistry(), domainPackage("domain.alpha", "Alpha")).registry;
  const modified = registerDomainVocabulary(
    createDomainVocabularyRegistry(),
    vocabularyPackage("vocabulary.alpha.core", "domain.alpha", "Alpha", {
      terms: Object.freeze([
        Object.freeze({
          termId: "term.alpha.primary",
          label: "Alpha Primary",
          definition: Object.freeze({
            text: "Alpha modified neutral placeholder definition.",
            language: "en",
          }),
          synonyms: Object.freeze([
            Object.freeze({ label: "Alpha Alias", normalizedLabel: "alpha alias" }),
          ]),
          scope: "domain",
          status: "active",
        }),
      ]),
    }),
    domainRegistry
  ).registry;
  const diff = diffDomainVocabularySnapshots(
    buildDomainVocabularySnapshot(left),
    buildDomainVocabularySnapshot(modified)
  );

  assert.equal(diff.entries.some((entry) => entry.type === "modified"), true);
});

test("exports public query layer APIs", () => {
  assert.equal(typeof DomainVocabularyQueryLayer.queryDomainVocabularies, "function");
  assert.equal(typeof DomainVocabularyQueryLayer.findDomainTerm, "function");
  assert.equal(typeof DomainVocabularyQueryLayer.resolveDomainSynonym, "function");
  assert.equal(typeof DomainVocabularyQueryLayer.buildDomainVocabularySnapshot, "function");
  assert.equal(Object.isFrozen(DomainVocabularyQueryLayer), true);
});

test("keeps DOM-2:1 regression compatibility", () => {
  const registry = fixtureRegistry();
  const queryResult = queryDomainVocabularies(registry, {
    filter: Object.freeze({ domainId: "domain.alpha" }),
    sortKey: "vocabularyId",
  });

  assert.equal(validateDomainVocabularyFoundation().valid, true);
  assert.equal(getDomainVocabulary(registry, "vocabulary.alpha.core")?.package.domainId, "domain.alpha");
  assert.equal(queryResult.length, 2);
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});
