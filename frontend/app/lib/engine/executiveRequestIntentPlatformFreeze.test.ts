import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveRequestIntentPlatformFreezeIndex.ts";
import { ExecutiveRequestIntentPlatformCompatibility, ExecutiveRequestIntentPlatformFreeze, ExecutiveRequestIntentPlatformFreezeManifest, ExecutiveRequestIntentPlatformFreezeRegistry, getExecutiveRequestIntentCompatibilitySummary, getExecutiveRequestIntentFreezeSummary, getExecutiveRequestIntentPlatformFreeze } from "./executiveRequestIntentPlatformFreezeIndex.ts";

test("canonical freeze immutably aggregates registry, compatibility, and manifest", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentPlatformFreeze), true);
  assert.equal(ExecutiveRequestIntentPlatformFreeze.registry, ExecutiveRequestIntentPlatformFreezeRegistry);
  assert.equal(ExecutiveRequestIntentPlatformFreeze.compatibility, ExecutiveRequestIntentPlatformCompatibility);
  assert.equal(ExecutiveRequestIntentPlatformFreeze.manifest, ExecutiveRequestIntentPlatformFreezeManifest);
});

test("freeze registry contains seven complete unique frozen declarations", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentPlatformFreezeRegistry), true);
  assert.equal(ExecutiveRequestIntentPlatformFreezeRegistry.length, 7);
  assert.equal(ExecutiveRequestIntentPlatformFreezeRegistry.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveRequestIntentPlatformFreezeRegistry.map(({ identifier }) => identifier)).size, 7);
  assert.equal(ExecutiveRequestIntentPlatformFreezeRegistry.every(({ freezeStatus }) => freezeStatus === "Frozen"), true);
  assert.equal(ExecutiveRequestIntentPlatformFreezeRegistry.every(({ releaseStatus }) => releaseStatus === "ReadyForPublicIndex"), true);
});

test("compatibility metadata covers all required stable boundaries", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentPlatformCompatibility), true);
  assert.equal(ExecutiveRequestIntentPlatformCompatibility.length, 7);
  assert.equal(ExecutiveRequestIntentPlatformCompatibility.every(Object.isFrozen), true);
  assert.deepEqual(ExecutiveRequestIntentPlatformCompatibility.map(({ target }) => target), ["ENG-1", "Executive Engine", "BUS", "OPS", "Advisor", "CORE", "ENG-2:9 Public Index"]);
  assert.equal(ExecutiveRequestIntentPlatformCompatibility.every(({ ownershipSafety }) => ownershipSafety === "Protected"), true);
});

test("manifest completely references ENG-2:1 through ENG-2:7 public artifacts", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentPlatformFreezeManifest), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentPlatformFreezeManifest.phaseReferences), true);
  assert.deepEqual(Object.keys(ExecutiveRequestIntentPlatformFreezeManifest.phaseReferences), ["foundation", "registry", "model", "validation", "manifest", "platform", "certification"]);
  assert.equal(Object.values(ExecutiveRequestIntentPlatformFreezeManifest.phaseReferences).every(Object.isFrozen), true);
  assert.equal(ExecutiveRequestIntentPlatformFreezeManifest.dependencySummary.policy, "PublicIndicesOnly");
  assert.equal(ExecutiveRequestIntentPlatformFreezeManifest.ownershipSummary.eng1Preserved, true);
  assert.equal(ExecutiveRequestIntentPlatformFreezeManifest.ownershipSummary.collisionSafe, true);
});

test("freeze and compatibility summaries declare release readiness", () => {
  const freeze = getExecutiveRequestIntentFreezeSummary();
  const compatibility = getExecutiveRequestIntentCompatibilitySummary();
  assert.equal(freeze.freezeStatus, "Frozen");
  assert.equal(freeze.certificationStatus, "Certified");
  assert.equal(freeze.runtimeClassification, "MetadataOnly");
  assert.equal(freeze.publicApiStatus, "PublicApiStable");
  assert.equal(freeze.ownershipStatus, "OwnershipProtected");
  assert.equal(freeze.namespaceStatus, "NamespaceStable");
  assert.equal(freeze.releaseStatus, "ReadyForPublicIndex");
  assert.equal(compatibility.releaseReadiness, "ReadyForPublicIndex");
  assert.equal(Object.isFrozen(freeze), true);
  assert.equal(Object.isFrozen(compatibility), true);
});

test("helpers return canonical deterministic immutable references", () => {
  assert.equal(getExecutiveRequestIntentPlatformFreeze(), ExecutiveRequestIntentPlatformFreeze);
  assert.equal(getExecutiveRequestIntentFreezeSummary(), ExecutiveRequestIntentPlatformFreezeManifest.freezeSummary);
  assert.equal(getExecutiveRequestIntentCompatibilitySummary(), ExecutiveRequestIntentPlatformFreezeManifest.compatibilitySummary);
});

test("public API exposes exactly seven approved symbols", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveRequestIntentPlatformFreeze", "ExecutiveRequestIntentPlatformFreezeRegistry",
    "ExecutiveRequestIntentPlatformCompatibility", "ExecutiveRequestIntentPlatformFreezeManifest",
    "getExecutiveRequestIntentPlatformFreeze", "getExecutiveRequestIntentFreezeSummary",
    "getExecutiveRequestIntentCompatibilitySummary",
  ].sort());
});
