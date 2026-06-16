import test from "node:test";
import assert from "node:assert/strict";

import type { DataSourceRegistryEntry } from "./dataSourceRegistryContract.ts";
import { DS_1_4_OBJECT_MAPPING_FOUNDATION_TAG } from "./dataSourceObjectMappingContract.ts";
import {
  mapSourceToObjectType,
  previewObjectCreation,
} from "./dataSourceObjectMappingRuntime.ts";

function makeSource(input: {
  sourceId: string;
  sourceName: string;
  recordCount: number;
}): DataSourceRegistryEntry {
  return Object.freeze({
    sourceId: input.sourceId,
    sourceName: input.sourceName,
    sourceType: "csv",
    sourceStatus: "registered",
    createdAt: "2026-06-16T12:00:00.000Z",
    updatedAt: "2026-06-16T12:00:00.000Z",
    lastSyncAt: null,
    recordCount: input.recordCount,
  });
}

test("exports DS:1:4 freeze tag", () => {
  assert.equal(DS_1_4_OBJECT_MAPPING_FOUNDATION_TAG, "[DS:1:4_OBJECT_MAPPING_FOUNDATION]");
});

test("B — type detection maps supplier project and customer sources", () => {
  assert.equal(mapSourceToObjectType("Supplier CSV").objectType, "supplier");
  assert.equal(mapSourceToObjectType("Project CSV").objectType, "project");
  assert.equal(mapSourceToObjectType("Customer CSV").objectType, "customer");
});

test("A — mapping preview estimates object creation without creating objects", () => {
  const source = makeSource({
    sourceId: "source-supplier",
    sourceName: "Supplier CSV",
    recordCount: 5,
  });

  const preview = previewObjectCreation(source);

  assert.equal(preview.mapping.objectType, "supplier");
  assert.equal(preview.mapping.objectTypeLabel, "Supplier");
  assert.equal(preview.estimatedObjectCount, 5);
  assert.equal(preview.previewObjects.length, 3);
  assert.equal(preview.previewObjects[0]?.label, "Supplier 1");
  assert.equal(preview.previewOnly, true);
  assert.equal(preview.createsObjects, false);
});

test("preview falls back to generic business object for unknown sources", () => {
  const preview = previewObjectCreation(makeSource({
    sourceId: "source-unknown",
    sourceName: "Board Notes",
    recordCount: 2,
  }));

  assert.equal(preview.mapping.objectType, "generic_business_object");
  assert.equal(preview.mapping.confidence, "low");
  assert.equal(preview.previewObjects[0]?.objectTypeLabel, "Business Object");
});

