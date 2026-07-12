import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveIntentResolutionFreezeIndex.ts";
import { ExecutiveIntentResolutionFreezeCompatibilityLock, ExecutiveIntentResolutionFreezeManifest, ExecutiveIntentResolutionFreezePlatform, ExecutiveIntentResolutionFreezeRegistry, ExecutiveIntentResolutionFreezeSummary, getExecutiveIntentResolutionFreezePlatform, getExecutiveIntentResolutionFreezeSummary } from "./executiveIntentResolutionFreezeIndex.ts";

test("freeze platform exists and is deeply immutable", () => {
  assert.ok(ExecutiveIntentResolutionFreezePlatform);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionFreezePlatform), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionFreezePlatform.freezeMetadata), true);
  assert.equal(Object.values(ExecutiveIntentResolutionFreezePlatform).filter((value) => typeof value === "object").every(Object.isFrozen), true);
});

test("freeze registry contains seven complete unique components", () => {
  assert.equal(ExecutiveIntentResolutionFreezeRegistry.length, 7);
  assert.equal(ExecutiveIntentResolutionFreezeRegistry.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveIntentResolutionFreezeRegistry.map(({ id }) => id)).size, 7);
  assert.equal(ExecutiveIntentResolutionFreezeRegistry.every(({ freezeStatus, certificationStatus }) => freezeStatus === "Frozen" && certificationStatus === "Certified"), true);
});

test("compatibility and dependency locks are complete", () => {
  assert.equal(ExecutiveIntentResolutionFreezeCompatibilityLock.length, 4);
  assert.equal(ExecutiveIntentResolutionFreezeCompatibilityLock.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveIntentResolutionFreezeCompatibilityLock.map(({ id }) => id)).size, 4);
  const lock = ExecutiveIntentResolutionFreezeManifest.dependencyLock;
  assert.equal(Object.isFrozen(lock), true);
  assert.equal(lock.consumptionPolicy, "PublicIndexOnly");
  assert.equal(lock.reverseDependencies, "Prohibited");
  assert.equal(lock.circularDependencies, "Prohibited");
  assert.equal(lock.internalImplementationDependencies, "Prohibited");
});

test("extension policy and regression baseline are immutable and complete", () => {
  const { extensionPolicy, regressionBaseline } = ExecutiveIntentResolutionFreezeManifest;
  assert.equal(Object.isFrozen(extensionPolicy), true);
  assert.equal(Object.isFrozen(extensionPolicy.approvedExtensionPoints), true);
  assert.equal(extensionPolicy.approvedExtensionPoints.length, 6);
  assert.equal(extensionPolicy.publicApiExtensionPolicy, "AdditiveVersionedOnly");
  assert.equal(Object.isFrozen(regressionBaseline), true);
  assert.equal(regressionBaseline.certifiedApiBaseline, "Stable");
  assert.equal(regressionBaseline.freezeBaseline, "Established");
});

test("release baseline and manifest reference complete frozen architecture", () => {
  const baseline = ExecutiveIntentResolutionFreezeManifest.releaseBaseline;
  assert.equal(Object.isFrozen(baseline), true);
  assert.equal(baseline.includedPhases.length, 8);
  assert.equal(baseline.publishedPublicApis, 49);
  assert.equal(baseline.certifiedComponents, 7);
  assert.equal(baseline.frozenComponents, 7);
  assert.equal(baseline.releaseReadiness, "ReadyForPublicIndex");
  assert.equal(ExecutiveIntentResolutionFreezeManifest.dependencies.length, 7);
  assert.equal(ExecutiveIntentResolutionFreezeManifest.dependencies.every(({ artifact }) => Object.isFrozen(artifact)), true);
  assert.equal(ExecutiveIntentResolutionFreezeManifest.architecturalGuarantees.length, 10);
});

test("metadata-only runner publishes deterministic freeze summary", () => {
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionFreezeSummary), true);
  assert.equal(ExecutiveIntentResolutionFreezeSummary.frozenComponents, 7);
  assert.equal(ExecutiveIntentResolutionFreezeSummary.releaseReadiness, "ReadyForPublicIndex");
  assert.equal(getExecutiveIntentResolutionFreezeSummary(), ExecutiveIntentResolutionFreezeSummary);
  assert.equal(getExecutiveIntentResolutionFreezePlatform(), ExecutiveIntentResolutionFreezePlatform);
});

test("public freeze index exposes exactly seven approved APIs", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveIntentResolutionFreezeRegistry", "ExecutiveIntentResolutionFreezeCompatibilityLock",
    "ExecutiveIntentResolutionFreezeManifest", "ExecutiveIntentResolutionFreezePlatform",
    "ExecutiveIntentResolutionFreezeSummary", "getExecutiveIntentResolutionFreezePlatform",
    "getExecutiveIntentResolutionFreezeSummary",
  ].sort());
});
