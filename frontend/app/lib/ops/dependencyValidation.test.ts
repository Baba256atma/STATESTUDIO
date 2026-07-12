import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDependencyValidationManifest,
  DependencyValidationGroups,
  DependencyValidationRegistry,
  DependencyValidationRuleCatalog,
  getDependencyValidationSummary,
  validateDependencyFoundation,
  validateDependencyModel,
  validateDependencyPlatform,
  validateDependencyRegistry,
  validateExecutiveDependencyPlatform,
} from "./dependencyValidationIndex.ts";

test("validation rules", () => {
  assert.equal(Object.isFrozen(DependencyValidationGroups), true);
  assert.equal(Object.isFrozen(DependencyValidationRuleCatalog), true);
  assert.equal(DependencyValidationGroups.length, 4);
  assert.equal(DependencyValidationRuleCatalog.length, 15);
});

test("validation registry", () => {
  assert.equal(Object.isFrozen(DependencyValidationRegistry), true);
  assert.equal(DependencyValidationRegistry.validationGroups.length, 4);
  assert.equal(DependencyValidationRegistry.validationRuleCatalog.length, 15);
});

test("validation manifest", () => {
  const manifest = buildDependencyValidationManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.validationIdentity.validationId, "OPS-7:4");
  assert.equal(manifest.validationIdentity.consumedPhases.length, 3);
});

test("validation helpers", () => {
  assert.equal(validateDependencyFoundation().status, "PASS");
  assert.equal(validateDependencyRegistry().status, "PASS");
  assert.equal(validateDependencyModel().status, "PASS");
  assert.equal(validateDependencyPlatform().status, "PASS");
  assert.equal(validateExecutiveDependencyPlatform().status, "PASS");
  assert.equal(validateExecutiveDependencyPlatform().failedChecks, 0);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildDependencyValidationManifest()), true);
  assert.equal(Object.isFrozen(validateExecutiveDependencyPlatform()), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(
    validateExecutiveDependencyPlatform(),
    validateExecutiveDependencyPlatform(),
  );
  assert.deepEqual(
    getDependencyValidationSummary(),
    getDependencyValidationSummary(),
  );
});

test("public API stability", () => {
  assert.equal(buildDependencyValidationManifest().supportedRuleGroups.length, 4);
  assert.equal(getDependencyValidationSummary().status, "PASS");
  assert.equal(DependencyValidationRegistry.validationMetadata.ruleCount, 15);
});
