/**
 * EIL-6:7 — Integration Observability Certification Tests.
 *
 * Deterministic architectural coverage for the immutable Certification phase.
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
  IntegrationObservabilityPlatform,
  IntegrationObservabilityPlatformCanonicalId,
} from "./integrationObservabilityPlatform.ts";
import {
  IntegrationObservabilityCertification,
  IntegrationObservabilityCertificationAggregateResult,
  IntegrationObservabilityCertificationCriteria,
  IntegrationObservabilityCertificationDependencies,
  IntegrationObservabilityCertificationGates,
  IntegrationObservabilityCertificationIdentity,
  IntegrationObservabilityCertificationReadiness,
  IntegrationObservabilityCertificationReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL67_FILES = Object.freeze([
  "integrationObservabilityCertification.ts",
  "integrationObservabilityCertificationIdentity.ts",
  "integrationObservabilityCertificationCriteria.ts",
  "integrationObservabilityCertificationGates.ts",
  "integrationObservabilityCertificationResults.ts",
  "integrationObservabilityCertificationDependencies.ts",
  "integrationObservabilityCertificationReadiness.ts",
  "integrationObservabilityCertification.test.ts",
]);

const REQUIRED_CERTIFICATION_EXPORTS = Object.freeze([
  "IntegrationObservabilityCertificationIdentity",
  "IntegrationObservabilityCertification",
  "IntegrationObservabilityCertificationCriteria",
  "IntegrationObservabilityCertificationGates",
  "IntegrationObservabilityCertificationDependencies",
  "IntegrationObservabilityCertificationReadiness",
  "IntegrationObservabilityCertificationAggregateResult",
  "IntegrationObservabilityCertificationCanonicalId",
] as const);

const EXPECTED_CRITERION_KEYS = Object.freeze([
  "CanonicalIdentityCertified",
  "NamespaceCertified",
  "DependencyIntegrityCertified",
  "FoundationCompositionCertified",
  "RegistryCompositionCertified",
  "ModelCompositionCertified",
  "ValidationCompositionCertified",
  "ManifestCompositionCertified",
  "PlatformCompositionCertified",
  "MetadataIntegrityCertified",
  "InventoryIntegrityCertified",
  "CompatibilityCertified",
  "ExportSurfaceCertified",
  "TypeIntegrityCertified",
  "ArchitectureIntegrityCertified",
  "RuntimeIndependenceCertified",
  "PlatformReadinessCertified",
  "FreezeReadinessCertified",
] as const);

const EXPECTED_GATE_KEYS = Object.freeze([
  "IdentityGate",
  "NamespaceGate",
  "DependencyGate",
  "CompositionGate",
  "MetadataGate",
  "InventoryGate",
  "CompatibilityGate",
  "ExportGate",
  "TypeGate",
  "ArchitectureGate",
  "RuntimeIndependenceGate",
  "PackageIntegrityGate",
  "PlatformApprovalGate",
  "CertificationApprovalGate",
  "FreezeApprovalGate",
  "ReadyForFreezeGate",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationObservability(Freeze|PublicIndex)/,
  /from ["']\.\/integrationObservabilityFoundation\.ts["']/,
  /from ["']\.\/integrationObservabilityRegistry\.ts["']/,
  /from ["']\.\/integrationObservabilityModel\.ts["']/,
  /from ["']\.\/integrationObservabilityValidation\.ts["']/,
  /from ["']\.\/integrationObservabilityManifest\.ts["']/,
  /from ["']\.\/integrationObservabilityPlatform(Identity|Composition|Compatibility|Capabilities|Dependencies|Readiness)\.ts["']/,
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

describe("EIL-6:7 Integration Observability Certification", () => {
  it("creates exactly eight Certification files", () => {
    assert.equal(EIL67_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL67_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Certification status, and ReadyForFreeze", () => {
    assert.equal(
      IntegrationObservabilityCertificationIdentity.phaseId,
      "EIL-6:7",
    );
    assert.equal(
      IntegrationObservabilityCertificationIdentity.canonicalId,
      "EIL-6:7/IntegrationObservabilityCertification",
    );
    assert.equal(
      IntegrationObservabilityCertificationIdentity.name,
      "Integration Observability Certification",
    );
    assert.equal(
      IntegrationObservabilityCertificationIdentity.version,
      "1.0.0",
    );
    assert.equal(
      IntegrationObservabilityCertificationIdentity.namespace,
      "nexora.eil.integration-observability.certification",
    );
    assert.equal(
      IntegrationObservabilityCertificationIdentity.status,
      "Certification",
    );
    assert.equal(
      IntegrationObservabilityCertificationIdentity.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationObservabilityCertificationReadinessValue,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationObservabilityCertificationReadiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationObservabilityCertificationIdentity.platformDependency,
      IntegrationObservabilityPlatformCanonicalId,
    );
  });

  it("consumes Platform aggregate as the sole upstream dependency", () => {
    assert.equal(
      IntegrationObservabilityCertificationDependencies.platformOnly,
      true,
    );
    assert.equal(
      IntegrationObservabilityCertificationDependencies.upstreamCanonicalId,
      IntegrationObservabilityPlatformCanonicalId,
    );
    assert.equal(
      IntegrationObservabilityCertification.platformReference.aggregate,
      IntegrationObservabilityPlatform,
    );
    assert.equal(
      IntegrationObservabilityCertificationDependencies.manifestDirectImport,
      false,
    );
    assert.equal(
      IntegrationObservabilityCertificationDependencies.freezeDependency,
      false,
    );
    assert.equal(
      IntegrationObservabilityCertificationDependencies.publicIndexDependency,
      false,
    );
  });

  it("publishes exactly 18 criteria, 16 gates, and aggregate Pass", () => {
    assert.equal(IntegrationObservabilityCertificationCriteria.length, 18);
    assert.equal(IntegrationObservabilityCertificationGates.length, 16);
    assert.equal(IntegrationObservabilityCertificationAggregateResult, "Pass");
    assert.equal(
      IntegrationObservabilityCertification.aggregateResult,
      "Pass",
    );
    assert.deepEqual(
      IntegrationObservabilityCertificationCriteria.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CRITERION_KEYS],
    );
    assert.deepEqual(
      IntegrationObservabilityCertificationGates.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_GATE_KEYS],
    );
    assertUnique(
      IntegrationObservabilityCertificationCriteria.map(
        (item) => item.criterionId,
      ),
      "criterion IDs",
    );
    assertUnique(
      IntegrationObservabilityCertificationGates.map((item) => item.gateId),
      "gate IDs",
    );
    assertSequentialOrders(
      IntegrationObservabilityCertificationCriteria.map((item) => item.order),
      "criteria",
    );
    assertSequentialOrders(
      IntegrationObservabilityCertificationGates.map((item) => item.order),
      "gates",
    );
    assert.ok(
      IntegrationObservabilityCertificationGates.every(
        (item) => item.declaredResult === "Pass",
      ),
    );
  });

  it("derives inventory exclusively from Platform without redefining counts", () => {
    const derived =
      IntegrationObservabilityCertification.platformDerivedInventory;
    assert.equal(derived.countsDerivedFromPlatform, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.manifestDerivedInventory,
      IntegrationObservabilityPlatform.manifestDerivedInventory,
    );
    assert.equal(
      derived.categoryCount,
      IntegrationObservabilityPlatform.manifestDerivedInventory.categoryCount,
    );
    assert.equal(
      derived.ruleCount,
      IntegrationObservabilityPlatform.manifestDerivedInventory.ruleCount,
    );
    assert.equal(
      derived.gateCount,
      IntegrationObservabilityPlatform.manifestDerivedInventory.gateCount,
    );
    assert.equal(
      derived.totalValidationInventory,
      IntegrationObservabilityPlatform.manifestDerivedInventory
        .totalValidationInventory,
    );
    assert.equal(derived.validationAggregateResult, "Pass");
    assert.equal(derived.validationReadiness, "ReadyForManifest");
  });

  it("exposes an immutable aggregate Certification and package Certification surface", () => {
    assert.equal(Object.isFrozen(IntegrationObservabilityCertification), true);
    assert.equal(
      Object.isFrozen(IntegrationObservabilityCertificationIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityCertificationCriteria),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityCertificationGates),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityCertificationDependencies),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityCertificationReadiness),
      true,
    );

    assert.equal(
      IntegrationObservabilityCertification.criteria,
      IntegrationObservabilityCertificationCriteria,
    );
    assert.equal(
      IntegrationObservabilityCertification.gates,
      IntegrationObservabilityCertificationGates,
    );
    assert.equal(
      IntegrationObservabilityCertification.dependencies,
      IntegrationObservabilityCertificationDependencies,
    );

    for (const exportName of REQUIRED_CERTIFICATION_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime certification or observability behavior", () => {
    const certification = IntegrationObservabilityCertification;
    assert.equal(certification.metadataOnly, true);
    assert.equal(certification.runtimeBehavior, false);
    assert.equal(certification.certificationEngine, false);
    assert.equal(certification.runtimeValidation, false);
    assert.equal(certification.monitoringEngine, false);
    assert.equal(certification.telemetryPipeline, false);
    assert.equal(certification.openTelemetry, false);
    assert.equal(certification.prometheus, false);
    assert.equal(certification.grafana, false);
    assert.equal(certification.loggingFramework, false);
    assert.equal(certification.tracingRuntime, false);
    assert.equal(certification.metricsCollector, false);
    assert.equal(certification.alertEngine, false);
    assert.equal(certification.healthEngine, false);
    assert.equal(certification.dashboard, false);
    assert.equal(certification.networkingBehavior, false);
    assert.equal(certification.persistenceBehavior, false);
    assert.equal(certification.reactBehavior, false);
    assert.equal(certification.stateMutation, false);
    assert.equal(certification.importsLaterEil6Phases, false);
  });

  it("has zero prohibited imports across certification sources", () => {
    const sources = EIL67_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/integrationObservabilityPlatform\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for certification sources", () => {
    const sources = EIL67_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationObservability/integrationObservabilityPlatform.ts",
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
