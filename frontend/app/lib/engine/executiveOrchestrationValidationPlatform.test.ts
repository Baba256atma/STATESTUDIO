import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import * as publicApi from "./executiveOrchestrationValidationRunner.ts";
import {
  ExecutiveOrchestrationFoundationValidation,
  ExecutiveOrchestrationModelValidation,
  ExecutiveOrchestrationOwnershipValidation,
  ExecutiveOrchestrationRegistryValidation,
  ExecutiveOrchestrationValidationManifest,
  ExecutiveOrchestrationValidationRunner,
  getExecutiveOrchestrationValidationSummary,
  runExecutiveOrchestrationValidation,
} from "./executiveOrchestrationValidationRunner.ts";

const requiredFiles = Object.freeze([
  "executiveOrchestrationValidationTypes.ts",
  "executiveOrchestrationFoundationValidation.ts",
  "executiveOrchestrationRegistryValidation.ts",
  "executiveOrchestrationModelValidation.ts",
  "executiveOrchestrationOwnershipValidation.ts",
  "executiveOrchestrationValidationManifest.ts",
  "executiveOrchestrationValidationRunner.ts",
  "executiveOrchestrationValidationPlatform.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveOrchestrationValidationManifest",
  "ExecutiveOrchestrationValidationRunner",
  "ExecutiveOrchestrationFoundationValidation",
  "ExecutiveOrchestrationRegistryValidation",
  "ExecutiveOrchestrationModelValidation",
  "ExecutiveOrchestrationOwnershipValidation",
  "runExecutiveOrchestrationValidation",
  "getExecutiveOrchestrationValidationSummary",
] as const);

const validStatuses = Object.freeze(["Pass", "Fail", "Skipped", "NotApplicable"] as const);
const validSeverities = Object.freeze(["Info", "Warning", "Error", "Critical"] as const);

test("exactly eight required ENG-8:4 files exist", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles) {
    assert.equal(readFileSync(join(dir, file), "utf8").length > 0, true);
  }
  assert.equal(requiredFiles.length, 8);
});

test("publishes exactly eight approved public exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [...approvedExports].sort());
  assert.equal(Object.keys(publicApi).length, 8);
});

test("foundation, registry, model, and ownership validations exist and are frozen", () => {
  assert.equal(Object.isFrozen(ExecutiveOrchestrationFoundationValidation), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationRegistryValidation), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationModelValidation), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationOwnershipValidation), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationValidationManifest), true);
  assert.equal(ExecutiveOrchestrationFoundationValidation.category, "Foundation");
  assert.equal(ExecutiveOrchestrationRegistryValidation.category, "Registry");
  assert.equal(ExecutiveOrchestrationModelValidation.category, "Model");
  assert.equal(ExecutiveOrchestrationOwnershipValidation.category, "Ownership");
  assert.equal(ExecutiveOrchestrationFoundationValidation.rules.every(Object.isFrozen), true);
  assert.equal(ExecutiveOrchestrationRegistryValidation.rules.every(Object.isFrozen), true);
  assert.equal(ExecutiveOrchestrationModelValidation.rules.every(Object.isFrozen), true);
  assert.equal(ExecutiveOrchestrationOwnershipValidation.rules.every(Object.isFrozen), true);
});

test("validation statuses and severities are valid", () => {
  const allRules = ExecutiveOrchestrationValidationManifest.validationRules;
  assert.equal(
    allRules.every(({ status }) => (validStatuses as readonly string[]).includes(status)),
    true,
  );
  assert.equal(
    allRules.every(({ severity }) => (validSeverities as readonly string[]).includes(severity)),
    true,
  );
  assert.deepEqual([...ExecutiveOrchestrationValidationManifest.coverage.statuses], [
    "Pass",
    "Fail",
    "Skipped",
    "NotApplicable",
  ]);
  assert.deepEqual([...ExecutiveOrchestrationValidationManifest.coverage.severities], [
    "Info",
    "Warning",
    "Error",
    "Critical",
  ]);
  assert.equal(allRules.every(({ status }) => status === "Pass"), true);
});

test("ownership has no duplicates and cross-category rules resolve", () => {
  assert.equal(
    ExecutiveOrchestrationOwnershipValidation.primaryOwnerCounts.every(
      (entry) => "primaryOwnerCount" in entry && entry.primaryOwnerCount === 1,
    ),
    true,
  );
  assert.equal(ExecutiveOrchestrationValidationManifest.coverage.validatedPhases.length, 3);
  assert.deepEqual(
    [...ExecutiveOrchestrationValidationManifest.sections],
    [
      "Foundation",
      "Registry",
      "Model",
      "Ownership",
      "Validation Rules",
      "Coverage",
      "Summary",
      "Metadata",
    ],
  );
  assert.equal(
    ExecutiveOrchestrationValidationManifest.coverage.ruleCount,
    ExecutiveOrchestrationFoundationValidation.rules.length
      + ExecutiveOrchestrationRegistryValidation.rules.length
      + ExecutiveOrchestrationModelValidation.rules.length
      + ExecutiveOrchestrationOwnershipValidation.rules.length,
  );
});

test("runner returns immutable deterministic summary and unknown category is undefined", () => {
  const result = runExecutiveOrchestrationValidation();
  const summary = getExecutiveOrchestrationValidationSummary();
  assert.equal(result, summary);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationValidationRunner), true);
  assert.equal(result.validationId, "ENG-8:4");
  assert.equal(result.validationStatus, "Pass");
  assert.equal(result.readiness, "ReadyForManifest");
  assert.equal(result.failedRules, 0);
  assert.equal(result.passedRules, result.totalRules);
  assert.equal(result.totalRules, ExecutiveOrchestrationValidationManifest.validationRules.length);
  assert.equal(
    ExecutiveOrchestrationValidationRunner.getCategoryById("Foundation"),
    ExecutiveOrchestrationFoundationValidation,
  );
  assert.equal(
    ExecutiveOrchestrationValidationRunner.getCategoryById("Registry"),
    ExecutiveOrchestrationRegistryValidation,
  );
  assert.equal(
    ExecutiveOrchestrationValidationRunner.getCategoryById("Model"),
    ExecutiveOrchestrationModelValidation,
  );
  assert.equal(
    ExecutiveOrchestrationValidationRunner.getCategoryById("Ownership"),
    ExecutiveOrchestrationOwnershipValidation,
  );
  assert.equal(ExecutiveOrchestrationValidationRunner.getCategoryById("Unknown"), undefined);
  assert.equal(ExecutiveOrchestrationValidationRunner.getRuleById("missing-rule"), undefined);
  assert.deepEqual(ExecutiveOrchestrationValidationRunner.consumedSurfaces, {
    foundation: "executiveOrchestrationFoundation.ts",
    registry: "executiveOrchestrationRegistryPlatform.ts",
    model: "executiveOrchestrationModelPlatform.ts",
  });
  assert.equal(ExecutiveOrchestrationValidationRunner.status.readyForManifest, "ReadyForManifest");
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Scheduler|Queue|Promise|Async|EventBus|Workflow|OrchestratEngine|Reducer|Service/i
        .test(name)
    )),
    true,
  );
});
