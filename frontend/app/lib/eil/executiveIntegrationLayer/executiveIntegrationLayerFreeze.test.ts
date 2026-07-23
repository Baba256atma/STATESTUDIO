/**
 * EIL-9:8 — Executive Integration Layer Freeze Tests.
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
  ExecutiveIntegrationLayerCertification,
  ExecutiveIntegrationLayerCertificationCanonicalId,
} from "./executiveIntegrationLayerCertification.ts";
import {
  ExecutiveIntegrationLayerFreeze,
  ExecutiveIntegrationLayerFreezeArchitecture,
  ExecutiveIntegrationLayerFreezeBaselines,
  ExecutiveIntegrationLayerFreezeCompatibility,
  ExecutiveIntegrationLayerFreezeExtensions,
  ExecutiveIntegrationLayerFreezeIdentity,
  ExecutiveIntegrationLayerFreezeLockId,
  ExecutiveIntegrationLayerFreezeLocks,
  ExecutiveIntegrationLayerFreezeReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL98_FILES = Object.freeze([
  "executiveIntegrationLayerFreeze.ts",
  "executiveIntegrationLayerFreezeIdentity.ts",
  "executiveIntegrationLayerFreezeLocks.ts",
  "executiveIntegrationLayerFreezeBaselines.ts",
  "executiveIntegrationLayerFreezeCompatibility.ts",
  "executiveIntegrationLayerFreezeExtensions.ts",
  "executiveIntegrationLayerFreezeArchitecture.ts",
  "executiveIntegrationLayerFreeze.test.ts",
]);

const REQUIRED_FREEZE_EXPORTS = Object.freeze([
  "ExecutiveIntegrationLayerFreezeIdentity",
  "ExecutiveIntegrationLayerFreeze",
  "ExecutiveIntegrationLayerFreezeLocks",
  "ExecutiveIntegrationLayerFreezeBaselines",
  "ExecutiveIntegrationLayerFreezeCompatibility",
  "ExecutiveIntegrationLayerFreezeExtensions",
  "ExecutiveIntegrationLayerFreezeArchitecture",
  "ExecutiveIntegrationLayerFreezeLockId",
  "ExecutiveIntegrationLayerFreezeCanonicalId",
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
  /from ["']\.\/executiveIntegrationLayerPublicIndex/,
  /from ["']\.\/executiveIntegrationLayerFoundation\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerRegistry\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerModel\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerValidation\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerManifest\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerPlatform\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerCertification(Identity|Criteria|Gates|Results|Dependencies|Readiness)\.ts["']/,
  /from ["']\.\.\/executiveIntegrationSuite/,
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

describe("EIL-9:8 Executive Integration Layer Freeze", () => {
  it("creates exactly eight Freeze files", () => {
    assert.equal(EIL98_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL98_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, lock ID, Frozen status, and ReadyForPublicIndex", () => {
    assert.equal(ExecutiveIntegrationLayerFreezeIdentity.phaseId, "EIL-9:8");
    assert.equal(
      ExecutiveIntegrationLayerFreezeIdentity.canonicalId,
      "EIL-9:8/ExecutiveIntegrationLayerFreeze",
    );
    assert.equal(
      ExecutiveIntegrationLayerFreezeIdentity.name,
      "Executive Integration Layer Freeze",
    );
    assert.equal(ExecutiveIntegrationLayerFreezeIdentity.version, "1.0.0");
    assert.equal(
      ExecutiveIntegrationLayerFreezeIdentity.namespace,
      "nexora.eil.executive-integration-layer.freeze",
    );
    assert.equal(ExecutiveIntegrationLayerFreezeIdentity.status, "Frozen");
    assert.equal(
      ExecutiveIntegrationLayerFreezeIdentity.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ExecutiveIntegrationLayerFreezeReadinessValue,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ExecutiveIntegrationLayerFreezeLockId,
      "EIL-9-EXECUTIVE-INTEGRATION-LAYER-LOCKED",
    );
    assert.equal(
      ExecutiveIntegrationLayerFreezeIdentity.lockId,
      ExecutiveIntegrationLayerFreezeLockId,
    );
    assert.equal(
      ExecutiveIntegrationLayerFreezeIdentity.certificationDependency,
      ExecutiveIntegrationLayerCertificationCanonicalId,
    );
  });

  it("consumes Certification aggregate as the sole upstream dependency", () => {
    assert.equal(
      ExecutiveIntegrationLayerFreeze.dependency.certificationOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerFreeze.dependency.upstreamCanonicalId,
      ExecutiveIntegrationLayerCertificationCanonicalId,
    );
    assert.equal(
      ExecutiveIntegrationLayerFreeze.certificationReference.aggregate,
      ExecutiveIntegrationLayerCertification,
    );
    assert.equal(
      ExecutiveIntegrationLayerFreeze.dependency.publicIndexDependency,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerFreeze.dependency.platformDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerFreeze.dependency.eil8DirectImport,
      false,
    );
  });

  it("publishes 16 locks, 8 baselines, 8 compatibility, and 8 extension declarations", () => {
    assert.equal(ExecutiveIntegrationLayerFreezeLocks.length, 16);
    assert.equal(ExecutiveIntegrationLayerFreezeBaselines.length, 8);
    assert.equal(ExecutiveIntegrationLayerFreezeCompatibility.length, 8);
    assert.equal(ExecutiveIntegrationLayerFreezeExtensions.length, 8);

    assert.deepEqual(
      ExecutiveIntegrationLayerFreezeLocks.map((item) => item.canonicalKey),
      [...EXPECTED_LOCK_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerFreezeBaselines.map((item) => item.canonicalKey),
      [...EXPECTED_BASELINE_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerFreezeCompatibility.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_COMPATIBILITY_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerFreezeExtensions.map((item) => item.canonicalKey),
      [...EXPECTED_EXTENSION_KEYS],
    );

    assertUnique(
      ExecutiveIntegrationLayerFreezeLocks.map((item) => item.lockRecordId),
      "lock IDs",
    );
    assertUnique(
      ExecutiveIntegrationLayerFreezeBaselines.map((item) => item.baselineId),
      "baseline IDs",
    );
    assertUnique(
      ExecutiveIntegrationLayerFreezeCompatibility.map(
        (item) => item.compatibilityId,
      ),
      "compatibility IDs",
    );
    assertUnique(
      ExecutiveIntegrationLayerFreezeExtensions.map((item) => item.extensionId),
      "extension IDs",
    );

    assertSequentialOrders(
      ExecutiveIntegrationLayerFreezeLocks.map((item) => item.order),
      "locks",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerFreezeBaselines.map((item) => item.order),
      "baselines",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerFreezeCompatibility.map((item) => item.order),
      "compatibility",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerFreezeExtensions.map((item) => item.order),
      "extensions",
    );

    assert.ok(
      ExecutiveIntegrationLayerFreezeExtensions.every(
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
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerFreeze), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerFreezeArchitecture),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerFreezeIdentity),
      true,
    );
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerFreezeLocks), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerFreezeBaselines),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerFreezeCompatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerFreezeExtensions),
      true,
    );

    assert.equal(ExecutiveIntegrationLayerFreeze.deeplyImmutable, true);
    assert.equal(
      ExecutiveIntegrationLayerFreezeArchitecture.deeplyImmutable,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerFreeze.architecture,
      ExecutiveIntegrationLayerFreezeArchitecture,
    );
    assert.equal(
      ExecutiveIntegrationLayerFreezeArchitecture.lockId,
      ExecutiveIntegrationLayerFreezeLockId,
    );

    const derived =
      ExecutiveIntegrationLayerFreeze.certificationDerivedInventory;
    assert.equal(derived.countsDerivedFromCertification, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.platformDerivedInventory,
      ExecutiveIntegrationLayerCertification.platformDerivedInventory,
    );
    assert.equal(
      derived.certificationAggregateResult,
      ExecutiveIntegrationLayerCertification.aggregateResult,
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
    const freeze = ExecutiveIntegrationLayerFreeze;
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
    assert.equal(freeze.importsLaterEil9Phases, false);
  });

  it("has zero prohibited imports across freeze sources", () => {
    const sources = EIL98_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/executiveIntegrationLayerCertification\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for freeze sources", () => {
    const sources = EIL98_FILES.filter((name) => !name.endsWith(".test.ts")).map(
      (name) => join("app/lib/eil/executiveIntegrationLayer", name),
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
        "app/lib/eil/executiveIntegrationLayer/index.ts",
        "app/lib/eil/executiveIntegrationLayer/executiveIntegrationLayerCertification.ts",
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
      [...sources, "app/lib/eil/executiveIntegrationLayer/index.ts"],
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
