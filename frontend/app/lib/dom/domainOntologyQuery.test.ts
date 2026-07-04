import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { validateDomainVocabularyFoundation } from "./domainVocabularyIndex.ts";
import {
  createDomainOntologyRegistry,
  registerDomainOntology,
  validateDomainOntologyFoundation,
  type DomainOntologyPackage,
} from "./domainOntologyIndex.ts";
import {
  DomainOntologyQueryLayer,
  buildDomainOntologySnapshot,
  buildOntologyTraversalResult,
  compareDomainOntologySnapshots,
  diffDomainOntologySnapshots,
  findAttributesByOwner,
  findConnectedEntityTypes,
  findConstraintsByTarget,
  findDomainAttribute,
  findDomainConstraint,
  findDomainEntityType,
  findDomainRelationshipType,
  findIncomingRelationshipTypes,
  findOntologiesByDomain,
  findOntologiesByScope,
  findOntologiesByStatus,
  findOntologyContainingEntityType,
  findOntologyContainingRelationshipType,
  findOutgoingRelationshipTypes,
  queryDomainOntologies,
  sortDomainOntologies,
  validateDomainOntologySnapshot,
} from "./domainOntologyQueryIndex.ts";

function ontologyPackage(
  ontologyId: string,
  domainId: string,
  label: string,
  overrides: Partial<DomainOntologyPackage> = {}
): DomainOntologyPackage {
  const token = label.toLowerCase();
  return Object.freeze({
    contractVersion: "DOM-3:1",
    ontologyId,
    domainId,
    name: `${label} Ontology`,
    description: `${label} neutral ontology metadata.`,
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    entityTypes: Object.freeze([
      Object.freeze({
        entityTypeId: `entity.${token}.source`,
        label: `${label} Source`,
        description: `${label} source entity metadata.`,
        scope: "domain",
        status: "active",
      }),
      Object.freeze({
        entityTypeId: `entity.${token}.target`,
        label: `${label} Target`,
        description: `${label} target entity metadata.`,
        scope: "domain",
        status: "active",
      }),
    ]),
    relationshipTypes: Object.freeze([
      Object.freeze({
        relationshipTypeId: `relationship.${token}.link`,
        label: `${label} Link`,
        description: `${label} direct relationship metadata.`,
        sourceEntityTypeId: `entity.${token}.source`,
        targetEntityTypeId: `entity.${token}.target`,
        scope: "domain",
        status: "active",
      }),
    ]),
    attributes: Object.freeze([
      Object.freeze({
        attributeId: `attribute.${token}.label`,
        ownerEntityTypeId: `entity.${token}.source`,
        label: `${label} Label`,
        description: `${label} attribute metadata.`,
        valueType: "string",
        required: false,
        scope: "domain",
        status: "active",
      }),
    ]),
    constraints: Object.freeze([
      Object.freeze({
        constraintId: `constraint.${token}.label`,
        targetType: "attribute",
        targetId: `attribute.${token}.label`,
        label: `${label} Constraint`,
        description: `${label} constraint metadata.`,
        severity: "warning",
        scope: "domain",
        status: "active",
      }),
    ]),
    ...overrides,
  });
}

function fixtureRegistry() {
  const first = registerDomainOntology(
    createDomainOntologyRegistry(),
    ontologyPackage("ontology.beta.core", "domain.beta", "Beta")
  );
  assert.equal(first.success, true);
  const second = registerDomainOntology(
    first.registry,
    ontologyPackage("ontology.alpha.core", "domain.alpha", "Alpha")
  );
  assert.equal(second.success, true);
  const third = registerDomainOntology(
    second.registry,
    ontologyPackage("ontology.alpha.archive", "domain.alpha", "Archive", {
      scope: "module",
      status: "archived",
    })
  );
  assert.equal(third.success, true);
  return third.registry;
}

test("queries ontologies by domain", () => {
  assert.deepEqual(findOntologiesByDomain(fixtureRegistry(), "domain.alpha").map((entry) => entry.package.ontologyId), [
    "ontology.alpha.core",
    "ontology.alpha.archive",
  ]);
});

test("queries ontologies by scope", () => {
  assert.deepEqual(findOntologiesByScope(fixtureRegistry(), "module").map((entry) => entry.package.ontologyId), [
    "ontology.alpha.archive",
  ]);
});

test("queries ontologies by status", () => {
  assert.deepEqual(findOntologiesByStatus(fixtureRegistry(), "archived").map((entry) => entry.package.ontologyId), [
    "ontology.alpha.archive",
  ]);
});

test("sorts by ontology id", () => {
  assert.deepEqual(sortDomainOntologies(fixtureRegistry().ontologies, "ontologyId").map((entry) => entry.package.ontologyId), [
    "ontology.alpha.archive",
    "ontology.alpha.core",
    "ontology.beta.core",
  ]);
});

test("sorts by domain id", () => {
  assert.deepEqual(sortDomainOntologies(fixtureRegistry().ontologies, "domainId").map((entry) => entry.package.domainId), [
    "domain.alpha",
    "domain.alpha",
    "domain.beta",
  ]);
});

test("sorts by registration order", () => {
  assert.deepEqual(
    sortDomainOntologies(fixtureRegistry().ontologies, "registrationOrder").map((entry) => entry.package.ontologyId),
    ["ontology.beta.core", "ontology.alpha.core", "ontology.alpha.archive"]
  );
});

test("finds ontology containing entity type", () => {
  assert.equal(
    findOntologyContainingEntityType(fixtureRegistry(), "entity.alpha.source")?.package.ontologyId,
    "ontology.alpha.core"
  );
});

test("finds ontology containing relationship type", () => {
  assert.equal(
    findOntologyContainingRelationshipType(fixtureRegistry(), "relationship.alpha.link")?.package.ontologyId,
    "ontology.alpha.core"
  );
});

