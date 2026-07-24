import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { WarRoomWorkspaceManifest } from "./warRoomWorkspaceManifest.ts";

const files = [
  "warRoomWorkspaceManifest.test.ts",
  "warRoomWorkspaceManifest.ts",
  "warRoomWorkspaceManifestGuarantees.ts",
  "warRoomWorkspaceManifestIdentity.ts",
  "warRoomWorkspaceManifestInventory.ts",
  "warRoomWorkspaceManifestPublicApi.ts",
  "warRoomWorkspaceManifestReadiness.ts",
  "warRoomWorkspaceManifestSources.ts",
];

test("WS-8:5 consists of exactly eight Manifest artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-8:5 publishes canonical identity and dependency chain", () => {
  const manifest = WarRoomWorkspaceManifest;
  assert.equal(manifest.identity.id, "WS-8:5/WarRoomWorkspaceManifest");
  assert.equal(
    manifest.identity.namespace,
    "nexora.workspace.war-room.manifest",
  );
  assert.equal(manifest.readiness, "ReadyForPlatform");
  assert.deepEqual(
    manifest.sources.map(({ phaseId }) => phaseId),
    ["WS-8:1", "WS-8:2", "WS-8:3", "WS-8:4"],
  );
});

test("WS-8:5 preserves validated inventories by reference", () => {
  const manifest = WarRoomWorkspaceManifest;
  assert.equal(
    manifest.inventory.operationalCategoryInventory,
    manifest.validation.registry.taxonomy.operationalCategories,
  );
  assert.equal(
    manifest.inventory.monitoringDomainInventory,
    manifest.validation.registry.monitoringDomains,
  );
  assert.equal(
    manifest.inventory.relationshipInventory,
    manifest.validation.model.relationships,
  );
  assert.equal(manifest.inventory.duplicatedValues, false);
  assert.equal(manifest.inventory.recalculatedValues, false);
});

test("WS-8:5 guarantees and publication declarations are complete", () => {
  const manifest = WarRoomWorkspaceManifest;
  assert.equal(manifest.guarantees.length, 10);
  assert.equal(manifest.publicApi.length, 8);
  assert.equal(
    manifest.guarantees.every(({ state }) => state === "Satisfied"), true,
  );
  assert.equal(manifest.publicationStatus, "ManifestPublished");
});

test("WS-8:5 consumes Validation only and contains no runtime", () => {
  const manifest = WarRoomWorkspaceManifest;
  const source = readFileSync(
    new URL("./warRoomWorkspaceManifest.ts", import.meta.url), "utf8",
  );
  assert.equal(source.includes("./warRoomWorkspaceModel"), false);
  assert.equal(source.includes("./warRoomWorkspaceRegistry"), false);
  assert.deepEqual(manifest.upstreamDependencies, [
    "WS-8:4 War Room Workspace Validation",
  ]);
  assert.equal(manifest.runtime, false);
  assert.equal(manifest.inventoryCalculators, false);
  assert.equal(manifest.businessLogic, false);
});
