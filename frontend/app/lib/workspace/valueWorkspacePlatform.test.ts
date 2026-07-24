import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ValueWorkspacePlatform } from "./valueWorkspacePlatform.ts";

const files = [
  "valueWorkspacePlatform.test.ts",
  "valueWorkspacePlatform.ts",
  "valueWorkspacePlatformBoundaries.ts",
  "valueWorkspacePlatformCompatibility.ts",
  "valueWorkspacePlatformComposition.ts",
  "valueWorkspacePlatformGuarantees.ts",
  "valueWorkspacePlatformIdentity.ts",
  "valueWorkspacePlatformSummaries.ts",
];

test("WS-9:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-9:6 publishes canonical immutable composition", () => {
  const platform = ValueWorkspacePlatform;
  assert.equal(platform.identity.id, "WS-9:6/ValueWorkspacePlatform");
  assert.equal(platform.identity.namespace, "nexora.workspace.value.platform");
  assert.equal(platform.readiness, "ReadyForCertification");
  assert.equal(platform.composition.manifest, platform.manifest);
  assert.equal(Object.isFrozen(platform), true);
});

test("WS-9:6 preserves capabilities and dependencies by reference", () => {
  const platform = ValueWorkspacePlatform;
  assert.equal(
    platform.capabilitySummary,
    platform.manifest.inventory.capabilityInventory,
  );
  assert.equal(
    platform.composition.canonicalDependencyChain,
    platform.manifest.dependencyChain,
  );
});

test("WS-9:6 guarantees, compatibility, and boundaries are complete", () => {
  const platform = ValueWorkspacePlatform;
  assert.deepEqual(
    [
      platform.guarantees.length,
      platform.compatibility.length,
      platform.boundaries.length,
    ],
    [10, 9, 12],
  );
  assert.equal(
    platform.guarantees.every(({ state }) => state === "Satisfied"),
    true,
  );
  assert.equal(platform.boundaries.every(({ permitted }) => !permitted), true);
});

test("WS-9:6 consumes Manifest only and contains no runtime", () => {
  const platform = ValueWorkspacePlatform;
  const source = readFileSync(
    new URL("./valueWorkspacePlatform.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./valueWorkspaceValidation"), false);
  assert.equal(source.includes("./valueWorkspaceModel"), false);
  assert.deepEqual(platform.upstreamDependencies, [
    "WS-9:5 Value Workspace Manifest",
  ]);
  assert.equal(platform.runtime, false);
  assert.equal(platform.businessValueCalculation, false);
  assert.equal(platform.businessLogic, false);
});
