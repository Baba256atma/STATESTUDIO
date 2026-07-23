/**
 * EIL-8:8 — Executive Integration Suite Freeze Tests.
 *
 * Deterministic architectural coverage for the immutable Freeze phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as PackageModule from "./index.ts";
import {
  ExecutiveIntegrationSuiteCertification,
  ExecutiveIntegrationSuiteCertificationCanonicalId,
} from "./executiveIntegrationSuiteCertification.ts";
import {
  ExecutiveIntegrationSuiteFreeze,
  ExecutiveIntegrationSuiteFreezeArchitecture,
  ExecutiveIntegrationSuiteFreezeBaselines,
  ExecutiveIntegrationSuiteFreezeCompatibility,
  ExecutiveIntegrationSuiteFreezeExtensions,
  ExecutiveIntegrationSuiteFreezeIdentity,
  ExecutiveIntegrationSuiteFreezeLockId,
  ExecutiveIntegrationSuiteFreezeLocks,
  ExecutiveIntegrationSuiteFreezeReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL88_FILES = Object.freeze([
  "executiveIntegrationSuiteFreeze.ts",
  "executiveIntegrationSuiteFreezeIdentity.ts",
  "executiveIntegrationSuiteFreezeLocks.ts",
  "executiveIntegrationSuiteFreezeBaselines.ts",
  "executiveIntegrationSuiteFreezeCompatibility.ts",
  "executiveIntegrationSuiteFreezeExtensions.ts",
  "executiveIntegrationSuiteFreezeArchitecture.ts",
  "executiveIntegrationSuiteFreeze.test.ts",
]);

const REQUIRED_FREEZE_EXPORTS = Object.freeze([
  "ExecutiveIntegrationSuiteFreezeIdentity",
  "ExecutiveIntegrationSuiteFreeze",
  "ExecutiveIntegrationSuiteFreezeLocks",
  "ExecutiveIntegrationSuiteFreezeBaselines",
  "ExecutiveIntegrationSuiteFreezeCompatibility",
  "ExecutiveIntegrationSuiteFreezeExtensions",
  "ExecutiveIntegrationSuiteFreezeArchitecture",
  "ExecutiveIntegrationSuiteFreezeLockId",
  "ExecutiveIntegrationSuiteFreezeCanonicalId",
] as const);

const EXPECTED_LOCK_KEYS = Object.freeze([
  "CanonicalIdentity",
  "Namespace",
  "DependencyChain",
  "FoundationIntegrity",
  "RegistryIntegrity",
  "ModelIntegrity",
  "ValidationIntegrity",
  "ManifestIntegrity",
  "PlatformIntegrity",
  "CertificationIntegrity",
  "MetadataImmutability",
  "InventoryIntegrity",
  "ExportIntegrity",
  "RuntimeIndependence",
  "FreezeIntegrity",
  "PublicIndexReadiness",
] as const);

const EXPECTED_BASELINE_KEYS = Object.freeze([
  "IdentityBaseline",
  "DependencyBaseline",
  "MetadataBaseline",
  "ValidationBaseline",
  "ManifestBaseline",
  "PlatformBaseline",
  "CertificationBaseline",
  "FreezeBaseline",
] as const);

const EXPECTED_COMPATIBILITY_KEYS = Object.freeze([
  "FoundationCompatible",
  "RegistryCompatible",
  "ModelCompatible",
  "ValidationCompatible",
  "ManifestCompatible",
  "PlatformCompatible",
  "CertificationCompatible",
  "PublicIndexCompatible",
] as const);

const EXPECTED_EXTENSION_KEYS = Object.freeze([
  "PreserveFrozenContract",
  "NoFrozenMetadataMutation",
  "BackwardCompatibleOnly",
  "CanonicalArchitecturePreserved",
  "NoRuntimeIntroduction",
  "InventoryDerivationPreserved",
  "PackageEntryPreserved",
  "LockIdPreserved",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/executiveIntegrationSuitePublicIndex/,
  /from ["']\.\/executiveIntegrationSuiteFoundation\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteRegistry\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteModel\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteValidation\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteManifest\.ts["']/,
  /from ["']\.\/executiveIntegrationSuitePlatform\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteCertification(Identity|Criteria|Gates|Results|Dependencies|Readiness)\.ts["']/,
  /from ["']\.\.\/integration/,
  /from ["']react["']/,
  /from ["']next\//,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

const assertSequentialOrders = (
  orders: readonly number[],
  label: string,
): void => {
  assert.deepEqual(
    orders,
    Array.from({ length: orders.length }, (_, index) => index + 1),
    `${label} orders must be sequential starting at 1`,
  );
};

describe("EIL-8:8 Executive Integration Suite Freeze", () => {
  it("creates exactly eight Freeze files", () => {
    assert.equal(EIL88_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL88_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, lock ID, Frozen status, and ReadyForPublicIndex", () => {
    assert.equal(ExecutiveIntegrationSuiteFreezeIdentity.phaseId, "EIL-8:8");
    assert.equal(
      ExecutiveIntegrationSuiteFreezeIdentity.canonicalId,
      "EIL-8:8/ExecutiveIntegrationSuiteFreeze",
    );
    assert.equal(
      ExecutiveIntegrationSuiteFreezeIdentity.name,
      "Executive Integration Suite Freeze",
    );
    assert.equal(ExecutiveIntegrationSuiteFreezeIdentity.version, "1.0.0");
    assert.equal(
      ExecutiveIntegrationSuiteFreezeIdentity.namespace,
      "nexora.eil.executive-integration-suite.freeze",
    );
    assert.equal(ExecutiveIntegrationSuiteFreezeIdentity.status, "Frozen");
    assert.equal(
      ExecutiveIntegrationSuiteFreezeIdentity.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ExecutiveIntegrationSuiteFreezeReadinessValue,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ExecutiveIntegrationSuiteFreezeLockId,
      "EIL-8-EXECUTIVE-INTEGRATION-SUITE-LOCKED",
    );
    assert.equal(
      ExecutiveIntegrationSuiteFreezeIdentity.lockId,
      ExecutiveIntegrationSuiteFreezeLockId,
    );
    assert.equal(
      ExecutiveIntegrationSuiteFreezeIdentity.certificationDependency,
      ExecutiveIntegrationSuiteCertificationCanonicalId,
    );
  });

  it("consumes Certification aggregate as the sole upstream dependency", () => {
    assert.equal(
      ExecutiveIntegrationSuiteFreeze.dependency.certificationOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteFreeze.dependency.upstreamCanonicalId,
      ExecutiveIntegrationSuiteCertificationCanonicalId,
    );
    assert.equal(
      ExecutiveIntegrationSuiteFreeze.certificationReference.aggregate,
      ExecutiveIntegrationSuiteCertification,
    );
    assert.equal(
      ExecutiveIntegrationSuiteFreeze.dependency.publicIndexDependency,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuiteFreeze.dependency.platformDirectImport,
      false,
    );
  });

  it("publishes 16 locks, 8 baselines, 8 compatibility, and 8 extension declarations", () => {
    assert.equal(ExecutiveIntegrationSuiteFreezeLocks.length, 16);
    assert.equal(ExecutiveIntegrationSuiteFreezeBaselines.length, 8);
    assert.equal(ExecutiveIntegrationSuiteFreezeCompatibility.length, 8);
    assert.equal(ExecutiveIntegrationSuiteFreezeExtensions.length, 8);

    assert.deepEqual(
      ExecutiveIntegrationSuiteFreezeLocks.map((item) => item.canonicalKey),
      [...EXPECTED_LOCK_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteFreezeBaselines.map((item) => item.canonicalKey),
      [...EXPECTED_BASELINE_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteFreezeCompatibility.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_COMPATIBILITY_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteFreezeExtensions.map((item) => item.canonicalKey),
      [...EXPECTED_EXTENSION_KEYS],
    );

    assertUnique(
      ExecutiveIntegrationSuiteFreezeLocks.map((item) => item.lockRecordId),
      "lock IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuiteFreezeBaselines.map((item) => item.baselineId),
      "baseline IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuiteFreezeCompatibility.map(
        (item) => item.compatibilityId,
      ),
      "compatibility IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuiteFreezeExtensions.map((item) => item.extensionId),
      "extension IDs",
    );

    assertSequentialOrders(
      ExecutiveIntegrationSuiteFreezeLocks.map((item) => item.order),
      "locks",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteFreezeBaselines.map((item) => item.order),
      "baselines",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteFreezeCompatibility.map((item) => item.order),
      "compatibility",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteFreezeExtensions.map((item) => item.order),
      "extensions",
    );

    assert.ok(
      ExecutiveIntegrationSuiteFreezeExtensions.every(
        (item) =>
          item.preservesFrozenContract &&
          item.cannotModifyFrozenMetadata &&
          item.mustRemainBackwardCompatible &&
          item.mustNotViolateCanonicalArchitecture &&
          item.implementsExtension === false,
      ),
    );
  });

  it("exposes deeply immutable freeze architecture with Certification inventory references", () => {
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuiteFreeze), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteFreezeArchitecture),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteFreezeIdentity),
      true,
    );
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuiteFreezeLocks), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteFreezeBaselines),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteFreezeCompatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteFreezeExtensions),
      true,
    );

    assert.equal(ExecutiveIntegrationSuiteFreeze.deeplyImmutable, true);
    assert.equal(
      ExecutiveIntegrationSuiteFreezeArchitecture.deeplyImmutable,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteFreeze.architecture,
      ExecutiveIntegrationSuiteFreezeArchitecture,
    );
    assert.equal(
      ExecutiveIntegrationSuiteFreezeArchitecture.lockId,
      ExecutiveIntegrationSuiteFreezeLockId,
    );

    const derived =
      ExecutiveIntegrationSuiteFreeze.certificationDerivedInventory;
    assert.equal(derived.countsDerivedFromCertification, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.platformDerivedInventory,
      ExecutiveIntegrationSuiteCertification.platformDerivedInventory,
    );
    assert.equal(
      derived.certificationAggregateResult,
      ExecutiveIntegrationSuiteCertification.aggregateResult,
    );
    assert.equal(derived.certificationAggregateResult, "Pass");
    assert.equal(derived.validationAggregateResult, "Pass");
  });

  it("exposes package Freeze surface", () => {
    for (const exportName of REQUIRED_FREEZE_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime integration behavior", () => {
    const freeze = ExecutiveIntegrationSuiteFreeze;
    assert.equal(freeze.metadataOnly, true);
    assert.equal(freeze.compositionOnly, true);
    assert.equal(freeze.runtimeBehavior, false);
    assert.equal(freeze.integrationRuntime, false);
    assert.equal(freeze.orchestration, false);
    assert.equal(freeze.routing, false);
    assert.equal(freeze.governance, false);
    assert.equal(freeze.observability, false);
    assert.equal(freeze.certificationEngine, false);
    assert.equal(freeze.dashboard, false);
    assert.equal(freeze.networkingBehavior, false);
    assert.equal(freeze.persistenceBehavior, false);
    assert.equal(freeze.reactBehavior, false);
    assert.equal(freeze.stateMutation, false);
    assert.equal(freeze.importsLaterEil8Phases, false);
  });

  it("has zero prohibited imports across freeze sources", () => {
    const sources = EIL88_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(join(HERE, file), "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.doesNotMatch(
          source,
          pattern,
          `${file} must not match ${pattern}`,
        );
      }
      assert.doesNotMatch(source, /\b(fetch|axios|http\.request)\b/);
      assert.doesNotMatch(source, /\b(setTimeout|setInterval)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
      assert.match(
        source,
        /from ["']\.\/executiveIntegrationSuiteCertification\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for freeze sources", () => {
    const sources = EIL88_FILES.filter((name) => !name.endsWith(".test.ts")).map(
      (name) => join("app/lib/eil/executiveIntegrationSuite", name),
    );

    const tsc = spawnSync(
      join(FRONTEND_ROOT, "node_modules/.bin/tsc"),
      [
        "--strict",
        "--noEmit",
        "--pretty",
        "false",
        "--allowImportingTsExtensions",
        "--module",
        "esnext",
        "--moduleResolution",
        "bundler",
        "--target",
        "ES2021",
        "--esModuleInterop",
        "--skipLibCheck",
        "--types",
        "node",
        ...sources,
        "app/lib/eil/executiveIntegrationSuite/index.ts",
        "app/lib/eil/executiveIntegrationSuite/executiveIntegrationSuiteCertification.ts",
      ],
      {
        cwd: FRONTEND_ROOT,
        encoding: "utf8",
      },
    );
    assert.equal(
      tsc.status,
      0,
      `TypeScript failed:\n${tsc.stdout}\n${tsc.stderr}`,
    );

    const eslint = spawnSync(
      join(FRONTEND_ROOT, "node_modules/.bin/eslint"),
      [...sources, "app/lib/eil/executiveIntegrationSuite/index.ts"],
      {
        cwd: FRONTEND_ROOT,
        encoding: "utf8",
      },
    );
    assert.equal(
      eslint.status,
      0,
      `ESLint failed:\n${eslint.stdout}\n${eslint.stderr}`,
    );
  });
});
