import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveHomeWorkspaceManifest } from "./executiveHomeWorkspaceManifest.ts";

const files = ["executiveHomeWorkspaceManifest.test.ts", "executiveHomeWorkspaceManifest.ts",
  "executiveHomeWorkspaceManifestCapabilities.ts",
  "executiveHomeWorkspaceManifestCompatibility.ts",
  "executiveHomeWorkspaceManifestGuarantees.ts",
  "executiveHomeWorkspaceManifestInventory.ts",
  "executiveHomeWorkspaceManifestReadiness.ts",
  "executiveHomeWorkspaceManifestTypes.ts"];

test("WS-2:5 consists of exactly eight Manifest artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});

test("WS-2:5 publishes complete unique declarations", () => {
  const manifest = ExecutiveHomeWorkspaceManifest;
  assert.equal(manifest.identity.id, "WS-2:5/ExecutiveHomeWorkspaceManifest");
  assert.deepEqual([manifest.capabilities.length, manifest.guarantees.length,
    manifest.compatibility.length, manifest.extensions.length], [17, 18, 18, 10]);
  assert.equal(new Set(manifest.guarantees.map(({ id }) => id)).size, 18);
  assert.equal(new Set(manifest.compatibility.map(({ id }) => id)).size, 18);
  assert.equal(new Set(manifest.extensions.map(({ id }) => id)).size, 10);
});

test("WS-2:5 inventory is Validation-derived and reference preserving", () => {
  const manifest = ExecutiveHomeWorkspaceManifest;
  assert.equal(manifest.inventory.source, manifest.validation);
  assert.equal(manifest.inventory.domainModels, manifest.validation.model.domainModels);
  assert.equal(manifest.inventory.counts.validationRuleCount, manifest.validation.rules.length);
  assert.equal(manifest.readiness.platformHandoffReady, true);
});

test("WS-2:5 consumes only Validation and contains no runtime", () => {
  const manifest = ExecutiveHomeWorkspaceManifest;
  const source = readFileSync(new URL("./executiveHomeWorkspaceManifest.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./executiveHomeWorkspaceModel"), false);
  assert.deepEqual(manifest.upstreamDependencies,
    ["WS-2:4 Executive Home Workspace Validation"]);
  assert.equal(manifest.runtime, false);
  assert.equal(manifest.ui, false);
  assert.equal(manifest.readiness.status, "ReadyForPlatform");
});
