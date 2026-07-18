import assert from "node:assert/strict";
import test from "node:test";

import { DataSourceKnowledgeRegistryMetadata } from "./dataSourceKnowledgeRegistryFoundation.ts";
import * as platformApi from "./dataSourceKnowledgeRegistryPlatform.ts";
import {
  ConnectorTypeRegistry,
  ContentTypeRegistry,
  DataSourceKnowledgeRegistryManifest,
  DataSourceKnowledgeRegistryPlatform,
  DataSourceRegistry,
  KnowledgeTypeRegistry,
  SourceGroupRegistry,
  SourceKnowledgeCompatibilityRegistry,
} from "./dataSourceKnowledgeRegistryPlatform.ts";

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
  "DataSourceKnowledgeRegistryPlatform",
  "DataSourceRegistry",
  "KnowledgeTypeRegistry",
  "ConnectorTypeRegistry",
  "ContentTypeRegistry",
  "SourceGroupRegistry",
  "SourceKnowledgeCompatibilityRegistry",
  "DataSourceKnowledgeRegistryManifest",
];

const allEntryIds = (): readonly string[] => [
  ...DataSourceRegistry.entries.map((entry) => entry.identity.registryEntryId),
  ...KnowledgeTypeRegistry.entries.map((entry) => entry.identity.registryEntryId),
  ...ConnectorTypeRegistry.entries.map((entry) => entry.identity.registryEntryId),
  ...ContentTypeRegistry.entries.map((entry) => entry.identity.registryEntryId),
  ...SourceGroupRegistry.entries.map((entry) => entry.identity.registryEntryId),
  ...SourceKnowledgeCompatibilityRegistry.entries.map((entry) => entry.identity.registryEntryId),
];

test("2. canonical platform module has exactly eight runtime exports", () => {
  assert.equal(Object.keys(platformApi).length, 8);
  assert.deepEqual(Object.keys(platformApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("3. every approved data-source category is registered exactly once", () => {
  const registeredKeys = DataSourceRegistry.entries.map((entry) => entry.sourceCategory);
  assert.equal(registeredKeys.length, DataSourceKnowledgeRegistryMetadata.dataSourceCategories.length);
  for (const category of DataSourceKnowledgeRegistryMetadata.dataSourceCategories) {
    assert.equal(registeredKeys.filter((key) => key === category.key).length, 1);
  }
});

test("4. every approved knowledge category is registered exactly once", () => {
  const registeredKeys = KnowledgeTypeRegistry.entries.map((entry) => entry.knowledgeCategory);
  assert.equal(registeredKeys.length, DataSourceKnowledgeRegistryMetadata.knowledgeCategories.length);
  for (const category of DataSourceKnowledgeRegistryMetadata.knowledgeCategories) {
    assert.equal(registeredKeys.filter((key) => key === category.key).length, 1);
  }
});

test("5, 6, 7. connector, content, and source-group entries are unique", () => {
  for (const registry of [ConnectorTypeRegistry, ContentTypeRegistry, SourceGroupRegistry]) {
    const ids = registry.entries.map((entry) => entry.identity.registryEntryId);
    assert.equal(new Set(ids).size, ids.length);
  }
});

test("8. all registry identifiers are globally unique", () => {
  const ids = allEntryIds();
  assert.equal(new Set(ids).size, ids.length);
});

test("9. every registry reference resolves", () => {
  const groupIds = new Set(SourceGroupRegistry.entries.map((entry) => entry.identity.registryEntryId));
  const connectorIds = new Set(ConnectorTypeRegistry.entries.map((entry) => entry.identity.registryEntryId));
  const contentIds = new Set(ContentTypeRegistry.entries.map((entry) => entry.identity.registryEntryId));
  for (const entry of DataSourceRegistry.entries) {
    assert.ok(groupIds.has(entry.sourceGroupId), `missing group ${entry.sourceGroupId}`);
    for (const connectorId of entry.supportedConnectorTypeIds) {
      assert.ok(connectorIds.has(connectorId), `missing connector ${connectorId}`);
    }
    for (const contentId of entry.supportedContentTypeIds) {
      assert.ok(contentIds.has(contentId), `missing content ${contentId}`);
    }
  }
  for (const entry of KnowledgeTypeRegistry.entries) {
    for (const groupId of entry.allowedSourceGroupIds) {
      assert.ok(groupIds.has(groupId), `missing group ${groupId}`);
    }
    for (const contentId of entry.supportedContentTypeIds) {
      assert.ok(contentIds.has(contentId), `missing content ${contentId}`);
    }
  }
});

test("10. compatibility relationships reference valid source and knowledge entries", () => {
  const sourceIds = new Set(DataSourceRegistry.entries.map((entry) => entry.identity.registryEntryId));
  const knowledgeIds = new Set(KnowledgeTypeRegistry.entries.map((entry) => entry.identity.registryEntryId));
  for (const entry of SourceKnowledgeCompatibilityRegistry.entries) {
    assert.ok(sourceIds.has(entry.sourceCategoryId), `missing source ${entry.sourceCategoryId}`);
    assert.ok(knowledgeIds.has(entry.knowledgeCategoryId), `missing knowledge ${entry.knowledgeCategoryId}`);
  }
});

test("11. unknown lookup ids return undefined or immutable empty results", () => {
  assert.equal(DataSourceRegistry.getById("nope"), undefined);
  assert.equal(KnowledgeTypeRegistry.getById("nope"), undefined);
  assert.equal(ConnectorTypeRegistry.getById("nope"), undefined);
  assert.equal(ContentTypeRegistry.getById("nope"), undefined);
  assert.equal(SourceGroupRegistry.getById("nope"), undefined);
  assert.equal(SourceKnowledgeCompatibilityRegistry.getById("nope"), undefined);
  const emptySource = SourceKnowledgeCompatibilityRegistry.getBySourceId("nope");
  const emptyKnowledge = SourceKnowledgeCompatibilityRegistry.getByKnowledgeId("nope");
  assert.equal(emptySource.length, 0);
  assert.equal(emptyKnowledge.length, 0);
  assert.ok(Object.isFrozen(emptySource));
  assert.ok(Object.isFrozen(emptyKnowledge));
});

test("known lookups resolve to canonical entries", () => {
  const first = DataSourceRegistry.entries[0];
  assert.equal(DataSourceRegistry.getById(first.identity.registryEntryId), first);
  const crmMatches = SourceKnowledgeCompatibilityRegistry.getBySourceId("dsk-datasource-crm");
  assert.ok(crmMatches.length >= 5);
  const customerMatches = SourceKnowledgeCompatibilityRegistry.getByKnowledgeId("dsk-knowledgetype-customer");
  assert.ok(customerMatches.length >= 1);
});

test("12. all public objects are deeply frozen", () => {
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeRegistryPlatform));
  assert.ok(isDeeplyFrozen(DataSourceRegistry));
  assert.ok(isDeeplyFrozen(KnowledgeTypeRegistry));
  assert.ok(isDeeplyFrozen(ConnectorTypeRegistry));
  assert.ok(isDeeplyFrozen(ContentTypeRegistry));
  assert.ok(isDeeplyFrozen(SourceGroupRegistry));
  assert.ok(isDeeplyFrozen(SourceKnowledgeCompatibilityRegistry));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeRegistryManifest));
});

