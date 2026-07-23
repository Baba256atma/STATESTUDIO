/**
 * EIL-9:6 — Executive Integration Layer Platform Tests.
 *
 * Deterministic architectural coverage for the immutable Platform phase.
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
  ExecutiveIntegrationLayerManifest,
  ExecutiveIntegrationLayerManifestCanonicalId,
} from "./executiveIntegrationLayerManifest.ts";
import {
  ExecutiveIntegrationLayerPlatform,
  ExecutiveIntegrationLayerPlatformCapabilities,
  ExecutiveIntegrationLayerPlatformCompatibility,
  ExecutiveIntegrationLayerPlatformComposition,
  ExecutiveIntegrationLayerPlatformDependencies,
  ExecutiveIntegrationLayerPlatformIdentity,
  ExecutiveIntegrationLayerPlatformReadiness,
  ExecutiveIntegrationLayerPlatformReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL96_FILES = Object.freeze([
  "executiveIntegrationLayerPlatform.ts",
  "executiveIntegrationLayerPlatformIdentity.ts",
  "executiveIntegrationLayerPlatformComposition.ts",
  "executiveIntegrationLayerPlatformCompatibility.ts",
  "executiveIntegrationLayerPlatformCapabilities.ts",
  "executiveIntegrationLayerPlatformDependencies.ts",
  "executiveIntegrationLayerPlatformReadiness.ts",
  "executiveIntegrationLayerPlatform.test.ts",
]);

const REQUIRED_PLATFORM_EXPORTS = Object.freeze([
  "ExecutiveIntegrationLayerPlatformIdentity",
  "ExecutiveIntegrationLayerPlatform",
  "ExecutiveIntegrationLayerPlatformComposition",
  "ExecutiveIntegrationLayerPlatformCapabilities",
  "ExecutiveIntegrationLayerPlatformCompatibility",
  "ExecutiveIntegrationLayerPlatformDependencies",
  "ExecutiveIntegrationLayerPlatformReadiness",
  "ExecutiveIntegrationLayerPlatformCanonicalId",
] as const);

const EXPECTED_CAPABILITY_KEYS = Object.freeze([
  "FoundationComposition",
  "RegistryComposition",
  "ModelComposition",
  "ValidationComposition",
  "ManifestComposition",
  "MetadataPublication",
  "CanonicalIdentity",
  "DependencyIntegrity",
  "ValidationIntegrity",
  "ReadinessPublication",
  "ExportStability",
  "CompatibilityPublication",
  "PlatformConsistency",
  "InventoryIntegrity",
  "TypeIntegrity",
  "ArchitectureIntegrity",
  "PlatformPackaging",
  "CertificationReadiness",
] as const);

const EXPECTED_COMPATIBILITY_KEYS = Object.freeze([
  "FoundationCompatible",
  "RegistryCompatible",
  "ModelCompatible",
  "ValidationCompatible",
  "ManifestCompatible",
  "CertificationCompatible",
  "FreezeCompatible",
  "PublicIndexCompatible",
  "TypeScriptCompatible",
  "ESLintCompatible",
  "MetadataCompatible",
  "CanonicalArchitectureCompatible",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/executiveIntegrationLayer(Certification|Freeze|PublicIndex)/,
  /from ["']\.\/executiveIntegrationLayerFoundation\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerRegistry\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerModel\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerValidation\.ts["']/,
  /from ["']\.\/executiveIntegrationLayer(Validation|Manifest)(Rules|Categories|Results|Gates|Inventory|Report|Identity|Readiness|Compatibility|Guarantees|Dependencies|Exports)\.ts["']/,
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

describe("EIL-9:6 Executive Integration Layer Platform", () => {
  it("creates exactly eight Platform files", () => {
    assert.equal(EIL96_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL96_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Platform status, and ReadyForCertification", () => {
    assert.equal(
      ExecutiveIntegrationLayerPlatformIdentity.phaseId,
      "EIL-9:6",
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatformIdentity.canonicalId,
      "EIL-9:6/ExecutiveIntegrationLayerPlatform",
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatformIdentity.name,
      "Executive Integration Layer Platform",
    );
    assert.equal(ExecutiveIntegrationLayerPlatformIdentity.version, "1.0.0");
    assert.equal(
      ExecutiveIntegrationLayerPlatformIdentity.namespace,
      "nexora.eil.executive-integration-layer.platform",
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatformIdentity.status,
      "Platform",
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatformIdentity.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatformReadinessValue,
      "ReadyForCertification",
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatformReadiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatformIdentity.manifestDependency,
      ExecutiveIntegrationLayerManifestCanonicalId,
    );
  });

  it("consumes Manifest aggregate as the sole upstream dependency", () => {
    assert.equal(
      ExecutiveIntegrationLayerPlatformDependencies.manifestOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatformDependencies.upstreamCanonicalId,
      ExecutiveIntegrationLayerManifestCanonicalId,
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatform.manifestReference.aggregate,
      ExecutiveIntegrationLayerManifest,
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatformDependencies.validationDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatformDependencies.certificationDependency,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatformDependencies.laterEil9PhaseImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatformDependencies.eil8DirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatformDependencies.downstreamImplementationDependency,
      false,
    );
  });

  it("publishes exactly 18 capabilities and 12 compatibility declarations", () => {
    assert.equal(ExecutiveIntegrationLayerPlatformCapabilities.length, 18);
    assert.equal(ExecutiveIntegrationLayerPlatformCompatibility.length, 12);
    assert.deepEqual(
      ExecutiveIntegrationLayerPlatformCapabilities.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CAPABILITY_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerPlatformCompatibility.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_COMPATIBILITY_KEYS],
    );
    assertUnique(
      ExecutiveIntegrationLayerPlatformCapabilities.map(
        (item) => item.capabilityId,
      ),
      "capability IDs",
    );
    assertUnique(
      ExecutiveIntegrationLayerPlatformCompatibility.map(
        (item) => item.compatibilityId,
      ),
      "compatibility IDs",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerPlatformCapabilities.map((item) => item.order),
      "capabilities",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerPlatformCompatibility.map((item) => item.order),
      "compatibility",
    );
  });

  it("preserves composition integrity through Manifest reference chains", () => {
    const composition = ExecutiveIntegrationLayerPlatformComposition;
    assert.equal(composition.duplicatesUpstreamContents, false);
    assert.equal(
      composition.manifest.aggregate,
      ExecutiveIntegrationLayerManifest,
    );
    assert.equal(
      composition.validation.aggregate,
      ExecutiveIntegrationLayerManifest.validationReference.aggregate,
    );
    assert.equal(
      composition.model.aggregate,
      ExecutiveIntegrationLayerManifest.validationReference.aggregate.model,
    );
    assert.equal(
      composition.registry.aggregate,
      ExecutiveIntegrationLayerManifest.validationReference.aggregate.model
        .registry,
    );
    assert.equal(
      composition.foundation.aggregate,
      ExecutiveIntegrationLayerManifest.validationReference.aggregate.model
        .registry.foundation,
    );
    assert.deepEqual([...composition.canonicalReferenceChain], [
      "EIL-9:1/ExecutiveIntegrationLayerFoundation",
      "EIL-9:2/ExecutiveIntegrationLayerRegistry",
      "EIL-9:3/ExecutiveIntegrationLayerModel",
      "EIL-9:4/ExecutiveIntegrationLayerValidation",
      "EIL-9:5/ExecutiveIntegrationLayerManifest",
      "EIL-9:6/ExecutiveIntegrationLayerPlatform",
    ]);
  });

  it("derives inventory exclusively from Manifest without redefining counts", () => {
    const derived = ExecutiveIntegrationLayerPlatform.manifestDerivedInventory;
    assert.equal(derived.countsDerivedFromManifest, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.validationDerivedInventory,
      ExecutiveIntegrationLayerManifest.validationDerivedInventory,
    );
    assert.equal(
      derived.categoryCount,
      ExecutiveIntegrationLayerManifest.validationDerivedInventory
        .categoryCount,
    );
    assert.equal(
      derived.ruleCount,
      ExecutiveIntegrationLayerManifest.validationDerivedInventory.ruleCount,
    );
    assert.equal(
      derived.gateCount,
      ExecutiveIntegrationLayerManifest.validationDerivedInventory.gateCount,
    );
    assert.equal(
      derived.totalValidationInventory,
      ExecutiveIntegrationLayerManifest.validationDerivedInventory
        .totalValidationInventory,
    );
    assert.equal(derived.validationAggregateResult, "Pass");
    assert.equal(derived.validationReadiness, "ReadyForManifest");
    assert.equal(derived.manifestReadiness, "ReadyForPlatform");
  });

  it("exposes an immutable aggregate Platform and package Platform surface", () => {
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerPlatform), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerPlatformIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerPlatformComposition),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerPlatformCapabilities),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerPlatformCompatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerPlatformDependencies),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerPlatformReadiness),
      true,
    );

    assert.equal(
      ExecutiveIntegrationLayerPlatform.composition,
      ExecutiveIntegrationLayerPlatformComposition,
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatform.capabilities,
      ExecutiveIntegrationLayerPlatformCapabilities,
    );
    assert.equal(
      ExecutiveIntegrationLayerPlatform.compatibility,
      ExecutiveIntegrationLayerPlatformCompatibility,
    );

    for (const exportName of REQUIRED_PLATFORM_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime integration behavior", () => {
    const platform = ExecutiveIntegrationLayerPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.compositionOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.integrationRuntime, false);
    assert.equal(platform.orchestration, false);
    assert.equal(platform.routing, false);
    assert.equal(platform.governance, false);
    assert.equal(platform.observability, false);
    assert.equal(platform.validationEngine, false);
    assert.equal(platform.dashboard, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.serviceBehavior, false);
    assert.equal(platform.workerBehavior, false);
    assert.equal(platform.apiBehavior, false);
    assert.equal(platform.reactBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEil9Phases, false);
  });

  it("has zero prohibited imports across platform sources", () => {
    const sources = EIL96_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/executiveIntegrationLayerManifest\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for platform sources", () => {
    const sources = EIL96_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/executiveIntegrationLayer/executiveIntegrationLayerManifest.ts",
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
