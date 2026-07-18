import assert from "node:assert/strict";
import test from "node:test";

import {
  ConnectorTypeRegistry,
  DataSourceRegistry,
  KnowledgeTypeRegistry,
  SourceKnowledgeCompatibilityRegistry,
} from "./dataSourceKnowledgeRegistryPlatform.ts";
import * as modelApi from "./dataSourceRegistryModelPlatform.ts";
import {
  CompatibilityModels,
  ConnectorModels,
  DataSourceModels,
  DataSourceRegistryModelManifest,
  DataSourceRegistryModelPlatform,
  DataSourceRegistryModelSummary,
  DataSourceRegistryModelVersion,
  KnowledgeModels,
  RegistryIdentityModels,
} from "./dataSourceRegistryModelPlatform.ts";

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

const EXPECTED_PUBLIC_API = [
  "DataSourceRegistryModelPlatform",
  "RegistryIdentityModels",
  "DataSourceModels",
  "KnowledgeModels",
  "ConnectorModels",
  "CompatibilityModels",
  "DataSourceRegistryModelManifest",
  "DataSourceRegistryModelSummary",
  "DataSourceRegistryModelVersion",
];

const allModelIds = (): readonly string[] => [
  ...RegistryIdentityModels.models.map((model) => model.identity.id),
  ...DataSourceModels.models.map((model) => model.identity.id),
  ...KnowledgeModels.models.map((model) => model.identity.id),
  ...ConnectorModels.models.map((model) => model.identity.id),
  ...CompatibilityModels.models.map((model) => model.identity.id),
];

