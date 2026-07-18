/**
 * DKL-4:2 — Knowledge Modeling Registry Tests.
 *
 * Deterministic coverage for the immutable Knowledge Modeling Registry.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as registryApi from "./knowledgeModelingRegistry.ts";
import {
  KnowledgeModelingRegistry,
  KnowledgeModelingRegistryIdentity,
  KnowledgeModelingRegistryVersion,
  KnowledgeModelingRegistryNamespace,
  KnowledgeModelingRegistryCollections,
  KnowledgeModelingRegistryOwnership,
  KnowledgeModelingRegistryDependencies,
  KnowledgeModelingRegistrySummary,
} from "./knowledgeModelingRegistry.ts";
import {
  KnowledgeModelingFoundation,
  KnowledgeModelingFoundationIdentity,
} from "./knowledgeModelingFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL42_FILES = [
  "knowledgeModelingRegistryTypes.ts",
  "knowledgeModelingRegistryCatalog.ts",
  "knowledgeModelingBusinessObjectRegistry.ts",
  "knowledgeModelingRelationshipRegistry.ts",
  "knowledgeModelingRegistryOwnership.ts",
  "knowledgeModelingRegistryDependencies.ts",
  "knowledgeModelingRegistry.ts",
  "knowledgeModelingRegistry.test.ts",
];

const REQUIRED_COLLECTIONS = [
  "knowledgeModelTypes",
  "knowledgeObjectTypes",
  "businessObjectTypes",
  "entityTypes",
  "relationshipTypes",
  "identityTypes",
  "metadataTypes",
  "hierarchyTypes",
  "compositionTypes",
  "referenceTypes",
  "semanticStructureTypes",
  "lifecycleStates",
  "ownershipDeclarations",
  "boundaryDeclarations",
  "extensionPolicies",
  "compatibilityPolicies",
  "dependencyDeclarations",
  "publicFoundationApis",
] as const;

const REQUIRED_BUSINESS_OBJECTS = [
  "Customer",
  "Employee",
  "Product",
  "Service",
  "Supplier",
  "Department",
  "Team",
  "Project",
  "Program",
  "Contract",
  "Order",
  "Invoice",
  "Payment",
  "Asset",
  "Facility",
  "Process",
  "Task",
  "Goal",
  "KPI",
  "Risk",
  "Issue",
  "Opportunity",
  "Decision",
  "Event",
  "Document",
  "Communication",
] as const;

const REQUIRED_RELATIONSHIPS = [
  "owns",
  "belongsTo",
  "contains",
  "references",
  "dependsOn",
  "relatesTo",
  "reportsTo",
  "participatesIn",
  "responsibleFor",
  "createdBy",
  "assignedTo",
  "supplies",
  "purchases",
  "produces",
  "affects",
  "supports",
  "blocks",
  "precedes",
  "follows",
  "associatedWith",
] as const;

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

const allEntries = () =>
  REQUIRED_COLLECTIONS.flatMap((collection) => [
    ...KnowledgeModelingRegistryCollections[collection],
  ]);

test("1. exactly eight DKL-4:2 files exist", () => {
  assert.equal(DKL42_FILES.length, 8);
  for (const file of DKL42_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. registry module has exactly eight runtime exports", () => {
  assert.deepEqual(Object.keys(registryApi).sort(), [
    "KnowledgeModelingRegistry",
    "KnowledgeModelingRegistryCollections",
    "KnowledgeModelingRegistryDependencies",
    "KnowledgeModelingRegistryIdentity",
    "KnowledgeModelingRegistryNamespace",
    "KnowledgeModelingRegistryOwnership",
    "KnowledgeModelingRegistrySummary",
    "KnowledgeModelingRegistryVersion",
  ]);
});

test("3. registry identity and version", () => {
  assert.equal(
    KnowledgeModelingRegistryIdentity.registryId,
    "DKL-4:2/KnowledgeModelingRegistry",
  );
  assert.equal(KnowledgeModelingRegistryIdentity.sourcePhase, "DKL-4:2");
  assert.equal(KnowledgeModelingRegistryIdentity.platformId, "DKL-4");
  assert.equal(KnowledgeModelingRegistryIdentity.status, "RegistryComplete");
  assert.equal(KnowledgeModelingRegistryIdentity.readiness, "ReadyForModel");
  assert.equal(KnowledgeModelingRegistryVersion, "1.0.0");
  assert.equal(
    KnowledgeModelingRegistryNamespace,
    "nexora.dkl.knowledge-modeling.registry",
  );
  assert.equal(KnowledgeModelingRegistry.identity, KnowledgeModelingRegistryIdentity);
});

test("4. dependency on DKL-4:1 public foundation only", () => {
  assert.equal(
    KnowledgeModelingRegistryDependencies.approvedFoundationDependency.module,
    "knowledgeModelingFoundation.ts",
  );
  assert.equal(
    KnowledgeModelingRegistryDependencies.approvedFoundationDependency.foundationId,
    KnowledgeModelingFoundationIdentity.foundationId,
  );
  assert.equal(
    KnowledgeModelingRegistry.foundation.identity,
    KnowledgeModelingFoundationIdentity,
  );
  assert.equal(KnowledgeModelingRegistry.foundation.readiness, true);
  for (const file of DKL42_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
    for (const spec of imports) {
      assert.equal(/dataUnderstanding/i.test(spec), false, `${file}: ${spec}`);
      if (
        spec.includes("knowledgeModeling") &&
        !spec.includes("knowledgeModelingRegistry") &&
        !spec.includes("knowledgeModelingBusinessObjectRegistry") &&
        !spec.includes("knowledgeModelingRelationshipRegistry") &&
        !spec.endsWith("knowledgeModelingFoundation.ts")
      ) {
        assert.fail(`${file} imports forbidden DKL-4:1 internal module: ${spec}`);
      }
    }
  }
});

test("5. all required registry categories exist", () => {
  assert.deepEqual(Object.keys(KnowledgeModelingRegistryCollections), [
    ...REQUIRED_COLLECTIONS,
  ]);
  assert.equal(KnowledgeModelingRegistrySummary.registryCategoryCount, 18);
  for (const collection of REQUIRED_COLLECTIONS) {
    assert.ok(
      KnowledgeModelingRegistryCollections[collection].length > 0,
      `${collection} is empty`,
    );
  }
});

test("6. Business Object categories are registered", () => {
  const names = KnowledgeModelingRegistryCollections.businessObjectTypes.map(
    (entry) => entry.name,
  );
  assert.equal(names.length, 26);
  assert.deepEqual(names, [...REQUIRED_BUSINESS_OBJECTS]);
  for (const required of REQUIRED_BUSINESS_OBJECTS) {
    assert.ok(names.includes(required), `missing ${required}`);
  }
  for (const entry of KnowledgeModelingRegistryCollections.businessObjectTypes) {
    assert.equal(entry.category, "BusinessObjectType");
    assert.equal(entry.behaviorImplemented, false);
    assert.equal(entry.runtimeInstanceCreated, false);
    assert.equal(entry.persistenceSchemaAssumed, false);
  }
});

test("7. Relationship categories are registered", () => {
  const names = KnowledgeModelingRegistryCollections.relationshipTypes.map(
    (entry) => entry.name,
  );
  assert.equal(names.length, 20);
  assert.deepEqual(names, [...REQUIRED_RELATIONSHIPS]);
  for (const entry of KnowledgeModelingRegistryCollections.relationshipTypes) {
    assert.equal(entry.category, "RelationshipType");
    assert.ok(entry.direction.length > 0);
    assert.ok(entry.relationshipCategory.length > 0);
    assert.ok(entry.sourceCompatibility.length > 0);
    assert.ok(entry.targetCompatibility.length > 0);
    assert.ok(entry.cardinality.length > 0);
    assert.equal(entry.graphBehaviorEnforced, false);
    assert.equal(entry.lifecycleStatus, "Registered");
    assert.equal(entry.stabilityStatus, "Stable");
    assert.equal(entry.owner, "DKL-4 Knowledge Modeling Registry");
  }
});

test("8. unique identifiers across all registry entries", () => {
  const entries = allEntries();
  const ids = entries.map((entry) => entry.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(KnowledgeModelingRegistry.guarantees.uniqueIdentifiers, true);
});

test("9. unique names within each registry collection", () => {
  for (const collection of REQUIRED_COLLECTIONS) {
    const names = KnowledgeModelingRegistryCollections[collection].map(
      (entry) => entry.name,
    );
    assert.equal(
      new Set(names).size,
      names.length,
      `${collection} contains duplicate names`,
    );
  }
  assert.equal(
    KnowledgeModelingRegistry.guarantees.uniqueNamesWithinEachRegistry,
    true,
  );
});

test("10. deterministic ordering and summary counts", () => {
  assert.deepEqual(
    KnowledgeModelingRegistryCollections.businessObjectTypes.map((entry) => entry.name),
    [...REQUIRED_BUSINESS_OBJECTS],
  );
  assert.deepEqual(
    KnowledgeModelingRegistryCollections.relationshipTypes.map((entry) => entry.name),
    [...REQUIRED_RELATIONSHIPS],
  );
  assert.equal(KnowledgeModelingRegistrySummary.businessObjectTypeCount, 26);
  assert.equal(KnowledgeModelingRegistrySummary.relationshipTypeCount, 20);
  assert.equal(
    KnowledgeModelingRegistrySummary.lifecycleStateCount,
    KnowledgeModelingFoundation.lifecycle.stateCount,
  );
  assert.equal(KnowledgeModelingRegistrySummary.publicFoundationApiCount, 8);
  assert.equal(KnowledgeModelingRegistrySummary.totalEntryCount, allEntries().length);
});

test("11. every registry entry has the consistent immutable contract", () => {
  for (const entry of allEntries()) {
    assert.equal(Object.isFrozen(entry), true);
    assert.ok(entry.id.length > 0);
    assert.ok(entry.name.length > 0);
    assert.ok(entry.namespace.startsWith("nexora.dkl.knowledge-modeling.registry"));
    assert.ok(entry.description.length > 0);
    assert.ok(entry.category.length > 0);
    assert.equal(entry.owner, "DKL-4 Knowledge Modeling Registry");
    assert.equal(entry.sourcePhase, "DKL-4:2");
    assert.equal(entry.lifecycleStatus, "Registered");
    assert.equal(entry.stabilityStatus, "Stable");
    assert.ok(entry.compatibilityStatus.length > 0);
    assert.ok(entry.extensionStatus.length > 0);
    assert.equal(entry.publicVisibility, "Public");
    assert.equal(Object.isFrozen(entry.tags), true);
  }
});

test("12. ownership metadata and boundaries", () => {
  assert.ok(
    KnowledgeModelingRegistryOwnership.owns.includes(
      "Registration of DKL-4 modeling vocabulary",
    ),
  );
  assert.ok(
    KnowledgeModelingRegistryOwnership.owns.includes(
      "Relationship category registration",
    ),
  );
  assert.ok(
    KnowledgeModelingRegistryOwnership.doesNotOwn.includes(
      "runtime relationship creation",
    ),
  );
  assert.ok(KnowledgeModelingRegistryOwnership.doesNotOwn.includes("databases"));
  assert.ok(KnowledgeModelingRegistryOwnership.doesNotOwn.includes("UI"));
  assert.equal(
    KnowledgeModelingRegistryOwnership.noDuplicateArchitecturalOwnership,
    true,
  );
});

test("13. registry collections and entries are frozen", () => {
  assert.equal(Object.isFrozen(KnowledgeModelingRegistryCollections), true);
  for (const collection of REQUIRED_COLLECTIONS) {
    assert.equal(Object.isFrozen(KnowledgeModelingRegistryCollections[collection]), true);
  }
  assert.equal(isDeeplyFrozen(KnowledgeModelingRegistry), true);
  assert.equal(isDeeplyFrozen(KnowledgeModelingRegistryCollections), true);
  assert.equal(isDeeplyFrozen(KnowledgeModelingRegistrySummary), true);
});

test("14. no mutable registration API or runtime behavior exists", () => {
  for (const [name, value] of Object.entries(registryApi)) {
    assert.notEqual(typeof value, "function", `${name} must not be a function`);
  }
  const sourceFiles = DKL42_FILES.filter((file) => !file.endsWith(".test.ts"));
  for (const file of sourceFiles) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(/\basync\s+function\b/.test(text), false, file);
    assert.equal(/\bnew\s+Promise\b/.test(text), false, file);
    assert.equal(/Math\.random|Date\.now|new Date\(|process\.env/.test(text), false, file);
    assert.equal(/\buuid\b|randomUUID/i.test(text), false, file);
    assert.equal(/\bexport\s+function\b/.test(text), false, file);
    assert.equal(/register[A-Z]\w*\s*\(/.test(text), false, file);
    assert.equal(/create[A-Z]\w*\s*\(/.test(text), false, file);
    assert.equal(/dynamic import|import\(/.test(text), false, file);
  }
});

test("15. no forbidden dependencies or implementation leakage", () => {
  for (const file of DKL42_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/from\s+["'][^"']*\/engine\//i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*\/persistence/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*openai/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*dataUnderstanding/i.test(text), false, file);
    assert.equal(/source-code scanning|auto-discovery|dynamic plugin/i.test(text), false, file);
  }
  assert.equal(KnowledgeModelingRegistryDependencies.noDirectDkl3Dependency, true);
  assert.equal(KnowledgeModelingRegistryDependencies.noFutureDkl4Dependency, true);
});

test("16. completion status and readiness", () => {
  assert.equal(KnowledgeModelingRegistrySummary.status, "RegistryComplete");
  assert.equal(KnowledgeModelingRegistrySummary.readiness, "ReadyForModel");
  assert.equal(KnowledgeModelingRegistry.readiness.RegistryComplete, true);
  assert.equal(KnowledgeModelingRegistry.readiness.ReadyForModel, true);
  assert.equal(
    KnowledgeModelingRegistry.nextPhase,
    "DKL-4:3 — Knowledge Modeling Model",
  );
  assert.equal(KnowledgeModelingRegistry.metadataOnly, true);
  assert.equal(KnowledgeModelingRegistry.registryOnly, true);
});
