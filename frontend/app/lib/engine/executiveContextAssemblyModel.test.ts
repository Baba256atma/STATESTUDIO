import assert from "node:assert/strict";
import test from "node:test";
import {
  ExecutiveContextDomainRegistry,
  ExecutiveContextLifecycleRegistry,
  ExecutiveContextSourceRegistry,
} from "./executiveContextAssemblyRegistry.ts";
import * as publicApi from "./executiveContextAssemblyModel.ts";
import {
  ExecutiveContextAssemblyModel,
  ExecutiveContextCompositionModel,
  ExecutiveContextDomainModel,
  ExecutiveContextMetadataModel,
  ExecutiveContextModel,
  ExecutiveContextSnapshotModel,
  getExecutiveContextAssemblyModel,
  getExecutiveContextAssemblyModelSummary,
  getExecutiveContextCompositionModel,
  getExecutiveContextDomainModel,
  getExecutiveContextMetadataModel,
  getExecutiveContextModel,
  getExecutiveContextSnapshotModel,
} from "./executiveContextAssemblyModel.ts";
import { ExecutiveContextModel as EngineExecutiveContextModel } from "./engineModelIndex.ts";

test("aggregate model exists and is deeply immutable", () => {
  assert.ok(ExecutiveContextAssemblyModel);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyModel), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyModel.modelRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyModel.dependencies), true);
  assert.equal(Object.values(ExecutiveContextAssemblyModel).filter((value) => typeof value === "object").every(Object.isFrozen), true);
});

test("executive context model describes canonical fields and structural models", () => {
  assert.deepEqual([...ExecutiveContextModel.fields], [
    "contextId", "name", "description", "scope", "domains", "sources",
    "lifecycle", "version", "metadata", "status",
  ]);
  assert.deepEqual(Object.keys(ExecutiveContextModel.structuralModels), [
    "source", "scope", "version", "summary", "reference",
  ]);
  assert.equal(Object.values(ExecutiveContextModel.structuralModels).every(Object.isFrozen), true);
  assert.equal(ExecutiveContextModel.registryReferences.domains, ExecutiveContextDomainRegistry);
  assert.equal(ExecutiveContextModel.registryReferences.sources, ExecutiveContextSourceRegistry);
  assert.equal(ExecutiveContextModel.registryReferences.lifecycle, ExecutiveContextLifecycleRegistry);
  assert.equal(ExecutiveContextModel.status.model, "Model");
  assert.equal(ExecutiveContextModel.status.runtimeFree, "RuntimeFree");
});

test("domain, snapshot, and composition models are complete and frozen", () => {
  assert.deepEqual([...ExecutiveContextDomainModel.fields], [
    "domainId", "domainName", "category", "owner", "description", "visibility",
  ]);
  assert.equal(ExecutiveContextDomainModel.registryReference, ExecutiveContextDomainRegistry);
  assert.deepEqual([...ExecutiveContextSnapshotModel.fields], [
    "snapshotId", "timestampMetadata", "includedDomains", "includedSources",
    "snapshotVersion", "snapshotStatus",
  ]);
  assert.equal(ExecutiveContextSnapshotModel.storesData, false);
  assert.deepEqual([...ExecutiveContextCompositionModel.fields], [
    "compositionId", "domains", "sources", "scope", "relationships", "metadata",
  ]);
  assert.equal(ExecutiveContextCompositionModel.relationships.length, 3);
  assert.equal(ExecutiveContextCompositionModel.relationships.every(Object.isFrozen), true);
});

test("metadata model publishes version, namespace, owner, status, dependencies, and release metadata", () => {
  assert.equal(ExecutiveContextMetadataModel.modelVersion, "1.0.0");
  assert.equal(ExecutiveContextMetadataModel.modelNamespace, "nexora.engine.executive.context-assembly.model");
  assert.equal(ExecutiveContextMetadataModel.modelOwner, "ENG-4");
  assert.equal(ExecutiveContextMetadataModel.status.metadataOnly, "MetadataOnly");
  assert.equal(ExecutiveContextMetadataModel.status.immutable, "Immutable");
  assert.equal(ExecutiveContextMetadataModel.status.deterministic, "Deterministic");
  assert.deepEqual(ExecutiveContextMetadataModel.dependencies.map(({ phase }) => phase), [
    "ENG-1", "ENG-2", "ENG-3", "ENG-4:1", "ENG-4:2",
  ]);
  assert.equal(ExecutiveContextMetadataModel.dependencies.every(({ consumption }) => consumption === "PublicIndexOnly"), true);
  assert.equal(ExecutiveContextMetadataModel.releaseMetadata.nextPhase, "ENG-4:4");
});

test("model registry aggregates all five models with unique identifiers", () => {
  assert.equal(ExecutiveContextAssemblyModel.modelRegistry.length, 5);
  assert.deepEqual(ExecutiveContextAssemblyModel.modelRegistry.map(({ model }) => model), [
    ExecutiveContextModel, ExecutiveContextDomainModel, ExecutiveContextSnapshotModel,
    ExecutiveContextCompositionModel, ExecutiveContextMetadataModel,
  ]);
  assert.equal(new Set(ExecutiveContextAssemblyModel.modelRegistry.map(({ id }) => id)).size, 5);
});

test("helpers return deterministic canonical immutable references", () => {
  assert.equal(getExecutiveContextAssemblyModel(), ExecutiveContextAssemblyModel);
  assert.equal(getExecutiveContextModel(), ExecutiveContextModel);
  assert.equal(getExecutiveContextDomainModel(), ExecutiveContextDomainModel);
  assert.equal(getExecutiveContextSnapshotModel(), ExecutiveContextSnapshotModel);
  assert.equal(getExecutiveContextCompositionModel(), ExecutiveContextCompositionModel);
  assert.equal(getExecutiveContextMetadataModel(), ExecutiveContextMetadataModel);
  assert.equal(getExecutiveContextAssemblyModelSummary(), getExecutiveContextAssemblyModelSummary());
  assert.equal(Object.isFrozen(getExecutiveContextAssemblyModelSummary()), true);
  assert.equal(getExecutiveContextAssemblyModelSummary().modelCount, 5);
  assert.equal(getExecutiveContextAssemblyModelSummary().structuralModelCount, 5);
  assert.equal(getExecutiveContextAssemblyModelSummary().validationReady, true);
});

test("ENG-4 specialized model remains collision-safe against ENG-1 engine context model", () => {
  assert.equal(EngineExecutiveContextModel.id, "executive-context");
  assert.equal(EngineExecutiveContextModel.sourcePhase, "ENG-1:3");
  assert.equal(ExecutiveContextModel.id, "eng-4-model-executive-context");
  assert.equal(ExecutiveContextModel.phase, "ENG-4:3");
  assert.notEqual(ExecutiveContextModel.id, EngineExecutiveContextModel.id);
});

test("public model surface exposes only approved metadata APIs with no implementation leakage", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveContextAssemblyModel", "ExecutiveContextCompositionModel",
    "ExecutiveContextDomainModel", "ExecutiveContextMetadataModel",
    "ExecutiveContextModel", "ExecutiveContextSnapshotModel",
    "getExecutiveContextAssemblyModel", "getExecutiveContextAssemblyModelSummary",
    "getExecutiveContextCompositionModel", "getExecutiveContextDomainModel",
    "getExecutiveContextMetadataModel", "getExecutiveContextModel",
    "getExecutiveContextSnapshotModel",
  ].sort());
  assert.equal(Object.keys(publicApi).every((name) => !/Builder|Validation|Planner|Manifest|Platform|Certification|Freeze|Query/i.test(name)), true);
});
