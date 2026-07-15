import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveReasoningManifestPlatform.ts";
import {
  ExecutiveReasoningCompatibility,
  ExecutiveReasoningDependencyMap,
  ExecutiveReasoningManifest,
  ExecutiveReasoningManifestPlatform,
  ExecutiveReasoningOwnershipMap,
  getExecutiveReasoningManifest,
  getExecutiveReasoningManifestMetadata,
  getExecutiveReasoningManifestSummary,
} from "./executiveReasoningManifestPlatform.ts";

test("publishes exactly eight approved public exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveReasoningCompatibility",
    "ExecutiveReasoningDependencyMap",
    "ExecutiveReasoningManifest",
    "ExecutiveReasoningManifestPlatform",
    "ExecutiveReasoningOwnershipMap",
    "getExecutiveReasoningManifest",
    "getExecutiveReasoningManifestMetadata",
    "getExecutiveReasoningManifestSummary",
  ].sort());
  assert.equal(Object.keys(publicApi).length, 8);
});

test("manifest contains exactly ten required sections", () => {
  assert.deepEqual(Object.keys(ExecutiveReasoningManifest).sort(), [
    "Compatibility",
    "DependencyMap",
    "Foundation",
    "Manifest",
    "Model",
    "Ownership",
    "PublicSurface",
    "Registry",
    "ReleaseMetadata",
    "Validation",
  ].sort());
  assert.equal(Object.keys(ExecutiveReasoningManifest).length, 10);
  assert.equal(Object.isFrozen(ExecutiveReasoningManifest), true);
});

test("dependency map includes only approved Engine dependencies", () => {
  assert.deepEqual([...ExecutiveReasoningDependencyMap.allowedDependencies], [
    "ENG-1",
    "ENG-2",
    "ENG-3",
    "ENG-4",
    "ENG-5",
    "ENG-6:1",
    "ENG-6:2",
    "ENG-6:3",
    "ENG-6:4",
  ]);
  assert.ok(ExecutiveReasoningDependencyMap.rejectedDependencies.includes("BUS"));
  assert.ok(ExecutiveReasoningDependencyMap.rejectedDependencies.includes("OPS"));
  assert.ok(ExecutiveReasoningDependencyMap.rejectedDependencies.includes("Runtime"));
  assert.equal(
    ExecutiveReasoningDependencyMap.edges.every(
      ({ reverseDependency, circularDependency }) =>
        reverseDependency === false && circularDependency === false,
    ),
    true,
  );
});

test("every ownership artifact has exactly one owner", () => {
  assert.equal(ExecutiveReasoningOwnershipMap.platformOwner, "ENG-6");
  assert.equal(ExecutiveReasoningOwnershipMap.modelOwner, "ENG-6");
  assert.equal(ExecutiveReasoningOwnershipMap.registryOwner, "ENG-6");
  assert.equal(ExecutiveReasoningOwnershipMap.validationOwner, "ENG-6");
  assert.equal(ExecutiveReasoningOwnershipMap.manifestOwner, "ENG-6");
  assert.equal(ExecutiveReasoningOwnershipMap.namespaceOwner, "ENG-6");
  assert.equal(ExecutiveReasoningOwnershipMap.entries.length, 6);
  assert.equal(
    ExecutiveReasoningOwnershipMap.entries.every(({ owner }) => owner === "ENG-6"),
    true,
  );
  assert.equal(
    new Set(ExecutiveReasoningOwnershipMap.entries.map(({ artifact }) => artifact)).size,
    6,
  );
  assert.equal(ExecutiveReasoningOwnershipMap.singleOwnerPolicy.duplicateOwnership, "Prohibited");
});

test("compatibility metadata is complete and immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveReasoningCompatibility), true);
  assert.equal(ExecutiveReasoningCompatibility.backwardCompatibility.status, "Compatible");
  assert.equal(ExecutiveReasoningCompatibility.forwardCompatibility.status, "ForwardCompatible");
  assert.equal(ExecutiveReasoningCompatibility.publicApiCompatibility.status, "Stable");
  assert.equal(ExecutiveReasoningCompatibility.namespaceCompatibility.status, "Compatible");
  assert.equal(ExecutiveReasoningCompatibility.modelCompatibility.status, "Compatible");
  assert.equal(ExecutiveReasoningCompatibility.registryCompatibility.status, "Compatible");
  assert.equal(ExecutiveReasoningCompatibility.declarationCount, 8);
});

test("public API inventory accurately aggregates ENG-6:1 through ENG-6:4", () => {
  const { apis, apiCount } = ExecutiveReasoningManifest.PublicSurface;
  assert.equal(apiCount, 30);
  assert.equal(apis.length, 30);
  assert.equal(apis.filter(({ originatingPhase }) => originatingPhase === "ENG-6:1").length, 7);
  assert.equal(apis.filter(({ originatingPhase }) => originatingPhase === "ENG-6:2").length, 7);
  assert.equal(apis.filter(({ originatingPhase }) => originatingPhase === "ENG-6:3").length, 8);
  assert.equal(apis.filter(({ originatingPhase }) => originatingPhase === "ENG-6:4").length, 8);
  assert.equal(new Set(apis.map(({ name }) => name)).size, 30);
  assert.equal(apis.every(({ status }) => status === "Published"), true);
});

test("manifest summary is deterministic and metadata-derived", () => {
  const summary = getExecutiveReasoningManifestSummary();
  assert.equal(getExecutiveReasoningManifestSummary(), summary);
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(summary.totalPhases, 5);
  assert.equal(summary.totalPublicApis, 30);
  assert.equal(summary.totalComponents, 8);
  assert.equal(summary.totalModels, 8);
  assert.equal(summary.totalValidationDomains, 10);
  assert.equal(summary.totalValidationRules, 30);
  assert.equal(summary.compatibilityStatus, "Compatible");
  assert.equal(summary.releaseReadiness, "ReadyForPlatform");
  assert.equal(summary.nextPhase, "ENG-6:6");
});

test("platform aggregates maps and helpers without runtime or AI APIs", () => {
  assert.equal(Object.isFrozen(ExecutiveReasoningManifestPlatform), true);
  assert.equal(ExecutiveReasoningManifestPlatform.manifest, ExecutiveReasoningManifest);
  assert.equal(ExecutiveReasoningManifestPlatform.dependencyMap, ExecutiveReasoningDependencyMap);
  assert.equal(ExecutiveReasoningManifestPlatform.ownershipMap, ExecutiveReasoningOwnershipMap);
  assert.equal(ExecutiveReasoningManifestPlatform.compatibility, ExecutiveReasoningCompatibility);
  assert.equal(getExecutiveReasoningManifest(), ExecutiveReasoningManifest);
  assert.equal(
    getExecutiveReasoningManifestMetadata().manifestId,
    "ENG-6:5",
  );
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Builder|Planner|Scorer|Executor|LLM|OpenAI|Query|Reflect/i.test(name)
    )),
    true,
  );
  assert.ok(ExecutiveReasoningManifestPlatform.ownership.neverOwns.includes("reasoning execution"));
});
