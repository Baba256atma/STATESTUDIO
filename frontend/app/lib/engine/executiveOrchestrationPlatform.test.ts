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
  ExecutiveOrchestrationValidationRunner,
  getExecutiveOrchestrationValidationSummary,
} from "./executiveOrchestrationValidationRunner.ts";
import {
  ExecutiveOrchestrationManifestPlatform,
  getExecutiveOrchestrationManifestPlatform,
} from "./executiveOrchestrationManifestPlatform.ts";
import {
  getExecutiveOrchestrationFoundation,
} from "./executiveOrchestrationFoundation.ts";
import * as publicApi from "./executiveOrchestrationPlatform.ts";
import {
  ExecutiveOrchestrationPlatform,
  ExecutiveOrchestrationPlatformMetadata,
  ExecutiveOrchestrationPlatformRegistry,
  ExecutiveOrchestrationPlatformRunner,
  ExecutiveOrchestrationPlatformSummary,
  getExecutiveOrchestrationPlatform,
  getExecutiveOrchestrationPlatformSummary,
} from "./executiveOrchestrationPlatform.ts";

const requiredFiles = Object.freeze([
  "executiveOrchestrationPlatformTypes.ts",
  "executiveOrchestrationPlatformMetadata.ts",
  "executiveOrchestrationPlatformRegistry.ts",
  "executiveOrchestrationPlatformSummary.ts",
  "executiveOrchestrationPlatform.ts",
  "executiveOrchestrationPlatformRunner.ts",
  "executiveOrchestrationPlatform.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveOrchestrationPlatform",
  "ExecutiveOrchestrationPlatformMetadata",
  "ExecutiveOrchestrationPlatformRegistry",
  "ExecutiveOrchestrationPlatformSummary",
  "getExecutiveOrchestrationPlatform",
  "getExecutiveOrchestrationPlatformSummary",
  "ExecutiveOrchestrationPlatformRunner",
] as const);

const approvedPublicImports = Object.freeze([
  "executiveOrchestrationFoundation.ts",
  "executiveOrchestrationRegistryPlatform.ts",
  "executiveOrchestrationModelPlatform.ts",
  "executiveOrchestrationValidationRunner.ts",
  "executiveOrchestrationManifestPlatform.ts",
  "executiveOrchestrationPlatformMetadata.ts",
  "executiveOrchestrationPlatformRegistry.ts",
  "executiveOrchestrationPlatformSummary.ts",
  "executiveOrchestrationPlatformRunner.ts",
] as const);

const forbiddenImportPatterns = Object.freeze([
  /executiveOrchestrationFoundationTypes/,
  /executiveOrchestrationRegistryTypes/,
  /executiveOrchestrationModelTypes/,
  /executiveOrchestrationValidationTypes/,
  /executiveOrchestrationManifestTypes/,
  /executiveOrchestrationComponentRegistry/,
  /executiveOrchestrationCapabilityContract/,
  /executiveOrchestrationValidationManifest\.ts/,
  /executiveOrchestrationFoundationManifest/,
] as const);

test("exactly seven required ENG-8:6 files exist", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles) {
    assert.equal(readFileSync(join(dir, file), "utf8").length > 0, true);
  }
  assert.equal(requiredFiles.length, 7);
});

test("publishes exactly seven approved public exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [...approvedExports].sort());
  assert.equal(Object.keys(publicApi).length, 7);
});

test("platform aggregates exactly five canonical sections from approved public APIs", () => {
  assert.equal(ExecutiveOrchestrationPlatform.foundation, getExecutiveOrchestrationFoundation());
  assert.equal(
    ExecutiveOrchestrationPlatform.registry,
    ExecutiveOrchestrationRegistryPlatform,
  );
  assert.equal(
    ExecutiveOrchestrationPlatform.model,
    ExecutiveOrchestrationModelPlatform,
  );
  assert.equal(
    ExecutiveOrchestrationPlatform.validation,
    ExecutiveOrchestrationValidationRunner,
  );
  assert.equal(
    ExecutiveOrchestrationPlatform.manifest,
    ExecutiveOrchestrationManifestPlatform,
  );
  assert.deepEqual(
    Object.keys(ExecutiveOrchestrationPlatform.consumedSurfaces).sort(),
    ["foundation", "manifest", "model", "registry", "validation"].sort(),
  );
  assert.deepEqual(ExecutiveOrchestrationPlatform.consumedSurfaces, {
    foundation: "executiveOrchestrationFoundation.ts",
    registry: "executiveOrchestrationRegistryPlatform.ts",
    model: "executiveOrchestrationModelPlatform.ts",
    validation: "executiveOrchestrationValidationRunner.ts",
    manifest: "executiveOrchestrationManifestPlatform.ts",
  });
});

