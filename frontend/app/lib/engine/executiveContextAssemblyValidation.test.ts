import assert from "node:assert/strict";
import test from "node:test";
import { ExecutiveContextModel as EngineExecutiveContextModel } from "./engineModelIndex.ts";
import { ExecutiveContextModel as AssemblyExecutiveContextModel } from "./executiveContextAssemblyModel.ts";
import * as publicApi from "./executiveContextAssemblyValidation.ts";
import {
  ExecutiveContextAssemblyValidation,
  ExecutiveContextFoundationValidation,
  ExecutiveContextModelValidation,
  ExecutiveContextOwnershipValidation,
  ExecutiveContextPublicApiValidation,
  ExecutiveContextRegistryValidation,
  getExecutiveContextAssemblyValidation,
  getExecutiveContextAssemblyValidationGate,
  getExecutiveContextAssemblyValidationRules,
  getExecutiveContextAssemblyValidationSummary,
  getExecutiveContextFoundationValidation,
  getExecutiveContextModelValidation,
  getExecutiveContextOwnershipValidation,
  getExecutiveContextPublicApiValidation,
  getExecutiveContextRegistryValidation,
} from "./executiveContextAssemblyValidation.ts";

const groups = [
  ExecutiveContextFoundationValidation,
  ExecutiveContextRegistryValidation,
  ExecutiveContextModelValidation,
  ExecutiveContextOwnershipValidation,
  ExecutiveContextPublicApiValidation,
] as const;

test("exactly five validation groups exist and aggregate is frozen", () => {
  assert.equal(groups.length, 5);
  assert.deepEqual(ExecutiveContextAssemblyValidation.validationGroups, groups);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyValidation), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyValidation.validationGroups), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyValidation.validationRules), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyValidation.validationGates), true);
  assert.equal(Object.values(ExecutiveContextAssemblyValidation).filter((value) => typeof value === "object").every(Object.isFrozen), true);
});

test("validation rules have unique IDs and all canonical rules pass", () => {
  const rules = ExecutiveContextAssemblyValidation.validationRules;
  assert.equal(rules.length >= 35 && rules.length <= 45, true);
  assert.equal(new Set(rules.map(({ id }) => id)).size, rules.length);
  assert.equal(rules.every(({ status, result, runtimeFree }) => status === "Pass" && result.status === "Pass" && runtimeFree === true), true);
  assert.deepEqual(groups.map(({ rules: entries }) => entries.length), [8, 9, 10, 8, 8]);
  assert.equal(rules.length, 43);
});

test("all gates pass and metadata counts match", () => {
  const { validationGates, metadata, summary } = ExecutiveContextAssemblyValidation;
  assert.equal(validationGates.length, 12);
  assert.equal(validationGates.every(({ status }) => status === "Pass"), true);
  assert.equal(metadata.groupCount, 5);
  assert.equal(metadata.ruleCount, summary.ruleCount);
  assert.equal(metadata.gateCount, summary.gateCount);
  assert.equal(metadata.ruleCount, ExecutiveContextAssemblyValidation.validationRules.length);
  assert.equal(metadata.gateCount, validationGates.length);
  assert.equal(summary.passedRuleCount, summary.ruleCount);
  assert.equal(summary.passedGateCount, summary.gateCount);
  assert.equal(metadata.status.readyForManifest, "ReadyForManifest");
  assert.equal(summary.manifestReady, true);
});

