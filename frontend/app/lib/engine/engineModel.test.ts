import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./engineModelIndex.ts";
import { ExecutiveContextModel, ExecutiveDecisionModel, ExecutiveEngineModelRegistry, ExecutiveEngineModelRelationships, ExecutiveIntentModel, ExecutiveOutcomeModel, ExecutivePlanModel, ExecutiveRequestModel, getExecutiveEngineModelRegistry, getExecutiveEngineModelRelationships, getExecutiveEngineModelSummary } from "./engineModelIndex.ts";

const canonicalIds = ["executive-request", "executive-intent", "executive-goal", "executive-context", "executive-plan", "executive-plan-step", "executive-reasoning-record", "executive-decision", "executive-decision-option", "executive-coordination-instruction", "executive-outcome"];

test("required public models and all eleven registry categories exist", () => {
  for (const model of [ExecutiveRequestModel, ExecutiveIntentModel, ExecutiveContextModel, ExecutivePlanModel, ExecutiveDecisionModel, ExecutiveOutcomeModel]) assert.ok(model);
  assert.equal(ExecutiveEngineModelRegistry.length, 11);
  assert.deepEqual(ExecutiveEngineModelRegistry.map((model) => model.id), canonicalIds);
});
test("model identifiers are unique and ordering is stable", () => {
  assert.equal(new Set(ExecutiveEngineModelRegistry.map((model) => model.id)).size, 11);
  assert.deepEqual(getExecutiveEngineModelRegistry().map((model) => model.id), canonicalIds);
});
test("canonical relationship flow is complete and descriptive", () => {
  assert.equal(ExecutiveEngineModelRelationships.length, 8);
  assert.deepEqual(ExecutiveEngineModelRelationships.map((edge) => edge.order), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(ExecutiveEngineModelRelationships[0]?.source, "executive-request");
  assert.equal(ExecutiveEngineModelRelationships[7]?.target, "executive-outcome");
  assert.equal(ExecutiveEngineModelRelationships.every((edge) => !edge.runtimeExecution), true);
});
test("top-level and nested model metadata is deeply frozen", () => {
  assert.equal(Object.isFrozen(ExecutiveEngineModelRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveEngineModelRelationships), true);
  assert.equal(ExecutiveEngineModelRegistry.every((model) => Object.isFrozen(model) && Object.isFrozen(model.fields) && Object.isFrozen(model.referencePolicies)), true);
  assert.equal(ExecutiveEngineModelRelationships.every(Object.isFrozen), true);
});
test("ownership and lifecycle classifications are safe", () => {
  assert.equal(ExecutiveEngineModelRegistry.every((model) => model.owner === "Engine"), true);
  assert.equal(ExecutiveEngineModelRegistry.every((model) => model.lifecycleStatus === "active"), true);
  assert.equal(ExecutiveEngineModelRegistry.every((model) => model.runtimeClassification === "MetadataOnly"), true);
});
test("external domain entities are referenced rather than duplicated", () => {
  const fieldNames = ExecutiveEngineModelRegistry.flatMap((model) => [...model.fields]);
  for (const prohibited of ["tasks", "workflows", "projects", "schedules", "automationRules", "financialEntities", "resources", "kpis", "okrs", "tenantIdentity", "persistenceRecords"]) assert.equal(fieldNames.includes(prohibited), false);
  assert.equal(fieldNames.includes("relevantEntityReferences"), true);
  assert.equal(fieldNames.includes("requiredPlatformReferences"), true);
});
test("helpers are deterministic and summary targets ENG-1:4", () => {
  assert.equal(getExecutiveEngineModelRegistry(), ExecutiveEngineModelRegistry);
  assert.equal(getExecutiveEngineModelRelationships(), ExecutiveEngineModelRelationships);
  assert.deepEqual(getExecutiveEngineModelSummary(), getExecutiveEngineModelSummary());
  assert.equal(Object.isFrozen(getExecutiveEngineModelSummary()), true);
  assert.equal(Object.isFrozen(getExecutiveEngineModelSummary().modelIdentifiers), true);
  assert.equal(getExecutiveEngineModelSummary().nextPhase, "ENG-1:4 — Executive Engine Validation");
});
test("public API contains no reasoning, planning, decision, routing, or execution runtime", () => {
  const keys = Object.keys(publicApi);
  for (const required of ["ExecutiveRequestModel", "ExecutiveIntentModel", "ExecutiveContextModel", "ExecutivePlanModel", "ExecutiveDecisionModel", "ExecutiveOutcomeModel", "ExecutiveEngineModelRegistry", "ExecutiveEngineModelRelationships"]) assert.ok(keys.includes(required));
  assert.equal(keys.some((key) => /execute|generate|calculate|resolve|interpret|route|dispatch|process|runtime|service|builder/i.test(key)), false);
});
