/**
 * EIL-6:3 — Integration Observability Model Tests.
 *
 * Deterministic architectural coverage for the immutable Model.
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
  IntegrationObservabilityCapabilityModels,
  IntegrationObservabilityContractModels,
  IntegrationObservabilityDomainModels,
  IntegrationObservabilityEventModels,
  IntegrationObservabilityLifecycleModels,
  IntegrationObservabilityMetricModels,
  IntegrationObservabilityModel,
  IntegrationObservabilityModelIdentity,
  IntegrationObservabilityModelInventory,
  IntegrationObservabilityModelReadiness,
  IntegrationObservabilityRelationshipModels,
  IntegrationObservabilityRelationshipTypes,
} from "./index.ts";
import {
  IntegrationObservabilityRegistry,
  IntegrationObservabilityRegistryCanonicalId,
} from "./integrationObservabilityRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL63_FILES = Object.freeze([
  "integrationObservabilityModel.ts",
  "integrationObservabilityDomainModels.ts",
  "integrationObservabilityContractModels.ts",
  "integrationObservabilityCapabilityModels.ts",
  "integrationObservabilityMetricModels.ts",
  "integrationObservabilityEventModels.ts",
  "integrationObservabilityLifecycleModels.ts",
  "integrationObservabilityModel.test.ts",
]);

const REQUIRED_MODEL_EXPORTS = Object.freeze([
  "IntegrationObservabilityModelIdentity",
  "IntegrationObservabilityModel",
  "IntegrationObservabilityDomainModels",
  "IntegrationObservabilityContractModels",
  "IntegrationObservabilityCapabilityModels",
  "IntegrationObservabilityMetricModels",
  "IntegrationObservabilityEventModels",
  "IntegrationObservabilityLifecycleModels",
  "IntegrationObservabilityModelInventory",
  "IntegrationObservabilityModelReadiness",
  "IntegrationObservabilityRelationshipModels",
] as const);

const EXPECTED_DOMAIN_KEYS = Object.freeze([
  "MetricsModel",
  "EventsModel",
  "LogsModel",
  "TracesModel",
  "HealthModel",
  "DiagnosticsModel",
  "AlertsModel",
  "VisibilityModel",
  "StatusModel",
  "PoliciesModel",
] as const);

const EXPECTED_CONTRACT_KEYS = Object.freeze([
  "ObservabilityContractModel",
  "MetricsContractModel",
  "LoggingContractModel",
  "TracingContractModel",
  "HealthMonitoringContractModel",
  "AlertContractModel",
  "DiagnosticsContractModel",
  "VisibilityContractModel",
  "MonitoringPolicyContractModel",
  "IntegrationStatusContractModel",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationObservability(Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\/integrationObservabilityFoundation\.ts["']/,
  /from ["']\.\/integrationObservability(Domain|Contract|Capability|Metric|Event|Lifecycle)Registry\.ts["']/,
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

describe("EIL-6:3 Integration Observability Model", () => {
  it("creates exactly eight Model files", () => {
    assert.equal(EIL63_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL63_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Model status, and ReadyForValidation", () => {
    assert.equal(IntegrationObservabilityModelIdentity.phaseId, "EIL-6:3");
    assert.equal(
      IntegrationObservabilityModelIdentity.canonicalId,
      "EIL-6:3/IntegrationObservabilityModel",
    );
    assert.equal(
      IntegrationObservabilityModelIdentity.name,
      "Integration Observability Model",
    );
    assert.equal(IntegrationObservabilityModelIdentity.version, "1.0.0");
    assert.equal(
      IntegrationObservabilityModelIdentity.namespace,
      "nexora.eil.integration-observability.model",
    );
    assert.equal(IntegrationObservabilityModelIdentity.status, "Model");
    assert.equal(
      IntegrationObservabilityModelIdentity.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      IntegrationObservabilityModelReadiness,
      "ReadyForValidation",
    );
    assert.equal(IntegrationObservabilityModel.readiness, "ReadyForValidation");
    assert.equal(
      IntegrationObservabilityModelIdentity.registryDependency,
      IntegrationObservabilityRegistryCanonicalId,
    );
  });

  it("consumes Registry aggregate as the sole upstream dependency", () => {
    assert.equal(IntegrationObservabilityModel.dependency.registryOnly, true);
    assert.equal(
      IntegrationObservabilityModel.dependency.upstreamCanonicalId,
      IntegrationObservabilityRegistryCanonicalId,
    );
    assert.equal(
      IntegrationObservabilityModel.registry,
      IntegrationObservabilityRegistry,
    );
    assert.equal(
      IntegrationObservabilityModel.dependency.foundationDirectImport,
      false,
    );
    assert.equal(
      IntegrationObservabilityModel.dependency.laterEil6PhaseImport,
      false,
    );
  });

  it("publishes exactly 55 canonical model instances with deterministic inventory", () => {
    assert.equal(IntegrationObservabilityDomainModels.length, 10);
    assert.equal(IntegrationObservabilityContractModels.length, 10);
    assert.equal(IntegrationObservabilityCapabilityModels.length, 10);
    assert.equal(IntegrationObservabilityMetricModels.length, 8);
    assert.equal(IntegrationObservabilityEventModels.length, 8);
    assert.equal(IntegrationObservabilityLifecycleModels.length, 9);

    const derived =
      IntegrationObservabilityDomainModels.length +
      IntegrationObservabilityContractModels.length +
      IntegrationObservabilityCapabilityModels.length +
      IntegrationObservabilityMetricModels.length +
      IntegrationObservabilityEventModels.length +
      IntegrationObservabilityLifecycleModels.length;

    assert.equal(derived, 55);
    assert.equal(
      IntegrationObservabilityModelInventory.totalModelInstanceCount,
      derived,
    );
    assert.equal(
      IntegrationObservabilityModelInventory.countsDerivedFromCollections,
      true,
    );
    assert.equal(IntegrationObservabilityRelationshipModels.length, 10);
    assert.deepEqual(
      [...IntegrationObservabilityRelationshipTypes],
      IntegrationObservabilityRelationshipModels.map(
        (item) => item.relationshipType,
      ),
    );
  });

  it("preserves Registry order, uniqueness, and source references", () => {
    assert.deepEqual(
      IntegrationObservabilityDomainModels.map((item) => item.canonicalKey),
      [...EXPECTED_DOMAIN_KEYS],
    );
    assert.deepEqual(
      IntegrationObservabilityContractModels.map((item) => item.canonicalKey),
      [...EXPECTED_CONTRACT_KEYS],
    );
    assert.deepEqual(
      IntegrationObservabilityLifecycleModels.map((item) => item.canonicalKey),
      IntegrationObservabilityRegistry.lifecycle.map((item) => item.key),
    );
    assert.deepEqual(
      IntegrationObservabilityMetricModels.map((item) => item.canonicalKey),
      IntegrationObservabilityRegistry.metricCategories.map((item) => item.key),
    );
    assert.deepEqual(
      IntegrationObservabilityEventModels.map((item) => item.canonicalKey),
      IntegrationObservabilityRegistry.eventCategories.map((item) => item.key),
    );
    assert.deepEqual(
      IntegrationObservabilityCapabilityModels.map((item) => item.canonicalKey),
      IntegrationObservabilityRegistry.capabilities.map((item) => item.key),
    );

    const collections = Object.freeze([
      IntegrationObservabilityDomainModels,
      IntegrationObservabilityContractModels,
      IntegrationObservabilityCapabilityModels,
      IntegrationObservabilityMetricModels,
      IntegrationObservabilityEventModels,
      IntegrationObservabilityLifecycleModels,
    ]);

    const allIds = collections.flatMap((collection) =>
      collection.map((item) => item.modelId),
    );
    assertUnique(allIds, "model IDs");

    for (const collection of collections) {
      assertUnique(
        collection.map((item) => item.canonicalKey),
        `${collection[0]?.category ?? "model"} keys`,
      );
      assertSequentialOrders(
        collection.map((item) => item.order),
        `${collection[0]?.category ?? "model"}`,
      );
      assert.ok(
        collection.every(
          (item) =>
            item.status === "Modeled" &&
            item.sourceRegistryId.startsWith("EIL-6:2/") &&
            item.sourceReference.includes(
              IntegrationObservabilityRegistryCanonicalId,
            ),
        ),
      );
    }
  });

  it("exposes an immutable aggregate Model and package Model surface", () => {
    assert.equal(Object.isFrozen(IntegrationObservabilityModel), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityDomainModels), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityContractModels), true);
    assert.equal(
      Object.isFrozen(IntegrationObservabilityCapabilityModels),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationObservabilityMetricModels), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityEventModels), true);
    assert.equal(
      Object.isFrozen(IntegrationObservabilityLifecycleModels),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityRelationshipModels),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationObservabilityModelInventory), true);

    assert.equal(
      IntegrationObservabilityModel.domains,
      IntegrationObservabilityDomainModels,
    );
    assert.equal(
      IntegrationObservabilityModel.contracts,
      IntegrationObservabilityContractModels,
    );
    assert.equal(
      IntegrationObservabilityModel.capabilities,
      IntegrationObservabilityCapabilityModels,
    );
    assert.equal(
      IntegrationObservabilityModel.metrics,
      IntegrationObservabilityMetricModels,
    );
    assert.equal(
      IntegrationObservabilityModel.events,
      IntegrationObservabilityEventModels,
    );
    assert.equal(
      IntegrationObservabilityModel.lifecycle,
      IntegrationObservabilityLifecycleModels,
    );

    for (const exportName of REQUIRED_MODEL_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime observability behavior", () => {
    const model = IntegrationObservabilityModel;
    assert.equal(model.metadataOnly, true);
    assert.equal(model.runtimeBehavior, false);
    assert.equal(model.monitoringEngine, false);
    assert.equal(model.telemetryPipeline, false);
    assert.equal(model.openTelemetry, false);
    assert.equal(model.prometheus, false);
    assert.equal(model.grafana, false);
    assert.equal(model.loggingFramework, false);
    assert.equal(model.tracingRuntime, false);
    assert.equal(model.metricsCollector, false);
    assert.equal(model.metricComputation, false);
    assert.equal(model.alertEngine, false);
    assert.equal(model.dashboard, false);
    assert.equal(model.healthCheckRuntime, false);
    assert.equal(model.eventEmission, false);
    assert.equal(model.networkingBehavior, false);
    assert.equal(model.persistenceBehavior, false);
    assert.equal(model.stateMutation, false);
    assert.equal(model.importsLaterEil6Phases, false);
    assert.ok(
      IntegrationObservabilityRelationshipModels.every(
        (item) => item.resolvesRuntime === false,
      ),
    );
  });

  it("has zero prohibited imports across model sources", () => {
    const sources = EIL63_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/integrationObservabilityRegistry\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for model sources", () => {
    const sources = EIL63_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationObservability/integrationObservabilityRegistry.ts",
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
