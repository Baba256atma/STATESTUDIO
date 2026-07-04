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
  registerDomainVocabulary,
  validateDomainVocabularyFoundation,
  type DomainVocabularyPackage,
} from "./domainVocabularyIndex.ts";
import {
  DomainVocabularyPlatformFreeze,
} from "./domainVocabularyPlatformFreezeIndex.ts";
import {
  DEFAULT_ONTOLOGY_STATUS,
  DomainOntologyFoundation,
  buildDomainOntologyManifest,
  createDomainOntologyRegistry,
  freezeDomainOntologyRegistry,
  getDomainOntology,
  hasDomainOntology,
  listDomainOntologies,
  listOntologiesByDomain,
  registerDomainOntology,
  unregisterDomainOntology,
  validateDomainOntologyFoundation,
  validateDomainOntologyPackage,
  validateDomainOntologyRegistry,
  type DomainOntologyPackage,
} from "./domainOntologyIndex.ts";

function domainPackage(domainId = "domain.ontology-placeholder"): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId,
      name: "Ontology Placeholder",
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: "Ontology Placeholder Domain",
        description: "Neutral placeholder domain metadata for ontology infrastructure.",
        category: "other",
        tags: Object.freeze(["ontology-placeholder"]),
      }),
      capabilities: Object.freeze([
        Object.freeze({
          id: "ontology-metadata",
          name: "Ontology Metadata",
          description: "Supports ontology metadata package registration.",
          enabled: true,
        }),
      ]),
      dependencies: Object.freeze([]),
      status: DEFAULT_DOMAIN_STATUS,
    }),
  });
}

function vocabularyPackage(domainId = "domain.ontology-placeholder"): DomainVocabularyPackage {
  return Object.freeze({
    contractVersion: "DOM-2:1",
    vocabularyId: "vocabulary.ontology-placeholder.core",
    domainId,
    name: "Ontology Placeholder Vocabulary",
    description: "Neutral placeholder vocabulary metadata for ontology compatibility.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    status: "active",
    terms: Object.freeze([
      Object.freeze({
        termId: "term.ontology-placeholder.primary",
        label: "Ontology Placeholder",
        definition: Object.freeze({
          text: "Neutral placeholder vocabulary definition.",
          language: "en",
        }),
        synonyms: Object.freeze([]),
        scope: "domain",
        status: "active",
      }),
    ]),
  });
}

function ontologyPackage(overrides: Partial<DomainOntologyPackage> = {}): DomainOntologyPackage {
  return Object.freeze({
    contractVersion: "DOM-3:1",
    ontologyId: "ontology.placeholder.core",
    domainId: "domain.ontology-placeholder",
    vocabularyId: "vocabulary.ontology-placeholder.core",
    name: "Placeholder Ontology",
    description: "Neutral placeholder ontology metadata for infrastructure validation.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: DEFAULT_ONTOLOGY_STATUS,
    entityTypes: Object.freeze([
      Object.freeze({
        entityTypeId: "entity.placeholder.source",
        label: "Placeholder Source",
        description: "Neutral source entity metadata.",
        scope: "domain",
        status: "draft",
      }),
      Object.freeze({
        entityTypeId: "entity.placeholder.target",
        label: "Placeholder Target",
        description: "Neutral target entity metadata.",
        scope: "domain",
        status: "draft",
      }),
    ]),
    relationshipTypes: Object.freeze([
      Object.freeze({
        relationshipTypeId: "relationship.placeholder.link",
        label: "Placeholder Link",
        description: "Neutral relationship metadata.",
        sourceEntityTypeId: "entity.placeholder.source",
        targetEntityTypeId: "entity.placeholder.target",
        scope: "domain",
        status: "draft",
      }),
    ]),
    attributes: Object.freeze([
      Object.freeze({
        attributeId: "attribute.placeholder.label",
        ownerEntityTypeId: "entity.placeholder.source",
        label: "Placeholder Label",
        description: "Neutral attribute metadata.",
        valueType: "string",
        required: false,
        scope: "domain",
        status: "draft",
      }),
    ]),
    constraints: Object.freeze([
      Object.freeze({
        constraintId: "constraint.placeholder.attribute",
        targetType: "attribute",
        targetId: "attribute.placeholder.label",
        label: "Placeholder Constraint",
        description: "Neutral constraint metadata.",
        severity: "warning",
        scope: "domain",
        status: "draft",
      }),
    ]),
    ...overrides,
  });
}

function registeredDomainRegistry(domainId = "domain.ontology-placeholder") {
  return registerDomain(createDomainRegistry(), domainPackage(domainId)).registry;
}

function registeredVocabularyRegistry(domainId = "domain.ontology-placeholder") {
  const domainRegistry = registeredDomainRegistry(domainId);
  return registerDomainVocabulary(createDomainVocabularyRegistry(), vocabularyPackage(domainId), domainRegistry).registry;
}

