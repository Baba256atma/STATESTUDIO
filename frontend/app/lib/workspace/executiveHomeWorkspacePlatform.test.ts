import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveHomeWorkspacePlatform } from "./executiveHomeWorkspacePlatform.ts";

const files = ["executiveHomeWorkspacePlatform.test.ts", "executiveHomeWorkspacePlatform.ts",
  "executiveHomeWorkspacePlatformCapabilities.ts",
  "executiveHomeWorkspacePlatformCompatibility.ts",
  "executiveHomeWorkspacePlatformComposition.ts",
  "executiveHomeWorkspacePlatformGuarantees.ts",
  "executiveHomeWorkspacePlatformReadiness.ts",
  "executiveHomeWorkspacePlatformTypes.ts"];

test("WS-2:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});

test("WS-2:6 publishes complete immutable composition", () => {
  const platform = ExecutiveHomeWorkspacePlatform;
  assert.equal(platform.identity.id, "WS-2:6/ExecutiveHomeWorkspacePlatform");
  assert.deepEqual([platform.capabilities.length, platform.guarantees.length,
    platform.compatibility.length, platform.extensions.length], [15, 19, 18, 10]);
  assert.equal(platform.composition.manifest, platform.manifest);
  assert.equal(platform.composition.foundation,
    platform.manifest.validation.model.registry.foundation);
  assert.equal(Object.isFrozen(platform), true);
});

test("WS-2:6 inventory is dynamically Manifest-derived", () => {
  const platform = ExecutiveHomeWorkspacePlatform;
  assert.equal(platform.inventory.source, platform.manifest);
  assert.equal(platform.inventory.categoryCount, platform.manifest.inventory.categories.length);
  assert.equal(platform.inventory.guaranteeCount, platform.guarantees.length);
  assert.equal(platform.inventory.totalPlatformEntries > 0, true);
  assert.equal(platform.readiness.status, "ReadyForCertification");
});

test("WS-2:6 consumes only Manifest and contains no runtime", () => {
  const platform = ExecutiveHomeWorkspacePlatform;
  const source = readFileSync(new URL("./executiveHomeWorkspacePlatform.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./executiveHomeWorkspaceValidation"), false);
  assert.deepEqual(platform.upstreamDependencies,
    ["WS-2:5 Executive Home Workspace Manifest"]);
  assert.equal(platform.runtime, false);
  assert.equal(platform.ui, false);
});
