import assert from "node:assert/strict";
import test from "node:test";

import {
  AutomationValidationGroups,
  AutomationValidationRegistry,
  AutomationValidationRuleCatalog,
  buildAutomationValidationManifest,
  getAutomationValidationSummary,
  validateAutomationFoundation,
  validateAutomationModel,
  validateAutomationPlatform,
  validateAutomationRegistry,
  validateExecutiveAutomationPlatform,
} from "./automationValidationIndex.ts";

test("validation rules", () => {
  assert.equal(Object.isFrozen(AutomationValidationGroups), true);
  assert.equal(Object.isFrozen(AutomationValidationRuleCatalog), true);
  assert.equal(AutomationValidationGroups.length, 4);
  assert.equal(AutomationValidationRuleCatalog.length, 22);
});

test("validation registry", () => {
  assert.equal(Object.isFrozen(AutomationValidationRegistry), true);
  assert.equal(AutomationValidationRegistry.validationGroups.length, 4);
  assert.equal(AutomationValidationRegistry.validationRuleCatalog.length, 22);
});

test("validation manifest", () => {
  const manifest = buildAutomationValidationManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.validationIdentity.validationId, "OPS-8:4");
  assert.equal(manifest.validationIdentity.consumedPhases.length, 3);
});

test("validation helpers", () => {
  assert.equal(validateAutomationFoundation().status, "PASS");
  assert.equal(validateAutomationRegistry().status, "PASS");
  assert.equal(validateAutomationModel().status, "PASS");
  assert.equal(validateAutomationPlatform().status, "PASS");
  assert.equal(validateExecutiveAutomationPlatform().status, "PASS");
  assert.equal(validateExecutiveAutomationPlatform().failedChecks, 0);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildAutomationValidationManifest()), true);
  assert.equal(Object.isFrozen(validateExecutiveAutomationPlatform()), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(
    validateExecutiveAutomationPlatform(),
    validateExecutiveAutomationPlatform(),
  );
  assert.deepEqual(
    getAutomationValidationSummary(),
    getAutomationValidationSummary(),
  );
});

test("public API stability", () => {
  assert.equal(buildAutomationValidationManifest().supportedRuleGroups.length, 4);
  assert.equal(getAutomationValidationSummary().status, "PASS");
  assert.equal(AutomationValidationRegistry.validationMetadata.ruleCount, 22);
});
