import assert from "node:assert/strict";
import test from "node:test";

import { DataKnowledgeFoundationPublicIndexId } from "./dataKnowledgeFoundationPublicIndex.ts";
import * as foundationApi from "./dataSourceKnowledgeRegistryFoundation.ts";
import {
  DataSourceKnowledgeRegistryBoundaries,
  DataSourceKnowledgeRegistryContracts,
  DataSourceKnowledgeRegistryFoundation,
  DataSourceKnowledgeRegistryMetadata,
  DataSourceKnowledgeRegistryOwnership,
  DataSourceKnowledgeRegistrySummary,
  DataSourceKnowledgeRegistryVersion,
} from "./dataSourceKnowledgeRegistryFoundation.ts";

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
  "DataSourceKnowledgeRegistryFoundation",
  "DataSourceKnowledgeRegistryContracts",
  "DataSourceKnowledgeRegistryOwnership",
  "DataSourceKnowledgeRegistryBoundaries",
  "DataSourceKnowledgeRegistryMetadata",
  "DataSourceKnowledgeRegistrySummary",
  "DataSourceKnowledgeRegistryVersion",
];

const uniqueIds = (items: readonly { readonly id: string }[]): boolean =>
  new Set(items.map((item) => item.id)).size === items.length;

const uniqueKeys = (items: readonly { readonly key: string }[]): boolean =>
  new Set(items.map((item) => item.key)).size === items.length;

test("exports exactly seven public APIs", () => {
  assert.equal(Object.keys(foundationApi).length, 7);
  assert.deepEqual(Object.keys(foundationApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("foundation exists and is deeply frozen", () => {
  assert.ok(DataSourceKnowledgeRegistryFoundation);
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeRegistryFoundation));
});

test("all public objects are deeply frozen (immutable metadata)", () => {
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeRegistryContracts));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeRegistryOwnership));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeRegistryBoundaries));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeRegistryMetadata));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeRegistrySummary));
});

test("foundation aggregates canonical references (no copies)", () => {
  assert.equal(DataSourceKnowledgeRegistryFoundation.contracts, DataSourceKnowledgeRegistryContracts);
  assert.equal(DataSourceKnowledgeRegistryFoundation.ownership, DataSourceKnowledgeRegistryOwnership);
  assert.equal(DataSourceKnowledgeRegistryFoundation.boundaries, DataSourceKnowledgeRegistryBoundaries);
  assert.equal(DataSourceKnowledgeRegistryFoundation.metadata, DataSourceKnowledgeRegistryMetadata);
});

test("canonical data source categories are complete and metadata-only", () => {
  assert.equal(DataSourceKnowledgeRegistryMetadata.dataSourceCategories.length, 23);
  for (const category of DataSourceKnowledgeRegistryMetadata.dataSourceCategories) {
    assert.equal(category.metadataOnly, true);
    assert.equal(category.immutable, true);
  }
});

test("canonical knowledge categories are complete and metadata-only", () => {
  assert.equal(DataSourceKnowledgeRegistryMetadata.knowledgeCategories.length, 23);
  for (const category of DataSourceKnowledgeRegistryMetadata.knowledgeCategories) {
    assert.equal(category.metadataOnly, true);
    assert.equal(category.immutable, true);
  }
});

test("connector, content, metadata, and source categories exist", () => {
  assert.ok(DataSourceKnowledgeRegistryMetadata.connectorTypes.length > 0);
  assert.ok(DataSourceKnowledgeRegistryMetadata.contentTypes.length > 0);
  assert.ok(DataSourceKnowledgeRegistryMetadata.metadataTypes.length > 0);
  assert.ok(DataSourceKnowledgeRegistryMetadata.sourceCategories.length > 0);
});

test("no duplicate identifiers or keys across any category list", () => {
  const lists = [
    DataSourceKnowledgeRegistryMetadata.dataSourceCategories,
    DataSourceKnowledgeRegistryMetadata.knowledgeCategories,
    DataSourceKnowledgeRegistryMetadata.connectorTypes,
    DataSourceKnowledgeRegistryMetadata.contentTypes,
    DataSourceKnowledgeRegistryMetadata.metadataTypes,
    DataSourceKnowledgeRegistryMetadata.sourceCategories,
  ];
  for (const list of lists) {
    assert.ok(uniqueIds(list), "ids must be unique within a list");
    assert.ok(uniqueKeys(list), "keys must be unique within a list");
  }
});

