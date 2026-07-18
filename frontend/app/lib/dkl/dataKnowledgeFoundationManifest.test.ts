import assert from "node:assert/strict";
import test from "node:test";

import * as foundationApi from "./dataKnowledgeFoundation.ts";
import * as manifestApi from "./dataKnowledgeFoundationManifestIndex.ts";
import {
  DataKnowledgeFoundationCompatibilityManifest,
  DataKnowledgeFoundationDependencyManifest,
  DataKnowledgeFoundationInventoryManifest,
  DataKnowledgeFoundationManifest,
  DataKnowledgeFoundationPhaseManifest,
  getDataKnowledgeFoundationManifest,
  getDataKnowledgeFoundationManifestSummary,
  getDataKnowledgeFoundationPhaseById,
} from "./dataKnowledgeFoundationManifestIndex.ts";
import * as modelApi from "./dataKnowledgeFoundationModel.ts";
import {
  BusinessObjectModel,
  KnowledgeMetadataModel,
  KnowledgeRelationshipModel,
} from "./dataKnowledgeFoundationModel.ts";
import * as registryApi from "./dataKnowledgeFoundationRegistryIndex.ts";
import {
  DataKnowledgeFoundationComponentRegistry,
  DataKnowledgeFoundationContractRegistry,
  DataKnowledgeFoundationPublicApiRegistry,
  DataKnowledgeFoundationRegistry,
} from "./dataKnowledgeFoundationRegistryIndex.ts";
import * as validationApi from "./dataKnowledgeFoundationValidation.ts";
import {
  DataKnowledgeFoundationValidationManifest,
  DataKnowledgeFoundationValidationRules,
} from "./dataKnowledgeFoundationValidation.ts";
import { isDeeplyFrozen } from "./dataKnowledgeFoundationValidationTypes.ts";

const EXPECTED_PUBLIC_API = [
  "DataKnowledgeFoundationManifest",
  "DataKnowledgeFoundationPhaseManifest",
  "DataKnowledgeFoundationInventoryManifest",
  "DataKnowledgeFoundationDependencyManifest",
  "DataKnowledgeFoundationCompatibilityManifest",
  "getDataKnowledgeFoundationManifest",
  "getDataKnowledgeFoundationManifestSummary",
  "getDataKnowledgeFoundationPhaseById",
];

const PHASE_IDS = ["DKL-1:1", "DKL-1:2", "DKL-1:3", "DKL-1:4"];

test("manifest exists and exports exactly eight public APIs", () => {
  assert.ok(DataKnowledgeFoundationManifest);
  assert.equal(Object.keys(manifestApi).length, 8);
  assert.deepEqual(Object.keys(manifestApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("manifest is deeply frozen", () => {
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationManifest), true);
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationPhaseManifest), true);
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationInventoryManifest), true);
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationDependencyManifest), true);
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationCompatibilityManifest), true);
});

test("all four phases are present and phase count equals four", () => {
  assert.equal(DataKnowledgeFoundationPhaseManifest.phaseCount, 4);
  assert.equal(DataKnowledgeFoundationPhaseManifest.phases.length, 4);
  assert.deepEqual(
    DataKnowledgeFoundationPhaseManifest.phases.map((phase) => phase.id),
    PHASE_IDS
  );
  assert.equal(DataKnowledgeFoundationManifest.foundation.id, "DKL-1:1");
  assert.equal(DataKnowledgeFoundationManifest.registry.id, "DKL-1:2");
  assert.equal(DataKnowledgeFoundationManifest.model.id, "DKL-1:3");
  assert.equal(DataKnowledgeFoundationManifest.validation.id, "DKL-1:4");
});

test("public API counts are 7 / 8 / 8 / 8", () => {
  const inventory = DataKnowledgeFoundationInventoryManifest.publicApis;
  assert.equal(inventory.foundation, 7);
  assert.equal(inventory.registry, 8);
  assert.equal(inventory.model, 8);
  assert.equal(inventory.validation, 8);
  assert.equal(inventory.total, 31);

  assert.deepEqual(
    DataKnowledgeFoundationPhaseManifest.phases.map((phase) => phase.publicApiCount),
    [7, 8, 8, 8]
  );
});

