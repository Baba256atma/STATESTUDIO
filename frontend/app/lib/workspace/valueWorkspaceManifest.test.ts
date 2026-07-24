import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ValueWorkspaceManifest } from "./valueWorkspaceManifest.ts";

const files = [
  "valueWorkspaceManifest.test.ts",
  "valueWorkspaceManifest.ts",
  "valueWorkspaceManifestGuarantees.ts",
  "valueWorkspaceManifestIdentity.ts",
  "valueWorkspaceManifestInventory.ts",
  "valueWorkspaceManifestPublicApi.ts",
  "valueWorkspaceManifestReadiness.ts",
  "valueWorkspaceManifestSources.ts",
];

test("WS-9:5 consists of exactly eight Manifest artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-9:5 publishes canonical identity and dependency chain", () => {
  const manifest = ValueWorkspaceManifest;
  assert.equal(manifest.identity.id, "WS-9:5/ValueWorkspaceManifest");
  assert.equal(manifest.identity.namespace, "nexora.workspace.value.manifest");
  assert.equal(manifest.readiness, "ReadyForPlatform");
  assert.deepEqual(
    manifest.sources.map(({ phaseId }) => phaseId),
    ["WS-9:1", "WS-9:2", "WS-9:3", "WS-9:4"],
  );
});

test("WS-9:5 preserves validated inventories by reference", () => {
  const manifest = ValueWorkspaceManifest;
  assert.equal(
    manifest.inventory.valueCategoryInventory,
    manifest.validation.registry.valueCategories,
  );
  assert.equal(
    manifest.inventory.roiCategoryInventory,
    manifest.validation.registry.roiTypes,
  );
  assert.equal(
    manifest.inventory.relationshipInventory,
    manifest.validation.model.relationships,
  );
  assert.equal(manifest.inventory.duplicatedValues, false);
  assert.equal(manifest.inventory.recalculatedValues, false);
});

test("WS-9:5 guarantees and publication declarations are complete", () => {
  const manifest = ValueWorkspaceManifest;
  assert.equal(manifest.guarantees.length, 10);
  assert.equal(manifest.publicApi.length, 8);
  assert.equal(
    manifest.guarantees.every(({ state }) => state === "Satisfied"),
    true,
  );
  assert.equal(manifest.publicationStatus, "ManifestPublished");
});

test("WS-9:5 consumes Validation only and contains no runtime", () => {
  const manifest = ValueWorkspaceManifest;
  const source = readFileSync(
    new URL("./valueWorkspaceManifest.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./valueWorkspaceModel"), false);
  assert.equal(source.includes("./valueWorkspaceRegistry"), false);
  assert.deepEqual(manifest.upstreamDependencies, [
    "WS-9:4 Value Workspace Validation",
  ]);
  assert.equal(manifest.runtime, false);
  assert.equal(manifest.inventoryCalculators, false);
  assert.equal(manifest.businessLogic, false);
});
