import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { GoalWorkspacePlatform } from "./goalWorkspacePlatform.ts";
const files = ["goalWorkspacePlatform.test.ts", "goalWorkspacePlatform.ts",
  "goalWorkspacePlatformCapabilities.ts", "goalWorkspacePlatformCompatibility.ts",
  "goalWorkspacePlatformComposition.ts", "goalWorkspacePlatformExtensions.ts",
  "goalWorkspacePlatformGuarantees.ts", "goalWorkspacePlatformIdentity.ts"];
test("WS-3:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});
test("WS-3:6 publishes complete immutable composition", () => {
  const platform = GoalWorkspacePlatform;
  assert.equal(platform.identity.id, "WS-3:6/GoalWorkspacePlatform");
  assert.deepEqual([platform.capabilities.length, platform.guarantees.length,
    platform.compatibility.length, platform.extensions.length], [10, 12, 12, 10]);
  assert.equal(platform.composition.manifest, platform.manifest);
  assert.equal(Object.isFrozen(platform), true);
});
test("WS-3:6 declarations resolve to approved states", () => {
  assert.equal(GoalWorkspacePlatform.guarantees.every(
    ({ currentState }) => currentState === "Satisfied"), true);
  assert.equal(GoalWorkspacePlatform.compatibility.every(
    ({ state }) => state === "Compatible"), true);
  assert.equal(GoalWorkspacePlatform.extensions.every(
    ({ state }) => state === "Extensible"), true);
  assert.equal(GoalWorkspacePlatform.summary.readiness, "ReadyForCertification");
});
test("WS-3:6 consumes only Manifest and contains no runtime", () => {
  const source = readFileSync(new URL("./goalWorkspacePlatform.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./goalWorkspaceValidation"), false);
  assert.deepEqual(GoalWorkspacePlatform.upstreamDependencies,
    ["WS-3:5 Goal Workspace Manifest"]);
  assert.equal(GoalWorkspacePlatform.runtime, false);
  assert.equal(GoalWorkspacePlatform.ui, false);
});