test("registry inventory matches Registry metadata", () => {
  const registry = DataKnowledgeFoundationInventoryManifest.registry;
  assert.equal(registry.components, DataKnowledgeFoundationComponentRegistry.length);
  assert.equal(registry.contracts, DataKnowledgeFoundationContractRegistry.length);
  assert.equal(registry.publicApis, DataKnowledgeFoundationPublicApiRegistry.length);
  assert.equal(registry.capabilities, DataKnowledgeFoundationRegistry.capabilities.length);
});

test("model inventory matches Model metadata", () => {
  const models = DataKnowledgeFoundationInventoryManifest.models;
  assert.equal(models.registeredModelCount, 4);
  assert.equal(models.businessObjectTypeCount, BusinessObjectModel.types.length);
  assert.equal(models.relationshipTypeCount, KnowledgeRelationshipModel.relationships.length);
  assert.equal(models.metadataFieldCount, KnowledgeMetadataModel.fields.length);
  assert.deepEqual(models.names, ["Knowledge Object", "Business Object", "Relationship", "Metadata"]);
});

test("validation inventory matches Validation metadata", () => {
  const validation = DataKnowledgeFoundationInventoryManifest.validation;
  assert.equal(validation.domains, DataKnowledgeFoundationValidationManifest.validationDomains.length);
  assert.equal(validation.rules, DataKnowledgeFoundationValidationRules.length);
  assert.equal(validation.status, "VALIDATED");
  assert.equal(validation.manifestId, "DKL-1:4");
});

test("dependency manifest matches Foundation declarations", () => {
  assert.deepEqual(
    DataKnowledgeFoundationDependencyManifest.allowed,
    foundationApi.DataKnowledgeFoundationDependencies.allowed
  );
  assert.deepEqual(
    DataKnowledgeFoundationDependencyManifest.future,
    foundationApi.DataKnowledgeFoundationDependencies.future
  );
  assert.deepEqual(
    DataKnowledgeFoundationDependencyManifest.forbidden,
    foundationApi.DataKnowledgeFoundationDependencies.forbidden
  );
});

test("ownership inventory matches Foundation declarations", () => {
  assert.deepEqual(
    DataKnowledgeFoundationInventoryManifest.ownership.owned,
    foundationApi.DataKnowledgeFoundationOwnership.owns
  );
  assert.deepEqual(
    DataKnowledgeFoundationInventoryManifest.ownership.nonOwned,
    foundationApi.DataKnowledgeFoundationOwnership.neverOwns
  );
});

test("compatibility guarantees are complete", () => {
  const { compatibleWith, guarantees } = DataKnowledgeFoundationCompatibilityManifest;
  assert.equal(compatibleWith.foundation, true);
  assert.equal(compatibleWith.registry, true);
  assert.equal(compatibleWith.model, true);
  assert.equal(compatibleWith.validation, true);
  assert.equal(guarantees.metadataOnly, true);
  assert.equal(guarantees.runtimeFree, true);
  assert.equal(guarantees.deepFrozen, true);
  assert.equal(guarantees.deterministic, true);
  assert.equal(guarantees.publicApiStable, true);
  assert.equal(guarantees.ownershipProtected, true);
  assert.equal(guarantees.dependencyProtected, true);
});

test("release metadata declares certified, stable, ready-for-platform", () => {
  assert.equal(DataKnowledgeFoundationManifest.release.manifestId, "DKL-1:5");
  assert.equal(DataKnowledgeFoundationManifest.release.namespace, "nexora.dkl.foundation.manifest");
  assert.equal(DataKnowledgeFoundationManifest.release.buildStatus, "CERTIFIED");
  assert.equal(DataKnowledgeFoundationManifest.release.stability, "STABLE");
  assert.equal(DataKnowledgeFoundationManifest.release.certification, "CERTIFIED");
  assert.equal(DataKnowledgeFoundationManifest.release.readiness, "ReadyForPlatform");
});

