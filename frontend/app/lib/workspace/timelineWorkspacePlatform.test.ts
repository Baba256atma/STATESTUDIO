import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { TimelineWorkspacePlatform } from "./timelineWorkspacePlatform.ts";

const files = [
  "timelineWorkspacePlatform.test.ts",
  "timelineWorkspacePlatform.ts",
  "timelineWorkspacePlatformBoundaries.ts",
  "timelineWorkspacePlatformCompatibility.ts",
  "timelineWorkspacePlatformComposition.ts",
  "timelineWorkspacePlatformGuarantees.ts",
  "timelineWorkspacePlatformIdentity.ts",
  "timelineWorkspacePlatformSummaries.ts",
];

test("WS-10:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-10:6 publishes canonical immutable composition", () => {
  const platform = TimelineWorkspacePlatform;
  assert.equal(platform.identity.id, "WS-10:6/TimelineWorkspacePlatform");
  assert.equal(
    platform.identity.namespace,
    "nexora.workspace.timeline.platform",
  );
  assert.equal(platform.readiness, "ReadyForCertification");
  assert.equal(platform.composition.manifest, platform.manifest);
  assert.equal(Object.isFrozen(platform), true);
});

test("WS-10:6 preserves capabilities and dependencies by reference", () => {
  const platform = TimelineWorkspacePlatform;
  assert.equal(
    platform.capabilitySummary,
    platform.manifest.inventory.capabilityInventory,
  );
  assert.equal(
    platform.composition.canonicalDependencyChain,
    platform.manifest.dependencyChain,
  );
});

test("WS-10:6 guarantees, compatibility, and boundaries are complete", () => {
  const platform = TimelineWorkspacePlatform;
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

test("WS-10:6 consumes Manifest only and contains no runtime", () => {
  const platform = TimelineWorkspacePlatform;
  const source = readFileSync(
    new URL("./timelineWorkspacePlatform.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./timelineWorkspaceValidation"), false);
  assert.equal(source.includes("./timelineWorkspaceModel"), false);
  assert.deepEqual(platform.upstreamDependencies, [
    "WS-10:5 Timeline Workspace Manifest",
  ]);
  assert.equal(platform.runtime, false);
  assert.equal(platform.timelinePlayback, false);
  assert.equal(platform.businessLogic, false);
});
