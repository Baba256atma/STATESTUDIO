import assert from "node:assert/strict";
import test from "node:test";

import * as foundationApi from "./dataKnowledgeFoundation.ts";
import * as modelApi from "./dataKnowledgeFoundationModel.ts";
import * as registryApi from "./dataKnowledgeFoundationRegistryIndex.ts";
import * as validationApi from "./dataKnowledgeFoundationValidation.ts";
import {
  DataKnowledgeFoundationValidation,
  DataKnowledgeFoundationValidationManifest,
  DataKnowledgeFoundationValidationRules,
  getDataKnowledgeFoundationValidationRuleById,
  getDataKnowledgeFoundationValidationRulesByDomain,
  getDataKnowledgeFoundationValidationSummary,
  runDataKnowledgeFoundationValidation,
} from "./dataKnowledgeFoundationValidation.ts";
import { isDeeplyFrozen } from "./dataKnowledgeFoundationValidationTypes.ts";

const EXPECTED_PUBLIC_API = [
  "DataKnowledgeFoundationValidation",
  "DataKnowledgeFoundationValidationRules",
  "DataKnowledgeFoundationValidationManifest",
  "runDataKnowledgeFoundationValidation",
  "getDataKnowledgeFoundationValidation",
  "getDataKnowledgeFoundationValidationSummary",
  "getDataKnowledgeFoundationValidationRuleById",
  "getDataKnowledgeFoundationValidationRulesByDomain",
];

const DOMAINS = ["foundation", "registry", "model", "ownership", "public-api"];

test("validation platform exists and exports exactly eight public APIs", () => {
  assert.ok(DataKnowledgeFoundationValidation);
  assert.equal(Object.keys(validationApi).length, 8);
  assert.deepEqual(Object.keys(validationApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("exactly five validation domains exist", () => {
  const domainKeys = ["foundation", "registry", "model", "ownership", "publicApi"] as const;
  for (const key of domainKeys) {
    assert.ok(DataKnowledgeFoundationValidation[key]);
  }
  assert.deepEqual(
    [
      DataKnowledgeFoundationValidation.foundation.domain,
      DataKnowledgeFoundationValidation.registry.domain,
      DataKnowledgeFoundationValidation.model.domain,
      DataKnowledgeFoundationValidation.ownership.domain,
      DataKnowledgeFoundationValidation.publicApi.domain,
    ],
    DOMAINS
  );
  assert.equal(DataKnowledgeFoundationValidationManifest.validationDomains.length, 5);
});

test("rule inventory contains at least thirty rules", () => {
  assert.ok(DataKnowledgeFoundationValidationRules.length >= 30);
});

test("every rule ID is unique", () => {
  const ids = DataKnowledgeFoundationValidationRules.map((rule) => rule.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every rule is deeply frozen", () => {
  assert.equal(Object.isFrozen(DataKnowledgeFoundationValidationRules), true);
  for (const rule of DataKnowledgeFoundationValidationRules) {
    assert.equal(isDeeplyFrozen(rule), true);
  }
});

test("every validation domain is deeply frozen", () => {
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationValidation.foundation), true);
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationValidation.registry), true);
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationValidation.model), true);
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationValidation.ownership), true);
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationValidation.publicApi), true);
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationValidation), true);
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationValidationManifest), true);
});

test("foundation validations pass", () => {
  assert.equal(DataKnowledgeFoundationValidation.foundation.passed, true);
  assert.equal(DataKnowledgeFoundationValidation.foundation.rules.every((r) => r.result === "PASS"), true);
});

test("registry validations pass", () => {
  assert.equal(DataKnowledgeFoundationValidation.registry.passed, true);
  assert.equal(DataKnowledgeFoundationValidation.registry.rules.every((r) => r.result === "PASS"), true);
});

test("model validations pass", () => {
  assert.equal(DataKnowledgeFoundationValidation.model.passed, true);
  assert.equal(DataKnowledgeFoundationValidation.model.rules.every((r) => r.result === "PASS"), true);
});

