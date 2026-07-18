import assert from "node:assert/strict";
import test from "node:test";

import * as foundationApi from "./dataKnowledgeFoundation.ts";
import * as registryApi from "./dataKnowledgeFoundationRegistryIndex.ts";
import {
  DataKnowledgeFoundationComponentRegistry,
  DataKnowledgeFoundationContractRegistry,
  DataKnowledgeFoundationPublicApiRegistry,
  DataKnowledgeFoundationRegistry,
  DataKnowledgeFoundationRegistryManifest,
  getDataKnowledgeFoundationComponentById,
  getDataKnowledgeFoundationRegistry,
  getDataKnowledgeFoundationRegistrySummary,
} from "./dataKnowledgeFoundationRegistryIndex.ts";

const EXPECTED_PUBLIC_API = [
  "DataKnowledgeFoundationRegistry",
  "DataKnowledgeFoundationComponentRegistry",
  "DataKnowledgeFoundationContractRegistry",
  "DataKnowledgeFoundationPublicApiRegistry",
  "DataKnowledgeFoundationRegistryManifest",
  "getDataKnowledgeFoundationRegistry",
  "getDataKnowledgeFoundationRegistrySummary",
  "getDataKnowledgeFoundationComponentById",
];

test("exports exactly eight public APIs", () => {
  assert.equal(Object.keys(registryApi).length, 8);
  assert.deepEqual(Object.keys(registryApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("every registry exists on the platform object", () => {
  assert.ok(DataKnowledgeFoundationRegistry.components);
  assert.ok(DataKnowledgeFoundationRegistry.contracts);
  assert.ok(DataKnowledgeFoundationRegistry.publicApis);
  assert.ok(DataKnowledgeFoundationRegistry.capabilities);
  assert.ok(DataKnowledgeFoundationRegistry.dependencies);
  assert.ok(DataKnowledgeFoundationRegistry.ownership);
  assert.ok(DataKnowledgeFoundationRegistry.identity);
  assert.ok(DataKnowledgeFoundationRegistry.manifest);
});

test("every registry object is deeply frozen", () => {
  assert.equal(Object.isFrozen(DataKnowledgeFoundationRegistry), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationComponentRegistry), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationContractRegistry), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationPublicApiRegistry), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationRegistryManifest), true);

  assert.equal(DataKnowledgeFoundationComponentRegistry.every(Object.isFrozen), true);
  assert.equal(DataKnowledgeFoundationContractRegistry.every(Object.isFrozen), true);
  assert.equal(DataKnowledgeFoundationPublicApiRegistry.every(Object.isFrozen), true);
  assert.equal(DataKnowledgeFoundationRegistry.capabilities.every(Object.isFrozen), true);

  assert.equal(Object.isFrozen(DataKnowledgeFoundationRegistry.capabilities), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationRegistry.dependencies), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationRegistry.ownership), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationRegistry.identity), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationRegistryManifest.categories), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationRegistryManifest.publicApiInventory), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationRegistryManifest.foundationCompatibility), true);
});

test("mutation attempts on frozen registry are rejected", () => {
  assert.throws(() => {
    // @ts-expect-error runtime immutability guard
    DataKnowledgeFoundationRegistry.metadataOnly = false;
  }, TypeError);
  assert.throws(() => {
    // @ts-expect-error runtime immutability guard
    DataKnowledgeFoundationRegistryManifest.certificationStatus = "Draft";
  }, TypeError);
});

test("every DKL-1:1 public API is registered exactly once", () => {
  const foundationExports = Object.keys(foundationApi).sort();
  const registeredNames = DataKnowledgeFoundationPublicApiRegistry.map((entry) => entry.name).sort();

  assert.equal(DataKnowledgeFoundationPublicApiRegistry.length, 7);
  assert.deepEqual(registeredNames, foundationExports);
  assert.equal(new Set(registeredNames).size, registeredNames.length);
  for (const entry of DataKnowledgeFoundationPublicApiRegistry) {
    assert.equal(entry.phase, "DKL-1:1");
  }
});

test("component registry registers the five foundation components", () => {
  assert.equal(DataKnowledgeFoundationComponentRegistry.length, 5);
  assert.deepEqual(
    DataKnowledgeFoundationComponentRegistry.map((entry) => entry.kind),
    ["identity", "ownership", "dependencies", "contracts", "foundation-object"]
  );
  assert.equal(
    new Set(DataKnowledgeFoundationComponentRegistry.map((entry) => entry.id)).size,
    DataKnowledgeFoundationComponentRegistry.length
  );
});

test("contract registry mirrors every foundation contract", () => {
  assert.equal(
    DataKnowledgeFoundationContractRegistry.length,
    foundationApi.DataKnowledgeFoundationContracts.contracts.length
  );
  assert.deepEqual(
    DataKnowledgeFoundationContractRegistry.map((entry) => entry.id),
    foundationApi.DataKnowledgeFoundationContracts.contracts.map((entry) => entry.id)
  );
});

