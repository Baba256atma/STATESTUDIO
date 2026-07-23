/**
 * EIL-6:2 — Integration Observability Registry Tests.
 *
 * Deterministic architectural coverage for the immutable Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as PackageModule from "./index.ts";
import {
  IntegrationObservabilityFoundationId,
  IntegrationObservabilityFoundationPlatform,
} from "./integrationObservabilityFoundation.ts";
import {
  IntegrationObservabilityCapabilityRegistry,
  IntegrationObservabilityContractRegistry,
  IntegrationObservabilityDomainRegistry,
  IntegrationObservabilityEventRegistry,
  IntegrationObservabilityLifecycleRegistry,
  IntegrationObservabilityMetricRegistry,
  IntegrationObservabilityRegistry,
  IntegrationObservabilityRegistryIdentity,
  IntegrationObservabilityRegistryInventory,
  IntegrationObservabilityRegistryReadiness,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");
const EIL_ROOT = join(HERE, "..");

const EIL62_FILES = Object.freeze([
  "integrationObservabilityRegistry.ts",
  "integrationObservabilityDomainRegistry.ts",
  "integrationObservabilityContractRegistry.ts",
  "integrationObservabilityCapabilityRegistry.ts",
  "integrationObservabilityMetricRegistry.ts",
  "integrationObservabilityEventRegistry.ts",
  "integrationObservabilityLifecycleRegistry.ts",
  "integrationObservabilityRegistry.test.ts",
]);

const REQUIRED_REGISTRY_EXPORTS = Object.freeze([
  "IntegrationObservabilityRegistryIdentity",
  "IntegrationObservabilityRegistry",
  "IntegrationObservabilityDomainRegistry",
  "IntegrationObservabilityContractRegistry",
  "IntegrationObservabilityCapabilityRegistry",
  "IntegrationObservabilityMetricRegistry",
  "IntegrationObservabilityEventRegistry",
  "IntegrationObservabilityLifecycleRegistry",
  "IntegrationObservabilityRegistryInventory",
  "IntegrationObservabilityRegistryReadiness",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationObservability(Model|Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\.\/integration(?!Observability)/,
  /from ["']\.\.\/integrationPolicyGovernance/,
  /from ["']\.\.\/integrationOrchestration/,
  /from ["']\.\.\/integrationRouting/,
  /from ["']\.\.\/integrationConnector/,
  /from ["']@opentelemetry\//,
  /from ["']prom-client["']/,
  /from ["']datadog/,
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

describe("EIL-6:2 Integration Observability Registry", () => {
  it("creates exactly eight Registry files", () => {
    assert.equal(EIL62_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL62_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(present.includes("index.ts"), true);
    assert.equal(existsSync(join(EIL_ROOT, "index.ts")), false);
  });

  it("has canonical identity, namespace, version, Registry status, and ReadyForModel", () => {
    assert.equal(IntegrationObservabilityRegistryIdentity.phaseId, "EIL-6:2");
    assert.equal(
      IntegrationObservabilityRegistryIdentity.canonicalId,
      "EIL-6:2/IntegrationObservabilityRegistry",
    );
    assert.equal(
      IntegrationObservabilityRegistryIdentity.name,
      "Integration Observability Registry",
    );
    assert.equal(IntegrationObservabilityRegistryIdentity.version, "1.0.0");
    assert.equal(
      IntegrationObservabilityRegistryIdentity.namespace,
      "nexora.eil.integration-observability.registry",
    );
    assert.equal(IntegrationObservabilityRegistryIdentity.layer, "EIL");
    assert.equal(IntegrationObservabilityRegistryIdentity.status, "Registry");
    assert.equal(
      IntegrationObservabilityRegistryIdentity.readiness,
      "ReadyForModel",
    );
    assert.equal(IntegrationObservabilityRegistryReadiness, "ReadyForModel");
    assert.equal(IntegrationObservabilityRegistry.readiness, "ReadyForModel");
    assert.equal(IntegrationObservabilityRegistry.status, "Registry");
    assert.equal(
      IntegrationObservabilityRegistryIdentity.upstreamPhase,
      "EIL-6:1",
    );
    assert.equal(
      IntegrationObservabilityRegistryIdentity.upstreamCanonicalId,
      "EIL-6:1/IntegrationObservabilityFoundation",
    );
  });

  it("consumes EIL-6:1 Foundation aggregate as the sole upstream dependency", () => {
    assert.equal(
      IntegrationObservabilityRegistry.dependency.foundationOnly,
      true,
    );
    assert.equal(
      IntegrationObservabilityRegistry.dependency.upstreamCanonicalId,
      IntegrationObservabilityFoundationId,
    );
    assert.equal(
      IntegrationObservabilityRegistry.foundation,
      IntegrationObservabilityFoundationPlatform,
    );
    assert.equal(
      IntegrationObservabilityRegistry.dependency.laterEil6PhaseImport,
      false,
    );
    assert.equal(
      IntegrationObservabilityRegistry.dependency.previousEilPlatformDependency,
      false,
    );
  });

  it("registers exact Foundation collection counts totaling 55", () => {
    assert.equal(IntegrationObservabilityDomainRegistry.length, 10);
    assert.equal(IntegrationObservabilityContractRegistry.length, 10);
    assert.equal(IntegrationObservabilityCapabilityRegistry.length, 10);
    assert.equal(IntegrationObservabilityMetricRegistry.length, 8);
    assert.equal(IntegrationObservabilityEventRegistry.length, 8);
    assert.equal(IntegrationObservabilityLifecycleRegistry.length, 9);

    const derivedTotal =
      IntegrationObservabilityDomainRegistry.length +
      IntegrationObservabilityContractRegistry.length +
      IntegrationObservabilityCapabilityRegistry.length +
      IntegrationObservabilityMetricRegistry.length +
      IntegrationObservabilityEventRegistry.length +
      IntegrationObservabilityLifecycleRegistry.length;

    assert.equal(derivedTotal, 55);
    assert.equal(
      IntegrationObservabilityRegistryInventory.totalRegistryRecordCount,
      derivedTotal,
    );
    assert.equal(
      IntegrationObservabilityRegistryInventory.countsDerivedFromCollections,
      true,
    );
    assert.equal(IntegrationObservabilityRegistryInventory.domainCount, 10);
    assert.equal(IntegrationObservabilityRegistryInventory.contractCount, 10);
    assert.equal(IntegrationObservabilityRegistryInventory.capabilityCount, 10);
    assert.equal(
      IntegrationObservabilityRegistryInventory.metricCategoryCount,
      8,
    );
    assert.equal(
      IntegrationObservabilityRegistryInventory.eventCategoryCount,
      8,
    );
    assert.equal(IntegrationObservabilityRegistryInventory.lifecycleCount, 9);
  });

  it("preserves uniqueness, sequential order, and Foundation references", () => {
    const collections = Object.freeze([
      IntegrationObservabilityDomainRegistry,
      IntegrationObservabilityContractRegistry,
      IntegrationObservabilityCapabilityRegistry,
      IntegrationObservabilityMetricRegistry,
      IntegrationObservabilityEventRegistry,
      IntegrationObservabilityLifecycleRegistry,
    ]);

    const allIds = collections.flatMap((collection) =>
      collection.map((item) => item.id),
    );
    assertUnique(allIds, "canonical IDs");

    for (const collection of collections) {
      assertUnique(
        collection.map((item) => item.key),
        `${collection[0]?.category ?? "registry"} keys`,
      );
      assertSequentialOrders(
        collection.map((item) => item.order),
        `${collection[0]?.category ?? "registry"}`,
      );
      assert.ok(
        collection.every(
          (item) =>
            item.sourcePhase === "EIL-6:1" &&
            item.status === "Registered" &&
            item.sourceCanonicalId.length > 0 &&
            item.sourceReference.includes("EIL-6:1"),
        ),
      );
    }

    assert.deepEqual(
      IntegrationObservabilityLifecycleRegistry.map((item) => item.key),
      [...IntegrationObservabilityFoundationPlatform.lifecycle.states],
    );
    assert.deepEqual(
      IntegrationObservabilityDomainRegistry.map((item) => item.key),
      IntegrationObservabilityFoundationPlatform.domains.map(
        (item) => item.domainKey,
      ),
    );
    assert.deepEqual(
      IntegrationObservabilityContractRegistry.map((item) => item.key),
      IntegrationObservabilityFoundationPlatform.contracts.map(
        (item) => item.contractName,
      ),
    );
    assert.deepEqual(
      IntegrationObservabilityCapabilityRegistry.map((item) => item.key),
      IntegrationObservabilityFoundationPlatform.capabilityDeclarations.map(
        (item) => item.capabilityKey,
      ),
    );
    assert.deepEqual(
      IntegrationObservabilityMetricRegistry.map((item) => item.key),
      IntegrationObservabilityFoundationPlatform.metricCategories.map(
        (item) => item.categoryKey,
      ),
    );
    assert.deepEqual(
      IntegrationObservabilityEventRegistry.map((item) => item.key),
      IntegrationObservabilityFoundationPlatform.eventCategories.map(
        (item) => item.categoryKey,
      ),
    );
  });

  it("exposes an immutable aggregate Registry and package Registry surface", () => {
    assert.equal(Object.isFrozen(IntegrationObservabilityRegistry), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityDomainRegistry), true);
    assert.equal(
      Object.isFrozen(IntegrationObservabilityContractRegistry),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityCapabilityRegistry),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationObservabilityMetricRegistry), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityEventRegistry), true);
    assert.equal(
      Object.isFrozen(IntegrationObservabilityLifecycleRegistry),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityRegistryInventory),
      true,
    );

    assert.equal(
      IntegrationObservabilityRegistry.domains,
      IntegrationObservabilityDomainRegistry,
    );
    assert.equal(
      IntegrationObservabilityRegistry.contracts,
      IntegrationObservabilityContractRegistry,
    );
    assert.equal(
      IntegrationObservabilityRegistry.capabilities,
      IntegrationObservabilityCapabilityRegistry,
    );
    assert.equal(
      IntegrationObservabilityRegistry.metricCategories,
      IntegrationObservabilityMetricRegistry,
    );
    assert.equal(
      IntegrationObservabilityRegistry.eventCategories,
      IntegrationObservabilityEventRegistry,
    );
    assert.equal(
      IntegrationObservabilityRegistry.lifecycle,
      IntegrationObservabilityLifecycleRegistry,
    );

    for (const exportName of REQUIRED_REGISTRY_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
    assert.ok("IntegrationObservabilityFoundationPlatform" in PackageModule);
  });

  it("is metadata-only with zero runtime observability behavior", () => {
    const registry = IntegrationObservabilityRegistry;
    assert.equal(registry.metadataOnly, true);
    assert.equal(registry.runtimeBehavior, false);
    assert.equal(registry.monitoringEngine, false);
    assert.equal(registry.telemetryPipeline, false);
    assert.equal(registry.openTelemetry, false);
    assert.equal(registry.prometheus, false);
    assert.equal(registry.grafana, false);
    assert.equal(registry.loggingFramework, false);
    assert.equal(registry.tracingRuntime, false);
    assert.equal(registry.metricsCollector, false);
    assert.equal(registry.alertEngine, false);
    assert.equal(registry.dashboard, false);
    assert.equal(registry.healthCheckRuntime, false);
    assert.equal(registry.eventEmission, false);
    assert.equal(registry.networkingBehavior, false);
    assert.equal(registry.persistenceBehavior, false);
    assert.equal(registry.serviceBehavior, false);
    assert.equal(registry.stateMutation, false);
    assert.equal(registry.importsLaterEil6Phases, false);
  });

  it("has zero prohibited imports across registry sources", () => {
    const sources = EIL62_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/integrationObservabilityFoundation\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for registry sources", () => {
    const sources = EIL62_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationObservability/integrationObservabilityFoundation.ts",
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
