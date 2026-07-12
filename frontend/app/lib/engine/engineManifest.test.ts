import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./engineManifestIndex.ts";
import { ExecutiveEngineDependencyMap, ExecutiveEngineManifest, ExecutiveEngineManifestMetadata, ExecutiveEnginePhaseRegistry, ExecutiveEnginePublicSurface, ExecutiveEngineReleaseReadiness, getExecutiveEngineManifest, getExecutiveEngineManifestMetadata, getExecutiveEngineManifestSummary, getExecutiveEngineReleaseReadiness } from "./engineManifestIndex.ts";

test("aggregate manifest contains exactly nine required sections", () => {
  assert.ok(ExecutiveEngineManifest);
  assert.deepEqual(Object.keys(ExecutiveEngineManifest), ["foundation", "registry", "model", "validation", "phaseRegistry", "dependencyMap", "publicSurface", "manifestMetadata", "releaseReadiness"]);
  assert.equal(Object.isFrozen(ExecutiveEngineManifest), true);
  assert.equal(Object.values(ExecutiveEngineManifest).every(Object.isFrozen), true);
});
test("phase registry covers ENG-1:1 through ENG-1:5", () => {
  assert.equal(ExecutiveEnginePhaseRegistry.length, 5);
  assert.deepEqual(ExecutiveEnginePhaseRegistry.map((phase) => phase.phaseId), ["ENG-1:1", "ENG-1:2", "ENG-1:3", "ENG-1:4", "ENG-1:5"]);
  assert.deepEqual(ExecutiveEnginePhaseRegistry.map((phase) => phase.lifecycleStatus), ["Complete", "Complete", "Complete", "Complete", "Active"]);
});
test("dependency map contains approved public and consumed phase edges", () => {
  assert.equal(ExecutiveEngineDependencyMap.length, 8);
  assert.deepEqual(ExecutiveEngineDependencyMap.slice(0, 4).map((edge) => edge.target), ["CORE", "CORE-TEN", "BUS", "OPS"]);
  assert.equal(ExecutiveEngineDependencyMap.every((edge) => !edge.circularDependencyAllowed), true);
  assert.equal(ExecutiveEngineDependencyMap.some((edge) => /ENG-1:6/.test(edge.target)), false);
});
test("public surface inventories all four prior public APIs", () => {
  assert.equal(ExecutiveEnginePublicSurface.foundation.length > 0, true);
  assert.equal(ExecutiveEnginePublicSurface.registry.length > 0, true);
  assert.equal(ExecutiveEnginePublicSurface.model.length > 0, true);
  assert.equal(ExecutiveEnginePublicSurface.validation.length > 0, true);
  assert.equal(ExecutiveEnginePublicSurface.all.every((entry) => !entry.runtimeInterface), true);
});
test("all artifact identifiers are unique and deterministic", () => {
  const identifiers = [ExecutiveEngineManifestMetadata.manifestId, ...ExecutiveEnginePhaseRegistry.map((phase) => phase.artifactId), ...ExecutiveEngineDependencyMap.map((edge) => edge.artifactId), ExecutiveEnginePublicSurface.artifactId, ...ExecutiveEnginePublicSurface.all.map((entry) => entry.artifactId), ExecutiveEngineReleaseReadiness.artifactId];
  assert.equal(new Set(identifiers).size, identifiers.length);
});
test("manifest metadata and release readiness are complete", () => {
  assert.equal(Object.isFrozen(ExecutiveEngineManifestMetadata), true);
  assert.equal(Object.isFrozen(ExecutiveEngineReleaseReadiness), true);
  assert.equal(ExecutiveEngineManifestMetadata.validationStatus, "PASS");
  assert.equal(ExecutiveEngineReleaseReadiness.readiness, "ReadyForPlatform");
  assert.equal(ExecutiveEngineReleaseReadiness.foundationComplete, true);
  assert.equal(ExecutiveEngineReleaseReadiness.publicApiStable, true);
});
test("all exported metadata is deeply frozen", () => {
  assert.equal(ExecutiveEnginePhaseRegistry.every(Object.isFrozen), true);
  assert.equal(ExecutiveEngineDependencyMap.every(Object.isFrozen), true);
  assert.equal(ExecutiveEnginePublicSurface.all.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(ExecutiveEnginePublicSurface.all), true);
  assert.equal(Object.isFrozen(ExecutiveEngineManifest.foundation), true);
  assert.equal(Object.isFrozen(ExecutiveEngineManifest.registry), true);
});
test("helpers are deterministic and summary targets ENG-1:6", () => {
  assert.equal(getExecutiveEngineManifest(), ExecutiveEngineManifest);
  assert.equal(getExecutiveEngineManifestMetadata(), ExecutiveEngineManifestMetadata);
  assert.equal(getExecutiveEngineReleaseReadiness(), ExecutiveEngineReleaseReadiness);
  assert.deepEqual(getExecutiveEngineManifestSummary(), getExecutiveEngineManifestSummary());
  assert.equal(Object.isFrozen(getExecutiveEngineManifestSummary()), true);
  assert.equal(getExecutiveEngineManifestSummary().totalSections, 9);
  assert.equal(getExecutiveEngineManifestSummary().nextPhase, "ENG-1:6 — Executive Engine Platform");
});
test("public manifest API contains no runtime surface", () => {
  const keys = Object.keys(publicApi);
  for (const required of ["ExecutiveEngineManifest", "ExecutiveEnginePhaseRegistry", "ExecutiveEngineDependencyMap", "ExecutiveEnginePublicSurface", "ExecutiveEngineManifestMetadata", "ExecutiveEngineReleaseReadiness"]) assert.ok(keys.includes(required));
  assert.equal(keys.some((key) => /execute|reason|planRequest|orchestrat|route|workflow|infer|runtime|service|builder|internal|test/i.test(key)), false);
});