test("creates ontology registry", () => {
  const registry = createDomainOntologyRegistry();

  assert.equal(registry.contractVersion, "DOM-3:1");
  assert.equal(registry.frozen, false);
  assert.equal(registry.ontologies.length, 0);
  assert.equal(Object.isFrozen(registry), true);
});

test("registers ontology package", () => {
  const result = registerDomainOntology(
    createDomainOntologyRegistry(),
    ontologyPackage(),
    registeredDomainRegistry(),
    registeredVocabularyRegistry()
  );

  assert.equal(result.success, true);
  assert.equal(result.ontology?.package.ontologyId, "ontology.placeholder.core");
  assert.equal(result.registry.ontologies.length, 1);
});

test("rejects duplicate ontology ids", () => {
  const first = registerDomainOntology(createDomainOntologyRegistry(), ontologyPackage());
  const duplicate = registerDomainOntology(first.registry, ontologyPackage({ name: "Duplicate Ontology" }));

  assert.equal(duplicate.success, false);
  assert.equal(duplicate.validation.issues.some((issue) => issue.code === "duplicate_ontology_id"), true);
});

test("rejects duplicate entity type ids", () => {
  const validation = validateDomainOntologyPackage(
    ontologyPackage({
      entityTypes: Object.freeze([
        Object.freeze({
          entityTypeId: "entity.duplicate",
          label: "Duplicate A",
          description: "Neutral duplicate metadata.",
          scope: "domain",
          status: "draft",
        }),
        Object.freeze({
          entityTypeId: "entity.duplicate",
          label: "Duplicate B",
          description: "Neutral duplicate metadata.",
          scope: "domain",
          status: "draft",
        }),
      ]),
      relationshipTypes: Object.freeze([]),
      attributes: Object.freeze([]),
      constraints: Object.freeze([]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "duplicate_entity_type_id"), true);
});

test("rejects duplicate relationship type ids", () => {
  const validation = validateDomainOntologyPackage(
    ontologyPackage({
      relationshipTypes: Object.freeze([
        Object.freeze({
          relationshipTypeId: "relationship.duplicate",
          label: "Duplicate A",
          description: "Neutral duplicate metadata.",
          sourceEntityTypeId: "entity.placeholder.source",
          targetEntityTypeId: "entity.placeholder.target",
          scope: "domain",
          status: "draft",
        }),
        Object.freeze({
          relationshipTypeId: "relationship.duplicate",
          label: "Duplicate B",
          description: "Neutral duplicate metadata.",
          sourceEntityTypeId: "entity.placeholder.source",
          targetEntityTypeId: "entity.placeholder.target",
          scope: "domain",
          status: "draft",
        }),
      ]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "duplicate_relationship_type_id"), true);
});

test("rejects duplicate attribute ids", () => {
  const validation = validateDomainOntologyPackage(
    ontologyPackage({
      attributes: Object.freeze([
        Object.freeze({
          attributeId: "attribute.duplicate",
          ownerEntityTypeId: "entity.placeholder.source",
          label: "Duplicate A",
          description: "Neutral duplicate metadata.",
          valueType: "string",
          required: false,
          scope: "domain",
          status: "draft",
        }),
        Object.freeze({
          attributeId: "attribute.duplicate",
          ownerEntityTypeId: "entity.placeholder.target",
          label: "Duplicate B",
          description: "Neutral duplicate metadata.",
          valueType: "string",
          required: false,
          scope: "domain",
          status: "draft",
        }),
      ]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "duplicate_attribute_id"), true);
});

test("rejects duplicate constraint ids", () => {
  const validation = validateDomainOntologyPackage(
    ontologyPackage({
      constraints: Object.freeze([
        Object.freeze({
          constraintId: "constraint.duplicate",
          targetType: "entity",
          targetId: "entity.placeholder.source",
          label: "Duplicate A",
          description: "Neutral duplicate metadata.",
          severity: "warning",
          scope: "domain",
          status: "draft",
        }),
        Object.freeze({
          constraintId: "constraint.duplicate",
          targetType: "entity",
          targetId: "entity.placeholder.target",
          label: "Duplicate B",
          description: "Neutral duplicate metadata.",
          severity: "warning",
          scope: "domain",
          status: "draft",
        }),
      ]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "duplicate_constraint_id"), true);
});

test("looks up and lists ontologies", () => {
  const registered = registerDomainOntology(createDomainOntologyRegistry(), ontologyPackage());

  assert.equal(getDomainOntology(registered.registry, "ontology.placeholder.core")?.package.name, "Placeholder Ontology");
  assert.equal(listDomainOntologies(registered.registry).length, 1);
  assert.equal(hasDomainOntology(registered.registry, "ontology.placeholder.core"), true);
});

test("lists ontologies by domain", () => {
  const registered = registerDomainOntology(createDomainOntologyRegistry(), ontologyPackage());
  const byDomain = listOntologiesByDomain(registered.registry, "domain.ontology-placeholder");

  assert.equal(byDomain.length, 1);
  assert.equal(byDomain[0].package.domainId, "domain.ontology-placeholder");
});

test("unregisters ontology", () => {
  const registered = registerDomainOntology(createDomainOntologyRegistry(), ontologyPackage());
  const removed = unregisterDomainOntology(registered.registry, "ontology.placeholder.core");

  assert.equal(removed.success, true);
  assert.equal(removed.registry.ontologies.length, 0);
});

test("freezes ontology registry and blocks mutation", () => {
  const registered = registerDomainOntology(createDomainOntologyRegistry(), ontologyPackage());
  const frozen = freezeDomainOntologyRegistry(registered.registry);
  const blocked = registerDomainOntology(
    frozen,
    ontologyPackage({ ontologyId: "ontology.placeholder.secondary", name: "Secondary Ontology" })
  );

  assert.equal(frozen.frozen, true);
  assert.equal(blocked.success, false);
  assert.equal(blocked.validation.issues.some((issue) => issue.code === "registry_frozen"), true);
});

test("builds ontology manifest", () => {
  const manifest = buildDomainOntologyManifest();

  assert.equal(manifest.contractVersion, "DOM-3:1");
  assert.equal(manifest.version, "DOM-3:1");
  assert.equal(manifest.metadataOnly, true);
  assert.equal(manifest.runtimeBehavior, false);
  assert.equal(manifest.readyFor, "DOM-3:2 Domain Ontology Query Layer");
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates ontology registry", () => {
  const registered = registerDomainOntology(createDomainOntologyRegistry(), ontologyPackage());

  assert.equal(validateDomainOntologyFoundation().valid, true);
  assert.equal(validateDomainOntologyRegistry(registered.registry).valid, true);
});

test("validates relationship, attribute, and constraint integrity", () => {
  const validation = validateDomainOntologyPackage(
    ontologyPackage({
      relationshipTypes: Object.freeze([
        Object.freeze({
          relationshipTypeId: "relationship.placeholder.invalid",
          label: "Invalid Relationship",
          description: "Neutral invalid relationship metadata.",
          sourceEntityTypeId: "entity.placeholder.missing",
          targetEntityTypeId: "entity.placeholder.target",
          scope: "domain",
          status: "draft",
        }),
      ]),
      attributes: Object.freeze([
        Object.freeze({
          attributeId: "attribute.placeholder.invalid",
          ownerEntityTypeId: "entity.placeholder.missing",
          label: "Invalid Attribute",
          description: "Neutral invalid attribute metadata.",
          valueType: "string",
          required: false,
          scope: "domain",
          status: "draft",
        }),
      ]),
      constraints: Object.freeze([
        Object.freeze({
          constraintId: "constraint.placeholder.invalid",
          targetType: "attribute",
          targetId: "attribute.placeholder.missing",
          label: "Invalid Constraint",
          description: "Neutral invalid constraint metadata.",
          severity: "warning",
          scope: "domain",
          status: "draft",
        }),
      ]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "missing_relationship_source"), true);
  assert.equal(validation.issues.some((issue) => issue.code === "missing_attribute_owner"), true);
  assert.equal(validation.issues.some((issue) => issue.code === "missing_constraint_target"), true);
});

test("validates domain reference compatibility", () => {
  const validation = validateDomainOntologyPackage(ontologyPackage(), createDomainRegistry());

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "missing_domain_reference"), true);
});

test("validates optional vocabulary compatibility", () => {
  const domainRegistry = registeredDomainRegistry();
  const vocabularyRegistry = registeredVocabularyRegistry();
  const success = registerDomainOntology(
    createDomainOntologyRegistry(),
    ontologyPackage(),
    domainRegistry,
    vocabularyRegistry
  );
  const missingVocabulary = validateDomainOntologyPackage(
    ontologyPackage({ vocabularyId: "vocabulary.missing" }),
    domainRegistry,
    vocabularyRegistry
  );

  assert.equal(success.success, true);
  assert.equal(missingVocabulary.valid, false);
  assert.equal(missingVocabulary.issues.some((issue) => issue.code === "missing_vocabulary_reference"), true);
});

test("exports public ontology APIs", () => {
  assert.equal(typeof DomainOntologyFoundation.createDomainOntologyRegistry, "function");
  assert.equal(typeof DomainOntologyFoundation.registerDomainOntology, "function");
  assert.equal(typeof DomainOntologyFoundation.buildDomainOntologyManifest, "function");
  assert.equal(typeof DomainOntologyFoundation.validateDomainOntologyRegistry, "function");
  assert.equal(Object.isFrozen(DomainOntologyFoundation), true);
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});

test("keeps DOM-2 compatibility", () => {
  assert.equal(validateDomainVocabularyFoundation().valid, true);
  assert.equal(DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status, "PASS");
});
