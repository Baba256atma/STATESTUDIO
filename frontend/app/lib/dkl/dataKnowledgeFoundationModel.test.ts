import assert from "node:assert/strict";
import test from "node:test";

import * as foundationApi from "./dataKnowledgeFoundation.ts";
import * as modelApi from "./dataKnowledgeFoundationModel.ts";
import {
  BusinessObjectModel,
  DataKnowledgeFoundationModel,
  DataKnowledgeFoundationModelManifest,
  DataKnowledgeObjectModel,
  KnowledgeMetadataModel,
  KnowledgeRelationshipModel,
  getDataKnowledgeFoundationModel,
  getDataKnowledgeFoundationModelSummary,
} from "./dataKnowledgeFoundationModel.ts";
import * as registryApi from "./dataKnowledgeFoundationRegistryIndex.ts";

const EXPECTED_PUBLIC_API = [
  "DataKnowledgeFoundationModel",
  "DataKnowledgeObjectModel",
  "BusinessObjectModel",
  "KnowledgeRelationshipModel",
  "KnowledgeMetadataModel",
  "DataKnowledgeFoundationModelManifest",
  "getDataKnowledgeFoundationModel",
  "getDataKnowledgeFoundationModelSummary",
];

test("exports exactly eight public APIs", () => {
  assert.equal(Object.keys(modelApi).length, 8);
  assert.deepEqual(Object.keys(modelApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("every model exists on the aggregate platform", () => {
  assert.ok(DataKnowledgeFoundationModel.objectModel);
  assert.ok(DataKnowledgeFoundationModel.businessModel);
  assert.ok(DataKnowledgeFoundationModel.relationshipModel);
  assert.ok(DataKnowledgeFoundationModel.metadataModel);
  assert.ok(DataKnowledgeFoundationModel.manifest);
});

test("aggregate model platform and every nested model is deeply frozen", () => {
  assert.equal(Object.isFrozen(DataKnowledgeFoundationModel), true);
  assert.equal(Object.isFrozen(DataKnowledgeObjectModel), true);
  assert.equal(Object.isFrozen(BusinessObjectModel), true);
  assert.equal(Object.isFrozen(KnowledgeRelationshipModel), true);
  assert.equal(Object.isFrozen(KnowledgeMetadataModel), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationModelManifest), true);

  assert.equal(Object.isFrozen(DataKnowledgeObjectModel.identifier), true);
  assert.equal(Object.isFrozen(DataKnowledgeObjectModel.identifier.options), true);
  assert.equal(Object.isFrozen(DataKnowledgeObjectModel.organizationalKnowledge), true);

  assert.equal(Object.isFrozen(BusinessObjectModel.types), true);
  assert.equal(BusinessObjectModel.types.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(KnowledgeRelationshipModel.relationships), true);
  assert.equal(KnowledgeRelationshipModel.relationships.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(KnowledgeMetadataModel.fields), true);
  assert.equal(KnowledgeMetadataModel.fields.every(Object.isFrozen), true);

  assert.equal(Object.isFrozen(DataKnowledgeFoundationModelManifest.registeredModels), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationModelManifest.modelCategories), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationModelManifest.compatibility), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationModelManifest.foundationCompatibility), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationModelManifest.registryCompatibility), true);
});

test("mutation attempts on the frozen model are rejected", () => {
  assert.throws(() => {
    // @ts-expect-error runtime immutability guard
    DataKnowledgeFoundationModel.metadataOnly = false;
  }, TypeError);
  assert.throws(() => {
    // @ts-expect-error runtime immutability guard
    BusinessObjectModel.types.push(BusinessObjectModel.types[0]);
  }, TypeError);
});

test("knowledge object model captures every required facet", () => {
  assert.equal(DataKnowledgeObjectModel.kind, "knowledge-object");
  assert.equal(DataKnowledgeObjectModel.identifier.facet, "identifier");
  assert.equal(DataKnowledgeObjectModel.category.facet, "category");
  assert.equal(DataKnowledgeObjectModel.source.facet, "source");
  assert.equal(DataKnowledgeObjectModel.ownership.facet, "ownership");
  assert.equal(DataKnowledgeObjectModel.lifecycle.facet, "lifecycle");
  assert.equal(DataKnowledgeObjectModel.visibility.facet, "visibility");
  assert.equal(DataKnowledgeObjectModel.stability.facet, "stability");
  assert.equal(DataKnowledgeObjectModel.organizationalKnowledge.facet, "organizationalKnowledge");
});

test("business object model defines the eight entity types", () => {
  assert.equal(BusinessObjectModel.types.length, 8);
  assert.deepEqual(
    BusinessObjectModel.types.map((entry) => entry.typeKey),
    ["customer", "employee", "product", "project", "supplier", "department", "contract", "asset"]
  );
  assert.equal(new Set(BusinessObjectModel.types.map((entry) => entry.id)).size, 8);
});

