/**
 * EIL-6:8 — Integration Observability Freeze Tests.
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
  IntegrationObservabilityCertification,
  IntegrationObservabilityCertificationCanonicalId,
} from "./integrationObservabilityCertification.ts";
import {
  IntegrationObservabilityFreeze,
  IntegrationObservabilityFreezeArchitecture,
  IntegrationObservabilityFreezeBaselines,
  IntegrationObservabilityFreezeCompatibility,
  IntegrationObservabilityFreezeExtensions,
  IntegrationObservabilityFreezeIdentity,
  IntegrationObservabilityFreezeLockId,
  IntegrationObservabilityFreezeLocks,
  IntegrationObservabilityFreezeReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL68_FILES = Object.freeze([
  "integrationObservabilityFreeze.ts",
  "integrationObservabilityFreezeIdentity.ts",
  "integrationObservabilityFreezeLocks.ts",
  "integrationObservabilityFreezeBaselines.ts",
  "integrationObservabilityFreezeCompatibility.ts",
  "integrationObservabilityFreezeExtensions.ts",
  "integrationObservabilityFreezeArchitecture.ts",
  "integrationObservabilityFreeze.test.ts",
]);

const REQUIRED_FREEZE_EXPORTS = Object.freeze([
  "IntegrationObservabilityFreezeIdentity",
  "IntegrationObservabilityFreeze",
  "IntegrationObservabilityFreezeLocks",
  "IntegrationObservabilityFreezeBaselines",
  "IntegrationObservabilityFreezeCompatibility",
  "IntegrationObservabilityFreezeExtensions",
  "IntegrationObservabilityFreezeArchitecture",
  "IntegrationObservabilityFreezeLockId",
  "IntegrationObservabilityFreezeCanonicalId",
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
  /from ["']\.\/integrationObservabilityPublicIndex/,
  /from ["']\.\/integrationObservabilityFoundation\.ts["']/,
  /from ["']\.\/integrationObservabilityRegistry\.ts["']/,
  /from ["']\.\/integrationObservabilityModel\.ts["']/,
  /from ["']\.\/integrationObservabilityValidation\.ts["']/,
  /from ["']\.\/integrationObservabilityManifest\.ts["']/,
  /from ["']\.\/integrationObservabilityPlatform\.ts["']/,
  /from ["']\.\/integrationObservabilityCertification(Identity|Criteria|Gates|Results|Dependencies|Readiness)\.ts["']/,
  /from ["']\.\.\/integration(?!Observability)/,
  /from ["']\.\.\/integrationPolicyGovernance/,
  /from ["']\.\.\/integrationOrchestration/,
  /from ["']@opentelemetry\//,
  /from ["']prom-client["']/,
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

describe("EIL-6:8 Integration Observability Freeze", () => {
  it("creates exactly eight Freeze files", () => {
    assert.equal(EIL68_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL68_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, lock ID, Frozen status, and ReadyForPublicIndex", () => {
    assert.equal(IntegrationObservabilityFreezeIdentity.phaseId, "EIL-6:8");
    assert.equal(
      IntegrationObservabilityFreezeIdentity.canonicalId,
      "EIL-6:8/IntegrationObservabilityFreeze",
    );
    assert.equal(
      IntegrationObservabilityFreezeIdentity.name,
      "Integration Observability Freeze",
    );
    assert.equal(IntegrationObservabilityFreezeIdentity.version, "1.0.0");
    assert.equal(
      IntegrationObservabilityFreezeIdentity.namespace,
      "nexora.eil.integration-observability.freeze",
    );
    assert.equal(IntegrationObservabilityFreezeIdentity.status, "Frozen");
    assert.equal(
      IntegrationObservabilityFreezeIdentity.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      IntegrationObservabilityFreezeReadinessValue,
      "ReadyForPublicIndex",
    );
    assert.equal(
      IntegrationObservabilityFreezeLockId,
      "EIL-6-INTEGRATION-OBSERVABILITY-LOCKED",
    );
    assert.equal(
      IntegrationObservabilityFreezeIdentity.lockId,
      IntegrationObservabilityFreezeLockId,
    );
    assert.equal(
      IntegrationObservabilityFreezeIdentity.certificationDependency,
      IntegrationObservabilityCertificationCanonicalId,
    );
  });

  it("consumes Certification aggregate as the sole upstream dependency", () => {
    assert.equal(IntegrationObservabilityFreeze.dependency.certificationOnly, true);
    assert.equal(
      IntegrationObservabilityFreeze.dependency.upstreamCanonicalId,
      IntegrationObservabilityCertificationCanonicalId,
    );
    assert.equal(
      IntegrationObservabilityFreeze.certificationReference.aggregate,
      IntegrationObservabilityCertification,
    );
    assert.equal(
      IntegrationObservabilityFreeze.dependency.publicIndexDependency,
      false,
    );
    assert.equal(
      IntegrationObservabilityFreeze.dependency.platformDirectImport,
      false,
    );
  });

  it("publishes 16 locks, 8 baselines, 8 compatibility, and 8 extension declarations", () => {
    assert.equal(IntegrationObservabilityFreezeLocks.length, 16);
    assert.equal(IntegrationObservabilityFreezeBaselines.length, 8);
    assert.equal(IntegrationObservabilityFreezeCompatibility.length, 8);
    assert.equal(IntegrationObservabilityFreezeExtensions.length, 8);

    assert.deepEqual(
      IntegrationObservabilityFreezeLocks.map((item) => item.canonicalKey),
      [...EXPECTED_LOCK_KEYS],
    );
    assert.deepEqual(
      IntegrationObservabilityFreezeBaselines.map((item) => item.canonicalKey),
      [...EXPECTED_BASELINE_KEYS],
    );
    assert.deepEqual(
      IntegrationObservabilityFreezeCompatibility.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_COMPATIBILITY_KEYS],
    );
    assert.deepEqual(
      IntegrationObservabilityFreezeExtensions.map((item) => item.canonicalKey),
      [...EXPECTED_EXTENSION_KEYS],
    );

    assertUnique(
      IntegrationObservabilityFreezeLocks.map((item) => item.lockRecordId),
      "lock IDs",
    );
    assertUnique(
      IntegrationObservabilityFreezeBaselines.map((item) => item.baselineId),
      "baseline IDs",
    );
    assertUnique(
      IntegrationObservabilityFreezeCompatibility.map(
        (item) => item.compatibilityId,
      ),
      "compatibility IDs",
    );
    assertUnique(
      IntegrationObservabilityFreezeExtensions.map((item) => item.extensionId),
      "extension IDs",
    );

    assertSequentialOrders(
      IntegrationObservabilityFreezeLocks.map((item) => item.order),
      "locks",
    );
    assertSequentialOrders(
      IntegrationObservabilityFreezeBaselines.map((item) => item.order),
      "baselines",
    );
    assertSequentialOrders(
      IntegrationObservabilityFreezeCompatibility.map((item) => item.order),
      "compatibility",
    );
    assertSequentialOrders(
      IntegrationObservabilityFreezeExtensions.map((item) => item.order),
      "extensions",
    );

    assert.ok(
      IntegrationObservabilityFreezeExtensions.every(
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
    assert.equal(Object.isFrozen(IntegrationObservabilityFreeze), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityFreezeArchitecture), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityFreezeIdentity), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityFreezeLocks), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityFreezeBaselines), true);
    assert.equal(
      Object.isFrozen(IntegrationObservabilityFreezeCompatibility),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationObservabilityFreezeExtensions), true);

    assert.equal(IntegrationObservabilityFreeze.deeplyImmutable, true);
    assert.equal(
      IntegrationObservabilityFreezeArchitecture.deeplyImmutable,
      true,
    );
    assert.equal(
      IntegrationObservabilityFreeze.architecture,
      IntegrationObservabilityFreezeArchitecture,
    );
    assert.equal(
      IntegrationObservabilityFreezeArchitecture.lockId,
      IntegrationObservabilityFreezeLockId,
    );

    const derived = IntegrationObservabilityFreeze.certificationDerivedInventory;
    assert.equal(derived.countsDerivedFromCertification, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.platformDerivedInventory,
      IntegrationObservabilityCertification.platformDerivedInventory,
    );
    assert.equal(
      derived.certificationAggregateResult,
      IntegrationObservabilityCertification.aggregateResult,
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

  it("is metadata-only with zero runtime observability behavior", () => {
    const freeze = IntegrationObservabilityFreeze;
    assert.equal(freeze.metadataOnly, true);
    assert.equal(freeze.runtimeBehavior, false);
    assert.equal(freeze.monitoringEngine, false);
    assert.equal(freeze.telemetryPipeline, false);
    assert.equal(freeze.openTelemetry, false);
    assert.equal(freeze.prometheus, false);
    assert.equal(freeze.grafana, false);
    assert.equal(freeze.loggingFramework, false);
    assert.equal(freeze.tracingRuntime, false);
    assert.equal(freeze.metricsEngine, false);
    assert.equal(freeze.alertEngine, false);
    assert.equal(freeze.healthEngine, false);
    assert.equal(freeze.dashboard, false);
    assert.equal(freeze.networkingBehavior, false);
    assert.equal(freeze.persistenceBehavior, false);
    assert.equal(freeze.reactBehavior, false);
    assert.equal(freeze.stateMutation, false);
    assert.equal(freeze.importsLaterEil6Phases, false);
  });

  it("has zero prohibited imports across freeze sources", () => {
    const sources = EIL68_FILES.filter((name) => !name.endsWith(".test.ts"));
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
      assert.doesNotMatch(source, /\b(setTimeout|setInterval|Promise)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
      assert.match(
        source,
        /from ["']\.\/integrationObservabilityCertification\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for freeze sources", () => {
    const sources = EIL68_FILES.filter((name) => !name.endsWith(".test.ts")).map(
      (name) => join("app/lib/eil/integrationObservability", name),
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
        "ES2017",
        "--esModuleInterop",
        "--skipLibCheck",
        "--types",
        "node",
        ...sources,
        "app/lib/eil/integrationObservability/index.ts",
        "app/lib/eil/integrationObservability/integrationObservabilityCertification.ts",
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
      [...sources, "app/lib/eil/integrationObservability/index.ts"],
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
