import assert from "node:assert/strict";
import test from "node:test";

import {
  AutomationCompatibilityVersion,
  AutomationContracts,
  AutomationEventContract,
  AutomationMetadataCatalog,
  AutomationRegistry,
  AutomationRuleContract,
  AutomationTriggerContract,
  ExecutiveAutomationFoundation,
  getExecutiveAutomationFoundation,
  getExecutiveAutomationMetadata,
} from "./automationIndex.ts";

test("contracts", () => {
  assert.equal(Object.isFrozen(AutomationContracts), true);
  assert.equal(AutomationEventContract.id, "automation-event-contract");
  assert.equal(AutomationTriggerContract.type, "StateChange");
  assert.equal(AutomationRuleContract.conditionReferences.length, 1);
});

test("registry", () => {
  assert.equal(Object.isFrozen(AutomationRegistry), true);
  assert.equal(AutomationRegistry.platformId, "OPS-8:1");
  assert.equal(AutomationRegistry.registeredPhases.length, 1);
});

test("metadata", () => {
  assert.equal(Object.isFrozen(AutomationMetadataCatalog), true);
  assert.equal(AutomationCompatibilityVersion, "1.0.0");
  assert.equal(AutomationMetadataCatalog.supportedEventCategories.length, 9);
  assert.equal(AutomationMetadataCatalog.supportedExecutionStatuses.length, 6);
});

test("foundation namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveAutomationFoundation), true);
  assert.ok("contracts" in ExecutiveAutomationFoundation);
  assert.ok("registry" in ExecutiveAutomationFoundation);
  assert.ok("metadata" in ExecutiveAutomationFoundation);
  assert.ok("types" in ExecutiveAutomationFoundation);
});

test("helper APIs", () => {
  assert.deepEqual(
    getExecutiveAutomationFoundation(),
    ExecutiveAutomationFoundation,
  );
  assert.deepEqual(
    getExecutiveAutomationMetadata(),
    AutomationMetadataCatalog,
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(getExecutiveAutomationFoundation()), true);
  assert.equal(Object.isFrozen(getExecutiveAutomationMetadata()), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(
    getExecutiveAutomationFoundation(),
    getExecutiveAutomationFoundation(),
  );
  assert.deepEqual(
    getExecutiveAutomationMetadata(),
    getExecutiveAutomationMetadata(),
  );
});

test("public API stability", () => {
  assert.equal(ExecutiveAutomationFoundation.descriptor.contractCount, 5);
  assert.equal(ExecutiveAutomationFoundation.descriptor.registryStatus, "Complete");
  assert.equal(ExecutiveAutomationFoundation.metadataOnly, true);
});
