/**
 * EIL-6:6 — Integration Observability Platform Tests.
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
  IntegrationObservabilityManifest,
  IntegrationObservabilityManifestCanonicalId,
} from "./integrationObservabilityManifest.ts";
import {
  IntegrationObservabilityPlatform,
  IntegrationObservabilityPlatformCapabilities,
  IntegrationObservabilityPlatformCompatibility,
  IntegrationObservabilityPlatformComposition,
  IntegrationObservabilityPlatformDependencies,
  IntegrationObservabilityPlatformIdentity,
  IntegrationObservabilityPlatformReadiness,
  IntegrationObservabilityPlatformReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL66_FILES = Object.freeze([
  "integrationObservabilityPlatform.ts",
  "integrationObservabilityPlatformIdentity.ts",
  "integrationObservabilityPlatformComposition.ts",
  "integrationObservabilityPlatformCompatibility.ts",
  "integrationObservabilityPlatformCapabilities.ts",
  "integrationObservabilityPlatformDependencies.ts",
  "integrationObservabilityPlatformReadiness.ts",
  "integrationObservabilityPlatform.test.ts",
]);

const REQUIRED_PLATFORM_EXPORTS = Object.freeze([
  "IntegrationObservabilityPlatformIdentity",
  "IntegrationObservabilityPlatform",
  "IntegrationObservabilityPlatformComposition",
  "IntegrationObservabilityPlatformCapabilities",
  "IntegrationObservabilityPlatformCompatibility",
  "IntegrationObservabilityPlatformDependencies",
  "IntegrationObservabilityPlatformReadiness",
  "IntegrationObservabilityPlatformCanonicalId",
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
  /from ["']\.\/integrationObservability(Certification|Freeze|PublicIndex)/,
  /from ["']\.\/integrationObservabilityFoundation\.ts["']/,
  /from ["']\.\/integrationObservabilityRegistry\.ts["']/,
  /from ["']\.\/integrationObservabilityModel\.ts["']/,
  /from ["']\.\/integrationObservabilityValidation\.ts["']/,
  /from ["']\.\/integrationObservability(Validation|Manifest)(Rules|Categories|Results|Gates|Inventory|Report|Identity|Readiness|Compatibility|Guarantees|Dependencies|Exports)\.ts["']/,
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

describe("EIL-6:6 Integration Observability Platform", () => {
  it("creates exactly eight Platform files", () => {
    assert.equal(EIL66_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL66_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Platform status, and ReadyForCertification", () => {
    assert.equal(IntegrationObservabilityPlatformIdentity.phaseId, "EIL-6:6");
    assert.equal(
      IntegrationObservabilityPlatformIdentity.canonicalId,
      "EIL-6:6/IntegrationObservabilityPlatform",
    );
    assert.equal(
      IntegrationObservabilityPlatformIdentity.name,
      "Integration Observability Platform",
    );
    assert.equal(IntegrationObservabilityPlatformIdentity.version, "1.0.0");
    assert.equal(
      IntegrationObservabilityPlatformIdentity.namespace,
      "nexora.eil.integration-observability.platform",
    );
    assert.equal(IntegrationObservabilityPlatformIdentity.status, "Platform");
    assert.equal(
      IntegrationObservabilityPlatformIdentity.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      IntegrationObservabilityPlatformReadinessValue,
      "ReadyForCertification",
    );
    assert.equal(
      IntegrationObservabilityPlatformReadiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      IntegrationObservabilityPlatformIdentity.manifestDependency,
      IntegrationObservabilityManifestCanonicalId,
    );
  });

  it("consumes Manifest aggregate as the sole upstream dependency", () => {
    assert.equal(
      IntegrationObservabilityPlatformDependencies.manifestOnly,
      true,
    );
    assert.equal(
      IntegrationObservabilityPlatformDependencies.upstreamCanonicalId,
      IntegrationObservabilityManifestCanonicalId,
    );
    assert.equal(
      IntegrationObservabilityPlatform.manifestReference.aggregate,
      IntegrationObservabilityManifest,
    );
    assert.equal(
      IntegrationObservabilityPlatformDependencies.validationDirectImport,
      false,
    );
    assert.equal(
      IntegrationObservabilityPlatformDependencies.certificationDependency,
      false,
    );
    assert.equal(
      IntegrationObservabilityPlatformDependencies.laterEil6PhaseImport,
      false,
    );
  });

  it("publishes exactly 18 capabilities and 12 compatibility declarations", () => {
    assert.equal(IntegrationObservabilityPlatformCapabilities.length, 18);
    assert.equal(IntegrationObservabilityPlatformCompatibility.length, 12);
    assert.deepEqual(
      IntegrationObservabilityPlatformCapabilities.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CAPABILITY_KEYS],
    );
    assert.deepEqual(
      IntegrationObservabilityPlatformCompatibility.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_COMPATIBILITY_KEYS],
    );
    assertUnique(
      IntegrationObservabilityPlatformCapabilities.map(
        (item) => item.capabilityId,
      ),
      "capability IDs",
    );
    assertUnique(
      IntegrationObservabilityPlatformCompatibility.map(
        (item) => item.compatibilityId,
      ),
      "compatibility IDs",
    );
    assertSequentialOrders(
      IntegrationObservabilityPlatformCapabilities.map((item) => item.order),
      "capabilities",
    );
    assertSequentialOrders(
      IntegrationObservabilityPlatformCompatibility.map((item) => item.order),
      "compatibility",
    );
  });

  it("preserves composition integrity through Manifest reference chains", () => {
    const composition = IntegrationObservabilityPlatformComposition;
    assert.equal(composition.duplicatesUpstreamContents, false);
    assert.equal(
      composition.manifest.aggregate,
      IntegrationObservabilityManifest,
    );
    assert.equal(
      composition.validation.aggregate,
      IntegrationObservabilityManifest.validationReference.aggregate,
    );
    assert.equal(
      composition.model.aggregate,
      IntegrationObservabilityManifest.validationReference.aggregate.model,
    );
    assert.equal(
      composition.registry.aggregate,
      IntegrationObservabilityManifest.validationReference.aggregate.model
        .registry,
    );
    assert.equal(
      composition.foundation.aggregate,
      IntegrationObservabilityManifest.validationReference.aggregate.model
        .registry.foundation,
    );
    assert.deepEqual([...composition.canonicalReferenceChain], [
      "EIL-6:1/IntegrationObservabilityFoundation",
      "EIL-6:2/IntegrationObservabilityRegistry",
      "EIL-6:3/IntegrationObservabilityModel",
      "EIL-6:4/IntegrationObservabilityValidation",
      "EIL-6:5/IntegrationObservabilityManifest",
      "EIL-6:6/IntegrationObservabilityPlatform",
    ]);
  });

  it("derives inventory exclusively from Manifest without redefining counts", () => {
    const derived = IntegrationObservabilityPlatform.manifestDerivedInventory;
    assert.equal(derived.countsDerivedFromManifest, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.validationDerivedInventory,
      IntegrationObservabilityManifest.validationDerivedInventory,
    );
    assert.equal(
      derived.categoryCount,
      IntegrationObservabilityManifest.validationDerivedInventory.categoryCount,
    );
    assert.equal(
      derived.ruleCount,
      IntegrationObservabilityManifest.validationDerivedInventory.ruleCount,
    );
    assert.equal(
      derived.gateCount,
      IntegrationObservabilityManifest.validationDerivedInventory.gateCount,
    );
    assert.equal(
      derived.totalValidationInventory,
      IntegrationObservabilityManifest.validationDerivedInventory
        .totalValidationInventory,
    );
    assert.equal(derived.validationAggregateResult, "Pass");
    assert.equal(derived.validationReadiness, "ReadyForManifest");
  });

  it("exposes an immutable aggregate Platform and package Platform surface", () => {
    assert.equal(Object.isFrozen(IntegrationObservabilityPlatform), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityPlatformIdentity), true);
    assert.equal(
      Object.isFrozen(IntegrationObservabilityPlatformComposition),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityPlatformCapabilities),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityPlatformCompatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityPlatformDependencies),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityPlatformReadiness),
      true,
    );

    assert.equal(
      IntegrationObservabilityPlatform.composition,
      IntegrationObservabilityPlatformComposition,
    );
    assert.equal(
      IntegrationObservabilityPlatform.capabilities,
      IntegrationObservabilityPlatformCapabilities,
    );
    assert.equal(
      IntegrationObservabilityPlatform.compatibility,
      IntegrationObservabilityPlatformCompatibility,
    );

    for (const exportName of REQUIRED_PLATFORM_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime observability behavior", () => {
    const platform = IntegrationObservabilityPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.monitoringEngine, false);
    assert.equal(platform.telemetryPipeline, false);
    assert.equal(platform.openTelemetry, false);
    assert.equal(platform.prometheus, false);
    assert.equal(platform.grafana, false);
    assert.equal(platform.loggingFramework, false);
    assert.equal(platform.tracingRuntime, false);
    assert.equal(platform.metricsCollector, false);
    assert.equal(platform.alertEngine, false);
    assert.equal(platform.healthEngine, false);
    assert.equal(platform.dashboard, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.serviceBehavior, false);
    assert.equal(platform.workerBehavior, false);
    assert.equal(platform.apiBehavior, false);
    assert.equal(platform.reactBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEil6Phases, false);
  });

  it("has zero prohibited imports across platform sources", () => {
    const sources = EIL66_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/integrationObservabilityManifest\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for platform sources", () => {
    const sources = EIL66_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationObservability/integrationObservabilityManifest.ts",
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
