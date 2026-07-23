/**
 * EIL-7:5 — Integration Governance Manifest Tests.
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
  IntegrationGovernanceValidation,
  IntegrationGovernanceValidationCanonicalId,
} from "./integrationGovernanceValidation.ts";
import {
  IntegrationGovernanceManifest,
  IntegrationGovernanceManifestCompatibility,
  IntegrationGovernanceManifestDependencies,
  IntegrationGovernanceManifestExports,
  IntegrationGovernanceManifestGuarantees,
  IntegrationGovernanceManifestIdentity,
  IntegrationGovernanceManifestReadiness,
  IntegrationGovernanceManifestReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL75_FILES = Object.freeze([
  "integrationGovernanceManifest.ts",
  "integrationGovernanceManifestIdentity.ts",
  "integrationGovernanceManifestReadiness.ts",
  "integrationGovernanceManifestCompatibility.ts",
  "integrationGovernanceManifestGuarantees.ts",
  "integrationGovernanceManifestDependencies.ts",
  "integrationGovernanceManifestExports.ts",
  "integrationGovernanceManifest.test.ts",
]);

const REQUIRED_MANIFEST_EXPORTS = Object.freeze([
  "IntegrationGovernanceManifestIdentity",
  "IntegrationGovernanceManifest",
  "IntegrationGovernanceManifestGuarantees",
  "IntegrationGovernanceManifestCompatibility",
  "IntegrationGovernanceManifestDependencies",
  "IntegrationGovernanceManifestExports",
  "IntegrationGovernanceManifestReadiness",
  "IntegrationGovernanceManifestCanonicalId",
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
  "GovernanceIntegrity",
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
  /from ["']\.\/integrationGovernance(Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\/integrationGovernanceFoundation\.ts["']/,
  /from ["']\.\/integrationGovernanceRegistry\.ts["']/,
  /from ["']\.\/integrationGovernanceModel\.ts["']/,
  /from ["']\.\/integrationGovernanceValidation(Rules|Categories|Results|Gates|Inventory|Report)\.ts["']/,
  /from ["']\.\.\/integration(?!Governance)/,
  /from ["']\.\.\/integrationObservability/,
  /from ["']\.\.\/integrationPolicyGovernance/,
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

describe("EIL-7:5 Integration Governance Manifest", () => {
  it("creates exactly eight Manifest files", () => {
    assert.equal(EIL75_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL75_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Manifest status, and ReadyForPlatform", () => {
    assert.equal(IntegrationGovernanceManifestIdentity.phaseId, "EIL-7:5");
    assert.equal(
      IntegrationGovernanceManifestIdentity.canonicalId,
      "EIL-7:5/IntegrationGovernanceManifest",
    );
    assert.equal(
      IntegrationGovernanceManifestIdentity.name,
      "Integration Governance Manifest",
    );
    assert.equal(IntegrationGovernanceManifestIdentity.version, "1.0.0");
    assert.equal(
      IntegrationGovernanceManifestIdentity.namespace,
      "nexora.eil.integration-governance.manifest",
    );
    assert.equal(IntegrationGovernanceManifestIdentity.status, "Manifest");
    assert.equal(
      IntegrationGovernanceManifestIdentity.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationGovernanceManifestReadinessValue,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationGovernanceManifestReadiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationGovernanceManifestIdentity.validationDependency,
      IntegrationGovernanceValidationCanonicalId,
    );
  });

  it("consumes Validation aggregate as the sole upstream dependency", () => {
    assert.equal(
      IntegrationGovernanceManifestDependencies.validationOnly,
      true,
    );
    assert.equal(
      IntegrationGovernanceManifestDependencies.upstreamCanonicalId,
      IntegrationGovernanceValidationCanonicalId,
    );
    assert.equal(
      IntegrationGovernanceManifest.validationReference.aggregate,
      IntegrationGovernanceValidation,
    );
    assert.equal(
      IntegrationGovernanceManifestDependencies.modelDirectImport,
      false,
    );
    assert.equal(
      IntegrationGovernanceManifestDependencies.registryDirectImport,
      false,
    );
    assert.equal(
      IntegrationGovernanceManifestDependencies.laterEil7PhaseImport,
      false,
    );
    assert.equal(
      IntegrationGovernanceManifestDependencies.downstreamImplementationDependency,
      false,
    );
  });

  it("publishes exactly 16 guarantees and 12 compatibility declarations", () => {
    assert.equal(IntegrationGovernanceManifestGuarantees.length, 16);
    assert.equal(IntegrationGovernanceManifestCompatibility.length, 12);
    assert.deepEqual(
      IntegrationGovernanceManifestGuarantees.map((item) => item.canonicalKey),
      [...EXPECTED_GUARANTEE_KEYS],
    );
    assert.deepEqual(
      IntegrationGovernanceManifestCompatibility.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_COMPATIBILITY_KEYS],
    );
    assertUnique(
      IntegrationGovernanceManifestGuarantees.map((item) => item.guaranteeId),
      "guarantee IDs",
    );
    assertUnique(
      IntegrationGovernanceManifestCompatibility.map(
        (item) => item.compatibilityId,
      ),
      "compatibility IDs",
    );
    assertSequentialOrders(
      IntegrationGovernanceManifestGuarantees.map((item) => item.order),
      "guarantees",
    );
    assertSequentialOrders(
      IntegrationGovernanceManifestCompatibility.map((item) => item.order),
      "compatibility",
    );
  });

  it("derives inventory exclusively from Validation without redefining counts", () => {
    const derived = IntegrationGovernanceManifest.validationDerivedInventory;
    assert.equal(derived.countsDerivedFromValidation, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.validationCategories,
      IntegrationGovernanceValidation.categories,
    );
    assert.equal(
      derived.validationRules,
      IntegrationGovernanceValidation.rules,
    );
    assert.equal(
      derived.validationGates,
      IntegrationGovernanceValidation.gates,
    );
    assert.equal(
      derived.validationInventory,
      IntegrationGovernanceValidation.inventory,
    );
    assert.equal(
      derived.categoryCount,
      IntegrationGovernanceValidation.categories.length,
    );
    assert.equal(
      derived.ruleCount,
      IntegrationGovernanceValidation.rules.length,
    );
    assert.equal(
      derived.gateCount,
      IntegrationGovernanceValidation.gates.length,
    );
    assert.equal(
      derived.totalValidationInventory,
      IntegrationGovernanceValidation.inventory.totalValidationInventory,
    );
    assert.equal(
      derived.validationAggregateResult,
      IntegrationGovernanceValidation.aggregateResult,
    );
    assert.equal(
      derived.validationReadiness,
      IntegrationGovernanceValidation.readiness,
    );
    assert.equal(derived.validationAggregateResult, "Pass");
    assert.equal(derived.validationReadiness, "ReadyForManifest");
  });

  it("exposes an immutable aggregate Manifest and package Manifest surface", () => {
    assert.equal(Object.isFrozen(IntegrationGovernanceManifest), true);
    assert.equal(Object.isFrozen(IntegrationGovernanceManifestIdentity), true);
    assert.equal(
      Object.isFrozen(IntegrationGovernanceManifestGuarantees),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationGovernanceManifestCompatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationGovernanceManifestDependencies),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationGovernanceManifestExports), true);
    assert.equal(Object.isFrozen(IntegrationGovernanceManifestReadiness), true);

    assert.equal(
      IntegrationGovernanceManifest.guarantees,
      IntegrationGovernanceManifestGuarantees,
    );
    assert.equal(
      IntegrationGovernanceManifest.compatibility,
      IntegrationGovernanceManifestCompatibility,
    );
    assert.equal(
      IntegrationGovernanceManifest.dependencies,
      IntegrationGovernanceManifestDependencies,
    );
    assert.equal(
      IntegrationGovernanceManifest.exports,
      IntegrationGovernanceManifestExports,
    );
    assert.equal(IntegrationGovernanceManifestExports.packageEntryOnly, true);
    assert.equal(
      IntegrationGovernanceManifestExports.additionalPackageRoot,
      false,
    );

    for (const exportName of REQUIRED_MANIFEST_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime governance behavior", () => {
    const manifest = IntegrationGovernanceManifest;
    assert.equal(manifest.metadataOnly, true);
    assert.equal(manifest.runtimeBehavior, false);
    assert.equal(manifest.governanceEngine, false);
    assert.equal(manifest.policyEngine, false);
    assert.equal(manifest.complianceEngine, false);
    assert.equal(manifest.approvalWorkflow, false);
    assert.equal(manifest.auditRuntime, false);
    assert.equal(manifest.riskRuntime, false);
    assert.equal(manifest.versionManager, false);
    assert.equal(manifest.compatibilityResolver, false);
    assert.equal(manifest.dashboard, false);
    assert.equal(manifest.networkingBehavior, false);
    assert.equal(manifest.persistenceBehavior, false);
    assert.equal(manifest.runtimeValidation, false);
    assert.equal(manifest.reactBehavior, false);
    assert.equal(manifest.stateMutation, false);
    assert.equal(manifest.importsLaterEil7Phases, false);
  });

  it("has zero prohibited imports across manifest sources", () => {
    const sources = EIL75_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/integrationGovernanceValidation\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for manifest sources", () => {
    const sources = EIL75_FILES.filter((name) => !name.endsWith(".test.ts")).map(
      (name) => join("app/lib/eil/integrationGovernance", name),
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
        "app/lib/eil/integrationGovernance/index.ts",
        "app/lib/eil/integrationGovernance/integrationGovernanceValidation.ts",
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
      [...sources, "app/lib/eil/integrationGovernance/index.ts"],
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
