/**
 * EIL-6:4 — Integration Observability Validation Tests.
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
  IntegrationObservabilityModel,
  IntegrationObservabilityModelCanonicalId,
} from "./integrationObservabilityModel.ts";
import {
  IntegrationObservabilityValidation,
  IntegrationObservabilityValidationAggregateResult,
  IntegrationObservabilityValidationCategories,
  IntegrationObservabilityValidationGates,
  IntegrationObservabilityValidationIdentity,
  IntegrationObservabilityValidationInventory,
  IntegrationObservabilityValidationReadiness,
  IntegrationObservabilityValidationReport,
  IntegrationObservabilityValidationRules,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL64_FILES = Object.freeze([
  "integrationObservabilityValidation.ts",
  "integrationObservabilityValidationRules.ts",
  "integrationObservabilityValidationCategories.ts",
  "integrationObservabilityValidationResults.ts",
  "integrationObservabilityValidationGates.ts",
  "integrationObservabilityValidationInventory.ts",
  "integrationObservabilityValidationReport.ts",
  "integrationObservabilityValidation.test.ts",
]);

const REQUIRED_VALIDATION_EXPORTS = Object.freeze([
  "IntegrationObservabilityValidationIdentity",
  "IntegrationObservabilityValidation",
  "IntegrationObservabilityValidationCategories",
  "IntegrationObservabilityValidationRules",
  "IntegrationObservabilityValidationGates",
  "IntegrationObservabilityValidationInventory",
  "IntegrationObservabilityValidationReport",
  "IntegrationObservabilityValidationReadiness",
  "IntegrationObservabilityValidationAggregateResult",
] as const);

const EXPECTED_CATEGORY_KEYS = Object.freeze([
  "IdentityValidation",
  "NamespaceValidation",
  "DependencyValidation",
  "InventoryValidation",
  "RelationshipValidation",
  "OrderingValidation",
  "ImmutabilityValidation",
  "ExportValidation",
  "MetadataValidation",
  "ReadinessValidation",
] as const);

const EXPECTED_GATE_KEYS = Object.freeze([
  "IdentityComplete",
  "NamespaceComplete",
  "RegistryDependencyVerified",
  "ModelDependencyVerified",
  "InventoryVerified",
  "RelationshipsVerified",
  "MetadataVerified",
  "ExportSurfaceVerified",
  "ImmutabilityVerified",
  "DeterministicOrderingVerified",
  "RuntimeIndependenceVerified",
  "PackageIntegrityVerified",
  "TypeIntegrityVerified",
  "ValidationComplete",
  "ArchitectureApproved",
  "ReadyForManifest",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationObservability(Manifest|Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\/integrationObservabilityFoundation\.ts["']/,
  /from ["']\.\/integrationObservabilityRegistry\.ts["']/,
  /from ["']\.\/integrationObservability(Domain|Contract|Capability|Metric|Event|Lifecycle)(Registry|Models)\.ts["']/,
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

describe("EIL-6:4 Integration Observability Validation", () => {
  it("creates exactly eight Validation files", () => {
    assert.equal(EIL64_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL64_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Validation status, and ReadyForManifest", () => {
    assert.equal(IntegrationObservabilityValidationIdentity.phaseId, "EIL-6:4");
    assert.equal(
      IntegrationObservabilityValidationIdentity.canonicalId,
      "EIL-6:4/IntegrationObservabilityValidation",
    );
    assert.equal(
      IntegrationObservabilityValidationIdentity.name,
      "Integration Observability Validation",
    );
    assert.equal(IntegrationObservabilityValidationIdentity.version, "1.0.0");
    assert.equal(
      IntegrationObservabilityValidationIdentity.namespace,
      "nexora.eil.integration-observability.validation",
    );
    assert.equal(
      IntegrationObservabilityValidationIdentity.status,
      "Validation",
    );
    assert.equal(
      IntegrationObservabilityValidationIdentity.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationObservabilityValidationReadiness,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationObservabilityValidation.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationObservabilityValidationIdentity.modelDependency,
      IntegrationObservabilityModelCanonicalId,
    );
  });

  it("consumes Model aggregate as the sole upstream dependency", () => {
    assert.equal(IntegrationObservabilityValidation.dependency.modelOnly, true);
    assert.equal(
      IntegrationObservabilityValidation.dependency.upstreamCanonicalId,
      IntegrationObservabilityModelCanonicalId,
    );
    assert.equal(
      IntegrationObservabilityValidation.model,
      IntegrationObservabilityModel,
    );
    assert.equal(
      IntegrationObservabilityValidation.dependency.registryDirectImport,
      false,
    );
    assert.equal(
      IntegrationObservabilityValidation.dependency.foundationDirectImport,
      false,
    );
    assert.equal(
      IntegrationObservabilityValidation.dependency.laterEil6PhaseImport,
      false,
    );
  });

  it("publishes 10 categories, 40 rules, 16 gates with derived inventory 66", () => {
    assert.equal(IntegrationObservabilityValidationCategories.length, 10);
    assert.equal(IntegrationObservabilityValidationRules.length, 40);
    assert.equal(IntegrationObservabilityValidationGates.length, 16);

    const derived =
      IntegrationObservabilityValidationCategories.length +
      IntegrationObservabilityValidationRules.length +
      IntegrationObservabilityValidationGates.length;

    assert.equal(derived, 66);
    assert.equal(
      IntegrationObservabilityValidationInventory.totalValidationInventory,
      derived,
    );
    assert.equal(
      IntegrationObservabilityValidationInventory.countsDerivedFromCollections,
      true,
    );
    assert.equal(IntegrationObservabilityValidationAggregateResult, "Pass");
    assert.equal(
      IntegrationObservabilityValidation.aggregateResult,
      "Pass",
    );
    assert.equal(
      IntegrationObservabilityValidationReport.aggregateResult,
      "Pass",
    );
  });

  it("preserves category/gate order, uniqueness, and rule distribution", () => {
    assert.deepEqual(
      IntegrationObservabilityValidationCategories.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CATEGORY_KEYS],
    );
    assert.deepEqual(
      IntegrationObservabilityValidationGates.map((item) => item.canonicalKey),
      [...EXPECTED_GATE_KEYS],
    );

    assertUnique(
      IntegrationObservabilityValidationCategories.map(
        (item) => item.categoryId,
      ),
      "category IDs",
    );
    assertUnique(
      IntegrationObservabilityValidationRules.map((item) => item.ruleId),
      "rule IDs",
    );
    assertUnique(
      IntegrationObservabilityValidationGates.map((item) => item.gateId),
      "gate IDs",
    );
    assertUnique(
      IntegrationObservabilityValidationRules.map((item) => item.canonicalKey),
      "rule keys",
    );

    assertSequentialOrders(
      IntegrationObservabilityValidationCategories.map((item) => item.order),
      "categories",
    );
    assertSequentialOrders(
      IntegrationObservabilityValidationRules.map((item) => item.order),
      "rules",
    );
    assertSequentialOrders(
      IntegrationObservabilityValidationGates.map((item) => item.order),
      "gates",
    );

    for (const categoryKey of EXPECTED_CATEGORY_KEYS) {
      const rulesForCategory = IntegrationObservabilityValidationRules.filter(
        (item) => item.categoryKey === categoryKey,
      );
      assert.equal(
        rulesForCategory.length,
        4,
        `${categoryKey} must have exactly 4 rules`,
      );
    }

    assert.ok(
      IntegrationObservabilityValidationRules.every(
        (item) =>
          item.declaredResult === "Pass" &&
          item.sourceModelId === IntegrationObservabilityModelCanonicalId,
      ),
    );
    assert.ok(
      IntegrationObservabilityValidationGates.every(
        (item) => item.declaredResult === "Pass",
      ),
    );
  });

  it("exposes an immutable aggregate Validation and package Validation surface", () => {
    assert.equal(Object.isFrozen(IntegrationObservabilityValidation), true);
    assert.equal(
      Object.isFrozen(IntegrationObservabilityValidationCategories),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationObservabilityValidationRules), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityValidationGates), true);
    assert.equal(
      Object.isFrozen(IntegrationObservabilityValidationInventory),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityValidationReport),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityValidationIdentity),
      true,
    );

    assert.equal(
      IntegrationObservabilityValidation.categories,
      IntegrationObservabilityValidationCategories,
    );
    assert.equal(
      IntegrationObservabilityValidation.rules,
      IntegrationObservabilityValidationRules,
    );
    assert.equal(
      IntegrationObservabilityValidation.gates,
      IntegrationObservabilityValidationGates,
    );
    assert.equal(
      IntegrationObservabilityValidation.report,
      IntegrationObservabilityValidationReport,
    );

    for (const exportName of REQUIRED_VALIDATION_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime validation or observability behavior", () => {
    const validation = IntegrationObservabilityValidation;
    assert.equal(validation.metadataOnly, true);
    assert.equal(validation.runtimeBehavior, false);
    assert.equal(validation.runtimeValidation, false);
    assert.equal(validation.validationEngine, false);
    assert.equal(validation.monitoringEngine, false);
    assert.equal(validation.telemetryPipeline, false);
    assert.equal(validation.openTelemetry, false);
    assert.equal(validation.prometheus, false);
    assert.equal(validation.grafana, false);
    assert.equal(validation.loggingFramework, false);
    assert.equal(validation.tracingRuntime, false);
    assert.equal(validation.metricsCollector, false);
    assert.equal(validation.metricEvaluation, false);
    assert.equal(validation.alertEngine, false);
    assert.equal(validation.healthCheckRuntime, false);
    assert.equal(validation.dashboard, false);
    assert.equal(validation.networkingBehavior, false);
    assert.equal(validation.persistenceBehavior, false);
    assert.equal(validation.stateMutation, false);
    assert.equal(validation.importsLaterEil6Phases, false);
    assert.equal(
      IntegrationObservabilityValidationReport.evaluatesRuntime,
      false,
    );
  });

  it("has zero prohibited imports across validation sources", () => {
    const sources = EIL64_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    }

    assert.match(
      readFileSync(join(HERE, "integrationObservabilityValidation.ts"), "utf8"),
      /from ["']\.\/integrationObservabilityModel\.ts["']/,
    );
  });

  it("passes strict TypeScript and ESLint for validation sources", () => {
    const sources = EIL64_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationObservability/integrationObservabilityModel.ts",
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