test("13. manifest counts match the actual registries", () => {
  assert.equal(DataSourceKnowledgeRegistryManifest.totalDataSourceEntries, DataSourceRegistry.entries.length);
  assert.equal(DataSourceKnowledgeRegistryManifest.totalKnowledgeEntries, KnowledgeTypeRegistry.entries.length);
  assert.equal(DataSourceKnowledgeRegistryManifest.totalConnectorEntries, ConnectorTypeRegistry.entries.length);
  assert.equal(DataSourceKnowledgeRegistryManifest.totalContentEntries, ContentTypeRegistry.entries.length);
  assert.equal(DataSourceKnowledgeRegistryManifest.totalSourceGroups, SourceGroupRegistry.entries.length);
  assert.equal(
    DataSourceKnowledgeRegistryManifest.totalCompatibilityRelationships,
    SourceKnowledgeCompatibilityRegistry.entries.length
  );
  assert.equal(DataSourceKnowledgeRegistryManifest.entryCountsByKind.DataSource, 23);
  assert.equal(DataSourceKnowledgeRegistryManifest.entryCountsByKind.KnowledgeType, 23);
  assert.equal(DataSourceKnowledgeRegistryManifest.duplicateIdStatus, "none");
});

test("no entry has an empty id or name", () => {
  for (const registry of [
    DataSourceRegistry,
    KnowledgeTypeRegistry,
    ConnectorTypeRegistry,
    ContentTypeRegistry,
    SourceGroupRegistry,
    SourceKnowledgeCompatibilityRegistry,
  ]) {
    for (const entry of registry.entries) {
      assert.ok(entry.identity.registryEntryId.length > 0);
      assert.ok(entry.identity.registryEntryName.length > 0);
    }
  }
});

test("14. platform aggregates the DKL-2:1 foundation by reference", () => {
  assert.equal(DataSourceKnowledgeRegistryPlatform.foundation, DataSourceKnowledgeRegistryMetadata);
  assert.equal(DataSourceKnowledgeRegistryPlatform.dataSources, DataSourceRegistry);
  assert.equal(DataSourceKnowledgeRegistryPlatform.compatibility, SourceKnowledgeCompatibilityRegistry);
});

test("15. no runtime or forbidden behavior is exposed by public APIs", () => {
  const forbidden = /discover|ingest|parse|crawl|synchron|persist|fetch|embedding|extract|async|await|execute/i;
  for (const name of Object.keys(platformApi)) {
    assert.ok(!forbidden.test(name), `public API ${name} must not imply runtime behavior`);
  }
});

test("16, 17. registry ordering and repeated helper calls are deterministic", () => {
  const firstIds = DataSourceRegistry.entries.map((entry) => entry.identity.registryEntryId);
  const secondIds = DataSourceRegistry.entries.map((entry) => entry.identity.registryEntryId);
  assert.deepEqual(firstIds, secondIds);
  assert.equal(
    DataSourceRegistry.getById("dsk-datasource-database"),
    DataSourceRegistry.getById("dsk-datasource-database")
  );
  assert.deepEqual(
    SourceKnowledgeCompatibilityRegistry.getBySourceId("dsk-datasource-crm"),
    SourceKnowledgeCompatibilityRegistry.getBySourceId("dsk-datasource-crm")
  );
});

test("18. platform is ready for DKL-2:3", () => {
  assert.equal(DataSourceKnowledgeRegistryManifest.readiness, "ReadyForModel");
  assert.deepEqual(
    [...DataSourceKnowledgeRegistryManifest.completion],
    ["RegistryComplete", "MetadataOnly", "RuntimeFree", "Deterministic", "Immutable", "ReadyForModel"]
  );
  assert.equal(DataSourceKnowledgeRegistryManifest.dependency, "DKL-2:1");
});
