import assert from "node:assert/strict";
import test from "node:test";

import * as foundationModule from "./dataSourceKnowledgeRegistryFoundation.ts";
import * as registryModule from "./dataSourceKnowledgeRegistryPlatform.ts";
import * as modelModule from "./dataSourceRegistryModelPlatform.ts";
import * as runnerApi from "./dataSourceKnowledgeValidationRunner.ts";
import {
  DataSourceKnowledgeValidationManifest,
  DataSourceKnowledgeValidationPlatform,
  DataSourceKnowledgeValidationResults,
  DataSourceKnowledgeValidationRules,
  DataSourceKnowledgeValidationSummary,
  getDataSourceKnowledgeValidationResultById,
  runDataSourceKnowledgeValidation,
} from "./dataSourceKnowledgeValidationRunner.ts";
import { CANONICAL_VALIDATION_CATEGORIES } from "./dataSourceKnowledgeValidationTypes.ts";

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

const EXPECTED_RUNNER_EXPORTS = [
  "DataSourceKnowledgeValidationPlatform",
  "DataSourceKnowledgeValidationRules",
  "DataSourceKnowledgeValidationResults",
  "DataSourceKnowledgeValidationManifest",
  "DataSourceKnowledgeValidationSummary",
  "runDataSourceKnowledgeValidation",
  "getDataSourceKnowledgeValidationResultById",
];

test("2. validation runner module has exactly seven runtime exports", () => {
  assert.equal(Object.keys(runnerApi).length, 7);
  assert.deepEqual(Object.keys(runnerApi).sort(), [...EXPECTED_RUNNER_EXPORTS].sort());
});

test("3. exactly 40 rules exist", () => {
  assert.equal(DataSourceKnowledgeValidationRules.length, 40);
  assert.equal(DataSourceKnowledgeValidationResults.length, 40);
});

test("4, 5. exactly 10 categories with four rules each", () => {
  assert.equal(CANONICAL_VALIDATION_CATEGORIES.length, 10);
  for (const category of CANONICAL_VALIDATION_CATEGORIES) {
    const count = DataSourceKnowledgeValidationRules.filter((rule) => rule.category === category).length;
    assert.equal(count, 4, `${category} should have 4 rules`);
  }
});

test("6. all rule ids are globally unique", () => {
  const ids = DataSourceKnowledgeValidationRules.map((rule) => rule.validationRuleId);
  assert.equal(new Set(ids).size, ids.length);
});

test("7. all 40 results report PASS", () => {
  for (const result of DataSourceKnowledgeValidationResults) {
    assert.equal(result.status, "PASS", `${result.validationRuleId} should PASS`);
    assert.equal(result.actualResult, "PASS");
    assert.equal(result.expectedResult, "PASS");
  }
});

test("8, 9, 10. foundation, registry, and model categories are validated", () => {
  const byCategory = (category: string): number =>
    DataSourceKnowledgeValidationRules.filter((rule) => rule.category === category).length;
  assert.equal(byCategory("Foundation"), 4);
  assert.equal(byCategory("Registry"), 4);
  assert.equal(byCategory("Model"), 4);
});

test("11. all cross-phase reference rules resolve to PASS", () => {
  const refResults = DataSourceKnowledgeValidationResults.filter(
    (result) => result.category === "ReferenceIntegrity"
  );
  assert.equal(refResults.length, 4);
  assert.ok(refResults.every((result) => result.status === "PASS"));
});

test("12, 13. ownership and dependency rules pass", () => {
  const ownership = DataSourceKnowledgeValidationResults.filter((r) => r.category === "Ownership");
  const dependency = DataSourceKnowledgeValidationResults.filter((r) => r.category === "Dependency");
  assert.equal(ownership.length, 4);
  assert.equal(dependency.length, 4);
  assert.ok(ownership.every((r) => r.status === "PASS"));
  assert.ok(dependency.every((r) => r.status === "PASS"));
});

test("14. public API counts are 7, 8, 9, and 7", () => {
  assert.equal(Object.keys(foundationModule).length, 7);
  assert.equal(Object.keys(registryModule).length, 8);
  assert.equal(Object.keys(modelModule).length, 9);
  assert.equal(Object.keys(runnerApi).length, 7);
});

test("15. all validation objects are deeply frozen", () => {
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeValidationRules));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeValidationResults));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeValidationManifest));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeValidationSummary));
  assert.ok(isDeeplyFrozen(runDataSourceKnowledgeValidation()));
});

test("16. manifest counts match the rule results", () => {
  assert.equal(DataSourceKnowledgeValidationManifest.ruleCount, 40);
  assert.equal(DataSourceKnowledgeValidationManifest.passCount, 40);
  assert.equal(DataSourceKnowledgeValidationManifest.failCount, 0);
  assert.equal(DataSourceKnowledgeValidationManifest.warningCount, 0);
  assert.equal(DataSourceKnowledgeValidationManifest.notApplicableCount, 0);
  assert.equal(DataSourceKnowledgeValidationManifest.duplicateRuleIdStatus, "none");
  for (const category of CANONICAL_VALIDATION_CATEGORIES) {
    assert.equal(DataSourceKnowledgeValidationManifest.rulesByCategory[category], 4);
  }
});

test("17. unknown rule id returns undefined", () => {
  assert.equal(getDataSourceKnowledgeValidationResultById("dsk-val-missing"), undefined);
  assert.equal(DataSourceKnowledgeValidationPlatform.getRuleById("dsk-val-missing"), undefined);
});

test("known lookups resolve and unknown category returns immutable empty", () => {
  const first = DataSourceKnowledgeValidationResults[0];
  assert.equal(getDataSourceKnowledgeValidationResultById(first.validationRuleId), first);
  const foundationRules = DataSourceKnowledgeValidationPlatform.getRulesByCategory("Foundation");
  assert.equal(foundationRules.length, 4);
});

test("18, 19. rule ordering and repeated runner calls are deterministic", () => {
  const firstIds = DataSourceKnowledgeValidationRules.map((rule) => rule.validationRuleId);
  const secondIds = DataSourceKnowledgeValidationRules.map((rule) => rule.validationRuleId);
  assert.deepEqual(firstIds, secondIds);
  assert.equal(runDataSourceKnowledgeValidation(), runDataSourceKnowledgeValidation());
  assert.equal(DataSourceKnowledgeValidationRules[0].category, "Foundation");
  assert.equal(DataSourceKnowledgeValidationRules[39].category, "RuntimeBoundary");
});

test("20. no forbidden runtime behavior is exposed by public APIs", () => {
  const forbidden = /discover|ingest|parse|crawl|synchron|persist|fetch|embedding|extract|async|await/i;
  for (const name of Object.keys(runnerApi)) {
    assert.ok(!forbidden.test(name), `public API ${name} must not imply runtime behavior`);
  }
});

test("21, 22. validation is certified and ready for DKL-2:5", () => {
  assert.equal(DataSourceKnowledgeValidationManifest.validationStatus, "ValidationCertified");
  assert.equal(DataSourceKnowledgeValidationManifest.readiness, "ReadyForManifest");
  assert.equal(DataSourceKnowledgeValidationSummary.readiness, "ReadyForManifest");
  assert.deepEqual(
    [...DataSourceKnowledgeValidationSummary.completion],
    [
      "ValidationComplete",
      "ValidationCertified",
      "MetadataOnly",
      "RuntimeFree",
      "Deterministic",
      "Immutable",
      "ReadyForManifest",
    ]
  );
});
