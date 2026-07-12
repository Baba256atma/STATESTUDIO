import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveIntentResolutionValidationIndex.ts";
import { ExecutiveIntentResolutionFoundationValidation, ExecutiveIntentResolutionModelValidation, ExecutiveIntentResolutionRegistryValidation, ExecutiveIntentResolutionValidationManifest, ExecutiveIntentResolutionValidationPlatform, getExecutiveIntentResolutionValidationManifest, getExecutiveIntentResolutionValidationPlatform } from "./executiveIntentResolutionValidationIndex.ts";
import type { ExecutiveValidationGroup } from "./executiveIntentResolutionValidationTypes.ts";

const groups: readonly ExecutiveValidationGroup[] = [ExecutiveIntentResolutionFoundationValidation, ExecutiveIntentResolutionRegistryValidation, ExecutiveIntentResolutionModelValidation];

test("validation platform exists and is deeply immutable", () => {
  assert.ok(ExecutiveIntentResolutionValidationPlatform);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionValidationPlatform), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionValidationPlatform.metadata), true);
  assert.equal(Object.values(ExecutiveIntentResolutionValidationPlatform).filter((value) => typeof value === "object").every(Object.isFrozen), true);
});

test("foundation, registry, and model validation groups are complete", () => {
  assert.deepEqual(groups.map(({ rules }) => rules.length), [6, 6, 7]);
  assert.equal(groups.every(Object.isFrozen), true);
  assert.equal(groups.every(({ rules }) => Object.isFrozen(rules)), true);
  assert.equal(groups.flatMap(({ rules }) => rules).every(Object.isFrozen), true);
  assert.equal(groups.flatMap(({ rules }) => rules).every(({ result }) => Object.isFrozen(result)), true);
});

test("validation manifest contains complete vocabularies and eight gates", () => {
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionValidationManifest), true);
  assert.equal(ExecutiveIntentResolutionValidationManifest.validationGroups.length, 3);
  assert.equal(ExecutiveIntentResolutionValidationManifest.validationGates.length, 8);
  assert.equal(ExecutiveIntentResolutionValidationManifest.categories.length, 10);
  assert.deepEqual(ExecutiveIntentResolutionValidationManifest.severities, ["Informational", "Warning", "Error", "Critical"]);
  assert.deepEqual(ExecutiveIntentResolutionValidationManifest.statuses, ["Pending", "Passed", "Failed", "Certified"]);
  assert.equal(ExecutiveIntentResolutionValidationManifest.validationGates.every(Object.isFrozen), true);
});

test("dependencies reference only the three approved public indices", () => {
  assert.deepEqual(ExecutiveIntentResolutionValidationManifest.dependencies.map(({ publicIndex }) => publicIndex), ["executiveIntentResolutionIndex.ts", "executiveIntentResolutionRegistryIndex.ts", "executiveIntentResolutionModelIndex.ts"]);
  assert.equal(ExecutiveIntentResolutionValidationManifest.dependencies.every(Object.isFrozen), true);
  assert.equal(ExecutiveIntentResolutionValidationManifest.compatibility.ownershipSafe, true);
});

test("validation group, rule, and gate identifiers are unique", () => {
  const rules = groups.flatMap(({ rules }) => rules);
  assert.equal(new Set(groups.map(({ id }) => id)).size, 3);
  assert.equal(new Set(rules.map(({ id }) => id)).size, 19);
  assert.equal(new Set(ExecutiveIntentResolutionValidationManifest.validationGates.map(({ id }) => id)).size, 8);
});

test("helpers return canonical immutable metadata references", () => {
  assert.equal(getExecutiveIntentResolutionValidationPlatform(), ExecutiveIntentResolutionValidationPlatform);
  assert.equal(getExecutiveIntentResolutionValidationManifest(), ExecutiveIntentResolutionValidationManifest);
  assert.equal(Object.isFrozen(getExecutiveIntentResolutionValidationPlatform()), true);
  assert.equal(ExecutiveIntentResolutionValidationManifest.metadataOnly, true);
});

test("public validation index exposes exactly seven approved APIs", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveIntentResolutionFoundationValidation", "ExecutiveIntentResolutionRegistryValidation",
    "ExecutiveIntentResolutionModelValidation", "ExecutiveIntentResolutionValidationManifest",
    "ExecutiveIntentResolutionValidationPlatform", "getExecutiveIntentResolutionValidationPlatform",
    "getExecutiveIntentResolutionValidationManifest",
  ].sort());
});
