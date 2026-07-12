import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveEnginePublicIndex.ts";
import { ExecutiveEngineFoundationPublicPlatform, ExecutiveEnginePublicApiRegistry, ExecutiveEnginePublicIndexStatus, getExecutiveEngineFoundation, getExecutiveEnginePublicApiRegistry, getExecutiveEnginePublicMetadata, getExecutiveEngineReleaseSummary } from "./executiveEnginePublicIndex.ts";

const sections = ["foundation", "registry", "model", "validation", "manifest", "platform", "certification", "freeze", "publicIndex"];
test("canonical public namespace contains exactly nine immutable sections", () => {
  assert.ok(ExecutiveEngineFoundationPublicPlatform);
  assert.deepEqual(Object.keys(ExecutiveEngineFoundationPublicPlatform), sections);
  assert.equal(Object.isFrozen(ExecutiveEngineFoundationPublicPlatform), true);
  assert.equal(Object.values(ExecutiveEngineFoundationPublicPlatform).every(Object.isFrozen), true);
});
test("public API registry inventories every supported phase export", () => {
  assert.ok(ExecutiveEnginePublicApiRegistry);
  assert.equal(Object.isFrozen(ExecutiveEnginePublicApiRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveEnginePublicApiRegistry.all), true);
  assert.equal(ExecutiveEnginePublicApiRegistry.publicIndex.length, 12);
  assert.equal(new Set(ExecutiveEnginePublicApiRegistry.all.map((entry) => entry.artifactId)).size, ExecutiveEnginePublicApiRegistry.all.length);
  assert.equal(ExecutiveEnginePublicApiRegistry.all.every(Object.isFrozen), true);
});
test("public metadata reports released certified frozen platform", () => {
  const metadata = getExecutiveEnginePublicMetadata();
  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(ExecutiveEnginePublicIndexStatus.releaseStatus, "Released");
  assert.equal(ExecutiveEnginePublicIndexStatus.certificationStatus, "Certified");
  assert.equal(ExecutiveEnginePublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveEnginePublicIndexStatus.platformStatus, "ReadyForEngineExpansion");
});
test("release summary is complete, immutable, and deterministic", () => {
  const summary = getExecutiveEngineReleaseSummary();
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(Object.isFrozen(summary.architecturalSections), true);
  assert.equal(summary.completedPhases, 8);
  assert.equal(summary.capabilityCount, 8);
  assert.equal(summary.modelCount, 11);
  assert.equal(summary.validationDomainCount, 8);
  assert.equal(summary.certificationGateCount, 15);
  assert.equal(summary.compatibilityCount, 11);
  assert.equal(summary.extensionPointCount, 6);
  assert.equal(summary.nextPhase, "ENG-2 — Executive Request Understanding");
  assert.deepEqual(summary, getExecutiveEngineReleaseSummary());
});
test("helpers return canonical immutable references", () => {
  assert.equal(getExecutiveEngineFoundation(), ExecutiveEngineFoundationPublicPlatform);
  assert.equal(getExecutiveEnginePublicApiRegistry(), ExecutiveEnginePublicApiRegistry);
  assert.equal(Object.isFrozen(getExecutiveEngineFoundation()), true);
  assert.equal(Object.isFrozen(getExecutiveEnginePublicMetadata()), true);
});
test("public exports are exact and runtime-free", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveEngineFoundationPublicPlatform", "ExecutiveEnginePublicApiRegistry",
    "ExecutiveEnginePublicIndexId", "ExecutiveEnginePublicIndexName", "ExecutiveEnginePublicIndexVersion",
    "ExecutiveEnginePublicIndexDescription", "ExecutiveEnginePublicIndexNamespace", "ExecutiveEnginePublicIndexStatus",
    "getExecutiveEngineFoundation", "getExecutiveEnginePublicMetadata", "getExecutiveEnginePublicApiRegistry", "getExecutiveEngineReleaseSummary",
  ].sort());
  assert.equal(Object.keys(publicApi).some((key) => /execute|understandRequest|resolveIntent|assembleContext|reason|decide|orchestrat|workflow|route|schedule|automate|persist|network|infer|runtimeService|builder|internal|test/i.test(key)), false);
});
