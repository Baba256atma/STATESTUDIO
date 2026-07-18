import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  ExecutiveOrchestrationCertificationPlatform,
  getExecutiveOrchestrationCertificationSummary,
} from "./executiveOrchestrationCertificationPlatform.ts";
import * as publicApi from "./executiveOrchestrationFreezePlatform.ts";
import {
  ExecutiveOrchestrationFreezeCompatibility,
  ExecutiveOrchestrationFreezeLocks,
  ExecutiveOrchestrationFreezeManifest,
  ExecutiveOrchestrationFreezePlatform,
  ExecutiveOrchestrationFreezeRegistry,
  ExecutiveOrchestrationFreezeRunner,
  getExecutiveOrchestrationFreezeSummary,
  runExecutiveOrchestrationFreeze,
} from "./executiveOrchestrationFreezePlatform.ts";

const requiredFiles = Object.freeze([
  "executiveOrchestrationFreezeTypes.ts",
  "executiveOrchestrationFreezeRegistry.ts",
  "executiveOrchestrationFreezeCompatibility.ts",
  "executiveOrchestrationFreezeLocks.ts",
  "executiveOrchestrationFreezeManifest.ts",
  "executiveOrchestrationFreezePlatform.ts",
  "executiveOrchestrationFreezeRunner.ts",
  "executiveOrchestrationFreezePlatform.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveOrchestrationFreezePlatform",
  "ExecutiveOrchestrationFreezeRegistry",
  "ExecutiveOrchestrationFreezeCompatibility",
  "ExecutiveOrchestrationFreezeLocks",
  "ExecutiveOrchestrationFreezeManifest",
  "runExecutiveOrchestrationFreeze",
  "getExecutiveOrchestrationFreezeSummary",
  "ExecutiveOrchestrationFreezeRunner",
] as const);

const requiredDomainIds = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Platform",
  "Certification",
  "PublicAPI",
] as const);

const requiredLockIds = Object.freeze([
  "ArchitectureLocked",
  "OwnershipLocked",
  "DependencyLocked",
  "RegistryLocked",
  "ModelLocked",
  "ValidationLocked",
  "ManifestLocked",
  "PlatformLocked",
  "PublicApiLocked",
  "ExtensionControlled",
] as const);

const requiredCompatibilityDependencies = Object.freeze([
  "ENG-1",
  "ENG-2",
  "ENG-3",
  "ENG-4",
  "ENG-5",
  "ENG-6",
  "ENG-7",
  "BUS Public APIs",
  "OPS Public APIs",
  "Advisor Public APIs",
] as const);

const forbiddenImportPatterns = Object.freeze([
  /executiveOrchestrationFoundation/,
  /executiveOrchestrationRegistryPlatform/,
  /executiveOrchestrationModelPlatform/,
  /executiveOrchestrationValidationRunner/,
  /executiveOrchestrationManifestPlatform/,
  /executiveOrchestrationPlatform\.ts/,
  /executiveOrchestrationPlatformMetadata/,
  /executiveOrchestrationPlatformRegistry/,
  /executiveOrchestrationPlatformSummary/,
  /executiveOrchestrationPlatformRunner/,
] as const);