test("helpers return deterministic references and unknown IDs return undefined", () => {
  assert.equal(getExecutiveContextAssemblyValidation(), ExecutiveContextAssemblyValidation);
  assert.equal(getExecutiveContextFoundationValidation(), ExecutiveContextFoundationValidation);
  assert.equal(getExecutiveContextRegistryValidation(), ExecutiveContextRegistryValidation);
  assert.equal(getExecutiveContextModelValidation(), ExecutiveContextModelValidation);
  assert.equal(getExecutiveContextOwnershipValidation(), ExecutiveContextOwnershipValidation);
  assert.equal(getExecutiveContextPublicApiValidation(), ExecutiveContextPublicApiValidation);
  assert.equal(getExecutiveContextAssemblyValidationRules(), ExecutiveContextAssemblyValidation.validationRules);
  assert.equal(getExecutiveContextAssemblyValidationRules("eng-4-validation-foundation-contracts")?.id, "eng-4-validation-foundation-contracts");
  assert.equal(getExecutiveContextAssemblyValidationRules("unknown-rule-id"), undefined);
  assert.equal(getExecutiveContextAssemblyValidationGate("eng-4-validation-gate-ready-for-manifest")?.name, "Ready for Manifest");
  assert.equal(getExecutiveContextAssemblyValidationGate("unknown-gate-id"), undefined);
  assert.equal(getExecutiveContextAssemblyValidationSummary(), ExecutiveContextAssemblyValidation.summary);
  assert.equal(Object.isFrozen(getExecutiveContextAssemblyValidationSummary()), true);
});

test("dependencies stay public-index only with no future ENG-4 phases", () => {
  assert.deepEqual(ExecutiveContextAssemblyValidation.dependencies.map(({ phase }) => phase), [
    "ENG-1", "ENG-2", "ENG-3", "ENG-4:1", "ENG-4:2", "ENG-4:3",
  ]);
  assert.equal(ExecutiveContextAssemblyValidation.dependencies.every(({ consumption }) => consumption === "PublicIndexOnly"), true);
  assert.equal(ExecutiveContextAssemblyValidation.dependencies.every(({ phase }) => !String(phase).startsWith("ENG-4:5")), true);
  assert.equal(ExecutiveContextRegistryValidation.rules.some(({ id }) => id === "eng-4-validation-registry-no-future"), true);
});

test("ENG-1 compatibility remains intact and ENG-4 owns specialized model namespace", () => {
  assert.equal(EngineExecutiveContextModel.id, "executive-context");
  assert.equal(EngineExecutiveContextModel.sourcePhase, "ENG-1:3");
  assert.equal(AssemblyExecutiveContextModel.id, "eng-4-model-executive-context");
  assert.equal(AssemblyExecutiveContextModel.phase, "ENG-4:3");
  assert.notEqual(AssemblyExecutiveContextModel.id, EngineExecutiveContextModel.id);
  const ownership = ExecutiveContextOwnershipValidation.rules.map(({ id }) => id);
  assert.equal(ownership.includes("eng-4-validation-ownership-eng-1-compatibility"), true);
  assert.equal(ownership.includes("eng-4-validation-ownership-anti-duplication"), true);
});

test("no internal ENG-1 model import is exposed and no runtime behavior is introduced", () => {
  assert.equal("engineModelRegistry" in publicApi, false);
  assert.equal(Object.keys(publicApi).every((name) => !/Builder|Runner|Engine|Query|Planner|Reflection/i.test(name)), true);
  assert.equal(ExecutiveContextAssemblyValidation.validationRules.every(({ runtimeFree, metadataOnly }) => runtimeFree && metadataOnly), true);
  assert.equal(ExecutiveContextAssemblyValidation.metadataOnly, true);
});

test("public validation surface exposes approved metadata APIs", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveContextAssemblyValidation", "ExecutiveContextFoundationValidation",
    "ExecutiveContextModelValidation", "ExecutiveContextOwnershipValidation",
    "ExecutiveContextPublicApiValidation", "ExecutiveContextRegistryValidation",
    "getExecutiveContextAssemblyValidation", "getExecutiveContextAssemblyValidationGate",
    "getExecutiveContextAssemblyValidationRules", "getExecutiveContextAssemblyValidationSummary",
    "getExecutiveContextFoundationValidation", "getExecutiveContextModelValidation",
    "getExecutiveContextOwnershipValidation", "getExecutiveContextPublicApiValidation",
    "getExecutiveContextRegistryValidation",
  ].sort());
});
