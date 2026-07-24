import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { WarRoomWorkspacePlatform } from "./warRoomWorkspacePlatform.ts";

const files = [
  "warRoomWorkspacePlatform.test.ts",
  "warRoomWorkspacePlatform.ts",
  "warRoomWorkspacePlatformBoundaries.ts",
  "warRoomWorkspacePlatformCompatibility.ts",
  "warRoomWorkspacePlatformComposition.ts",
  "warRoomWorkspacePlatformGuarantees.ts",
  "warRoomWorkspacePlatformIdentity.ts",
  "warRoomWorkspacePlatformSummaries.ts",
];

test("WS-8:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-8:6 publishes canonical immutable composition", () => {
  const platform = WarRoomWorkspacePlatform;
  assert.equal(platform.identity.id, "WS-8:6/WarRoomWorkspacePlatform");
  assert.equal(
    platform.identity.namespace,
    "nexora.workspace.war-room.platform",
  );
  assert.equal(platform.readiness, "ReadyForCertification");
  assert.equal(platform.composition.manifest, platform.manifest);
  assert.equal(Object.isFrozen(platform), true);
});

test("WS-8:6 preserves capabilities and dependencies by reference", () => {
  const platform = WarRoomWorkspacePlatform;
  assert.equal(
    platform.capabilitySummary,
    platform.manifest.inventory.capabilityInventory,
  );
  assert.equal(
    platform.composition.canonicalDependencyChain,
    platform.manifest.dependencyChain,
  );
});

test("WS-8:6 guarantees, compatibility, and boundaries are complete", () => {
  const platform = WarRoomWorkspacePlatform;
  assert.deepEqual(
    [
      platform.guarantees.length,
      platform.compatibility.length,
      platform.boundaries.length,
    ],
    [10, 9, 13],
  );
  assert.equal(
    platform.guarantees.every(({ state }) => state === "Satisfied"), true,
  );
  assert.equal(platform.boundaries.every(({ permitted }) => !permitted), true);
});

test("WS-8:6 consumes Manifest only and contains no runtime", () => {
  const platform = WarRoomWorkspacePlatform;
  const source = readFileSync(
    new URL("./warRoomWorkspacePlatform.ts", import.meta.url), "utf8",
  );
  assert.equal(source.includes("./warRoomWorkspaceValidation"), false);
  assert.equal(source.includes("./warRoomWorkspaceModel"), false);
  assert.deepEqual(platform.upstreamDependencies, [
    "WS-8:5 War Room Workspace Manifest",
  ]);
  assert.equal(platform.runtime, false);
  assert.equal(platform.liveMonitoring, false);
  assert.equal(platform.businessLogic, false);
});