test("exactly eight required ENG-8:8 files exist", () => {
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

test("freeze consumes only ENG-8:7 public APIs", () => {
  assert.equal(
    ExecutiveOrchestrationFreezePlatform.certifiedPlatform,
    ExecutiveOrchestrationCertificationPlatform,
  );
  assert.deepEqual(ExecutiveOrchestrationFreezePlatform.consumedSurfaces, {
    certification: "executiveOrchestrationCertificationPlatform.ts",
  });
  assert.equal(
    ExecutiveOrchestrationFreezeManifest.certificationReference.certificationId,
    "ENG-8:7",
  );
  assert.equal(
    ExecutiveOrchestrationFreezeManifest.certificationReference.certificationStatus,
    getExecutiveOrchestrationCertificationSummary().certificationStatus,
  );

  const dir = dirname(fileURLToPath(import.meta.url));
  const freezeSources = requiredFiles
    .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"))
    .map((file) => ({
      file,
      source: readFileSync(join(dir, file), "utf8"),
    }));

  const allowedCertificationImporters = Object.freeze([
    "executiveOrchestrationFreezeManifest.ts",
    "executiveOrchestrationFreezePlatform.ts",
  ] as const);

  for (const { file, source } of freezeSources) {
    for (const line of source.split("\n")) {
      if (!line.includes("from ")) continue;
      for (const pattern of forbiddenImportPatterns) {
        assert.equal(
          pattern.test(line),
          false,
          `${file} forbidden import matched ${pattern}`,
        );
      }
      if (/from\s+["']\.\/executiveOrchestrationCertificationPlatform\.ts["']/.test(line)) {
        assert.equal(
          (allowedCertificationImporters as readonly string[]).includes(file),
          true,
          `${file} should not import ENG-8:7`,
        );
      }
    }
  }
});

test("exactly eight frozen architectural domains exist", () => {
  assert.equal(ExecutiveOrchestrationFreezeRegistry.length, 8);
  assert.deepEqual(
    ExecutiveOrchestrationFreezeRegistry.map(({ id }) => id),
    [...requiredDomainIds],
  );
  assert.equal(
    ExecutiveOrchestrationFreezeRegistry.every(
      ({ status, frozen, certified, metadataOnly, runtimeFree, immutable }) =>
        status === "Frozen"
        && frozen === true
        && certified === true
        && metadataOnly === true
        && runtimeFree === true
        && immutable === true,
    ),
    true,
  );
});

test("compatibility declarations are complete", () => {
  assert.equal(ExecutiveOrchestrationFreezeCompatibility.length, 10);
  assert.deepEqual(
    ExecutiveOrchestrationFreezeCompatibility.map(({ dependency }) => dependency),
    [...requiredCompatibilityDependencies],
  );
  assert.equal(
    ExecutiveOrchestrationFreezeCompatibility.every(
      ({
        compatibilityStatus,
        publicApiOnly,
        runtimeInteractionAllowed,
        certified,
      }) =>
        compatibilityStatus === "Compatible"
        && publicApiOnly === true
        && runtimeInteractionAllowed === false
        && certified === true,
    ),
    true,
  );
});

test("exactly ten architectural locks exist and freeze manifest is complete", () => {
  assert.equal(ExecutiveOrchestrationFreezeLocks.length, 10);
  assert.deepEqual(
    ExecutiveOrchestrationFreezeLocks.map(({ id }) => id),
    [...requiredLockIds],
  );
  assert.equal(
    ExecutiveOrchestrationFreezeLocks.every(({ locked, immutable }) =>
      locked === true && immutable === true
    ),
    true,
  );

  assert.equal(
    ExecutiveOrchestrationFreezeManifest.freezeRegistry,
    ExecutiveOrchestrationFreezeRegistry,
  );
  assert.equal(
    ExecutiveOrchestrationFreezeManifest.compatibilityDeclarations,
    ExecutiveOrchestrationFreezeCompatibility,
  );
  assert.equal(
    ExecutiveOrchestrationFreezeManifest.architecturalLocks,
    ExecutiveOrchestrationFreezeLocks,
  );
  assert.equal(
    ExecutiveOrchestrationFreezeManifest.publicIndexReadiness.status,
    "ReadyForPublicIndex",
  );
  assert.equal(ExecutiveOrchestrationFreezeManifest.freezeReadiness.status, "Frozen");
});

test("freeze platform is deeply frozen with Frozen status and ReadyForPublicIndex", () => {
  assert.equal(Object.isFrozen(ExecutiveOrchestrationFreezePlatform), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationFreezeRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationFreezeCompatibility), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationFreezeLocks), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationFreezeManifest), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationFreezeRunner), true);
  assert.equal(ExecutiveOrchestrationFreezeRegistry.every(Object.isFrozen), true);
  assert.equal(ExecutiveOrchestrationFreezeCompatibility.every(Object.isFrozen), true);
  assert.equal(ExecutiveOrchestrationFreezeLocks.every(Object.isFrozen), true);
  assert.equal(ExecutiveOrchestrationFreezePlatform.deeplyFrozen, true);
  assert.equal(ExecutiveOrchestrationFreezePlatform.metadata.freezeStatus, "Frozen");
  assert.equal(ExecutiveOrchestrationFreezePlatform.metadata.status, "Frozen");
  assert.equal(
    ExecutiveOrchestrationFreezePlatform.metadata.certificationStatus,
    "Certified",
  );
  assert.equal(
    ExecutiveOrchestrationFreezePlatform.metadata.readiness,
    "ReadyForPublicIndex",
  );
  assert.equal(ExecutiveOrchestrationFreezePlatform.readyForPublicIndex, true);
  assert.deepEqual(ExecutiveOrchestrationFreezePlatform.status, {
    frozen: "Frozen",
    certified: "Certified",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    deeplyFrozen: "DeeplyFrozen",
    readyForPublicIndex: "ReadyForPublicIndex",
  });
});

test("runner is deterministic and metadata-only with no runtime freeze behavior", () => {
  assert.deepEqual(
    runExecutiveOrchestrationFreeze(),
    runExecutiveOrchestrationFreeze(),
  );
  assert.equal(Object.isFrozen(runExecutiveOrchestrationFreeze()), true);
  assert.equal(runExecutiveOrchestrationFreeze().status, "Frozen");
  assert.equal(runExecutiveOrchestrationFreeze().readiness, "ReadyForPublicIndex");
  assert.equal(
    getExecutiveOrchestrationFreezeSummary(),
    ExecutiveOrchestrationFreezePlatform.summary,
  );
  assert.equal(
    getExecutiveOrchestrationFreezeSummary(),
    getExecutiveOrchestrationFreezeSummary(),
  );
  assert.equal(ExecutiveOrchestrationFreezeRunner.metadataOnly, true);
  assert.equal(ExecutiveOrchestrationFreezeRunner.runtimeFree, true);
  assert.equal(ExecutiveOrchestrationFreezeRunner.readyForPublicIndex, true);
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Executor|Scheduler|Queue|Promise|Async|EventBus|Workflow|Service|Reducer|validate|execute/i
        .test(name)
        || name === "runExecutiveOrchestrationFreeze"
    )),
    true,
  );
});

test("ownership boundaries remain unchanged and certification is preserved", () => {
  assert.equal(ExecutiveOrchestrationFreezePlatform.ownership.owner, "ENG-8");
  assert.equal(
    ExecutiveOrchestrationFreezePlatform.certifiedPlatform.ownership.owner,
    "ENG-8",
  );
  assert.equal(
    ExecutiveOrchestrationFreezePlatform.certifiedPlatform.summary.certificationStatus,
    "Certified",
  );
  assert.equal(
    ExecutiveOrchestrationFreezeManifest.certificationReference.gateCount,
    15,
  );
  assert.equal(
    ExecutiveOrchestrationFreezeManifest.certificationReference.certifiedGateCount,
    15,
  );
  assert.equal(
    ExecutiveOrchestrationFreezePlatform.release.certificationStatus,
    "Certified",
  );
  assert.equal(
    ExecutiveOrchestrationFreezePlatform.ownership.neverOwns.includes(
      "orchestration execution",
    ),
    true,
  );
});
