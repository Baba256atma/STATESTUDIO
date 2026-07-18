import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  ExecutiveOrchestrationRegistryPlatform,
} from "./executiveOrchestrationRegistryPlatform.ts";
import {
  ExecutiveOrchestrationModelPlatform,
} from "./executiveOrchestrationModelPlatform.ts";
import {
  getExecutiveOrchestrationValidationSummary,
} from "./executiveOrchestrationValidationRunner.ts";
import * as publicApi from "./executiveOrchestrationManifestPlatform.ts";
import {
  ExecutiveOrchestrationDependencyManifest,
  ExecutiveOrchestrationFoundationManifest,
  ExecutiveOrchestrationManifestPlatform,
  ExecutiveOrchestrationModelManifest,
  ExecutiveOrchestrationRegistryManifest,
  ExecutiveOrchestrationValidationManifestSummary,
  getExecutiveOrchestrationManifestPlatform,
  getExecutiveOrchestrationManifestSummary,
} from "./executiveOrchestrationManifestPlatform.ts";

const requiredFiles = Object.freeze([
  "executiveOrchestrationManifestTypes.ts",
  "executiveOrchestrationFoundationManifest.ts",
  "executiveOrchestrationRegistryManifest.ts",
  "executiveOrchestrationModelManifest.ts",
  "executiveOrchestrationValidationManifestSummary.ts",
  "executiveOrchestrationDependencyManifest.ts",
  "executiveOrchestrationManifestPlatform.ts",
  "executiveOrchestrationManifestPlatform.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveOrchestrationManifestPlatform",
  "ExecutiveOrchestrationFoundationManifest",
  "ExecutiveOrchestrationRegistryManifest",
  "ExecutiveOrchestrationModelManifest",
  "ExecutiveOrchestrationValidationManifestSummary",
  "ExecutiveOrchestrationDependencyManifest",
  "getExecutiveOrchestrationManifestPlatform",
  "getExecutiveOrchestrationManifestSummary",
] as const);

test("exactly eight required ENG-8:5 files exist", () => {
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

test("all nine manifest sections exist and platform is deeply frozen", () => {
  assert.deepEqual(
    ExecutiveOrchestrationManifestPlatform.sections.map(({ id }) => id),
    [
      "Foundation",
      "Registry",
      "Model",
      "Validation",
      "DependencyMap",
      "Ownership",
      "PublicSurface",
      "ManifestMetadata",
      "ReleaseReadiness",
    ],
  );
  assert.equal(Object.isFrozen(ExecutiveOrchestrationManifestPlatform), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationFoundationManifest), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationRegistryManifest), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationModelManifest), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationValidationManifestSummary), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationDependencyManifest), true);
  assert.equal(ExecutiveOrchestrationManifestPlatform.sections.every(Object.isFrozen), true);
  assert.equal(ExecutiveOrchestrationManifestPlatform.deeplyFrozen, true);
  assert.equal(
    ExecutiveOrchestrationManifestPlatform.sections.find(
      (entry) => (entry.id as string) === "Unknown",
    ),
    undefined,
  );
});

test("foundation, registry, model, and validation summaries match prior public APIs", () => {
  assert.equal(ExecutiveOrchestrationFoundationManifest.foundationId, "ENG-8:1");
  assert.equal(ExecutiveOrchestrationFoundationManifest.responsibilities.count, 12);
  assert.equal(ExecutiveOrchestrationFoundationManifest.lifecycle.stageCount, 8);
  assert.equal(ExecutiveOrchestrationFoundationManifest.capabilities.count, 8);
  assert.equal(ExecutiveOrchestrationFoundationManifest.lifecycle.first, "Idle");
  assert.equal(ExecutiveOrchestrationFoundationManifest.lifecycle.last, "Complete");

  assert.deepEqual(ExecutiveOrchestrationRegistryManifest.inventory, {
    components: ExecutiveOrchestrationRegistryPlatform.inventory.componentCount,
    coordinationTargets:
      ExecutiveOrchestrationRegistryPlatform.inventory.coordinationTargetCount,
    capabilities: ExecutiveOrchestrationRegistryPlatform.inventory.capabilityCount,
    lifecycleStages: ExecutiveOrchestrationRegistryPlatform.inventory.lifecycleStageCount,
    dependencies: ExecutiveOrchestrationRegistryPlatform.inventory.dependencyCount,
    responsibilities: ExecutiveOrchestrationRegistryPlatform.inventory.responsibilityCount,
    executionModes: ExecutiveOrchestrationRegistryPlatform.inventory.executionModeCount,
    routingRelationships:
      ExecutiveOrchestrationRegistryPlatform.inventory.routingRelationshipCount,
  });

  assert.equal(
    ExecutiveOrchestrationModelManifest.inventory.modelCount,
    ExecutiveOrchestrationModelPlatform.modelRegistry.entries.length,
  );
  assert.deepEqual(
    [...ExecutiveOrchestrationModelManifest.kinds],
    [...ExecutiveOrchestrationModelPlatform.modelRegistry.kinds],
  );

  const validationSummary = getExecutiveOrchestrationValidationSummary();
  assert.equal(
    ExecutiveOrchestrationValidationManifestSummary.inventory.ruleCount,
    validationSummary.totalRules,
  );
  assert.equal(
    ExecutiveOrchestrationValidationManifestSummary.inventory.validationStatus,
    "Pass",
  );
  assert.equal(
    ExecutiveOrchestrationValidationManifestSummary.inventory.readiness,
    "ReadyForManifest",
  );
});