test("canonical model module has exactly nine runtime exports", () => {
  assert.equal(Object.keys(modelApi).length, 9);
  assert.deepEqual(Object.keys(modelApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("identity models exist and cover all seven identity kinds", () => {
  assert.equal(RegistryIdentityModels.models.length, 7);
  const kinds = RegistryIdentityModels.models.map((model) => model.identityKind);
  assert.deepEqual(kinds, [
    "RegistryIdentity",
    "DataSourceIdentity",
    "KnowledgeIdentity",
    "ConnectorIdentity",
    "ContentIdentity",
    "SourceGroupIdentity",
    "CompatibilityIdentity",
  ]);
  for (const model of RegistryIdentityModels.models) {
    assert.ok(model.requiredFields.includes("id"));
    assert.ok(model.requiredFields.includes("version"));
    assert.ok(model.requiredFields.includes("lifecycle"));
  }
});

test("source, knowledge, connector, and compatibility models exist", () => {
  assert.equal(DataSourceModels.models.length, DataSourceRegistry.entries.length);
  assert.equal(KnowledgeModels.models.length, KnowledgeTypeRegistry.entries.length);
  assert.equal(ConnectorModels.models.length, ConnectorTypeRegistry.entries.length);
  assert.equal(
    CompatibilityModels.models.length,
    SourceKnowledgeCompatibilityRegistry.entries.length
  );
});

test("every model references a valid DKL-2:2 registry entry", () => {
  const sourceIds = new Set(DataSourceRegistry.entries.map((entry) => entry.identity.registryEntryId));
  const knowledgeIds = new Set(KnowledgeTypeRegistry.entries.map((entry) => entry.identity.registryEntryId));
  const connectorIds = new Set(ConnectorTypeRegistry.entries.map((entry) => entry.identity.registryEntryId));
  const compatIds = new Set(
    SourceKnowledgeCompatibilityRegistry.entries.map((entry) => entry.identity.registryEntryId)
  );
  for (const model of DataSourceModels.models) {
    assert.ok(sourceIds.has(model.registryEntryId));
  }
  for (const model of KnowledgeModels.models) {
    assert.ok(knowledgeIds.has(model.registryEntryId));
  }
  for (const model of ConnectorModels.models) {
    assert.ok(connectorIds.has(model.registryEntryId));
  }
  for (const model of CompatibilityModels.models) {
    assert.ok(compatIds.has(model.registryEntryId));
    assert.ok(sourceIds.has(model.sourceCategoryId));
    assert.ok(knowledgeIds.has(model.knowledgeCategoryId));
  }
});

test("all model identifiers are globally unique", () => {
  const ids = allModelIds();
  assert.equal(new Set(ids).size, ids.length);
});

test("no model has an empty id or name", () => {
  for (const id of allModelIds()) {
    assert.ok(id.length > 0);
  }
  for (const container of [
    RegistryIdentityModels,
    DataSourceModels,
    KnowledgeModels,
    ConnectorModels,
    CompatibilityModels,
  ]) {
    for (const model of container.models) {
      assert.ok(model.identity.name.length > 0);
    }
  }
});

test("unknown lookup ids return undefined", () => {
  assert.equal(RegistryIdentityModels.getById("nope"), undefined);
  assert.equal(DataSourceModels.getById("nope"), undefined);
  assert.equal(KnowledgeModels.getById("nope"), undefined);
  assert.equal(ConnectorModels.getById("nope"), undefined);
  assert.equal(CompatibilityModels.getById("nope"), undefined);
});

test("known lookups resolve to canonical models", () => {
  const first = DataSourceModels.models[0];
  assert.equal(DataSourceModels.getById(first.identity.id), first);
  assert.equal(DataSourceModels.getById("dsk-model-datasource-database")?.sourceCategory, "database");
});

test("manifest counts match the actual model registries", () => {
  assert.equal(DataSourceRegistryModelManifest.identityModelCount, RegistryIdentityModels.models.length);
  assert.equal(DataSourceRegistryModelManifest.dataSourceModelCount, DataSourceModels.models.length);
  assert.equal(DataSourceRegistryModelManifest.knowledgeModelCount, KnowledgeModels.models.length);
  assert.equal(DataSourceRegistryModelManifest.connectorModelCount, ConnectorModels.models.length);
  assert.equal(DataSourceRegistryModelManifest.compatibilityModelCount, CompatibilityModels.models.length);
  assert.equal(DataSourceRegistryModelManifest.totalModels, allModelIds().length);
  assert.equal(DataSourceRegistryModelManifest.duplicateIdStatus, "none");
});

test("all public objects are deeply frozen", () => {
  assert.ok(isDeeplyFrozen(DataSourceRegistryModelPlatform));
  assert.ok(isDeeplyFrozen(RegistryIdentityModels));
  assert.ok(isDeeplyFrozen(DataSourceModels));
  assert.ok(isDeeplyFrozen(KnowledgeModels));
  assert.ok(isDeeplyFrozen(ConnectorModels));
  assert.ok(isDeeplyFrozen(CompatibilityModels));
  assert.ok(isDeeplyFrozen(DataSourceRegistryModelManifest));
  assert.ok(isDeeplyFrozen(DataSourceRegistryModelSummary));
});

test("platform aggregates model registries by reference", () => {
  assert.equal(DataSourceRegistryModelPlatform.identityModels, RegistryIdentityModels);
  assert.equal(DataSourceRegistryModelPlatform.sourceModels, DataSourceModels);
  assert.equal(DataSourceRegistryModelPlatform.knowledgeModels, KnowledgeModels);
  assert.equal(DataSourceRegistryModelPlatform.connectorModels, ConnectorModels);
  assert.equal(DataSourceRegistryModelPlatform.compatibilityModels, CompatibilityModels);
  assert.equal(DataSourceRegistryModelPlatform.manifest, DataSourceRegistryModelManifest);
});

test("dependency is limited to DKL-2:1 and DKL-2:2 public APIs", () => {
  assert.deepEqual([...DataSourceRegistryModelManifest.dependency], ["DKL-2:1", "DKL-2:2"]);
});

test("no runtime or forbidden behavior is exposed by public APIs", () => {
  const forbidden = /discover|ingest|parse|crawl|synchron|persist|fetch|embedding|extract|async|await|execute/i;
  for (const name of Object.keys(modelApi)) {
    assert.ok(!forbidden.test(name), `public API ${name} must not imply runtime behavior`);
  }
});

test("registry ordering and repeated lookups are deterministic", () => {
  const firstIds = DataSourceModels.models.map((model) => model.identity.id);
  const secondIds = DataSourceModels.models.map((model) => model.identity.id);
  assert.deepEqual(firstIds, secondIds);
  assert.equal(
    ConnectorModels.getById("dsk-model-connector-type-api"),
    ConnectorModels.getById("dsk-model-connector-type-api")
  );
});

test("version and summary are consistent and ready for DKL-2:4", () => {
  assert.equal(DataSourceRegistryModelVersion, "1.0.0");
  assert.equal(DataSourceRegistryModelSummary.version, DataSourceRegistryModelVersion);
  assert.equal(DataSourceRegistryModelSummary.readiness, "ReadyForValidation");
  assert.equal(DataSourceRegistryModelManifest.readiness, "ReadyForValidation");
  assert.deepEqual(
    [...DataSourceRegistryModelManifest.completion],
    ["ModelComplete", "MetadataOnly", "RuntimeFree", "Deterministic", "Immutable", "ReadyForValidation"]
  );
});
