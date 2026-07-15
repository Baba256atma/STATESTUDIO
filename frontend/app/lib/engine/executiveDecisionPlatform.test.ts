import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import * as publicApi from "./executiveDecisionPlatform.ts";
import {
  ExecutiveDecisionPlatform,
  ExecutiveDecisionPlatformArchitecture,
  ExecutiveDecisionPlatformComponentRegistry,
  ExecutiveDecisionPlatformMetadata,
  ExecutiveDecisionPlatformReadiness,
  ExecutiveDecisionPlatformSummary,
  getExecutiveDecisionPlatform,
  getExecutiveDecisionPlatformArchitecture,
  getExecutiveDecisionPlatformComponentById,
  getExecutiveDecisionPlatformComponents,
  getExecutiveDecisionPlatformConsumers,
  getExecutiveDecisionPlatformInventory,
  getExecutiveDecisionPlatformMetadata,
  getExecutiveDecisionPlatformReadiness,
  getExecutiveDecisionPlatformSummary,
} from "./executiveDecisionPlatform.ts";
import { ExecutiveDecisionFoundation } from "./executiveDecisionPublicApi.ts";
import { ExecutiveDecisionRegistryPlatform } from "./executiveDecisionRegistryPlatform.ts";
import { ExecutiveDecisionModelPlatform } from "./executiveDecisionModelPlatform.ts";
import { ExecutiveDecisionValidationPlatform } from "./executiveDecisionValidationPlatform.ts";
import { ExecutiveDecisionManifestPlatform } from "./executiveDecisionManifestPlatform.ts";

const requiredFiles = Object.freeze([
  "executiveDecisionPlatformTypes.ts",
  "executiveDecisionPlatformComponentRegistry.ts",
  "executiveDecisionPlatformArchitecture.ts",
  "executiveDecisionPlatformReadiness.ts",
  "executiveDecisionPlatformMetadata.ts",
  "executiveDecisionPlatform.ts",
  "executiveDecisionPlatform.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveDecisionPlatform",
  "ExecutiveDecisionPlatformMetadata",
  "ExecutiveDecisionPlatformComponentRegistry",
  "ExecutiveDecisionPlatformArchitecture",
  "ExecutiveDecisionPlatformReadiness",
  "ExecutiveDecisionPlatformSummary",
] as const);

test("exactly seven required ENG-7:6 files are represented", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles) {
    assert.equal(readFileSync(join(dir, file), "utf8").length > 0, true);
  }
  assert.equal(requiredFiles.length, 7);
});

test("publishes exactly six approved public exports", () => {
  for (const name of approvedExports) {
    assert.ok(Object.hasOwn(publicApi, name));
  }
  assert.equal(approvedExports.length, 6);
});

test("aggregates five approved phase surfaces in forward-only order", () => {
  assert.deepEqual(
    Object.keys(ExecutiveDecisionPlatform).slice(0, 5),
    ["foundation", "registry", "model", "validation", "manifest"],
  );
  assert.equal(ExecutiveDecisionPlatform.foundation, ExecutiveDecisionFoundation);
  assert.equal(ExecutiveDecisionPlatform.registry, ExecutiveDecisionRegistryPlatform);
  assert.equal(ExecutiveDecisionPlatform.model, ExecutiveDecisionModelPlatform);
  assert.equal(ExecutiveDecisionPlatform.validation, ExecutiveDecisionValidationPlatform);
  assert.equal(ExecutiveDecisionPlatform.manifest, ExecutiveDecisionManifestPlatform);
  assert.equal(Object.isFrozen(ExecutiveDecisionPlatform), true);
});

test("component registry has five unique forward-only components", () => {
  assert.equal(ExecutiveDecisionPlatformComponentRegistry.length, 5);
  assert.deepEqual(ExecutiveDecisionPlatformComponentRegistry.map(({ id }) => id), [
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
  ]);
  assert.deepEqual(ExecutiveDecisionPlatformComponentRegistry.map(({ owningPhase }) => owningPhase), [
    "ENG-7:1",
    "ENG-7:2",
    "ENG-7:3",
    "ENG-7:4",
    "ENG-7:5",
  ]);
  assert.deepEqual(ExecutiveDecisionPlatformComponentRegistry.map(({ fileCount }) => fileCount), [
    7, 8, 9, 8, 8,
  ]);
  assert.deepEqual(
    ExecutiveDecisionPlatformComponentRegistry.map(({ publicExportCount }) => publicExportCount),
    [6, 7, 8, 6, 7],
  );
  assert.equal(new Set(ExecutiveDecisionPlatformComponentRegistry.map(({ id }) => id)).size, 5);
  assert.equal(ExecutiveDecisionPlatformComponentRegistry.every(Object.isFrozen), true);
  assert.deepEqual([...ExecutiveDecisionPlatformArchitecture.architectureChain], [
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
  ]);
  assert.equal(ExecutiveDecisionPlatformArchitecture.dependencyDirection, "ForwardOnly");
});