test("relationship model defines the seven relationship types", () => {
  assert.equal(KnowledgeRelationshipModel.relationships.length, 7);
  assert.deepEqual(
    KnowledgeRelationshipModel.relationships.map((entry) => entry.relationKey),
    ["owns", "belongsTo", "references", "dependsOn", "reportsTo", "linkedTo", "relatedTo"]
  );
});

test("metadata model defines the seven metadata fields", () => {
  assert.equal(KnowledgeMetadataModel.fields.length, 7);
  assert.deepEqual(
    KnowledgeMetadataModel.fields.map((entry) => entry.fieldKey),
    ["createdBy", "modifiedBy", "version", "classification", "confidence", "sourceType", "namespace"]
  );
});

test("manifest is complete and immutable", () => {
  assert.equal(DataKnowledgeFoundationModelManifest.modelId, "DKL-1:3");
  assert.equal(DataKnowledgeFoundationModelManifest.modelVersion, "1.0.0");
  assert.equal(DataKnowledgeFoundationModelManifest.namespace, "nexora.dkl.foundation.model");
  assert.equal(DataKnowledgeFoundationModelManifest.registeredModels.length, 4);
  assert.equal(DataKnowledgeFoundationModelManifest.modelCategories.length, 4);
  assert.equal(DataKnowledgeFoundationModelManifest.stability, "Stable");
  assert.equal(DataKnowledgeFoundationModelManifest.certificationStatus, "Certified");
});

test("compatibility declarations are correct", () => {
  assert.equal(DataKnowledgeFoundationModelManifest.foundationCompatibility.phase, "DKL-1:1");
  assert.equal(DataKnowledgeFoundationModelManifest.foundationCompatibility.compatible, true);
  assert.equal(DataKnowledgeFoundationModelManifest.registryCompatibility.phase, "DKL-1:2");
  assert.equal(DataKnowledgeFoundationModelManifest.registryCompatibility.compatible, true);
  assert.equal(DataKnowledgeFoundationModelManifest.compatibility.backwardCompatible, true);
  assert.equal(DataKnowledgeFoundationModelManifest.compatibility.additiveOnly, true);
});

test("getDataKnowledgeFoundationModel returns canonical deterministic reference", () => {
  assert.equal(getDataKnowledgeFoundationModel(), DataKnowledgeFoundationModel);
  assert.equal(getDataKnowledgeFoundationModel(), getDataKnowledgeFoundationModel());
  assert.deepEqual(getDataKnowledgeFoundationModel(), getDataKnowledgeFoundationModel());
});

test("model summary is deterministic and frozen", () => {
  const first = getDataKnowledgeFoundationModelSummary();
  const second = getDataKnowledgeFoundationModelSummary();
  assert.equal(Object.isFrozen(first), true);
  assert.deepEqual(first, second);
  assert.equal(first.modelId, "DKL-1:3");
  assert.equal(first.modelVersion, "1.0.0");
  assert.equal(first.registeredModelCount, 4);
  assert.equal(first.businessObjectTypeCount, 8);
  assert.equal(first.relationshipTypeCount, 7);
  assert.equal(first.metadataFieldCount, 7);
  assert.equal(first.foundationPhase, "DKL-1:1");
  assert.equal(first.registryPhase, "DKL-1:2");
});

test("no runtime behavior exists in the public API surface", () => {
  const runtimeLike = Object.keys(modelApi).some((key) =>
    /parse|store|query|fetch|render|execute|ingest|connect|infer|embed|graph|extract/i.test(key)
  );
  assert.equal(runtimeLike, false);

  const functionExports = Object.entries(modelApi).filter(([, value]) => typeof value === "function");
  assert.deepEqual(
    functionExports.map(([key]) => key).sort(),
    ["getDataKnowledgeFoundationModel", "getDataKnowledgeFoundationModelSummary"]
  );
  for (const [, fn] of functionExports) {
    assert.equal((fn as (...args: unknown[]) => unknown).length, 0);
  }
});

test("foundation and registry metadata are not modified by the model layer", () => {
  assert.equal(Object.isFrozen(foundationApi.DataKnowledgeFoundation), true);
  assert.equal(foundationApi.DataKnowledgeFoundationIdentity.version, "1.0.0");
  assert.equal(foundationApi.DataKnowledgeFoundationIdentity.phaseId, "DKL-1:1");
  assert.equal(foundationApi.DataKnowledgeFoundationContracts.contracts.length, 7);

  assert.equal(Object.isFrozen(registryApi.DataKnowledgeFoundationRegistry), true);
  assert.equal(registryApi.DataKnowledgeFoundationRegistryManifest.registryId, "DKL-1:2");
  assert.equal(registryApi.DataKnowledgeFoundationPublicApiRegistry.length, 7);

  const modelKeys = Object.keys(modelApi);
  assert.equal(modelKeys.includes("DataKnowledgeFoundation"), false);
  assert.equal(modelKeys.includes("DataKnowledgeFoundationRegistry"), false);
});
