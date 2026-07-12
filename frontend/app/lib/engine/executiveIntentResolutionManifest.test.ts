import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveIntentResolutionManifestIndex.ts";
import { ExecutiveIntentResolutionDependencyMap, ExecutiveIntentResolutionManifest, ExecutiveIntentResolutionManifestPlatform, ExecutiveIntentResolutionPhaseRegistry, ExecutiveIntentResolutionPublicSurface, getExecutiveIntentResolutionManifest, getExecutiveIntentResolutionManifestPlatform } from "./executiveIntentResolutionManifestIndex.ts";

test("manifest platform exists and is deeply immutable", () => {
  assert.ok(ExecutiveIntentResolutionManifestPlatform);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionManifestPlatform), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionManifestPlatform.metadata), true);
  assert.equal(Object.values(ExecutiveIntentResolutionManifestPlatform).filter((value) => typeof value === "object").every(Object.isFrozen), true);
});

test("phase registry is complete, ordered, and uniquely identified", () => {
  assert.deepEqual(ExecutiveIntentResolutionPhaseRegistry.map(({ identifier }) => identifier), ["ENG-3:1", "ENG-3:2", "ENG-3:3", "ENG-3:4"]);
  assert.equal(new Set(ExecutiveIntentResolutionPhaseRegistry.map(({ identifier }) => identifier)).size, 4);
  assert.equal(ExecutiveIntentResolutionPhaseRegistry.every(Object.isFrozen), true);
});

test("dependency map is complete, forward-only, and uniquely identified", () => {
  assert.equal(ExecutiveIntentResolutionDependencyMap.length, 4);
  assert.equal(new Set(ExecutiveIntentResolutionDependencyMap.map(({ id }) => id)).size, 4);
  assert.deepEqual(ExecutiveIntentResolutionDependencyMap.map(({ source, target }) => [source, target]), [["ENG-3:2", "ENG-3:1"], ["ENG-3:3", "ENG-3:2"], ["ENG-3:4", "ENG-3:3"], ["ENG-3:5", "ENG-3:4"]]);
  assert.equal(ExecutiveIntentResolutionDependencyMap.every(({ direction, consumption, reverseDependency, circularDependency, internalImplementationDependency }) => direction === "ForwardOnly" && consumption === "PublicIndexOnly" && !reverseDependency && !circularDependency && !internalImplementationDependency), true);
});

test("public surface contains four canonical artifacts and 28 APIs", () => {
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionPublicSurface), true);
  assert.equal(ExecutiveIntentResolutionPublicSurface.phases.length, 4);
  assert.deepEqual(ExecutiveIntentResolutionPublicSurface.phases.map(({ apiNames }) => apiNames.length), [7, 7, 7, 7]);
  assert.equal(ExecutiveIntentResolutionPublicSurface.phases.every(({ artifact, apiNames }) => Object.isFrozen(artifact) && Object.isFrozen(apiNames)), true);
  assert.equal(ExecutiveIntentResolutionPublicSurface.totalApiCount, 28);
});

test("manifest ownership, compatibility, guarantees, and release scope are complete", () => {
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionManifest), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionManifest.ownership), true);
  assert.equal(Object.values(ExecutiveIntentResolutionManifest.ownership).every((owner) => owner === "ENG-3"), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionManifest.compatibility), true);
  assert.equal(ExecutiveIntentResolutionManifest.architecturalBoundaries.length, 10);
  assert.equal(ExecutiveIntentResolutionManifest.architecturalBoundaries.every(Object.isFrozen), true);
  assert.equal(ExecutiveIntentResolutionManifest.releaseScope.includedPhases.length, 5);
  assert.equal(ExecutiveIntentResolutionManifest.releaseScope.releaseReadiness, "ReadyForPlatform");
  assert.equal(ExecutiveIntentResolutionManifest.certificationReadiness, "ReadyForCertification");
});

test("helpers return canonical immutable references", () => {
  assert.equal(getExecutiveIntentResolutionManifestPlatform(), ExecutiveIntentResolutionManifestPlatform);
  assert.equal(getExecutiveIntentResolutionManifest(), ExecutiveIntentResolutionManifest);
  assert.equal(Object.isFrozen(getExecutiveIntentResolutionManifest()), true);
});

test("public manifest index exposes exactly seven approved APIs", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveIntentResolutionPhaseRegistry", "ExecutiveIntentResolutionDependencyMap",
    "ExecutiveIntentResolutionPublicSurface", "ExecutiveIntentResolutionManifest",
    "ExecutiveIntentResolutionManifestPlatform", "getExecutiveIntentResolutionManifestPlatform",
    "getExecutiveIntentResolutionManifest",
  ].sort());
});
