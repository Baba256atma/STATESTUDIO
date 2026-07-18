import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  ExecutiveOrchestrationPlatform,
  getExecutiveOrchestrationPlatform,
} from "./executiveOrchestrationPlatform.ts";
import * as publicApi from "./executiveOrchestrationCertificationPlatform.ts";
import {
  ExecutiveOrchestrationCertificationManifest,
  ExecutiveOrchestrationCertificationPlatform,
  ExecutiveOrchestrationCertificationRegistry,
  ExecutiveOrchestrationCertificationRunner,
  ExecutiveOrchestrationCertificationSummary,
  getExecutiveOrchestrationCertificationSummary,
  runExecutiveOrchestrationCertification,
} from "./executiveOrchestrationCertificationPlatform.ts";

const requiredFiles = Object.freeze([
  "executiveOrchestrationCertificationTypes.ts",
  "executiveOrchestrationCertificationRegistry.ts",
  "executiveOrchestrationCertificationManifest.ts",
  "executiveOrchestrationCertificationSummary.ts",
  "executiveOrchestrationCertificationPlatform.ts",
  "executiveOrchestrationCertificationRunner.ts",
  "executiveOrchestrationCertificationPlatform.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveOrchestrationCertificationPlatform",
  "ExecutiveOrchestrationCertificationRegistry",
  "ExecutiveOrchestrationCertificationManifest",
  "ExecutiveOrchestrationCertificationSummary",
  "runExecutiveOrchestrationCertification",
  "getExecutiveOrchestrationCertificationSummary",
  "ExecutiveOrchestrationCertificationRunner",
] as const);

const requiredGateIds = Object.freeze([
  "FoundationIntegrity",
  "RegistryIntegrity",
  "ModelIntegrity",
  "ValidationIntegrity",
  "ManifestIntegrity",
  "PlatformIntegrity",
  "OwnershipIntegrity",
  "DependencyCompliance",
  "PublicApiStability",
  "MetadataOnlyCompliance",
  "RuntimeFreeCompliance",
  "DeterministicBehavior",
  "ImmutabilityCompliance",
  "AntiDuplicationCompliance",
  "FreezeReadiness",
] as const);

const forbiddenImportPatterns = Object.freeze([
  /executiveOrchestrationFoundation/,
  /executiveOrchestrationRegistryPlatform/,
  /executiveOrchestrationModelPlatform/,
  /executiveOrchestrationValidationRunner/,
  /executiveOrchestrationManifestPlatform/,
  /executiveOrchestrationPlatformMetadata/,
  /executiveOrchestrationPlatformRegistry/,
  /executiveOrchestrationPlatformSummary/,
  /executiveOrchestrationPlatformRunner/,
  /executiveOrchestrationFoundationTypes/,
  /executiveOrchestrationRegistryTypes/,
  /executiveOrchestrationModelTypes/,
  /executiveOrchestrationValidationTypes/,
  /executiveOrchestrationManifestTypes/,
] as const);

