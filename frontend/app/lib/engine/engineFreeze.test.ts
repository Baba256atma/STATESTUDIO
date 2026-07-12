import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./engineFreezeIndex.ts";
import { ExecutiveEngineCompatibilityMatrix, ExecutiveEngineExtensionPolicy, ExecutiveEngineFreezeManifest, ExecutiveEngineFreezeRegistry, ExecutiveEngineFreezeSummary, getExecutiveEngineCompatibilityMatrix, getExecutiveEngineExtensionPolicy, getExecutiveEngineFreezeManifest, getExecutiveEngineFreezeSummary } from "./engineFreezeIndex.ts";

test("freeze registry and required freeze artifacts exist", () => {
  assert.ok(ExecutiveEngineFreezeRegistry);
  assert.ok(ExecutiveEngineCompatibilityMatrix);
  assert.ok(ExecutiveEngineExtensionPolicy);
  assert.ok(ExecutiveEngineFreezeManifest.phaseLockMetadata);
  assert.ok(ExecutiveEngineFreezeManifest.regressionSummary);
  assert.ok(ExecutiveEngineFreezeManifest);
  assert.ok(ExecutiveEngineFreezeSummary);
});
test("freeze and compatibility identifiers are unique", () => {
  const identifiers = [ExecutiveEngineFreezeRegistry.artifactId,
    ...ExecutiveEngineFreezeRegistry.frozenArtifacts.map((entry) => entry.artifactId),
    ...ExecutiveEngineCompatibilityMatrix.map((entry) => entry.artifactId),
    ExecutiveEngineExtensionPolicy.artifactId,
    ExecutiveEngineFreezeManifest.phaseLockMetadata.artifactId,
    ExecutiveEngineFreezeManifest.regressionSummary.artifactId,
    ExecutiveEngineFreezeManifest.artifactId,
    ExecutiveEngineFreezeSummary.artifactId];
  assert.equal(new Set(identifiers).size, identifiers.length);
});
test("all freeze exports and nested collections are deeply frozen", () => {
  for (const value of [ExecutiveEngineFreezeRegistry, ExecutiveEngineCompatibilityMatrix, ExecutiveEngineExtensionPolicy, ExecutiveEngineFreezeManifest, ExecutiveEngineFreezeSummary]) assert.equal(Object.isFrozen(value), true);
  assert.equal(ExecutiveEngineFreezeRegistry.frozenArtifacts.every(Object.isFrozen), true);
  assert.equal(ExecutiveEngineCompatibilityMatrix.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(ExecutiveEngineExtensionPolicy.futureExtensionPoints), true);
  assert.equal(Object.isFrozen(ExecutiveEngineExtensionPolicy.rules), true);
  assert.equal(Object.isFrozen(ExecutiveEngineFreezeManifest.phaseLockMetadata.lockTimestampMetadata), true);
});
test("compatibility covers four external and seven internal targets", () => {
  assert.equal(ExecutiveEngineCompatibilityMatrix.length, 11);
  assert.deepEqual(ExecutiveEngineCompatibilityMatrix.filter((entry) => entry.scope === "ExternalPublicLayer").map((entry) => entry.target), ["CORE", "CORE-TEN", "BUS", "OPS"]);
  assert.deepEqual(ExecutiveEngineCompatibilityMatrix.filter((entry) => entry.scope === "InternalEngineSection").map((entry) => entry.target), ["Foundation", "Registry", "Model", "Validation", "Manifest", "Platform", "Certification"]);
});
test("extension policy freezes ENG-1 and redirects future capabilities", () => {
  assert.equal(ExecutiveEngineExtensionPolicy.foundationStatus, "Frozen");
  assert.equal(ExecutiveEngineExtensionPolicy.futureExtensionPoints.length, 6);
  assert.equal(ExecutiveEngineExtensionPolicy.runtimeCapabilitiesAllowedInEng1, false);
  assert.equal(ExecutiveEngineExtensionPolicy.rules.includes("ENG-1 must not gain new runtime capabilities."), true);
});
test("freeze summary publishes Frozen and ReadyForPublicIndex", () => {
  assert.equal(ExecutiveEngineFreezeSummary.freezeStatus, "Frozen");
  assert.equal(ExecutiveEngineFreezeSummary.readiness, "ReadyForPublicIndex");
  assert.equal(ExecutiveEngineFreezeSummary.certificationStatus, "Certified");
  assert.equal(ExecutiveEngineFreezeSummary.validationStatus, "PASS");
  assert.equal(ExecutiveEngineFreezeSummary.nextPhase, "ENG-1:9 — Executive Engine Public Index");
});
test("helpers return canonical deterministic references", () => {
  assert.equal(getExecutiveEngineFreezeManifest(), ExecutiveEngineFreezeManifest);
  assert.equal(getExecutiveEngineCompatibilityMatrix(), ExecutiveEngineCompatibilityMatrix);
  assert.equal(getExecutiveEngineFreezeSummary(), ExecutiveEngineFreezeSummary);
  assert.equal(getExecutiveEngineExtensionPolicy(), ExecutiveEngineExtensionPolicy);
  assert.deepEqual(getExecutiveEngineFreezeSummary(), getExecutiveEngineFreezeSummary());
});
test("public freeze API is runtime-free and restricted", () => {
  const keys = Object.keys(publicApi);
  for (const required of ["ExecutiveEngineFreezeRegistry", "ExecutiveEngineCompatibilityMatrix", "ExecutiveEngineExtensionPolicy", "ExecutiveEngineFreezeManifest", "ExecutiveEngineFreezeSummary", "getExecutiveEngineFreezeManifest", "getExecutiveEngineCompatibilityMatrix", "getExecutiveEngineFreezeSummary", "getExecutiveEngineExtensionPolicy"]) assert.ok(keys.includes(required));
  assert.equal(keys.some((key) => /execute|enforce|understand|resolve|assemble|reason|decide|orchestrat|workflow|schedule|automate|persist|cache|network|infer|runtimeService|builder|internal|test/i.test(key)), false);
});
