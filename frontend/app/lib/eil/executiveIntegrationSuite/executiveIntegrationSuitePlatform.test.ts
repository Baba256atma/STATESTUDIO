/**
 * EIL-8:6 — Executive Integration Suite Platform Tests.
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
  ExecutiveIntegrationSuiteManifest,
  ExecutiveIntegrationSuiteManifestCanonicalId,
} from "./executiveIntegrationSuiteManifest.ts";
import {
  ExecutiveIntegrationSuitePlatform,
  ExecutiveIntegrationSuitePlatformCapabilities,
  ExecutiveIntegrationSuitePlatformCompatibility,
  ExecutiveIntegrationSuitePlatformComposition,
  ExecutiveIntegrationSuitePlatformDependencies,
  ExecutiveIntegrationSuitePlatformIdentity,
  ExecutiveIntegrationSuitePlatformReadiness,
  ExecutiveIntegrationSuitePlatformReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL86_FILES = Object.freeze([
  "executiveIntegrationSuitePlatform.ts",
  "executiveIntegrationSuitePlatformIdentity.ts",
  "executiveIntegrationSuitePlatformComposition.ts",
  "executiveIntegrationSuitePlatformCompatibility.ts",
  "executiveIntegrationSuitePlatformCapabilities.ts",
  "executiveIntegrationSuitePlatformDependencies.ts",
  "executiveIntegrationSuitePlatformReadiness.ts",
  "executiveIntegrationSuitePlatform.test.ts",
]);

const REQUIRED_PLATFORM_EXPORTS = Object.freeze([
  "ExecutiveIntegrationSuitePlatformIdentity",
  "ExecutiveIntegrationSuitePlatform",
  "ExecutiveIntegrationSuitePlatformComposition",
  "ExecutiveIntegrationSuitePlatformCapabilities",
  "ExecutiveIntegrationSuitePlatformCompatibility",
  "ExecutiveIntegrationSuitePlatformDependencies",
  "ExecutiveIntegrationSuitePlatformReadiness",
  "ExecutiveIntegrationSuitePlatformCanonicalId",
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
  /from ["']\.\/executiveIntegrationSuite(Certification|Freeze|PublicIndex)/,
  /from ["']\.\/executiveIntegrationSuiteFoundation\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteRegistry\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteModel\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteValidation\.ts["']/,
  /from ["']\.\/executiveIntegrationSuite(Validation|Manifest)(Rules|Categories|Results|Gates|Inventory|Report|Identity|Readiness|Compatibility|Guarantees|Dependencies|Exports)\.ts["']/,
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

describe("EIL-8:6 Executive Integration Suite Platform", () => {
  it("creates exactly eight Platform files", () => {
    assert.equal(EIL86_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL86_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Platform status, and ReadyForCertification", () => {
    assert.equal(
      ExecutiveIntegrationSuitePlatformIdentity.phaseId,
      "EIL-8:6",
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatformIdentity.canonicalId,
      "EIL-8:6/ExecutiveIntegrationSuitePlatform",
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatformIdentity.name,
      "Executive Integration Suite Platform",
    );
    assert.equal(ExecutiveIntegrationSuitePlatformIdentity.version, "1.0.0");
    assert.equal(
      ExecutiveIntegrationSuitePlatformIdentity.namespace,
      "nexora.eil.executive-integration-suite.platform",
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatformIdentity.status,
      "Platform",
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatformIdentity.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatformReadinessValue,
      "ReadyForCertification",
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatformReadiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatformIdentity.manifestDependency,
      ExecutiveIntegrationSuiteManifestCanonicalId,
    );
  });

  it("consumes Manifest aggregate as the sole upstream dependency", () => {
    assert.equal(
      ExecutiveIntegrationSuitePlatformDependencies.manifestOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatformDependencies.upstreamCanonicalId,
      ExecutiveIntegrationSuiteManifestCanonicalId,
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatform.manifestReference.aggregate,
      ExecutiveIntegrationSuiteManifest,
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatformDependencies.validationDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatformDependencies.certificationDependency,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatformDependencies.laterEil8PhaseImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatformDependencies.downstreamImplementationDependency,
      false,
    );
  });

  it("publishes exactly 18 capabilities and 12 compatibility declarations", () => {
    assert.equal(ExecutiveIntegrationSuitePlatformCapabilities.length, 18);
    assert.equal(ExecutiveIntegrationSuitePlatformCompatibility.length, 12);
    assert.deepEqual(
      ExecutiveIntegrationSuitePlatformCapabilities.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CAPABILITY_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationSuitePlatformCompatibility.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_COMPATIBILITY_KEYS],
    );
    assertUnique(
      ExecutiveIntegrationSuitePlatformCapabilities.map(
        (item) => item.capabilityId,
      ),
      "capability IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuitePlatformCompatibility.map(
        (item) => item.compatibilityId,
      ),
      "compatibility IDs",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuitePlatformCapabilities.map((item) => item.order),
      "capabilities",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuitePlatformCompatibility.map((item) => item.order),
      "compatibility",
    );
  });

  it("preserves composition integrity through Manifest reference chains", () => {
    const composition = ExecutiveIntegrationSuitePlatformComposition;
    assert.equal(composition.duplicatesUpstreamContents, false);
    assert.equal(
      composition.manifest.aggregate,
      ExecutiveIntegrationSuiteManifest,
    );
    assert.equal(
      composition.validation.aggregate,
      ExecutiveIntegrationSuiteManifest.validationReference.aggregate,
    );
    assert.equal(
      composition.model.aggregate,
      ExecutiveIntegrationSuiteManifest.validationReference.aggregate.model,
    );
    assert.equal(
      composition.registry.aggregate,
      ExecutiveIntegrationSuiteManifest.validationReference.aggregate.model
        .registry,
    );
    assert.equal(
      composition.foundation.aggregate,
      ExecutiveIntegrationSuiteManifest.validationReference.aggregate.model
        .registry.foundation,
    );
    assert.deepEqual([...composition.canonicalReferenceChain], [
      "EIL-8:1/ExecutiveIntegrationSuiteFoundation",
      "EIL-8:2/ExecutiveIntegrationSuiteRegistry",
      "EIL-8:3/ExecutiveIntegrationSuiteModel",
      "EIL-8:4/ExecutiveIntegrationSuiteValidation",
      "EIL-8:5/ExecutiveIntegrationSuiteManifest",
      "EIL-8:6/ExecutiveIntegrationSuitePlatform",
    ]);
  });

  it("derives inventory exclusively from Manifest without redefining counts", () => {
    const derived = ExecutiveIntegrationSuitePlatform.manifestDerivedInventory;
    assert.equal(derived.countsDerivedFromManifest, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.validationDerivedInventory,
      ExecutiveIntegrationSuiteManifest.validationDerivedInventory,
    );
    assert.equal(
      derived.categoryCount,
      ExecutiveIntegrationSuiteManifest.validationDerivedInventory
        .categoryCount,
    );
    assert.equal(
      derived.ruleCount,
      ExecutiveIntegrationSuiteManifest.validationDerivedInventory.ruleCount,
    );
    assert.equal(
      derived.gateCount,
      ExecutiveIntegrationSuiteManifest.validationDerivedInventory.gateCount,
    );
    assert.equal(
      derived.totalValidationInventory,
      ExecutiveIntegrationSuiteManifest.validationDerivedInventory
        .totalValidationInventory,
    );
    assert.equal(derived.validationAggregateResult, "Pass");
    assert.equal(derived.validationReadiness, "ReadyForManifest");
  });

  it("exposes an immutable aggregate Platform and package Platform surface", () => {
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuitePlatform), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuitePlatformIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuitePlatformComposition),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuitePlatformCapabilities),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuitePlatformCompatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuitePlatformDependencies),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuitePlatformReadiness),
      true,
    );

    assert.equal(
      ExecutiveIntegrationSuitePlatform.composition,
      ExecutiveIntegrationSuitePlatformComposition,
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatform.capabilities,
      ExecutiveIntegrationSuitePlatformCapabilities,
    );
    assert.equal(
      ExecutiveIntegrationSuitePlatform.compatibility,
      ExecutiveIntegrationSuitePlatformCompatibility,
    );

    for (const exportName of REQUIRED_PLATFORM_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime integration behavior", () => {
    const platform = ExecutiveIntegrationSuitePlatform;
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
    assert.equal(platform.importsLaterEil8Phases, false);
  });

  it("has zero prohibited imports across platform sources", () => {
    const sources = EIL86_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/executiveIntegrationSuiteManifest\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for platform sources", () => {
    const sources = EIL86_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/executiveIntegrationSuite/executiveIntegrationSuiteManifest.ts",
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
