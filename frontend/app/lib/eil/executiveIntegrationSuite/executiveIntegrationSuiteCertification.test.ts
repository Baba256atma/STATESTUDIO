/**
 * EIL-8:7 — Executive Integration Suite Certification Tests.
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
  ExecutiveIntegrationSuitePlatform,
  ExecutiveIntegrationSuitePlatformCanonicalId,
} from "./executiveIntegrationSuitePlatform.ts";
import {
  ExecutiveIntegrationSuiteCertification,
  ExecutiveIntegrationSuiteCertificationAggregateResult,
  ExecutiveIntegrationSuiteCertificationCriteria,
  ExecutiveIntegrationSuiteCertificationDependencies,
  ExecutiveIntegrationSuiteCertificationGates,
  ExecutiveIntegrationSuiteCertificationIdentity,
  ExecutiveIntegrationSuiteCertificationReadiness,
  ExecutiveIntegrationSuiteCertificationReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL87_FILES = Object.freeze([
  "executiveIntegrationSuiteCertification.ts",
  "executiveIntegrationSuiteCertificationIdentity.ts",
  "executiveIntegrationSuiteCertificationCriteria.ts",
  "executiveIntegrationSuiteCertificationGates.ts",
  "executiveIntegrationSuiteCertificationResults.ts",
  "executiveIntegrationSuiteCertificationDependencies.ts",
  "executiveIntegrationSuiteCertificationReadiness.ts",
  "executiveIntegrationSuiteCertification.test.ts",
]);

const REQUIRED_CERTIFICATION_EXPORTS = Object.freeze([
  "ExecutiveIntegrationSuiteCertificationIdentity",
  "ExecutiveIntegrationSuiteCertification",
  "ExecutiveIntegrationSuiteCertificationCriteria",
  "ExecutiveIntegrationSuiteCertificationGates",
  "ExecutiveIntegrationSuiteCertificationDependencies",
  "ExecutiveIntegrationSuiteCertificationReadiness",
  "ExecutiveIntegrationSuiteCertificationAggregateResult",
  "ExecutiveIntegrationSuiteCertificationCanonicalId",
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
  /from ["']\.\/executiveIntegrationSuite(Freeze|PublicIndex)/,
  /from ["']\.\/executiveIntegrationSuiteFoundation\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteRegistry\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteModel\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteValidation\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteManifest\.ts["']/,
  /from ["']\.\/executiveIntegrationSuitePlatform(Identity|Composition|Compatibility|Capabilities|Dependencies|Readiness)\.ts["']/,
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

describe("EIL-8:7 Executive Integration Suite Certification", () => {
  it("creates exactly eight Certification files", () => {
    assert.equal(EIL87_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL87_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Certification status, and ReadyForFreeze", () => {
    assert.equal(
      ExecutiveIntegrationSuiteCertificationIdentity.phaseId,
      "EIL-8:7",
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertificationIdentity.canonicalId,
      "EIL-8:7/ExecutiveIntegrationSuiteCertification",
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertificationIdentity.name,
      "Executive Integration Suite Certification",
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertificationIdentity.version,
      "1.0.0",
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertificationIdentity.namespace,
      "nexora.eil.executive-integration-suite.certification",
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertificationIdentity.status,
      "Certification",
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertificationIdentity.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertificationReadinessValue,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertificationReadiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertificationIdentity.platformDependency,
      ExecutiveIntegrationSuitePlatformCanonicalId,
    );
  });

  it("consumes Platform aggregate as the sole upstream dependency", () => {
    assert.equal(
      ExecutiveIntegrationSuiteCertificationDependencies.platformOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertificationDependencies.upstreamCanonicalId,
      ExecutiveIntegrationSuitePlatformCanonicalId,
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertification.platformReference.aggregate,
      ExecutiveIntegrationSuitePlatform,
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertificationDependencies.manifestDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertificationDependencies.freezeDependency,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertificationDependencies.publicIndexDependency,
      false,
    );
  });

  it("publishes exactly 18 criteria, 16 gates, and aggregate Pass", () => {
    assert.equal(ExecutiveIntegrationSuiteCertificationCriteria.length, 18);
    assert.equal(ExecutiveIntegrationSuiteCertificationGates.length, 16);
    assert.equal(
      ExecutiveIntegrationSuiteCertificationAggregateResult,
      "Pass",
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertification.aggregateResult,
      "Pass",
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteCertificationCriteria.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CRITERION_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteCertificationGates.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_GATE_KEYS],
    );
    assertUnique(
      ExecutiveIntegrationSuiteCertificationCriteria.map(
        (item) => item.criterionId,
      ),
      "criterion IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuiteCertificationGates.map((item) => item.gateId),
      "gate IDs",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteCertificationCriteria.map((item) => item.order),
      "criteria",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteCertificationGates.map((item) => item.order),
      "gates",
    );
    assert.ok(
      ExecutiveIntegrationSuiteCertificationGates.every(
        (item) => item.declaredResult === "Pass",
      ),
    );
  });

  it("derives inventory exclusively from Platform without redefining counts", () => {
    const derived =
      ExecutiveIntegrationSuiteCertification.platformDerivedInventory;
    assert.equal(derived.countsDerivedFromPlatform, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.manifestDerivedInventory,
      ExecutiveIntegrationSuitePlatform.manifestDerivedInventory,
    );
    assert.equal(
      derived.categoryCount,
      ExecutiveIntegrationSuitePlatform.manifestDerivedInventory.categoryCount,
    );
    assert.equal(
      derived.ruleCount,
      ExecutiveIntegrationSuitePlatform.manifestDerivedInventory.ruleCount,
    );
    assert.equal(
      derived.gateCount,
      ExecutiveIntegrationSuitePlatform.manifestDerivedInventory.gateCount,
    );
    assert.equal(
      derived.totalValidationInventory,
      ExecutiveIntegrationSuitePlatform.manifestDerivedInventory
        .totalValidationInventory,
    );
    assert.equal(derived.validationAggregateResult, "Pass");
    assert.equal(derived.validationReadiness, "ReadyForManifest");
  });

  it("exposes an immutable aggregate Certification and package Certification surface", () => {
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteCertification),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteCertificationIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteCertificationCriteria),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteCertificationGates),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteCertificationDependencies),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteCertificationReadiness),
      true,
    );

    assert.equal(
      ExecutiveIntegrationSuiteCertification.criteria,
      ExecutiveIntegrationSuiteCertificationCriteria,
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertification.gates,
      ExecutiveIntegrationSuiteCertificationGates,
    );
    assert.equal(
      ExecutiveIntegrationSuiteCertification.dependencies,
      ExecutiveIntegrationSuiteCertificationDependencies,
    );

    for (const exportName of REQUIRED_CERTIFICATION_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime certification or integration behavior", () => {
    const certification = ExecutiveIntegrationSuiteCertification;
    assert.equal(certification.metadataOnly, true);
    assert.equal(certification.compositionOnly, true);
    assert.equal(certification.runtimeBehavior, false);
    assert.equal(certification.certificationEngine, false);
    assert.equal(certification.runtimeValidation, false);
    assert.equal(certification.integrationRuntime, false);
    assert.equal(certification.orchestration, false);
    assert.equal(certification.routing, false);
    assert.equal(certification.governance, false);
    assert.equal(certification.observability, false);
    assert.equal(certification.dashboard, false);
    assert.equal(certification.networkingBehavior, false);
    assert.equal(certification.persistenceBehavior, false);
    assert.equal(certification.reactBehavior, false);
    assert.equal(certification.stateMutation, false);
    assert.equal(certification.importsLaterEil8Phases, false);
  });

  it("has zero prohibited imports across certification sources", () => {
    const sources = EIL87_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/executiveIntegrationSuitePlatform\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for certification sources", () => {
    const sources = EIL87_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/executiveIntegrationSuite/executiveIntegrationSuitePlatform.ts",
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
