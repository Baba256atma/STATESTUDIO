import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { WorkspaceManifest } from "./workspaceManifest.ts";
const files = ["workspaceManifest.test.ts", "workspaceManifest.ts",
  "workspaceManifestCapabilities.ts", "workspaceManifestCompatibility.ts",
  "workspaceManifestGuarantees.ts", "workspaceManifestInventory.ts",
  "workspaceManifestReadiness.ts", "workspaceManifestTypes.ts"];
test("WS-1:5 has exactly eight Manifest artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url)).filter((file) => files.includes(file)).sort(), files);
});
test("WS-1:5 is complete, unique, and Validation-derived", () => {
  assert.equal(WorkspaceManifest.identity.id, "WS-1:5/WorkspaceManifest");
  assert.deepEqual([WorkspaceManifest.capabilities.length, WorkspaceManifest.guarantees.length,
    WorkspaceManifest.compatibility.length, WorkspaceManifest.extensions.length], [15, 18, 10, 10]);
  assert.equal(new Set(WorkspaceManifest.guarantees.map(({ id }) => id)).size, 18);
  assert.equal(WorkspaceManifest.inventory.source, WorkspaceManifest.validation);
  assert.equal(WorkspaceManifest.readiness.status, "ReadyForPlatform");
});
test("WS-1:5 consumes only Validation and contains no runtime", () => {
  const source = readFileSync(new URL("./workspaceManifest.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./workspaceModel"), false);
  assert.equal(WorkspaceManifest.upstreamDependencies.length, 1);
  assert.equal(WorkspaceManifest.runtime, false);
});
