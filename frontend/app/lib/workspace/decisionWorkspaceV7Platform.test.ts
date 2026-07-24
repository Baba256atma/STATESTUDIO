import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { DecisionWorkspaceV7Platform } from "./decisionWorkspaceV7Platform.ts";

const files = [
  "decisionWorkspaceV7Platform.test.ts",
  "decisionWorkspaceV7Platform.ts",
  "decisionWorkspaceV7PlatformBoundaries.ts",
  "decisionWorkspaceV7PlatformCompatibility.ts",
  "decisionWorkspaceV7PlatformComposition.ts",
  "decisionWorkspaceV7PlatformGuarantees.ts",
  "decisionWorkspaceV7PlatformIdentity.ts",
  "decisionWorkspaceV7PlatformSummaries.ts",
];

test("WS-7:6 consists of exactly eight collision-safe Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-7:6 publishes canonical immutable composition", () => {
  const platform = DecisionWorkspaceV7Platform;
  assert.equal(platform.identity.id, "WS-7:6/DecisionWorkspacePlatform");
  assert.equal(
    platform.identity.namespace,
    "nexora.workspace.decision.platform",
  );
  assert.equal(platform.identity.version, "1.0.0");
  assert.equal(platform.readiness, "ReadyForCertification");
  assert.equal(platform.composition.manifest, platform.manifest);
  assert.equal(Object.isFrozen(platform), true);
});

test("WS-7:6 preserves upstream capabilities and dependencies by reference", () => {
  const platform = DecisionWorkspaceV7Platform;
  assert.equal(
    platform.capabilitySummary,
    platform.manifest.inventory.capabilityInventory,
  );
  assert.equal(
    platform.composition.foundation,
    platform.manifest.inventory.foundationInventory,
  );
  assert.equal(
    platform.composition.canonicalDependencyChain,
    platform.manifest.dependencyChain,
  );
});

test("WS-7:6 guarantees, compatibility, and boundaries are complete", () => {
  const platform = DecisionWorkspaceV7Platform;
  assert.deepEqual(
    [
      platform.guarantees.length,
      platform.compatibility.length,
      platform.boundaries.length,
    ],
    [10, 8, 14],
  );
  assert.equal(
    platform.guarantees.every(({ state }) => state === "Satisfied"),
    true,
  );
  assert.equal(
    platform.compatibility.every(({ state }) => state === "Compatible"),
    true,
  );
  assert.equal(platform.boundaries.every(({ permitted }) => !permitted), true);
});

test("WS-7:6 consumes Manifest only and contains no runtime", () => {
  const platform = DecisionWorkspaceV7Platform;
  const source = readFileSync(
    new URL("./decisionWorkspaceV7Platform.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./decisionWorkspaceV7Validation"), false);
  assert.equal(source.includes("./decisionWorkspaceV7Model"), false);
  assert.deepEqual(platform.upstreamDependencies, [
    "WS-7:5 Decision Workspace Manifest",
  ]);
  assert.equal(platform.runtime, false);
  assert.equal(platform.executableComposition, false);
  assert.equal(platform.businessLogic, false);
});
