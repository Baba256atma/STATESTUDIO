import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import * as publicApi from "./executiveDecisionValidationPlatform.ts";
import {
  ExecutiveDecisionValidationCategories,
  ExecutiveDecisionValidationManifest,
  ExecutiveDecisionValidationMetadata,
  ExecutiveDecisionValidationPlatform,
  ExecutiveDecisionValidationRegistry,
  ExecutiveDecisionValidationSeverities,
  getExecutiveDecisionValidationMetadata,
  getExecutiveDecisionValidationPlatform,
  getExecutiveDecisionValidationRuleById,
  getExecutiveDecisionValidationSummary,
} from "./executiveDecisionValidationPlatform.ts";

const requiredFiles = Object.freeze([
  "executiveDecisionValidationTypes.ts",
  "executiveDecisionFoundationValidation.ts",
  "executiveDecisionRegistryValidation.ts",
  "executiveDecisionModelValidation.ts",
  "executiveDecisionOwnershipValidation.ts",
  "executiveDecisionValidationManifest.ts",
  "executiveDecisionValidationPlatform.ts",
  "executiveDecisionValidationPlatform.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveDecisionValidationPlatform",
  "ExecutiveDecisionValidationManifest",
  "ExecutiveDecisionValidationRegistry",
  "ExecutiveDecisionValidationMetadata",
  "ExecutiveDecisionValidationCategories",
  "ExecutiveDecisionValidationSeverities",
] as const);

test("exactly eight required ENG-7:4 files are represented", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles) {
    assert.equal(readFileSync(join(dir, file), "utf8").length > 0, true);
  }
  assert.equal(requiredFiles.length, 8);
});

test("publishes exactly six approved public exports", () => {
  for (const name of approvedExports) {
    assert.ok(Object.hasOwn(publicApi, name));
  }
  assert.equal(approvedExports.length, 6);
});

test("categories, severities, and thirty-two unique rules are registered", () => {
  assert.deepEqual([...ExecutiveDecisionValidationCategories], [
    "Foundation",
    "Registry",
    "Model",
    "Ownership",
    "Dependency",
    "Public API",
    "Immutability",
    "Metadata Compliance",
  ]);
  assert.deepEqual([...ExecutiveDecisionValidationSeverities], [
    "Info",
    "Warning",
    "Error",
    "Critical",
  ]);
  assert.equal(ExecutiveDecisionValidationRegistry.ruleCount, 32);
  assert.equal(ExecutiveDecisionValidationRegistry.rules.length, 32);
  assert.equal(Object.isFrozen(ExecutiveDecisionValidationRegistry.rules), true);
  assert.equal(ExecutiveDecisionValidationRegistry.rules.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveDecisionValidationRegistry.rules.map(({ id }) => id)).size, 32);
  for (const category of ExecutiveDecisionValidationCategories) {
    assert.equal(
      ExecutiveDecisionValidationRegistry.rules.filter((rule) => rule.category === category).length,
      4,
      `${category} should have 4 rules`,
    );
  }
  assert.equal(ExecutiveDecisionValidationRegistry.rules.every(({ status }) => status === "PASS"), true);
});

test("manifest aggregates foundation, registry, model, and ownership validation", () => {
  assert.equal(Object.isFrozen(ExecutiveDecisionValidationManifest), true);
  assert.equal(ExecutiveDecisionValidationManifest.foundation.rules.length, 8);
  assert.equal(ExecutiveDecisionValidationManifest.registry.rules.length, 8);
  assert.equal(ExecutiveDecisionValidationManifest.model.rules.length, 8);
  assert.equal(ExecutiveDecisionValidationManifest.ownership.rules.length, 8);
  assert.equal(ExecutiveDecisionValidationManifest.inventory.totalRuleCount, 32);
  assert.ok(ExecutiveDecisionValidationManifest.ownershipBoundary.neverDuplicates.includes("ENG-6 reasoning validation"));
  assert.ok(ExecutiveDecisionValidationManifest.ownershipBoundary.neverValidates.includes("confidence calculation"));
});

test("platform metadata and summary report ReadyForDecisionManifest", () => {
  assert.equal(Object.isFrozen(ExecutiveDecisionValidationPlatform), true);
  assert.equal(ExecutiveDecisionValidationMetadata.id, "ENG-7:4");
  assert.equal(ExecutiveDecisionValidationMetadata.namespace, "Nexora.Engine.ExecutiveDecision.Validation");
  assert.equal(ExecutiveDecisionValidationMetadata.previousPhase, "ENG-7:3");
  assert.equal(ExecutiveDecisionValidationMetadata.nextPhase, "ENG-7:5");
  const summary = getExecutiveDecisionValidationSummary();
  assert.equal(summary.totalRules, 32);
  assert.equal(summary.passedRules, 32);
  assert.equal(summary.warningCount, 0);
  assert.equal(summary.failureCount, 0);
  assert.equal(summary.validationStatus, "ValidationCertified");
  assert.equal(summary.readiness, "ReadyForDecisionManifest");
  assert.equal(ExecutiveDecisionValidationPlatform.guarantees.readiness, "ReadyForDecisionManifest");
});

test("helpers are deterministic and unknown rule ids return undefined", () => {
  assert.equal(getExecutiveDecisionValidationPlatform(), ExecutiveDecisionValidationPlatform);
  assert.equal(getExecutiveDecisionValidationMetadata(), ExecutiveDecisionValidationMetadata);
  assert.equal(getExecutiveDecisionValidationSummary(), getExecutiveDecisionValidationSummary());
  assert.equal(
    getExecutiveDecisionValidationRuleById("eng-7-validation-foundation-immutable")?.name,
    "Immutable Foundation",
  );
  assert.equal(getExecutiveDecisionValidationRuleById("missing"), undefined);
});

test("only approved public dependencies are consumed", () => {
  assert.deepEqual(ExecutiveDecisionValidationPlatform.consumedSurfaces, {
    foundation: "executiveDecisionPublicApi.ts",
    registry: "executiveDecisionRegistryPlatform.ts",
    model: "executiveDecisionModelPlatform.ts",
  });
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of [
    "executiveDecisionFoundationValidation.ts",
    "executiveDecisionRegistryValidation.ts",
    "executiveDecisionModelValidation.ts",
    "executiveDecisionOwnershipValidation.ts",
    "executiveDecisionValidationPlatform.ts",
  ]) {
    const source = readFileSync(join(dir, file), "utf8");
    assert.equal(/from ["'].*\/(bus|ops|scene|eve|ui|persistence|database)/i.test(source), false);
    assert.equal(source.includes("executiveDecisionFoundation.ts\""), false);
    assert.equal(source.includes("executiveDecisionDomainRegistry.ts"), false);
    assert.equal(source.includes("executiveDecisionCoreModel.ts"), false);
  }
});

test("no runtime, scoring, reasoning, Advisor, Scene, or persistence APIs", () => {
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Builder|Scorer|Selector|Ranker|Executor|LLM|OpenAI|Query|Reflect|Runner|Calculator/i.test(name)
    )),
    true,
  );
});
