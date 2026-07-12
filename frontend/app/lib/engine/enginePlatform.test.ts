import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./enginePlatformIndex.ts";
import { ExecutiveEnginePlatform, ExecutiveEnginePlatformMetadata, ExecutiveEnginePlatformSummary, getExecutiveEnginePlatform, getExecutiveEnginePlatformMetadata, getExecutiveEnginePlatformSummary } from "./enginePlatformIndex.ts";

test("platform namespace aggregates exactly five sections", () => {
  assert.ok(ExecutiveEnginePlatform);
  assert.deepEqual(Object.keys(ExecutiveEnginePlatform), ["foundation", "registry", "model", "validation", "manifest"]);
  assert.equal(Object.isFrozen(ExecutiveEnginePlatform), true);
  assert.equal(Object.values(ExecutiveEnginePlatform).every(Object.isFrozen), true);
});
test("platform metadata is immutable and compliant", () => {
  assert.equal(Object.isFrozen(ExecutiveEnginePlatformMetadata), true);
  assert.equal(ExecutiveEnginePlatformMetadata.platformId, "ENG-PLATFORM-001");
  assert.equal(ExecutiveEnginePlatformMetadata.lifecycleStatus, "PlatformActive");
  assert.equal(ExecutiveEnginePlatformMetadata.dependencyCompliance, "PASS");
  assert.equal(ExecutiveEnginePlatformMetadata.validationCompliance, "PASS");
  assert.equal(ExecutiveEnginePlatformMetadata.antiDuplicationCompliance, "PASS");
});
test("summary is deterministic and derived from consumed layers", () => {
  assert.equal(Object.isFrozen(ExecutiveEnginePlatformSummary), true);
  assert.equal(Object.isFrozen(ExecutiveEnginePlatformSummary.architecturalSections), true);
  assert.equal(ExecutiveEnginePlatformSummary.completedPhases, 5);
  assert.equal(ExecutiveEnginePlatformSummary.capabilityCount, ExecutiveEnginePlatform.registry.ExecutiveEngineCapabilityRegistry.length);
  assert.equal(ExecutiveEnginePlatformSummary.modelCount, ExecutiveEnginePlatform.model.ExecutiveEngineModelRegistry.length);
  assert.equal(ExecutiveEnginePlatformSummary.validationDomainCount, ExecutiveEnginePlatform.validation.ExecutiveEngineValidationManifest.validationDomains.length);
  assert.equal(ExecutiveEnginePlatformSummary.dependencyCount, ExecutiveEnginePlatform.manifest.ExecutiveEngineDependencyMap.length);
});
test("platform introduces no capabilities, models, or dependencies", () => {
  assert.equal(ExecutiveEnginePlatform.registry.ExecutiveEngineCapabilityRegistry.length, 8);
  assert.equal(ExecutiveEnginePlatform.model.ExecutiveEngineModelRegistry.length, 11);
  assert.equal(ExecutiveEnginePlatform.manifest.ExecutiveEngineDependencyMap.length, 8);
  assert.equal("ExecutiveEnginePlatformCapabilityRegistry" in ExecutiveEnginePlatform, false);
  assert.equal("ExecutiveEnginePlatformModelRegistry" in ExecutiveEnginePlatform, false);
});
test("helper APIs return canonical frozen deterministic references", () => {
  assert.equal(getExecutiveEnginePlatform(), ExecutiveEnginePlatform);
  assert.equal(getExecutiveEnginePlatformMetadata(), ExecutiveEnginePlatformMetadata);
  assert.equal(getExecutiveEnginePlatformSummary(), ExecutiveEnginePlatformSummary);
  assert.deepEqual(getExecutiveEnginePlatformSummary(), getExecutiveEnginePlatformSummary());
});
test("platform public API is exact and runtime-free", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), ["ExecutiveEnginePlatform", "ExecutiveEnginePlatformMetadata", "ExecutiveEnginePlatformSummary", "getExecutiveEnginePlatform", "getExecutiveEnginePlatformMetadata", "getExecutiveEnginePlatformSummary"].sort());
  assert.equal(Object.keys(publicApi).some((key) => /execute|understand|resolve|assemble|reason|decide|orchestrat|workflow|schedule|automate|persist|communicat|infer|route|runtime|service/i.test(key)), false);
  assert.equal(ExecutiveEnginePlatformSummary.nextPhase, "ENG-1:7 — Executive Engine Certification");
});