test("exactly seven required ENG-8:7 files exist", () => {
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

test("certification consumes only ENG-8:6 public API", () => {
  assert.equal(
    ExecutiveOrchestrationCertificationPlatform.certifiedPlatform,
    ExecutiveOrchestrationPlatform,
  );
  assert.equal(
    getExecutiveOrchestrationPlatform(),
    ExecutiveOrchestrationCertificationPlatform.certifiedPlatform,
  );
  assert.deepEqual(ExecutiveOrchestrationCertificationPlatform.consumedSurfaces, {
    platform: "executiveOrchestrationPlatform.ts",
  });
  assert.equal(
    ExecutiveOrchestrationCertificationRegistry.dependencySurface,
    "executiveOrchestrationPlatform.ts",
  );

  const dir = dirname(fileURLToPath(import.meta.url));
  const certificationSources = requiredFiles
    .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"))
    .map((file) => readFileSync(join(dir, file), "utf8"));

  const platformSource = readFileSync(
    join(dir, "executiveOrchestrationCertificationPlatform.ts"),
    "utf8",
  );
  assert.equal(platformSource.includes("executiveOrchestrationPlatform.ts"), true);

  for (const source of certificationSources) {
    if (source === platformSource) continue;
    for (const line of source.split("\n")) {
      if (!line.includes("from ")) continue;
      for (const pattern of forbiddenImportPatterns) {
        assert.equal(pattern.test(line), false, `Forbidden import matched ${pattern}`);
      }
      assert.equal(
        /from\s+["']\.\/executiveOrchestrationPlatform\.ts["']/.test(line),
        false,
      );
    }
  }
});

test("exactly fifteen certification gates exist and all are Certified", () => {
  assert.equal(ExecutiveOrchestrationCertificationRegistry.gateInventory.length, 15);
  assert.deepEqual(
    ExecutiveOrchestrationCertificationRegistry.gateInventory.map(({ id }) => id),
    [...requiredGateIds],
  );
  assert.equal(
    ExecutiveOrchestrationCertificationRegistry.gateInventory.every(
      ({ status, certified, metadataOnly, runtimeFree }) =>
        status === "Certified"
        && certified === true
        && metadataOnly === true
        && runtimeFree === true,
    ),
    true,
  );
});

test("certification registry metadata is correct", () => {
  assert.equal(ExecutiveOrchestrationCertificationRegistry.certificationId, "ENG-8:7");
  assert.equal(ExecutiveOrchestrationCertificationRegistry.gateCount, 15);
  assert.equal(ExecutiveOrchestrationCertificationRegistry.certifiedGateCount, 15);
  assert.equal(ExecutiveOrchestrationCertificationRegistry.failedGateCount, 0);
  assert.equal(ExecutiveOrchestrationCertificationRegistry.pendingGateCount, 0);
  assert.equal(ExecutiveOrchestrationCertificationRegistry.categoryInventory.length, 15);
  assert.deepEqual(
    [...ExecutiveOrchestrationCertificationRegistry.publicApiSurface],
    [...approvedExports],
  );
  assert.equal(
    ExecutiveOrchestrationCertificationRegistry.certificationMetadata.certificationStatus,
    "Certified",
  );
  assert.equal(
    ExecutiveOrchestrationCertificationRegistry.certificationMetadata.readyForFreeze,
    true,
  );
});

test("certification manifest is complete", () => {
  assert.equal(ExecutiveOrchestrationCertificationManifest.certifiedSections.length, 6);
  assert.equal(ExecutiveOrchestrationCertificationManifest.certificationGates.length, 15);
  assert.equal(
    ExecutiveOrchestrationCertificationManifest.certificationSummary,
    ExecutiveOrchestrationCertificationSummary,
  );
  assert.equal(ExecutiveOrchestrationCertificationManifest.platformReference.platformId, "ENG-8:6");
  assert.equal(
    ExecutiveOrchestrationCertificationManifest.ownershipDeclaration.status,
    "Certified",
  );
  assert.equal(
    ExecutiveOrchestrationCertificationManifest.dependencyDeclaration.status,
    "Certified",
  );
  assert.equal(
    ExecutiveOrchestrationCertificationManifest.publicSurfaceDeclaration.exportCount,
    7,
  );
  assert.equal(
    ExecutiveOrchestrationCertificationManifest.freezeReadiness.status,
    "ReadyForFreeze",
  );
});

test("certification summary is correct and status is Certified", () => {
  assert.equal(ExecutiveOrchestrationCertificationSummary.certificationId, "ENG-8:7");
  assert.equal(ExecutiveOrchestrationCertificationSummary.gateCount, 15);
  assert.equal(ExecutiveOrchestrationCertificationSummary.certifiedGateCount, 15);
  assert.equal(ExecutiveOrchestrationCertificationSummary.failedGateCount, 0);
  assert.equal(ExecutiveOrchestrationCertificationSummary.pendingGateCount, 0);
  assert.equal(ExecutiveOrchestrationCertificationSummary.certificationStatus, "Certified");
  assert.equal(ExecutiveOrchestrationCertificationSummary.readiness, "ReadyForFreeze");
  assert.equal(ExecutiveOrchestrationCertificationSummary.platformReference.platformId, "ENG-8:6");
  assert.equal(ExecutiveOrchestrationCertificationSummary.readyForFreeze, true);
  assert.equal(
    ExecutiveOrchestrationCertificationPlatform.metadata.certificationStatus,
    "Certified",
  );
});

test("platform is deeply frozen and runner is deterministic metadata-only", () => {
  assert.equal(Object.isFrozen(ExecutiveOrchestrationCertificationPlatform), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationCertificationRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationCertificationManifest), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationCertificationSummary), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationCertificationRunner), true);
  assert.equal(
    ExecutiveOrchestrationCertificationRegistry.gateInventory.every(Object.isFrozen),
    true,
  );
  assert.equal(ExecutiveOrchestrationCertificationPlatform.deeplyFrozen, true);
  assert.deepEqual(
    runExecutiveOrchestrationCertification(),
    runExecutiveOrchestrationCertification(),
  );
  assert.equal(
    getExecutiveOrchestrationCertificationSummary(),
    ExecutiveOrchestrationCertificationSummary,
  );
  assert.equal(runExecutiveOrchestrationCertification().status, "Certified");
  assert.equal(runExecutiveOrchestrationCertification().readiness, "ReadyForFreeze");
  assert.equal(ExecutiveOrchestrationCertificationRunner.metadataOnly, true);
  assert.equal(ExecutiveOrchestrationCertificationRunner.runtimeFree, true);
});

test("no runtime certification behavior exists in public exports", () => {
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Executor|Scheduler|Queue|Promise|Async|EventBus|Workflow|Service|Reducer|validate|execute/i
        .test(name)
        || name === "runExecutiveOrchestrationCertification"
    )),
    true,
  );
  assert.equal(Object.isFrozen(runExecutiveOrchestrationCertification()), true);
});