test("all identifiers are globally unique across every category list", () => {
  const allIds = [
    ...DataSourceKnowledgeRegistryMetadata.dataSourceCategories,
    ...DataSourceKnowledgeRegistryMetadata.knowledgeCategories,
    ...DataSourceKnowledgeRegistryMetadata.connectorTypes,
    ...DataSourceKnowledgeRegistryMetadata.contentTypes,
    ...DataSourceKnowledgeRegistryMetadata.metadataTypes,
    ...DataSourceKnowledgeRegistryMetadata.sourceCategories,
  ].map((item) => item.id);
  assert.equal(new Set(allIds).size, allIds.length);
});

test("ownership declarations are correct", () => {
  assert.deepEqual(
    [...DataSourceKnowledgeRegistryOwnership.owns],
    [
      "architectural-definitions",
      "registry-contracts",
      "metadata",
      "ownership-declarations",
      "public-constants",
      "dependency-declarations",
    ]
  );
  assert.ok(DataSourceKnowledgeRegistryOwnership.neverOwns.length > 0);
  const overlap = DataSourceKnowledgeRegistryOwnership.owns.filter((entry) =>
    (DataSourceKnowledgeRegistryOwnership.neverOwns as readonly string[]).includes(entry)
  );
  assert.equal(overlap.length, 0);
});

test("dependency declarations allow only the DKL-1 Public Index", () => {
  assert.deepEqual([...DataSourceKnowledgeRegistryContracts.allowedDependencies], ["DKL-1 Public Index"]);
  assert.deepEqual([...DataSourceKnowledgeRegistryBoundaries.allowedDependencies], ["DKL-1 Public Index"]);
  assert.ok(DataSourceKnowledgeRegistryFoundation.identity.dependsOn[0].startsWith(DataKnowledgeFoundationPublicIndexId));
  const forbidden = DataSourceKnowledgeRegistryBoundaries.forbiddenDependencies;
  for (const layer of ["Engine", "OPS", "BUS", "Advisor", "Scene", "NEA", "Persistence", "Integrations"]) {
    assert.ok((forbidden as readonly string[]).includes(layer), `${layer} must be forbidden`);
  }
});

test("boundaries forbid all runtime behaviors", () => {
  const forbidden = DataSourceKnowledgeRegistryBoundaries.mustNeverPerform as readonly string[];
  for (const behavior of ["Ingestion", "PDF parsing", "AI extraction", "Storage", "ETL", "Business logic"]) {
    assert.ok(forbidden.includes(behavior), `${behavior} must never be performed`);
  }
});

test("summary is deterministic and reports correct counts", () => {
  assert.deepEqual(DataSourceKnowledgeRegistrySummary, DataSourceKnowledgeRegistrySummary);
  assert.equal(DataSourceKnowledgeRegistrySummary.dataSourceCategoryCount, 23);
  assert.equal(DataSourceKnowledgeRegistrySummary.knowledgeCategoryCount, 23);
  assert.equal(DataSourceKnowledgeRegistrySummary.allowedDependencyCount, 1);
  assert.equal(DataSourceKnowledgeRegistrySummary.ownedResponsibilityCount, 6);
  assert.equal(DataSourceKnowledgeRegistrySummary.phaseId, "DKL-2:1");
});

test("version metadata is correct", () => {
  assert.equal(DataSourceKnowledgeRegistryVersion, "1.0.0");
  assert.equal(DataSourceKnowledgeRegistryFoundation.identity.version, "1.0.0");
});

test("no runtime behavior is exposed by public APIs", () => {
  const runtimeVerb = /fetch|save|persist|query|ingest|process|execute|parse|crawl|sync|connect|load|render|async|await/i;
  for (const name of Object.keys(foundationApi)) {
    assert.ok(!runtimeVerb.test(name), `public API ${name} must not imply runtime behavior`);
  }
});
