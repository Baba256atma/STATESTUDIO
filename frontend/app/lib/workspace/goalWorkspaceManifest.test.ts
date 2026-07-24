import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { GoalWorkspaceManifest } from "./goalWorkspaceManifest.ts";

const files = ["goalWorkspaceManifest.test.ts", "goalWorkspaceManifest.ts",
  "goalWorkspaceManifestGuarantees.ts", "goalWorkspaceManifestIdentity.ts",
  "goalWorkspaceManifestInventory.ts", "goalWorkspaceManifestPublicApi.ts",
  "goalWorkspaceManifestReadiness.ts", "goalWorkspaceManifestSources.ts"];

test("WS-3:5 consists of exactly eight Manifest artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});

test("WS-3:5 publishes complete ordered sources and inventories", () => {
  const manifest = GoalWorkspaceManifest;
  assert.equal(manifest.identity.id, "WS-3:5/GoalWorkspaceManifest");
  assert.equal(manifest.identity.status, "Manifest");
  assert.deepEqual(manifest.sources.map(({ phaseId }) => phaseId),
    ["WS-3:1", "WS-3:2", "WS-3:3", "WS-3:4"]);
  assert.deepEqual([manifest.inventory.responsibilities.length,
    manifest.inventory.capabilities.length, manifest.inventory.goalTypes.length,
    manifest.inventory.lifecycle.length, manifest.inventory.contracts.length,
    manifest.inventory.domainModels.length, manifest.inventory.relationships.length,
    manifest.inventory.compositions.length], [10, 12, 12, 8, 12, 12, 12, 9]);
  assert.equal(manifest.inventory.source, manifest.validation);
});

test("WS-3:5 guarantees, readiness gates, and API identities are unique", () => {
  const manifest = GoalWorkspaceManifest;
  assert.deepEqual([manifest.guarantees.length, manifest.readinessGates.length,
    manifest.publicApi.length], [18, 12, 8]);
  assert.equal(manifest.guarantees.every(({ currentState }) => currentState === "Satisfied"), true);
  assert.equal(manifest.readinessGates.every(({ outcome }) => outcome === "Pass"), true);
  assert.equal(new Set(manifest.guarantees.map(({ id }) => id)).size, 18);
  assert.equal(new Set(manifest.publicApi.map(({ id }) => id)).size, 8);
});

test("WS-3:5 consumes only Validation and contains no runtime", () => {
  const manifest = GoalWorkspaceManifest;
  const source = readFileSync(new URL("./goalWorkspaceManifest.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./goalWorkspaceModel"), false);
  assert.deepEqual(manifest.upstreamDependencies, ["WS-3:4 Goal Workspace Validation"]);
  assert.equal(manifest.canonicalInventoryRuleSatisfied, true);
  assert.equal(manifest.summary.validationStatus, "Pass");
  assert.equal(manifest.runtime, false);
  assert.equal(manifest.ui, false);
  assert.equal(manifest.readiness, "ReadyForPlatform");
});