test("platform metadata and registry metadata are correct", () => {
  assert.equal(ExecutiveOrchestrationPlatformMetadata.id, "ENG-8:6");
  assert.equal(ExecutiveOrchestrationPlatformMetadata.name, "Executive Orchestration Platform");
  assert.equal(
    ExecutiveOrchestrationPlatformMetadata.namespace,
    "nexora.engine.executive.orchestration.platform",
  );
  assert.equal(ExecutiveOrchestrationPlatformMetadata.version, "1.0.0");
  assert.equal(ExecutiveOrchestrationPlatformMetadata.status, "Stable");
  assert.equal(ExecutiveOrchestrationPlatformMetadata.architectureMode, "MetadataOnly");
  assert.equal(ExecutiveOrchestrationPlatformMetadata.runtimeBehavior, "None");
  assert.equal(ExecutiveOrchestrationPlatformMetadata.readiness, "ReadyForCertification");
  assert.equal(ExecutiveOrchestrationPlatformMetadata.metadataOnly, true);
  assert.equal(ExecutiveOrchestrationPlatformMetadata.runtimeFree, true);
  assert.equal(ExecutiveOrchestrationPlatformMetadata.immutable, true);
  assert.equal(ExecutiveOrchestrationPlatformMetadata.deeplyFrozen, true);
  assert.equal(ExecutiveOrchestrationPlatformMetadata.deterministic, true);
  assert.equal(ExecutiveOrchestrationPlatformMetadata.readyForCertification, true);

  assert.equal(ExecutiveOrchestrationPlatformRegistry.platformId, "ENG-8:6");
  assert.equal(
    ExecutiveOrchestrationPlatformRegistry.namespace,
    "nexora.engine.executive.orchestration.platform",
  );
  assert.equal(ExecutiveOrchestrationPlatformRegistry.phase, "ENG-8:6");
  assert.equal(ExecutiveOrchestrationPlatformRegistry.owner, "ENG-8");
  assert.deepEqual(
    [...ExecutiveOrchestrationPlatformRegistry.aggregatedSections],
    ["foundation", "registry", "model", "validation", "manifest"],
  );
  assert.equal(ExecutiveOrchestrationPlatformRegistry.entries.length, 5);
  assert.equal(ExecutiveOrchestrationPlatformRegistry.releaseVisibility, "ReadyForCertification");
  assert.deepEqual(
    [...ExecutiveOrchestrationPlatformRegistry.publicApiSurface],
    [...approvedExports],
  );
});

test("platform summary matches prior phase metadata", () => {
  const validationSummary = getExecutiveOrchestrationValidationSummary();
  const manifestPlatform = getExecutiveOrchestrationManifestPlatform();

  assert.equal(ExecutiveOrchestrationPlatformSummary.platformId, "ENG-8:6");
  assert.equal(ExecutiveOrchestrationPlatformSummary.sectionCount, 5);
  assert.equal(
    ExecutiveOrchestrationPlatformSummary.registryComponentCount,
    ExecutiveOrchestrationRegistryPlatform.inventory.componentCount,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformSummary.coordinationTargetCount,
    ExecutiveOrchestrationRegistryPlatform.inventory.coordinationTargetCount,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformSummary.modelCount,
    ExecutiveOrchestrationModelPlatform.modelRegistry.entries.length,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformSummary.validationRuleCount,
    validationSummary.totalRules,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformSummary.dependencyCount,
    manifestPlatform.summary.dependencyCount,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformSummary.responsibilityCount,
    ExecutiveOrchestrationRegistryPlatform.inventory.responsibilityCount,
  );
  assert.equal(ExecutiveOrchestrationPlatformSummary.manifestReadiness, "ReadyForPlatform");
  assert.equal(
    ExecutiveOrchestrationPlatformSummary.platformReadiness,
    "ReadyForCertification",
  );
  assert.equal(ExecutiveOrchestrationPlatformSummary.validationStatus, "Pass");
  assert.equal(ExecutiveOrchestrationPlatformSummary.manifestStatus, "ManifestComplete");
  assert.equal(ExecutiveOrchestrationPlatformSummary.nextPhase, "ENG-8:7");
});

