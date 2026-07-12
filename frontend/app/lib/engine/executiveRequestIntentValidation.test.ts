import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveRequestIntentValidationIndex.ts";
import { ExecutiveRequestIntentFoundationValidation, ExecutiveRequestIntentModelValidation, ExecutiveRequestIntentOwnershipValidation, ExecutiveRequestIntentPublicApiValidation, ExecutiveRequestIntentRegistryValidation, ExecutiveRequestIntentValidationManifest, getExecutiveRequestIntentValidationManifest, getExecutiveRequestIntentValidationSummary } from "./executiveRequestIntentValidationIndex.ts";

const groups = [
  ExecutiveRequestIntentFoundationValidation, ExecutiveRequestIntentRegistryValidation,
  ExecutiveRequestIntentModelValidation, ExecutiveRequestIntentOwnershipValidation,
  ExecutiveRequestIntentPublicApiValidation,
] as const;

test("manifest aggregates exactly five complete validation groups", () => {
  assert.equal(groups.length, 5);
  assert.deepEqual(ExecutiveRequestIntentValidationManifest.validationGroups, groups);
  assert.deepEqual(groups.map(({ rules }) => rules.length), [8, 8, 9, 7, 9]);
  assert.equal(ExecutiveRequestIntentValidationManifest.totalGroupCount, 5);
  assert.equal(ExecutiveRequestIntentValidationManifest.totalRuleCount, 41);
});

test("validation group and rule identifiers are unique", () => {
  const rules = ExecutiveRequestIntentValidationManifest.validationRuleInventory;
  assert.equal(new Set(groups.map(({ id }) => id)).size, groups.length);
  assert.equal(new Set(rules.map(({ id }) => id)).size, rules.length);
});

test("all validation metadata is frozen and namespace-consistent", () => {
  const rules = ExecutiveRequestIntentValidationManifest.validationRuleInventory;
  assert.equal(Object.isFrozen(ExecutiveRequestIntentValidationManifest), true);
  assert.equal(groups.every(Object.isFrozen), true);
  assert.equal(groups.every(({ rules: entries }) => Object.isFrozen(entries)), true);
  assert.equal(rules.every(Object.isFrozen), true);
  assert.equal(rules.every(({ target, evidence, result }) => Object.isFrozen(target) && Object.isFrozen(evidence) && Object.isFrozen(result)), true);
  assert.equal(groups.every(({ namespace }) => namespace === ExecutiveRequestIntentValidationManifest.namespace), true);
});

test("dependencies use only the three approved ENG-2 public surfaces", () => {
  assert.deepEqual(ExecutiveRequestIntentValidationManifest.dependencyReferences.map(({ phase }) => phase), ["ENG-2:1", "ENG-2:2", "ENG-2:3"]);
  assert.deepEqual(ExecutiveRequestIntentValidationManifest.publicApiReferences, ["executiveRequestIntentIndex.ts", "executiveRequestIntentRegistryIndex.ts", "executiveRequestIntentModelIndex.ts"]);
  assert.equal(ExecutiveRequestIntentValidationManifest.dependencyReferences.every(Object.isFrozen), true);
});

test("ownership metadata protects ENG-1 and collision-safe ENG-2 symbols", () => {
  const ownership = ExecutiveRequestIntentValidationManifest.ownershipReferences.join(" ");
  assert.match(ownership, /executiveRequestModel\.ts/);
  assert.match(ownership, /ExecutiveIntentModel/);
  assert.match(ownership, /ExecutiveRequestIntent-prefixed/);
  assert.equal(ExecutiveRequestIntentOwnershipValidation.rules.length, 7);
});

test("summary and helper APIs are deterministic canonical references", () => {
  const summary = getExecutiveRequestIntentValidationSummary();
  assert.equal(summary.groupCount, 5);
  assert.equal(summary.ruleCount, 41);
  assert.equal(summary.satisfiedRuleCount, 41);
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(getExecutiveRequestIntentValidationManifest(), ExecutiveRequestIntentValidationManifest);
  assert.equal(getExecutiveRequestIntentValidationSummary(), ExecutiveRequestIntentValidationManifest.architecturalSummary);
});

test("public API exposes exactly eight approved symbols", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveRequestIntentFoundationValidation", "ExecutiveRequestIntentRegistryValidation",
    "ExecutiveRequestIntentModelValidation", "ExecutiveRequestIntentOwnershipValidation",
    "ExecutiveRequestIntentPublicApiValidation", "ExecutiveRequestIntentValidationManifest",
    "getExecutiveRequestIntentValidationManifest", "getExecutiveRequestIntentValidationSummary",
  ].sort());
});
