/**
 * EIL-9:7 — Executive Integration Layer Certification Tests.
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
  ExecutiveIntegrationLayerPlatform,
  ExecutiveIntegrationLayerPlatformCanonicalId,
} from "./executiveIntegrationLayerPlatform.ts";
import {
  ExecutiveIntegrationLayerCertification,
  ExecutiveIntegrationLayerCertificationAggregateResult,
  ExecutiveIntegrationLayerCertificationCriteria,
  ExecutiveIntegrationLayerCertificationDependencies,
  ExecutiveIntegrationLayerCertificationGates,
  ExecutiveIntegrationLayerCertificationIdentity,
  ExecutiveIntegrationLayerCertificationReadiness,
  ExecutiveIntegrationLayerCertificationReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL97_FILES = Object.freeze([
  "executiveIntegrationLayerCertification.ts",
  "executiveIntegrationLayerCertificationIdentity.ts",
  "executiveIntegrationLayerCertificationCriteria.ts",
  "executiveIntegrationLayerCertificationGates.ts",
  "executiveIntegrationLayerCertificationResults.ts",
  "executiveIntegrationLayerCertificationDependencies.ts",
  "executiveIntegrationLayerCertificationReadiness.ts",
  "executiveIntegrationLayerCertification.test.ts",
]);

const REQUIRED_CERTIFICATION_EXPORTS = Object.freeze([
  "ExecutiveIntegrationLayerCertificationIdentity",
  "ExecutiveIntegrationLayerCertification",
  "ExecutiveIntegrationLayerCertificationCriteria",
  "ExecutiveIntegrationLayerCertificationGates",
  "ExecutiveIntegrationLayerCertificationDependencies",
  "ExecutiveIntegrationLayerCertificationReadiness",
  "ExecutiveIntegrationLayerCertificationAggregateResult",
  "ExecutiveIntegrationLayerCertificationCanonicalId",
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
  /from ["']\.\/executiveIntegrationLayer(Freeze|PublicIndex)/,
  /from ["']\.\/executiveIntegrationLayerFoundation\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerRegistry\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerModel\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerValidation\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerManifest\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerPlatform(Identity|Composition|Compatibility|Capabilities|Dependencies|Readiness)\.ts["']/,
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

describe("EIL-9:7 Executive Integration Layer Certification", () => {
  it("creates exactly eight Certification files", () => {
    assert.equal(EIL97_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL97_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Certification status, and ReadyForFreeze", () => {
    assert.equal(
      ExecutiveIntegrationLayerCertificationIdentity.phaseId,
      "EIL-9:7",
    );
    assert.equal(
      ExecutiveIntegrationLayerCertificationIdentity.canonicalId,
      "EIL-9:7/ExecutiveIntegrationLayerCertification",
    );
    assert.equal(
      ExecutiveIntegrationLayerCertificationIdentity.name,
      "Executive Integration Layer Certification",
    );
    assert.equal(
      ExecutiveIntegrationLayerCertificationIdentity.version,
      "1.0.0",
    );
    assert.equal(
      ExecutiveIntegrationLayerCertificationIdentity.namespace,
      "nexora.eil.executive-integration-layer.certification",
    );
    assert.equal(
      ExecutiveIntegrationLayerCertificationIdentity.status,
      "Certification",
    );
    assert.equal(
      ExecutiveIntegrationLayerCertificationIdentity.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveIntegrationLayerCertificationReadinessValue,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveIntegrationLayerCertificationReadiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveIntegrationLayerCertificationIdentity.platformDependency,
      ExecutiveIntegrationLayerPlatformCanonicalId,
    );
  });

  it("consumes Platform aggregate as the sole upstream dependency", () => {
    assert.equal(
      ExecutiveIntegrationLayerCertificationDependencies.platformOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerCertificationDependencies.upstreamCanonicalId,
      ExecutiveIntegrationLayerPlatformCanonicalId,
    );
    assert.equal(
      ExecutiveIntegrationLayerCertification.platformReference.aggregate,
      ExecutiveIntegrationLayerPlatform,
    );
    assert.equal(
      ExecutiveIntegrationLayerCertificationDependencies.manifestDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerCertificationDependencies.freezeDependency,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerCertificationDependencies.publicIndexDependency,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerCertificationDependencies.eil8DirectImport,
      false,
    );
  });

  it("publishes exactly 18 criteria, 16 gates, and aggregate Pass", () => {
    assert.equal(ExecutiveIntegrationLayerCertificationCriteria.length, 18);
    assert.equal(ExecutiveIntegrationLayerCertificationGates.length, 16);
    assert.equal(
      ExecutiveIntegrationLayerCertificationAggregateResult,
      "Pass",
    );
    assert.equal(
      ExecutiveIntegrationLayerCertification.aggregateResult,
      "Pass",
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerCertificationCriteria.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CRITERION_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerCertificationGates.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_GATE_KEYS],
    );
    assertUnique(
      ExecutiveIntegrationLayerCertificationCriteria.map(
        (item) => item.criterionId,
      ),
      "criterion IDs",
    );
    assertUnique(
      ExecutiveIntegrationLayerCertificationGates.map((item) => item.gateId),
      "gate IDs",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerCertificationCriteria.map((item) => item.order),
      "criteria",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerCertificationGates.map((item) => item.order),
      "gates",
    );
    assert.ok(
      ExecutiveIntegrationLayerCertificationGates.every(
        (item) => item.declaredResult === "Pass",
      ),
    );
  });

  it("derives inventory exclusively from Platform without redefining counts", () => {
    const derived =
      ExecutiveIntegrationLayerCertification.platformDerivedInventory;
    assert.equal(derived.countsDerivedFromPlatform, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.manifestDerivedInventory,
      ExecutiveIntegrationLayerPlatform.manifestDerivedInventory,
    );
    assert.equal(
      derived.categoryCount,
      ExecutiveIntegrationLayerPlatform.manifestDerivedInventory.categoryCount,
    );
    assert.equal(
      derived.ruleCount,
      ExecutiveIntegrationLayerPlatform.manifestDerivedInventory.ruleCount,
    );
    assert.equal(
      derived.gateCount,
      ExecutiveIntegrationLayerPlatform.manifestDerivedInventory.gateCount,
    );
    assert.equal(
      derived.totalValidationInventory,
      ExecutiveIntegrationLayerPlatform.manifestDerivedInventory
        .totalValidationInventory,
    );
    assert.equal(derived.validationAggregateResult, "Pass");
    assert.equal(derived.validationReadiness, "ReadyForManifest");
  });

  it("exposes an immutable aggregate Certification and package Certification surface", () => {
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerCertification),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerCertificationIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerCertificationCriteria),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerCertificationGates),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerCertificationDependencies),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerCertificationReadiness),
      true,
    );

    assert.equal(
      ExecutiveIntegrationLayerCertification.criteria,
      ExecutiveIntegrationLayerCertificationCriteria,
    );
    assert.equal(
      ExecutiveIntegrationLayerCertification.gates,
      ExecutiveIntegrationLayerCertificationGates,
    );
    assert.equal(
      ExecutiveIntegrationLayerCertification.dependencies,
      ExecutiveIntegrationLayerCertificationDependencies,
    );

    for (const exportName of REQUIRED_CERTIFICATION_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime certification or integration behavior", () => {
    const certification = ExecutiveIntegrationLayerCertification;
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
    assert.equal(certification.importsLaterEil9Phases, false);
  });

  it("has zero prohibited imports across certification sources", () => {
    const sources = EIL97_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/executiveIntegrationLayerPlatform\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for certification sources", () => {
    const sources = EIL97_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/executiveIntegrationLayer/executiveIntegrationLayerPlatform.ts",
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
