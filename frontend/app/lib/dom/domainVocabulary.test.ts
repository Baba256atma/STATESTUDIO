import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_DOMAIN_STATUS,
  createDomainRegistry,
  registerDomain,
  validateDomainFoundation,
} from "./domainFoundationIndex.ts";
import type { DomainPackage } from "./domainFoundationIndex.ts";
import {
  DEFAULT_VOCABULARY_STATUS,
  DomainVocabularyFoundation,
  MAX_TERM_ID_LENGTH,
  MAX_VOCABULARY_ID_LENGTH,
  SUPPORTED_VOCABULARY_SCOPES,
  buildDomainVocabularyManifest,
  createDomainVocabularyRegistry,
  freezeDomainVocabularyRegistry,
  getDomainVocabulary,
  hasDomainVocabulary,
  listDomainVocabularies,
  listVocabulariesByDomain,
  registerDomainVocabulary,
  unregisterDomainVocabulary,
  validateDomainVocabularyFoundation,
  validateDomainVocabularyPackage,
  validateDomainVocabularyRegistry,
} from "./domainVocabularyIndex.ts";
import type { DomainVocabularyPackage } from "./domainVocabularyIndex.ts";

function domainPackage(overrides: Partial<DomainPackage["manifest"]> = {}): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId: "domain.manufacturing",
      name: "Manufacturing",
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: "Manufacturing Domain",
        description: "Manufacturing domain package registration metadata.",
        category: "manufacturing",
        tags: Object.freeze(["manufacturing"]),
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
      ...overrides,
    }),
  });
}

function vocabularyPackage(overrides: Partial<DomainVocabularyPackage> = {}): DomainVocabularyPackage {
  return Object.freeze({
    contractVersion: "DOM-2:1",
    vocabularyId: "vocabulary.manufacturing.core",
    domainId: "domain.manufacturing",
    name: "Manufacturing Core Vocabulary",
    description: "Controlled terminology metadata for the manufacturing domain package.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    status: DEFAULT_VOCABULARY_STATUS,
    terms: Object.freeze([
      Object.freeze({
        termId: "term.concept-a",
        label: "Concept A",
        definition: Object.freeze({
          text: "A neutral placeholder concept used for vocabulary infrastructure validation.",
          language: "en",
        }),
        synonyms: Object.freeze([
          Object.freeze({ label: "Concept Alpha", normalizedLabel: "concept alpha" }),
        ]),
        scope: "domain",
        status: "draft",
      }),
    ]),
    ...overrides,
  });
}

function registeredDomainRegistry() {
  return registerDomain(createDomainRegistry(), domainPackage()).registry;
}

test("creates an empty vocabulary registry", () => {
  const registry = createDomainVocabularyRegistry();

  assert.equal(registry.contractVersion, "DOM-2:1");
  assert.equal(registry.frozen, false);
  assert.equal(registry.vocabularies.length, 0);
  assert.equal(Object.isFrozen(registry), true);
});

test("registers a domain vocabulary package", () => {
  const domainRegistry = registeredDomainRegistry();
  const result = registerDomainVocabulary(createDomainVocabularyRegistry(), vocabularyPackage(), domainRegistry);

  assert.equal(result.success, true);
  assert.equal(result.registry.vocabularies.length, 1);
  assert.equal(result.vocabulary?.package.vocabularyId, "vocabulary.manufacturing.core");
  assert.equal(hasDomainVocabulary(result.registry, "vocabulary.manufacturing.core"), true);
});

test("rejects duplicate vocabulary ids", () => {
  const domainRegistry = registeredDomainRegistry();
  const first = registerDomainVocabulary(createDomainVocabularyRegistry(), vocabularyPackage(), domainRegistry);
  const duplicate = registerDomainVocabulary(
    first.registry,
    vocabularyPackage({ name: "Duplicate Vocabulary Name" }),
    domainRegistry
  );

  assert.equal(duplicate.success, false);
  assert.equal(duplicate.validation.issues.some((issue) => issue.code === "duplicate_vocabulary_id"), true);
});

