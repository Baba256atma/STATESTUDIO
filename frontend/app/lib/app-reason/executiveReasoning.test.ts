import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { ExecutiveContextPlatformFreeze } from "../app-context/executiveContextPlatformFreezeIndex.ts";
import {
  EXECUTIVE_REASONING_CONTRACT_VERSION,
  ExecutiveReasoningFoundation,
  buildExecutiveReasoningManifest,
  createExecutiveReasoningRegistry,
  freezeExecutiveReasoningRegistry,
  getExecutiveReasoningPackage,
  hasExecutiveReasoningPackage,
  listExecutiveReasoningPackages,
  registerExecutiveReasoningPackage,
  unregisterExecutiveReasoningPackage,
  validateExecutiveReasoningFoundation,
  validateExecutiveReasoningManifest,
  validateExecutiveReasoningPackage,
  validateExecutiveReasoningRegistry,
  type ExecutiveReasoningPackage,
} from "./executiveReasoningIndex.ts";

function metadata(description = "Reasoning metadata.") {
  return Object.freeze({
    source: "app-reason-foundation-test",
    description,
    tags: Object.freeze(["test"]),
    contextPlatformVersion: "APP-CTX-4",
    metadataOnly: true as const,
  });
}

function reasoningPackage(packageId = "reasoning.package.primary", contractId = "reasoning.contract.primary"): ExecutiveReasoningPackage {
  return Object.freeze({
    packageId,
    packageName: "Primary Reasoning Package",
    contractVersion: EXECUTIVE_REASONING_CONTRACT_VERSION,
    version: "1.0.0",
    description: "Structural reasoning package metadata.",
    contracts: Object.freeze([
      Object.freeze({
        contractId,
        label: "Primary Reasoning Contract",
        description: "Structural reasoning contract metadata.",
        inputs: Object.freeze([
          Object.freeze({ inputId: "input.context", label: "Context Input", description: "Context input metadata.", required: true, contextSection: "workspace" }),
        ]),
        outputs: Object.freeze([
          Object.freeze({ outputId: "output.metadata", label: "Output Metadata", description: "Output metadata only.", metadataOnly: true }),
        ]),
        evidence: Object.freeze([
          Object.freeze({ evidenceId: "evidence.context", label: "Context Evidence", description: "Evidence metadata.", required: true }),
        ]),
        assumptions: Object.freeze([
          Object.freeze({ assumptionId: "assumption.context", label: "Context Assumption", description: "Assumption metadata.", uncertaintyImpact: "medium" }),
        ]),
        constraints: Object.freeze([
          Object.freeze({ constraintId: "constraint.context", label: "Context Constraint", description: "Constraint metadata.", severity: "warning" }),
        ]),
        confidence: Object.freeze({ required: true, evidenceRequired: true, assumptionRequired: true, explanation: "Confidence metadata required." }),
        trace: Object.freeze({
          required: true,
          inputIds: Object.freeze(["input.context"]),
          outputIds: Object.freeze(["output.metadata"]),
          evidenceIds: Object.freeze(["evidence.context"]),
          assumptionIds: Object.freeze(["assumption.context"]),
          constraintIds: Object.freeze(["constraint.context"]),
        }),
        metadata: metadata("Contract metadata."),
      }),
    ]),
    metadata: metadata("Package metadata."),
  });
}

test("creates reasoning registry", () => {
  const registry = createExecutiveReasoningRegistry();

  assert.equal(registry.registryId, "executive-reasoning-registry");
  assert.equal(registry.packages.length, 0);
  assert.equal(Object.isFrozen(registry), true);
});

test("registers reasoning package", () => {
  const result = registerExecutiveReasoningPackage(createExecutiveReasoningRegistry(), reasoningPackage());

  assert.equal(result.success, true);
  assert.equal(result.registry.packages.length, 1);
});

test("rejects duplicate reasoning package", () => {
  const first = registerExecutiveReasoningPackage(createExecutiveReasoningRegistry(), reasoningPackage()).registry;
  const duplicate = registerExecutiveReasoningPackage(first, reasoningPackage());

  assert.equal(duplicate.success, false);
  assert.equal(duplicate.validation.valid, false);
});

