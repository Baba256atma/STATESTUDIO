import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveReasoningValidationPlatform.ts";
import {
  ExecutiveReasoningValidationManifest,
  ExecutiveReasoningValidationMetadata,
  ExecutiveReasoningValidationPlatform,
  ExecutiveReasoningValidationRegistry,
  ExecutiveReasoningValidationRunner,
  getExecutiveReasoningValidation,
  getExecutiveReasoningValidationStatus,
  getExecutiveReasoningValidationSummary,
} from "./executiveReasoningValidationPlatform.ts";

test("publishes exactly eight approved public exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveReasoningValidationManifest",
    "ExecutiveReasoningValidationMetadata",
    "ExecutiveReasoningValidationPlatform",
    "ExecutiveReasoningValidationRegistry",
    "ExecutiveReasoningValidationRunner",
    "getExecutiveReasoningValidation",
    "getExecutiveReasoningValidationStatus",
    "getExecutiveReasoningValidationSummary",
  ].sort());
  assert.equal(Object.keys(publicApi).length, 8);
});

test("validation covers all ten required domains with immutable rules", () => {
  assert.deepEqual([...ExecutiveReasoningValidationRegistry.domains], [
    "Foundation",
    "Registry",
    "Model",
    "Relationship",
    "Lifecycle",
    "Ownership",
    "Dependency",
    "PublicApi",
    "Metadata",
    "Namespace",
  ]);
  assert.equal(ExecutiveReasoningValidationRegistry.domainCount, 10);
  assert.equal(ExecutiveReasoningValidationRegistry.ruleCount, 30);
  assert.equal(Object.isFrozen(ExecutiveReasoningValidationRegistry.rules), true);
  assert.equal(ExecutiveReasoningValidationRegistry.rules.every(Object.isFrozen), true);
  assert.equal(ExecutiveReasoningValidationRegistry.rules.every(({ status }) => status === "PASS"), true);
  assert.equal(new Set(ExecutiveReasoningValidationRegistry.rules.map(({ id }) => id)).size, 30);
});

test("validation runner aggregates metadata only and reports PASS", () => {
  const result = ExecutiveReasoningValidationRunner.run();
  assert.equal(Object.isFrozen(result), true);
  assert.equal(result.status, "PASS");
  assert.equal(result.passCount, 30);
  assert.equal(result.warningCount, 0);
  assert.equal(result.failCount, 0);
  assert.equal(result.totalRuleCount, 30);
  assert.equal(result.domainCount, 10);
  assert.equal(result.metadataOnly, true);
  assert.deepEqual(ExecutiveReasoningValidationRunner.run(), ExecutiveReasoningValidationRunner.run());
  assert.equal(getExecutiveReasoningValidationStatus(), "PASS");
});

test("platform aggregates registry, manifest, runner, and ownership", () => {
  assert.equal(Object.isFrozen(ExecutiveReasoningValidationPlatform), true);
  assert.equal(ExecutiveReasoningValidationPlatform.registry, ExecutiveReasoningValidationRegistry);
  assert.equal(ExecutiveReasoningValidationPlatform.manifest, ExecutiveReasoningValidationManifest);
  assert.equal(ExecutiveReasoningValidationPlatform.runner, ExecutiveReasoningValidationRunner);
  assert.equal(ExecutiveReasoningValidationPlatform.metadata, ExecutiveReasoningValidationMetadata);
  assert.equal(ExecutiveReasoningValidationMetadata.validationId, "ENG-6:4");
  assert.equal(ExecutiveReasoningValidationMetadata.nextPhase, "ENG-6:5");
  assert.deepEqual([...ExecutiveReasoningValidationManifest.validatedPhases], [
    "ENG-6:1",
    "ENG-6:2",
    "ENG-6:3",
  ]);
  assert.ok(ExecutiveReasoningValidationPlatform.ownership.neverOwns.includes("reasoning"));
  assert.ok(ExecutiveReasoningValidationPlatform.ownership.neverOwns.includes("confidence calculation"));
});

test("helpers are deterministic and summary is manifest-ready", () => {
  assert.equal(getExecutiveReasoningValidation(), ExecutiveReasoningValidationPlatform);
  assert.equal(getExecutiveReasoningValidationSummary(), getExecutiveReasoningValidationSummary());
  assert.equal(Object.isFrozen(getExecutiveReasoningValidationSummary()), true);
  const summary = getExecutiveReasoningValidationSummary();
  assert.equal(summary.status, "PASS");
  assert.equal(summary.manifestReady, true);
  assert.equal(summary.totalRuleCount, 30);
  assert.equal(summary.domainCount, 10);
});

test("relationship and lifecycle rules are represented in the rule inventory", () => {
  const relationshipRules = ExecutiveReasoningValidationRunner.getRulesByDomain("Relationship");
  const lifecycleRules = ExecutiveReasoningValidationRunner.getRulesByDomain("Lifecycle");
  assert.ok(relationshipRules.length >= 2);
  assert.ok(lifecycleRules.length >= 2);
  assert.equal(
    ExecutiveReasoningValidationRunner.getRuleById("eng-6-validation-model-relationship-flow")?.status,
    "PASS",
  );
  assert.equal(ExecutiveReasoningValidationRunner.getRuleById("missing"), undefined);
});

test("public surface exposes no runtime, AI, scoring, or planner APIs", () => {
  assert.equal(Object.keys(publicApi).every((name) => (
    !/Builder|Planner|Scorer|Executor|LLM|OpenAI|Query|Reflect/i.test(name)
  )), true);
});
