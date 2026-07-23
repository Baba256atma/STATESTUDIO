/**
 * EIL-8:5 — Executive Integration Suite Manifest Tests.
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
  ExecutiveIntegrationSuiteValidation,
  ExecutiveIntegrationSuiteValidationCanonicalId,
} from "./executiveIntegrationSuiteValidation.ts";
import {
  ExecutiveIntegrationSuiteManifest,
  ExecutiveIntegrationSuiteManifestCompatibility,
  ExecutiveIntegrationSuiteManifestDependencies,
  ExecutiveIntegrationSuiteManifestExports,
  ExecutiveIntegrationSuiteManifestGuarantees,
  ExecutiveIntegrationSuiteManifestIdentity,
  ExecutiveIntegrationSuiteManifestReadiness,
  ExecutiveIntegrationSuiteManifestReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL85_FILES = Object.freeze([
  "executiveIntegrationSuiteManifest.ts",
  "executiveIntegrationSuiteManifestIdentity.ts",
  "executiveIntegrationSuiteManifestReadiness.ts",
  "executiveIntegrationSuiteManifestCompatibility.ts",
  "executiveIntegrationSuiteManifestGuarantees.ts",
  "executiveIntegrationSuiteManifestDependencies.ts",
  "executiveIntegrationSuiteManifestExports.ts",
  "executiveIntegrationSuiteManifest.test.ts",
]);

const REQUIRED_MANIFEST_EXPORTS = Object.freeze([
  "ExecutiveIntegrationSuiteManifestIdentity",
  "ExecutiveIntegrationSuiteManifest",
  "ExecutiveIntegrationSuiteManifestGuarantees",
  "ExecutiveIntegrationSuiteManifestCompatibility",
  "ExecutiveIntegrationSuiteManifestDependencies",
  "ExecutiveIntegrationSuiteManifestExports",
  "ExecutiveIntegrationSuiteManifestReadiness",
  "ExecutiveIntegrationSuiteManifestCanonicalId",
] as const);

const EXPECTED_GUARANTEE_KEYS = Object.freeze([
  "CanonicalIdentity",
  "NamespaceIntegrity",
  "DependencyIntegrity",
  "ValidationCompleteness",
  "InventoryIntegrity",
  "MetadataImmutability",
  "DeterministicOrdering",
  "ExportIntegrity",
  "RuntimeIndependence",
  "TypeIntegrity",
  "CompatibilityIntegrity",
  "ArchitectureIntegrity",
  "SuiteCompositionIntegrity",
  "ValidationPass",
  "ManifestCompleteness",
  "PlatformReadiness",
] as const);

const EXPECTED_COMPATIBILITY_KEYS = Object.freeze([
  "FoundationCompatible",
  "RegistryCompatible",
  "ModelCompatible",
  "ValidationCompatible",
  "PlatformCompatible",
  "CertificationCompatible",
  "FreezeCompatible",
  "PublicIndexCompatible",
  "TypeScriptCompatible",
  "ESLintCompatible",
  "MetadataCompatible",
  "CanonicalArchitectureCompatible",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/executiveIntegrationSuite(Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\/executiveIntegrationSuiteFoundation\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteRegistry\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteModel\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteValidation(Rules|Categories|Results|Gates|Inventory|Report)\.ts["']/,
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

describe("EIL-8:5 Executive Integration Suite Manifest", () => {
  it("creates exactly eight Manifest files", () => {
    assert.equal(EIL85_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL85_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Manifest status, and ReadyForPlatform", () => {
    assert.equal(
      ExecutiveIntegrationSuiteManifestIdentity.phaseId,
      "EIL-8:5",
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifestIdentity.canonicalId,
      "EIL-8:5/ExecutiveIntegrationSuiteManifest",
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifestIdentity.name,
      "Executive Integration Suite Manifest",
    );
    assert.equal(ExecutiveIntegrationSuiteManifestIdentity.version, "1.0.0");
    assert.equal(
      ExecutiveIntegrationSuiteManifestIdentity.namespace,
      "nexora.eil.executive-integration-suite.manifest",
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifestIdentity.status,
      "Manifest",
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifestIdentity.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifestReadinessValue,
      "ReadyForPlatform",
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifestReadiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifestIdentity.validationDependency,
      ExecutiveIntegrationSuiteValidationCanonicalId,
    );
  });

  it("consumes Validation aggregate as the sole upstream dependency", () => {
    assert.equal(
      ExecutiveIntegrationSuiteManifestDependencies.validationOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifestDependencies.upstreamCanonicalId,
      ExecutiveIntegrationSuiteValidationCanonicalId,
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifest.validationReference.aggregate,
      ExecutiveIntegrationSuiteValidation,
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifestDependencies.modelDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifestDependencies.registryDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifestDependencies.laterEil8PhaseImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifestDependencies.downstreamImplementationDependency,
      false,
    );
  });

  it("publishes exactly 16 guarantees and 12 compatibility declarations", () => {
    assert.equal(ExecutiveIntegrationSuiteManifestGuarantees.length, 16);
    assert.equal(ExecutiveIntegrationSuiteManifestCompatibility.length, 12);
    assert.deepEqual(
      ExecutiveIntegrationSuiteManifestGuarantees.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_GUARANTEE_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteManifestCompatibility.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_COMPATIBILITY_KEYS],
    );
    assertUnique(
      ExecutiveIntegrationSuiteManifestGuarantees.map(
        (item) => item.guaranteeId,
      ),
      "guarantee IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuiteManifestCompatibility.map(
        (item) => item.compatibilityId,
      ),
      "compatibility IDs",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteManifestGuarantees.map((item) => item.order),
      "guarantees",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteManifestCompatibility.map((item) => item.order),
      "compatibility",
    );
  });

  it("derives inventory exclusively from Validation without redefining counts", () => {
    const derived =
      ExecutiveIntegrationSuiteManifest.validationDerivedInventory;
    assert.equal(derived.countsDerivedFromValidation, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.validationCategories,
      ExecutiveIntegrationSuiteValidation.categories,
    );
    assert.equal(
      derived.validationRules,
      ExecutiveIntegrationSuiteValidation.rules,
    );
    assert.equal(
      derived.validationGates,
      ExecutiveIntegrationSuiteValidation.gates,
    );
    assert.equal(
      derived.validationInventory,
      ExecutiveIntegrationSuiteValidation.inventory,
    );
    assert.equal(
      derived.categoryCount,
      ExecutiveIntegrationSuiteValidation.categories.length,
    );
    assert.equal(
      derived.ruleCount,
      ExecutiveIntegrationSuiteValidation.rules.length,
    );
    assert.equal(
      derived.gateCount,
      ExecutiveIntegrationSuiteValidation.gates.length,
    );
    assert.equal(
      derived.totalValidationInventory,
      ExecutiveIntegrationSuiteValidation.inventory.totalValidationInventory,
    );
    assert.equal(
      derived.validationAggregateResult,
      ExecutiveIntegrationSuiteValidation.aggregateResult,
    );
    assert.equal(
      derived.validationReadiness,
      ExecutiveIntegrationSuiteValidation.readiness,
    );
    assert.equal(derived.validationAggregateResult, "Pass");
    assert.equal(derived.validationReadiness, "ReadyForManifest");
  });

  it("exposes an immutable aggregate Manifest and package Manifest surface", () => {
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuiteManifest), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteManifestIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteManifestGuarantees),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteManifestCompatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteManifestDependencies),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteManifestExports),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteManifestReadiness),
      true,
    );

    assert.equal(
      ExecutiveIntegrationSuiteManifest.guarantees,
      ExecutiveIntegrationSuiteManifestGuarantees,
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifest.compatibility,
      ExecutiveIntegrationSuiteManifestCompatibility,
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifest.dependencies,
      ExecutiveIntegrationSuiteManifestDependencies,
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifest.exports,
      ExecutiveIntegrationSuiteManifestExports,
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifestExports.packageEntryOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteManifestExports.additionalPackageRoot,
      false,
    );

    for (const exportName of REQUIRED_MANIFEST_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime integration behavior", () => {
    const manifest = ExecutiveIntegrationSuiteManifest;
    assert.equal(manifest.metadataOnly, true);
    assert.equal(manifest.compositionOnly, true);
    assert.equal(manifest.runtimeBehavior, false);
    assert.equal(manifest.integrationRuntime, false);
    assert.equal(manifest.orchestration, false);
    assert.equal(manifest.routing, false);
    assert.equal(manifest.governance, false);
    assert.equal(manifest.observability, false);
    assert.equal(manifest.validationEngine, false);
    assert.equal(manifest.dashboard, false);
    assert.equal(manifest.networkingBehavior, false);
    assert.equal(manifest.persistenceBehavior, false);
    assert.equal(manifest.runtimeValidation, false);
    assert.equal(manifest.reactBehavior, false);
    assert.equal(manifest.stateMutation, false);
    assert.equal(manifest.importsLaterEil8Phases, false);
  });

  it("has zero prohibited imports across manifest sources", () => {
    const sources = EIL85_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/executiveIntegrationSuiteValidation\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for manifest sources", () => {
    const sources = EIL85_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/executiveIntegrationSuite/executiveIntegrationSuiteValidation.ts",
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
