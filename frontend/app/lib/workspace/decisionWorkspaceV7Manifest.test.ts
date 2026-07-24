import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { DecisionWorkspaceV7Manifest } from "./decisionWorkspaceV7Manifest.ts";

const files = [
  "decisionWorkspaceV7Manifest.test.ts",
  "decisionWorkspaceV7Manifest.ts",
  "decisionWorkspaceV7ManifestGuarantees.ts",
  "decisionWorkspaceV7ManifestIdentity.ts",
  "decisionWorkspaceV7ManifestInventory.ts",
  "decisionWorkspaceV7ManifestPublicApi.ts",
  "decisionWorkspaceV7ManifestReadiness.ts",
  "decisionWorkspaceV7ManifestSources.ts",
];

test("WS-7:5 consists of exactly eight collision-safe Manifest artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-7:5 publishes canonical identity and dependency chain", () => {
  const manifest = DecisionWorkspaceV7Manifest;
  assert.equal(manifest.identity.id, "WS-7:5/DecisionWorkspaceManifest");
  assert.equal(
    manifest.identity.namespace,
    "nexora.workspace.decision.manifest",
  );
  assert.equal(manifest.identity.version, "1.0.0");
  assert.equal(manifest.readiness, "ReadyForPlatform");
  assert.deepEqual(
    manifest.sources.map(({ phaseId }) => phaseId),
    ["WS-7:1", "WS-7:2", "WS-7:3", "WS-7:4"],
  );
});

test("WS-7:5 preserves validated inventories by reference", () => {
  const manifest = DecisionWorkspaceV7Manifest;
  assert.equal(
    manifest.inventory.foundationInventory,
    manifest.validation.foundation.inventory,
  );
  assert.equal(
    manifest.inventory.decisionCategoryInventory,
    manifest.validation.registry.taxonomy.categories,
  );
  assert.equal(
    manifest.inventory.relationshipInventory,
    manifest.validation.model.relationships,
  );
  assert.equal(manifest.inventory.duplicatedValues, false);
  assert.equal(manifest.inventory.recalculatedValues, false);
});

test("WS-7:5 guarantees and publication declarations are complete", () => {
  const manifest = DecisionWorkspaceV7Manifest;
  assert.equal(manifest.guarantees.length, 10);
  assert.equal(manifest.publicApi.length, 8);
  assert.equal(
    manifest.guarantees.every(({ state }) => state === "Satisfied"),
    true,
  );
  assert.equal(manifest.publicationStatus, "ManifestPublished");
  assert.equal(Object.isFrozen(manifest), true);
});

test("WS-7:5 consumes Validation only and contains no runtime", () => {
  const manifest = DecisionWorkspaceV7Manifest;
  const source = readFileSync(
    new URL("./decisionWorkspaceV7Manifest.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./decisionWorkspaceV7Model"), false);
  assert.equal(source.includes("./decisionWorkspaceV7Registry"), false);
  assert.deepEqual(manifest.upstreamDependencies, [
    "WS-7:4 Decision Workspace Validation",
  ]);
  assert.equal(manifest.runtime, false);
  assert.equal(manifest.inventoryCalculators, false);
  assert.equal(manifest.businessLogic, false);
});