test("architectural capabilities are declaration-only", () => {
  assert.equal(DataKnowledgeFoundationRegistry.capabilities.length, 5);
  assert.deepEqual(
    DataKnowledgeFoundationRegistry.capabilities.map((entry) => entry.key),
    [
      "knowledge-modeling",
      "business-object-ownership",
      "knowledge-metadata",
      "relationship-modeling",
      "organizational-knowledge",
    ]
  );
  for (const capability of DataKnowledgeFoundationRegistry.capabilities) {
    assert.equal(capability.declarationOnly, true);
    assert.equal(capability.metadataOnly, true);
  }
});

test("registry manifest is complete and immutable", () => {
  assert.equal(DataKnowledgeFoundationRegistryManifest.registryId, "DKL-1:2");
  assert.equal(DataKnowledgeFoundationRegistryManifest.registryVersion, "1.0.0");
  assert.equal(DataKnowledgeFoundationRegistryManifest.registryNamespace, "nexora.dkl.foundation.registry");
  assert.equal(DataKnowledgeFoundationRegistryManifest.stability, "Stable");
  assert.equal(DataKnowledgeFoundationRegistryManifest.certificationStatus, "Certified");
  assert.equal(DataKnowledgeFoundationRegistryManifest.foundationCompatibility.phase, "DKL-1:1");
  assert.equal(DataKnowledgeFoundationRegistryManifest.foundationCompatibility.compatible, true);
  assert.equal(DataKnowledgeFoundationRegistryManifest.registeredComponentCount, 5);
  assert.equal(DataKnowledgeFoundationRegistryManifest.publicApiInventory.length, 7);
  assert.equal(DataKnowledgeFoundationRegistryManifest.categories.length, 8);
});

test("component lookup returns correct metadata", () => {
  const identity = getDataKnowledgeFoundationComponentById("dkl-component-identity");
  assert.ok(identity);
  assert.equal(identity?.kind, "identity");
  assert.equal(identity?.publicApi, "DataKnowledgeFoundationIdentity");

  const foundationObject = getDataKnowledgeFoundationComponentById("dkl-component-foundation-object");
  assert.ok(foundationObject);
  assert.equal(foundationObject?.publicApi, "DataKnowledgeFoundation");
});

test("unknown component lookup returns undefined", () => {
  assert.equal(getDataKnowledgeFoundationComponentById("dkl-component-unknown"), undefined);
  assert.equal(getDataKnowledgeFoundationComponentById(""), undefined);
});

test("getDataKnowledgeFoundationRegistry returns canonical deterministic reference", () => {
  assert.equal(getDataKnowledgeFoundationRegistry(), DataKnowledgeFoundationRegistry);
  assert.equal(getDataKnowledgeFoundationRegistry(), getDataKnowledgeFoundationRegistry());
  assert.deepEqual(getDataKnowledgeFoundationRegistry(), getDataKnowledgeFoundationRegistry());
});

test("registry summaries are deterministic and frozen", () => {
  const first = getDataKnowledgeFoundationRegistrySummary();
  const second = getDataKnowledgeFoundationRegistrySummary();
  assert.equal(Object.isFrozen(first), true);
  assert.deepEqual(first, second);
  assert.equal(first.registryId, "DKL-1:2");
  assert.equal(first.registryVersion, "1.0.0");
  assert.equal(first.componentCount, 5);
  assert.equal(first.contractCount, DataKnowledgeFoundationContractRegistry.length);
  assert.equal(first.publicApiCount, 7);
  assert.equal(first.capabilityCount, 5);
  assert.equal(first.foundationPhase, "DKL-1:1");
  assert.equal(first.certificationStatus, "Certified");
  assert.equal(first.stability, "Stable");
});

test("registry extends foundation without replacing it", () => {
  assert.equal(DataKnowledgeFoundationRegistry.identity, foundationApi.DataKnowledgeFoundationIdentity);
  assert.equal(DataKnowledgeFoundationRegistry.ownership, foundationApi.DataKnowledgeFoundationOwnership);
  assert.equal(DataKnowledgeFoundationRegistry.dependencies, foundationApi.DataKnowledgeFoundationDependencies);
});

test("registry is metadata-only, immutable, deterministic with no runtime verbs", () => {
  assert.equal(DataKnowledgeFoundationRegistry.metadataOnly, true);
  assert.equal(DataKnowledgeFoundationRegistry.immutable, true);
  assert.equal(DataKnowledgeFoundationRegistry.deterministic, true);

  const runtimeLike = Object.keys(registryApi).some((key) =>
    /parse|store|query|fetch|render|execute|ingest|connect|infer|network|database/i.test(key)
  );
  assert.equal(runtimeLike, false);

  const functionExports = Object.entries(registryApi).filter(([, value]) => typeof value === "function");
  assert.deepEqual(
    functionExports.map(([key]) => key).sort(),
    [
      "getDataKnowledgeFoundationComponentById",
      "getDataKnowledgeFoundationRegistry",
      "getDataKnowledgeFoundationRegistrySummary",
    ]
  );
});
