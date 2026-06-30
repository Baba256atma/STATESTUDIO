import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_ENTITY_TYPE_KEYS,
  BUSINESS_ONTOLOGY_CAPABILITY_KEYS,
  BUSINESS_ONTOLOGY_CATEGORY_KEYS,
  BUSINESS_ONTOLOGY_CONTRACT_VERSION,
  BUSINESS_ONTOLOGY_FUTURE_PHASE_KEYS,
  BUSINESS_ONTOLOGY_MUST_NOT_OWN,
  BUSINESS_ONTOLOGY_PRINCIPLES,
  BUSINESS_ONTOLOGY_PUBLIC_API_REGISTRY,
  BUSINESS_RELATIONSHIP_TYPE_KEYS,
} from "./businessOntologyCatalog.ts";
import {
  BUSINESS_ONTOLOGY_PUBLIC_API_RULES,
  BUSINESS_ONTOLOGY_SELF_MANIFEST,
  BusinessOntologyContract,
  getBusinessOntologyManifest,
  resolveBusinessDecisionExample,
  resolveBusinessDomainExample,
  resolveBusinessEntityExample,
  resolveBusinessGoalExample,
  resolveBusinessKpiExample,
  resolveBusinessRelationshipExample,
  resolveBusinessRiskExample,
  validateBusinessOntology,
} from "./businessOntologyContracts.ts";
import {
  BusinessOntology,
  buildBusinessOntology,
  getBusinessOntology,
  isBusinessOntologyInitialized,
  registerBusinessCapability,
  registerBusinessEntity,
  registerBusinessRelationship,
  resetBusinessOntologyForTests,
} from "./businessOntology.ts";
import {
  hasDuplicateBusinessIds,
  hasDuplicateBusinessNames,
  isBusinessEntityTypeKey,
  isBusinessRelationshipTypeKey,
  validateBusinessEntityRegistration,
  validateBusinessOntologyVersionFormat,
  validateBusinessRelationshipRegistration,
} from "./businessOntologyValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetBusinessOntologyForTests();
});

test("exports KNL/2 ontology contract vocabulary", () => {
  assert.equal(BUSINESS_ONTOLOGY_CONTRACT_VERSION, "KNL/2");
  assert.equal(BUSINESS_ENTITY_TYPE_KEYS.length, 19);
  assert.equal(BUSINESS_RELATIONSHIP_TYPE_KEYS.length, 12);
  assert.equal(BUSINESS_ONTOLOGY_CATEGORY_KEYS.length, 6);
});

test("initializes business ontology with KNL/1 foundation dependency", () => {
  assert.equal(isBusinessOntologyInitialized(), false);
  const init = buildBusinessOntology(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isBusinessOntologyInitialized(), true);
  assert.equal(init.data?.foundationDependency, "KNL/1");
  assert.equal(init.data?.contractVersion, "KNL/2");
});

test("seeds ontology catalog with categories capabilities and relationship types", () => {
  buildBusinessOntology(FIXED_TIME);
  const ontology = getBusinessOntology(FIXED_TIME);
  assert.equal(ontology.registry.categories.length, BUSINESS_ONTOLOGY_CATEGORY_KEYS.length);
  assert.equal(ontology.registry.capabilities.length, BUSINESS_ONTOLOGY_CAPABILITY_KEYS.length);
  assert.equal(ontology.registry.metadataRecords.length, 1);
  assert.equal(ontology.registry.entities.length, BUSINESS_RELATIONSHIP_TYPE_KEYS.length);
});

test("registers business entity relationship and capability", () => {
  buildBusinessOntology(FIXED_TIME);
  const entity = registerBusinessEntity(
    Object.freeze({
      entityId: "business-entity-test-001",
      entityType: "goal",
      name: "strategic_growth_goal",
      label: "Strategic Growth Goal",
      description: "Foundation test business entity.",
      categoryKey: "strategy",
    }),
    FIXED_TIME
  );
  assert.equal(entity.success, true);
  const relationship = registerBusinessRelationship(
    Object.freeze({
      relationshipId: "business-relationship-test-001",
      relationshipType: "supports",
      sourceEntityId: "business-entity-test-001",
      targetEntityId: "business-relationship-type-supports",
      label: "Supports",
      description: "Test relationship definition.",
    }),
    FIXED_TIME
  );
  assert.equal(relationship.success, true);
  const capability = registerBusinessCapability(
    Object.freeze({
      capabilityId: "business-capability-test-001",
      capabilityKey: "ontology_validation",
      label: "Ontology Validation",
      description: "Test capability registration.",
    }),
    FIXED_TIME
  );
  assert.equal(capability.success, true);
});

