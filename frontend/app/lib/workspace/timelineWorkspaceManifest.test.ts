import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { TimelineWorkspaceManifest } from "./timelineWorkspaceManifest.ts";

const files = [
  "timelineWorkspaceManifest.test.ts",
  "timelineWorkspaceManifest.ts",
  "timelineWorkspaceManifestGuarantees.ts",
  "timelineWorkspaceManifestIdentity.ts",
  "timelineWorkspaceManifestInventory.ts",
  "timelineWorkspaceManifestPublicApi.ts",
  "timelineWorkspaceManifestReadiness.ts",
  "timelineWorkspaceManifestSources.ts",
];

test("WS-10:5 consists of exactly eight Manifest artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-10:5 publishes canonical identity and dependency chain", () => {
  const manifest = TimelineWorkspaceManifest;
  assert.equal(manifest.identity.id, "WS-10:5/TimelineWorkspaceManifest");
  assert.equal(
    manifest.identity.namespace,
    "nexora.workspace.timeline.manifest",
  );
  assert.equal(manifest.readiness, "ReadyForPlatform");
  assert.deepEqual(
    manifest.sources.map(({ phaseId }) => phaseId),
    ["WS-10:1", "WS-10:2", "WS-10:3", "WS-10:4"],
  );
});

test("WS-10:5 preserves validated inventories by reference", () => {
  const manifest = TimelineWorkspaceManifest;
  assert.equal(
    manifest.inventory.timelineEventInventory,
    manifest.validation.registry.eventCategories,
  );
  assert.equal(
    manifest.inventory.timelineGranularityInventory,
    manifest.validation.registry.granularities,
  );
  assert.equal(
    manifest.inventory.relationshipInventory,
    manifest.validation.model.relationships,
  );
  assert.equal(manifest.inventory.duplicatedValues, false);
  assert.equal(manifest.inventory.recalculatedValues, false);
});

test("WS-10:5 guarantees and publication declarations are complete", () => {
  const manifest = TimelineWorkspaceManifest;
  assert.equal(manifest.guarantees.length, 10);
  assert.equal(manifest.publicApi.length, 8);
  assert.equal(
    manifest.guarantees.every(({ state }) => state === "Satisfied"),
    true,
  );
  assert.equal(manifest.publicationStatus, "ManifestPublished");
});

test("WS-10:5 consumes Validation only and contains no runtime", () => {
  const manifest = TimelineWorkspaceManifest;
  const source = readFileSync(
    new URL("./timelineWorkspaceManifest.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./timelineWorkspaceModel"), false);
  assert.equal(source.includes("./timelineWorkspaceRegistry"), false);
  assert.deepEqual(manifest.upstreamDependencies, [
    "WS-10:4 Timeline Workspace Validation",
  ]);
  assert.equal(manifest.runtime, false);
  assert.equal(manifest.inventoryCalculators, false);
  assert.equal(manifest.businessLogic, false);
});
