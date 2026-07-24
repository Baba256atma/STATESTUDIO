import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ProblemWorkspacePlatform } from "./problemWorkspacePlatform.ts";

const files = [
  "problemWorkspacePlatform.test.ts",
  "problemWorkspacePlatform.ts",
  "problemWorkspacePlatformBoundaries.ts",
  "problemWorkspacePlatformCompatibility.ts",
  "problemWorkspacePlatformComposition.ts",
  "problemWorkspacePlatformGuarantees.ts",
  "problemWorkspacePlatformIdentity.ts",
  "problemWorkspacePlatformSummaries.ts",
];

test("WS-6:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-6:6 publishes its canonical immutable composition", () => {
  const platform = ProblemWorkspacePlatform;
  assert.equal(platform.identity.id, "WS-6:6/ProblemWorkspacePlatform");
  assert.equal(platform.identity.namespace, "nexora.workspace.problem.platform");
  assert.equal(platform.identity.version, "1.0.0");
  assert.equal(platform.identity.layer, "Workspace Layer");
  assert.equal(platform.status, "ReadyForCertification");
  assert.equal(platform.composition.manifest, platform.manifest);
  assert.equal(Object.isFrozen(platform), true);
});

test("WS-6:6 preserves upstream references without redefining capabilities", () => {
  const platform = ProblemWorkspacePlatform;
  assert.equal(
    platform.capabilitySummary,
    platform.manifest.inventory.capabilityInventory,
  );
  assert.equal(platform.composition.foundation, platform.manifest.inventory.foundationInventory);
  assert.equal(platform.composition.validation, platform.manifest.inventory.validationInventory);
  assert.equal(platform.composition.canonicalDependencyChain, platform.manifest.dependencyChain);
});

test("WS-6:6 guarantees, compatibility, and boundaries are complete", () => {
  const platform = ProblemWorkspacePlatform;
  assert.equal(platform.guarantees.length, 11);
  assert.equal(platform.compatibility.length, 9);
  assert.equal(platform.boundaries.length, 13);
  assert.equal(platform.guarantees.every(({ state }) => state === "Satisfied"), true);
  assert.equal(platform.compatibility.every(({ state }) => state === "Compatible"), true);
  assert.equal(platform.boundaries.every(({ permitted }) => !permitted), true);
});

test("WS-6:6 consumes Manifest only and contains no runtime", () => {
  const platform = ProblemWorkspacePlatform;
  const source = readFileSync(
    new URL("./problemWorkspacePlatform.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./problemWorkspaceValidation"), false);
  assert.equal(source.includes("./problemWorkspaceModel"), false);
  assert.equal(source.includes("./problemWorkspaceRegistry"), false);
  assert.deepEqual(platform.upstreamDependencies, [
    "WS-6:5 Problem Workspace Manifest",
  ]);
  assert.equal(platform.runtime, false);
  assert.equal(platform.rootCauseAnalysis, false);
  assert.equal(platform.businessLogic, false);
});