test("looks up reasoning package", () => {
  const registry = registerExecutiveReasoningPackage(createExecutiveReasoningRegistry(), reasoningPackage()).registry;

  assert.equal(getExecutiveReasoningPackage(registry, "reasoning.package.primary")?.package.packageId, "reasoning.package.primary");
});

test("lists reasoning packages", () => {
  const registry = registerExecutiveReasoningPackage(createExecutiveReasoningRegistry(), reasoningPackage()).registry;

  assert.equal(listExecutiveReasoningPackages(registry).length, 1);
});

test("removes reasoning package", () => {
  const registry = registerExecutiveReasoningPackage(createExecutiveReasoningRegistry(), reasoningPackage()).registry;
  const removed = unregisterExecutiveReasoningPackage(registry, "reasoning.package.primary");

  assert.equal(removed.success, true);
  assert.equal(hasExecutiveReasoningPackage(removed.registry, "reasoning.package.primary"), false);
});

test("freezes reasoning registry", () => {
  const registry = freezeExecutiveReasoningRegistry(createExecutiveReasoningRegistry());

  assert.equal(registry.frozen, true);
  assert.equal(registerExecutiveReasoningPackage(registry, reasoningPackage()).success, false);
});

test("generates reasoning manifest", () => {
  const registry = registerExecutiveReasoningPackage(createExecutiveReasoningRegistry(), reasoningPackage()).registry;
  const manifest = buildExecutiveReasoningManifest(registry);

  assert.equal(manifest.platformVersion, "APP-REASON-1");
  assert.equal(manifest.consumedExecutiveContextPlatform, "APP-CTX-4");
  assert.equal(manifest.packageCount, 1);
});

test("validates reasoning manifest", () => {
  const registry = registerExecutiveReasoningPackage(createExecutiveReasoningRegistry(), reasoningPackage()).registry;

  assert.equal(validateExecutiveReasoningManifest(buildExecutiveReasoningManifest(registry)).valid, true);
});

test("validates reasoning foundation", () => {
  assert.equal(validateExecutiveReasoningFoundation().valid, true);
});

test("validates reasoning package", () => {
  assert.equal(validateExecutiveReasoningPackage(reasoningPackage()).valid, true);
});

test("validates reasoning registry", () => {
  const registry = registerExecutiveReasoningPackage(createExecutiveReasoningRegistry(), reasoningPackage()).registry;

  assert.equal(validateExecutiveReasoningRegistry(registry).valid, true);
});

test("exports public reasoning foundation APIs", () => {
  assert.equal(typeof ExecutiveReasoningFoundation.createExecutiveReasoningRegistry, "function");
  assert.equal(typeof ExecutiveReasoningFoundation.buildExecutiveReasoningManifest, "function");
  assert.equal(Object.isFrozen(ExecutiveReasoningFoundation), true);
});

test("keeps Executive Context Platform compatibility", () => {
  assert.equal(ExecutiveContextPlatformFreeze.getExecutiveContextPlatformFreezeState().status, "PASS");
});

test("uses deterministic reasoning manifest fingerprint", () => {
  const registry = registerExecutiveReasoningPackage(createExecutiveReasoningRegistry(), reasoningPackage()).registry;
  const first = buildExecutiveReasoningManifest(registry);
  const second = buildExecutiveReasoningManifest(registry);

  assert.equal(first.fingerprint, second.fingerprint);
});

test("has no direct APP-CTX internals or runtime behavior", () => {
  const sources = [
    readFileSync("app/lib/app-reason/executiveReasoningManifest.ts", "utf8"),
    readFileSync("app/lib/app-reason/executiveReasoningValidation.ts", "utf8"),
  ].join(" ");

  assert.equal(sources.includes("../app-context/executiveContextPlatformFreezeIndex.ts"), true);
  assert.equal(sources.includes("../dom/"), false);
  assert.equal(sources.includes("execute"), false);
  assert.equal(sources.includes("infer"), false);
  assert.equal(sources.includes("score"), false);
  assert.equal(sources.includes("rank"), false);
});
