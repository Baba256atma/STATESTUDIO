/**
 * EIL-6:5 — Integration Observability Manifest Tests.
 *
 * Deterministic architectural coverage for the immutable Manifest phase.
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
  IntegrationObservabilityValidation,
  IntegrationObservabilityValidationCanonicalId,
} from "./integrationObservabilityValidation.ts";
import {
  IntegrationObservabilityManifest,
  IntegrationObservabilityManifestCompatibility,
  IntegrationObservabilityManifestDependencies,
  IntegrationObservabilityManifestExports,
  IntegrationObservabilityManifestGuarantees,
  IntegrationObservabilityManifestIdentity,
  IntegrationObservabilityManifestReadiness,
  IntegrationObservabilityManifestReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL65_FILES = Object.freeze([
  "integrationObservabilityManifest.ts",
  "integrationObservabilityManifestIdentity.ts",
  "integrationObservabilityManifestReadiness.ts",
  "integrationObservabilityManifestCompatibility.ts",
  "integrationObservabilityManifestGuarantees.ts",
  "integrationObservabilityManifestDependencies.ts",
  "integrationObservabilityManifestExports.ts",
  "integrationObservabilityManifest.test.ts",
]);

const REQUIRED_MANIFEST_EXPORTS = Object.freeze([
  "IntegrationObservabilityManifestIdentity",
  "IntegrationObservabilityManifest",
  "IntegrationObservabilityManifestGuarantees",
  "IntegrationObservabilityManifestCompatibility",
  "IntegrationObservabilityManifestDependencies",
  "IntegrationObservabilityManifestExports",
  "IntegrationObservabilityManifestReadiness",
  "IntegrationObservabilityManifestCanonicalId",
] as const);

const EXPECTED_GUARANTEE_KEYS = Object.freeze([
  "CanonicalIdentityGuaranteed",
  "NamespaceGuaranteed",
  "DependencyIntegrityGuaranteed",
  "ValidationComplete",
  "InventoryDerived",
  "ImmutableMetadata",
  "DeterministicOrdering",
  "StablePublicSurface",
  "RuntimeIndependence",
  "TypeSafety",
  "ExportIntegrity",
  "ArchitectureConsistency",
  "ReadinessIntegrity",
  "ValidationPassGuaranteed",
  "ManifestCompleteness",
  "PlatformReadiness",
] as const);

const EXPECTED_COMPATIBILITY_KEYS = Object.freeze([
  "FoundationCompatible",
  "RegistryCompatible",
  "ModelCompatible",
  "ValidationCompatible",
  "FuturePlatformCompatible",
  "CertificationCompatible",
  "FreezeCompatible",
  "PublicIndexCompatible",
  "TypeScriptCompatible",
  "ESLintCompatible",
  "MetadataCompatible",
  "CanonicalArchitectureCompatible",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationObservability(Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\/integrationObservabilityFoundation\.ts["']/,
  /from ["']\.\/integrationObservabilityRegistry\.ts["']/,
  /from ["']\.\/integrationObservabilityModel\.ts["']/,
  /from ["']\.\/integrationObservabilityValidation(Rules|Categories|Results|Gates|Inventory|Report)\.ts["']/,
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

describe("EIL-6:5 Integration Observability Manifest", () => {
  it("creates exactly eight Manifest files", () => {
    assert.equal(EIL65_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL65_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Manifest status, and ReadyForPlatform", () => {
    assert.equal(IntegrationObservabilityManifestIdentity.phaseId, "EIL-6:5");
    assert.equal(
      IntegrationObservabilityManifestIdentity.canonicalId,
      "EIL-6:5/IntegrationObservabilityManifest",
    );
    assert.equal(
      IntegrationObservabilityManifestIdentity.name,
      "Integration Observability Manifest",
    );
    assert.equal(IntegrationObservabilityManifestIdentity.version, "1.0.0");
    assert.equal(
      IntegrationObservabilityManifestIdentity.namespace,
      "nexora.eil.integration-observability.manifest",
    );
    assert.equal(IntegrationObservabilityManifestIdentity.status, "Manifest");
    assert.equal(
      IntegrationObservabilityManifestIdentity.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationObservabilityManifestReadinessValue,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationObservabilityManifestReadiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationObservabilityManifestIdentity.validationDependency,
      IntegrationObservabilityValidationCanonicalId,
    );
  });

  it("consumes Validation aggregate as the sole upstream dependency", () => {
    assert.equal(
      IntegrationObservabilityManifestDependencies.validationOnly,
      true,
    );
    assert.equal(
      IntegrationObservabilityManifestDependencies.upstreamCanonicalId,
      IntegrationObservabilityValidationCanonicalId,
    );
    assert.equal(
      IntegrationObservabilityManifest.validationReference.aggregate,
      IntegrationObservabilityValidation,
    );
    assert.equal(
      IntegrationObservabilityManifestDependencies.modelDirectImport,
      false,
    );
    assert.equal(
      IntegrationObservabilityManifestDependencies.registryDirectImport,
      false,
    );
    assert.equal(
      IntegrationObservabilityManifestDependencies.laterEil6PhaseImport,
      false,
    );
    assert.equal(
      IntegrationObservabilityManifestDependencies.downstreamImplementationDependency,
      false,
    );
  });

  it("publishes exactly 16 guarantees and 12 compatibility declarations", () => {
    assert.equal(IntegrationObservabilityManifestGuarantees.length, 16);
    assert.equal(IntegrationObservabilityManifestCompatibility.length, 12);
    assert.deepEqual(
      IntegrationObservabilityManifestGuarantees.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_GUARANTEE_KEYS],
    );
    assert.deepEqual(
      IntegrationObservabilityManifestCompatibility.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_COMPATIBILITY_KEYS],
    );
    assertUnique(
      IntegrationObservabilityManifestGuarantees.map(
        (item) => item.guaranteeId,
      ),
      "guarantee IDs",
    );
    assertUnique(
      IntegrationObservabilityManifestCompatibility.map(
        (item) => item.compatibilityId,
      ),
      "compatibility IDs",
    );
    assertSequentialOrders(
      IntegrationObservabilityManifestGuarantees.map((item) => item.order),
      "guarantees",
    );
    assertSequentialOrders(
      IntegrationObservabilityManifestCompatibility.map((item) => item.order),
      "compatibility",
    );
  });

  it("derives inventory exclusively from Validation without redefining counts", () => {
    const derived = IntegrationObservabilityManifest.validationDerivedInventory;
    assert.equal(derived.countsDerivedFromValidation, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.validationCategories,
      IntegrationObservabilityValidation.categories,
    );
    assert.equal(
      derived.validationRules,
      IntegrationObservabilityValidation.rules,
    );
    assert.equal(
      derived.validationGates,
      IntegrationObservabilityValidation.gates,
    );
    assert.equal(
      derived.validationInventory,
      IntegrationObservabilityValidation.inventory,
    );
    assert.equal(
      derived.categoryCount,
      IntegrationObservabilityValidation.categories.length,
    );
    assert.equal(
      derived.ruleCount,
      IntegrationObservabilityValidation.rules.length,
    );
    assert.equal(
      derived.gateCount,
      IntegrationObservabilityValidation.gates.length,
    );
    assert.equal(
      derived.totalValidationInventory,
      IntegrationObservabilityValidation.inventory.totalValidationInventory,
    );
    assert.equal(
      derived.validationAggregateResult,
      IntegrationObservabilityValidation.aggregateResult,
    );
    assert.equal(
      derived.validationReadiness,
      IntegrationObservabilityValidation.readiness,
    );
    assert.equal(derived.validationAggregateResult, "Pass");
    assert.equal(derived.validationReadiness, "ReadyForManifest");
  });

  it("exposes an immutable aggregate Manifest and package Manifest surface", () => {
    assert.equal(Object.isFrozen(IntegrationObservabilityManifest), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityManifestIdentity), true);
    assert.equal(
      Object.isFrozen(IntegrationObservabilityManifestGuarantees),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityManifestCompatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityManifestDependencies),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationObservabilityManifestExports), true);
    assert.equal(
      Object.isFrozen(IntegrationObservabilityManifestReadiness),
      true,
    );

    assert.equal(
      IntegrationObservabilityManifest.guarantees,
      IntegrationObservabilityManifestGuarantees,
    );
    assert.equal(
      IntegrationObservabilityManifest.compatibility,
      IntegrationObservabilityManifestCompatibility,
    );
    assert.equal(
      IntegrationObservabilityManifest.dependencies,
      IntegrationObservabilityManifestDependencies,
    );
    assert.equal(
      IntegrationObservabilityManifest.exports,
      IntegrationObservabilityManifestExports,
    );
    assert.equal(
      IntegrationObservabilityManifestExports.packageEntryOnly,
      true,
    );
    assert.equal(
      IntegrationObservabilityManifestExports.additionalPackageRoot,
      false,
    );

    for (const exportName of REQUIRED_MANIFEST_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime observability behavior", () => {
    const manifest = IntegrationObservabilityManifest;
    assert.equal(manifest.metadataOnly, true);
    assert.equal(manifest.runtimeBehavior, false);
    assert.equal(manifest.monitoringEngine, false);
    assert.equal(manifest.telemetryPipeline, false);
    assert.equal(manifest.openTelemetry, false);
    assert.equal(manifest.prometheus, false);
    assert.equal(manifest.grafana, false);
    assert.equal(manifest.loggingFramework, false);
    assert.equal(manifest.tracingRuntime, false);
    assert.equal(manifest.metricsCollector, false);
    assert.equal(manifest.alertEngine, false);
    assert.equal(manifest.healthEngine, false);
    assert.equal(manifest.dashboard, false);
    assert.equal(manifest.networkingBehavior, false);
    assert.equal(manifest.persistenceBehavior, false);
    assert.equal(manifest.runtimeValidation, false);
    assert.equal(manifest.reactBehavior, false);
    assert.equal(manifest.stateMutation, false);
    assert.equal(manifest.importsLaterEil6Phases, false);
  });

  it("has zero prohibited imports across manifest sources", () => {
    const sources = EIL65_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/integrationObservabilityValidation\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for manifest sources", () => {
    const sources = EIL65_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationObservability/integrationObservabilityValidation.ts",
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