test("platform status is ReadyForCertification and deeply frozen", () => {
  assert.equal(ExecutiveOrchestrationPlatform.readyForCertification, true);
  assert.equal(ExecutiveOrchestrationPlatform.metadataOnly, true);
  assert.equal(ExecutiveOrchestrationPlatform.runtimeFree, true);
  assert.equal(ExecutiveOrchestrationPlatform.deeplyFrozen, true);
  assert.deepEqual(ExecutiveOrchestrationPlatform.status, {
    stable: "Stable",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    deeplyFrozen: "DeeplyFrozen",
    readyForCertification: "ReadyForCertification",
  });
  assert.equal(ExecutiveOrchestrationPlatform.releaseMetadata.visibility, "ReadyForCertification");

  assert.equal(Object.isFrozen(ExecutiveOrchestrationPlatform), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationPlatformMetadata), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationPlatformRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationPlatformSummary), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationPlatformRunner), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationPlatform.releaseMetadata), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationPlatform.status), true);
  assert.equal(
    ExecutiveOrchestrationPlatformRegistry.entries.every(Object.isFrozen),
    true,
  );
});

test("helpers and runner are deterministic metadata accessors", () => {
  assert.equal(getExecutiveOrchestrationPlatform(), ExecutiveOrchestrationPlatform);
  assert.equal(getExecutiveOrchestrationPlatform(), getExecutiveOrchestrationPlatform());
  assert.equal(
    getExecutiveOrchestrationPlatformSummary(),
    ExecutiveOrchestrationPlatformSummary,
  );
  assert.equal(
    getExecutiveOrchestrationPlatformSummary(),
    getExecutiveOrchestrationPlatformSummary(),
  );
  assert.equal(
    ExecutiveOrchestrationPlatformRunner.getPlatform(),
    ExecutiveOrchestrationPlatform,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformRunner.getSummary(),
    ExecutiveOrchestrationPlatformSummary,
  );
  assert.equal(ExecutiveOrchestrationPlatformRunner.metadataOnly, true);
  assert.equal(ExecutiveOrchestrationPlatformRunner.runtimeFree, true);
  assert.equal(ExecutiveOrchestrationPlatformRunner.readyForCertification, true);
});

test("no runtime orchestration exports and no internal module imports", () => {
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Executor|Scheduler|Queue|Promise|Async|EventBus|Workflow|Service|Reducer|execute|schedule|route/i
        .test(name)
    )),
    true,
  );

  const dir = dirname(fileURLToPath(import.meta.url));
  const platformSource = readFileSync(
    join(dir, "executiveOrchestrationPlatform.ts"),
    "utf8",
  );
  const runnerSource = readFileSync(
    join(dir, "executiveOrchestrationPlatformRunner.ts"),
    "utf8",
  );
  const summarySource = readFileSync(
    join(dir, "executiveOrchestrationPlatformSummary.ts"),
    "utf8",
  );

  for (const source of [platformSource, runnerSource, summarySource]) {
    for (const pattern of forbiddenImportPatterns) {
      assert.equal(pattern.test(source), false, `Forbidden import matched ${pattern}`);
    }
  }

  for (const moduleName of approvedPublicImports) {
    assert.equal(platformSource.includes(moduleName), true);
  }
});

test("platform preserves ownership boundaries without redefining prior architecture", () => {
  assert.equal(ExecutiveOrchestrationPlatform.foundation.metadata.owner, "ENG-8");
  assert.equal(ExecutiveOrchestrationPlatform.registry.registryMetadata.owner, "ENG-8");
  assert.equal(ExecutiveOrchestrationPlatform.model.metadata.owner, "ENG-8");
  assert.equal(ExecutiveOrchestrationPlatform.validation.summary.owner, "ENG-8");
  assert.equal(
    ExecutiveOrchestrationPlatform.manifest.manifestMetadata.owner,
    "ENG-8",
  );
  assert.equal(
    ExecutiveOrchestrationPlatform.foundation.metadata.platformId,
    "ENG-8:1",
  );
  assert.equal(
    ExecutiveOrchestrationPlatform.registry.registryMetadata.id,
    "ENG-8:2",
  );
  assert.equal(ExecutiveOrchestrationPlatform.model.metadata.id, "ENG-8:3");
  assert.equal(ExecutiveOrchestrationPlatform.validation.summary.validationId, "ENG-8:4");
  assert.equal(
    ExecutiveOrchestrationPlatform.manifest.manifestMetadata.id,
    "ENG-8:5",
  );
  assert.equal(
    ExecutiveOrchestrationPlatform.registry.inventory.responsibilityCount,
    ExecutiveOrchestrationPlatform.foundation.responsibilities.responsibilities.length,
  );
});
