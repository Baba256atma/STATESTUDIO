/**
 * EIL-9:4 — Executive Integration Layer Validation Tests.
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
  ExecutiveIntegrationLayerModel,
  ExecutiveIntegrationLayerModelCanonicalId,
} from "./executiveIntegrationLayerModel.ts";
import {
  ExecutiveIntegrationLayerValidation,
  ExecutiveIntegrationLayerValidationAggregateResult,
  ExecutiveIntegrationLayerValidationCategories,
  ExecutiveIntegrationLayerValidationGates,
  ExecutiveIntegrationLayerValidationIdentity,
  ExecutiveIntegrationLayerValidationInventory,
  ExecutiveIntegrationLayerValidationReadiness,
  ExecutiveIntegrationLayerValidationReport,
  ExecutiveIntegrationLayerValidationRules,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL94_FILES = Object.freeze([
  "executiveIntegrationLayerValidation.ts",
  "executiveIntegrationLayerValidationRules.ts",
  "executiveIntegrationLayerValidationCategories.ts",
  "executiveIntegrationLayerValidationResults.ts",
  "executiveIntegrationLayerValidationGates.ts",
  "executiveIntegrationLayerValidationInventory.ts",
  "executiveIntegrationLayerValidationReport.ts",
  "executiveIntegrationLayerValidation.test.ts",
]);

const REQUIRED_VALIDATION_EXPORTS = Object.freeze([
  "ExecutiveIntegrationLayerValidationIdentity",
  "ExecutiveIntegrationLayerValidation",
  "ExecutiveIntegrationLayerValidationCategories",
  "ExecutiveIntegrationLayerValidationRules",
  "ExecutiveIntegrationLayerValidationGates",
  "ExecutiveIntegrationLayerValidationInventory",
  "ExecutiveIntegrationLayerValidationReport",
  "ExecutiveIntegrationLayerValidationReadiness",
  "ExecutiveIntegrationLayerValidationAggregateResult",
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
  /from ["']\.\/executiveIntegrationLayer(Manifest|Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\/executiveIntegrationLayerFoundation\.ts["']/,
  /from ["']\.\/executiveIntegrationLayerRegistry\.ts["']/,
  /from ["']\.\/executiveIntegrationLayer(Module|Contract|Capability|Domain|Lifecycle|Composition)(Registry|Models)\.ts["']/,
  /from ["']\.\/executiveIntegrationLayer(Contracts|Capabilities|Domains|Lifecycle|Modules|Composition|RelationshipModels)\.ts["']/,
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

describe("EIL-9:4 Executive Integration Layer Validation", () => {
  it("creates exactly eight Validation files", () => {
    assert.equal(EIL94_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL94_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Validation status, and ReadyForManifest", () => {
    assert.equal(
      ExecutiveIntegrationLayerValidationIdentity.phaseId,
      "EIL-9:4",
    );
    assert.equal(
      ExecutiveIntegrationLayerValidationIdentity.canonicalId,
      "EIL-9:4/ExecutiveIntegrationLayerValidation",
    );
    assert.equal(
      ExecutiveIntegrationLayerValidationIdentity.name,
      "Executive Integration Layer Validation",
    );
    assert.equal(
      ExecutiveIntegrationLayerValidationIdentity.version,
      "1.0.0",
    );
    assert.equal(
      ExecutiveIntegrationLayerValidationIdentity.namespace,
      "nexora.eil.executive-integration-layer.validation",
    );
    assert.equal(
      ExecutiveIntegrationLayerValidationIdentity.status,
      "Validation",
    );
    assert.equal(
      ExecutiveIntegrationLayerValidationIdentity.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      ExecutiveIntegrationLayerValidationReadiness,
      "ReadyForManifest",
    );
    assert.equal(
      ExecutiveIntegrationLayerValidation.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      ExecutiveIntegrationLayerValidationIdentity.modelDependency,
      ExecutiveIntegrationLayerModelCanonicalId,
    );
  });

  it("consumes Model aggregate as the sole upstream dependency", () => {
    assert.equal(
      ExecutiveIntegrationLayerValidation.dependency.modelOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerValidation.dependency.upstreamCanonicalId,
      ExecutiveIntegrationLayerModelCanonicalId,
    );
    assert.equal(
      ExecutiveIntegrationLayerValidation.model,
      ExecutiveIntegrationLayerModel,
    );
    assert.equal(
      ExecutiveIntegrationLayerValidation.dependency.registryDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerValidation.dependency.laterEil9PhaseImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerValidation.dependency.eil8DirectImport,
      false,
    );
  });

  it("publishes exactly 10 categories, 40 rules, 16 gates, inventory 66, and aggregate Pass", () => {
    assert.equal(ExecutiveIntegrationLayerValidationCategories.length, 10);
    assert.equal(ExecutiveIntegrationLayerValidationRules.length, 40);
    assert.equal(ExecutiveIntegrationLayerValidationGates.length, 16);
    assert.equal(ExecutiveIntegrationLayerValidationAggregateResult, "Pass");
    assert.equal(ExecutiveIntegrationLayerValidation.aggregateResult, "Pass");

    const derived =
      ExecutiveIntegrationLayerValidationCategories.length +
      ExecutiveIntegrationLayerValidationRules.length +
      ExecutiveIntegrationLayerValidationGates.length;

    assert.equal(derived, 66);
    assert.equal(
      ExecutiveIntegrationLayerValidationInventory.totalValidationInventory,
      derived,
    );
    assert.equal(
      ExecutiveIntegrationLayerValidationInventory.countsDerivedFromCollections,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerValidationInventory.hardcodedTotals,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerValidationInventory.modelInventory,
      ExecutiveIntegrationLayerModel.inventory,
    );

    assert.deepEqual(
      ExecutiveIntegrationLayerValidationCategories.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CATEGORY_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerValidationGates.map((item) => item.canonicalKey),
      [...EXPECTED_GATE_KEYS],
    );

    assertUnique(
      ExecutiveIntegrationLayerValidationCategories.map(
        (item) => item.categoryId,
      ),
      "category IDs",
    );
    assertUnique(
      ExecutiveIntegrationLayerValidationRules.map((item) => item.ruleId),
      "rule IDs",
    );
    assertUnique(
      ExecutiveIntegrationLayerValidationGates.map((item) => item.gateId),
      "gate IDs",
    );

    assertSequentialOrders(
      ExecutiveIntegrationLayerValidationCategories.map((item) => item.order),
      "categories",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerValidationRules.map((item) => item.order),
      "rules",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerValidationGates.map((item) => item.order),
      "gates",
    );

    assert.ok(
      ExecutiveIntegrationLayerValidationRules.every(
        (item) => item.declaredResult === "Pass",
      ),
    );
    assert.ok(
      ExecutiveIntegrationLayerValidationGates.every(
        (item) => item.declaredResult === "Pass",
      ),
    );
  });

  it("exposes immutable aggregate Validation, report, and package Validation surface", () => {
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerValidation), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerValidationIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerValidationReport),
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerValidation.report,
      ExecutiveIntegrationLayerValidationReport,
    );
    assert.equal(
      ExecutiveIntegrationLayerValidation.inventory,
      ExecutiveIntegrationLayerValidationInventory,
    );

    for (const exportName of REQUIRED_VALIDATION_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime validation or integration behavior", () => {
    const validation = ExecutiveIntegrationLayerValidation;
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
    assert.equal(validation.importsLaterEil9Phases, false);
  });

  it("has zero prohibited imports across validation sources", () => {
    const sources = EIL94_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/executiveIntegrationLayerModel\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for validation sources", () => {
    const sources = EIL94_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/executiveIntegrationLayer/executiveIntegrationLayerModel.ts",
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