test("summary is deterministic", () => {
  const first = getDataKnowledgeFoundationManifestSummary();
  const second = getDataKnowledgeFoundationManifestSummary();
  assert.equal(Object.isFrozen(first), true);
  assert.deepEqual(first, second);
  assert.equal(first.totalPhases, 4);
  assert.equal(first.totalPublicApis, 31);
  assert.equal(first.totalModels, 4);
  assert.equal(first.totalRegistryComponents, 5);
  assert.equal(first.totalValidationRules, DataKnowledgeFoundationValidationRules.length);
  assert.equal(first.certification, "CERTIFIED");
  assert.equal(first.readiness, "ReadyForPlatform");
});

test("getDataKnowledgeFoundationManifest returns canonical reference without cloning", () => {
  assert.equal(getDataKnowledgeFoundationManifest(), DataKnowledgeFoundationManifest);
  assert.equal(getDataKnowledgeFoundationManifest(), getDataKnowledgeFoundationManifest());
});

test("known phase lookup succeeds", () => {
  const phase = getDataKnowledgeFoundationPhaseById("DKL-1:3");
  assert.ok(phase);
  assert.equal(phase?.id, "DKL-1:3");
  assert.equal(phase?.name, "Data Knowledge Foundation Model");
});

test("unknown phase lookup returns undefined without throwing", () => {
  assert.equal(getDataKnowledgeFoundationPhaseById("DKL-9:9"), undefined);
  assert.equal(getDataKnowledgeFoundationPhaseById(""), undefined);
});

test("aggregate manifest remains immutable", () => {
  assert.throws(() => {
    // @ts-expect-error runtime immutability guard
    DataKnowledgeFoundationManifest.metadataOnly = false;
  }, TypeError);
  assert.throws(() => {
    // @ts-expect-error runtime immutability guard
    DataKnowledgeFoundationManifest.phases.phases.push(DataKnowledgeFoundationManifest.foundation);
  }, TypeError);
});

test("no duplicated phase identifiers", () => {
  const ids = DataKnowledgeFoundationPhaseManifest.phases.map((phase) => phase.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("no duplicated inventories: sections are referenced, not copied", () => {
  assert.equal(DataKnowledgeFoundationManifest.inventory, DataKnowledgeFoundationInventoryManifest);
  assert.equal(DataKnowledgeFoundationManifest.dependencies, DataKnowledgeFoundationDependencyManifest);
  assert.equal(DataKnowledgeFoundationManifest.compatibility, DataKnowledgeFoundationCompatibilityManifest);
  assert.equal(DataKnowledgeFoundationManifest.phases, DataKnowledgeFoundationPhaseManifest);
  assert.equal(DataKnowledgeFoundationManifest.foundation, DataKnowledgeFoundationPhaseManifest.phases[0]);
});

test("earlier phase metadata remains unchanged", () => {
  assert.equal(foundationApi.DataKnowledgeFoundationIdentity.version, "1.0.0");
  assert.equal(foundationApi.DataKnowledgeFoundationContracts.contracts.length, 7);
  assert.equal(registryApi.DataKnowledgeFoundationRegistryManifest.registryId, "DKL-1:2");
  assert.equal(registryApi.DataKnowledgeFoundationPublicApiRegistry.length, 7);
  assert.equal(modelApi.DataKnowledgeFoundationModelManifest.modelId, "DKL-1:3");
  assert.equal(validationApi.DataKnowledgeFoundationValidationManifest.validationId, "DKL-1:4");
});

test("no runtime behavior exists in the public API surface", () => {
  const runtimeLike = Object.keys(manifestApi).some((key) =>
    /parse|store|query|fetch|render|ingest|connect|infer|scan|network|database|filesystem|async/i.test(key)
  );
  assert.equal(runtimeLike, false);

  const functionExports = Object.entries(manifestApi).filter(([, value]) => typeof value === "function");
  assert.deepEqual(
    functionExports.map(([key]) => key).sort(),
    [
      "getDataKnowledgeFoundationManifest",
      "getDataKnowledgeFoundationManifestSummary",
      "getDataKnowledgeFoundationPhaseById",
    ]
  );
});