test("ownership declarations do not overlap", () => {
  const overlapRule = getDataKnowledgeFoundationValidationRuleById("DKL-VAL-O-08");
  assert.ok(overlapRule);
  assert.equal(overlapRule?.result, "PASS");
  assert.equal(DataKnowledgeFoundationValidation.ownership.passed, true);
});

test("dependency declarations match Foundation", () => {
  assert.deepEqual(foundationApi.DataKnowledgeFoundationDependencies.allowed, [
    "CORE",
    "CORE-TEN",
    "BUS",
    "OPS",
    "NEA",
  ]);
  assert.deepEqual(foundationApi.DataKnowledgeFoundationDependencies.future, ["EXECUTIVE-ENGINE"]);
  const allowedRule = getDataKnowledgeFoundationValidationRuleById("DKL-VAL-O-05");
  const forbiddenRule = getDataKnowledgeFoundationValidationRuleById("DKL-VAL-O-07");
  assert.equal(allowedRule?.result, "PASS");
  assert.equal(forbiddenRule?.result, "PASS");
});

test("public API counts are exactly 7, 8, and 8", () => {
  assert.equal(Object.keys(foundationApi).length, 7);
  assert.equal(Object.keys(registryApi).length, 8);
  assert.equal(Object.keys(modelApi).length, 8);
});

test("no duplicate public API names exist within each phase", () => {
  for (const phase of [foundationApi, registryApi, modelApi]) {
    const keys = Object.keys(phase);
    assert.equal(new Set(keys).size, keys.length);
  }
});

test("manifest rule count matches the actual registry", () => {
  assert.equal(DataKnowledgeFoundationValidationManifest.ruleCount, DataKnowledgeFoundationValidationRules.length);
  assert.equal(DataKnowledgeFoundationValidationManifest.ruleIds.length, DataKnowledgeFoundationValidationRules.length);
  assert.deepEqual(
    DataKnowledgeFoundationValidationManifest.ruleIds,
    DataKnowledgeFoundationValidationRules.map((rule) => rule.id)
  );
  const severityTotal =
    DataKnowledgeFoundationValidationManifest.severityInventory.ERROR +
    DataKnowledgeFoundationValidationManifest.severityInventory.WARNING +
    DataKnowledgeFoundationValidationManifest.severityInventory.INFO;
  assert.equal(severityTotal, DataKnowledgeFoundationValidationRules.length);
});

test("runner returns all rules passed", () => {
  const result = runDataKnowledgeFoundationValidation();
  assert.equal(result.totalRules, DataKnowledgeFoundationValidationRules.length);
  assert.equal(result.passedRules, DataKnowledgeFoundationValidationRules.length);
  assert.equal(result.failedRules, 0);
  assert.equal(result.errorCount, 0);
  assert.equal(result.warningCount, 0);
});

test("runner status is VALIDATED", () => {
  assert.equal(runDataKnowledgeFoundationValidation().status, "VALIDATED");
  assert.equal(DataKnowledgeFoundationValidationManifest.validationStatus, "VALIDATED");
});

test("runner readiness is ReadyForManifest", () => {
  assert.equal(runDataKnowledgeFoundationValidation().readiness, "ReadyForManifest");
  assert.equal(DataKnowledgeFoundationValidationManifest.readiness, "ReadyForManifest");
});

test("runner result is frozen and deterministic", () => {
  assert.equal(Object.isFrozen(runDataKnowledgeFoundationValidation()), true);
  assert.equal(runDataKnowledgeFoundationValidation(), runDataKnowledgeFoundationValidation());
});

test("known rule lookup succeeds", () => {
  const rule = getDataKnowledgeFoundationValidationRuleById("DKL-VAL-F-01");
  assert.ok(rule);
  assert.equal(rule?.domain, "foundation");
  assert.equal(rule?.sourcePhase, "DKL-1:1");
});

test("unknown rule lookup returns undefined", () => {
  assert.equal(getDataKnowledgeFoundationValidationRuleById("DKL-VAL-UNKNOWN"), undefined);
  assert.equal(getDataKnowledgeFoundationValidationRuleById(""), undefined);
});

