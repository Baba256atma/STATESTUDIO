import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import * as publicApi from "./executiveDecisionManifestPlatform.ts";
import {
  ExecutiveDecisionCompatibilityManifest,
  ExecutiveDecisionDependencyOwnershipManifest,
  ExecutiveDecisionGuaranteeManifest,
  ExecutiveDecisionInventoryManifest,
  ExecutiveDecisionManifestPlatform,
  ExecutiveDecisionPhaseManifest,
  ExecutiveDecisionPublicSurfaceManifest,
  getExecutiveDecisionCompatibilityManifest,
  getExecutiveDecisionDependencyManifest,
  getExecutiveDecisionGuaranteeManifest,
  getExecutiveDecisionInventoryManifest,
  getExecutiveDecisionManifestMetadata,
  getExecutiveDecisionManifestPlatform,
  getExecutiveDecisionManifestSectionById,
  getExecutiveDecisionManifestSections,
  getExecutiveDecisionManifestSummary,
  getExecutiveDecisionOwnershipManifest,
  getExecutiveDecisionPhaseManifest,
  getExecutiveDecisionPublicSurfaceManifest,
} from "./executiveDecisionManifestPlatform.ts";
import { ExecutiveDecisionFoundation } from "./executiveDecisionPublicApi.ts";
import { ExecutiveDecisionRegistryPlatform } from "./executiveDecisionRegistryPlatform.ts";
import { ExecutiveDecisionModelPlatform } from "./executiveDecisionModelPlatform.ts";
import { ExecutiveDecisionValidationPlatform } from "./executiveDecisionValidationPlatform.ts";

const requiredFiles = Object.freeze([
  "executiveDecisionManifestTypes.ts",
  "executiveDecisionPhaseManifest.ts",
  "executiveDecisionInventoryManifest.ts",
  "executiveDecisionDependencyOwnershipManifest.ts",
  "executiveDecisionPublicSurfaceManifest.ts",
  "executiveDecisionCompatibilityGuaranteeManifest.ts",
  "executiveDecisionManifestPlatform.ts",
  "executiveDecisionManifestPlatform.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveDecisionManifestPlatform",
  "ExecutiveDecisionPhaseManifest",
  "ExecutiveDecisionInventoryManifest",
  "ExecutiveDecisionDependencyOwnershipManifest",
  "ExecutiveDecisionPublicSurfaceManifest",
  "ExecutiveDecisionCompatibilityManifest",
  "ExecutiveDecisionGuaranteeManifest",
] as const);

test("exactly eight required ENG-7:5 files are represented", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles) {
    assert.equal(readFileSync(join(dir, file), "utf8").length > 0, true);
  }
  assert.equal(requiredFiles.length, 8);
});

test("publishes exactly seven approved public exports", () => {
  for (const name of approvedExports) {
    assert.ok(Object.hasOwn(publicApi, name));
  }
  assert.equal(approvedExports.length, 7);
});

test("platform contains exactly nine ordered sections referencing approved surfaces", () => {
  assert.deepEqual(Object.keys(ExecutiveDecisionManifestPlatform), [
    "foundation",
    "registry",
    "model",
    "validation",
    "phaseManifest",
    "inventory",
    "dependencyOwnership",
    "publicSurface",
    "compatibilityGuarantees",
  ]);
  assert.equal(Object.keys(ExecutiveDecisionManifestPlatform).length, 9);
  assert.equal(Object.isFrozen(ExecutiveDecisionManifestPlatform), true);
  assert.equal(ExecutiveDecisionManifestPlatform.foundation, ExecutiveDecisionFoundation);
  assert.equal(ExecutiveDecisionManifestPlatform.registry, ExecutiveDecisionRegistryPlatform);
  assert.equal(ExecutiveDecisionManifestPlatform.model, ExecutiveDecisionModelPlatform);
  assert.equal(ExecutiveDecisionManifestPlatform.validation, ExecutiveDecisionValidationPlatform);
});

test("phase and inventory counts are exact declared metadata", () => {
  assert.equal(ExecutiveDecisionPhaseManifest.length, 4);
  assert.deepEqual(ExecutiveDecisionPhaseManifest.map(({ fileCount }) => fileCount), [7, 8, 9, 8]);
  assert.deepEqual(
    ExecutiveDecisionPhaseManifest.map(({ approvedPublicExportCount }) => approvedPublicExportCount),
    [6, 7, 8, 6],
  );
  assert.equal(ExecutiveDecisionInventoryManifest.filesRepresented, 32);
  assert.equal(ExecutiveDecisionInventoryManifest.approvedPublicExports, 27);
  assert.equal(ExecutiveDecisionInventoryManifest.foundationCapabilities, 8);
  assert.equal(ExecutiveDecisionInventoryManifest.decisionDomains, 12);
  assert.equal(ExecutiveDecisionInventoryManifest.decisionTypes, 16);
  assert.equal(ExecutiveDecisionInventoryManifest.registryCapabilities, 8);
  assert.equal(ExecutiveDecisionInventoryManifest.outputTypes, 8);
  assert.equal(ExecutiveDecisionInventoryManifest.lifecycleStates, 8);
  assert.equal(ExecutiveDecisionInventoryManifest.canonicalModels, 10);
  assert.equal(ExecutiveDecisionInventoryManifest.validationCategories, 8);
  assert.equal(ExecutiveDecisionInventoryManifest.validationSeverities, 4);
  assert.equal(ExecutiveDecisionInventoryManifest.validationRules, 32);
  assert.equal(ExecutiveDecisionInventoryManifest.passingValidationRules, 32);
  assert.equal(ExecutiveDecisionInventoryManifest.failingValidationRules, 0);
  assert.equal(ExecutiveDecisionInventoryManifest.architecturalAssets.length, 15);
});

