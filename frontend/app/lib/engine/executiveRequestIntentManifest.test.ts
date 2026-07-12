import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveRequestIntentManifestIndex.ts";
import { ExecutiveRequestIntentDependencyMap, ExecutiveRequestIntentManifest, ExecutiveRequestIntentPhaseRegistry, ExecutiveRequestIntentPublicSurface, getExecutiveRequestIntentDependencySummary, getExecutiveRequestIntentManifest, getExecutiveRequestIntentManifestSummary } from "./executiveRequestIntentManifestIndex.ts";

test("manifest immutably aggregates all four prior public phase artifacts", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentManifest), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentManifest.metadata), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentManifest.foundation), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentManifest.registry), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentManifest.model), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentManifest.validation), true);
});

test("phase registry is complete, ordered, and namespace-consistent", () => {
  assert.deepEqual(ExecutiveRequestIntentPhaseRegistry.map(({ phaseId }) => phaseId), ["ENG-2:1", "ENG-2:2", "ENG-2:3", "ENG-2:4", "ENG-2:5"]);
  assert.equal(ExecutiveRequestIntentPhaseRegistry.every(Object.isFrozen), true);
  assert.equal(ExecutiveRequestIntentPhaseRegistry.every(({ namespace }) => namespace.startsWith("nexora.engine.executive.request-intent.")), true);
  assert.equal(ExecutiveRequestIntentPhaseRegistry.filter(({ status }) => status === "Complete").length, 4);
});

test("dependency map publishes only the approved linear chain and future references", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentDependencyMap), true);
  assert.deepEqual(ExecutiveRequestIntentDependencyMap.approvedDependencies.map(({ source, target }) => [source, target]), [
    ["ENG-2:2", "ENG-2:1"], ["ENG-2:3", "ENG-2:2"], ["ENG-2:4", "ENG-2:3"], ["ENG-2:5", "ENG-2:4"],
  ]);
  assert.equal(ExecutiveRequestIntentDependencyMap.approvedDependencies.every(({ dependencyType }) => dependencyType === "ApprovedPublicIndex"), true);
  assert.equal(ExecutiveRequestIntentDependencyMap.futureReferences.length, 4);
});

test("public surface inventories 36 explicitly owned collision-safe APIs", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentPublicSurface), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentPublicSurface.apiInventory), true);
  assert.deepEqual(ExecutiveRequestIntentPublicSurface.apiInventory.map(({ exports }) => exports.length), [7, 11, 10, 8]);
  assert.equal(ExecutiveRequestIntentPublicSurface.apiInventory.every(({ exports }) => Object.isFrozen(exports)), true);
  assert.equal(ExecutiveRequestIntentPublicSurface.apiOwnership, "ENG-2");
  assert.equal(ExecutiveRequestIntentPublicSurface.exportPolicy, "ExplicitOnly");
  assert.equal(ExecutiveRequestIntentPublicSurface.collisionPolicy, "ExecutiveRequestIntentPrefix");
});

test("manifest summaries match declared architectural metadata", () => {
  const summary = getExecutiveRequestIntentManifestSummary();
  assert.equal(summary.phaseCount, 5);
  assert.equal(summary.publicApiCount, 36);
  assert.equal(summary.validationRuleCount, 41);
  assert.deepEqual(getExecutiveRequestIntentDependencySummary(), { approvedDependencyCount: 4, futureReferenceCount: 4, policy: "PublicIndicesOnly" });
  assert.equal(ExecutiveRequestIntentManifest.ownershipSummary.previousPhasesUnchanged, true);
  assert.equal(ExecutiveRequestIntentManifest.ownershipSummary.phaseOverwriteProhibited, true);
});

test("helpers return deterministic canonical immutable references", () => {
  assert.equal(getExecutiveRequestIntentManifest(), ExecutiveRequestIntentManifest);
  assert.equal(getExecutiveRequestIntentManifestSummary(), ExecutiveRequestIntentManifest.summary);
  assert.equal(getExecutiveRequestIntentDependencySummary(), ExecutiveRequestIntentManifest.dependencySummary);
  assert.equal(Object.isFrozen(getExecutiveRequestIntentManifestSummary()), true);
});

test("public API exposes exactly seven approved exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveRequestIntentManifest", "ExecutiveRequestIntentPhaseRegistry",
    "ExecutiveRequestIntentDependencyMap", "ExecutiveRequestIntentPublicSurface",
    "getExecutiveRequestIntentManifest", "getExecutiveRequestIntentManifestSummary",
    "getExecutiveRequestIntentDependencySummary",
  ].sort());
});