test("domain filtering is deterministic and preserves canonical order", () => {
  const foundationRules = getDataKnowledgeFoundationValidationRulesByDomain("foundation");
  assert.ok(foundationRules.length >= 7);
  assert.equal(foundationRules.every((rule) => rule.domain === "foundation"), true);
  const canonical = DataKnowledgeFoundationValidationRules.filter((rule) => rule.domain === "foundation").map(
    (rule) => rule.id
  );
  assert.deepEqual(foundationRules.map((rule) => rule.id), canonical);
  assert.deepEqual(
    getDataKnowledgeFoundationValidationRulesByDomain("registry").map((rule) => rule.id),
    getDataKnowledgeFoundationValidationRulesByDomain("registry").map((rule) => rule.id)
  );
});

test("unknown domain returns a frozen empty array", () => {
  const result = getDataKnowledgeFoundationValidationRulesByDomain("nonexistent-domain");
  assert.equal(result.length, 0);
  assert.equal(Object.isFrozen(result), true);
});

test("domain filtering never mutates the master registry", () => {
  const before = DataKnowledgeFoundationValidationRules.length;
  getDataKnowledgeFoundationValidationRulesByDomain("foundation");
  getDataKnowledgeFoundationValidationRulesByDomain("model");
  assert.equal(DataKnowledgeFoundationValidationRules.length, before);
});

test("repeated summary calls return equivalent results", () => {
  const first = getDataKnowledgeFoundationValidationSummary();
  const second = getDataKnowledgeFoundationValidationSummary();
  assert.equal(Object.isFrozen(first), true);
  assert.deepEqual(first, second);
  assert.equal(first.validationId, "DKL-1:4");
  assert.equal(first.domainCount, 5);
  assert.equal(first.ruleCount, DataKnowledgeFoundationValidationRules.length);
  assert.equal(first.status, "VALIDATED");
  assert.equal(first.readiness, "ReadyForManifest");
});

test("every rule passes across the whole inventory", () => {
  assert.equal(DataKnowledgeFoundationValidationRules.every((rule) => rule.result === "PASS"), true);
});

test("manifest declares complete compatibility and source phases", () => {
  assert.deepEqual(DataKnowledgeFoundationValidationManifest.sourcePhases, ["DKL-1:1", "DKL-1:2", "DKL-1:3"]);
  const compatibility = DataKnowledgeFoundationValidationManifest.compatibility;
  assert.equal(compatibility.foundationCompatible, true);
  assert.equal(compatibility.registryCompatible, true);
  assert.equal(compatibility.modelCompatible, true);
  assert.equal(compatibility.metadataOnly, true);
  assert.equal(compatibility.runtimeFree, true);
  assert.equal(compatibility.deterministic, true);
  assert.equal(compatibility.ownershipProtected, true);
  assert.equal(compatibility.publicApiStable, true);
});

test("earlier phase metadata remains unchanged", () => {
  assert.equal(foundationApi.DataKnowledgeFoundationIdentity.version, "1.0.0");
  assert.equal(foundationApi.DataKnowledgeFoundationIdentity.phaseId, "DKL-1:1");
  assert.equal(foundationApi.DataKnowledgeFoundationContracts.contracts.length, 7);
  assert.equal(registryApi.DataKnowledgeFoundationRegistryManifest.registryId, "DKL-1:2");
  assert.equal(registryApi.DataKnowledgeFoundationPublicApiRegistry.length, 7);
  assert.equal(modelApi.DataKnowledgeFoundationModelManifest.modelId, "DKL-1:3");
  assert.equal(modelApi.BusinessObjectModel.types.length, 8);
});

test("no runtime or infrastructure behavior is exposed", () => {
  const runtimeLike = Object.keys(validationApi).some((key) =>
    /parse|store|query|fetch|render|ingest|connect|infer|scan|network|database|filesystem/i.test(key)
  );
  assert.equal(runtimeLike, false);

  const functionExports = Object.entries(validationApi).filter(([, value]) => typeof value === "function");
  assert.deepEqual(
    functionExports.map(([key]) => key).sort(),
    [
      "getDataKnowledgeFoundationValidation",
      "getDataKnowledgeFoundationValidationRuleById",
      "getDataKnowledgeFoundationValidationRulesByDomain",
      "getDataKnowledgeFoundationValidationSummary",
      "runDataKnowledgeFoundationValidation",
    ]
  );
});