test("dependency, ownership, and public-surface manifests are complete", () => {
  assert.equal(ExecutiveDecisionDependencyOwnershipManifest.incomingCount, 6);
  assert.equal(ExecutiveDecisionDependencyOwnershipManifest.outgoingCount, 2);
  assert.equal(ExecutiveDecisionDependencyOwnershipManifest.forbiddenCount, 13);
  assert.ok(getExecutiveDecisionOwnershipManifest().owns.includes("executive decision architecture"));
  assert.ok(getExecutiveDecisionOwnershipManifest().neverOwns.includes("executive reasoning"));
  assert.equal(ExecutiveDecisionPublicSurfaceManifest.surfaces.length, 4);
  assert.equal(ExecutiveDecisionPublicSurfaceManifest.summary.approvedPublicSurfaces, 4);
  assert.equal(ExecutiveDecisionPublicSurfaceManifest.summary.approvedPublicExports, 27);
  assert.equal(ExecutiveDecisionPublicSurfaceManifest.summary.internalSurfaceExposure, 0);
  assert.equal(ExecutiveDecisionPublicSurfaceManifest.summary.publicApiStable, true);
});

test("compatibility and guarantee inventories are exact", () => {
  assert.equal(ExecutiveDecisionCompatibilityManifest.length, 8);
  assert.equal(ExecutiveDecisionGuaranteeManifest.length, 12);
  assert.equal(ExecutiveDecisionCompatibilityManifest.every(({ status }) => status === "Compatible"), true);
  assert.equal(ExecutiveDecisionGuaranteeManifest.every(({ status }) => status === "Guaranteed"), true);
});

test("helpers are deterministic and unknown section ids return undefined", () => {
  assert.equal(getExecutiveDecisionManifestPlatform(), ExecutiveDecisionManifestPlatform);
  assert.equal(getExecutiveDecisionPhaseManifest(), ExecutiveDecisionPhaseManifest);
  assert.equal(getExecutiveDecisionInventoryManifest(), ExecutiveDecisionInventoryManifest);
  assert.equal(getExecutiveDecisionDependencyManifest(), ExecutiveDecisionDependencyOwnershipManifest.dependencies);
  assert.equal(getExecutiveDecisionPublicSurfaceManifest(), ExecutiveDecisionPublicSurfaceManifest);
  assert.equal(getExecutiveDecisionCompatibilityManifest(), ExecutiveDecisionCompatibilityManifest);
  assert.equal(getExecutiveDecisionGuaranteeManifest(), ExecutiveDecisionGuaranteeManifest);
  assert.equal(getExecutiveDecisionManifestSections().length, 9);
  assert.equal(getExecutiveDecisionManifestSectionById("inventory")?.order, 6);
  assert.equal(getExecutiveDecisionManifestSectionById("missing"), undefined);
  assert.equal(new Set(getExecutiveDecisionManifestSections().map(({ id }) => id)).size, 9);
});

test("summary and readiness report ReadyForDecisionPlatform", () => {
  const summary = getExecutiveDecisionManifestSummary();
  assert.equal(summary.sectionCount, 9);
  assert.equal(summary.filesRepresented, 32);
  assert.equal(summary.approvedPublicExports, 27);
  assert.equal(summary.compatibilityCount, 8);
  assert.equal(summary.guaranteeCount, 12);
  assert.equal(summary.validationPassingRules, 32);
  assert.equal(summary.validationFailingRules, 0);
  assert.equal(summary.validationStatus, "ValidationCertified");
  assert.equal(summary.readiness, "ReadyForDecisionPlatform");
  assert.equal(getExecutiveDecisionManifestMetadata().nextPhase, "ENG-7:6");
  const readiness = ExecutiveDecisionManifestPlatform.compatibilityGuarantees.readiness;
  assert.equal(readiness.readyForPlatform, true);
  assert.equal(readiness.readyForCertification, false);
  assert.equal(readiness.readyForFreeze, false);
  assert.equal(readiness.readyForPublicIndex, false);
});

test("only approved public dependencies are imported with no internals or runtime surfaces", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles.filter((name) => !name.endsWith(".test.ts") && name !== "executiveDecisionManifestTypes.ts")) {
    const source = readFileSync(join(dir, file), "utf8");
    assert.equal(source.includes("executiveDecisionFoundation.ts"), false);
    assert.equal(source.includes("executiveDecisionDomainRegistry.ts"), false);
    assert.equal(source.includes("executiveDecisionCoreModel.ts"), false);
    assert.equal(source.includes("executiveDecisionFoundationValidation.ts"), false);
    assert.equal(/from ["'].*\/(bus|ops|scene|eve|ui|persistence|database)/i.test(source), false);
    assert.equal(/readFileSync|readdirSync|import\(/i.test(source), false);
  }
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Builder|Scorer|Selector|Ranker|Executor|LLM|OpenAI|Query|Reflect|Runner|Calculator/i.test(name)
    )),
    true,
  );
});
