import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ProblemWorkspaceManifest } from "./problemWorkspaceManifest.ts";

const files = [
  "problemWorkspaceManifest.test.ts",
  "problemWorkspaceManifest.ts",
  "problemWorkspaceManifestGuarantees.ts",
  "problemWorkspaceManifestIdentity.ts",
  "problemWorkspaceManifestInventory.ts",
  "problemWorkspaceManifestPublicApi.ts",
  "problemWorkspaceManifestReadiness.ts",
  "problemWorkspaceManifestSources.ts",
];

test("WS-6:5 consists of exactly eight Manifest artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-6:5 publishes canonical identity and source chain", () => {
  const manifest = ProblemWorkspaceManifest;
  assert.equal(manifest.identity.id, "WS-6:5/ProblemWorkspaceManifest");
  assert.equal(
    manifest.identity.namespace,
    "nexora.workspace.problem.manifest",
  );
  assert.equal(manifest.identity.version, "1.0.0");
  assert.equal(manifest.status, "ReadyForPlatform");
  assert.deepEqual(
    manifest.sources.map(({ phaseId }) => phaseId),
    ["WS-6:1", "WS-6:2", "WS-6:3", "WS-6:4"],
  );
});

test("WS-6:5 preserves validated inventories by reference", () => {
  const manifest = ProblemWorkspaceManifest;
  assert.equal(
    manifest.inventory.foundationInventory,
    manifest.validation.foundation.inventory,
  );
  assert.equal(
    manifest.inventory.registryInventory,
    manifest.validation.registry.inventory,
  );
  assert.equal(
    manifest.inventory.modelInventory,
    manifest.validation.model.modelRegistry,
  );
  assert.equal(
    manifest.inventory.validationInventory,
    manifest.validation.summary,
  );
  assert.equal(manifest.inventory.duplicatedValues, false);
  assert.equal(manifest.inventory.recalculatedValues, false);
  assert.equal(manifest.canonicalInventoryRuleSatisfied, true);
});

test("WS-6:5 guarantees and publication declarations are complete", () => {
  const manifest = ProblemWorkspaceManifest;
  assert.equal(manifest.guarantees.length, 10);
  assert.equal(
    manifest.guarantees.every(({ state }) => state === "Satisfied"),
    true,
  );
  assert.equal(manifest.publicApi.length, 8);
  assert.equal(manifest.publicationStatus, "ManifestPublished");
  assert.equal(Object.isFrozen(manifest), true);
});

test("WS-6:5 consumes Validation only and contains no runtime", () => {
  const manifest = ProblemWorkspaceManifest;
  const source = readFileSync(
    new URL("./problemWorkspaceManifest.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./problemWorkspaceModel"), false);
  assert.equal(source.includes("./problemWorkspaceRegistry"), false);
  assert.deepEqual(manifest.upstreamDependencies, [
    "WS-6:4 Problem Workspace Validation",
  ]);
  assert.equal(manifest.runtime, false);
  assert.equal(manifest.validationEngine, false);
  assert.equal(manifest.businessLogic, false);
});