test("prevents duplicate entity ids and names", () => {
  buildBusinessOntology(FIXED_TIME);
  const input = Object.freeze({
    entityId: "business-relationship-type-owns",
    entityType: "entity" as const,
    name: "duplicate_name",
    label: "Duplicate",
    description: "Duplicate entity registration.",
    categoryKey: "structural" as const,
  });
  const duplicateId = registerBusinessEntity(input, FIXED_TIME);
  assert.equal(duplicateId.success, false);
  assert.match(duplicateId.reason, /already registered/);

  const unique = registerBusinessEntity(
    Object.freeze({
      entityId: "business-entity-unique-001",
      entityType: "entity",
      name: "owns",
      label: "Owns Name",
      description: "Duplicate name test.",
      categoryKey: "structural",
    }),
    FIXED_TIME
  );
  assert.equal(unique.success, false);
  assert.match(unique.reason, /name already registered/);
});

test("validates entity type and relationship definitions", () => {
  assert.equal(isBusinessEntityTypeKey("goal"), true);
  assert.equal(isBusinessEntityTypeKey("invalid"), false);
  assert.equal(isBusinessRelationshipTypeKey("depends_on"), true);
  assert.equal(isBusinessRelationshipTypeKey("invalid"), false);
  assert.equal(validateBusinessOntologyVersionFormat("KNL/2").valid, true);
  assert.equal(validateBusinessOntologyVersionFormat("APP-11/1").valid, false);
  assert.equal(hasDuplicateBusinessIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateBusinessNames(["Goal", "goal"]), true);
  assert.equal(
    validateBusinessRelationshipRegistration(
      Object.freeze({
        relationshipId: "rel-valid",
        relationshipType: "measures",
        sourceEntityId: "a",
        targetEntityId: "b",
        label: "Measures",
        description: "Valid relationship.",
      })
    ).valid,
    true
  );
  assert.equal(
    validateBusinessEntityRegistration(
      Object.freeze({
        entityId: "entity-valid",
        entityType: "kpi",
        name: "revenue_kpi",
        label: "Revenue KPI",
        description: "Valid entity.",
        categoryKey: "performance",
      })
    ).valid,
    true
  );
});

test("resolves immutable ontology contract examples", () => {
  assert.equal(Object.isFrozen(resolveBusinessDomainExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveBusinessEntityExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveBusinessGoalExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveBusinessKpiExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveBusinessRiskExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveBusinessDecisionExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveBusinessRelationshipExample(FIXED_TIME)), true);
  assert.equal(resolveBusinessRelationshipExample(FIXED_TIME).relationshipType, "depends_on");
});

test("builds immutable business ontology manifest", () => {
  buildBusinessOntology(FIXED_TIME);
  const manifest = getBusinessOntologyManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/2");
  assert.equal(manifest.foundationDependency, "KNL/1");
  assert.equal(manifest.supportedEntityTypes.length, 19);
  assert.equal(manifest.supportedRelationshipTypes.length, 12);
  assert.equal(manifest.publicApis.length, BUSINESS_ONTOLOGY_PUBLIC_API_REGISTRY.length);
});

test("validates business ontology certification report", () => {
  const report = validateBusinessOntology(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.foundationValid, true);
  assert.equal(report.ontologyInitialized, true);
  assert.equal(report.registryValid, true);
  assert.equal(report.identityValid, true);
});

