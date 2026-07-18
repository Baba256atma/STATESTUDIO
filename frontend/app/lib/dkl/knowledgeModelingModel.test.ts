/**
 * DKL-4:3 — Knowledge Modeling Model Tests.
 *
 * Deterministic coverage for the immutable Knowledge Modeling Model phase.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as modelApi from "./knowledgeModelingModel.ts";
import {
  KnowledgeModelingModel,
  KnowledgeModelingModelIdentity,
  KnowledgeModelingModelVersion,
  KnowledgeModelingModelNamespace,
  KnowledgeModelingModelCatalog,
  KnowledgeModelingModelRelationships,
  KnowledgeModelingModelOwnership,
  KnowledgeModelingModelDependencies,
} from "./knowledgeModelingModel.ts";
import {
  KnowledgeModelingFoundationIdentity,
} from "./knowledgeModelingFoundation.ts";
import {
  KnowledgeModelingRegistry,
  KnowledgeModelingRegistryIdentity,
} from "./knowledgeModelingRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL43_FILES = [
  "knowledgeModelingModelTypes.ts",
  "knowledgeModelingKnowledgeObjectModel.ts",
  "knowledgeModelingBusinessObjectModel.ts",
  "knowledgeModelingRelationshipModel.ts",
  "knowledgeModelingIdentityReferenceModels.ts",
  "knowledgeModelingStructureModels.ts",
  "knowledgeModelingModel.ts",
  "knowledgeModelingModel.test.ts",
];

const REQUIRED_MODEL_KINDS = [
  "KnowledgeModel",
  "KnowledgeObject",
  "BusinessObject",
  "Entity",
  "Relationship",
  "KnowledgeIdentity",
  "KnowledgeMetadata",
  "KnowledgeHierarchy",
  "KnowledgeComposition",
  "KnowledgeReference",
  "SemanticStructure",
  "KnowledgeModelSnapshot",
  "KnowledgeModelContext",
  "KnowledgeModelProvenance",
  "KnowledgeModelState",
  "KnowledgeModelRelationshipSet",
  "KnowledgeModelObjectSet",
  "KnowledgeModelBoundary",
  "KnowledgeModelVersion",
  "KnowledgeModelSummary",
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

test("1. exactly eight DKL-4:3 files exist", () => {
  assert.equal(DKL43_FILES.length, 8);
  for (const file of DKL43_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. model module has exactly eight runtime exports", () => {
  assert.deepEqual(Object.keys(modelApi).sort(), [
    "KnowledgeModelingModel",
    "KnowledgeModelingModelCatalog",
    "KnowledgeModelingModelDependencies",
    "KnowledgeModelingModelIdentity",
    "KnowledgeModelingModelNamespace",
    "KnowledgeModelingModelOwnership",
    "KnowledgeModelingModelRelationships",
    "KnowledgeModelingModelVersion",
  ]);
});

test("3. model identity and version", () => {
  assert.equal(
    KnowledgeModelingModelIdentity.modelPhaseId,
    "DKL-4:3/KnowledgeModelingModel",
  );
  assert.equal(KnowledgeModelingModelIdentity.sourcePhase, "DKL-4:3");
  assert.equal(KnowledgeModelingModelIdentity.platformId, "DKL-4");
  assert.equal(KnowledgeModelingModelIdentity.status, "ModelComplete");
  assert.equal(KnowledgeModelingModelIdentity.readiness, "ReadyForValidation");
  assert.equal(KnowledgeModelingModelVersion, "1.0.0");
  assert.equal(
    KnowledgeModelingModelNamespace,
    "nexora.dkl.knowledge-modeling.model",
  );
  assert.equal(KnowledgeModelingModel.identity, KnowledgeModelingModelIdentity);
});

test("4. dependency on DKL-4:1 and DKL-4:2 public entry points only", () => {
  assert.equal(KnowledgeModelingModelDependencies.approvedDependencyCount, 2);
  assert.equal(
    KnowledgeModelingModelDependencies.approved[0]!.module,
    "knowledgeModelingFoundation.ts",
  );
  assert.equal(
    KnowledgeModelingModelDependencies.approved[1]!.module,
    "knowledgeModelingRegistry.ts",
  );
  assert.equal(
    KnowledgeModelingModel.foundation.identity,
    KnowledgeModelingFoundationIdentity,
  );
  assert.equal(
    KnowledgeModelingModel.registry.identity,
    KnowledgeModelingRegistryIdentity,
  );
  assert.equal(KnowledgeModelingModel.registry.readiness, true);
  assert.equal(KnowledgeModelingModelDependencies.noDirectDkl3Dependency, true);

  for (const file of DKL43_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
    for (const spec of imports) {
      assert.equal(/dataUnderstanding/i.test(spec), false, `${file}: ${spec}`);
      if (spec.includes("knowledgeModeling")) {
        const allowed =
          /knowledgeModelingFoundation\.ts$/.test(spec) ||
          /knowledgeModelingRegistry\.ts$/.test(spec) ||
          /knowledgeModelingModel/.test(spec) ||
          /knowledgeModelingKnowledgeObjectModel\.ts$/.test(spec) ||
          /knowledgeModelingBusinessObjectModel\.ts$/.test(spec) ||
          /knowledgeModelingRelationshipModel\.ts$/.test(spec) ||
          /knowledgeModelingIdentityReferenceModels\.ts$/.test(spec) ||
          /knowledgeModelingStructureModels\.ts$/.test(spec);
        assert.ok(allowed, `${file} imports forbidden module: ${spec}`);
      }
    }
  }
});

test("5. all required canonical models exist", () => {
  assert.equal(KnowledgeModelingModelCatalog.modelCount, 20);
  assert.deepEqual([...KnowledgeModelingModelCatalog.modelKinds], [
    ...REQUIRED_MODEL_KINDS,
  ]);
  for (const kind of REQUIRED_MODEL_KINDS) {
    assert.ok(KnowledgeModelingModelCatalog.byKind[kind], `missing ${kind}`);
  }
});

test("6. Knowledge Object model completeness", () => {
  const model = KnowledgeModelingModelCatalog.byKind.KnowledgeObject;
  assert.equal(model.modelId, "DKL-4:3/KnowledgeObject");
  assert.ok(model.fieldCount >= 19);
  const names = model.fields.map((f) => f.fieldName);
  for (const required of [
    "id",
    "type",
    "name",
    "description",
    "identity",
    "metadata",
    "owner",
    "lifecycleState",
    "status",
    "semanticClassifications",
    "hierarchyReferences",
    "compositionReferences",
    "outgoingRelationshipReferences",
    "incomingRelationshipReferences",
    "sourceUnderstandingReferences",
    "provenance",
    "compatibility",
    "extensionMetadata",
    "publicVisibility",
  ]) {
    assert.ok(names.includes(required), `missing field ${required}`);
  }
  for (const field of model.fields) {
    assert.equal(field.readonly, true);
    assert.equal(field.executableBehaviorImplied, false);
  }
});

test("7. Business Object model completeness", () => {
  const model = KnowledgeModelingModelCatalog.byKind.BusinessObject;
  assert.equal(model.modelId, "DKL-4:3/BusinessObject");
  assert.ok(model.fieldCount >= 15);
  const names = model.fields.map((f) => f.fieldName);
  for (const required of [
    "knowledgeObject",
    "businessObjectCategory",
    "organizationalRole",
    "businessDomain",
    "ownership",
    "sourceReferences",
    "relatedBusinessObjectReferences",
    "lifecycleState",
    "semanticLabels",
    "operationalRelevance",
    "executiveRelevance",
    "stability",
    "compatibility",
    "extensionPolicy",
    "behaviorImplemented",
  ]) {
    assert.ok(names.includes(required), `missing field ${required}`);
  }
  assert.deepEqual(
    (model as { allowedBusinessObjectCategories?: readonly string[] })
      .allowedBusinessObjectCategories,
    KnowledgeModelingRegistry.collections.businessObjectTypes.map((e) => e.name),
  );
});

test("8. Entity and Relationship model completeness", () => {
  const entity = KnowledgeModelingModelCatalog.byKind.Entity;
  const relationship = KnowledgeModelingModelCatalog.byKind.Relationship;
  assert.equal(entity.modelId, "DKL-4:3/Entity");
  assert.equal(relationship.modelId, "DKL-4:3/Relationship");
  const entityFields = entity.fields.map((f) => f.fieldName);
  for (const required of [
    "entityType",
    "canonicalIdentity",
    "aliases",
    "confidenceDeclaration",
    "ambiguityDeclaration",
    "entityResolutionPerformed",
    "mergePerformed",
    "confidenceCalculated",
  ]) {
    assert.ok(entityFields.includes(required), `entity missing ${required}`);
  }
  const relationshipFields = relationship.fields.map((f) => f.fieldName);
  for (const required of [
    "sourceObjectReference",
    "targetObjectReference",
    "direction",
    "cardinality",
    "strengthDeclaration",
    "confidenceDeclaration",
    "graphTraversalForbidden",
    "rulesEnforced",
    "strengthCalculated",
    "confidenceCalculated",
  ]) {
    assert.ok(relationshipFields.includes(required), `relationship missing ${required}`);
  }
  assert.equal(relationship.graphBehaviorForbidden, true);
});

test("9. Identity, Reference, Hierarchy, and Composition models exist", () => {
  assert.equal(
    KnowledgeModelingModelCatalog.byKind.KnowledgeIdentity.modelId,
    "DKL-4:3/KnowledgeIdentity",
  );
  assert.equal(
    KnowledgeModelingModelCatalog.byKind.KnowledgeReference.modelId,
    "DKL-4:3/KnowledgeReference",
  );
  assert.equal(
    KnowledgeModelingModelCatalog.byKind.KnowledgeHierarchy.modelId,
    "DKL-4:3/KnowledgeHierarchy",
  );
  assert.equal(
    KnowledgeModelingModelCatalog.byKind.KnowledgeComposition.modelId,
    "DKL-4:3/KnowledgeComposition",
  );
  const hierarchyFields = KnowledgeModelingModelCatalog.byKind.KnowledgeHierarchy.fields.map(
    (f) => f.fieldName,
  );
  assert.ok(hierarchyFields.includes("treeTraversalForbidden"));
  assert.ok(hierarchyFields.includes("cycleDetectionDeferred"));
  const compositionFields =
    KnowledgeModelingModelCatalog.byKind.KnowledgeComposition.fields.map((f) => f.fieldName);
  assert.ok(compositionFields.includes("runtimeAssemblyForbidden"));
});

test("10. Semantic Structure, Provenance, and Context models exist", () => {
  assert.equal(
    KnowledgeModelingModelCatalog.byKind.SemanticStructure.modelId,
    "DKL-4:3/SemanticStructure",
  );
  assert.equal(
    KnowledgeModelingModelCatalog.byKind.KnowledgeModelProvenance.modelId,
    "DKL-4:3/KnowledgeModelProvenance",
  );
  assert.equal(
    KnowledgeModelingModelCatalog.byKind.KnowledgeModelContext.modelId,
    "DKL-4:3/KnowledgeModelContext",
  );
  const semanticFields = KnowledgeModelingModelCatalog.byKind.SemanticStructure.fields.map(
    (f) => f.fieldName,
  );
  assert.ok(semanticFields.includes("inferenceForbidden"));
  assert.ok(semanticFields.includes("aiForbidden"));
  const provenanceFields =
    KnowledgeModelingModelCatalog.byKind.KnowledgeModelProvenance.fields.map(
      (f) => f.fieldName,
    );
  assert.ok(provenanceFields.includes("timestampsGeneratedAtRuntime"));
  assert.ok(provenanceFields.includes("transformationLogicForbidden"));
  const contextFields = KnowledgeModelingModelCatalog.byKind.KnowledgeModelContext.fields.map(
    (f) => f.fieldName,
  );
  assert.ok(contextFields.includes("contextAssemblyForbidden"));
});

test("11. registry categories are referenced correctly", () => {
  for (const model of KnowledgeModelingModelCatalog.models) {
    assert.ok(model.registryCategoryReferences.length > 0, model.modelId);
    assert.equal(model.sourcePhase, "DKL-4:3");
    assert.equal(model.owner, "DKL-4 Knowledge Modeling Model");
  }
  assert.ok(
    KnowledgeModelingModelCatalog.byKind.BusinessObject.registryCategoryReferences.includes(
      "BusinessObjectType",
    ),
  );
  assert.ok(
    KnowledgeModelingModelCatalog.byKind.Relationship.registryCategoryReferences.includes(
      "RelationshipType",
    ),
  );
});

test("12. contracts are readonly and exported metadata is frozen", () => {
  assert.equal(isDeeplyFrozen(KnowledgeModelingModel), true);
  assert.equal(isDeeplyFrozen(KnowledgeModelingModelCatalog), true);
  assert.equal(isDeeplyFrozen(KnowledgeModelingModelRelationships), true);
  assert.equal(isDeeplyFrozen(KnowledgeModelingModelOwnership), true);
  assert.equal(isDeeplyFrozen(KnowledgeModelingModelDependencies), true);
  for (const model of KnowledgeModelingModelCatalog.models) {
    assert.equal(Object.isFrozen(model), true);
    assert.equal(Object.isFrozen(model.fields), true);
    for (const field of model.fields) {
      assert.equal(field.readonly, true);
      assert.equal(Object.isFrozen(field), true);
    }
  }
});

test("13. deterministic ordering", () => {
  assert.deepEqual([...KnowledgeModelingModelCatalog.modelKinds], [
    ...REQUIRED_MODEL_KINDS,
  ]);
  assert.equal(KnowledgeModelingModelRelationships.declarationCount, 10);
  assert.equal(
    KnowledgeModelingModelRelationships.declarations.length,
    KnowledgeModelingModelRelationships.declarationCount,
  );
  const a = JSON.stringify(KnowledgeModelingModelCatalog.modelIds);
  const b = JSON.stringify(KnowledgeModelingModelCatalog.modelIds);
  assert.equal(a, b);
});

test("14. no runtime factory, builder, or graph behavior exists", () => {
  for (const [name, value] of Object.entries(modelApi)) {
    assert.notEqual(typeof value, "function", `${name} must not be a function`);
  }
  for (const file of DKL43_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(/\basync\s+function\b/.test(text), false, file);
    assert.equal(/\bnew\s+Promise\b/.test(text), false, file);
    assert.equal(/Math\.random|Date\.now|new Date\(|process\.env/.test(text), false, file);
    assert.equal(/\buuid\b|randomUUID/i.test(text), false, file);
    assert.equal(/\bexport\s+function\b/.test(text), false, file);
    assert.equal(/create[A-Z]\w*\s*\(/.test(text), false, file);
    assert.equal(/build[A-Z]\w*\s*\(/.test(text), false, file);
    assert.equal(/traverse|resolveEntity|inferMeaning/i.test(text), false, file);
  }
  assert.equal(KnowledgeModelingModel.guarantees.noObjectFactories, true);
  assert.equal(KnowledgeModelingModel.guarantees.noGraphOperations, true);
  assert.equal(KnowledgeModelingModelRelationships.graphTraversalForbidden, true);
});

test("15. ownership and completion readiness", () => {
  assert.ok(
    KnowledgeModelingModelOwnership.owns.includes("Canonical DKL-4 model contracts"),
  );
  assert.ok(
    KnowledgeModelingModelOwnership.doesNotOwn.includes("Entity resolution"),
  );
  assert.ok(KnowledgeModelingModelOwnership.doesNotOwn.includes("Graph traversal"));
  assert.equal(KnowledgeModelingModel.readiness.ModelComplete, true);
  assert.equal(KnowledgeModelingModel.readiness.ReadyForValidation, true);
  assert.equal(
    KnowledgeModelingModel.nextPhase,
    "DKL-4:4 — Knowledge Modeling Validation",
  );
  assert.equal(KnowledgeModelingModel.metadataOnly, true);
  assert.equal(KnowledgeModelingModel.modelOnly, true);
});
