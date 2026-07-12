import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveAutomationRegistry,
  getAutomationActionRegistry,
  getAutomationConditionRegistry,
  getAutomationEventRegistry,
  getAutomationLifecycleRegistry,
  getAutomationPolicyRegistry,
  getAutomationRuleRegistry,
  getAutomationTriggerRegistry,
  getExecutiveAutomationRegistry,
} from "./automationRegistryIndex.ts";

test("event registry", () => {
  assert.equal(Object.isFrozen(getAutomationEventRegistry()), true);
  assert.equal(getAutomationEventRegistry().length, 9);
});

test("trigger registry", () => {
  assert.equal(Object.isFrozen(getAutomationTriggerRegistry()), true);
  assert.equal(getAutomationTriggerRegistry().length, 6);
});

test("condition registry", () => {
  assert.equal(Object.isFrozen(getAutomationConditionRegistry()), true);
  assert.equal(getAutomationConditionRegistry().length, 7);
});

test("action registry", () => {
  assert.equal(Object.isFrozen(getAutomationActionRegistry()), true);
  assert.equal(getAutomationActionRegistry().length, 9);
});

test("rule registry", () => {
  assert.equal(Object.isFrozen(getAutomationRuleRegistry()), true);
  assert.equal(getAutomationRuleRegistry().length, 6);
});

test("policy registry", () => {
  assert.equal(Object.isFrozen(getAutomationPolicyRegistry()), true);
  assert.equal(getAutomationPolicyRegistry().length, 5);
});

test("lifecycle registry", () => {
  assert.equal(Object.isFrozen(getAutomationLifecycleRegistry()), true);
  assert.equal(getAutomationLifecycleRegistry().length, 6);
});

test("registry metadata", () => {
  assert.equal(ExecutiveAutomationRegistry.metadata.supportedEventCount, 9);
  assert.equal(ExecutiveAutomationRegistry.metadata.supportedActionCount, 9);
  assert.equal(ExecutiveAutomationRegistry.metadata.compatibilityVersion, "1.0.0");
});

test("platform namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveAutomationRegistry), true);
  assert.ok("events" in ExecutiveAutomationRegistry);
  assert.ok("triggers" in ExecutiveAutomationRegistry);
  assert.ok("conditions" in ExecutiveAutomationRegistry);
  assert.ok("actions" in ExecutiveAutomationRegistry);
  assert.ok("rules" in ExecutiveAutomationRegistry);
  assert.ok("policies" in ExecutiveAutomationRegistry);
  assert.ok("lifecycle" in ExecutiveAutomationRegistry);
  assert.ok("metadata" in ExecutiveAutomationRegistry);
});

test("helper APIs", () => {
  assert.deepEqual(getExecutiveAutomationRegistry(), ExecutiveAutomationRegistry);
  assert.deepEqual(getAutomationPolicyRegistry(), ExecutiveAutomationRegistry.policies);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(getExecutiveAutomationRegistry()), true);
  assert.equal(Object.isFrozen(ExecutiveAutomationRegistry.metadata), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(getExecutiveAutomationRegistry(), getExecutiveAutomationRegistry());
  assert.deepEqual(getAutomationEventRegistry(), getAutomationEventRegistry());
  assert.deepEqual(getAutomationLifecycleRegistry(), getAutomationLifecycleRegistry());
});

test("public API stability", () => {
  assert.equal(ExecutiveAutomationRegistry.descriptor.registryId, "ops-8-2-executive-automation-registry");
  assert.equal(ExecutiveAutomationRegistry.metadata.metadataOnly, true);
  assert.equal(ExecutiveAutomationRegistry.immutable, true);
});
