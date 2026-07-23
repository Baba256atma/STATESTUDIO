/**
 * EIL-9:5 — Executive Integration Layer Manifest Tests.
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
  ExecutiveIntegrationLayerValidation,
  ExecutiveIntegrationLayerValidationCanonicalId,
} from "./executiveIntegrationLayerValidation.ts";
import {
  ExecutiveIntegrationLayerManifest,
  ExecutiveIntegrationLayerManifestCompatibility,
  ExecutiveIntegrationLayerManifestDependencies,
  ExecutiveIntegrationLayerManifestExports,
  ExecutiveIntegrationLayerManifestGuarantees,
  ExecutiveIntegrationLayerManifestIdentity,
  ExecutiveIntegrationLayerManifestReadiness,
  ExecutiveIntegrationLayerManifestReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL95_FILES = Object.freeze([
  "executiveIntegrationLayerManifest.ts",
  "executiveIntegrationLayerManifestIdentity.ts",
  "executiveIntegrationLayerManifestReadiness.ts",
  "executiveIntegrationLayerManifestCompatibility.ts",
  "executiveIntegrationLayerManifestGuarantees.ts",
  "executiveIntegrationLayerManifestDependencies.ts",
  "executiveIntegrationLayerManifestExports.ts",
  "executiveIntegrationLayerManifest.test.ts",
]);

const REQUIRED_MANIFEST_EXPORTS = Object.freeze([
  "ExecutiveIntegrationLayerManifestIdentity",
  "ExecutiveIntegrationLayerManifest",
  "ExecutiveIntegrationLayerManifestGuarantees",
  "ExecutiveIntegrationLayerManifestCompatibility",
  "ExecutiveIntegrationLayerManifestDependencies",
  "ExecutiveIntegrationLayerManifestExports",
  "ExecutiveIntegrationLayerManifestReadiness",
  "ExecutiveIntegrationLayerManifestCanonicalId",
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
  "LayerCompositionIntegrity",
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
  /from ["']\.\/executiveIntegrationLayer(Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\/executiveIntegrationLayerFoundation\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerRegistry\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerModel\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerValidation(Rules|Categories|Results|Gates|Inventory|Report)\.ts["']/,
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

describe("EIL-9:5 Executive Integration Layer Manifest", () => {
  it("creates exactly eight Manifest files", () => {
    assert.equal(EIL95_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL95_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Manifest status, and ReadyForPlatform", () => {
    assert.equal(
      ExecutiveIntegrationLayerManifestIdentity.phaseId,
      "EIL-9:5",
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestIdentity.canonicalId,
      "EIL-9:5/ExecutiveIntegrationLayerManifest",
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestIdentity.name,
      "Executive Integration Layer Manifest",
    );
    assert.equal(ExecutiveIntegrationLayerManifestIdentity.version, "1.0.0");
    assert.equal(
      ExecutiveIntegrationLayerManifestIdentity.namespace,
      "nexora.eil.executive-integration-layer.manifest",
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestIdentity.status,
      "Manifest",
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestIdentity.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestReadinessValue,
      "ReadyForPlatform",
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestReadiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestIdentity.validationDependency,
      ExecutiveIntegrationLayerValidationCanonicalId,
    );
  });

  it("consumes Validation aggregate as the sole upstream dependency", () => {
    assert.equal(
      ExecutiveIntegrationLayerManifestDependencies.validationOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestDependencies.upstreamCanonicalId,
      ExecutiveIntegrationLayerValidationCanonicalId,
    );
    assert.equal(
      ExecutiveIntegrationLayerManifest.validationReference.aggregate,
      ExecutiveIntegrationLayerValidation,
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestDependencies.modelDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestDependencies.registryDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestDependencies.laterEil9PhaseImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestDependencies.eil8DirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestDependencies.downstreamImplementationDependency,
      false,
    );
  });

  it("publishes exactly 16 guarantees and 12 compatibility declarations", () => {
    assert.equal(ExecutiveIntegrationLayerManifestGuarantees.length, 16);
    assert.equal(ExecutiveIntegrationLayerManifestCompatibility.length, 12);
    assert.deepEqual(
      ExecutiveIntegrationLayerManifestGuarantees.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_GUARANTEE_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerManifestCompatibility.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_COMPATIBILITY_KEYS],
    );
    assertUnique(
      ExecutiveIntegrationLayerManifestGuarantees.map(
        (item) => item.guaranteeId,
      ),
      "guarantee IDs",
    );
    assertUnique(
      ExecutiveIntegrationLayerManifestCompatibility.map(
        (item) => item.compatibilityId,
      ),
      "compatibility IDs",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerManifestGuarantees.map((item) => item.order),
      "guarantees",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerManifestCompatibility.map((item) => item.order),
      "compatibility",
    );
  });

  it("derives inventory exclusively from Validation without redefining counts", () => {
    const derived =
      ExecutiveIntegrationLayerManifest.validationDerivedInventory;
    assert.equal(derived.countsDerivedFromValidation, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.validationCategories,
      ExecutiveIntegrationLayerValidation.categories,
    );
    assert.equal(
      derived.validationRules,
      ExecutiveIntegrationLayerValidation.rules,
    );
    assert.equal(
      derived.validationGates,
      ExecutiveIntegrationLayerValidation.gates,
    );
    assert.equal(
      derived.validationInventory,
      ExecutiveIntegrationLayerValidation.inventory,
    );
    assert.equal(
      derived.categoryCount,
      ExecutiveIntegrationLayerValidation.categories.length,
    );
    assert.equal(
      derived.ruleCount,
      ExecutiveIntegrationLayerValidation.rules.length,
    );
    assert.equal(
      derived.gateCount,
      ExecutiveIntegrationLayerValidation.gates.length,
    );
    assert.equal(
      derived.totalValidationInventory,
      ExecutiveIntegrationLayerValidation.inventory.totalValidationInventory,
    );
    assert.equal(
      derived.validationAggregateResult,
      ExecutiveIntegrationLayerValidation.aggregateResult,
    );
    assert.equal(
      derived.validationReadiness,
      ExecutiveIntegrationLayerValidation.readiness,
    );
    assert.equal(derived.validationAggregateResult, "Pass");
    assert.equal(derived.validationReadiness, "ReadyForManifest");
  });

  it("exposes an immutable aggregate Manifest and package Manifest surface", () => {
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerManifest), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerManifestIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerManifestGuarantees),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerManifestCompatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerManifestDependencies),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerManifestExports),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerManifestReadiness),
      true,
    );

    assert.equal(
      ExecutiveIntegrationLayerManifest.guarantees,
      ExecutiveIntegrationLayerManifestGuarantees,
    );
    assert.equal(
      ExecutiveIntegrationLayerManifest.compatibility,
      ExecutiveIntegrationLayerManifestCompatibility,
    );
    assert.equal(
      ExecutiveIntegrationLayerManifest.dependencies,
      ExecutiveIntegrationLayerManifestDependencies,
    );
    assert.equal(
      ExecutiveIntegrationLayerManifest.exports,
      ExecutiveIntegrationLayerManifestExports,
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestExports.packageEntryOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerManifestExports.additionalPackageRoot,
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
    const manifest = ExecutiveIntegrationLayerManifest;
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
    assert.equal(manifest.importsLaterEil9Phases, false);
  });

  it("has zero prohibited imports across manifest sources", () => {
    const sources = EIL95_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/executiveIntegrationLayerValidation\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for manifest sources", () => {
    const sources = EIL95_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/executiveIntegrationLayer/executiveIntegrationLayerValidation.ts",
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