test("validates KNL/2 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(BUSINESS_ONTOLOGY_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/businessOntology.ts",
    allowedFiles: BUSINESS_ONTOLOGY_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: BUSINESS_ONTOLOGY_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API and boundary rules", () => {
  assert.equal(BUSINESS_ONTOLOGY_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(BUSINESS_ONTOLOGY_PUBLIC_API_RULES.noGraphTraversal, true);
  assert.equal(BUSINESS_ONTOLOGY_PUBLIC_API_RULES.noRetrieval, true);
  assert.equal(BUSINESS_ONTOLOGY_MUST_NOT_OWN.includes("knowledge_graph"), true);
  assert.equal(BUSINESS_ONTOLOGY_MUST_NOT_OWN.includes("graph_traversal"), true);
  assert.equal(BUSINESS_ONTOLOGY_PRINCIPLES.includes("knl_2_consumes_knl_1_only"), true);
});

test("exports business ontology contract bundle", () => {
  assert.equal(BusinessOntologyContract.version, "KNL/2");
  assert.equal(typeof BusinessOntologyContract.validateBusinessOntology, "function");
  assert.equal(typeof BusinessOntologyContract.getBusinessOntologyManifest, "function");
});

test("BusinessOntology namespace exposes public APIs only", () => {
  assert.equal(typeof BusinessOntology.registerBusinessEntity, "function");
  assert.equal(typeof BusinessOntology.registerBusinessRelationship, "function");
  assert.equal(typeof BusinessOntology.registerBusinessCapability, "function");
  assert.equal(typeof BusinessOntology.getBusinessOntology, "function");
  assert.equal(typeof BusinessOntology.validateBusinessOntology, "function");
  assert.equal(typeof BusinessOntology.getBusinessOntologyManifest, "function");
  assert.equal(BusinessOntology.version, "KNL/2");
});

test("public API registry includes required ontology exports", () => {
  assert.ok(BUSINESS_ONTOLOGY_PUBLIC_API_REGISTRY.includes("registerBusinessEntity"));
  assert.ok(BUSINESS_ONTOLOGY_PUBLIC_API_REGISTRY.includes("registerBusinessRelationship"));
  assert.ok(BUSINESS_ONTOLOGY_PUBLIC_API_REGISTRY.includes("registerBusinessCapability"));
  assert.ok(BUSINESS_ONTOLOGY_PUBLIC_API_REGISTRY.includes("getBusinessOntology"));
  assert.ok(BUSINESS_ONTOLOGY_PUBLIC_API_REGISTRY.includes("validateBusinessOntology"));
  assert.ok(BUSINESS_ONTOLOGY_PUBLIC_API_REGISTRY.includes("getBusinessOntologyManifest"));
});

test("future phase registry reserves vocabulary without implementation", () => {
  assert.equal(BUSINESS_ONTOLOGY_FUTURE_PHASE_KEYS.includes("business_vocabulary"), true);
  assert.equal(BUSINESS_ONTOLOGY_FUTURE_PHASE_KEYS.includes("knowledge_graph"), true);
  assert.equal(BUSINESS_ONTOLOGY_FUTURE_PHASE_KEYS.includes("knowledge_retrieval"), true);
});

test("getBusinessOntology returns registry and state", () => {
  buildBusinessOntology(FIXED_TIME);
  const ontology = getBusinessOntology(FIXED_TIME);
  assert.equal(ontology.state.initialized, true);
  assert.equal(ontology.state.entityCount, BUSINESS_RELATIONSHIP_TYPE_KEYS.length);
  assert.equal(ontology.registry.snapshot.ontologyVersion, "KNL/2");
});

test("relationship type catalog includes all canonical definitions", () => {
  buildBusinessOntology(FIXED_TIME);
  const ontology = getBusinessOntology(FIXED_TIME);
  for (const relationshipType of BUSINESS_RELATIONSHIP_TYPE_KEYS) {
    assert.ok(
      ontology.registry.entities.some((entry) => entry.entityId === `business-relationship-type-${relationshipType}`)
    );
  }
});

test("rejects invalid relationship with same source and target", () => {
  assert.equal(
    validateBusinessRelationshipRegistration(
      Object.freeze({
        relationshipId: "rel-invalid",
        relationshipType: "owns",
        sourceEntityId: "same",
        targetEntityId: "same",
        label: "Owns",
        description: "Invalid self relationship.",
      })
    ).valid,
    false
  );
});