test("inventory and totals are exact declared metadata", () => {
  const inventory = getExecutiveDecisionPlatformInventory();
  assert.equal(inventory.phaseCount, 5);
  assert.equal(inventory.componentCount, 5);
  assert.equal(inventory.representedFileCount, 40);
  assert.equal(inventory.approvedPublicExportCount, 34);
  assert.equal(inventory.canonicalModelCount, 10);
  assert.equal(inventory.validationRuleCount, 32);
  assert.equal(inventory.passingValidationRuleCount, 32);
  assert.equal(inventory.failingValidationRuleCount, 0);
  assert.equal(inventory.compatibilityDeclarationCount, 8);
  assert.equal(inventory.architecturalGuaranteeCount, 12);
  assert.equal(ExecutiveDecisionPlatformMetadata.componentCount, 5);
  assert.equal(ExecutiveDecisionPlatformMetadata.canonicalModelCount, 10);
  assert.equal(ExecutiveDecisionPlatformMetadata.validationRuleCount, 32);
});

test("readiness reports certification-ready with zero blockers", () => {
  assert.equal(Object.isFrozen(ExecutiveDecisionPlatformReadiness), true);
  assert.equal(ExecutiveDecisionPlatformReadiness.foundationReady, true);
  assert.equal(ExecutiveDecisionPlatformReadiness.registryReady, true);
  assert.equal(ExecutiveDecisionPlatformReadiness.modelReady, true);
  assert.equal(ExecutiveDecisionPlatformReadiness.validationReady, true);
  assert.equal(ExecutiveDecisionPlatformReadiness.manifestReady, true);
  assert.equal(ExecutiveDecisionPlatformReadiness.platformAssembled, true);
  assert.equal(ExecutiveDecisionPlatformReadiness.validationCertified, true);
  assert.equal(ExecutiveDecisionPlatformReadiness.manifestComplete, true);
  assert.equal(ExecutiveDecisionPlatformReadiness.readyForCertification, true);
  assert.equal(ExecutiveDecisionPlatformReadiness.readyForFreeze, false);
  assert.equal(ExecutiveDecisionPlatformReadiness.readyForPublicIndex, false);
  assert.equal(ExecutiveDecisionPlatformReadiness.released, false);
  assert.equal(ExecutiveDecisionPlatformReadiness.architecturalBlockers, 0);
  assert.equal(ExecutiveDecisionPlatformReadiness.validationFailures, 0);
  assert.equal(ExecutiveDecisionPlatformReadiness.ownershipConflicts, 0);
  assert.equal(ExecutiveDecisionPlatformReadiness.dependencyViolations, 0);
  assert.equal(ExecutiveDecisionPlatformReadiness.internalApiLeaks, 0);
  assert.equal(ExecutiveDecisionPlatformReadiness.runtimeBehaviorEntries, 0);
});

test("consumers and helpers are deterministic", () => {
  const consumers = getExecutiveDecisionPlatformConsumers();
  assert.equal(consumers.length, 5);
  assert.deepEqual(consumers.map(({ name }) => name), [
    "ENG-7:7 Certification",
    "ENG-7:8 Freeze",
    "ENG-7:9 Public Index",
    "ENG-8 Executive Orchestration",
    "Advisor",
  ]);
  assert.equal(consumers.every(({ runtimeIntegration }) => runtimeIntegration === "Prohibited"), true);
  assert.equal(getExecutiveDecisionPlatform(), ExecutiveDecisionPlatform);
  assert.equal(getExecutiveDecisionPlatformMetadata(), ExecutiveDecisionPlatformMetadata);
  assert.equal(getExecutiveDecisionPlatformComponents(), ExecutiveDecisionPlatformComponentRegistry);
  assert.equal(getExecutiveDecisionPlatformArchitecture(), ExecutiveDecisionPlatformArchitecture);
  assert.equal(getExecutiveDecisionPlatformReadiness(), ExecutiveDecisionPlatformReadiness);
  assert.equal(getExecutiveDecisionPlatformComponentById("foundation")?.owningPhase, "ENG-7:1");
  assert.equal(getExecutiveDecisionPlatformComponentById("missing"), undefined);
  assert.equal(getExecutiveDecisionPlatformSummary(), ExecutiveDecisionPlatformSummary);
  assert.equal(ExecutiveDecisionPlatformSummary.readiness, "ReadyForDecisionCertification");
  assert.equal(ExecutiveDecisionPlatform.guarantees.readiness, "ReadyForDecisionCertification");
});

test("only approved public dependencies are imported with no runtime surfaces", () => {
  assert.deepEqual(ExecutiveDecisionPlatform.consumedSurfaces, {
    foundation: "executiveDecisionPublicApi.ts",
    registry: "executiveDecisionRegistryPlatform.ts",
    model: "executiveDecisionModelPlatform.ts",
    validation: "executiveDecisionValidationPlatform.ts",
    manifest: "executiveDecisionManifestPlatform.ts",
  });
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles.filter((name) => !name.endsWith(".test.ts") && name !== "executiveDecisionPlatformTypes.ts")) {
    const source = readFileSync(join(dir, file), "utf8");
    assert.equal(source.includes("executiveDecisionFoundation.ts"), false);
    assert.equal(source.includes("executiveDecisionDomainRegistry.ts"), false);
    assert.equal(source.includes("executiveDecisionCoreModel.ts"), false);
    assert.equal(source.includes("executiveDecisionFoundationValidation.ts"), false);
    assert.equal(source.includes("executiveDecisionPhaseManifest.ts"), false);
    assert.equal(/from ["'].*\/(bus|ops|scene|eve|ui|persistence|database)/i.test(source), false);
    assert.equal(/readFileSync|readdirSync|import\(/i.test(source), false);
  }
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Builder|Scorer|Selector|Ranker|Executor|LLM|OpenAI|Query|Reflect|Runner|Calculator|Processor/i.test(name)
    )),
    true,
  );
});