test("dependency map and ownership map satisfy completeness and anti-duplication", () => {
  assert.equal(ExecutiveOrchestrationDependencyManifest.dependencies.length, 14);
  assert.deepEqual(
    ExecutiveOrchestrationDependencyManifest.dependencies.map(({ name }) => name),
    [
      "ENG-1",
      "ENG-2",
      "ENG-3",
      "ENG-4",
      "ENG-5",
      "ENG-6",
      "ENG-7",
      "ENG-8:1",
      "ENG-8:2",
      "ENG-8:3",
      "ENG-8:4",
      "BUS Public APIs",
      "OPS Public APIs",
      "Advisor Public APIs",
    ],
  );
  assert.equal(
    ExecutiveOrchestrationDependencyManifest.dependencies.every(
      ({ runtimeAllowed, publicApiOnly }) =>
        runtimeAllowed === false && publicApiOnly === true,
    ),
    true,
  );

  assert.equal(ExecutiveOrchestrationManifestPlatform.ownership.responsibilities.length, 12);
  assert.equal(
    ExecutiveOrchestrationManifestPlatform.ownership.responsibilities.every(
      ({ primaryOwnerCount }) => primaryOwnerCount === 1,
    ),
    true,
  );
  assert.equal(
    ExecutiveOrchestrationManifestPlatform.ownership.antiDuplication
      .everyResponsibilityHasOnePrimaryOwner,
    true,
  );
  assert.equal(
    ExecutiveOrchestrationManifestPlatform.ownership.antiDuplication.noBusOwnershipLeakage,
    true,
  );
  assert.equal(
    ExecutiveOrchestrationManifestPlatform.ownership.antiDuplication.noOpsOwnershipLeakage,
    true,
  );
  assert.equal(
    ExecutiveOrchestrationManifestPlatform.ownership.antiDuplication.noAdvisorOwnershipLeakage,
    true,
  );
});

test("public surface, readiness, helpers, and consumed surfaces are correct", () => {
  assert.deepEqual(
    [...ExecutiveOrchestrationManifestPlatform.publicSurface.publicExports],
    [...approvedExports],
  );
  assert.equal(
    ExecutiveOrchestrationManifestPlatform.releaseReadiness.status,
    "ReadyForPlatform",
  );
  assert.deepEqual(
    [...ExecutiveOrchestrationManifestPlatform.releaseReadiness.declarations],
    [
      "FoundationComplete",
      "RegistryComplete",
      "ModelComplete",
      "ValidationComplete",
      "ManifestComplete",
      "ReadyForPlatform",
    ],
  );
  assert.equal(ExecutiveOrchestrationManifestPlatform.manifestMetadata.id, "ENG-8:5");
  assert.equal(ExecutiveOrchestrationManifestPlatform.manifestMetadata.status, "Stable");
  assert.equal(
    ExecutiveOrchestrationManifestPlatform.manifestMetadata.architectureMode,
    "MetadataOnly",
  );
  assert.equal(
    ExecutiveOrchestrationManifestPlatform.manifestMetadata.readiness,
    "ReadyForPlatform",
  );
  assert.equal(getExecutiveOrchestrationManifestPlatform(), ExecutiveOrchestrationManifestPlatform);
  assert.equal(
    getExecutiveOrchestrationManifestSummary(),
    ExecutiveOrchestrationManifestPlatform.summary,
  );
  assert.equal(getExecutiveOrchestrationManifestSummary().readiness, "ReadyForPlatform");
  assert.deepEqual(ExecutiveOrchestrationManifestPlatform.consumedSurfaces, {
    foundation: "executiveOrchestrationFoundation.ts",
    registry: "executiveOrchestrationRegistryPlatform.ts",
    model: "executiveOrchestrationModelPlatform.ts",
    validation: "executiveOrchestrationValidationRunner.ts",
  });
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Runner|Executor|Scheduler|Queue|Promise|Async|EventBus|Workflow|Service|Reducer/i
        .test(name)
    )),
    true,
  );
});