test("rejects duplicate term ids", () => {
  const validation = validateDomainVocabularyPackage(
    vocabularyPackage({
      terms: Object.freeze([
        Object.freeze({
          termId: "term.concept-a",
          label: "Concept A",
          definition: Object.freeze({ text: "First concept definition.", language: "en" }),
          synonyms: Object.freeze([]),
          scope: "domain",
          status: "draft",
        }),
        Object.freeze({
          termId: "term.concept-a",
          label: "Concept B",
          definition: Object.freeze({ text: "Second concept definition.", language: "en" }),
          synonyms: Object.freeze([]),
          scope: "domain",
          status: "draft",
        }),
      ]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "duplicate_term_id"), true);
});

test("looks up registered vocabularies", () => {
  const domainRegistry = registeredDomainRegistry();
  const registered = registerDomainVocabulary(createDomainVocabularyRegistry(), vocabularyPackage(), domainRegistry);
  const found = getDomainVocabulary(registered.registry, "vocabulary.manufacturing.core");
  const listed = listDomainVocabularies(registered.registry);

  assert.ok(found);
  assert.equal(found.package.name, "Manufacturing Core Vocabulary");
  assert.equal(listed.length, 1);
});

test("lists vocabularies by domain", () => {
  const domainRegistry = registeredDomainRegistry();
  const registered = registerDomainVocabulary(createDomainVocabularyRegistry(), vocabularyPackage(), domainRegistry);
  const byDomain = listVocabulariesByDomain(registered.registry, "domain.manufacturing");

  assert.equal(byDomain.length, 1);
  assert.equal(byDomain[0].package.domainId, "domain.manufacturing");
});

test("unregisters a domain vocabulary", () => {
  const domainRegistry = registeredDomainRegistry();
  const registered = registerDomainVocabulary(createDomainVocabularyRegistry(), vocabularyPackage(), domainRegistry);
  const removed = unregisterDomainVocabulary(registered.registry, "vocabulary.manufacturing.core");

  assert.equal(removed.success, true);
  assert.equal(removed.registry.vocabularies.length, 0);
  assert.equal(hasDomainVocabulary(removed.registry, "vocabulary.manufacturing.core"), false);
});

test("freezes the vocabulary registry and blocks mutations", () => {
  const domainRegistry = registeredDomainRegistry();
  const registered = registerDomainVocabulary(createDomainVocabularyRegistry(), vocabularyPackage(), domainRegistry);
  const frozen = freezeDomainVocabularyRegistry(registered.registry);
  const blocked = registerDomainVocabulary(
    frozen,
    vocabularyPackage({ vocabularyId: "vocabulary.manufacturing.secondary", name: "Secondary Vocabulary" }),
    domainRegistry
  );

  assert.equal(frozen.frozen, true);
  assert.equal(blocked.success, false);
  assert.equal(blocked.validation.issues.some((issue) => issue.code === "registry_frozen"), true);
});

test("builds immutable vocabulary manifest", () => {
  const manifest = buildDomainVocabularyManifest();

  assert.equal(manifest.contractVersion, "DOM-2:1");
  assert.equal(manifest.version, "DOM-2:1");
  assert.equal(manifest.defaultStatus, DEFAULT_VOCABULARY_STATUS);
  assert.equal(manifest.maxTermIdLength, MAX_TERM_ID_LENGTH);
  assert.equal(manifest.maxVocabularyIdLength, MAX_VOCABULARY_ID_LENGTH);
  assert.deepEqual(manifest.supportedScopes, SUPPORTED_VOCABULARY_SCOPES);
  assert.equal(manifest.metadataOnly, true);
  assert.equal(manifest.runtimeBehavior, false);
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates vocabulary foundation integrity", () => {
  const validation = validateDomainVocabularyFoundation();
  const domainRegistry = registeredDomainRegistry();
  const registered = registerDomainVocabulary(createDomainVocabularyRegistry(), vocabularyPackage(), domainRegistry);

  assert.equal(validation.valid, true);
  assert.equal(validateDomainVocabularyRegistry(registered.registry).valid, true);
});

test("rejects duplicate synonyms within a term", () => {
  const validation = validateDomainVocabularyPackage(
    vocabularyPackage({
      terms: Object.freeze([
        Object.freeze({
          termId: "term.concept-b",
          label: "Concept B",
          definition: Object.freeze({ text: "Concept definition.", language: "en" }),
          synonyms: Object.freeze([
            Object.freeze({ label: "Alias One", normalizedLabel: "alias one" }),
            Object.freeze({ label: "alias one", normalizedLabel: "alias one" }),
          ]),
          scope: "module",
          status: "draft",
        }),
      ]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "duplicate_synonym"), true);
});

test("rejects missing domain reference when domain registry is provided", () => {
  const validation = validateDomainVocabularyPackage(
    vocabularyPackage({ domainId: "domain.missing" }),
    createDomainRegistry()
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "missing_domain_reference"), true);
});

test("exports public vocabulary foundation APIs", () => {
  assert.equal(typeof DomainVocabularyFoundation.createDomainVocabularyRegistry, "function");
  assert.equal(typeof DomainVocabularyFoundation.registerDomainVocabulary, "function");
  assert.equal(typeof DomainVocabularyFoundation.buildDomainVocabularyManifest, "function");
  assert.equal(Object.isFrozen(DomainVocabularyFoundation), true);
});

test("keeps DOM-1 compatibility", () => {
  const domainRegistry = registeredDomainRegistry();
  const foundationValidation = validateDomainFoundation();
  const vocabularyResult = registerDomainVocabulary(createDomainVocabularyRegistry(), vocabularyPackage(), domainRegistry);

  assert.equal(foundationValidation.valid, true);
  assert.equal(vocabularyResult.success, true);
  assert.equal(vocabularyResult.vocabulary?.package.domainId, "domain.manufacturing");
});