test("finds entity type by id", () => {
  const result = findDomainEntityType(fixtureRegistry(), "entity.beta.source");

  assert.equal(result.found, true);
  assert.equal(result.entityType?.label, "Beta Source");
});

test("finds relationship type by id", () => {
  const result = findDomainRelationshipType(fixtureRegistry(), "relationship.beta.link");

  assert.equal(result.found, true);
  assert.equal(result.relationshipType?.sourceEntityTypeId, "entity.beta.source");
});

test("finds attribute by id", () => {
  const result = findDomainAttribute(fixtureRegistry(), "attribute.alpha.label");

  assert.equal(result.found, true);
  assert.equal(result.attribute?.ownerEntityTypeId, "entity.alpha.source");
});

test("finds constraint by id", () => {
  const result = findDomainConstraint(fixtureRegistry(), "constraint.alpha.label");

  assert.equal(result.found, true);
  assert.equal(result.constraint?.targetId, "attribute.alpha.label");
});

test("finds attributes by owner", () => {
  assert.deepEqual(findAttributesByOwner(fixtureRegistry(), "entity.alpha.source").map((entry) => entry.attribute?.attributeId), [
    "attribute.alpha.label",
  ]);
});

test("finds constraints by target", () => {
  assert.deepEqual(findConstraintsByTarget(fixtureRegistry(), "attribute.alpha.label").map((entry) => entry.constraint?.constraintId), [
    "constraint.alpha.label",
  ]);
});

test("traverses outgoing relationships", () => {
  assert.deepEqual(
    findOutgoingRelationshipTypes(fixtureRegistry(), "entity.alpha.source").map((entry) => entry.relationshipType?.relationshipTypeId),
    ["relationship.alpha.link"]
  );
});

test("traverses incoming relationships", () => {
  assert.deepEqual(
    findIncomingRelationshipTypes(fixtureRegistry(), "entity.alpha.target").map((entry) => entry.relationshipType?.relationshipTypeId),
    ["relationship.alpha.link"]
  );
});

test("finds connected entity types", () => {
  assert.deepEqual(findConnectedEntityTypes(fixtureRegistry(), "entity.alpha.source").map((entry) => entry.entityType?.entityTypeId), [
    "entity.alpha.target",
  ]);
});

test("builds traversal result", () => {
  const result = buildOntologyTraversalResult(fixtureRegistry(), "entity.alpha.source");

  assert.equal(result.entity.found, true);
  assert.equal(result.outgoingRelationships.length, 1);
  assert.equal(result.incomingRelationships.length, 0);
  assert.equal(result.connectedEntities.length, 1);
});

test("builds ontology snapshot", () => {
  const snapshot = buildDomainOntologySnapshot(fixtureRegistry());

  assert.equal(snapshot.ontologyCount, 3);
  assert.deepEqual(snapshot.entries.map((entry) => entry.ontologyId), [
    "ontology.alpha.archive",
    "ontology.alpha.core",
    "ontology.beta.core",
  ]);
});

test("validates ontology snapshot", () => {
  const validation = validateDomainOntologySnapshot(buildDomainOntologySnapshot(fixtureRegistry()));

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
});

test("compares ontology snapshots", () => {
  assert.equal(
    compareDomainOntologySnapshots(buildDomainOntologySnapshot(fixtureRegistry()), buildDomainOntologySnapshot(fixtureRegistry())),
    true
  );
});

test("diffs added ontologies", () => {
  const diff = diffDomainOntologySnapshots(
    buildDomainOntologySnapshot(createDomainOntologyRegistry()),
    buildDomainOntologySnapshot(fixtureRegistry())
  );

  assert.equal(diff.entries.some((entry) => entry.type === "added"), true);
});

test("diffs removed ontologies", () => {
  const diff = diffDomainOntologySnapshots(
    buildDomainOntologySnapshot(fixtureRegistry()),
    buildDomainOntologySnapshot(createDomainOntologyRegistry())
  );

  assert.equal(diff.entries.some((entry) => entry.type === "removed"), true);
});

test("diffs modified ontologies", () => {
  const left = registerDomainOntology(
    createDomainOntologyRegistry(),
    ontologyPackage("ontology.alpha.core", "domain.alpha", "Alpha")
  ).registry;
  const right = registerDomainOntology(
    createDomainOntologyRegistry(),
    ontologyPackage("ontology.alpha.core", "domain.alpha", "Alpha", {
      description: "Modified neutral ontology metadata.",
    })
  ).registry;
  const diff = diffDomainOntologySnapshots(buildDomainOntologySnapshot(left), buildDomainOntologySnapshot(right));

  assert.equal(diff.entries.some((entry) => entry.type === "modified"), true);
});

test("exports public ontology query APIs", () => {
  assert.equal(typeof DomainOntologyQueryLayer.queryDomainOntologies, "function");
  assert.equal(typeof DomainOntologyQueryLayer.findDomainEntityType, "function");
  assert.equal(typeof DomainOntologyQueryLayer.buildOntologyTraversalResult, "function");
  assert.equal(typeof DomainOntologyQueryLayer.diffDomainOntologySnapshots, "function");
  assert.equal(Object.isFrozen(DomainOntologyQueryLayer), true);
});

test("keeps DOM-3:1 regression compatibility", () => {
  const registry = fixtureRegistry();
  const result = queryDomainOntologies(registry, {
    filter: Object.freeze({ domainId: "domain.alpha" }),
    sortKey: "ontologyId",
  });

  assert.equal(validateDomainOntologyFoundation().valid, true);
  assert.equal(result.length, 2);
});

test("keeps DOM-2 compatibility", () => {
  assert.equal(validateDomainVocabularyFoundation().valid, true);
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});
