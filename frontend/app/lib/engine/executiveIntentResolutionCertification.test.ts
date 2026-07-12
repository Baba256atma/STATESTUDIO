import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveIntentResolutionCertificationIndex.ts";
import { ExecutiveIntentResolutionCertificationManifest, ExecutiveIntentResolutionCertificationPlatform, ExecutiveIntentResolutionCertificationRegistry, ExecutiveIntentResolutionCertificationSummary, ExecutiveIntentResolutionCompatibilityMatrix, getExecutiveIntentResolutionCertificationPlatform, getExecutiveIntentResolutionCertificationSummary } from "./executiveIntentResolutionCertificationIndex.ts";

test("certification platform exists and is deeply immutable", () => {
  assert.ok(ExecutiveIntentResolutionCertificationPlatform);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionCertificationPlatform), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionCertificationPlatform.certificationMetadata), true);
  assert.equal(Object.values(ExecutiveIntentResolutionCertificationPlatform).filter((value) => typeof value === "object").every(Object.isFrozen), true);
});

test("certification registry contains six components and twelve complete gates", () => {
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionCertificationRegistry), true);
  assert.equal(ExecutiveIntentResolutionCertificationRegistry.components.length, 6);
  assert.equal(ExecutiveIntentResolutionCertificationRegistry.gates.length, 12);
  assert.equal(ExecutiveIntentResolutionCertificationRegistry.components.every(Object.isFrozen), true);
  assert.equal(ExecutiveIntentResolutionCertificationRegistry.gates.every(Object.isFrozen), true);
  assert.equal(ExecutiveIntentResolutionCertificationRegistry.gates.every(({ result }) => Object.isFrozen(result) && result.status === "Certified"), true);
});

test("compatibility matrix and regression declarations are complete", () => {
  assert.equal(ExecutiveIntentResolutionCompatibilityMatrix.length, 4);
  assert.equal(ExecutiveIntentResolutionCompatibilityMatrix.every(Object.isFrozen), true);
  assert.equal(ExecutiveIntentResolutionCertificationManifest.regressionDeclarations.length, 6);
  assert.equal(ExecutiveIntentResolutionCertificationManifest.regressionDeclarations.every(Object.isFrozen), true);
  assert.equal(ExecutiveIntentResolutionCertificationManifest.regressionDeclarations.every(({ status }) => status === "Stable"), true);
});

test("certification manifest references exactly six approved public indices", () => {
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionCertificationManifest), true);
  assert.deepEqual(ExecutiveIntentResolutionCertificationManifest.dependencies.map(({ publicIndex }) => publicIndex), ["executiveIntentResolutionIndex.ts", "executiveIntentResolutionRegistryIndex.ts", "executiveIntentResolutionModelIndex.ts", "executiveIntentResolutionValidationIndex.ts", "executiveIntentResolutionManifestIndex.ts", "executiveIntentResolutionPlatformIndex.ts"]);
  assert.equal(ExecutiveIntentResolutionCertificationManifest.dependencies.every(({ artifact }) => Object.isFrozen(artifact)), true);
  assert.equal(ExecutiveIntentResolutionCertificationManifest.releaseReadiness.freezeReadiness, "ReadyForFreeze");
});

test("component, gate, compatibility, and regression identifiers are unique", () => {
  const registry = ExecutiveIntentResolutionCertificationRegistry;
  assert.equal(new Set(registry.components.map(({ id }) => id)).size, 6);
  assert.equal(new Set(registry.gates.map(({ id }) => id)).size, 12);
  assert.equal(new Set(ExecutiveIntentResolutionCompatibilityMatrix.map(({ id }) => id)).size, 4);
  assert.equal(new Set(ExecutiveIntentResolutionCertificationManifest.regressionDeclarations.map(({ id }) => id)).size, 6);
});

test("metadata-only runner publishes a deterministic frozen summary", () => {
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionCertificationSummary), true);
  assert.equal(ExecutiveIntentResolutionCertificationSummary.totalCertificationGates, 12);
  assert.equal(ExecutiveIntentResolutionCertificationSummary.certifiedComponents, 6);
  assert.equal(ExecutiveIntentResolutionCertificationSummary.releaseReadiness, "ReadyForFreeze");
  assert.equal(getExecutiveIntentResolutionCertificationSummary(), ExecutiveIntentResolutionCertificationSummary);
  assert.equal(getExecutiveIntentResolutionCertificationPlatform(), ExecutiveIntentResolutionCertificationPlatform);
});

test("public certification index exposes exactly seven approved APIs", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveIntentResolutionCertificationRegistry", "ExecutiveIntentResolutionCompatibilityMatrix",
    "ExecutiveIntentResolutionCertificationManifest", "ExecutiveIntentResolutionCertificationPlatform",
    "ExecutiveIntentResolutionCertificationSummary", "getExecutiveIntentResolutionCertificationPlatform",
    "getExecutiveIntentResolutionCertificationSummary",
  ].sort());
});
