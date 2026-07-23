/**
 * EIL-8:4 — Executive Integration Suite Validation Tests.
 *
 * Deterministic architectural coverage for the immutable Validation phase.
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
  ExecutiveIntegrationSuiteModel,
  ExecutiveIntegrationSuiteModelCanonicalId,
} from "./executiveIntegrationSuiteModel.ts";
import {
  ExecutiveIntegrationSuiteValidation,
  ExecutiveIntegrationSuiteValidationAggregateResult,
  ExecutiveIntegrationSuiteValidationCategories,
  ExecutiveIntegrationSuiteValidationGates,
  ExecutiveIntegrationSuiteValidationIdentity,
  ExecutiveIntegrationSuiteValidationInventory,
  ExecutiveIntegrationSuiteValidationReadiness,
  ExecutiveIntegrationSuiteValidationReport,
  ExecutiveIntegrationSuiteValidationRules,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL84_FILES = Object.freeze([
  "executiveIntegrationSuiteValidation.ts",
  "executiveIntegrationSuiteValidationRules.ts",
  "executiveIntegrationSuiteValidationCategories.ts",
  "executiveIntegrationSuiteValidationResults.ts",
  "executiveIntegrationSuiteValidationGates.ts",
  "executiveIntegrationSuiteValidationInventory.ts",
  "executiveIntegrationSuiteValidationReport.ts",
  "executiveIntegrationSuiteValidation.test.ts",
]);

const REQUIRED_VALIDATION_EXPORTS = Object.freeze([
  "ExecutiveIntegrationSuiteValidationIdentity",
  "ExecutiveIntegrationSuiteValidation",
  "ExecutiveIntegrationSuiteValidationCategories",
  "ExecutiveIntegrationSuiteValidationRules",
  "ExecutiveIntegrationSuiteValidationGates",
  "ExecutiveIntegrationSuiteValidationInventory",
  "ExecutiveIntegrationSuiteValidationReport",
  "ExecutiveIntegrationSuiteValidationReadiness",
  "ExecutiveIntegrationSuiteValidationAggregateResult",
] as const);

const EXPECTED_CATEGORY_KEYS = Object.freeze([
  "Identity",
  "Namespace",
  "Dependency",
  "Inventory",
  "Relationship",
  "Ordering",
  "Immutability",
  "Export",
  "Metadata",
  "Readiness",
] as const);

const EXPECTED_GATE_KEYS = Object.freeze([
  "IdentityComplete",
  "NamespaceComplete",
  "DependencyVerified",
  "RegistryReferenceVerified",
  "ModelReferenceVerified",
  "InventoryVerified",
  "RelationshipVerified",
  "MetadataVerified",
  "ExportSurfaceVerified",
  "OrderingVerified",
  "ImmutabilityVerified",
  "PackageIntegrityVerified",
  "TypeIntegrityVerified",
  "ValidationComplete",
  "ArchitectureApproved",
  "ReadyForManifest",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/executiveIntegrationSuite(Manifest|Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\/executiveIntegrationSuiteFoundation\.ts["']/,
  /from ["']\.\/executiveIntegrationSuiteRegistry\.ts["']/,
  /from ["']\.\/executiveIntegrationSuite(Module|Contract|Capability|Domain|Lifecycle|Composition)(Registry|Models)\.ts["']/,
  /from ["']\.\/executiveIntegrationSuite(Contracts|Capabilities|Domains|Lifecycle|Modules|Composition|RelationshipModels)\.ts["']/,
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

describe("EIL-8:4 Executive Integration Suite Validation", () => {
  it("creates exactly eight Validation files", () => {
    assert.equal(EIL84_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL84_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Validation status, and ReadyForManifest", () => {
    assert.equal(
      ExecutiveIntegrationSuiteValidationIdentity.phaseId,
      "EIL-8:4",
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidationIdentity.canonicalId,
      "EIL-8:4/ExecutiveIntegrationSuiteValidation",
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidationIdentity.name,
      "Executive Integration Suite Validation",
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidationIdentity.version,
      "1.0.0",
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidationIdentity.namespace,
      "nexora.eil.executive-integration-suite.validation",
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidationIdentity.status,
      "Validation",
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidationIdentity.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidationReadiness,
      "ReadyForManifest",
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidation.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidationIdentity.modelDependency,
      ExecutiveIntegrationSuiteModelCanonicalId,
    );
  });

  it("consumes Model aggregate as the sole upstream dependency", () => {
    assert.equal(
      ExecutiveIntegrationSuiteValidation.dependency.modelOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidation.dependency.upstreamCanonicalId,
      ExecutiveIntegrationSuiteModelCanonicalId,
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidation.model,
      ExecutiveIntegrationSuiteModel,
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidation.dependency.registryDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidation.dependency.laterEil8PhaseImport,
      false,
    );
  });

  it("publishes exactly 10 categories, 40 rules, 16 gates, inventory 66, and aggregate Pass", () => {
    assert.equal(ExecutiveIntegrationSuiteValidationCategories.length, 10);
    assert.equal(ExecutiveIntegrationSuiteValidationRules.length, 40);
    assert.equal(ExecutiveIntegrationSuiteValidationGates.length, 16);
    assert.equal(ExecutiveIntegrationSuiteValidationAggregateResult, "Pass");
    assert.equal(ExecutiveIntegrationSuiteValidation.aggregateResult, "Pass");

    const derived =
      ExecutiveIntegrationSuiteValidationCategories.length +
      ExecutiveIntegrationSuiteValidationRules.length +
      ExecutiveIntegrationSuiteValidationGates.length;

    assert.equal(derived, 66);
    assert.equal(
      ExecutiveIntegrationSuiteValidationInventory.totalValidationInventory,
      derived,
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidationInventory.countsDerivedFromCollections,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidationInventory.hardcodedTotals,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidationInventory.modelInventory,
      ExecutiveIntegrationSuiteModel.inventory,
    );

    assert.deepEqual(
      ExecutiveIntegrationSuiteValidationCategories.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CATEGORY_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteValidationGates.map((item) => item.canonicalKey),
      [...EXPECTED_GATE_KEYS],
    );

    assertUnique(
      ExecutiveIntegrationSuiteValidationCategories.map(
        (item) => item.categoryId,
      ),
      "category IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuiteValidationRules.map((item) => item.ruleId),
      "rule IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuiteValidationGates.map((item) => item.gateId),
      "gate IDs",
    );

    assertSequentialOrders(
      ExecutiveIntegrationSuiteValidationCategories.map((item) => item.order),
      "categories",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteValidationRules.map((item) => item.order),
      "rules",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteValidationGates.map((item) => item.order),
      "gates",
    );

    assert.ok(
      ExecutiveIntegrationSuiteValidationRules.every(
        (item) => item.declaredResult === "Pass",
      ),
    );
    assert.ok(
      ExecutiveIntegrationSuiteValidationGates.every(
        (item) => item.declaredResult === "Pass",
      ),
    );
  });

  it("exposes immutable aggregate Validation, report, and package Validation surface", () => {
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuiteValidation), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteValidationIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteValidationReport),
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidation.report,
      ExecutiveIntegrationSuiteValidationReport,
    );
    assert.equal(
      ExecutiveIntegrationSuiteValidation.inventory,
      ExecutiveIntegrationSuiteValidationInventory,
    );

    for (const exportName of REQUIRED_VALIDATION_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime validation or integration behavior", () => {
    const validation = ExecutiveIntegrationSuiteValidation;
    assert.equal(validation.metadataOnly, true);
    assert.equal(validation.compositionOnly, true);
    assert.equal(validation.runtimeBehavior, false);
    assert.equal(validation.runtimeValidation, false);
    assert.equal(validation.validationEngine, false);
    assert.equal(validation.integrationRuntime, false);
    assert.equal(validation.orchestration, false);
    assert.equal(validation.routing, false);
    assert.equal(validation.governance, false);
    assert.equal(validation.observability, false);
    assert.equal(validation.networkingBehavior, false);
    assert.equal(validation.persistenceBehavior, false);
    assert.equal(validation.reactBehavior, false);
    assert.equal(validation.importsLaterEil8Phases, false);
  });

  it("has zero prohibited imports across validation sources", () => {
    const sources = EIL84_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/executiveIntegrationSuiteModel\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for validation sources", () => {
    const sources = EIL84_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/executiveIntegrationSuite/executiveIntegrationSuiteModel.ts",
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
