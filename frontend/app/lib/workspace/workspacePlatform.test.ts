import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { WorkspacePlatform } from "./workspacePlatform.ts";
const files = ["workspacePlatform.test.ts", "workspacePlatform.ts",
  "workspacePlatformCapabilities.ts", "workspacePlatformCompatibility.ts",
  "workspacePlatformComposition.ts", "workspacePlatformGuarantees.ts",
  "workspacePlatformReadiness.ts", "workspacePlatformTypes.ts"];
test("WS-1:6 has exactly eight Platform artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url)).filter((file) => files.includes(file)).sort(), files);
});
test("WS-1:6 composition and inventories are complete", () => {
  assert.equal(WorkspacePlatform.identity.id, "WS-1:6/WorkspacePlatform");
  assert.deepEqual([WorkspacePlatform.capabilities.length, WorkspacePlatform.guarantees.length,
    WorkspacePlatform.compatibility.length], [15, 17, 19]);
  assert.equal(WorkspacePlatform.composition.manifest, WorkspacePlatform.manifest);
  assert.equal(WorkspacePlatform.inventory.source, WorkspacePlatform.manifest);
  assert.equal(WorkspacePlatform.readiness.status, "ReadyForCertification");
});
test("WS-1:6 consumes only Manifest and contains no runtime", () => {
  const source = readFileSync(new URL("./workspacePlatform.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./workspaceValidation"), false);
  assert.equal(WorkspacePlatform.upstreamDependencies.length, 1);
  assert.equal(WorkspacePlatform.runtime, false);
});
