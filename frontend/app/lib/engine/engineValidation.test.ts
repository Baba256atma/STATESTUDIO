import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./engineValidationIndex.ts";
import { ExecutiveEngineAntiDuplicationValidation, ExecutiveEngineDependencyValidation, ExecutiveEngineFoundationValidation, ExecutiveEngineImmutabilityValidation, ExecutiveEngineModelValidation, ExecutiveEngineOwnershipValidation, ExecutiveEnginePublicApiValidation, ExecutiveEngineRegistryValidation, ExecutiveEngineValidationManifest, ExecutiveEngineValidationRunner, getExecutiveEngineValidationManifest, getExecutiveEngineValidationSummary, runExecutiveEngineValidation } from "./engineValidationIndex.ts";

const domains = [ExecutiveEngineFoundationValidation, ExecutiveEngineRegistryValidation, ExecutiveEngineModelValidation, ExecutiveEngineOwnershipValidation, ExecutiveEngineDependencyValidation, ExecutiveEngineAntiDuplicationValidation, ExecutiveEngineImmutabilityValidation, ExecutiveEnginePublicApiValidation];

test("validation manifest and runner exist with eight domains", () => {
  assert.ok(ExecutiveEngineValidationManifest);
  assert.ok(ExecutiveEngineValidationRunner);
  assert.equal(ExecutiveEngineValidationManifest.validationDomains.length, 8);
  assert.deepEqual(ExecutiveEngineValidationManifest.validationDomains.map((domain) => domain.domain), ["Foundation", "Registry", "Model", "Ownership", "Dependency", "AntiDuplication", "Immutability", "PublicApi"]);
});

test("all architectural validation domains pass", () => {
  assert.equal(domains.every((domain) => domain.status === "PASS"), true);
  assert.equal(runExecutiveEngineValidation().status, "PASS");
  assert.equal(runExecutiveEngineValidation().failedDomains, 0);
  assert.equal(runExecutiveEngineValidation().failedChecks, 0);
});

test("validation summaries and manifest helpers are deterministic", () => {
  assert.deepEqual(getExecutiveEngineValidationSummary(), getExecutiveEngineValidationSummary());
  assert.deepEqual(runExecutiveEngineValidation(), runExecutiveEngineValidation());
  assert.equal(getExecutiveEngineValidationManifest(), ExecutiveEngineValidationManifest);
  assert.equal(getExecutiveEngineValidationSummary().releaseReadiness, "ReadyForManifest");
});

test("all exported validation structures are deeply frozen", () => {
  assert.equal(Object.isFrozen(ExecutiveEngineValidationManifest), true);
  assert.equal(Object.isFrozen(ExecutiveEngineValidationRunner), true);
  assert.equal(Object.isFrozen(ExecutiveEngineValidationRunner.domains), true);
  assert.equal(domains.every((domain) => Object.isFrozen(domain) && Object.isFrozen(domain.checks) && domain.checks.every(Object.isFrozen)), true);
  assert.equal(Object.isFrozen(getExecutiveEngineValidationSummary()), true);
});

test("manifest compliance and counts are internally consistent", () => {
  assert.equal(ExecutiveEngineValidationManifest.ownershipCompliance, "PASS");
  assert.equal(ExecutiveEngineValidationManifest.dependencyCompliance, "PASS");
  assert.equal(ExecutiveEngineValidationManifest.antiDuplicationCompliance, "PASS");
  assert.equal(ExecutiveEngineValidationManifest.immutabilityCompliance, "PASS");
  assert.equal(ExecutiveEngineValidationManifest.publicApiCompliance, "PASS");
  assert.equal(ExecutiveEngineValidationManifest.validationCounts.totalChecks, getExecutiveEngineValidationSummary().totalChecks);
});

test("public validation API has no operational runtime surface", () => {
  const keys = Object.keys(publicApi);
  for (const required of ["ExecutiveEngineValidationManifest", "ExecutiveEngineValidationRunner", "ExecutiveEngineFoundationValidation", "ExecutiveEngineRegistryValidation", "ExecutiveEngineModelValidation", "ExecutiveEngineOwnershipValidation", "getExecutiveEngineValidationManifest", "getExecutiveEngineValidationSummary", "runExecutiveEngineValidation"]) assert.ok(keys.includes(required));
  assert.equal(keys.some((key) => /interpret|detect|assemble|planRequest|reason|decide|orchestrat|workflow|schedule|automate|persist|network|infer|route|runtime|service/i.test(key)), false);
  assert.equal(ExecutiveEngineValidationRunner.runtimeBehavior, false);
});
