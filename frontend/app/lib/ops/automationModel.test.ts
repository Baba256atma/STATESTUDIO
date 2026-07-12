import assert from "node:assert/strict";
import test from "node:test";

import {
  AutomationActionModel,
  AutomationConditionModel,
  AutomationEventModel,
  AutomationExecutionModel,
  AutomationModelMetadata,
  AutomationPolicyModel,
  AutomationRuleModel,
  AutomationTriggerModel,
  ExecutiveAutomationModel,
  getAutomationExecutionModel,
  getAutomationRuleModel,
  getExecutiveAutomationModel,
} from "./automationModelIndex.ts";

test("event model", () => {
  assert.equal(Object.isFrozen(AutomationEventModel), true);
  assert.equal(AutomationEventModel.length, 9);
});

test("trigger model", () => {
  assert.equal(Object.isFrozen(AutomationTriggerModel), true);
  assert.equal(AutomationTriggerModel.length, 6);
});

test("condition model", () => {
  assert.equal(Object.isFrozen(AutomationConditionModel), true);
  assert.equal(AutomationConditionModel.length, 7);
});

test("action model", () => {
  assert.equal(Object.isFrozen(AutomationActionModel), true);
  assert.equal(AutomationActionModel.length, 9);
});

test("rule model", () => {
  assert.equal(Object.isFrozen(AutomationRuleModel), true);
  assert.equal(AutomationRuleModel.length, 6);
  assert.equal(AutomationRuleModel[0]?.lifecycle, "Draft");
});

test("policy model", () => {
  assert.equal(Object.isFrozen(AutomationPolicyModel), true);
  assert.equal(AutomationPolicyModel.length, 5);
});

test("execution model", () => {
  assert.equal(Object.isFrozen(AutomationExecutionModel), true);
  assert.equal(AutomationExecutionModel.length, 5);
});

test("metadata", () => {
  assert.equal(Object.isFrozen(AutomationModelMetadata), true);
  assert.equal(AutomationModelMetadata.modelVersion, "1.0.0");
  assert.equal(AutomationModelMetadata.compatibilityVersion, "1.0.0");
});

test("platform namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveAutomationModel), true);
  assert.ok("events" in ExecutiveAutomationModel);
  assert.ok("triggers" in ExecutiveAutomationModel);
  assert.ok("conditions" in ExecutiveAutomationModel);
  assert.ok("actions" in ExecutiveAutomationModel);
  assert.ok("rules" in ExecutiveAutomationModel);
  assert.ok("policies" in ExecutiveAutomationModel);
  assert.ok("executions" in ExecutiveAutomationModel);
  assert.ok("metadata" in ExecutiveAutomationModel);
});

test("helper APIs", () => {
  assert.deepEqual(getExecutiveAutomationModel(), ExecutiveAutomationModel);
  assert.deepEqual(getAutomationRuleModel(), ExecutiveAutomationModel.rules);
  assert.deepEqual(
    getAutomationExecutionModel(),
    ExecutiveAutomationModel.executions,
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(getExecutiveAutomationModel()), true);
  assert.equal(Object.isFrozen(getAutomationRuleModel()), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(getExecutiveAutomationModel(), getExecutiveAutomationModel());
  assert.deepEqual(getAutomationRuleModel(), getAutomationRuleModel());
  assert.deepEqual(
    getAutomationExecutionModel(),
    getAutomationExecutionModel(),
  );
});

test("public API stability", () => {
  assert.equal(ExecutiveAutomationModel.summary.ruleModelCount, 6);
  assert.equal(ExecutiveAutomationModel.metadata.metadataOnly, true);
  assert.equal(ExecutiveAutomationModel.immutable, true);
});
